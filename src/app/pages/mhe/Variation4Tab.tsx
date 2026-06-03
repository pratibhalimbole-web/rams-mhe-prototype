/**
 * Universal Warehouse Operations Dashboard — Variation 4
 * Centralized executive control tower: FMS · MEPS · RTSS · IMDS
 * "How healthy, deployable, safe, productive, and compliant is the warehouse right now?"
 */
import React, { useState, useEffect, useRef } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "../../components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import {
  AreaChart, Area, LineChart, Line, ScatterChart, Scatter, ZAxis,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip as ReTooltip, ReferenceLine, ReferenceArea, Customized,
} from "recharts";
import {
  AlertTriangle, ShieldCheck, Zap, Activity, Truck, Users,
  Clock, ChevronRight, TrendingDown, TrendingUp, Minus,
  Shield, BarChart2, AlertCircle, CheckCircle, XCircle,
  Gauge, Eye, RefreshCw, Package,
} from "lucide-react";

// ─── Filter dropdown style (matches V3) ──────────────────────────────────────
const FILTER_STYLE: React.CSSProperties = {
  height: "28px", width: "auto", background: "#ffffff",
  border: "1px solid #e2e8f0", borderRadius: "6px",
  padding: "0 10px", fontSize: "10px", color: "#0f172a",
  fontFamily: "Inter, sans-serif", fontWeight: 400,
};

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


// ─── Data ─────────────────────────────────────────────────────────────────────

// 30-day pillar trend — safety declining, efficiency stable, compliance improving
const TREND_30D = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 4, 28); // May 28 2026 = today
  d.setDate(d.getDate() - (29 - i));
  const label = `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`;
  return {
    day: label,
    safety:     +(Math.max(56, 78 - i * 0.52 + Math.sin(i * 0.9) * 2.8)).toFixed(1),
    efficiency: +(68 + Math.sin(i * 0.42) * 4.5 + Math.cos(i * 0.65) * 2).toFixed(1),
    compliance: +(Math.min(84, 66 + i * 0.38 + Math.sin(i * 0.55) * 1.8)).toFixed(1),
  };
});

// 7-day pillar trend — day names on X-axis
const TREND_7D = [
  { day: "Mon", safety: 74, efficiency: 70, compliance: 72 },
  { day: "Tue", safety: 71, efficiency: 73, compliance: 74 },
  { day: "Wed", safety: 68, efficiency: 71, compliance: 75 },
  { day: "Thu", safety: 65, efficiency: 74, compliance: 76 },
  { day: "Fri", safety: 63, efficiency: 69, compliance: 77 },
  { day: "Sat", safety: 66, efficiency: 72, compliance: 76 },
  { day: "Sun", safety: 64, efficiency: 71, compliance: 78 },
];

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
  { label: "Available",       pct: 77.6, count: 59, color: "#1b59f8" },
  { label: "Maintenance",     pct: 9.2,  count: 7,  color: "#60a5fa" },
  { label: "Service Due",     pct: 6.6,  count: 5,  color: "#93c5fd" },
  { label: "RED Inspection",  pct: 6.6,  count: 5,  color: "#bfdbfe" },
];
const OPERATOR_SEGMENTS = [
  { label: "Available",        pct: 69.0, count: 29, color: "#1b59f8" },
  { label: "License Expired",  pct: 11.9, count: 5,  color: "#60a5fa" },
  { label: "On Break",         pct: 11.9, count: 5,  color: "#93c5fd" },
  { label: "Fatigue Threshold",pct: 7.1,  count: 3,  color: "#bfdbfe" },
];
const PRODUCTIVE_SEGMENTS = [
  { label: "Productive Loaded", pct: 54.2, count: 32, color: "#1b59f8" },
  { label: "Deadhead",          pct: 20.3, count: 12, color: "#60a5fa" },
  { label: "Idle w/ Load",      pct: 15.3, count: 9,  color: "#93c5fd" },
  { label: "Idle Empty",        pct: 10.2, count: 6,  color: "#bfdbfe" },
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
  {
    id: "N1", category: "OPERATOR", time: "14:08", icon: Users, unread: true, badge: "6",
    title: "Sunil P. · 6 high-sev events today",
    stats: [{ value: "6", label: "High Sev" }, { value: "3", label: "Zones Hit" }, { value: "2", label: "MHEs" }],
    footerLeft: "Top Zone: Aisle B-3", footerRight: "Latest: 14:08",
  },
  {
    id: "N2", category: "LICENSE", time: "08:00", icon: AlertCircle, unread: true, badge: "2",
    title: "License expired · Joe Pillai (JP-003)",
    stats: [{ value: "2", label: "Expired" }, { value: "3", label: "At Risk" }, { value: "5", label: "Total" }],
    footerLeft: "Operator: JP-003", footerRight: "Status: Blocked",
  },
  {
    id: "N3", category: "SERVICE", time: "11:42", icon: RefreshCw, unread: true, badge: "1",
    title: "Service due · MHE-22",
    stats: [{ value: "1", label: "Overdue" }, { value: "4", label: "Due Soon" }, { value: "71k", label: "Cycles" }],
    footerLeft: "Asset: MHE-22", footerRight: "Risk: Breakdown",
  },
  {
    id: "N4", category: "INSPECTION", time: "Yday 16:20", icon: ShieldCheck, unread: true, badge: "3",
    title: "RED finding open >24h · MHE-27",
    stats: [{ value: "3", label: "RED Open" }, { value: "1", label: "Reported" }, { value: "24h", label: "Open" }],
    footerLeft: "System: Hydraulic", footerRight: "By: Imran S.",
  },
  {
    id: "N5", category: "WARRANTY", time: "—", icon: Clock, unread: true, badge: "2",
    title: "Warranty expires <7 days · 2 assets",
    stats: [{ value: "2", label: "Expiring" }, { value: "7", label: "Days Left" }, { value: "0", label: "Renewed" }],
    footerLeft: "MHE-04 · MHE-19", footerRight: "Window Closing",
  },
  {
    id: "N6", category: "INSPECTION", time: "W to date", icon: ShieldCheck, unread: false, badge: "3",
    title: "MHE-27 · most RED findings this week",
    stats: [{ value: "3", label: "RED Found" }, { value: "2", label: "Prev Week" }, { value: "1", label: "Resolved" }],
    footerLeft: "Asset: MHE-27", footerRight: "Action: Reinspect",
  },
];

