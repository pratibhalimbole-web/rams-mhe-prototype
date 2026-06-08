import React from "react";
import { Wrench } from "lucide-react";

const HORIZONS = [
  { label: "Next 30 days", badge: null,     count: 1, max: 2, color: "#ef4444", track: "#fee2e2" },
  { label: "Next 60 days", badge: "+1 new", count: 2, max: 2, color: "#f59e0b", track: "#fef3c7" },
  { label: "Next 90 days", badge: null,     count: 2, max: 2, color: "#94a3b8", track: "#f1f5f9" },
];

export function AssetBurnForecastWidget() {
  return (
    <div style={{ background: "linear-gradient(145deg, #fffbeb 0%, #fff 60%)", border: "1px solid #fde68a", borderRadius: "14px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#fef9c3", border: "1px solid #fde68a", borderRadius: "999px", padding: "4px 12px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#b45309" }}>Asset Burn Forecast</span>
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#94a3b8" }}>next 90 days</span>
      </div>

      {/* Hero */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "42px", fontWeight: 700, color: "#0f172a", lineHeight: 1, letterSpacing: "-1px" }}>2</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#374151" }}>MHEs due for service</span>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#64748b", margin: 0 }}>Units reaching their service interval by horizon</p>
      </div>

      {/* Horizon bars */}
      <div style={{ padding: "18px 20px 0", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
        {HORIZONS.map(({ label, badge, count, max, color, track }) => (
          <div key={label}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#374151" }}>{label}</span>
                {badge && (
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#f59e0b", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "999px", padding: "1px 7px" }}>{badge}</span>
                )}
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px" }}>{count}</span>
            </div>
            {/* Track */}
            <div style={{ height: "8px", borderRadius: "999px", background: track, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "999px", background: color, width: `${(count / max) * 100}%`, transition: "width 0.4s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer insight */}
      <div style={{ margin: "18px 20px 16px", background: "rgba(255,255,255,0.6)", border: "1px solid #fde68a", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
        <Wrench size={13} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#374151", margin: 0, lineHeight: "16px" }}>
          <strong>1 MHE</strong> due within 30 days — schedule servicing and plan floor coverage.
        </p>
      </div>
    </div>
  );
}
