import React from "react";
import { CheckCircle2, Wrench, MinusCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "../../ui/card";

export function TodaysActivityWidget() {
  return (
    <Card className="shadow-none border-[var(--border)] flex flex-col min-h-[422px] w-full">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>Today's Activity</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>Real-time fleet engagement</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <RefreshCw size={13} style={{ color: "#1b59f8" }} />
          <span style={{ fontSize: "10px", fontStyle: "italic", color: "#1b59f8", whiteSpace: "nowrap" }}>Last Refresh 02:02:00</span>
        </div>
      </div>
      <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col" style={{ gap: "20px" }}>

        {/* Fleet Status */}
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: "0 0 10px" }}>
            FLEET STATUS: <span style={{ color: "var(--w-text-1)" }}>42 total MHEs</span>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: "0" }}>
            {([
              { icon: CheckCircle2, label: "ACTIVE",      value: 28, iconColor: "#16a34a", iconBg: "#f0fdf4" },
              { icon: Wrench,       label: "MAINTENANCE", value: 4,  iconColor: "#f59e0b", iconBg: "#fffbeb" },
              { icon: MinusCircle,  label: "IDLE",        value: 10, iconColor: "var(--w-text-3)", iconBg: "var(--w-bg-muted)" },
            ] as { icon: React.ElementType; label: string; value: number; iconColor: string; iconBg: string }[]).flatMap(({ icon: Icon, label, value, iconColor, iconBg }, i, arr) => [
              <div key={label} style={{ padding: "4px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={13} style={{ color: iconColor }} />
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--w-text-3)", letterSpacing: "0.06em" }}>{label}</span>
                </div>
                <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--w-text-1)", margin: 0, lineHeight: 1 }}>{value}</p>
              </div>,
              ...(i < arr.length - 1 ? [<div key={`sep-${i}`} style={{ background: "var(--w-border)" }} />] : []),
            ])}
          </div>
        </div>

        {/* Productivity Metrics */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: "0 0 12px" }}>PRODUCTIVITY METRICS</p>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {([
              { label: "Trips Today",   value: "342",   sub: "↑ +18 vs yesterday" },
              { label: "Pallets Moved", value: "1,284", sub: "Across 4 zones"      },
              { label: "Fleet Hours",   value: "186h",  sub: "Total time logged"   },
            ] as { label: string; value: string; sub: string }[]).map(({ label, value, sub }, i, arr) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--w-divider)" : "none" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--w-text-1)", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: "11px", color: "var(--w-text-3)", margin: "2px 0 0" }}>{sub}</p>
                </div>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--w-text-1)", letterSpacing: "-0.02em" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
