import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchActions, insertAction, updateActionStatus, subscribeToActions } from "../../lib/actions-db";
import { toast } from "sonner";
import { useSidebar } from "../../components/layout/SidebarLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../components/ui/calendar";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import {
  Plus,
  CheckCircle2,
  Inbox,
  GripVertical,
  X,
  Calendar as CalendarIcon,
  ArrowRight,
  Filter,
  ArrowUpRight,
  ChevronDown,
  Clock,
  Truck,
  User,
  Repeat,
  Send,
} from "lucide-react";
import { cn } from "../../components/ui/utils";
import {
  Suite,
  Severity,
  KanbanStatus,
  ActionSource,
  ActionType,
  IssueSource,
  Issue,
  Action,
  ActionFormPayload,
  KanbanColumn,
  KANBAN_COLUMNS,
  SUITE_COLORS,
  SEVERITY_COLORS,
} from "./types/action-board";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_ISSUES: Issue[] = [
  { id: "i1",  suite: "MEPS", severity: "Critical", issueSource: "Safety",     title: "Unauthorized / invalid operation",    detail: "MHE-003 · Bay 4 · Auth failure + wrong MHE type",         raisedAt: "5m ago",  isAssigned: false },
  { id: "i2",  suite: "MEPS", severity: "Critical", issueSource: "Safety",     title: "Unsafe operation detected",           detail: "MHE-001 · Overload: 2,100kg · Fork height unsafe",          raisedAt: "15m ago", isAssigned: false },
  { id: "i3",  suite: "MEPS", severity: "High",     issueSource: "Safety",     title: "Driving limit / fatigue risk",        detail: "Operator: Ajay Malhotra · 180 min continuous driving",       raisedAt: "1h ago",  isAssigned: false },
  { id: "i4",  suite: "MEPS", severity: "High",     issueSource: "Safety",     title: "Speed violation",                     detail: "Operator: Prashant Rao · MHE-005 · Zone B",                 raisedAt: "2h ago",  isAssigned: false },
  { id: "i5",  suite: "RTSS", severity: "Critical", issueSource: "Impact",     title: "Collision risk event",                detail: "MHE-008 · Impact: 12G · Zone C · 5 near-misses in 30 min",  raisedAt: "45m ago", isAssigned: false },
  { id: "i6",  suite: "RTSS", severity: "Critical", issueSource: "Safety",     title: "Pedestrian proximity breach",         detail: "MHE-007 · Cross-aisle junction · 0.6m clearance",           raisedAt: "2h ago",  isAssigned: false },
  { id: "i7",  suite: "RTSS", severity: "Critical", issueSource: "Safety",     title: "Repeat safety offender",              detail: "Operator: Deepak Singh · 5 violations this week",            raisedAt: "1h ago",  isAssigned: false },
  { id: "i8",  suite: "MMS",  severity: "Critical", issueSource: "Compliance", title: "Operator compliance issue",           detail: "Suresh Kumar · License expired · Vijay Nair · Medical expired", raisedAt: "5d ago", isAssigned: false },
  { id: "i9",  suite: "MMS",  severity: "Critical", issueSource: "Compliance", title: "MHE compliance issue",                detail: "MHE-011 · Fitness cert expired · MHE-006 · Insurance lapsed", raisedAt: "8d ago", isAssigned: false },
  { id: "i10", suite: "MMS",  severity: "Critical", issueSource: "Inspection", title: "System health issue",                 detail: "MHE-010 · Jetson offline · 68hr buffer · MHE-005 · LiDAR offline", raisedAt: "11h ago", isAssigned: false },
];

const MOCK_ACTIONS: Action[] = [
  { id: "a1", source: "system", issueId: "ix1", suite: "MEPS", issueSource: "Safety",     issueTitle: "Unauthorized / invalid operation",  issueDescription: "MHE-003 · Bay 4 · Auth failure + wrong MHE type",       issueLocation: "Bay 4",       title: "Investigate unauthorized MHE start",      priority: "Critical", assignedTo: "Rahul Sharma",   assignedAvatar: "RS", dueDate: "2026-04-02T15:00", dueDateDisplay: "Today, 3:00 PM",  status: "assigned",    isOverdue: false, notes: "Please pull the badge-swipe log for Bay 4 before speaking to the operator — this is his second flag this month.", createdAt: "2026-04-02T08:00", updatedAt: "2026-04-02T08:00" },
  { id: "a2", source: "system", issueId: "ix2", suite: "MMS",  issueSource: "Compliance", issueTitle: "MHE compliance issue",               issueDescription: "MHE-011 · Fitness cert expired · MHE-006 · Insurance",    issueLocation: "Fleet",       title: "Ground MHE-011 and renew certifications", priority: "Critical", assignedTo: "Neha Kapoor",    assignedAvatar: "NK", dueDate: "2026-04-02T17:00", dueDateDisplay: "Today, 5:00 PM",  status: "assigned",    isOverdue: false, notes: "", createdAt: "2026-04-02T07:00", updatedAt: "2026-04-02T07:00" },
  { id: "a3", source: "system", issueId: "ix3", suite: "RTSS", issueSource: "Impact",     issueTitle: "Collision risk event",               issueDescription: "MHE-008 · Impact: 12G · Zone D · 09:47 AM",               issueLocation: "Zone D",      title: "Review collision footage Zone D",          priority: "Critical", assignedTo: "Amit Desai",     assignedAvatar: "AD", dueDate: "2026-04-02T14:00", dueDateDisplay: "Today, 2:00 PM",  status: "in-progress", isOverdue: true,  notes: "", createdAt: "2026-04-02T06:00", updatedAt: "2026-04-02T10:00" },
  { id: "a4", source: "system", issueId: "ix4", suite: "RTSS", issueSource: "Safety",     issueTitle: "High-risk driver score",             issueDescription: "Operator: Mohan Verma · Safety score: 19% · Bottom 5%",   issueLocation: "Fleet",       title: "Suspend operator — safety score 19%",     priority: "Critical", assignedTo: "HR Team",        assignedAvatar: "HR", dueDate: "2026-04-01T17:00", dueDateDisplay: "Yesterday",        status: "in-progress", isOverdue: true,  notes: "", createdAt: "2026-04-01T09:00", updatedAt: "2026-04-02T09:00" },
  { id: "a5", source: "system", issueId: "ix5", suite: "MEPS", issueSource: "Safety",     issueTitle: "Speed violation",                   issueDescription: "Operator: Prashant Rao · MHE-005 · Zone B",                issueLocation: "Zone B",      title: "Speed violation coaching — Prashant Rao", priority: "High",     assignedTo: "Ops Manager",    assignedAvatar: "OM", dueDate: "2026-04-03T10:00", dueDateDisplay: "Tomorrow, 10 AM", status: "review",      isOverdue: false, notes: "", createdAt: "2026-04-02T05:00", updatedAt: "2026-04-02T11:00" },
  { id: "a6", source: "system", issueId: "ix6", suite: "MMS",  issueSource: "Inspection", issueTitle: "System health issue",               issueDescription: "MHE-010 · Jetson offline · 68hr buffer · MHE-005 LiDAR",  issueLocation: "MHE-010",     title: "Dispatch technician — Jetson Nano",       priority: "Critical", assignedTo: "IoT Team",       assignedAvatar: "IT", dueDate: "2026-04-02T13:00", dueDateDisplay: "Today, 1:00 PM",  status: "review",      isOverdue: true,  notes: "", createdAt: "2026-04-01T22:00", updatedAt: "2026-04-02T12:00" },
  { id: "a7", source: "system", issueId: "ix7", suite: "MMS",  issueSource: "Compliance", issueTitle: "Operator compliance issue",         issueDescription: "Suresh Kumar · License expired · Vijay Nair · Medical",   issueLocation: "Fleet",       title: "Renew operator license — Suresh Kumar",   priority: "High",     assignedTo: "Admin",          assignedAvatar: "AD", dueDate: "2026-04-02T00:00", dueDateDisplay: "02 Apr",           status: "done",        isOverdue: false, notes: "", createdAt: "2026-03-31T09:00", updatedAt: "2026-04-02T14:00" },
  { id: "a8", source: "system", issueId: "ix8", suite: "RTSS", issueSource: "Safety",     issueTitle: "Pedestrian proximity breach",       issueDescription: "MHE-007 · Cross-aisle junction · 0.6m clearance",         issueLocation: "Cross-aisle", title: "Fix pedestrian alert — Zone C",           priority: "High",     assignedTo: "Safety Officer", assignedAvatar: "SO", dueDate: "2026-04-03T00:00", dueDateDisplay: "03 Apr",           status: "done",        isOverdue: false, notes: "", createdAt: "2026-04-01T10:00", updatedAt: "2026-04-02T15:00" },
];

