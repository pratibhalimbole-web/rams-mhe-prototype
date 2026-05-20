/**
 * Warehouse Operations Intelligence Center
 * Combines FMS · MEPS · RTSS · IMDS · Command Center into cross-system intelligence.
 * Every widget correlates data from ≥2 systems — no single-module widgets.
 */
import React, { useState } from "react";
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
  Minus, Clock, Truck, Eye,
} from "lucide-react";
import { CriticalIssuesBanner } from "../../components/widgets/CriticalIssuesBanner";
import { CriticalIssuesModal } from "../../components/widgets/CriticalIssuesModal";
import {
  StatusBadge, machinesInspectionData, warrantyExpiryData, operatorLicenseData,
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
};

const ACTIVE_ALERTS: AlertCard[] = [
  { id: "A001", severity: "critical", title: "Multiple Impact Events Detected",      description: "3 rack impacts in 2 hours — compound risk pattern forming",  mheId: "MHE-025", zone: "Storage B", time: "14 min ago",  module: "RTSS",      category: "Impact Event"       },
  { id: "A002", severity: "critical", title: "Red Finding Unresolved — 3+ Days",     description: "Critical brake failure still open, MHE operating with active finding", mheId: "MHE-004", zone: "Loading",   time: "3 days ago", module: "MEPS",      category: "Red Finding"        },
  { id: "A003", severity: "high",     title: "Overspeed Violations Spike",           description: "9 events in Shift B — 3× the daily average for this zone",   mheId: "MHE-007", zone: "Storage B", time: "2 hrs ago",  module: "RTSS",      category: "Overspeed"          },
  { id: "A004", severity: "high",     title: "Restricted Zone Entry Repeat",         description: "3 pedestrian zone entries in 1 hour — operator review needed", mheId: "MHE-022", zone: "Picking",   time: "1 hr ago",   module: "RTSS",      category: "Zone Violation"     },
  { id: "A005", severity: "medium",   title: "Inspection Skipped — Warranty Risk",   description: "2 consecutive MEPS checks missed while under expiry warning",  mheId: "MHE-001", zone: "Storage A", time: "Today",      module: "MEPS",      category: "Skipped Inspection" },
  { id: "A006", severity: "medium",   title: "Fleet Utilization Drop Detected",      description: "Pallet Jack fleet at 54% — 3 MHEs idle, no scheduled task",   mheId: "Fleet",   zone: "Loading",   time: "This shift", module: "FMS",       category: "Utilization"        },
  { id: "A007", severity: "low",      title: "Near-Miss Pattern — Same Zone",        description: "4 pedestrian near-misses over 3 consecutive shifts in zone",   mheId: "—",       zone: "Storage B", time: "Recurring",  module: "RTSS",      category: "Near Miss"          },
];

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

function detectSafetyAlerts(data: SafetyTimePoint[]): string[] {
  const alerts: string[] = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i].impactEvents > 0 && data[i-1].impactEvents > 0 && data[i].impactEvents > data[i-1].impactEvents * 1.2) {
      const pct = Math.round((data[i].impactEvents / data[i-1].impactEvents - 1) * 100);
      alerts.push(`Impact events ↑${pct}% at ${data[i].label} — investigate ${data[i].mostAffectedZone}`);
    }
  }
  const zoneCounts: Record<string, number> = {};
  data.forEach(d => { zoneCounts[d.mostAffectedZone] = (zoneCounts[d.mostAffectedZone] || 0) + 1; });
  Object.entries(zoneCounts).forEach(([zone, count]) => {
    if (count >= Math.ceil(data.length * 0.4)) {
      alerts.push(`${zone} repeatedly flagged as highest-risk zone (${count}/${data.length} periods)`);
    }
  });
  return alerts.slice(0, 2);
}

function SL({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-12 mt-1 mb-[-8px]">
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#64748B" }}>
        {children}
      </span>
    </div>
  );
}

