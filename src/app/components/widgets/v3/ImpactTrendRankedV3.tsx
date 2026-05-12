import React, { useState } from "react";
import truckIcon from "../../../../assets/mhe-icon-truck.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const rankedItems = [
  { id: "MHE-001", lastInspection: "Apr 20, 2026", impactCount: 12, red: 20, amber: 20, green: 2, highlyImpacted: "Storage A" },
  { id: "MHE-002", lastInspection: "Apr 18, 2026", impactCount: 9,  red: 14, amber: 12, green: 5, highlyImpacted: "Zone B" },
  { id: "MHE-003", lastInspection: "Apr 15, 2026", impactCount: 7,  red: 10, amber: 8,  green: 3, highlyImpacted: "Dock C" },
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

export function ImpactTrendRankedV3() {
  const [zone, setZone] = useState("all_zones");
  const [type, setType] = useState("all_types");
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
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid #e2e8f0",
        flexShrink: 0,
        height: "80px",
        boxSizing: "border-box",
        gap: 10,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "16px", color: "#0f172a" }}>
            Impact Trend by Zone & MHE
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>
            Total impact events over time
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_zones" style={{ whiteSpace: "nowrap" }}>All Zones</SelectItem>
              <SelectItem value="zone_a" style={{ whiteSpace: "nowrap" }}>Zone A</SelectItem>
              <SelectItem value="zone_b" style={{ whiteSpace: "nowrap" }}>Zone B</SelectItem>
              <SelectItem value="zone_c" style={{ whiteSpace: "nowrap" }}>Zone C</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_types" style={{ whiteSpace: "nowrap" }}>All Types</SelectItem>
              <SelectItem value="forklift" style={{ whiteSpace: "nowrap" }}>Forklift</SelectItem>
              <SelectItem value="pallet_jack" style={{ whiteSpace: "nowrap" }}>Pallet Jack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Body — max 2 items visible, scroll for more */}
      <div style={{ maxHeight: "352px", overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {rankedItems.map((item, i) => (
          <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 13px", display: "flex", flexDirection: "column", gap: "8px", background: "#ffffff" }}>

            {/* Row 1: avatar + name + count badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={truckIcon} alt="" style={{ width: 16, height: 16 }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "16px", color: "#0f172a", whiteSpace: "nowrap" }}>{item.id}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Last Inspection: {item.lastInspection}</span>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "#2563eb" }}>{item.impactCount}</span>
              </div>
            </div>

            {/* Row 2: severity columns */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0, padding: "6px 0" }}>
              {([["#e11d48", "Red", item.red], ["#f59e0b", "Amber", item.amber], ["#16a34a", "Green", item.green]] as [string, string, number][]).map(([color, label, val], idx) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, lineHeight: "14.3px", color: "#0f172a" }}>
                    {String(val).padStart(2, "0")}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>{label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3: highly impacted */}
            <div style={{ borderTop: "1px solid #e2e8f0", padding: "8px 0", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Highly Impacted:</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>{item.highlyImpacted}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #f1f5f9",
        padding: "11px 14px 0 14px",
        flexShrink: 0,
        height: "57px",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, lineHeight: "16.5px", color: "#0f172a", whiteSpace: "nowrap" }}>
            MHE_012 reported most, mainly has red severity = 06
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>
            May 1 – May 7 2024
          </span>
        </div>
      </div>
    </div>
  );
}
