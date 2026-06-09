import React, { useState } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const severityStats = [
  { icon: AlertCircle,  label: "RED",      value: "120", border: false, color: "#ef4444" },
  { icon: CheckCircle2, label: "GREEN",    value: "90",  border: true,  color: "#22c55e" },
  { icon: AlertTriangle,label: "AMBER",    value: "90",  border: true,  color: "#f59e0b" },
  { icon: MinusCircle,  label: "No Issues",value: "90",  border: true,  color: "var(--w-text-3)" },
];

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

export function EquipmentHealthCardV3() {
  const [mheType, setMheType] = useState("forklift");
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
        padding: "16px 20px",
        borderBottom: "1px solid var(--w-border)",
        flexShrink: 0,
        height: "80px",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "16px", color: "var(--w-text-1)" }}>
            Fleet Equipment Health Distribution
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)" }}>
            Fleet Equipment Health Distribution
          </span>
        </div>
        <Select value={mheType} onValueChange={setMheType}>
          <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="forklift" style={{ whiteSpace: "nowrap" }}>Forklift</SelectItem>
            <SelectItem value="pallet_jack" style={{ whiteSpace: "nowrap" }}>Pallet Jack</SelectItem>
            <SelectItem value="reach_truck" style={{ whiteSpace: "nowrap" }}>Reach Truck</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "16px 24px", display: "flex", flexDirection: "column", gap: "24px", minHeight: 0 }}>

        {/* Count row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 30, lineHeight: "36px", color: "var(--w-text-1)", letterSpacing: "-0.75px" }}>42</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "16px", color: "var(--w-text-2)", marginLeft: 4, paddingBottom: 2 }}>Forklift MHEs</span>
        </div>

        {/* Parts Healthy Comparison */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 12, lineHeight: "19.5px", color: "var(--w-text-1)" }}>Parts Heathy Comparison:</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 0" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)" }}>Most Red Severity</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "var(--w-text-1)" }}>Battery</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)" }}>Most Green Severity</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "var(--w-text-1)" }}>Light</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)" }}>Most Amber Issues</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "var(--w-text-1)" }}>Tyres</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)" }}>No Issue at Parts</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "var(--w-text-1)" }}>Engine</span>
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 12, lineHeight: "19.5px", color: "var(--w-text-1)" }}>Severity Distribution:</span>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {severityStats.map((stat) => (
              <div key={stat.label} style={{
                display: "flex", flexDirection: "column", gap: 12, flex: 1,
                borderLeft: stat.border ? "1px solid var(--w-divider)" : undefined,
                paddingLeft: stat.border ? 12 : 0,
                paddingRight: 4,
              }}>
                {/* Icon + label */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, background: "var(--w-bg-muted)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <stat.icon style={{ width: 13, height: 13, color: stat.color }} />
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 9, lineHeight: "13.5px", color: "var(--w-text-2)", letterSpacing: "0.36px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{stat.label}</span>
                </div>
                {/* Value */}
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "33px", color: "var(--w-text-2)", letterSpacing: "-0.44px" }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid var(--w-divider)",
        padding: "11px 16px 0 16px",
        flexShrink: 0,
        height: "59.5px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Battery leads red severity at 120; Engine has no issues across 42 forklifts
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11, lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            May 7 – May 13, 2026
          </span>
        </div>
      </div>
    </div>
  );
}
