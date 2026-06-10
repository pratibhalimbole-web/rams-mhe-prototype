import React, { useState, useMemo } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../../components/ui/card";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent,
} from "../../components/ui/chart";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { PieChart, Pie, Cell, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Truck, Activity, ShieldCheck, Wifi, ChevronLeft, ChevronRight, AlertTriangle, User } from "lucide-react";
import { TopMhesWithFindingsV3 } from "../../components/widgets/v3/TopMhesWithFindingsV3";
import { MheImpactResponsibilityAnalysis } from "../../components/widgets/MheImpactResponsibilityAnalysis";
import { ImpactTrendByZoneAndMHE } from "../../components/widgets/ImpactTrendByZoneAndMHE";
import { MachinesRequiringInspectionAttention } from "../../components/widgets/MachinesRequiringInspectionAttention";
import { MheInsightPanel } from "../../components/widgets/MheInsightPanel";
import { KpiCard } from "../../components/widgets/KpiCard";
import {
  COLORS, donutChartConfig, failureChartConfig,
  equipmentHealthDataByType, equipmentHealthData, componentFailureDataByType,
  machinesInspectionData, warrantyExpiryData, operatorLicenseData,
  KPICard, StatusBadge,
  LicenseRenewDrawer, OperatorLicenseExpiryDrawer,
} from "./FMSDashboard";

