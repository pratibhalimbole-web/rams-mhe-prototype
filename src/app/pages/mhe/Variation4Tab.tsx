/**
 * Universal Warehouse Operations Dashboard — Variation 4
 * Centralized executive control tower: FMS · MEPS · RTSS · IMDS
 * "How healthy, deployable, safe, productive, and compliant is the warehouse right now?"
 */
import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, LineChart, Line, ScatterChart, Scatter, ZAxis,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip as ReTooltip, ReferenceLine,
} from "recharts";
import {
  AlertTriangle, ShieldCheck, Zap, Activity, Truck, Users,
  Clock, ChevronRight, TrendingDown, TrendingUp, Minus,
  Shield, BarChart2, AlertCircle, CheckCircle, XCircle,
  Gauge, Eye, RefreshCw,
} from "lucide-react";

// ─── Design tokens (exact match to Variation 3) ───────────────────────────────
const FF = "Inter, sans-serif";
const CARD: React.CSSProperties = {
  background: "#ffffff", border: "1px solid #e2e8f0",
  borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden",
};
const HDR_BORDER = "1px solid #e2e8f0";
const DIV_LIGHT  = "1px solid #f1f5f9";
const hoverIn  = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.background = "#f8fafc"; };
const hoverOut = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.background = "transparent"; };

// ─── Section Label — same as V3 SL ───────────────────────────────────────────
function SL({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-12" style={{ marginTop: 4, marginBottom: -8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", whiteSpace: "nowrap" }}>
          {children}
        </span>
        <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
      </div>
    </div>
  );
}

