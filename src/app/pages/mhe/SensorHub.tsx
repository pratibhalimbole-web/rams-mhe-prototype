import * as React from "react"
import { useEffect } from "react"
import {
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Link2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  Check,
} from "lucide-react"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Checkbox } from "../../components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { toast } from "sonner"

// ─── Types ───────────────────────────────────────────────────────────────────

type SensorStatus = "Assigned" | "Pending"

interface MheSensorRow {
  id: string
  mheId: string
  mheName: string
  sensors: string[]
  status: SensorStatus
  installationDate: string
}

const SENSOR_TYPES = [
  "Other", "Speed", "Reverse Assist", "RFID Reader", "Rasberry Pi", "Router",
  "Temperature", "Vibration", "Humidity", "Proximity", "Impact", "Pressure",
  "AI-CAS", "Fork Camera", "Carriage Camera", "Operator Camera", "Lidar",
  "360 Camera", "Jetson Nano", "Load Cell",
]

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_ROWS: MheSensorRow[] = [
  { id: "r0",  mheId: "KTTHCL4WO5X9HLO", mheName: "Test No Warranty Field", sensors: [],                  status: "Pending",  installationDate: "" },
  { id: "r1",  mheId: "9QGSSML13VDD4IU", mheName: "MHE 09",                 sensors: ["Reverse Assist"],   status: "Assigned", installationDate: "08/25/2026, 05:30" },
  { id: "r2",  mheId: "IICM7QXZ7HHXIXT", mheName: "MHE 10",                 sensors: [],                  status: "Pending",  installationDate: "" },
  { id: "r3",  mheId: "LQIYUA09VVK6GJ7", mheName: "MHE 08",                 sensors: [],                  status: "Pending",  installationDate: "" },
  { id: "r4",  mheId: "2T8L8UKCESTDF99", mheName: "MHE 07",                 sensors: [],                  status: "Pending",  installationDate: "" },
  { id: "r5",  mheId: "U5GW3B1XCQESNHL", mheName: "MHE 06",                 sensors: [],                  status: "Pending",  installationDate: "" },
  { id: "r6",  mheId: "OE2BQ63OX8TSGTT", mheName: "MHE 05",                 sensors: [],                  status: "Pending",  installationDate: "" },
  { id: "r7",  mheId: "9AAIEIY84GNJUMN", mheName: "MHE 04",                 sensors: [],                  status: "Pending",  installationDate: "" },
  { id: "r8",  mheId: "Z89H1I7IO9G84ZH", mheName: "MHE 03",                 sensors: ["Speed"],            status: "Assigned", installationDate: "07/24/2026, 05:30" },
  { id: "r9",  mheId: "MUAQET9EOCA4SZF", mheName: "MHE 02",                 sensors: [],                  status: "Pending",  installationDate: "" },
  { id: "r10", mheId: "9YQPLM2XVCTR55A", mheName: "MHE 01",                 sensors: [],                  status: "Pending",  installationDate: "" },
]

// ─── Badges ──────────────────────────────────────────────────────────────────

function SensorPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
      {label}
    </span>
  )
}

function StatusBadge({ status }: { status: SensorStatus }) {
  const styles: Record<SensorStatus, string> = {
    Assigned: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Pending: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  )
}

// ─── Sensor Type multi-select filter ────────────────────────────────────────

