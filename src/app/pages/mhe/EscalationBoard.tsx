import React, { useState, useMemo } from "react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  MessageSquare,
  User,
  Shield,
  Wrench,
  FileText,
  Zap,
  Filter,
  X,
} from "lucide-react";
import { cn } from "../../components/ui/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type EscalationLevel = "L1" | "L2" | "L3" | "L4";
type EscalationStatus = "open" | "acknowledged" | "in_progress" | "escalated" | "resolved" | "critical_breach";
type EscalationSource = "Safety" | "Inspection" | "Compliance" | "Impact";
type Severity = "Critical" | "High" | "Medium" | "Low";

interface HistoryNode {
  level: EscalationLevel;
  role: string;
  assignee: string;
  initials: string;
  assignedAt: string;
  dueAt: string;
  acknowledgedAt?: string;
  outcome: "escalated" | "resolved" | "active" | "breached";
  comment?: string;
  timeRemaining?: string;   // only for active node
  slaPercent?: number;      // 0–100, only for active node
}

interface EscalationItem {
  id: string;
  source: EscalationSource;
  suite: "MEPS" | "RTSS" | "MMS" | "FMS";
  severity: Severity;
  currentLevel: EscalationLevel;
  status: EscalationStatus;
  title: string;
  detail: string;
  mheRef: string;
  originActionId: string;
  assignedTo: string;
  assignedInitials: string;
  assignedRole: string;
  createdAt: string;
  dueAt: string;
  slaPercent: number;      // 0–100 (100 = full time left, 0 = breached)
  escalationCount: number;
  history: HistoryNode[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_META: Record<EscalationLevel, { label: string; role: string; resolve: string; color: string }> = {
  L1: { label: "L1 — Operator / Technician", role: "Operator",        resolve: "2h",   color: "#6b7280" },
  L2: { label: "L2 — Supervisor",            role: "Supervisor",      resolve: "4h",   color: "#3b82f6" },
  L3: { label: "L3 — Ops Manager",           role: "Ops Manager",     resolve: "8h",   color: "#f59e0b" },
  L4: { label: "L4 — Director",              role: "Director",        resolve: "24h",  color: "#ef4444" },
};

const SOURCE_ICON: Record<EscalationSource, React.ElementType> = {
  Safety:     Shield,
  Inspection: FileText,
  Compliance: CheckCircle2,
  Impact:     Zap,
};

const SOURCE_COLOR: Record<EscalationSource, string> = {
  Safety:     "#ef4444",
  Inspection: "#8b5cf6",
  Compliance: "#f59e0b",
  Impact:     "#f97316",
};

const SEVERITY_COLOR: Record<Severity, string> = {
  Critical: "var(--destructive)",
  High:     "var(--warning, #f59e0b)",
  Medium:   "var(--chart-1, #3b82f6)",
  Low:      "var(--muted-foreground)",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ESCALATIONS: EscalationItem[] = [
  // ── L1 Active ──
  {
    id: "ESC-0041",
    source: "Safety",
    suite: "RTSS",
    severity: "Critical",
    currentLevel: "L1",
    status: "open",
    title: "Speed violation — MHE-005 Zone B",
    detail: "Operator: Prashant Rao · 28 km/h in 15 km/h zone · Shift 2",
    mheRef: "MHE-005",
    originActionId: "a5",
    assignedTo: "Prashant Rao",
    assignedInitials: "PR",
    assignedRole: "Forklift Operator",
    createdAt: "Today, 08:15 AM",
    dueAt: "Today, 10:15 AM",
    slaPercent: 72,
    escalationCount: 0,
    history: [
      { level: "L1", role: "Forklift Operator", assignee: "Prashant Rao", initials: "PR", assignedAt: "08:15 AM", dueAt: "10:15 AM", outcome: "active", timeRemaining: "1h 22m", slaPercent: 72 },
    ],
  },
  {
    id: "ESC-0042",
    source: "Inspection",
    suite: "MEPS",
    severity: "High",
    currentLevel: "L1",
    status: "acknowledged",
    title: "Hydraulic oil leak — MHE-012",
    detail: "Pre-shift inspection · Oil seep at rear cylinder · Bay 7",
    mheRef: "MHE-012",
    originActionId: "a9",
    assignedTo: "Tech. Amir Khan",
    assignedInitials: "AK",
    assignedRole: "Maintenance Tech",
    createdAt: "Today, 07:30 AM",
    dueAt: "Today, 09:30 AM",
    slaPercent: 18,
    escalationCount: 0,
    history: [
      { level: "L1", role: "Maintenance Tech", assignee: "Tech. Amir Khan", initials: "AK", assignedAt: "07:30 AM", dueAt: "09:30 AM", acknowledgedAt: "07:48 AM", outcome: "active", timeRemaining: "22m", slaPercent: 18 },
    ],
  },
  // ── L2 Active ──
  {
    id: "ESC-0038",
    source: "Safety",
    suite: "RTSS",
    severity: "Critical",
    currentLevel: "L2",
    status: "in_progress",
    title: "Repeat impact offender — MHE-008",
    detail: "MHE-008 · 12G impact · Zone C · 5 near-misses in 30 min · Shift 1",
    mheRef: "MHE-008",
    originActionId: "a3",
    assignedTo: "Sunil Bhatt",
    assignedInitials: "SB",
    assignedRole: "Shift Supervisor",
    createdAt: "Today, 06:00 AM",
    dueAt: "Today, 12:00 PM",
    slaPercent: 55,
    escalationCount: 1,
    history: [
      { level: "L1", role: "Safety Officer",   assignee: "Deepak Mishra", initials: "DM", assignedAt: "06:00 AM", dueAt: "08:00 AM", outcome: "breached", comment: "No acknowledgment within 2h SLA." },
      { level: "L2", role: "Shift Supervisor", assignee: "Sunil Bhatt",   initials: "SB", assignedAt: "08:02 AM", dueAt: "12:00 PM", acknowledgedAt: "08:20 AM", outcome: "active", timeRemaining: "3h 10m", slaPercent: 55 },
    ],
  },
  {
    id: "ESC-0039",
    source: "Compliance",
    suite: "MMS",
    severity: "Critical",
    currentLevel: "L2",
    status: "open",
    title: "MHE fitness cert expired — MHE-011",
    detail: "Fitness certificate expired 8 days ago · MHE-011 still in active duty",
    mheRef: "MHE-011",
    originActionId: "a2",
    assignedTo: "Neha Kapoor",
    assignedInitials: "NK",
    assignedRole: "Compliance Supervisor",
    createdAt: "Yesterday, 3:00 PM",
    dueAt: "Today, 9:00 AM",
    slaPercent: 0,
    escalationCount: 1,
    history: [
      { level: "L1", role: "Admin Officer",          assignee: "Raj Patel",   initials: "RP", assignedAt: "Yesterday 3:00 PM", dueAt: "Yesterday 5:00 PM", outcome: "breached", comment: "SLA breached. No action taken." },
      { level: "L2", role: "Compliance Supervisor",  assignee: "Neha Kapoor", initials: "NK", assignedAt: "Yesterday 5:02 PM", dueAt: "Today 9:00 AM",    outcome: "active", timeRemaining: "Overdue", slaPercent: 0 },
    ],
  },
  // ── L3 Active ──
  {
    id: "ESC-0034",
    source: "Safety",
    suite: "RTSS",
    severity: "Critical",
    currentLevel: "L3",
    status: "in_progress",
    title: "High-risk driver — Safety score 19%",
    detail: "Operator: Mohan Verma · Bottom 5% fleet-wide · 12 violations this month",
    mheRef: "FLT-FLEET",
    originActionId: "a4",
    assignedTo: "Ops Mgr. Amit Desai",
    assignedInitials: "AD",
    assignedRole: "Operations Manager",
    createdAt: "Yesterday, 9:00 AM",
    dueAt: "Today, 5:00 PM",
    slaPercent: 40,
    escalationCount: 2,
    history: [
      { level: "L1", role: "Safety Officer",     assignee: "Kavita Rao",    initials: "KR", assignedAt: "Yesterday 9:00 AM", dueAt: "Yesterday 11:00 AM", outcome: "breached", comment: "Operator not reachable. SLA missed." },
      { level: "L2", role: "Shift Supervisor",   assignee: "HR Team",       initials: "HR", assignedAt: "Yesterday 11:02 AM", dueAt: "Yesterday 3:00 PM", outcome: "escalated", comment: "Acknowledged but could not suspend without ops sign-off." },
      { level: "L3", role: "Operations Manager", assignee: "Amit Desai",    initials: "AD", assignedAt: "Yesterday 3:05 PM",  dueAt: "Today 5:00 PM",     acknowledgedAt: "Yesterday 3:30 PM", outcome: "active", timeRemaining: "4h 20m", slaPercent: 40 },
    ],
  },
  {
    id: "ESC-0035",
    source: "Impact",
    suite: "RTSS",
    severity: "Critical",
    currentLevel: "L3",
    status: "critical_breach",
    title: "Structural impact — rack zone A collision",
    detail: "MHE-003 · Fork struck rack column A-07 · Structural integrity check required",
    mheRef: "MHE-003",
    originActionId: "a10",
    assignedTo: "Ops Mgr. Vijay Sharma",
    assignedInitials: "VS",
    assignedRole: "Operations Manager",
    createdAt: "2 days ago",
    dueAt: "Yesterday, 6:00 PM",
    slaPercent: 0,
    escalationCount: 2,
    history: [
      { level: "L1", role: "Safety Officer",     assignee: "Mohan Singh",    initials: "MS", assignedAt: "2 days ago 10:00 AM", dueAt: "2 days ago 12:00 PM", outcome: "breached", comment: "Not on shift during event." },
      { level: "L2", role: "Shift Supervisor",   assignee: "Anand Kumar",    initials: "AK", assignedAt: "2 days ago 12:02 PM", dueAt: "2 days ago 4:00 PM",  outcome: "escalated", comment: "Rack inspection ordered but ops manager approval needed." },
      { level: "L3", role: "Operations Manager", assignee: "Vijay Sharma",   initials: "VS", assignedAt: "2 days ago 4:05 PM",  dueAt: "Yesterday 6:00 PM",   outcome: "active", timeRemaining: "Overdue", slaPercent: 0 },
    ],
  },
  // ── L4 Active ──
  {
    id: "ESC-0029",
    source: "Compliance",
    suite: "MMS",
    severity: "Critical",
    currentLevel: "L4",
    status: "open",
    title: "3 MHEs operated without valid insurance",
    detail: "MHE-006, MHE-011, MHE-014 · Insurance lapsed 12–21 days · Regulatory risk",
    mheRef: "MHE-006 / 011 / 014",
    originActionId: "a11",
    assignedTo: "Dir. Ramesh Gupta",
    assignedInitials: "RG",
    assignedRole: "Fleet Director",
    createdAt: "3 days ago",
    dueAt: "Today, 11:59 PM",
    slaPercent: 22,
    escalationCount: 3,
    history: [
      { level: "L1", role: "Admin Officer",          assignee: "Pooja Naik",    initials: "PN", assignedAt: "3d ago 08:00", dueAt: "3d ago 10:00", outcome: "breached",  comment: "Missed SLA." },
      { level: "L2", role: "Compliance Supervisor",  assignee: "Neha Kapoor",   initials: "NK", assignedAt: "3d ago 10:02", dueAt: "3d ago 2:00 PM", outcome: "escalated", comment: "Renewal requires director approval and vendor contact." },
      { level: "L3", role: "Operations Manager",     assignee: "Amit Desai",    initials: "AD", assignedAt: "3d ago 2:05 PM", dueAt: "2d ago 10:00 PM", outcome: "escalated", comment: "Vendor contacted. Waiting director authorization for emergency renewal." },
      { level: "L4", role: "Fleet Director",         assignee: "Ramesh Gupta",  initials: "RG", assignedAt: "2d ago 10:08 PM", dueAt: "Today 11:59 PM", outcome: "active", timeRemaining: "6h 42m", slaPercent: 22 },
    ],
  },
  // ── Resolved ──
  {
    id: "ESC-0031",
    source: "Inspection",
    suite: "MEPS",
    severity: "High",
    currentLevel: "L2",
    status: "resolved",
    title: "Battery swelling — MHE-009 flagged for replacement",
    detail: "Critical battery finding · Swelling detected during pre-shift inspection",
    mheRef: "MHE-009",
    originActionId: "a7",
    assignedTo: "Tech Lead Sanjay",
    assignedInitials: "SL",
    assignedRole: "Maintenance Lead",
    createdAt: "Yesterday, 7:00 AM",
    dueAt: "Yesterday, 3:00 PM",
    slaPercent: 100,
    escalationCount: 1,
    history: [
      { level: "L1", role: "Maintenance Tech", assignee: "Tech. Amir Khan", initials: "AK", assignedAt: "Yesterday 7:00 AM", dueAt: "Yesterday 9:00 AM", outcome: "escalated", comment: "Battery sourcing requires L2 budget approval." },
      { level: "L2", role: "Maintenance Lead", assignee: "Tech Lead Sanjay", initials: "SL", assignedAt: "Yesterday 9:03 AM", dueAt: "Yesterday 3:00 PM", acknowledgedAt: "Yesterday 9:15 AM", outcome: "resolved", comment: "Battery replaced at 11:40 AM. MHE-009 back in service. Closed." },
    ],
  },
  {
    id: "ESC-0033",
    source: "Safety",
    suite: "RTSS",
    severity: "High",
    currentLevel: "L1",
    status: "resolved",
    title: "PPE non-compliance — Operator: Suresh Kumar",
    detail: "Entered Zone D without hard hat · Camera alert triggered",
    mheRef: "FLT-OPS",
    originActionId: "a8",
    assignedTo: "Safety Officer Kavita",
    assignedInitials: "KR",
    assignedRole: "Safety Officer",
    createdAt: "Yesterday, 11:00 AM",
    dueAt: "Yesterday, 1:00 PM",
    slaPercent: 100,
    escalationCount: 0,
    history: [
      { level: "L1", role: "Safety Officer", assignee: "Kavita Rao", initials: "KR", assignedAt: "Yesterday 11:00 AM", dueAt: "Yesterday 1:00 PM", acknowledgedAt: "Yesterday 11:12 AM", outcome: "resolved", comment: "Operator counselled. PPE re-issued. Closed at 12:05 PM." },
    ],
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function slaColor(pct: number): string {
  if (pct <= 0)  return "#ef4444";
  if (pct < 25)  return "#ef4444";
  if (pct < 50)  return "#f59e0b";
  return "#22c55e";
}

function SLABar({ pct }: { pct: number }) {
  const col = slaColor(pct);
  const breached = pct <= 0;
  return (
    <div className="w-full h-1 rounded-full" style={{ background: "var(--muted)" }}>
      <div
        className={cn("h-full rounded-full transition-all", breached && "animate-pulse")}
        style={{ width: `${Math.max(0, pct)}%`, background: col }}
      />
    </div>
  );
}

function LevelPill({ level }: { level: EscalationLevel }) {
  const meta = LEVEL_META[level];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded"
      style={{ color: meta.color, background: `${meta.color}18`, border: `1px solid ${meta.color}40` }}
    >
      {level}
    </span>
  );
}

function SourceBadge({ source }: { source: EscalationSource }) {
  const Icon = SOURCE_ICON[source];
  const color = SOURCE_COLOR[source];
  return (
    <span
      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded"
      style={{ color, background: `${color}14` }}
    >
      <Icon size={9} strokeWidth={2} />
      {source}
    </span>
  );
}

function SeverityDot({ severity }: { severity: Severity }) {
  const col = severity === "Critical" ? "#ef4444" : severity === "High" ? "#f59e0b" : severity === "Medium" ? "#3b82f6" : "#6b7280";
  return <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: col, display: "inline-block" }} />;
}

function Avatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-9 h-9 text-sm" : size === "md" ? "w-7 h-7 text-xs" : "w-6 h-6 text-[10px]";
  return (
    <div className={cn("rounded-full flex items-center justify-center font-bold shrink-0", sz)}
      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
      {initials}
    </div>
  );
}

function StatusPill({ status }: { status: EscalationStatus }) {
  const cfg: Record<EscalationStatus, { label: string; color: string }> = {
    open:             { label: "Open",            color: "#6b7280" },
    acknowledged:     { label: "Acknowledged",    color: "#3b82f6" },
    in_progress:      { label: "In Progress",     color: "#f59e0b" },
    escalated:        { label: "Escalated",       color: "#f97316" },
    resolved:         { label: "Resolved",        color: "#22c55e" },
    critical_breach:  { label: "Critical Breach", color: "#ef4444" },
  };
  const { label, color } = cfg[status];
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
      style={{ color, background: `${color}18` }}>
      {label}
    </span>
  );
}

