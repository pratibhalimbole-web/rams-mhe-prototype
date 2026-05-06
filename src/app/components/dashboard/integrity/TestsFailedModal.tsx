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
import { Button } from "../../ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  ResponsiveContainer,
} from "recharts";

interface TestFailureData {
  testName: string;
  mappedElement: string;
  inspector: string;
  failed: number;
  executed: number;
  failureRate: number;
  severity: "Critical" | "Major" | "Minor";
}

interface TestsFailedModalProps {
  open: boolean;
  onOpenChange: (() => void) | ((open: boolean) => void);
  testsFailed: number;
  totalTests: number;
}

type ViewMode = "test-type" | "element";

// Actual IRDS Integrity Test failure data with Inspector and Severity associations
const testFailureData: TestFailureData[] = [
  { testName: "Plumbness", mappedElement: "Rack Upright", inspector: "John Smith", failed: 3, executed: 5, failureRate: 60.0, severity: "Critical" },
  { testName: "Component Dent", mappedElement: "Component", inspector: "Mike Chen", failed: 2, executed: 1, failureRate: 200.0, severity: "Major" },
  { testName: "Floor Flatness", mappedElement: "Floor", inspector: "Mike Chen", failed: 2, executed: 3, failureRate: 66.7, severity: "Major" },
  { testName: "Baseplate Settlement Baseline", mappedElement: "Baseplate", inspector: "Sarah Johnson", failed: 2, executed: 2, failureRate: 100.0, severity: "Critical" },
  { testName: "Material Strength", mappedElement: "Component", inspector: "John Smith", failed: 1, executed: 1, failureRate: 100.0, severity: "Critical" },
  { testName: "Rack Run Straightness", mappedElement: "System", inspector: "Sarah Johnson", failed: 1, executed: 4, failureRate: 25.0, severity: "Minor" },
  { testName: "Component Corrosion", mappedElement: "Component", inspector: "Sarah Johnson", failed: 1, executed: 2, failureRate: 50.0, severity: "Major" },
  { testName: "System Lateral Sway", mappedElement: "System", inspector: "John Smith", failed: 1, executed: 3, failureRate: 33.3, severity: "Minor" },
  { testName: "Component Bend", mappedElement: "Beam", inspector: "Mike Chen", failed: 1, executed: 2, failureRate: 50.0, severity: "Major" },
  { testName: "Component Thickness", mappedElement: "Component", inspector: "Sarah Johnson", failed: 1, executed: 1, failureRate: 100.0, severity: "Minor" },
];

// Extract unique inspectors for dropdown
const uniqueInspectors = Array.from(new Set(testFailureData.map(d => d.inspector))).sort();

// Severity priority for sorting
const severityPriority = { Critical: 3, Major: 2, Minor: 1 };

// Severity color mapping
const getSeverityColor = (severity: "Critical" | "Major" | "Minor") => {
  const colorMap = {
    Critical: "rgba(239, 68, 68, 1.00)", // --destructive
    Major: "rgba(251, 191, 36, 1.00)", // --warning
    Minor: "rgba(248, 113, 113, 1.00)", // muted red
  };
  return colorMap[severity];
};

