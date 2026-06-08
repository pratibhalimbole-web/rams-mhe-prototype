import React, { useState } from "react";
import { Truck, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { machinesInspectionData } from "../../../pages/mhe/FMSDashboard";

const FF = "Inter, sans-serif";

const filterStyle: React.CSSProperties = {
  height: "32px",
  width: "auto",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "10px",
  color: "#0f172a",
  fontFamily: FF,
  fontWeight: 400,
};

function getPartWithMostIssues(row: any): string | null {
  if (!row.part_issues?.length) return null;
  return row.part_issues.reduce(
    (max: any, p: any) =>
      p.amber_count + p.red_count > (max?.amber_count ?? 0) + (max?.red_count ?? 0) ? p : max,
    null
  )?.part_name ?? null;
}

const COLS = [
  { label: "Bad",   key: "redFindings",   color: "#ef4444" },
  { label: "Amber", key: "amberFindings", color: "#f59e0b" },
  { label: "Green", key: "greenFindings", color: "#16a34a" },
  { label: "Parts", key: "parts",          color: "#3b82f6" },
] as const;

export function InspectionAttentionWidget() {
  const [filter, setFilter] = useState("Electric Forklift");

  const rows = (machinesInspectionData as any[]).filter(
    (m) => m.equipmentType === filter
  );

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Machines Requiring Inspection Attention</p>
          <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>MHE units with warning or critical findings from recent inspections.</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
            <SelectItem value="Reach Truck">Reach Truck</SelectItem>
            <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", fontFamily: FF, fontSize: 12, color: "#94a3b8" }}>No machines found for this type.</div>
        ) : rows.map((row) => {
          const partWithMostIssues = getPartWithMostIssues(row);
          const hasIssues = row.redFindings > 0 || row.amberFindings > 0;
          const date = new Date(row.lastInspection).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

          return (
            <div key={row.mheId} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Row 1: icon + MHE ID + badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Truck style={{ width: 16, height: 16, color: "#1b59f8" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: FF, fontWeight: 600, fontSize: 12, color: "#1b59f8", margin: "0 0 2px", fontVariantNumeric: "tabular-nums" }}>{row.mheId}</p>
                  <p style={{ fontFamily: FF, fontSize: 10, color: "#64748b", margin: 0 }}>Last Inspection: {date}</p>
                </div>
                {hasIssues && partWithMostIssues ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "#eef2ff", border: "1px solid #e0e7ff", borderRadius: 999, flexShrink: 0 }}>
                    <AlertTriangle style={{ width: 11, height: 11, color: "#2563eb", flexShrink: 0 }} />
                    <span style={{ fontFamily: FF, fontWeight: 500, fontSize: 10, color: "#1e40af", whiteSpace: "nowrap" }}>Most Issues: {partWithMostIssues}</span>
                  </div>
                ) : (
                  <div style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, flexShrink: 0 }}>
                    <span style={{ fontFamily: FF, fontWeight: 500, fontSize: 10, color: "#16a34a" }}>All Good</span>
                  </div>
                )}
              </div>

              {/* Row 2: severity columns */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                {COLS.map(({ label, key, color }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontFamily: FF, fontSize: 10, color: "#94a3b8" }}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{(row as any)[key]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
