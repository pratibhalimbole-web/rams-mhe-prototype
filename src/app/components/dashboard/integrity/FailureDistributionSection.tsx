import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Slider } from "../../ui/slider";

const failureData = [
  { 
    name: "Plumbness", 
    failures: 6, 
    critical: 3, 
    major: 2, 
    minor: 1, 
    affected: "Rack Upright",
    severity: "Critical" 
  },
  { 
    name: "Rack Run Straightness", 
    failures: 2, 
    critical: 0, 
    major: 1, 
    minor: 1, 
    affected: "System",
    severity: "Major" 
  },
  { 
    name: "Straightness Tolerance", 
    failures: 9, 
    critical: 0, 
    major: 0, 
    minor: 9, 
    affected: "System",
    severity: "Minor" 
  },
  { 
    name: "Baseplate Settlement", 
    failures: 5, 
    critical: 2, 
    major: 2, 
    minor: 1, 
    affected: "Baseplate",
    severity: "Critical" 
  },
  { 
    name: "Floor GPR Test", 
    failures: 3, 
    critical: 0, 
    major: 2, 
    minor: 1, 
    affected: "Floor",
    severity: "Major" 
  },
];

const chartConfig = {
  failures: {
    label: "Failures",
  },
};

const getSeverityColor = (item: any) => {
  if (item.critical > 0) return "hsl(var(--destructive))";
  if (item.major > 0) return "hsl(var(--warning))";
  return "hsl(var(--muted-foreground))";
};

export function FailureDistributionSection() {
  const [viewMode, setViewMode] = useState("test-type");
  const [inspector, setInspector] = useState("all");
  const [element, setElement] = useState("all");
  const [testType, setTestType] = useState("all");
  const [zoomRange, setZoomRange] = useState([0]);

  const handleChartClick = (e: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Failure Distribution</CardTitle>
          
          <div className="flex items-center gap-4">
            {/* Toggle Group */}
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value)}
              variant="outline"
            >
              <ToggleGroupItem value="test-type">By Test Type</ToggleGroupItem>
              <ToggleGroupItem value="element">By Element</ToggleGroupItem>
            </ToggleGroup>

            {/* Filters */}
            <Select value={inspector} onValueChange={setInspector}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Inspector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Inspectors</SelectItem>
                <SelectItem value="john">John Smith</SelectItem>
                <SelectItem value="jane">Jane Doe</SelectItem>
              </SelectContent>
            </Select>

            <Select value={element} onValueChange={setElement}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Element" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Elements</SelectItem>
                <SelectItem value="upright">Rack Upright</SelectItem>
                <SelectItem value="beam">Beam</SelectItem>
                <SelectItem value="baseplate">Baseplate</SelectItem>
              </SelectContent>
            </Select>

            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Test Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Test Types</SelectItem>
                <SelectItem value="plumbness">Plumbness</SelectItem>
                <SelectItem value="straightness">Straightness</SelectItem>
                <SelectItem value="settlement">Settlement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bar Chart */}
        <div className="w-full" style={{ height: "360px" }}>
          <ChartContainer config={chartConfig} style={{ height: "100%", width: "100%" }}>
            <BarChart data={failureData} layout="vertical" onClick={handleChartClick}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={150}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <div className="font-semibold mb-2">{data.name}</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Affected: {data.affected}</div>
                          <div>Total Failures: {data.failures}</div>
                          <div className="pt-1 border-t mt-1">
                            <div className="text-destructive">Critical: {data.critical}</div>
                            <div className="text-warning">Major: {data.major}</div>
                            <div className="text-muted-foreground">Minor: {data.minor}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar key="bar-failures" dataKey="failures" radius={[0, 4, 4, 0]}>
                {failureData.map((entry, index) => (
                  <Cell
                    key={`cell-section-${entry.element}-${entry.severity}-${index}`}
                    fill={getSeverityColor(entry)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              value={zoomRange}
              onValueChange={setZoomRange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <span className="text-xs text-muted-foreground">Zoom</span>
        </div>
      </CardContent>
    </Card>
  );
}