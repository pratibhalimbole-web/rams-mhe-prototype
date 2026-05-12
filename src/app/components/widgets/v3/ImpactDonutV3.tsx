import React, { useState } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart";
import type { ChartConfig } from "../../ui/chart";
import chevronIcon from "../../../../assets/icon-chevron-down.png";

const donutData = [
  { name: "No Issues", value: 18, fill: "#dbeafe" },
  { name: "Green",     value: 12, fill: "#93c5fd" },
  { name: "Amber",     value: 8,  fill: "#2563eb" },
  { name: "Red",       value: 4,  fill: "#1e40af" },
];

const chartConfig = {
  "No Issues": { label: "No Issues", color: "#dbeafe" },
  "Green":     { label: "Green",     color: "#93c5fd" },
  "Amber":     { label: "Amber",     color: "#2563eb" },
  "Red":       { label: "Red",       color: "#1e40af" },
} satisfies ChartConfig;

const maxIndex = donutData.reduce((maxI, item, i, arr) =>
  item.value > arr[maxI].value ? i : maxI, 0
);

function renderActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle}
        fill="var(--muted)"
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius} outerRadius={outerRadius}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill} stroke="#ffffff" strokeWidth={3}
      />
    </g>
  );
}

function DropdownButton({ label }: { label: string }) {
  return (
    <div
      style={{
        flex: 1,
        height: "32px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 13px",
        boxSizing: "border-box",
        cursor: "pointer",
      }}
    >
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", color: "#0f172a", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <img src={chevronIcon} alt="" style={{ width: "16px", height: "16px" }} />
    </div>
  );
}

export function ImpactDonutV3() {
  const [activeIndex, setActiveIndex] = useState(maxIndex);

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "1px",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        padding: "16px 20px",
        borderBottom: "1px solid #e2e8f0",
        flexShrink: 0,
        height: "80px",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>
            MHE Impact Responsibility Analysis
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>
            Stacked impact events by severity level
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0, width: "201px" }}>
          <DropdownButton label="All Zones" />
          <DropdownButton label="All Types" />
        </div>
      </div>

      {/* Donut chart */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 24px 0 24px", minHeight: 0 }}>
        <div style={{ position: "relative", width: "240px", height: "240px", flexShrink: 0 }}>
          <ChartContainer config={chartConfig} className="w-full h-full">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                stroke="#ffffff"
                strokeWidth={3}
                startAngle={90}
                endAngle={-270}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(maxIndex)}
              >
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          {/* Center label */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            pointerEvents: "none",
          }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "30px", lineHeight: "45px", color: "#0f172a" }}>
              42
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "#64748b", whiteSpace: "nowrap" }}>
              Total MHEs
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "16px 24px", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          {donutData.map((item) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: item.fill, borderRadius: "2px" }} />
              <span style={{ fontSize: "11px", color: "#64748b" }}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insight footer */}
      <div style={{
        borderTop: "1px solid #f1f5f9",
        padding: "11px 14px 0 14px",
        flexShrink: 0,
        height: "59.5px",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "11px", lineHeight: "16.5px", color: "#0f172a", whiteSpace: "nowrap" }}>
            MHE_012 reported most, mainly has red severity = 06
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b" }}>
            May 1 – May 7 2024
          </span>
        </div>
      </div>
    </div>
  );
}
