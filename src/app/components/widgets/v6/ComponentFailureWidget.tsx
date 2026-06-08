import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { componentFailureDataByType } from "../../../pages/mhe/FMSDashboard";

const FF = "Inter, sans-serif";

const SEG_COLORS = {
  "No Issues": "#1b59f8",
  "Green":     "#4c7dff",
  "Amber":     "#8fb2ff",
  "Red":       "#c9dbff",
} as const;

const SEG_LABELS: Record<keyof typeof SEG_COLORS, string> = {
  "No Issues": "No Issues",
  "Green":     "Healthy",
  "Amber":     "Warning",
  "Red":       "Critical",
};

const filterStyle: React.CSSProperties = {
  height: "36px",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#0f172a",
  fontFamily: FF,
  fontWeight: 400,
  width: "200px",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontFamily: FF }}>
      <p style={{ fontWeight: 600, fontSize: 12, color: "#0f172a", margin: "0 0 6px" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 2 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>{SEG_LABELS[p.dataKey as keyof typeof SEG_COLORS] ?? p.dataKey}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#0f172a" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ComponentFailureWidget() {
  const [filter, setFilter] = useState("Electric Forklift");
  const data: any[] = componentFailureDataByType[filter] ?? [];

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, gap: 16 }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Component Failure Distribution</p>
          <p style={{ fontFamily: FF, fontSize: 11, color: "#94a3b8", margin: 0 }}>Frequency of inspection findings units.</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
            <SelectItem value="Reach Truck">Reach Truck</SelectItem>
            <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body: chart + legend */}
      <div style={{ flex: 1, padding: "20px 16px 0", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }} barSize={42}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="part"
                tick={{ fontFamily: FF, fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                ticks={[0, 7, 14, 21, 28]}
                domain={[0, 28]}
                tick={{ fontFamily: FF, fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                dx={-4}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="No Issues" stackId="a" fill={SEG_COLORS["No Issues"]} />
              <Bar dataKey="Green"     stackId="a" fill={SEG_COLORS["Green"]} />
              <Bar dataKey="Amber"     stackId="a" fill={SEG_COLORS["Amber"]} />
              <Bar dataKey="Red"       stackId="a" fill={SEG_COLORS["Red"]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "14px 0 18px", flexShrink: 0 }}>
          {(Object.entries(SEG_LABELS) as [keyof typeof SEG_COLORS, string][]).map(([key, label]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: SEG_COLORS[key], flexShrink: 0 }} />
              <span style={{ fontFamily: FF, fontSize: 12, color: "#64748b" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
