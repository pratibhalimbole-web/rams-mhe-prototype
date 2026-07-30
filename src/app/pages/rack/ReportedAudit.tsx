import { useEffect, useMemo, useState } from "react";
import { useSidebar } from "../../components/layout/SidebarLayout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  CalendarClock,
  MapPin,
  Boxes,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { cn } from "../../components/ui/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Severity = "Red" | "Amber" | "Green";
type ElementType = "Upright" | "Beam" | "Bracing" | "Base Plate" | "Row Spacer" | "Safety Clip";
type ActionType = "Under Observation" | "Repair" | "Replace" | "Decommissioned";
type IssueType = "Dent" | "Structural Damage" | "Rust" | "Paint Chip" | "Loose Connection" | "Missing Component";

interface AuditIssue {
  id: string;
  dueDateIso: string;
  dueDateDisplay: string;
  severity: Severity;
  issueType: IssueType;
  element: ElementType;
  rackName: string;
  zone: string;
  action: ActionType;
  location: string;
  reportedBy: string;
  reportedByInitials: string;
  reportedOn: string;
  notes: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
// Element / rack-ID / bay-level vocabulary kept consistent with the rest of the
// rack module (RulesAndAction.tsx element list, Stability.tsx "R-00N" rack IDs,
// StabilityDetail.tsx "Bay_n | Level_n" location format).

const RACKS = [
  { rackName: "R-001", zone: "Zone A" },
  { rackName: "R-002", zone: "Zone A" },
  { rackName: "R-003", zone: "Zone B" },
  { rackName: "R-004", zone: "Zone B" },
  { rackName: "R-005", zone: "Zone C" },
];

const REPORTERS = [
  { name: "Vivek Deshmukh", initials: "VD" },
  { name: "Arjun Mehta", initials: "AM" },
  { name: "Sneha Patil", initials: "SP" },
];

const ISSUE_NOTES: Record<IssueType, string> = {
  Dent: "Minor surface dent identified during routine walkthrough — monitored for progression.",
  "Structural Damage": "Structural deformation on vertical member — flagged for immediate engineering review.",
  Rust: "Surface corrosion detected — recommend re-coating before it reaches the base metal.",
  "Paint Chip": "Cosmetic paint chip, no structural impact observed.",
  "Loose Connection": "Connector bolt found loose during torque check — retightened and logged.",
  "Missing Component": "Component missing from assembly — replacement requested from stores.",
};

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(options: T[], seed: string): T {
  return options[hashSeed(seed) % options.length];
}

const SEVERITIES: Severity[] = ["Red", "Amber", "Green"];
const ELEMENTS: ElementType[] = ["Upright", "Beam", "Bracing", "Base Plate", "Row Spacer", "Safety Clip"];
const ACTIONS: ActionType[] = ["Under Observation", "Repair", "Replace", "Decommissioned"];
const ISSUE_TYPES: IssueType[] = ["Dent", "Structural Damage", "Rust", "Paint Chip", "Loose Connection", "Missing Component"];

const DUE_DATES = [
  { iso: "2026-08-02", display: "02 August 2026" },
  { iso: "2026-08-05", display: "05 August 2026" },
  { iso: "2026-08-09", display: "09 August 2026" },
  { iso: "2026-08-14", display: "14 August 2026" },
  { iso: "2026-08-18", display: "18 August 2026" },
  { iso: "2026-08-22", display: "22 August 2026" },
];

const REPORTED_DATES = ["18 Jul 2026", "20 Jul 2026", "22 Jul 2026", "24 Jul 2026", "27 Jul 2026", "29 Jul 2026"];

const MOCK_ISSUES: AuditIssue[] = Array.from({ length: 24 }, (_, i) => {
  const seed = `audit-${i}`;
  const rack = pick(RACKS, `rack::${seed}`);
  const severity = pick(SEVERITIES, `sev::${seed}`);
  const element = pick(ELEMENTS, `elem::${seed}`);
  const issueType = pick(ISSUE_TYPES, `issue::${seed}`);
  const action = severity === "Green" ? "Under Observation" : pick(ACTIONS, `action::${seed}`);
  const dueDate = pick(DUE_DATES, `due::${seed}`);
  const reporter = pick(REPORTERS, `reporter::${seed}`);
  const bay = (hashSeed(`bay::${seed}`) % 6) + 1;
  const level = (hashSeed(`level::${seed}`) % 4) + 1;

  return {
    id: `AUD-${String(1000 + i)}`,
    dueDateIso: dueDate.iso,
    dueDateDisplay: dueDate.display,
    severity,
    issueType,
    element,
    rackName: rack.rackName,
    zone: rack.zone,
    action,
    location: `${rack.zone} · Bay_${bay}, Level_${level}`,
    reportedBy: reporter.name,
    reportedByInitials: reporter.initials,
    reportedOn: pick(REPORTED_DATES, `reported::${seed}`),
    notes: ISSUE_NOTES[issueType],
  };
});

// ─── Style Helpers ───────────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<Severity, string> = {
  Red: "#ef4444",
  Amber: "#f59e0b",
  Green: "#10b981",
};

