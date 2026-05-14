import React, { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

type MheEntry = {
  id: string;
  type: "Forklift" | "Reach Truck" | "Pallet Jack" | "Stacker";
  sensorId: string | null;
};

const ALL_MHES: MheEntry[] = [
  { id: "FL-007", type: "Forklift",    sensorId: "SNS-1042" },
  { id: "FL-015", type: "Forklift",    sensorId: "SNS-1051" },
  { id: "FL-022", type: "Forklift",    sensorId: "SNS-1067" },
  { id: "FL-011", type: "Forklift",    sensorId: null        },
  { id: "FL-008", type: "Forklift",    sensorId: "SNS-1033" },
  { id: "FL-003", type: "Forklift",    sensorId: null        },
  { id: "FL-019", type: "Forklift",    sensorId: "SNS-1078" },
  { id: "PJ-016", type: "Pallet Jack", sensorId: "SNS-2031" },
  { id: "PJ-003", type: "Pallet Jack", sensorId: "SNS-2019" },
  { id: "PJ-009", type: "Pallet Jack", sensorId: null        },
  { id: "PJ-021", type: "Pallet Jack", sensorId: "SNS-2044" },
  { id: "PJ-004", type: "Pallet Jack", sensorId: "SNS-2007" },
  { id: "RT-013", type: "Reach Truck", sensorId: "SNS-3018" },
  { id: "RT-007", type: "Reach Truck", sensorId: null        },
  { id: "RT-002", type: "Reach Truck", sensorId: "SNS-3005" },
  { id: "RT-018", type: "Reach Truck", sensorId: "SNS-3027" },
  { id: "RT-005", type: "Reach Truck", sensorId: "SNS-3011" },
  { id: "ST-001", type: "Stacker",     sensorId: "SNS-4003" },
  { id: "ST-005", type: "Stacker",     sensorId: null        },
  { id: "ST-003", type: "Stacker",     sensorId: "SNS-4009" },
  { id: "ST-007", type: "Stacker",     sensorId: "SNS-4015" },
  { id: "ST-002", type: "Stacker",     sensorId: "SNS-4006" },
];

const TYPES = ["Forklift", "Reach Truck", "Pallet Jack", "Stacker"] as const;

const TYPE_COLOR: Record<string, string> = {
  "Forklift":    "#2563eb",
  "Reach Truck": "#16a34a",
  "Pallet Jack": "#ca8a04",
  "Stacker":     "#9333ea",
};

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

export function SensorAssignmentV3() {
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() =>
    ALL_MHES.filter((m) => typeFilter === "all" || m.type === typeFilter),
  [typeFilter]);

  const assignedList   = filtered.filter((m) =>  m.sensorId);
  const unassignedList = filtered.filter((m) => !m.sensorId);
  const pct = Math.round((assignedList.length / (filtered.length || 1)) * 100);

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>MHE Sensor Assignment</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Sensor coverage across fleet</span>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger style={filterStyle}><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Forklift">Forklift</SelectItem>
            <SelectItem value="Reach Truck">Reach Truck</SelectItem>
            <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
            <SelectItem value="Stacker">Stacker</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary bar */}
      <div style={{ padding: "12px 16px 10px", flexShrink: 0, borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#64748b" }}>Assigned</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{assignedList.length}</span>
            </div>
            <div style={{ width: "1px", height: "14px", background: "#e2e8f0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#64748b" }}>Unassigned</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{unassignedList.length}</span>
            </div>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>{pct}% coverage</span>
        </div>
        <div style={{ display: "flex", height: "3px", borderRadius: "3px", overflow: "hidden", background: "#f1f5f9" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#16a34a", borderRadius: "3px", transition: "width 0.3s ease" }} />
        </div>
      </div>

      {/* Type breakdown bars */}
      <div style={{ padding: "12px 16px", flexShrink: 0, borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {TYPES.map((type) => {
            const mhes = filtered.filter((m) => m.type === type);
            if (!mhes.length) return null;
            const a = mhes.filter((m) => m.sensorId).length;
            const u = mhes.length - a;
            const typePct = Math.round((a / mhes.length) * 100);
            return (
              <div key={type}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "3px", height: "12px", borderRadius: "2px", background: TYPE_COLOR[type], flexShrink: 0 }} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#0f172a" }}>{type}</span>
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#94a3b8" }}>{a}/{mhes.length}</span>
                </div>
                <div style={{ width: "100%", height: "3px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${typePct}%`, height: "100%", background: TYPE_COLOR[type], borderRadius: "3px" }} />
                </div>
                {u > 0 && (
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#ef4444", margin: "3px 0 0", fontWeight: 500 }}>{u} unassigned</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-panel split: Assigned | Unassigned */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1px 1fr", minHeight: 0, overflow: "hidden" }}>

        {/* Assigned panel */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 16px 6px", flexShrink: 0 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#16a34a", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              ● Assigned ({assignedList.length})
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 12px" }}>
            {assignedList.map((mhe, i) => (
              <div key={mhe.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: i < assignedList.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#0f172a" }}>{mhe.id}</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 500, color: TYPE_COLOR[mhe.type], background: `${TYPE_COLOR[mhe.type]}15`, borderRadius: "3px", padding: "1px 5px" }}>{mhe.type.split(" ")[0]}</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#64748b" }}>{mhe.sensorId}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: "#f1f5f9" }} />

        {/* Unassigned panel */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 16px 6px", flexShrink: 0 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#ef4444", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              ● Unassigned ({unassignedList.length})
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 12px" }}>
            {unassignedList.length === 0 ? (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#94a3b8", marginTop: "12px" }}>All MHEs have sensors assigned.</p>
            ) : (
              unassignedList.map((mhe, i) => (
                <div key={mhe.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: i < unassignedList.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#0f172a" }}>{mhe.id}</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 500, color: TYPE_COLOR[mhe.type], background: `${TYPE_COLOR[mhe.type]}15`, borderRadius: "3px", padding: "1px 5px" }}>{mhe.type.split(" ")[0]}</span>
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, color: "#ef4444", background: "#fef2f2", borderRadius: "4px", padding: "2px 6px" }}>No sensor</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f1f5f9", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {unassignedList.length} MHE{unassignedList.length !== 1 ? "s" : ""} require sensor assignment
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Last updated · May 14, 2026
          </span>
        </div>
      </div>
    </div>
  );
}
