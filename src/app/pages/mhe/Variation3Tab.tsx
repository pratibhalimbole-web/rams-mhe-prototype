/**
 * Warehouse Operations Intelligence Center
 * Combines FMS · MEPS · RTSS · IMDS · Command Center into cross-system intelligence.
 * Every widget correlates data from ≥2 systems — no single-module widgets.
 */
import React, { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent,
} from "../../components/ui/chart";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as ReTooltip,
} from "recharts";
import {
  ShieldCheck, AlertTriangle, Activity, Zap, TrendingDown, TrendingUp,
  Minus, Clock, Truck, Eye, Users, BarChart2, Shield, Gauge,
  ChevronRight, Circle, User, Download, RefreshCw, CheckCircle,
} from "lucide-react";
import { CriticalIssuesBanner } from "../../components/widgets/CriticalIssuesBanner";
import { CriticalIssuesModal } from "../../components/widgets/CriticalIssuesModal";
import {
  KPICard, StatusBadge, machinesInspectionData, warrantyExpiryData, operatorLicenseData,
} from "./FMSDashboard";

// ─── Cross-system data ────────────────────────────────────────────────────────

// Shift Performance across ALL modules (FMS + RTSS + MEPS + IMDS)
const SHIFT_PERFORMANCE = [
  { shift: "1st",  productivity: 88, safety: 85, compliance: 92 },
  { shift: "2nd",  productivity: 84, safety: 79, compliance: 88 },
  { shift: "3rd",  productivity: 74, safety: 65, compliance: 76 },
  { shift: "4th",  productivity: 68, safety: 56, compliance: 70 },
];

// Normalized to 100% per shift so the stacked bars exactly fill the 0–100 Y-axis.
// Raw scores are kept as rawX fields for the tooltip.
const SHIFT_PERFORMANCE_NORM = SHIFT_PERFORMANCE.map(d => {
  const total = d.productivity + d.safety + d.compliance;
  const p = +(d.productivity / total * 100).toFixed(1);
  const s = +(d.safety      / total * 100).toFixed(1);
  return {
    shift: d.shift,
    productivity: p,
    safety:       s,
    compliance:   +(100 - p - s).toFixed(1),
    rawProductivity: d.productivity,
    rawSafety:       d.safety,
    rawCompliance:   d.compliance,
  };
});

// Operator Cycle-Time Utilization (FMS — time breakdown per operator)
const OPERATOR_UTILIZATION = [
  { name: "Amit Sharma",    utilized: 58.0,  nonUtilized: 26.0,  idle: 16.0  },
  { name: "Karan Jadhav",   utilized: 38.0,  nonUtilized: 49.0,  idle: 13.0  },
  { name: "Rahul Patil",    utilized: 18.0,  nonUtilized: 74.0,  idle: 8.0   },
  { name: "Vivek Deshmukh", utilized: 10.16, nonUtilized: 75.38, idle: 14.46 },
  { name: "Suresh Pawar",   utilized: 12.0,  nonUtilized: 72.0,  idle: 16.0  },
];

// Inspection Failures vs Safety Impact Correlation (MEPS + RTSS)
const INSP_IMPACT_CORR = [
  { mheId: "MHE-025", type: "Pallet Jack",       repeatedFindings: 8, impactEvents: 7 },
  { mheId: "MHE-004", type: "Order Picker",      repeatedFindings: 5, impactEvents: 5 },
  { mheId: "MHE-022", type: "Reach Truck",       repeatedFindings: 4, impactEvents: 3 },
  { mheId: "MHE-007", type: "Electric Forklift", repeatedFindings: 3, impactEvents: 4 },
  { mheId: "MHE-001", type: "Electric Forklift", repeatedFindings: 2, impactEvents: 3 },
];

// Asset Degradation Prediction Matrix (MEPS repeated findings + RTSS impact freq + FMS productivity drop + IMDS expiry)
type RiskBand = "critical" | "high" | "medium" | "low";
const ASSET_DEGRADATION = [
  { mheId: "MHE-025", type: "Pallet Jack",       amberTrend: 3, productivityDrop: 18, impacts: 7,  skipped: 3, expiryRisk: true,  risk: "critical" as RiskBand },
  { mheId: "MHE-004", type: "Order Picker",      amberTrend: 2, productivityDrop: 12, impacts: 5,  skipped: 2, expiryRisk: true,  risk: "high"     as RiskBand },
  { mheId: "MHE-009", type: "Electric Forklift", amberTrend: 2, productivityDrop: 8,  impacts: 4,  skipped: 1, expiryRisk: true,  risk: "high"     as RiskBand },
  { mheId: "MHE-001", type: "Electric Forklift", amberTrend: 1, productivityDrop: 5,  impacts: 3,  skipped: 0, expiryRisk: false, risk: "medium"   as RiskBand },
  { mheId: "MHE-031", type: "Reach Truck",       amberTrend: 1, productivityDrop: 3,  impacts: 1,  skipped: 0, expiryRisk: false, risk: "low"      as RiskBand },
];

// ─── Safety Violation Trend Intelligence Data ─────────────────────────────────
// Multi-source: RTSS violations + MEPS inspection findings + FMS fleet activity + Command Center

type SafetyTimePoint = {
  label: string;
  shift: string;
  safetyViolations: number;
  impactEvents: number;
  nearMisses: number;
  overspeed: number;
  restrictedZone: number;
  rackImpact: number;
  collision: number;
  pedestrianWarning: number;
  activeMhes: number;
  activeOperators: number;
  mostAffectedZone: string;
  mepsRedFindings: number;
};

const SAFETY_TREND_7D: SafetyTimePoint[] = [
  { label: "Mon", shift: "Shift A", safetyViolations: 8,  impactEvents: 3, nearMisses: 6,  overspeed: 5,  restrictedZone: 3, rackImpact: 2, collision: 1, pedestrianWarning: 4,  activeMhes: 22, activeOperators: 16, mostAffectedZone: "Storage A", mepsRedFindings: 1 },
  { label: "Tue", shift: "Shift A", safetyViolations: 11, impactEvents: 4, nearMisses: 9,  overspeed: 7,  restrictedZone: 4, rackImpact: 3, collision: 1, pedestrianWarning: 6,  activeMhes: 24, activeOperators: 18, mostAffectedZone: "Storage B", mepsRedFindings: 2 },
  { label: "Wed", shift: "Shift B", safetyViolations: 7,  impactEvents: 2, nearMisses: 5,  overspeed: 4,  restrictedZone: 3, rackImpact: 1, collision: 1, pedestrianWarning: 3,  activeMhes: 20, activeOperators: 14, mostAffectedZone: "Loading",   mepsRedFindings: 1 },
  { label: "Thu", shift: "Shift B", safetyViolations: 14, impactEvents: 6, nearMisses: 12, overspeed: 9,  restrictedZone: 5, rackImpact: 4, collision: 2, pedestrianWarning: 8,  activeMhes: 26, activeOperators: 20, mostAffectedZone: "Storage B", mepsRedFindings: 3 },
  { label: "Fri", shift: "Shift A", safetyViolations: 10, impactEvents: 5, nearMisses: 7,  overspeed: 6,  restrictedZone: 4, rackImpact: 3, collision: 2, pedestrianWarning: 5,  activeMhes: 25, activeOperators: 19, mostAffectedZone: "Picking",   mepsRedFindings: 2 },
  { label: "Sat", shift: "Shift C", safetyViolations: 19, impactEvents: 8, nearMisses: 15, overspeed: 12, restrictedZone: 7, rackImpact: 5, collision: 3, pedestrianWarning: 11, activeMhes: 28, activeOperators: 22, mostAffectedZone: "Storage B", mepsRedFindings: 4 },
  { label: "Sun", shift: "Shift C", safetyViolations: 13, impactEvents: 5, nearMisses: 10, overspeed: 8,  restrictedZone: 5, rackImpact: 3, collision: 2, pedestrianWarning: 7,  activeMhes: 24, activeOperators: 18, mostAffectedZone: "Loading",   mepsRedFindings: 2 },
];

const SAFETY_TREND_24H: SafetyTimePoint[] = [
  { label: "6AM",  shift: "Morning", safetyViolations: 2,  impactEvents: 1, nearMisses: 2,  overspeed: 1, restrictedZone: 1, rackImpact: 0, collision: 1, pedestrianWarning: 1, activeMhes: 12, activeOperators: 8,  mostAffectedZone: "Loading",   mepsRedFindings: 0 },
  { label: "7AM",  shift: "Morning", safetyViolations: 3,  impactEvents: 1, nearMisses: 3,  overspeed: 2, restrictedZone: 1, rackImpact: 1, collision: 0, pedestrianWarning: 2, activeMhes: 16, activeOperators: 11, mostAffectedZone: "Storage A", mepsRedFindings: 0 },
  { label: "8AM",  shift: "Morning", safetyViolations: 5,  impactEvents: 2, nearMisses: 4,  overspeed: 3, restrictedZone: 2, rackImpact: 1, collision: 1, pedestrianWarning: 3, activeMhes: 20, activeOperators: 15, mostAffectedZone: "Storage A", mepsRedFindings: 1 },
  { label: "9AM",  shift: "Morning", safetyViolations: 7,  impactEvents: 3, nearMisses: 5,  overspeed: 4, restrictedZone: 3, rackImpact: 2, collision: 1, pedestrianWarning: 4, activeMhes: 22, activeOperators: 17, mostAffectedZone: "Storage B", mepsRedFindings: 1 },
  { label: "10AM", shift: "Morning", safetyViolations: 6,  impactEvents: 2, nearMisses: 5,  overspeed: 4, restrictedZone: 2, rackImpact: 1, collision: 1, pedestrianWarning: 3, activeMhes: 23, activeOperators: 17, mostAffectedZone: "Picking",   mepsRedFindings: 1 },
  { label: "11AM", shift: "Morning", safetyViolations: 4,  impactEvents: 2, nearMisses: 3,  overspeed: 2, restrictedZone: 2, rackImpact: 1, collision: 1, pedestrianWarning: 2, activeMhes: 22, activeOperators: 16, mostAffectedZone: "Storage A", mepsRedFindings: 0 },
  { label: "12PM", shift: "Evening", safetyViolations: 8,  impactEvents: 3, nearMisses: 6,  overspeed: 5, restrictedZone: 3, rackImpact: 2, collision: 1, pedestrianWarning: 4, activeMhes: 24, activeOperators: 18, mostAffectedZone: "Storage B", mepsRedFindings: 2 },
  { label: "1PM",  shift: "Evening", safetyViolations: 9,  impactEvents: 4, nearMisses: 7,  overspeed: 5, restrictedZone: 4, rackImpact: 3, collision: 1, pedestrianWarning: 5, activeMhes: 25, activeOperators: 19, mostAffectedZone: "Storage B", mepsRedFindings: 2 },
  { label: "2PM",  shift: "Evening", safetyViolations: 6,  impactEvents: 2, nearMisses: 5,  overspeed: 4, restrictedZone: 2, rackImpact: 1, collision: 1, pedestrianWarning: 3, activeMhes: 24, activeOperators: 18, mostAffectedZone: "Loading",   mepsRedFindings: 1 },
  { label: "3PM",  shift: "Evening", safetyViolations: 11, impactEvents: 4, nearMisses: 9,  overspeed: 7, restrictedZone: 4, rackImpact: 3, collision: 1, pedestrianWarning: 6, activeMhes: 26, activeOperators: 20, mostAffectedZone: "Storage B", mepsRedFindings: 2 },
  { label: "4PM",  shift: "Evening", safetyViolations: 14, impactEvents: 6, nearMisses: 11, overspeed: 9, restrictedZone: 5, rackImpact: 4, collision: 2, pedestrianWarning: 8, activeMhes: 27, activeOperators: 21, mostAffectedZone: "Storage B", mepsRedFindings: 3 },
  { label: "5PM",  shift: "Evening", safetyViolations: 9,  impactEvents: 3, nearMisses: 7,  overspeed: 6, restrictedZone: 3, rackImpact: 2, collision: 1, pedestrianWarning: 5, activeMhes: 25, activeOperators: 19, mostAffectedZone: "Picking",   mepsRedFindings: 2 },
  { label: "6PM",  shift: "Night",   safetyViolations: 12, impactEvents: 5, nearMisses: 10, overspeed: 8, restrictedZone: 4, rackImpact: 3, collision: 2, pedestrianWarning: 7, activeMhes: 23, activeOperators: 17, mostAffectedZone: "Storage B", mepsRedFindings: 3 },
];

