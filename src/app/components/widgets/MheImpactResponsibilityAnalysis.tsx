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
import { Label } from "../ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface ImpactEvent {
  mheId: string;
  mheType: string;
  zone: string;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  lastImpactDate: string;
}

interface ChartData {
  mheId: string;
  High: number;
  Medium: number;
  Low: number;
  zone: string;
  lastImpactDate: string;
}

const impactChartConfig = {
  High: { label: "High", color: "#1B59F8" },
  Medium: { label: "Medium", color: "#4C7DFF" },
  Low: { label: "Low", color: "#8FB2FF" },
} satisfies ChartConfig;

// ─── Mock Data Generation ─────────────────────────────────────────────────────
const generateMockImpactData = (): ImpactEvent[] => {
  const mheTypes = ["Electric Forklift", "Diesel Forklift", "Reach Truck", "Pallet Jack", "Stacker"];
  const zones = ["Aisle 1", "Aisle 2", "Rack R12", "Loading Bay", "Storage Area"];
  const mheIds = [
    "MHE-001", "MHE-002", "MHE-003", "MHE-004", "MHE-005",
    "MHE-006", "MHE-007", "MHE-008", "MHE-009", "MHE-010",
    "MHE-011", "MHE-012"
  ];

  return mheIds.map((mheId, index) => ({
    mheId,
    mheType: mheTypes[index % mheTypes.length],
    zone: zones[index % zones.length],
    highCount: Math.floor(Math.random() * 8),
    mediumCount: Math.floor(Math.random() * 12),
    lowCount: Math.floor(Math.random() * 15),
    lastImpactDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));
};

// ─── Component ───────────────────────────────────────────────────────────────
export function MheImpactResponsibilityAnalysis() {
  const mockData = useMemo(() => generateMockImpactData(), []);
  const [selectedMheType, setSelectedMheType] = useState("All");
  const [selectedZone, setSelectedZone] = useState("All Zones");

  // Get unique values for dropdowns
  const mheTypes = useMemo(() => {
    const types = new Set(mockData.map(d => d.mheType));
    return ["All", ...Array.from(types)];
  }, [mockData]);

  const zones = useMemo(() => {
    const zoneList = new Set(mockData.map(d => d.zone));
    return ["All Zones", ...Array.from(zoneList)];
  }, [mockData]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    return mockData
      .filter(item => {
        const mheTypeMatch = selectedMheType === "All" || item.mheType === selectedMheType;
        const zoneMatch = selectedZone === "All Zones" || item.zone === selectedZone;
        return mheTypeMatch && zoneMatch;
      })
      .map(item => ({
        mheId: item.mheId,
        High: item.highCount,
        Medium: item.mediumCount,
        Low: item.lowCount,
        zone: item.zone,
        lastImpactDate: item.lastImpactDate,
      }))
      .sort((a, b) => {
        const totalA = a.High + a.Medium + a.Low;
        const totalB = b.High + b.Medium + b.Low;
        return totalB - totalA;
      })
      .slice(0, 5);
  }, [mockData, selectedMheType, selectedZone]);

  const hasData = filteredData.length > 0;

  // Calculate insights
  const insights = useMemo(() => {
    if (!hasData) return null;

    const topMhe = filteredData[0];
    const topMheTotal = topMhe.High + topMhe.Medium + topMhe.Low;

    // Determine severity breakdown
    let severityLabel = "mixed severity";
    if (topMhe.High > topMhe.Medium && topMhe.High > topMhe.Low) {
      severityLabel = "high severity";
    } else if (topMhe.Medium > topMhe.High && topMhe.Medium > topMhe.Low) {
      severityLabel = "medium severity";
    } else if (topMhe.Low > topMhe.High && topMhe.Low > topMhe.Medium) {
      severityLabel = "low severity";
    }

    // Get filter context
    let filterContext = "All MHE Types • All Zones";
    if (selectedMheType !== "All" || selectedZone !== "All Zones") {
      const mheFilter = selectedMheType !== "All" ? selectedMheType : "All Types";
      const zoneFilter = selectedZone !== "All Zones" ? selectedZone : "All Zones";
      filterContext = `${mheFilter} • ${zoneFilter}`;
    }

    return {
      topMhe: topMhe.mheId,
      topMheTotal,
      severityLabel,
      filterContext,
    };
  }, [filteredData, hasData, selectedMheType, selectedZone]);

  return (
    <Card className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden" style={{ height: "540px" }}>
      <CardHeader className="pb-4 border-b border-[var(--border)]">
        <div className="flex items-start justify-between w-full gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
              MHE Impact Responsibility Analysis
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              Stacked impact events by severity level
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Label htmlFor="impact-mhe-type" className="text-xs whitespace-nowrap">MHE Type:</Label>
              <Select value={selectedMheType} onValueChange={setSelectedMheType}>
                <SelectTrigger id="impact-mhe-type" className="h-9 text-xs w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mheTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="impact-zone" className="text-xs whitespace-nowrap">Zone:</Label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger id="impact-zone" className="h-9 text-xs w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {zones.map(zone => (
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4 pb-0 overflow-hidden flex flex-col flex-1">
        {hasData ? (
          <div style={{ height: "650px", marginTop: "16px", position: "relative" }}>
            {/* Custom Y-axis label — vertically centered, clear of plot area */}
            <div style={{ position: "absolute", left: 0, top: 16, bottom: 40, width: "18px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748B", letterSpacing: "0.01em", transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
                MHE ID
              </span>
            </div>
            <ChartContainer config={impactChartConfig} style={{ height: "100%", paddingLeft: "18px" }}>
              <BarChart
                accessibilityLayer
                data={filteredData}
                layout="vertical"
                margin={{ top: 16, right: 24, left: 4, bottom: 20 }}
                barCategoryGap="20%"
                maxBarSize={64}
              >
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  tick={{ fontSize: 11 }}
                  label={{ value: "NO. OF EVENTS", position: "bottom", offset: 10, fontSize: 12, fontWeight: 500, fill: "#64748B", letterSpacing: "0.01em" }}
                />
                <YAxis
                  dataKey="mheId"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  width={60}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="High" stackId="a" fill="#1B59F8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Medium" stackId="a" fill="#4C7DFF" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Low" stackId="a" fill="#8FB2FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[260px] text-center">
            <div className="text-[var(--muted-foreground)]">
              <p className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)]">No impact data available</p>
            </div>
          </div>
        )}
      </CardContent>
      {/* Legend Section - No Divider */}
      {hasData && (
        <div style={{ padding: "10px 24px", zIndex: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#1B59F8", borderRadius: "2px", flexShrink: 0 }}></div>
              <span style={{ fontSize: "12px", color: "#64748B" }}>High</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#4C7DFF", borderRadius: "2px", flexShrink: 0 }}></div>
              <span style={{ fontSize: "12px", color: "#64748B" }}>Medium</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#8FB2FF", borderRadius: "2px", flexShrink: 0 }}></div>
              <span style={{ fontSize: "12px", color: "#64748B" }}>Low</span>
            </div>
          </div>
        </div>
      )}

      {/* Insight Callout - Divider Above */}
      {hasData && insights && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "16px 24px",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0, lineHeight: "1.4" }}>
              <span style={{ fontWeight: "600" }}>{insights.topMhe}</span> reported most, mainly by <span style={{ fontWeight: "600" }}>{insights.severityLabel}</span>
            </p>
            <p style={{ fontSize: "12px", fontWeight: "400", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>
              {insights.filterContext}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
