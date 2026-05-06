"use client";

import React from "react";
import {
  SimpleModal,
  SimpleModalHeader,
  SimpleModalTitle,
  SimpleModalDescription,
  SimpleModalBody,
  SimpleModalFooter,
} from "./SimpleModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Label } from "../../ui/label";
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

interface TestExecutionData {
  testName: string;
  mappedElement: string;
  inspector: string;
  executed: number;
  total: number;
  percentage: number;
}

interface TestsExecutedModalProps {
  open: boolean;
  onOpenChange: (() => void) | ((open: boolean) => void);
  testsExecuted: number;
}

// Actual IRDS Integrity Test execution data with Inspector associations
const testExecutionData: TestExecutionData[] = [
  { testName: "Plumbness", mappedElement: "Rack Upright", inspector: "John Smith", executed: 5, total: 6, percentage: 83.3 },
  { testName: "Rack Run Straightness", mappedElement: "System", inspector: "Sarah Johnson", executed: 4, total: 5, percentage: 80.0 },
  { testName: "System Lateral Sway", mappedElement: "System", inspector: "John Smith", executed: 4, total: 4, percentage: 100.0 },
  { testName: "Floor Flatness", mappedElement: "Floor", inspector: "Mike Chen", executed: 3, total: 4, percentage: 75.0 },
  { testName: "Baseplate Settlement Baseline", mappedElement: "Baseplate", inspector: "Sarah Johnson", executed: 2, total: 3, percentage: 66.7 },
  { testName: "Component Bend", mappedElement: "Component", inspector: "John Smith", executed: 3, total: 3, percentage: 100.0 },
  { testName: "Component Dent", mappedElement: "Component", inspector: "Mike Chen", executed: 1, total: 2, percentage: 50.0 },
  { testName: "Component Corrosion", mappedElement: "Component", inspector: "Sarah Johnson", executed: 2, total: 2, percentage: 100.0 },
  { testName: "Material Strength", mappedElement: "Component", inspector: "John Smith", executed: 1, total: 2, percentage: 50.0 },
  { testName: "Floor – UPV", mappedElement: "Floor", inspector: "Mike Chen", executed: 0, total: 1, percentage: 0.0 },
];

// Extract unique inspectors for dropdown
const uniqueInspectors = Array.from(new Set(testExecutionData.map(d => d.inspector))).sort();

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TestExecutionData;
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
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--muted-foreground)",
            margin: 0,
            marginBottom: "var(--spacing-1)",
          }}
        >
          Inspector: {data.inspector}
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
          Executed: {data.executed} / {data.total}
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
          {data.percentage.toFixed(1)}% completion rate
        </p>
      </div>
    );
  }
  return null;
};

// Generate dynamic Execution Summary based on filters
function generateExecutionSummary(
  filteredData: TestExecutionData[],
  inspector: string,
  element: string,
  testType: string
): string {
  // Empty state
  if (filteredData.length === 0) {
    if (inspector !== "All Inspectors" && element !== "All" && testType !== "All Test Types") {
      return "No test executions match the selected combination of inspector, element, and test type.";
    } else if (inspector !== "All Inspectors" && element !== "All") {
      return `No ${element.toLowerCase()}-related test executions are available for the selected inspector.`;
    } else if (inspector !== "All Inspectors") {
      return "The selected inspector has no test executions in the current cycle.";
    } else if (element !== "All") {
      return `No test executions are recorded for ${element.toLowerCase()} elements.`;
    } else if (testType !== "All Test Types") {
      return `The ${testType} test has no execution records in the current cycle.`;
    }
    return "No test executions are available for the selected filters.";
  }

  // Single test type selected
  if (testType !== "All Test Types") {
    const test = filteredData[0];
    const completionRate = test.percentage.toFixed(1);
    if (inspector !== "All Inspectors" && element !== "All") {
      return `${testType} execution on ${test.mappedElement} elements by ${inspector} shows ${completionRate}% completion (${test.executed}/${test.total}).`;
    } else if (inspector !== "All Inspectors") {
      return `${testType} execution under ${inspector}'s scope shows ${completionRate}% completion (${test.executed}/${test.total}).`;
    } else if (element !== "All") {
      return `${testType} execution on ${test.mappedElement} elements shows ${completionRate}% completion (${test.executed}/${test.total}).`;
    }
    return `${testType} execution shows ${completionRate}% completion with ${test.executed} of ${test.total} tests completed.`;
  }

  // Calculate aggregated metrics
  const totalExecuted = filteredData.reduce((sum, d) => sum + d.executed, 0);
  const totalPlanned = filteredData.reduce((sum, d) => sum + d.total, 0);
  const avgCompletion = totalPlanned > 0 ? ((totalExecuted / totalPlanned) * 100).toFixed(1) : "0.0";
  
  // Element-specific filtering
  if (element !== "All") {
    if (inspector !== "All Inspectors") {
      return `${element}-related test execution by ${inspector} shows ${avgCompletion}% completion across ${filteredData.length} test type${filteredData.length > 1 ? 's' : ''} (${totalExecuted}/${totalPlanned} tests).`;
    }
    return `${element}-related test execution shows ${avgCompletion}% completion across ${filteredData.length} test type${filteredData.length > 1 ? 's' : ''} with ${totalExecuted} of ${totalPlanned} tests completed.`;
  }

  // Inspector-specific filtering
  if (inspector !== "All Inspectors") {
    const elements = Array.from(new Set(filteredData.map(d => d.mappedElement)));
    return `${inspector}'s test execution covers ${elements.length} element type${elements.length > 1 ? 's' : ''} with ${avgCompletion}% completion (${totalExecuted}/${totalPlanned} tests).`;
  }

  // Default state (All / All / All)
  return `Overall test execution shows ${avgCompletion}% completion with ${totalExecuted} of ${totalPlanned} tests completed. Component and system tests lead in progress.`;
}

