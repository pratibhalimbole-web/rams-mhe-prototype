import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

type PartRow = { name: string; red: number; amber: number };
type DataKey = string;

const ALL_DATA: Record<DataKey, PartRow[]> = {
  "all|all":               [{ name: "Hydraulic seal",  red: 3, amber: 8 }, { name: "Forks alignment", red: 2, amber: 6 }, { name: "Lift chain wear", red: 1, amber: 3 }, { name: "Brake pads", red: 0, amber: 3 }, { name: "Battery cells", red: 1, amber: 2 }],
  "forklift|all":          [{ name: "Hydraulic seal",  red: 2, amber: 5 }, { name: "Lift chain wear", red: 1, amber: 3 }, { name: "Brake pads", red: 0, amber: 2 }, { name: "Battery cells", red: 1, amber: 2 }, { name: "Forks alignment", red: 1, amber: 1 }],
  "reach-truck|all":       [{ name: "Forks alignment", red: 1, amber: 4 }, { name: "Hydraulic seal",  red: 1, amber: 3 }, { name: "Mast wear", red: 0, amber: 2 }, { name: "Battery cells", red: 0, amber: 1 }, { name: "Brake pads", red: 0, amber: 1 }],
  "pallet-jack|all":       [{ name: "Brake pads",      red: 0, amber: 2 }, { name: "Battery cells",   red: 0, amber: 1 }, { name: "Hydraulic seal", red: 0, amber: 1 }, { name: "Lift chain wear", red: 0, amber: 1 }, { name: "Forks alignment", red: 0, amber: 1 }],
  "stacker|all":           [{ name: "Lift chain wear", red: 1, amber: 2 }, { name: "Hydraulic seal",  red: 0, amber: 1 }, { name: "Battery cells", red: 0, amber: 1 }, { name: "Brake pads", red: 0, amber: 1 }, { name: "Forks alignment", red: 0, amber: 1 }],
  // Toyota
  "all|toyota":            [{ name: "Battery cells",   red: 2, amber: 6 }, { name: "Hydraulic seal",  red: 1, amber: 4 }, { name: "Brake pads", red: 1, amber: 3 }, { name: "Forks alignment", red: 0, amber: 2 }, { name: "Lift chain wear", red: 0, amber: 2 }],
  "forklift|toyota":       [{ name: "Battery cells",   red: 2, amber: 5 }, { name: "Hydraulic seal",  red: 1, amber: 3 }, { name: "Brake pads", red: 0, amber: 2 }, { name: "Forks alignment", red: 0, amber: 1 }, { name: "Lift chain wear", red: 0, amber: 1 }],
  "reach-truck|toyota":    [{ name: "Mast wear",       red: 1, amber: 3 }, { name: "Battery cells",   red: 0, amber: 2 }, { name: "Forks alignment", red: 0, amber: 2 }, { name: "Hydraulic seal", red: 0, amber: 1 }, { name: "Brake pads", red: 0, amber: 1 }],
  // TATA
  "all|tata":              [{ name: "Hydraulic seal",  red: 3, amber: 5 }, { name: "Lift chain wear", red: 2, amber: 4 }, { name: "Brake pads", red: 1, amber: 3 }, { name: "Battery cells", red: 0, amber: 2 }, { name: "Forks alignment", red: 0, amber: 1 }],
  "forklift|tata":         [{ name: "Hydraulic seal",  red: 2, amber: 4 }, { name: "Lift chain wear", red: 1, amber: 3 }, { name: "Brake pads", red: 1, amber: 2 }, { name: "Battery cells", red: 0, amber: 1 }, { name: "Forks alignment", red: 0, amber: 1 }],
  // Mahindra
  "all|mahindra":          [{ name: "Forks alignment", red: 2, amber: 5 }, { name: "Battery cells",   red: 1, amber: 4 }, { name: "Hydraulic seal", red: 1, amber: 2 }, { name: "Brake pads", red: 0, amber: 2 }, { name: "Lift chain wear", red: 0, amber: 1 }],
  "stacker|mahindra":      [{ name: "Battery cells",   red: 1, amber: 3 }, { name: "Lift chain wear", red: 0, amber: 2 }, { name: "Hydraulic seal", red: 0, amber: 1 }, { name: "Brake pads", red: 0, amber: 1 }, { name: "Forks alignment", red: 0, amber: 1 }],
  // Raymond
  "all|raymond":           [{ name: "Battery cells",   red: 2, amber: 4 }, { name: "Brake pads",      red: 1, amber: 3 }, { name: "Hydraulic seal", red: 0, amber: 3 }, { name: "Lift chain wear", red: 0, amber: 2 }, { name: "Forks alignment", red: 0, amber: 1 }],
  "pallet-jack|raymond":   [{ name: "Brake pads",      red: 1, amber: 2 }, { name: "Battery cells",   red: 0, amber: 2 }, { name: "Hydraulic seal", red: 0, amber: 1 }, { name: "Lift chain wear", red: 0, amber: 1 }, { name: "Forks alignment", red: 0, amber: 1 }],
  // Toyota Industries
  "all|toyota-industries": [{ name: "Lift chain wear", red: 1, amber: 5 }, { name: "Hydraulic seal",  red: 1, amber: 3 }, { name: "Battery cells", red: 0, amber: 3 }, { name: "Brake pads", red: 0, amber: 2 }, { name: "Forks alignment", red: 0, amber: 1 }],
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
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const red   = payload.find((p: any) => p.dataKey === "red")?.value   ?? 0;
  const amber = payload.find((p: any) => p.dataKey === "amber")?.value ?? 0;
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "6px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "140px" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "11px", color: "var(--w-text-1)", margin: "0 0 8px" }}>{label}</p>
      {([["Red", "#ef4444", red], ["Amber", "#f59e0b", amber]] as [string, string, number][]).map(([l, c, v]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: c, flexShrink: 0, display: "inline-block" }} />{l}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "var(--w-text-1)" }}>{v}</span>
        </div>
      ))}
      <div style={{ height: "0.5px", background: "var(--w-border)", margin: "6px 0 4px" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>Total</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "var(--w-text-1)" }}>{red + amber}</span>
      </div>
    </div>
  );
}

export function TopFailingPartsV3() {
  const [type, setType] = useState("all");
  const [oem,  setOem]  = useState("all");
  const key = `${type}|${oem}`;
  const data = ALL_DATA[key] ?? ALL_DATA[`${type}|all`] ?? ALL_DATA["all|all"];

  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>Top Failing Parts</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>Findings by part · last 30 days</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <Select value={oem} onValueChange={setOem}>
            <SelectTrigger style={filterStyle}><SelectValue placeholder="All OEMs" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All OEMs</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="toyota-industries">Toyota Industries</SelectItem>
              <SelectItem value="tata">TATA</SelectItem>
              <SelectItem value="mahindra">Mahindra</SelectItem>
              <SelectItem value="raymond">Raymond</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, padding: "14px 16px 12px 4px", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 2, right: 8, left: 0, bottom: 2 }} barSize={10} barCategoryGap="30%">
            <CartesianGrid horizontal={false} stroke="var(--w-bg-muted)" strokeDasharray="" />
            <XAxis
              type="number"
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-3)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }}
              axisLine={false}
              tickLine={false}
              width={88}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--w-bg-page)" }} />
            <Bar dataKey="red"   fill="#ef4444" stackId="s" radius={[0, 0, 0, 0]} />
            <Bar dataKey="amber" fill="#f59e0b" stackId="s" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Hydraulic seal leads with highest findings
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            May 7 – May 13, 2026
          </span>
        </div>
      </div>
    </div>
  );
}
