import React from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { ShieldCheck, AlertTriangle, AlertCircle, Eye } from "lucide-react";
import { KpiCardV3 } from "../../components/widgets/v3/KpiCardV3";
import { CriticalIssuesBanner } from "../../components/widgets/CriticalIssuesBanner";
import { CriticalIssuesModal } from "../../components/widgets/CriticalIssuesModal";

// ─── Data (sourced from MHE reference dashboards) ─────────────────────────────

const EVENTS_DIST = [
  { name: "Speed Violation", value: 16, color: "#ef4444" },
  { name: "Impact Events",   value: 11, color: "#f59e0b" },
  { name: "Zone Violations", value: 9,  color: "#8b5cf6" },
  { name: "Near Miss",       value: 7,  color: "#f97316" },
  { name: "Break Mgmt",      value: 4,  color: "#1b59f8" },
  { name: "Compliance",      value: 3,  color: "#22c55e" },
];
const EVENTS_TOTAL = EVENTS_DIST.reduce((s, d) => s + d.value, 0);

const VIOLATION_TYPES = [
  { name: "Harsh Acceleration", count: 240 },
  { name: "Impact",             count: 148 },
  { name: "Oversped",           count: 97  },
  { name: "Non-load Distrib.",  count: 82  },
  { name: "Restrict. Zone",     count: 43  },
];

const INC_TREND = [
  { week: "Wk 1", critical: 0, high: 2, warning: 10 },
  { week: "Wk 2", critical: 1, high: 3, warning: 12 },
  { week: "Wk 3", critical: 0, high: 2, warning: 8  },
  { week: "Wk 4", critical: 2, high: 4, warning: 14 },
  { week: "Wk 5", critical: 0, high: 2, warning: 11 },
];

const SPD_BY_ZONE = [
  { zone: "Transit",    critical: 12, high: 34, warning: 87  },
  { zone: "Storage",    critical: 8,  high: 22, warning: 44  },
  { zone: "Loading",    critical: 5,  high: 18, warning: 38  },
  { zone: "Rack Aisle", critical: 3,  high: 11, warning: 26  },
  { zone: "Pedestrian", critical: 2,  high: 8,  warning: 19  },
];

const ZONE_IMPACTS = [
  { zone: "Storage B",  impacts: 14 },
  { zone: "Transit C",  impacts: 8  },
  { zone: "Loading D",  impacts: 6  },
  { zone: "Rack A",     impacts: 4  },
  { zone: "Entry Gate", impacts: 3  },
  { zone: "Charging",   impacts: 1  },
];

const MHE_SHIFTS = [
  { mhe: "MHE_001", sessions: [40, 44, 16, 16], optimal: 2 },
  { mhe: "MHE_002", sessions: [40, 44, 16, 16], optimal: 2 },
  { mhe: "MHE_003", sessions: [32, 38, 22, 8],  optimal: 2 },
  { mhe: "MHE_004", sessions: [28, 44, 20, 8],  optimal: 2 },
  { mhe: "MHE_005", sessions: [46, 38, 10, 6],  optimal: 1 },
];
const SESSION_LABELS = ["1st", "2nd", "3rd", "4th"];
const SESSION_COLORS = ["#bfdbfe", "#1b59f8", "#93c5fd", "#dbeafe"];

const OP_LEADERS = [
  { name: "Prakash Patil",   id: "OP-005", score: 88 },
  { name: "Ramesh Kulkarni", id: "OP-003", score: 82 },
  { name: "Sameer Sharma",   id: "OP-011", score: 78 },
  { name: "Pradeep Sharma",  id: "OP-007", score: 74 },
  { name: "Suniti Joshi",    id: "OP-009", score: 71 },
];

const MHE_LEADERS = [
  { id: "MHE_003", score: 90 },
  { id: "MHE_005", score: 85 },
  { id: "MHE_008", score: 80 },
  { id: "MHE_011", score: 76 },
  { id: "MHE_001", score: 70 },
];