const CARD_HOVER_FX = cn(
  "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "hover:-translate-y-0.5",
  "hover:border-[color-mix(in_srgb,var(--primary)_45%,transparent)]",
  "hover:shadow-[0_4px_10px_-6px_color-mix(in_srgb,var(--primary)_20%,transparent)]",
  "active:border-[var(--primary)]",
  "dark:hover:border-[#60a5fa8c]",
  "dark:hover:bg-[color-mix(in_srgb,var(--card)_92%,var(--primary)_8%)]",
  "dark:hover:shadow-[0_0_0_1px_#60a5fa33,0_5px_12px_-6px_#3b82f640]"
);

function SeverityBadge({ severity }: { severity: Severity }) {
  const color = SEVERITY_COLORS[severity];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
    >
      {severity}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10.5px] font-medium uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </span>
      <span className="text-[12.5px] font-semibold truncate" style={{ color: "var(--foreground)" }}>
        {value}
      </span>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-md text-[11px] font-medium"
      style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)", color: "var(--primary)" }}
    >
      {label}
      <button onClick={onRemove} className="rounded-sm hover:bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] p-0.5">
        <X className="w-3 h-3" strokeWidth={1.5} />
      </button>
    </span>
  );
}

// ─── Multi-select filter dropdown ─────────────────────────────────────────────

