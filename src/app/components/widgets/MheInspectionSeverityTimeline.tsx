import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type SeverityType = "no_inspection" | "no_issue" | "green" | "amber" | "red";

interface InspectionEvent {
  mhe_id: string;
  inspection_id: string;
  inspection_date: string;
  inspection_hour?: number;
  operator_name: string;
  parts_inspected: number;
  checklist_executed: number;
  severity_breakdown: {
    no_issue: number;
    green: number;
    amber: number;
    red: number;
  };
  highest_severity: SeverityType;
}

interface DateColumn {
  date: Date;
  label: string;
  key: string;
  isYesterday?: boolean;
}

// Color scale based on inspection count (Tailwind blue gradient)
const getColorByInspectionCount = (count: number): string => {
  if (count === 0) return "#E5E7EB"; // No inspection (gray)
  if (count <= 2) return "#DBEAFE"; // blue-100
  if (count <= 4) return "#BFDBFE"; // blue-200
  if (count <= 6) return "#93C5FD"; // blue-300
  if (count <= 9) return "#60A5FA"; // blue-400
  if (count <= 12) return "#3B82F6"; // blue-500
  if (count <= 15) return "#2563EB"; // blue-600 (BASE)
  if (count <= 18) return "#1D4ED8"; // blue-700
  return "#1E40AF"; // blue-800
};

const getTextColorForCell = (inspectionCount: number): string => {
  // White text for dark colors (count >= 12, which is blue-600 and darker)
  return inspectionCount >= 12 ? "#FFFFFF" : "#1E293B";
};

const generateDateColumns = (dateRangeFilter: string): DateColumn[] => {
  const columns: DateColumn[] = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateRangeFilter === "today") {
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(today);
      date.setHours(hour, 0, 0, 0);
      columns.push({
        date,
        label: `${hour.toString().padStart(2, "0")}:00`,
        key: `${today.toISOString().split("T")[0]}-${hour}`,
      });
    }
  } else if (dateRangeFilter === "last_24") {
    for (let hour = 23; hour >= 0; hour--) {
      const date = new Date(yesterday);
      date.setHours(hour, 0, 0, 0);
      columns.push({
        date,
        label: `${hour.toString().padStart(2, "0")}:00`,
        key: `${yesterday.toISOString().split("T")[0]}-${hour}`,
        isYesterday: true,
      });
    }
  } else if (dateRangeFilter === "last_7_days") {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      columns.push({
        date,
        label: dateStr,
        key: date.toISOString().split("T")[0],
      });
    }
  } else if (dateRangeFilter === "last_30_days") {
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      columns.push({
        date,
        label: dateStr,
        key: date.toISOString().split("T")[0],
      });
    }
  }

  return columns;
};

const generateMockData = (): InspectionEvent[] => {
  const mheIds = ["MHE_012", "MHE_025", "MHE_031", "MHE_041", "MHE_056"];
  const operators = ["Vikram Deshmukh", "Priya Sharma", "Rajesh Kumar", "Anjali Patel", "Suresh Reddy"];
  const severities: SeverityType[] = ["no_inspection", "no_issue", "green", "amber", "red"];

  const events: InspectionEvent[] = [];
  let inspectionCounter = 1;

  // Generate data for past 30 days with multiple inspections per day
  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const dateKey = date.toISOString().split("T")[0];
    const inspectionDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Special case: Add high-inspection count for today on MHE_012 to show darker colors
    if (dayOffset === 0) {
      // Add 20 inspections for MHE_012 today
      for (let i = 0; i < 20; i++) {
        const rand = Math.random();
        let severity: SeverityType = "no_inspection";
        if (rand > 0.35) {
          severity = severities[Math.floor(Math.random() * (severities.length - 1)) + 1];
        }

        events.push({
          mhe_id: "MHE_012",
          inspection_id: `INS_${String(inspectionCounter).padStart(4, "0")}`,
          inspection_date: inspectionDate,
          key: dateKey,
          operator_name: operators[Math.floor(Math.random() * operators.length)],
          parts_inspected: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 12) + 1,
          checklist_executed: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 15) + 1,
          severity_breakdown: {
            no_issue: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 8),
            green: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 5),
            amber: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 3),
            red: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 2),
          },
          highest_severity: severity,
        });
        inspectionCounter++;
      }
    }

    // Generate 3-5 inspections per day across all MHEs
    const inspectionsPerDay = Math.floor(Math.random() * 3) + 3;
    for (let insp = 0; insp < inspectionsPerDay; insp++) {
      const mheId = mheIds[Math.floor(Math.random() * mheIds.length)];
      const rand = Math.random();
      let severity: SeverityType = "no_inspection";

      if (rand > 0.35) {
        severity = severities[Math.floor(Math.random() * (severities.length - 1)) + 1];
      }

      const checklistCount = severity === "no_inspection" ? 0 : Math.floor(Math.random() * 15) + 1;

      events.push({
        mhe_id: mheId,
        inspection_id: `INS_${String(inspectionCounter).padStart(4, "0")}`,
        inspection_date: inspectionDate,
        key: dateKey,
        operator_name: operators[Math.floor(Math.random() * operators.length)],
        parts_inspected: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 12) + 1,
        checklist_executed: checklistCount,
        severity_breakdown: {
          no_issue: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 8),
          green: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 5),
          amber: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 3),
          red: severity === "no_inspection" ? 0 : Math.floor(Math.random() * 2),
        },
        highest_severity: severity,
      });
      inspectionCounter++;
    }
  }

  return events;
};

