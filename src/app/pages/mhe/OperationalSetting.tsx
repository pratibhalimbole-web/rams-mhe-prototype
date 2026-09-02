import * as React from "react"
import { useEffect } from "react"
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Minus,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Clock,
  Calendar as CalendarIcon,
  Tag,
  MapPin,
  Gauge,
  Package,
  ShieldAlert,
  Truck,
} from "lucide-react"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { toast } from "sonner"

// ─── Shared types ────────────────────────────────────────────────────────────

type TabId = "sessions" | "break" | "zones" | "mhe"
type Severity = "High" | "Medium" | "Low"

interface Session {
  id: string
  name: string
  startTime: string
  endTime: string
}

interface SpeedZone {
  id: string
  name: string
  emptyMin: number
  emptyMax: number
  loadedMin: number
  loadedMax: number
  severity: Severity
}

interface MheSpeedConfig {
  id: string
  name: string
  emptyMin: number | null
  emptyMax: number | null
  loadedMin: number | null
  loadedMax: number | null
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_SESSIONS: Session[] = [
  { id: "s1", name: "Night session",     startTime: "22:00", endTime: "06:00" },
  { id: "s2", name: "Afternoon session", startTime: "14:00", endTime: "20:00" },
  { id: "s3", name: "Morning session",   startTime: "06:00", endTime: "14:00" },
]

const MOCK_ZONES: SpeedZone[] = [
  { id: "z1",  name: "20 MHE 10 -15 HPT",     emptyMin: 7, emptyMax: 10, loadedMin: 5, loadedMax: 7,  severity: "Medium" },
  { id: "z2",  name: "EQUIPMENT DEMO CENTER", emptyMin: 5, emptyMax: 8,  loadedMin: 3, loadedMax: 7,  severity: "High" },
  { id: "z3",  name: "Floor 19674 sq. ft.",   emptyMin: 4, emptyMax: 8,  loadedMin: 3, loadedMax: 7,  severity: "Medium" },
  { id: "z4",  name: "mhe charging",          emptyMin: 4, emptyMax: 6,  loadedMin: 7, loadedMax: 8,  severity: "High" },
  { id: "z5",  name: "OC ADDITIONAL",         emptyMin: 6, emptyMax: 10, loadedMin: 2, loadedMax: 10, severity: "High" },
  { id: "z6",  name: "REWORK AREA",           emptyMin: 5, emptyMax: 8,  loadedMin: 4, loadedMax: 8,  severity: "Medium" },
  { id: "z7",  name: "Spares 3500 sq. ft.",   emptyMin: 9, emptyMax: 15, loadedMin: 4, loadedMax: 8,  severity: "High" },
  { id: "z8",  name: "Spares Office",         emptyMin: 4, emptyMax: 9,  loadedMin: 4, loadedMax: 6,  severity: "Low" },
  { id: "z9",  name: "Staging",               emptyMin: 3, emptyMax: 6,  loadedMin: 3, loadedMax: 4,  severity: "Low" },
  { id: "z10", name: "Staging 4150 sq. ft.",  emptyMin: 5, emptyMax: 10, loadedMin: 1, loadedMax: 5,  severity: "Medium" },
  { id: "z11", name: "Dock Area",             emptyMin: 4, emptyMax: 7,  loadedMin: 3, loadedMax: 5,  severity: "Low" },
  { id: "z12", name: "Assembly Line",         emptyMin: 5, emptyMax: 9,  loadedMin: 3, loadedMax: 6,  severity: "Medium" },
  { id: "z13", name: "Parking Bay",           emptyMin: 4, emptyMax: 8,  loadedMin: 3, loadedMax: 5,  severity: "Low" },
  { id: "z14", name: "Corridor B",            emptyMin: 5, emptyMax: 8,  loadedMin: 3, loadedMax: 6,  severity: "High" },
]

const MOCK_MHE_SPEEDS: MheSpeedConfig[] = [
  { id: "m1",  name: "MHE 01", emptyMin: 4,    emptyMax: 15,  loadedMin: 3,    loadedMax: 12 },
  { id: "m2",  name: "MHE 02", emptyMin: 4,    emptyMax: 15,  loadedMin: 2,    loadedMax: 10 },
  { id: "m3",  name: "MHE 03", emptyMin: 1,    emptyMax: 1.5, loadedMin: 1,    loadedMax: 1.5 },
  { id: "m4",  name: "MHE 04", emptyMin: 3,    emptyMax: 11,  loadedMin: 2,    loadedMax: 9 },
  { id: "m5",  name: "MHE 05", emptyMin: 2,    emptyMax: 9,   loadedMin: 1,    loadedMax: 7 },
  { id: "m6",  name: "MHE 06", emptyMin: 3,    emptyMax: 5,   loadedMin: 4,    loadedMax: 8 },
  { id: "m7",  name: "MHE 07", emptyMin: null, emptyMax: null,loadedMin: null, loadedMax: null },
  { id: "m8",  name: "MHE 08", emptyMin: 5,    emptyMax: 8,   loadedMin: 6,    loadedMax: 8 },
  { id: "m9",  name: "MHE 09", emptyMin: null, emptyMax: null,loadedMin: null, loadedMax: null },
  { id: "m10", name: "MHE 10", emptyMin: null, emptyMax: null,loadedMin: null, loadedMax: null },
  { id: "m11", name: "Test No Warranty Field", emptyMin: null, emptyMax: null, loadedMin: null, loadedMax: null },
]

// ─── Shared UI helpers ───────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  )
}

