import {
  LayoutDashboard,
  Server,
  Truck,
  Package,
  BarChart,
  Wifi,
  Library,
  Settings,
  FileText,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  id: string;
  label: string;
  hidden?: boolean;  // registered for breadcrumb resolution but not shown in nav
};

export type Suite = {
  id: string;
  label: string;
  items: Feature[];
};

export type Domain = {
  id: string;
  label: string;
  icon: LucideIcon;
  type: "suite" | "flat" | "mixed";
  content: Suite[] | Feature[];
  topSharedFeatures?: Feature[];  // rendered before suites
  sharedFeatures?: Feature[];     // rendered after suites
};

export const domains: Domain[] = [
  {
    id: "digital-twin",
    label: "Digital Twin",
    icon: LayoutDashboard,
    type: "flat",
    content: [
      { id: "dt-dashboard", label: "Overview" },
      { id: "dt-map", label: "3D Map" },
    ],
  },
  {
    id: "rack",
    label: "Rack",
    icon: Server,
    type: "suite",
    content: [
      {
        id: "irds",
        label: "Integrated Rack Diagnostic Suite",
        items: [
          { id: "project-planner", label: "Project Planner" },
          { id: "inspection", label: "Inspection" },
          { id: "inspection-cycle", label: "Inspection Cycle Insights" },
          { id: "inspection-findings", label: "Inspection Findings" },
          { id: "tpi-findings", label: "TPI Findings" },
          { id: "integrity-test", label: "Integrity Test" },
          { id: "rack-health", label: "Rack Health Analytics" },
          { id: "stability", label: "Stability" },
          { id: "rack-observation", label: "Rack Observations" },
          { id: "cta", label: "Call To Action" },
          { id: "boq", label: "Bill Of Quantity" },
          { id: "stock-mgmt", label: "Element Stock Management" },
          { id: "purchase-req", label: "Purchase Request & Specs" },
          { id: "maintenance", label: "Maintenance" },
          { id: "compliance", label: "Compliance" },
          { id: "rules-action", label: "Rules and Action" },
          { id: "escalation", label: "Escalation Logs" },
          { id: "larc", label: "LARC Drawings" },
          { id: "report", label: "Report" },
        ],
      },
    ],
  },
  {
    id: "mhe",
    label: "MHE",
    icon: Truck,
    type: "mixed",
    content: [
      {
        id: "mms",
        label: "FMS",
        items: [
          { id: "dashboard1", label: "Dashboard" },
          { id: "mhe-asset", label: "MHE Asset Details" },
          { id: "operator-assign", label: "Operator Assignment" },
          { id: "ops-settings", label: "Operational Settings" },
          { id: "sensor-hub", label: "Sensor Hub" },
        ],
      },
      {
        id: "meps",
        label: "MEPS",
        items: [
          { id: "mhe-monitor", label: "MHE Monitor" },
          { id: "raw-data", label: "Raw Data" },
          { id: "mhe-analytics", label: "MHE Analytics" },
          { id: "driver-analytics", label: "Driver / Operator Analytics" },
        ],
      },
      {
        id: "rtss",
        label: "RTSS",
        items: [
          { id: "safety-config", label: "Safety Configuration" },
          { id: "mhe-monitor-rtss", label: "MHE Monitor" },
          { id: "raw-data-rtss", label: "Raw Data" },
          { id: "violation-review", label: "Violation Review" },
          { id: "mhe-analytics-rtss", label: "MHE Analytics" },
          { id: "driver-analytics-rtss", label: "Driver Analytics" },
        ],
      },
      {
        id: "imds",
        label: "IMDS",
        items: [
          { id: "rules-action-imds", label: "Rules and Action" },
          { id: "inspection-findings-imds", label: "Inspection Findings" },
        ],
      },
    ],
    topSharedFeatures: [
      { id: "command-dashboard", label: "Dashboard" },
      { id: "command-center", label: "Command Center" },
    ],
    sharedFeatures: [
      { id: "action-board", label: "Action Board" },
      { id: "incident-actions", label: "Incident Actions" },
      { id: "escalation-logs", label: "Escalation Logs" },
      { id: "escalation-settings", label: "Escalation Logs", hidden: true },
      { id: "report", label: "Report" },
    ],
  },
  {
    id: "pallet",
    label: "Pallet",
    icon: Package,
    type: "suite",
    content: [
      {
        id: "imds",
        label: "IMDS",
        items: [
          { id: "checklist-config", label: "Checklist Configuration" },
          { id: "inspection-findings-imds", label: "Inspection Findings" },
          { id: "mhe-analytics-imds", label: "MHE Analytics" },
          { id: "cta-imds", label: "Call To Action" },
          { id: "insights", label: "Insights" },
          { id: "inventory", label: "Inventory" },
          { id: "report-imds", label: "Report" },
        ],
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart,
    type: "flat",
    content: [
      { id: "global-dashboard", label: "Global Dashboard" },
      { id: "cross-module", label: "Cross-Module Insights" },
      { id: "trend-analysis", label: "Trend Analysis" },
      { id: "perf-metrics", label: "Performance Metrics" },
      { id: "export-reports", label: "Export Reports" },
    ],
  },
  {
    id: "iot",
    label: "IoT",
    icon: Wifi,
    type: "flat",
    content: [
      { id: "device-mgmt", label: "Device Management" },
      { id: "sensor-mapping", label: "Sensor Mapping" },
      { id: "live-data", label: "Live Data Stream" },
      { id: "alerts", label: "Alerts & Thresholds" },
      { id: "health-status", label: "Health Status" },
    ],
  },
  {
    id: "library",
    label: "Library",
    icon: Library,
    type: "flat",
    content: [
      { id: "documents", label: "Documents" },
      { id: "sops", label: "SOPs" },
      { id: "drawings", label: "Drawings" },
      { id: "media", label: "Media" },
      { id: "templates", label: "Templates" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    icon: Settings,
    type: "flat",
    content: [
      { id: "user-mgmt", label: "User Management" },
      { id: "roles", label: "Role & Permissions" },
      { id: "org-settings", label: "Organization Settings" },
      { id: "integrations", label: "Integrations" },
      { id: "audit-logs", label: "Audit Logs" },
      { id: "sys-config", label: "System Configuration" },
    ],
  },
];