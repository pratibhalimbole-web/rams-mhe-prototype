import React from "react";
import { Card, CardContent } from "../../ui/card";
import { COLORS } from "../../../pages/mhe/FMSDashboard";

export function TripLoadBreakdownWidget() {
  return (
    <Card className="shadow-none border-[var(--border)] flex flex-col min-h-[422px] w-full">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>Trip Load Breakdown</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Loaded vs empty trips · last 30 days</span>
        </div>
      </div>
      <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col" style={{ gap: "20px" }}>

        {/* Trip Overview */}
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: "0 0 10px" }}>TRIP OVERVIEW</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
            <div style={{ paddingRight: "20px" }}>
              <p style={{ fontSize: "11px", color: "var(--w-text-3)", margin: "0 0 8px", fontWeight: 500 }}>Total Trips</p>
              <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--w-text-1)", lineHeight: 1, margin: "0 0 8px" }}>342</p>
              <p style={{ fontSize: "10px", color: "var(--w-text-3)", fontWeight: 500, margin: 0 }}>Across all zones</p>
            </div>
            <div style={{ background: "var(--w-border)" }} />
            <div style={{ paddingLeft: "20px" }}>
              <p style={{ fontSize: "11px", color: "var(--w-text-3)", margin: "0 0 8px", fontWeight: 500 }}>Load Efficiency</p>
              <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--w-text-1)", lineHeight: 1, margin: "0 0 8px" }}>73%</p>
              <p style={{ fontSize: "10px", color: "#16a34a", fontWeight: 500, margin: 0 }}>↑ Exceeds 65% target</p>
            </div>
          </div>
        </div>

        {/* Load Distribution */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: "0 0 10px" }}>LOAD DISTRIBUTION</p>

          {/* Stacked horizontal bar */}
          <div style={{ display: "flex", height: "10px", marginBottom: "8px" }}>
            <div style={{ flex: 64, background: COLORS.noIssues, borderRadius: "3px 0 0 3px" }} />
            <div style={{ flex: 19, background: COLORS.healthy }} />
            <div style={{ flex: 18, background: COLORS.warning, borderRadius: "0 3px 3px 0" }} />
          </div>

          {/* Percentage labels */}
          <div style={{ display: "flex", marginBottom: "14px" }}>
            {([
              { pct: "64%", flex: 64 },
              { pct: "19%", flex: 19 },
              { pct: "18%", flex: 18 },
            ]).map(({ pct, flex }) => (
              <div key={pct} style={{ flex, paddingTop: "5px" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--w-text-3)" }}>{pct}</span>
              </div>
            ))}
          </div>

          {/* Legend rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {[
              { label: "Loaded",           sub: "Full load trips",      count: 218, pct: "64%", color: COLORS.noIssues },
              { label: "Partial",          sub: "Partially filled",     count: 64,  pct: "19%", color: COLORS.healthy  },
              { label: "Empty (Deadhead)", sub: "No load — return run", count: 60,  pct: "18%", color: COLORS.warning  },
            ].map(({ label, sub, count, pct, color }, i, arr) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--w-divider)" : "none" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", margin: 0 }}>{label}</p>
                    <p style={{ fontSize: "11px", color: "var(--w-text-3)", margin: "2px 0 0" }}>{sub} · {count} trips</p>
                  </div>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--w-text-1)", letterSpacing: "-0.02em" }}>{pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
