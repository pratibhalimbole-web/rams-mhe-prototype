import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSidebar } from "../../components/layout/SidebarLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Mail,

  Bell,
  Users,
  Settings2,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Zap,
  Shield,
  FileText,
  Send,
  Eye,
  Plus,
  Trash2,
  PlugZap,
  Timer,
  RefreshCw,
  Info,
} from "lucide-react";
import { cn } from "../../components/ui/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = "email" | "in_app" | "sms";
type Level   = "L1" | "L2" | "L3" | "L4";

interface NotificationRule {
  id: string;
  event: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  channels: Record<Channel, boolean>;
  notifyChain: boolean;
}

interface LevelContact {
  level: Level;
  role: string;
  color: string;
  contacts: { name: string; email: string; phone?: string }[];
}

// ─── Default State ─────────────────────────────────────────────────────────────

const DEFAULT_RULES: NotificationRule[] = [
  {
    id: "assigned",
    event: "Issue Assigned / Reassigned",
    description: "Fires when an escalation is first assigned or reassigned to a new person",
    icon: Users,
    iconColor: "#3b82f6",
    channels: { email: true, in_app: true, sms: false },
    notifyChain: false,
  },
  {
    id: "acknowledged",
    event: "Issue Acknowledged",
    description: "Assignee has acknowledged the escalation within the SLA window",
    icon: CheckCircle2,
    iconColor: "#22c55e",
    channels: { email: false, in_app: true, sms: false },
    notifyChain: false,
  },
  {
    id: "sla_50",
    event: "SLA at 50% consumed",
    description: "Half the resolve window has elapsed with no resolution",
    icon: Clock,
    iconColor: "#3b82f6",
    channels: { email: false, in_app: true, sms: false },
    notifyChain: false,
  },
  {
    id: "sla_25",
    event: "SLA at 75% consumed (25% left)",
    description: "Only 25% of the resolve window remains — urgent reminder",
    icon: Clock,
    iconColor: "#f59e0b",
    channels: { email: true, in_app: true, sms: false },
    notifyChain: true,
  },
  {
    id: "sla_breach",
    event: "SLA Breached — Auto-escalate",
    description: "SLA window expired. Issue auto-escalates to next level with urgent email",
    icon: AlertTriangle,
    iconColor: "#ef4444",
    channels: { email: true, in_app: true, sms: true },
    notifyChain: true,
  },
  {
    id: "comment",
    event: "Comment / Note Added",
    description: "A team member has added a note or update to the escalation",
    icon: FileText,
    iconColor: "#8b5cf6",
    channels: { email: false, in_app: true, sms: false },
    notifyChain: false,
  },
  {
    id: "resolved",
    event: "Issue Resolved",
    description: "Escalation has been marked resolved — notifies full history chain",
    icon: CheckCircle2,
    iconColor: "#22c55e",
    channels: { email: true, in_app: true, sms: false },
    notifyChain: true,
  },
  {
    id: "critical_breach",
    event: "Critical Breach Flagged",
    description: "Director-level escalation flagged as critical breach — all-hands alert",
    icon: Zap,
    iconColor: "#ef4444",
    channels: { email: true, in_app: true, sms: true },
    notifyChain: true,
  },
];

const DEFAULT_CONTACTS: LevelContact[] = [
  {
    level: "L1",
    role: "Operator / Technician",
    color: "#64748b",
    contacts: [
      { name: "Safety Team", email: "safety-l1@warehouse.com", phone: "+91-98765-00001" },
      { name: "Maintenance Desk", email: "maint-l1@warehouse.com" },
    ],
  },
  {
    level: "L2",
    role: "Supervisor",
    color: "#3b82f6",
    contacts: [
      { name: "Shift Supervisors", email: "supervisors@warehouse.com", phone: "+91-98765-00002" },
    ],
  },
  {
    level: "L3",
    role: "Operations Manager",
    color: "#f59e0b",
    contacts: [
      { name: "Ops Management", email: "ops-mgmt@warehouse.com", phone: "+91-98765-00003" },
    ],
  },
  {
    level: "L4",
    role: "Director",
    color: "#ef4444",
    contacts: [
      { name: "Fleet Director", email: "director@warehouse.com", phone: "+91-98765-00004" },
      { name: "CEO Office (CC)", email: "ceo-office@warehouse.com" },
    ],
  },
];

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "sla",       label: "SLA & Routing",        icon: Timer     },
  { id: "rules",     label: "Notification Rules",   icon: Bell      },
  { id: "contacts",  label: "Level Contacts",        icon: Users     },
  { id: "email",     label: "Email Setup",           icon: Mail      },
  { id: "templates", label: "Email Templates",       icon: FileCode2 },
];

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 items-center rounded-full shrink-0 transition-colors"
      style={{ background: checked ? "var(--primary)" : "var(--muted)" }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow-sm"
        style={{ transform: checked ? "translateX(18px)" : "translateX(3px)" }}
      />
    </button>
  );
}

