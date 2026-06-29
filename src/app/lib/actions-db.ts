import { supabase } from "../supabase-client";
import type { Action, KanbanStatus } from "../pages/mhe/types/action-board";

// ─── Row → Action mapper ──────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAction(row: any): Action {
  return {
    id:             row.id,
    source:         row.source,
    issueId:        row.issue_id,
    issueTitle:     row.issue_title,
    issueDetail:    row.issue_detail,
    suite:          row.suite,
    severity:       row.severity ?? row.priority,
    issueSource:    row.issue_source,
    actionType:     row.action_type,
    title:          row.title,
    assignedTo:     row.assigned_to,
    assignedAvatar: row.assigned_avatar,
    priority:       row.priority,
    dueDate:        row.due_date,
    notes:          row.notes ?? "",
    status:         row.status,
    isOverdue:      row.is_overdue ?? false,
    createdAt:      row.created_at,
    createdBy:      row.created_by ?? "system",
    // extra display fields used by DetailSheet
    linkedIssue:    row.issue_title,
    dueDateDisplay: row.due_date,
  } as Action & { linkedIssue: string; dueDateDisplay: string };
}

// ─── Action → DB row mapper ───────────────────────────────────────────────────

function actionToRow(a: Action) {
  return {
    id:             a.id,
    source:         a.source,
    issue_id:       a.issueId,
    issue_title:    a.issueTitle,
    issue_detail:   a.issueDetail,
    suite:          a.suite,
    severity:       a.severity ?? a.priority,
    issue_source:   a.issueSource,
    action_type:    a.actionType,
    title:          a.title,
    assigned_to:    a.assignedTo,
    assigned_avatar: a.assignedAvatar,
    priority:       a.priority,
    due_date:       a.dueDate,
    notes:          a.notes ?? "",
    status:         a.status,
    is_overdue:     a.isOverdue ?? false,
    created_by:     a.createdBy ?? "system",
  };
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function fetchActions(): Promise<Action[]> {
  const { data, error } = await supabase
    .from("actions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToAction);
}

export async function insertAction(action: Action): Promise<void> {
  const { error } = await supabase.from("actions").insert(actionToRow(action));
  if (error) throw error;
}

export async function updateActionStatus(id: string, status: KanbanStatus): Promise<void> {
  const { error } = await supabase
    .from("actions")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// ─── Realtime ─────────────────────────────────────────────────────────────────

export function subscribeToActions(onUpdate: (actions: Action[]) => void) {
  const channel = supabase
    .channel("actions-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "actions" },
      async () => {
        // Re-fetch full list on any change
        const fresh = await fetchActions();
        onUpdate(fresh);
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}
