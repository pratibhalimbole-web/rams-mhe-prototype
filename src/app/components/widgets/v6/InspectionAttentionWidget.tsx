import React, { useState } from "react";
import { Truck, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { machinesInspectionData } from "../../../pages/mhe/FMSDashboard";

const FF = "Inter, sans-serif";

const filterStyle: React.CSSProperties = {
  height: "36px",
  background: "var(--w-bg)",
  border: "1px solid var(--w-border)",
  borderRadius: "8px",
  fontSize: "13px",
  color: "var(--w-text-1)",
  fontFamily: FF,
  fontWeight: 400,
  width: "200px",
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
  { label: "Green", key: "greenFindings", color: "#22c55e" },
  { label: "Parts", key: "parts",          color: "#3b82f6" },
] as const;

export function InspectionAttentionWidget() {
  const [filter, setFilter] = useState("Electric Forklift");

  const rows = (machinesInspectionData as any[]).filter(
    (m) => m.equipmentType === filter
  );

  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, gap: 16 }}>
        <div>
          <p style={{ fontFamily: FF, fontSize: 14, fontWeight: 700, color: "var(--w-text-1)", margin: "0 0 4px" }}>Machines Requiring Inspection Attention</p>
          <p style={{ fontFamily: FF, fontSize: 11, color: "var(--w-text-3)", margin: 0 }}>MHE units with warning or critical findings from recent inspections.</p>
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
          <div style={{ textAlign: "center", padding: "32px 0", fontFamily: FF, fontSize: 12, color: "var(--w-text-3)" }}>No machines found for this type.</div>
        ) : rows.map((row) => {
          const partWithMostIssues = getPartWithMostIssues(row);
          const hasIssues = row.redFindings > 0 || row.amberFindings > 0;
          const date = new Date(row.lastInspection).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

          return (
            <div key={row.mheId} style={{ border: "1px solid var(--w-border)", borderRadius: 12, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Row 1: icon + MHE ID + badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Truck style={{ width: 16, height: 16, color: "#1b59f8" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: FF, fontWeight: 600, fontSize: 13, color: "#1b59f8", margin: "0 0 2px" }}>{row.mheId}</p>
                  <p style={{ fontFamily: FF, fontSize: 11, color: "var(--w-text-2)", margin: 0 }}>Last Inspection: {date}</p>
                </div>
                {hasIssues && partWithMostIssues ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "#eef2ff", border: "1px solid #e0e7ff", borderRadius: 999, flexShrink: 0 }}>
                    <AlertTriangle style={{ width: 12, height: 12, color: "#2563eb", flexShrink: 0 }} />
                    <span style={{ fontFamily: FF, fontWeight: 500, fontSize: 11, color: "#1e40af", whiteSpace: "nowrap" }}>Most Issues: {partWithMostIssues}</span>
                  </div>
                ) : (
                  <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, flexShrink: 0 }}>
                    <span style={{ fontFamily: FF, fontWeight: 500, fontSize: 11, color: "#16a34a" }}>All Good</span>
                  </div>
                )}
              </div>

              {/* Row 2: severity columns */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", paddingTop: 10, borderTop: "1px solid var(--w-divider)" }}>
                {COLS.map(({ label, key, color }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: FF, fontSize: 11, color: "var(--w-text-3)" }}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 14, color: "var(--w-text-1)" }}>{(row as any)[key]}</span>
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
