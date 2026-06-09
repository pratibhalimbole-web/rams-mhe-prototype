import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

type PartRow = { name: string; red: number; amber: number };

const ALL_DATA: Record<string, PartRow[]> = {
  "all|all":               [{ name: "Tyre",       red: 2, amber: 0 }, { name: "Display",    red: 1, amber: 0 }, { name: "Hydraulics", red: 0, amber: 1 }, { name: "Motor",      red: 0, amber: 1 }],
  "forklift|all":          [{ name: "Hydraulics", red: 2, amber: 1 }, { name: "Battery",    red: 1, amber: 1 }, { name: "Brake pads", red: 0, amber: 2 }, { name: "Forks",      red: 1, amber: 0 }],
  "reach-truck|all":       [{ name: "Mast",       red: 1, amber: 2 }, { name: "Forks",      red: 1, amber: 1 }, { name: "Battery",    red: 0, amber: 1 }, { name: "Hydraulics", red: 0, amber: 1 }],
  "pallet-jack|all":       [{ name: "Wheels",     red: 0, amber: 2 }, { name: "Handle",     red: 0, amber: 1 }, { name: "Brake pads", red: 0, amber: 1 }, { name: "Battery",    red: 0, amber: 1 }],
  "stacker|all":           [{ name: "Lift chain", red: 1, amber: 1 }, { name: "Battery",    red: 0, amber: 2 }, { name: "Mast",       red: 1, amber: 0 }, { name: "Hydraulics", red: 0, amber: 1 }],
  "all|toyota":            [{ name: "Battery",    red: 2, amber: 2 }, { name: "Hydraulics", red: 1, amber: 1 }, { name: "Tyre",       red: 1, amber: 0 }, { name: "Brake pads", red: 0, amber: 2 }],
  "all|toyota-industries": [{ name: "Lift chain", red: 1, amber: 2 }, { name: "Hydraulics", red: 1, amber: 1 }, { name: "Battery",    red: 0, amber: 2 }, { name: "Forks",      red: 0, amber: 1 }],
  "all|tata":              [{ name: "Hydraulics", red: 3, amber: 1 }, { name: "Lift chain", red: 2, amber: 1 }, { name: "Brake pads", red: 1, amber: 1 }, { name: "Battery",    red: 0, amber: 2 }],
  "all|mahindra":          [{ name: "Forks",      red: 2, amber: 1 }, { name: "Battery",    red: 1, amber: 2 }, { name: "Hydraulics", red: 1, amber: 0 }, { name: "Brake pads", red: 0, amber: 1 }],
  "all|raymond":           [{ name: "Battery",    red: 2, amber: 1 }, { name: "Brake pads", red: 1, amber: 1 }, { name: "Hydraulics", red: 0, amber: 2 }, { name: "Lift chain", red: 0, amber: 1 }],
};

const FS: React.CSSProperties = { height: "32px", width: "auto", background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "var(--w-text-1)", fontFamily: "Inter, sans-serif" };

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const red   = payload.find((p: any) => p.dataKey === "red")?.value   ?? 0;
  const amber = payload.find((p: any) => p.dataKey === "amber")?.value ?? 0;
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "6px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "130px" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "11px", color: "var(--w-text-1)", margin: "0 0 8px" }}>{label}</p>
      {([["Red", "#ef4444", red], ["Amber", "#f59e0b", amber]] as [string, string, number][]).map(([l, c, v]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: c, flexShrink: 0, display: "inline-block" }} />{l}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "var(--w-text-1)" }}>{v}</span>
        </div>
      ))}
      <div style={{ height: "1px", background: "var(--w-border)", margin: "6px 0 4px" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>Total</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "var(--w-text-1)" }}>{red + amber}</span>
      </div>
    </div>
  );
}

export function TopFailingPartsWidget() {
  const [oem,  setOem]  = useState("all");
  const [type, setType] = useState("all");

  const key  = `${type}|${oem}`;
  const data = ALL_DATA[key] ?? ALL_DATA[`${type}|all`] ?? ALL_DATA["all|all"];

  const topPart = [...data].sort((a, b) => (b.red + b.amber) - (a.red + a.amber))[0];

  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)" }}>Top Failing Parts</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)" }}>Findings by part · last 30 days</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <Select value={oem} onValueChange={setOem}>
            <SelectTrigger style={FS}><SelectValue placeholder="All OEMs" /></SelectTrigger>
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
            <SelectTrigger style={FS}><SelectValue placeholder="All Types" /></SelectTrigger>
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
            <CartesianGrid horizontal={false} stroke="var(--w-bg-muted)" />
            <XAxis type="number" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-3)" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--w-bg-page)" }} />
            <Bar dataKey="red"   fill="#ef4444" stackId="s" radius={[0, 0, 0, 0]} />
            <Bar dataKey="amber" fill="#f59e0b" stackId="s" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)" }}>
            {topPart?.name ?? "—"} leads with highest findings
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8" }}>
            Last 30 days
          </span>
        </div>
      </div>
    </div>
  );
}
