import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const MHE_SETS: Record<string, string[]> = {
  all:           ["FL-007", "PJ-016", "RT-013", "FL-015", "PJ-003"],
  forklift:      ["FL-007", "FL-015", "FL-022", "FL-011", "FL-008"],
  "reach-truck": ["RT-013", "RT-007", "RT-002", "RT-018", "RT-005"],
  "pallet-jack": ["PJ-016", "PJ-003", "PJ-009", "PJ-021", "PJ-004"],
  stacker:       ["ST-001", "ST-005", "ST-003", "ST-007", "ST-002"],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateData(mhes: string[], dateRange: string) {
  const labels = dateRange === "last_7_days"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - 29 + i);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      });

  const redGen: Record<string, () => number>   = {};
  const amberGen: Record<string, () => number> = {};
  mhes.forEach((mhe) => {
    const base = mhe.split("").reduce((acc, c) => acc + c.charCodeAt(0) * 31, 0);
    redGen[mhe]   = seededRandom(base);
    amberGen[mhe] = seededRandom(base + 9999);
  });

  const perMheMax = Math.max(1, Math.floor(20 / mhes.length));

  return labels.map((date) => {
    const redBreakdown:   Record<string, number> = {};
    const amberBreakdown: Record<string, number> = {};
    mhes.forEach((mhe) => {
      redBreakdown[mhe]   = Math.round(1 + redGen[mhe]()   * perMheMax);
      amberBreakdown[mhe] = Math.round(1 + amberGen[mhe]() * perMheMax);
    });
    const red   = Object.values(redBreakdown).reduce((a, b) => a + b, 0);
    const amber = Object.values(amberBreakdown).reduce((a, b) => a + b, 0);
    return { date, red, amber, redBreakdown, amberBreakdown };
  });
}

const filterStyle: React.CSSProperties = {
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

const MAX_TOOLTIP_ROWS = 5;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const redSorted   = Object.entries(d.redBreakdown   as Record<string, number>).sort((a, b) => b[1] - a[1]);
  const amberSorted = Object.entries(d.amberBreakdown as Record<string, number>).sort((a, b) => b[1] - a[1]);
  const redVisible   = redSorted.slice(0, MAX_TOOLTIP_ROWS);
  const amberVisible = amberSorted.slice(0, MAX_TOOLTIP_ROWS);
  const remaining    = Math.max(redSorted.length - MAX_TOOLTIP_ROWS, 0);

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "6px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "200px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "6px", borderBottom: "0.64px solid #e2e8f0" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "11px", color: "#0f172a" }}>{label}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "#ef4444" }}>R: {d.red}</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "#f59e0b" }}>A: {d.amber}</span>
        </div>
      </div>
      {/* Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        {/* Red column */}
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, color: "#ef4444", margin: "0 0 4px", letterSpacing: "0.04em" }}>RED</p>
          {redVisible.map(([mhe, val]) => (
            <div key={mhe} style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "3px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>{mhe}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#0f172a" }}>{val}</span>
            </div>
          ))}
        </div>
        {/* Amber column */}
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, color: "#f59e0b", margin: "0 0 4px", letterSpacing: "0.04em" }}>AMBER</p>
          {amberVisible.map(([mhe, val]) => (
            <div key={mhe} style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "3px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>{mhe}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#0f172a" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
      {remaining > 0 && (
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#94a3b8", margin: "6px 0 0" }}>+{remaining} more MHEs</p>
      )}
    </div>
  );
}

export function TopMhesWithFindingsV3() {
  const [type, setType]           = useState("all");
  const [dateRange, setDateRange] = useState("last_7_days");

  const mhes = MHE_SETS[type] ?? MHE_SETS.all;
  const data = useMemo(() => generateData(mhes, dateRange), [mhes, dateRange]);

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>Top MHEs with Findings</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Red vs Amber severity trend over time</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger style={filterStyle}><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="forklift">Forklift</SelectItem>
              <SelectItem value="reach-truck">Reach Truck</SelectItem>
              <SelectItem value="pallet-jack">Pallet Jack</SelectItem>
              <SelectItem value="stacker">Stacker</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, padding: "12px 14px 0 14px", minHeight: 0, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, overflowX: "hidden", overflowY: "hidden" }}>
          <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dy={6}
                  interval={dateRange === "last_30_days" ? 4 : 0}
                />
                <YAxis
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-4}
                  domain={[0, 25]}
                  ticks={[0, 5, 10, 15, 20, 25]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="red"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: "#ef4444", r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="amber"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: "#f59e0b", r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Legend — circles below x-axis */}
      <div style={{ display: "flex", gap: "16px", padding: "8px 16px 12px", justifyContent: "center" }}>
        {([["Red Severity", "#ef4444"], ["Amber Severity", "#f59e0b"]] as [string, string][]).map(([label, color]) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f1f5f9", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Red severity consistently higher than Amber this period
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            May 7 – May 13, 2026
          </span>
        </div>
      </div>
    </div>
  );
}