const ACCOUNTABILITY = [
  { name: "Prakash Patil",   initials: "PP", oversped: 2,  fatigue: 1, rash: 1,  safety: 92, compliance: 96 },
  { name: "Ramesh Kulkarni", initials: "RK", oversped: 5,  fatigue: 3, rash: 2,  safety: 84, compliance: 88 },
  { name: "Sameer Sharma",   initials: "SS", oversped: 8,  fatigue: 2, rash: 3,  safety: 78, compliance: 82 },
  { name: "Pradeep Sharma",  initials: "PS", oversped: 11, fatigue: 4, rash: 5,  safety: 71, compliance: 74 },
  { name: "Suniti Joshi",    initials: "SJ", oversped: 14, fatigue: 6, rash: 7,  safety: 64, compliance: 68 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "#ffffff", border: "1px solid #e2e8f0",
  borderRadius: "12px", padding: "1px", display: "flex", flexDirection: "column", overflow: "hidden",
};

function SL({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
      <span style={{ fontWeight: 600, fontSize: "11px", letterSpacing: "0.08em", color: "#64748b", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
        {children}
      </span>
    </div>
  );
}

function WH({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #e2e8f0", flexShrink: 0, height: "80px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>{title}</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>{sub}</span>
      </div>
    </div>
  );
}

function WF({ insight, label = "Last 7 days · May 12 – May 18, 2026" }: { insight: string; label?: string }) {
  return (
    <div style={{ borderTop: "1px solid #f1f5f9", padding: "11px 16px 0", flexShrink: 0, height: "59.5px", boxSizing: "border-box", overflow: "hidden" }}>
      <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{insight}</span>
      <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}

function scoreColor(s: number) {
  return s >= 85 ? "#22c55e" : s >= 70 ? "#f59e0b" : "#ef4444";
}

function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 12px", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <p style={{ margin: "0 0 2px", fontSize: "10px", fontWeight: 700, color: "#0f172a" }}>{d.name}</p>
      <p style={{ margin: 0, fontSize: "12px", fontWeight: 800, color: d.payload.color }}>{d.value} events</p>
    </div>
  );
}

function SimpleTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 12px", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: 130 }}>
      {label && <p style={{ margin: "0 0 5px", fontSize: "10px", fontWeight: 700, color: "#0f172a" }}>{label}</p>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 2 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "10px", color: "#64748b" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color ?? p.fill, display: "inline-block", flexShrink: 0 }} />
            {p.name}
          </span>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "#0f172a" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Variation3Tab() {
  const [issuesOpen, setIssuesOpen] = React.useState(false);

  return (
    <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
      <div className="grid grid-cols-12 gap-6">

        {/* ── Banner ── */}
        <SL>SAFETY ANALYTICS · REAL-TIME MONITORING</SL>
        <div className="col-span-12">
          <CriticalIssuesBanner count={11} trendNote="↑ 3 new today" onViewAll={() => setIssuesOpen(true)} />
        </div>

        {/* ── KPI Strip ── */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
          <KpiCardV3 label="Fleet Safety Score"  value="85%"  description="Overall fleet safety performance"     icon={ShieldCheck}   />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
          <KpiCardV3 label="Total Alerts"         value="05"   description="Active safety alerts this period"    icon={AlertTriangle}  />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
          <KpiCardV3 label="Near Misses"           value="14"   description="Near-miss incidents recorded"        icon={AlertCircle}   />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
          <KpiCardV3 label="PPE Compliance"        value="70%"  description="PPE adherence across all operators"  icon={Eye}           />
        </div>

        {/* ── Incident Intelligence ── */}
        <SL>INCIDENT INTELLIGENCE · EVENT DISTRIBUTION & TRENDS</SL>

        {/* Events Category Distribution — donut */}
        <div className="col-span-12 xl:col-span-4 flex" style={{ minHeight: "360px" }}>
          <div style={{ ...card, flex: 1 }}>
            <WH title="Events Category Distribution" sub="Breakdown of safety events by category" />
            <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={EVENTS_DIST} cx="50%" cy="45%" innerRadius="40%" outerRadius="65%" dataKey="value" paddingAngle={2}>
                    {EVENTS_DIST.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "22px", color: "#0f172a", lineHeight: 1 }}>{EVENTS_TOTAL}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#64748b", marginTop: 2 }}>Total Events</div>
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", padding: "0 18px 10px" }}>
              {EVENTS_DIST.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#64748b", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: "#0f172a" }}>{d.value}</span>
                </div>
              ))}
            </div>
            <WF insight="Speed Violation is the leading event category (16)" />
          </div>
        </div>

        {/* Top Violation Types — horizontal bar */}
        <div className="col-span-12 xl:col-span-4 flex" style={{ minHeight: "360px" }}>
          <div style={{ ...card, flex: 1 }}>
            <WH title="Top Violation Types" sub="Most frequent safety violation categories" />
            <div style={{ flex: 1, padding: "10px 12px 0 0", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={VIOLATION_TYPES} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }} barSize={11} barCategoryGap="28%">
                  <CartesianGrid horizontal={false} stroke="#f1f5f9" strokeDasharray="" />
                  <XAxis type="number" tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} width={98} />
                  <Tooltip content={<SimpleTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="count" name="Count" fill="#1b59f8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <WF insight="Harsh Acceleration leads with 240 recorded violations" />
          </div>
        </div>

        {/* Incident Trend — line chart */}
        <div className="col-span-12 xl:col-span-4 flex" style={{ minHeight: "360px" }}>
          <div style={{ ...card, flex: 1 }}>
            <WH title="Incident Trend" sub="Weekly incident count by severity level" />
            <div style={{ flex: 1, padding: "10px 14px 0 4px", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={INC_TREND} margin={{ top: 8, right: 12, left: -10, bottom: 8 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="" />
                  <XAxis dataKey="week" tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} dy={4} />
                  <YAxis tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} dx={-4} />
                  <Tooltip content={<SimpleTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" strokeWidth={1.5} dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="high"     name="High"     stroke="#f59e0b" strokeWidth={1.5} dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="warning"  name="Warning"  stroke="#1b59f8" strokeWidth={1.5} dot={{ fill: "#1b59f8", r: 3, strokeWidth: 0 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: "14px", padding: "6px 16px 8px", justifyContent: "center" }}>
              {([["Critical","#ef4444"],["High","#f59e0b"],["Warning","#1b59f8"]] as [string,string][]).map(([l,c]) => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#64748b" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "inline-block" }} />{l}
                </span>
              ))}
            </div>
            <WF insight="Warning incidents peaked at Wk 4 — 14 events recorded" />
          </div>
        </div>

        {/* ── Zone Intelligence ── */}
        <SL>ZONE INTELLIGENCE · SPEED VIOLATIONS & IMPACT ANALYSIS</SL>

        {/* Speed Violation by Zone — horizontal stacked bar */}
        <div className="col-span-12 xl:col-span-6 flex" style={{ minHeight: "340px" }}>
          <div style={{ ...card, flex: 1 }}>
            <WH title="Speed Violation by Zone" sub="Severity level per violation events by zone" />
            <div style={{ flex: 1, padding: "10px 14px 0 4px", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SPD_BY_ZONE} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 4 }} barSize={12} barCategoryGap="30%">
                  <CartesianGrid horizontal={false} stroke="#f1f5f9" strokeDasharray="" />
                  <XAxis type="number" tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="zone" tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} width={72} />
                  <Tooltip content={<SimpleTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="critical" name="Critical" fill="#ef4444" stackId="s" />
                  <Bar dataKey="high"     name="High"     fill="#f59e0b" stackId="s" />
                  <Bar dataKey="warning"  name="Warning"  fill="#1b59f8" stackId="s" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: "14px", padding: "6px 16px 8px", justifyContent: "center" }}>
              {([["Critical","#ef4444"],["High","#f59e0b"],["Warning","#1b59f8"]] as [string,string][]).map(([l,c]) => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#64748b" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: c, display: "inline-block" }} />{l}
                </span>
              ))}
            </div>
            <WF insight="Transit zone has highest speed violations across all severities" />
          </div>
        </div>

        {/* Zone vs No. of Impacts — vertical bar */}
        <div className="col-span-12 xl:col-span-6 flex" style={{ minHeight: "340px" }}>
          <div style={{ ...card, flex: 1 }}>
            <WH title="Zone vs No. of Impacts" sub="Total impact events recorded per warehouse zone" />
            <div style={{ flex: 1, padding: "10px 14px 0 4px", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ZONE_IMPACTS} margin={{ top: 8, right: 12, left: -10, bottom: 4 }} barSize={28} barCategoryGap="35%">
                  <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="" />
                  <XAxis dataKey="zone" tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} dy={4} />
                  <YAxis tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} dx={-4} />
                  <Tooltip content={<SimpleTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="impacts" name="Impacts" fill="#1b59f8" radius={[4, 4, 0, 0]}>
                    {ZONE_IMPACTS.map((d, i) => (
                      <Cell key={i} fill={d.impacts >= 10 ? "#ef4444" : d.impacts >= 5 ? "#f59e0b" : "#1b59f8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <WF insight="Storage B is the highest impact zone — 14 events recorded" />
          </div>
        </div>

        {/* ── Productivity Intelligence ── */}
        <SL>PRODUCTIVITY INTELLIGENCE · TASK & ASSET PERFORMANCE</SL>

        {/* Task Productivity Stats */}
        <div className="col-span-12 xl:col-span-4 flex" style={{ minHeight: "320px" }}>
          <div style={{ ...card, flex: 1 }}>
            <WH title="Task Productivity Overview" sub="Key operational efficiency metrics · today" />
            <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px", justifyContent: "center" }}>
              {/* Loaded vs Empty bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>Loaded vs Empty Travel</span>
                </div>
                <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2 }}>
                  <div style={{ width: "72%", background: "#1b59f8", borderRadius: "4px 0 0 4px" }} title="Loaded 72%" />
                  <div style={{ width: "28%", background: "#e2e8f0", borderRadius: "0 4px 4px 0" }} title="Empty 28%" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#1b59f8", fontWeight: 600 }}>72% Loaded</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#94a3b8" }}>28% Empty</span>
                </div>
              </div>
              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Avg Pallet Movt/hr", value: "15",     unit: "pallets/hr", color: "#1b59f8" },
                  { label: "Idle with Load Lost", value: "1h 20m", unit: "time lost",  color: "#f59e0b" },
                  { label: "Lost Hrs Due to Idle", value: "18h",   unit: "total today", color: "#ef4444" },
                  { label: "Warehouse Utilization", value: "18%",  unit: "fleet score",  color: "#22c55e" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#f8fafc", borderRadius: 9, padding: "10px 12px", border: "1px solid #f1f5f9" }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "8px", color: "#94a3b8", marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <WF insight="72% loaded travel · 18h lost to idle time today" />
          </div>
        </div>

        {/* MHE Utilization Across Shifts */}
        <div className="col-span-12 xl:col-span-8 flex" style={{ minHeight: "320px" }}>
          <div style={{ ...card, flex: 1 }}>
            <WH title="MHE Utilization Across Shifts" sub="Usage pattern analysis per session · top 5 MHEs" />
            {/* Session legend */}
            <div style={{ display: "flex", gap: "12px", padding: "8px 20px 0", alignItems: "center" }}>
              {SESSION_LABELS.map((l, i) => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#64748b" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: SESSION_COLORS[i], border: "1px solid #e2e8f0", display: "inline-block" }} />
                  {l} Session
                </span>
              ))}
              <span style={{ marginLeft: "auto", fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#94a3b8" }}>Optimal session highlighted in dark blue</span>
            </div>
            <div style={{ flex: 1, padding: "10px 20px", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
              {MHE_SHIFTS.map(m => (
                <div key={m.mhe} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "#0f172a", width: 58, flexShrink: 0 }}>{m.mhe}</span>
                  <div style={{ flex: 1, display: "flex", gap: "4px" }}>
                    {m.sessions.map((pct, si) => (
                      <div key={si} style={{ flex: pct, position: "relative" }}>
                        <div style={{ height: 28, background: SESSION_COLORS[si], borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", border: si === m.optimal ? "1.5px solid #1b59f8" : "1px solid #e2e8f0" }}>
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: si === m.optimal ? 700 : 400, color: si === m.optimal ? "#1b59f8" : "#64748b" }}>{pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "8px", color: "#94a3b8", width: 54, flexShrink: 0 }}>
                    Optimal: {SESSION_LABELS[m.optimal]} Sess.
                  </span>
                </div>
              ))}
            </div>
            <WF insight="2nd session consistently highest utilization across all MHEs" />
          </div>
        </div>

        {/* ── Leaderboards ── */}
        <SL>OPERATOR & MHE PERFORMANCE · PRODUCTIVITY LEADERBOARDS</SL>

        {/* Operator Productivity Leaderboard */}
        <div className="col-span-12 xl:col-span-6 flex" style={{ minHeight: "320px" }}>
          <div style={{ ...card, flex: 1 }}>
            <WH title="Operator Productivity Leaderboard" sub="Top 5 operators ranked by productivity score" />
            <div style={{ flex: 1, padding: "10px 16px 0 4px", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={OP_LEADERS} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }} barSize={14} barCategoryGap="30%">
                  <CartesianGrid horizontal={false} stroke="#f1f5f9" strokeDasharray="" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} width={108} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const op = OP_LEADERS.find(o => o.name === label);
                      return (
                        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 12px", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                          <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>{label}</p>
                          <p style={{ margin: "0 0 1px", fontSize: "9px", color: "#94a3b8" }}>{op?.id}</p>
                          <p style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: "#1b59f8" }}>Score: {payload[0]?.value}</p>
                        </div>
                      );
                    }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]}>
                    {OP_LEADERS.map((d, i) => <Cell key={i} fill={i === 0 ? "#1b59f8" : i === 1 ? "#4c7dff" : "#93c5fd"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <WF insight="Prakash Patil leads with productivity score of 88" />
          </div>
        </div>

        {/* MHE Productivity Leaderboard */}
        <div className="col-span-12 xl:col-span-6 flex" style={{ minHeight: "320px" }}>
          <div style={{ ...card, flex: 1 }}>
            <WH title="MHE Productivity Leaderboard" sub="Top 5 MHEs ranked by productivity score" />
            <div style={{ flex: 1, padding: "10px 16px 0 4px", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MHE_LEADERS} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }} barSize={14} barCategoryGap="30%">
                  <CartesianGrid horizontal={false} stroke="#f1f5f9" strokeDasharray="" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="id" tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} width={62} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 12px", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                          <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>{label}</p>
                          <p style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: "#1b59f8" }}>Score: {payload[0]?.value}</p>
                        </div>
                      );
                    }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]}>
                    {MHE_LEADERS.map((d, i) => <Cell key={i} fill={i === 0 ? "#1b59f8" : i === 1 ? "#4c7dff" : "#93c5fd"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <WF insight="MHE_003 is the top performing asset with score 90" />
          </div>
        </div>

        {/* ── Operator Accountability ── */}
        <SL>OPERATOR ACCOUNTABILITY REPORT · SAFETY & COMPLIANCE</SL>

        <div className="col-span-12">
          <div style={{ ...card }}>
            <WH title="Operator Accountability Report" sub="Overspeeding, fatigue, rash driving, and safety compliance by operator" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {["MHE Operator", "Oversped Count", "Fatigue Alerts", "Rash Driving", "Overall Safety Score", "Location Compliance"].map(h => (
                      <th key={h} style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, color: "#94a3b8", textAlign: "left", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ACCOUNTABILITY.map((op, i) => (
                    <tr key={op.name} style={{ borderBottom: i < ACCOUNTABILITY.length - 1 ? "1px solid #f8fafc" : "none" }}>
                      {/* Operator */}
                      <td style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eff6ff", border: "1px solid #dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: "#1b59f8" }}>{op.initials}</span>
                          </div>
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>{op.name}</span>
                        </div>
                      </td>
                      {/* Counts */}
                      {[op.oversped, op.fatigue, op.rash].map((val, ci) => (
                        <td key={ci} style={{ padding: "10px 16px" }}>
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: val <= 3 ? "#22c55e" : val <= 7 ? "#f59e0b" : "#ef4444" }}>{String(val).padStart(2, "0")}</span>
                        </td>
                      ))}
                      {/* Safety Score with bar */}
                      <td style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 64, height: 5, background: "#f1f5f9", borderRadius: 3, flexShrink: 0 }}>
                            <div style={{ width: `${op.safety}%`, height: "100%", background: scoreColor(op.safety), borderRadius: 3 }} />
                          </div>
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, color: scoreColor(op.safety) }}>{op.safety}%</span>
                        </div>
                      </td>
                      {/* Compliance */}
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, color: scoreColor(op.compliance) }}>{op.compliance}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <CriticalIssuesModal isOpen={issuesOpen} onClose={() => setIssuesOpen(false)} />
    </div>
  );
}