// ─── Escalation Card ──────────────────────────────────────────────────────────

function EscalationCard({ item, onClick }: { item: EscalationItem; onClick: () => void }) {
  const breached = item.slaPercent <= 0;
  const critBreach = item.status === "critical_breach";
  const activeNode = item.history[item.history.length - 1];

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-card border border-border rounded cursor-pointer transition-all duration-150 hover:shadow-sm hover:border-border/80 overflow-hidden"
      )}
      style={{ borderLeft: `3px solid ${SOURCE_COLOR[item.source]}` }}
    >
      {/* Critical breach pulse ring */}
      {critBreach && (
        <div className="absolute inset-0 rounded pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1.5px #ef4444", animation: "pulse 2s ease-in-out infinite" }} />
      )}

      <div className="p-3 flex flex-col gap-2">
        {/* Row 1: badges + ID */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <SourceBadge source={item.source} />
          <LevelPill level={item.currentLevel} />
          <StatusPill status={item.status} />
          <span className="ml-auto text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
            {item.id}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: "var(--foreground)" }}>
          {item.title}
        </p>

        {/* Detail */}
        <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{item.detail}</p>

        {/* Row: assignee + MHE ref */}
        <div className="flex items-center gap-2">
          <Avatar initials={item.assignedInitials} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{item.assignedTo}</p>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{item.assignedRole}</p>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
            {item.mheRef}
          </span>
        </div>

        {/* SLA row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1" style={{ color: slaColor(item.slaPercent) }}>
            <Clock size={10} strokeWidth={1.5} />
            <span className="text-[10px] font-semibold">
              {breached ? "Overdue" : activeNode.timeRemaining ?? "—"}
            </span>
          </div>
          {item.escalationCount > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]" style={{ color: "#f97316" }}>
              <ArrowUpRight size={10} strokeWidth={2} />
              {item.escalationCount} escalation{item.escalationCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* SLA bar */}
        <SLABar pct={item.slaPercent} />
      </div>
    </div>
  );
}

