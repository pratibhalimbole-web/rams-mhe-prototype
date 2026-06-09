import React, { useState } from "react";
import { Truck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const mheByType: Record<string, { id: string; label: string }[]> = {
  forklift:    [{ id: "MHE-001", label: "MHE-001" }, { id: "MHE-002", label: "MHE-002" }],
  reach_truck: [{ id: "MHE-003", label: "MHE-003" }, { id: "MHE-004", label: "MHE-004" }],
  pallet_jack: [{ id: "MHE-005", label: "MHE-005" }, { id: "MHE-006", label: "MHE-006" }],
};

const rankedItems = [
  { id: "MHE-001", type: "forklift",    lastInspection: "Apr 20, 2026", impactCount: 12, red: 20, amber: 20, green: 2, highlyImpacted: "Storage A", eventType: "Violation" },
  { id: "MHE-002", type: "forklift",    lastInspection: "Apr 18, 2026", impactCount: 9,  red: 14, amber: 12, green: 5, highlyImpacted: "Zone B",     eventType: "Violation" },
  { id: "MHE-003", type: "reach_truck", lastInspection: "Apr 15, 2026", impactCount: 7,  red: 10, amber: 8,  green: 3, highlyImpacted: "Dock C",     eventType: "Violation" },
  { id: "MHE-004", type: "reach_truck", lastInspection: "Apr 12, 2026", impactCount: 5,  red: 8,  amber: 6,  green: 2, highlyImpacted: "Zone A",     eventType: "Violation" },
  { id: "MHE-005", type: "pallet_jack", lastInspection: "Apr 10, 2026", impactCount: 4,  red: 6,  amber: 4,  green: 1, highlyImpacted: "Dock A",     eventType: "Violation" },
  { id: "MHE-006", type: "pallet_jack", lastInspection: "Apr 8, 2026",  impactCount: 3,  red: 4,  amber: 3,  green: 1, highlyImpacted: "Storage B",  eventType: "Violation" },
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

export function ImpactTrendRankedV3() {
  const [mheType, setMheType] = useState("");
  const [mheId, setMheId] = useState("");

  const mheOptions = mheType ? (mheByType[mheType] ?? []) : [];

  const visibleItems = rankedItems.filter((item) => {
    if (mheType && item.type !== mheType) return false;
    if (mheId && item.id !== mheId) return false;
    return true;
  });

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
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--w-border)",
        flexShrink: 0,
        height: "80px",
        boxSizing: "border-box",
        gap: 10,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "16px", color: "var(--w-text-1)" }}>
            Impact Trend by Zone & MHE
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)" }}>
            Total impact events over time
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
          <Select value={mheType} onValueChange={(v) => { setMheType(v); setMheId(""); }}>
            <SelectTrigger style={filterStyle}><SelectValue placeholder="MHE Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="forklift"    style={{ whiteSpace: "nowrap" }}>Forklift</SelectItem>
              <SelectItem value="reach_truck" style={{ whiteSpace: "nowrap" }}>Reach Truck</SelectItem>
              <SelectItem value="pallet_jack" style={{ whiteSpace: "nowrap" }}>Pallet Jack</SelectItem>
            </SelectContent>
          </Select>
          <Select value={mheId} onValueChange={setMheId} disabled={!mheType}>
            <SelectTrigger style={filterStyle}><SelectValue placeholder="Select MHE" /></SelectTrigger>
            <SelectContent>
              {mheOptions.map((m) => (
                <SelectItem key={m.id} value={m.id} style={{ whiteSpace: "nowrap" }}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Body — max 2 items visible, scroll for more */}
      <div style={{ maxHeight: "352px", overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {visibleItems.map((item, i) => (
          <div key={i} style={{ border: "1px solid var(--w-border)", borderRadius: 8, padding: "8px 13px", display: "flex", flexDirection: "column", gap: "8px", background: "var(--w-bg)" }}>

            {/* Row 1: avatar + name + count badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Truck style={{ width: 14, height: 14, color: "#2563eb" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "16px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>{item.id}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>Last Inspection: {item.lastInspection}</span>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "#2563eb" }}>{item.impactCount}</span>
              </div>
            </div>

            {/* Row 2: severity columns */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0, padding: "6px 0" }}>
              {([["#e11d48", "Critical", item.red], ["#f59e0b", "Medium", item.amber], ["#16a34a", "Low", item.green]] as [string, string, number][]).map(([color, label, val], idx) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, lineHeight: "14.3px", color: "var(--w-text-1)" }}>
                    {String(val).padStart(2, "0")}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>{label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3: highly impacted + event type */}
            <div style={{ borderTop: "1px solid var(--w-border)", padding: "8px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>
                Highly Impacted: <b style={{ color: "var(--w-text-1)" }}>{item.highlyImpacted}</b>
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>
                Event Type: <b style={{ color: "var(--w-text-1)" }}>{item.eventType}</b>
              </span>
            </div>
          </div>
        ))}
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
            MHE-001 leads with 12 impacts; Storage A most affected — 20 red severities
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11, lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Apr 15 – Apr 20, 2026
          </span>
        </div>
      </div>
    </div>
  );
}
