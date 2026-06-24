import React, { useState, useMemo } from "react";
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
  FileText,
  Zap,
  X,
  Activity,
  Ban,
  Settings2,
} from "lucide-react";
import { cn } from "../../components/ui/utils";
import { ReassignModal } from "./ReassignModal";

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
  timeRemaining?: string;
  slaPercent?: number;
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
  slaPercent: number;
  escalationCount: number;
  history: HistoryNode[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_META: Record<EscalationLevel, { label: string; short: string; role: string; resolve: string; color: string; bg: string }> = {
  L1: { label: "Operator / Technician", short: "L1", role: "Operator",    resolve: "2h",  color: "#64748b", bg: "#64748b12" },
  L2: { label: "Supervisor",            short: "L2", role: "Supervisor",  resolve: "4h",  color: "#3b82f6", bg: "#3b82f612" },
  L3: { label: "Ops Manager",           short: "L3", role: "Ops Manager", resolve: "8h",  color: "#f59e0b", bg: "#f59e0b12" },
  L4: { label: "Director",              short: "L4", role: "Director",    resolve: "24h", color: "#ef4444", bg: "#ef444412" },
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
  Critical: "#ef4444",
  High:     "#f59e0b",
  Medium:   "#3b82f6",
  Low:      "#64748b",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ESCALATIONS: EscalationItem[] = [
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
      { level: "L1", role: "Admin Officer",         assignee: "Raj Patel",   initials: "RP", assignedAt: "Yesterday 3:00 PM", dueAt: "Yesterday 5:00 PM", outcome: "breached", comment: "SLA breached. No action taken." },
      { level: "L2", role: "Compliance Supervisor", assignee: "Neha Kapoor", initials: "NK", assignedAt: "Yesterday 5:02 PM", dueAt: "Today 9:00 AM",    outcome: "active", timeRemaining: "Overdue", slaPercent: 0 },
    ],
  },
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
      { level: "L1", role: "Safety Officer",     assignee: "Kavita Rao",  initials: "KR", assignedAt: "Yesterday 9:00 AM",  dueAt: "Yesterday 11:00 AM", outcome: "breached",  comment: "Operator not reachable. SLA missed." },
      { level: "L2", role: "Shift Supervisor",   assignee: "HR Team",     initials: "HR", assignedAt: "Yesterday 11:02 AM", dueAt: "Yesterday 3:00 PM",  outcome: "escalated", comment: "Acknowledged but could not suspend without ops sign-off." },
      { level: "L3", role: "Operations Manager", assignee: "Amit Desai",  initials: "AD", assignedAt: "Yesterday 3:05 PM",  dueAt: "Today 5:00 PM",      acknowledgedAt: "Yesterday 3:30 PM", outcome: "active", timeRemaining: "4h 20m", slaPercent: 40 },
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
      { level: "L1", role: "Safety Officer",     assignee: "Mohan Singh",  initials: "MS", assignedAt: "2d ago 10:00 AM", dueAt: "2d ago 12:00 PM",   outcome: "breached",  comment: "Not on shift during event." },
      { level: "L2", role: "Shift Supervisor",   assignee: "Anand Kumar",  initials: "AK", assignedAt: "2d ago 12:02 PM", dueAt: "2d ago 4:00 PM",    outcome: "escalated", comment: "Rack inspection ordered but ops manager approval needed." },
      { level: "L3", role: "Operations Manager", assignee: "Vijay Sharma", initials: "VS", assignedAt: "2d ago 4:05 PM",  dueAt: "Yesterday 6:00 PM", outcome: "active", timeRemaining: "Overdue", slaPercent: 0 },
    ],
  },
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
      { level: "L1", role: "Admin Officer",         assignee: "Pooja Naik",   initials: "PN", assignedAt: "3d ago 08:00",   dueAt: "3d ago 10:00",    outcome: "breached",  comment: "Missed SLA." },
      { level: "L2", role: "Compliance Supervisor", assignee: "Neha Kapoor",  initials: "NK", assignedAt: "3d ago 10:02",   dueAt: "3d ago 2:00 PM",  outcome: "escalated", comment: "Renewal requires director approval and vendor contact." },
      { level: "L3", role: "Operations Manager",    assignee: "Amit Desai",   initials: "AD", assignedAt: "3d ago 2:05 PM", dueAt: "2d ago 10:00 PM", outcome: "escalated", comment: "Vendor contacted. Waiting director authorization for emergency renewal." },
      { level: "L4", role: "Fleet Director",        assignee: "Ramesh Gupta", initials: "RG", assignedAt: "2d ago 10:08 PM", dueAt: "Today 11:59 PM", outcome: "active", timeRemaining: "6h 42m", slaPercent: 22 },
    ],
  },
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
      { level: "L1", role: "Maintenance Tech", assignee: "Tech. Amir Khan",  initials: "AK", assignedAt: "Yesterday 7:00 AM", dueAt: "Yesterday 9:00 AM", outcome: "escalated", comment: "Battery sourcing requires L2 budget approval." },
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slaColor(pct: number): string {
  if (pct <= 0)  return "#ef4444";
  if (pct < 25)  return "#ef4444";
  if (pct < 50)  return "#f59e0b";
  return "#22c55e";
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function SLABar({ pct, height = 6 }: { pct: number; height?: number }) {
  const col     = slaColor(pct);
  const breached = pct <= 0;
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: "var(--muted)" }}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", breached && "animate-pulse")}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: col }}
      />
    </div>
  );
}

