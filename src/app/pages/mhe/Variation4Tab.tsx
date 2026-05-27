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
  Tooltip as ReTooltip, ReferenceLine,
} from "recharts";
import {
  AlertTriangle, ShieldCheck, Zap, Activity, Truck, Users,
  Clock, ChevronRight, TrendingDown, TrendingUp, Minus,
  Shield, BarChart2, AlertCircle, CheckCircle, XCircle,
  Gauge, Eye, RefreshCw,
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
const TREND_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  safety:     +(Math.max(56, 78 - i * 0.52 + Math.sin(i * 0.9) * 2.8)).toFixed(1),
  efficiency: +(68 + Math.sin(i * 0.42) * 4.5 + Math.cos(i * 0.65) * 2).toFixed(1),
  compliance: +(Math.min(84, 66 + i * 0.38 + Math.sin(i * 0.55) * 1.8)).toFixed(1),
}));

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
const PILLAR_LINES: [string, string, string][] = [
  ["safety",     "Safety (RTSS · MEPS)",     "#3b82f6"],
  ["efficiency", "Efficiency (FMS · RTSS)",  "#60a5fa"],
  ["compliance", "Compliance (MEPS · IMDS)", "#93c5fd"],
];

function ThreePillarTrendWidget() {
  const [timeRange,    setTimeRange]    = useState("30d");
  const [hoveredLine,  setHoveredLine]  = useState<string | null>(null);

  const data     = timeRange === "7d" ? TREND_7D : TREND_30D;
  const xInterval = timeRange === "7d" ? 0 : 4;

  const lineOpacity = (key: string) => hoveredLine === null ? 1 : hoveredLine === key ? 1 : 0.15;
  const lineWidth   = (key: string) => hoveredLine === key ? 2.2 : 1.6;

  return (
    <div style={{ ...CARD, height: "100%" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: HDR_BORDER, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" as const }}>
          <div>
            <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Health Trend</p>
            <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Safety · Efficiency · Compliance</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger style={FILTER_STYLE}><SelectValue /></SelectTrigger>
              <SelectContent>
                {([["7d","Last 7 Days"],["30d","Last 30 Days"]] as [string,string][]).map(([v,l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <div style={{ position: "absolute", inset: "16px 12px 8px 4px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontFamily: FF, fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={xInterval} dy={5} />
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
      <div style={{ display: "flex", gap: 16, padding: "10px 20px 20px", flexShrink: 0, flexWrap: "wrap" as const, justifyContent: "center" }}>
        {PILLAR_LINES.map(([key, label, color]) => (
          <span key={key}
            style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FF, fontSize: 11, color: hoveredLine === null || hoveredLine === key ? "#64748b" : "#cbd5e1", cursor: "default", transition: "color 0.15s" }}
            onMouseEnter={() => setHoveredLine(key)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <span style={{ width: 8, height: 8, background: color, display: "inline-block", borderRadius: 2, opacity: hoveredLine === null || hoveredLine === key ? 1 : 0.25, transition: "opacity 0.15s", flexShrink: 0 }} />
            {label}
          </span>
        ))}
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
    <div style={{ ...CARD }}>

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
    <div style={{ ...CARD }}>
      {/* ── Card header ── */}
      <div style={{
        padding: "14px 20px 12px", borderBottom: HDR_BORDER,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
            <Gauge size={14} color="#1b59f8" />
            <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              Effective Capacity
            </span>
          </div>
          <span style={{ fontFamily: FF, fontSize: 10, color: "#64748b" }}>
            Fleet · Operators · Live Activity — deployable right now
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", letterSpacing: "0.04em" }}>
            FMS · MEPS · RTSS · IMDS
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 20, padding: "3px 9px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#16a34a" }}>Live</span>
          </div>
        </div>
      </div>

      {/* ── Three dimension rows ── */}
      {ROWS.map((row, i) => {
        const pct       = Math.round((row.available / row.total) * 100);
        const pctColor  = pct >= 75 ? "#16a34a"  : pct >= 60 ? "#d97706"  : "#dc2626";
        const pctBg     = pct >= 75 ? "#f0fdf4"  : pct >= 60 ? "#fffbeb"  : "#fef2f2";
        const pctBorder = pct >= 75 ? "#bbf7d0"  : pct >= 60 ? "#fde68a"  : "#fecaca";
        const Icon      = row.icon;

        return (
          <div key={row.name} style={{
            borderBottom: i < ROWS.length - 1 ? DIV_LIGHT : "none",
          }}>
            <div style={{
              display: "flex", alignItems: "center",
              padding: "18px 20px", gap: 0,
            }}>

              {/* ① Icon + name — fixed 188px */}
              <div style={{ width: 188, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} color="#475569" />
                </div>
                <div>
                  <p style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" }}>
                    {row.name}
                  </p>
                  <p style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8", margin: 0 }}>
                    {row.sub}
                  </p>
                </div>
              </div>

              {/* thin divider */}
              <div style={{ width: 1, height: 36, background: "#f1f5f9", flexShrink: 0, margin: "0 20px" }} />

              {/* ② Count — fixed 120px */}
              <div style={{ width: 120, flexShrink: 0, display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontFamily: FF, fontSize: 34, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>
                  {row.available}
                </span>
                <span style={{ fontFamily: FF, fontSize: 13, color: "#94a3b8" }}>/ {row.total}</span>
                <span style={{ fontFamily: FF, fontSize: 9, color: "#94a3b8" }}>avail.</span>
              </div>

              {/* ③ Pct badge — fixed 64px */}
              <div style={{ width: 64, flexShrink: 0, display: "flex", alignItems: "center" }}>
                <div style={{
                  fontFamily: FF, fontSize: 13, fontWeight: 700, color: pctColor,
                  background: pctBg, border: `1px solid ${pctBorder}`,
                  borderRadius: 7, padding: "4px 10px", textAlign: "center" as const,
                  lineHeight: 1.3,
                }}>
                  {pct}%
                </div>
              </div>

              {/* thin divider */}
              <div style={{ width: 1, height: 36, background: "#f1f5f9", flexShrink: 0, margin: "0 20px" }} />

              {/* ④ Bar + legend — flex grow */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "flex", height: 10, borderRadius: 6,
                  overflow: "hidden", gap: 1.5, marginBottom: 9,
                }}>
                  {row.segments.map(s => (
                    <div key={s.label} style={{ width: `${s.pct}%`, background: s.color, borderRadius: 2 }} />
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "4px 16px" }}>
                  {row.segments.map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: FF, fontSize: 10, color: "#64748b" }}>
                        {s.label}{" "}
                        <span style={{ fontWeight: 600, color: "#475569" }}>{s.count}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        );
      })}
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
        <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", whiteSpace: "nowrap" as const }}>
          {unreadCount} unread
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

// ─── Widget: Combined Roll-Call ───────────────────────────────────────────────
function RollCallWidget() {
  const [tab, setTab] = useState<"equipment" | "operators">("equipment");

  return (
    <div style={{ ...CARD }}>

      {/* Header */}
      <div style={{ padding: "14px 18px 0", borderBottom: HDR_BORDER, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Roll-Call</p>
            <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Reliability scores — incidents, safety, utilization & compliance</p>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: FF, fontSize: 10, fontWeight: 600, color: "#1b59f8", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2 }}>
            View All <ChevronRight size={11} />
          </button>
        </div>

        {/* Tab strip */}
        <div style={{ display: "flex" }}>
          {([
            { id: "equipment" as const, label: "Equipment", count: EQUIP_ROLLCALL.length },
            { id: "operators" as const, label: "Operators", count: OPR_ROLLCALL.length },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                fontFamily: FF, fontSize: 11, fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? "#1b59f8" : "#94a3b8",
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 14px",
                borderBottom: tab === t.id ? "2px solid #1b59f8" : "2px solid transparent",
                marginBottom: -1, transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              {t.label}
              <span style={{
                fontFamily: FF, fontSize: 9, fontWeight: 700,
                padding: "1px 6px", borderRadius: 10,
                background: tab === t.id ? "#eff6ff" : "#f1f5f9",
                color: tab === t.id ? "#1b59f8" : "#94a3b8",
              }}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" } as React.CSSProperties}>

        {tab === "equipment" && EQUIP_ROLLCALL.map((row, i, arr) => {
          const bs = scoreBandStyle(row.band);
          return (
            <div key={row.id}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", cursor: "default", transition: "background 0.12s" }}
                onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              >
                {/* Score circle */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: bs.bg, border: `2px solid ${bs.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 800, color: bs.color }}>{row.score}</span>
                </div>

                {/* Identity + chips */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#0f172a", margin: "0 0 5px" }}>{row.id}</p>
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

                {/* Band pill */}
                <span style={{
                  fontFamily: FF, fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, flexShrink: 0,
                  background: bs.bg, color: bs.color, border: `1px solid ${bs.border}`,
                }}>{row.band}</span>
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
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", cursor: "default", transition: "background 0.12s" }}
                onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              >
                {/* Score circle */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: bs.bg, border: `2px solid ${bs.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 800, color: bs.color }}>{row.score}</span>
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

                {/* Band pill */}
                <span style={{
                  fontFamily: FF, fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, flexShrink: 0,
                  background: bs.bg, color: bs.color, border: `1px solid ${bs.border}`,
                }}>{band}</span>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: "#f1f5f9", margin: "0 18px" }} />}
            </div>
          );
        })}

      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function Variation4Tab() {
  const ohRef  = useRef<HTMLDivElement>(null);
  const [ohH, setOhH] = useState<number | undefined>();

  useEffect(() => {
    if (!ohRef.current) return;
    const obs = new ResizeObserver(entries => setOhH(entries[0].contentRect.height));
    obs.observe(ohRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="space-y-6 p-8">

      {/* ══ SECTION 1 — Operational Intelligence (Critical Issues + Live Event Wire) */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Operational Intelligence — Critical Issues · Live Event Wire</SL>
        <div className="col-span-12">
          <CriticalAndLiveWidget />
        </div>
      </div>

      {/* ══ SECTION 2 — Operational Health + Three Pillar Trend (side by side) */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Operational Health & Trend Intelligence — FMS · MEPS · RTSS · IMDS</SL>

        {/* Left: Operational Health — hugs content, sets row height */}
        <div className="col-span-12 xl:col-span-4" style={{ alignSelf: "start" }}>
          <div ref={ohRef} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <div style={{ padding: "16px 18px 11px", borderBottom: "1px solid #f1f5f9" }}>
              <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 2px", lineHeight: "18px" }}>Operational Health</p>
              <p style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8", margin: 0 }}>Weighted blend — safety · efficiency · compliance · maintenance · readiness</p>
            </div>

            {/* Body */}
            <div>

              {/* Composite Score — card with border */}
              <div style={{ margin: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 10, display: "flex", alignItems: "center", gap: 16, padding: "14px 16px" }}>
                {/* Donut ring */}
                <svg width={64} height={64} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
                  {/* Track */}
                  <circle cx={32} cy={32} r={25} fill="none" stroke="#e2e8f0" strokeWidth={6} />
                  {/* Progress arc — 71% */}
                  <circle
                    cx={32} cy={32} r={25} fill="none"
                    stroke="#1b59f8" strokeWidth={6}
                    strokeDasharray="111.53 45.55"
                    strokeLinecap="butt"
                    transform="rotate(-90 32 32)"
                  />
                  {/* Centre label */}
                  <text x={32} y={36} textAnchor="middle"
                    style={{ fontFamily: FF, fontSize: "14px", fontWeight: 700, fill: "#0f172a" }}>71</text>
                </svg>

                {/* Text block */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Composite Score</p>
                  <p style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8", margin: "0 0 8px" }}>Warehouse is operational but safety risks require immediate attention</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: "#0f172a" }}>71 / 100</span>
                    <span style={{ display: "inline-flex", padding: "2px 9px", borderRadius: 20, background: "#fffbeb", border: "1px solid #fef3c7", fontFamily: FF, fontSize: 9, fontWeight: 600, color: "#d97706", letterSpacing: "0.04em" }}>
                      MODERATE
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: "#e2e8f0", margin: "0 18px" }} />

              {/* 4 pillar rows */}
              {([
                { icon: Shield,      label: "Safety",     sources: "RTSS · MEPS", val: 64, delta: -5.4, status: "Declining",  statusColor: "#dc2626" as const, spark: SAFETY_SPARK,     sparkColor: "#ef4444" },
                { icon: Zap,         label: "Efficiency", sources: "FMS · RTSS",  val: 71, delta: -1.2, status: "Stable",     statusColor: "#d97706" as const, spark: EFFICIENCY_SPARK, sparkColor: "#1b59f8" },
                { icon: CheckCircle, label: "Compliance", sources: "MEPS · IMDS", val: 78, delta: +0.4, status: "Improving",  statusColor: "#16a34a" as const, spark: COMPLIANCE_SPARK, sparkColor: "#7c3aed" },
                { icon: Gauge,       label: "Readiness",  sources: "FMS · IMDS",  val: 71, delta: +1.2, status: "On Track",   statusColor: "#475569" as const, spark: SAFETY_SPARK,     sparkColor: "#475569" },
              ]).map((row, i, arr) => {
                const up = row.delta >= 0;
                const Icon = row.icon;
                return (
                  <div key={row.label}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 18px", cursor: "default", transition: "background 0.12s" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                      {/* Avatar */}
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={16} color="#475569" />
                      </div>
                      {/* Label + status */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "#0f172a", margin: "0 0 2px" }}>{row.label}</p>
                        <p style={{ fontFamily: FF, fontSize: 8, color: "#94a3b8", margin: 0 }}>{row.status}</p>
                      </div>
                      {/* Delta badge */}
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0, fontFamily: FF, fontSize: 10, fontWeight: 700, color: up ? "#16a34a" : "#dc2626" }}>
                        {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {Math.abs(row.delta).toFixed(1)}
                      </span>
                      {/* Score */}
                      <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                        <p style={{ fontFamily: FF, fontSize: 14, fontWeight: 700, color: "#475569", margin: 0, lineHeight: 1 }}>{row.val}</p>
                      </div>
                    </div>
                    {i < arr.length - 1 && <div style={{ height: 1, background: "#f1f5f9", margin: "0 18px" }} />}
                  </div>
                );
              })}

            </div>

            {/* Bottom padding */}
            <div style={{ height: 20, flexShrink: 0 }} />

          </div>
        </div>

        {/* Centre: Three Pillar Trend — matches OH height */}
        <div className="col-span-12 xl:col-span-4 flex" style={{ height: ohH }}>
          <ThreePillarTrendWidget />
        </div>

        {/* Right: Notifications — matches OH height, scrolls overflow */}
        <div className="col-span-12 xl:col-span-4 flex" style={{ height: ohH }}>
          <NotificationsWidget />
        </div>

      </div>

      {/* ══ SECTION 5 — Effective Capacity ══════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Effective Capacity — Deployable Right Now</SL>
        <div className="col-span-12">
          <EffectiveCapacityWidget />
        </div>
      </div>

      {/* ══ SECTION 6 — Risk × Performance ══════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Risk × Performance — Operator Intelligence</SL>

        <div className="col-span-12 flex" style={{ minHeight: 380 }}>
          <OperatorQuadrantWidget />
        </div>
      </div>

      {/* ══ SECTION 7 — Roll-Call ════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        <SL>Roll-Call — Equipment & Operator Reliability Scores</SL>

        <div className="col-span-12" style={{ minHeight: 360 }}>
          <RollCallWidget />
        </div>
      </div>

    </div>
  );
}
