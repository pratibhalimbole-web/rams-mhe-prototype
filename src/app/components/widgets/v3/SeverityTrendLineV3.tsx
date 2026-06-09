import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const MHE_LIST = Array.from({ length: 12 }, (_, i) => `MHE_${String(i + 1).padStart(2, "0")}`);

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL  = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function shortDate(d: Date) { return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`; }
function fullDate(d: Date)  { return `${MONTHS_FULL[d.getMonth()]} ${d.getDate()}`; }

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateData(mhe: string, dateRange: string) {
  const seed = mhe.charCodeAt(4) * 1000 + mhe.charCodeAt(5) + dateRange.length;
  const rand = seededRandom(seed);
  const now = new Date();

  if (dateRange === "last_24_hours") {
    return Array.from({ length: 24 }, (_, i) => ({
      date: `${String(i).padStart(2, "0")}:00`,
      tooltipDate: `${String(i).padStart(2, "0")}:00`,
      value: Math.round(2 + rand() * 18),
      totalInspection: Math.round(1 + rand() * 7),
      operatorInvolved: Math.round(1 + rand() * 5),
      noIssues: Math.round(1 + rand() * 6),
      green: Math.round(rand() * 3),
      amber: Math.round(rand() * 2),
      red: Math.round(rand() * 2),
    }));
  } else if (dateRange === "last_7_days") {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      date: day,
      tooltipDate: day,
      value: Math.round(2 + rand() * 18),
      totalInspection: Math.round(2 + rand() * 8),
      operatorInvolved: Math.round(1 + rand() * 6),
      noIssues: Math.round(1 + rand() * 6),
      green: Math.round(rand() * 3),
      amber: Math.round(rand() * 3),
      red: Math.round(rand() * 2),
    }));
  } else {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - 29 + i);
      return {
        date: shortDate(d),
        tooltipDate: fullDate(d),
        value: Math.round(2 + rand() * 18),
        totalInspection: Math.round(2 + rand() * 8),
        operatorInvolved: Math.round(1 + rand() * 6),
        noIssues: Math.round(1 + rand() * 6),
        green: Math.round(rand() * 3),
        amber: Math.round(rand() * 3),
        red: Math.round(rand() * 2),
      };
    });
  }
}

function getFooterRange(dateRange: string): string {
  const now = new Date();
  if (dateRange === "last_30_days") {
    const start = new Date(now); start.setDate(now.getDate() - 29);
    const end   = new Date(now);
    return `${shortDate(start)} – ${shortDate(end)}`;
  } else if (dateRange === "last_7_days") {
    const start = new Date(now); start.setDate(now.getDate() - 6);
    return `${shortDate(start)} – ${shortDate(now)}`;
  } else {
    return `Today, 00:00 – 23:00`;
  }
}

function CustomTooltip({ active, payload, selectedMhe }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "var(--w-bg)",
      border: "1px solid #e8e8e8",
      borderRadius: "6px",
      padding: "12px 16px",
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      minWidth: "203px",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "0.64px solid #e2e8f0", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "9px", height: "20px", background: "#2563eb", borderRadius: "4px", flexShrink: 0 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px", color: "#0a0a0a" }}>{d.tooltipDate}</span>
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "10px", color: "#0a0a0a" }}>{selectedMhe}</span>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px" }}>
        {([["Total Inspection:", String(d.totalInspection).padStart(2, "0")], ["Operator Involved:", String(d.operatorInvolved).padStart(2, "0")]] as [string, string][]).map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", color: "#0a0a0a" }}>{label}</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "10px", color: "#0a0a0a" }}>{val}</span>
          </div>
        ))}
      </div>

      <div style={{ height: "0.64px", background: "var(--w-border)", marginBottom: "6px" }} />

      {/* Severity breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "10px", color: "#0a0a0a", marginBottom: "2px" }}>Severity Breakdown</span>
        {([["No Issues:", String(d.noIssues).padStart(2, "0")], ["Green:", String(d.green).padStart(2, "0")], ["Amber:", String(d.amber).padStart(2, "0")], ["Red:", String(d.red).padStart(2, "0")]] as [string, string][]).map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", color: "#0a0a0a" }}>{label}</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "10px", color: "#0a0a0a" }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const filterStyle: React.CSSProperties = {
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

export function SeverityTrendLineV3({ hideInsight }: { hideInsight?: boolean } = {}) {
  const [selectedMhe, setSelectedMhe] = useState("MHE_02");
  const [dateRange, setDateRange] = useState("last_30_days");

  const chartData = useMemo(() => generateData(selectedMhe, dateRange), [selectedMhe, dateRange]);
  const footerRange = useMemo(() => getFooterRange(dateRange), [dateRange]);

  // minWidth ensures labels never overlap; scroll triggers when container < minWidth
  const chartMinWidth = dateRange === "last_30_days" ? "1600px"
    : dateRange === "last_24_hours" ? "1400px"
    : undefined;
  const needsScroll = !!chartMinWidth;

  return (
    <div style={{
      background: "var(--w-bg)",
      border: "1px solid var(--w-border)",
      borderRadius: "12px",
      padding: "1px",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 16px 14px 16px",
        borderBottom: "1px solid var(--w-divider)",
        flexShrink: 0,
        height: "81px",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>
            MHE Inspection Severity Timeline
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>
            Inspection severity patterns across recent MHE inspections.
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Select value={selectedMhe} onValueChange={setSelectedMhe}>
            <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
            <SelectContent>
              {MHE_LIST.map((mhe) => (
                <SelectItem key={mhe} value={mhe} style={{ whiteSpace: "nowrap" }}>{mhe}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="last_24_hours" style={{ whiteSpace: "nowrap" }}>Last 24 Hours</SelectItem>
              <SelectItem value="last_7_days" style={{ whiteSpace: "nowrap" }}>Last 7 Days</SelectItem>
              <SelectItem value="last_30_days" style={{ whiteSpace: "nowrap" }}>Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart — position:relative/absolute gives the scrollbar its own space */}
      <div style={{ flex: 1, padding: "12px 14px 0 14px", minHeight: 0, position: "relative" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          overflowX: needsScroll ? "auto" : "hidden",
          overflowY: "hidden",
        }}>
          <div style={{ width: "100%", minWidth: chartMinWidth, height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }}
                  axisLine={false}
                  tickLine={false}
                  dy={6}
                  interval={0}
                />
                <YAxis
                  domain={[0, 20]}
                  ticks={[0, 5, 10, 15, 20]}
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-4}
                />
                <Tooltip
                  content={<CustomTooltip selectedMhe={selectedMhe} />}
                  cursor={{ stroke: "var(--w-border)", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  dot={{ fill: "#2563eb", r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: "#2563eb", r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {!hideInsight && (
        <div style={{
          borderTop: "1px solid var(--w-divider)",
          padding: "11px 16px 0 16px",
          flexShrink: 0,
          height: "59.5px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {selectedMhe} reported most, mainly has red severity = 06
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {footerRange}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
