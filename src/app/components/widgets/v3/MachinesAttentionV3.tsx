import React, { useState } from "react";
import { Truck, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const mheItems = [
  { id: "MHE-001", lastInspection: "Apr 20, 2026", mostIssues: "Battery", done: 12, skipped: 9, red: 2, amber: 4, green: 3 },
  { id: "MHE-002", lastInspection: "Apr 20, 2026", mostIssues: "Battery", done: 12, skipped: 9, red: 2, amber: 4, green: 3 },
  { id: "MHE-003", lastInspection: "Apr 20, 2026", mostIssues: "Battery", done: 12, skipped: 9, red: 2, amber: 4, green: 3 },
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

export function MachinesAttentionV3() {
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
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "16px", color: "#0f172a" }}>
            Machines Requiring Inspection Attention
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>
            Inspection workload by operator
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

      {/* Body — 3 MHE cards, scrollable */}
      <div style={{ maxHeight: "352px", overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {mheItems.map((m) => (
          <div key={m.id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 13px", display: "flex", flexDirection: "column", gap: "8px", background: "#ffffff" }}>
            {/* Row 1: avatar + name + pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Truck style={{ width: 14, height: 14, color: "#2563eb" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "16px", color: "#0f172a", whiteSpace: "nowrap" }}>{m.id}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Last Inspection: {m.lastInspection}</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 6px", background: "#eef2ff", border: "1px solid #e0e7ff", borderRadius: 999, flexShrink: 0 }}>
                <Zap style={{ width: 10, height: 10, color: "#1e40af", flexShrink: 0 }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 10, lineHeight: "14px", color: "#1e40af", whiteSpace: "nowrap" }}>Most Issues: {m.mostIssues}</span>
              </div>
            </div>

            {/* Row 2: stats */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0, padding: "6px 0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, lineHeight: "14.3px", color: "#0f172a" }}>{String(m.done).padStart(2, "0")}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Inspection Done</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, lineHeight: "14.3px", color: "#0f172a" }}>{String(m.skipped).padStart(2, "0")}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Inspection Skipped</span>
              </div>
            </div>

            {/* Row 3: severity dots */}
            <div style={{ borderTop: "1px solid #e2e8f0", padding: "8px 0", display: "flex", alignItems: "center", gap: 6 }}>
              {([["#e11d48", "Red", m.red], ["#f59e0b", "Amber", m.amber], ["#16a34a", "Green", m.green]] as [string, string, number][]).map(([color, label, val]) => (
                <div key={label} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>{label} {val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #f1f5f9",
        padding: "11px 16px 0 16px",
        flexShrink: 0,
        height: "59.5px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            9 inspections skipped per MHE; Battery drives amber severity across all 3 units
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11, lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            May 7 – May 13, 2026
          </span>
        </div>
      </div>
    </div>
  );
}