function Avatar({ initials, size = "sm", color }: { initials: string; size?: "sm" | "md" | "lg"; color?: string }) {
  const sz = size === "lg" ? "w-10 h-10 text-sm" : size === "md" ? "w-8 h-8 text-xs" : "w-6 h-6 text-[10px]";
  return (
    <div className={cn("rounded-full flex items-center justify-center font-bold shrink-0 select-none", sz)}
      style={{ background: color ?? "var(--primary)", color: "#fff" }}>
      {initials}
    </div>
  );
}

function LevelBadge({ level, size = "sm" }: { level: EscalationLevel; size?: "sm" | "md" }) {
  const meta = LEVEL_META[level];
  if (size === "md") {
    return (
      <div className="flex items-center justify-center rounded-lg font-black text-sm w-10 h-10 shrink-0"
        style={{ background: meta.color, color: "#fff" }}>
        {level}
      </div>
    );
  }
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
      style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.color}30` }}>
      {level}
    </span>
  );
}

function SourceChip({ source }: { source: EscalationSource }) {
  const Icon  = SOURCE_ICON[source];
  const color = SOURCE_COLOR[source];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
      style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}>
      <Icon size={9} strokeWidth={2} />
      {source}
    </span>
  );
}

function SeverityChip({ severity }: { severity: Severity }) {
  const color = SEVERITY_COLOR[severity];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
      style={{ color, background: `${color}15` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      {severity}
    </span>
  );
}

function StatusPill({ status }: { status: EscalationStatus }) {
  const cfg: Record<EscalationStatus, { label: string; color: string; pulse?: boolean }> = {
    open:            { label: "Open",            color: "#64748b" },
    acknowledged:    { label: "Acknowledged",    color: "#3b82f6" },
    in_progress:     { label: "In Progress",     color: "#f59e0b", pulse: true },
    escalated:       { label: "Escalated",       color: "#f97316" },
    resolved:        { label: "Resolved",        color: "#22c55e" },
    critical_breach: { label: "Critical Breach", color: "#ef4444", pulse: true },
  };
  const { label, color, pulse } = cfg[status];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
      style={{ color, background: `${color}15` }}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: color }} />}
      {label}
    </span>
  );
}

// ─── Escalation Card ──────────────────────────────────────────────────────────

function EscalationCard({ item, onClick }: { item: EscalationItem; onClick: () => void }) {
  const breached   = item.slaPercent <= 0;
  const critBreach = item.status === "critical_breach";
  const activeNode = item.history[item.history.length - 1];
  const srcColor   = SOURCE_COLOR[item.source];
  const slaCol     = slaColor(item.slaPercent);
  const sevColor   = SEVERITY_COLOR[item.severity];
  const lvlColor   = LEVEL_META[item.currentLevel].color;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-xl cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        background: "var(--card)",
        border: `1.5px solid var(--border)`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
      }}
    >

      <div className="p-3.5 flex flex-col gap-2.5">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <SourceChip source={item.source} />
          <SeverityChip severity={item.severity} />
          <LevelBadge level={item.currentLevel} />
          <StatusPill status={item.status} />
          <span className="ml-auto text-[10px] font-mono tabular-nums shrink-0 opacity-60"
            style={{ color: "var(--foreground)" }}>
            {item.id}
          </span>
        </div>

        {/* Title */}
        <div>
          <p className="text-[13px] font-semibold leading-snug line-clamp-2 mb-0.5"
            style={{ color: "var(--foreground)" }}>
            {item.title}
          </p>
          <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>
            {item.detail}
          </p>
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
          style={{ background: `${lvlColor}0D` }}>
          <Avatar initials={item.assignedInitials} size="sm" color={lvlColor} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold truncate" style={{ color: "var(--foreground)" }}>
              {item.assignedTo}
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>
              {item.assignedRole}
            </p>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md shrink-0"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}>
            {item.mheRef}
          </span>
        </div>

        {/* SLA section */}
        <div className="pt-1 flex flex-col gap-1.5 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock size={11} strokeWidth={1.5} style={{ color: slaCol }} />
              <span className="text-[11px] font-bold" style={{ color: slaCol }}>
                {breached ? "SLA Overdue" : activeNode.timeRemaining ?? "—"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {item.escalationCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ color: "#f97316", background: "#f9741615" }}>
                  <ArrowUpRight size={9} strokeWidth={2.5} />
                  {item.escalationCount}×
                </span>
              )}
              <span className="text-[10px] font-bold tabular-nums" style={{ color: slaCol }}>
                {breached ? "—" : `${item.slaPercent}%`}
              </span>
            </div>
          </div>
          <SLABar pct={item.slaPercent} height={5} />
        </div>
      </div>
    </div>
  );
}

// ─── Swimlane ─────────────────────────────────────────────────────────────────

function Swimlane({ level, items, onCardClick }: {
  level: EscalationLevel;
  items: EscalationItem[];
  onCardClick: (item: EscalationItem) => void;
}) {
  const [open, setOpen]   = useState(true);
  const meta              = LEVEL_META[level];
  const breachedCount     = items.filter(i => i.slaPercent <= 0 || i.status === "critical_breach").length;

  return (
    <div className="rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${meta.color}30`,
        background: "var(--card)",
        boxShadow: breachedCount > 0 ? `0 0 0 1px ${meta.color}20` : "0 1px 3px rgba(0,0,0,0.04)",
      }}>

      {/* Header */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:opacity-90"
        style={{ background: `linear-gradient(90deg, ${meta.color}12, ${meta.color}04 70%, transparent)` }}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-lg font-black text-sm shrink-0"
          style={{ background: meta.color, color: "#fff" }}>
          {level}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
            {level} — {meta.label}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Resolve SLA: <strong>{meta.resolve}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {breachedCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ color: "#ef4444", background: "#ef444418" }}>
              <AlertTriangle size={10} strokeWidth={2} />
              {breachedCount} breached
            </span>
          )}
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{
              color: items.length ? meta.color : "var(--muted-foreground)",
              background: items.length ? meta.bg : "var(--muted)",
            }}>
            {items.length}
          </span>
          {open
            ? <ChevronDown  size={14} strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
            : <ChevronRight size={14} strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />}
        </div>
      </button>

      {open && (
        <div className="p-4 border-t" style={{ borderColor: `${meta.color}20` }}>
          {items.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-5" style={{ color: "var(--muted-foreground)" }}>
              <CheckCircle2 size={15} strokeWidth={1.5} />
              <p className="text-sm">No active escalations at this level</p>
            </div>
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
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

// ─── Timeline Node ────────────────────────────────────────────────────────────

function TimelineNode({ node, isLast }: { node: HistoryNode; isLast: boolean }) {
  const meta = LEVEL_META[node.level];
  const oc = {
    resolved:  { icon: CheckCircle2, color: "#22c55e", label: "Resolved"     },
    escalated: { icon: ArrowUpRight, color: "#f97316", label: "Escalated"    },
    breached:  { icon: Ban,          color: "#ef4444", label: "SLA Breached" },
    active:    { icon: Activity,     color: meta.color, label: "Active"      },
  }[node.outcome];
  const OcIcon = oc.icon;

  return (
    <div className="flex gap-3.5">
      {/* Spine */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 32 }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs"
          style={{ background: meta.color, color: "#fff" }}>
          {node.level}
        </div>
        {!isLast && (
          <div className="flex-1 w-px my-1.5" style={{ background: `${meta.color}40`, minHeight: 20 }} />
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 pb-5 min-w-0", isLast && "pb-1")}>
        <div className="flex items-center gap-2 mb-2">
          <Avatar initials={node.initials} size="sm" color={meta.color} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate" style={{ color: "var(--foreground)" }}>{node.assignee}</p>
            <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>{node.role}</p>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0"
            style={{ color: oc.color, background: `${oc.color}15` }}>
            <OcIcon size={10} strokeWidth={2} />
            {oc.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-2">
          <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
            Assigned <span className="font-semibold" style={{ color: "var(--foreground)" }}>{node.assignedAt}</span>
          </span>
          <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
            Due <span className="font-semibold"
              style={{ color: node.outcome === "breached" ? "#ef4444" : "var(--foreground)" }}>{node.dueAt}</span>
          </span>
          {node.acknowledgedAt && (
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              Ack <span className="font-semibold" style={{ color: "#22c55e" }}>{node.acknowledgedAt}</span>
            </span>
          )}
          {node.outcome === "active" && node.timeRemaining && (
            <span className="text-[10px] font-bold" style={{ color: slaColor(node.slaPercent ?? 0) }}>
              {node.timeRemaining === "Overdue" ? "⚠ Overdue" : `⏱ ${node.timeRemaining} left`}
            </span>
          )}
        </div>

        {node.outcome === "active" && node.slaPercent !== undefined && (
          <div className="mb-2"><SLABar pct={node.slaPercent} height={4} /></div>
        )}

        {node.comment && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg"
            style={{ background: "var(--muted)", borderLeft: `3px solid ${meta.color}50` }}>
            <MessageSquare size={10} strokeWidth={1.5} className="shrink-0 mt-0.5"
              style={{ color: "var(--muted-foreground)" }} />
            <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {node.comment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

function DetailDrawer({ item, onClose }: { item: EscalationItem | null; onClose: () => void }) {
  const [note, setNote]               = useState("");
  const [reassignOpen, setReassignOpen] = useState(false);

  if (!item) return null;

  const isResolved = item.status === "resolved";
  const isL4       = item.currentLevel === "L4";
  const srcColor   = SOURCE_COLOR[item.source];
  const lvlMeta    = LEVEL_META[item.currentLevel];
  const slaCol     = slaColor(item.slaPercent);
  const nextLevel  = item.currentLevel === "L1" ? "L2" : item.currentLevel === "L2" ? "L3" : "L4";

  return (
    <Sheet open={!!item} onOpenChange={v => { if (!v) { onClose(); setNote(""); } }}>
      <SheetContent
        side="right"
        className="w-full max-w-[540px] flex flex-col gap-0 p-0 overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        {/* Top color accent */}
        <div className="h-1 w-full shrink-0"
          style={{ background: `linear-gradient(90deg, ${srcColor}, ${srcColor}60, transparent)` }} />

        {/* Header */}
        <SheetHeader className="px-5 pt-4 pb-4 border-b border-border shrink-0"
          style={{ background: `linear-gradient(135deg, ${srcColor}09, transparent 55%)` }}>

          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <SourceChip source={item.source} />
            <SeverityChip severity={item.severity} />
            <LevelBadge level={item.currentLevel} />
            <StatusPill status={item.status} />
            {item.escalationCount > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ color: "#f97316", background: "#f9741618" }}>
                <ArrowUpRight size={9} strokeWidth={2.5} />
                {item.escalationCount}× escalated
              </span>
            )}
            <span className="ml-auto text-[10px] font-mono opacity-60" style={{ color: "var(--foreground)" }}>
              {item.id}
            </span>
          </div>

          <SheetTitle className="text-[15px] font-bold leading-snug mb-1" style={{ color: "var(--foreground)" }}>
            {item.title}
          </SheetTitle>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {item.detail}
          </p>

          {/* Meta grid */}
          <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
            {[
              { label: "ID",      value: item.id },
              { label: "MHE Ref", value: item.mheRef },
              { label: "Suite",   value: item.suite },
              { label: "Created", value: item.createdAt },
            ].map(({ label, value }) => (
              <div key={label} className="min-w-0">
                <p className="text-[9px] uppercase tracking-wide mb-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {label}
                </p>
                <p className="text-[11px] font-semibold truncate" style={{ color: "var(--foreground)" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Current assignee card */}
          <div className="flex items-center gap-3 mt-3 px-3 py-2.5 rounded-xl"
            style={{ background: `${lvlMeta.color}10`, border: `1px solid ${lvlMeta.color}25` }}>
            <Avatar initials={item.assignedInitials} size="md" color={lvlMeta.color} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{item.assignedTo}</p>
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                {item.assignedRole} · Currently assigned
              </p>
            </div>
            <LevelBadge level={item.currentLevel} size="md" />
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

          {/* SLA block */}
          {!isResolved && (
            <div className="rounded-xl p-4"
              style={{
                background: "var(--card)",
                border: `1px solid ${slaCol}35`,
              }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={13} strokeWidth={1.5} style={{ color: slaCol }} />
                  <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Current SLA</p>
                </div>
                <span className="text-sm font-black" style={{ color: slaCol }}>
                  {item.slaPercent <= 0 ? "OVERDUE" : `${item.slaPercent}% remaining`}
                </span>
              </div>
              <SLABar pct={item.slaPercent} height={8} />
              <div className="flex justify-between mt-2">
                <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  Due: <strong style={{ color: slaCol }}>{item.dueAt}</strong>
                </span>
                <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  Window: <strong>{lvlMeta.resolve}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-4 h-px shrink-0" style={{ background: "var(--border)" }} />
              <p className="text-xs font-bold whitespace-nowrap" style={{ color: "var(--foreground)" }}>
                Escalation History
              </p>
              <span className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>
            <div className="flex flex-col">
              {item.history.map((node, i) => (
                <TimelineNode key={i} node={node} isLast={i === item.history.length - 1} />
              ))}
            </div>
          </div>

          {/* Note */}
          {!isResolved && (
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Add Note</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add context, actions taken, or update…"
                rows={3}
                className="w-full text-xs rounded-xl border px-3 py-2.5 resize-none outline-none transition-colors"
                style={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)" }}
                onFocus={e  => { e.currentTarget.style.borderColor = srcColor; }}
                onBlur={e   => { e.currentTarget.style.borderColor = "var(--border)"; }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {!isResolved && (
          <div className="px-5 py-4 border-t border-border shrink-0 flex flex-col gap-2"
            style={{ background: "var(--card)" }}>
            <div className="flex gap-2">
              {item.status === "open" && (
                <Button size="sm" className="flex-1 h-9 text-xs font-semibold gap-1.5">
                  <CheckCircle2 size={13} strokeWidth={1.5} />
                  Acknowledge
                </Button>
              )}
              {(item.status === "acknowledged" || item.status === "in_progress") && (
                <Button size="sm" className="flex-1 h-9 text-xs font-semibold gap-1.5">
                  <CheckCircle2 size={13} strokeWidth={1.5} />
                  Mark Resolved
                </Button>
              )}
              {!isL4 && (
                <Button size="sm" variant="outline" className="flex-1 h-9 text-xs font-semibold gap-1.5"
                  style={{ color: "#f97316", borderColor: "#f9741660" }}>
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                  Escalate to {nextLevel}
                </Button>
              )}
              {isL4 && (
                <Button size="sm" variant="outline" className="flex-1 h-9 text-xs font-semibold gap-1.5"
                  style={{ color: "#ef4444", borderColor: "#ef444460" }}>
                  <AlertTriangle size={13} strokeWidth={1.5} />
                  Flag Critical Breach
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 h-9 text-xs font-bold gap-1.5"
                onClick={() => setReassignOpen(true)}
                style={{ background: "var(--foreground)", color: "var(--background)" }}>
                <User size={13} strokeWidth={1.5} />
                Reassign
              </Button>
              {note.trim() && (
                <Button size="sm" variant="outline" className="flex-1 h-9 text-xs gap-1.5">
                  <MessageSquare size={12} strokeWidth={1.5} />
                  Save Note
                </Button>
              )}
            </div>
          </div>
        )}

        <ReassignModal
          open={reassignOpen}
          onClose={() => setReassignOpen(false)}
          currentLevel={item.currentLevel}
          currentAssignee={item.assignedTo}
          escalationId={item.id}
          escalationTitle={item.title}
          onConfirm={(user, handoffNote) => {
            // In a real app: PATCH /api/escalations/:id/reassign
            console.log("Reassigned to:", user.name, "Note:", handoffNote);
            setReassignOpen(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="flex flex-col px-4 py-3 rounded-lg shrink-0"
      style={{ background: "var(--card)", border: "1px solid var(--border)", minWidth: 100 }}>
      <p className="text-[10px] font-semibold mb-2 uppercase tracking-wide"
        style={{ color: "var(--muted-foreground)", letterSpacing: "0.07em" }}>
        {label}
      </p>
      <p className="text-[28px] font-bold leading-none mb-1" style={{ color: "var(--foreground)" }}>
        {value}
      </p>
      <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{sub}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabKey = "active" | "pending_ack" | "resolved" | "all";

export function EscalationBoard() {
  const navigate                            = useNavigate();
  const [tab, setTab]                       = useState<TabKey>("active");
  const [search, setSearch]                 = useState("");
  const [filterSource, setFilterSource]     = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selected, setSelected]             = useState<EscalationItem | null>(null);

  const filtered = useMemo(() => {
    return MOCK_ESCALATIONS.filter(item => {
      if (tab === "active")      return item.status !== "resolved";
      if (tab === "pending_ack") return item.status === "open";
      if (tab === "resolved")    return item.status === "resolved";
      return true;
    }).filter(item => {
      if (filterSource   !== "all" && item.source   !== filterSource)   return false;
      if (filterSeverity !== "all" && item.severity !== filterSeverity) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q)     ||
          item.mheRef.toLowerCase().includes(q)    ||
          item.id.toLowerCase().includes(q)        ||
          item.assignedTo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tab, search, filterSource, filterSeverity]);

  const byLevel = (level: EscalationLevel) =>
    filtered.filter(i => i.currentLevel === level && i.status !== "resolved");

  const totalActive   = MOCK_ESCALATIONS.filter(i => i.status !== "resolved").length;
  const totalPending  = MOCK_ESCALATIONS.filter(i => i.status === "open").length;
  const totalBreached = MOCK_ESCALATIONS.filter(i => i.slaPercent <= 0 && i.status !== "resolved").length;
  const totalResolved = MOCK_ESCALATIONS.filter(i => i.status === "resolved").length;

  const TABS: { key: TabKey; label: string; count: number }[] = [
    { key: "active",      label: "Active",      count: totalActive   },
    { key: "pending_ack", label: "Pending Ack", count: totalPending  },
    { key: "resolved",    label: "Resolved",    count: totalResolved },
    { key: "all",         label: "All",         count: MOCK_ESCALATIONS.length },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--background)" }}>

      {/* Header */}
      <div className="px-6 pt-5 pb-0 shrink-0">
        {/* Title row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-[15px] font-bold leading-tight" style={{ color: "var(--foreground)" }}>
              Escalation Board
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Auto-escalates from L1 → L2 → L3 → L4 when SLA timers expire
            </p>
          </div>
          <button
            onClick={() => navigate("/mhe/escalation-settings")}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-border hover:bg-muted transition-colors"
            title="Notification Settings"
            style={{ background: "var(--card)" }}
          >
            <Settings2 size={14} strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <KpiCard label="Active"   value={totalActive}   sub={`${totalActive} open escalations`} />
          <KpiCard label="Breached" value={totalBreached} sub="SLA window exceeded" />
          <KpiCard label="Pending"  value={totalPending}  sub="Awaiting acknowledgement" />
          <KpiCard label="Resolved" value={totalResolved} sub="Closed this period" />
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-border">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-[13px] font-semibold border-b-2 transition-all",
                tab === t.key ? "border-foreground" : "border-transparent"
              )}
              style={{ color: tab === t.key ? "var(--foreground)" : "var(--muted-foreground)" }}
            >
              {t.label}
              <span
                className="min-w-[20px] h-[20px] flex items-center justify-center text-[11px] font-bold rounded-md px-1.5"
                style={{
                  background: tab === t.key ? "var(--foreground)" : "var(--muted)",
                  color: tab === t.key ? "var(--background)" : "var(--muted-foreground)",
                }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 flex items-center gap-3 shrink-0 border-b border-border"
        style={{ background: "var(--card)" }}>
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--muted-foreground)" }} />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ID, title, MHE, assignee…" className="pl-9 h-9 text-[12px]" />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
              <X size={12} />
            </button>
          )}
        </div>

        <div className="w-px h-5 bg-border" />

        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="h-9 text-[12px] w-36"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="Safety">Safety</SelectItem>
            <SelectItem value="Inspection">Inspection</SelectItem>
            <SelectItem value="Compliance">Compliance</SelectItem>
            <SelectItem value="Impact">Impact</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="h-9 text-[12px] w-36"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Item count badge */}
        <span className="ml-auto flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
          {filtered.length}
          <span className="text-[11px] font-normal" style={{ color: "var(--muted-foreground)" }}>
            {filtered.length === 1 ? "item" : "items"}
          </span>
        </span>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {tab === "active" ? (
          <div className="flex flex-col gap-3">
            {(["L1", "L2", "L3", "L4"] as EscalationLevel[]).map(level => (
              <Swimlane key={level} level={level} items={byLevel(level)} onCardClick={setSelected} />
            ))}
          </div>
        ) : (
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "var(--muted)" }}>
                  <CheckCircle2 size={22} strokeWidth={1} style={{ color: "var(--muted-foreground)" }} />
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                  No escalations found
                </p>
              </div>
            ) : (
              <div className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
                {filtered.map(item => (
                  <EscalationCard key={item.id} item={item} onClick={() => setSelected(item)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <DetailDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
