import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../../ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { failureChartConfig, componentFailureDataByType } from "../../../pages/mhe/FMSDashboard";

export function ComponentFailureDistribution() {
  const [selectedEquipment, setSelectedEquipment] = useState("Electric Forklift");

  const currentData = componentFailureDataByType[selectedEquipment];

  const insight = useMemo(() => {
    if (!currentData || currentData.length === 0) return null;
    const componentWithMostFailures = currentData.reduce((max: any, item: any) =>
      (item.Red + item.Amber) > ((max.Red || 0) + (max.Amber || 0)) ? item : max
    );
    const redCount = componentWithMostFailures.Red || 0;
    const amberCount = componentWithMostFailures.Amber || 0;
    const severityLabel = redCount > amberCount ? "high severity" : amberCount > 0 ? "medium severity" : "low severity";
    return { topComponent: componentWithMostFailures.part, severityLabel };
  }, [currentData]);

  return (
    <Card className="shadow-none border-[var(--border)] flex flex-col overflow-hidden h-full">
      <CardHeader className="pb-2 border-b border-[var(--border)]">
        <div className="flex items-start justify-between w-full gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
              Component Failure Distribution
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              Frequency of inspection findings units.
            </CardDescription>
          </div>
          <div className="w-[200px] flex-shrink-0">
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pb-0 flex flex-col flex-1">
        <div className="overflow-x-auto flex-1">
          <div className={currentData.length > 5 ? "min-w-[600px]" : ""}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "20px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748B", transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>Count</span>
              </div>
              <ChartContainer config={failureChartConfig} className="h-[260px]" style={{ paddingLeft: "8px" }}>
                <BarChart data={currentData} margin={{ top: 10, right: 20, left: 36, bottom: 10 }} barGap="20%">
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="part" tickLine={false} tickMargin={10} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={30} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="No Issues" stackId="a" fill="hsl(217, 98%, 54%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Green"     stackId="a" fill="hsl(222, 84%, 62%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Amber"     stackId="a" fill="hsl(226, 75%, 68%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Red"       stackId="a" fill="hsl(230, 67%, 85%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Insight footer */}
      {insight && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: "2px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0 }}>
            {insight.topComponent} reported most failures, mainly by {insight.severityLabel}
          </p>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{selectedEquipment}</p>
        </div>
      )}
    </Card>
  );
}
