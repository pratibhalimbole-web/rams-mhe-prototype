import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
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
import {
  Search,
  Plus,
  CheckCircle2,
  Inbox,
  GripVertical,
  X,
  Calendar as CalendarIcon,
  ArrowRight,
  Filter,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../components/ui/utils";
import {
  Suite,
  Severity,
  KanbanStatus,
  ActionSource,
  ActionType,
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
  { id: "i1",  suite: "MEPS", severity: "Critical", title: "Unauthorized / invalid operation",    detail: "MHE-003 · Bay 4 · Auth failure + wrong MHE type",         raisedAt: "5m ago",  isAssigned: false },
  { id: "i2",  suite: "MEPS", severity: "Critical", title: "Unsafe operation detected",           detail: "MHE-001 · Overload: 2,100kg · Fork height unsafe",          raisedAt: "15m ago", isAssigned: false },
  { id: "i3",  suite: "MEPS", severity: "High",     title: "Driving limit / fatigue risk",        detail: "Operator: Ajay Malhotra · 180 min continuous driving",       raisedAt: "1h ago",  isAssigned: false },
  { id: "i4",  suite: "MEPS", severity: "High",     title: "Speed violation",                     detail: "Operator: Prashant Rao · MHE-005 · Zone B",                 raisedAt: "2h ago",  isAssigned: false },
  { id: "i5",  suite: "RTSS", severity: "Critical", title: "Collision risk event",                detail: "MHE-008 · Impact: 12G · Zone C · 5 near-misses in 30 min",  raisedAt: "45m ago", isAssigned: false },
  { id: "i6",  suite: "RTSS", severity: "Critical", title: "Pedestrian proximity breach",         detail: "MHE-007 · Cross-aisle junction · 0.6m clearance",           raisedAt: "2h ago",  isAssigned: false },
  { id: "i7",  suite: "RTSS", severity: "Critical", title: "Repeat safety offender",             detail: "Operator: Deepak Singh · 5 violations this week",            raisedAt: "1h ago",  isAssigned: false },
  { id: "i8",  suite: "MMS",  severity: "Critical", title: "Operator compliance issue",           detail: "Suresh Kumar · License expired · Vijay Nair · Medical expired", raisedAt: "5d ago", isAssigned: false },
  { id: "i9",  suite: "MMS",  severity: "Critical", title: "MHE compliance issue",               detail: "MHE-011 · Fitness cert expired · MHE-006 · Insurance lapsed", raisedAt: "8d ago", isAssigned: false },
  { id: "i10", suite: "MMS",  severity: "Critical", title: "System health issue",                detail: "MHE-010 · Jetson offline · 68hr buffer · MHE-005 · LiDAR offline", raisedAt: "11h ago", isAssigned: false },
];

const MOCK_ACTIONS: Action[] = [
  { id: "a1", source: "system", issueId: "ix1", suite: "MEPS", issueTitle: "Unauthorized / invalid operation",  issueDescription: "MHE-003 · Bay 4 · Auth failure + wrong MHE type",       issueLocation: "Bay 4",       title: "Investigate unauthorized MHE start",      priority: "Critical", assignedTo: "Rahul Sharma",   assignedAvatar: "RS", dueDate: "2026-04-02T15:00", dueDateDisplay: "Today, 3:00 PM",  status: "assigned",    isOverdue: false, notes: "", createdAt: "2026-04-02T08:00", updatedAt: "2026-04-02T08:00" },
  { id: "a2", source: "system", issueId: "ix2", suite: "MMS",  issueTitle: "MHE compliance issue",               issueDescription: "MHE-011 · Fitness cert expired · MHE-006 · Insurance",    issueLocation: "Fleet",       title: "Ground MHE-011 and renew certifications", priority: "Critical", assignedTo: "Neha Kapoor",    assignedAvatar: "NK", dueDate: "2026-04-02T17:00", dueDateDisplay: "Today, 5:00 PM",  status: "assigned",    isOverdue: false, notes: "", createdAt: "2026-04-02T07:00", updatedAt: "2026-04-02T07:00" },
  { id: "a3", source: "system", issueId: "ix3", suite: "RTSS", issueTitle: "Collision risk event",               issueDescription: "MHE-008 · Impact: 12G · Zone D · 09:47 AM",               issueLocation: "Zone D",      title: "Review collision footage Zone D",          priority: "Critical", assignedTo: "Amit Desai",     assignedAvatar: "AD", dueDate: "2026-04-02T14:00", dueDateDisplay: "Today, 2:00 PM",  status: "in-progress", isOverdue: true,  notes: "", createdAt: "2026-04-02T06:00", updatedAt: "2026-04-02T10:00" },
  { id: "a4", source: "system", issueId: "ix4", suite: "RTSS", issueTitle: "High-risk driver score",             issueDescription: "Operator: Mohan Verma · Safety score: 19% · Bottom 5%",   issueLocation: "Fleet",       title: "Suspend operator — safety score 19%",     priority: "Critical", assignedTo: "HR Team",        assignedAvatar: "HR", dueDate: "2026-04-01T17:00", dueDateDisplay: "Yesterday",        status: "in-progress", isOverdue: true,  notes: "", createdAt: "2026-04-01T09:00", updatedAt: "2026-04-02T09:00" },
  { id: "a5", source: "system", issueId: "ix5", suite: "MEPS", issueTitle: "Speed violation",                   issueDescription: "Operator: Prashant Rao · MHE-005 · Zone B",                issueLocation: "Zone B",      title: "Speed violation coaching — Prashant Rao", priority: "High",     assignedTo: "Ops Manager",    assignedAvatar: "OM", dueDate: "2026-04-03T10:00", dueDateDisplay: "Tomorrow, 10 AM", status: "review",      isOverdue: false, notes: "", createdAt: "2026-04-02T05:00", updatedAt: "2026-04-02T11:00" },
  { id: "a6", source: "system", issueId: "ix6", suite: "MMS",  issueTitle: "System health issue",               issueDescription: "MHE-010 · Jetson offline · 68hr buffer · MHE-005 LiDAR",  issueLocation: "MHE-010",     title: "Dispatch technician — Jetson Nano",       priority: "Critical", assignedTo: "IoT Team",       assignedAvatar: "IT", dueDate: "2026-04-02T13:00", dueDateDisplay: "Today, 1:00 PM",  status: "review",      isOverdue: true,  notes: "", createdAt: "2026-04-01T22:00", updatedAt: "2026-04-02T12:00" },
  { id: "a7", source: "system", issueId: "ix7", suite: "MMS",  issueTitle: "Operator compliance issue",         issueDescription: "Suresh Kumar · License expired · Vijay Nair · Medical",   issueLocation: "Fleet",       title: "Renew operator license — Suresh Kumar",   priority: "High",     assignedTo: "Admin",          assignedAvatar: "AD", dueDate: "2026-04-02T00:00", dueDateDisplay: "02 Apr",           status: "done",        isOverdue: false, notes: "", createdAt: "2026-03-31T09:00", updatedAt: "2026-04-02T14:00" },
  { id: "a8", source: "system", issueId: "ix8", suite: "RTSS", issueTitle: "Pedestrian proximity breach",       issueDescription: "MHE-007 · Cross-aisle junction · 0.6m clearance",         issueLocation: "Cross-aisle", title: "Fix pedestrian alert — Zone C",           priority: "High",     assignedTo: "Safety Officer", assignedAvatar: "SO", dueDate: "2026-04-03T00:00", dueDateDisplay: "03 Apr",           status: "done",        isOverdue: false, notes: "", createdAt: "2026-04-01T10:00", updatedAt: "2026-04-02T15:00" },
];

// ─── Escalation Logic ────────────────────────────────────────────────────────

// How many hours each overdue action has been past its due date (mock values)
const OVERDUE_HOURS: Record<string, number> = {
  a3: 3,   // "Today, 2:00 PM" — ~3h overdue
  a4: 26,  // "Yesterday" — ~26h overdue
  a6: 5,   // "Today, 1:00 PM" — ~5h overdue
};

type EscLevel = "L1" | "L2" | "L3" | "L4";

function getEscalationInfo(actionId: string): { level: EscLevel; hours: number; role: string } | null {
  const hours = OVERDUE_HOURS[actionId];
  if (!hours) return null;
  if (hours < 2)  return { level: "L1", hours, role: "Operator" };
  if (hours < 6)  return { level: "L2", hours, role: "Supervisor" };
  if (hours < 14) return { level: "L3", hours, role: "Ops Manager" };
  return           { level: "L4", hours, role: "Director" };
}

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
  const severityColor = SEVERITY_COLORS[issue.severity];

  return (
    <div
      onClick={() => onClick(issue)}
      className={cn(
        "group relative bg-card border border-border rounded cursor-pointer transition-all duration-150",
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-sm hover:border-border/80"
      )}
      style={{ borderLeft: `3px solid ${severityColor}` }}
    >
      <div className="p-3 flex flex-col gap-2">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-2">
          <SuitePill suite={issue.suite} />
          <SeverityBadge severity={issue.severity} />
        </div>

        {/* Title */}
        <p
          className="text-sm font-medium leading-snug line-clamp-2"
          style={{ color: "var(--foreground)" }}
        >
          {issue.title}
        </p>

        {/* Detail */}
        <p className="text-xs leading-tight truncate" style={{ color: "var(--muted-foreground)" }}>
          {issue.detail}
        </p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {issue.raisedAt}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onAssign(issue); }}
          >
            Assign
            <ArrowRight className="w-3 h-3 ml-1" />
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
  const esc = action.isOverdue ? getEscalationInfo(action.id) : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, action)}
      onClick={() => onClick(action)}
      className={cn(
        "group bg-card border border-border rounded cursor-grab active:cursor-grabbing transition-all duration-150",
        "hover:shadow-sm hover:border-border/80",
        action.isOverdue && "border-l-[3px]"
      )}
      style={action.isOverdue ? { borderLeftColor: "var(--destructive)" } : {}}
    >
      <div className="p-3 flex flex-col gap-2.5">
        {/* Top — title + priority */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug line-clamp-2 flex-1" style={{ color: "var(--foreground)" }}>
            {action.title}
          </p>
          <GripVertical className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: "var(--muted-foreground)" }} />
        </div>

        {/* Priority + Suite tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ color: priorityColor, backgroundColor: `color-mix(in srgb, ${priorityColor} 12%, transparent)` }}
          >
            {action.priority}
          </span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ color: suiteColor, backgroundColor: `color-mix(in srgb, ${suiteColor} 10%, transparent)` }}
          >
            {action.suite}
          </span>
          {action.isOverdue && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: "var(--destructive)", backgroundColor: "color-mix(in srgb, var(--destructive) 10%, transparent)" }}>
              Overdue
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/60" />

        {/* Assignee */}
        <div className="flex items-center gap-2">
          <Avatar initials={action.assignedAvatar} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{action.assignedTo}</p>
            <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>
              {action.issueTitle}
            </p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-3 h-3" style={{ color: action.isOverdue ? "var(--destructive)" : "var(--muted-foreground)" }} />
          <span
            className="text-xs"
            style={{ color: action.isOverdue ? "var(--destructive)" : "var(--muted-foreground)" }}
          >
            {action.dueDateDisplay || action.dueDate}
          </span>
        </div>

        {/* Escalation warning */}
        {esc && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-border mt-0.5"
            style={{ background: "var(--muted)" }}>
            <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: "var(--destructive)" }} strokeWidth={1.5} />
            <span className="text-[10px] font-semibold flex-1" style={{ color: "var(--foreground)" }}>
              Escalated to {esc.level} — {esc.role}
            </span>
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {esc.hours}h overdue
            </span>
          </div>
        )}
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
}: KanbanColumnProps) {
  const count = column.id === "incoming" ? issues.length : actions.length;

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
        className="flex items-center justify-between px-3 py-2.5 border-b border-border rounded-t-lg sticky top-0 z-10"
        style={{ backgroundColor: "var(--muted)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {column.label}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{ backgroundColor: "var(--background)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
        >
          {count}
        </span>
      </div>

      {/* Column Body */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {column.id === "incoming" ? (
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
}

function AssignModal({ issue, open, onClose, onConfirm }: AssignModalProps) {
  const [actionType, setActionType] = useState<ActionType>("Safety");
  const [priority, setPriority] = useState<Severity>("High");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDateObj, setDueDateObj] = useState<Date | undefined>(undefined);
  const [dueTime, setDueTime] = useState("09:00");
  const [notes, setNotes] = useState("");

  useEffect(() => { if (issue) setPriority(issue.severity); }, [issue]);

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
              <SuitePill suite={issue.suite} />
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
        <SheetHeader className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">
              {isIssue ? "Issue Details" : "Action Details"}
            </SheetTitle>
          </div>
          {isIssue && issue && (
            <div className="flex items-center gap-2 pt-1">
              <SuitePill suite={issue.suite} />
              <SeverityBadge severity={issue.severity} />
            </div>
          )}
          {!isIssue && action && (
            <div className="flex items-center gap-2 pt-1">
              <SuitePill suite={action.suite} />
              <SeverityBadge severity={action.priority} />
              {action.isOverdue && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: "var(--destructive)", backgroundColor: "color-mix(in srgb, var(--destructive) 10%, transparent)" }}>
                  Overdue
                </span>
              )}
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          {/* Title */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Title</p>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              {isIssue ? issue!.title : action!.title}
            </p>
          </div>

          {/* Detail / Context */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>
              {isIssue ? "Context" : "Linked Issue"}
            </p>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>
              {isIssue ? issue!.detail : action!.linkedIssue}
            </p>
          </div>

          {!isIssue && action && (
            <>
              {/* Assignee */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Assigned To</p>
                <div className="flex items-center gap-2">
                  <Avatar initials={action.assignedAvatar} size="md" />
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{action.assignedTo}</span>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Due Date</p>
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" style={{ color: action.isOverdue ? "var(--destructive)" : "var(--muted-foreground)" }} />
                  <span className="text-sm" style={{ color: action.isOverdue ? "var(--destructive)" : "var(--foreground)" }}>
                    {action.dueDateDisplay || action.dueDate}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Status</p>
                <span className="text-sm font-medium capitalize" style={{ color: "var(--foreground)" }}>
                  {action.status.replace("-", " ")}
                </span>
              </div>

              {/* Escalation section */}
              {(() => {
                const esc = getEscalationInfo(action.id);
                if (!esc) return null;
                return (
                  <div className="flex flex-col gap-2 p-3 rounded-lg border border-border" style={{ background: "var(--muted)" }}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={13} strokeWidth={1.5} style={{ color: "var(--destructive)" }} />
                      <p className="text-[11px] font-bold" style={{ color: "var(--foreground)" }}>
                        Auto-escalated to {esc.level} ({esc.role})
                      </p>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                      This action was {esc.hours}h overdue. The {esc.role} has been notified and the issue is now tracked on the Escalation Board.
                    </p>
                    <button
                      onClick={() => navigate("/mhe/escalation-logs")}
                      className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-background transition-colors w-full justify-center mt-0.5"
                      style={{ color: "var(--foreground)", background: "var(--card)" }}>
                      <ExternalLink size={11} strokeWidth={1.5} />
                      View on Escalation Board
                    </button>
                  </div>
                );
              })()}
            </>
          )}

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Activity Timeline */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>Activity</p>
            <div className="flex flex-col gap-3">
              {[
                { time: "Just now", text: "Issue detected by system" },
                { time: "5m ago",   text: "Notification sent to supervisors" },
                { time: "10m ago",  text: "Issue escalated — severity: Critical" },
              ].map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: "var(--primary)" }} />
                    {i < 2 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: "var(--border)" }} />}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{entry.text}</p>
                    <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        {isIssue && onAssign && issue && (
          <div className="px-5 py-4 border-t border-border">
            <Button
              className="w-full"
              size="sm"
              onClick={() => { onClose(); onAssign(issue); }}
            >
              Assign Action
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ActionBoard() {
  const sidebar = useSidebar();
  const navigate = useNavigate();

  // State — must be declared before any useEffect that references them
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [actions, setActions] = useState<Action[]>(MOCK_ACTIONS);
  const [search, setSearch] = useState("");
  const [filterSuite, setFilterSuite] = useState<Suite | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Severity | "all">("all");
  const [filterStatus, setFilterStatus] = useState<KanbanStatus | "all">("all");

  // Modal / Sheet
  const [assignTarget, setAssignTarget] = useState<Issue | null>(null);
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



  // ── Filtered data ─────────────────────────────────────────────────────────
  const filteredIssues = issues.filter(i => {
    if (filterSuite !== "all" && i.suite !== filterSuite) return false;
    if (filterPriority !== "all" && i.severity !== filterPriority) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.detail.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredActions = (status: KanbanStatus) =>
    actions.filter(a => {
      if (a.status !== status) return false;
      if (filterSuite !== "all" && a.suite !== filterSuite) return false;
      if (filterPriority !== "all" && a.priority !== filterPriority) return false;
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

  // ── Unified action handler ───────────────────────────────────────────────
  const handleActionConfirm = (payload: ActionFormPayload) => {
    const initials = payload.assignedTo.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
    const newAction: Action = {
      id: `a${Date.now()}`,
      issueId: payload.issueId,
      title: payload.title,
      priority: payload.priority,
      assignedTo: payload.assignedTo,
      assignedAvatar: initials,
      linkedIssue: payload.issueTitle,
      dueDate: payload.dueDate || "TBD",
      status: "assigned",
      suite: payload.suite,
      isOverdue: false,
      createdAt: "Just now",
    };
    setActions(prev => [...prev, newAction]);
    if (payload.source === "system" && payload.issueId) {
      setIssues(prev => prev.filter(i => i.id !== payload.issueId));
    }
    setAssignTarget(null);
    setCreateOpen(false);
    toast.success(
      payload.source === "system" ? "Action assigned" : "Action created",
      { description: `${payload.title} → ${payload.assignedTo}` }
    );
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

  const handleDrop = (e: React.DragEvent, status: KanbanStatus) => {
    e.preventDefault();
    if (!dragAction || status === "incoming") return;
    setActions(prev =>
      prev.map(a => a.id === dragAction.id ? { ...a, status } : a)
    );
    setDragAction(null);
    setDragOverCol(null);
  };

  const hasActiveFilters = filterSuite !== "all" || filterPriority !== "all" || filterStatus !== "all" || search !== "";

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: "var(--background)" }}>

      {/* ── Single Header Bar: Search + Filters + Create Action ── */}
      <div
        className="flex items-center gap-2 px-6 py-3 border-b border-border shrink-0"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
          <Input
            placeholder="Search issues or actions..."
            className="h-8 pl-8 text-xs w-52"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="w-px h-5 bg-border mx-1" />
        <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Filter:</span>
        <Select value={filterSuite} onValueChange={v => setFilterSuite(v as Suite | "all")}>
          <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="All Suites" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Suites</SelectItem>
            <SelectItem value="MEPS">MEPS</SelectItem>
            <SelectItem value="RTSS">RTSS</SelectItem>
            <SelectItem value="MMS">MMS</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={v => setFilterPriority(v as Severity | "all")}>
          <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="All Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={v => setFilterStatus(v as KanbanStatus | "all")}>
          <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-8 text-xs px-2"
            onClick={() => { setFilterSuite("all"); setFilterPriority("all"); setFilterStatus("all"); setSearch(""); }}>
            <X className="w-3 h-3 mr-1" />Clear
          </Button>
        )}
        <div className="flex-1" />
        <Button size="sm" className="h-8 gap-1.5 text-xs font-medium" onClick={() => setCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5" />
          Create Action
        </Button>
      </div>

      {/* ── Escalation Banner ── */}
      {(() => {
        const overdueActions = actions.filter(a => a.isOverdue && a.status !== "done");
        if (overdueActions.length === 0) return null;
        const escalated = overdueActions.filter(a => getEscalationInfo(a.id));
        return (
          <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 rounded-lg border border-border"
            style={{ background: "var(--muted)" }}>
            <AlertTriangle size={15} strokeWidth={1.5} className="shrink-0" style={{ color: "var(--destructive)" }} />
            <div className="flex-1 min-w-0">
              <span className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>
                {escalated.length} action{escalated.length > 1 ? "s" : ""} overdue and auto-escalated
              </span>
              <span className="text-[11px] ml-2" style={{ color: "var(--muted-foreground)" }}>
                — supervisor has been notified. Resolve or reassign to stop escalation.
              </span>
            </div>
            <button
              onClick={() => navigate("/mhe/escalation-logs")}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-background transition-colors shrink-0"
              style={{ color: "var(--foreground)", background: "var(--card)" }}>
              <ExternalLink size={11} strokeWidth={1.5} />
              View Escalation Board
            </button>
          </div>
        );
      })()}

      {/* ── Kanban Board ── */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-6 h-full min-w-max">
          {KANBAN_COLUMNS.map(column => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              issues={column.id === "incoming" ? filteredIssues : []}
              actions={column.id !== "incoming" ? filteredActions(column.id) : []}
              onAssignIssue={issue => setAssignTarget(issue)}
              onIssueClick={issue => { setDetailItem(issue); setDetailType("issue"); }}
              onActionClick={action => { setDetailItem(action); setDetailType("action"); }}
              onDragStart={handleDragStart}
              onDragOver={(e) => { handleDragOver(e); setDragOverCol(column.id); }}
              onDrop={handleDrop}
              isDragOver={dragOverCol === column.id}
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