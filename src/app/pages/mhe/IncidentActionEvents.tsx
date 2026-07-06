import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ReassignModal } from "./ReassignModal";
import { useSidebar } from "../../components/layout/SidebarLayout";
import {
  formatDateShort,
  PriorityDot,
  StatusBadge,
  OwnerAvatar,
} from "./IncidentActions";
import {
  MOCK_INCIDENT_ACTIONS,
  PRIORITY_COLORS,
  sortBySeverity,
} from "./types/incident-actions";

function EventDetailCard({
  event, index, actionId, responsibleRole,
  reportedBy, reportedOn,
  checked, onToggleChecked, assignee,
}: {
  event: { label: string; severity: "Critical" | "High" | "Medium" | "Low"; location: string; count: number; note?: string };
  index: number;
  actionId: string;
  responsibleRole: string;
  reportedBy: React.ReactNode;
  reportedOn: string;
  checked: boolean;
  onToggleChecked: () => void;
  assignee?: { name: string; initials: string };
}) {
  const [collapsed, setCollapsed] = useState(false);
  const eventId = `${actionId}-E${index + 1}`;
  const isUrgent = event.severity === "Critical" || event.severity === "High";

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: "var(--muted)" }}>
        <Checkbox
          checked={checked}
          onCheckedChange={onToggleChecked}
          className="border-2"
          style={{ borderColor: checked ? undefined : "var(--muted-foreground)", background: checked ? undefined : "var(--card)" }}
        />
        <button
          className="flex items-center gap-2 flex-1 text-left"
          onClick={() => setCollapsed(c => !c)}
        >
          {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} /> : <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />}
          <span className="text-[13px] font-semibold">{eventId}</span>
        </button>
        {assignee && (
          <span className="flex items-center gap-1.5 text-[11px] font-medium shrink-0">
            <OwnerAvatar initials={assignee.initials} />
            Assigned to {assignee.name}
          </span>
        )}
      </div>

      {!collapsed && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-5 py-5">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Observation</p>
              <p className="text-[14px] font-semibold">{event.label}</p>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Severity</p>
              <Badge
                className="text-[10.5px] font-semibold px-2 h-[19px] rounded-full border-transparent"
                style={{ background: `color-mix(in srgb, ${PRIORITY_COLORS[event.severity]} 14%, transparent)`, color: PRIORITY_COLORS[event.severity] }}
              >
                {event.severity}
              </Badge>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Location</p>
              <span className="flex items-center gap-1.5 text-[13px]">
                <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
                {event.location}
              </span>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Operator</p>
              {reportedBy}
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Reported On</p>
              <span className="text-[13px]">{reportedOn}</span>
            </div>
            {event.note && (
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Notes / Comments</p>
                <p className="text-[13px] leading-relaxed italic" style={{ color: "var(--muted-foreground)" }}>{event.note}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Occurred</p>
              <span className="text-[14px] font-semibold">{String(event.count).padStart(2, "0")} times</span>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Event ID</p>
              <span className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>{eventId}</span>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Flags</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {isUrgent && (
                  <Badge className="text-[10px] font-semibold px-2 h-[19px] rounded-full border-transparent" style={{ background: "color-mix(in srgb, var(--destructive) 16%, transparent)", color: "var(--destructive)" }}>
                    High Urgency
                  </Badge>
                )}
                {event.count > 1 && (
                  <Badge variant="secondary" className="text-[10px] font-semibold px-2 h-[19px] rounded-full">
                    Repeated ×{event.count}
                  </Badge>
                )}
                {!isUrgent && event.count <= 1 && (
                  <span className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>—</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>Designation</p>
              <span className="text-[13px]">{responsibleRole}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function IncidentActionEvents() {
  const { actionId } = useParams<{ actionId: string }>();
  const navigate = useNavigate();
  const sidebar = useSidebar();
  const item = MOCK_INCIDENT_ACTIONS.find(i => i.id === actionId);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [assignments, setAssignments] = useState<Record<number, { name: string; initials: string }>>({});
  const [assignOpen, setAssignOpen] = useState(false);

  useEffect(() => {
    sidebar?.setSubPageTitle(item ? `${item.id} · Related Events` : "Related Events");
    sidebar?.setSubPageBack(() => navigate("/mhe/incident-actions"));
    return () => { sidebar?.setSubPageTitle(null); sidebar?.setSubPageBack(null); };
  }, [item?.id]);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-24">
        <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>Action not found.</p>
        <Button variant="outline" onClick={() => navigate("/mhe/incident-actions")}>Back to Incident Actions</Button>
      </div>
    );
  }

  const sortedEvents = sortBySeverity(item.events);
  const selectedLabels = Array.from(selected).map(i => sortedEvents[i]?.label).filter(Boolean) as string[];

  const toggle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--background)" }}>
      <div className="shrink-0 px-6 pt-5 pb-4 border-b border-border flex items-start justify-between">
        <div>
          <h1 className="text-[16px] font-semibold">{item.id}</h1>
          <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>{item.businessGroup} · {item.actionTargetLabel}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[12px] font-medium"><PriorityDot priority={item.priority} />{item.priority}</div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold">Related Events ({sortedEvents.length})</p>
          {selected.size > 0 && (
            <span className="text-[12px] font-medium" style={{ color: "var(--muted-foreground)" }}>{selected.size} selected</span>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {sortedEvents.map((e, i) => (
            <EventDetailCard
              key={`${e.label}-${i}`}
              event={e}
              index={i}
              actionId={item.id}
              responsibleRole={item.responsibleRole}
              reportedBy={
                <span className="flex items-center gap-1.5 text-[13px] font-medium">
                  <OwnerAvatar initials={item.ownerAvatar} />
                  {item.owner}
                </span>
              }
              reportedOn={formatDateShort(item.createdAt)}
              checked={selected.has(i)}
              onToggleChecked={() => toggle(i)}
              assignee={assignments[i]}
            />
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-border px-6 py-4 flex items-center justify-between gap-3">
        <Button variant="outline" className="h-9 px-4 text-[12px] font-semibold" onClick={() => navigate("/mhe/incident-actions")}>
          Back
        </Button>
        <Button
          className="h-9 px-4 text-[12px] font-semibold"
          disabled={selected.size === 0}
          onClick={() => setAssignOpen(true)}
        >
          Proceed to Action Assignment
        </Button>
      </div>

      <ReassignModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        currentLevel={(["L1", "L2", "L3", "L4"][Math.min(item.escalationLevel, 3)] ?? "L1") as "L1" | "L2" | "L3" | "L4"}
        currentAssignee="Unassigned"
        escalationId={item.id}
        escalationTitle={selectedLabels.length === 1 ? selectedLabels[0] : `${selectedLabels.length} events`}
        onConfirm={(user, note) => {
          console.log("Assigned events:", selectedLabels, "to:", user.name, "note:", note);
          setAssignments(prev => {
            const next = { ...prev };
            selected.forEach(i => { next[i] = { name: user.name, initials: user.initials }; });
            return next;
          });
          toast.success(`Assigned ${selected.size > 1 ? `${selected.size} events` : "event"} to ${user.name}`);
          setSelected(new Set());
          setAssignOpen(false);
        }}
      />
    </div>
  );
}
