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
  Cell 
} from "recharts";

import { ResponsiveContainer } from "recharts";

interface CriticalFailureData {
  testName: string;
  mappedElement: string;
  inspector: string;
  location: string;
  failures: number;
  severity: "Critical" | "High";
  impactScore: number;
}

interface CriticalFailuresModalProps {
  open: boolean;
  onOpenChange: (() => void) | ((open: boolean) => void);
  criticalFailures: number;
  totalTests: number;
}

// Critical failure data with severity and location details
const criticalFailureData: CriticalFailureData[] = [
  { testName: "Plumbness", mappedElement: "Rack Upright", inspector: "John Smith", location: "Zone A - Rack 12", failures: 3, severity: "Critical", impactScore: 95 },
  { testName: "Component Dent", mappedElement: "Component", inspector: "Mike Chen", location: "Zone B - Rack 8", failures: 2, severity: "Critical", impactScore: 88 },
  { testName: "Baseplate Settlement", mappedElement: "Baseplate", inspector: "Sarah Johnson", location: "Zone A - Rack 15", failures: 2, severity: "High", impactScore: 82 },
  { testName: "Floor Flatness", mappedElement: "Floor", inspector: "Mike Chen", location: "Zone C - Aisle 4", failures: 1, severity: "Critical", impactScore: 90 },
  { testName: "System Lateral Sway", mappedElement: "System", inspector: "John Smith", location: "Zone B - Row 3", failures: 1, severity: "High", impactScore: 78 },
  { testName: "Component Corrosion", mappedElement: "Component", inspector: "Sarah Johnson", location: "Zone A - Rack 7", failures: 1, severity: "Critical", impactScore: 85 },
];

// Extract unique values for filters
const uniqueInspectors = Array.from(new Set(criticalFailureData.map(d => d.inspector))).sort();

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CriticalFailureData;
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
            fontWeight: "var(--font-weight-semi-bold)",
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
          Location: {data.location}
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
          Failures: {data.failures}
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
          Severity: {data.severity} • Impact Score: {data.impactScore}
        </p>
      </div>
    );
  }
  return null;
};

// Generate dynamic insight based on filters
function generateCriticalSummary(
  filteredData: CriticalFailureData[],
  inspector: string,
  element: string,
  severity: string
): string {
  if (filteredData.length === 0) {
    if (inspector !== "All Inspectors" && element !== "All" && severity !== "All") {
      return "No critical failures match the selected combination of inspector, element, and severity.";
    } else if (inspector !== "All Inspectors" && element !== "All") {
      return `No ${element.toLowerCase()}-related critical failures are recorded for the selected inspector.`;
    } else if (inspector !== "All Inspectors") {
      return "The selected inspector has no critical failures in the current cycle.";
    } else if (element !== "All") {
      return `No critical failures are recorded for ${element.toLowerCase()} elements.`;
    } else if (severity !== "All") {
      return `No ${severity.toLowerCase()} severity failures are recorded in the current cycle.`;
    }
    return "No critical failures are recorded for the selected filters.";
  }

  const totalFailures = filteredData.reduce((sum, d) => sum + d.failures, 0);
  const avgImpactScore = (filteredData.reduce((sum, d) => sum + d.impactScore, 0) / filteredData.length).toFixed(0);
  const topFailure = [...filteredData].sort((a, b) => b.failures - a.failures)[0];
  const criticalCount = filteredData.filter(d => d.severity === "Critical").length;

  // Severity-specific insights
  if (severity === "Critical") {
    return `${totalFailures} critical failures detected across ${filteredData.length} test type${filteredData.length > 1 ? 's' : ''}. ${topFailure.testName} shows highest frequency with ${topFailure.failures} occurrences. Immediate remediation required.`;
  } else if (severity === "High") {
    return `${totalFailures} high severity failures requiring attention across ${filteredData.length} test type${filteredData.length > 1 ? 's' : ''}. Average impact score: ${avgImpactScore}.`;
  }

  // Element-specific filtering
  if (element !== "All") {
    return `${element}-related failures show ${totalFailures} total occurrences with ${avgImpactScore} average impact score. ${criticalCount > 0 ? `${criticalCount} critical failure${criticalCount > 1 ? 's' : ''} require immediate attention.` : 'Monitoring required for trend analysis.'}`;
  }

  // Inspector-specific filtering
  if (inspector !== "All Inspectors") {
    return `${inspector} reported ${totalFailures} critical ${totalFailures === 1 ? 'failure' : 'failures'} across ${filteredData.length} different test ${filteredData.length === 1 ? 'type' : 'types'}, averaging ${avgImpactScore} impact score. ${criticalCount} critical, ${filteredData.length - criticalCount} high severity.`;
  }

  // Default state (All / All / All)
  return `${totalFailures} critical failures concentrated in structural elements (Plumbness, Component Dent) with ${avgImpactScore} average impact score. ${criticalCount} critical severity cases require immediate remediation and stakeholder notification.`;
}