// ─── Channel Toggle Row ───────────────────────────────────────────────────────

const CHANNEL_META: Record<Channel, { label: string; icon: React.ElementType; color: string }> = {
  email:  { label: "Email",   icon: Mail,    color: "#3b82f6" },
  in_app: { label: "In-App",  icon: Bell,    color: "#8b5cf6" },
  sms:    { label: "SMS",     icon: Send,    color: "#f59e0b" },
};

// ─── SLA & Routing Section ────────────────────────────────────────────────────

interface LevelSLARule {
  level: Level;
  role: string;
  color: string;
  slaHours: number;               // resolve window
  onBreach: "escalate" | "reassign" | "both";
  reassignAfterHours: number;     // how many hours overdue before reassigning within level
  maxReassigns: number;           // max reassigns before auto-escalating
}

const DEFAULT_SLA_RULES: LevelSLARule[] = [
  { level: "L1", role: "Operator / Technician", color: "#64748b", slaHours: 2,  onBreach: "escalate", reassignAfterHours: 24,  maxReassigns: 1 },
  { level: "L2", role: "Supervisor",            color: "#3b82f6", slaHours: 4,  onBreach: "escalate", reassignAfterHours: 48,  maxReassigns: 2 },
  { level: "L3", role: "Operations Manager",    color: "#f59e0b", slaHours: 8,  onBreach: "both",     reassignAfterHours: 72,  maxReassigns: 1 },
  { level: "L4", role: "Director",              color: "#ef4444", slaHours: 24, onBreach: "both",     reassignAfterHours: 168, maxReassigns: 1 },
];

