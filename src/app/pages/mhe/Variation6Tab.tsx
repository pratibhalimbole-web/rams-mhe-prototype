import React, { useState, useMemo } from "react";
import { Truck, Activity, ShieldCheck, Wifi, AlertTriangle } from "lucide-react";
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
import { PieChart, Pie, Cell, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { MheInspectionSeverityTimeline } from "../../components/widgets/MheInspectionSeverityTimeline";
import { KpiCardV3 } from "../../components/widgets/v3/KpiCardV3";
import { FleetCompositionWidget } from "../../components/widgets/v6/FleetCompositionWidget";
import { WarrantyExpiryTableV3 } from "../../components/widgets/v3/WarrantyExpiryTableV3";
import {
  COLORS, donutChartConfig, failureChartConfig,
  equipmentHealthDataByType, equipmentHealthData, componentFailureDataByType,
  machinesInspectionData,
  LicenseRenewDrawer, OperatorLicenseExpiryDrawer,
} from "./FMSDashboard";
import { CriticalIssuesModal } from "../../components/widgets/CriticalIssuesModal";

export function Variation6Tab() {
  const [selectedEquipment, setSelectedEquipment] = useState("Electric Forklift");
  const [selectedHealthEquipment, setSelectedHealthEquipment] = useState("Overall");
  const [isIssuesModalOpen, setIsIssuesModalOpen] = useState(false);
  const [isRenewDrawerOpen, setIsRenewDrawerOpen] = useState(false);
  const [selectedMheForRenewal, setSelectedMheForRenewal] = useState<string | null>(null);
  const [isLicenseDrawerOpen, setIsLicenseDrawerOpen] = useState(false);
  const [selectedOperatorForLicense, setSelectedOperatorForLicense] = useState<string | null>(null);

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

      {/* Section — Command Center KPIs */}
      <div style={{ marginBottom: "-8px" }}>
        <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
          FMS · COMMAND CENTER
        </span>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3"><KpiCardV3 label="Fleet Size"         value="42"  description="Total machines in operation" icon={Truck}      /></div>
        <div className="col-span-3"><KpiCardV3 label="Fleet Utilization"  value="78%" description="Percentage active equipment" icon={Activity}   /></div>
        <div className="col-span-3"><KpiCardV3 label="Fleet Safety Score" value="92%" description="Safety performance rating"   icon={ShieldCheck}/></div>
        <div className="col-span-3"><KpiCardV3 label="Sensor Health"      value="95%" description="Active sensors percentage"  icon={Wifi}       /></div>
      </div>

      {/* Row 2: Fleet Health + Component Failure — exact from Variation 1 */}
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

      {/* Row 3: Machines Attention + Severity Timeline — exact from Variation 1 */}
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

        <div className="col-span-6 w-full overflow-auto" style={{ height: "448px" }}>
          <MheInspectionSeverityTimeline />
        </div>
      </div>

      {/* Fleet Composition */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5 flex min-h-[360px]">
          <FleetCompositionWidget />
        </div>
      </div>

      {/* Warranty Table */}
      <WarrantyExpiryTableV3
        onRenew={(id, type) => {
          if (type === "operator") {
            setSelectedOperatorForLicense(id);
            setIsLicenseDrawerOpen(true);
          } else {
            setSelectedMheForRenewal(id);
            setIsRenewDrawerOpen(true);
          }
        }}
      />

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
      <CriticalIssuesModal
        isOpen={isIssuesModalOpen}
        onClose={() => setIsIssuesModalOpen(false)}
      />
    </div>
  );
}
