// ─── Suite & Severity ───────────────────────────────────────────────────────

export type Suite = "MEPS" | "RTSS" | "MMS";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type KanbanStatus = "incoming" | "assigned" | "in-progress" | "review" | "done";
export type ActionSource = "system" | "manual";
export type ActionType = "Safety" | "Compliance" | "Maintenance" | "Operational" | "Follow-up";

// ─── Issue (system-generated raw event — Incoming column) ────────────────────
// Maps to: issues table

export interface Issue {
  id: string;
  suite: Suite;
  severity: Severity;
  title: string;
  detail: string;         // MHE / Operator / Zone context
  raisedAt: string;
  isAssigned: boolean;
}

// ─── Action ──────────────────────────────────────────────────────────────────
// Single unified type — covers BOTH system-assigned and manually created actions
// Maps to: actions table (one table, source field distinguishes them)

export interface Action {
  // Identity
  id: string;
  source: ActionSource;       // "system" = assigned from issue | "manual" = created by user

  // Issue context (always present)
  issueId: string;            // system: linked issue id | manual: "" (no system issue)
  issueTitle: string;         // system: issue.title | manual: what user observed
  issueDetail: string;        // system: issue.detail | manual: location/MHE entered by user
  suite: Suite;
  severity: Severity;         // system: issue.severity | manual: user-selected

  // Action details (always present)
  actionType: ActionType;     // Safety / Compliance / Maintenance / Operational / Follow-up
  title: string;              // what needs to be done
  assignedTo: string;
  assignedAvatar: string;     // initials
  priority: Severity;         // can differ from severity — user may reprioritize the action
  dueDate: string;
  notes: string;

  // Status
  status: KanbanStatus;
  isOverdue: boolean;
  createdAt: string;
  createdBy: string;          // who created this action
}

// ─── Unified form payload ────────────────────────────────────────────────────
// Both modals produce this — passed to onConfirm, saved to DB

export interface ActionFormPayload {
  source: ActionSource;
  issueId: string;
  issueTitle: string;
  issueDetail: string;
  suite: Suite;
  severity: Severity;
  actionType: ActionType;
  title: string;
  assignedTo: string;
  priority: Severity;
  dueDate: string;
  notes: string;
}

// ─── Column config ───────────────────────────────────────────────────────────

export interface KanbanColumn {
  id: KanbanStatus;
  label: string;
  color: string;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "incoming",    label: "Incoming Issues", color: "var(--muted-foreground)" },
  { id: "assigned",    label: "Assigned",        color: "var(--chart-1)" },
  { id: "in-progress", label: "In Progress",     color: "var(--warning)" },
  { id: "review",      label: "Review",          color: "var(--chart-2)" },
  { id: "done",        label: "Done",            color: "var(--success)" },
];

// ─── Color maps ──────────────────────────────────────────────────────────────

export const SUITE_COLORS: Record<Suite, string> = {
  MEPS: "var(--chart-3)",
  RTSS: "var(--destructive)",
  MMS:  "var(--chart-2)",
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  Critical: "var(--destructive)",
  High:     "var(--warning)",
  Medium:   "var(--chart-1)",
  Low:      "var(--muted-foreground)",
};