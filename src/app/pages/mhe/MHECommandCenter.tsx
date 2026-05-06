import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../../components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Shield,
  Radio,
  Truck,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Mock Data
const kpiData = [
  { title: "Fleet Size", value: "42", subtitle: "Total MHE = 12 | Operators = 12", icon: Truck },
  { title: "Fleet Utilization", value: "64%", subtitle: "Active equipment usage", icon: Activity },
  { title: "Fleet Safety Score", value: "85%", subtitle: "RTSS safety performance", icon: Shield },
  { title: "Sensor Health", value: "70%", subtitle: "Sensor coverage across fleet", icon: Radio },
];

const warrantyData = [
  { label: "Active Warranty", count: 16, percent: 80, color: "hsl(142, 76%, 36%)" },
  { label: "Expiring in 30 Days", count: 2, percent: 10, color: "hsl(48, 96%, 53%)" },
  { label: "Expiring in 60 Days", count: 1, percent: 5, color: "hsl(25, 95%, 53%)" },
  { label: "Expired Warranty", count: 1, percent: 5, color: "hsl(0, 84%, 60%)" },
];

const licenseData = [
  { label: "Active License", count: 45, color: "hsl(142, 76%, 36%)" },
  { label: "Expiring in 30 Days", count: 8, color: "hsl(48, 96%, 53%)" },
  { label: "Expiring in 60 Days", count: 14, color: "hsl(25, 95%, 53%)" },
  { label: "Expired License", count: 3, color: "hsl(0, 84%, 60%)" },
];

const mheTableData = [
  { id: "MHE-001", type: "Electric Forklift", expiry: "30 Apr 2026", days: 14, status: "expiring-soon" },
  { id: "MHE-002", type: "Reach Truck", expiry: "15 May 2026", days: 29, status: "expiring-soon" },
  { id: "MHE-003", type: "Pallet Jack", expiry: "20 Jun 2026", days: 65, status: "active" },
  { id: "MHE-004", type: "Order Picker", expiry: "10 Mar 2026", days: -36, status: "expired" },
  { id: "MHE-005", type: "Tow Tractor", expiry: "25 Jul 2026", days: 100, status: "active" },
];

const operatorTableData = [
  { id: "OP-001", name: "Vikram Deshmukh", expiry: "30 Apr 2026", days: 14, mhe: "Electric Forklift", status: "expiring-soon" },
  { id: "OP-002", name: "Priya Sharma", expiry: "15 May 2026", days: 29, mhe: "Reach Truck", status: "expiring-soon" },
  { id: "OP-003", name: "Rajesh Kumar", expiry: "20 Jun 2026", days: 65, mhe: "Pallet Jack", status: "active" },
  { id: "OP-004", name: "Anjali Patel", expiry: "10 Mar 2026", days: -36, mhe: "Order Picker", status: "expired" },
  { id: "OP-005", name: "Suresh Reddy", expiry: "25 Jul 2026", days: 100, mhe: "Tow Tractor", status: "active" },
];

// KPI Card Component
function KPICard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: any }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

