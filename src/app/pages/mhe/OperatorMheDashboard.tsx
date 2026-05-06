import React, { useState } from "react";
import { useSidebar } from "../../components/layout/SidebarLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DateRangeSelector } from "../../components/ui/date-range-selector";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../../components/ui/drawer";
import { Search, Download, Zap, Settings2, BarChart2, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../../components/ui/utils";

// Mock Data
const kpiData = [
  { title: "Best Operator", value: "Prashant Rao", subtext: "Avg productivity 88%", icon: TrendingUp },
  { title: "Best MHE", value: "MHE-005", subtext: "Avg productivity 87%", icon: Zap },
  { title: "Best Pair", value: "Prashant Rao + MHE-005", subtext: "Score 95%", icon: CheckCircle2 },
  { title: "Low Efficiency Pairs", value: "6", subtext: "Need reassignment", icon: AlertCircle, alert: true },
];

const recommendedAssignments = [
  { id: 1, operator: "Prashant Rao", mhe: "MHE-005", score: 95, confidence: "High" },
  { id: 2, operator: "Ajay Malhotra", mhe: "MHE-002", score: 91, confidence: "High" },
  { id: 3, operator: "Kunal Dehmukh", mhe: "MHE-001", score: 88, confidence: "Medium" },
  { id: 4, operator: "Rajesh Patil", mhe: "MHE-007", score: 87, confidence: "Medium" },
];

const topCombinations = [
  { rank: 1, operator: "Prashant Rao", mhe: "MHE-005", prod: 95, opAvg: 88, mheAvg: 87 },
  { rank: 2, operator: "Ajay Malhotra", mhe: "MHE-002", prod: 91, opAvg: 85, mheAvg: 86 },
  { rank: 3, operator: "Kunal Dehmukh", mhe: "Test-MHE", prod: 90, opAvg: 83, mheAvg: 84 },
  { rank: 4, operator: "Rajesh Patil", mhe: "MHE-007", prod: 88, opAvg: 82, mheAvg: 83 },
];

const operatorList = [
  { id: "op1", name: "Prashant Rao", avg: 88 },
  { id: "op2", name: "Ajay Malhotra", avg: 85 },
  { id: "op3", name: "Kunal Dehmukh", avg: 83 },
  { id: "op4", name: "Rajesh Patil", avg: 82 },
];

const operatorDetails = [
  { rank: 1, mhe: "MHE-005", prod: 95 },
  { rank: 2, mhe: "MHE-002", prod: 93 },
  { rank: 3, mhe: "Test-MHE", prod: 91 },
  { rank: 4, mhe: "MHE-007", prod: 88 },
];

const mheList = [
  { id: "mhe1", name: "MHE-005", avg: 87 },
  { id: "mhe2", name: "MHE-002", avg: 86 },
  { id: "mhe3", name: "MHE-007", avg: 83 },
  { id: "mhe4", name: "Test-MHE", avg: 84 },
];

const mheDetails = [
  { rank: 1, operator: "Prashant Rao", prod: 95 },
  { rank: 2, operator: "Ajay Malhotra", prod: 90 },
  { rank: 3, operator: "Rajesh Patil", prod: 87 },
  { rank: 4, operator: "Suresh Kumar", prod: 85 },
];

export function OperatorMheDashboard() {
  const sidebar = useSidebar();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeOperator, setActiveOperator] = useState(operatorList[0]);
  const [activeMhe, setActiveMhe] = useState(mheList[0]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  React.useEffect(() => {
    if (sidebar) {
      sidebar.setSubPageTitle("Operator ↔ MHE Optimization");
    }
  }, [sidebar]);

  const handleEditAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsDrawerOpen(true);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 1500);
  };

  return (
    <div className="min-h-full bg-background pb-[var(--spacing-12)]">
      {/* Header */}
      <div className="h-[var(--header-height)] px-[var(--spacing-10)] border-b border-border bg-card flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-[var(--text-xl)] font-[var(--font-weight-bold)] text-foreground tracking-tight">Operator ↔ MHE Optimization</h1>
          <p className="text-[var(--text-sm)] text-muted-foreground">Intelligent pairing recommendations based on productivity data</p>
        </div>
        <div className="flex items-center gap-[var(--spacing-3)]">
          <Select defaultValue="wh1">
            <SelectTrigger className="w-[var(--select-width-lg)] h-[var(--input-height)]">
              <SelectValue placeholder="Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wh1">Main Warehouse</SelectItem>
              <SelectItem value="wh2">East Wing</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="shift1">
            <SelectTrigger className="w-[var(--select-width-md)] h-[var(--input-height)]">
              <SelectValue placeholder="Shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shift1">Morning Shift</SelectItem>
              <SelectItem value="shift2">Night Shift</SelectItem>
            </SelectContent>
          </Select>
          <DateRangeSelector className="w-auto h-[var(--input-height)]" />
          
          <div className="w-[1px] h-[var(--spacing-6)] bg-border mx-[var(--spacing-1)]"></div>
          
          <Button variant="outline" size="sm" className="h-[var(--input-height)] gap-[var(--spacing-2)] font-[var(--font-weight-medium)]">
            <Download className="w-[var(--spacing-4)] h-[var(--spacing-4)]" />
            Export
          </Button>
          <Button size="sm" className="h-[var(--input-height)] gap-[var(--spacing-2)] font-[var(--font-weight-medium)] bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleOptimize} disabled={isOptimizing}>
            {isOptimizing ? <Settings2 className="w-[var(--spacing-4)] h-[var(--spacing-4)] animate-spin" /> : <Zap className="w-[var(--spacing-4)] h-[var(--spacing-4)]" />}
            {isOptimizing ? "Optimizing..." : "Auto Optimize"}
          </Button>
        </div>
      </div>

      <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--spacing-20)] py-[var(--spacing-8)] space-y-[var(--spacing-8)]">
        
        {/* SECTION 1 - KPI SUMMARY */}
        <div className="grid grid-cols-4 gap-[var(--spacing-6)]">
          {kpiData.map((kpi, idx) => (
            <Card key={idx} className={cn("h-[var(--card-height-sm)] shadow-[var(--elevation-sm)] border-border/60", kpi.alert && "border-warning bg-warning/10")}>
              <CardContent className="p-[var(--spacing-5)] flex flex-col justify-center h-full">
                <div className="flex justify-between items-start mb-[var(--spacing-2)]">
                  <p className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-muted-foreground">{kpi.title}</p>
                  <div className={cn("p-[var(--spacing-1)] rounded-[var(--radius-md)]", kpi.alert ? "bg-warning/20 text-warning" : "bg-primary/10 text-primary")}>
                    <kpi.icon className="w-[var(--spacing-4)] h-[var(--spacing-4)]" />
                  </div>
                </div>
                <div className="flex items-baseline gap-[var(--spacing-2)]">
                  <h3 className="text-[var(--text-2xl)] font-[var(--font-weight-bold)] text-foreground leading-none">{kpi.value}</h3>
                </div>
                <p className={cn("text-[var(--text-xs)] mt-[var(--spacing-1)]", kpi.alert ? "text-warning font-[var(--font-weight-medium)]" : "text-muted-foreground")}>{kpi.subtext}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two Column Layout for Section 2 & 3 */}
        <div className="grid grid-cols-12 gap-[var(--spacing-6)]">
          
          {/* SECTION 2 - RECOMMENDED ASSIGNMENTS */}
          <Card className="col-span-7 h-[var(--card-height-lg)] shadow-[var(--elevation-sm)] border-border/60 flex flex-col">
            <CardHeader className="px-[var(--spacing-6)] py-[var(--spacing-5)] border-b border-border">
              <CardTitle className="text-[var(--text-lg)] font-[var(--font-weight-bold)]">Recommended Operator Assignments</CardTitle>
              <CardDescription className="text-[var(--text-sm)] text-muted-foreground">System-optimized pairings maximizing productivity.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <Table>
                <TableHeader className="bg-muted sticky top-0">
                  <TableRow className="hover:bg-muted">
                    <TableHead className="font-[var(--font-weight-medium)] text-muted-foreground px-[var(--spacing-6)]">Operator</TableHead>
                    <TableHead className="font-[var(--font-weight-medium)] text-muted-foreground">Assigned MHE</TableHead>
                    <TableHead className="font-[var(--font-weight-medium)] text-muted-foreground">Score</TableHead>
                    <TableHead className="font-[var(--font-weight-medium)] text-muted-foreground">Confidence</TableHead>
                    <TableHead className="text-right px-[var(--spacing-6)] font-[var(--font-weight-medium)] text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendedAssignments.map((row) => (
                    <TableRow key={row.id} className="h-[var(--spacing-12)] hover:bg-accent cursor-pointer group transition-colors border-b border-border">
                      <TableCell className="font-[var(--font-weight-medium)] px-[var(--spacing-6)]">{row.operator}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-[var(--font-weight-medium)]">{row.mhe}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-[var(--spacing-2)]">
                          <span className="font-[var(--font-weight-medium)] text-[var(--text-sm)]">{row.score}%</span>
                          <div className="w-[var(--progress-bar-width)] h-[var(--progress-bar-height-md)] bg-secondary rounded-[var(--radius-xl)] overflow-hidden">
                            <div className="h-full bg-success rounded-[var(--radius-xl)]" style={{ width: `${row.score}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("font-[var(--font-weight-medium)] border-transparent text-[var(--text-xs)]", row.confidence === 'High' ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                          {row.confidence}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-[var(--spacing-6)]">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-[var(--spacing-8)] text-primary hover:text-primary hover:bg-primary/10 transition-all font-[var(--font-weight-medium)]" onClick={() => handleEditAssignment(row)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <div className="px-[var(--spacing-6)] py-[var(--spacing-4)] border-t border-border flex justify-between items-center bg-muted/50 mt-auto rounded-b-[var(--radius-lg)]">
              <span className="text-[var(--text-sm)] text-muted-foreground">Showing {recommendedAssignments.length} optimized pairs</span>
              <div className="flex gap-[var(--spacing-3)]">
                <Button variant="outline" size="sm" className="h-[var(--input-height)] font-[var(--font-weight-medium)] border-border text-foreground hover:bg-accent">Manual Adjust</Button>
                <Button size="sm" className="h-[var(--input-height)] bg-foreground text-background hover:bg-foreground/90 font-[var(--font-weight-medium)]">Approve All Assignments</Button>
              </div>
            </div>
          </Card>

          {/* SECTION 3 - TOP PRODUCTIVITY COMBINATIONS */}
          <Card className="col-span-5 h-[var(--card-height-lg)] shadow-[var(--elevation-sm)] border-border/60 flex flex-col">
            <CardHeader className="px-[var(--spacing-6)] py-[var(--spacing-5)] border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[var(--text-lg)] font-[var(--font-weight-bold)]">Top Combinations</CardTitle>
                <CardDescription className="text-[var(--text-sm)] text-muted-foreground">Highest historical productivity.</CardDescription>
              </div>
              <Select defaultValue="top10">
                <SelectTrigger className="w-[var(--select-width-sm)] h-[var(--spacing-8)] text-[var(--text-xs)]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top10">Top 10</SelectItem>
                  <SelectItem value="top25">Top 25</SelectItem>
                  <SelectItem value="worst10">Worst 10</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <Table>
                <TableHeader className="bg-muted sticky top-0">
                  <TableRow className="hover:bg-muted">
                    <TableHead className="w-[var(--spacing-12)] text-center font-[var(--font-weight-medium)] text-muted-foreground">#</TableHead>
                    <TableHead className="font-[var(--font-weight-medium)] text-muted-foreground">Pairing</TableHead>
                    <TableHead className="text-right font-[var(--font-weight-medium)] text-muted-foreground px-[var(--spacing-6)]">Prod</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCombinations.map((row, idx) => (
                    <TableRow key={idx} className={cn("h-[var(--spacing-12)] border-b border-border", idx < 2 ? "bg-success/10 hover:bg-success/20" : "hover:bg-accent")}>
                      <TableCell className="text-center font-[var(--font-weight-semi-bold)] text-muted-foreground">{row.rank}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-[var(--font-weight-medium)] text-[var(--text-sm)] text-foreground">{row.operator}</span>
                          <span className="text-[var(--text-xs)] text-muted-foreground">{row.mhe}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-[var(--spacing-6)]">
                        <div className="inline-flex items-center justify-center bg-card px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-md)] border border-border font-[var(--font-weight-semi-bold)] text-success shadow-[var(--elevation-sm)] text-[var(--text-sm)]">
                          {row.prod}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 4 & 5 - FOCUS PANELS */}
        <div className="grid grid-cols-2 gap-[var(--spacing-6)]">
          
          {/* OPERATOR FOCUS PANEL */}
          <Card className="shadow-[var(--elevation-sm)] border-border/60 overflow-hidden flex h-[var(--card-height-md)]">
            {/* Left List */}
            <div className="w-[var(--sidebar-width)] border-r border-border bg-muted/50 flex flex-col">
              <div className="p-[var(--spacing-4)] border-b border-border bg-card">
                <div className="relative">
                  <Search className="w-[var(--spacing-4)] h-[var(--spacing-4)] absolute left-[var(--spacing-3)] top-[calc(var(--spacing-2)+var(--spacing-1))] text-muted-foreground" />
                  <Input placeholder="Search operator..." className="h-[var(--input-height)] pl-[var(--input-height)] text-[var(--text-sm)] bg-muted border-border" />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-[var(--spacing-2)] space-y-[var(--spacing-1)]">
                  {operatorList.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setActiveOperator(op)}
                      className={cn(
                        "w-full text-left px-[var(--spacing-3)] py-[var(--spacing-3)] rounded-[var(--radius-md)] transition-all flex flex-col gap-[var(--spacing-1)]",
                        activeOperator.id === op.id ? "bg-primary/10 border border-primary/20 shadow-[var(--elevation-sm)]" : "hover:bg-accent border border-transparent"
                      )}
                    >
                      <span className={cn("text-[var(--text-sm)] font-[var(--font-weight-medium)]", activeOperator.id === op.id ? "text-primary" : "text-secondary-foreground")}>{op.name}</span>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[var(--text-xs)] text-muted-foreground">Avg {op.avg}%</span>
                        <div className="w-[var(--spacing-16)] h-[var(--spacing-1)] bg-secondary rounded-[var(--radius-xl)] overflow-hidden">
                          <div className={cn("h-full rounded-[var(--radius-xl)]", activeOperator.id === op.id ? "bg-primary" : "bg-muted-foreground")} style={{ width: `${op.avg}%` }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            {/* Right Detail */}
            <div className="flex-1 flex flex-col bg-card">
              <div className="p-[var(--spacing-5)] border-b border-border flex justify-between items-center">
                <div>
                  <h3 className="text-[var(--text-lg)] font-[var(--font-weight-bold)] text-foreground">Operator Performance</h3>
                  <p className="text-[var(--text-sm)] text-muted-foreground mt-[var(--spacing-1)]">Showing stats for <strong className="text-secondary-foreground">{activeOperator.name}</strong></p>
                </div>
                <div className="w-[var(--spacing-10)] h-[var(--spacing-10)] rounded-[calc(var(--radius)+10px)] bg-primary/20 text-primary flex items-center justify-center font-[var(--font-weight-bold)] text-[var(--text-lg)] border border-primary/30 shadow-[var(--elevation-sm)]">
                  {activeOperator.name.charAt(0)}
                </div>
              </div>
              <div className="p-0 flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border">
                      <TableHead className="w-[64px] text-center font-[var(--font-weight-medium)] text-muted-foreground">Rank</TableHead>
                      <TableHead className="font-[var(--font-weight-medium)] text-muted-foreground">MHE Equipment</TableHead>
                      <TableHead className="text-right px-[var(--spacing-6)] font-[var(--font-weight-medium)] text-muted-foreground">Productivity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operatorDetails.map((detail, idx) => (
                      <TableRow key={idx} className="border-b border-muted">
                        <TableCell className="text-center font-[var(--font-weight-medium)] text-muted-foreground">{detail.rank}</TableCell>
                        <TableCell className="font-[var(--font-weight-medium)] text-secondary-foreground">{detail.mhe}</TableCell>
                        <TableCell className="text-right px-[var(--spacing-6)]">
                          <span className="inline-block bg-secondary px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-sm)] text-[var(--text-sm)] font-[var(--font-weight-semi-bold)] text-secondary-foreground">{detail.prod}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-[var(--spacing-4)] border-t border-border bg-muted/30">
                <Button className="w-full h-[var(--spacing-10)] bg-card border border-border text-secondary-foreground hover:bg-accent hover:text-foreground shadow-[var(--elevation-sm)] font-[var(--font-weight-medium)]">
                  Assign Selected MHE
                </Button>
              </div>
            </div>
          </Card>

          {/* MHE FOCUS PANEL */}
          <Card className="shadow-[var(--elevation-sm)] border-border/60 overflow-hidden flex h-[var(--card-height-md)]">
            {/* Left List */}
            <div className="w-[var(--sidebar-width)] border-r border-border bg-muted/50 flex flex-col">
              <div className="p-[var(--spacing-4)] border-b border-border bg-card">
                <div className="relative">
                  <Search className="w-[var(--spacing-4)] h-[var(--spacing-4)] absolute left-[var(--spacing-3)] top-[calc(var(--spacing-2)+var(--spacing-1))] text-muted-foreground" />
                  <Input placeholder="Search MHE..." className="h-[var(--input-height)] pl-[var(--input-height)] text-[var(--text-sm)] bg-muted border-border" />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-[var(--spacing-2)] space-y-[var(--spacing-1)]">
                  {mheList.map((mhe) => (
                    <button
                      key={mhe.id}
                      onClick={() => setActiveMhe(mhe)}
                      className={cn(
                        "w-full text-left px-[var(--spacing-3)] py-[var(--spacing-3)] rounded-[var(--radius-md)] transition-all flex flex-col gap-[var(--spacing-1)]",
                        activeMhe.id === mhe.id ? "bg-chart-5/10 border border-chart-5/20 shadow-[var(--elevation-sm)]" : "hover:bg-accent border border-transparent"
                      )}
                    >
                      <span className={cn("text-[var(--text-sm)] font-[var(--font-weight-medium)]", activeMhe.id === mhe.id ? "text-chart-5" : "text-secondary-foreground")}>{mhe.name}</span>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[var(--text-xs)] text-muted-foreground">Avg {mhe.avg}%</span>
                        <div className="w-[var(--progress-bar-width)] h-[var(--progress-bar-height-sm)] bg-secondary rounded-[var(--radius-xl)] overflow-hidden">
                          <div className={cn("h-full rounded-[var(--radius-xl)]", activeMhe.id === mhe.id ? "bg-chart-5" : "bg-muted-foreground")} style={{ width: `${mhe.avg}%` }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            {/* Right Detail */}
            <div className="flex-1 flex flex-col bg-card">
              <div className="p-[var(--spacing-5)] border-b border-border flex justify-between items-center">
                <div>
                  <h3 className="text-[var(--text-lg)] font-[var(--font-weight-bold)] text-foreground">Machine Performance</h3>
                  <p className="text-[var(--text-sm)] text-muted-foreground mt-[calc(var(--spacing-1)/2)]">Showing stats for <strong className="text-secondary-foreground">{activeMhe.name}</strong></p>
                </div>
                <div className="w-[var(--spacing-10)] h-[var(--spacing-10)] rounded-[var(--radius-lg)] bg-chart-5/20 text-chart-5 flex items-center justify-center shadow-[var(--elevation-sm)] border border-chart-5/30">
                  <BarChart2 className="w-[var(--spacing-5)] h-[var(--spacing-5)]" />
                </div>
              </div>
              <div className="p-0 flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border">
                      <TableHead className="w-[var(--progress-bar-width)] text-center font-[var(--font-weight-medium)] text-muted-foreground">Rank</TableHead>
                      <TableHead className="font-[var(--font-weight-medium)] text-muted-foreground">Operator</TableHead>
                      <TableHead className="text-right px-[var(--spacing-6)] font-[var(--font-weight-medium)] text-muted-foreground">Productivity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mheDetails.map((detail, idx) => (
                      <TableRow key={idx} className="border-b border-muted">
                        <TableCell className="text-center font-[var(--font-weight-medium)] text-muted-foreground">{detail.rank}</TableCell>
                        <TableCell className="font-[var(--font-weight-medium)] text-secondary-foreground">{detail.operator}</TableCell>
                        <TableCell className="text-right px-[var(--spacing-6)]">
                          <span className="inline-block bg-secondary px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-sm)] text-[var(--text-sm)] font-[var(--font-weight-semi-bold)] text-secondary-foreground">{detail.prod}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* Edit Assignment Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="w-[var(--drawer-width)] mx-auto right-0 left-auto top-0 bottom-0 mt-0 rounded-none rounded-l-[var(--radius-xl)] border-l border-border bg-background">
          <DrawerHeader className="text-left border-b border-border py-[var(--spacing-6)] px-[var(--spacing-6)]">
            <DrawerTitle className="text-[var(--text-xl)] font-[var(--font-weight-bold)] text-foreground">Edit Assignment</DrawerTitle>
            <DrawerDescription className="text-[var(--text-sm)] text-muted-foreground">
              Review or manually adjust this pairing.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-[var(--spacing-6)] space-y-[var(--spacing-6)] overflow-y-auto">
            {selectedAssignment && (
              <>
                <div className="space-y-[var(--spacing-4)]">
                  <div className="space-y-[var(--spacing-2)]">
                    <label className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground">Selected Operator</label>
                    <Select defaultValue={selectedAssignment.operator}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Prashant Rao">Prashant Rao</SelectItem>
                        <SelectItem value="Ajay Malhotra">Ajay Malhotra</SelectItem>
                        <SelectItem value="Kunal Dehmukh">Kunal Dehmukh</SelectItem>
                        <SelectItem value="Rajesh Patil">Rajesh Patil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-[var(--spacing-2)]">
                    <label className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground">Target MHE</label>
                    <Select defaultValue={selectedAssignment.mhe}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select MHE" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MHE-005">MHE-005</SelectItem>
                        <SelectItem value="MHE-002">MHE-002</SelectItem>
                        <SelectItem value="MHE-001">MHE-001</SelectItem>
                        <SelectItem value="MHE-007">MHE-007</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-muted p-[var(--spacing-4)] rounded-[var(--radius-lg)] border border-border space-y-[var(--spacing-4)]">
                  <h4 className="font-[var(--font-weight-semi-bold)] text-foreground text-[var(--text-sm)]">Pairing Metrics</h4>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-sm)] text-muted-foreground">Expected Productivity</span>
                    <span className="font-[var(--font-weight-bold)] text-success text-[var(--text-lg)]">{selectedAssignment.score}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-sm)] text-muted-foreground">Operator Average</span>
                    <span className="font-[var(--font-weight-medium)] text-foreground">88%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-sm)] text-muted-foreground">Machine Average</span>
                    <span className="font-[var(--font-weight-medium)] text-foreground">87%</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-[var(--spacing-2)] border-t border-border">
                    <span className="text-[var(--text-sm)] text-muted-foreground">System Confidence</span>
                    <Badge variant="secondary" className="bg-success/20 text-success hover:bg-success/30">
                      {selectedAssignment.confidence}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </div>
          <DrawerFooter className="border-t border-border pt-[var(--spacing-4)] pb-[var(--spacing-6)] px-[var(--spacing-6)] flex-row gap-[var(--spacing-3)]">
            <Button variant="outline" className="flex-1" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={() => setIsDrawerOpen(false)}>Confirm Assignment</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}