const SAFETY_TREND_30D: SafetyTimePoint[] = [
  { label: "Wk 1", shift: "Mixed", safetyViolations: 42, impactEvents: 14, nearMisses: 31, overspeed: 26, restrictedZone: 16, rackImpact: 9,  collision: 5,  pedestrianWarning: 22, activeMhes: 24, activeOperators: 18, mostAffectedZone: "Storage A", mepsRedFindings: 4 },
  { label: "Wk 2", shift: "Mixed", safetyViolations: 58, impactEvents: 21, nearMisses: 44, overspeed: 36, restrictedZone: 22, rackImpact: 13, collision: 8,  pedestrianWarning: 32, activeMhes: 25, activeOperators: 19, mostAffectedZone: "Storage B", mepsRedFindings: 7 },
  { label: "Wk 3", shift: "Mixed", safetyViolations: 49, impactEvents: 17, nearMisses: 38, overspeed: 31, restrictedZone: 18, rackImpact: 11, collision: 6,  pedestrianWarning: 27, activeMhes: 23, activeOperators: 17, mostAffectedZone: "Loading",   mepsRedFindings: 5 },
  { label: "Wk 4", shift: "Mixed", safetyViolations: 71, impactEvents: 28, nearMisses: 56, overspeed: 45, restrictedZone: 26, rackImpact: 17, collision: 11, pedestrianWarning: 42, activeMhes: 27, activeOperators: 21, mostAffectedZone: "Storage B", mepsRedFindings: 9 },
];

// ─── Active Safety Alerts feed data ─────────────────────────────────────────
// Cross-system: RTSS violations + MEPS red findings + FMS issues + IMDS expiry

type AlertCard = {
  id: string;
  severity: RiskBand;
  title: string;
  description: string;
  mheId: string;
  zone: string;
  time: string;
  module: string;
  category: string;
  type: "mhe" | "operator";
};

const ACTIVE_ALERTS: AlertCard[] = [
  // ── MHE alerts ───────────────────────────────────────────────────────────────
  { id: "A001", type: "mhe",      severity: "critical", title: "Multiple Impact Events Detected",      description: "3 rack impacts in 2 hours — compound risk pattern forming",            mheId: "MHE-025", zone: "Storage B", time: "14 min ago",  module: "RTSS", category: "Impact Event"       },
  { id: "A002", type: "mhe",      severity: "critical", title: "Red Finding Unresolved — 3+ Days",     description: "Critical brake failure still open, MHE operating with active finding",  mheId: "MHE-004", zone: "Loading",   time: "3 days ago", module: "MEPS", category: "Red Finding"        },
  { id: "A005", type: "mhe",      severity: "medium",   title: "Inspection Skipped — Warranty Risk",   description: "2 consecutive MEPS checks missed while under expiry warning",            mheId: "MHE-001", zone: "Storage A", time: "Today",      module: "MEPS", category: "Skipped Inspection" },
  { id: "A006", type: "mhe",      severity: "medium",   title: "Fleet Utilization Drop Detected",      description: "Pallet Jack fleet at 54% — 3 MHEs idle, no scheduled task",             mheId: "Fleet",   zone: "Loading",   time: "This shift", module: "FMS",  category: "Utilization"        },
  { id: "A008", type: "mhe",      severity: "high",     title: "Sensor Malfunction — MHE-031",         description: "Load sensor reporting erratic values; auto-braking may be compromised",  mheId: "MHE-031", zone: "Receiving", time: "45 min ago", module: "FMS",  category: "Sensor Fault"       },
  { id: "A009", type: "mhe",      severity: "low",      title: "Battery Health Degraded",              description: "MHE-019 reporting 62% battery capacity — schedule replacement soon",   mheId: "MHE-019", zone: "Charging",  time: "Today",      module: "FMS",  category: "Battery"            },
  // ── Operator alerts ──────────────────────────────────────────────────────────
  { id: "A003", type: "operator", severity: "high",     title: "Overspeed Violations Spike",           description: "9 events in Shift B — 3× the daily average for this zone",             mheId: "MHE-007", zone: "Storage B", time: "2 hrs ago",  module: "RTSS", category: "Overspeed"          },
  { id: "A004", type: "operator", severity: "high",     title: "Restricted Zone Entry Repeat",         description: "3 pedestrian zone entries in 1 hour — operator review needed",           mheId: "MHE-022", zone: "Picking",   time: "1 hr ago",   module: "RTSS", category: "Zone Violation"     },
  { id: "A007", type: "operator", severity: "low",      title: "Near-Miss Pattern — Same Zone",        description: "4 pedestrian near-misses over 3 consecutive shifts in zone",             mheId: "OP-014",  zone: "Storage B", time: "Recurring",  module: "RTSS", category: "Near Miss"          },
  { id: "A010", type: "operator", severity: "critical", title: "Fatigue Risk — Shift Overrun",         description: "Operator logged 11h continuous operation without mandatory break",        mheId: "OP-009",  zone: "Storage A", time: "22 min ago", module: "RTSS", category: "Fatigue"            },
  { id: "A011", type: "operator", severity: "medium",   title: "Compliance Score Drop",                description: "Operator OP-021 compliance fell from 84 → 61 over last 5 shifts",       mheId: "OP-021",  zone: "Loading",   time: "Today",      module: "MEPS", category: "Compliance"         },
];

const ALERT_RECOMMENDED: Record<string, string[]> = {
  "Impact Event":       ["Inspect rack & structure for damage", "Restrict MHE from zone until cleared", "Review operator training records"],
  "Red Finding":        ["Immediate equipment lockout", "Schedule emergency repair", "Notify fleet manager within 1 hour"],
  "Overspeed":          ["Issue formal operator warning", "Review geofence speed-limit config", "Add to operator risk watchlist"],
  "Zone Violation":     ["Review operator access permissions", "Verify pedestrian zone markers on-site", "Schedule mandatory re-training"],
  "Skipped Inspection": ["Reschedule MEPS inspection today", "Apply temporary utilisation restriction", "Notify maintenance team"],
  "Utilization":        ["Review shift scheduling efficiency", "Verify task assignment pipeline", "Check for unplanned MHE downtime"],
  "Near Miss":          ["Conduct immediate zone safety audit", "Review pedestrian routing plan", "Install additional zone barriers"],
  "Sensor Fault":       ["Ground MHE until sensor replaced", "Run diagnostic check via FMS", "Flag for priority maintenance"],
  "Battery":            ["Schedule battery swap within 48 hours", "Monitor charge cycles until replaced", "Add to maintenance queue"],
  "Fatigue":            ["Mandatory rest break — operator off-floor", "Log incident in operator record", "Review shift scheduling policy"],
  "Compliance":         ["Schedule remedial safety training", "Issue formal compliance notice", "Place on 30-day monitoring plan"],
};

const MODULE_COLOR: Record<string, { bg: string; color: string }> = {
  RTSS: { bg: "#eff6ff", color: "#1e40af" },
  MEPS: { bg: "#fef3c7", color: "#92400e" },
  FMS:  { bg: "#f0fdf4", color: "#166534" },
};

// ─── Chart configs ─────────────────────────────────────────────────────────────

const shiftChartConfig = {
  productivity: { label: "Productivity",  color: "#1b59f8" },
  safety:       { label: "Safety Score",  color: "#22c55e" },
  compliance:   { label: "Compliance",    color: "#f59e0b" },
};

// ─── Style maps ───────────────────────────────────────────────────────────────