// Generate dynamic Failure Summary based on filters and view mode
function generateFailureSummary(
  filteredData: TestFailureData[],
  viewMode: ViewMode,
  inspector: string,
  element: string,
  testType: string
): string {
  // Empty state
  if (filteredData.length === 0) {
    if (inspector !== "All Inspectors" && element !== "All" && testType !== "All Test Types") {
      return "No test failures match the selected combination of inspector, element, and test type.";
    } else if (inspector !== "All Inspectors" && element !== "All") {
      return `No ${element.toLowerCase()}-related test failures are recorded for the selected inspector.`;
    } else if (inspector !== "All Inspectors") {
      return "The selected inspector has no test failures in the current cycle.";
    } else if (element !== "All") {
      return `No test failures are recorded for ${element.toLowerCase()} elements.`;
    } else if (testType !== "All Test Types") {
      return `The ${testType} test has no failure records in the current cycle.`;
    }
    return "No test failures are recorded for the selected filters.";
  }

  // Calculate aggregated metrics
  const totalFailed = filteredData.reduce((sum, d) => sum + d.failed, 0);
  const criticalCount = filteredData.filter(d => d.severity === "Critical").length;
  const majorCount = filteredData.filter(d => d.severity === "Major").length;
  
  // View-specific insights
  if (viewMode === "test-type") {
    // Technical lens - focus on tests
    const topTest = filteredData.reduce((max, item) => item.failed > max.failed ? item : max, filteredData[0]);
    const uniqueElements = Array.from(new Set(filteredData.map(d => d.mappedElement)));
    
    if (criticalCount > 0) {
      return `${totalFailed} failures recorded. ${criticalCount} critical failure${criticalCount > 1 ? 's' : ''} concentrated in ${topTest.testName} and related checks, indicating potential structural deviation risk.`;
    } else if (majorCount > 0) {
      return `${totalFailed} failures across ${filteredData.length} test type${filteredData.length > 1 ? 's' : ''}. ${majorCount} major failure${majorCount > 1 ? 's' : ''} require${majorCount === 1 ? 's' : ''} attention affecting ${uniqueElements.length} element type${uniqueElements.length > 1 ? 's' : ''}.`;
    } else {
      return `${totalFailed} minor test failures recorded across ${filteredData.length} test type${filteredData.length > 1 ? 's' : ''}. Monitoring recommended for trend analysis.`;
    }
  } else {
    // Physical / asset lens - focus on elements
    const elementGroups = filteredData.reduce((acc, item) => {
      if (!acc[item.mappedElement]) {
        acc[item.mappedElement] = { failed: 0, severity: item.severity };
      }
      acc[item.mappedElement].failed += item.failed;
      if (item.severity === "Critical" || (item.severity === "Major" && acc[item.mappedElement].severity === "Minor")) {
        acc[item.mappedElement].severity = item.severity;
      }
      return acc;
    }, {} as Record<string, { failed: number; severity: string }>);
    
    const criticalElements = Object.entries(elementGroups).filter(([_, data]) => data.severity === "Critical").map(([el, _]) => el);
    const totalElements = Object.keys(elementGroups).length;
    
    if (criticalElements.length > 0) {
      return `${totalFailed} failures affecting ${totalElements} element type${totalElements > 1 ? 's' : ''}. Critical risk identified in ${criticalElements.join(", ")}, requiring immediate structural assessment.`;
    } else if (majorCount > 0) {
      const topElement = Object.entries(elementGroups).reduce((max, [el, data]) => data.failed > max[1].failed ? [el, data] : max);
      return `${totalFailed} failures affecting ${totalElements} element type${totalElements > 1 ? 's' : ''}. ${topElement[0]} shows highest failure concentration with ${topElement[1].failed} failures.`;
    } else {
      return `${totalFailed} minor failures affecting ${totalElements} element type${totalElements > 1 ? 's' : ''}. Routine monitoring recommended.`;
    }
  }
}

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "var(--popover)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "var(--spacing-3)",
          boxShadow: "var(--elevation-sm)",
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
          {data.categoryFull}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--muted-foreground)",
            margin: 0,
            marginBottom: "2px",
          }}
        >
          Total Failures: <span style={{ fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)" }}>{data.failed}</span>
        </p>
        {data.severityBreakdown && (
          <>
            {data.severityBreakdown.Critical > 0 && (
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--muted-foreground)",
                  margin: 0,
                  marginBottom: "2px",
                }}
              >
                Critical: <span style={{ fontWeight: "var(--font-weight-semi-bold)", color: getSeverityColor("Critical") }}>{data.severityBreakdown.Critical}</span>
              </p>
            )}
            {data.severityBreakdown.Major > 0 && (
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--muted-foreground)",
                  margin: 0,
                  marginBottom: "2px",
                }}
              >
                Major: <span style={{ fontWeight: "var(--font-weight-semi-bold)", color: getSeverityColor("Major") }}>{data.severityBreakdown.Major}</span>
              </p>
            )}
            {data.severityBreakdown.Minor > 0 && (
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--muted-foreground)",
                  margin: 0,
                  marginBottom: "2px",
                }}
              >
                Minor: <span style={{ fontWeight: "var(--font-weight-semi-bold)", color: getSeverityColor("Minor") }}>{data.severityBreakdown.Minor}</span>
              </p>
            )}
          </>
        )}
        {data.relatedMapping && (
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--muted-foreground)",
              margin: 0,
              marginTop: "var(--spacing-1)",
              paddingTop: "var(--spacing-1)",
              borderTop: "1px solid var(--border)",
            }}
          >
            {data.relatedMappingLabel}: {data.relatedMapping}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Custom X-axis tick with two-line labels
