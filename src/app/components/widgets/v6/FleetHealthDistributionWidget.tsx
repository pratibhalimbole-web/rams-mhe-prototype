import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { equipmentHealthDataByType } from "../../../pages/mhe/FMSDashboard";

const FF = "Inter, sans-serif";

const HEALTH_COLORS: Record<string, string> = {
  "No Issues":       "#1e40af",
  "Healthy (Green)": "#3b82f6",
  "Warning (Amber)": "#60a5fa",
  "Critical (Red)":  "#93c5fd",
};

const HEALTH_LABELS: Record<string, string> = {
  "No Issues":       "No Issues",
  "Healthy (Green)": "Healthy",
  "Warning (Amber)": "Warning",
  "Critical (Red)":  "Critical",
};

const filterStyle: React.CSSProperties = {
  height: "32px",
  width: "auto",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "10px",
  color: "#0f172a",
  fontFamily: FF,
  fontWeight: 400,
};

export function FleetHealthDistributionWidget() {
  const [filter, setFilter] = useState("Overall");
  const data: any[] = equipmentHealthDataByType[filter] ?? equipmentHealthDataByType["Overall"];
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Fleet Equipment Health Distribution</p>
          <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Fleet equipment health status across all MHE assets.</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Overall">Overall</SelectItem>
            <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
            <SelectItem value="Reach Truck">Reach Truck</SelectItem>
            <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body: donut + legend */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "24px 28px", gap: 32 }}>

        {/* Donut */}
        <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              dataKey="value"
              cx={76}
              cy={76}
              innerRadius={52}
              outerRadius={76}
              startAngle={90}
              endAngle={-270}
              stroke="#ffffff"
              strokeWidth={2}
              paddingAngle={2}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={HEALTH_COLORS[d.name] ?? "#e2e8f0"} />
              ))}
            </Pie>
          </PieChart>
          {/* Centre */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: FF, fontSize: 26, fontWeight: 600, color: "#0f172a", lineHeight: 1 }}>{total}</span>
            <span style={{ fontFamily: FF, fontSize: 10, color: "#64748b", marginTop: 4 }}>Total MHEs</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          {data.map((d) => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: HEALTH_COLORS[d.name] ?? "#e2e8f0", flexShrink: 0 }} />
              <span style={{ fontFamily: FF, fontSize: 13, color: "#334155", flex: 1 }}>{HEALTH_LABELS[d.name] ?? d.name}</span>
              <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{d.value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