// ─── Card Footer — same 59.5px spec as V3 ────────────────────────────────────
function CF({ insight, modules }: { insight: string; modules: string }) {
  return (
    <div style={{ borderTop: DIV_LIGHT, padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box", overflow: "hidden" }}>
      <p style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "#0f172a", margin: "0 0 2px", lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{insight}</p>
      <p style={{ fontFamily: FF, fontSize: 11, fontWeight: 400, color: "#1b59f8", margin: 0, lineHeight: "16.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{modules}</p>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// 30-day pillar trend — safety declining, efficiency stable, compliance improving
const TREND_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  safety:     +(Math.max(56, 78 - i * 0.52 + Math.sin(i * 0.9) * 2.8)).toFixed(1),
  efficiency: +(68 + Math.sin(i * 0.42) * 4.5 + Math.cos(i * 0.65) * 2).toFixed(1),
  compliance: +(Math.min(84, 66 + i * 0.38 + Math.sin(i * 0.55) * 1.8)).toFixed(1),
}));

const SAFETY_SPARK     = [78,75,74,72,71,69,68,67,66,65,64].map((v, i) => ({ v }));
const EFFICIENCY_SPARK = [70,72,69,71,73,70,72,68,71,72,71].map((v, i) => ({ v }));
const COMPLIANCE_SPARK = [68,69,70,71,72,73,74,75,76,77,78].map((v, i) => ({ v }));

const LIVE_EVENTS = [
  { id: "E1",  type: "NEAR-MISS",       severity: "critical", zone: "Storage B", operator: "OP-014", mhe: "MHE-025", time: "2m ago",  context: "0.4m clearance breach" },
  { id: "E2",  type: "IMPACT",          severity: "critical", zone: "Loading",   operator: "OP-007", mhe: "MHE-004", time: "5m ago",  context: "Rack strike, 12 km/h" },
  { id: "E3",  type: "SPEED VIOLATION", severity: "high",     zone: "Picking",   operator: "OP-022", mhe: "MHE-007", time: "8m ago",  context: "19 km/h in 12 km/h zone" },
  { id: "E4",  type: "HARSH-BRAKE",     severity: "high",     zone: "Storage B", operator: "OP-031", mhe: "MHE-011", time: "11m ago", context: "Emergency stop detected" },
  { id: "E5",  type: "FATIGUE ALERT",   severity: "high",     zone: "All Zones", operator: "OP-019", mhe: "MHE-019", time: "14m ago", context: "6h continuous operation" },
  { id: "E6",  type: "RED INSPECTION",  severity: "critical", zone: "Maint.",    operator: "—",      mhe: "MHE-003", time: "18m ago", context: "Brake failure finding open" },
  { id: "E7",  type: "SPEED VIOLATION", severity: "high",     zone: "Storage A", operator: "OP-008", mhe: "MHE-009", time: "22m ago", context: "17 km/h in 10 km/h zone" },
  { id: "E8",  type: "NEAR-MISS",       severity: "critical", zone: "Receiving", operator: "OP-003", mhe: "MHE-031", time: "28m ago", context: "Pedestrian zone crossed" },
];

const EVENT_CHIP: Record<string, { bg: string; color: string; border: string }> = {
  critical: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  high:     { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
  medium:   { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
};

const FLEET_SEGMENTS = [
  { label: "Available",       pct: 77.6, count: 59, color: "#475569" },
  { label: "Maintenance",     pct: 9.2,  count: 7,  color: "#94a3b8" },
  { label: "Service Due",     pct: 6.6,  count: 5,  color: "#cbd5e1" },
  { label: "RED Inspection",  pct: 6.6,  count: 5,  color: "#fca5a5" },
];
const OPERATOR_SEGMENTS = [
  { label: "Available",        pct: 69.0, count: 29, color: "#475569" },
  { label: "License Expired",  pct: 11.9, count: 5,  color: "#fca5a5" },
  { label: "On Break",         pct: 11.9, count: 5,  color: "#cbd5e1" },
  { label: "Fatigue Threshold",pct: 7.1,  count: 3,  color: "#fde68a" },
];
const PRODUCTIVE_SEGMENTS = [
  { label: "Productive Loaded", pct: 54.2, count: 32, color: "#475569" },
  { label: "Deadhead",          pct: 20.3, count: 12, color: "#94a3b8" },
  { label: "Idle w/ Load",      pct: 15.3, count: 9,  color: "#cbd5e1" },
  { label: "Idle Empty",        pct: 10.2, count: 6,  color: "#e2e8f0" },
];

const QUADRANT_DATA = [
  { name: "OP-017", x: 88, y: 82, z: 90, incidents: 0 },
  { name: "OP-022", x: 84, y: 79, z: 68, incidents: 1 },
  { name: "OP-031", x: 76, y: 73, z: 72, incidents: 1 },
  { name: "OP-009", x: 91, y: 44, z: 85, incidents: 3 },
  { name: "OP-008", x: 65, y: 31, z: 72, incidents: 5 },
  { name: "OP-014", x: 82, y: 52, z: 75, incidents: 2 },
  { name: "OP-003", x: 42, y: 68, z: 38, incidents: 1 },
  { name: "OP-007", x: 34, y: 74, z: 42, incidents: 0 },
  { name: "OP-019", x: 28, y: 36, z: 56, incidents: 4 },
  { name: "OP-011", x: 55, y: 58, z: 61, incidents: 2 },
];

const NOTIFICATIONS = [
  { id: "N1", category: "RED Finding",      title: "MHE-004 brake failure open 72h — operational breach",             time: "3 days",  severity: "critical", icon: XCircle   },
  { id: "N2", category: "Warranty",         title: "MHE-009 warranty expires in 4 days — service not scheduled",      time: "4d left", severity: "high",     icon: AlertCircle },
  { id: "N3", category: "Fatigue",          title: "OP-019 exceeded 6h continuous operation threshold",               time: "14m ago", severity: "high",     icon: AlertTriangle },
  { id: "N4", category: "Speed Cluster",    title: "4 speed violations in Storage A — same zone, same shift",         time: "1h ago",  severity: "high",     icon: AlertTriangle },
  { id: "N5", category: "License Expired",  title: "OP-023 and OP-031 licenses expired — restricted from operation",  time: "Today",   severity: "critical", icon: XCircle   },
  { id: "N6", category: "Service Due",      title: "MHE-003, MHE-014 service overdue by 3+ days",                    time: "3d ago",  severity: "high",     icon: AlertCircle },
  { id: "N7", category: "Compliance",       title: "MEPS inspection completion dropped to 61% this week",             time: "This wk", severity: "medium",   icon: AlertCircle },
  { id: "N8", category: "RED Finding",      title: "MHE-031 mast misalignment finding unresolved — 2nd occurrence",   time: "6h ago",  severity: "high",     icon: AlertCircle },
];

const EQUIP_ROLLCALL = [
  { id: "MHE-001", type: "Electric Forklift", util: 84, incidents: 0, redFindings: 0, score: 91, band: "green"  },
  { id: "MHE-007", type: "Reach Truck",       util: 76, incidents: 2, redFindings: 0, score: 72, band: "amber"  },
  { id: "MHE-022", type: "Pallet Jack",       util: 69, incidents: 3, redFindings: 1, score: 58, band: "amber"  },
  { id: "MHE-004", type: "Order Picker",      util: 61, incidents: 5, redFindings: 1, score: 44, band: "red"    },
  { id: "MHE-025", type: "Pallet Jack",       util: 52, incidents: 7, redFindings: 0, score: 38, band: "red"    },
];

const OPR_ROLLCALL = [
  { id: "OP-022", name: "Priya Iyer",       util: 84, incidents: 0, safetyRating: 91, score: 88, exp: 5, trend: "up",   fatigue: false },
  { id: "OP-031", name: "Rahul Patil",      util: 76, incidents: 1, safetyRating: 79, score: 75, exp: 4, trend: "flat", fatigue: false },
  { id: "OP-014", name: "Amit Sharma",      util: 72, incidents: 2, safetyRating: 73, score: 68, exp: 3, trend: "down", fatigue: false },
  { id: "OP-007", name: "Karan Jadhav",     util: 61, incidents: 0, safetyRating: 78, score: 74, exp: 2, trend: "down", fatigue: false },
  { id: "OP-019", name: "Vivek Deshmukh",   util: 48, incidents: 4, safetyRating: 42, score: 35, exp: 1, trend: "down", fatigue: true  },
];

// ─── Score Band Helpers ───────────────────────────────────────────────────────
function scoreBandStyle(band: string) {
  if (band === "green")  return { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" };
  if (band === "amber")  return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
  return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
}
function scoreToBand(score: number) {
  return score >= 80 ? "green" : score >= 60 ? "amber" : "red";
}

// ─── Radial Score Ring ────────────────────────────────────────────────────────
function RadialScore({ value, max = 100, size = 148, stroke = 10 }: { value: number; max?: number; size?: number; stroke?: number }) {
  const r   = (size - stroke * 2) / 2;
  const cx  = size / 2;
  const C   = 2 * Math.PI * r;
  const pct = value / max;
  const dash    = C * pct;
  const gapDash = C * (1 - pct);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {/* Track */}
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {/* Progress */}
      <circle
        cx={cx} cy={cx} r={r} fill="none"
        stroke="#1b59f8" strokeWidth={stroke}
        strokeDasharray={`${dash} ${gapDash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      {/* Centre label */}
      <text x={cx} y={cx - 8} textAnchor="middle" style={{ fontFamily: FF, fontSize: 30, fontWeight: 700, fill: "#0f172a" }}>{value}</text>
      <text x={cx} y={cx + 12} textAnchor="middle" style={{ fontFamily: FF, fontSize: 10, fill: "#94a3b8" }}>/ {max}</text>
      <text x={cx} y={cx + 26} textAnchor="middle" style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, fill: "#64748b", letterSpacing: "0.06em" }}>HEALTH SCORE</text>
    </svg>
  );
}

// ─── Mini Sparkline ───────────────────────────────────────────────────────────
function Spark({ data, color }: { data: { v: number }[]; color: string }) {
  return (
    <div style={{ width: 72, height: 30, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
            fill={`url(#sg-${color.replace("#","")})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Pillar Card ──────────────────────────────────────────────────────────────
function PillarCard({
  title, value, trend, spark, sparkColor, sources, insight, tooltipItems,
}: {
  title: string; value: number; trend: number;
  spark: { v: number }[]; sparkColor: string;
  sources: string; insight: string;
  tooltipItems: string[];
}) {
  const [tip, setTip] = useState(false);
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? "#16a34a" : trend < 0 ? "#dc2626" : "#94a3b8";
  return (
    <div style={{ ...CARD, flex: 1, position: "relative" }}>
      {/* Tooltip */}
      {tip && (
        <div style={{
          position: "absolute", top: 8, right: 8, zIndex: 10,
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
          padding: "10px 13px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          minWidth: 180, fontFamily: FF,
        }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 7px" }}>Factors</p>
          {tooltipItems.map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: sparkColor, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#475569" }}>{t}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ padding: "16px 16px 12px", borderBottom: HDR_BORDER, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{title}</span>
          <button onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#cbd5e1", display: "flex" }}>
            <Eye size={13} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: FF, fontSize: 32, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{value}</span>
              <span style={{ fontFamily: FF, fontSize: 12, color: "#94a3b8" }}>/ 100</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
              <TrendIcon size={11} color={trendColor} />
              <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 600, color: trendColor }}>{trend > 0 ? "+" : ""}{trend.toFixed(1)}</span>
              <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8" }}>vs last week</span>
            </div>
          </div>
          <Spark data={spark} color={sparkColor} />
        </div>
      </div>
      <CF insight={insight} modules={sources} />
    </div>
  );
}

// ─── Three Pillar Trend Tooltip ───────────────────────────────────────────────
function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const items = [
    { key: "safety",     label: "Safety",     color: "#ef4444" },
    { key: "efficiency", label: "Efficiency", color: "#1b59f8" },
    { key: "compliance", label: "Compliance", color: "#7c3aed" },
  ];
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 14px rgba(0,0,0,0.10)", minWidth: 160, fontFamily: FF }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: "#64748b", margin: "0 0 7px" }}>Day {label}</p>
      {items.map(({ key, label: l, color }) => {
        const entry = payload.find((p: any) => p.dataKey === key);
        return entry ? (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
              <span style={{ fontSize: 10, color: "#64748b" }}>{l}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>{entry.value}</span>
          </div>
        ) : null;
      })}
    </div>
  );
}

// ─── Segment Bar ─────────────────────────────────────────────────────────────
function SegmentBar({ segments }: { segments: { label: string; pct: number; count: number; color: string }[] }) {
  return (
    <div>
      <div style={{ display: "flex", height: 7, borderRadius: 4, overflow: "hidden", gap: 1.5 }}>
        {segments.map(s => (
          <div key={s.label} style={{ width: `${s.pct}%`, background: s.color, borderRadius: 2 }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 9 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontFamily: FF, fontSize: 9, color: "#64748b" }}>{s.label}</span>
            <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#475569" }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quadrant Tooltip ─────────────────────────────────────────────────────────
function QuadrantTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 13px", boxShadow: "0 4px 14px rgba(0,0,0,0.10)", minWidth: 160, fontFamily: FF }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", margin: "0 0 7px" }}>{d.name}</p>
      {[
        ["Productivity", `${d.x}%`],
        ["Safety Score", `${d.y}`],
        ["Utilization",  `${d.z}%`],
        ["Incidents",    `${d.incidents}`],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 3 }}>
          <span style={{ fontSize: 10, color: "#64748b" }}>{k}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#0f172a" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Widget: Three Pillars Trend ──────────────────────────────────────────────
function ThreePillarTrendWidget() {
  return (
    <div style={{ ...CARD, flex: 1 }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: HDR_BORDER, flexShrink: 0 }}>
        <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>The Three Pillars · 30-Day Trend</p>
        <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Operational balance between safety, efficiency, and compliance</p>
      </div>
      <div style={{ flex: 1, minHeight: 0, padding: "16px 12px 8px 4px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={TREND_30D} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontFamily: FF, fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={4} dy={5} />
            <YAxis domain={[50, 90]} ticks={[50,60,70,80,90]} tick={{ fontFamily: FF, fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} dx={-4} />
            <ReTooltip content={<TrendTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
            <Line type="monotone" dataKey="safety"     stroke="#ef4444" strokeWidth={1.8} dot={false} name="Safety" />
            <Line type="monotone" dataKey="efficiency" stroke="#1b59f8" strokeWidth={1.8} dot={false} name="Efficiency" />
            <Line type="monotone" dataKey="compliance" stroke="#7c3aed" strokeWidth={1.8} dot={false} strokeDasharray="4 2" name="Compliance" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, padding: "6px 20px 10px", flexShrink: 0, flexWrap: "wrap" }}>
        {[["Safety","#ef4444"],["Efficiency","#1b59f8"],["Compliance","#7c3aed"]].map(([l,c]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: FF, fontSize: 11, color: "#64748b" }}>
            <span style={{ width: 20, height: 2, background: c, display: "inline-block", borderRadius: 1 }} />{l}
          </span>
        ))}
      </div>
      <CF insight="Safety is sliding while compliance climbs — investigate operational imbalance before risk increases." modules="RTSS · MEPS · FMS · IMDS" />
    </div>
  );
}

// ─── Widget: Critical Issues Strip ───────────────────────────────────────────
function CriticalIssuesStrip() {
  const items = [
    { label: "RED Findings",     count: 5, color: "#dc2626" },
    { label: "Licenses Expired", count: 2, color: "#dc2626" },
    { label: "Service Due",      count: 3, color: "#d97706" },
    { label: "Open High-Sev",    count: 2, color: "#d97706" },
  ];
  return (
    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <AlertTriangle size={15} color="#dc2626" />
        <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#dc2626", letterSpacing: "0.02em" }}>CRITICAL ISSUES</span>
        <span style={{ fontFamily: FF, fontSize: 18, fontWeight: 700, color: "#dc2626", lineHeight: 1 }}>12</span>
      </div>
      <div style={{ width: 1, height: 28, background: "#fecaca", flexShrink: 0 }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
        {items.map(item => (
          <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 6, background: "#fff", border: "1px solid #fecaca", fontFamily: FF, fontSize: 10, fontWeight: 500, color: item.color }}>
            <span style={{ fontWeight: 700 }}>{item.count}</span> {item.label}
          </span>
        ))}
      </div>
      <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 14px", borderRadius: 8, background: "#dc2626", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0, transition: "opacity 0.12s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
        Triage <ChevronRight size={12} />
      </button>
    </div>
  );
}

// ─── Widget: Live Event Wire ──────────────────────────────────────────────────
function LiveEventWire() {
  const trackRef = useRef<HTMLDivElement>(null);
  return (
    <div style={{ ...CARD }}>
      <div style={{ padding: "12px 18px 10px", borderBottom: HDR_BORDER, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Live Event Wire</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", border: "1px solid #fecaca", fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#dc2626" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />LIVE
            </span>
          </div>
          <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8" }}>Real-time event stream — RTSS · MEPS · FMS</span>
        </div>
        <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8" }}>{LIVE_EVENTS.length} events</span>
      </div>

      {/* Scrollable event track */}
      <div style={{ overflowX: "auto", overflowY: "hidden", padding: "12px 18px 14px", scrollbarWidth: "none" } as React.CSSProperties}>
        <div style={{ display: "flex", gap: 10, width: "max-content" }}>
          {LIVE_EVENTS.map(ev => {
            const chip = EVENT_CHIP[ev.severity];
            return (
              <div key={ev.id} style={{
                background: "#fff", border: "1px solid #f1f5f9", borderRadius: 10,
                padding: "10px 13px", minWidth: 210, flexShrink: 0,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                {/* Type chip + time */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: FF, fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: chip.bg, color: chip.color, border: `1px solid ${chip.border}`, letterSpacing: "0.04em" }}>
                    {ev.type}
                  </span>
                  <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8" }}>{ev.time}</span>
                </div>
                {/* Context */}
                <p style={{ fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#0f172a", margin: "0 0 5px", lineHeight: "14px" }}>{ev.context}</p>
                {/* Meta */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                  {[ev.zone, ev.mhe, ev.operator].filter(v => v && v !== "—").map(v => (
                    <span key={v} style={{ fontFamily: FF, fontSize: 8, color: "#94a3b8", background: "#f8fafc", padding: "1px 5px", borderRadius: 3 }}>{v}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Widget: Capacity Card ────────────────────────────────────────────────────
function CapacityCard({
  title, subtitle, available, total, segments, insight, modules,
}: {
  title: string; subtitle: string; available: number; total: number;
  segments: typeof FLEET_SEGMENTS; insight: string; modules: string;
}) {
  return (
    <div style={{ ...CARD, flex: 1 }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: HDR_BORDER, flexShrink: 0 }}>
        <p style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>{title}</p>
        <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>{subtitle}</p>
      </div>
      <div style={{ flex: 1, padding: "16px 16px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Main count */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: FF, fontSize: 34, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{available}</span>
          <span style={{ fontFamily: FF, fontSize: 14, color: "#94a3b8" }}>/ {total}</span>
          <span style={{ fontFamily: FF, fontSize: 10, color: "#64748b", marginLeft: 2 }}>available</span>
        </div>
        {/* Availability % */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", letterSpacing: "0.06em" }}>EFFECTIVE AVAILABILITY</span>
            <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: "#475569" }}>{Math.round(available / total * 100)}%</span>
          </div>
          <SegmentBar segments={segments} />
        </div>
      </div>
      <CF insight={insight} modules={modules} />
    </div>
  );
}

// ─── Widget: Operator Quadrant ────────────────────────────────────────────────
function OperatorQuadrantWidget() {
  return (
    <div style={{ ...CARD, flex: 1 }}>
      <div style={{ padding: "16px 18px 12px", borderBottom: HDR_BORDER, flexShrink: 0 }}>
        <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Operator Quadrant · Risk × Performance</p>
        <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>X = productivity · Y = safety score · bubble size = utilization</p>
      </div>
      <div style={{ flex: 1, minHeight: 0, padding: "12px 8px 4px 4px", position: "relative" }}>
        {/* Quadrant labels */}
        {[
          { label: "STAR",     top: "8%",  left: "56%",  color: "#16a34a" },
          { label: "RECKLESS", top: "68%", left: "56%",  color: "#dc2626" },
          { label: "COACH",    top: "8%",  left: "4%",   color: "#2563eb" },
          { label: "RETRAIN",  top: "68%", left: "4%",   color: "#d97706" },
        ].map(q => (
          <span key={q.label} style={{ position: "absolute", fontFamily: FF, fontSize: 8, fontWeight: 700, color: q.color, letterSpacing: "0.08em", top: q.top, left: q.left, opacity: 0.55, zIndex: 1, pointerEvents: "none" }}>
            {q.label}
          </span>
        ))}
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="" stroke="#f1f5f9" />
            <XAxis type="number" dataKey="x" domain={[0, 100]} name="Productivity"
              tick={{ fontFamily: FF, fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false}
              label={{ value: "Productivity →", position: "insideBottom", offset: -2, style: { fontFamily: FF, fontSize: 8, fill: "#94a3b8" } }} />
            <YAxis type="number" dataKey="y" domain={[0, 100]} name="Safety"
              tick={{ fontFamily: FF, fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false}
              label={{ value: "Safety →", angle: -90, position: "insideLeft", style: { fontFamily: FF, fontSize: 8, fill: "#94a3b8" } }} />
            <ZAxis type="number" dataKey="z" range={[40, 260]} />
            <ReferenceLine x={50} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
            <ReferenceLine y={50} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
            <ReTooltip content={<QuadrantTooltip />} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={QUADRANT_DATA} fill="#1b59f8" fillOpacity={0.65} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <CF insight="High productivity with low safety requires intervention before escalation." modules="RTSS · FMS · MEPS" />
    </div>
  );
}

// ─── Widget: Notifications ────────────────────────────────────────────────────
function NotificationsWidget() {
  const SMAP: Record<string, { bg: string; color: string; border: string }> = {
    critical: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
    high:     { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
    medium:   { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
  };
  return (
    <div style={{ ...CARD, flex: 1 }}>
      <div style={{ padding: "16px 18px 12px", borderBottom: HDR_BORDER, flexShrink: 0 }}>
        <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Notifications</p>
        <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Operators · License · Warranty · RED Findings</p>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" } as React.CSSProperties}>
        {NOTIFICATIONS.map((n, i, arr) => {
          const s = SMAP[n.severity];
          const Icon = n.icon;
          return (
            <div key={n.id}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 18px", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                <Icon size={13} color={s.color} style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontFamily: FF, fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{n.category}</span>
                    <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8" }}>{n.time}</span>
                  </div>
                  <p style={{ fontFamily: FF, fontSize: 10, color: "#0f172a", margin: 0, lineHeight: "14px", fontWeight: 500 }}>{n.title}</p>
                </div>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: "#f1f5f9", margin: "0 18px" }} />}
            </div>
          );
        })}
      </div>
      <CF insight="5 critical items require action today — RED findings and expired licenses." modules="MEPS · IMDS · RTSS" />
    </div>
  );
}

// ─── Widget: Equipment Roll-Call ──────────────────────────────────────────────
function EquipmentRollCallWidget() {
  return (
    <div style={{ ...CARD, flex: 1 }}>
      <div style={{ padding: "14px 18px 10px", borderBottom: HDR_BORDER, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Equipment Roll-Call</p>
          <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Weighted score from incidents, RED findings, idle time, downtime</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#1b59f8", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          View All <ChevronRight size={11} />
        </button>
      </div>
      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 64px 80px 80px", padding: "7px 18px", borderBottom: "1px solid #f1f5f9", gap: 8 }}>
        {["MHE", "Util.", "Incidents", "RED Find.", "Score"].map(h => (
          <span key={h} style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</span>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" } as React.CSSProperties}>
        {EQUIP_ROLLCALL.map((row, i, arr) => {
          const bs = scoreBandStyle(row.band);
          return (
            <div key={row.id}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 64px 80px 80px", padding: "10px 18px", gap: 8, alignItems: "center", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                <div>
                  <p style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "#0f172a", margin: "0 0 1px" }}>{row.id}</p>
                  <p style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", margin: 0 }}>{row.type}</p>
                </div>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "#475569" }}>{row.util}%</span>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: row.incidents > 3 ? "#dc2626" : "#475569" }}>{row.incidents}</span>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: row.redFindings > 0 ? "#dc2626" : "#94a3b8" }}>{row.redFindings}</span>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: bs.bg, color: bs.color, border: `1px solid ${bs.border}`, textAlign: "center", display: "inline-block" }}>{row.score}</span>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: "#f1f5f9", margin: "0 18px" }} />}
            </div>
          );
        })}
      </div>
      <CF insight="3 units require operational review due to repeated RED findings and low scores." modules="MEPS · RTSS · FMS" />
    </div>
  );
}

// ─── Widget: Operator Roll-Call ───────────────────────────────────────────────
function OperatorRollCallWidget() {
  return (
    <div style={{ ...CARD, flex: 1 }}>
      <div style={{ padding: "14px 18px 10px", borderBottom: HDR_BORDER, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Operator Roll-Call</p>
          <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Weighted from fatigue, incidents, productivity, safety, compliance</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#1b59f8", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          View All <ChevronRight size={11} />
        </button>
      </div>
      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 64px 72px 80px 80px", padding: "7px 18px", borderBottom: "1px solid #f1f5f9", gap: 8 }}>
        {["Operator", "Util.", "Incidents", "Safety", "Score"].map(h => (
          <span key={h} style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</span>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" } as React.CSSProperties}>
        {OPR_ROLLCALL.map((row, i, arr) => {
          const band = scoreToBand(row.score);
          const bs   = scoreBandStyle(band);
          const TI   = row.trend === "up" ? TrendingUp : row.trend === "down" ? TrendingDown : Minus;
          const tc   = row.trend === "up" ? "#16a34a" : row.trend === "down" ? "#dc2626" : "#94a3b8";
          return (
            <div key={row.id}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 64px 72px 80px 80px", padding: "10px 18px", gap: 8, alignItems: "center", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <p style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "#0f172a", margin: 0 }}>{row.name}</p>
                    {row.fatigue && (
                      <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>FATIGUE</span>
                    )}
                  </div>
                  <p style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", margin: "1px 0 0" }}>{row.id} · {row.exp}yr exp</p>
                </div>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "#475569" }}>{row.util}%</span>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: row.incidents > 2 ? "#dc2626" : "#475569" }}>{row.incidents}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <TI size={10} color={tc} />
                  <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "#475569" }}>{row.safetyRating}</span>
                </div>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: bs.bg, color: bs.color, border: `1px solid ${bs.border}`, textAlign: "center", display: "inline-block" }}>{row.score}</span>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: "#f1f5f9", margin: "0 18px" }} />}
            </div>
          );
        })}
      </div>
      <CF insight="2 operators crossed fatigue threshold during consecutive shifts — review scheduling." modules="RTSS · IMDS · FMS" />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function Variation4Tab() {
  return (
    <div className="space-y-6 p-8">

      {/* ── Dashboard header ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: -4 }}>
        <div>
          <h1 style={{ fontFamily: FF, fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 4px", lineHeight: "24px" }}>Warehouse Performance</h1>
          <p style={{ fontFamily: FF, fontSize: 11, color: "#94a3b8", margin: 0, maxWidth: 560, lineHeight: "17px" }}>
            Real-time operational intelligence across fleet, operators, inspections, safety, maintenance, and deployment readiness.
          </p>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#16a34a", flexShrink: 0, marginTop: 2 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} /> Live
        </span>
      </div>

      {/* ══ SECTION 1 — Operational Health ══════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Operational Health — FMS · MEPS · RTSS · IMDS</SL>

        {/* Widget 1: Composite score */}
        <div className="col-span-12 xl:col-span-3">
          <div style={{ ...CARD, flex: 1, height: "100%" }}>
            <div style={{ padding: "16px 18px 12px", borderBottom: HDR_BORDER, flexShrink: 0 }}>
              <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Operational Health</p>
              <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Weighted blend — safety · efficiency · compliance · maintenance · readiness</p>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px 8px" }}>
              <RadialScore value={71} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", marginTop: 16, width: "100%" }}>
                {[
                  { label: "Safety",     val: 64, color: "#ef4444" },
                  { label: "Efficiency", val: 71, color: "#1b59f8" },
                  { label: "Compliance", val: 78, color: "#7c3aed" },
                  { label: "Readiness",  val: 71, color: "#475569" },
                ].map(p => (
                  <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: FF, fontSize: 9, color: "#64748b" }}>{p.label}</span>
                    <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, color: "#475569", marginLeft: "auto" }}>{p.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <CF insight="Warehouse stable but safety degradation affecting overall balance." modules="FMS · MEPS · RTSS · IMDS" />
          </div>
        </div>

        {/* Widget 2: Safety */}
        <div className="col-span-12 md:col-span-4 xl:col-span-3 flex">
          <PillarCard
            title="Safety"
            value={64}
            trend={-5.4}
            spark={SAFETY_SPARK}
            sparkColor="#ef4444"
            sources="RTSS · MEPS"
            insight="Safety score declining due to repeated impact and inspection events."
            tooltipItems={["RED findings open", "Impact events", "Near misses", "Unsafe operator behaviour", "Fatigue events"]}
          />
        </div>

        {/* Widget 3: Efficiency */}
        <div className="col-span-12 md:col-span-4 xl:col-span-3 flex">
          <PillarCard
            title="Efficiency"
            value={71}
            trend={-1.2}
            spark={EFFICIENCY_SPARK}
            sparkColor="#1b59f8"
            sources="FMS · RTSS"
            insight="Efficiency stable, but deadhead movement remains high across zones."
            tooltipItems={["Idle with load", "Deadhead trips", "Congestion delays", "Trip productivity", "Zone bottlenecks"]}
          />
        </div>

        {/* Widget 4: Compliance */}
        <div className="col-span-12 md:col-span-4 xl:col-span-3 flex">
          <PillarCard
            title="Compliance"
            value={78}
            trend={+0.4}
            spark={COMPLIANCE_SPARK}
            sparkColor="#7c3aed"
            sources="MEPS · IMDS"
            insight="Compliance improving due to timely inspection closures this week."
            tooltipItems={["License validity", "Inspection completion", "Service due", "PPE compliance", "Operator compliance"]}
          />
        </div>
      </div>

      {/* ══ SECTION 2 — Three Pillar Trend ══════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Trend Intelligence — 30-Day Operational Balance</SL>
        <div className="col-span-12 flex" style={{ minHeight: 260 }}>
          <ThreePillarTrendWidget />
        </div>
      </div>

      {/* ══ SECTION 3 — Critical Issues Strip ═══════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Critical Issues — Immediate Operational Prioritization</SL>
        <div className="col-span-12">
          <CriticalIssuesStrip />
        </div>
      </div>

      {/* ══ SECTION 4 — Live Event Wire ══════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Live Event Wire — RTSS · MEPS · FMS</SL>
        <div className="col-span-12">
          <LiveEventWire />
        </div>
      </div>

      {/* ══ SECTION 5 — Effective Capacity ══════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Effective Capacity — Deployable Right Now</SL>

        <div className="col-span-12 md:col-span-6 xl:col-span-4 flex">
          <CapacityCard
            title="Fleet · Effective Available"
            subtitle="Operational readiness by fleet status"
            available={59} total={76}
            segments={FLEET_SEGMENTS}
            insight="77% of fleet is active across warehouse zones right now."
            modules="FMS · MEPS"
          />
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-4 flex">
          <CapacityCard
            title="Operators · Effective Available"
            subtitle="Deployable workforce by availability status"
            available={29} total={42}
            segments={OPERATOR_SEGMENTS}
            insight="Fatigue and expired licenses reduced deployable workforce by 31%."
            modules="IMDS · RTSS · FMS"
          />
        </div>

        <div className="col-span-12 xl:col-span-4 flex">
          <CapacityCard
            title="Live Activity · Productive Mix"
            subtitle="Current movement productivity breakdown"
            available={32} total={59}
            segments={PRODUCTIVE_SEGMENTS}
            insight="Deadhead movement increasing across receiving and loading zones."
            modules="FMS · RTSS"
          />
        </div>
      </div>

      {/* ══ SECTION 6 — Risk × Performance ══════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Risk × Performance — Operator Intelligence</SL>

        <div className="col-span-12 xl:col-span-6 flex" style={{ minHeight: 380 }}>
          <OperatorQuadrantWidget />
        </div>

        <div className="col-span-12 xl:col-span-6 flex" style={{ minHeight: 380 }}>
          <NotificationsWidget />
        </div>
      </div>

      {/* ══ SECTION 7 — Roll-Call ════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Roll-Call — Equipment & Operator Reliability Scores</SL>

        <div className="col-span-12 xl:col-span-6 flex" style={{ minHeight: 360 }}>
          <EquipmentRollCallWidget />
        </div>

        <div className="col-span-12 xl:col-span-6 flex" style={{ minHeight: 360 }}>
          <OperatorRollCallWidget />
        </div>
      </div>

    </div>
  );
}