const CustomXAxisTick = ({ x, y, payload, index, visibleData }: any) => {
  const text = payload.value;
  
  // Split text into two lines at natural word boundary
  const splitLabel = (label: string): [string, string | null] => {
    const words = label.split(' ');
    
    if (words.length === 1) {
      // Single word - no split needed
      return [label, null];
    } else if (words.length === 2) {
      // Two words - split into two lines
      return [words[0], words[1]];
    } else if (words.length === 3) {
      // Three words - split logically (first two words on line 1)
      return [`${words[0]} ${words[1]}`, words[2]];
    } else {
      // Four or more words - split at first space, put rest on second line
      return [words[0], words.slice(1).join(' ')];
    }
  };
  
  const [line1, line2] = splitLabel(text);
  
  const dataEntry = visibleData && visibleData[index];
  const uniqueKey = dataEntry ? `tick-${dataEntry.category}-${dataEntry.severity}-${index}` : `tick-${index}`;
  
  return (
    <g key={uniqueKey} transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={6}
        textAnchor="middle"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          fontWeight: 400,
          fill: "var(--muted-foreground)",
        }}
      >
        <tspan x={0} dy={0}>{line1}</tspan>
        {line2 && <tspan x={0} dy={13}>{line2}</tspan>}
      </text>
    </g>
  );
};

