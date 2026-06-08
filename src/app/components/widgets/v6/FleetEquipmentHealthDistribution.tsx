import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { PieChart, Pie, Cell, Sector } from "recharts";
import {
  COLORS, donutChartConfig,
  equipmentHealthDataByType, equipmentHealthData,
} from "../../../pages/mhe/FMSDashboard";

const colorMap: Record<string, string> = {
  "No Issues":       COLORS.noIssues,
  "Healthy (Green)": COLORS.healthy,
  "Warning (Amber)": COLORS.warning,
  "Critical (Red)":  COLORS.critical,
};

function renderActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={outerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle} fill="var(--muted)" />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius}
        startAngle={startAngle} endAngle={endAngle} fill={fill} stroke="#ffffff" strokeWidth={3} />
    </g>
  );
}

const defaultMaxIndex = equipmentHealthData.reduce(
  (maxIdx, item, index, arr) => (item.value > arr[maxIdx].value ? index : maxIdx), 0
);

export function FleetEquipmentHealthDistribution() {
  const [selectedEquipment, setSelectedEquipment] = useState("Overall");
  const [activeIndex, setActiveIndex] = useState(defaultMaxIndex);

  const data = equipmentHealthDataByType[selectedEquipment] || equipmentHealthData;
  const total = data.reduce((sum: number, item: any) => sum + item.value, 0);

  const insight = useMemo(() => {
    if (!data || data.length === 0) return null;
    const topStatus = data.reduce((max: any, item: any) => item.value > max.value ? item : max);
    const topLabel = topStatus.name.replace(" (Green)", "").replace(" (Amber)", "").replace(" (Red)", "");
    const secondary = data.filter((item: any) => item.name !== topStatus.name).sort((a: any, b: any) => b.value - a.value)[0];
    const secondaryLabel = secondary?.name.replace(" (Green)", "").replace(" (Amber)", "").replace(" (Red)", "") || "Others";
    return { topLabel, secondaryLabel };
  }, [data]);

  return (
    <Card className="shadow-none border-[var(--border)] flex flex-col overflow-hidden h-full">
      <CardHeader className="pb-2 border-b border-[var(--border)]">
        <div className="flex items-start justify-between w-full gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
              Fleet Equipment Health Distribution
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              Fleet equipment warranty validity status across all MHE assets.
            </CardDescription>
          </div>
          <div className="w-[200px] flex-shrink-0">
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Overall">Overall</SelectItem>
                <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center p-6 pb-0">
        <div style={{ width: "240px", height: "240px", position: "relative" }}>
          <ChartContainer config={donutChartConfig} className="w-full h-full">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={70} outerRadius={100}
                paddingAngle={3}
                dataKey="value" nameKey="name"
                stroke="#ffffff" strokeWidth={3}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(defaultMaxIndex)}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colorMap[entry.name] || COLORS.noIssues} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
            <div className="text-[length:var(--text-2xl)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">{total}</div>
            <div className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] mt-1">Total MHEs</div>
          </div>
        </div>
      </CardContent>

      {/* Legend */}
      <div style={{ padding: "16px 24px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          {data.map((item: any) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: colorMap[item.name], borderRadius: "2px" }} />
              <span style={{ fontSize: "11px", color: "#64748B" }}>
                {item.name.replace(" (Green)", "").replace(" (Amber)", "").replace(" (Red)", "")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insight footer */}
      {insight && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0 }}>
              {insight.topLabel} status reported most, mainly by {insight.secondaryLabel}
            </p>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
              {selectedEquipment === "Overall" ? "All Equipment Types" : selectedEquipment}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
