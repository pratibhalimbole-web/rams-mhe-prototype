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

interface CoverageData {
  element: string;
  totalTests: number;
  executedTests: number;
  coveragePercentage: number;
  inspector: string;
}

interface CoverageModalProps {
  open: boolean;
  onOpenChange: (() => void) | ((open: boolean) => void);
  coverage: number;
  totalTests: number;
  testsExecuted: number;
}

type ViewMode = "element" | "inspector";

// Actual IRDS Coverage data by Element and Inspector
const coverageData: CoverageData[] = [
  { element: "Rack Upright", totalTests: 8, executedTests: 8, coveragePercentage: 100, inspector: "John Smith" },
  { element: "Beam", totalTests: 4, executedTests: 4, coveragePercentage: 100, inspector: "Sarah Johnson" },
  { element: "Baseplate", totalTests: 5, executedTests: 5, coveragePercentage: 100, inspector: "Sarah Johnson" },
  { element: "Floor", totalTests: 6, executedTests: 5, coveragePercentage: 83, inspector: "Mike Chen" },
  { element: "Component", totalTests: 7, executedTests: 6, coveragePercentage: 86, inspector: "John Smith" },
  { element: "System", totalTests: 3, executedTests: 2, coveragePercentage: 67, inspector: "Sarah Johnson" },
];

// Extract unique inspectors for dropdown
const uniqueInspectors = Array.from(new Set(coverageData.map(d => d.inspector))).sort();

// Get bar color based on coverage percentage
const getCoverageColor = (percentage: number) => {
  if (percentage >= 90) return "var(--success)";
  if (percentage >= 70) return "var(--warning)";
  return "var(--destructive)";
};

// Custom Tooltip Component for Element View
interface CustomTooltipElementProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      element: string;
      totalTests: number;
      executedTests: number;
      coveragePercentage: number;
      inspector?: string;
    };
  }>;
}

const CustomTooltipElement: React.FC<CustomTooltipElementProps> = ({ active, payload }) => {
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
          {data.element}
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
          Coverage: {data.coveragePercentage}%
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
          Executed: {data.executedTests} / {data.totalTests}
        </p>

        {data.inspector && (
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Inspector: {data.inspector}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Custom Tooltip Component for Inspector View
interface CustomTooltipInspectorProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      inspector: string;
      totalTests: number;
      executedTests: number;
      coveragePercentage: number;
      elements: string[];
    };
  }>;
}

const CustomTooltipInspector: React.FC<CustomTooltipInspectorProps> = ({ active, payload }) => {
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
          {data.inspector}
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
          Coverage: {data.coveragePercentage}%
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
          Executed: {data.executedTests} / {data.totalTests}
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
          Elements: {data.elements.join(", ")}
        </p>
      </div>
    );
  }
  return null;
};