function SectionCard({ icon: Icon, title, hint, children }: { icon: React.ElementType; title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-[var(--radius)] border border-[var(--border)]">
      <div className="flex items-start gap-2.5">
        <Icon className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
        <div className="flex flex-col">
          <span className="text-[length:var(--text-sm)] font-semibold text-[var(--foreground)]">{title}</span>
          <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{hint}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, { bg: string; dot: string; text: string }> = {
    High:   { bg: "bg-red-500/10",    dot: "bg-red-500",    text: "text-red-600 dark:text-red-400" },
    Medium: { bg: "bg-amber-500/10",  dot: "bg-amber-500",  text: "text-amber-600 dark:text-amber-400" },
    Low:    { bg: "bg-emerald-500/10",dot: "bg-emerald-500",text: "text-emerald-600 dark:text-emerald-400" },
  }
  const s = styles[severity]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {severity}
    </span>
  )
}

function Stepper({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 border-[var(--border)] bg-[var(--background)] shadow-none"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value) || 0)}
        className="h-9 w-24 text-center border-[var(--border)] bg-[var(--background)] shadow-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 border-[var(--border)] bg-[var(--background)] shadow-none"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
      </Button>
    </div>
  )
}

function TableSearchToolbar({ search, onSearch, action }: { search: string; onSearch: (v: string) => void; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
        <Input
          placeholder="Search..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="h-9 pl-9 border-[var(--border)] bg-[var(--card)] shadow-none text-[length:var(--text-sm)]"
        />
      </div>
      {action}
    </div>
  )
}

function TablePagination({
  pageSize, setPageSize, pageIndex, setPageIndex, totalRows,
}: {
  pageSize: number; setPageSize: (n: number) => void
  pageIndex: number; setPageIndex: (fn: (i: number) => number) => void
  totalRows: number
}) {
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  return (
    <div className="flex items-center justify-end gap-3 px-4 py-3.5 border-t border-[var(--border)] bg-[var(--card)] shrink-0">
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap text-[11px] text-[var(--muted-foreground)]">Rows per page:</span>
        <Select value={`${pageSize}`} onValueChange={v => { setPageSize(Number(v)); setPageIndex(() => 0) }}>
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
  )
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: "sessions", label: "Session Management" },
  { id: "break", label: "Break & Fatigue" },
  { id: "zones", label: "Speed & Zones" },
  { id: "mhe", label: "MHE Specific" },
]

