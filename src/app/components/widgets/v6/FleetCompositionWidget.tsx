import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const FF = "Inter, sans-serif";

type MheType = { name: string; value: number; color: string };

const OEM_DATA: Record<string, MheType[]> = {
  all_oems: [
    { name: "Forklift",             value: 10, color: "#1d4ed8" },
    { name: "BOPT",                 value:  5, color: "#3b82f6" },
    { name: "Reach Truck",          value:  8, color: "#60a5fa" },
    { name: "Electric Pallet Jack", value:  9, color: "#93c5fd" },
    { name: "Order Picker",         value:  6, color: "#bfdbfe" },
  ],
  toyota: [
    { name: "Forklift",             value: 2, color: "#1d4ed8" },
    { name: "BOPT",                 value: 1, color: "#3b82f6" },
    { name: "Electric Pallet Jack", value: 1, color: "#60a5fa" },
    { name: "Order Picker",         value: 1, color: "#bfdbfe" },
  ],
  crown: [
    { name: "Forklift",             value: 3, color: "#1d4ed8" },
    { name: "Reach Truck",          value: 2, color: "#60a5fa" },
    { name: "Order Picker",         value: 2, color: "#bfdbfe" },
  ],
  raymond: [
    { name: "Electric Pallet Jack", value: 4, color: "#60a5fa" },
    { name: "BOPT",                 value: 2, color: "#3b82f6" },
    { name: "Order Picker",         value: 1, color: "#bfdbfe" },
  ],
  jungheinrich: [
    { name: "Reach Truck",          value: 3, color: "#1d4ed8" },
    { name: "Forklift",             value: 2, color: "#3b82f6" },
    { name: "Electric Pallet Jack", value: 2, color: "#93c5fd" },
  ],
};

const OEM_LABELS: Record<string, string> = {
  all_oems:     "All OEMs",
  toyota:       "Toyota",
  crown:        "Crown",
  raymond:      "Raymond",
  jungheinrich: "Jungheinrich",
};

const filterStyle: React.CSSProperties = {
  height: "32px",
  width: "auto",
  background: "var(--w-bg)",
  border: "1px solid var(--w-border)",
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "10px",
  color: "var(--w-text-1)",
  fontFamily: FF,
  fontWeight: 400,
};

export function FleetCompositionWidget() {
  const [oem, setOem] = useState("toyota");
  const data  = OEM_DATA[oem];
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--w-border)", flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "var(--w-text-1)", margin: "0 0 2px" }}>Fleet Composition</p>
          <p style={{ fontFamily: FF, fontSize: 10, color: "var(--w-text-2)", margin: 0 }}>
            MHEs by type · {OEM_LABELS[oem]}
          </p>
        </div>
        <Select value={oem} onValueChange={setOem}>
          <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all_oems">All OEMs</SelectItem>
            <SelectItem value="toyota">Toyota</SelectItem>
            <SelectItem value="crown">Crown</SelectItem>
            <SelectItem value="raymond">Raymond</SelectItem>
            <SelectItem value="jungheinrich">Jungheinrich</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body: donut + legend */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "24px 28px", gap: 32 }}>

        {/* Donut */}
        <div style={{ position: "relative" as const, width: 160, height: 160, flexShrink: 0 }}>
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
              stroke="var(--w-bg)"
              strokeWidth={2}
              paddingAngle={2}
              cornerRadius={4}
            >
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
          {/* Centre */}
          <div style={{ position: "absolute" as const, inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" as const }}>
            <span style={{ fontFamily: FF, fontSize: 26, fontWeight: 600, color: "var(--w-text-1)", lineHeight: 1 }}>{total}</span>
            <span style={{ fontFamily: FF, fontSize: 10, color: "var(--w-text-2)", marginTop: 4 }}>Total MHEs</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          {data.map(d => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              <span style={{ fontFamily: FF, fontSize: 13, color: "#334155", flex: 1 }}>{d.name}</span>
              <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 600, color: "var(--w-text-1)" }}>{d.value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
