// ─── Incident Actions — List view of business-level operational problems ─────
// Source of truth for record shape/grouping: MHE_Master_Action_Board_Matrix
// (Suite → Business Area → Action Group → Action Target → Recommended Action)

export type Suite = "RTSS" | "MEPS" | "FMS" | "IMDS";
export type Priority = "Critical" | "High" | "Medium" | "Low";
export type ActionTargetType = "Operator" | "MHE" | "Zone" | "Team";
// Workflow stage only. Urgency (SLA breached) is a separate, computed signal —
// `isOverdue` below — so it stays accurate without anyone manually flipping a
// status; "In Progress" was dropped because it told you nothing "Assigned"
// didn't already, while overdue-or-not is the thing that actually changes
// what a manager does next.
export type IncidentStatus = "New" | "Assigned" | "Resolved";

// A single rolled-up event within a business-group record. Carries its own
// severity + location so the drawer can surface "which one do I act on
// first" instead of a flat, unordered list.
export interface IncidentEvent {
  label: string;
  severity: Priority;
  location: string;      // where it happened — rack/bay, aisle, zone, MHE
  count: number;         // how many raw occurrences rolled into this line
  note?: string;         // optional short consequence/context, e.g. "rack structurally damaged"
}

export interface IncidentAction {
  id: string;
  suite: Suite;
  businessArea: string;
  businessGroup: string;          // the "business problem" title — never a raw event
  actionTargetType: ActionTargetType;
  actionTargetLabel: string;      // concrete instance, e.g. "MHE-014", "Zone C"
  eventCount: number;
  events: IncidentEvent[];        // raw events rolled up into this record
  recommendedAction: string;
  responsibleRole: string;
  owner: string;
  ownerAvatar: string;
  priority: Priority;
  sla: string;
  status: IncidentStatus;
  isOverdue: boolean;              // SLA/due date crossed while still open
  sourceDashboard: string;
  sourceWidget: string;
  kpiImpact: string;
  createdAt: string;              // ISO
  createdDisplay: string;
  escalationChain: string[];      // L1 -> L2 -> L3
  escalationLevel: number;        // 0 = not escalated
  isRepeated: boolean;
}

export const SUITES: Suite[] = ["RTSS", "MEPS", "FMS", "IMDS"];

export const PRIORITY_ORDER: Record<Priority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export function sortBySeverity(events: IncidentEvent[]): IncidentEvent[] {
  return [...events].sort((a, b) => PRIORITY_ORDER[a.severity] - PRIORITY_ORDER[b.severity]);
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  Critical: "var(--destructive)",
  High:     "var(--warning)",
  Medium:   "var(--chart-1)",
  Low:      "var(--muted-foreground)",
};

export const SUITE_COLORS: Record<Suite, string> = {
  RTSS: "var(--destructive)",
  MEPS: "var(--chart-3)",
  FMS:  "var(--chart-2)",
  IMDS: "var(--chart-4)",
};

export const STATUS_COLORS: Record<IncidentStatus, string> = {
  New:      "var(--muted-foreground)",
  Assigned: "var(--chart-1)",
  Resolved: "var(--success)",
};

export const OVERDUE_COLOR = "var(--warning)";

