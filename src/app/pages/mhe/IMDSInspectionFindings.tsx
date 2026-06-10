"use client"

import * as React from "react"
import {
  Search,
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect } from "react"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import { toast } from "sonner"
import { DashboardTable } from "../../components/dashboard/DashboardTable"

// --- Types ---

type Severity = "Critical" | "High" | "Medium" | "Low"
type FindingStatus = "Open" | "In Progress" | "Resolved" | "Closed"
type AssetType = "Forklift" | "Reach Truck" | "Pallet Jack" | "Order Picker" | "Counterbalance"

type Finding = {
  id: string
  assetId: string
  assetType: AssetType
  component: string
  finding: string
  severity: Severity
  status: FindingStatus
  dateFound: string
  inspector: string
  notes?: string
}

// --- Mock Data ---

const mockFindings: Finding[] = [
  { id: "FIND-MHE-001", assetId: "FLT-014", assetType: "Forklift", component: "Forks", finding: "Fork tip crack detected on left tine", severity: "Critical", status: "Open", dateFound: "2026-06-08", inspector: "J. Santos" },
  { id: "FIND-MHE-002", assetId: "RT-007", assetType: "Reach Truck", component: "Battery", finding: "Battery not holding charge above 40%", severity: "High", status: "In Progress", dateFound: "2026-06-07", inspector: "M. Patel", notes: "Replacement battery ordered, ETA Jun 12" },
  { id: "FIND-MHE-003", assetId: "PJ-023", assetType: "Pallet Jack", component: "Hydraulics", finding: "Hydraulic fluid leak under pump unit", severity: "High", status: "Open", dateFound: "2026-06-07", inspector: "R. Nguyen" },
  { id: "FIND-MHE-004", assetId: "FLT-002", assetType: "Forklift", component: "Tires", finding: "Front left tire worn below 20% tread depth", severity: "Medium", status: "Resolved", dateFound: "2026-06-05", inspector: "J. Santos", notes: "Tire replaced on Jun 06" },
  { id: "FIND-MHE-005", assetId: "OP-011", assetType: "Order Picker", component: "Safety Horn", finding: "Horn non-functional during pre-shift check", severity: "Critical", status: "In Progress", dateFound: "2026-06-06", inspector: "A. Lee" },
  { id: "FIND-MHE-006", assetId: "CB-005", assetType: "Counterbalance", component: "Seatbelt", finding: "Seatbelt retractor mechanism jammed", severity: "Critical", status: "Open", dateFound: "2026-06-09", inspector: "M. Patel" },
  { id: "FIND-MHE-007", assetId: "RT-019", assetType: "Reach Truck", component: "Mast", finding: "Mast chain showing visible wear on inner link", severity: "High", status: "Open", dateFound: "2026-06-08", inspector: "R. Nguyen" },
  { id: "FIND-MHE-008", assetId: "FLT-031", assetType: "Forklift", component: "Overhead Guard", finding: "Overhead guard mounting bolt loose", severity: "High", status: "Resolved", dateFound: "2026-06-04", inspector: "J. Santos", notes: "Bolts tightened and torqued to spec" },
  { id: "FIND-MHE-009", assetId: "PJ-008", assetType: "Pallet Jack", component: "Wheels", finding: "Right drive wheel has flat spot causing vibration", severity: "Medium", status: "In Progress", dateFound: "2026-06-06", inspector: "A. Lee" },
  { id: "FIND-MHE-010", assetId: "OP-003", assetType: "Order Picker", component: "Platform Gate", finding: "Platform safety gate latch not engaging fully", severity: "Critical", status: "Open", dateFound: "2026-06-09", inspector: "R. Nguyen" },
  { id: "FIND-MHE-011", assetId: "FLT-009", assetType: "Forklift", component: "Lights", finding: "Front headlights dim, probable wiring fault", severity: "Low", status: "Resolved", dateFound: "2026-06-02", inspector: "M. Patel", notes: "Wiring connection reseated" },
  { id: "FIND-MHE-012", assetId: "CB-012", assetType: "Counterbalance", component: "Brakes", finding: "Service brakes require excessive pedal pressure", severity: "High", status: "Open", dateFound: "2026-06-08", inspector: "J. Santos" },
  { id: "FIND-MHE-013", assetId: "RT-004", assetType: "Reach Truck", component: "Load Backrest", finding: "Load backrest extension has hairline crack", severity: "Medium", status: "Closed", dateFound: "2026-05-28", inspector: "A. Lee", notes: "Part replaced, verified by supervisor" },
  { id: "FIND-MHE-014", assetId: "FLT-022", assetType: "Forklift", component: "Engine", finding: "Engine oil level critically low", severity: "High", status: "Resolved", dateFound: "2026-06-05", inspector: "R. Nguyen", notes: "Oil topped up, leak source investigated" },
  { id: "FIND-MHE-015", assetId: "PJ-016", assetType: "Pallet Jack", component: "Handle", finding: "Emergency lowering valve stiff operation", severity: "Medium", status: "Open", dateFound: "2026-06-07", inspector: "M. Patel" },
  { id: "FIND-MHE-016", assetId: "OP-007", assetType: "Order Picker", component: "Battery", finding: "Battery connector pins showing corrosion", severity: "Medium", status: "In Progress", dateFound: "2026-06-06", inspector: "J. Santos" },
  { id: "FIND-MHE-017", assetId: "CB-021", assetType: "Counterbalance", component: "Steering", finding: "Excessive play detected in steering wheel", severity: "High", status: "Open", dateFound: "2026-06-09", inspector: "A. Lee" },
  { id: "FIND-MHE-018", assetId: "FLT-017", assetType: "Forklift", component: "Forks", finding: "Fork heel wear at 85% of allowable limit", severity: "Medium", status: "Open", dateFound: "2026-06-08", inspector: "R. Nguyen" },
  { id: "FIND-MHE-019", assetId: "RT-025", assetType: "Reach Truck", component: "Outrigger", finding: "Outrigger wheel bearing noise during operation", severity: "Low", status: "Closed", dateFound: "2026-05-30", inspector: "M. Patel", notes: "Bearing replaced" },
  { id: "FIND-MHE-020", assetId: "FLT-005", assetType: "Forklift", component: "Exhaust", finding: "Exhaust emissions above permissible indoor limit", severity: "High", status: "Open", dateFound: "2026-06-09", inspector: "J. Santos" },
  { id: "FIND-MHE-021", assetId: "PJ-031", assetType: "Pallet Jack", component: "Frame", finding: "Minor frame weld crack near rear axle mount", severity: "Medium", status: "In Progress", dateFound: "2026-06-07", inspector: "A. Lee" },
  { id: "FIND-MHE-022", assetId: "OP-015", assetType: "Order Picker", component: "Deadman Pedal", finding: "Deadman pedal return spring weak", severity: "High", status: "Open", dateFound: "2026-06-08", inspector: "R. Nguyen" },
  { id: "FIND-MHE-023", assetId: "CB-003", assetType: "Counterbalance", component: "Tyres", finding: "Rear tyre showing sidewall bulge", severity: "Critical", status: "Open", dateFound: "2026-06-09", inspector: "M. Patel" },
  { id: "FIND-MHE-024", assetId: "RT-011", assetType: "Reach Truck", component: "Controls", finding: "Lift control lever intermittently unresponsive", severity: "High", status: "In Progress", dateFound: "2026-06-06", inspector: "J. Santos" },
  { id: "FIND-MHE-025", assetId: "FLT-028", assetType: "Forklift", component: "Camera", finding: "Rear-view camera lens cracked", severity: "Low", status: "Open", dateFound: "2026-06-08", inspector: "A. Lee" },
]