// ─── Swimlane ─────────────────────────────────────────────────────────────────

function Swimlane({
  level, items, onCardClick, defaultOpen = true,
}: {
  level: EscalationLevel;
  items: EscalationItem[];
  onCardClick: (item: EscalationItem) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = LEVEL_META[level];
  const hasBreached = items.some(i => i.slaPercent <= 0 || i.status === "critical_breach");

  return (
    <div className="border border-border rounded-lg overflow-hidden" style={{ background: "var(--card)" }}>
      {/* Header */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
      >
        <span className="text-xs font-bold" style={{ color: meta.color, minWidth: 24 }}>{level}</span>
        <span className="text-sm font-semibold flex-1" style={{ color: "var(--foreground)" }}>
          {meta.label}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
          style={{ background: items.length ? `${meta.color}18` : "var(--muted)", color: items.length ? meta.color : "var(--muted-foreground)" }}>
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded" style={{ color: "var(--muted-foreground)", background: "var(--muted)" }}>
          Resolve SLA: {meta.resolve}
        </span>
        {hasBreached && (
          <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "#ef4444" }}>
            <AlertTriangle size={11} strokeWidth={1.5} />
            SLA breached
          </span>
        )}
        {open ? <ChevronDown size={14} strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
               : <ChevronRight size={14} strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />}
      </button>

      {/* Cards */}
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border">
          {items.length === 0 ? (
            <p className="text-center py-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
              No active escalations at this level
            </p>
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {items.map(item => (
                <EscalationCard key={item.id} item={item} onClick={() => onCardClick(item)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

function outcomeIcon(outcome: HistoryNode["outcome"]) {
  if (outcome === "resolved")  return <CheckCircle2 size={14} style={{ color: "#22c55e" }} strokeWidth={2} />;
  if (outcome === "escalated") return <ArrowUpRight size={14} style={{ color: "#f97316" }} strokeWidth={2} />;
  if (outcome === "breached")  return <AlertTriangle size={14} style={{ color: "#ef4444" }} strokeWidth={2} />;
  return <Clock size={14} style={{ color: "var(--primary)" }} strokeWidth={2} />;
}

function EscalationTimeline({ history }: { history: HistoryNode[] }) {
  return (
    <div className="flex flex-col gap-0">
      {history.map((node, i) => {
        const isLast = i === history.length - 1;
        const meta = LEVEL_META[node.level];
        return (
          <div key={i} className="flex gap-3">
            {/* Left spine */}
            <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${meta.color}18`, border: `2px solid ${meta.color}50` }}>
                <span className="text-[10px] font-black" style={{ color: meta.color }}>{node.level}</span>
              </div>
              {!isLast && (
                <div className="flex-1 w-0.5 my-1" style={{ background: "var(--border)", minHeight: 24 }} />
              )}
            </div>

            {/* Content */}
            <div className={cn("flex-1 pb-5", isLast && "pb-2")}>
              <div className="flex items-center gap-2 mb-1">
                <Avatar initials={node.initials} size="sm" />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{node.assignee}</p>
                  <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{node.role}</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  {outcomeIcon(node.outcome)}
                  <span className="text-[10px] font-semibold capitalize"
                    style={{ color: node.outcome === "resolved" ? "#22c55e" : node.outcome === "escalated" ? "#f97316" : node.outcome === "breached" ? "#ef4444" : "var(--primary)" }}>
                    {node.outcome === "active" ? "Active" : node.outcome === "escalated" ? "Escalated" : node.outcome === "breached" ? "SLA Breached" : "Resolved"}
                  </span>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-1.5">
                <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  Assigned: <span className="font-medium" style={{ color: "var(--foreground)" }}>{node.assignedAt}</span>
                </span>
                <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  Due: <span className="font-medium" style={{ color: node.outcome === "breached" ? "#ef4444" : "var(--foreground)" }}>{node.dueAt}</span>
                </span>
                {node.acknowledgedAt && (
                  <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    Ack: <span className="font-medium" style={{ color: "#22c55e" }}>{node.acknowledgedAt}</span>
                  </span>
                )}
                {node.outcome === "active" && node.timeRemaining && (
                  <span className="text-[10px] font-semibold" style={{ color: slaColor(node.slaPercent ?? 0) }}>
                    {node.timeRemaining === "Overdue" ? "⚠ Overdue" : `⏱ ${node.timeRemaining} remaining`}
                  </span>
                )}
              </div>

              {/* SLA bar for active */}
              {node.outcome === "active" && node.slaPercent !== undefined && (
                <div className="mb-1.5"><SLABar pct={node.slaPercent} /></div>
              )}

              {/* Comment */}
              {node.comment && (
                <div className="flex items-start gap-1.5 px-2.5 py-2 rounded"
                  style={{ background: "var(--muted)", borderLeft: "2px solid var(--border)" }}>
                  <MessageSquare size={11} style={{ color: "var(--muted-foreground)", marginTop: 1, flexShrink: 0 }} strokeWidth={1.5} />
                  <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{node.comment}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailDrawer({
  item,
  onClose,
}: {
  item: EscalationItem | null;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");

  if (!item) return null;

  const isResolved = item.status === "resolved";
  const isL4 = item.currentLevel === "L4";

  return (
    <Sheet open={!!item} onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full max-w-[520px] flex flex-col gap-0 p-0 overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <SourceBadge source={item.source} />
                <LevelPill level={item.currentLevel} />
                <StatusPill status={item.status} />
                {item.escalationCount > 0 && (
                  <span className="text-[10px] font-semibold" style={{ color: "#f97316" }}>
                    ↑ {item.escalationCount} escalation{item.escalationCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <SheetTitle className="text-base leading-snug" style={{ color: "var(--foreground)" }}>
                {item.title}
              </SheetTitle>
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{item.detail}</p>
            </div>
          </div>

          {/* Meta strip */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
            {[
              { label: "Escalation ID", value: item.id },
              { label: "MHE Ref",       value: item.mheRef },
              { label: "Suite",         value: item.suite },
              { label: "Created",       value: item.createdAt },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{label}</p>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{value}</p>
              </div>
            ))}
          </div>
        </SheetHeader>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

          {/* Current SLA */}
          {!isResolved && (
            <div className="p-3 rounded-lg border border-border" style={{ background: "var(--card)" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Current SLA</p>
                <span className="text-xs font-bold" style={{ color: slaColor(item.slaPercent) }}>
                  {item.slaPercent <= 0 ? "Overdue" : `${item.slaPercent}% remaining`}
                </span>
              </div>
              <SLABar pct={item.slaPercent} />
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  Due: {item.dueAt}
                </span>
                <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  Resolve window: {LEVEL_META[item.currentLevel].resolve}
                </span>
              </div>
            </div>
          )}

          {/* Escalation Timeline */}
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>Escalation History</p>
            <EscalationTimeline history={item.history} />
          </div>

          {/* Add Note */}
          {!isResolved && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--foreground)" }}>Add Note</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add context, actions taken, or update..."
                rows={3}
                className="w-full text-xs rounded-md border border-border px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-primary"
                style={{ background: "var(--card)", color: "var(--foreground)" }}
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isResolved && (
          <div className="px-5 py-4 border-t border-border shrink-0 flex flex-col gap-2">
            <div className="flex gap-2">
              {item.status === "open" && (
                <Button size="sm" className="flex-1 h-8 text-xs">
                  <CheckCircle2 size={12} strokeWidth={1.5} />
                  Acknowledge
                </Button>
              )}
              {(item.status === "acknowledged" || item.status === "in_progress") && (
                <Button size="sm" className="flex-1 h-8 text-xs">
                  <CheckCircle2 size={12} strokeWidth={1.5} />
                  Mark Resolved
                </Button>
              )}
              {!isL4 && (
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs"
                  style={{ color: "#f97316", borderColor: "#f9741680" }}>
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                  Escalate to {item.currentLevel === "L1" ? "L2" : item.currentLevel === "L2" ? "L3" : "L4"}
                </Button>
              )}
              {isL4 && (
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs"
                  style={{ color: "#ef4444", borderColor: "#ef444480" }}>
                  <AlertTriangle size={12} strokeWidth={1.5} />
                  Flag Critical Breach
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                <User size={12} strokeWidth={1.5} />
                Reassign
              </Button>
              {note.trim() && (
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                  <MessageSquare size={12} strokeWidth={1.5} />
                  Save Note
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type TabKey = "active" | "pending_ack" | "resolved" | "all";

export function EscalationBoard() {
  const { pageTitle } = useSidebar();
  const [tab, setTab]             = useState<TabKey>("active");
  const [search, setSearch]       = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selected, setSelected]   = useState<EscalationItem | null>(null);
  const [collapsedLevels, setCollapsedLevels] = useState<Set<EscalationLevel>>(new Set());

  const filtered = useMemo(() => {
    return MOCK_ESCALATIONS.filter(item => {
      if (tab === "active")      return item.status !== "resolved";
      if (tab === "pending_ack") return item.status === "open";
      if (tab === "resolved")    return item.status === "resolved";
      return true;
    }).filter(item => {
      if (filterSource !== "all" && item.source !== filterSource) return false;
      if (filterSeverity !== "all" && item.severity !== filterSeverity) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.mheRef.toLowerCase().includes(q) ||
               item.id.toLowerCase().includes(q) || item.assignedTo.toLowerCase().includes(q);
      }
      return true;
    });
  }, [tab, search, filterSource, filterSeverity]);

  const byLevel = (level: EscalationLevel) =>
    filtered.filter(i => i.currentLevel === level && i.status !== "resolved");

  const totalActive  = MOCK_ESCALATIONS.filter(i => i.status !== "resolved").length;
  const totalPending = MOCK_ESCALATIONS.filter(i => i.status === "open").length;
  const totalBreached = MOCK_ESCALATIONS.filter(i => i.slaPercent <= 0 && i.status !== "resolved").length;
  const totalResolved = MOCK_ESCALATIONS.filter(i => i.status === "resolved").length;

  const TABS: { key: TabKey; label: string; count: number }[] = [
    { key: "active",      label: "Active",          count: totalActive  },
    { key: "pending_ack", label: "Pending Ack",     count: totalPending },
    { key: "resolved",    label: "Resolved",        count: totalResolved },
    { key: "all",         label: "All",             count: MOCK_ESCALATIONS.length },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Page header */}
      <div className="px-5 pt-5 pb-0 shrink-0">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Escalation Board</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Auto-escalates unresolved actions L1 → L2 → L3 → L4 based on SLA timers
            </p>
          </div>
          {/* Summary KPIs */}
          <div className="flex items-center gap-3 shrink-0">
            {[
              { label: "Active",    value: totalActive,   color: "var(--foreground)" },
              { label: "Breached",  value: totalBreached, color: "#ef4444" },
              { label: "Pending",   value: totalPending,  color: "#f59e0b" },
              { label: "Resolved",  value: totalResolved, color: "#22c55e" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center px-3 py-1.5 rounded-lg border border-border"
                style={{ background: "var(--card)", minWidth: 60 }}>
                <p className="text-base font-black leading-none" style={{ color }}>{value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors",
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent hover:text-foreground"
              )}
              style={{ color: tab === t.key ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              {t.label}
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )} style={{ background: tab === t.key ? "var(--primary)" : "var(--muted)", color: tab === t.key ? "var(--primary-foreground)" : "var(--muted-foreground)" }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-5 py-3 flex items-center gap-2 shrink-0 border-b border-border">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, title, MHE, assignee…"
            className="pl-8 h-8 text-xs"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <X size={12} style={{ color: "var(--muted-foreground)" }} />
            </button>
          )}
        </div>

        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="h-8 text-xs w-36">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="Safety">Safety</SelectItem>
            <SelectItem value="Inspection">Inspection</SelectItem>
            <SelectItem value="Compliance">Compliance</SelectItem>
            <SelectItem value="Impact">Impact</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="h-8 text-xs w-36">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs ml-auto" style={{ color: "var(--muted-foreground)" }}>
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Board content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {tab === "active" ? (
          <div className="flex flex-col gap-3">
            {(["L1", "L2", "L3", "L4"] as EscalationLevel[]).map(level => (
              <Swimlane
                key={level}
                level={level}
                items={byLevel(level)}
                onCardClick={setSelected}
                defaultOpen
              />
            ))}
          </div>
        ) : (
          // Flat grid for other tabs
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <CheckCircle2 size={32} style={{ color: "var(--muted-foreground)" }} strokeWidth={1} />
                <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>No escalations found</p>
              </div>
            ) : (
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                {filtered.map(item => (
                  <EscalationCard key={item.id} item={item} onClick={() => setSelected(item)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      <DetailDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