export function Variation1Tab() {
  const [selectedEquipment, setSelectedEquipment] = useState("Electric Forklift");
  const [selectedHealthEquipment, setSelectedHealthEquipment] = useState("Overall");
  const [selectedWarrantyFilter, setSelectedWarrantyFilter] = useState("All");
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);
  const [isRenewDrawerOpen, setIsRenewDrawerOpen] = useState(false);
  const [selectedMheForRenewal, setSelectedMheForRenewal] = useState<string | null>(null);
  const [isLicenseDrawerOpen, setIsLicenseDrawerOpen] = useState(false);
  const [selectedOperatorForLicense, setSelectedOperatorForLicense] = useState<string | null>(null);

  const totalMHE = equipmentHealthData.reduce((sum, item) => sum + item.value, 0);
  const maxIndex = equipmentHealthData.reduce(
    (maxIdx, item, index, arr) => (item.value > arr[maxIdx].value ? index : maxIdx), 0
  );
  const [activeIndex, setActiveIndex] = useState(maxIndex);

  const getPartWithMostIssuesForMHE = (mheId: string) => {
    const machine = machinesInspectionData.find((m) => m.mheId === mheId);
    if (!machine || !machine.part_issues || machine.part_issues.length === 0) return null;
    const partIssueMap = new Map<string, number>();
    machine.part_issues.forEach((issue: any) => {
      partIssueMap.set(issue.part_name, issue.amber_count + issue.red_count);
    });
    if (partIssueMap.size === 0) return null;
    return Array.from(partIssueMap.entries()).reduce(
      (max, [part, count]) => count > (max[1] || 0) ? [part, count] : max, ["", 0]
    )[0] || null;
  };

  const currentFailureData = componentFailureDataByType[selectedEquipment];

  const colorMap: Record<string, string> = {
    "No Issues":       COLORS.noIssues,
    "Healthy (Green)": COLORS.healthy,
    "Warning (Amber)": COLORS.warning,
    "Critical (Red)":  COLORS.critical,
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={outerRadius} outerRadius={outerRadius + 8}
          startAngle={startAngle} endAngle={endAngle} fill="var(--muted)" />
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius}
          startAngle={startAngle} endAngle={endAngle} fill={fill} stroke="#ffffff" strokeWidth={3} />
      </g>
    );
  };

  const fleetHealthInsights = useMemo(() => {
    const currentData = equipmentHealthDataByType[selectedHealthEquipment];
    if (!currentData || currentData.length === 0) return null;
    const topStatus = currentData.reduce((max, item) => item.value > max.value ? item : max);
    const topStatusLabel = topStatus.name.replace(" (Green)", "").replace(" (Amber)", "").replace(" (Red)", "");
    const secondaryStatus = currentData.filter(item => item.name !== topStatus.name).sort((a: any, b: any) => b.value - a.value)[0];
    const secondaryLabel = secondaryStatus?.name.replace(" (Green)", "").replace(" (Amber)", "").replace(" (Red)", "") || "Others";
    return { topStatus: topStatusLabel, secondaryStatus: secondaryLabel, equipmentFilter: selectedHealthEquipment };
  }, [selectedHealthEquipment]);

  const componentFailureInsights = useMemo(() => {
    const currentData = componentFailureDataByType[selectedEquipment];
    if (!currentData || currentData.length === 0) return null;
    const componentWithMostFailures = currentData.reduce((max: any, item: any) => {
      return (item.Red + item.Amber) > ((max.Red || 0) + (max.Amber || 0)) ? item : max;
    });
    const redCount = componentWithMostFailures.Red || 0;
    const amberCount = componentWithMostFailures.Amber || 0;
    const severityLabel = redCount > amberCount ? "high severity" : amberCount > 0 ? "medium severity" : "low severity";
    return { topComponent: componentWithMostFailures.part, severityLabel, equipmentFilter: selectedEquipment };
  }, [selectedEquipment]);

  return (
    <div className="space-y-6 p-8">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3"><KPICard title="Fleet Size"        description="Total machines in operation" value="42"  icon={Truck}       /></div>
        <div className="col-span-3"><KPICard title="Fleet Utilization" description="Percentage active equipment" value="78%" icon={Activity}    /></div>
        <div className="col-span-3"><KPICard title="Fleet Safety Score" description="Safety performance rating"  value="92%" icon={ShieldCheck} /></div>
        <div className="col-span-3"><KPICard title="Sensor Health"     description="Active sensors percentage"  value="95%" icon={Wifi}        /></div>
      </div>

      {/* Row 2: Fleet Health + Component Failure */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <div className="flex items-start justify-between w-full gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">Fleet Equipment Health Distribution</CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">Fleet equipment warranty validity status across all MHE assets.</CardDescription>
              </div>
              <div className="w-[200px] flex-shrink-0">
                <Select value={selectedHealthEquipment} onValueChange={setSelectedHealthEquipment}>
                  <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Overall">Overall</SelectItem>
                    <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                    <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                    <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-6 pb-0">
            <div style={{ width: "240px", height: "240px", position: "relative" }}>
              <ChartContainer config={donutChartConfig} className="w-full h-full">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData}
                    cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3}
                    dataKey="value" nameKey="name" stroke="#ffffff" strokeWidth={3}
                    activeIndex={activeIndex} activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(maxIndex)}>
                    {(equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colorMap[entry.name] || COLORS.noIssues} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                <div className="text-[length:var(--text-2xl)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
                  {(equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData).reduce((sum: number, item: any) => sum + item.value, 0)}
                </div>
                <div className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] mt-1">Total MHEs</div>
              </div>
            </div>
          </CardContent>
          <div style={{ padding: "16px 24px", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              {(equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData).map((item: any) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", backgroundColor: colorMap[item.name], borderRadius: "2px" }} />
                  <span style={{ fontSize: "11px", color: "#64748B" }}>{item.name.replace(" (Green)", "").replace(" (Amber)", "").replace(" (Red)", "")}</span>
                </div>
              ))}
            </div>
          </div>
          {fleetHealthInsights && (
            <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0 }}>
                  <span>{fleetHealthInsights.topStatus}</span> status reported most, mainly by <span>{fleetHealthInsights.secondaryStatus}</span>
                </p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
                  {fleetHealthInsights.equipmentFilter === "Overall" ? "All Equipment Types" : fleetHealthInsights.equipmentFilter}
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <div className="flex items-start justify-between w-full gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">Component Failure Distribution</CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">Frequency of inspection findings units.</CardDescription>
              </div>
              <div className="w-[200px] flex-shrink-0">
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                    <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                    <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pb-0 flex flex-col flex-1">
            <div className="overflow-x-auto flex-1">
              <div className={currentFailureData.length > 5 ? "min-w-[600px]" : ""}>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "20px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748B", transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>Count</span>
                  </div>
                  <ChartContainer config={failureChartConfig} className="h-[260px]" style={{ paddingLeft: "8px" }}>
                    <BarChart data={currentFailureData} margin={{ top: 10, right: 20, left: 36, bottom: 10 }} barGap="20%">
                      <CartesianGrid vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="part" tickLine={false} tickMargin={10} axisLine={false} tick={{ fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={30} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="No Issues" stackId="a" fill="hsl(217, 98%, 54%)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Green"     stackId="a" fill="hsl(222, 84%, 62%)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Amber"     stackId="a" fill="hsl(226, 75%, 68%)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Red"       stackId="a" fill="hsl(230, 67%, 85%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </CardContent>
          {componentFailureInsights && (
            <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: "2px" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0 }}>
                <span>{componentFailureInsights.topComponent}</span> reported most failures, mainly by <span>{componentFailureInsights.severityLabel}</span>
              </p>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{componentFailureInsights.equipmentFilter}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Row 3: Machines Attention + Severity Timeline */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden" style={{ height: "448px" }}>
          <CardHeader className="pb-4 border-b border-[var(--border)]">
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">Machines Requiring Inspection Attention</CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">MHE units with warning or critical findings from recent inspections.</CardDescription>
              </div>
              <div className="w-[200px] flex-shrink-0">
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                    <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                    <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {machinesInspectionData.map((row: any) => {
                const formattedDate = new Date(row.lastInspection).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
                const partWithMostIssues = getPartWithMostIssuesForMHE(row.mheId);
                const hasIssues = row.redFindings > 0 || row.amberFindings > 0;
                return (
                  <Card key={row.mheId} className="shadow-none border rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#eff6ff" }}>
                          <Truck className="h-4 w-4" style={{ color: "#1b59f8" }} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)] font-mono text-[color:var(--primary)]">{row.mheId}</p>
                          <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">Last Inspection: {formattedDate}</span>
                        </div>
                      </div>
                      {hasIssues && partWithMostIssues ? (
                        <div className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0" style={{ backgroundColor: "#EEF2FF", color: "#1E40AF", borderColor: "#E0E7FF" }}>
                          <AlertTriangle className="h-3.5 w-3.5" style={{ color: "#2563EB" }} />
                          <span>Most Issues: {partWithMostIssues}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0" style={{ backgroundColor: "#ECFDF5", color: "#065F46", borderColor: "#D1FAE5" }}>
                          <span>All Good</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      {[
                        { label: "Red",   value: row.redFindings,   color: "var(--destructive)" },
                        { label: "Amber", value: row.amberFindings, color: "var(--warning)"     },
                        { label: "Green", value: row.greenFindings, color: "var(--success)"     },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex flex-col items-center gap-1">
                          <span className="text-[length:var(--text-xs)]" style={{ color: "#9CA3AF" }}>{label}</span>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">{value}</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[length:var(--text-xs)]" style={{ color: "#9CA3AF" }}>Parts</span>
                        <span className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">{row.parts}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <div className="col-span-6 flex min-h-[448px]">
          <TopMhesWithFindingsV3 />
        </div>
      </div>

      {/* Row 4: Warranty Expiry Table */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 shadow-none border-[var(--border)]">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">MHE Warranty Expiry Monitoring</CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] whitespace-nowrap">MHE whose equipment licenses have expired or will expire soon.</CardDescription>
              </div>
              <div className="w-[200px] flex-shrink-0">
                <Select value={selectedWarrantyFilter} onValueChange={setSelectedWarrantyFilter}>
                  <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                    <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                    <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                    <SelectItem value="Order Picker">Order Picker</SelectItem>
                    <SelectItem value="Tow Tractor">Tow Tractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {["MHE Type", "MHE ID", "License Expiry", "Days Remaining", "Status", "Action"].map((h) => (
                      <TableHead key={h} className="px-6 h-12 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase tracking-wide">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warrantyExpiryData
                    .filter((row) => (row.status === "expiring" || row.status === "expired") && (selectedWarrantyFilter === "All" || row.mheType === selectedWarrantyFilter))
                    .slice(0, 5)
                    .map((row) => (
                      <TableRow key={row.mheId} className="h-12 border-b border-border hover:bg-muted/50">
                        <TableCell className="px-6 text-[length:var(--text-sm)]">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: "#eff6ff" }}>
                              <Truck className="h-3 w-3" style={{ color: "#1b59f8" }} />
                            </div>
                            {row.mheType}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)] font-mono font-semibold text-[color:var(--primary)]">{row.mheId}</TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)]">{new Date(row.licenseExpiry).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)] text-[var(--muted-foreground)]">{row.daysRemaining} Days</TableCell>
                        <TableCell className="px-6"><StatusBadge status={row.status as any} /></TableCell>
                        <TableCell className="px-6">
                          <button className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[color:var(--primary)]"
                            onClick={() => { setSelectedMheForRenewal(row.mheId); setIsRenewDrawerOpen(true); }}>
                            Renew
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                Showing {Math.min(5, warrantyExpiryData.filter(r => (r.status === "expiring" || r.status === "expired") && (selectedWarrantyFilter === "All" || r.mheType === selectedWarrantyFilter)).length)} results
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-muted rounded" disabled><ChevronLeft className="w-4 h-4 text-[var(--muted-foreground)]" /></button>
                <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] min-w-[40px] text-center">1 / 1</span>
                <button className="p-1 hover:bg-muted rounded"><ChevronRight className="w-4 h-4 text-[var(--foreground)]" /></button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Impact Analysis */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6"><MheImpactResponsibilityAnalysis /></div>
        <div className="col-span-6"><ImpactTrendByZoneAndMHE /></div>
      </div>

      {/* Row 6: Operator License Table */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 shadow-none border-[var(--border)]">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">Operator License Expiry Monitoring</CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">Track operator license expiration dates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {["Operator", "Operator ID", "License Expiry", "Days Remaining", "Assigned MHE", "Status", "Action"].map((h) => (
                      <TableHead key={h} className="px-6 h-12 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase tracking-wide">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operatorLicenseData.map((row) => {
                    const daysColor = row.daysRemaining < 0 ? "var(--destructive)" : row.daysRemaining < 15 ? "var(--warning)" : "var(--foreground)";
                    return (
                      <TableRow key={row.operatorId} className="h-12 border-b border-border hover:bg-muted/50">
                        <TableCell className="px-6 text-[length:var(--text-sm)] font-[var(--font-weight-medium)]">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: "#f0fdf4" }}>
                              <User className="h-3 w-3" style={{ color: "#16a34a" }} />
                            </div>
                            {row.operator}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)] font-mono font-semibold text-[color:var(--primary)]">{row.operatorId}</TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)]">{new Date(row.licenseExpiry).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)] font-[var(--font-weight-medium)]"><span style={{ color: daysColor }}>{row.daysRemaining} days</span></TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)]">{row.assignedMhe}</TableCell>
                        <TableCell className="px-6"><StatusBadge status={row.status as any} /></TableCell>
                        <TableCell className="px-6">
                          <button className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[color:var(--primary)] hover:underline"
                            onClick={() => { setSelectedOperatorForLicense(row.operatorId); setIsLicenseDrawerOpen(true); }}>
                            License Renew
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <LicenseRenewDrawer
        isOpen={isRenewDrawerOpen}
        onClose={() => { setIsRenewDrawerOpen(false); setSelectedMheForRenewal(null); }}
        mheId={selectedMheForRenewal}
      />
      <OperatorLicenseExpiryDrawer
        isOpen={isLicenseDrawerOpen}
        onClose={() => { setIsLicenseDrawerOpen(false); setSelectedOperatorForLicense(null); }}
        operatorId={selectedOperatorForLicense}
      />
    </div>
  );
}