// Donut Chart Component
function DonutChart() {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const total = warrantyData.reduce((sum, item) => sum + item.count, 0);
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  const strokeWidth = 28;

  let cumulativePercent = 0;

  const createArc = (percent: number, offset: number) => {
    const angle = (percent / 100) * 360;
    const startAngle = (offset / 100) * 360 - 90;
    const endAngle = startAngle + angle;

    const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = angle > 180 ? 1 : 0;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="w-64 h-64">
          {warrantyData.map((segment, idx) => {
            const offset = cumulativePercent;
            cumulativePercent += segment.percent;
            return (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.path
                      d={createArc(segment.percent, offset)}
                      stroke={segment.color}
                      strokeWidth={hoveredSegment === idx ? strokeWidth + 4 : strokeWidth}
                      fill="none"
                      strokeLinecap="round"
                      onMouseEnter={() => setHoveredSegment(idx)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      style={{ cursor: "pointer" }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-semibold">{segment.label}</p>
                      <p>{segment.count} MHE</p>
                      <p className="text-muted-foreground">{segment.percent}%</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          <text x={centerX} y={centerY - 8} textAnchor="middle" className="text-3xl font-bold" fill="hsl(var(--foreground))">
            {total}
          </text>
          <text x={centerX} y={centerY + 12} textAnchor="middle" className="text-xs" fill="hsl(var(--muted-foreground))">
            Total MHE
          </text>
        </svg>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 w-full">
        {warrantyData.map((segment, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-accent transition-colors"
            onMouseEnter={() => setHoveredSegment(idx)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: segment.color }} />
            <span className="text-xs text-muted-foreground">{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// License Bar Chart Component
function LicenseBarChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const maxValue = Math.max(...licenseData.map(item => item.count));

  return (
    <div className="space-y-4 py-4">
      {licenseData.map((item, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">{item.count}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-8 bg-secondary rounded-md overflow-hidden">
                  <motion.div
                    className="h-full flex items-center justify-end px-3 text-xs font-medium text-white"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxValue) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === idx && item.count}
                  </motion.div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold">{item.label}</p>
                  <p>{item.count} Operators</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: "default",
    "expiring-soon": "warning",
    expired: "destructive",
  };

  const labels: Record<string, string> = {
    active: "Active",
    "expiring-soon": "Expiring Soon",
    expired: "Expired",
  };

  return (
    <Badge variant={variants[status] as any}>
      {labels[status]}
    </Badge>
  );
}

// Edit Panel Component
function EditPanel({ isOpen, onClose, mheId }: { isOpen: boolean; onClose: () => void; mheId: string | null }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit MHE Asset</SheetTitle>
          <SheetDescription>
            Update asset information for {mheId}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Basic Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold border-b pb-2">Basic Details</h4>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="serial">MHE Serial No</Label>
                <Input id="serial" defaultValue={mheId || ""} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="type">MHE Type</Label>
                <Select defaultValue="forklift">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forklift">Electric Forklift</SelectItem>
                    <SelectItem value="reach">Reach Truck</SelectItem>
                    <SelectItem value="pallet">Pallet Jack</SelectItem>
                    <SelectItem value="picker">Order Picker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="oem">OEM / Make</Label>
                <Input id="oem" defaultValue="Toyota" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="model">Model Number</Label>
                <Input id="model" defaultValue="8FBE20" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="year">Year of Manufacture</Label>
                <Input id="year" type="number" defaultValue="2024" />
              </div>
            </div>
          </div>

          {/* Ownership & Power */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold border-b pb-2">Ownership & Power</h4>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="ownership">Ownership Type</Label>
                <Select defaultValue="owned">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="leased">Leased</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="supplier">Supplier Name</Label>
                <Input id="supplier" defaultValue="Toyota Material Handling" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="power">Power Type</Label>
                <Select defaultValue="electric">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="lpg">LPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="capacity">Load Capacity (kg)</Label>
                <Input id="capacity" type="number" defaultValue="2000" />
              </div>
            </div>
          </div>

          {/* Safety Compliance */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold border-b pb-2">Safety Compliance</h4>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="warranty-status">Warranty Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expiring">Expiring Soon</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="warranty-date">Warranty Expiry Date</Label>
                <Input id="warranty-date" type="date" defaultValue="2026-04-30" />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Update Asset</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Main Dashboard Component
export function MHECommandCenter() {
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [selectedMHE, setSelectedMHE] = useState<string | null>(null);

  const handleRowClick = (id: string) => {
    setSelectedMHE(id);
    setEditPanelOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto h-full">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FMS</h1>
            <p className="text-muted-foreground">Fleet Management System</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="incidents" className="space-y-6">
            <TabsList>
              <TabsTrigger value="incidents">Incident & Trends</TabsTrigger>
              <TabsTrigger value="insights">AI Powered Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="incidents" className="space-y-6">
              {/* KPI Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <KPICard {...kpi} />
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>MHE Warranty Compliance Overview</CardTitle>
                      <CardDescription>Current warranty status across fleet</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DonutChart />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Operator License Compliance</CardTitle>
                      <CardDescription>License status distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LicenseBarChart />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* MHE Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>MHE Warranty Expiry Monitoring</CardTitle>
                        <CardDescription>Track warranty expiration dates</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="MHE Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="forklift">Electric Forklift</SelectItem>
                            <SelectItem value="reach">Reach Truck</SelectItem>
                            <SelectItem value="pallet">Pallet Jack</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Expiry Range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Ranges</SelectItem>
                            <SelectItem value="30">Expiring in 30 Days</SelectItem>
                            <SelectItem value="60">Expiring in 60 Days</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">MHE Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">MHE ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Warranty Expiry</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Days Remaining</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mheTableData.map((row, idx) => (
                            <motion.tr
                              key={row.id}
                              className="border-b cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleRowClick(row.id)}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 + idx * 0.05 }}
                            >
                              <td className="px-4 py-3 text-sm">{row.type}</td>
                              <td className="px-4 py-3 text-sm font-mono">{row.id}</td>
                              <td className="px-4 py-3 text-sm">{row.expiry}</td>
                              <td className="px-4 py-3 text-sm font-mono">{row.days} days</td>
                              <td className="px-4 py-3">
                                <StatusBadge status={row.status} />
                              </td>
                              <td className="px-4 py-3">
                                <Button size="sm" variant="outline" onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(row.id);
                                }}>
                                  Renew Warranty
                                </Button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Operator Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Operator License Expiry Monitoring</CardTitle>
                        <CardDescription>Track operator license expiration</CardDescription>
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expiring">Expiring Soon</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Operator</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Operator ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">License Expiry</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Days Remaining</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Assigned MHE</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {operatorTableData.map((row, idx) => (
                            <motion.tr
                              key={row.id}
                              className="border-b cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleRowClick(row.id)}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.9 + idx * 0.05 }}
                            >
                              <td className="px-4 py-3 text-sm">{row.name}</td>
                              <td className="px-4 py-3 text-sm font-mono">{row.id}</td>
                              <td className="px-4 py-3 text-sm">{row.expiry}</td>
                              <td className="px-4 py-3 text-sm font-mono">{row.days} days</td>
                              <td className="px-4 py-3 text-sm">{row.mhe}</td>
                              <td className="px-4 py-3">
                                <StatusBadge status={row.status} />
                              </td>
                              <td className="px-4 py-3">
                                <Button size="sm" variant="outline" onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(row.id);
                                }}>
                                  Update License
                                </Button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Powered Insights</CardTitle>
                  <CardDescription>Coming soon - Predictive analytics and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>AI insights will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

      {/* Edit Panel */}
      <EditPanel isOpen={editPanelOpen} onClose={() => setEditPanelOpen(false)} mheId={selectedMHE} />
    </div>
  );
}
