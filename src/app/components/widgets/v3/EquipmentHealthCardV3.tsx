import React, { useState } from "react";
import redIcon from "../../../../assets/severity-icon-red.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import greenIcon from "../../../../assets/severity-icon-green.png";
import amberIcon from "../../../../assets/severity-icon-amber.png";
import noIssuesIcon from "../../../../assets/severity-icon-noissues.png";

const severityStats = [
  { icon: redIcon, label: "RED", value: "120", border: false },
  { icon: greenIcon, label: "GREEN", value: "90", border: true },
  { icon: amberIcon, label: "AMBER", value: "90", border: true },
  { icon: noIssuesIcon, label: "No Issues", value: "90", border: true },
];

const filterStyle: React.CSSProperties = {
  height: "32px",
  width: "auto",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "10px",
  color: "#0f172a",
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
};

export function EquipmentHealthCardV3() {
  const [mheType, setMheType] = useState("forklift");
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
        padding: "16px 20px",
        borderBottom: "1px solid #e2e8f0",
        flexShrink: 0,
        height: "80px",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "16px", color: "#0f172a" }}>
            Fleet Equipment Health Distribution
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>
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
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 30, lineHeight: "36px", color: "#0f172a", letterSpacing: "-0.75px" }}>42</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "16px", color: "#64748b", marginLeft: 4, paddingBottom: 2 }}>Forklift MHEs</span>
        </div>

        {/* Parts Healthy Comparison */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 12, lineHeight: "19.5px", color: "#0f172a" }}>Parts Heathy Comparison:</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 0" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>Most Red Severity</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "#0f172a" }}>Battery</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>Most Green Severity</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "#0f172a" }}>Light</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>Most Amber Issues</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "#0f172a" }}>Tyres</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>No Issue at Parts</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "#0f172a" }}>Engine</span>
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 12, lineHeight: "19.5px", color: "#0f172a" }}>Severity Distribution:</span>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {severityStats.map((stat) => (
              <div key={stat.label} style={{
                display: "flex", flexDirection: "column", gap: 12, flex: 1,
                borderLeft: stat.border ? "1px solid #f1f5f9" : undefined,
                paddingLeft: stat.border ? 12 : 0,
                paddingRight: 4,
              }}>
                {/* Icon + label */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, background: "#f1f5f9", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src={stat.icon} alt="" style={{ width: 13, height: 13 }} />
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 9, lineHeight: "13.5px", color: "#64748b", letterSpacing: "0.36px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{stat.label}</span>
                </div>
                {/* Value */}
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "33px", color: "#64748b", letterSpacing: "-0.44px" }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #f1f5f9",
        padding: "11px 16px 0 16px",
        flexShrink: 0,
        height: "59.5px",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>
            MHE_012 reported most, mainly has red severity = 06
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11, lineHeight: "16.5px", color: "#1b59f8" }}>
            May 2 – May 8
          </span>
        </div>
      </div>
    </div>
  );
}