function MultiSelectFilter<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: T[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  const toggle = (val: T) =>
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-9 flex items-center gap-1.5 px-3 rounded-md border border-border text-[12.5px] bg-background hover:bg-accent transition-colors">
          <span style={{ color: selected.length ? "var(--foreground)" : "var(--muted-foreground)" }}>
            {label}
            {selected.length > 0 ? ` (${selected.length})` : ""}
          </span>
          <ChevronDown className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto p-1 min-w-[190px]">
        {options.map((o) => (
          <DropdownMenuItem
            key={o}
            onSelect={(e) => { e.preventDefault(); toggle(o); }}
            className={cn("gap-2.5 py-2", selected.includes(o) && "bg-accent")}
          >
            <Checkbox checked={selected.includes(o)} />
            <span className="text-[13px]">{o}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Audit Card ──────────────────────────────────────────────────────────────

function AuditCard({ issue, onClick }: { issue: AuditIssue; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn("group bg-card border border-border rounded-lg cursor-pointer overflow-hidden", CARD_HOVER_FX)}
    >
      <div className="p-4 flex flex-col gap-3">
        {/* Due date + severity */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <CalendarClock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
            <span className="text-[11.5px] truncate" style={{ color: "var(--muted-foreground)" }}>
              Due: <span className="font-medium" style={{ color: "var(--foreground)" }}>{issue.dueDateDisplay}</span>
            </span>
          </div>
          <SeverityBadge severity={issue.severity} />
        </div>

        {/* Issue type + element */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Issue Type" value={issue.issueType} />
          <Field label="Element" value={issue.element} />
        </div>

        {/* Rack + action */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Rack Name" value={issue.rackName} />
          <Field label="Action" value={issue.action} />
        </div>

        {/* Location */}
        <div className="pt-2.5 border-t border-border flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10.5px] font-medium uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
              Location
            </span>
            <span className="text-[12px] font-medium truncate" style={{ color: "var(--foreground)" }}>
              {issue.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 col-span-full">
      <Inbox className="w-9 h-9" strokeWidth={1.5} style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No reported audits match your filters</p>
    </div>
  );
}

// ─── Detail Drawer ───────────────────────────────────────────────────────────

function IssueDetailDrawer({ issue, open, onClose }: { issue: AuditIssue | null; open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[420px] flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="text-[15px]">Audit Detail</SheetTitle>
        </SheetHeader>

        {issue && (
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>{issue.id}</span>
              <SeverityBadge severity={issue.severity} />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>{issue.issueType}</p>
              <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{issue.notes}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3.5 rounded-lg" style={{ background: "var(--muted)" }}>
              <Field label="Element" value={issue.element} />
              <Field label="Action" value={issue.action} />
              <Field label="Rack Name" value={issue.rackName} />
              <Field label="Zone" value={issue.zone} />
            </div>

            <div className="flex items-start gap-2">
              <Boxes className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
              <Field label="Location" value={issue.location} />
            </div>

            <div className="flex items-center gap-2.5 pt-3 border-t border-border">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0"
                style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {issue.reportedByInitials}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-medium truncate" style={{ color: "var(--foreground)" }}>{issue.reportedBy}</p>
                <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>Reported {issue.reportedOn}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
              <span className="text-[12px]" style={{ color: "var(--foreground)" }}>Closing date: {issue.dueDateDisplay}</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ReportedAudit() {
  const sidebar = useSidebar();

  useEffect(() => {
    if (sidebar) sidebar.setSubPageTitle("Reported Audit");
  }, [sidebar]);

  const [search, setSearch] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [sortOldestFirst, setSortOldestFirst] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<Severity[]>([]);
  const [elementFilter, setElementFilter] = useState<ElementType[]>([]);
  const [actionFilter, setActionFilter] = useState<ActionType[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<AuditIssue | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = MOCK_ISSUES.filter((issue) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        issue.rackName.toLowerCase().includes(q) ||
        issue.issueType.toLowerCase().includes(q) ||
        issue.element.toLowerCase().includes(q) ||
        issue.location.toLowerCase().includes(q);
      const matchesPending = !pendingOnly || issue.action !== "Decommissioned";
      const matchesSeverity = severityFilter.length === 0 || severityFilter.includes(issue.severity);
      const matchesElement = elementFilter.length === 0 || elementFilter.includes(issue.element);
      const matchesAction = actionFilter.length === 0 || actionFilter.includes(issue.action);
      return matchesSearch && matchesPending && matchesSeverity && matchesElement && matchesAction;
    });

    list = [...list].sort((a, b) => {
      const diff = new Date(a.dueDateIso).getTime() - new Date(b.dueDateIso).getTime();
      return sortOldestFirst ? diff : -diff;
    });

    return list;
  }, [search, pendingOnly, sortOldestFirst, severityFilter, elementFilter, actionFilter]);

  const activeFilterCount = severityFilter.length + elementFilter.length + actionFilter.length;

  const handleCardClick = (issue: AuditIssue) => {
    setSelectedIssue(issue);
    setDrawerOpen(true);
  };

  const clearAllFilters = () => {
    setSeverityFilter([]);
    setElementFilter([]);
    setActionFilter([]);
    setSortOldestFirst(true);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <div className="flex-1 overflow-y-auto px-[var(--spacing-8)] py-[var(--spacing-6)]">
        <div className="flex flex-col gap-5">

          {/* Utility row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" strokeWidth={1.5} />
              <Input
                type="text"
                placeholder="Search rack, element, issue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2 px-3 h-9 rounded-md border border-border">
              <span className="text-[12.5px] font-medium" style={{ color: "var(--foreground)" }}>Pending only</span>
              <Switch checked={pendingOnly} onCheckedChange={setPendingOnly} />
            </div>

            <MultiSelectFilter label="Severity" options={SEVERITIES} selected={severityFilter} onChange={setSeverityFilter} />
            <MultiSelectFilter label="Element" options={ELEMENTS} selected={elementFilter} onChange={setElementFilter} />
            <MultiSelectFilter label="Action" options={ACTIONS} selected={actionFilter} onChange={setActionFilter} />

            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 ml-auto"
              onClick={() => setSortOldestFirst((v) => !v)}
            >
              <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.5} />
              {sortOldestFirst ? "Oldest first" : "Newest first"}
            </Button>
          </div>

          {/* Count + active filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                Total: {filtered.length}
              </span>
            </div>

            {severityFilter.map((s) => (
              <Chip key={`sev-${s}`} label={`Severity: ${s}`} onRemove={() => setSeverityFilter(severityFilter.filter((v) => v !== s))} />
            ))}
            {elementFilter.map((e) => (
              <Chip key={`el-${e}`} label={`Element: ${e}`} onRemove={() => setElementFilter(elementFilter.filter((v) => v !== e))} />
            ))}
            {actionFilter.map((a) => (
              <Chip key={`ac-${a}`} label={`Action: ${a}`} onRemove={() => setActionFilter(actionFilter.filter((v) => v !== a))} />
            ))}

            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[12px] font-medium underline ml-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Card grid */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map((issue) => (
                <AuditCard key={issue.id} issue={issue} onClick={() => handleCardClick(issue)} />
              ))
            )}
          </div>
        </div>
      </div>

      <IssueDetailDrawer issue={selectedIssue} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
