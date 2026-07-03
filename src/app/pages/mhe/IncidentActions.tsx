import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { ReassignModal } from "./ReassignModal";
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";
import {
  Search,
  Plus,
  Filter as FilterIcon,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Repeat,
  ArrowUpRight,
  Users,
  Truck,
  MapPin,
  UsersRound,
  Clock,
} from "lucide-react";
import { cn } from "../../components/ui/utils";
import {
  Suite,
  Priority,
  IncidentStatus,
  ActionTargetType,
  IncidentAction,
  IncidentEvent,
  SUITES,
  PRIORITY_COLORS,
  PRIORITY_ORDER,
  SUITE_COLORS,
  STATUS_COLORS,
  OVERDUE_COLOR,
  MOCK_INCIDENT_ACTIONS,
  sortBySeverity,
} from "./types/incident-actions";

// ─── Small building blocks ────────────────────────────────────────────────────

function formatDateShort(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

function daysOverdue(iso: string) {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ background: PRIORITY_COLORS[priority] }}
      title={priority}
    />
  );
}

function SuiteBadge({ suite }: { suite: Suite }) {
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
      style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
    >
      {suite}
    </span>
  );
}

function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-full border"
      style={{ color: STATUS_COLORS[status], borderColor: STATUS_COLORS[status] }}
    >
      {status}
    </span>
  );
}

// Urgency is computed from SLA vs. time, not a manual workflow step — shown
// as its own signal alongside status rather than folded into it.
function OverdueBadge() {
  return (
    <span
      className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color: OVERDUE_COLOR, background: `color-mix(in srgb, ${OVERDUE_COLOR} 14%, transparent)` }}
    >
      <Clock className="w-3 h-3" strokeWidth={2} />
      Overdue
    </span>
  );
}

const TARGET_ICON: Record<ActionTargetType, React.ElementType> = {
  Operator: Users,
  MHE: Truck,
  Zone: MapPin,
  Team: UsersRound,
};

function ActionTargetCell({ item }: { item: IncidentAction }) {
  const Icon = TARGET_ICON[item.actionTargetType];
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
      <span className="text-[12px]">{item.actionTargetLabel}</span>
    </div>
  );
}

function OwnerAvatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-[11px]";
  return (
    <div
      className={cn("rounded-full flex items-center justify-center font-semibold shrink-0", dim)}
      style={{ background: "var(--muted)", color: "var(--foreground)" }}
    >
      {initials}
    </div>
  );
}

// ─── Filter Slide-Over ─────────────────────────────────────────────────────────

interface FilterState {
  suite: Suite[];
  priority: Priority[];
  businessArea: string[];
  actionTarget: ActionTargetType[];
  status: IncidentStatus[];
  overdueOnly: boolean;
}

const EMPTY_FILTERS: FilterState = { suite: [], priority: [], businessArea: [], actionTarget: [], status: [], overdueOnly: false };

function toggleInArray<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

function matchesFilters(item: IncidentAction, f: FilterState): boolean {
  if (f.suite.length && !f.suite.includes(item.suite)) return false;
  if (f.priority.length && !f.priority.includes(item.priority)) return false;
  if (f.businessArea.length && !f.businessArea.includes(item.businessArea)) return false;
  if (f.actionTarget.length && !f.actionTarget.includes(item.actionTargetType)) return false;
  if (f.status.length && !f.status.includes(item.status)) return false;
  if (f.overdueOnly && !item.isOverdue) return false;
  return true;
}

