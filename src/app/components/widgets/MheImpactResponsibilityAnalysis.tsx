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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
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
      <CardHeader className="pb-3 border-b border-[var(--border)]">
        <div className="flex items-start justify-between w-full gap-3">
          <div className="flex flex-col gap-0.5 flex-1">
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)] leading-tight">
              MHE Impact Responsibility Analysis
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              Stacked impact events by severity level
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <label className="text-[length:var(--text-xs)] font-[var(--font-weight-medium)] text-[var(--foreground)]">Type:</label>
              <Select value={selectedMheType} onValueChange={setSelectedMheType}>
                <SelectTrigger className="h-7 text-xs w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mheTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-[length:var(--text-xs)] font-[var(--font-weight-medium)] text-[var(--foreground)]">Zone:</label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger className="h-7 text-xs w-24">
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
      <CardContent className="px-4 py-0 pb-0 overflow-hidden flex flex-col flex-1">
        {hasData ? (
          <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
            <ChartContainer config={impactChartConfig} style={{ width: "100%", height: "100%" }}>
              <BarChart
                accessibilityLayer
                data={filteredData}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 20, bottom: 8 }}
                barCategoryGap="8%"
              >
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  dataKey="mheId"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  width={45}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="High" stackId="a" fill="#1B59F8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Medium" stackId="a" fill="#4C7DFF" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Low" stackId="a" fill="#8FB2FF" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-[var(--muted-foreground)]">
              <p className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)]">No impact data available</p>
            </div>
          </div>
        )}
      </CardContent>
      {hasData && (
        <>
          {/* Legend Row - Compact */}
          <div
            style={{
              padding: "8px 24px",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
              zIndex: 10,
              backgroundColor: "var(--background)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#1B59F8", borderRadius: "1px" }}></div>
              <span style={{ fontSize: "11px", color: "#64748B", fontWeight: "500" }}>High</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#4C7DFF", borderRadius: "1px" }}></div>
              <span style={{ fontSize: "11px", color: "#64748B", fontWeight: "500" }}>Medium</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#8FB2FF", borderRadius: "1px" }}></div>
              <span style={{ fontSize: "11px", color: "#64748B", fontWeight: "500" }}>Low</span>
            </div>
          </div>

          {/* Insight Callout - Compact */}
          {insights && (
            <div
              style={{
                borderTop: "1px solid var(--border)",
                padding: "12px 24px",
                zIndex: 10,
                backgroundColor: "var(--background)",
              }}
            >
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0, lineHeight: "1.4" }}>
                <span style={{ fontWeight: "600" }}>{insights.topMhe}</span> • <span style={{ fontWeight: "600" }}>{insights.severityLabel}</span>
              </p>
              <p style={{ fontSize: "12px", fontWeight: "400", color: "#6B7280", margin: "2px 0 0 0", lineHeight: "1.4" }}>
                {insights.filterContext}
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