export const MOCK_INCIDENT_ACTIONS: IncidentAction[] = [
  {
    id: "AC-RTSS-0142", suite: "RTSS", businessArea: "Safety",
    businessGroup: "Unsafe Driving Behaviour", actionTargetType: "Operator", actionTargetLabel: "Ajay Malhotra",
    eventCount: 8,
    events: [
      { label: "Raised Fork Movement", severity: "Critical", location: "Aisle C · Bay A12", count: 1, note: "load carried at unsafe height while driving" },
      { label: "Overspeed",            severity: "High",     location: "Aisle C",            count: 3 },
      { label: "Harsh Braking",        severity: "Medium",   location: "Aisle C · Junction",  count: 2 },
      { label: "Erratic Speed",        severity: "Medium",   location: "Aisle C",            count: 1 },
      { label: "Jerk",                 severity: "Low",      location: "Aisle C",            count: 1 },
    ],
    recommendedAction: "Coach Operator", responsibleRole: "Safety Officer",
    owner: "R. Sharma", ownerAvatar: "RS", priority: "High", sla: "4 Hours",
    status: "Assigned", isOverdue: true, sourceDashboard: "RTSS Dashboard", sourceWidget: "Driving Behaviour Trend",
    kpiImpact: "Safety Score", createdAt: "2026-07-02T09:10", createdDisplay: "Today, 9:10 AM",
    escalationChain: ["Shift Supervisor", "Safety Manager", "Warehouse Manager"], escalationLevel: 0, isRepeated: true,
  },
  {
    id: "AC-RTSS-0143", suite: "RTSS", businessArea: "Safety",
    businessGroup: "Collision & Near Miss", actionTargetType: "MHE", actionTargetLabel: "MHE-008",
    eventCount: 4,
    events: [
      { label: "Impact Event",              severity: "Critical", location: "Main Storage · Rack R5, Bay B12", count: 1, note: "MHE-008 collided with rack upright — rack structurally damaged, isolate bay" },
      { label: "MHE↔Rack Proximity",        severity: "High",     location: "Main Storage · Rack R4, Bay A08", count: 2 },
      { label: "Pedestrian↔MHE Proximity",  severity: "High",     location: "Aisle D · Cross-aisle junction",  count: 1 },
    ],
    recommendedAction: "Safety Investigation", responsibleRole: "Safety Officer + Maintenance",
    owner: "A. Desai", ownerAvatar: "AD", priority: "Critical", sla: "Immediate (0–2 hrs)",
    status: "Assigned", isOverdue: true, sourceDashboard: "Command Center", sourceWidget: "Impact Heatmap",
    kpiImpact: "Safety Score", createdAt: "2026-07-03T07:45", createdDisplay: "Today, 7:45 AM",
    escalationChain: ["Shift Supervisor", "Safety Manager", "Warehouse Manager"], escalationLevel: 2, isRepeated: false,
  },
  {
    id: "AC-RTSS-0144", suite: "RTSS", businessArea: "Safety",
    businessGroup: "PPE Compliance", actionTargetType: "Operator", actionTargetLabel: "Deepak Singh",
    eventCount: 2,
    events: [
      { label: "No Helmet", severity: "High",   location: "Zone C · Entrance",  count: 1 },
      { label: "No Vest",   severity: "Medium", location: "Bulk Storage",       count: 1 },
    ],
    recommendedAction: "Compliance Enforcement", responsibleRole: "Safety Officer",
    owner: "S. Iyer", ownerAvatar: "SI", priority: "Medium", sla: "8 Hours",
    status: "New", isOverdue: false, sourceDashboard: "RTSS Dashboard", sourceWidget: "PPE Compliance %",
    kpiImpact: "Compliance Score", createdAt: "2026-07-03T08:20", createdDisplay: "Today, 8:20 AM",
    escalationChain: ["Supervisor", "Safety Manager", "Warehouse Manager"], escalationLevel: 0, isRepeated: false,
  },
  {
    id: "AC-RTSS-0145", suite: "RTSS", businessArea: "Safety",
    businessGroup: "Zone Safety", actionTargetType: "Zone", actionTargetLabel: "Zone B",
    eventCount: 2,
    events: [
      { label: "Speeding in Restricted Zone", severity: "Critical", location: "Zone B · Restricted perimeter", count: 1 },
      { label: "Restricted Zone Entry",       severity: "High",     location: "Zone B · Gate 2",               count: 1 },
    ],
    recommendedAction: "Investigate Access Violation", responsibleRole: "Supervisor",
    owner: "N. Kapoor", ownerAvatar: "NK", priority: "High", sla: "4 Hours",
    status: "Assigned", isOverdue: true, sourceDashboard: "Command Center", sourceWidget: "Zone Heatmap",
    kpiImpact: "Safety Score", createdAt: "2026-07-02T14:05", createdDisplay: "Yesterday, 2:05 PM",
    escalationChain: ["Operations Lead", "Safety Manager", "Warehouse Manager"], escalationLevel: 0, isRepeated: false,
  },
  {
    id: "AC-RTSS-0146", suite: "RTSS", businessArea: "Safety",
    businessGroup: "Environmental Hazard", actionTargetType: "Zone", actionTargetLabel: "Zone C — Aisle 4",
    eventCount: 3,
    events: [
      { label: "Object in Aisle",   severity: "High",   location: "Zone C · Aisle 4",                 count: 1, note: "blocking travel path" },
      { label: "Wet Surface",       severity: "Medium", location: "Zone C · Aisle 4, near QC Station", count: 1 },
      { label: "Aisle Congestion",  severity: "Low",    location: "Zone C · Aisle 3",                 count: 1 },
    ],
    recommendedAction: "Remove Hazard & Verify Clearance", responsibleRole: "Warehouse Supervisor",
    owner: "P. Verma", ownerAvatar: "PV", priority: "High", sla: "2 Hours",
    status: "Assigned", isOverdue: true, sourceDashboard: "Command Center", sourceWidget: "Hazard Events",
    kpiImpact: "Safety Score", createdAt: "2026-07-03T06:30", createdDisplay: "Today, 6:30 AM",
    escalationChain: ["Operations Lead", "Warehouse Manager", "Plant Manager"], escalationLevel: 1, isRepeated: false,
  },
  {
    id: "AC-MEPS-0087", suite: "MEPS", businessArea: "Productivity",
    businessGroup: "Productivity Coaching", actionTargetType: "Operator", actionTargetLabel: "Vikram Nair",
    eventCount: 4,
    events: [
      { label: "Continuous Driving",   severity: "High",   location: "Aisle B",        count: 1, note: "fatigue risk — no break in 3+ hrs" },
      { label: "Insufficient Breaks",  severity: "Medium", location: "Staging Area",   count: 1 },
      { label: "Excessive Breaks",     severity: "Low",    location: "Staging Area",   count: 1 },
      { label: "Too Slow",             severity: "Low",    location: "Bay D-08",       count: 1 },
    ],
    recommendedAction: "Review Workload & Coach", responsibleRole: "Operations Manager",
    owner: "K. Rao", ownerAvatar: "KR", priority: "Medium", sla: "24 Hours",
    status: "New", isOverdue: false, sourceDashboard: "MEPS Productivity Dashboard", sourceWidget: "Productivity Trend",
    kpiImpact: "Productivity Score", createdAt: "2026-07-02T11:00", createdDisplay: "Yesterday, 11:00 AM",
    escalationChain: ["Shift Lead", "Operations Manager", "Warehouse Manager"], escalationLevel: 0, isRepeated: false,
  },
  {
    id: "AC-MEPS-0088", suite: "MEPS", businessArea: "Efficiency",
    businessGroup: "Idle Optimization", actionTargetType: "MHE", actionTargetLabel: "MHE-021",
    eventCount: 3,
    events: [
      { label: "Idle With Load",  severity: "High",   location: "Aisle A",       count: 1, note: "blocking aisle with load raised" },
      { label: "Excessive Idle",  severity: "Medium", location: "Charging Bay",  count: 1 },
      { label: "Low Idle",        severity: "Low",    location: "Bulk Storage",  count: 1 },
    ],
    recommendedAction: "Optimize Routes & Task Allocation", responsibleRole: "Warehouse Supervisor",
    owner: "T. Menon", ownerAvatar: "TM", priority: "Medium", sla: "24 Hours",
    status: "Assigned", isOverdue: false, sourceDashboard: "MEPS Efficiency Dashboard", sourceWidget: "Idle Time",
    kpiImpact: "Efficiency Score", createdAt: "2026-07-02T16:40", createdDisplay: "Yesterday, 4:40 PM",
    escalationChain: ["Operations Lead", "Operations Manager", "Warehouse Manager"], escalationLevel: 0, isRepeated: true,
  },
  {
    id: "AC-MEPS-0089", suite: "MEPS", businessArea: "Compliance",
    businessGroup: "Operator Compliance", actionTargetType: "Operator", actionTargetLabel: "Suresh Kumar",
    eventCount: 4,
    events: [
      { label: "Authorized Only",         severity: "Critical", location: "Bay D-08",  count: 1, note: "operated MHE without valid authorization" },
      { label: "Speed Adherence",         severity: "High",     location: "Aisle C",   count: 1 },
      { label: "Loaded Zone Compliance",  severity: "Medium",   location: "Zone B",    count: 1 },
      { label: "Break Compliance",        severity: "Low",      location: "Staging Area", count: 1 },
    ],
    recommendedAction: "Review Compliance & Retrain", responsibleRole: "Supervisor / HR",
    owner: "HR Team", ownerAvatar: "HR", priority: "High", sla: "24 Hours",
    status: "New", isOverdue: false, sourceDashboard: "MEPS Compliance Dashboard", sourceWidget: "Operator Compliance Score",
    kpiImpact: "Compliance Score", createdAt: "2026-07-03T09:00", createdDisplay: "Today, 9:00 AM",
    escalationChain: ["Operations Lead", "HR Manager", "Warehouse Manager"], escalationLevel: 0, isRepeated: false,
  },
  {
    id: "AC-FMS-0231", suite: "FMS", businessArea: "Fleet Health",
    businessGroup: "Maintenance Actions", actionTargetType: "MHE", actionTargetLabel: "MHE-011",
    eventCount: 6,
    events: [
      { label: "Hydraulic Issue",  severity: "Critical", location: "MHE-011 · Bay D-08",     count: 1, note: "lift function degraded — risk of load drop" },
      { label: "Sensor Offline",   severity: "High",     location: "MHE-011",                count: 1 },
      { label: "Battery Alert",    severity: "Medium",   location: "MHE-011 · Charging Bay", count: 1 },
      { label: "Fork Wear",        severity: "Medium",   location: "MHE-011",                count: 1 },
      { label: "Service Due",      severity: "Low",      location: "MHE-011",                count: 1 },
      { label: "Tyre Wear",        severity: "Low",      location: "MHE-011",                count: 1 },
    ],
    recommendedAction: "Generate Maintenance Work Order", responsibleRole: "Maintenance Manager",
    owner: "IoT Team", ownerAvatar: "IT", priority: "High", sla: "24 Hours",
    status: "Assigned", isOverdue: true, sourceDashboard: "FMS Dashboard", sourceWidget: "Fleet Compliance Score",
    kpiImpact: "Fleet Health", createdAt: "2026-07-01T22:15", createdDisplay: "2 days ago",
    escalationChain: ["Maintenance Lead", "Maintenance Manager", "Fleet Manager"], escalationLevel: 1, isRepeated: false,
  },
  {
    id: "AC-FMS-0232", suite: "FMS", businessArea: "Compliance",
    businessGroup: "Fleet Compliance", actionTargetType: "MHE", actionTargetLabel: "MHE-006",
    eventCount: 3,
    events: [
      { label: "Insurance Expiry", severity: "Critical", location: "MHE-006", count: 1, note: "cover lapsed — MHE must not be operated" },
      { label: "License Expiry",   severity: "High",     location: "MHE-006", count: 1 },
      { label: "Warranty Expiry",  severity: "Medium",   location: "MHE-006", count: 1 },
    ],
    recommendedAction: "Renew Compliance Documents", responsibleRole: "Fleet Admin",
    owner: "N. Kapoor", ownerAvatar: "NK", priority: "High", sla: "Before Expiry",
    status: "Assigned", isOverdue: false, sourceDashboard: "IMDS Dashboard", sourceWidget: "Warranty Expiry",
    kpiImpact: "Compliance Score", createdAt: "2026-06-29T10:00", createdDisplay: "5 days ago",
    escalationChain: ["Fleet Manager", "Operations Head", "Warehouse Manager"], escalationLevel: 0, isRepeated: false,
  },
  {
    id: "AC-IMDS-0064", suite: "IMDS", businessArea: "Inspection",
    businessGroup: "Critical Inspection Findings", actionTargetType: "MHE", actionTargetLabel: "MHE-014",
    eventCount: 3,
    events: [
      { label: "Structural Failure", severity: "Critical", location: "MHE-014 · Mast assembly",   count: 1, note: "isolate asset — do not operate" },
      { label: "Critical Defect",    severity: "Critical", location: "MHE-014 · Fork carriage",   count: 1 },
      { label: "RED Finding",        severity: "High",     location: "MHE-014",                    count: 1 },
    ],
    recommendedAction: "Immediate Inspection & Isolate Asset", responsibleRole: "Inspection Manager",
    owner: "A. Desai", ownerAvatar: "AD", priority: "Critical", sla: "Immediate",
    status: "Assigned", isOverdue: true, sourceDashboard: "IMDS Dashboard", sourceWidget: "RED Findings",
    kpiImpact: "Inspection Health", createdAt: "2026-07-03T08:50", createdDisplay: "Today, 8:50 AM",
    escalationChain: ["Maintenance Lead", "Inspection Manager", "Warehouse Manager"], escalationLevel: 3, isRepeated: false,
  },
  {
    id: "AC-IMDS-0065", suite: "IMDS", businessArea: "Inspection",
    businessGroup: "Planned Inspection", actionTargetType: "Team", actionTargetLabel: "Inspection Team B",
    eventCount: 5,
    events: [
      { label: "Repeat Finding",       severity: "High",   location: "Main Storage · Rack R5, Bay B12", count: 1 },
      { label: "Repair Pending",       severity: "Medium", location: "Main Storage · Rack R4",          count: 1 },
      { label: "Inspection Overdue",   severity: "Medium", location: "Bulk Storage",                    count: 1 },
      { label: "Amber Findings",       severity: "Low",    location: "Main Storage",                    count: 2 },
    ],
    recommendedAction: "Assign Inspection & Track Closure", responsibleRole: "Inspection Manager",
    owner: "S. Iyer", ownerAvatar: "SI", priority: "Medium", sla: "24–72 Hours",
    status: "New", isOverdue: false, sourceDashboard: "IMDS Dashboard", sourceWidget: "Inspection Planner",
    kpiImpact: "Inspection Health", createdAt: "2026-07-02T13:30", createdDisplay: "Yesterday, 1:30 PM",
    escalationChain: ["Inspection Lead", "Inspection Manager", "Warehouse Manager"], escalationLevel: 0, isRepeated: true,
  },
  {
    id: "AC-MEPS-0090", suite: "MEPS", businessArea: "Efficiency",
    businessGroup: "Driving Quality", actionTargetType: "Operator", actionTargetLabel: "Prashant Rao",
    eventCount: 4,
    events: [
      { label: "Smooth Acceleration", severity: "Low", location: "Aisle B", count: 2 },
      { label: "Consistent Speed",    severity: "Low", location: "Aisle B", count: 1 },
      { label: "Optimal Speed",       severity: "Low", location: "Aisle B", count: 1 },
    ],
    recommendedAction: "Monitor & Recognize", responsibleRole: "Operations Manager",
    owner: "K. Rao", ownerAvatar: "KR", priority: "Low", sla: "Weekly",
    status: "Resolved", isOverdue: false, sourceDashboard: "MEPS Efficiency Dashboard", sourceWidget: "Driving Quality Score",
    kpiImpact: "Efficiency Score", createdAt: "2026-06-27T09:00", createdDisplay: "6 days ago",
    escalationChain: ["Operations Lead", "Operations Manager", "Warehouse Manager"], escalationLevel: 0, isRepeated: false,
  },
];