export function TestsExecutedModal({
  open,
  onOpenChange,
  testsExecuted,
}: TestsExecutedModalProps) {
  const [inspector, setInspector] = React.useState("All Inspectors");
  const [element, setElement] = React.useState("All");
  const [testType, setTestType] = React.useState("All Test Types");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  
  // Range slider state - controls which bars are visible
  const [startIndex, setStartIndex] = React.useState(0);
  const barsToShow = 5; // Always show max 5 bars
  
  // Mount effect - ensure chart only renders when ready
  React.useEffect(() => {
    if (open) {
      // Small delay to ensure modal is fully rendered
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
        // Void function - just call it when closing
        if (!isOpen) {
          (onOpenChange as () => void)();
        }
      } else {
        // Boolean function - pass the value
        (onOpenChange as (open: boolean) => void)(isOpen);
      }
    }
  };

  // Apply filters (AND-based logic)
  const filteredData = React.useMemo(() => {
    return testExecutionData.filter((item) => {
      const matchesInspector = inspector === "All Inspectors" || item.inspector === inspector;
      const matchesElement = element === "All" || item.mappedElement === element;
      const matchesTestType = testType === "All Test Types" || item.testName === testType;
      return matchesInspector && matchesElement && matchesTestType;
    });
  }, [inspector, element, testType]);

  // Determine if zoom/pan should be enabled
  const zoomEnabled = filteredData.length > barsToShow;
  
  // Calculate max start index
  const maxStartIndex = zoomEnabled ? Math.max(0, filteredData.length - barsToShow) : 0;
  
  // Reset startIndex when filtered data changes and becomes <= barsToShow
  React.useEffect(() => {
    if (!zoomEnabled) {
      setStartIndex(0);
    } else if (startIndex > maxStartIndex) {
      setStartIndex(maxStartIndex);
    }
  }, [filteredData.length, zoomEnabled, maxStartIndex, startIndex]);

  // Calculate visible data based on slider position
  const visibleData = zoomEnabled 
    ? filteredData.slice(startIndex, startIndex + barsToShow)
    : filteredData;

  // Generate dynamic Execution Summary
  const executionSummary = React.useMemo(() => {
    return generateExecutionSummary(filteredData, inspector, element, testType);
  }, [filteredData, inspector, element, testType]);

  return (
    <SimpleModal open={open} onOpenChange={handleOpenChange}>
      {/* Header */}
      <SimpleModalHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-2)" }}>
          <SimpleModalTitle>Tests Executed</SimpleModalTitle>
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
          Tracks the number of integrity tests executed against the defined scope.
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
            Execution progress is measured against total defined tests; pass/fail status is evaluated separately.
          </p>
        </div>
      </SimpleModalHeader>

      {/* Body */}
      <SimpleModalBody>
        {/* Controls Row - Left Aligned */}
        <div
          data-controls="true"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "var(--spacing-3)",
            marginBottom: "var(--spacing-5)",
          }}
        >
          {/* Inspector Dropdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-1)",
              minWidth: "160px",
            }}
          >
            <Label
              htmlFor="inspector"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
                lineHeight: "1.43",
              }}
            >
              Inspector
            </Label>
            <Select value={inspector} onValueChange={setInspector}>
              <SelectTrigger
                id="inspector"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  minWidth: "160px",
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="All Inspectors">All Inspectors</SelectItem>
                {uniqueInspectors.map((insp) => (
                  <SelectItem key={insp} value={insp}>
                    {insp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Test Type Dropdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-1)",
              minWidth: "160px",
            }}
          >
            <Label
              htmlFor="test-type"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
                lineHeight: "1.43",
              }}
            >
              Test Type
            </Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger
                id="test-type"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  minWidth: "160px",
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="All Test Types">All Test Types</SelectItem>
                <SelectItem value="Plumbness">Plumbness</SelectItem>
                <SelectItem value="Rack Run Straightness">Rack Run Straightness</SelectItem>
                <SelectItem value="System Lateral Sway">System Lateral Sway</SelectItem>
                <SelectItem value="Floor Flatness">Floor Flatness</SelectItem>
                <SelectItem value="Baseplate Settlement Baseline">Baseplate Settlement Baseline</SelectItem>
                <SelectItem value="Component Bend">Component Bend</SelectItem>
                <SelectItem value="Component Dent">Component Dent</SelectItem>
                <SelectItem value="Component Splice">Component Splice</SelectItem>
                <SelectItem value="Component Thickness">Component Thickness</SelectItem>
                <SelectItem value="Component Corrosion">Component Corrosion</SelectItem>
                <SelectItem value="Material Strength">Material Strength</SelectItem>
                <SelectItem value="Surface Coating">Surface Coating</SelectItem>
                <SelectItem value="Floor – GPR">Floor – GPR</SelectItem>
                <SelectItem value="Floor – Hammer Rebound">Floor – Hammer Rebound</SelectItem>
                <SelectItem value="Floor – UPV">Floor – UPV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bar Chart - Test Execution Progress */}
        {visibleData.length > 0 && isMounted ? (
          <div
            data-chart-container="true"
            style={{
              width: "100%",
              height: "280px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "var(--spacing-4)",
              marginBottom: "var(--spacing-3)",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visibleData}
                width={700}
                height={300}
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
                    
                    const dataEntry = visibleData[index];
                    const uniqueKey = dataEntry ? `tick-${dataEntry.testName}-${dataEntry.inspector}-${index}` : `tick-${index}`;
                    
                    return (
                      <g 
                        key={uniqueKey}
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
                  dataKey="executed"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  {visibleData.map((entry, index) => (
                    <Cell
                      key={`cell-executed-${entry.testName}-${entry.inspector}-${index}`}
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
              height: "280px",
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
              No data matches the selected filters
            </p>
          </div>
        )}

        {/* Range Slider Control - Only show when zoom is enabled */}
        {zoomEnabled && visibleData.length > 0 && (
          <div
            data-range-slider-container="true"
            style={{
              width: "100%",
              padding: "0 var(--spacing-6)",
              marginBottom: "var(--spacing-5)",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "32px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Slider Track */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "4px",
                  backgroundColor: "var(--muted)",
                  borderRadius: "2px",
                }}
              />
              
              {/* Active Range Track */}
              <div
                style={{
                  position: "absolute",
                  left: `${(startIndex / filteredData.length) * 100}%`,
                  width: `${(barsToShow / filteredData.length) * 100}%`,
                  height: "4px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "2px",
                  transition: "left 0.2s ease",
                }}
              />

              {/* Slider Input */}
              <input
                type="range"
                min={0}
                max={maxStartIndex}
                step={1}
                value={startIndex}
                onChange={(e) => setStartIndex(Number(e.target.value))}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "32px",
                  margin: 0,
                  appearance: "none",
                  WebkitAppearance: "none",
                  background: "transparent",
                  cursor: "pointer",
                  zIndex: 2,
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  // Custom thumb styling via CSS-in-JS
                  target.style.setProperty('--thumb-position', `${(startIndex / maxStartIndex) * 100}%`);
                }}
              />
            </div>

            {/* Range Labels */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "var(--spacing-2)",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--muted-foreground)",
                }}
              >
                {filteredData[0].testName}
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--muted-foreground)",
                }}
              >
                {filteredData[filteredData.length - 1].testName}
              </span>
            </div>
          </div>
        )}

        {/* Execution Summary Block */}
        <div
          data-execution-summary="true"
          style={{
            width: "100%",
            padding: "var(--spacing-4)",
            backgroundColor: "var(--muted)",
            borderRadius: "var(--radius)",
            marginTop: visibleData.length === 0 ? 0 : (zoomEnabled ? 0 : "var(--spacing-5)"),
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
            Execution Summary
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
            {executionSummary}
          </p>
        </div>
      </SimpleModalBody>
    </SimpleModal>
  );
}