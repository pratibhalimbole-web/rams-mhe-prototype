import React, { useState } from "react";
import truckIcon from "../../../../assets/mhe-icon-truck.png";
import batteryIcon from "../../../../assets/mhe-icon-battery.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const mheItems = [
  { id: "MHE-001", lastInspection: "Apr 20, 2026", mostIssues: "Battery", done: 12, skipped: 9, red: 2, amber: 4, green: 3 },
  { id: "MHE-002", lastInspection: "Apr 20, 2026", mostIssues: "Battery", done: 12, skipped: 9, red: 2, amber: 4, green: 3 },
  { id: "MHE-003", lastInspection: "Apr 20, 2026", mostIssues: "Battery", done: 12, skipped: 9, red: 2, amber: 4, green: 3 },
];

const operators = [
  { initials: "AP", name: "Anjali Patel", opId: "OP-004", overdue: 2, assigned: 11, completed: 6, red: 3, amber: 2, green: 1 },
  { initials: "SR", name: "Suresh Reddy", opId: "OP-005", overdue: 0, assigned: 7, completed: 7, red: 0, amber: 1, green: 6 },
];

function SeverityDots({ red, amber, green }: { red: number; amber: number; green: number }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      {([["#e11d48", `Red ${red}`], ["#f59e0b", `Amber ${amber}`], ["#16a34a", `Green ${green}`]] as [string, string][]).map(([color, label]) => (
        <div key={label} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

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

      {/* Body — max 2 items visible, scroll for more */}
      <div style={{ maxHeight: "326px", overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>

        {/* MHE item cards */}
        {mheItems.map((m) => (
          <div key={m.id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 13px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Row 1: avatar + name + pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={truckIcon} alt="" style={{ width: 16, height: 16 }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "16px", color: "#0f172a", whiteSpace: "nowrap" }}>{m.id}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Last Inspection: {m.lastInspection}</span>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 6px", background: "#eef2ff", border: "1px solid #e0e7ff", borderRadius: 999, flexShrink: 0 }}>
                <img src={batteryIcon} alt="" style={{ width: 11, height: 11, flexShrink: 0 }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 10, lineHeight: "14px", color: "#1e40af", whiteSpace: "nowrap" }}>Most Issues: {m.mostIssues}</span>
              </div>
            </div>

            {/* Row 2: stats */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Total Inspection Done:</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: "20px", color: "#0f172a" }}>{String(m.done).padStart(2, "0")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Total Inspection Skipped :</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: "20px", color: "#0f172a" }}>{String(m.skipped).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Row 3: severity dots */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 13, paddingBottom: 8 }}>
              <SeverityDots red={m.red} amber={m.amber} green={m.green} />
            </div>
          </div>
        ))}

        {/* Operator rows */}
        {operators.map((op) => (
          <div key={op.opId} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "11px 13px 1px 13px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Row 1: avatar + name + overdue */}
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start", height: 31 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10, lineHeight: "15px", color: "#2563eb" }}>{op.initials}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", marginLeft: 10, flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "16px", color: "#0f172a" }}>{op.name}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>{op.opId}</span>
              </div>
              {op.overdue > 0 && (
                <div style={{ background: "rgba(225,29,72,0.12)", borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10, lineHeight: "15px", color: "#e11d48", whiteSpace: "nowrap" }}>{op.overdue} overdue</span>
                </div>
              )}
            </div>

            {/* Row 2: assigned/completed */}
            <div style={{ display: "flex", height: 35 }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>Assigned</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: "20px", color: "#0f172a" }}>{op.assigned}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "#64748b" }}>Completed</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: "20px", color: "#16a34a" }}>{op.completed}</span>
              </div>
            </div>

            {/* Row 3: severity */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 9, paddingBottom: 8, display: "flex", alignItems: "center", height: 24 }}>
              <SeverityDots red={op.red} amber={op.amber} green={op.green} />
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
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>
            MHE_012 reported most, mainly has red severity = 06
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11, lineHeight: "16.5px", color: "#1b59f8" }}>
            May 1 – May 7 2024
          </span>
        </div>
      </div>
    </div>
  );
}
