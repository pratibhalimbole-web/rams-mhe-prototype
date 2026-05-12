import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import chevronIcon from "../../../../assets/icon-chevron-down.png";

const chartData = [
  { date: "Mar 14", value: 2,  totalInspection: 2, operatorInvolved: 2, noIssues: 1, green: 1, amber: 0, red: 0 },
  { date: "Mar 15", value: 4,  totalInspection: 3, operatorInvolved: 2, noIssues: 2, green: 1, amber: 0, red: 0 },
  { date: "Mar 16", value: 5,  totalInspection: 3, operatorInvolved: 3, noIssues: 6, green: 2, amber: 1, red: 2 },
  { date: "Mar 17", value: 8,  totalInspection: 4, operatorInvolved: 3, noIssues: 3, green: 1, amber: 2, red: 1 },
  { date: "Mar 18", value: 10, totalInspection: 5, operatorInvolved: 4, noIssues: 4, green: 2, amber: 1, red: 2 },
  { date: "Mar 19", value: 12, totalInspection: 6, operatorInvolved: 4, noIssues: 5, green: 2, amber: 2, red: 1 },
  { date: "Mar 20", value: 14, totalInspection: 5, operatorInvolved: 4, noIssues: 4, green: 2, amber: 1, red: 1 },
  { date: "Mar 21", value: 16, totalInspection: 6, operatorInvolved: 5, noIssues: 5, green: 2, amber: 1, red: 2 },
  { date: "Mar 22", value: 17, totalInspection: 7, operatorInvolved: 5, noIssues: 6, green: 2, amber: 2, red: 1 },
  { date: "Mar 23", value: 19, totalInspection: 8, operatorInvolved: 6, noIssues: 6, green: 3, amber: 2, red: 2 },
];

function DropdownButton({ label, width }: { label: string; width: number }) {
  return (
    <div
      style={{
        width,
        height: "32px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 13px",
        boxSizing: "border-box",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", color: "#0f172a", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <img src={chevronIcon} alt="" style={{ width: "16px", height: "16px" }} />
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "#ffffff",
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
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px", color: "#0a0a0a" }}>{d.date.replace("Mar", "March")}</span>
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "10px", color: "#0a0a0a" }}>MHE_02</span>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px" }}>
        {[
          ["Total Inspection:", String(d.totalInspection).padStart(2, "0")],
          ["Operator Involved:", String(d.operatorInvolved).padStart(2, "0")],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", color: "#0a0a0a" }}>{label}</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "10px", color: "#0a0a0a" }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: "0.64px", background: "#e2e8f0", marginBottom: "6px" }} />

      {/* Severity breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "10px", color: "#0a0a0a", marginBottom: "2px" }}>Severity Breakdown</span>
        {[
          ["No Issues:", String(d.noIssues).padStart(2, "0")],
          ["Green:", String(d.green).padStart(2, "0")],
          ["Amber:", String(d.amber).padStart(2, "0")],
          ["Red:", String(d.red).padStart(2, "0")],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", color: "#0a0a0a" }}>{label}</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "10px", color: "#0a0a0a" }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeverityTrendLineV3() {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
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
        borderBottom: "1px solid #f1f5f9",
        flexShrink: 0,
        height: "81px",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>
            MHE Inspection Severity Timeline
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>
            Inspection severity patterns across recent MHE inspections.
          </span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <DropdownButton label="MHE_02" width={135} />
          <DropdownButton label="Last 30 Days" width={115} />
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, padding: "12px 14px 0 14px", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              domain={[0, 20]}
              ticks={[0, 5, 10, 15, 20]}
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
            <Line
              type="linear"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={{ fill: "#2563eb", r: 3, strokeWidth: 0 }}
              activeDot={{ fill: "#2563eb", r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insight footer */}
      <div style={{
        borderTop: "1px solid #f1f5f9",
        padding: "11px 16px 0 16px",
        flexShrink: 0,
        height: "59.5px",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>
            MHE_012 reported most, mainly has red severity = 06
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#64748b" }}>
            May 2 – May 8
          </span>
        </div>
      </div>
    </div>
  );
}