const EQUIP_ROLLCALL = [
  { id: "MHE-12", type: "Toyota 5T",   util: 88, incidents: 1, redFindings: 0, score: 94, band: "green" },
  { id: "MHE-04", type: "Crown RT",    util: 84, incidents: 2, redFindings: 0, score: 88, band: "green" },
  { id: "MHE-20", type: "Toyota 8FG",  util: 80, incidents: 0, redFindings: 0, score: 92, band: "green" },
  { id: "MHE-19", type: "Hyster",      util: 82, incidents: 0, redFindings: 1, score: 80, band: "green" },
  { id: "MHE-08", type: "Yale GLP",    util: 72, incidents: 2, redFindings: 0, score: 78, band: "amber" },
  { id: "MHE-15", type: "Crown SC",    util: 66, incidents: 1, redFindings: 1, score: 70, band: "amber" },
  { id: "MHE-22", type: "Toyota 3T",   util: 76, incidents: 4, redFindings: 2, score: 62, band: "amber" },
  { id: "MHE-31", type: "Linde H30",   util: 28, incidents: 4, redFindings: 1, score: 42, band: "red"   },
  { id: "MHE-07", type: "Komatsu",     util: 44, incidents: 3, redFindings: 2, score: 48, band: "red"   },
  { id: "MHE-27", type: "Crown PJ",    util: 32, incidents: 2, redFindings: 3, score: 34, band: "red"   },
];

const OPR_ROLLCALL = [
  { id: "VD-014", name: "Vivek Desai",  util: 88, incidents: 0, safetyRating: 94, score: 94, exp: 4, trend: "up",   fatigue: false },
  { id: "GN-007", name: "Geeta Nair",   util: 86, incidents: 1, safetyRating: 90, score: 90, exp: 6, trend: "up",   fatigue: false },
  { id: "AV-021", name: "Asha Varma",   util: 81, incidents: 2, safetyRating: 82, score: 82, exp: 3, trend: "flat", fatigue: false },
  { id: "AK-009", name: "Anil Kumar",   util: 74, incidents: 3, safetyRating: 76, score: 76, exp: 2, trend: "down", fatigue: false },
  { id: "SP-003", name: "Sunil Patil",  util: 61, incidents: 5, safetyRating: 58, score: 58, exp: 2, trend: "down", fatigue: true  },
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

// ─── Semi-circle Gauge ───────────────────────────────────────────────────────
function SemiGauge({ value, max = 100 }: { value: number; max?: number }) {
  const R = 66, cx = 100, cy = 80, W = 200, H = 96, SW = 12;

  const pt = (pct: number) => {
    const a = Math.PI * (1 - pct);
    return { x: +(cx + R * Math.cos(a)).toFixed(2), y: +(cy - R * Math.sin(a)).toFixed(2) };
  };

  const arc = (p0: number, p1: number) => {
    const s = pt(p0), e = pt(p1);
    const span = (p1 - p0) * 180;
    return `M${s.x} ${s.y} A${R} ${R} 0 ${span >= 180 ? 1 : 0} 0 ${e.x} ${e.y}`;
  };

  const pct = value / max;
  const tip = pt(pct);

  const zones: [number, number, string][] = [
    [0,    0.5,  "#fca5a5"],
    [0.5,  0.75, "#fde68a"],
    [0.75, 1,    "#86efac"],
  ];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", maxWidth: 210 }}>
      {/* Background track */}
      <path d={arc(0, 1)} fill="none" stroke="#f1f5f9" strokeWidth={SW} strokeLinecap="round" />
      {/* Zone colour bands */}
      {zones.map(([a, b, c], i) => (
        <path key={i} d={arc(a, b)} fill="none" stroke={c} strokeWidth={SW - 2} strokeLinecap="butt" opacity={0.6} />
      ))}
      {/* Progress arc */}
      <path d={arc(0, pct)} fill="none" stroke="#1b59f8" strokeWidth={SW} strokeLinecap="round" />
      {/* Needle dot */}
      <circle cx={tip.x} cy={tip.y} r={5} fill="#fff" stroke="#1b59f8" strokeWidth={2.5} />
      {/* Score */}
      <text x={cx} y={cy - 4} textAnchor="middle"
        style={{ fontFamily: FF, fontSize: "30px", fontWeight: 700, fill: "#0f172a" }}>{value}</text>
      <text x={cx} y={cy + 14} textAnchor="middle"
        style={{ fontFamily: FF, fontSize: "9px", fill: "#94a3b8", letterSpacing: "0.05em" }}>OUT OF {max}</text>
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
    </div>
  );
}