export function TestsFailedModal({
  open,
  onOpenChange,
  testsFailed,
  totalTests,
}: TestsFailedModalProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("test-type");
  const [inspector, setInspector] = React.useState("All Inspectors");
  const [element, setElement] = React.useState("All");
  const [testType, setTestType] = React.useState("All Test Types");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  
  // Brush selection state (indices into chartData array)
  const [brushStartIndex, setBrushStartIndex] = React.useState(0);
  const [brushEndIndex, setBrushEndIndex] = React.useState(8); // Default: show first 8 categories
  
  // Brush interaction state
  const [isDraggingBrush, setIsDraggingBrush] = React.useState(false);
  const [dragType, setDragType] = React.useState<"selection" | "left" | "right" | null>(null);
  const [dragStartX, setDragStartX] = React.useState(0);
  const [dragStartBrushStart, setDragStartBrushStart] = React.useState(0);
  const [dragStartBrushEnd, setDragStartBrushEnd] = React.useState(0);
  
  // Derived brush interaction states
  const isResizingLeft = dragType === "left";
  const isResizingRight = dragType === "right";
  
  const brushContainerRef = React.useRef<HTMLDivElement>(null);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Ensure charts only mount when modal is visible and DOM is ready with dimensions
  React.useEffect(() => {
    if (open) {
      // Double-check approach: use both setTimeout and RAF
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          // Check if container has dimensions before mounting
          if (chartContainerRef.current) {
            const rect = chartContainerRef.current.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              setIsMounted(true);
            } else {
              // Retry after another delay if dimensions not ready
              setTimeout(() => setIsMounted(true), 100);
            }
          } else {
            setIsMounted(true);
          }
        });
      }, 200);
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

  // Apply filters (AND-based logic)
  const filteredData = React.useMemo(() => {
    return testFailureData.filter((item) => {
      const matchesInspector = inspector === "All Inspectors" || item.inspector === inspector;
      const matchesElement = element === "All" || item.mappedElement === element;
      const matchesTestType = testType === "All Test Types" || item.testName === testType;
      return matchesInspector && matchesElement && matchesTestType;
    });
  }, [inspector, element, testType]);

  // Transform data based on view mode
  const chartData = React.useMemo(() => {
    if (viewMode === "test-type") {
      // Group by test type
      const grouped = filteredData.reduce((acc, item) => {
        const existing = acc.find(a => a.testName === item.testName);
        if (existing) {
          existing.failed += item.failed;
          if (!existing.affectedElements?.includes(item.mappedElement)) {
            existing.affectedElements?.push(item.mappedElement);
          }
          if (existing.severityBreakdown) {
            existing.severityBreakdown[item.severity] = (existing.severityBreakdown[item.severity] || 0) + item.failed;
          }
          if (severityPriority[item.severity] > severityPriority[existing.severity]) {
            existing.severity = item.severity;
          }
        } else {
          acc.push({
            ...item,
            affectedElements: [item.mappedElement],
            severityBreakdown: {
              Critical: item.severity === "Critical" ? item.failed : 0,
              Major: item.severity === "Major" ? item.failed : 0,
              Minor: item.severity === "Minor" ? item.failed : 0,
            }
          });
        }
        return acc;
      }, [] as (TestFailureData & { affectedElements?: string[]; severityBreakdown?: { Critical: number; Major: number; Minor: number } })[]);
      
      const sorted = grouped.sort((a, b) => {
        const severityDiff = severityPriority[b.severity] - severityPriority[a.severity];
        if (severityDiff !== 0) return severityDiff;
        return b.failed - a.failed;
      });

      return sorted.map(item => ({
        category: item.testName,
        categoryFull: item.testName,
        failed: item.failed,
        severity: item.severity,
        affectedElements: item.affectedElements,
        severityBreakdown: item.severityBreakdown,
        relatedMapping: item.affectedElements?.join(", "),
        relatedMappingLabel: "Elements",
      }));
    } else {
      // Group by element
      const elementMap = new Map<string, {
        element: string;
        failed: number;
        highestSeverity: "Critical" | "Major" | "Minor";
        severityBreakdown: { Critical: number; Major: number; Minor: number };
        affectedTestTypes: string[];
      }>();

      filteredData.forEach(item => {
        const existing = elementMap.get(item.mappedElement);
        if (existing) {
          existing.failed += item.failed;
          if (!existing.affectedTestTypes.includes(item.testName)) {
            existing.affectedTestTypes.push(item.testName);
          }
          existing.severityBreakdown[item.severity] += item.failed;
          if (severityPriority[item.severity] > severityPriority[existing.highestSeverity]) {
            existing.highestSeverity = item.severity;
          }
        } else {
          elementMap.set(item.mappedElement, {
            element: item.mappedElement,
            failed: item.failed,
            highestSeverity: item.severity,
            severityBreakdown: {
              Critical: item.severity === "Critical" ? item.failed : 0,
              Major: item.severity === "Major" ? item.failed : 0,
              Minor: item.severity === "Minor" ? item.failed : 0,
            },
            affectedTestTypes: [item.testName],
          });
        }
      });

      const sorted = Array.from(elementMap.values()).sort((a, b) => {
        const severityDiff = severityPriority[b.highestSeverity] - severityPriority[a.highestSeverity];
        if (severityDiff !== 0) return severityDiff;
        return b.failed - a.failed;
      });

      return sorted.map(item => ({
        category: item.element,
        categoryFull: item.element,
        failed: item.failed,
        severity: item.highestSeverity,
        affectedTestTypes: item.affectedTestTypes,
        severityBreakdown: item.severityBreakdown,
        relatedMapping: item.affectedTestTypes.join(", "),
        relatedMappingLabel: "Test Types",
      }));
    }
  }, [filteredData, viewMode]);

  // Determine if brush should be shown
  const showBrush = chartData.length > 8;

  // Reset brush when data changes
  React.useEffect(() => {
    if (chartData.length > 0) {
      const defaultEnd = Math.min(8, chartData.length);
      setBrushStartIndex(0);
      setBrushEndIndex(defaultEnd);
    }
  }, [chartData, viewMode]);

  // Get visible data based on brush selection
  const visibleData = React.useMemo(() => {
    if (!showBrush) return chartData;
    return chartData.slice(brushStartIndex, brushEndIndex);
  }, [chartData, brushStartIndex, brushEndIndex, showBrush]);

  // Brush interaction handlers
  const handleBrushMouseDown = (e: React.MouseEvent, type: 'pan' | 'resize-left' | 'resize-right') => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragStartX(e.clientX);
    setDragStartBrushStart(brushStartIndex);
    setDragStartBrushEnd(brushEndIndex);
    
    if (type === 'pan') {
      setIsDraggingBrush(true);
      setDragType("selection");
    } else if (type === 'resize-left') {
      setIsDraggingBrush(true);
      setDragType("left");
    } else if (type === 'resize-right') {
      setIsDraggingBrush(true);
      setDragType("right");
    }
  };

  const handleBrushMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDraggingBrush) return;
    if (!brushContainerRef.current) return;

    const containerRect = brushContainerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const deltaX = e.clientX - dragStartX;
    const deltaIndex = Math.round((deltaX / containerWidth) * chartData.length);

    if (dragType === "selection") {
      // Pan: move both start and end
      const windowSize = dragStartBrushEnd - dragStartBrushStart;
      let newStart = dragStartBrushStart + deltaIndex;
      let newEnd = dragStartBrushEnd + deltaIndex;

      // Clamp to boundaries
      if (newStart < 0) {
        newStart = 0;
        newEnd = windowSize;
      }
      if (newEnd > chartData.length) {
        newEnd = chartData.length;
        newStart = chartData.length - windowSize;
      }

      setBrushStartIndex(newStart);
      setBrushEndIndex(newEnd);
    } else if (dragType === "left") {
      // Resize left handle
      let newStart = dragStartBrushStart + deltaIndex;
      newStart = Math.max(0, Math.min(newStart, brushEndIndex - 2)); // Min 2 categories
      setBrushStartIndex(newStart);
    } else if (dragType === "right") {
      // Resize right handle
      let newEnd = dragStartBrushEnd + deltaIndex;
      newEnd = Math.min(chartData.length, Math.max(newEnd, brushStartIndex + 2)); // Min 2 categories
      setBrushEndIndex(newEnd);
    }
  }, [isDraggingBrush, dragType, dragStartX, dragStartBrushStart, dragStartBrushEnd, chartData.length, brushEndIndex, brushStartIndex]);

  const handleBrushMouseUp = React.useCallback(() => {
    setIsDraggingBrush(false);
    setDragType(null);
  }, []);

  // Add/remove global mouse listeners
  React.useEffect(() => {
    if (isDraggingBrush) {
      window.addEventListener('mousemove', handleBrushMouseMove);
      window.addEventListener('mouseup', handleBrushMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleBrushMouseMove);
        window.removeEventListener('mouseup', handleBrushMouseUp);
      };
    }
  }, [isDraggingBrush, handleBrushMouseMove, handleBrushMouseUp]);

  // Generate dynamic Failure Summary
  const failureSummary = React.useMemo(() => {
    return generateFailureSummary(filteredData, viewMode, inspector, element, testType);
  }, [filteredData, viewMode, inspector, element, testType]);

  return (
    <SimpleModal open={open} onOpenChange={handleOpenChange}>
      {/* Header */}
      <SimpleModalHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-2)" }}>
          <SimpleModalTitle>Tests Failed</SimpleModalTitle>
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
          Tracks integrity tests that resulted in Fail, Not OK, or Critical Fail status as an early risk signal.
        </SimpleModalDescription>
        
        <div style={{ marginTop: "var(--spacing-2)" }}>
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
            Failure severity indicates response urgency; escalation workflows are managed separately.
          </p>
        </div>
      </SimpleModalHeader>

      {/* Body */}
      <SimpleModalBody>
        {/* Single Row - Filters Left + Toggle Right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "var(--spacing-6)",
            marginBottom: "var(--spacing-3)",
          }}
        >
          {/* Left: Filters */}
          <div style={{ display: "flex", gap: "var(--spacing-3)" }}>
            {/* Inspector Dropdown */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-1)",
                minWidth: "160px",
              }}
            >
              <Label htmlFor="inspector" style={{ fontFamily: "Inter, sans-serif", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground)", lineHeight: "1.43" }}>
                Inspector
              </Label>
              <Select value={inspector} onValueChange={setInspector}>
                <SelectTrigger id="inspector" style={{ fontFamily: "Inter, sans-serif", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", minWidth: "160px" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="All Inspectors">All Inspectors</SelectItem>
                  {uniqueInspectors.map((insp) => (
                    <SelectItem key={insp} value={insp}>{insp}</SelectItem>
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
              <Label htmlFor="element" style={{ fontFamily: "Inter, sans-serif", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground)", lineHeight: "1.43" }}>
                Element
              </Label>
              <Select value={element} onValueChange={setElement}>
                <SelectTrigger id="element" style={{ fontFamily: "Inter, sans-serif", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", minWidth: "160px" }}>
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

            {/* Test Type Dropdown */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-1)",
                minWidth: "160px",
              }}
            >
              <Label htmlFor="test-type" style={{ fontFamily: "Inter, sans-serif", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground)", lineHeight: "1.43" }}>
                Test Type
              </Label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger id="test-type" style={{ fontFamily: "Inter, sans-serif", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", minWidth: "160px" }}>
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

          {/* Right: View Toggle */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "var(--muted)",
              borderRadius: "var(--radius)",
              padding: "2px",
              alignSelf: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setViewMode("test-type");
              }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                padding: "6px var(--spacing-3)",
                borderRadius: "calc(var(--radius) - 2px)",
                border: "none",
                backgroundColor: viewMode === "test-type" ? "var(--background)" : "transparent",
                color: viewMode === "test-type" ? "var(--foreground)" : "var(--muted-foreground)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: viewMode === "test-type" ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
              }}
            >
              By Test Type
            </button>
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
          </div>
        </div>

        {/* Bar Chart with Brush */}
        {chartData.length > 0 && isMounted ? (
          <>
            {/* Main Chart */}
            <div
              ref={chartContainerRef}
              style={{
                width: "100%",
                height: showBrush ? "320px" : "360px",
                marginBottom: "0",
                minHeight: showBrush ? "320px" : "360px",
                minWidth: "400px",
              }}
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={400} minHeight={showBrush ? 320 : 360}>
                <BarChart
                  data={visibleData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 48 }}
                  onMouseMove={(state) => {
                    if (state.isTooltipActive) {
                      setHoveredIndex(state.activeTooltipIndex ?? null);
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
                    opacity={0.3}
                  />
                  <XAxis 
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    angle={0}
                    height={52}
                    tick={(props) => <CustomXAxisTick {...props} visibleData={visibleData} />}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={40}
                    tick={{
                      fill: "var(--muted-foreground)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      fontWeight: 400,
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar key="bar-failed-main" dataKey="failed" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {visibleData.map((entry, index) => (
                      <Cell 
                        key={`cell-failed-${entry.testType}-${entry.severity}-${index}`} 
                        fill={getSeverityColor(entry.severity as "Critical" | "Major" | "Minor")}
                        opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                        style={{ transition: "opacity 0.2s ease" }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Brush (Mini Overview Chart) */}
            {showBrush && (
              <div
                ref={brushContainerRef}
                style={{
                  width: "100%",
                  height: "60px",
                  position: "relative",
                  marginTop: "0",
                  marginBottom: "var(--spacing-3)",
                  userSelect: "none",
                  minHeight: "60px",
                  minWidth: "400px",
                }}
              >
                {/* Mini chart */}
                <div style={{ width: "100%", height: "100%", pointerEvents: "none", minHeight: "60px" }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={400} minHeight={60}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                    >
                      <XAxis dataKey="category" hide />
                      <YAxis hide />
                      <Bar key="bar-failed-brush" dataKey="failed" radius={[2, 2, 0, 0]} maxBarSize={20}>
                        {chartData.map((entry, index) => {
                          const isInSelection = index >= brushStartIndex && index < brushEndIndex;
                          return (
                            <Cell 
                              key={`brush-${entry.testType}-${entry.severity}-${index}`} 
                              fill={getSeverityColor(entry.severity as "Critical" | "Major" | "Minor")}
                              opacity={isInSelection ? 0.9 : 0.3}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Brush Selection Overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `calc(40px + ${(brushStartIndex / chartData.length) * (100 - 60 / brushContainerRef.current?.offsetWidth! * 100)}%)`,
                    width: `${((brushEndIndex - brushStartIndex) / chartData.length) * (100 - 60 / brushContainerRef.current?.offsetWidth! * 100)}%`,
                    height: "70px",
                    border: "2px solid var(--primary)",
                    borderRadius: "var(--radius-sm)",
                    pointerEvents: "auto",
                    cursor: isDraggingBrush ? "grabbing" : "grab",
                    transition: isDraggingBrush || isResizingLeft || isResizingRight ? "none" : "left 0.2s ease, width 0.2s ease",
                  }}
                  onMouseDown={(e) => handleBrushMouseDown(e, 'pan')}
                >
                  {/* Left Handle */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-6px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "12px",
                      height: "40px",
                      backgroundColor: "var(--primary)",
                      borderRadius: "var(--radius-sm)",
                      cursor: "ew-resize",
                      zIndex: 10,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleBrushMouseDown(e, 'resize-left');
                    }}
                  />

                  {/* Right Handle */}
                  <div
                    style={{
                      position: "absolute",
                      right: "-6px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "12px",
                      height: "40px",
                      backgroundColor: "var(--primary)",
                      borderRadius: "var(--radius-sm)",
                      cursor: "ew-resize",
                      zIndex: 10,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleBrushMouseDown(e, 'resize-right');
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "360px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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

        {/* Failure Summary Block */}
        <div
          style={{
            width: "100%",
            padding: "var(--spacing-4)",
            backgroundColor: "var(--muted)",
            borderRadius: "var(--radius)",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-semi-bold)",
              color: "var(--muted-foreground)",
              margin: 0,
              marginBottom: "var(--spacing-2)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Failure Summary
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
            {failureSummary}
          </p>
        </div>
      </SimpleModalBody>

      {/* Footer */}
      <SimpleModalFooter>
        <div style={{ display: "flex", gap: "var(--spacing-3)", justifyContent: "flex-end" }}>
          <Button 
            type="button"
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            style={{
              backgroundColor: "transparent",
              borderColor: "var(--border)",
              color: "var(--foreground)",
              boxShadow: "none"
            }}
          >
            Close
          </Button>
          <Button 
            type="button"
            variant="default"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              boxShadow: "none"
            }}
            onClick={() => {
              console.log("Exporting test failures...")
            }}
          >
            Export Details
          </Button>
        </div>
      </SimpleModalFooter>
    </SimpleModal>
  );
}