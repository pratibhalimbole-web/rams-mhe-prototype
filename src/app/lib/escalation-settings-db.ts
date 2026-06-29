import { supabase } from "../supabase-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Level = "L1" | "L2" | "L3" | "L4";

export interface SLARule {
  level: Level;
  role: string;
  slaHours: number;
  onBreach: "escalate" | "reassign" | "both";
  reassignAfterHours: number;
  maxReassigns: number;
}

export interface LevelContact {
  id: string;
  level: Level;
  name: string;
  email: string;
  phone: string;
  displayOrder: number;
}

export interface EscalationSettings {
  slaRules: SLARule[];
  contacts: LevelContact[];
  criticalBreachDays: number;
  autoCloseDays: number;
}

// ─── Defaults (used if DB fetch fails) ───────────────────────────────────────

export const DEFAULT_SETTINGS: EscalationSettings = {
  slaRules: [
    { level: "L1", role: "Operator / Technician", slaHours: 2,  onBreach: "escalate", reassignAfterHours: 24,  maxReassigns: 1 },
    { level: "L2", role: "Supervisor",            slaHours: 4,  onBreach: "escalate", reassignAfterHours: 48,  maxReassigns: 2 },
    { level: "L3", role: "Operations Manager",    slaHours: 8,  onBreach: "both",     reassignAfterHours: 72,  maxReassigns: 1 },
    { level: "L4", role: "Director",              slaHours: 24, onBreach: "both",     reassignAfterHours: 168, maxReassigns: 1 },
  ],
  contacts: [
    { id: "c1", level: "L1", name: "Safety Team",       email: "safety-l1@warehouse.com",   phone: "+91-98765-00001", displayOrder: 0 },
    { id: "c2", level: "L1", name: "Maintenance Desk",  email: "maint-l1@warehouse.com",    phone: "",                displayOrder: 1 },
    { id: "c3", level: "L2", name: "Shift Supervisors", email: "supervisors@warehouse.com", phone: "+91-98765-00002", displayOrder: 0 },
    { id: "c4", level: "L3", name: "Ops Management",    email: "ops-mgmt@warehouse.com",    phone: "+91-98765-00003", displayOrder: 0 },
    { id: "c5", level: "L4", name: "Fleet Director",    email: "director@warehouse.com",    phone: "+91-98765-00004", displayOrder: 0 },
    { id: "c6", level: "L4", name: "CEO Office (CC)",   email: "ceo-office@warehouse.com",  phone: "",                displayOrder: 1 },
  ],
  criticalBreachDays: 3,
  autoCloseDays: 7,
};

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchEscalationSettings(): Promise<EscalationSettings> {
  const [rulesRes, contactsRes, globalRes] = await Promise.all([
    supabase.from("escalation_sla_rules").select("*").order("level"),
    supabase.from("escalation_contacts").select("*").order("level").order("display_order"),
    supabase.from("escalation_global_settings").select("*"),
  ]);

  if (rulesRes.error || contactsRes.error || globalRes.error) {
    return DEFAULT_SETTINGS;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slaRules: SLARule[] = (rulesRes.data ?? []).map((r: any) => ({
    level:               r.level as Level,
    role:                r.role,
    slaHours:            r.sla_hours,
    onBreach:            r.on_breach as SLARule["onBreach"],
    reassignAfterHours:  r.reassign_after_hours,
    maxReassigns:        r.max_reassigns,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contacts: LevelContact[] = (contactsRes.data ?? []).map((c: any) => ({
    id:           c.id,
    level:        c.level as Level,
    name:         c.name,
    email:        c.email ?? "",
    phone:        c.phone ?? "",
    displayOrder: c.display_order ?? 0,
  }));

  const globalMap: Record<string, string> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalRes.data ?? []).forEach((g: any) => { globalMap[g.key] = g.value; });

  return {
    slaRules: slaRules.length ? slaRules : DEFAULT_SETTINGS.slaRules,
    contacts: contacts.length ? contacts : DEFAULT_SETTINGS.contacts,
    criticalBreachDays: Number(globalMap["critical_breach_days"] ?? 3),
    autoCloseDays:      Number(globalMap["auto_close_days"]      ?? 7),
  };
}

// ─── Save SLA Rules ───────────────────────────────────────────────────────────

export async function saveSLARules(rules: SLARule[]): Promise<void> {
  const rows = rules.map(r => ({
    level:                r.level,
    role:                 r.role,
    sla_hours:            r.slaHours,
    on_breach:            r.onBreach,
    reassign_after_hours: r.reassignAfterHours,
    max_reassigns:        r.maxReassigns,
    updated_at:           new Date().toISOString(),
  }));
  const { error } = await supabase
    .from("escalation_sla_rules")
    .upsert(rows, { onConflict: "level" });
  if (error) throw error;
}

// ─── Save Contacts (replace all for a level) ─────────────────────────────────

export async function saveContactsForLevel(level: Level, contacts: Omit<LevelContact, "id">[]): Promise<void> {
  // Delete existing contacts for this level
  await supabase.from("escalation_contacts").delete().eq("level", level);
  if (!contacts.length) return;

  const rows = contacts.map((c, i) => ({
    level:         c.level,
    name:          c.name,
    email:         c.email,
    phone:         c.phone ?? "",
    display_order: i,
  }));
  const { error } = await supabase.from("escalation_contacts").insert(rows);
  if (error) throw error;
}

// ─── Save Global Settings ─────────────────────────────────────────────────────

export async function saveGlobalSettings(criticalBreachDays: number, autoCloseDays: number): Promise<void> {
  const { error } = await supabase.from("escalation_global_settings").upsert([
    { key: "critical_breach_days", value: String(criticalBreachDays) },
    { key: "auto_close_days",      value: String(autoCloseDays) },
  ], { onConflict: "key" });
  if (error) throw error;
}

// ─── Realtime subscription ───────────────────────────────────────────────────
// Use a counter so each subscriber gets its own unique channel name

let _settingsSubCounter = 0;

export function subscribeToSettings(onUpdate: () => void) {
  const name = `escalation-settings-changes-${++_settingsSubCounter}`;
  const channel = supabase
    .channel(name)
    .on("postgres_changes", { event: "*", schema: "public", table: "escalation_sla_rules" }, onUpdate)
    .on("postgres_changes", { event: "*", schema: "public", table: "escalation_contacts" }, onUpdate)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
