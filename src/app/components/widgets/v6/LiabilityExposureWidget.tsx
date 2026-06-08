import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, AlertTriangle } from "lucide-react";

const TREND_DATA = [
  { day: "D1",  v: 18 }, { day: "D2",  v: 22 }, { day: "D3",  v: 19 },
  { day: "D4",  v: 28 }, { day: "D5",  v: 35 }, { day: "D6",  v: 30 },
  { day: "D7",  v: 24 }, { day: "D8",  v: 16 }, { day: "D9",  v: 10 },
  { day: "D10", v: 5  }, { day: "D11", v: 0  },
];

export function LiabilityExposureWidget() {
  return (
    <div style={{ background: "linear-gradient(145deg, #fff5f5 0%, #fff 60%)", border: "1px solid #fecaca", borderRadius: "14px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "999px", padding: "4px 12px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#dc2626" }}>Liability Exposure</span>
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#94a3b8" }}>/ 1000 op-hrs</span>
      </div>

      {/* Hero */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "42px", fontWeight: 700, color: "#0f172a", lineHeight: 1, letterSpacing: "-1px" }}>0</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#dcfce7", borderRadius: "6px", padding: "3px 8px" }}>
            <TrendingDown size={12} style={{ color: "#16a34a" }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#16a34a" }}>100.0% vs 28d</span>
          </div>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#64748b", margin: 0 }}>Weighted incidents per 1000 operator-hours</p>
      </div>

      {/* Metric Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "14px 20px 0" }}>
        {[
          { label: "28-DAY BASELINE", value: "226" },
          { label: "BELOW BASELINE",  value: "−226 pts" },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 14px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", margin: "0 0 6px", textTransform: "uppercase" }}>{label}</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>11-Day Trend</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#ef4444" }}>Falling</span>
        </div>
        <div style={{ height: "80px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="liabilityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: "10px", borderRadius: "6px", border: "1px solid #fecaca" }}
                formatter={(v: any) => [`${v}`, "Incidents"]}
                labelFormatter={() => ""}
              />
              <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} fill="url(#liabilityGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer insight */}
      <div style={{ margin: "14px 20px 16px", background: "rgba(255,255,255,0.6)", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
        <AlertTriangle size={13} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#374151", margin: 0, lineHeight: "16px" }}>
          <strong>226 pts below</strong> the 28-day baseline — exposure easing vs the trailing month.
        </p>
      </div>
    </div>
  );
}
