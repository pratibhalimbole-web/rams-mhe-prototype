import React, { useState } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart";
import type { ChartConfig } from "../../ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const donutData = [
  { name: "Low",      value: 12, fill: "#93c5fd" },
  { name: "Medium",   value: 8,  fill: "#2563eb" },
  { name: "Critical", value: 4,  fill: "#1e40af" },
];

const chartConfig = {
  "Low":      { label: "Low",      color: "#93c5fd" },
  "Medium":   { label: "Medium",   color: "#2563eb" },
  "Critical": { label: "Critical", color: "#1e40af" },
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


const filterStyle: React.CSSProperties = {
  height: "32px",
  width: "auto",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "10px",
  color: "#0f172a",
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
};

export function ImpactDonutV3({ title, description, hideZoneFilter, useOemFilter }: { title?: string; description?: string; hideZoneFilter?: boolean; useOemFilter?: boolean } = {}) {
  const [activeIndex, setActiveIndex] = useState(maxIndex);
  const [zone, setZone] = useState("all_zones");
  const [type, setType] = useState("all_types");
  const [oem, setOem] = useState("all_oems");

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
            {title ?? "MHE Impact Responsibility Analysis"}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>
            {description ?? "Stacked impact events by severity level"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
          {!hideZoneFilter && (
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all_zones" style={{ whiteSpace: "nowrap" }}>All Zones</SelectItem>
                <SelectItem value="zone_a" style={{ whiteSpace: "nowrap" }}>Zone A</SelectItem>
                <SelectItem value="zone_b" style={{ whiteSpace: "nowrap" }}>Zone B</SelectItem>
                <SelectItem value="zone_c" style={{ whiteSpace: "nowrap" }}>Zone C</SelectItem>
              </SelectContent>
            </Select>
          )}
          {useOemFilter ? (
            <Select value={oem} onValueChange={setOem}>
              <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all_oems" style={{ whiteSpace: "nowrap" }}>All OEMs</SelectItem>
                <SelectItem value="toyota" style={{ whiteSpace: "nowrap" }}>Toyota</SelectItem>
                <SelectItem value="crown" style={{ whiteSpace: "nowrap" }}>Crown</SelectItem>
                <SelectItem value="raymond" style={{ whiteSpace: "nowrap" }}>Raymond</SelectItem>
                <SelectItem value="jungheinrich" style={{ whiteSpace: "nowrap" }}>Jungheinrich</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select value={type} onValueChange={setType}>
              <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all_types" style={{ whiteSpace: "nowrap" }}>All Types</SelectItem>
                <SelectItem value="forklift" style={{ whiteSpace: "nowrap" }}>Forklift</SelectItem>
                <SelectItem value="pallet_jack" style={{ whiteSpace: "nowrap" }}>Pallet Jack</SelectItem>
              </SelectContent>
            </Select>
          )}
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
        padding: "11px 16px 0 16px",
        flexShrink: 0,
        height: "59.5px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            4 units at Critical severity; 8 at Medium — 12 units remain at Low risk
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            May 7 – May 13, 2026
          </span>
        </div>
      </div>
    </div>
  );
}
