import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

// Common dashboard blue palette
const BLUE_SHADES = ["#1B59F8", "#4C7DFF", "#7BA3FF", "#8FB2FF", "#C9DBFF"];

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

  return labels.map((date, i) => {
    const point: Record<string, any> = { date };
    mhes.forEach((mhe) => {
      const seed = mhe.charCodeAt(0) * 100 + mhe.charCodeAt(mhe.length - 1) * 10 + i;
      const rand = seededRandom(seed);
      point[mhe] = Math.round(1 + rand() * 7);
    });
    return point;
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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "6px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "150px" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "11px", color: "#0f172a", margin: "0 0 8px", borderBottom: "0.64px solid #e2e8f0", paddingBottom: "6px" }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: p.color, flexShrink: 0, display: "inline-block" }} />
              {p.dataKey}
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#0f172a" }}>{p.value}</span>
          </div>
        ))}
      </div>
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
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Findings trend per MHE over time</span>
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
      <div style={{ flex: 1, padding: "12px 14px 0 4px", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              dy={6}
              interval={dateRange === "last_30_days" ? 4 : 0}
            />
            <YAxis
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              dx={-4}
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
            {mhes.map((mhe, i) => (
              <Line
                key={mhe}
                type="monotone"
                dataKey={mhe}
                stroke={BLUE_SHADES[i]}
                strokeWidth={1.5}
                dot={{ fill: BLUE_SHADES[i], r: 3, strokeWidth: 0 }}
                activeDot={{ fill: BLUE_SHADES[i], r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend — below x-axis, circles */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", padding: "8px 16px 12px", justifyContent: "center" }}>
        {mhes.map((mhe, i) => (
          <span key={mhe} style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: BLUE_SHADES[i], display: "inline-block", flexShrink: 0 }} />
            {mhe}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f1f5f9", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            FL-007 leads with highest findings this period
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            May 7 – May 13, 2026
          </span>
        </div>
      </div>
    </div>
  );
}