export const MheInspectionSeverityTimeline: React.FC = () => {
  const [mheTypeFilter, setMheTypeFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("last_7_days");

  const mockData = useMemo(() => generateMockData(), []);
  const mheIds = Array.from(new Set(mockData.map((e) => e.mhe_id))).sort();

  const dateColumns = useMemo(() => generateDateColumns(dateRangeFilter), [dateRangeFilter]);

  const getCellData = (mheId: string, dateKey: string) => {
    const cellEvents = mockData.filter((e) => e.mhe_id === mheId && e.key === dateKey);
    return {
      events: cellEvents,
      totalCount: cellEvents.length,
      uniqueOperators: Array.from(new Set(cellEvents.map((e) => e.operator_name))).length,
      totalChecklist: cellEvents.reduce((sum, e) => sum + e.checklist_executed, 0),
      severityBreakdown: {
        no_issue: cellEvents.reduce((sum, e) => sum + e.severity_breakdown.no_issue, 0),
        green: cellEvents.reduce((sum, e) => sum + e.severity_breakdown.green, 0),
        amber: cellEvents.reduce((sum, e) => sum + e.severity_breakdown.amber, 0),
        red: cellEvents.reduce((sum, e) => sum + e.severity_breakdown.red, 0),
      },
    };
  };

  const shouldDisableCell = (dateColumn: DateColumn): boolean => {
    if (dateRangeFilter !== "last_24") return false;
    return !dateColumn.isYesterday;
  };

  const [tooltipPosition, setTooltipPosition] = useState<"top" | "bottom">("top");

  // Calculate insights
  const insights = useMemo(() => {
    if (mheIds.length === 0) return null;

    let highestMheCount = 0;
    let highestMheId = "";
    let topRedMheId = "";
    let topRedCount = 0;

    mheIds.forEach((mheId) => {
      let mheTotal = 0;
      let mheRedTotal = 0;
      dateColumns.forEach((col) => {
        const cellData = getCellData(mheId, col.key);
        mheTotal += cellData.totalCount;
        mheRedTotal += cellData.severityBreakdown.red;
      });
      if (mheTotal > highestMheCount) {
        highestMheCount = mheTotal;
        highestMheId = mheId;
      }
      if (mheRedTotal > topRedCount) {
        topRedCount = mheRedTotal;
        topRedMheId = mheId;
      }
    });

    // Get date range
    let dateRange = "";
    if (dateColumns.length > 0) {
      const firstDate = dateColumns[0];
      const lastDate = dateColumns[dateColumns.length - 1];
      const firstDateStr = firstDate.label;
      const lastDateStr = lastDate.label;
      dateRange = `${firstDateStr} – ${lastDateStr}`;
    }

    return {
      topMhe: highestMheId,
      topRedMhe: topRedMheId,
      dateRange,
    };
  }, [mheIds, dateColumns, getCellData]);

  return (
    <TooltipProvider>
      <Card className="border border-slate-200 bg-white h-full w-full flex flex-col shadow-sm overflow-hidden relative">
        {/* Fixed Header */}
        <CardHeader className="pb-2 border-b border-slate-200 flex-shrink-0 px-6 pt-4">
          <div className="flex items-start justify-between w-full gap-4">
            <div className="flex flex-col">
              <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
                MHE Inspection Severity Timeline
              </CardTitle>
              <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                Inspection severity patterns across recent MHE inspections.
              </CardDescription>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              <Select value={mheTypeFilter} onValueChange={setMheTypeFilter}>
                <SelectTrigger className="w-[200px] h-9 text-xs border border-slate-300">
                  <SelectValue placeholder="All MHE" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All MHE</SelectItem>
                  <SelectItem value="electric">Electric Forklift</SelectItem>
                  <SelectItem value="diesel">Diesel Forklift</SelectItem>
                  <SelectItem value="pallet">Pallet Jack</SelectItem>
                  <SelectItem value="order">Order Picker</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                <SelectTrigger className="w-[200px] h-9 text-xs border border-slate-300">
                  <SelectValue placeholder="Last 7 Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last_24">Last 24 Hours</SelectItem>
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {/* Scrollable Content */}
        <CardContent className="flex-1 overflow-hidden p-4 pb-0">
          <div style={{ height: "100%", overflowX: dateColumns.length > 7 ? "auto" : "hidden", overflowY: "auto" }}>
            {/* Heatmap Container */}
            <div className={dateColumns.length <= 7 ? "w-full" : "inline-block"}>
              {/* Header Row (Date Labels) */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-end", position: "sticky", top: 0, backgroundColor: "#FFFFFF", zIndex: 20, borderBottom: "1px solid var(--border)" }}>
                {/* Placeholder for row labels */}
                <div style={{ width: "80px", flexShrink: 0 }}></div>

                {/* Date Headers */}
                <div style={{ display: "flex", gap: "8px", flex: dateColumns.length <= 7 ? 1 : "none" }}>
                  {dateColumns.map((col) => (
                    <div
                      key={col.key}
                      style={{
                        width: dateColumns.length <= 7 ? "100%" : "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#64748B",
                        textAlign: "center",
                        flexShrink: 0,
                        lineHeight: "1.2",
                        flex: dateColumns.length <= 7 ? 1 : "none",
                      }}
                    >
                      {col.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Rows */}
              {mheIds.map((mheId) => (
                <div key={mheId} style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "center" }}>
                  {/* MHE Label (sticky left) */}
                  <div
                    style={{
                      width: "80px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                      flexShrink: 0,
                      position: "sticky",
                      left: 0,
                      backgroundColor: "#FFFFFF",
                      zIndex: 10,
                    }}
                  >
                    {mheId}
                  </div>

                  {/* Grid Cells */}
                  <div style={{ display: "flex", gap: "8px", flex: dateColumns.length <= 7 ? 1 : "none" }}>
                    {dateColumns.map((col) => {
                      const cellData = getCellData(mheId, col.key);
                      const isDisabled = shouldDisableCell(col);
                      const cellColor = getColorByInspectionCount(cellData.totalCount);
                      const textColor = getTextColorForCell(cellData.totalCount);

                      return (
                        <Tooltip key={`${mheId}-${col.key}`} disabled={isDisabled}>
                          <TooltipTrigger asChild>
                            <div
                              style={{
                                width: dateColumns.length <= 7 ? "100%" : "36px",
                                height: "36px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 600,
                                backgroundColor: isDisabled ? "#F3F4F6" : cellColor,
                                color: isDisabled ? "#9CA3AF" : textColor,
                                cursor: isDisabled ? "default" : "pointer",
                                flexShrink: 0,
                                transition: isDisabled ? "none" : "all 0.2s ease",
                                opacity: isDisabled ? 0.6 : 1,
                                flex: dateColumns.length <= 7 ? 1 : "none",
                              }}
                              onMouseEnter={(e) => {
                                if (!isDisabled) {
                                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                                  e.currentTarget.style.transform = "scale(1.1)";

                                  // Smart positioning: detect if cell is in top or bottom half
                                  const cellRect = e.currentTarget.getBoundingClientRect();
                                  const containerRect = e.currentTarget.closest('[data-slot="tooltip-provider"]')?.getBoundingClientRect() || document.documentElement.getBoundingClientRect();

                                  // Calculate distance from top and bottom
                                  const distanceFromTop = cellRect.top - containerRect.top;
                                  const containerHeight = containerRect.height;
                                  const distanceFromBottom = containerHeight - (cellRect.bottom - containerRect.top);

                                  // If closer to top, show tooltip below; if closer to bottom, show above
                                  if (distanceFromTop < containerHeight / 2) {
                                    setTooltipPosition("bottom");
                                  } else {
                                    setTooltipPosition("top");
                                  }
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isDisabled) {
                                  e.currentTarget.style.boxShadow = "none";
                                  e.currentTarget.style.transform = "scale(1)";
                                }
                              }}
                            >
                              {cellData.totalCount}
                            </div>
                          </TooltipTrigger>
                          {!isDisabled && (
                            <TooltipContent
                              side={tooltipPosition}
                              sideOffset={8}
                              className="max-w-sm border-none bg-transparent shadow-none p-0"
                              style={{
                                pointerEvents: "none",
                              }}
                            >
                              <div style={{
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #E5E7EB",
                                borderRadius: "8px",
                                padding: "12px 14px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                                minWidth: "240px",
                                pointerEvents: "auto",
                              }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  {/* Header */}
                                  <p style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    margin: "0 0 6px 0",
                                    color: "#1F2937",
                                    borderBottom: "1px solid #E5E7EB",
                                    paddingBottom: "6px"
                                  }}>
                                    {mheId} • {col.label}
                                  </p>

                                  {/* Total Inspections */}
                                  <p style={{
                                    fontSize: "11px",
                                    margin: "4px 0 6px 0",
                                    color: "#6B7280",
                                    display: "flex",
                                    justifyContent: "space-between"
                                  }}>
                                    <span>Total Inspections:</span>
                                    <strong style={{ color: "#1F2937" }}>{cellData.totalCount}</strong>
                                  </p>

                                  {/* Operators Involved */}
                                  <p style={{
                                    fontSize: "11px",
                                    margin: "0 0 6px 0",
                                    color: "#6B7280",
                                    display: "flex",
                                    justifyContent: "space-between"
                                  }}>
                                    <span>Operators Involved:</span>
                                    <strong style={{ color: "#1F2937" }}>{cellData.uniqueOperators}</strong>
                                  </p>

                                  {/* Severity Breakdown Header */}
                                  <p style={{
                                    fontSize: "10px",
                                    fontWeight: "600",
                                    margin: "6px 0 4px 0",
                                    color: "#6B7280",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    borderTop: "1px solid #E5E7EB",
                                    paddingTop: "6px"
                                  }}>
                                    Severity Breakdown
                                  </p>

                                  {/* Severity Items */}
                                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                                      <span style={{ color: "#1F2937" }}>No Issue:</span>
                                      <strong style={{ color: "#1F2937" }}>{cellData.severityBreakdown.no_issue}</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                                      <span style={{ color: "#1F2937" }}>Green:</span>
                                      <strong style={{ color: "#1F2937" }}>{cellData.severityBreakdown.green}</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                                      <span style={{ color: "#1F2937" }}>Amber:</span>
                                      <strong style={{ color: "#1F2937" }}>{cellData.severityBreakdown.amber}</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                                      <span style={{ color: "#1F2937" }}>Red:</span>
                                      <strong style={{ color: "#1F2937" }}>{cellData.severityBreakdown.red}</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Footer with Axis Label and Insight - Full Width */}
        <div style={{ borderTop: "1px solid var(--border)", padding: "12px 16px", zIndex: 15 }}>
          {/* Axis Label */}
          <div style={{ display: "flex", justifyContent: "center", fontSize: "11px", fontWeight: "600", color: "#64748B", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            No. of Inspections
          </div>

          {/* Insight Callout - Clean Text Style with Date Range */}
          {insights && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0, lineHeight: "1.4" }}>
                <span style={{ fontWeight: "600" }}>{insights.topMhe}</span> reported most, mainly by <span style={{ fontWeight: "600" }}>{insights.topRedMhe}</span>
              </p>
              <p style={{ fontSize: "12px", fontWeight: "400", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>
                {insights.dateRange}
              </p>
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
};