// --- Severity Helpers ---

function severityBadge(severity: Severity) {
  const map: Record<Severity, string> = {
    Critical: "bg-[var(--destructive)]/15 text-[var(--destructive)]",
    High: "bg-orange-500/15 text-orange-500",
    Medium: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    Low: "bg-[var(--chart-2)]/15 text-[var(--chart-2)]",
  }
  return map[severity]
}

function statusBadge(status: FindingStatus) {
  const map: Record<FindingStatus, string> = {
    Open: "bg-[var(--destructive)]/10 text-[var(--destructive)]",
    "In Progress": "bg-[var(--chart-1)]/15 text-[var(--chart-1)]",
    Resolved: "bg-[var(--chart-2)]/15 text-[var(--chart-2)]",
    Closed: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  }
  return map[status]
}

// --- KPI Card ---

function KpiCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
      <div className={`p-2 rounded-[var(--radius-sm)] ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[length:var(--text-xl)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)] leading-tight">{value}</p>
        <p className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] leading-tight">{label}</p>
      </div>
    </div>
  )
}

// --- Main Component ---

export function IMDSInspectionFindings() {
  const sidebar = useSidebar()
  useEffect(() => {
    sidebar?.setSubPageTitle("Findings")
  }, [])

  const [findings, setFindings] = React.useState<Finding[]>(mockFindings)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [severityFilter, setSeverityFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [assetTypeFilter, setAssetTypeFilter] = React.useState<string>("all")
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [itemToDelete, setItemToDelete] = React.useState<Finding | null>(null)
  const [detailFinding, setDetailFinding] = React.useState<Finding | null>(null)

  const filtered = React.useMemo(() => {
    return findings.filter(f => {
      if (severityFilter !== "all" && f.severity !== severityFilter) return false
      if (statusFilter !== "all" && f.status !== statusFilter) return false
      if (assetTypeFilter !== "all" && f.assetType !== assetTypeFilter) return false
      return true
    })
  }, [findings, severityFilter, statusFilter, assetTypeFilter])

  const kpis = React.useMemo(() => ({
    total: findings.length,
    open: findings.filter(f => f.status === "Open").length,
    inProgress: findings.filter(f => f.status === "In Progress").length,
    critical: findings.filter(f => f.severity === "Critical").length,
    resolved: findings.filter(f => f.status === "Resolved" || f.status === "Closed").length,
  }), [findings])

  const columns: ColumnDef<Finding>[] = React.useMemo(() => [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Finding ID <ArrowUpDown strokeWidth={1.5} className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-[var(--font-weight-medium)] text-[var(--foreground)] text-[length:var(--text-sm)]">
          {row.getValue("id")}
        </span>
      ),
    },
    {
      accessorKey: "assetId",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Asset ID <ArrowUpDown strokeWidth={1.5} className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-[var(--font-weight-medium)] text-[var(--foreground)] text-[length:var(--text-sm)]">
          {row.getValue("assetId")}
        </span>
      ),
    },
    {
      accessorKey: "assetType",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Asset Type <ArrowUpDown strokeWidth={1.5} className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-[var(--foreground)] text-[length:var(--text-sm)]">{row.getValue("assetType")}</span>
      ),
    },
    {
      accessorKey: "component",
      header: () => (
        <span className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">Component</span>
      ),
      cell: ({ row }) => (
        <span className="text-[var(--foreground)] text-[length:var(--text-sm)]">{row.getValue("component")}</span>
      ),
    },
    {
      accessorKey: "finding",
      header: () => (
        <span className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">Finding</span>
      ),
      cell: ({ row }) => (
        <span className="text-[var(--foreground)] text-[length:var(--text-sm)] line-clamp-2 max-w-[260px]">{row.getValue("finding")}</span>
      ),
    },
    {
      accessorKey: "severity",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Severity <ArrowUpDown strokeWidth={1.5} className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.getValue("severity") as Severity
        return (
          <Badge variant="outline" className={`${severityBadge(s)} border-0 shadow-none text-[length:var(--text-xs)]`}>
            {s}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status <ArrowUpDown strokeWidth={1.5} className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.getValue("status") as FindingStatus
        return (
          <Badge variant="outline" className={`${statusBadge(s)} border-0 shadow-none text-[length:var(--text-xs)]`}>
            {s}
          </Badge>
        )
      },
    },
    {
      accessorKey: "dateFound",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date Found <ArrowUpDown strokeWidth={1.5} className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-[var(--foreground)] text-[length:var(--text-sm)]">{row.getValue("dateFound")}</span>
      ),
    },
    {
      accessorKey: "inspector",
      header: () => (
        <span className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">Inspector</span>
      ),
      cell: ({ row }) => (
        <span className="text-[var(--foreground)] text-[length:var(--text-sm)]">{row.getValue("inspector")}</span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" className="h-8 w-8 p-0 hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors" style={{ borderRadius: "var(--radius)" }}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal strokeWidth={1.5} className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--popover)] border-[var(--border)] shadow-none">
            <DropdownMenuItem onClick={() => setDetailFinding(row.original)} className="focus:bg-[var(--accent)]">
              <Eye strokeWidth={1.5} className="mr-2 h-4 w-4 text-[var(--muted-foreground)]" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info(`Editing ${row.original.id}`)} className="focus:bg-[var(--accent)]">
              <Pencil strokeWidth={1.5} className="mr-2 h-4 w-4 text-[var(--muted-foreground)]" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[var(--border)]" />
            <DropdownMenuItem className="text-[var(--destructive)] focus:text-[var(--destructive)] focus:bg-[var(--destructive)]/10"
              onClick={() => setItemToDelete(row.original)}>
              <Trash2 strokeWidth={1.5} className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [])

  const table = useReactTable({
    data: filtered,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: { sorting, globalFilter, pagination },
  })

  return (
    <div className="h-full flex flex-col gap-5 p-6 bg-[var(--background)]">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard icon={ClipboardList} label="Total Findings" value={kpis.total} color="bg-[var(--muted)] text-[var(--foreground)]" />
        <KpiCard icon={XCircle} label="Open" value={kpis.open} color="bg-[var(--destructive)]/15 text-[var(--destructive)]" />
        <KpiCard icon={Clock} label="In Progress" value={kpis.inProgress} color="bg-[var(--chart-1)]/15 text-[var(--chart-1)]" />
        <KpiCard icon={AlertTriangle} label="Critical" value={kpis.critical} color="bg-orange-500/15 text-orange-500" />
        <KpiCard icon={CheckCircle2} label="Resolved / Closed" value={kpis.resolved} color="bg-[var(--chart-2)]/15 text-[var(--chart-2)]" />
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col min-h-0">
        <DashboardTable
          table={table}
          totalColumns={columns.length}
          onRowClick={(row) => setDetailFinding(row.original)}
          toolbar={
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
              <div className="relative w-full sm:w-[280px]">
                <Search strokeWidth={1.5} className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                <Input
                  placeholder="Search findings..."
                  value={globalFilter ?? ""}
                  onChange={e => setGlobalFilter(e.target.value)}
                  className="pl-9 h-9 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="h-9 w-[140px] border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[140px] border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                <SelectTrigger className="h-9 w-[160px] border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                  <SelectItem value="all">All Asset Types</SelectItem>
                  <SelectItem value="Forklift">Forklift</SelectItem>
                  <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                  <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                  <SelectItem value="Order Picker">Order Picker</SelectItem>
                  <SelectItem value="Counterbalance">Counterbalance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
          emptyState={
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-[var(--muted)]/50 p-4 mb-4">
                <Search strokeWidth={1.5} className="h-8 w-8 text-[var(--muted-foreground)]" />
              </div>
              <h3 className="text-[length:var(--text-lg)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)] mb-1">No findings found</h3>
              <p className="text-[length:var(--text-sm)] text-[var(--muted-foreground)]">Try adjusting your filters.</p>
            </div>
          }
        />
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!detailFinding} onOpenChange={open => !open && setDetailFinding(null)}>
        <SheetContent className="w-[420px] sm:w-[480px] bg-[var(--card)] border-[var(--border)]">
          {detailFinding && (
            <>
              <SheetHeader className="pb-4 border-b border-[var(--border)]">
                <SheetTitle className="text-[var(--foreground)]">{detailFinding.id}</SheetTitle>
                <SheetDescription className="text-[var(--muted-foreground)]">
                  {detailFinding.assetId} · {detailFinding.assetType}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className={`${severityBadge(detailFinding.severity)} border-0 shadow-none`}>
                    {detailFinding.severity}
                  </Badge>
                  <Badge variant="outline" className={`${statusBadge(detailFinding.status)} border-0 shadow-none`}>
                    {detailFinding.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[length:var(--text-sm)]">
                  <div>
                    <p className="text-[var(--muted-foreground)] text-[length:var(--text-xs)] uppercase font-[var(--font-weight-semi-bold)]">Component</p>
                    <p className="text-[var(--foreground)] mt-0.5">{detailFinding.component}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-foreground)] text-[length:var(--text-xs)] uppercase font-[var(--font-weight-semi-bold)]">Date Found</p>
                    <p className="text-[var(--foreground)] mt-0.5">{detailFinding.dateFound}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-foreground)] text-[length:var(--text-xs)] uppercase font-[var(--font-weight-semi-bold)]">Inspector</p>
                    <p className="text-[var(--foreground)] mt-0.5">{detailFinding.inspector}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-foreground)] text-[length:var(--text-xs)] uppercase font-[var(--font-weight-semi-bold)]">Asset Type</p>
                    <p className="text-[var(--foreground)] mt-0.5">{detailFinding.assetType}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[var(--muted-foreground)] text-[length:var(--text-xs)] uppercase font-[var(--font-weight-semi-bold)] mb-1">Finding Description</p>
                  <p className="text-[var(--foreground)] text-[length:var(--text-sm)] leading-relaxed">{detailFinding.finding}</p>
                </div>

                {detailFinding.notes && (
                  <div>
                    <p className="text-[var(--muted-foreground)] text-[length:var(--text-xs)] uppercase font-[var(--font-weight-semi-bold)] mb-1">Notes</p>
                    <p className="text-[var(--foreground)] text-[length:var(--text-sm)] leading-relaxed">{detailFinding.notes}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-[var(--border)] flex gap-2">
                  <Button
                    type="button"
                    className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 shadow-none h-9"
                    onClick={() => { toast.info(`Editing ${detailFinding.id}`); setDetailFinding(null) }}
                  >
                    <Pencil strokeWidth={1.5} className="mr-2 h-4 w-4" /> Edit Finding
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none h-9"
                    onClick={() => setDetailFinding(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!itemToDelete} onOpenChange={open => !open && setItemToDelete(null)}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)] shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--foreground)]">Delete Finding?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted-foreground)]">
              This will permanently delete{" "}
              <span className="font-[var(--font-weight-medium)] text-[var(--foreground)]">{itemToDelete?.id}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  setFindings(prev => prev.filter(f => f.id !== itemToDelete.id))
                  toast.success(`${itemToDelete.id} deleted`)
                  setItemToDelete(null)
                }
              }}
              className="bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]/90 shadow-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