// ─── Three Pillar Trend Tooltip (matches V3 SafetyTrendTooltip style) ────────
function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const items = [
    { key: "safety",     label: "Safety",     color: "#3b82f6" },
    { key: "efficiency", label: "Efficiency", color: "#60a5fa" },
    { key: "compliance", label: "Compliance", color: "#93c5fd" },
  ];
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8e8e8",
      borderRadius: 8,
      padding: "12px 14px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      minWidth: 200,
      maxWidth: 240,
      pointerEvents: "none",
      fontFamily: FF,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "0.64px solid #e2e8f0" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#0f172a" }}>Day {label}</span>
      </div>
      {/* Metric rows */}
      {items.map(({ key, label: l, color }) => {
        const entry = payload.find((p: any) => p.dataKey === key);
        return entry ? (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", flex: 1 }}>{l}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color }}>{entry.value}</span>
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
  const cat = qdCategory(d.x, d.y);
  const color = qdColor(d.x, d.y);
  const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 13px", boxShadow: "0 4px 14px rgba(0,0,0,0.10)", minWidth: 170, fontFamily: FF }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{d.name}</span>
        <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 2 }}>{catLabel}</span>
      </div>
      {[["Productivity", d.x], ["Safety", d.y]].map(([k, v]) => (
        <div key={String(k)} style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 3 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>{k}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Widget: Three Pillars Trend ──────────────────────────────────────────────
const PILLAR_LINES: [string, string, string][] = [
  ["safety",     "Safety (RTSS · MEPS)",     "#3b82f6"],
  ["efficiency", "Efficiency (FMS · RTSS)",  "#60a5fa"],
  ["compliance", "Compliance (MEPS · IMDS)", "#93c5fd"],
];
const PILLAR_STATS: Record<string, { value: number; delta: number }> = {
  safety:     { value: 88, delta: -4.19 },
  efficiency: { value: 47, delta: -0.93 },
  compliance: { value: 21, delta: +0.1  },
};

function ThreePillarTrendWidget() {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const lineOpacity = (key: string) => hoveredLine === null ? 1 : hoveredLine === key ? 1 : 0.15;
  const lineWidth   = (key: string) => hoveredLine === key ? 2.2 : 1.6;

  return (
    <div style={{ ...CARD, height: "100%", width: "100%" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: HDR_BORDER, flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Health Trend</p>
          <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Safety · Efficiency · Compliance</p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <div style={{ position: "absolute", inset: "16px 12px 8px 4px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND_30D} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontFamily: FF, fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={4} dy={5} />
              <YAxis domain={[50, 90]} ticks={[50,60,70,80,90]} tick={{ fontFamily: FF, fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} dx={-4} />
              <ReTooltip content={<TrendTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "4 2" }} />
              <Area type="monotone" dataKey="safety"
                stroke="#3b82f6" strokeWidth={lineWidth("safety")} strokeOpacity={lineOpacity("safety")}
                fill="none"
                dot={false} activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="efficiency"
                stroke="#60a5fa" strokeWidth={lineWidth("efficiency")} strokeOpacity={lineOpacity("efficiency")}
                fill="none"
                dot={false} activeDot={{ r: 5, fill: "#60a5fa", stroke: "#fff", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="compliance"
                stroke="#93c5fd" strokeWidth={lineWidth("compliance")} strokeOpacity={lineOpacity("compliance")}
                fill="none"
                dot={false} activeDot={{ r: 5, fill: "#93c5fd", stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend — hover to dim other lines */}
      <div style={{ display: "flex", gap: 20, padding: "10px 20px 20px", flexShrink: 0, flexWrap: "wrap" as const, justifyContent: "center" }}>
        {PILLAR_LINES.map(([key, label, color]) => {
          const { value, delta } = PILLAR_STATS[key];
          const active = hoveredLine === null || hoveredLine === key;
          return (
            <span key={key}
              style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: FF, cursor: "default", transition: "opacity 0.15s", opacity: active ? 1 : 0.3 }}
              onMouseEnter={() => setHoveredLine(key)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <span style={{ width: 8, height: 8, background: color, display: "inline-block", borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#64748b" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{value}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: delta < 0 ? "#ef4444" : "#16a34a" }}>{delta > 0 ? "+" : ""}{delta}</span>
            </span>
          );
        })}
      </div>

    </div>
  );
}

// ─── Widget: Critical Issues + Live Event Wire (combined) ────────────────────
function CriticalAndLiveWidget() {
  const criticalItems = [
    { label: "RED Findings",     count: 5, color: "#dc2626" },
    { label: "Licenses Expired", count: 2, color: "#dc2626" },
    { label: "Service Due",      count: 3, color: "#d97706" },
    { label: "Open High-Sev",    count: 2, color: "#d97706" },
  ];

  // Auto-scroll ticker
  const tickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    let raf: number;
    let paused = false;
    const step = () => {
      if (!paused) {
        el.scrollLeft += 0.6;
        // Seamless loop — content is duplicated so reset at halfway point
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const pause  = () => { paused = true;  };
    const resume = () => { paused = false; };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

  // Duplicate for seamless loop
  const tickerEvents = [...LIVE_EVENTS, ...LIVE_EVENTS];

  return (
    <div style={{ ...CARD, flex: 1 }}>

      {/* ── Shared header ── */}
      <div style={{ padding: "14px 20px 12px", borderBottom: HDR_BORDER, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Operational Intelligence</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", border: "1px solid #fecaca", fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#dc2626" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />LIVE
            </span>
          </div>
          <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8" }}>Active critical issues and real-time event stream — RTSS · MEPS · FMS</span>
        </div>
      </div>

      {/* ── Section: Critical Issues ── */}
      <div style={{ borderBottom: "1px solid #f1f5f9", padding: "12px 20px 14px", flexShrink: 0 }}>
        {/* Section heading */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={14} color="#475569" />
          </div>
          <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: "#0f172a" }}>Critical Issues</span>
        </div>
        {/* Stat tiles */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {/* Total */}
          <div style={{ paddingRight: 20, marginRight: 20, borderRight: "1px solid #e2e8f0", flexShrink: 0 }}>
            <p style={{ fontFamily: FF, fontSize: 28, fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1 }}>12</p>
            <p style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</p>
          </div>
          {/* Individual stat tiles */}
          <div style={{ display: "flex", gap: 0, flex: 1 }}>
            {criticalItems.map((item, i) => (
              <div key={item.label} style={{ flex: 1, paddingLeft: 16, borderLeft: i > 0 ? "1px solid #f1f5f9" : "none" }}>
                <p style={{ fontFamily: FF, fontSize: 20, fontWeight: 700, color: "#334155", margin: 0, lineHeight: 1 }}>{item.count}</p>
                <p style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", margin: "4px 0 0", lineHeight: "12px" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section: Live Event Wire ── */}
      <div style={{ flexShrink: 0 }}>
        {/* Section heading */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px 8px" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Activity size={14} color="#475569" />
          </div>
          <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: "#0f172a" }}>Live Event Wire</span>
          {/* Total pill */}
          <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, padding: "0 8px", height: 22, lineHeight: "22px", borderRadius: 20, background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", whiteSpace: "nowrap" as const, display: "inline-flex", alignItems: "center" }}>
            Total = 10
          </span>
          {/* Last 30 min */}
          <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8" }}>last 30 min</span>
          <span style={{ marginLeft: "auto", fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#3b82f6", cursor: "pointer", padding: "3px 10px", borderRadius: 6, border: "1px solid #bfdbfe", background: "#eff6ff", whiteSpace: "nowrap" as const }}>Show All</span>
        </div>
        {/* Auto-scrolling ticker + manual scrollbar */}
        <style>{`.live-ticker::-webkit-scrollbar{height:2px}.live-ticker::-webkit-scrollbar-track{background:#f8fafc;border-radius:2px}.live-ticker::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px}`}</style>
        <div ref={tickerRef} className="live-ticker" style={{ overflowX: "auto", overflowY: "hidden", padding: "0 20px 14px", scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f8fafc" } as React.CSSProperties}>
          <div style={{ display: "flex", gap: 10, width: "max-content", alignItems: "stretch" }}>
            {tickerEvents.map((ev, idx) => {
              // Icon per event type
              const TypeIcon =
                ev.type === "IMPACT"          ? Zap          :
                ev.type === "SPEED VIOLATION" ? Gauge         :
                ev.type === "HARSH-BRAKE"     ? Activity      :
                ev.type === "FATIGUE ALERT"   ? Clock         :
                ev.type === "RED INSPECTION"  ? ShieldCheck   :
                AlertTriangle;

              const meta = [ev.zone, ev.mhe, ev.operator !== "—" ? ev.operator : null].filter(Boolean) as string[];

              return (
                <div key={`${ev.id}-${idx}`} style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  minWidth: 230,
                  maxWidth: 230,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}>
                  <div style={{ padding: "11px 13px 12px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    {/* Row 1: icon box + type + time */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <TypeIcon size={13} color="#475569" />
                      </div>
                      <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, color: "#475569", letterSpacing: "0.05em", textTransform: "uppercase" as const, flex: 1 }}>{ev.type}</span>
                      <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", flexShrink: 0 }}>{ev.time}</span>
                    </div>
                    {/* Row 2: context */}
                    <p style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: "15px" }}>{ev.context}</p>
                    {/* Row 3: meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: 0, borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
                      {meta.map((v, i) => (
                        <React.Fragment key={v}>
                          {i > 0 && <span style={{ color: "#e2e8f0", margin: "0 5px", fontSize: 10 }}>|</span>}
                          <span style={{ fontFamily: FF, fontSize: 9, color: "#64748b" }}>{v}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Widget: Capacity Card ────────────────────────────────────────────────────
// ─── Widget: Unified Effective Capacity ──────────────────────────────────────
function EffectiveCapacityWidget() {
  const ROWS = [
    {
      icon: Truck,    iconColor: "#475569", iconBg: "#f1f5f9",
      name: "Fleet",         sub: "Operational readiness · FMS",
      available: 59, total: 76,  segments: FLEET_SEGMENTS,
    },
    {
      icon: Users,    iconColor: "#475569", iconBg: "#f1f5f9",
      name: "Operators",     sub: "Deployable workforce · MEPS",
      available: 29, total: 42,  segments: OPERATOR_SEGMENTS,
    },
    {
      icon: Activity, iconColor: "#475569", iconBg: "#f1f5f9",
      name: "Live Activity", sub: "Productive mix · RTSS",
      available: 32, total: 59,  segments: PRODUCTIVE_SEGMENTS,
    },
  ];

  return (
    <div style={{ ...CARD, flex: 1 }}>
      {/* ── Card header ── */}
      <div style={{ padding: "14px 20px 12px", borderBottom: HDR_BORDER, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Effective Capacity</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", border: "1px solid #fecaca", fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#dc2626" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />LIVE
            </span>
          </div>
          <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8" }}>Fleet · Operators · Live Activity — deployable right now · FMS · MEPS · RTSS</span>
        </div>
      </div>

      {/* ── Three dimension rows ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {ROWS.map((row, i) => {
        const pct       = Math.round((row.available / row.total) * 100);
        const pctColor  = pct >= 75 ? "#16a34a"  : pct >= 60 ? "#d97706"  : "#dc2626";
        const pctBg     = pct >= 75 ? "#f0fdf4"  : pct >= 60 ? "#fffbeb"  : "#fef2f2";
        const pctBorder = pct >= 75 ? "#bbf7d0"  : pct >= 60 ? "#fde68a"  : "#fecaca";
        const Icon      = row.icon;

        return (
          <div key={row.name} style={{
            flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
            borderBottom: i < ROWS.length - 1 ? DIV_LIGHT : "none",
          }}>
            <div style={{
              display: "flex", alignItems: "center",
              padding: "0 20px", gap: 0,
            }}>

              {/* ① Icon + name — fixed 170px */}
              <div style={{ width: 170, flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} color="#475569" />
                </div>
                <div>
                  <p style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>
                    {row.name}
                  </p>
                  <p style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", margin: 0 }}>
                    {row.sub}
                  </p>
                </div>
              </div>

              {/* thin divider */}
              <div style={{ width: 1, height: 32, background: "#e2e8f0", flexShrink: 0, margin: "0 16px" }} />

              {/* ② Count — fixed 90px */}
              <div style={{ width: 90, flexShrink: 0, display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: FF, fontSize: 20, fontWeight: 700, color: "#334155", lineHeight: 1 }}>
                  {row.available}
                </span>
                <span style={{ fontFamily: FF, fontSize: 11, color: "#94a3b8" }}>/ {row.total}</span>
                <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8" }}>avail.</span>
              </div>

              {/* ③ Pct badge — fixed 52px */}
              <div style={{ width: 52, flexShrink: 0, display: "flex", alignItems: "center" }}>
                <div style={{
                  fontFamily: FF, fontSize: 11, fontWeight: 700, color: pctColor,
                  background: pctBg, border: `1px solid ${pctBorder}`,
                  borderRadius: 6, padding: "3px 8px", textAlign: "center" as const,
                  lineHeight: 1.3,
                }}>
                  {pct}%
                </div>
              </div>

              {/* thin divider */}
              <div style={{ width: 1, height: 32, background: "#e2e8f0", flexShrink: 0, margin: "0 16px" }} />

              {/* ④ Bar + legend — flex grow */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "flex", height: 8, borderRadius: 6,
                  overflow: "hidden", gap: 1.5, marginBottom: 9,
                }}>
                  {row.segments.map(s => (
                    <div key={s.label} style={{ width: `${s.pct}%`, background: s.color, borderRadius: 2 }} />
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "nowrap", gap: "0 12px", overflow: "hidden" }}>
                  {row.segments.map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: FF, fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>
                        {s.label}{" "}
                        <span style={{ fontWeight: 700, color: "#334155" }}>{s.count}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        );
      })}
      </div>{/* end flex column rows */}
    </div>
  );
}

// ─── Quadrant colour + category helpers ──────────────────────────────────────
function qdCategory(x: number, y: number) {
  if (x >= 50 && y >= 50) return "star";
  if (x >= 50 && y <  50) return "reckless";
  if (x <  50 && y >= 50) return "coach";
  return "retrain";
}
function qdColor(x: number, y: number) {
  const c = qdCategory(x, y);
  return c === "star" ? "#16a34a" : c === "reckless" ? "#dc2626" : c === "coach" ? "#d97706" : "#ef4444";
}

// ─── Custom scatter dot ───────────────────────────────────────────────────────
function QuadrantDot(props: any) {
  const { cx, cy, payload, hoveredCategory, hoveredDot, setHoveredDot } = props;
  if (cx === undefined || cy === undefined) return null;
  const cat = qdCategory(payload.x, payload.y);
  const color = qdColor(payload.x, payload.y);
  const isHovered = hoveredDot === payload.name;
  const catDimmed = hoveredCategory !== null && hoveredCategory !== cat;
  const dim = catDimmed || (hoveredDot !== null && !isHovered);
  const r = isHovered ? 6 : 4;
  const opacity = dim ? 0.12 : 1;
  return (
    <g>
      {isHovered && (
        <circle cx={cx} cy={cy} r={13} fill={color} fillOpacity={0.15} style={{ pointerEvents: "none" }} />
      )}
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="#fff" strokeWidth={isHovered ? 1.5 : 0}
        fillOpacity={opacity} strokeOpacity={opacity} style={{ pointerEvents: "none" }} />
      {/* Invisible hit area for reliable mouse events */}
      <circle cx={cx} cy={cy} r={14} fill="transparent"
        onMouseEnter={() => setHoveredDot?.(payload.name)}
        onMouseLeave={() => setHoveredDot?.(null)}
        style={{ cursor: "default" }} />
    </g>
  );
}

// ─── Widget: Fleet · Effective Available ─────────────────────────────────────
const FLEET_UNITS = [
  { id: "MHE-01", status: "available"   },
  { id: "MHE-03", status: "available"   },
  { id: "MHE-07", status: "available"   },
  { id: "MHE-12", status: "maintenance" },
  { id: "MHE-15", status: "available"   },
  { id: "MHE-19", status: "available"   },
  { id: "MHE-22", status: "available"   },
];

function FleetEffectiveWidget() {
  const total       = FLEET_UNITS.length;
  const available   = FLEET_UNITS.filter(u => u.status === "available").length;
  const maintenance = FLEET_UNITS.filter(u => u.status === "maintenance").length;
  const service     = FLEET_UNITS.filter(u => u.status === "service").length;
  const warranty    = 0;
  const pct         = Math.round((available / total) * 100);
  const target      = 85;

  const rows = [
    { label: "Total fleet",       val: total,        display: `${total}`,        barPct: 100,                        barColor: "#e2e8f0", bold: false },
    { label: "Under maintenance", val: -maintenance, display: `-${maintenance}`, barPct: (maintenance / total) * 100, barColor: "#cbd5e1", bold: false },
    { label: "Service overdue",   val: -service,     display: `-${service}`,     barPct: (service / total) * 100,     barColor: "#cbd5e1", bold: false },
    { label: "Warranty Expiry",   val: warranty,     display: `${warranty}`,     barPct: 0,                           barColor: "#cbd5e1", bold: false },
    { label: "= Available",       val: available,    display: `${available}`,    barPct: (available / total) * 100,   barColor: "#16a34a", bold: true  },
  ];

  return (
    <div style={{ ...CARD, flex: 1, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ padding: "14px 16px 12px", borderBottom: HDR_BORDER, flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Fleet · Effective Available</p>
          <p style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8", margin: 0 }}>Total → minus maintenance, service, warranty</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "14px 18px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Hero + Distribution bar side by side */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>

          {/* KPI */}
          <div style={{ flexShrink: 0, paddingRight: 14 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 1 }}>
              <span style={{ fontFamily: FF, fontSize: 48, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{available}</span>
              <span style={{ fontFamily: FF, fontSize: 13, color: "#94a3b8" }}>/{total}</span>
            </div>
            <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8" }}>units deployable</span>
          </div>

          {/* Vertical divider */}
          <div style={{ width: 1, background: "#e2e8f0", flexShrink: 0, alignSelf: "stretch" }} />

          {/* Distribution bar */}
          <div style={{ flex: 1, paddingLeft: 14, paddingTop: 4, display: "flex", flexDirection: "column", gap: 0 }}>
            <p style={{ fontFamily: FF, fontSize: 10, fontWeight: 500, color: "#94a3b8", margin: "0 0 4px" }}>Readiness :</p>

            {/* Target label above marker */}
            <div style={{ position: "relative" as const, height: 22, marginBottom: 2 }}>
              <div style={{ position: "absolute" as const, left: `${target}%`, transform: "translateX(-50%)", background: pct >= target ? "#f0fdf4" : "#f1f5f9", border: `1px solid ${pct >= target ? "#bbf7d0" : "#e2e8f0"}`, borderRadius: 4, padding: "1px 6px", whiteSpace: "nowrap" as const, display: "flex", alignItems: "center", gap: 3 }}>
                {pct >= target && <span style={{ fontFamily: FF, fontSize: 9, color: "#16a34a" }}>✓</span>}
                <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, color: pct >= target ? "#15803d" : "#334155" }}>{target}%</span>
                <span style={{ fontFamily: FF, fontSize: 9, color: pct >= target ? "#16a34a" : "#94a3b8" }}>target</span>
              </div>
            </div>

            {/* Bar */}
            <div style={{ position: "relative" as const, height: 7, borderRadius: 4, background: "#f5f3f3" }}>
              <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: pct >= target ? "#16a34a" : "#1b59f8", borderRadius: 2 }} />
              <div style={{ position: "absolute" as const, left: `${target}%`, top: -3, bottom: -3, width: 4, background: "#fff", borderRadius: 8, transform: "translateX(-50%)", boxShadow: "0 0 0 1px #e2e8f0" }} />
            </div>

            {/* Current + gap */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: pct >= target ? "#16a34a" : "#1b59f8", flexShrink: 0 }} />
                <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, color: "#0f172a" }}>{pct}%</span>
                <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8" }}>now</span>
              </div>
              <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 600, color: pct >= target ? "#16a34a" : "#ef4444" }}>
                {pct >= target ? `+${pct - target}pp above` : `−${target - pct}pp short`}
              </span>
            </div>
          </div>
        </div>

        {/* Data rows — label gray, value dark */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
          {rows.map((r, i) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderTop: i === 0 ? "none" : "1px solid #f1f5f9" }}>
              <span style={{ fontFamily: FF, fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>{r.label}</span>
              <span style={{ fontFamily: FF, fontSize: 13, fontWeight: r.bold ? 800 : 600, color: r.bold ? "#16a34a" : "#0f172a" }}>{r.display}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── Widget: Pallet Waste Index ───────────────────────────────────────────────
const WASTE_SOURCES = [
  { label: "Empty movement", minutes: 222, contrib: 0.54, color: "#3b82f6" },
  { label: "Congestion",     minutes: 162, contrib: 0.39, color: "#f97316" },
  { label: "Idle w/o load",  minutes: 138, contrib: 0.33, color: "#f59e0b" },
  { label: "Idle-with-load", minutes: 84,  contrib: 0.20, color: "#ef4444" },
];
const WASTE_TOTAL_MIN = 606;
const WASTE_PALLETS   = 412;
const WASTE_VALUE     = 1.47;

function PalletWasteWidget() {
  const norm28 = 1.32, bestDay = 0.91;
  const vsNorm = +(WASTE_VALUE - norm28).toFixed(2);
  const vsBest = +(WASTE_VALUE - bestDay).toFixed(2);

  return (
    <div style={{ ...CARD, flex: 1, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ padding: "14px 18px 12px", borderBottom: HDR_BORDER, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Package size={13} color="#475569" />
          </div>
          <div>
            <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>Pallet Waste Index</p>
            <p style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8", margin: 0 }}>Waste minutes carried per pallet moved · {WASTE_PALLETS} pallets today</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 6, padding: "3px 9px" }}>
          <TrendingUp size={10} color="#64748b" />
          <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#475569" }}>+0.15 vs yesterday</span>
        </div>
      </div>

      {/* Body: two columns */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* Left — score + benchmarks */}
        <div style={{ width: 190, flexShrink: 0, borderRight: HDR_BORDER, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Score */}
          <p style={{ fontFamily: FF, fontSize: 50, fontWeight: 800, color: "#0f172a", lineHeight: 1, margin: "0 0 3px" }}>{WASTE_VALUE}</p>
          <p style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.09em", textTransform: "uppercase" as const, margin: "0 0 18px" }}>MIN / PALLET</p>

          {/* Benchmark rows */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { label: "28-day norm", val: norm28, delta: `+${vsNorm}` },
              { label: "Best day",    val: bestDay, delta: `+${vsBest}` },
            ].map((b, i) => (
              <div key={b.label} style={{ padding: "10px 0", borderTop: i === 0 ? "1px solid #f1f5f9" : "1px solid #f1f5f9" }}>
                <p style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#94a3b8", margin: "0 0 4px", letterSpacing: "0.05em" }}>{b.label}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                  <span style={{ fontFamily: FF, fontSize: 16, fontWeight: 700, color: "#334155" }}>{b.val}</span>
                  <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#94a3b8" }}>{b.delta} above</span>
                </div>
              </div>
            ))}
          </div>

          {/* Formula */}
          <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
            <p style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", margin: "0 0 3px" }}>{WASTE_TOTAL_MIN} min waste ÷ {WASTE_PALLETS} pallets</p>
            <p style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "#475569", margin: 0 }}>= {WASTE_VALUE} min / pallet</p>
          </div>
        </div>

        {/* Right — source breakdown */}
        <div style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", minWidth: 0 }}>
          <p style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" as const, margin: "0 0 14px" }}>Waste sources · ranked by impact</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 13, flex: 1 }}>
            {WASTE_SOURCES.map((s, i) => {
              const barPct = (s.minutes / WASTE_TOTAL_MIN) * 100;
              const barColor = i === 0 ? "#475569" : "#cbd5e1";
              return (
                <div key={s.label}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, color: "#cbd5e1", width: 16, flexShrink: 0 }}>#{i + 1}</span>
                    <span style={{ fontFamily: FF, fontSize: 11, color: "#334155", flex: 1 }}>{s.label}</span>
                    <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{s.contrib}</span>
                    <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8", width: 42, textAlign: "right" as const, flexShrink: 0 }}>{s.minutes} min</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 24, flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 5, borderRadius: 3, background: "#f1f5f9" }}>
                      <div style={{ width: `${barPct}%`, height: "100%", background: barColor, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", width: 28, textAlign: "right" as const, flexShrink: 0 }}>{barPct.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, marginTop: 12, borderTop: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={11} color="#94a3b8" />
              <span style={{ fontFamily: FF, fontSize: 10, color: "#64748b" }}>Normal · waste rising</span>
            </div>
            <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8", fontStyle: "italic" }}>empty movement is primary driver</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quadrant corner labels rendered inside SVG ───────────────────────────────
function QuadrantLabels({ xAxisMap, yAxisMap }: any) {
  if (!xAxisMap || !yAxisMap) return null;
  const xAxis = Object.values(xAxisMap)[0] as any;
  const yAxis = Object.values(yAxisMap)[0] as any;
  if (!xAxis || !yAxis) return null;

  const left   = xAxis.x;
  const right  = xAxis.x + xAxis.width;
  const top    = yAxis.y;
  const bottom = yAxis.y + yAxis.height;
  const padX = 14;
  const padTop = 16;
  const padBottom = 28;

  const corners = [
    { label: "COACH",    sub: "safe · slow",   color: "#d97706", ax: left  + padX, ay: top    + padTop,    anchor: "start" as const },
    { label: "★ STAR",   sub: "safe · fast",   color: "#16a34a", ax: right - padX, ay: top    + padTop,    anchor: "end"   as const },
    { label: "RETRAIN",  sub: "unsafe · slow", color: "#ef4444", ax: left  + padX, ay: bottom - padBottom, anchor: "start" as const },
    { label: "RECKLESS", sub: "fast · unsafe", color: "#dc2626", ax: right - padX, ay: bottom - padBottom, anchor: "end"   as const },
  ];

  return (
    <g style={{ pointerEvents: "none" }}>
      {corners.map(c => (
        <g key={c.label}>
          <text x={c.ax} y={c.ay} textAnchor={c.anchor}
            style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, fill: c.color, letterSpacing: "0.06em" }}>
            {c.label}
          </text>
          <text x={c.ax} y={c.ay + 13} textAnchor={c.anchor}
            style={{ fontFamily: FF, fontSize: 8.5, fontWeight: 400, fill: "#94a3b8" }}>
            {c.sub}
          </text>
        </g>
      ))}
    </g>
  );
}

// ─── Widget: Operator Quadrant ────────────────────────────────────────────────
const QD_LEGEND = [
  { key: "star",     label: "Star · safe · fast",     color: "#16a34a" },
  { key: "coach",    label: "Coach · safe · slow",       color: "#d97706" },
  { key: "retrain",  label: "Retrain · unsafe · slow",  color: "#ef4444" },
  { key: "reckless", label: "Reckless · fast · unsafe", color: "#dc2626" },
];

function OperatorQuadrantWidget() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  return (
    <div style={{ ...CARD, flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: HDR_BORDER, flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Operator Quadrant · Risk × Performance</p>
          <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>X = productivity · Y = safety</p>
        </div>
        <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, padding: "0 8px", height: 22, lineHeight: "22px", borderRadius: 20, background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", whiteSpace: "nowrap" as const, display: "inline-flex", alignItems: "center" }}>Operator = {QUADRANT_DATA.length}</span>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0, padding: "8px 8px 0 4px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
            <ReferenceArea x1={0}  x2={50} y1={50} y2={100} fill="#fffbeb" fillOpacity={1} />
            <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="#f0fdf4" fillOpacity={1} />
            <ReferenceArea x1={0}  x2={50} y1={0}  y2={50}  fill="#fff1f2" fillOpacity={1} />
            <ReferenceArea x1={50} x2={100} y1={0}  y2={50}  fill="#fff1f2" fillOpacity={1} />
            <XAxis type="number" dataKey="x" domain={[0, 100]} name="Productivity"
              tick={{ fontFamily: FF, fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey="y" domain={[0, 100]} name="Safety"
              tick={{ fontFamily: FF, fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <ZAxis type="number" dataKey="z" range={[1, 1]} />
            <ReferenceLine x={50} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 3" />
            <ReferenceLine y={50} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 3" />
            <ReTooltip content={<QuadrantTooltip />} cursor={false} />
            <Scatter data={QUADRANT_DATA} shape={(p: any) => <QuadrantDot {...p} hoveredCategory={hoveredCategory} hoveredDot={hoveredDot} setHoveredDot={setHoveredDot} />} />
            <Customized component={QuadrantLabels} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend — matches Health Trend style */}
      <div style={{ display: "flex", gap: 16, padding: "10px 20px 16px", flexShrink: 0, flexWrap: "wrap" as const, justifyContent: "center" }}>
        {QD_LEGEND.map(({ key, label, color }) => (
          <span key={key}
            style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FF, fontSize: 11, color: hoveredCategory === null || hoveredCategory === key ? "#64748b" : "#cbd5e1", cursor: "default", transition: "color 0.15s" }}
            onMouseEnter={() => setHoveredCategory(key)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <span style={{ width: 8, height: 8, background: color, display: "inline-block", borderRadius: 2, opacity: hoveredCategory === null || hoveredCategory === key ? 1 : 0.25, transition: "opacity 0.15s", flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Widget: Notifications ────────────────────────────────────────────────────
function NotificationsWidget() {
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
  const DOT_COLORS = ["#475569", "#94a3b8", "#cbd5e1"];
  return (
    <div style={{ ...CARD, flex: 1 }}>

      {/* Header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: HDR_BORDER, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Notifications</p>
          <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Operator events · license · warranty · service due · RED findings</p>
        </div>
        <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, padding: "0 8px", height: 22, lineHeight: "22px", borderRadius: 20, background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", whiteSpace: "nowrap" as const, display: "inline-flex", alignItems: "center" }}>
          Total = 06
        </span>
      </div>

      {/* Notification cards */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent", padding: "10px 14px 14px", display: "flex", flexDirection: "column", gap: 8 } as React.CSSProperties}>
        {NOTIFICATIONS.map(n => {
          const Icon = n.icon;
          return (
            <div key={n.id}
              style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "11px 13px", background: "#fff", display: "flex", alignItems: "flex-start", gap: 11, cursor: "default", transition: "background 0.12s", position: "relative" as const }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
            >
              {/* Icon box */}
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={14} color="#64748b" />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Category + time */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase" as const }}>{n.category}</span>
                    <span style={{ color: "#e2e8f0", fontSize: 9 }}>·</span>
                    <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8" }}>{n.time}</span>
                  </div>
                  {/* Badge */}
                  <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 20, background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}>{n.badge}</span>
                </div>
                {/* Title */}
                <p style={{ fontFamily: FF, fontSize: 11, fontWeight: n.unread ? 600 : 500, color: "#0f172a", margin: "0 0 5px", lineHeight: "15px" }}>{n.title}</p>
                {/* Footer detail */}
                <p style={{ fontFamily: FF, fontSize: 9.5, color: "#94a3b8", margin: 0, lineHeight: "13px" }}>{n.footerLeft} · {n.footerRight}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ value }: { value: number }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rounded ? "#f59e0b" : "#e2e8f0", fontSize: 12, lineHeight: 1 }}>★</span>
      ))}
      <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#94a3b8", marginLeft: 4 }}>{value.toFixed(1)}</span>
    </span>
  );
}

// ─── Roll-Call Pagination ─────────────────────────────────────────────────────
function RollCallPagination({ total }: { total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, padding: "10px 16px", borderTop: DIV_LIGHT, flexShrink: 0 }}>
      <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8" }}>Rows per page:</span>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 3, border: "1px solid #e2e8f0", borderRadius: 5, padding: "2px 7px" }}>
        <span style={{ fontFamily: FF, fontSize: 10, color: "#475569" }}>10</span>
        <ChevronRight size={9} color="#94a3b8" style={{ transform: "rotate(90deg)" }} />
      </div>
      <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8" }}>1 – 1 of {total}</span>
      {[180, 0].map(deg => (
        <button key={deg} style={{ width: 24, height: 24, borderRadius: 5, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronRight size={11} color="#94a3b8" style={{ transform: `rotate(${deg}deg)` }} />
        </button>
      ))}
    </div>
  );
}

// ─── Widget: Roll-Call ────────────────────────────────────────────────────────
function RollCallWidget() {
  const [tab, setTab] = useState<"equipment" | "operators">("equipment");

  return (
    <div style={{ ...CARD, flex: 1 }}>

      {/* Header */}
      <div style={{ padding: "14px 18px 12px", borderBottom: HDR_BORDER, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Roll-Call</p>
            <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Reliability scores — incidents, safety, utilization & compliance</p>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#1b59f8", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2 }}>
            View All <ChevronRight size={11} />
          </button>
        </div>
      </div>

      {/* Tab strip */}
      <div style={{ padding: "10px 12px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 8, padding: "3px", gap: 2 }}>
          {([
            { id: "equipment" as const, label: "Equipment", count: EQUIP_ROLLCALL.length },
            { id: "operators" as const, label: "Operators", count: OPR_ROLLCALL.length  },
          ]).map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: "6px 4px", borderRadius: 6,
                border: active ? "1px solid #e2e8f0" : "1px solid transparent",
                background: active ? "#ffffff" : "transparent",
                cursor: "pointer", transition: "all 0.12s",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: active ? "#475569" : "#94a3b8", lineHeight: 1 }}>{t.count}</span>
                <span style={{ fontFamily: FF, fontSize: 10, fontWeight: active ? 600 : 400, color: active ? "#475569" : "#94a3b8" }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" } as React.CSSProperties}>

        {tab === "equipment" && EQUIP_ROLLCALL.map((row, i, arr) => {
          const bs = scoreBandStyle(row.band);
          return (
            <div key={row.id}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", cursor: "default", transition: "background 0.12s" }}
                onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              >
                {/* Square icon badge */}
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Truck size={15} color="#475569" />
                </div>

                {/* Identity + chips */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <p style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#0f172a", margin: 0 }}>{row.id}</p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    <span style={{ fontFamily: FF, fontSize: 9, color: "#64748b", background: "#f1f5f9", padding: "2px 7px", borderRadius: 5 }}>{row.type}</span>
                    <span style={{ fontFamily: FF, fontSize: 9, color: "#475569", background: "#f8fafc", padding: "2px 7px", borderRadius: 5 }}>Util {row.util}%</span>
                    <span style={{
                      fontFamily: FF, fontSize: 9, padding: "2px 7px", borderRadius: 5,
                      color: row.incidents > 3 ? "#dc2626" : "#475569",
                      background: row.incidents > 3 ? "#fef2f2" : "#f8fafc",
                      border: row.incidents > 3 ? "1px solid #fecaca" : "1px solid transparent",
                    }}>{row.incidents} incidents</span>
                    {row.redFindings > 0 && (
                      <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca" }}>
                        {row.redFindings} RED
                      </span>
                    )}
                  </div>
                </div>

                {/* Reliability stars */}
                <div style={{ flexShrink: 0 }}>
                  <StarRating value={+(row.score / 100 * 5).toFixed(1)} />
                </div>

              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: "#f1f5f9", margin: "0 18px" }} />}
            </div>
          );
        })}

        {tab === "operators" && OPR_ROLLCALL.map((row, i, arr) => {
          const band = scoreToBand(row.score);
          const bs   = scoreBandStyle(band);
          const TI   = row.trend === "up" ? TrendingUp : row.trend === "down" ? TrendingDown : Minus;
          const tc   = row.trend === "up" ? "#16a34a" : row.trend === "down" ? "#dc2626" : "#94a3b8";
          return (
            <div key={row.id}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", cursor: "default", transition: "background 0.12s" }}
                onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              >
                {/* Square icon badge */}
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Users size={15} color="#475569" />
                </div>

                {/* Identity + chips */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <p style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#0f172a", margin: 0 }}>{row.name}</p>
                    {row.fatigue && (
                      <span style={{ fontFamily: FF, fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>FATIGUE</span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    <span style={{ fontFamily: FF, fontSize: 9, color: "#64748b", background: "#f1f5f9", padding: "2px 7px", borderRadius: 5 }}>{row.id} · {row.exp}yr exp</span>
                    <span style={{ fontFamily: FF, fontSize: 9, color: "#475569", background: "#f8fafc", padding: "2px 7px", borderRadius: 5 }}>Util {row.util}%</span>
                    <span style={{
                      fontFamily: FF, fontSize: 9, padding: "2px 7px", borderRadius: 5,
                      color: row.incidents > 2 ? "#dc2626" : "#475569",
                      background: row.incidents > 2 ? "#fef2f2" : "#f8fafc",
                      border: row.incidents > 2 ? "1px solid #fecaca" : "1px solid transparent",
                    }}>{row.incidents} incidents</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontFamily: FF, fontSize: 9, color: "#475569", background: "#f8fafc", padding: "2px 7px", borderRadius: 5 }}>
                      <TI size={9} color={tc} /> Safety {row.safetyRating}
                    </span>
                  </div>
                </div>

                {/* Safety stars */}
                <div style={{ flexShrink: 0 }}>
                  <StarRating value={+(row.safetyRating / 100 * 5).toFixed(1)} />
                </div>

              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: "#f1f5f9", margin: "0 18px" }} />}
            </div>
          );
        })}

      </div>
      <RollCallPagination total={tab === "equipment" ? EQUIP_ROLLCALL.length : OPR_ROLLCALL.length} />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
// ─── Widget: Warehouse Performance Banner ─────────────────────────────────────
function WarehousePerformanceBanner() {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-GB", { weekday: "short" });
  const day     = now.getDate();
  const month   = now.toLocaleDateString("en-GB", { month: "long" });
  const year    = now.getFullYear();
  const dateStr = `${weekday}, ${day} ${month} ${year}`;

  const kpis = [
    { title: "Safety",        icon: ShieldCheck, value: "84", description: "/ 100 · RTSS · MEPS"      },
    { title: "Productivity",  icon: TrendingUp,  value: "34", description: "/ 100 · FMS · RTSS"       },
    { title: "Efficiency",    icon: Gauge,       value: "22", description: "/ 100 · FMS · RTSS"       },
    { title: "Pallets Moved", icon: Package,     value: "19", description: "today · active floor ops" },
  ];

  return (
    <div style={{ background: "transparent" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingBottom: 14 }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Warehouse Performance</p>
          <p style={{ fontFamily: FF, fontSize: 11, color: "#94a3b8", margin: 0 }}>{dateStr} · Rams</p>
        </div>
        {/* LIVE pill — matches widget style */}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", border: "1px solid #fecaca", fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#dc2626" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block", flexShrink: 0 }} />
          LIVE <span style={{ fontWeight: 700 }}>0 / 5</span> MHE active
        </span>
      </div>

      {/* Section label */}
      <div style={{ paddingBottom: 10 }}>
        <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
          Operational Health
        </span>
      </div>

      {/* KPI cards — V3 KPICard style */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.title} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", background: "#fff" }}>
              {/* Icon + title row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={14} color="#475569" />
                </div>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "#64748b" }}>{k.title}</span>
              </div>
              {/* Value */}
              <p style={{ fontFamily: FF, fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "0 0 3px", lineHeight: 1 }}>{k.value}</p>
              {/* Description */}
              <p style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8", margin: 0 }}>{k.description}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export function Variation4Tab() {

  return (
    <div className="space-y-6 p-8">

      {/* ══ WAREHOUSE PERFORMANCE BANNER ══════════════════════════════════════ */}
      <WarehousePerformanceBanner />

      {/* ══ SECTION 1 — Operational Intelligence (full width) ══════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Operational Intelligence — Critical Issues · Live Event Wire</SL>
        <div className="col-span-12" style={{ display: "flex" }}>
          <CriticalAndLiveWidget />
        </div>
      </div>

      {/* ══ SECTION 1b — Fleet + Operators capacity cards ══════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {([
          {
            icon: Truck,  name: "Fleet",     sub: "Operational readiness · FMS",  available: 59, total: 76, segments: FLEET_SEGMENTS,
            chip: { text: "13% capacity locked · 5 units need sign-off" },
          },
          {
            icon: Users,  name: "Operators", sub: "Deployable workforce · MEPS",  available: 29, total: 42, segments: OPERATOR_SEGMENTS,
            chip: { text: "Rotate 3 off floor · fatigue window closing" },
          },
        ]).map(row => {
          const Icon      = row.icon;
          const pct       = Math.round((row.available / row.total) * 100);
          const pctColor  = pct >= 75 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626";
          const pctBg     = pct >= 75 ? "#f0fdf4" : pct >= 60 ? "#fffbeb" : "#fef2f2";
          const pctBorder = pct >= 75 ? "#bbf7d0" : pct >= 60 ? "#fde68a" : "#fecaca";
          return (
            <div key={row.name} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 21, display: "flex", flexDirection: "column", gap: 12, background: "#fff" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={13} color="#475569" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: "#0f172a", margin: "0 0 1px" }}>{row.name}</p>
                  <p style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", margin: 0, whiteSpace: "nowrap" }}>{row.sub}</p>
                </div>
              </div>
              {/* Count + badge + insight */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 6, paddingBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontFamily: FF, fontSize: 18, fontWeight: 700, color: "#334155", lineHeight: 1 }}>{row.available}</span>
                  <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8" }}>/ {row.total}</span>
                </div>
                <div style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, color: pctColor, background: pctBg, border: `1px solid ${pctBorder}`, borderRadius: 6, padding: "2px 7px", flexShrink: 0 }}>{pct}%</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", flexShrink: 0 }}>
                  <AlertTriangle size={10} color="#94a3b8" />
                  <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 500, color: "#94a3b8" }}>{row.chip.text}</span>
                </div>
              </div>
              {/* Distribution */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontFamily: FF, fontSize: 10, fontWeight: 500, color: "#94a3b8", margin: 0 }}>Distribution :</p>
                <div style={{ display: "flex", height: 7, borderRadius: 4, overflow: "hidden", gap: 1 }}>
                  {row.segments.map((s: any) => (
                    <div key={s.label} style={{ width: `${s.pct}%`, background: s.color, borderRadius: 2 }} />
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
                  {row.segments.map((s: any) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: FF, fontSize: 11, color: "#64748b", whiteSpace: "nowrap" }}>
                        {s.label} <span style={{ fontWeight: 700, color: "#334155" }}>{s.count}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══ SECTION 2 — Three Pillar Trend + Notifications */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Trend Intelligence · Notifications — FMS · MEPS · RTSS · IMDS</SL>

        {/* Left: Three Pillar Trend (wider) */}
        <div className="col-span-8 flex" style={{ height: 380 }}>
          <ThreePillarTrendWidget />
        </div>

        {/* Right: Notifications */}
        <div className="col-span-4 flex" style={{ height: 380 }}>
          <NotificationsWidget />
        </div>

      </div>

      {/* ══ SECTION 6+7 — Risk × Performance + Roll-Call (50/50 row) ══════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Risk × Performance · Roll-Call — Operator Intelligence & Reliability</SL>

        <div className="col-span-12" style={{ display: "flex", gap: 16, alignItems: "stretch", height: 380 }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
            <OperatorQuadrantWidget />
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
            <RollCallWidget />
          </div>
        </div>
      </div>

      {/* ══ SECTION 4 — Fleet Intelligence · Pallet Waste ═══════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Fleet Intelligence · Operational Efficiency</SL>
        <div className="col-span-12" style={{ display: "flex", gap: 16, alignItems: "stretch", height: 400 }}>
          <div style={{ flex: "0 0 36%", display: "flex" }}>
            <FleetEffectiveWidget />
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
            <PalletWasteWidget />
          </div>
        </div>
      </div>

    </div>
  );
}
