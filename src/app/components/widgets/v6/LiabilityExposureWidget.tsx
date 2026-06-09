import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const TREND_DATA = [
  { day: "D1",  v: 18 }, { day: "D2",  v: 22 }, { day: "D3",  v: 19 },
  { day: "D4",  v: 28 }, { day: "D5",  v: 35 }, { day: "D6",  v: 30 },
  { day: "D7",  v: 24 }, { day: "D8",  v: 16 }, { day: "D9",  v: 10 },
  { day: "D10", v: 5  }, { day: "D11", v: 0  },
];

const PERIOD_DATA: Record<string, { baseline: number; current: number; delta: number; label: string }> = {
  "7d":  { baseline: 68,  current: 0, delta: -68,  label: "Last 7 days"  },
  "28d": { baseline: 226, current: 0, delta: -226, label: "Last 28 days" },
  "90d": { baseline: 412, current: 0, delta: -412, label: "Last 90 days" },
};

const FS: React.CSSProperties = {
  height: "32px", width: "auto", background: "var(--w-bg)",
  border: "1px solid var(--w-border)", borderRadius: "6px",
  padding: "0 13px", fontSize: "10px", color: "var(--w-text-1)",
  fontFamily: "Inter, sans-serif",
};

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid var(--w-border)", borderRadius: "6px", padding: "7px 10px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontFamily: "Inter, sans-serif" }}>
      <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 1px" }}>{payload[0].value} incidents</p>
      <p style={{ fontSize: "9px", color: "var(--w-text-3)", margin: 0 }}>per 1,000 op-hrs</p>
    </div>
  );
}

export function LiabilityExposureWidget() {
  const [period, setPeriod] = useState("28d");
  const d = PERIOD_DATA[period];
  const pct = Math.round(Math.abs(d.delta) / d.baseline * 100);

  const KPI_ITEMS = [
    { label: "CURRENT RATE",  value: `${d.current}`,          unit: "/ 1k hrs",        valueColor: "var(--w-text-1)" },
    { label: "BASELINE",      value: `${d.baseline}`,         unit: "incidents",        valueColor: "var(--w-text-1)" },
    { label: "REDUCTION",     value: `−${Math.abs(d.delta)}`, unit: "pts",              valueColor: "#16a34a" },
    { label: "IMPROVEMENT",   value: `${pct}%`,                unit: "vs baseline",      valueColor: "#16a34a" },
  ];

  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)" }}>Liability Exposure</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#dcfce7", borderRadius: "4px", padding: "2px 7px" }}>
              <TrendingDown size={10} style={{ color: "#16a34a" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#16a34a" }}>Improving</span>
            </span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)" }}>Weighted incidents per 1,000 operator-hours</span>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger style={FS}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="28d">Last 28 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CHART — top, fills available flex space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

        {/* Chart area */}
        <div style={{ flex: 1, minHeight: 0, padding: "16px 16px 0 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>11-Day Incident Trend</span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1b59f8", display: "inline-block" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "var(--w-text-3)" }}>Incidents / 1k hrs</span>
            </div>
          </div>
          <div style={{ height: "calc(100% - 29px)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: 4, bottom: 6 }}>
                <defs>
                  <linearGradient id="liabGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#1b59f8" stopOpacity={0.14} />
                    <stop offset="100%" stopColor="#1b59f8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "var(--w-text-5)" }}
                  axisLine={false} tickLine={false} interval={1}
                />
                <YAxis
                  tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "var(--w-text-5)" }}
                  axisLine={false} tickLine={false} width={26}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--w-border)", strokeWidth: 1 }} />
                <ReferenceLine y={0} stroke="var(--w-bg-muted)" strokeDasharray="3 3" />
                <Area
                  type="monotone" dataKey="v"
                  stroke="#1b59f8" strokeWidth={2}
                  fill="url(#liabGrad3)" dot={false}
                  activeDot={{ r: 4, fill: "#1b59f8", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI strip — bottom, fixed height */}
        <div style={{ borderTop: "1px solid var(--w-divider)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", flexShrink: 0 }}>
          {KPI_ITEMS.map(({ label, value, unit, valueColor }, i) => (
            <div
              key={label}
              style={{
                padding: "10px 0",
                textAlign: "center",
                borderRight: i < KPI_ITEMS.length - 1 ? "1px solid var(--w-divider)" : "none",
              }}
            >
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 3px" }}>{label}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: valueColor, margin: "0 0 1px", letterSpacing: "-0.4px" }}>{value}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "var(--w-text-3)", margin: 0 }}>{unit}</p>
            </div>
          ))}
        </div>

      </div>


    </div>
  );
}
