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
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0 }}>
        <p style={{ fontFamily: FF, fontSize: 14, fontWeight: 700, color: "var(--w-text-1)", margin: "0 0 4px" }}>Fleet Equipment Health Distribution</p>
        <p style={{ fontFamily: FF, fontSize: 11, color: "var(--w-text-3)", margin: 0 }}>Fleet equipment warranty validity status across all MHE assets.</p>
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
              stroke="var(--w-bg)"
              strokeWidth={3}
              paddingAngle={3}
            >
              {data.map((d: any, i: number) => (
                <Cell key={i} fill={HEALTH_COLORS[d.name] ?? "var(--w-border)"} />
              ))}
            </Pie>
          </PieChart>
          {/* Centre */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: FF, fontSize: 32, fontWeight: 600, color: "var(--w-text-1)", lineHeight: 1 }}>{total}</span>
            <span style={{ fontFamily: FF, fontSize: 11, color: "var(--w-text-3)", marginTop: 6 }}>Total MHEs</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {data.map((d: any) => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: HEALTH_COLORS[d.name] ?? "var(--w-border)", flexShrink: 0 }} />
              <span style={{ fontFamily: FF, fontSize: 13, color: "#334155" }}>{HEALTH_LABELS[d.name] ?? d.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