export function CriticalFailuresModal({
  open,
  onOpenChange,
  criticalFailures,
  totalTests,
}: CriticalFailuresModalProps) {
  const [inspector, setInspector] = React.useState("All Inspectors");
  const [element, setElement] = React.useState("All");
  const [severity, setSeverity] = React.useState("All");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

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
    return criticalFailureData.filter((item) => {
      const matchesInspector = inspector === "All Inspectors" || item.inspector === inspector;
      const matchesElement = element === "All" || item.mappedElement === element;
      const matchesSeverity = severity === "All" || item.severity === severity;
      return matchesInspector && matchesElement && matchesSeverity;
    });
  }, [inspector, element, severity]);

  // Sort by failures (descending) then by impact score
  const sortedData = [...filteredData].sort((a, b) => {
    if (b.failures !== a.failures) {
      return b.failures - a.failures;
    }
    return b.impactScore - a.impactScore;
  });

  // Generate dynamic summary
  const criticalSummary = React.useMemo(() => {
    return generateCriticalSummary(filteredData, inspector, element, severity);
  }, [filteredData, inspector, element, severity]);

  // Color mapping based on severity
  const getBarColor = (severity: "Critical" | "High") => {
    return severity === "Critical" 
      ? "rgba(239, 68, 68, 1.00)" // Critical red
      : "rgba(251, 191, 36, 1.00)"; // High amber
  };

  return (
    <SimpleModal open={open} onOpenChange={handleOpenChange}>
      {/* Header */}
      <SimpleModalHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-2)" }}>
          <SimpleModalTitle>Critical Failures</SimpleModalTitle>
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
          Tests that resulted in Critical or High severity failures requiring immediate remediation and stakeholder notification.
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
            Critical failures trigger automated alerts and require documented corrective action plans.
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

          {/* Element Dropdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-1)",
              minWidth: "160px",
            }}
          >
            <Label
              htmlFor="element"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
                lineHeight: "1.43",
              }}
            >
              Element
            </Label>
            <Select value={element} onValueChange={setElement}>
              <SelectTrigger
                id="element"
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
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Rack Upright">Rack Upright</SelectItem>
                <SelectItem value="Component">Component</SelectItem>
                <SelectItem value="Baseplate">Baseplate</SelectItem>
                <SelectItem value="Floor">Floor</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity Dropdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-1)",
              minWidth: "160px",
            }}
          >
            <Label
              htmlFor="severity"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
                lineHeight: "1.43",
              }}
            >
              Severity
            </Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger
                id="severity"
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
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bar Chart - Critical Failures Distribution */}
        {isMounted && sortedData.length > 0 ? (
          <div
            data-chart-container="true"
            style={{
              width: "100%",
              height: "300px",
              minHeight: "300px",
              minWidth: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "var(--spacing-4)",
              marginBottom: "var(--spacing-3)",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
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
                  dataKey="failures"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-critical-${entry.testName}-${entry.location}-${index}`}
                      fill={getBarColor(entry.severity)}
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

        {/* Critical Summary Block */}
        <div
          data-critical-summary="true"
          style={{
            width: "100%",
            padding: "var(--spacing-4)",
            backgroundColor: "var(--muted)",
            borderRadius: "var(--radius)",
            marginTop: "var(--spacing-5)",
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
            Critical Summary
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--foreground)",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            {criticalSummary}
          </p>
        </div>
      </SimpleModalBody>

      {/* Footer */}
      <SimpleModalFooter>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Showing {sortedData.length} of {criticalFailureData.length} test types
          </p>
        </div>
      </SimpleModalFooter>
    </SimpleModal>
  );
}