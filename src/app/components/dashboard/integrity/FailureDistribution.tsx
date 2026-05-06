"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card";
import { ChevronDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Slider } from "../../ui/slider";

// Sample data for grouped bar chart - 12 test types
const failureData = [
  {
    id: "plumbness",
    element: "Plumbness",
    red: 6,
    amber: 2,
  },
  {
    id: "rack-run",
    element: "Rack Run",
    red: 4,
    amber: 3,
  },
  {
    id: "straightness",
    element: "Straightness",
    red: 5,
    amber: 4,
  },
  {
    id: "baseplate",
    element: "Baseplate",
    red: 3,
    amber: 5,
  },
  {
    id: "floor-gpr",
    element: "Floor GPR",
    red: 2,
    amber: 1,
  },
  {
    id: "column-alignment",
    element: "Column Alignment",
    red: 7,
    amber: 3,
  },
  {
    id: "beam-elevation",
    element: "Beam Elevation",
    red: 3,
    amber: 6,
  },
  {
    id: "diagonal-bracing",
    element: "Diagonal Bracing",
    red: 5,
    amber: 2,
  },
  {
    id: "connection-gaps",
    element: "Connection Gaps",
    red: 4,
    amber: 4,
  },
  {
    id: "weld-quality",
    element: "Weld Quality",
    red: 6,
    amber: 3,
  },
  {
    id: "bolt-torque",
    element: "Bolt Torque",
    red: 2,
    amber: 5,
  },
  {
    id: "anchor-bolts",
    element: "Anchor Bolts",
    red: 3,
    amber: 2,
  },
];

export function FailureDistribution() {
  const [isMounted, setIsMounted] = useState(false);
  const [windowRange, setWindowRange] = useState<[number, number]>([0, 5]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    // Add a small delay to ensure the container is fully rendered
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Window-based slicing: show items from index windowRange[0] to windowRange[1]
  const visibleData = failureData.slice(windowRange[0], windowRange[1] + 1);

  // Generate a stable key for the chart based on visible item IDs
  const chartKey = `failure-chart-${visibleData.map(d => d.id).join('-')}`;

  return (
    <Card
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <CardHeader
        style={{
          paddingBottom: "var(--spacing-2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <CardTitle
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Failure Distribution
            </CardTitle>
            <CardDescription
              style={{
                fontSize: "var(--text-sm)",
                fontFamily: "'Inter', sans-serif",
                marginTop: "var(--spacing-1)",
              }}
            >
              Breakdown by element and severity
            </CardDescription>
          </div>

        </div>
      </CardHeader>

      <CardContent
        style={{
          paddingTop: "0",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chart Area */}
        <div style={{ height: "280px", width: "100%", minHeight: "280px", minWidth: "100px" }}>
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="failure-distribution-chart"
                data={visibleData}
                margin={{ top: 10, right: 25, left: 5, bottom: 40 }}
              >
                {/* Light dashed grid like Risk Index Trend */}
                <CartesianGrid
                  key="grid"
                  vertical={false}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="3 3"
                  opacity={0.15}
                />

                <XAxis
                  key="xaxis"
                  dataKey="element"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />

                <YAxis
                  key="yaxis"
                  tickLine={false}
                  axisLine={false}
                  width={35}
                  tickMargin={6}
                  stroke="var(--muted-foreground)"
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />

                <Tooltip
                  key="tooltip"
                  cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "8px 12px",
                    fontSize: "var(--text-sm)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  labelStyle={{
                    color: "var(--foreground)",
                    fontWeight: "var(--font-weight-medium)",
                    marginBottom: "4px",
                  }}
                  itemStyle={{
                    color: "var(--foreground)",
                  }}
                />

                <Legend
                  key="legend"
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingBottom: "8px",
                    fontSize: "12px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />

                <Bar
                  key="bar-red"
                  dataKey="red"
                  name="Red"
                  fill="hsl(0, 84%, 60%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                  isAnimationActive={false}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  opacity={activeIndex === null ? 1 : 0.6}
                />
                <Bar
                  key="bar-amber"
                  dataKey="amber"
                  name="Amber"
                  fill="hsl(38, 92%, 50%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                  isAnimationActive={false}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  opacity={activeIndex === null ? 1 : 0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Zoom Control */}
        <div
          style={{
            marginTop: "var(--spacing-3)",
          }}
        >
          <Slider
            value={windowRange}
            onValueChange={(value) => setWindowRange(value as [number, number])}
            min={0}
            max={failureData.length - 1}
            step={1}
            style={{
              width: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "var(--spacing-1)",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontFamily: "'Inter', sans-serif",
                color: "var(--muted-foreground)",
              }}
            >
              {windowRange[0] + 1}
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontFamily: "'Inter', sans-serif",
                color: "var(--muted-foreground)",
              }}
            >
              {windowRange[1] + 1}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Insight Section — EXACTLY like Risk Trend Chart */}
      <CardFooter
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--spacing-1)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            fontFamily: "'Inter', sans-serif",
            color: "var(--foreground)",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Major failures concentrated in Baseplate and Straightness
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            fontSize: "var(--text-sm)",
            fontFamily: "'Inter', sans-serif",
            color: "var(--muted-foreground)",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Critical issues highest in Plumbness this cycle
        </div>
      </CardFooter>
    </Card>
  );
}