// ─── Helper Components ───────────────────────────────────────────────────────

function SuitePill({ suite }: { suite: Suite }) {
  const color = SUITE_COLORS[suite];
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color }}>
        {suite}
      </span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const color = SEVERITY_COLORS[severity];
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
      }}
    >
      {severity}
    </span>
  );
}

function Avatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <div
      className={cn("rounded-full flex items-center justify-center font-semibold shrink-0", sz)}
      style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
    >
      {initials}
    </div>
  );
}

// ─── Issue Card ──────────────────────────────────────────────────────────────

interface IssueCardProps {
  issue: Issue;
  onAssign: (issue: Issue) => void;
  onClick: (issue: Issue) => void;
  isDragging?: boolean;
}

function IssueCard({ issue, onAssign, onClick, isDragging }: IssueCardProps) {
  return (
    <div
      onClick={() => onClick(issue)}
      className={cn(
        "group bg-card border border-border rounded-lg cursor-pointer transition-all duration-150",
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-sm"
      )}
    >
      <div className="p-4 flex flex-col gap-3">
        {/* Suite + Severity */}
        <div className="flex items-center justify-between gap-2">
          <SuitePill suite={issue.suite} />
          <SeverityBadge severity={issue.severity} />
        </div>

        {/* Title + Detail */}
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-semibold leading-snug line-clamp-2" style={{ color: "var(--foreground)" }}>
            {issue.title}
          </p>
          <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
            {issue.detail}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
          <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
            {issue.raisedAt}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2.5 opacity-0 group-hover:opacity-100 transition-opacity gap-1"
            onClick={(e) => { e.stopPropagation(); onAssign(issue); }}
          >
            Assign
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Action Card ─────────────────────────────────────────────────────────────

interface ActionCardProps {
  action: Action;
  onClick: (action: Action) => void;
  onDragStart: (e: React.DragEvent, action: Action) => void;
}

function ActionCard({ action, onClick, onDragStart }: ActionCardProps) {
  const priorityColor = SEVERITY_COLORS[action.priority];
  const suiteColor = SUITE_COLORS[action.suite];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, action)}
      onClick={() => onClick(action)}
      className="group bg-card border border-border rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-sm"
    >
      <div className="p-4 flex flex-col gap-3">
        {/* Title + drag handle */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold leading-snug line-clamp-2 flex-1" style={{ color: "var(--foreground)" }}>
            {action.title}
          </p>
          <GripVertical className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-30 transition-opacity" style={{ color: "var(--muted-foreground)" }} />
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
            style={{ color: priorityColor, background: `color-mix(in srgb, ${priorityColor} 10%, transparent)` }}>
            {action.priority}
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded"
            style={{ color: suiteColor, background: `color-mix(in srgb, ${suiteColor} 10%, transparent)` }}>
            {action.suite}
          </span>
          {action.isOverdue && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
              style={{ color: "var(--destructive)", background: `color-mix(in srgb, var(--destructive) 10%, transparent)` }}>
              Overdue
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Assignee */}
        <div className="flex items-center gap-2.5">
          <Avatar initials={action.assignedAvatar} />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium truncate" style={{ color: "var(--foreground)" }}>{action.assignedTo}</p>
            <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--muted-foreground)" }}>{action.issueTitle}</p>
          </div>
        </div>

        {/* Due date */}
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5}
            style={{ color: action.isOverdue ? "var(--destructive)" : "var(--muted-foreground)" }} />
          <span className="text-[11px]"
            style={{ color: action.isOverdue ? "var(--destructive)" : "var(--muted-foreground)" }}>
            {action.dueDateDisplay || action.dueDate}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Generated Combination Cards ──────────────────────────────────────────────
// Every generated card always identifies a concrete MHE + Operator — a manager
// needs to know exactly who to assign the follow-up to, so we never render a
// vague "Fleet-wide"/"Unassigned" card. When the user hasn't filtered down to
// a specific MHE or Operator, one is deterministically resolved per event
// (mock "who most often triggers this event" lookup) so the card is still
// actionable. Explicit MHE/Operator filter selections override that and fan
// out into one card per selected value — multi-selecting any dimension
// produces separate cards, each counting only its own combination.

interface GeneratedCardData {
  key: string;
  comboId: string;
  event: string;
  mhe: string;
  operator: string;
  count: number;
}

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Reverses the "DD Mon YYYY, HH:mm" format AssignModal produces, so real
// overdue status/day-count can be computed from it later.
const DUE_DATE_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseAppDueDate(dueDateStr: string): Date | null {
  const m = /^(\d{2}) (\w{3}) (\d{4}), (\d{2}):(\d{2})$/.exec((dueDateStr ?? "").trim());
  if (!m) return null;
  const monthIdx = DUE_DATE_MONTHS.indexOf(m[2]);
  if (monthIdx === -1) return null;
  return new Date(Number(m[3]), monthIdx, Number(m[1]), Number(m[4]), Number(m[5]));
}

function daysOverdueFor(action: Action): number | null {
  if (!action.isOverdue) return null;
  const due = parseAppDueDate(action.dueDate);
  if (due) return Math.max(1, Math.ceil((Date.now() - due.getTime()) / (1000 * 60 * 60 * 24)));
  return (hashSeed(action.id) % 5) + 1; // legacy/mock actions with no parseable due date
}

