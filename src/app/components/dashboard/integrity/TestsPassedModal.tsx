"use client";

import React from "react";
import {
  SimpleModal,
  SimpleModalHeader,
  SimpleModalTitle,
  SimpleModalDescription,
  SimpleModalBody,
} from "./SimpleModal";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  ResponsiveContainer
} from "recharts";

interface TestPassedData {
  id: string;
  testName: string;
  mappedElement: string;
  passed: number;
  total: number;
  percentage: number;
}

interface TestsPassedModalProps {
  open: boolean;
  onOpenChange: (() => void) | ((open: boolean) => void);
  testsPassed: number;
  totalTests: number;
}

// Actual IRDS Integrity Test passed data
const testPassedData: TestPassedData[] = [
  { id: "1", testName: "Plumbness", mappedElement: "Rack Upright", passed: 4, total: 5, percentage: 80.0 },
  { id: "2", testName: "Rack Run Straightness", mappedElement: "System", passed: 4, total: 4, percentage: 100.0 },
  { id: "3", testName: "System Lateral Sway", mappedElement: "System", passed: 4, total: 4, percentage: 100.0 },
  { id: "4", testName: "Floor Flatness", mappedElement: "Floor", passed: 2, total: 3, percentage: 66.7 },
  { id: "5", testName: "Baseplate Settlement", mappedElement: "Baseplate", passed: 2, total: 2, percentage: 100.0 },
  { id: "6", testName: "Component Bend", mappedElement: "Component", passed: 3, total: 3, percentage: 100.0 },
  { id: "7", testName: "Component Dent", mappedElement: "Component", passed: 1, total: 1, percentage: 100.0 },
  { id: "8", testName: "Component Corrosion", mappedElement: "Component", passed: 2, total: 2, percentage: 100.0 },
];

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TestPassedData;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "var(--popover)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "var(--spacing-3)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--popover-foreground)",
            margin: 0,
            marginBottom: "var(--spacing-2)",
          }}
        >
          {data.testName}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--muted-foreground)",
            margin: 0,
            marginBottom: "var(--spacing-1)",
          }}
        >
          Element: {data.mappedElement}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--popover-foreground)",
            margin: 0,
            marginBottom: "var(--spacing-1)",
          }}
        >
          Passed: {data.passed} / {data.total}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--muted-foreground)",
            margin: 0,
          }}
        >
          {data.percentage.toFixed(1)}% pass rate
        </p>
      </div>
    );
  }
  return null;
};

export function TestsPassedModal({
  open,
  onOpenChange,
  testsPassed,
  totalTests,
}: TestsPassedModalProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  
  // Mount effect - ensure chart only renders when ready
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsMounted(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [open]);

  // Wrapper to handle both callback types
  const handleOpenChange = (isOpen: boolean) => {
    if (typeof onOpenChange === 'function') {
      if (onOpenChange.length === 0) {
        if (!isOpen) {
          (onOpenChange as () => void)();
        }
      } else {
        (onOpenChange as (open: boolean) => void)(isOpen);
      }
    }
  };

  // Calculate pass rate
  const passRate = totalTests > 0 ? ((testsPassed / totalTests) * 100).toFixed(1) : "0.0";

  return (
    <SimpleModal open={open} onOpenChange={handleOpenChange}>
      {/* Header */}
      <SimpleModalHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-2)" }}>
          <SimpleModalTitle>Tests Passed</SimpleModalTitle>
          {/* Context Chip */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px var(--spacing-2)",
              backgroundColor: "var(--muted)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--muted-foreground)",
              }}
            >
              Current Cycle
            </span>
          </div>
        </div>
        
        <SimpleModalDescription>
          Shows the number of integrity tests that passed validation criteria.
        </SimpleModalDescription>
        
        {/* Helper note */}
        <div
          style={{
            marginTop: "var(--spacing-2)",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--muted-foreground)",
              lineHeight: "1.43",
              margin: 0,
              opacity: 0.8,
            }}
          >
            Pass rate: {passRate}% ({testsPassed} of {totalTests} tests)
          </p>
        </div>
      </SimpleModalHeader>

      {/* Body */}
      <SimpleModalBody>
        {/* Bar Chart - Test Pass Progress */}
        {testPassedData.length > 0 && isMounted ? (
          <div
            data-chart-container="true"
            style={{
              width: "100%",
              height: "320px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "var(--spacing-4)",
              marginBottom: "var(--spacing-3)",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={testPassedData}
                width={700}
                height={320}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barCategoryGap="5%"
                barGap={2}
                onClick={(e) => {
                  if (e) {
                    e.preventDefault?.();
                    e.stopPropagation?.();
                  }
                }}
                onMouseMove={(state) => {
                  if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
                    setHoveredIndex(state.activeTooltipIndex);
                  } else {
                    setHoveredIndex(null);
                  }
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CartesianGrid 
                  vertical={false} 
                  strokeDasharray="0"
                  stroke="var(--border)"
                  opacity={0.2}
                />
                
                <XAxis
                  dataKey="testName"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={2}
                  interval={0}
                  angle={0}
                  height={24}
                  tick={({ x, y, payload, index }) => {
                    const maxLength = 12;
                    const displayText = payload.value.length > maxLength 
                      ? payload.value.slice(0, maxLength) + "…" 
                      : payload.value;
                    
                    return (
                      <g 
                        transform={`translate(${x},${y})`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <text
                          x={0}
                          y={0}
                          dy={6}
                          textAnchor="middle"
                          fill="var(--muted-foreground)"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 10,
                            fontWeight: 400,
                            pointerEvents: 'all',
                          }}
                        >
                          {displayText}
                        </text>
                      </g>
                    );
                  }}
                />

                <YAxis
                  tick={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 10,
                    fontWeight: 400,
                    fill: "var(--muted-foreground)",
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={2}
                  width={24}
                />

                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{
                    fill: "transparent",
                    stroke: "var(--border)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                    opacity: 0.5,
                  }}
                />

                <Bar
                  dataKey="passed"
                  fill="hsl(142, 76%, 36%)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  {testPassedData.map((entry, index) => (
                    <Cell
                      key={`cell-passed-${entry.id}-${entry.testName}`}
                      opacity={hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.35}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            data-empty-state="true"
            style={{
              width: "100%",
              height: "320px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "var(--spacing-4)",
              marginBottom: "var(--spacing-3)",
              backgroundColor: "var(--muted)",
              borderRadius: "var(--radius)",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              No passed test data available
            </p>
          </div>
        )}

        {/* Pass Summary Block */}
        <div
          data-pass-summary="true"
          style={{
            width: "100%",
            padding: "var(--spacing-4)",
            backgroundColor: "hsl(142, 76%, 36%, 0.1)",
            borderRadius: "var(--radius)",
            marginTop: "var(--spacing-5)",
            borderLeft: "4px solid hsl(142, 76%, 36%)",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--muted-foreground)",
              margin: 0,
              marginBottom: "var(--spacing-2)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Pass Summary
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--foreground)",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            {testsPassed} tests have successfully passed validation criteria, representing a {passRate}% pass rate. Component tests show the highest success rate, while system-level tests maintain consistent passing results.
          </p>
        </div>
      </SimpleModalBody>
    </SimpleModal>
  );
}