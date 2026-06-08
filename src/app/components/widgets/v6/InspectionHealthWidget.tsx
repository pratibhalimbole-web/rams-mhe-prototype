import React, { useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Forklift } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const DATA_BY_MHE: Record<string, {
  total: number;
  parts: { sub: string; value: string; dot: string }[];
  severity: { label: string; count: number; mheId: string; part: string }[];
}> = {
  "Forklift": {
    total: 18,
    parts: [
      { sub: "Most Red",   value: "Battery",   dot: "#ef4444" },
      { sub: "Most Amber", value: "Tyres",      dot: "#f59e0b" },
      { sub: "Most Green", value: "Light",      dot: "#16a34a" },
    ],
    severity: [
      { label: "RED",   count: 120, mheId: "MHE-015", part: "Battery"  },
      { label: "AMBER", count: 90,  mheId: "MHE-023", part: "Tyres"    },
      { label: "GREEN", count: 90,  mheId: "MHE-008", part: "Light"    },
    ],
  },
  "Reach Truck": {
    total: 10,
    parts: [
      { sub: "Most Red",   value: "Hydraulics", dot: "#ef4444" },
      { sub: "Most Amber", value: "Brakes",     dot: "#f59e0b" },
      { sub: "Most Green", value: "Engine",     dot: "#16a34a" },
    ],
    severity: [
      { label: "RED",   count: 64,  mheId: "MHE-031", part: "Hydraulics" },
      { label: "AMBER", count: 48,  mheId: "MHE-019", part: "Brakes"     },
      { label: "GREEN", count: 72,  mheId: "MHE-005", part: "Engine"     },
    ],
  },
  "Pallet Jack": {
    total: 8,
    parts: [
      { sub: "Most Red",   value: "Forks",   dot: "#ef4444" },
      { sub: "Most Amber", value: "Wheels",  dot: "#f59e0b" },
      { sub: "Most Green", value: "Handle",  dot: "#16a34a" },
    ],
    severity: [
      { label: "RED",   count: 38,  mheId: "MHE-042", part: "Forks"  },
      { label: "AMBER", count: 29,  mheId: "MHE-037", part: "Wheels" },
      { label: "GREEN", count: 55,  mheId: "MHE-011", part: "Handle" },
    ],
  },
  "Stacker": {
    total: 6,
    parts: [
      { sub: "Most Red",   value: "Mast",    dot: "#ef4444" },
      { sub: "Most Amber", value: "Battery", dot: "#f59e0b" },
      { sub: "Most Green", value: "Tyres",   dot: "#16a34a" },
    ],
    severity: [
      { label: "RED",   count: 22,  mheId: "MHE-054", part: "Mast"    },
      { label: "AMBER", count: 18,  mheId: "MHE-048", part: "Battery" },
      { label: "GREEN", count: 41,  mheId: "MHE-027", part: "Tyres"   },
    ],
  },
};

const SEVERITY_META = [
  { label: "RED",   color: "#ef4444", Icon: AlertCircle   },
  { label: "AMBER", color: "#f59e0b", Icon: AlertTriangle },
  { label: "GREEN", color: "#16a34a", Icon: CheckCircle2  },
] as const;

export function InspectionHealthWidget() {
  const [selectedMhe, setSelectedMhe] = useState("Forklift");
  const d = DATA_BY_MHE[selectedMhe];

  return (
    <Card className="shadow-none border-[var(--border)] flex flex-col min-h-[422px] w-full">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>
            Inspection Health
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>
            Severity distribution by MHE type
          </span>
        </div>
        <Select value={selectedMhe} onValueChange={setSelectedMhe}>
          <SelectTrigger style={{ height: "32px", width: "auto", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "#0f172a", fontFamily: "Inter, sans-serif" }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Forklift">Forklift</SelectItem>
            <SelectItem value="Reach Truck">Reach Truck</SelectItem>
            <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
            <SelectItem value="Stacker">Stacker</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col" style={{ gap: "20px" }}>

        {/* Hero */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Forklift size={16} style={{ color: "#2563eb" }} />
            </div>
            <div style={{ padding: "0 6px" }}>
              <span style={{ fontSize: "30px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.75px", lineHeight: "36px" }}>{d.total}</span>
            </div>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 400 }}>{selectedMhe} MHEs</span>
          </div>

          {/* Parts Comparison */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 10px" }}>PARTS COMPARISON</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: "10px", columnGap: "8px" }}>
              {d.parts.map(({ sub, value, dot }) => (
                <div key={sub}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, flexShrink: 0 }} />
                    <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>{sub}</p>
                  </div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#0f172a", margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: 0 }}>SEVERITY DISTRIBUTION</p>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {d.severity.map((row) => {
              const meta = SEVERITY_META.find((m) => m.label === row.label)!;
              return (
                <div key={row.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <meta.Icon size={13} style={{ color: meta.color }} />
                      </div>
                      <span style={{ fontSize: "9px", fontWeight: 600, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase" }}>{row.label}</span>
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "#64748b", letterSpacing: "-0.027em" }}>{row.count}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 400 }}>MHE ID: </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{row.mheId}</span>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>|</span>
                    <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 400 }}>Part: </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{row.part}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
