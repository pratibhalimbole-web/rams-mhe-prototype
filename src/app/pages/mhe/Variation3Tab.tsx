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
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
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

// Operator Risk vs Productivity (RTSS safety score + FMS productivity + MEPS compliance)
type RiskLevel = "safe" | "monitor" | "risk";
const OPERATOR_MATRIX = [
  { name: "Abhishek S.", mhe: "MHE-005", productivity: 94, safety: 88, impacts: 2, risk: "safe"    as RiskLevel },
  { name: "Priya P.",    mhe: "MHE-012", productivity: 85, safety: 92, impacts: 1, risk: "safe"    as RiskLevel },
  { name: "Ramesh P.",   mhe: "MHE-008", productivity: 88, safety: 80, impacts: 3, risk: "safe"    as RiskLevel },
  { name: "Sunita R.",   mhe: "MHE-031", productivity: 78, safety: 66, impacts: 4, risk: "monitor" as RiskLevel },
  { name: "Vikram S.",   mhe: "MHE-022", productivity: 62, safety: 52, impacts: 6, risk: "monitor" as RiskLevel },
  { name: "Rajesh K.",   mhe: "MHE-004", productivity: 72, safety: 38, impacts: 9, risk: "risk"    as RiskLevel },
  { name: "James W.",    mhe: "MHE-007", productivity: 44, safety: 30, impacts: 14, risk: "risk"   as RiskLevel },
];
const RISK_COLOR: Record<RiskLevel, string> = {
  safe:    "#22c55e",
  monitor: "#f59e0b",
  risk:    "#ef4444",
};

// Fleet Readiness Intelligence (FMS utilization + MEPS findings + IMDS compliance)
const FLEET_READINESS = [
  { type: "Electric Forklift", count: 12, utilization: 78, redFindings: 2, amberFindings: 5, warrantyRisk: false, impacts: 5,  compliance: 88, readiness: 82 },
  { type: "Reach Truck",       count:  8, utilization: 62, redFindings: 1, amberFindings: 3, warrantyRisk: false, impacts: 3,  compliance: 85, readiness: 74 },
  { type: "Pallet Jack",       count:  8, utilization: 54, redFindings: 3, amberFindings: 7, warrantyRisk: true,  impacts: 8,  compliance: 62, readiness: 44 },
  { type: "Order Picker",      count:  7, utilization: 45, redFindings: 1, amberFindings: 4, warrantyRisk: true,  impacts: 5,  compliance: 40, readiness: 30 },
  { type: "Tow Tractor",       count:  7, utilization: 38, redFindings: 0, amberFindings: 2, warrantyRisk: false, impacts: 2,  compliance: 90, readiness: 65 },
];

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

// Operational Loss Attribution (FMS + RTSS + MEPS — ALL modules)
const OPERATIONAL_LOSS = [
  { cause: "Idle with Load Time",       hours: 18.5, pct: 35, module: "FMS",         color: "#f59e0b" },
  { cause: "Congestion Delays",         hours: 14.2, pct: 27, module: "FMS + RTSS",  color: "#ef4444" },
  { cause: "Unsafe Behavior Stops",     hours:  8.3, pct: 16, module: "RTSS",        color: "#dc2626" },
  { cause: "Inspection Downtime",       hours:  6.1, pct: 12, module: "MEPS",        color: "#3b82f6" },
  { cause: "Empty Travel Loss",         hours:  5.4, pct: 10, module: "FMS",         color: "#94a3b8" },
];
const TOTAL_LOSS_HOURS = 52.5;

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