// Generate dynamic Coverage Summary based on filters and view mode
function generateCoverageSummary(
  filteredData: CoverageData[],
  viewMode: ViewMode,
  inspector: string,
  element: string
): string {
  // Empty state
  if (filteredData.length === 0) {
    if (inspector !== "All Inspectors" && element !== "All") {
      return `No coverage data available for ${element.toLowerCase()} elements under ${inspector}.`;
    } else if (inspector !== "All Inspectors") {
      return `No coverage data available for ${inspector}.`;
    } else if (element !== "All") {
      return `No coverage data available for ${element.toLowerCase()} elements.`;
    }
    return "No coverage data matches the selected filters.";
  }

  // Calculate aggregated metrics
  const totalTests = filteredData.reduce((sum, d) => sum + d.totalTests, 0);
  const totalExecuted = filteredData.reduce((sum, d) => sum + d.executedTests, 0);
  const overallCoverage = totalTests > 0 ? Math.round((totalExecuted / totalTests) * 100) : 0;
  
  const fullyCovered = filteredData.filter(d => d.coveragePercentage === 100).length;
  const atRisk = filteredData.filter(d => d.coveragePercentage < 70).length;
  
  // View-specific insights
  if (viewMode === "element") {
    // Physical / asset lens - focus on elements
    if (fullyCovered === filteredData.length) {
      return `All ${filteredData.length} element type${filteredData.length > 1 ? 's' : ''} achieved 100% test coverage (${totalExecuted}/${totalTests} tests executed). Comprehensive structural validation complete.`;
    } else if (atRisk > 0) {
      const atRiskElements = filteredData.filter(d => d.coveragePercentage < 70).map(d => d.element);
      return `Overall coverage at ${overallCoverage}%. ${atRisk} element type${atRisk > 1 ? 's' : ''} below 70% threshold (${atRiskElements.join(", ")}), requiring immediate test execution to meet validation standards.`;
    } else {
      const lowestCoverage = filteredData.reduce((min, item) => item.coveragePercentage < min.coveragePercentage ? item : min, filteredData[0]);
      return `${overallCoverage}% overall coverage across ${filteredData.length} element types. ${lowestCoverage.element} shows lowest coverage at ${lowestCoverage.coveragePercentage}%, remaining elements performing well.`;
    }
  } else {
    // Inspector lens - focus on team performance
    const inspectorGroups = filteredData.reduce((acc, item) => {
      if (!acc[item.inspector]) {
        acc[item.inspector] = { executed: 0, total: 0, elements: [] as string[] };
      }
      acc[item.inspector].executed += item.executedTests;
      acc[item.inspector].total += item.totalTests;
      if (!acc[item.inspector].elements.includes(item.element)) {
        acc[item.inspector].elements.push(item.element);
      }
      return acc;
    }, {} as Record<string, { executed: number; total: number; elements: string[] }>);
    
    const inspectorCoverages = Object.entries(inspectorGroups).map(([name, data]) => ({
      name,
      coverage: Math.round((data.executed / data.total) * 100),
      elements: data.elements.length,
    }));
    
    const topInspector = inspectorCoverages.reduce((max, item) => item.coverage > max.coverage ? item : max, inspectorCoverages[0]);
    const lowInspectors = inspectorCoverages.filter(i => i.coverage < 70);
    
    if (lowInspectors.length > 0) {
      return `Overall coverage at ${overallCoverage}%. ${lowInspectors.length} inspector${lowInspectors.length > 1 ? 's' : ''} below 70% threshold, requiring workload reallocation or timeline adjustment to meet validation targets.`;
    } else if (topInspector.coverage === 100) {
      return `${overallCoverage}% overall coverage. ${topInspector.name} achieved 100% coverage across ${topInspector.elements} element type${topInspector.elements > 1 ? 's' : ''}, setting strong benchmark for team.`;
    } else {
      return `${overallCoverage}% overall coverage across ${inspectorCoverages.length} inspector${inspectorCoverages.length > 1 ? 's' : ''}. ${topInspector.name} leads at ${topInspector.coverage}% coverage.`;
    }
  }
}

