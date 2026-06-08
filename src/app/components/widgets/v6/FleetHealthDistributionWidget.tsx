import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { equipmentHealthData } from "../../../pages/mhe/FMSDashboard";

const FF = "Inter, sans-serif";

const HEALTH_COLORS: Record<string, string> = {
  "No Issues":       "#1e40af",
  "Healthy (Green)": "#3b82f6",
  "Warning (Amber)": "#93c5fd",
  "Critical (Red)":  "#c9dbff",
};

const HEALTH_LABELS: Record<string, string> = {
  "No Issues":       "No Issues",
  "Healthy (Green)": "Healthy",
  "Warning (Amber)": "Warning",
  "Critical (Red)":  "Critical",
};

const data: any[] = equipmentHealthData;
const total = data.reduce((s: number, d: any) => s + d.value, 0);

export function FleetHealthDistributionWidget() {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
        <p style={{ fontFamily: FF, fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Fleet Equipment Health Distribution</p>
        <p style={{ fontFamily: FF, fontSize: 11, color: "#94a3b8", margin: 0 }}>Fleet equipment warranty validity status across all MHE assets.</p>
      </div>

      {/* Body: donut + legend */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 40px", gap: 48 }}>

        {/* Donut */}
        <div style={{ position: "relative", width: 240, height: 240, flexShrink: 0 }}>
          <PieChart width={240} height={240}>
            <Pie
              data={data}
              dataKey="value"
              cx={116}
              cy={116}
              innerRadius={76}
              outerRadius={110}
              startAngle={90}
              endAngle={-270}
              stroke="#ffffff"
              strokeWidth={3}
              paddingAngle={3}
            >
              {data.map((d: any, i: number) => (
                <Cell key={i} fill={HEALTH_COLORS[d.name] ?? "#e2e8f0"} />
              ))}
            </Pie>
          </PieChart>
          {/* Centre */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: FF, fontSize: 32, fontWeight: 600, color: "#0f172a", lineHeight: 1 }}>{total}</span>
            <span style={{ fontFamily: FF, fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Total MHEs</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {data.map((d: any) => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: HEALTH_COLORS[d.name] ?? "#e2e8f0", flexShrink: 0 }} />
              <span style={{ fontFamily: FF, fontSize: 13, color: "#334155" }}>{HEALTH_LABELS[d.name] ?? d.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