// Segmented, equal-width toggle row — used for Suite / Priority (primary filters)
function SegmentedFilterRow<T extends string>({ options, active, onToggle, activeColor }: {
  options: T[]; active: T[]; onToggle: (v: T) => void; activeColor?: (v: T) => string;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map(o => {
        const isActive = active.includes(o);
        const color = activeColor?.(o) ?? "var(--foreground)";
        return (
          <button
            key={o}
            onClick={() => onToggle(o)}
            className="text-[12px] font-semibold px-2 py-2 rounded-lg border transition-colors"
            style={{
              borderColor: isActive ? color : "var(--border)",
              background: isActive ? color : "transparent",
              color: isActive ? "var(--background)" : "var(--foreground)",
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
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

function FilterSheet({
  open, onClose, filters, setFilters, businessAreas, allItems,
}: {
  open: boolean; onClose: () => void;
  filters: FilterState; setFilters: (f: FilterState) => void;
  businessAreas: string[];
  allItems: IncidentAction[];
}) {
  const [draft, setDraft] = useState<FilterState>(filters);

  React.useEffect(() => { if (open) setDraft(filters); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasDraftFilters = draft.suite.length + draft.priority.length + draft.businessArea.length + draft.actionTarget.length + draft.status.length > 0 || draft.overdueOnly;
  const liveCount = useMemo(() => allItems.filter(i => matchesFilters(i, draft)).length, [allItems, draft]);

  return (
    <Sheet open={open} onOpenChange={o => !o && onClose()}>
      <SheetContent side="right" className="w-[380px] flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-[15px]">Filters</SheetTitle>
            {hasDraftFilters && (
              <button
                onClick={() => setDraft(EMPTY_FILTERS)}
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
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>Suite</div>
            <SegmentedFilterRow
              options={SUITES}
              active={draft.suite}
              onToggle={s => setDraft({ ...draft, suite: toggleInArray(draft.suite, s) })}
              activeColor={s => SUITE_COLORS[s]}
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>Priority</div>
            <SegmentedFilterRow
              options={["Critical", "High", "Medium", "Low"] as Priority[]}
              active={draft.priority}
              onToggle={p => setDraft({ ...draft, priority: toggleInArray(draft.priority, p) })}
              activeColor={p => PRIORITY_COLORS[p]}
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>Business Area</div>
            <div className="flex flex-wrap gap-2">
              {businessAreas.map(a => (
                <FilterPill key={a} label={a} active={draft.businessArea.includes(a)}
                  onClick={() => setDraft({ ...draft, businessArea: toggleInArray(draft.businessArea, a) })} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>Action Target</div>
            <div className="flex flex-wrap gap-2">
              {(["Operator", "MHE", "Zone", "Team"] as ActionTargetType[]).map(t => (
                <FilterPill key={t} label={t} active={draft.actionTarget.includes(t)}
                  onClick={() => setDraft({ ...draft, actionTarget: toggleInArray(draft.actionTarget, t) })} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted-foreground)" }}>Status</div>
            <div className="flex flex-wrap gap-2">
              {(["New", "Assigned", "Resolved"] as IncidentStatus[]).map(s => (
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
                borderColor: draft.overdueOnly ? OVERDUE_COLOR : "var(--border)",
                background: draft.overdueOnly ? OVERDUE_COLOR : "transparent",
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
            {liveCount} of {allItems.length} results{hasDraftFilters ? " · filtered" : ""}
          </span>
          <Button
            className="h-9 px-4 text-[12px] font-semibold"
            onClick={() => { setFilters(draft); onClose(); }}
          >
            Apply Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Detail Drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({
  item, open, onClose, onStatusChange,
}: {
  item: IncidentAction | null; open: boolean; onClose: () => void;
  onStatusChange: (id: string, status: IncidentStatus) => void;
}) {
  const navigate = useNavigate();
  const [reassignOpen, setReassignOpen] = useState(false);
  if (!item) return null;

  const nextStatus: Record<IncidentStatus, IncidentStatus | null> = {
    New: "Assigned",
    Assigned: "Resolved",
    Resolved: null,
  };
  const next = nextStatus[item.status];

  return (
    <Sheet open={open} onOpenChange={o => !o && onClose()}>
      <SheetContent side="right" className="w-[480px] flex flex-col p-0" style={{ background: "var(--card)" }}>
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
          <SheetTitle className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            {item.businessGroup}
          </SheetTitle>
          <div className="text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{item.id} · {item.actionTargetLabel}</div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-border">
          {/* Assignee / dates / Business area / Priority / Status / SLA / repeated rows */}
          <div className="px-5 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Assigned To</p>
              <span className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                <OwnerAvatar initials={item.ownerAvatar} />
                {item.owner}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Assigned Date</p>
              <span className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{formatDateShort(item.createdAt)}</span>
            </div>

            {item.isOverdue && item.status !== "Resolved" && (
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Overdue By</p>
                <span className="text-[13px] font-semibold" style={{ color: OVERDUE_COLOR }}>
                  {daysOverdue(item.createdAt)} {daysOverdue(item.createdAt) === 1 ? "day" : "days"}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Business Area</p>
              <span className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{item.businessArea}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Priority</p>
              <div className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--foreground)" }}><PriorityDot priority={item.priority} />{item.priority}</div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Status</p>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <StatusBadge status={item.status} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>SLA</p>
              <span className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{item.sla}</span>
            </div>

            {item.isRepeated && (
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Recurrence</p>
                <span className="flex items-center gap-1 text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                  <Repeat className="w-3.5 h-3.5" strokeWidth={1.5} /> Repeated
                </span>
              </div>
            )}
          </div>

          {/* Business impact */}
          <div className="px-5 py-5 flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Business Impact</p>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--foreground)" }}>
              Affects <strong>{item.kpiImpact}</strong>. {item.eventCount} contributing events rolled up from {item.actionTargetLabel}.
            </p>
          </div>

          {/* Events breakdown — sorted highest severity first so the most actionable event surfaces immediately */}
          <div className="px-5 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                Related Events ({item.eventCount})
              </p>
              <span className="text-[10.5px]" style={{ color: "var(--muted-foreground)" }}>Sorted by severity</span>
            </div>
            <div className="flex flex-col gap-2">
              {sortBySeverity(item.events).map((e, i) => (
                <div
                  key={`${e.label}-${i}`}
                  className="px-3 py-2.5 rounded-lg border border-border flex flex-col gap-1.5"
                  style={{ background: "var(--card)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[12.5px] font-medium">{e.label}</span>
                      {e.count > 1 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                          ×{e.count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `color-mix(in srgb, ${PRIORITY_COLORS[e.severity]} 14%, transparent)`, color: PRIORITY_COLORS[e.severity] }}
                      >
                        {e.severity}
                      </span>
                      {i === 0 && (
                        <span className="text-[9.5px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                          style={{ background: PRIORITY_COLORS[e.severity], color: "var(--background)" }}>
                          Act first
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>
                    <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                    <span>{e.location}</span>
                  </div>
                  {e.note && (
                    <div className="text-[11.5px] leading-relaxed italic" style={{ color: "var(--muted-foreground)" }}>{e.note}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended action */}
          <div className="px-5 py-5 flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Recommended Action</p>
            <div className="flex items-center justify-between px-3.5 py-3 rounded-lg border border-border">
              <span className="text-[13px] font-medium">{item.recommendedAction}</span>
              <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{item.responsibleRole}</span>
            </div>
          </div>

          {/* Escalation chain */}
          <div className="px-5 py-5 flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Escalation Chain</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {item.escalationChain.map((role, i) => (
                <React.Fragment key={role}>
                  <span
                    className="text-[11px] font-medium px-2 py-1 rounded-md"
                    style={{
                      background: i < item.escalationLevel ? "var(--foreground)" : "var(--muted)",
                      color: i < item.escalationLevel ? "var(--background)" : "var(--muted-foreground)",
                    }}
                  >
                    {role}
                  </span>
                  {i < item.escalationChain.length - 1 && <ChevronRight className="w-3 h-3" style={{ color: "var(--muted-foreground)" }} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="px-5 py-5 flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Generated From</p>
            <button
              onClick={() => {
                if (item.sourceDashboard === "Command Center") {
                  navigate(`/mhe/command-center?view=2d&heatmap=1&zone=${encodeURIComponent(item.actionTargetLabel)}`);
                } else {
                  toast.info(`Opening ${item.sourceDashboard}`);
                }
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
            >
              <div>
                <div className="text-[13px] font-medium">{item.sourceDashboard}</div>
                <div className="text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>{item.sourceWidget}</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
            </button>
          </div>
        </div>

        <div className="shrink-0 border-t border-border px-5 py-4 flex items-center gap-2">
          <Button variant="outline" className="h-9 flex-1 text-[12px] font-semibold" onClick={() => setReassignOpen(true)}>
            Reassign
          </Button>
          {next ? (
            <Button
              className="h-9 flex-1 text-[12px] font-semibold gap-1.5"
              onClick={() => { onStatusChange(item.id, next); toast.success(`Marked ${next}`); }}
            >
              Mark {next}
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Button>
          ) : (
            <Button className="h-9 flex-1 text-[12px] font-semibold" disabled>Resolved</Button>
          )}
        </div>

        <ReassignModal
          open={reassignOpen}
          onClose={() => setReassignOpen(false)}
          currentLevel={(["L1", "L2", "L3", "L4"][Math.min(item.escalationLevel, 3)] ?? "L1") as "L1" | "L2" | "L3" | "L4"}
          currentAssignee={item.owner}
          escalationId={item.id}
          escalationTitle={item.businessGroup}
          onConfirm={(user, handoffNote) => {
            console.log("Reassigned to:", user.name, "Note:", handoffNote);
            toast.success(`Reassigned to ${user.name}`);
            setReassignOpen(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type GroupBy = "none" | "suite" | "businessArea" | "priority" | "owner" | "status";
type SortBy = "priority" | "newest" | "oldest" | "sla" | "mostRepeated";

export function IncidentActions() {
  const [items, setItems] = useState<IncidentAction[]>(MOCK_INCIDENT_ACTIONS);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<IncidentAction | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const businessAreas = useMemo(() => Array.from(new Set(items.map(i => i.businessArea))), [items]);

  const activeFilterCount = filters.suite.length + filters.priority.length + filters.businessArea.length + filters.actionTarget.length + filters.status.length + (filters.overdueOnly ? 1 : 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(i => {
      if (!matchesFilters(i, filters)) return false;
      if (q) {
        const hay = `${i.id} ${i.businessGroup} ${i.actionTargetLabel} ${i.owner} ${i.recommendedAction}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, search, filters]);

  // Flat list of removable filter chips — mirrors `filters` state, one entry per active value
  type FilterChip = { key: string; label: string; onRemove: () => void };
  const filterChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    filters.suite.forEach(v => chips.push({ key: `suite-${v}`, label: `Suite: ${v}`, onRemove: () => setFilters({ ...filters, suite: filters.suite.filter(x => x !== v) }) }));
    filters.priority.forEach(v => chips.push({ key: `priority-${v}`, label: `Priority: ${v}`, onRemove: () => setFilters({ ...filters, priority: filters.priority.filter(x => x !== v) }) }));
    filters.businessArea.forEach(v => chips.push({ key: `area-${v}`, label: `Area: ${v}`, onRemove: () => setFilters({ ...filters, businessArea: filters.businessArea.filter(x => x !== v) }) }));
    filters.actionTarget.forEach(v => chips.push({ key: `target-${v}`, label: `Target: ${v}`, onRemove: () => setFilters({ ...filters, actionTarget: filters.actionTarget.filter(x => x !== v) }) }));
    filters.status.forEach(v => chips.push({ key: `status-${v}`, label: `Status: ${v}`, onRemove: () => setFilters({ ...filters, status: filters.status.filter(x => x !== v) }) }));
    if (filters.overdueOnly) chips.push({ key: "overdue", label: "Overdue only", onRemove: () => setFilters({ ...filters, overdueOnly: false }) });
    return chips;
  }, [filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case "priority": arr.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]); break;
      case "newest": arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "oldest": arr.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break;
      case "sla": arr.sort((a, b) => a.sla.localeCompare(b.sla)); break;
      case "mostRepeated": arr.sort((a, b) => Number(b.isRepeated) - Number(a.isRepeated) || b.eventCount - a.eventCount); break;
    }
    return arr;
  }, [filtered, sortBy]);

  const groups = useMemo(() => {
    if (groupBy === "none") return [{ key: "all", label: "", rows: sorted }];
    const keyFn: Record<Exclude<GroupBy, "none">, (i: IncidentAction) => string> = {
      suite: i => i.suite,
      businessArea: i => i.businessArea,
      priority: i => i.priority,
      owner: i => i.owner,
      status: i => i.status,
    };
    const fn = keyFn[groupBy];
    const map = new Map<string, IncidentAction[]>();
    for (const item of sorted) {
      const k = fn(item);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(item);
    }
    return Array.from(map.entries()).map(([key, rows]) => ({ key, label: key, rows }));
  }, [sorted, groupBy]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(prev => prev.size === sorted.length ? new Set() : new Set(sorted.map(i => i.id)));
  };

  const handleStatusChange = (id: string, status: IncidentStatus) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    setDetailItem(prev => prev && prev.id === id ? { ...prev, status } : prev);
  };

  const clearAll = () => { setFilters(EMPTY_FILTERS); setSearch(""); };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: "var(--card)" }}>

      {/* ── Toolbar ── */}
      <div className="shrink-0 border-b border-border" style={{ background: "var(--card)" }}>
        <div className="flex items-center gap-2 px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" strokeWidth={1.5}
              style={{ color: "var(--muted-foreground)" }} />
            <Input
              placeholder="Search by operator, MHE, zone, action ID..."
              className="h-9 pl-9 text-[12px] w-72"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right-aligned cluster: Filter / Group By / Sort By / count */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-[12px] font-medium hover:bg-muted transition-colors"
            >
              <FilterIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "var(--foreground)", color: "var(--background)" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            <Select value={groupBy} onValueChange={v => setGroupBy(v as GroupBy)}>
              <SelectTrigger className="h-9 text-[12px] w-36"><SelectValue placeholder="Group By" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Grouping</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="businessArea">Business Area</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="owner">Assigned To</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={v => setSortBy(v as SortBy)}>
              <SelectTrigger className="h-9 text-[12px] w-40"><SelectValue placeholder="Sort By" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="sla">SLA Remaining</SelectItem>
                <SelectItem value="mostRepeated">Most Repeated</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-[11px] whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>
              {sorted.length} of {items.length} actions
            </span>
          </div>

          <div className="w-px h-5 bg-border" />

          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <span className="text-[11px] font-medium px-2 py-1 rounded-md" style={{ background: "var(--muted)" }}>
                {selected.size} selected
              </span>
            )}
            <Button className="h-9 gap-2 text-[12px] font-semibold px-4" onClick={() => toast.info("Manual action creation — coming soon")}>
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              Create Manual Action
            </Button>
          </div>
        </div>

        {/* ── Active filter chips ── */}
        {(filterChips.length > 0 || search) && (
          <div className="flex items-center flex-wrap gap-2 px-6 pb-3">
            {search && (
              <span className="flex items-center gap-1.5 text-[11.5px] font-medium pl-2.5 pr-1.5 py-1 rounded-full" style={{ background: "var(--muted)" }}>
                Search: "{search}"
                <button onClick={() => setSearch("")} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterChips.map(chip => (
              <span key={chip.key} className="flex items-center gap-1.5 text-[11.5px] font-medium pl-2.5 pr-1.5 py-1 rounded-full" style={{ background: "var(--muted)" }}>
                {chip.label}
                <button onClick={chip.onRemove} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
              </span>
            ))}
            {(filterChips.length > 0 || search) && (
              <button onClick={clearAll} className="text-[11.5px] font-semibold hover:underline" style={{ color: "var(--chart-1)" }}>
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2" style={{ color: "var(--muted-foreground)" }}>
            <div className="text-[13px] font-medium">No actions match your filters</div>
            <button onClick={clearAll} className="text-[12px] underline">Clear filters</button>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10">
                    <Checkbox checked={selected.size > 0 && selected.size === sorted.length} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="text-[11px]">Action ID</TableHead>
                  <TableHead className="text-[11px]">Business Group</TableHead>
                  <TableHead className="text-[11px]">Suite</TableHead>
                  <TableHead className="text-[11px]">Action Target</TableHead>
                  <TableHead className="text-[11px]">Events</TableHead>
                  <TableHead className="text-[11px]">Assigned To</TableHead>
                  <TableHead className="text-[11px]">Status</TableHead>
                  <TableHead className="text-[11px]">SLA</TableHead>
                  <TableHead className="text-[11px]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map(group => (
                  <React.Fragment key={group.key}>
                    {groupBy !== "none" && (
                      <TableRow className="hover:bg-transparent" style={{ background: "var(--muted)" }}>
                        <TableCell colSpan={12} className="py-2">
                          <button
                            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide"
                            style={{ color: "var(--muted-foreground)" }}
                            onClick={() => setCollapsedGroups(prev => {
                              const next = new Set(prev);
                              next.has(group.key) ? next.delete(group.key) : next.add(group.key);
                              return next;
                            })}
                          >
                            {collapsedGroups.has(group.key) ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            {group.label} <span className="font-normal normal-case">({group.rows.length})</span>
                          </button>
                        </TableCell>
                      </TableRow>
                    )}
                    {!collapsedGroups.has(group.key) && group.rows.map(item => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => setDetailItem(item)}
                      >
                        <TableCell onClick={e => e.stopPropagation()}>
                          <Checkbox checked={selected.has(item.id)} onCheckedChange={() => toggleSelect(item.id)} />
                        </TableCell>
                        <TableCell>
                          <span className="text-[12px] font-medium" style={{ color: "var(--chart-1)" }}>{item.id}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-medium">{item.businessGroup}</span>
                            {item.isRepeated && <Repeat className="w-3 h-3 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />}
                          </div>
                          <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{item.businessArea}</div>
                        </TableCell>
                        <TableCell><SuiteBadge suite={item.suite} /></TableCell>
                        <TableCell><ActionTargetCell item={item} /></TableCell>
                        <TableCell>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--muted)" }}>
                            {item.eventCount} events
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <OwnerAvatar initials={item.ownerAvatar} />
                            <span className="text-[12px]">{item.owner}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <StatusBadge status={item.status} />
                            {item.isOverdue && item.status !== "Resolved" && <OverdueBadge />}
                          </div>
                        </TableCell>
                        <TableCell><span className="text-[12px]">{item.sla}</span></TableCell>
                        <TableCell><span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>{item.createdDisplay}</span></TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} businessAreas={businessAreas} allItems={items} />
      <DetailDrawer item={detailItem} open={!!detailItem} onClose={() => setDetailItem(null)} onStatusChange={handleStatusChange} />
    </div>
  );
}