function parseComboDetail(action: Action): { mhe?: string; count?: number } {
  if (!action.issueId?.startsWith("combo-")) return {};
  const detail = action.issueDetail ?? "";
  const mhe = detail.split(" · ")[0] || undefined;
  const countMatch = /(\d+) occurrence/.exec(detail);
  return { mhe, count: countMatch ? Number(countMatch[1]) : undefined };
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function resolvePick<T>(options: T[], seedKey: string): T {
  return options[hashSeed(seedKey) % options.length];
}

interface ComboData { event: string; mhe: string; operator: string; comboId: string }

function buildCombos(filters: ABFilters): ComboData[] {
  // Default view (no filters picked yet) shows every event type. Picking
  // specific Event Types / MHEs / Operators narrows the combination set;
  // any dimension left unpicked is resolved to a deterministic, specific
  // value rather than left blank. These are pre-assignment issues with no
  // due date yet, so they can never be "overdue" — Overdue-only empties this
  // list entirely rather than faking a status that can't apply here.
  if (filters.overdueOnly) return [];

  const eventList = filters.eventTypes.length ? filters.eventTypes : EVENT_TYPE_OPTIONS;

  const combos: ComboData[] = [];
  eventList.forEach(event => {
    const mheOptions = filters.mhe.length ? filters.mhe : [resolvePick(MHE_UNIT_OPTIONS, `mhe::${event}`)];
    mheOptions.forEach(mhe => {
      const opOptions = filters.operator.length ? filters.operator : [resolvePick(OPERATOR_OPTIONS, `operator::${event}::${mhe}`)];
      opOptions.forEach(operator => {
        const comboId = `${event}|${mhe}|${operator}`;
        combos.push({ event, mhe, operator, comboId });
      });
    });
  });
  return combos;
}

function comboTitle(c: { event: string; mhe: string; operator: string }): string {
  return `${c.event} · ${c.mhe} · ${c.operator}`;
}

function generatedCardFor(combo: ComboData, columnId: KanbanStatus): GeneratedCardData {
  const count = (hashSeed(`${combo.comboId}::${columnId}`) % 12) + 1;
  return { key: `${combo.comboId}::${columnId}`, comboId: combo.comboId, event: combo.event, mhe: combo.mhe, operator: combo.operator, count };
}

// Refined detail field — icon in a small filled gray badge, label as plain
// (not pilled) text, used for every meta field on a card: MHE, Operator,
// occurrence count, Assigned date, Due date.
function DetailField({ icon: Icon, tone = "default", children }: { icon: React.ElementType; tone?: "default" | "destructive"; children: React.ReactNode }) {
  const isDestructive = tone === "destructive";
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: isDestructive ? "color-mix(in srgb, var(--destructive) 15%, transparent)" : "var(--muted)" }}
      >
        <Icon className="w-3 h-3" strokeWidth={1.5} style={{ color: isDestructive ? "var(--destructive)" : "var(--muted-foreground)" }} />
      </span>
      <span className="text-[11.5px] font-medium" style={{ color: isDestructive ? "var(--destructive)" : "var(--foreground)" }}>
        {children}
      </span>
    </div>
  );
}

