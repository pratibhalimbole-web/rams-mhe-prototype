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

interface TestDefinitionData {
  testName: string;
  mappedElement: string;
  inspector: string;
  count: number;
  percentage: number;
}

interface TotalTestsDefinedModalProps {
  open: boolean;
  onOpenChange: (() => void) | ((open: boolean) => void);
  totalTests: number;
}

// Actual IRDS Integrity Test Names with Inspector associations
const testDefinitionData: TestDefinitionData[] = [
  { testName: "Plumbness", mappedElement: "Rack Upright", inspector: "John Smith", count: 6, percentage: 18.8 },
  { testName: "Rack Run Straightness", mappedElement: "System", inspector: "Sarah Johnson", count: 5, percentage: 15.6 },
  { testName: "System Lateral Sway", mappedElement: "System", inspector: "John Smith", count: 4, percentage: 12.5 },
  { testName: "Floor Flatness", mappedElement: "Floor", inspector: "Mike Chen", count: 4, percentage: 12.5 },
  { testName: "Baseplate Settlement Baseline", mappedElement: "Baseplate", inspector: "Sarah Johnson", count: 3, percentage: 9.4 },
  { testName: "Component Bend", mappedElement: "Component", inspector: "John Smith", count: 3, percentage: 9.4 },
  { testName: "Component Dent", mappedElement: "Component", inspector: "Mike Chen", count: 2, percentage: 6.3 },
  { testName: "Component Corrosion", mappedElement: "Component", inspector: "Sarah Johnson", count: 2, percentage: 6.3 },
  { testName: "Material Strength", mappedElement: "Component", inspector: "John Smith", count: 2, percentage: 6.3 },
  { testName: "Floor – UPV", mappedElement: "Floor", inspector: "Mike Chen", count: 1, percentage: 3.1 },
];

// Extract unique inspectors for dropdown
const uniqueInspectors = Array.from(new Set(testDefinitionData.map(d => d.inspector))).sort();

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TestDefinitionData;
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
          Tests Defined: {data.count}
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
          {data.percentage}% of total scope
        </p>
      </div>
    );
  }
  return null;
};

// Generate dynamic Definition Summary based on filters
function generateDefinitionSummary(
  filteredData: TestDefinitionData[],
  inspector: string,
  element: string,
  testType: string
): string {
  // Empty state
  if (filteredData.length === 0) {
    if (inspector !== "All Inspectors" && element !== "All" && testType !== "All Test Types") {
      return "No test definitions match the selected combination of inspector, element, and test type.";
    } else if (inspector !== "All Inspectors" && element !== "All") {
      return `No ${element.toLowerCase()}-related tests are defined for the selected inspector.`;
    } else if (inspector !== "All Inspectors") {
      return "The selected inspector has no test definitions in the current scope.";
    } else if (element !== "All") {
      return `No test definitions are mapped to ${element.toLowerCase()} elements.`;
    } else if (testType !== "All Test Types") {
      return `The ${testType} test is not defined in the current scope.`;
    }
    return "No test definitions are available for the selected filters.";
  }

  // Single test type selected
  if (testType !== "All Test Types") {
    const test = filteredData[0];
    if (inspector !== "All Inspectors" && element !== "All") {
      return `${testType} is mapped to ${test.mappedElement} elements under ${inspector}'s inspection scope.`;
    } else if (inspector !== "All Inspectors") {
      return `${testType} is defined under ${inspector}'s inspection scope with ${test.count} test instances.`;
    } else if (element !== "All") {
      return `${testType} is applied to ${test.mappedElement} elements across the current scope.`;
    }
    return `${testType} is configured with ${test.count} test instances in the current scope.`;
  }

  // Element-specific filtering
  if (element !== "All") {
    const totalTests = filteredData.reduce((sum, d) => sum + d.count, 0);
    if (inspector !== "All Inspectors") {
      return `${element}-related integrity tests are defined for ${inspector}, with ${filteredData.length} test type${filteredData.length > 1 ? 's' : ''} and ${totalTests} total instances.`;
    }
    return `${element}-related tests show ${filteredData.length} test type${filteredData.length > 1 ? 's' : ''} with focus on structural and component validation.`;
  }

  // Inspector-specific filtering
  if (inspector !== "All Inspectors") {
    const totalTests = filteredData.reduce((sum, d) => sum + d.count, 0);
    const elements = Array.from(new Set(filteredData.map(d => d.mappedElement)));
    return `${inspector}'s scope includes ${filteredData.length} test type${filteredData.length > 1 ? 's' : ''} across ${elements.length} element type${elements.length > 1 ? 's' : ''}, totaling ${totalTests} test instances.`;
  }

  // Default state (All / All / All)
  return "Integrity definitions are concentrated on geometric and component-level tests, with fewer material and floor validation tests.";
}

export function TotalTestsDefinedModal({
  open,
  onOpenChange,
  totalTests,
}: TotalTestsDefinedModalProps) {
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
    return testDefinitionData.filter((item) => {
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

  // Generate dynamic Definition Summary
  const definitionSummary = React.useMemo(() => {
    return generateDefinitionSummary(filteredData, inspector, element, testType);
  }, [filteredData, inspector, element, testType]);

  // Prevent interactions from causing page reload
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <SimpleModal open={open} onOpenChange={handleOpenChange}>
      {/* Header */}
      <SimpleModalHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-2)" }}>
          <SimpleModalTitle>Total Tests Defined</SimpleModalTitle>
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
          Represents the full integrity test scope configured for this cycle.
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
            This reflects test definitions mapped to elements; execution status is shown separately.
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

        {/* Bar Chart - Test Definition Distribution */}
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
                  dataKey="count"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  {visibleData.map((entry, index) => (
                    <Cell
                      key={`cell-test-${entry.testName}-${entry.inspector}-${index}`}
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

        {/* Definition Summary Block */}
        <div
          data-definition-summary="true"
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
            Definition Summary
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
            {definitionSummary}
          </p>
        </div>
      </SimpleModalBody>
    </SimpleModal>
  );
}