function SLARoutingSection() {
  const [rules, setRules] = useState<LevelSLARule[]>(DEFAULT_SLA_RULES);
  const [criticalBreachDays, setCriticalBreachDays] = useState(3);
  const [autoCloseDays, setAutoCloseDays] = useState(7);
  const [saved, setSaved] = useState(false);

  function patch(level: Level, update: Partial<LevelSLARule>) {
    setRules(prev => prev.map(r => r.level === level ? { ...r, ...update } : r));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-1">
        <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>SLA & Routing Rules</h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Configure the SLA window for each escalation level, what happens when it's breached, and when overdue issues get reassigned.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: "#3b82f60C", border: "1px solid #3b82f625" }}>
        <Info size={14} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "#3b82f6" }} />
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          <strong style={{ color: "var(--foreground)" }}>How it works:</strong> When an assignee misses their SLA window, the system checks the "On Breach" rule.
          If <em>Escalate</em>, it moves to the next level immediately. If <em>Reassign</em>, it re-routes to another person at the same level first.
          If <em>Both</em>, it reassigns and then escalates if the reassigned person also misses the window.
        </p>
      </div>

      {/* Per-level SLA rules */}
      <div className="flex flex-col gap-3">
        {rules.map(rule => (
          <div key={rule.level} className="rounded-xl border border-border overflow-hidden"
            style={{ background: "var(--card)" }}>

            {/* Level header */}
            <div className="flex items-center gap-3 px-4 py-3"
              style={{ background: "var(--muted)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0"
                style={{ background: "var(--muted)", color: "#fff" }}>
                {rule.level}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                  {rule.level} — {rule.role}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  Current window: <strong>{rule.slaHours}h</strong>
                  {" · "}Reassign after: <strong>
                    {rule.reassignAfterHours >= 24
                      ? `${rule.reassignAfterHours / 24}d`
                      : `${rule.reassignAfterHours}h`}
                  </strong> overdue
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="px-4 py-4 grid grid-cols-4 gap-4 items-end">

              {/* SLA window */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}>
                  SLA Window (hours)
                </label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number" min={1} max={168}
                    value={rule.slaHours}
                    onChange={e => patch(rule.level, { slaHours: Math.max(1, Number(e.target.value)) })}
                    className="h-8 text-xs w-full"
                  />
                  <span className="text-[11px] shrink-0" style={{ color: "var(--muted-foreground)" }}>h</span>
                </div>
              </div>

              {/* Reassign after overdue */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}>
                  Reassign After Overdue
                </label>
                <div className="flex gap-1.5">
                  <Select
                    value={String(rule.reassignAfterHours)}
                    onValueChange={v => patch(rule.level, { reassignAfterHours: Number(v) })}>
                    <SelectTrigger className="h-8 text-xs flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">1 day</SelectItem>
                      <SelectItem value="48">2 days</SelectItem>
                      <SelectItem value="72">3 days</SelectItem>
                      <SelectItem value="120">5 days</SelectItem>
                      <SelectItem value="168">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Max reassigns before escalating */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}>
                  Max Reassigns
                </label>
                <Select
                  value={String(rule.maxReassigns)}
                  onValueChange={v => patch(rule.level, { maxReassigns: Number(v) })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 attempt</SelectItem>
                    <SelectItem value="2">2 attempts</SelectItem>
                    <SelectItem value="3">3 attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* On breach action */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}>
                  On SLA Breach
                </label>
                <div className="flex gap-1">
                  {(["escalate", "reassign", "both"] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => patch(rule.level, { onBreach: opt })}
                      className="flex-1 py-1.5 rounded-md text-[10px] font-bold capitalize transition-all"
                      style={{
                        background: rule.onBreach === opt ? "var(--foreground)" : "var(--muted)",
                        color: rule.onBreach === opt ? "var(--background)" : "var(--muted-foreground)",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Explanation row */}
            <div className="px-4 pb-3 flex items-center gap-2">
              <RefreshCw size={11} strokeWidth={1.5} style={{ color: rule.color }} />
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                {rule.onBreach === "escalate" &&
                  `When SLA expires → immediately escalate to next level. No reassign attempted.`}
                {rule.onBreach === "reassign" &&
                  `When SLA expires → reassign to another ${rule.role} (up to ${rule.maxReassigns}×). Escalate only if all reassigns also miss SLA.`}
                {rule.onBreach === "both" &&
                  `When SLA expires → reassign first (${rule.maxReassigns}× max). If still unresolved after ${rule.reassignAfterHours >= 24 ? `${rule.reassignAfterHours / 24}d` : `${rule.reassignAfterHours}h`}, escalate to next level.`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Global rules */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Global Rules</p>

        <div className="rounded-xl border border-border p-4 grid grid-cols-2 gap-6"
          style={{ background: "var(--card)" }}>

          {/* Critical breach days */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}>
              Flag as Critical Breach after
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number" min={1} max={30}
                value={criticalBreachDays}
                onChange={e => setCriticalBreachDays(Math.max(1, Number(e.target.value)))}
                className="h-8 text-xs w-24"
              />
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                days overdue (any level)
              </span>
            </div>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              Any issue overdue longer than this gets a Critical Breach flag and triggers an all-hands SMS alert.
            </p>
          </div>

          {/* Auto-close resolved */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}>
              Auto-archive Resolved Issues after
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number" min={1} max={90}
                value={autoCloseDays}
                onChange={e => setAutoCloseDays(Math.max(1, Number(e.target.value)))}
                className="h-8 text-xs w-24"
              />
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                days after resolution
              </span>
            </div>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              Resolved escalations move to the archive after this window. They remain searchable in history.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-1">
        <Button size="sm" className="h-8 text-xs px-5 gap-1.5" onClick={handleSave}>
          {saved
            ? <><CheckCircle2 size={12} strokeWidth={1.5} /> Saved</>
            : "Save SLA Rules"}
        </Button>
      </div>
    </div>
  );
}

// ─── Notification Rules Section ───────────────────────────────────────────────

function NotificationRulesSection() {
  const [rules, setRules] = useState<NotificationRule[]>(DEFAULT_RULES);

  function toggleChannel(ruleId: string, channel: Channel) {
    setRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, channels: { ...r.channels, [channel]: !r.channels[channel] } } : r
    ));
  }

  function toggleChain(ruleId: string) {
    setRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, notifyChain: !r.notifyChain } : r
    ));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1">
        <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Notification Rules</h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Control which events send notifications and through which channels. "Notify chain" CC's all previous assignees.
        </p>
      </div>

      {/* Channel legend */}
      <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg" style={{ background: "var(--muted)" }}>
        {(Object.entries(CHANNEL_META) as [Channel, typeof CHANNEL_META[Channel]][]).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <div key={key} className="flex items-center gap-1.5">
              <Icon size={12} strokeWidth={1.5} style={{ color: meta.color }} />
              <span className="text-[11px] font-medium" style={{ color: "var(--foreground)" }}>{meta.label}</span>
            </div>
          );
        })}
        <span className="ml-auto text-[11px]" style={{ color: "var(--muted-foreground)" }}>
          Notify chain = CC all previous assignees in history
        </span>
      </div>

      {/* Rules list */}
      <div className="flex flex-col gap-2">
        {rules.map(rule => {
          const Icon = rule.icon;
          return (
            <div key={rule.id} className="rounded-xl border border-border overflow-hidden"
              style={{ background: "var(--card)" }}>
              <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${rule.iconColor}15` }}>
                  <Icon size={14} strokeWidth={1.5} style={{ color: rule.iconColor }} />
                </div>

                {/* Label + description */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{rule.event}</p>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    {rule.description}
                  </p>
                </div>

                {/* Channel toggles */}
                <div className="flex items-center gap-5 shrink-0">
                  {(["email", "in_app", "sms"] as Channel[]).map(ch => {
                    const meta = CHANNEL_META[ch];
                    const CIcon = meta.icon;
                    return (
                      <div key={ch} className="flex flex-col items-center gap-1.5">
                        <CIcon size={12} strokeWidth={1.5}
                          style={{ color: rule.channels[ch] ? meta.color : "var(--muted-foreground)" }} />
                        <Toggle
                          checked={rule.channels[ch]}
                          onChange={() => toggleChannel(rule.id, ch)}
                        />
                      </div>
                    );
                  })}

                  <div className="w-px h-8 mx-1" style={{ background: "var(--border)" }} />

                  {/* Notify chain */}
                  <div className="flex flex-col items-center gap-1.5">
                    <Users size={12} strokeWidth={1.5}
                      style={{ color: rule.notifyChain ? "#f97316" : "var(--muted-foreground)" }} />
                    <Toggle checked={rule.notifyChain} onChange={() => toggleChain(rule.id)} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-2">
        <Button size="sm" className="h-8 text-xs px-5">Save Rules</Button>
      </div>
    </div>
  );
}

// ─── Level Contacts Section ───────────────────────────────────────────────────

function LevelContactsSection() {
  const [contacts, setContacts] = useState<LevelContact[]>(DEFAULT_CONTACTS);
  const [adding, setAdding] = useState<Level | null>(null);
  const [newName, setNewName]   = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  function addContact(level: Level) {
    if (!newEmail.trim()) return;
    setContacts(prev => prev.map(lc =>
      lc.level === level
        ? { ...lc, contacts: [...lc.contacts, { name: newName, email: newEmail, phone: newPhone || undefined }] }
        : lc
    ));
    setAdding(null); setNewName(""); setNewEmail(""); setNewPhone("");
  }

  function removeContact(level: Level, idx: number) {
    setContacts(prev => prev.map(lc =>
      lc.level === level
        ? { ...lc, contacts: lc.contacts.filter((_, i) => i !== idx) }
        : lc
    ));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1">
        <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Level Contacts</h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Email addresses and phone numbers for each escalation level. When an issue escalates, the system emails these contacts automatically.
        </p>
      </div>

      {contacts.map(lc => (
        <div key={lc.level} className="rounded-xl border border-border overflow-hidden"
          style={{ background: "var(--card)" }}>

          {/* Level header */}
          <div className="flex items-center gap-3 px-4 py-3"
            style={{ background: "var(--muted)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0"
              style={{ background: "var(--muted)", color: "#fff" }}>
              {lc.level}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                {lc.level} — {lc.role}
              </p>
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                {lc.contacts.length} contact{lc.contacts.length !== 1 ? "s" : ""} configured
              </p>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 px-2.5"
              onClick={() => setAdding(adding === lc.level ? null : lc.level)}>
              <Plus size={11} strokeWidth={1.5} />
              Add
            </Button>
          </div>

          {/* Contacts */}
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {lc.contacts.map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                  {c.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold" style={{ color: "var(--foreground)" }}>{c.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                      <Mail size={9} strokeWidth={1.5} /> {c.email}
                    </span>
                    {c.phone && (
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                        <Send size={9} strokeWidth={1.5} /> {c.phone}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => removeContact(lc.level, i)}
                  className="opacity-40 hover:opacity-100 transition-opacity p-1 rounded">
                  <Trash2 size={12} strokeWidth={1.5} style={{ color: "#ef4444" }} />
                </button>
              </div>
            ))}

            {/* Add form */}
            {adding === lc.level && (
              <div className="px-4 py-3 flex flex-col gap-2" style={{ background: "var(--muted)" }}>
                <div className="grid grid-cols-3 gap-2">
                  <Input value={newName}  onChange={e => setNewName(e.target.value)}
                    placeholder="Display name" className="h-7 text-xs" />
                  <Input value={newEmail} onChange={e => setNewEmail(e.target.value)}
                    placeholder="Email address *" className="h-7 text-xs col-span-1" />
                  <Input value={newPhone} onChange={e => setNewPhone(e.target.value)}
                    placeholder="Phone (SMS, optional)" className="h-7 text-xs" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs px-3" onClick={() => addContact(lc.level)}>
                    Add Contact
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs px-3"
                    onClick={() => { setAdding(null); setNewName(""); setNewEmail(""); setNewPhone(""); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-end mt-2">
        <Button size="sm" className="h-8 text-xs px-5">Save Contacts</Button>
      </div>
    </div>
  );
}

// ─── Email Setup Section ──────────────────────────────────────────────────────

function EmailSetupSection() {
  const [provider, setProvider] = useState("sendgrid");
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "ok" | "fail">("idle");

  function sendTest() {
    setTestStatus("sending");
    setTimeout(() => setTestStatus("ok"), 1800);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-1">
        <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Email Setup</h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Configure the email provider used to send escalation notifications. All event emails route through this connection.
        </p>
      </div>

      {/* Provider selector */}
      <div className="rounded-xl border border-border p-4 flex flex-col gap-4"
        style={{ background: "var(--card)" }}>
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Email Provider</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "sendgrid", label: "SendGrid",  color: "#1a82e2" },
              { id: "mailgun",  label: "Mailgun",   color: "#f06b33" },
              { id: "ses",      label: "AWS SES",   color: "#f90"    },
              { id: "smtp",     label: "SMTP",      color: "#64748b" },
            ].map(p => (
              <button key={p.id} onClick={() => setProvider(p.id)}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all"
                style={{
                  borderColor: provider === p.id ? p.color : "var(--border)",
                  background: provider === p.id ? `${p.color}10` : "var(--muted)",
                }}>
                <PlugZap size={18} strokeWidth={1.5} style={{ color: provider === p.id ? p.color : "var(--muted-foreground)" }} />
                <span className="text-[11px] font-bold" style={{ color: provider === p.id ? p.color : "var(--muted-foreground)" }}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Provider-specific fields */}
        {provider === "sendgrid" && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>SendGrid API Key</label>
              <Input placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxx" className="h-8 text-xs font-mono" type="password" />
            </div>
          </div>
        )}

        {provider === "mailgun" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>API Key</label>
              <Input placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxx" className="h-8 text-xs font-mono" type="password" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>Domain</label>
              <Input placeholder="mg.yourdomain.com" className="h-8 text-xs" />
            </div>
          </div>
        )}

        {provider === "ses" && (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>Access Key ID</label>
              <Input placeholder="AKIAXXXXXXXXXXXXXXXX" className="h-8 text-xs font-mono" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>Secret Key</label>
              <Input placeholder="••••••••••••••••" className="h-8 text-xs font-mono" type="password" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>Region</label>
              <Select defaultValue="ap-south-1">
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem>
                  <SelectItem value="us-east-1">us-east-1 (N. Virginia)</SelectItem>
                  <SelectItem value="eu-west-1">eu-west-1 (Ireland)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {provider === "smtp" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>SMTP Host</label>
              <Input placeholder="smtp.yourdomain.com" className="h-8 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>Port</label>
              <Select defaultValue="587">
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 — SMTP</SelectItem>
                  <SelectItem value="465">465 — SMTPS</SelectItem>
                  <SelectItem value="587">587 — STARTTLS (recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>Username</label>
              <Input placeholder="noreply@yourdomain.com" className="h-8 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
                style={{ color: "var(--muted-foreground)" }}>Password</label>
              <Input placeholder="••••••••" className="h-8 text-xs" type="password" />
            </div>
          </div>
        )}
      </div>

      {/* Sender identity */}
      <div className="rounded-xl border border-border p-4 flex flex-col gap-3"
        style={{ background: "var(--card)" }}>
        <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Sender Identity</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
              style={{ color: "var(--muted-foreground)" }}>From Name</label>
            <Input defaultValue="RAMS MHE Alerts" className="h-8 text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
              style={{ color: "var(--muted-foreground)" }}>From Email</label>
            <Input defaultValue="alerts@rams.digital" className="h-8 text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
              style={{ color: "var(--muted-foreground)" }}>Reply-To</label>
            <Input defaultValue="escalations@rams.digital" className="h-8 text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 block"
              style={{ color: "var(--muted-foreground)" }}>Default CC (management)</label>
            <Input placeholder="manager@company.com" className="h-8 text-xs" />
          </div>
        </div>
      </div>

      {/* Test connection */}
      <div className="rounded-xl border border-border p-4 flex items-center gap-4"
        style={{ background: "var(--card)" }}>
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Test Connection</p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Send a test email to verify your provider settings are correct
          </p>
        </div>
        <Input placeholder="your@email.com" className="h-8 text-xs w-48" />
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 shrink-0" onClick={sendTest}
          disabled={testStatus === "sending"}>
          {testStatus === "sending" ? (
            <><Send size={12} strokeWidth={1.5} className="animate-pulse" /> Sending…</>
          ) : testStatus === "ok" ? (
            <><CheckCircle2 size={12} strokeWidth={1.5} style={{ color: "#22c55e" }} /> Sent!</>
          ) : testStatus === "fail" ? (
            <><AlertTriangle size={12} strokeWidth={1.5} style={{ color: "#ef4444" }} /> Failed</>
          ) : (
            <><Send size={12} strokeWidth={1.5} /> Send Test</>
          )}
        </Button>
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="h-8 text-xs px-5">Save Email Config</Button>
      </div>
    </div>
  );
}

// ─── Template Section ─────────────────────────────────────────────────────────

const EMAIL_HTML = `
<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
  <!-- Red top accent -->
  <div style="height:4px;background:linear-gradient(90deg,#ef4444,#ef444460)"></div>

  <!-- Header -->
  <div style="padding:24px 28px 20px;border-bottom:1px solid #f3f4f6">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="background:#ef444415;border-radius:8px;padding:8px">
        <svg width="18" height="18" fill="none" stroke="#ef4444" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div>
        <p style="font-size:11px;color:#6b7280;font-weight:600;letter-spacing:.05em;text-transform:uppercase;margin:0">Escalation Alert · RAMS MHE</p>
        <p style="font-size:16px;font-weight:800;color:#111827;margin:2px 0 0">Action Required — SLA Breached</p>
      </div>
    </div>
  </div>

  <!-- Body -->
  <div style="padding:24px 28px">
    <p style="font-size:13px;color:#374151;margin:0 0 16px">Hi <strong>Sunil Bhatt</strong>,</p>
    <p style="font-size:13px;color:#374151;margin:0 0 20px">The following escalation has been assigned to you at <strong>L2 — Supervisor</strong> level after the L1 SLA was breached. Please acknowledge and take action within your 4-hour window.</p>

    <!-- Issue card -->
    <div style="background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;padding:16px 18px;margin:0 0 20px">
      <div style="display:flex;align-items:center;gap:8px;margin:0 0 10px;flex-wrap:wrap">
        <span style="background:#ef444415;color:#ef4444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px">🛡 Safety</span>
        <span style="background:#ef444415;color:#ef4444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px">● Critical</span>
        <span style="background:#3b82f615;color:#3b82f6;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px">L2</span>
        <span style="font-family:monospace;font-size:10px;color:#9ca3af;margin-left:auto">ESC-0038</span>
      </div>
      <p style="font-size:14px;font-weight:700;color:#111827;margin:0 0 4px">Repeat impact offender — MHE-008</p>
      <p style="font-size:12px;color:#6b7280;margin:0">MHE-008 · 12G impact · Zone C · 5 near-misses in 30 min</p>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:14px 0 0;padding:12px 0 0;border-top:1px dashed #e5e7eb">
        <div><p style="font-size:10px;color:#9ca3af;margin:0 0 2px;text-transform:uppercase;letter-spacing:.05em">Assigned</p><p style="font-size:11px;font-weight:700;color:#111827;margin:0">08:02 AM</p></div>
        <div><p style="font-size:10px;color:#9ca3af;margin:0 0 2px;text-transform:uppercase;letter-spacing:.05em">SLA Due</p><p style="font-size:11px;font-weight:700;color:#ef4444;margin:0">12:00 PM</p></div>
        <div><p style="font-size:10px;color:#9ca3af;margin:0 0 2px;text-transform:uppercase;letter-spacing:.05em">MHE Ref</p><p style="font-size:11px;font-weight:700;color:#111827;margin:0">MHE-008</p></div>
      </div>
    </div>

    <!-- SLA bar -->
    <div style="margin:0 0 20px">
      <div style="display:flex;justify-content:space-between;margin:0 0 6px">
        <span style="font-size:11px;font-weight:600;color:#374151">SLA Remaining</span>
        <span style="font-size:11px;font-weight:800;color:#22c55e">55%</span>
      </div>
      <div style="height:6px;background:#f3f4f6;border-radius:99px;overflow:hidden">
        <div style="height:100%;width:55%;background:#22c55e;border-radius:99px"></div>
      </div>
    </div>

    <!-- CTA buttons -->
    <div style="display:flex;gap:10px;margin:0 0 20px">
      <a href="#" style="flex:1;display:block;text-align:center;background:#111827;color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:10px;border-radius:8px">✓ Acknowledge</a>
      <a href="#" style="flex:1;display:block;text-align:center;background:#f9fafb;color:#374151;text-decoration:none;font-size:12px;font-weight:600;padding:10px;border-radius:8px;border:1px solid #e5e7eb">View Full Details →</a>
    </div>

    <p style="font-size:11px;color:#9ca3af;margin:0">If you cannot act on this escalation, use the <strong>Reassign</strong> option in the portal or reply to this email. Do not ignore — unacknowledged escalations auto-escalate to L3.</p>
  </div>

  <!-- Footer -->
  <div style="padding:14px 28px;background:#f9fafb;border-top:1px solid #f3f4f6">
    <p style="font-size:10px;color:#9ca3af;margin:0">RAMS MHE Platform · alerts@rams.digital · <a href="#" style="color:#9ca3af">Unsubscribe</a></p>
  </div>
</div>
`;

function TemplatesSection() {
  const [activeTemplate, setActiveTemplate] = useState("escalation");
  const [tab, setTab] = useState<"preview" | "html">("preview");

  const templates = [
    { id: "escalation",  label: "SLA Breach / Escalation", color: "#ef4444" },
    { id: "assigned",    label: "New Assignment",           color: "#3b82f6" },
    { id: "warning",     label: "SLA Warning (25% left)",  color: "#f59e0b" },
    { id: "resolved",    label: "Issue Resolved",           color: "#22c55e" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1">
        <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Email Templates</h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Preview the email templates sent at each event. Variables like {"{{assignee}}"}, {"{{issue_title}}"}, {"{{sla_remaining}}"} are auto-filled at send time.
        </p>
      </div>

      <div className="flex gap-4">
        {/* Template list */}
        <div className="flex flex-col gap-1.5 shrink-0" style={{ width: 200 }}>
          {templates.map(t => (
            <button key={t.id} onClick={() => setActiveTemplate(t.id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all"
              style={{
                background: activeTemplate === t.id ? `${t.color}12` : "var(--muted)",
                border: `1px solid ${activeTemplate === t.id ? `${t.color}40` : "transparent"}`,
              }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
              <span className="text-[11px] font-semibold" style={{ color: activeTemplate === t.id ? t.color : "var(--muted-foreground)" }}>
                {t.label}
              </span>
              {activeTemplate === t.id && (
                <ChevronRight size={11} strokeWidth={2} className="ml-auto shrink-0" style={{ color: t.color }} />
              )}
            </button>
          ))}
        </div>

        {/* Preview / HTML */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center gap-1 p-0.5 rounded-lg self-start"
            style={{ background: "var(--muted)" }}>
            {(["preview", "html"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all"
                style={{
                  background: tab === t ? "var(--card)" : "transparent",
                  color: tab === t ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : undefined,
                }}>
                {t === "preview" ? <><Eye size={11} strokeWidth={1.5} /> Preview</> : <><FileCode2 size={11} strokeWidth={1.5} /> HTML</>}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-border overflow-hidden"
            style={{ background: tab === "preview" ? "#f8f9fa" : "var(--card)" }}>
            {tab === "preview" ? (
              <div className="p-4 overflow-auto" style={{ maxHeight: 520 }}>
                <div dangerouslySetInnerHTML={{ __html: EMAIL_HTML }} />
              </div>
            ) : (
              <div className="overflow-auto" style={{ maxHeight: 520 }}>
                <pre className="p-4 text-[10px] leading-relaxed" style={{ color: "var(--foreground)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  {EMAIL_HTML.trim()}
                </pre>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1.5">
              <Send size={11} strokeWidth={1.5} />
              Send Preview
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1.5">
              <Settings2 size={11} strokeWidth={1.5} />
              Customize
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function EscalationSettings() {
  const navigate = useNavigate();
  const sidebar  = useSidebar();
  const [section, setSection] = useState("sla");

  useEffect(() => {
    sidebar.setSubPageTitle("Escalation Settings");
    sidebar.setSubPageBack(() => navigate("/mhe/escalation-logs"));
    return () => { sidebar.setSubPageTitle(null); sidebar.setSubPageBack(null); };
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--background)" }}>

      {/* Segmented tab control — matches IMDS Condition Definitions style */}
      <div className="px-6 py-4 border-b border-border shrink-0"
        style={{ background: "var(--card)" }}>
        <div
          className="flex gap-1 p-1 rounded-[var(--radius)]"
          style={{ background: "var(--muted)" }}
        >
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className="flex flex-1 items-center justify-center gap-2 py-2 px-4 rounded-[calc(var(--radius)+1px)] text-[13px] font-medium transition-all"
                style={{
                  background: active ? "var(--card)" : "transparent",
                  color: active ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: active ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                }}
              >
                <Icon size={13} strokeWidth={1.5} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {section === "sla"       && <SLARoutingSection />}
        {section === "rules"     && <NotificationRulesSection />}
        {section === "contacts"  && <LevelContactsSection />}
        {section === "email"     && <EmailSetupSection />}
        {section === "templates" && <TemplatesSection />}
      </div>
    </div>
  );
}