const RISK_BAND: Record<RiskBand, { bg: string; color: string; label: string; border: string }> = {
  critical: { bg: "#fef2f2", color: "#dc2626", label: "Critical", border: "#fecaca" },
  high:     { bg: "#fef3c7", color: "#92400e", label: "High",     border: "#fde68a" },
  medium:   { bg: "#eff6ff", color: "#1e40af", label: "Medium",   border: "#bfdbfe" },
  low:      { bg: "#f0fdf4", color: "#166534", label: "Low",      border: "#bbf7d0" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readinessColor(v: number) {
  return v >= 70 ? "#22c55e" : v >= 45 ? "#f59e0b" : "#ef4444";
}

function getSafetyRiskLevel(d: SafetyTimePoint): RiskBand {
  const score = d.safetyViolations + d.impactEvents * 2.5 + d.nearMisses * 0.8;
  if (score >= 42) return "critical";
  if (score >= 26) return "high";
  if (score >= 12) return "medium";
  return "low";
}

function detectSafetyAlerts(_data: SafetyTimePoint[]): string[] {
  return [];
}

function SL({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-12 mt-1 mb-[-8px]">
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--w-text-2)" }}>
        {children}
      </span>
    </div>
  );
}

function FI({ insight, sub }: { insight: string; sub?: string }) {
  return (
    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px" }}>
      <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--w-text-1)", margin: 0 }}>{insight}</p>
      {sub && <p style={{ fontSize: "12px", color: "var(--w-text-2)", margin: 0, marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

// Module tags shown in widget headers to indicate cross-system source
function MTags({ tags }: { tags: string[] }) {
  const c: Record<string, { bg: string; color: string }> = {
    FMS:  { bg: "#eff6ff", color: "#1e40af" },
    MEPS: { bg: "#fef3c7", color: "#92400e" },
    RTSS: { bg: "#fef2f2", color: "#dc2626" },
    IMDS: { bg: "#f0fdf4", color: "#166534" },
  };
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
      {tags.map(t => (
        <span key={t} style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, ...c[t] }}>{t}</span>
      ))}
    </div>
  );
}

// ─── Widget: Safety Violation Trend Intelligence ─────────────────────────────
// Hero 8-column widget · multi-line area chart (violations + impacts + near-misses)
// Data sources: RTSS + MEPS + FMS + Command Center

function SafetyTrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as SafetyTimePoint;
  const risk = getSafetyRiskLevel(d);
  const rb = RISK_BAND[risk];
  const fmt = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 8, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 224, maxWidth: 264, pointerEvents: "none" as const, fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "0.64px solid var(--w-border)" }}>
        <span style={{ fontWeight: 600, fontSize: 11, color: "var(--w-text-1)" }}>{label} · {d.shift}</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: rb.bg, color: rb.color, border: `1px solid ${rb.border}`, whiteSpace: "nowrap" as const }}>{rb.label}</span>
      </div>
      {/* Safety Violations */}
      <div style={{ marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "hsl(217, 98%, 54%)", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "var(--w-text-1)", flex: 1 }}>Safety Violations</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "hsl(217, 98%, 54%)" }}>{d.safetyViolations}</span>
        </div>
        <div style={{ paddingLeft: 12 }}>
          {([["Overspeed", d.overspeed], ["Restricted Zone", d.restrictedZone]] as [string, number][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
              <span style={{ fontSize: 9, color: "var(--w-text-3)" }}>{k}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: "var(--w-text-2)" }}>{fmt(v)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Impact Events */}
      <div style={{ marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "hsl(222, 84%, 62%)", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "var(--w-text-1)", flex: 1 }}>Impact Events</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "hsl(222, 84%, 62%)" }}>{d.impactEvents}</span>
        </div>
        <div style={{ paddingLeft: 12 }}>
          {([["Rack Impact", d.rackImpact], ["Collision", d.collision]] as [string, number][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
              <span style={{ fontSize: 9, color: "var(--w-text-3)" }}>{k}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: "var(--w-text-2)" }}>{fmt(v)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Near Misses */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "hsl(226, 75%, 68%)", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "var(--w-text-1)", flex: 1 }}>Near Misses</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "hsl(226, 75%, 68%)" }}>{d.nearMisses}</span>
        </div>
        <div style={{ paddingLeft: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, color: "var(--w-text-3)" }}>Pedestrian Warning</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: "var(--w-text-2)" }}>{fmt(d.pedestrianWarning)}</span>
          </div>
        </div>
      </div>
      {/* Operational Context */}
      <div style={{ borderTop: "0.64px solid var(--w-border)", paddingTop: 8 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "var(--w-text-3)", marginBottom: 5 }}>Operational Context</div>
        {([
          ["Active MHEs",       d.activeMhes,         "var(--w-text-1)"],
          ["Active Operators",  d.activeOperators,    "var(--w-text-1)"],
          ["Most Affected Zone",d.mostAffectedZone,   "hsl(217, 98%, 54%)"],
        ] as [string, string|number, string][]).map(([lbl, val, col]) => (
          <div key={lbl} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: 9, color: "var(--w-text-3)" }}>{lbl}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: col }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SAFETY_LINE_ITEMS: [string, string, string][] = [
  ["safetyViolations", "Safety Violations (RTSS)", "hsl(217, 98%, 54%)"],
  ["impactEvents",     "Impact Events (RTSS+FMS)", "hsl(222, 84%, 62%)"],
  ["nearMisses",       "Near Misses (CC)",         "hsl(226, 75%, 68%)"],
];

function SafetyViolationTrendWidget() {
  const [timeRange, setTimeRange] = useState("7d");
  const [zone,      setZone]      = useState("all");
  const [mheType,   setMheType]   = useState("all");
  const [shift,     setShift]     = useState("all");
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const rawData =
    timeRange === "24h" ? SAFETY_TREND_24H :
    timeRange === "30d" ? SAFETY_TREND_30D :
    SAFETY_TREND_7D;

  const data = shift === "all" ? rawData
    : rawData.filter(d =>
        (shift === "morning" && d.shift === "Morning") ||
        (shift === "evening" && d.shift === "Evening") ||
        (shift === "night"   && d.shift === "Night")   ||
        d.shift.startsWith("Shift") || d.shift === "Mixed"
      );

  const alerts = detectSafetyAlerts(data);
  const yMax = Math.max(...data.map(d => Math.max(d.safetyViolations, d.nearMisses))) + 4;
  const yStep = Math.ceil(yMax / 4);
  const yTicks = [0, yStep, yStep * 2, yStep * 3, yStep * 4];

  const lineOpacity = (key: string) => hoveredLine === null ? 1 : hoveredLine === key ? 1 : 0.15;
  const strokeWidth = (key: string) => hoveredLine === key ? 1.5 : 1;

  const makeDot = (color: string, opacity: number) => (props: any) => {
    const { cx, cy, payload } = props;
    if (getSafetyRiskLevel(payload) !== "critical") return <g key={`dot-${cx}-${cy}`} />;
    return (
      <g key={`dot-${cx}-${cy}`} opacity={opacity}>
        <circle cx={cx} cy={cy} r={9} fill={color} fillOpacity={0.13} />
        <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={1.5} />
      </g>
    );
  };

  const footerInsight =
    timeRange === "24h" ? "Evening 4PM surge — 14 violations and 6 impact events, Storage B highest risk hour"
    : timeRange === "30d" ? "Week 4 shows 69% escalation vs Week 1 — Storage B is a persistent risk concentration point"
    : "Saturday Shift C drove the week peak — 19 violations with 8 impact events in Storage B";

  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <style>{`@keyframes v3SafetyPulse { 0%,100%{opacity:.5} 50%{opacity:.1} }`}</style>

      {/* Header */}
      <div style={{ padding: "16px 24px 12px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" as const }}>
          <div>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", color: "var(--w-text-1)", display: "block", lineHeight: "18px" }}>
              Safety Violation Trend Intelligence
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>
              Safety violations · impact events · near-misses
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" as const, flexShrink: 0 }}>
            {[
              { val: timeRange, set: setTimeRange, items: [["24h","Last 24 Hours"],["7d","Last 7 Days"],["30d","Last 30 Days"]] as [string,string][] },
              { val: zone,      set: setZone,      items: [["all","All Zones"],["storageA","Storage A"],["storageB","Storage B"],["loading","Loading"],["picking","Picking"]] as [string,string][] },
              { val: mheType,   set: setMheType,   items: [["all","All MHE Types"],["forklift","Forklift"],["reachtruck","Reach Truck"],["palletjack","Pallet Jack"]] as [string,string][] },
              { val: shift,     set: setShift,     items: [["all","All Shifts"],["morning","Morning"],["evening","Evening"],["night","Night"]] as [string,string][] },
            ].map(({ val, set, items }) => (
              <Select key={items[0][0]+items[1][0]} value={val} onValueChange={set}>
                <SelectTrigger style={SHIFT_FILTER_STYLE}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {items.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
      </div>

      {/* Alert bar */}
      {alerts.length > 0 && (
        <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "5px 16px", flexShrink: 0 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: i < alerts.length - 1 ? 3 : 0 }}>
              <AlertTriangle style={{ width: 10, height: 10, color: "#f59e0b", flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#92400e" }}>{a}</span>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <div style={{ position: "absolute", top: "20px", right: "14px", bottom: 0, left: "14px", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-divider)" />
                <XAxis dataKey="label" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6} />
                <YAxis tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4} domain={[0, yStep * 4]} ticks={yTicks} />
                <ReTooltip content={<SafetyTrendTooltip />} cursor={{ stroke: "var(--w-border)", strokeWidth: 1, strokeDasharray: "4 2" }} />
                <Area type="monotone" dataKey="safetyViolations" name="Safety Violations"
                  stroke="hsl(217, 98%, 54%)" strokeWidth={strokeWidth("safetyViolations")} strokeOpacity={lineOpacity("safetyViolations")}
                  strokeDasharray="6 3"
                  fill="none"
                  dot={false} activeDot={{ r: 5, fill: "hsl(217, 98%, 54%)", stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="impactEvents" name="Impact Events"
                  stroke="hsl(222, 84%, 62%)" strokeWidth={strokeWidth("impactEvents")} strokeOpacity={lineOpacity("impactEvents")}
                  strokeDasharray="6 3"
                  fill="none"
                  dot={false} activeDot={{ r: 5, fill: "hsl(222, 84%, 62%)", stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="nearMisses" name="Near Misses"
                  stroke="hsl(226, 75%, 68%)" strokeWidth={strokeWidth("nearMisses")} strokeOpacity={lineOpacity("nearMisses")}
                  strokeDasharray="6 3"
                  fill="none"
                  dot={false} activeDot={{ r: 5, fill: "hsl(226, 75%, 68%)", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Legend — hover to dim other lines */}
      <div style={{ display: "flex", gap: "16px", padding: "10px 24px", justifyContent: "center", flexWrap: "wrap" as const, flexShrink: 0 }}>
        {SAFETY_LINE_ITEMS.map(([key, label, color]) => (
          <span key={key}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: hoveredLine === null || hoveredLine === key ? "var(--w-text-2)" : "var(--w-text-3)", cursor: "default", transition: "color 0.15s" }}
            onMouseEnter={() => setHoveredLine(key)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <span style={{ width: "8px", height: "8px", background: color, display: "inline-block", flexShrink: 0, borderRadius: "2px", opacity: hoveredLine === null || hoveredLine === key ? 1 : 0.25, transition: "opacity 0.15s" }} />
            {label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {footerInsight}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Storage B repeatedly flagged as highest-risk zone (3/7 periods)
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Widget: Active Safety Alerts ────────────────────────────────────────────
// 4-col companion · cross-system alert feed with severity filter pills

const ALERT_ACCENT: Record<RiskBand, string> = {
  critical: "#ef4444",
  high:     "#f59e0b",
  medium:   "#3b82f6",
  low:      "#94a3b8",
};

// ─── Alert Detail Popup ───────────────────────────────────────────────────────

function AlertDetailPopup({ alert, onClose }: { alert: AlertCard; onClose: () => void }) {
  const rb   = RISK_BAND[alert.severity];
  const mod  = MODULE_COLOR[alert.module] ?? { bg: "#f1f5f9", color: "#475569" };
  const recs = ALERT_RECOMMENDED[alert.category] ?? ["Review alert details with fleet manager", "Document findings in system", "Follow standard escalation procedure"];

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const SEVERITY_ACCENT: Record<RiskBand, string> = {
    critical: "#dc2626",
    high:     "#d97706",
    medium:   "#2563eb",
    low:      "#16a34a",
  };
  const accent = SEVERITY_ACCENT[alert.severity];

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.15s ease",
      }}
    >
      {/* Modal card — stop propagation so clicking inside doesn't close */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--w-bg)",
          borderRadius: 16,
          width: 480,
          maxWidth: "calc(100vw - 32px)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
          animation: "slideUp 0.18s ease",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Coloured top accent bar */}
        <div style={{ height: 4, background: accent, borderRadius: "16px 16px 0 0" }} />

        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--w-divider)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Badges row */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: rb.bg, color: rb.color, border: `1px solid ${rb.border}` }}>{rb.label}</span>
              <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: mod.bg, color: mod.color }}>{alert.module}</span>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: "var(--w-bg-page)", color: "var(--w-text-2)", border: "1px solid var(--w-border)" }}>{alert.category}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--w-text-1)", lineHeight: "20px" }}>{alert.title}</h2>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 8, border: "1px solid var(--w-border)",
              background: "var(--w-bg-page)", cursor: "pointer", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--w-text-2)", fontSize: 14, fontWeight: 700, lineHeight: 1,
              transition: "background 0.1s, border-color 0.1s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--w-bg-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--w-text-5)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--w-bg-page)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--w-border)"; }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Description */}
          <div>
            <p style={{ margin: "0 0 5px", fontSize: 10, fontWeight: 600, color: "var(--w-text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Description</p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--w-text-1)", lineHeight: "18px" }}>{alert.description}</p>
          </div>

          {/* Details grid */}
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "var(--w-text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Alert Details</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
              {[
                { label: "MHE Unit",    value: alert.mheId   },
                { label: "Zone",        value: alert.zone    },
                { label: "Source",      value: alert.module  },
                { label: "Reported",    value: alert.time    },
                { label: "Alert ID",    value: `#${alert.id}`},
                { label: "Category",    value: alert.category},
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--w-bg-page)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--w-divider)" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 9, color: "var(--w-text-3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "var(--w-text-1)" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended actions */}
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "var(--w-text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Recommended Actions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recs.map((rec, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: rb.bg, border: `1px solid ${rb.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: rb.color, marginTop: 1,
                  }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--w-text-1)", lineHeight: "17px" }}>{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "12px 20px 16px", borderTop: "1px solid var(--w-divider)", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid var(--w-border)",
              background: "var(--w-bg)", cursor: "pointer", fontSize: 11, fontWeight: 600,
              color: "var(--w-text-4)", transition: "background 0.1s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--w-bg-page)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--w-bg)"; }}
          >Dismiss</button>
          <button
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none",
              background: accent, cursor: "pointer", fontSize: 11, fontWeight: 600,
              color: "#ffffff", transition: "opacity 0.1s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >Acknowledge Alert</button>
        </div>
      </div>

      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}