function GeneratedActionCard({ card, showAssign, onAssign }: { card: GeneratedCardData; showAssign: boolean; onAssign: () => void }) {
  return (
    <div className="group bg-card border border-border rounded-lg transition-all duration-150 ease-out hover:shadow-lg hover:shadow-black/30 dark:hover:shadow-black/60 hover:-translate-y-0.5 hover:border-foreground/30 overflow-hidden shrink-0">
      <div className="p-4 flex flex-col gap-3">
        <p className="text-[13px] font-semibold leading-snug line-clamp-2" style={{ color: "var(--foreground)" }}>
          {comboTitle(card)}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <DetailField icon={Truck}>{card.mhe}</DetailField>
          <DetailField icon={User}>{card.operator}</DetailField>
          <DetailField icon={Repeat}>{card.count}</DetailField>
        </div>

        {showAssign && (
          <div className="flex items-center justify-end pt-1 border-t border-border">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1"
              onClick={onAssign}
            >
              Assign
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Assigned Action Card ─────────────────────────────────────────────────────
// Once a manager assigns a generated card, it becomes a real Action and flows
// through Assigned → In Progress → Review → Done showing the manager's actual
// remark and due date instead of mock data. In Progress additionally surfaces
// how many days overdue it is.

function AssignedActionCard({ action, showOverdueDays }: { action: Action; showOverdueDays: boolean }) {
  const { mhe, count } = parseComboDetail(action);
  const overdueDays = showOverdueDays ? daysOverdueFor(action) : null;

  return (
    <div className="group bg-card border border-border rounded-lg transition-all duration-150 ease-out hover:shadow-lg hover:shadow-black/30 dark:hover:shadow-black/60 hover:-translate-y-0.5 hover:border-foreground/30 overflow-hidden shrink-0">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold leading-snug line-clamp-2 min-w-0" style={{ color: "var(--foreground)" }}>
            {action.issueTitle || action.title}
          </p>
          {count !== undefined && (
            <span
              className="text-[11px] font-semibold min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded shrink-0"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              {count}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {mhe && <DetailField icon={Truck}>{mhe}</DetailField>}
          <DetailField icon={User}>{action.assignedTo}</DetailField>
        </div>

        {action.notes && (
          <div className="px-2.5 py-2 rounded text-[11px] leading-relaxed" style={{ background: "var(--muted)" }}>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Note: </span>
            <span className="font-normal" style={{ color: "var(--foreground)" }}>{action.notes}</span>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-border">
          <DetailField icon={Send}>Assigned {formatShortDate(action.createdAt)}</DetailField>
          {showOverdueDays && overdueDays !== null ? (
            <DetailField icon={CalendarIcon} tone="destructive">
              Due {(action as Action & { dueDateDisplay?: string }).dueDateDisplay || action.dueDate} · {overdueDays}d overdue
            </DetailField>
          ) : (
            <DetailField icon={CalendarIcon}>
              Due {(action as Action & { dueDateDisplay?: string }).dueDateDisplay || action.dueDate}
            </DetailField>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Kanban Column ───────────────────────────────────────────────────────────

interface KanbanColumnProps {
  column: KanbanColumn;
  issues: Issue[];
  actions: Action[];
  onAssignIssue: (issue: Issue) => void;
  onIssueClick: (issue: Issue) => void;
  onActionClick: (action: Action) => void;
  onDragStart: (e: React.DragEvent, action: Action) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: KanbanStatus) => void;
  isDragOver: boolean;
  generatedCards?: GeneratedCardData[];
  onAssignCombo?: (card: GeneratedCardData) => void;
  assignedCards?: Action[];
}

function KanbanColumnComponent({
  column,
  issues,
  actions,
  onAssignIssue,
  onIssueClick,
  onActionClick,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
  generatedCards,
  onAssignCombo,
  assignedCards,
}: KanbanColumnProps) {
  const count = assignedCards ? assignedCards.length : generatedCards ? generatedCards.length : column.id === "incoming" ? issues.length : actions.length;

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border transition-colors duration-150 shrink-0",
        isDragOver ? "border-primary bg-primary/5" : "bg-muted/40"
      )}
      style={{ width: "320px", minHeight: "500px" }}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border rounded-t-lg sticky top-0 z-10"
        style={{ background: "var(--card)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: column.color }} />
          <span className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            {column.label}
          </span>
        </div>
        <span
          className="min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-bold rounded-md px-1.5"
          style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
        >
          {count}
        </span>
      </div>

      {/* Column Body */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {assignedCards ? (
          assignedCards.length === 0 ? (
            <EmptyState message="No actions in this stage" icon="check" />
          ) : (
            assignedCards.map((action) => (
              <AssignedActionCard
                key={action.id}
                action={action}
                showOverdueDays={column.id === "in-progress"}
              />
            ))
          )
        ) : generatedCards ? (
          generatedCards.length === 0 ? (
            <EmptyState message="No events for this combination" icon="inbox" />
          ) : (
            generatedCards.map((card) => (
              <GeneratedActionCard
                key={card.key}
                card={card}
                showAssign={column.id === "incoming"}
                onAssign={() => onAssignCombo?.(card)}
              />
            ))
          )
        ) : column.id === "incoming" ? (
          issues.length === 0 ? (
            <EmptyState message="No new issues" icon="inbox" />
          ) : (
            issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onAssign={onAssignIssue}
                onClick={onIssueClick}
              />
            ))
          )
        ) : (
          actions.length === 0 ? (
            <EmptyState message="No actions in this stage" icon="check" />
          ) : (
            actions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onClick={onActionClick}
                onDragStart={onDragStart}
              />
            ))
          )
        )}
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ message, icon }: { message: string; icon: "inbox" | "check" }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      {icon === "inbox" ? (
        <Inbox className="w-8 h-8" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
      ) : (
        <CheckCircle2 className="w-8 h-8" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
      )}
      <p className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
        {message}
      </p>
    </div>
  );
}



// Category options shown to user → auto-maps to Suite internally
const ISSUE_CATEGORIES = [
  { label: "Speed / Fatigue / Operator Behavior",  suite: "MEPS" as Suite },
  { label: "Unauthorized / Wrong MHE Usage",        suite: "MEPS" as Suite },
  { label: "Overload / Unsafe Operation",           suite: "MEPS" as Suite },
  { label: "Collision / Impact",                    suite: "RTSS" as Suite },
  { label: "Pedestrian / Human Safety Risk",        suite: "RTSS" as Suite },
  { label: "Near-Miss / High Risk Zone",            suite: "RTSS" as Suite },
  { label: "Rack / Infrastructure Damage",          suite: "RTSS" as Suite },
  { label: "License / Certificate Expiry",          suite: "MMS"  as Suite },
  { label: "MHE Maintenance / Service",             suite: "MMS"  as Suite },
  { label: "Sensor / Connectivity Issue",           suite: "MMS"  as Suite },
  { label: "Document Missing / Expired",            suite: "MMS"  as Suite },
  { label: "Other",                                 suite: "MEPS" as Suite },
];

// Location options — zones, bays, and fleet-wide
const LOCATION_OPTIONS = [
  { group: "Zones",  values: ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"] },
  { group: "Bays",   values: ["Bay 1", "Bay 2", "Bay 3", "Bay 4", "Bay 5", "Bay 6"] },
  { group: "Aisles", values: ["Aisle 1", "Aisle 2", "Aisle 3", "Aisle 4", "Aisle 5", "Aisle 6", "Aisle 7"] },
  { group: "Other",  values: ["Cross-aisle Junction", "Loading Dock", "Charging Bay", "Fleet-wide"] },
];

// MHE unit options — derived from known fleet
const MHE_UNIT_OPTIONS = [
  "MHE-001", "MHE-002", "MHE-003", "MHE-004", "MHE-005",
  "MHE-006", "MHE-007", "MHE-008", "MHE-009", "MHE-010", "MHE-011",
];

// Operator options — actual people only, no teams/roles
const OPERATOR_OPTIONS = [
  "Rahul Sharma", "Neha Kapoor", "Amit Desai",
];

// Event Type options — event_name column from event_types export
const EVENT_TYPE_OPTIONS = [
  "MHE MHE Proximity", "MHE RACK Proximity", "Object in Aisle", "Raised Fork Movement",
  "Speeding Restricted Zone", "Wet Surface", "Impact Events", "Continuous Driving",
  "Overspeed", "Harsh Acceleration", "Restricted Zone Entry", "Idle With Load",
  "Aisle Congestion", "Smooth Accel", "Smooth Brake", "Consistent Speed", "Erratic Speed",
  "Optimal Speed", "Too Slow", "Safe Loaded Operation", "Excessive Idle", "Low Idle",
  "Speed Adherence", "Minor Speeding", "Major Speeding", "Authorized Only", "Break Compliance",
  "Insufficient Breaks", "Excessive Breaks", "Loaded Zone Compliance", "Clean Session",
  "Consecutive Clean", "Zone Compliance Streak", "No Helmet Detected", "Harsh Braking",
  "No Vest Detected", "Jerk", "RT Ratio Exceeded", "Pedestrian MHE Proximity",
];

// Event Type → primary event_category from the event_types export — used to
// derive a suite/severity when assigning a generated combination card.
const EVENT_TYPE_CATEGORY: Record<string, string> = {
  "MHE MHE Proximity": "NearMiss",
  "MHE RACK Proximity": "NearMiss",
  "Object in Aisle": "NearMiss",
  "Raised Fork Movement": "NearMiss",
  "Speeding Restricted Zone": "NearMiss",
  "Wet Surface": "NearMiss",
  "Impact Events": "Impact",
  "Continuous Driving": "Behavior",
  "Overspeed": "SafetyViolation",
  "Harsh Acceleration": "SafetyViolation",
  "Restricted Zone Entry": "SafetyViolation",
  "Idle With Load": "SafetyViolation",
  "Aisle Congestion": "SafetyViolation",
  "Smooth Accel": "Skill",
  "Smooth Brake": "Skill",
  "Consistent Speed": "Skill",
  "Erratic Speed": "Skill",
  "Optimal Speed": "Skill",
  "Too Slow": "Skill",
  "Safe Loaded Operation": "Skill",
  "Excessive Idle": "Skill",
  "Low Idle": "Skill",
  "Speed Adherence": "Behavior",
  "Minor Speeding": "Behavior",
  "Major Speeding": "Behavior",
  "Authorized Only": "Behavior",
  "Break Compliance": "Behavior",
  "Insufficient Breaks": "Behavior",
  "Excessive Breaks": "Behavior",
  "Loaded Zone Compliance": "Behavior",
  "Clean Session": "Behavior",
  "Consecutive Clean": "Behavior",
  "Zone Compliance Streak": "Behavior",
  "No Helmet Detected": "Behavior",
  "Harsh Braking": "SafetyViolation",
  "No Vest Detected": "Behavior",
  "Jerk": "SafetyViolation",
  "RT Ratio Exceeded": "SafetyViolation",
  "Pedestrian MHE Proximity": "NearMiss",
};

// event_category → accent color, so the card's severity reads at a glance
const EVENT_CATEGORY_COLOR: Record<string, string> = {
  NearMiss: "var(--warning)",
  Impact: "var(--destructive)",
  SafetyViolation: "var(--destructive)",
  Skill: "var(--chart-1)",
  Behavior: "var(--chart-2)",
};

// event_category → priority, so the Priority filter has something concrete
// to narrow generated cards by
const EVENT_CATEGORY_PRIORITY: Record<string, Severity> = {
  NearMiss: "Critical",
  Impact: "Critical",
  SafetyViolation: "High",
  Behavior: "Medium",
  Skill: "Low",
};

function eventPriority(event: string): Severity {
  return EVENT_CATEGORY_PRIORITY[EVENT_TYPE_CATEGORY[event]] ?? "Medium";
}

// ─── Create Action Modal ──────────────────────────────────────────────────────

interface CreateActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: ActionFormPayload) => void;
}

function CreateActionModal({ open, onClose, onConfirm }: CreateActionModalProps) {
  // Observed issue
  const [category, setCategory] = useState("");           // user-facing label
  const [issueDescription, setIssueDescription] = useState("");
  const [issueLocation, setIssueLocation] = useState("");
  const [issueMhe, setIssueMhe] = useState("");
  const [severity, setSeverity] = useState<Severity>("High");

  // Action
  const [actionType, setActionType] = useState<ActionType>("Safety");
  const [actionTitle, setActionTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDateObj, setDueDateObj] = useState<Date | undefined>(undefined);
  const [dueTime, setDueTime] = useState("09:00");
  const [notes, setNotes] = useState("");

  // Derive suite from selected category — never shown to user
  const derivedSuite: Suite = ISSUE_CATEGORIES.find(c => c.label === category)?.suite ?? "MEPS";

  const reset = () => {
    setCategory(""); setIssueDescription(""); setIssueLocation(""); setIssueMhe("");
    setSeverity("High"); setActionType("Safety"); setActionTitle("");
    setAssignedTo(""); setDueDateObj(undefined); setDueTime("09:00"); setNotes("");
  };

  const canSubmit = category && issueDescription.trim() && actionTitle.trim() && assignedTo;

  const handleConfirm = () => {
    if (!canSubmit) return;
    const dueDateStr = dueDateObj
      ? `${dueDateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}, ${dueTime}`
      : "TBD";
    onConfirm({
      source: "manual",
      issueId: "",
      issueTitle: issueDescription.trim(),
      issueDetail: [category, issueLocation, issueMhe].filter(Boolean).join(" · "),
      suite: derivedSuite,
      severity,
      actionType,
      title: actionTitle.trim(),
      assignedTo,
      priority: severity,
      dueDate: dueDateStr,
      notes,
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Create Action</DialogTitle>
          <DialogDescription className="text-xs">
            Log an observed issue and assign an action to resolve it
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">

          {/* Category — user-friendly, derives suite */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Issue Category <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="What type of issue did you observe?" />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_CATEGORIES.map(c => (
                  <SelectItem key={c.label} value={c.label}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description + Location + Severity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              What did you observe? <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Describe what you saw..."
              value={issueDescription}
              onChange={e => setIssueDescription(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
            />
          </div>

          <div className="flex gap-2">
            {/* Location select */}
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Location</label>
              <Select value={issueLocation} onValueChange={setIssueLocation}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  {LOCATION_OPTIONS.map(group => (
                    <React.Fragment key={group.group}>
                      <div className="px-2 py-1 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>{group.group}</div>
                      {group.values.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* MHE unit select */}
            <div className="flex flex-col gap-1.5 w-[130px]">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>MHE Unit</label>
              <Select value={issueMhe} onValueChange={setIssueMhe}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="MHE-···" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None / N/A</SelectItem>
                  {MHE_UNIT_OPTIONS.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5 w-[100px]">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Severity</label>
              <Select value={severity} onValueChange={v => setSeverity(v as Severity)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1" style={{ color: "var(--muted-foreground)" }}>Action to Resolve</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
          </div>

          {/* Action Type + Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Action Type <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <Select value={actionType} onValueChange={v => setActionType(v as ActionType)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Operational">Operational</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Action to Take <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <Input
              className="h-9 text-sm"
              placeholder="What needs to be done?"
              value={actionTitle}
              onChange={e => setActionTitle(e.target.value)}
            />
          </div>

          {/* Assign To + Due Date */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Assign To <span style={{ color: "var(--destructive)" }}>*</span>
              </label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {["Rahul Sharma","Neha Kapoor","Amit Desai","Safety Officer","Ops Manager","HR Team","IoT Team","Admin"].map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Due Date</label>
              <div className="flex gap-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 px-3 text-sm font-normal gap-1.5"
                      style={{ color: dueDateObj ? "var(--foreground)" : "var(--muted-foreground)", minWidth: "100px" }}
                    >
                      <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                      {dueDateObj
                        ? dueDateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                        : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker mode="single" selected={dueDateObj} onSelect={setDueDateObj} initialFocus />
                  </PopoverContent>
                </Popover>
                <Select value={dueTime} onValueChange={setDueTime}>
                  <SelectTrigger className="h-9 text-sm w-20"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Notes <span className="font-normal text-xs" style={{ color: "var(--muted-foreground)" }}>(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Any additional context..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => { onClose(); reset(); }}>Cancel</Button>
          <Button size="sm" className="h-9" disabled={!canSubmit} onClick={handleConfirm}>Create Action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Assign Modal ─────────────────────────────────────────────────────────────

interface AssignModalProps {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: ActionFormPayload) => void;
  presetAssignee?: string;
}

function AssignModal({ issue, open, onClose, onConfirm, presetAssignee }: AssignModalProps) {
  const [actionType, setActionType] = useState<ActionType>("Safety");
  const [priority, setPriority] = useState<Severity>("High");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDateObj, setDueDateObj] = useState<Date | undefined>(undefined);
  const [dueTime, setDueTime] = useState("09:00");
  const [notes, setNotes] = useState("");

  useEffect(() => { if (issue) { setPriority(issue.severity); setAssignedTo(presetAssignee ?? ""); } }, [issue, presetAssignee]);

  const reset = () => {
    setActionType("Safety"); setPriority("High"); setAssignedTo("");
    setDueDateObj(undefined); setDueTime("09:00"); setNotes("");
  };

  const handleConfirm = () => {
    if (!issue || !assignedTo) return;
    const dueDateStr = dueDateObj
      ? `${dueDateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}, ${dueTime}`
      : "TBD";
    onConfirm({
      source: "system",
      issueId: issue.id,
      issueTitle: issue.title,
      issueDetail: issue.detail,
      suite: issue.suite,
      severity: issue.severity,
      actionType,
      title: `Resolve: ${issue.title}`,
      assignedTo,
      priority,
      dueDate: dueDateStr,
      notes,
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Assign Action</DialogTitle>
          <DialogDescription className="text-xs">
            Assign a responsible person and due date for this action item
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">

          {/* Issue info */}
          {issue && (
            <div className="flex items-center gap-2 pb-1">
              <span className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                {issue.title}
              </span>
            </div>
          )}

          {/* Issue context — read only */}
          {issue && (
            <div
              className="px-3 py-2.5 rounded text-xs"
              style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", borderLeft: `3px solid ${SEVERITY_COLORS[issue.severity]}` }}
            >
              {issue.detail}
            </div>
          )}

          {/* Action Type + Priority side by side */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Action Type</label>
              <Select value={actionType} onValueChange={v => setActionType(v as ActionType)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Severity)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assign To */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Assign To <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select person or team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rahul Sharma">Rahul Sharma</SelectItem>
                <SelectItem value="Neha Kapoor">Neha Kapoor</SelectItem>
                <SelectItem value="Amit Desai">Amit Desai</SelectItem>
                <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                <SelectItem value="Ops Manager">Ops Manager</SelectItem>
                <SelectItem value="HR Team">HR Team</SelectItem>
                <SelectItem value="IoT Team">IoT Team</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Due Date</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 h-9 justify-start text-sm font-normal gap-2"
                    style={{ color: dueDateObj ? "var(--foreground)" : "var(--muted-foreground)" }}
                  >
                    <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                    {dueDateObj ? dueDateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="single" selected={dueDateObj} onSelect={setDueDateObj} initialFocus />
                </PopoverContent>
              </Popover>
              <Select value={dueTime} onValueChange={setDueTime}>
                <SelectTrigger className="h-9 text-sm w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Notes (optional)</label>
            <textarea
              className="w-full rounded border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--input-background)",
                color: "var(--foreground)",
                minHeight: "72px",
              }}
              placeholder="Add context or instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleConfirm} disabled={!assignedTo}>
            Create Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Filter Sheet ─────────────────────────────────────────────────────────────
// Mirrors the Incident Actions filter sheet (same fields, controls, and layout),
// wired to the closest equivalent Issue/Action fields available on this board:
// Event Types → Issue Source, Operator → Assigned To.

interface ABFilters {
  operator: string[];
  mhe: string[];
  eventTypes: string[];
  status: KanbanStatus[];
  overdueOnly: boolean;
}

const EMPTY_AB_FILTERS: ABFilters = {
  operator: [], mhe: [], eventTypes: [], status: [], overdueOnly: false,
};

function toggleInArray<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

function issueMatchesFilters(issue: Issue, f: ABFilters): boolean {
  const title = issue.title ?? "";
  const detail = issue.detail ?? "";
  if (f.mhe.length && !f.mhe.some(u => detail.includes(u))) return false;
  if (f.operator.length) return false; // issues aren't assigned yet
  if (f.eventTypes.length && !f.eventTypes.some(e => title.includes(e) || detail.includes(e))) return false;
  if (f.status.length) return false; // issues have no kanban status yet
  if (f.overdueOnly) return false; // issues can't be overdue
  return true;
}

function actionMatchesFilters(action: Action, f: ABFilters): boolean {
  const issueTitle = action.issueTitle ?? "";
  const issueDetail = action.issueDetail ?? "";
  const title = action.title ?? "";
  if (f.mhe.length && !f.mhe.some(u => issueDetail.includes(u))) return false;
  if (f.operator.length && !f.operator.includes(action.assignedTo)) return false;
  if (f.eventTypes.length && !f.eventTypes.some(e => issueTitle.includes(e) || issueDetail.includes(e) || title.includes(e))) return false;
  if (f.status.length && !f.status.includes(action.status)) return false;
  if (f.overdueOnly && !action.isOverdue) return false;
  return true;
}

// Wrapping pill row — used for secondary, longer-list filters
function FilterPill<T extends string>({ label, active, onClick }: { label: T; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors"
      style={{
        borderColor: active ? "var(--foreground)" : "var(--border)",
        background: active ? "var(--foreground)" : "transparent",
        color: active ? "var(--background)" : "var(--foreground)",
      }}
    >
      {label}
    </button>
  );
}

// Dropdown with checkboxes — used where multiple concrete values can be selected at once
function MultiSelectDropdown({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (next: string[]) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full h-9 flex items-center justify-between px-3 rounded-md border border-border text-[12px] bg-background">
          <span style={{ color: selected.length ? "var(--foreground)" : "var(--muted-foreground)" }}>
            {selected.length ? `${selected.length} selected` : `All ${label}s`}
          </span>
          <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--muted-foreground)" }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-64 overflow-y-auto p-1"
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        {options.map(o => (
          <CheckboxRow key={o} value={o} checked={selected.includes(o)} onToggle={() => onChange(toggleInArray(selected, o))} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CheckboxRow({ value, checked, onToggle }: { value: string; checked: boolean; onToggle: () => void }) {
  return (
    <DropdownMenuItem
      onSelect={e => { e.preventDefault(); onToggle(); }}
      className={cn("gap-2.5 py-2", checked && "bg-accent")}
    >
      <Checkbox checked={checked} />
      <span className="text-[13px]">{value}</span>
    </DropdownMenuItem>
  );
}

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: ABFilters;
  setFilters: (f: ABFilters) => void;
  issues: Issue[];
  actions: Action[];
}

function FilterSheet({ open, onClose, filters, setFilters, issues, actions }: FilterSheetProps) {
  const [draft, setDraft] = useState<ABFilters>(filters);
  useEffect(() => { if (open) setDraft(filters); }, [open, filters]);

  const hasDraftFilters = draft.operator.length + draft.mhe.length + draft.eventTypes.length + draft.status.length > 0
    || draft.overdueOnly;

  const totalCount = issues.length + actions.length;
  const liveCount = issues.filter(i => issueMatchesFilters(i, draft)).length
    + actions.filter(a => actionMatchesFilters(a, draft)).length;

  return (
    <Sheet open={open} onOpenChange={o => !o && onClose()}>
      <SheetContent side="right" className="w-[380px] flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-[15px]">Filters</SheetTitle>
            {hasDraftFilters && (
              <button
                onClick={() => setDraft(EMPTY_AB_FILTERS)}
                className="text-[12px] font-medium hover:underline"
                style={{ color: "var(--chart-1)" }}
              >
                Clear all
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>MHE</div>
            <MultiSelectDropdown
              label="MHE"
              options={MHE_UNIT_OPTIONS}
              selected={draft.mhe}
              onChange={v => setDraft({ ...draft, mhe: v })}
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>Operator</div>
            <MultiSelectDropdown
              label="Operator"
              options={OPERATOR_OPTIONS}
              selected={draft.operator}
              onChange={v => setDraft({ ...draft, operator: v })}
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>Issue Types</div>
            <MultiSelectDropdown
              label="Issue Type"
              options={EVENT_TYPE_OPTIONS}
              selected={draft.eventTypes}
              onChange={v => setDraft({ ...draft, eventTypes: v })}
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>Status</div>
            <div className="flex flex-wrap gap-2">
              {(["assigned", "in-progress", "review", "done"] as KanbanStatus[]).map(s => (
                <FilterPill key={s} label={s} active={draft.status.includes(s)}
                  onClick={() => setDraft({ ...draft, status: toggleInArray(draft.status, s) })} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>Urgency</div>
            <button
              onClick={() => setDraft({ ...draft, overdueOnly: !draft.overdueOnly })}
              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors"
              style={{
                borderColor: draft.overdueOnly ? "var(--destructive)" : "var(--border)",
                background: draft.overdueOnly ? "var(--destructive)" : "transparent",
                color: draft.overdueOnly ? "var(--background)" : "var(--foreground)",
              }}
            >
              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              Overdue only
            </button>
          </div>
        </div>

        <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-between">
          <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
            {liveCount} of {totalCount} results{hasDraftFilters ? " · filtered" : ""}
          </span>
          <Button className="h-9 px-4 text-[12px] font-semibold" onClick={() => { setFilters(draft); onClose(); }}>
            Apply Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Detail Sheet ─────────────────────────────────────────────────────────────

interface DetailSheetProps {
  item: Issue | Action | null;
  type: "issue" | "action" | null;
  open: boolean;
  onClose: () => void;
  onAssign?: (issue: Issue) => void;
}

function DetailSheet({ item, type, open, onClose, onAssign }: DetailSheetProps) {
  if (!item) return null;

  const isIssue = type === "issue";
  const issue = isIssue ? (item as Issue) : null;
  const action = !isIssue ? (item as Action) : null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[420px] p-0 flex flex-col">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
          <SheetTitle className="text-[13px] font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            {isIssue ? "Issue Details" : "Action Details"}
          </SheetTitle>
          <div className="flex items-center gap-1.5 flex-wrap">
            {isIssue && issue && (
              <>
                <SuitePill suite={issue.suite} />
                <SeverityBadge severity={issue.severity} />
              </>
            )}
            {!isIssue && action && (
              <>
                <SuitePill suite={action.suite} />
                <SeverityBadge severity={action.priority} />
                {action.isOverdue && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
                    style={{ color: "var(--destructive)", background: "color-mix(in srgb, var(--destructive) 10%, transparent)" }}>
                    Overdue
                  </span>
                )}
              </>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-border">

          {/* Title + context */}
          <div className="px-5 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                {isIssue ? "Issue" : "Action"}
              </p>
              <p className="text-[14px] font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
                {isIssue ? issue!.title : action!.title}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                {isIssue ? "Details" : "Linked Issue"}
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                {isIssue ? issue!.detail : action!.linkedIssue}
              </p>
            </div>
          </div>

          {/* Action-specific fields */}
          {!isIssue && action && (
            <>
              <div className="px-5 py-5 grid grid-cols-2 gap-x-6 gap-y-5">
                {/* Assigned to */}
                <div className="col-span-2 flex flex-col gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                    Assigned To
                  </p>
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={action.assignedAvatar} size="md" />
                    <span className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{action.assignedTo}</span>
                  </div>
                </div>

                {/* Due date */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Due Date</p>
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5}
                      style={{ color: action.isOverdue ? "var(--destructive)" : "var(--muted-foreground)" }} />
                    <span className="text-[12px]" style={{ color: action.isOverdue ? "var(--destructive)" : "var(--foreground)" }}>
                      {action.dueDateDisplay || action.dueDate}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Status</p>
                  <span className="text-[12px] font-medium capitalize" style={{ color: "var(--foreground)" }}>
                    {action.status.replace("-", " ")}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Activity */}
          <div className="px-5 py-5 flex flex-col gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Activity</p>
            <div className="flex flex-col gap-0">
              {[
                { time: "Just now", text: "Issue detected by system" },
                { time: "5m ago",   text: "Notification sent to supervisors" },
                { time: "10m ago",  text: "Issue escalated — severity: Critical" },
              ].map((entry, i, arr) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: "var(--border)", border: "1.5px solid var(--muted-foreground)" }} />
                    {i < arr.length - 1 && <div className="w-px flex-1 my-1" style={{ background: "var(--border)" }} />}
                  </div>
                  <div className="pb-4">
                    <p className="text-[12px] font-medium" style={{ color: "var(--foreground)" }}>{entry.text}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        {isIssue && onAssign && issue && (
          <div className="px-5 py-4 border-t border-border shrink-0">
            <Button
              className="w-full h-9 font-semibold gap-1.5"
              onClick={() => { onClose(); onAssign(issue); }}
            >
              Assign Action
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ActionBoard1() {
  const sidebar = useSidebar();

  // State — must be declared before any useEffect that references them
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [actions, setActions] = useState<Action[]>(MOCK_ACTIONS);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [filters, setFilters] = useState<ABFilters>(EMPTY_AB_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  // Modal / Sheet
  const [assignTarget, setAssignTarget] = useState<Issue | null>(null);
  const [presetAssignee, setPresetAssignee] = useState<string | undefined>(undefined);
  const [detailItem, setDetailItem] = useState<Issue | Action | null>(null);
  const [detailType, setDetailType] = useState<"issue" | "action" | null>(null);

  // Drag state
  const [createOpen, setCreateOpen] = useState(false);
  const [dragAction, setDragAction] = useState<Action | null>(null);
  const [dragOverCol, setDragOverCol] = useState<KanbanStatus | null>(null);

  // Clear header actions on unmount
  useEffect(() => {
    return () => {
      if (sidebar) sidebar.setHeaderActions(null);
    };
  }, [sidebar]);

  // ── Load actions from Supabase + subscribe to realtime ────────────────────
  useEffect(() => {
    fetchActions()
      .then(data => { setActions(data); setDbLoaded(true); })
      .catch(() => setDbLoaded(true)); // fall back to mock data on error

    const unsubscribe = subscribeToActions(data => setActions(data));
    return unsubscribe;
  }, []);



  // ── Filtered data ─────────────────────────────────────────────────────────
  const filteredIssues = issues.filter(i => issueMatchesFilters(i, filters));

  const filteredActions = (status: KanbanStatus) =>
    actions.filter(a => a.status === status && actionMatchesFilters(a, filters));

  // ── Unified action handler ───────────────────────────────────────────────
  const handleActionConfirm = async (payload: ActionFormPayload) => {
    const initials = payload.assignedTo.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
    const dueDate = payload.dueDate || "TBD";
    const parsedDue = parseAppDueDate(dueDate);
    const newAction: Action = {
      id: `a${Date.now()}`,
      source: payload.source,
      issueId: payload.issueId,
      issueTitle: payload.issueTitle,
      issueDetail: payload.issueDetail,
      suite: payload.suite,
      severity: payload.severity,
      issueSource: payload.issueSource,
      actionType: payload.actionType,
      title: payload.title,
      priority: payload.priority,
      assignedTo: payload.assignedTo,
      assignedAvatar: initials,
      dueDate,
      notes: payload.notes ?? "",
      status: "assigned",
      isOverdue: parsedDue ? parsedDue.getTime() < Date.now() : false,
      createdAt: new Date().toISOString(),
      createdBy: "user",
    };
    // Optimistic update
    setActions(prev => [newAction, ...prev]);
    if (payload.source === "system" && payload.issueId) {
      setIssues(prev => prev.filter(i => i.id !== payload.issueId));
    }
    setAssignTarget(null);
    setCreateOpen(false);
    toast.success(
      payload.source === "system" ? "Action assigned" : "Action created",
      { description: `${payload.title} → ${payload.assignedTo}` }
    );
    // Persist to Supabase
    try {
      await insertAction(newAction);
    } catch {
      toast.error("Failed to save action — will retry on next refresh");
    }
  };

    // ── Drag & Drop ───────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, action: Action) => {
    setDragAction(action);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, status: KanbanStatus) => {
    e.preventDefault();
    if (!dragAction || status === "incoming") return;
    const id = dragAction.id;
    // Optimistic update
    setActions(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setDragAction(null);
    setDragOverCol(null);
    // Persist to Supabase
    try {
      await updateActionStatus(id, status);
    } catch {
      toast.error("Failed to update status — please refresh");
    }
  };

  const activeFilterCount = filters.operator.length + filters.mhe.length + filters.eventTypes.length
    + filters.status.length + (filters.overdueOnly ? 1 : 0);

  type FilterChip = { key: string; label: string; onRemove: () => void };
  const filterChips: FilterChip[] = [];
  filters.mhe.forEach(v => filterChips.push({ key: `mhe-${v}`, label: `MHE: ${v}`, onRemove: () => setFilters({ ...filters, mhe: filters.mhe.filter(x => x !== v) }) }));
  filters.operator.forEach(v => filterChips.push({ key: `operator-${v}`, label: `Operator: ${v}`, onRemove: () => setFilters({ ...filters, operator: filters.operator.filter(x => x !== v) }) }));
  filters.eventTypes.forEach(v => filterChips.push({ key: `event-${v}`, label: `Issue: ${v}`, onRemove: () => setFilters({ ...filters, eventTypes: filters.eventTypes.filter(x => x !== v) }) }));
  filters.status.forEach(v => filterChips.push({ key: `status-${v}`, label: `Status: ${v}`, onRemove: () => setFilters({ ...filters, status: filters.status.filter(x => x !== v) }) }));
  if (filters.overdueOnly) filterChips.push({ key: "overdue", label: "Overdue only", onRemove: () => setFilters({ ...filters, overdueOnly: false }) });

  const clearAll = () => setFilters(EMPTY_AB_FILTERS);

  // ── Generated combination cards (active whenever Event Types are selected) ─
  const combos = buildCombos(filters);
  const assignedComboIds = new Set(
    actions.filter(a => a.issueId?.startsWith("combo-")).map(a => a.issueId.slice(6))
  );
  const unassignedCombos = combos.filter(c => !assignedComboIds.has(c.comboId));

  const handleAssignCombo = (card: GeneratedCardData) => {
    const category = EVENT_TYPE_CATEGORY[card.event] ?? "Safety";
    const isCritical = category === "NearMiss" || category === "Impact";
    const syntheticIssue: Issue = {
      id: `combo-${card.comboId}`,
      suite: isCritical ? "RTSS" : "MEPS",
      severity: eventPriority(card.event),
      issueSource: category === "Impact" ? "Impact" : "Safety",
      title: comboTitle(card),
      detail: `${card.mhe} · ${card.operator} · ${card.count} occurrence${card.count > 1 ? "s" : ""}`,
      raisedAt: "Just now",
      isAssigned: false,
    };
    setPresetAssignee(card.operator);
    setAssignTarget(syntheticIssue);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: "var(--card)" }}>

      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border" style={{ background: "var(--card)" }}>
        {/* Filters + create */}
        <div className="flex items-center gap-2 px-6 py-3">
          <div className="ml-auto flex items-center gap-2">
            {/* Filters button */}
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-[12px] font-medium hover:bg-muted transition-colors"
            >
              <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "var(--foreground)", color: "var(--background)" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            <Button className="h-9 gap-2 text-[12px] font-semibold px-4" onClick={() => setCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              Create Action
            </Button>
          </div>
        </div>

        {/* Active filter chips */}
        {filterChips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap px-6 pb-3">
            {filterChips.map(chip => (
              <span key={chip.key} className="flex items-center gap-1.5 text-[11.5px] font-medium pl-2.5 pr-1.5 py-1 rounded-full" style={{ background: "var(--muted)" }}>
                {chip.label}
                <button onClick={chip.onRemove} className="opacity-60 hover:opacity-100">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button onClick={clearAll} className="text-[11.5px] font-semibold hover:underline" style={{ color: "var(--chart-1)" }}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Filter Sheet ── */}
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        issues={issues}
        actions={actions}
      />

      {/* ── Kanban Board ── */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-6 h-full min-w-max">
          {KANBAN_COLUMNS.map(column => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              issues={column.id === "incoming" ? filteredIssues : []}
              actions={column.id !== "incoming" ? filteredActions(column.id) : []}
              onAssignIssue={issue => { setPresetAssignee(undefined); setAssignTarget(issue); }}
              onIssueClick={issue => { setDetailItem(issue); setDetailType("issue"); }}
              onActionClick={action => { setDetailItem(action); setDetailType("action"); }}
              onDragStart={handleDragStart}
              onDragOver={(e) => { handleDragOver(e); setDragOverCol(column.id); }}
              onDrop={handleDrop}
              isDragOver={dragOverCol === column.id}
              generatedCards={column.id === "incoming" ? unassignedCombos.map(c => generatedCardFor(c, column.id)) : undefined}
              assignedCards={column.id !== "incoming" ? filteredActions(column.id) : undefined}
              onAssignCombo={handleAssignCombo}
            />
          ))}
        </div>
      </div>

      {/* ── Create Action Modal ── */}
      <CreateActionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onConfirm={handleActionConfirm}
      />

      {/* ── Assign Modal ── */}
      <AssignModal
        issue={assignTarget}
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        onConfirm={handleActionConfirm}
        presetAssignee={presetAssignee}
      />

      {/* ── Detail Sheet ── */}
      <DetailSheet
        item={detailItem}
        type={detailType}
        open={!!detailItem}
        onClose={() => { setDetailItem(null); setDetailType(null); }}
        onAssign={issue => { setDetailItem(null); setDetailType(null); setAssignTarget(issue); }}
      />
    </div>
  );
}