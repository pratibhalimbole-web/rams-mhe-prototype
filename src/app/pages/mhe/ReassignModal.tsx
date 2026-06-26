import React, { useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Mail,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../components/ui/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Level = "L1" | "L2" | "L3" | "L4";
type UserStatus = "available" | "busy" | "offline";

interface Assignee {
  id: string;
  name: string;
  initials: string;
  role: string;
  level: Level;
  email: string;
  phone?: string;
  status: UserStatus;
  activeEscalations: number;
  department: string;
}

// ─── Mock Directory ───────────────────────────────────────────────────────────

const USER_DIRECTORY: Assignee[] = [
  // L1
  { id: "u01", name: "Prashant Rao",      initials: "PR", role: "Forklift Operator",     level: "L1", email: "prashant.rao@warehouse.com",   phone: "+91-98001-11001", status: "busy",      activeEscalations: 1, department: "Floor Ops" },
  { id: "u02", name: "Kavita Rao",        initials: "KR", role: "Safety Officer",         level: "L1", email: "kavita.rao@warehouse.com",     phone: "+91-98001-11002", status: "available", activeEscalations: 0, department: "Safety" },
  { id: "u03", name: "Tech. Amir Khan",   initials: "AK", role: "Maintenance Tech",       level: "L1", email: "amir.khan@warehouse.com",      phone: "+91-98001-11003", status: "busy",      activeEscalations: 1, department: "Maintenance" },
  { id: "u04", name: "Deepak Mishra",     initials: "DM", role: "Safety Officer",         level: "L1", email: "deepak.mishra@warehouse.com",  phone: "+91-98001-11004", status: "offline",   activeEscalations: 0, department: "Safety" },
  { id: "u05", name: "Raj Kumar",         initials: "RK", role: "Warehouse Operator",     level: "L1", email: "raj.kumar@warehouse.com",      phone: "+91-98001-11005", status: "available", activeEscalations: 0, department: "Floor Ops" },
  { id: "u06", name: "Pooja Naik",        initials: "PN", role: "Admin Officer",          level: "L1", email: "pooja.naik@warehouse.com",                               status: "available", activeEscalations: 2, department: "Admin" },
  // L2
  { id: "u07", name: "Sunil Bhatt",       initials: "SB", role: "Shift Supervisor",       level: "L2", email: "sunil.bhatt@warehouse.com",    phone: "+91-98001-22001", status: "busy",      activeEscalations: 2, department: "Operations" },
  { id: "u08", name: "Neha Kapoor",       initials: "NK", role: "Compliance Supervisor",  level: "L2", email: "neha.kapoor@warehouse.com",    phone: "+91-98001-22002", status: "available", activeEscalations: 1, department: "Compliance" },
  { id: "u09", name: "Anand Kumar",       initials: "AK", role: "Shift Supervisor",       level: "L2", email: "anand.kumar@warehouse.com",    phone: "+91-98001-22003", status: "available", activeEscalations: 0, department: "Operations" },
  { id: "u10", name: "Tech Lead Sanjay",  initials: "SL", role: "Maintenance Lead",       level: "L2", email: "sanjay.lead@warehouse.com",    phone: "+91-98001-22004", status: "available", activeEscalations: 0, department: "Maintenance" },
  // L3
  { id: "u11", name: "Amit Desai",        initials: "AD", role: "Operations Manager",     level: "L3", email: "amit.desai@warehouse.com",     phone: "+91-98001-33001", status: "busy",      activeEscalations: 3, department: "Operations" },
  { id: "u12", name: "Vijay Sharma",      initials: "VS", role: "Operations Manager",     level: "L3", email: "vijay.sharma@warehouse.com",   phone: "+91-98001-33002", status: "available", activeEscalations: 1, department: "Operations" },
  { id: "u13", name: "HR Team",           initials: "HR", role: "HR Manager",             level: "L3", email: "hr@warehouse.com",             phone: "+91-98001-33003", status: "available", activeEscalations: 0, department: "HR" },
  // L4
  { id: "u14", name: "Dir. Ramesh Gupta", initials: "RG", role: "Fleet Director",         level: "L4", email: "ramesh.gupta@warehouse.com",   phone: "+91-98001-44001", status: "available", activeEscalations: 1, department: "Executive" },
  { id: "u15", name: "CEO Office",        initials: "CO", role: "Executive",              level: "L4", email: "ceo-office@warehouse.com",                               status: "available", activeEscalations: 0, department: "Executive" },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_META: Record<UserStatus, { label: string; dot: string }> = {
  available: { label: "Available", dot: "#22c55e" },
  busy:      { label: "Busy",      dot: "#f59e0b" },
  offline:   { label: "Offline",   dot: "#94a3b8" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-11 h-11 text-sm" : size === "md" ? "w-9 h-9 text-xs" : "w-7 h-7 text-[10px]";
  return (
    <div className={cn("rounded-full flex items-center justify-center font-bold shrink-0 select-none", sz)}
      style={{ background: "var(--muted)", color: "var(--foreground)" }}>
      {initials}
    </div>
  );
}

function StatusDot({ status }: { status: UserStatus }) {
  const { dot } = STATUS_META[status];
  return (
    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
  );
}

function UserCard({ user, selected, onClick }: { user: Assignee; selected: boolean; onClick: () => void }) {
  const st = STATUS_META[user.status];
  const isOffline = user.status === "offline";

  return (
    <button
      onClick={onClick}
      disabled={isOffline}
      className={cn(
        "w-full text-left rounded-lg border transition-all duration-100",
        isOffline ? "opacity-40 cursor-not-allowed" : "hover:bg-muted/50",
        selected ? "border-foreground" : "border-border"
      )}
      style={{ background: selected ? "var(--muted)" : "var(--card)" }}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Avatar */}
        <Avatar initials={user.initials} size="md" />

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-semibold truncate" style={{ color: "var(--foreground)" }}>
              {user.name}
            </p>
            {selected && (
              <CheckCircle2 size={12} strokeWidth={2} className="shrink-0" style={{ color: "var(--foreground)" }} />
            )}
          </div>
          <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>
            {user.role} · {user.department}
          </p>
        </div>

        {/* Right side: status + workload */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <StatusDot status={user.status} />
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{st.label}</span>
          </div>
          {user.activeEscalations > 0 && (
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {user.activeEscalations} active
            </span>
          )}
        </div>
      </div>

      {/* Email row */}
      <div className="px-3 pb-2.5 flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
        <Mail size={10} strokeWidth={1.5} className="shrink-0" />
        <span className="text-[10px] truncate">{user.email}</span>
      </div>
    </button>
  );
}

// ─── ReassignModal ─────────────────────────────────────────────────────────────

interface ReassignModalProps {
  open: boolean;
  onClose: () => void;
  currentLevel: Level;
  currentAssignee: string;
  escalationId: string;
  escalationTitle: string;
  onConfirm: (user: Assignee, note: string) => void;
}

type LevelFilter = "same" | "up" | "all";

export function ReassignModal({
  open, onClose, currentLevel, currentAssignee, escalationId, escalationTitle, onConfirm,
}: ReassignModalProps) {
  const [search, setSearch]           = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("same");
  const [selected, setSelected]       = useState<Assignee | null>(null);
  const [note, setNote]               = useState("");
  const [confirmed, setConfirmed]     = useState(false);

  const LEVEL_ORDER: Level[] = ["L1", "L2", "L3", "L4"];
  const currentIdx = LEVEL_ORDER.indexOf(currentLevel);

  // Which levels to show per tab
  const levelFilterMap: Record<LevelFilter, Level[]> = {
    same: [currentLevel],
    up:   LEVEL_ORDER.slice(currentIdx + 1),
    all:  LEVEL_ORDER,
  };

  const visibleLevels = levelFilterMap[levelFilter];

  const filtered = useMemo(() => {
    return USER_DIRECTORY.filter(u => {
      if (!visibleLevels.includes(u.level)) return false;
      if (u.name === currentAssignee) return false;            // exclude current
      if (search.trim()) {
        const q = search.toLowerCase();
        return u.name.toLowerCase().includes(q) ||
               u.role.toLowerCase().includes(q) ||
               u.department.toLowerCase().includes(q) ||
               u.email.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => {
      // available first, then busy, offline last
      const order: UserStatus[] = ["available", "busy", "offline"];
      return order.indexOf(a.status) - order.indexOf(b.status);
    });
  }, [search, levelFilter, currentAssignee, visibleLevels]);


  function handleConfirm() {
    if (!selected) return;
    setConfirmed(true);
    setTimeout(() => {
      onConfirm(selected, note);
      // reset
      setSelected(null);
      setNote("");
      setSearch("");
      setLevelFilter("same");
      setConfirmed(false);
      onClose();
    }, 900);
  }

  function handleClose() {
    if (confirmed) return;
    setSelected(null);
    setNote("");
    setSearch("");
    setLevelFilter("same");
    onClose();
  }

  const filterTabs: { id: LevelFilter; label: string; count: number }[] = [
    { id: "same", label: `Same Level (${currentLevel})`, count: USER_DIRECTORY.filter(u => u.level === currentLevel && u.name !== currentAssignee).length },
    { id: "up",   label: "Escalate Up",                  count: USER_DIRECTORY.filter(u => LEVEL_ORDER.indexOf(u.level) > currentIdx).length },
    { id: "all",  label: "Everyone",                     count: USER_DIRECTORY.filter(u => u.name !== currentAssignee).length },
  ];

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden flex flex-col"
        style={{
          maxWidth: 900,
          width: "95vw",
          maxHeight: "92vh",
          background: "var(--background)",
        }}
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-border shrink-0">
          <div>
            <DialogTitle className="text-sm font-black" style={{ color: "var(--foreground)" }}>
              Reassign Escalation
            </DialogTitle>
            <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: "var(--muted-foreground)" }}>
              {escalationId} · {escalationTitle}
            </p>
          </div>

          {/* Current assignee */}
          <div className="flex items-center gap-2 mt-2.5 px-3 py-2 rounded-lg"
            style={{ background: "var(--muted)" }}>
            <span className="text-[10px] font-semibold" style={{ color: "var(--muted-foreground)" }}>
              Currently assigned to
            </span>
            <span className="text-[11px] font-bold" style={{ color: "var(--foreground)" }}>{currentAssignee}</span>
            <ChevronRight size={11} strokeWidth={2} style={{ color: "var(--muted-foreground)" }} />
            <span className="text-[11px] font-bold" style={{ color: "var(--primary)" }}>
              {selected ? selected.name : "Select new assignee below"}
            </span>
          </div>
        </DialogHeader>

        {/* Two-column body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT: User picker */}
          <div className="flex flex-col flex-1 min-w-0 border-r border-border overflow-hidden">

            {/* Search + level filter */}
            <div className="px-4 pt-3 pb-2 shrink-0 flex flex-col gap-2">
              <div className="relative">
                <Search size={12} strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--muted-foreground)" }} />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, role, department…"
                  className="pl-8 h-8 text-xs"
                />
                {search && (
                  <button onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
                    <X size={11} />
                  </button>
                )}
              </div>

              {/* Level filter tabs */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: "var(--muted)" }}>
                {filterTabs.map(t => (
                  <button key={t.id} onClick={() => setLevelFilter(t.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-semibold transition-all"
                    style={{
                      background: levelFilter === t.id ? "var(--card)" : "transparent",
                      color: levelFilter === t.id ? "var(--foreground)" : "var(--muted-foreground)",
                      boxShadow: levelFilter === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : undefined,
                    }}>
                    {t.label}
                    <span className="text-[9px] px-1 py-0.5 rounded font-bold"
                      style={{
                        background: levelFilter === t.id ? "var(--muted)" : "transparent",
                        color: "var(--muted-foreground)",
                      }}>
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3">
                {(["available", "busy", "offline"] as UserStatus[]).map(s => {
                  const meta = STATUS_META[s];
                  return (
                    <div key={s} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{meta.label}</span>
                    </div>
                  );
                })}
                <span className="ml-auto text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  {filtered.length} user{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <Search size={22} strokeWidth={1} style={{ color: "var(--muted-foreground)" }} />
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No users found</p>
                </div>
              ) : (
                filtered.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    selected={selected?.id === user.id}
                    onClick={() => setSelected(prev => prev?.id === user.id ? null : user)}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Handoff note + email preview */}
          <div className="w-80 shrink-0 flex flex-col overflow-hidden">

            {/* Handoff note */}
            <div className="px-4 pt-3 pb-3 flex flex-col gap-2 border-b border-border">
              <p className="text-[11px] font-bold" style={{ color: "var(--foreground)" }}>Handoff Note</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Optional — explain why you're reassigning, context for the new assignee…"
                rows={5}
                className="w-full text-[11px] rounded-lg border px-2.5 py-2 resize-none outline-none transition-colors leading-relaxed"
                style={{
                  background: "var(--muted)",
                  color: "var(--foreground)",
                  borderColor: "var(--border)",
                }}
                onFocus={e  => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "var(--card)"; }}
                onBlur={e   => { e.currentTarget.style.borderColor = "var(--border)";  e.currentTarget.style.background = "var(--muted)"; }}
              />
            </div>

            {/* Email notification preview */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
              <p className="text-[11px] font-bold" style={{ color: "var(--foreground)" }}>
                {selected ? "Will send email to" : "Email notification"}
              </p>

              {selected ? (
                <div className="flex flex-col gap-2">
                  {/* Recipient card */}
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border"
                    style={{ background: "var(--muted)" }}>
                    <Avatar initials={selected.initials} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold truncate" style={{ color: "var(--foreground)" }}>
                        {selected.name}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>
                        {selected.email}
                      </p>
                    </div>
                    <StatusDot status={selected.status} />
                  </div>

                  {/* Email preview card */}
                  <div className="rounded-lg border border-border overflow-hidden text-[10px]"
                    style={{ background: "var(--card)" }}>
                    <div className="px-3 py-2.5 border-b border-border">
                      <p className="font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>
                        [RAMS] Escalation Reassigned — Action Required
                      </p>
                      <p style={{ color: "var(--muted-foreground)" }}>
                        From: RAMS MHE Alerts &lt;alerts@rams.digital&gt;
                      </p>
                      <p style={{ color: "var(--muted-foreground)" }}>
                        To: {selected.email}
                      </p>
                    </div>
                    <div className="px-3 py-2.5 flex flex-col gap-1.5">
                      <p style={{ color: "var(--foreground)" }}>
                        Hi <strong>{selected.name.split(" ")[0]}</strong>,
                      </p>
                      <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                        <strong>{escalationId}</strong> has been reassigned to you from {currentAssignee}. Please acknowledge within your SLA window.
                      </p>
                      {note.trim() && (
                        <div className="px-2 py-1.5 rounded mt-0.5 border-l-2 border-border"
                          style={{ background: "var(--muted)" }}>
                          <p className="font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>
                            Handoff note:
                          </p>
                          <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                            {note.length > 100 ? note.slice(0, 100) + "…" : note}
                          </p>
                        </div>
                      )}
                      {/* CTA buttons */}
                      <div className="flex gap-1.5 mt-1">
                        <div className="flex-1 text-center py-1.5 rounded-md font-semibold"
                          style={{ background: "var(--foreground)", color: "var(--background)" }}>
                          ✓ Acknowledge
                        </div>
                        <div className="flex-1 text-center py-1.5 rounded-md font-semibold border border-border"
                          style={{ color: "var(--foreground)" }}>
                          View →
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Workload warning */}
                  {selected.activeEscalations >= 2 && (
                    <div className="flex items-start gap-2 px-2.5 py-2 rounded-lg border border-border"
                      style={{ background: "var(--muted)" }}>
                      <AlertTriangle size={12} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "var(--muted-foreground)" }} />
                      <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                        {selected.name.split(" ")[0]} already has {selected.activeEscalations} active escalations. Consider someone with lower load.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-2 rounded-lg border border-dashed border-border">
                  <Mail size={20} strokeWidth={1} style={{ color: "var(--muted-foreground)" }} />
                  <p className="text-[10px] text-center" style={{ color: "var(--muted-foreground)" }}>
                    Select a user to preview the notification email
                  </p>
                </div>
              )}
            </div>

            {/* Confirm button */}
            <div className="px-4 py-3 border-t border-border shrink-0">
              <Button
                className="w-full h-9 text-xs font-bold gap-1.5 transition-all"
                disabled={!selected || confirmed}
                onClick={handleConfirm}
                style={selected ? { background: "var(--foreground)", color: "var(--background)" } : undefined}
              >
                {confirmed ? (
                  <>
                    <CheckCircle2 size={13} strokeWidth={2} className="animate-pulse" />
                    Reassigning…
                  </>
                ) : selected ? (
                  <>
                    <ArrowUpRight size={13} strokeWidth={1.5} />
                    Reassign to {selected.name.split(" ").slice(-1)[0]}
                  </>
                ) : (
                  <>
                    <ArrowUpRight size={13} strokeWidth={1.5} />
                    Select a person above
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
