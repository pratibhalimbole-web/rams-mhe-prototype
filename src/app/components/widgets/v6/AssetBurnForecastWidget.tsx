import React, { useState } from "react";
import { AlertTriangle, Calendar, CheckCircle2, Clock, Wrench } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const MHE_LIST = [
  {
    id: "MHE-007",
    type: "Forklift",
    zone: "Zone A",
    daysLeft: 18,
    hoursUsed: 483,
    hoursMax: 500,
    status: "urgent" as const,
    scheduled: false,
    accentColor: "#ef4444",
    accentBg: "#fef2f2",
    accentText: "#dc2626",
    statusLabel: "Action needed",
    statusBg: "#fef2f2",
    statusFg: "#dc2626",
  },
  {
    id: "MHE-019",
    type: "Reach Truck",
    zone: "Zone C",
    daysLeft: 45,
    hoursUsed: 461,
    hoursMax: 500,
    status: "pending" as const,
    scheduled: true,
    accentColor: "#f59e0b",
    accentBg: "#fffbeb",
    accentText: "#b45309",
    statusLabel: "Scheduled",
    statusBg: "#f0fdf4",
    statusFg: "#16a34a",
  },
];

const SUMMARY = [
  { label: "DUE (90d)",  value: "2", sub: "units total",    color: "var(--w-text-1)" },
  { label: "URGENT",     value: "1", sub: "action needed",  color: "#dc2626" },
  { label: "SCHEDULED",  value: "1", sub: "confirmed",      color: "#16a34a" },
  { label: "OVERDUE",    value: "0", sub: "units past due", color: "var(--w-text-1)" },
];

const FS: React.CSSProperties = {
  height: "32px", width: "auto", background: "var(--w-bg)",
  border: "1px solid var(--w-border)", borderRadius: "6px",
  padding: "0 13px", fontSize: "10px", color: "var(--w-text-1)",
  fontFamily: "Inter, sans-serif",
};

export function AssetBurnForecastWidget() {
  const [horizon, setHorizon] = useState("90d");

  const filtered = horizon === "30d"
    ? MHE_LIST.filter(m => m.daysLeft <= 30)
    : horizon === "60d"
    ? MHE_LIST.filter(m => m.daysLeft <= 60)
    : MHE_LIST;

  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)" }}>Asset Burn Forecast</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#fef2f2", borderRadius: "4px", padding: "2px 7px" }}>
              <AlertTriangle size={9} style={{ color: "#dc2626" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#dc2626" }}>1 urgent</span>
            </span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)" }}>Units reaching their service interval by horizon</span>
        </div>
        <Select value={horizon} onValueChange={setHorizon}>
          <SelectTrigger style={FS}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Next 30 days</SelectItem>
            <SelectItem value="60d">Next 60 days</SelectItem>
            <SelectItem value="90d">Next 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

        {/* MHE entity list — top, fills space */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {filtered.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <CheckCircle2 size={24} style={{ color: "var(--w-text-3)" }} />
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "var(--w-text-3)", margin: 0 }}>No units due in this window</p>
            </div>
          ) : (
            filtered.map((m, i) => {
              const burnPct = Math.round((m.hoursUsed / m.hoursMax) * 100);
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--w-divider)" : "none",
                    flex: 1,
                  }}
                >
                  {/* Main content */}
                  <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>

                    {/* Row 1: ID + type + zone + status */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: "var(--w-text-1)" }}>{m.id}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>{m.type}</span>
                      </div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: m.statusFg, background: m.statusBg, borderRadius: "4px", padding: "2px 8px" }}>
                        {m.statusLabel}
                      </span>
                    </div>

                    {/* Row 2: Burn bar + days left */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <Wrench size={10} style={{ color: "var(--w-text-3)" }} />
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "var(--w-text-3)" }}>{m.hoursUsed}h / {m.hoursMax}h used</span>
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: m.accentText }}>{burnPct}%</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={9} style={{ color: "var(--w-text-3)" }} />
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)" }}>{m.daysLeft} days left</span>
                        </div>
                      </div>
                      {/* Burn bar */}
                      <div style={{ height: "5px", borderRadius: "999px", background: "var(--w-bg-muted)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "999px", background: m.accentColor, width: `${burnPct}%`, transition: "width 0.4s ease" }} />
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* KPI strip — bottom */}
        <div style={{ borderTop: "1px solid var(--w-divider)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", flexShrink: 0 }}>
          {SUMMARY.map(({ label, value, sub, color }, i) => (
            <div
              key={label}
              style={{
                padding: "10px 0",
                textAlign: "center",
                borderRight: i < SUMMARY.length - 1 ? "1px solid var(--w-divider)" : "none",
              }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 3px" }}>{label}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color, margin: "0 0 1px", letterSpacing: "-0.4px" }}>{value}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "var(--w-text-3)", margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

      </div>


    </div>
  );
}