export function CoverageModal({
  open,
  onOpenChange,
  coverage,
  totalTests,
  testsExecuted,
}: CoverageModalProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("element");
  const [inspector, setInspector] = React.useState("All Inspectors");
  const [element, setElement] = React.useState("All");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  
  // Range slider state - controls which bars are visible
  const [startIndex, setStartIndex] = React.useState(0);
  const barsToShow = 5; // Always show max 5 bars
  
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
    return coverageData.filter((item) => {
      const matchesInspector = inspector === "All Inspectors" || item.inspector === inspector;
      const matchesElement = element === "All" || item.element === element;
      return matchesInspector && matchesElement;
    });
  }, [inspector, element]);

  // Transform data based on view mode
  const chartData = React.useMemo(() => {
    if (viewMode === "element") {
      // Group by element
      return filteredData;
    } else {
      // Group by inspector
      const inspectorMap = new Map<string, {
        inspector: string;
        totalTests: number;
        executedTests: number;
        coveragePercentage: number;
        elements: string[];
      }>();

      filteredData.forEach(item => {
        const existing = inspectorMap.get(item.inspector);
        if (existing) {
          existing.totalTests += item.totalTests;
          existing.executedTests += item.executedTests;
          if (!existing.elements.includes(item.element)) {
            existing.elements.push(item.element);
          }
          existing.coveragePercentage = Math.round((existing.executedTests / existing.totalTests) * 100);
        } else {
          inspectorMap.set(item.inspector, {
            inspector: item.inspector,
            totalTests: item.totalTests,
            executedTests: item.executedTests,
            coveragePercentage: item.coveragePercentage,
            elements: [item.element],
          });
        }
      });

      return Array.from(inspectorMap.values());
    }
  }, [filteredData, viewMode]);

  // Determine if zoom/pan should be enabled
  const zoomEnabled = chartData.length > barsToShow;
  
  // Calculate max start index
  const maxStartIndex = zoomEnabled ? Math.max(0, chartData.length - barsToShow) : 0;
  
  // Reset startIndex when filtered data changes and becomes <= barsToShow
  React.useEffect(() => {
    if (!zoomEnabled) {
      setStartIndex(0);
    } else if (startIndex > maxStartIndex) {
      setStartIndex(maxStartIndex);
    }
  }, [chartData.length, zoomEnabled, maxStartIndex, startIndex]);

  // Reset startIndex when view mode changes
  React.useEffect(() => {
    setStartIndex(0);
  }, [viewMode]);

  // Calculate visible data based on slider position
  const visibleData = zoomEnabled 
    ? chartData.slice(startIndex, startIndex + barsToShow)
    : chartData;

  // Generate dynamic Coverage Summary
  const coverageSummary = React.useMemo(() => {
    return generateCoverageSummary(filteredData, viewMode, inspector, element);
  }, [filteredData, viewMode, inspector, element]);

  return (
    <SimpleModal open={open} onOpenChange={handleOpenChange}>
      {/* Header */}
      <SimpleModalHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-2)" }}>
          <SimpleModalTitle>Test Coverage</SimpleModalTitle>
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
          Measures the percentage of defined integrity tests that have been executed, indicating validation completeness across elements.
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
            Coverage below 70% indicates incomplete structural validation; 90%+ is recommended for certification readiness.
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
            marginBottom: "var(--spacing-4)",
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
                <SelectItem value="Beam">Beam</SelectItem>
                <SelectItem value="Baseplate">Baseplate</SelectItem>
                <SelectItem value="Floor">Floor</SelectItem>
                <SelectItem value="Component">Component</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Toggle - Segmented Control */}
        <div
          data-view-toggle="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "var(--muted)",
            borderRadius: "var(--radius)",
            padding: "2px",
            marginBottom: "var(--spacing-5)",
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setViewMode("element");
            }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              padding: "6px var(--spacing-3)",
              borderRadius: "calc(var(--radius) - 2px)",
              border: "none",
              backgroundColor: viewMode === "element" ? "var(--background)" : "transparent",
              color: viewMode === "element" ? "var(--foreground)" : "var(--muted-foreground)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: viewMode === "element" ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
            }}
          >
            By Element
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setViewMode("inspector");
            }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              padding: "6px var(--spacing-3)",
              borderRadius: "calc(var(--radius) - 2px)",
              border: "none",
              backgroundColor: viewMode === "inspector" ? "var(--background)" : "transparent",
              color: viewMode === "inspector" ? "var(--foreground)" : "var(--muted-foreground)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: viewMode === "inspector" ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
            }}
          >
            By Inspector
          </button>
        </div>

        {/* Bar Chart - Coverage Distribution */}
        {visibleData.length > 0 ? (
          <div
            data-chart-container="true"
            style={{
              width: "100%",
              height: "300px",
              minHeight: "300px",
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
                  dataKey={viewMode === "element" ? "element" : "inspector"}
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
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />

                <Tooltip 
                  content={viewMode === "element" ? <CustomTooltipElement /> : <CustomTooltipInspector />}
                  cursor={{
                    fill: "transparent",
                    stroke: "var(--border)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                    opacity: 0.5,
                  }}
                />

                <Bar
                  dataKey="coveragePercentage"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  {visibleData.map((entry: any, index) => (
                    <Cell
                      key={`cell-coverage-${entry.element}-${entry.inspector}-${index}`}
                      fill={getCoverageColor(entry.coveragePercentage)}
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
                  left: `${(startIndex / chartData.length) * 100}%`,
                  width: `${(barsToShow / chartData.length) * 100}%`,
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
                {viewMode === "element" 
                  ? (chartData[0] as any).element 
                  : (chartData[0] as any).inspector}
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--muted-foreground)",
                }}
              >
                {viewMode === "element" 
                  ? (chartData[chartData.length - 1] as any).element 
                  : (chartData[chartData.length - 1] as any).inspector}
              </span>
            </div>
          </div>
        )}

        {/* Coverage Summary Block */}
        <div
          data-coverage-summary="true"
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
            Coverage Summary
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
            {coverageSummary}
          </p>
        </div>
      </SimpleModalBody>
    </SimpleModal>
  );
}