function SensorTypeFilter({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const filtered = SENSOR_TYPES.filter(t => t.toLowerCase().includes(search.toLowerCase()))

  function toggle(t: string) {
    onChange(selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t])
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(v => !v)}
        className="h-9 justify-between gap-2 border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)] min-w-[150px]"
      >
        {selected.length ? `${selected.length} selected` : "Sensor Type"}
        <ChevronDown className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
      </Button>
      {open && (
        <div className="absolute right-0 mt-1 w-[260px] rounded-[var(--radius)] border border-[var(--border)] bg-[var(--popover)] shadow-lg z-50 overflow-hidden">
          <div className="relative p-2 border-b border-[var(--border)]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
            <Input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 pl-8 border-[var(--border)] bg-[var(--background)] shadow-none text-[13px]"
            />
          </div>
          <div className="max-h-[260px] overflow-y-auto py-1">
            {filtered.map(t => (
              <label key={t} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--muted)]/40 text-[13px]">
                <Checkbox checked={selected.includes(t)} onCheckedChange={() => toggle(t)} />
                {t}
              </label>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-[12px] text-center" style={{ color: "var(--muted-foreground)" }}>No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatusFilter({ value, onChange }: { value: SensorStatus | "All"; onChange: (v: SensorStatus | "All") => void }) {
  const options: (SensorStatus | "All")[] = ["All", "Assigned", "Pending"]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 justify-between gap-2 border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)] min-w-[130px]"
        >
          {value === "All" ? "All Status" : value}
          <ChevronDown className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map(o => (
          <DropdownMenuItem key={o} onClick={() => onChange(o)} className="justify-between">
            {o === "All" ? "All Status" : o}
            {value === o && <Check className="w-3.5 h-3.5" strokeWidth={1.5} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Assign Sensor Sheet ──────────────────────────────────────────────────────

function AssignSensorSheet({
  row, open, onClose, onSave,
}: {
  row: MheSensorRow | null; open: boolean; onClose: () => void; onSave: (sensors: string[]) => void
}) {
  const [selected, setSelected] = React.useState<string[]>([])
  const [search, setSearch] = React.useState("")

  useEffect(() => { if (open && row) { setSelected(row.sensors); setSearch("") } }, [open, row])

  const filtered = SENSOR_TYPES.filter(t => t.toLowerCase().includes(search.toLowerCase()))

  function toggle(t: string) {
    setSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-[420px] sm:max-w-[420px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0">
        <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
          <SheetTitle className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)]">Assign Sensors</SheetTitle>
        </SheetHeader>

        {row && (
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 min-h-0">
            <div className="flex items-center gap-3 p-3 rounded-[var(--radius)]" style={{ background: "var(--muted)" }}>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>{row.mheId}</span>
                <span className="text-[length:var(--text-sm)] font-semibold text-[var(--foreground)] truncate">{row.mheName}</span>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
              <Input
                placeholder="Search sensor types..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 pl-8 border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)]"
              />
            </div>

            <div className="flex flex-col rounded-[var(--radius)] border border-[var(--border)] max-h-[400px] overflow-y-auto">
              {filtered.map(t => (
                <label key={t} className="flex items-center gap-3 px-3 py-2.5 border-b border-[var(--border)] last:border-0 cursor-pointer hover:bg-[var(--muted)]/30">
                  <Checkbox checked={selected.includes(t)} onCheckedChange={() => toggle(t)} />
                  <span className="text-[13px] text-[var(--foreground)]">{t}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)] shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="border-[var(--border)] bg-transparent shadow-none">Cancel</Button>
          <Button type="button" onClick={() => onSave(selected)} className="bg-blue-600 hover:bg-blue-500 text-white shadow-none">Save</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function SensorHub() {
  const sidebar = useSidebar()
  useEffect(() => { sidebar?.setSubPageTitle("Sensor Hub") }, [])

  const [rows, setRows] = React.useState<MheSensorRow[]>(MOCK_ROWS)
  const [search, setSearch] = React.useState("")
  const [sensorTypeFilter, setSensorTypeFilter] = React.useState<string[]>([])
  const [statusFilter, setStatusFilter] = React.useState<SensorStatus | "All">("All")
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [activeRow, setActiveRow] = React.useState<MheSensorRow | null>(null)

  const filtered = rows.filter(r => {
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || r.mheId.toLowerCase().includes(q) || r.mheName.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "All" || r.status === statusFilter
    const matchesSensorType = sensorTypeFilter.length === 0 || r.sensors.some(s => sensorTypeFilter.includes(s))
    return matchesSearch && matchesStatus && matchesSensorType
  })

  const totalRows = filtered.length
  const pagedRows = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  function handleAssign(row: MheSensorRow) { setActiveRow(row); setSheetOpen(true) }

  function handleSave(sensors: string[]) {
    if (!activeRow) return
    setRows(prev => prev.map(r => r.id === activeRow.id ? {
      ...r,
      sensors,
      status: sensors.length ? "Assigned" : "Pending",
      installationDate: sensors.length ? (r.installationDate || new Date().toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", ",")) : "",
    } : r))
    toast.success("Sensors updated")
    setSheetOpen(false)
    setActiveRow(null)
  }

  function handleUnassign(row: MheSensorRow) {
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, sensors: [], status: "Pending", installationDate: "" } : r))
    toast.success("Sensors removed")
  }

  return (
    <div className="h-full flex flex-col bg-[var(--background)] p-6 gap-4">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
          <Input
            placeholder="Search issues..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPageIndex(0) }}
            className="h-9 pl-9 border-[var(--border)] bg-[var(--card)] shadow-none text-[length:var(--text-sm)]"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SensorTypeFilter selected={sensorTypeFilter} onChange={v => { setSensorTypeFilter(v); setPageIndex(0) }} />
          <StatusFilter value={statusFilter} onChange={v => { setStatusFilter(v); setPageIndex(0) }} />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">MHE ID</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">MHE Name</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Sensors Assigned</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Status</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Installation Date</TableHead>
                <TableHead className="px-5 h-10 w-[70px] text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedRows.length > 0 ? pagedRows.map(r => (
                <TableRow key={r.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20">
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">{r.mheId}</TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{r.mheName}</TableCell>
                  <TableCell className="px-5 py-3">
                    {r.sensors.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {r.sensors.map(s => <SensorPill key={s} label={s} />)}
                      </div>
                    ) : (
                      <span className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>-</span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-3"><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{r.installationDate || "-"}</TableCell>
                  <TableCell className="px-5 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                          <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAssign(r)}>
                          <Link2 className="mr-2 h-4 w-4" strokeWidth={1.5} /> Assign Sensors
                        </DropdownMenuItem>
                        {r.sensors.length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleUnassign(r)}>
                              <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} /> Remove Sensors
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <p className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">No results found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-3 px-4 py-3.5 border-t border-[var(--border)] bg-[var(--card)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[11px] text-[var(--muted-foreground)]">Rows per page:</span>
            <Select value={`${pageSize}`} onValueChange={v => { setPageSize(Number(v)); setPageIndex(0) }}>
              <SelectTrigger className="h-8 w-[64px] border-[var(--border)] bg-[var(--muted)] shadow-none text-[11px] px-2 rounded-[var(--radius-sm)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50].map(s => <SelectItem key={s} value={`${s}`} className="text-[length:var(--text-sm)]">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <span className="text-[11px] text-[var(--muted-foreground)]">
            {firstRow === 0 ? "0" : `${firstRow} - ${lastRow}`} of {totalRows}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" className="h-8 w-8 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30"
              onClick={() => setPageIndex(i => Math.max(0, i - 1))} disabled={pageIndex === 0}>
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Button>
            <Button variant="ghost" className="h-8 w-8 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30"
              onClick={() => setPageIndex(i => Math.min(totalPages - 1, i + 1))} disabled={pageIndex >= totalPages - 1}>
              <ChevronRightIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>

      <AssignSensorSheet row={activeRow} open={sheetOpen} onClose={() => { setSheetOpen(false); setActiveRow(null) }} onSave={handleSave} />
    </div>
  )
}
