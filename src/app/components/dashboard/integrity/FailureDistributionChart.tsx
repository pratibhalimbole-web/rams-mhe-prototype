"use client";

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Cell
} from "recharts";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardAction 
} from "../../ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "../../ui/chart";
import { ChevronDown, Info, Settings } from "lucide-react";
import { Button } from "../../ui/button";

// Sample data for failures by test type
const failureData = [
  { name: "Plumbness", affected: "Rack Upright", failures: 6, critical: 3, major: 2, minor: 1, severity: "Critical" },
  { name: "Rack Run...", affected: "System", failures: 2, critical: 0, major: 1, minor: 1, severity: "Major" },
  { name: "Straight...", affected: "System", failures: 9, critical: 0, major: 0, minor: 9, severity: "Minor" },
  { name: "Baseplate Settl...", affected: "Baseplate", failures: 5, critical: 2, major: 2, minor: 1, severity: "Critical" },
  { name: "Floor - GPR", affected: "Floor", failures: 3, critical: 0, major: 2, minor: 1, severity: "Major" },
];

const chartConfig = {
  failures: {
    label: "Failures",
  },
};

const getSeverityColor = (severity: string) => {
  if (severity === "Critical") return "hsl(var(--destructive))";
  if (severity === "Major") return "hsl(var(--warning))";
  return "hsl(var(--muted-foreground))";
};

export function FailureDistributionChart() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Calculate totals for summary
  const totals = failureData.reduce(
    (acc, item) => ({
      critical: acc.critical + item.critical,
      major: acc.major + item.major,
      minor: acc.minor + item.minor,
    }),
    { critical: 0, major: 0, minor: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Failure Distribution</CardTitle>
        <CardAction>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" className="h-8 gap-1">
              By Test Type
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 h-[200px]">
          {/* Chart */}
          <div className="flex-1 h-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                data={failureData}
                layout="vertical"
                onMouseMove={(state) => {
                  if (state.isTooltipActive) {
                    setHoveredIndex(state.activeTooltipIndex ?? null);
                  } else {
                    setHoveredIndex(null);
                  }
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar key="bar-failures" dataKey="failures" radius={[0, 4, 4, 0]}>
                  {failureData.map((entry, index) => (
                    <Cell
                      key={`cell-failure-${entry.element}-${entry.severity}-${index}`}
                      fill={getSeverityColor(entry.severity)}
                      opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Summary Card */}
          <div className="bg-muted rounded-lg p-4 min-w-[160px] flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground">In Failures:</p>
            
            <div className="text-4xl font-extrabold">
              {totals.critical + totals.major + totals.minor}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm font-medium">Critical</span>
                <span className="text-sm font-semibold ml-auto">{totals.critical}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-sm font-medium">Major</span>
                <span className="text-sm font-semibold ml-auto">{totals.major}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span className="text-sm font-medium">Minor</span>
                <span className="text-sm font-semibold ml-auto">{totals.minor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Slider */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-8 bg-muted rounded relative overflow-hidden">
            <div className="absolute left-0 right-[40%] top-0 bottom-0 bg-muted-foreground/20 rounded" />
          </div>
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
            More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}