// ─── Widget: Active Safety Alerts ────────────────────────────────────────────

function ActiveSafetyAlertsWidget() {
  const [tab, setTab]           = useState<"mhe" | "operator">("mhe");
  const [selected, setSelected] = useState<AlertCard | null>(null);

  const mheAlerts = ACTIVE_ALERTS.filter(a => a.type === "mhe");
  const oprAlerts = ACTIVE_ALERTS.filter(a => a.type === "operator");
  const filtered  = tab === "mhe" ? mheAlerts : oprAlerts;

  const mheCritical = mheAlerts.filter(a => a.severity === "critical").length;
  const oprCritical = oprAlerts.filter(a => a.severity === "critical").length;

  const tabs: { val: "mhe" | "operator"; label: string; count: number; critical: number }[] = [
    { val: "mhe",      label: "MHE",      count: mheAlerts.length, critical: mheCritical },
    { val: "operator", label: "Operator", count: oprAlerts.length, critical: oprCritical },
  ];

  // Footer summary
  const totalCritical = ACTIVE_ALERTS.filter(a => a.severity === "critical").length;
  const footerMain = totalCritical > 0
    ? `${totalCritical} critical alert${totalCritical > 1 ? "s" : ""} need immediate action across MHE & operators`
    : "All alerts are within acceptable severity thresholds";

  return (
    <>
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "16px 24px 12px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", color: "var(--w-text-1)", display: "block", lineHeight: "18px" }}>Active Safety Alerts</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>Live cross-system feed — RTSS · MEPS · FMS</span>
      </div>

      {/* MHE / Operator tab strip */}
      <div style={{ padding: "10px 12px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", background: "var(--w-bg-muted)", borderRadius: 8, padding: "3px", gap: 2 }}>
          {tabs.map(({ val, label, count, critical }) => {
            const active = tab === val;
            return (
              <button key={val} onClick={() => setTab(val)} style={{
                flex: 1, padding: "6px 4px", borderRadius: 6,
                border: active ? "1px solid var(--w-border)" : "1px solid transparent",
                background: active ? "var(--w-bg)" : "transparent",
                cursor: "pointer", transition: "all 0.12s",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
                display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, color: active ? "var(--w-text-4)" : "var(--w-text-3)", lineHeight: 1 }}>{count}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: active ? 600 : 400, color: active ? "var(--w-text-4)" : "var(--w-text-3)" }}>{label}</span>
                {critical > 0 && (
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: active ? "#fef2f2" : "var(--w-bg-page)", color: active ? "#dc2626" : "var(--w-text-3)", border: `1px solid ${active ? "#fecaca" : "transparent"}` }}>{critical} crit</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert list */}
      <div style={{ flex: 1, overflowY: "auto" as const, minHeight: 0, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10, scrollbarWidth: "thin" as const, scrollbarColor: "var(--w-border) transparent" }}>
        {filtered.map((alert) => {
          const rb = RISK_BAND[alert.severity];
          return (
            <div key={alert.id}
              onClick={() => setSelected(alert)}
              style={{ background: "var(--w-bg)", border: "1px solid var(--w-divider)", borderRadius: 10, padding: "11px 13px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "box-shadow 0.15s, border-color 0.15s", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--w-border)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--w-divider)"; }}
            >
              {/* Title + severity badge */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--w-text-1)", lineHeight: "17px", flex: 1 }}>{alert.title}</span>
                <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: rb.bg, color: rb.color, border: `1px solid ${rb.border}`, flexShrink: 0 }}>{rb.label}</span>
              </div>
              {/* Divider */}
              <div style={{ height: 1, background: "var(--w-divider)", margin: "6px 0" }} />
              {/* Description */}
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", lineHeight: "15px", marginBottom: 8 }}>{alert.description}</div>
              {/* Meta */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)" }}>{alert.mheId}</span>
                <span style={{ fontSize: 9, color: "var(--w-text-5)" }}>·</span>
                <span style={{ fontSize: 9, color: "var(--w-text-2)" }}>{alert.zone}</span>
                <span style={{ fontSize: 9, color: "var(--w-text-5)" }}>·</span>
                <span style={{ fontSize: 9, color: "var(--w-text-3)" }}>{alert.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {footerMain}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Cross-system alert feed — RTSS violations · MEPS findings · FMS fleet status
          </span>
        </div>
      </div>
    </div>

    {/* Detail popup */}
    {selected && <AlertDetailPopup alert={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

// ─── Widget: Shift Performance Stacked Bar ───────────────────────────────────

// ─── Widget: Operator Utilization ────────────────────────────────────────────

const OP_UTIL_COLORS = {
  idle:        { fill: "#bfdbfe", label: "Idle"         },
  nonUtilized: { fill: "#60a5fa", label: "Non-Utilized" },
  utilized:    { fill: "#1e40af", label: "Utilized"     },
};

function OperatorUtilizationTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  // Show in order: Utilized → Non-Utilized → Idle
  const order = ["utilized", "nonUtilized", "idle"] as const;
  const entries = order
    .map(key => payload.find((p: any) => p.dataKey === key))
    .filter(Boolean);
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 14px rgba(0,0,0,0.1)", minWidth: 190, fontFamily: "Inter, sans-serif" }}>
      {entries.map((entry: any) => (
        <div key={entry.dataKey} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: entry.fill, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "#64748b" }}>{OP_UTIL_COLORS[entry.dataKey as keyof typeof OP_UTIL_COLORS]?.label}</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>{Number(entry.value).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function OperatorUtilizationWidget() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "14px 18px 10px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Operator Utilization</span>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, color: "#94a3b8", display: "flex", alignItems: "center" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
        {/* Cycle time legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" as const }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#64748b", marginRight: 4 }}>Cycle Time:</span>
          {(["utilized", "nonUtilized", "idle"] as const).map(key => (
            <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 4, marginRight: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: OP_UTIL_COLORS[key].fill, display: "inline-block", border: key === "idle" ? "1px solid #93c5fd" : "none" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#64748b" }}>{OP_UTIL_COLORS[key].label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0, padding: "12px 8px 8px 0" }}>
        <ResponsiveContainer width="100%" height="100%" key={refreshKey}>
          <BarChart data={OPERATOR_UTILIZATION} margin={{ top: 4, right: 16, left: 8, bottom: 4 }} barCategoryGap="40%">
            <CartesianGrid strokeDasharray="" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              dy={6}
              label={{ value: "OPERATOR", position: "insideBottom", offset: -2, style: { fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#94a3b8", letterSpacing: "0.08em" } }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              dx={-4}
              label={{ value: "UTILIZATION DISTRIBUTION", angle: -90, position: "insideLeft", offset: 14, style: { fontFamily: "Inter, sans-serif", fontSize: 8, fill: "#94a3b8", letterSpacing: "0.07em" } }}
            />
            <ReTooltip content={<OperatorUtilizationTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="idle"        stackId="a" fill={OP_UTIL_COLORS.idle.fill}        name="Idle"          radius={[0, 0, 0, 0]} />
            <Bar dataKey="nonUtilized" stackId="a" fill={OP_UTIL_COLORS.nonUtilized.fill} name="Non-Utilized"  radius={[0, 0, 0, 0]} />
            <Bar dataKey="utilized"    stackId="a" fill={OP_UTIL_COLORS.utilized.fill}    name="Utilized"      radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const SHIFT_FILTER_STYLE: React.CSSProperties = {
  height: "32px",
  width: "auto",
  background: "var(--w-bg)",
  border: "1px solid var(--w-border)",
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "10px",
  color: "var(--w-text-1)",
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
};

function ShiftStackedTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "6px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "180px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "6px", borderBottom: "0.64px solid var(--w-border)" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "11px", color: "var(--w-text-1)" }}>{label} Session</span>
      </div>
      {[...payload].reverse().map((entry: any) => (
        <div key={entry.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "3px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: entry.color, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>{entry.name}</span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "var(--w-text-1)" }}>
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

const SHIFT_LEGEND_ITEMS: [string, string, string][] = [
  ["productivity", "Productivity (FMS)",    "hsl(217, 98%, 54%)"],
  ["safety",       "Safety Score (RTSS)",   "hsl(222, 84%, 62%)"],
  ["compliance",   "Compliance (IMDS)",     "hsl(230, 67%, 85%)"],
];

function ShiftPerformanceWidget() {
  const [moduleFilter, setModuleFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("this_week");

  const visible = (key: string) =>
    moduleFilter === "all" ||
    (moduleFilter === "fms"  && key === "productivity") ||
    (moduleFilter === "rtss" && key === "safety") ||
    (moduleFilter === "imds" && key === "compliance");

  const topKey = ["compliance", "safety", "productivity"].find(visible) ?? "compliance";

  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" as const }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>Shift Performance vs Operational Risk</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>Productivity · Safety · Compliance stacked by shift session</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger style={SHIFT_FILTER_STYLE}><SelectValue placeholder="All Modules" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="fms">FMS</SelectItem>
              <SelectItem value="rtss">RTSS</SelectItem>
              <SelectItem value="imds">IMDS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger style={SHIFT_FILTER_STYLE}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="last_week">Last Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <div style={{ position: "absolute", top: "20px", right: "14px", bottom: 0, left: "14px", overflowX: "hidden", overflowY: "hidden" }}>
          <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SHIFT_PERFORMANCE} margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barCategoryGap="45%">
                <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-divider)" />
                <XAxis
                  dataKey="shift"
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }}
                  axisLine={false}
                  tickLine={false}
                  dy={6}
                  tickFormatter={(v) => `${v} Session`}
                />
                <YAxis
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-4}
                  domain={[0, 300]}
                  ticks={[0, 100, 200, 300]}
                  tickFormatter={(v) => v === 0 ? "0" : `${v}`}
                />
                <ReTooltip content={<ShiftStackedTooltip />} cursor={{ fill: "var(--w-bg-page)" }} />
                {visible("productivity") && (
                  <Bar dataKey="productivity" stackId="a" fill="hsl(217, 98%, 54%)" name="Productivity (FMS)"
                    radius={topKey === "productivity" ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
                )}
                {visible("safety") && (
                  <Bar dataKey="safety" stackId="a" fill="hsl(222, 84%, 62%)" name="Safety Score (RTSS)"
                    radius={topKey === "safety" ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
                )}
                {visible("compliance") && (
                  <Bar dataKey="compliance" stackId="a" fill="hsl(230, 67%, 85%)" name="Compliance (IMDS)"
                    radius={topKey === "compliance" ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", padding: "10px 24px", justifyContent: "center", flexWrap: "wrap" as const }}>
        {SHIFT_LEGEND_ITEMS.filter(([key]) => visible(key)).map(([, label, color]) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "var(--w-text-2)" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: color, display: "inline-block", flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            4th Session shows 23% safety decline vs 1st — night shift is highest risk window
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Shift-level correlation — FMS · RTSS · IMDS
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Widget: Operational Inbox ───────────────────────────────────────────────
// Full-width AI-generated cross-system action center

type InboxSeverity = "critical" | "high" | "medium" | "info";
type InboxTab = "operators" | "efficiency" | "safety" | "utilization";

type InboxItem = {
  id: string;
  severity: InboxSeverity;
  title: string;
  summary: string;
  source: string;
  mheId?: string;
  zone?: string;
  time: string;
  live?: boolean;
  action: string;
  actionVariant?: "danger" | "warning" | "primary";
  tab: InboxTab;
};

const INBOX_ITEMS: InboxItem[] = [
  // Operators tab
  { id: "O001", tab: "operators", severity: "critical", live: true,  title: "Operator OP-014 exceeded 5 speed violations in 2 hours", summary: "Persistent overspeed pattern in Storage B — 3× average. Immediate supervisor review required before next shift.", source: "RTSS", mheId: "MHE-025", zone: "Storage B", time: "11 min ago",  action: "Review Operator",   actionVariant: "danger"  },
  { id: "O002", tab: "operators", severity: "high",     live: true,  title: "OP-007 operating MHE with open Red finding — MEPS violation", summary: "MHE-004 has unresolved brake finding (3 days). Operator confirmed active use. Intervention needed.", source: "MEPS", mheId: "MHE-004", zone: "Loading",   time: "38 min ago",  action: "Block MHE",         actionVariant: "warning" },
  { id: "O003", tab: "operators", severity: "medium",   live: false, title: "OP-022 skipped 2 consecutive pre-use inspections this week", summary: "Pattern of inspection bypass correlates with upcoming warranty expiry on assigned unit.", source: "MEPS", mheId: "MHE-001", zone: "Storage A", time: "Today",       action: "Schedule Review",   actionVariant: "primary" },
  { id: "O004", tab: "operators", severity: "info",     live: false, title: "Shift C operator compliance score dropped to 67% vs 91% last week", summary: "Night shift operators show declining pre-use check rates — recommend targeted training session.", source: "IMDS", mheId: undefined, zone: "All Zones", time: "Yesterday",   action: "View Report",       actionVariant: "primary" },
  // Efficiency tab
  { id: "E001", tab: "efficiency", severity: "high",   live: true,  title: "3 Pallet Jacks idle for 2+ hours — fleet utilization at 54%", summary: "Unassigned units in Loading dock. Task queue has 7 pending picks. Auto-assignment recommended.", source: "FMS",  mheId: "Fleet",   zone: "Loading",   time: "Now",         action: "Auto-Assign",       actionVariant: "warning" },
  { id: "E002", tab: "efficiency", severity: "high",   live: false, title: "Storage B congestion causing 4.2 hrs/day in delay", summary: "Route conflict between Reach Trucks and Pallet Jacks at aisle B4–B7. Routing update available.", source: "FMS",  mheId: undefined, zone: "Storage B", time: "1 hr ago",    action: "Apply Route Fix",   actionVariant: "warning" },
  { id: "E003", tab: "efficiency", severity: "medium", live: false, title: "MHE-022 showing 12% productivity drop post-inspection finding", summary: "Amber finding on mast alignment reducing lift efficiency. Correlates with −12% task completion rate.", source: "MEPS", mheId: "MHE-022", zone: "Picking",   time: "2 hrs ago",   action: "Schedule Service",  actionVariant: "primary" },
  { id: "E004", tab: "efficiency", severity: "info",   live: false, title: "Shift 4 consistently 18% below fleet efficiency target", summary: "Night shift utilization averages 61% vs 82% daytime. Staffing and charging schedule may need revision.", source: "FMS",  mheId: undefined, zone: "All Zones", time: "3 days",      action: "View Analysis",     actionVariant: "primary" },
  // Safety tab
  { id: "S001", tab: "safety", severity: "critical", live: true,  title: "Storage B: 3 rack impact events in 90 min — escalation pattern", summary: "MHE-025 involved in all 3 incidents. Risk of further impact this shift is elevated based on event frequency.", source: "RTSS", mheId: "MHE-025", zone: "Storage B", time: "14 min ago",  action: "Restrict Zone",     actionVariant: "danger"  },
  { id: "S002", tab: "safety", severity: "critical", live: false, title: "Red finding on MHE-004 unresolved — 3 days overdue for closure", summary: "Brake failure finding still open. MHE confirmed operating. MEPS compliance breach — regulatory risk.", source: "MEPS", mheId: "MHE-004", zone: "Loading",   time: "3 days ago",  action: "Ground MHE",        actionVariant: "danger"  },
  { id: "S003", tab: "safety", severity: "high",     live: true,  title: "Pedestrian zone violations up 40% this shift — zone enforcement needed", summary: "9 restricted zone entries across Picking and Storage B. Camera feed shows inadequate barrier coverage.", source: "RTSS", mheId: undefined, zone: "Picking",   time: "30 min ago",  action: "Alert Supervisors", actionVariant: "warning" },
  { id: "S004", tab: "safety", severity: "medium",   live: false, title: "Near-miss pattern identified in Storage B — 4 events over 3 shifts", summary: "Same pedestrian crossing point (B-Gate 3) involved in all 4 near-miss events. Physical intervention recommended.", source: "RTSS", mheId: undefined, zone: "Storage B", time: "Recurring",   action: "Create Work Order", actionVariant: "primary" },
  // Utilization tab
  { id: "U001", tab: "utilization", severity: "high",   live: true,  title: "Reach Truck fleet at 41% utilization — 4 units below threshold", summary: "Demand forecast shows high pick volume in 2 hours. Move idle units to Zones C and D now.", source: "FMS",  mheId: "Fleet",   zone: "Zones C,D", time: "Now",         action: "Move to Zone",      actionVariant: "warning" },
  { id: "U002", tab: "utilization", severity: "medium", live: false, title: "MHE-009 charge window overlaps with peak demand — unit unavailable", summary: "Unit scheduled for 4-hour charge during highest pick volume. Shift charge window to 2:00–4:00 AM.", source: "FMS",  mheId: "MHE-009", zone: "Storage A", time: "This shift",  action: "Adjust Schedule",   actionVariant: "primary" },
  { id: "U003", tab: "utilization", severity: "info",   live: false, title: "Electric Forklift fleet at 76% utilization — above weekly target", summary: "Strong utilization performance this week. Fleet sizing appears optimal for current workload.", source: "FMS",  mheId: "Fleet",   zone: "All Zones", time: "This week",  action: "View Report",       actionVariant: "primary" },
];

const INBOX_SEVERITY_STYLE: Record<InboxSeverity, { dot: string; chip: string; chipText: string; chipBorder: string; label: string }> = {
  critical: { dot: "#ef4444", chip: "#fef2f2", chipText: "#dc2626", chipBorder: "#fecaca", label: "Critical" },
  high:     { dot: "#f59e0b", chip: "#fef3c7", chipText: "#92400e", chipBorder: "#fde68a", label: "High"     },
  medium:   { dot: "#3b82f6", chip: "#eff6ff", chipText: "#1e40af", chipBorder: "#bfdbfe", label: "Medium"   },
  info:     { dot: "#94a3b8", chip: "#f1f5f9", chipText: "#475569", chipBorder: "#e2e8f0", label: "Info"     },
};

const INBOX_ACTION_STYLE: Record<string, { bg: string; color: string; border: string; hoverBg: string }> = {
  danger:  { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", hoverBg: "#fee2e2" },
  warning: { bg: "#fef3c7", color: "#92400e", border: "#fde68a", hoverBg: "#fde68a" },
  primary: { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe", hoverBg: "#dbeafe" },
};

const INBOX_TABS: { val: InboxTab; label: string; icon: React.ElementType }[] = [
  { val: "operators",   label: "Operators",   icon: Users    },
  { val: "efficiency",  label: "Efficiency",  icon: BarChart2 },
  { val: "safety",      label: "Safety",      icon: Shield   },
  { val: "utilization", label: "Utilization", icon: Gauge    },
];

const SOURCE_STYLE: Record<string, { bg: string; color: string }> = {
  FMS:  { bg: "#eff6ff", color: "#1e40af" },
  MEPS: { bg: "#fef3c7", color: "#92400e" },
  RTSS: { bg: "#fef2f2", color: "#dc2626" },
  IMDS: { bg: "#f0fdf4", color: "#166534" },
};

function OperationalInboxWidget() {
  const [activeTab, setActiveTab] = useState<InboxTab>("operators");
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const tabItems = INBOX_ITEMS.filter(i => i.tab === activeTab);

  const tabCounts: Record<InboxTab, number> = {
    operators:   INBOX_ITEMS.filter(i => i.tab === "operators").length,
    efficiency:  INBOX_ITEMS.filter(i => i.tab === "efficiency").length,
    safety:      INBOX_ITEMS.filter(i => i.tab === "safety").length,
    utilization: INBOX_ITEMS.filter(i => i.tab === "utilization").length,
  };

  const criticalInTab = tabItems.filter(i => i.severity === "critical").length;

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @keyframes inboxPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.7)} }
        .inbox-action-btn:hover { opacity: 0.85; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "14px 24px 13px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", color: "#0f172a", lineHeight: "18px" }}>
              Operational Inbox
            </span>
            {criticalInTab > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 3, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 20, padding: "1px 7px" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "inboxPulse 1.4s ease-in-out infinite" }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: "#dc2626" }}>{criticalInTab} critical</span>
              </span>
            )}
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>
            Cross-system operational action feed — FMS · RTSS · MEPS · IMDS
          </span>
        </div>
      </div>

      {/* Tab strip */}
      <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", padding: "0 24px", flexShrink: 0, gap: 0 }}>
        {INBOX_TABS.map(({ val, label, icon: TabIcon }) => {
          const isActive = activeTab === val;
          const count = tabCounts[val];
          const hasCritical = INBOX_ITEMS.filter(i => i.tab === val && i.severity === "critical").length > 0;
          return (
            <button
              key={val}
              onClick={() => setActiveTab(val)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 16px 9px",
                borderBottom: isActive ? "2px solid hsl(217, 98%, 54%)" : "2px solid transparent",
                background: "transparent",
                border: "none",
                borderBottomStyle: "solid",
                borderBottomWidth: 2,
                borderBottomColor: isActive ? "hsl(217, 98%, 54%)" : "transparent",
                cursor: "pointer",
                transition: "all 0.12s",
                marginBottom: -1,
              }}
            >
              <TabIcon size={13} color={isActive ? "hsl(217, 98%, 54%)" : "#94a3b8"} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? "hsl(217, 98%, 54%)" : "#64748b", transition: "color 0.12s" }}>
                {label}
              </span>
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600,
                padding: "1px 6px", borderRadius: 10,
                background: isActive ? "hsl(217, 98%, 54%)" : (hasCritical ? "#fef2f2" : "#f1f5f9"),
                color: isActive ? "#fff" : (hasCritical ? "#dc2626" : "#64748b"),
                transition: "all 0.12s",
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items grid — 2 columns */}
      <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {tabItems.map((item) => {
          const sv = INBOX_SEVERITY_STYLE[item.severity];
          const av = INBOX_ACTION_STYLE[item.actionVariant ?? "primary"];
          const src = SOURCE_STYLE[item.source] ?? { bg: "#f1f5f9", color: "#475569" };
          const isHovered = hoveredAction === item.id;
          return (
            <div key={item.id} style={{
              background: "#fafafa",
              border: "1px solid #f1f5f9",
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
              transition: "box-shadow 0.15s, border-color 0.15s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 3px 10px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "#f1f5f9"; }}
            >
              {/* Top row: severity dot + title + live + AI badge */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                {/* Severity left bar */}
                <div style={{ width: 3, flexShrink: 0, alignSelf: "stretch", borderRadius: 2, background: sv.dot, marginTop: 1, marginBottom: 1 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "#0f172a", lineHeight: "16px", flex: 1 }}>{item.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, paddingTop: 1 }}>
                      {item.live && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "inboxPulse 1.6s ease-in-out infinite" }} />
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 8, fontWeight: 600, color: "#16a34a" }}>LIVE</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Summary */}
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#64748b", lineHeight: "14px", margin: 0, marginBottom: 8 }}>{item.summary}</p>
                  {/* Meta row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" as const, marginBottom: 10 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: src.bg, color: src.color }}>{item.source}</span>
                    {item.mheId && (
                      <>
                        <span style={{ fontSize: 9, color: "#cbd5e1" }}>·</span>
                        <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: "hsl(217, 98%, 54%)", background: "#eff6ff", padding: "2px 5px", borderRadius: 3 }}>{item.mheId}</span>
                      </>
                    )}
                    {item.zone && (
                      <>
                        <span style={{ fontSize: 9, color: "#cbd5e1" }}>·</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "#64748b" }}>{item.zone}</span>
                      </>
                    )}
                    <span style={{ fontSize: 9, color: "#cbd5e1" }}>·</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "#94a3b8" }}>{item.time}</span>
                  </div>
                  {/* Bottom row: severity chip + action button */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: sv.chip, color: sv.chipText, border: `1px solid ${sv.chipBorder}` }}>
                      {sv.label}
                    </span>
                    <button
                      className="inbox-action-btn"
                      onMouseEnter={() => setHoveredAction(item.id)}
                      onMouseLeave={() => setHoveredAction(null)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: `1px solid ${av.border}`,
                        background: isHovered ? av.hoverBg : av.bg,
                        color: av.color,
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 10,
                        fontWeight: 600,
                        transition: "background 0.12s",
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      {item.action}
                      <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f1f5f9", padding: "11px 24px 0 24px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            4 critical actions need immediate attention — MHE-025 impact pattern and MHE-004 open Red finding
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Cross-system operational feed — FMS · RTSS · MEPS · IMDS
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Widget: Operational Status Inbox Layer ──────────────────────────────────
// Merges OperationalInboxWidget content into the 4-column OSL card grid.
// Each column = one inbox tab (Operators · Efficiency · Safety · Utilization).

// Shared sub-components — minimal, matching reference style
function OslCardHeader({ label, subtitle }: { label: string; subtitle: string }) {
  return (
    <div style={{ padding: "16px 18px 11px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0 }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 2px", lineHeight: "18px" }}>{label}</p>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-3)", margin: 0 }}>{subtitle}</p>
    </div>
  );
}

function OslCardFooter({ modules, insight }: { modules: string; insight: string }) {
  return (
    <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 18px 0 18px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: "var(--w-text-3)", margin: "0 0 3px", letterSpacing: "0.06em" }}>{modules}</p>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", margin: 0, lineHeight: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{insight}</p>
    </div>
  );
}

const CARD_DIVIDER = { height: 1, background: "var(--w-divider)" } as const;

function OperationalStatusInboxLayer() {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // ── Card 1: Operators — person rows, 3-metric grid per operator ──
  const operatorRows = [
    { id: "OP-014", initials: "014", score: 72, issues: 5,  issueLabel: "Violations", incidents: 2 },
    { id: "OP-007", initials: "007", score: 61, issues: 1,  issueLabel: "Findings",   incidents: 0 },
    { id: "OP-022", initials: "022", score: 84, issues: 2,  issueLabel: "Skipped",    incidents: 0 },
    { id: "Shift C", initials: "SC", score: 67, issues: 3,  issueLabel: "Issues",     incidents: 1 },
  ];

  // ── Card 2: Efficiency — 3-stat strip + single-colour progress bars ──
  const effStats = [
    { label: "TASKS",     value: "89",  sub: "Queued",     problem: false },
    { label: "IDLE MHEs", value: "3",   sub: "No task",    problem: true  },
    { label: "HRS LOST",  value: "4.2", sub: "Congestion", problem: true  },
  ];
  const effBars = [
    { label: "Fleet Efficiency",  pct: 62, target: 82, belowTarget: true  },
    { label: "Task Completion",   pct: 82, target: 82, belowTarget: false },
    { label: "Peak Utilization",  pct: 74, target: 80, belowTarget: false },
    { label: "Congestion Impact", pct: 18, target: 10, belowTarget: true  },
  ];

  // ── Card 3: Safety — specific warehouse-manager metrics + alert detail ──
  const safetyCounts = [
    { label: "Impact Events Today",      count: 3, sub: "Rack impacts & collisions"       },
    { label: "Open Red Findings",        count: 1, sub: "MHEs operating with open finding" },
    { label: "Restricted Zone Entries",  count: 9, sub: "This shift — Picking & Storage B" },
    { label: "Near-Miss Events",         count: 4, sub: "Over 3 consecutive shifts"        },
  ];

  // ── Card 4: Utilization — fleet rows + actions ──
  const utilFleet = [
    { initials: "RT", type: "Reach Trucks",       zone: "Zones C, D", pct: 41, status: "At Risk",   statusColor: "#dc2626" as const },
    { initials: "PJ", type: "Pallet Jacks",       zone: "Loading",    pct: 54, status: "Warning",   statusColor: "#d97706" as const },
    { initials: "EF", type: "Electric Forklifts", zone: "All Zones",  pct: 76, status: "On Target", statusColor: "#16a34a" as const },
  ];

  const hoverIn  = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.background = "var(--w-bg-muted)"; };
  const hoverOut = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.background = "transparent"; };

  return (
    <>
      {/* ── Section label ── */}
      <div className="col-span-12">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: -2 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>
            Operational Action Status
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--w-border)" }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)", whiteSpace: "nowrap" }}>FMS · RTSS · MEPS · IMDS</span>
        </div>
      </div>

      {/* ════ CARD 1 — Operators · person rows with 3-metric grid ═══════════ */}
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", height: "420px" }}>
          <OslCardHeader label="Operators" subtitle="Operator-wise safety breakdown" />
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin" as const, scrollbarColor: "var(--w-border) transparent" }}>
            {operatorRows.map((op, i, arr) => (
              <div key={op.id}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 18px", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--w-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User style={{ width: 13, height: 13, color: "var(--w-text-4)" }} />
                    </div>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--w-text-1)" }}>{op.id}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    {[
                      { val: op.score,     lbl: "Score",       bad: op.score < 70 },
                      { val: op.issues,    lbl: op.issueLabel, bad: op.issues > 0 },
                      { val: op.incidents, lbl: "Incidents",   bad: op.incidents > 0 },
                    ].map(m => (
                      <div key={m.lbl} style={{ textAlign: "right" as const }}>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--w-text-1)", margin: 0, lineHeight: 1 }}>{m.val}</p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 8, color: "var(--w-text-3)", margin: "3px 0 0", letterSpacing: "0.02em" }}>{m.lbl}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ ...CARD_DIVIDER, margin: "0 18px" }} />}
              </div>
            ))}
          </div>
          <OslCardFooter modules="RTSS · MEPS · IMDS" insight="1 operator running MHE with open red finding — immediate review needed." />
        </div>
      </div>

      {/* ════ CARD 2 — Efficiency · stat strip + progress bars ═══════════════ */}
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", height: "420px" }}>
          <OslCardHeader label="Efficiency" subtitle="Fleet & operational performance signals" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", padding: "16px 0 14px", flexShrink: 0 }}>
            {effStats.flatMap((m, i, arr) => [
              <div key={m.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0 4px" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 22, fontWeight: 700, color: "var(--w-text-1)", margin: 0, lineHeight: 1 }}>{m.value}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 8, fontWeight: 600, color: "var(--w-text-3)", margin: "2px 0 0", letterSpacing: "0.06em", textAlign: "center" as const }}>{m.label}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 8, color: "var(--w-text-5)", margin: 0, textAlign: "center" as const }}>{m.sub}</p>
              </div>,
              ...(i < arr.length - 1 ? [<div key={`dv${i}`} style={{ width: 1, background: "var(--w-divider)", alignSelf: "stretch" }} />] : []),
            ])}
          </div>
          <div style={{ ...CARD_DIVIDER, margin: "0 18px", flexShrink: 0 }} />
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin" as const, scrollbarColor: "var(--w-border) transparent", paddingTop: 2 }}>
            {effBars.map((bar, i, arr) => (
              <div key={bar.label}>
                <div style={{ padding: "10px 18px", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)" }}>{bar.label}</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: "var(--w-text-1)" }}>{bar.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "var(--w-bg-muted)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${bar.pct}%`, height: "100%", background: bar.belowTarget ? "#dc2626" : "#1b59f8", borderRadius: 3 }} />
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ ...CARD_DIVIDER, margin: "0 18px" }} />}
              </div>
            ))}
          </div>
          <OslCardFooter modules="FMS · MEPS" insight="3 Pallet Jacks idle with 7 pending picks in the task queue." />
        </div>
      </div>

      {/* ════ CARD 3 — Safety · specific metrics + full-text alert rows ════════ */}
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", height: "420px" }}>
          <OslCardHeader label="Safety" subtitle="Live safety metrics · RTSS + MEPS" />
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin" as const, scrollbarColor: "var(--w-border) transparent" }}>
            {safetyCounts.map((row, i, arr) => (
              <div key={row.label}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 18px", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 2px", lineHeight: "15px" }}>{row.label}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)", margin: 0, lineHeight: "13px" }}>{row.sub}</p>
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 22, fontWeight: 700, color: "var(--w-text-4)", flexShrink: 0, lineHeight: 1 }}>{row.count}</span>
                </div>
                {i < arr.length - 1 && <div style={{ ...CARD_DIVIDER, margin: "0 18px" }} />}
              </div>
            ))}
            <div style={{ height: 1, background: "var(--w-border)", margin: "4px 18px" }} />
            {INBOX_ITEMS.filter(item => item.tab === "safety").sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0)).map((item, i, arr) => (
              <div key={item.id}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 18px", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                  <div style={{ width: 3, minHeight: 36, borderRadius: 2, background: "var(--w-text-5)", flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 3px", lineHeight: "15px" }}>{item.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" as const }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)" }}>{item.zone}</span>
                      <span style={{ fontSize: 9, color: "var(--w-text-5)" }}>·</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)" }}>{item.time}</span>
                      {item.live && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 8, fontWeight: 600, color: "#dc2626" }}>LIVE</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ ...CARD_DIVIDER, margin: "0 18px" }} />}
              </div>
            ))}
          </div>
          <OslCardFooter modules="RTSS · MEPS" insight="MHE-004 operating with open red finding — 3 days overdue for closure." />
        </div>
      </div>

      {/* ════ CARD 4 — Utilization · fleet rows + action list ════════════════ */}
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", height: "420px" }}>
          <OslCardHeader label="Utilization" subtitle="Equipment utilization by fleet type" />
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin" as const, scrollbarColor: "var(--w-border) transparent" }}>
            {utilFleet.map((row, i, arr) => (
              <div key={row.type}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--w-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--w-text-4)" }}>{row.initials}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 2px" }}>{row.type}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)", margin: 0 }}>{row.zone}</p>
                  </div>
                  <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, color: row.statusColor, margin: 0, lineHeight: 1 }}>{row.pct}%</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 8, color: "var(--w-text-3)", margin: "2px 0 0" }}>{row.status}</p>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ ...CARD_DIVIDER, margin: "0 18px" }} />}
              </div>
            ))}
            <div style={{ height: 1, background: "var(--w-border)", margin: "0 18px" }} />
            {INBOX_ITEMS.filter(item => item.tab === "utilization").map((item, i, arr) => {
              const av = INBOX_ACTION_STYLE[item.actionVariant ?? "primary"];
              const sv = INBOX_SEVERITY_STYLE[item.severity];
              const isHov = hoveredAction === item.id;
              return (
                <div key={item.id}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "11px 18px", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                    <div style={{ width: 3, borderRadius: 2, background: sv.dot, flexShrink: 0, alignSelf: "stretch", minHeight: 36 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 4px", lineHeight: "15px" }}>{item.title}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" as const }}>
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)" }}>{item.zone}</span>
                          <span style={{ fontSize: 9, color: "var(--w-text-5)" }}>·</span>
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)" }}>{item.time}</span>
                          {item.live && (
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 8, fontWeight: 600, color: "#dc2626" }}>LIVE</span>
                            </span>
                          )}
                        </div>
                        <button
                          onMouseEnter={() => setHoveredAction(item.id)}
                          onMouseLeave={() => setHoveredAction(null)}
                          style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 5, border: `1px solid ${av.border}`, background: isHov ? av.hoverBg : av.bg, color: av.color, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 600, transition: "background 0.12s", whiteSpace: "nowrap" as const, flexShrink: 0 }}
                        >
                          {item.action}<ChevronRight size={9} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ ...CARD_DIVIDER, margin: "0 18px" }} />}
                </div>
              );
            })}
          </div>
          <OslCardFooter modules="FMS · RTSS" insight="Reach Truck fleet at 41% — move 4 idle units to Zones C & D before peak." />
        </div>
      </div>
    </>
  );
}

// ─── Widget: Operational Health ───────────────────────────────────────────────
const FF3 = "Inter, sans-serif";
const hoverIn3  = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.background = "var(--w-bg-muted)"; };
const hoverOut3 = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.background = "transparent"; };

function OperationalHealthWidget() {
  const pillars = [
    { icon: Shield,       label: "Safety",     sources: "RTSS · MEPS", val: 64, delta: -5.4, status: "Declining",  statusColor: "#dc2626" as const },
    { icon: Zap,          label: "Efficiency", sources: "FMS · RTSS",  val: 71, delta: -1.2, status: "Stable",     statusColor: "#d97706" as const },
    { icon: CheckCircle,  label: "Compliance", sources: "MEPS · IMDS", val: 78, delta: +0.4, status: "Improving",  statusColor: "#16a34a" as const },
    { icon: Gauge,        label: "Readiness",  sources: "FMS · IMDS",  val: 71, delta: +1.2, status: "On Track",   statusColor: "#475569" as const },
  ];

  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 12, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>

      {/* Header */}
      <div style={{ padding: "16px 18px 11px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0 }}>
        <p style={{ fontFamily: FF3, fontSize: 13, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 2px", lineHeight: "18px" }}>Operational Health</p>
        <p style={{ fontFamily: FF3, fontSize: 10, color: "var(--w-text-3)", margin: 0 }}>Weighted blend — safety · efficiency · compliance · maintenance · readiness</p>
      </div>

      {/* Composite Score card */}
      <div style={{ margin: "14px 18px", border: "1px solid var(--w-border)", borderRadius: 10, display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", flexShrink: 0 }}>
        <svg width={64} height={64} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
          <circle cx={32} cy={32} r={25} fill="none" stroke="var(--w-border)" strokeWidth={6} />
          <circle cx={32} cy={32} r={25} fill="none" stroke="#1b59f8" strokeWidth={6}
            strokeDasharray="111.53 45.55" strokeLinecap="butt" transform="rotate(-90 32 32)" />
          <text x={32} y={36} textAnchor="middle"
            style={{ fontFamily: FF3, fontSize: "14px", fontWeight: 700, fill: "var(--w-text-1)" }}>71</text>
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: FF3, fontSize: 13, fontWeight: 700, color: "var(--w-text-1)", margin: "0 0 2px" }}>Composite Score</p>
          <p style={{ fontFamily: FF3, fontSize: 10, color: "var(--w-text-3)", margin: "0 0 8px" }}>Warehouse is operational but safety risks require immediate attention</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: FF3, fontSize: 11, fontWeight: 700, color: "var(--w-text-1)" }}>71 / 100</span>
            <span style={{ display: "inline-flex", padding: "2px 9px", borderRadius: 20, background: "var(--w-amber-bg)", border: "1px solid var(--w-amber-border)", fontFamily: FF3, fontSize: 9, fontWeight: 600, color: "#d97706", letterSpacing: "0.04em" }}>MODERATE</span>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "var(--w-border)", margin: "0 18px", flexShrink: 0 }} />

      {/* Pillar rows */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {pillars.map((row, i, arr) => {
          const up = row.delta >= 0;
          const Icon = row.icon;
          return (
            <div key={row.label} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "0 18px", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn3} onMouseLeave={hoverOut3}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--w-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} color="var(--w-text-4)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FF3, fontSize: 11, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 2px" }}>{row.label}</p>
                  <p style={{ fontFamily: FF3, fontSize: 8, color: "var(--w-text-3)", margin: 0 }}>{row.status}</p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0, fontFamily: FF3, fontSize: 10, fontWeight: 700, color: up ? "#22c55e" : "#ef4444" }}>
                  {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {Math.abs(row.delta).toFixed(1)}
                </span>
                <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                  <p style={{ fontFamily: FF3, fontSize: 14, fontWeight: 700, color: "var(--w-text-4)", margin: 0, lineHeight: 1 }}>{row.val}</p>
                </div>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: "var(--w-divider)", margin: "0 18px" }} />}
            </div>
          );
        })}
      </div>

      <div style={{ height: 20, flexShrink: 0 }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type CorrTooltip = { row: typeof INSP_IMPACT_CORR[0]; x: number; y: number } | null;

export function Variation3Tab() {
  const [issuesOpen, setIssuesOpen] = useState(false);
  const [corrTooltip, setCorrTooltip] = useState<CorrTooltip>(null);

  const criticalCount = warrantyExpiryData.filter(r => r.status === "expired").length
    + operatorLicenseData.filter(o => o.status === "expired").length
    + machinesInspectionData.filter(m => m.redFindings >= 3).length;

  return (
    <div className="space-y-6 p-8">

      {/* ══ Dashboard header bar ══════════════════════════════════════════ */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: -8 }}>
        <a
          href="/MHE_DASHBOARD_DOCUMENTATION.md"
          download="MHE_Dashboard_Documentation.md"
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "8px 14px", borderRadius: 8,
            border: "1px solid var(--w-border)", background: "var(--w-bg)",
            fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
            color: "var(--w-text-4)", textDecoration: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            transition: "background 0.12s, border-color 0.12s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--w-bg-page)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--w-text-5)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--w-bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--w-border)"; }}
        >
          <Download size={13} />
          Documentation
        </a>
      </div>

      {/* ══ Row 1: Cross-System Intelligence KPIs ════════════════════════
          Each card is a composite score derived from multiple systems.       */}
      <div className="grid grid-cols-12 gap-4">

        {/* Warehouse Readiness Index — FMS + MEPS + IMDS */}
        <div className="col-span-3">
          <KPICard
            icon={Activity}
            value="74%"
            title="Warehouse Readiness Index"
            description="Utilization × Inspection Health × Compliance"
          />
        </div>

        {/* Safety Risk Level — RTSS + MEPS */}
        <div className="col-span-3">
          <KPICard
            icon={AlertTriangle}
            value="HIGH"
            title="Active Safety Risk Level"
            description="50 events · 6 Red findings · Violations"
          />
        </div>

        {/* Operational Efficiency — FMS + RTSS */}
        <div className="col-span-3">
          <KPICard
            icon={Zap}
            value="62%"
            title="Operational Efficiency Score"
            description="52.5h lost · Congestion + Unsafe behavior"
          />
        </div>

        {/* Assets at Critical Risk — MEPS + RTSS + IMDS */}
        <div className="col-span-3">
          <KPICard
            icon={Truck}
            value={String(criticalCount)}
            title="Assets at Critical Risk"
            description="Repeated findings + impacts + expiry risk"
          />
        </div>
      </div>

      {/* ══ Row 2: Operational Health + Safety Trend + Active Safety Alerts ═══
          Operational Health (4) · Safety Trend (5) · Alerts (3)              */}
      <div className="grid grid-cols-12 gap-6">
        <SL>RTSS · MEPS · FMS · COMMAND CENTER — Operational Health · Safety Trend Intelligence</SL>

        {/* Operational Health */}
        <div className="col-span-12 xl:col-span-4 flex flex-col" style={{ minHeight: "520px" }}>
          <OperationalHealthWidget />
        </div>

        {/* Safety Violation Trend */}
        <div className="col-span-12 xl:col-span-4 flex" style={{ minHeight: "520px" }}>
          <SafetyViolationTrendWidget />
        </div>

        {/* Active Safety Alerts — fixed height, internal scroll */}
        <div className="col-span-12 xl:col-span-4 flex" style={{ height: "520px", overflow: "hidden" }}>
          <ActiveSafetyAlertsWidget />
        </div>
      </div>

      {/* ══ Operational Action Status ══════════════════════════════════════════
          Inbox content in OSL card layout — Operators · Efficiency · Safety · Utilization  */}
      <div className="grid grid-cols-12 gap-4">
        <OperationalStatusInboxLayer />
      </div>

      {/* ══ Row 3: Shift Performance + Inspection × Impact Correlation ═════
          Both widgets cross-system. Shift = ALL modules. Correlation = MEPS + RTSS. */}
      <div className="grid grid-cols-12 gap-6">
        <SL>ALL MODULES — Shift Intelligence · MEPS + RTSS — Inspection × Impact Correlation</SL>

        {/* Widget: Shift Performance vs Operational Risk */}
        <div className="col-span-12 xl:col-span-6 flex">
          <ShiftPerformanceWidget />
        </div>

        {/* Widget: Repeated Inspection Failures vs Safety Impact Frequency */}
        <Card className="col-span-12 xl:col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden" style={{ minHeight: "360px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" as const }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>Repeated Inspection Failures vs Safety Impacts</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-3)", whiteSpace: "nowrap" }}>MHEs with repeated findings (MEPS) correlated with impact event frequency (RTSS)</span>
            </div>
          </div>

          {/* Chart — pure flex, no absolute positioning, no scroll */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 14px 0 14px", overflow: "hidden" }}>

            {/* Y-labels + bars row — fills remaining space */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

              {/* Y-axis labels — flex:1 rows align with bar rows */}
              <div style={{ width: 56, flexShrink: 0, display: "flex", flexDirection: "column" }}>
                {INSP_IMPACT_CORR.map(row => (
                  <div key={row.mheId} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
                    background: corrTooltip?.row.mheId === row.mheId ? "var(--w-bg-muted)" : "transparent" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", lineHeight: 1 }}>{row.mheId}</span>
                  </div>
                ))}
              </div>

              {/* Grid lines + bar groups */}
              <div
                style={{ flex: 1, position: "relative" }}
                onMouseLeave={() => setCorrTooltip(null)}
              >
                {/* Vertical grid lines */}
                {[0, 25, 50, 75, 100].map(pct => (
                  <div key={pct} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 1, background: "var(--w-divider)", zIndex: 0 }} />
                ))}
                {/* Bar groups — flex:1 so entire row height is hoverable */}
                <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
                  {INSP_IMPACT_CORR.map(row => (
                    <div
                      key={row.mheId}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 4,
                        cursor: "default",
                        background: corrTooltip?.row.mheId === row.mheId ? "var(--w-bg-muted)" : "transparent",
                        borderRadius: 4,
                      }}
                      onMouseMove={e => {
                        const gridDiv = (e.currentTarget.parentElement!.parentElement as HTMLElement);
                        const rect = gridDiv.getBoundingClientRect();
                        setCorrTooltip({ row, x: e.clientX - rect.left, y: e.clientY - rect.top });
                      }}
                    >
                      <div style={{ height: 8, borderRadius: "0 3px 3px 0", background: "#f59e0b", width: `${(row.repeatedFindings / 8) * 100}%` }} />
                      <div style={{ height: 8, borderRadius: "0 3px 3px 0", background: "#ef4444", width: `${(row.impactEvents / 8) * 100}%` }} />
                    </div>
                  ))}
                </div>

                {/* Tooltip — follows cursor like ShiftStackedTooltip */}
                {corrTooltip && (
                  <div style={{
                    position: "absolute",
                    left: corrTooltip.x + 12,
                    top: Math.max(0, corrTooltip.y - 40),
                    background: "var(--w-bg)",
                    border: "1px solid var(--w-border)",
                    borderRadius: 6,
                    padding: "10px 14px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    minWidth: 180,
                    pointerEvents: "none",
                    zIndex: 50,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, paddingBottom: 6, borderBottom: "0.64px solid var(--w-border)" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, color: "var(--w-text-1)" }}>{corrTooltip.row.mheId}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-3)" }}>{corrTooltip.row.type}</span>
                    </div>
                    {[
                      { label: "Repeated Findings (MEPS)", value: corrTooltip.row.repeatedFindings, color: "#f59e0b" },
                      { label: "Impact Events (RTSS)",     value: corrTooltip.row.impactEvents,     color: "#ef4444" },
                    ].map(item => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 3 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.color, display: "inline-block", flexShrink: 0 }} />
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)" }}>{item.label}</span>
                        </div>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: "var(--w-text-1)" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* X-axis labels */}
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 56, paddingTop: 8, paddingBottom: 4, flexShrink: 0 }}>
              {[0, 2, 4, 6, 8].map(tick => (
                <span key={tick} style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", lineHeight: 1 }}>{tick}</span>
              ))}
            </div>

          </div>

          {/* Legend — centered at bottom */}
          <div style={{ display: "flex", gap: "16px", padding: "10px 24px", justifyContent: "center", flexWrap: "wrap" as const, flexShrink: 0 }}>
            {[
              { label: "Repeated Findings (MEPS)", color: "#f59e0b" },
              { label: "Impact Events (RTSS)",     color: "#ef4444" },
            ].map(l => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "var(--w-text-2)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: l.color, display: "inline-block", flexShrink: 0 }} />
                {l.label}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                MHE-025 shows highest correlation — 8 repeated findings coincide with 7 impact events
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Unresolved inspection findings are predictive of safety impact events — MEPS + RTSS
              </span>
            </div>
          </div>

        </Card>
      </div>

<CriticalIssuesModal isOpen={issuesOpen} onClose={() => setIssuesOpen(false)} />
    </div>
  );
}