const QUADRANT = [
  { key: "sh", label: "Safe · High Productivity",  prodMin: 75, safeMin: 75, bg: "#f0fdf4", border: "#86efac", text: "#166534" },
  { key: "sh2", label: "Safe · Low Productivity",  prodMin: 0,  prodMax: 75, safeMin: 75, bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
  { key: "rm", label: "Productive · Risk Safety",  prodMin: 75, safeMin: 0,  safeMax: 75, bg: "#fef3c7", border: "#fde68a", text: "#92400e" },
  { key: "rz", label: "Risk Zone",                 prodMax: 75, safeMax: 75, bg: "#fef2f2", border: "#fecaca", text: "#dc2626" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readinessColor(v: number) {
  return v >= 70 ? "#22c55e" : v >= 45 ? "#f59e0b" : "#ef4444";
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

// ─── Widget: Operator Quadrant Matrix ─────────────────────────────────────────
// Plots operators across Safety vs Productivity axes in quadrant cards.
// Bubble size = impact frequency. Cross-system: RTSS + FMS + MEPS.

function OperatorQuadrantMatrix() {
  const safe    = OPERATOR_MATRIX.filter(o => o.productivity >= 75 && o.safety >= 75);
  const monProd = OPERATOR_MATRIX.filter(o => o.productivity >= 75 && o.safety <  75);
  const monSafe = OPERATOR_MATRIX.filter(o => o.productivity <  75 && o.safety >= 75);
  const riskZone= OPERATOR_MATRIX.filter(o => o.productivity <  75 && o.safety <  75);

  const QuadCell = ({ label, operators, bg, border, textColor }: {
    label: string; operators: typeof OPERATOR_MATRIX; bg: string; border: string; textColor: string;
  }) => (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "12px 14px", minHeight: 110 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: textColor, textTransform: "uppercase" as const, letterSpacing: "0.06em", margin: "0 0 8px" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5 }}>
        {operators.length === 0 && <span style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>No operators</span>}
        {operators.map(op => (
          <div key={op.name} style={{ display: "flex", alignItems: "center", gap: 5, background: "#fff", borderRadius: 20, padding: "4px 9px", border: `1px solid ${border}` }}>
            <span style={{ width: Math.min(6 + op.impacts, 14), height: Math.min(6 + op.impacts, 14), borderRadius: "50%", background: RISK_COLOR[op.risk], display: "inline-block", flexShrink: 0, opacity: 0.85 }} />
            <span style={{ fontSize: 11, color: "#1F2937", fontWeight: 600 }}>{op.name}</span>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>{op.impacts} impacts</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
      {/* Axis labels */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 2px" }}>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>← LOW PRODUCTIVITY</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>HIGH PRODUCTIVITY →</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* Top row: High Safety */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontSize: 10, color: "#94a3b8", writingMode: "horizontal-tb" as const }}>↑ HIGH SAFETY</span>
          </div>
          <QuadCell label="Safe · Low Productivity"    operators={monSafe}  bg="#eff6ff" border="#bfdbfe" textColor="#1e40af" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ height: 16 }} />
          <QuadCell label="Safe · High Productivity ✓"  operators={safe}    bg="#f0fdf4" border="#86efac" textColor="#166534" />
        </div>
        {/* Bottom row: Low Safety */}
        <div>
          <QuadCell label="Risk Zone ⚠"               operators={riskZone} bg="#fef2f2" border="#fecaca" textColor="#dc2626" />
        </div>
        <div>
          <QuadCell label="Productive · Safety Risk !"  operators={monProd} bg="#fef3c7" border="#fde68a" textColor="#92400e" />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 2px" }}>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>↓ LOW SAFETY</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>Bubble size = impact events</span>
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
        {(["safe", "monitor", "risk"] as RiskLevel[]).map(r => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: RISK_COLOR[r], display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "#64748B", textTransform: "capitalize" as const }}>{r}</span>
          </div>
        ))}
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

export function Variation3Tab() {
  const [issuesOpen, setIssuesOpen] = useState(false);

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

      {/* ══ Row 2: Operator Risk Matrix + Fleet Readiness Intelligence ════
          RTSS + FMS + MEPS — Who is unsafe and which fleet is degrading?    */}
      <div className="grid grid-cols-12 gap-6">
        <SL>RTSS · FMS · MEPS — Operator Safety vs Productivity Intelligence</SL>

        {/* Widget: Operator Risk vs Productivity Quadrant Matrix */}
        <Card className="col-span-12 xl:col-span-8 shadow-none border-[var(--border)] flex flex-col overflow-hidden">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <div className="flex items-start justify-between w-full gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">Operator Risk vs Productivity Matrix</CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                  Operator positioned by Safety Score (RTSS) × Productivity (FMS). Bubble = impact frequency.
                </CardDescription>
              </div>
              <MTags tags={["RTSS", "FMS", "MEPS"]} />
            </div>
          </CardHeader>
          <CardContent style={{ padding: "20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
            <OperatorQuadrantMatrix />
          </CardContent>
          <FI
            insight="2 operators in Risk Zone — Rajesh K. and James W. show high impacts with low safety scores"
            sub="Safety Score × Productivity Score × Impact Events — RTSS + FMS correlation"
          />
        </Card>

        {/* Widget: Fleet Readiness Intelligence */}
        <Card className="col-span-12 xl:col-span-4 shadow-none border-[var(--border)] flex flex-col overflow-hidden">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <div className="flex items-start justify-between w-full gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">Fleet Readiness Intelligence</CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">Utilization + Health + Compliance per OEM type</CardDescription>
              </div>
              <MTags tags={["FMS", "MEPS", "IMDS"]} />
            </div>
          </CardHeader>
          <CardContent style={{ padding: "12px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {FLEET_READINESS.map((f, i) => (
              <div key={f.type} style={{ padding: "10px 0", borderBottom: i < FLEET_READINESS.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>{f.type}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {f.warrantyRisk && <Badge variant="destructive" style={{ fontSize: 9, padding: "1px 5px" }}>Expiry</Badge>}
                    <span style={{ fontSize: 14, fontWeight: 700, color: readinessColor(f.readiness) }}>{f.readiness}%</span>
                  </div>
                </div>
                <Progress value={f.readiness} className="h-1.5" />
                <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
                  <span style={{ fontSize: 10, color: "#64748B" }}>{f.count} MHEs</span>
                  <span style={{ fontSize: 10, color: "#64748B" }}>Util: <strong>{f.utilization}%</strong></span>
                  {f.redFindings > 0 && <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 600 }}>{f.redFindings} Red</span>}
                  {f.amberFindings > 0 && <span style={{ fontSize: 10, color: "#f59e0b", fontWeight: 600 }}>{f.amberFindings} Amber</span>}
                </div>
              </div>
            ))}
          </CardContent>
          <FI
            insight="Order Picker readiness at 30% — expired warranty, lowest utilization, active findings"
            sub="Fleet Readiness = Utilization × Inspection Health × Compliance — FMS + MEPS + IMDS"
          />
        </Card>
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

              {/* Y-axis labels — space-around aligns with bars */}
              <div style={{ width: 56, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                {INSP_IMPACT_CORR.map(row => (
                  <div key={row.mheId} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#64748b", lineHeight: 1 }}>{row.mheId}</span>
                  </div>
                ))}
              </div>

              {/* Grid lines + bar groups */}
              <div style={{ flex: 1, position: "relative" }}>
                {/* Vertical grid lines */}
                {[0, 25, 50, 75, 100].map(pct => (
                  <div key={pct} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 1, background: "#f1f5f9", zIndex: 0 }} />
                ))}
                {/* Bar groups — space-around gives ~40px gap between groups */}
                <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", position: "relative", zIndex: 1 }}>
                  {INSP_IMPACT_CORR.map(row => (
                    <div key={row.mheId} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ height: 8, borderRadius: "0 3px 3px 0", background: "#f59e0b", width: `${(row.repeatedFindings / 8) * 100}%` }} />
                      <div style={{ height: 8, borderRadius: "0 3px 3px 0", background: "#ef4444", width: `${(row.impactEvents / 8) * 100}%` }} />
                    </div>
                  ))}
                </div>
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

      {/* ══ Row 5: Operational Loss Attribution ══════════════════════════
          What is costing the warehouse time? ALL modules cross-referenced.  */}
      <div className="grid grid-cols-12 gap-6">
        <SL>ALL MODULES — Operational Loss Attribution Intelligence</SL>

        <Card className="col-span-12 shadow-none border-[var(--border)] overflow-hidden">
          <CardHeader style={{ padding: "14px 24px 12px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <CardTitle style={{ fontSize: 13, fontWeight: 600 }}>Operational Loss Attribution</CardTitle>
                <CardDescription style={{ fontSize: 12 }}>
                  Where is the warehouse losing productive hours? Traced across FMS · RTSS · MEPS systems.
                </CardDescription>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <MTags tags={["FMS", "RTSS", "MEPS"]} />
                <div style={{ textAlign: "right" as const }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#ef4444", lineHeight: 1 }}>{TOTAL_LOSS_HOURS}h</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>total lost / week</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {OPERATIONAL_LOSS.map(loss => (
              <div key={loss.cause} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Cause + module */}
                <div style={{ width: 220, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>{loss.cause}</span>
                  <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
                    {loss.module.split(" + ").map(m => (
                      <span key={m} style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
                        background: m === "RTSS" ? "#fef2f2" : m === "MEPS" ? "#fef3c7" : "#eff6ff",
                        color: m === "RTSS" ? "#dc2626" : m === "MEPS" ? "#92400e" : "#1e40af",
                      }}>{m}</span>
                    ))}
                  </div>
                </div>
                {/* Bar */}
                <div style={{ flex: 1, position: "relative" as const, height: 28, background: "#f8fafc", borderRadius: 6, overflow: "hidden" as const, border: "1px solid var(--border)" }}>
                  <div style={{ width: `${loss.pct}%`, height: "100%", background: loss.color, opacity: 0.85, borderRadius: 6, transition: "width 0.3s ease", display: "flex", alignItems: "center", paddingLeft: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{loss.hours}h</span>
                  </div>
                </div>
                {/* Pct */}
                <div style={{ width: 44, textAlign: "right" as const, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: loss.color }}>{loss.pct}%</span>
                </div>
              </div>
            ))}
          </CardContent>
          <FI
            insight="Congestion + Idle-with-Load account for 62% of all operational loss — highest impact reduction opportunity"
            sub="FMS task data · RTSS zone intelligence · MEPS downtime correlation — Total 52.5h lost / week"
          />
        </Card>
      </div>

      <CriticalIssuesModal isOpen={issuesOpen} onClose={() => setIssuesOpen(false)} />
    </div>
  );
}
