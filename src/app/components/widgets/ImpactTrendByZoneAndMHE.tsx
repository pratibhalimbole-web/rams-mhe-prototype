import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "../ui/chart";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ImpactEvent {
  timestamp: Date;
  zone: string;
  mheId: string;
  mheType: string;
  severity: "High" | "Medium" | "Low";
  operatorName: string;
  rackId: string;
}

interface ChartDataPoint {
  date: string;
  timestamp: string;
  totalEvents: number;
  events: ImpactEvent[];
}

// ─── Color System ─────────────────────────────────────────────────────────────
const colorSystem = {
  default: {
    background: "#9CA3AF",
    border: "#6B7280",
    text: "#FFFFFF",
  },
  filtered: ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#1E40AF"],
};

// ─── Custom Marker Component ──────────────────────────────────────────────────
const EnhancedMarker = (props: any) => {
  const { cx, cy, fill, payload, isDefaultState } = props;

  // Get the value from payload
  const value = payload?.totalEvents || 0;

  const markerColor = isDefaultState ? colorSystem.default.background : fill;
  const borderColor = isDefaultState ? colorSystem.default.border : fill;

  return (
    <g>
      {/* Outer circle with border */}
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill={markerColor}
        stroke={borderColor}
        strokeWidth={1.5}
      />
      {/* Inner text - event count */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill={colorSystem.default.text}
        fontSize="9"
        fontWeight="600"
      >
        {value}
      </text>
    </g>
  );
};

// ─── Mock Data Generation ─────────────────────────────────────────────────────
const generateMockImpactEvents = (): ImpactEvent[] => {
  const zones = ["Aisle 1", "Aisle 2", "Rack R12", "Loading Bay", "Storage Area"];
  const mheIds = ["MHE-001", "MHE-002", "MHE-003", "MHE-004", "MHE-005"];
  const mheTypes = ["Electric Forklift", "Diesel Forklift", "Reach Truck", "Pallet Jack", "Stacker"];
  const operators = ["John Smith", "Jane Doe", "Mike Johnson", "Sarah Williams", "Tom Brown"];
  const racks = ["R001", "R002", "R012", "R025", "R034"];
  const severities: Array<"High" | "Medium" | "Low"> = ["High", "Medium", "Low"];

  const events: ImpactEvent[] = [];
  const now = new Date();

  // Generate 30 days of impact events
  for (let day = 0; day < 30; day++) {
    const daysAgo = 29 - day;
    const eventCount = Math.floor(Math.random() * 8) + 2;

    for (let i = 0; i < eventCount; i++) {
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(Math.floor(Math.random() * 24));
      timestamp.setMinutes(Math.floor(Math.random() * 60));

      const randomMheIdx = Math.floor(Math.random() * mheIds.length);
      events.push({
        timestamp,
        zone: zones[Math.floor(Math.random() * zones.length)],
        mheId: mheIds[randomMheIdx],
        mheType: mheTypes[randomMheIdx % mheTypes.length],
        severity: severities[Math.floor(Math.random() * severities.length)],
        operatorName: operators[Math.floor(Math.random() * operators.length)],
        rackId: racks[Math.floor(Math.random() * racks.length)],
      });
    }
  }

  return events;
};

// ─── Data Transformation ──────────────────────────────────────────────────────
const transformDataByTotalEvents = (
  events: ImpactEvent[],
  selectedZone: string,
  selectedMheType: string
): ChartDataPoint[] => {
  // Filter events
  const filtered = events.filter(event => {
    const zoneMatch = selectedZone === "All Zones" || event.zone === selectedZone;
    const mheMatch = selectedMheType === "All Types" || event.mheType === selectedMheType;
    return zoneMatch && mheMatch;
  });

  // Group by date and aggregate total events
  const buckets: { [key: string]: { events: ImpactEvent[]; date: string; timestamp: string } } = {};
  const now = new Date();
  const dateFormat = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
  };

  // Create 7-day buckets
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = dateFormat(date);
    buckets[dateKey] = {
      events: [],
      date: dateKey,
      timestamp: date.toISOString(),
    };
  }

  // Populate buckets
  filtered.forEach(event => {
    const dateKey = dateFormat(event.timestamp);
    if (buckets[dateKey]) {
      buckets[dateKey].events.push(event);
    }
  });

  // Convert to chart data
  return Object.values(buckets)
    .map(bucket => ({
      date: bucket.date,
      timestamp: bucket.timestamp,
      totalEvents: bucket.events.length,
      events: bucket.events,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// ─── Component ───────────────────────────────────────────────────────────────
export function ImpactTrendByZoneAndMHE() {
  const allEvents = useMemo(() => generateMockImpactEvents(), []);
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedMheType, setSelectedMheType] = useState("All Types");

  // Get unique values for dropdowns
  const zones = useMemo(() => {
    const zoneSet = new Set(allEvents.map(e => e.zone));
    return ["All Zones", ...Array.from(zoneSet).sort()];
  }, [allEvents]);

  const mheTypes = useMemo(() => {
    const mheTypeSet = new Set(allEvents.map(e => e.mheType));
    return ["All Types", ...Array.from(mheTypeSet).sort()];
  }, [allEvents]);

  // Transform data - single dot per date showing total events
  const chartData = useMemo(() => {
    return transformDataByTotalEvents(allEvents, selectedZone, selectedMheType);
  }, [allEvents, selectedZone, selectedMheType]);

  // Get top keys for legend
  const topKeys = useMemo(() => {
    const filtered = allEvents.filter(event => {
      const zoneMatch = selectedZone === "All Zones" || event.zone === selectedZone;
      const mheMatch = selectedMheType === "All Types" || event.mheType === selectedMheType;
      return zoneMatch && mheMatch;
    });

    const totals: { [key: string]: number } = {};
    filtered.forEach(event => {
      const key = event.zone;
      totals[key] = (totals[key] || 0) + 1;
    });

    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => key);
  }, [allEvents, selectedZone, selectedMheType]);

  // Determine if in default state
  const isDefaultState = selectedZone === "All Zones" && selectedMheType === "All Types";

  // Chart configuration
  const chartConfig: ChartConfig = {
    totalEvents: {
      label: "Impact Events",
      color: isDefaultState ? colorSystem.default.background : colorSystem.filtered[0],
    },
  };

  // Filter out zero event days for display
  const displayData = useMemo(() => {
    return chartData.filter(d => d.totalEvents > 0);
  }, [chartData]);

  const hasData = displayData.length > 0;

  // Calculate insights
  const insights = useMemo(() => {
    if (!hasData || topKeys.length === 0) return null;

    // Find the zone with most impact events across all dates
    const zoneTotals: { [zone: string]: number } = {};
    displayData.forEach(dataPoint => {
      dataPoint.events.forEach(event => {
        zoneTotals[event.zone] = (zoneTotals[event.zone] || 0) + 1;
      });
    });

    const topZone = Object.entries(zoneTotals)
      .sort((a, b) => b[1] - a[1])[0];

    if (!topZone) return null;

    // Get date range from chart data
    let dateRange = "";
    if (displayData.length > 0) {
      const firstDate = displayData[0].date;
      const lastDate = displayData[displayData.length - 1].date;
      dateRange = `${firstDate} – ${lastDate}`;
    }

    return {
      topZone: topZone[0],
      secondaryZone: topKeys[1] || topKeys[0],
      dateRange,
    };
  }, [displayData, hasData, topKeys]);

  // Enhanced Tooltip (different for default vs filtered state)
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const dataPoint = payload[0].payload as ChartDataPoint;

      if (!dataPoint.events || dataPoint.events.length === 0) {
        return null;
      }

      const isDefaultView = selectedZone === "All Zones" && selectedMheType === "All Types";

      // Group events by zone
      const zoneCount: { [zone: string]: number } = {};
      dataPoint.events.forEach(event => {
        zoneCount[event.zone] = (zoneCount[event.zone] || 0) + 1;
      });

      // In default state, show total number with zone breakdown and colors
      if (isDefaultView) {
        return (
          <div
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              minWidth: "240px",
            }}
          >
            {/* Date Header */}
            <p
              style={{
                fontSize: "11px",
                fontWeight: "600",
                margin: "0 0 6px 0",
                color: "var(--foreground)",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "6px",
              }}
            >
              {dataPoint.date}
            </p>

            {/* Total Events - Large Display */}
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                margin: "4px 0 8px 0",
                color: "var(--foreground)",
                textAlign: "center",
              }}
            >
              {dataPoint.totalEvents}
            </p>

            {/* Impact Location Header */}
            <p
              style={{
                fontSize: "10px",
                fontWeight: "600",
                margin: "6px 0 4px 0",
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Impact Location:
            </p>

            {/* Zone List with Legend Colors */}
            {Object.keys(zoneCount).length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {Object.entries(zoneCount)
                  .sort((a, b) => b[1] - a[1])
                  .map(([zone, count], idx) => {
                    const zoneIndex = topKeys.indexOf(zone);
                    const legendColor = zoneIndex >= 0
                      ? colorSystem.filtered[zoneIndex % colorSystem.filtered.length]
                      : colorSystem.filtered[idx % colorSystem.filtered.length];

                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "11px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              backgroundColor: legendColor,
                              borderRadius: "2px",
                              flexShrink: 0,
                            }}
                          ></span>
                          <span style={{ color: "var(--foreground)" }}>{zone}</span>
                        </div>
                        <span
                          style={{
                            fontWeight: "600",
                            color: "var(--foreground)",
                            marginLeft: "8px",
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: "4px 0" }}>
                No data
              </p>
            )}
          </div>
        );
      }

      // In filtered state, show zone breakdown with legend colors
      return (
        <div
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            minWidth: "240px",
          }}
        >
          {/* Date Header */}
          <p
            style={{
              fontSize: "11px",
              fontWeight: "600",
              margin: "0 0 6px 0",
              color: "var(--foreground)",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "6px",
            }}
          >
            {dataPoint.date}
          </p>

          {/* Total Events */}
          <p
            style={{
              fontSize: "11px",
              margin: "4px 0 6px 0",
              color: "var(--muted-foreground)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Total Events:</span>
            <strong style={{ color: "var(--foreground)" }}>{dataPoint.totalEvents}</strong>
          </p>

          {/* Impact Location Header */}
          <p
            style={{
              fontSize: "10px",
              fontWeight: "600",
              margin: "6px 0 4px 0",
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Impact Location:
          </p>

          {/* Zone List with Legend Colors */}
          {Object.keys(zoneCount).length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {Object.entries(zoneCount)
                .sort((a, b) => b[1] - a[1])
                .map(([zone, count], idx) => {
                  const zoneIndex = topKeys.indexOf(zone);
                  const legendColor = zoneIndex >= 0
                    ? colorSystem.filtered[zoneIndex % colorSystem.filtered.length]
                    : colorSystem.filtered[idx % colorSystem.filtered.length];

                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "11px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: legendColor,
                            borderRadius: "2px",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span style={{ color: "var(--foreground)" }}>{zone}</span>
                      </div>
                      <span
                        style={{
                          fontWeight: "600",
                          color: "var(--foreground)",
                          marginLeft: "8px",
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: "4px 0" }}>
              No data
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden"
      style={{ height: "540px" }}
    >
      <CardHeader className="pb-3 border-b border-[var(--border)]">
        <div className="flex items-start justify-between w-full gap-3">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
              Impact Trend by Zone & MHE
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              Total impact events over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <label className="text-[length:var(--text-xs)] font-[var(--font-weight-medium)] text-[var(--foreground)]">
                Zone:
              </label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger className="h-7 text-xs w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {zones.map(zone => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-[length:var(--text-xs)] font-[var(--font-weight-medium)] text-[var(--foreground)]">
                Type:
              </label>
              <Select value={selectedMheType} onValueChange={setSelectedMheType}>
                <SelectTrigger className="h-7 text-xs w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mheTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-0 pb-0 overflow-hidden flex flex-col flex-1">
        {hasData ? (
          <div style={{ flex: 1, minHeight: 0 }}>
            <ChartContainer config={chartConfig} style={{ height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  data={displayData}
                  margin={{ top: 8, right: 16, left: 20, bottom: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={true}
                    horizontalPoints={[]}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#6B7280" }}
                    tickLine={false}
                    axisLine={{ stroke: "#E5E7EB" }}
                    height={35}
                    interval="preserveStartEnd"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#6B7280" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => Math.round(value).toString()}
                    type="number"
                    domain={[0, "dataMax + 1"]}
                    width={45}
                    label={{
                      value: "Impact Events",
                      angle: -90,
                      position: "insideLeft",
                      offset: 8,
                      fontSize: 10,
                      fill: "#6B7280",
                    }}
                  />
                  <ChartTooltip content={<CustomTooltip />} cursor={false} />
                  <Scatter
                    dataKey="totalEvents"
                    fill={isDefaultState ? colorSystem.default.background : colorSystem.filtered[0]}
                    shape={
                      <EnhancedMarker isDefaultState={isDefaultState} />
                    }
                    isAnimationActive={false}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-[var(--muted-foreground)]">
              <p className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)]">
                No impact events for selected filters
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Legend & Insight Footer - Full Width */}
      {hasData && (
        <>
          {/* Legend Section - No Divider */}
          <div style={{ padding: "8px 24px", zIndex: 10, backgroundColor: "var(--background)" }}>
            <div
              style={{
                textAlign: "center",
                marginBottom: "6px",
                fontSize: "11px",
                color: "#64748B",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Impact Zones
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              {topKeys.map((key, idx) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: colorSystem.filtered[idx % colorSystem.filtered.length],
                      borderRadius: "1px",
                      flexShrink: 0,
                    }}
                  ></div>
                  <span style={{ fontSize: "11px", color: "#64748B" }}>{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insight Callout - Divider Above */}
          {insights && (
            <div
              style={{
                borderTop: "1px solid var(--border)",
                padding: "8px 24px",
                zIndex: 10,
                backgroundColor: "var(--background)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <p style={{ fontSize: "12px", fontWeight: "600", color: "#1F2937", margin: 0, lineHeight: "1.3" }}>
                  <span style={{ fontWeight: "600" }}>{insights.topZone}</span> reported most, mainly by <span style={{ fontWeight: "600" }}>{insights.secondaryZone}</span>
                </p>
                <p style={{ fontSize: "11px", fontWeight: "400", color: "#6B7280", margin: 0, lineHeight: "1.2" }}>
                  {insights.dateRange}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