function FI({ insight, sub }: { insight: string; sub?: string }) {
  return (
    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px" }}>
      <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0 }}>{insight}</p>
      {sub && <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, marginTop: 2 }}>{sub}</p>}
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
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 224, maxWidth: 264, pointerEvents: "none" as const, fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "0.64px solid #e2e8f0" }}>
        <span style={{ fontWeight: 600, fontSize: 11, color: "#0f172a" }}>{label} · {d.shift}</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: rb.bg, color: rb.color, border: `1px solid ${rb.border}`, whiteSpace: "nowrap" as const }}>{rb.label}</span>
      </div>
      {/* Safety Violations */}
      <div style={{ marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1b59f8", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", flex: 1 }}>Safety Violations</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1b59f8" }}>{d.safetyViolations}</span>
        </div>
        <div style={{ paddingLeft: 12 }}>
          {([["Overspeed", d.overspeed], ["Restricted Zone", d.restrictedZone]] as [string, number][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
              <span style={{ fontSize: 9, color: "#94a3b8" }}>{k}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: "#64748b" }}>{fmt(v)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Impact Events */}
      <div style={{ marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", flex: 1 }}>Impact Events</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444" }}>{d.impactEvents}</span>
        </div>
        <div style={{ paddingLeft: 12 }}>
          {([["Rack Impact", d.rackImpact], ["Collision", d.collision]] as [string, number][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
              <span style={{ fontSize: 9, color: "#94a3b8" }}>{k}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: "#64748b" }}>{fmt(v)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Near Misses */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", flex: 1 }}>Near Misses</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b" }}>{d.nearMisses}</span>
        </div>
        <div style={{ paddingLeft: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, color: "#94a3b8" }}>Pedestrian Warning</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#64748b" }}>{fmt(d.pedestrianWarning)}</span>
          </div>
        </div>
      </div>
      {/* Operational Context */}
      <div style={{ borderTop: "0.64px solid #e2e8f0", paddingTop: 8 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#94a3b8", marginBottom: 5 }}>Operational Context</div>
        {([
          ["Active MHEs",       d.activeMhes,         "#0f172a"],
          ["Active Operators",  d.activeOperators,    "#0f172a"],
          ["Most Affected Zone",d.mostAffectedZone,   "#ef4444"],
        ] as [string, string|number, string][]).map(([lbl, val, col]) => (
          <div key={lbl} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: 9, color: "#94a3b8" }}>{lbl}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: col }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SAFETY_LINE_ITEMS: [string, string, string][] = [
  ["safetyViolations", "Safety Violations (RTSS)", "#1b59f8"],
  ["impactEvents",     "Impact Events (RTSS+FMS)", "#ef4444"],
  ["nearMisses",       "Near Misses (CC)",         "#f59e0b"],
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
  const strokeWidth = (key: string) => hoveredLine === key ? 2.5 : 2;

  const makeDot = (color: string) => (props: any) => {
    const { cx, cy, payload } = props;
    if (getSafetyRiskLevel(payload) !== "critical") return <g key={`dot-${cx}-${cy}`} />;
    return (
      <g key={`dot-${cx}-${cy}`}>
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
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <style>{`@keyframes v3SafetyPulse { 0%,100%{opacity:.5} 50%{opacity:.1} }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, minHeight: "81px", boxSizing: "border-box" as const, gap: 12, flexWrap: "wrap" as const }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>
              Safety Violation Trend Intelligence
            </span>
            {alerts.length > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 4, padding: "1px 7px", fontSize: 9, fontWeight: 700, color: "#92400e", whiteSpace: "nowrap" as const }}>
                <AlertTriangle style={{ width: 9, height: 9, color: "#f59e0b" }} />
                {alerts.length} ALERT{alerts.length > 1 ? "S" : ""}
              </span>
            )}
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b" }}>
            Safety violations · impact events · near-misses correlated across RTSS + MEPS + FMS
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
          <MTags tags={["RTSS", "MEPS", "FMS"]} />
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
                <defs>
                  <linearGradient id="gradSV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1b59f8" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#1b59f8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradIV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} dy={6} />
                <YAxis tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} dx={-4} domain={[0, yStep * 4]} ticks={yTicks} />
                <ReTooltip content={<SafetyTrendTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "4 2" }} />
                <Area type="monotone" dataKey="safetyViolations" name="Safety Violations"
                  stroke="#1b59f8" strokeWidth={strokeWidth("safetyViolations")} strokeOpacity={lineOpacity("safetyViolations")}
                  fill="url(#gradSV)" fillOpacity={lineOpacity("safetyViolations")}
                  dot={makeDot("#1b59f8")} activeDot={{ r: 5, fill: "#1b59f8", stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="impactEvents" name="Impact Events"
                  stroke="#ef4444" strokeWidth={strokeWidth("impactEvents")} strokeOpacity={lineOpacity("impactEvents")}
                  fill="url(#gradIV)" fillOpacity={lineOpacity("impactEvents")}
                  dot={makeDot("#ef4444")} activeDot={{ r: 5, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="nearMisses" name="Near Misses"
                  stroke="#f59e0b" strokeWidth={strokeWidth("nearMisses")} strokeOpacity={lineOpacity("nearMisses")}
                  fill="url(#gradNM)" fillOpacity={lineOpacity("nearMisses")}
                  dot={false} activeDot={{ r: 5, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Legend — hover to dim other lines */}
      <div style={{ display: "flex", gap: "16px", padding: "8px 16px 12px", justifyContent: "center", flexWrap: "wrap" as const, flexShrink: 0 }}>
        {SAFETY_LINE_ITEMS.map(([key, label, color]) => (
          <span key={key}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: hoveredLine === null || hoveredLine === key ? "#64748b" : "#cbd5e1", cursor: "default", transition: "color 0.15s" }}
            onMouseEnter={() => setHoveredLine(key)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <span style={{ width: "20px", height: "2px", background: color, display: "inline-block", flexShrink: 0, borderRadius: 1, opacity: hoveredLine === null || hoveredLine === key ? 1 : 0.25, transition: "opacity 0.15s" }} />
            {label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f1f5f9", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {footerInsight}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Operational safety trend — RTSS violations · MEPS findings · FMS fleet activity · Command Center
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

function ActiveSafetyAlertsWidget() {
  const [filter, setFilter] = useState<string>("all");

  const counts = {
    critical: ACTIVE_ALERTS.filter(a => a.severity === "critical").length,
    high:     ACTIVE_ALERTS.filter(a => a.severity === "high").length,
    medium:   ACTIVE_ALERTS.filter(a => a.severity === "medium").length,
    low:      ACTIVE_ALERTS.filter(a => a.severity === "low").length,
  };

  const visible = filter === "all" ? ACTIVE_ALERTS : ACTIVE_ALERTS.filter(a => a.severity === filter);

  const pills: [string, string, number, string, string][] = [
    ["all",      "All",      ACTIVE_ALERTS.length, "#64748b", "#f1f5f9"],
    ["critical", "Critical", counts.critical,       "#dc2626", "#fef2f2"],
    ["high",     "High",     counts.high,           "#92400e", "#fef3c7"],
    ["medium",   "Medium",   counts.medium,         "#1e40af", "#eff6ff"],
  ];

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" as const }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>Active Safety Alerts</span>
            <span style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, padding: "1px 7px", fontSize: 9, fontWeight: 700, color: "#dc2626" }}>
              {ACTIVE_ALERTS.length}
            </span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b" }}>Live cross-system feed — RTSS · MEPS · FMS</span>
        </div>
        <MTags tags={["RTSS", "MEPS", "FMS"]} />
      </div>

      {/* Severity filter pills */}
      <div style={{ display: "flex", gap: 3, padding: "7px 16px 6px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
        {pills.map(([val, label, count, textColor, bg]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: 5, border: "none", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 10,
            fontWeight: filter === val ? 700 : 400,
            background: filter === val ? bg : "transparent",
            color: filter === val ? textColor : "#94a3b8",
            transition: "all 0.12s",
          }}>
            {label}
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "0 4px", borderRadius: 3,
              background: filter === val ? "rgba(0,0,0,0.07)" : "#f1f5f9",
              color: filter === val ? textColor : "#94a3b8",
            }}>{count}</span>
          </button>
        ))}
      </div>

      {/* Alert card list */}
      <div style={{ flex: 1, overflowY: "auto" as const }}>
        {visible.map((alert, i) => {
          const rb = RISK_BAND[alert.severity];
          const modBg    = alert.module === "MEPS" ? "#fef3c7" : alert.module === "FMS" ? "#eff6ff" : "#fef2f2";
          const modColor = alert.module === "MEPS" ? "#92400e" : alert.module === "FMS" ? "#1e40af" : "#dc2626";
          return (
            <div key={alert.id}
              style={{ display: "flex", gap: 10, padding: "10px 16px", borderBottom: i < visible.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.1s", cursor: "default" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}
            >
              {/* Severity accent bar */}
              <div style={{ width: 3, borderRadius: 2, background: ALERT_ACCENT[alert.severity], flexShrink: 0, alignSelf: "stretch", minHeight: 44 }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Title row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "#0f172a", lineHeight: "15px", flex: 1 }}>{alert.title}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 3, background: rb.bg, color: rb.color, border: `1px solid ${rb.border}`, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{rb.label}</span>
                </div>
                {/* Description */}
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#64748b", lineHeight: "14px", marginBottom: 5 }}>{alert.description}</div>
                {/* Meta row */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: "#1b59f8" }}>{alert.mheId}</span>
                  <span style={{ fontSize: 9, color: "#cbd5e1" }}>·</span>
                  <span style={{ fontSize: 9, color: "#64748b" }}>{alert.zone}</span>
                  <span style={{ fontSize: 9, color: "#cbd5e1" }}>·</span>
                  <span style={{ fontSize: 9, color: "#94a3b8" }}>{alert.time}</span>
                  <span style={{ marginLeft: "auto", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: modBg, color: modColor }}>{alert.module}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f1f5f9", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            2 critical alerts need immediate action — MHE-025 impact events and MHE-004 red finding
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Cross-system alert feed — RTSS violations · MEPS findings · FMS fleet status
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Widget: Shift Performance Stacked Bar ───────────────────────────────────

const SHIFT_FILTER_STYLE: React.CSSProperties = {
  height: "32px",
  width: "auto",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "10px",
  color: "#0f172a",
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
};

function ShiftStackedTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const rawMap: Record<string, number> = {
    productivity: d?.rawProductivity,
    safety:       d?.rawSafety,
    compliance:   d?.rawCompliance,
  };
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "6px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "180px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "6px", borderBottom: "0.64px solid #e2e8f0" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "11px", color: "#0f172a" }}>{label} Session</span>
      </div>
      {[...payload].reverse().map((entry: any) => (
        <div key={entry.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "3px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: entry.color, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>{entry.name}</span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#0f172a" }}>
            {rawMap[entry.dataKey] !== undefined ? `${rawMap[entry.dataKey]}%` : `${entry.value}%`}
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
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" as const }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>Shift Performance vs Operational Risk</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Productivity · Safety · Compliance stacked by shift session</span>
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
              <BarChart data={SHIFT_PERFORMANCE_NORM} margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barCategoryGap="45%">
                <CartesianGrid strokeDasharray="" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="shift"
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dy={6}
                  tickFormatter={(v) => `${v} Session`}
                />
                <YAxis
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-4}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <ReTooltip content={<ShiftStackedTooltip />} cursor={{ fill: "#f8fafc" }} />
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
      <div style={{ display: "flex", gap: "16px", padding: "8px 16px 12px", justifyContent: "center", flexWrap: "wrap" as const }}>
        {SHIFT_LEGEND_ITEMS.filter(([key]) => visible(key)).map(([, label, color]) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f1f5f9", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
      <CriticalIssuesBanner count={11} trendNote="↑ 3 new today" onViewAll={() => setIssuesOpen(true)} />

      {/* ══ Row 1: Cross-System Intelligence KPIs ════════════════════════
          Each card is a composite score derived from multiple systems.       */}
      <div className="grid grid-cols-12 gap-4">

        {/* Warehouse Readiness Index — FMS + MEPS + IMDS */}
        <div className="col-span-3">
          <Card className="shadow-none border-[var(--border)] h-full">
            <CardContent style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Activity style={{ width: 15, height: 15, color: "#1b59f8" }} />
                </div>
                <MTags tags={["FMS", "MEPS", "IMDS"]} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#22c55e", lineHeight: 1, marginBottom: 3 }}>74%</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", marginBottom: 2 }}>Warehouse Readiness Index</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Utilization × Inspection Health × Compliance</div>
              <Progress value={74} className="h-1 mt-3" />
            </CardContent>
          </Card>
        </div>

        {/* Safety Risk Level — RTSS + MEPS */}
        <div className="col-span-3">
          <Card className="shadow-none border-[var(--border)] h-full">
            <CardContent style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertTriangle style={{ width: 15, height: 15, color: "#ef4444" }} />
                </div>
                <MTags tags={["RTSS", "MEPS"]} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#ef4444", lineHeight: 1, marginBottom: 3 }}>HIGH</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", marginBottom: 2 }}>Active Safety Risk Level</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Impact events + Red findings + Violations</div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>50 events</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>·</span>
                <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>6 Red findings</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operational Efficiency — FMS + RTSS */}
        <div className="col-span-3">
          <Card className="shadow-none border-[var(--border)] h-full">
            <CardContent style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fef3c7", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap style={{ width: 15, height: 15, color: "#f59e0b" }} />
                </div>
                <MTags tags={["FMS", "RTSS"]} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#f59e0b", lineHeight: 1, marginBottom: 3 }}>62%</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", marginBottom: 2 }}>Operational Efficiency Score</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>52.5h lost · Congestion + Unsafe behavior</div>
              <Progress value={62} className="h-1 mt-3" />
            </CardContent>
          </Card>
        </div>

        {/* Assets at Critical Risk — MEPS + RTSS + IMDS */}
        <div className="col-span-3">
          <Card className="shadow-none border-[var(--border)] h-full">
            <CardContent style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Truck style={{ width: 15, height: 15, color: "#ef4444" }} />
                </div>
                <MTags tags={["MEPS", "RTSS", "IMDS"]} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#ef4444", lineHeight: 1, marginBottom: 3 }}>{criticalCount}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", marginBottom: 2 }}>Assets at Critical Risk</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Repeated findings + impacts + expiry risk</div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <Badge variant="destructive" style={{ fontSize: 10 }}>2 Expired</Badge>
                <Badge style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" }}>4 Expiring</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ══ Row 2: Safety Violation Trend Intelligence + Active Safety Alerts ═
          Trend chart (8-col) + live alert feed (4-col) — RTSS+MEPS+FMS+CC   */}
      <div className="grid grid-cols-12 gap-6">
        <SL>RTSS · MEPS · FMS · COMMAND CENTER — Operational Safety Trend Intelligence</SL>

        {/* Safety Violation Trend — matches Shift Performance height */}
        <div className="col-span-12 xl:col-span-8 flex" style={{ minHeight: "520px" }}>
          <SafetyViolationTrendWidget />
        </div>

        {/* Active Safety Alerts — matches Shift Performance height */}
        <div className="col-span-12 xl:col-span-4 flex" style={{ minHeight: "520px" }}>
          <ActiveSafetyAlertsWidget />
        </div>
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
        <Card className="col-span-12 xl:col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden" style={{ minHeight: "520px" }}>

          {/* Header — matches ShiftPerformanceWidget */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" as const }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>Repeated Inspection Failures vs Safety Impacts</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>MHEs with repeated findings (MEPS) correlated with impact event frequency (RTSS)</span>
            </div>
            <MTags tags={["MEPS", "RTSS"]} />
          </div>

          {/* Chart — pure flex, no absolute positioning, no scroll */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 14px 0 14px", overflow: "hidden" }}>

            {/* Y-labels + bars row — fills remaining space */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

              {/* Y-axis labels — flex:1 rows align with bar rows */}
              <div style={{ width: 56, flexShrink: 0, display: "flex", flexDirection: "column" }}>
                {INSP_IMPACT_CORR.map(row => (
                  <div key={row.mheId} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
                    background: corrTooltip?.row.mheId === row.mheId ? "#f8fafc" : "transparent" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#64748b", lineHeight: 1 }}>{row.mheId}</span>
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
                  <div key={pct} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 1, background: "#f1f5f9", zIndex: 0 }} />
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
                        background: corrTooltip?.row.mheId === row.mheId ? "#f8fafc" : "transparent",
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
                    background: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: 6,
                    padding: "10px 14px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    minWidth: 180,
                    pointerEvents: "none",
                    zIndex: 50,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, paddingBottom: 6, borderBottom: "0.64px solid #e2e8f0" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, color: "#0f172a" }}>{corrTooltip.row.mheId}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#94a3b8" }}>{corrTooltip.row.type}</span>
                    </div>
                    {[
                      { label: "Repeated Findings (MEPS)", value: corrTooltip.row.repeatedFindings, color: "#f59e0b" },
                      { label: "Impact Events (RTSS)",     value: corrTooltip.row.impactEvents,     color: "#ef4444" },
                    ].map(item => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 3 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.color, display: "inline-block", flexShrink: 0 }} />
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#64748b" }}>{item.label}</span>
                        </div>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: "#0f172a" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* X-axis labels */}
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 56, paddingTop: 8, paddingBottom: 4, flexShrink: 0 }}>
              {[0, 2, 4, 6, 8].map(tick => (
                <span key={tick} style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#64748b", lineHeight: 1 }}>{tick}</span>
              ))}
            </div>

          </div>

          {/* Legend — centered at bottom, matches ShiftPerformanceWidget */}
          <div style={{ display: "flex", gap: "16px", padding: "8px 16px 12px", justifyContent: "center", flexWrap: "wrap" as const, flexShrink: 0 }}>
            {[
              { label: "Repeated Findings (MEPS)", color: "#f59e0b" },
              { label: "Impact Events (RTSS)",     color: "#ef4444" },
            ].map(l => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: l.color, display: "inline-block", flexShrink: 0 }} />
                {l.label}
              </span>
            ))}
          </div>

          {/* Footer — matches ShiftPerformanceWidget */}
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" as const, overflow: "hidden" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                MHE-025 shows highest correlation — 8 repeated findings coincide with 7 impact events
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Unresolved inspection findings are predictive of safety impact events — MEPS + RTSS
              </span>
            </div>
          </div>

        </Card>
      </div>

      {/* ══ Row 4: Asset Degradation Prediction Matrix ════════════════════
          MEPS repeated findings + RTSS impact frequency + FMS productivity
          drop + IMDS expiry risk = predictive degradation score             */}
      <div className="grid grid-cols-12 gap-6">
        <SL>MEPS · RTSS · FMS · IMDS — Asset Degradation Prediction Intelligence</SL>

        <Card className="col-span-12 shadow-none border-[var(--border)] overflow-hidden">
          <CardHeader style={{ padding: "14px 24px 12px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <CardTitle style={{ fontSize: 13, fontWeight: 600 }}>Asset Degradation Prediction Matrix</CardTitle>
                <CardDescription style={{ fontSize: 12 }}>
                  Composite risk signal from repeated amber findings (MEPS) · impact frequency (RTSS) · productivity drop (FMS) · expiry risk (IMDS)
                </CardDescription>
              </div>
              <MTags tags={["MEPS", "RTSS", "FMS", "IMDS"]} />
            </div>
          </CardHeader>
          <CardContent style={{ padding: 0 }}>
            <Table>
              <TableHeader>
                <TableRow style={{ background: "#f8fafc" }}>
                  {[
                    "MHE Asset",
                    "Amber Trend (MEPS)",
                    "Productivity Drop (FMS)",
                    "Impact Events (RTSS)",
                    "Inspections Skipped",
                    "Expiry Risk (IMDS)",
                    "Degradation Risk",
                  ].map(h => (
                    <TableHead key={h} style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.04em", padding: "9px 18px", color: "#64748B", whiteSpace: "nowrap" as const }}>
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ASSET_DEGRADATION.map(row => {
                  const rb = RISK_BAND[row.risk];
                  return (
                    <TableRow key={row.mheId} style={{ borderBottom: "1px solid var(--border)" }}>
                      <TableCell style={{ padding: "11px 18px" }}>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "#1b59f8" }}>{row.mheId}</span>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{row.type}</div>
                        </div>
                      </TableCell>
                      <TableCell style={{ padding: "11px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          {Array.from({ length: row.amberTrend }).map((_, i) => (
                            <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                          ))}
                          <span style={{ fontSize: 11, color: "#64748B" }}>{row.amberTrend}x recurring</span>
                        </div>
                      </TableCell>
                      <TableCell style={{ padding: "11px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <TrendingDown style={{ width: 13, height: 13, color: "#ef4444" }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#ef4444" }}>−{row.productivityDrop}%</span>
                        </div>
                      </TableCell>
                      <TableCell style={{ padding: "11px 18px" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: row.impacts >= 5 ? "#ef4444" : row.impacts >= 3 ? "#f59e0b" : "#1F2937" }}>
                          {row.impacts} events
                        </span>
                      </TableCell>
                      <TableCell style={{ padding: "11px 18px" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: row.skipped > 0 ? "#f59e0b" : "#22c55e" }}>
                          {row.skipped > 0 ? `${row.skipped} skipped` : "None"}
                        </span>
                      </TableCell>
                      <TableCell style={{ padding: "11px 18px" }}>
                        {row.expiryRisk
                          ? <Badge variant="destructive" style={{ fontSize: 10 }}>At Risk</Badge>
                          : <Badge style={{ fontSize: 10, background: "#f0fdf4", color: "#166534", border: "1px solid #86efac" }}>OK</Badge>
                        }
                      </TableCell>
                      <TableCell style={{ padding: "11px 18px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: rb.bg, color: rb.color, border: `1px solid ${rb.border}` }}>
                          {rb.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
          <FI
            insight="MHE-025 and MHE-004 show multi-signal degradation — warrant immediate inspection and service scheduling"
            sub="Predictive risk: Repeated findings + productivity decline + impact events + expiry risk — MEPS + RTSS + FMS + IMDS"
          />
        </Card>
      </div>

      <CriticalIssuesModal isOpen={issuesOpen} onClose={() => setIssuesOpen(false)} />
    </div>
  );
}