function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div className="flex items-center gap-6 border-b border-[var(--border)]">
      {TABS.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className="relative pb-2.5 text-[length:var(--text-sm)] font-medium transition-colors"
          style={{ color: active === t.id ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          {t.label}
          {active === t.id && (
            <span className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full" style={{ background: "var(--primary)" }} />
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Session Management ──────────────────────────────────────────────────────

interface SessionForm {
  name: string
  startTime: string
  endTime: string
}

function SessionFormSheet({
  open, onClose, onSave, initial,
}: {
  open: boolean; onClose: () => void; onSave: (f: SessionForm) => void; initial?: SessionForm
}) {
  const [form, setForm] = React.useState<SessionForm>({ name: "", startTime: "", endTime: "" })
  useEffect(() => { if (open) setForm(initial ?? { name: "", startTime: "", endTime: "" }) }, [open, initial])

  const canSave = form.name.trim() && form.startTime.trim() && form.endTime.trim()

  function handleSave() {
    if (!canSave) { toast.error("Please fill all required fields"); return }
    onSave(form)
  }

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0">
        <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
          <SheetTitle className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)]">
            {initial ? "Edit Session" : "Add Session"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          <SectionCard icon={Tag} title="Session Name" hint="A short label to identify this shift">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Name</FieldLabel>
              <Input
                placeholder="e.g. Night session"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
              />
            </div>
          </SectionCard>

          <SectionCard icon={CalendarIcon} title="Time Range" hint="24-hour format (HH:MM). Overnight shifts supported.">
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <FieldLabel required>Start Time</FieldLabel>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
                  <Input
                    placeholder="22:00"
                    value={form.startTime}
                    onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                    className="h-9 pl-8 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <FieldLabel required>End Time</FieldLabel>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
                  <Input
                    placeholder="06:00"
                    value={form.endTime}
                    onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                    className="h-9 pl-8 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)] shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="border-[var(--border)] bg-transparent shadow-none">Cancel</Button>
          <Button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white shadow-none">
            {initial ? "Update Session" : "Add Session"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SessionManagementTab() {
  const [sessions, setSessions] = React.useState<Session[]>(MOCK_SESSIONS)
  const [search, setSearch] = React.useState("")
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Session | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Session | null>(null)

  const filtered = sessions.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
  const pagedRows = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  function handleAdd() { setEditing(null); setSheetOpen(true) }
  function handleEdit(s: Session) { setEditing(s); setSheetOpen(true) }
  function handleSave(form: SessionForm) {
    if (editing) {
      setSessions(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s))
      toast.success("Session updated")
    } else {
      setSessions(prev => [...prev, { id: `s${Date.now()}`, ...form }])
      toast.success("Session added")
    }
    setSheetOpen(false)
    setEditing(null)
  }
  function handleDelete() {
    if (!deleteTarget) return
    setSessions(prev => prev.filter(s => s.id !== deleteTarget.id))
    toast.success("Session deleted")
    setDeleteTarget(null)
  }

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      <TableSearchToolbar
        search={search}
        onSearch={v => { setSearch(v); setPageIndex(0) }}
        action={
          <Button onClick={handleAdd} className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-none shrink-0">
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Add Session
          </Button>
        }
      />

      <div className="flex-1 flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Session Name</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Start Time</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">End Time</TableHead>
                <TableHead className="px-5 h-10 w-[70px] text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedRows.length > 0 ? pagedRows.map(s => (
                <TableRow key={s.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20">
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">{s.name}</TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{s.startTime}</TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{s.endTime}</TableCell>
                  <TableCell className="px-5 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                          <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(s)}>
                          <Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(s)}>
                          <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <p className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">No sessions found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination pageSize={pageSize} setPageSize={setPageSize} pageIndex={pageIndex} setPageIndex={setPageIndex} totalRows={filtered.length} />
      </div>

      <SessionFormSheet
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setEditing(null) }}
        onSave={handleSave}
        initial={editing ? { name: editing.name, startTime: editing.startTime, endTime: editing.endTime } : undefined}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Break & Fatigue ─────────────────────────────────────────────────────────

function BreakFatigueTab() {
  const SAVED_DEFAULTS = { breakDuration: 60, maxDrivingTime: 120 }
  const [saved, setSaved] = React.useState(SAVED_DEFAULTS)
  const [breakDuration, setBreakDuration] = React.useState(saved.breakDuration)
  const [maxDrivingTime, setMaxDrivingTime] = React.useState(saved.maxDrivingTime)
  const [discardOpen, setDiscardOpen] = React.useState(false)

  const dirty = breakDuration !== saved.breakDuration || maxDrivingTime !== saved.maxDrivingTime

  function handleSave() {
    setSaved({ breakDuration, maxDrivingTime })
    toast.success("Settings saved")
  }

  function handleDiscard() {
    setBreakDuration(saved.breakDuration)
    setMaxDrivingTime(saved.maxDrivingTime)
    setDiscardOpen(false)
    toast.success("Changes discarded")
  }

  return (
    <div className="flex-1 flex flex-col gap-6">
      <h2 className="text-[length:var(--text-lg)] font-semibold text-[var(--foreground)]">Break & Fatigue Management</h2>

      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <FieldLabel required>Break Duration (minutes)</FieldLabel>
          <Stepper value={breakDuration} onChange={setBreakDuration} min={0} />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Maximum Continuous Driving Time (minutes)</FieldLabel>
          <Stepper value={maxDrivingTime} onChange={setMaxDrivingTime} min={0} />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={!dirty}
            onClick={() => setDiscardOpen(true)}
            className="border-[var(--border)] bg-transparent shadow-none disabled:opacity-40"
          >
            Discard Changes
          </Button>
          <Button
            type="button"
            disabled={!dirty}
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-none disabled:opacity-40"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard your changes? All unsaved modifications will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscard} className="bg-destructive hover:bg-destructive/90 text-white">Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Speed & Zones ───────────────────────────────────────────────────────────

interface ZoneForm {
  emptyMin: string
  emptyMax: string
  loadedMin: string
  loadedMax: string
  severity: Severity
}

function ZoneFormSheet({
  zone, open, onClose, onSave,
}: {
  zone: SpeedZone | null; open: boolean; onClose: () => void; onSave: (f: ZoneForm) => void
}) {
  const [form, setForm] = React.useState<ZoneForm>({ emptyMin: "", emptyMax: "", loadedMin: "", loadedMax: "", severity: "Medium" })

  useEffect(() => {
    if (open && zone) {
      setForm({
        emptyMin: String(zone.emptyMin), emptyMax: String(zone.emptyMax),
        loadedMin: String(zone.loadedMin), loadedMax: String(zone.loadedMax),
        severity: zone.severity,
      })
    }
  }, [open, zone])

  function set<K extends keyof ZoneForm>(k: K, v: ZoneForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0">
        <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
          <SheetTitle className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)]">Edit Speed Zone</SheetTitle>
        </SheetHeader>

        {zone && (
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 rounded-[var(--radius)]" style={{ background: "var(--muted)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "color-mix(in srgb, var(--primary) 14%, transparent)" }}>
                <MapPin className="w-4 h-4" strokeWidth={1.5} style={{ color: "var(--primary)" }} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>Building Zone</span>
                <span className="text-[length:var(--text-sm)] font-semibold text-[var(--foreground)] truncate">{zone.name}</span>
              </div>
            </div>

            <SectionCard icon={Gauge} title="Empty MHE Speed" hint="Speed range for empty/unloaded MHE vehicles">
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>Min Speed (km/h)</FieldLabel>
                  <Input type="number" value={form.emptyMin} onChange={e => set("emptyMin", e.target.value)} className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>Max Speed (km/h)</FieldLabel>
                  <Input type="number" value={form.emptyMax} onChange={e => set("emptyMax", e.target.value)} className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none" />
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={Package} title="Loaded MHE Speed" hint="Speed range for loaded MHE vehicles">
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>Min Speed (km/h)</FieldLabel>
                  <Input type="number" value={form.loadedMin} onChange={e => set("loadedMin", e.target.value)} className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>Max Speed (km/h)</FieldLabel>
                  <Input type="number" value={form.loadedMax} onChange={e => set("loadedMax", e.target.value)} className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none" />
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={ShieldAlert} title="Zone Severity" hint="Risk level associated with this speed zone">
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Severity Level</FieldLabel>
                <Select value={form.severity} onValueChange={v => set("severity", v as Severity)}>
                  <SelectTrigger className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </SectionCard>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)] shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="border-[var(--border)] bg-transparent shadow-none">Cancel</Button>
          <Button type="button" onClick={() => onSave(form)} className="bg-blue-600 hover:bg-blue-500 text-white shadow-none">Update Speed Zone</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SpeedZonesTab() {
  const [zones, setZones] = React.useState<SpeedZone[]>(MOCK_ZONES)
  const [search, setSearch] = React.useState("")
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [activeZone, setActiveZone] = React.useState<SpeedZone | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<SpeedZone | null>(null)

  const filtered = zones.filter(z => z.name.toLowerCase().includes(search.toLowerCase()))
  const pagedRows = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  function handleEdit(z: SpeedZone) { setActiveZone(z); setSheetOpen(true) }
  function handleSave(form: ZoneForm) {
    if (!activeZone) return
    setZones(prev => prev.map(z => z.id === activeZone.id ? {
      ...z,
      emptyMin: Number(form.emptyMin), emptyMax: Number(form.emptyMax),
      loadedMin: Number(form.loadedMin), loadedMax: Number(form.loadedMax),
      severity: form.severity,
    } : z))
    toast.success("Speed zone updated")
    setSheetOpen(false)
    setActiveZone(null)
  }
  function handleDelete() {
    if (!deleteTarget) return
    setZones(prev => prev.filter(z => z.id !== deleteTarget.id))
    toast.success("Speed zone deleted")
    setDeleteTarget(null)
  }

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      <TableSearchToolbar search={search} onSearch={v => { setSearch(v); setPageIndex(0) }} />

      <div className="flex-1 flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Zone Name</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Empty Speed Range (km/h)</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Loaded Speed Range (km/h)</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Severity</TableHead>
                <TableHead className="px-5 h-10 w-[70px] text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedRows.length > 0 ? pagedRows.map(z => (
                <TableRow key={z.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20">
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">{z.name}</TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{z.emptyMin} - {z.emptyMax}</TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{z.loadedMin} - {z.loadedMax}</TableCell>
                  <TableCell className="px-5 py-3"><SeverityBadge severity={z.severity} /></TableCell>
                  <TableCell className="px-5 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                          <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(z)}>
                          <Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(z)}>
                          <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <p className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">No zones found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination pageSize={pageSize} setPageSize={setPageSize} pageIndex={pageIndex} setPageIndex={setPageIndex} totalRows={filtered.length} />
      </div>

      <ZoneFormSheet zone={activeZone} open={sheetOpen} onClose={() => { setSheetOpen(false); setActiveZone(null) }} onSave={handleSave} />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Speed Zone</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── MHE Specific ────────────────────────────────────────────────────────────

interface MheSpeedForm {
  emptyMin: string
  emptyMax: string
  loadedMin: string
  loadedMax: string
}

function MheSpeedFormSheet({
  mhe, open, onClose, onSave,
}: {
  mhe: MheSpeedConfig | null; open: boolean; onClose: () => void; onSave: (f: MheSpeedForm) => void
}) {
  const [form, setForm] = React.useState<MheSpeedForm>({ emptyMin: "", emptyMax: "", loadedMin: "", loadedMax: "" })

  useEffect(() => {
    if (open && mhe) {
      setForm({
        emptyMin: mhe.emptyMin != null ? String(mhe.emptyMin) : "",
        emptyMax: mhe.emptyMax != null ? String(mhe.emptyMax) : "",
        loadedMin: mhe.loadedMin != null ? String(mhe.loadedMin) : "",
        loadedMax: mhe.loadedMax != null ? String(mhe.loadedMax) : "",
      })
    }
  }, [open, mhe])

  function set<K extends keyof MheSpeedForm>(k: K, v: MheSpeedForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0">
        <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
          <SheetTitle className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)]">Edit MHE Speed Configuration</SheetTitle>
        </SheetHeader>

        {mhe && (
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 rounded-[var(--radius)]" style={{ background: "var(--muted)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "color-mix(in srgb, var(--primary) 14%, transparent)" }}>
                <Truck className="w-4 h-4" strokeWidth={1.5} style={{ color: "var(--primary)" }} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>Material Handling Equipment</span>
                <span className="text-[length:var(--text-sm)] font-semibold text-[var(--foreground)] truncate">{mhe.name}</span>
              </div>
            </div>

            <SectionCard icon={Gauge} title="Empty MHE Speed" hint="Speed range when the MHE is unloaded">
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>Min Speed (km/h)</FieldLabel>
                  <Input type="number" value={form.emptyMin} onChange={e => set("emptyMin", e.target.value)} className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>Max Speed (km/h)</FieldLabel>
                  <Input type="number" value={form.emptyMax} onChange={e => set("emptyMax", e.target.value)} className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none" />
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={Package} title="Loaded MHE Speed" hint="Speed range when the MHE is carrying a load">
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>Min Speed (km/h)</FieldLabel>
                  <Input type="number" value={form.loadedMin} onChange={e => set("loadedMin", e.target.value)} className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>Max Speed (km/h)</FieldLabel>
                  <Input type="number" value={form.loadedMax} onChange={e => set("loadedMax", e.target.value)} className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none" />
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)] shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="border-[var(--border)] bg-transparent shadow-none">Cancel</Button>
          <Button type="button" onClick={() => onSave(form)} className="bg-blue-600 hover:bg-blue-500 text-white shadow-none">Update Configuration</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MheSpecificTab() {
  const [rows, setRows] = React.useState<MheSpeedConfig[]>(MOCK_MHE_SPEEDS)
  const [search, setSearch] = React.useState("")
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [activeMhe, setActiveMhe] = React.useState<MheSpeedConfig | null>(null)

  const filtered = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
  const pagedRows = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  function handleEdit(m: MheSpeedConfig) { setActiveMhe(m); setSheetOpen(true) }
  function handleSave(form: MheSpeedForm) {
    if (!activeMhe) return
    setRows(prev => prev.map(r => r.id === activeMhe.id ? {
      ...r,
      emptyMin: form.emptyMin === "" ? null : Number(form.emptyMin),
      emptyMax: form.emptyMax === "" ? null : Number(form.emptyMax),
      loadedMin: form.loadedMin === "" ? null : Number(form.loadedMin),
      loadedMax: form.loadedMax === "" ? null : Number(form.loadedMax),
    } : r))
    toast.success("Speed configuration updated")
    setSheetOpen(false)
    setActiveMhe(null)
  }

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      <TableSearchToolbar search={search} onSearch={v => { setSearch(v); setPageIndex(0) }} />

      <div className="flex-1 flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">MHE Name</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Min Speed (km/h)</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Max Speed (km/h)</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Loaded Min Speed (km/h)</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Loaded Max Speed (km/h)</TableHead>
                <TableHead className="px-5 h-10 w-[70px] text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedRows.length > 0 ? pagedRows.map(m => (
                <TableRow key={m.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20">
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">{m.name}</TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{m.emptyMin ?? "-"}</TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{m.emptyMax ?? "-"}</TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{m.loadedMin ?? "-"}</TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{m.loadedMax ?? "-"}</TableCell>
                  <TableCell className="px-5 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                          <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(m)}>
                          <Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} /> Edit Speed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <p className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">No MHE found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination pageSize={pageSize} setPageSize={setPageSize} pageIndex={pageIndex} setPageIndex={setPageIndex} totalRows={filtered.length} />
      </div>

      <MheSpeedFormSheet mhe={activeMhe} open={sheetOpen} onClose={() => { setSheetOpen(false); setActiveMhe(null) }} onSave={handleSave} />
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function OperationalSetting() {
  const sidebar = useSidebar()
  useEffect(() => { sidebar?.setSubPageTitle("Operational Setting") }, [])

  const [tab, setTab] = React.useState<TabId>("sessions")

  return (
    <div className="h-full flex flex-col bg-[var(--background)] p-6 gap-4">
      <TabBar active={tab} onChange={setTab} />

      {tab === "sessions" && <SessionManagementTab />}
      {tab === "break" && <BreakFatigueTab />}
      {tab === "zones" && <SpeedZonesTab />}
      {tab === "mhe" && <MheSpecificTab />}
    </div>
  )
}
