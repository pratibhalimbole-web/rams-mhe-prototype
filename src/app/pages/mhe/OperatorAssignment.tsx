import * as React from "react"
import { useEffect } from "react"
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  UserPlus,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Calendar as CalendarIcon,
  User,
  Briefcase,
  IdCard,
  Truck,
  ChevronDown,
} from "lucide-react"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { Calendar as CalendarPicker } from "../../components/ui/calendar"
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

// ─── Types ───────────────────────────────────────────────────────────────────

interface Operator {
  id: string
  firstName: string
  lastName: string
  email: string
  designation: string
  joiningDate: string
  licenseNumber: string
  licenseExpiry: string
  assignedMhe: string[]
}

interface OperatorForm {
  firstName: string
  lastName: string
  email: string
  designation: string
  joiningDate: Date | undefined
  licenseNumber: string
  licenseExpiry: Date | undefined
}

interface MheOption {
  id: string
  name: string
  type: string
  status: "Available" | "In Use"
}

const emptyForm = (): OperatorForm => ({
  firstName: "",
  lastName: "",
  email: "",
  designation: "",
  joiningDate: undefined,
  licenseNumber: "",
  licenseExpiry: undefined,
})

function operatorToForm(op: Operator): OperatorForm {
  return {
    firstName: op.firstName,
    lastName: op.lastName,
    email: op.email,
    designation: op.designation,
    joiningDate: op.joiningDate ? new Date(op.joiningDate) : undefined,
    licenseNumber: op.licenseNumber,
    licenseExpiry: op.licenseExpiry ? parseDMYToDate(op.licenseExpiry) : undefined,
  }
}

function parseDMYToDate(str: string): Date | undefined {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(str)
  if (!m) return undefined
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))
}

function formatDMY(d: Date | undefined): string {
  if (!d) return ""
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${dd}-${mm}-${d.getFullYear()}`
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MHE_OPTIONS: MheOption[] = [
  { id: "m0", name: "Test No Warranty Field", type: "forklift",            status: "Available" },
  { id: "m1", name: "MHE 09",                 type: "Order Picker",         status: "Available" },
  { id: "m2", name: "MHE 10",                 type: "forklift",             status: "Available" },
  { id: "m3", name: "MHE 08",                 type: "BOPT",                 status: "Available" },
  { id: "m4", name: "MHE 07",                 type: "forklift",             status: "Available" },
  { id: "m5", name: "MHE 06",                 type: "Electric Pallet Jack", status: "Available" },
  { id: "m6", name: "MHE 05",                 type: "BOPT",                 status: "Available" },
  { id: "m7", name: "MHE 04",                 type: "Order Picker",         status: "Available" },
  { id: "m8", name: "MHE 03",                 type: "Electric Pallet Jack", status: "Available" },
  { id: "m9", name: "MHE 02",                 type: "Reach Truck",          status: "Available" },
  { id: "m10", name: "MHE 01",                type: "forklift",             status: "Available" },
]

const MOCK_OPERATORS: Operator[] = [
  { id: "UM4ZX8T", firstName: "Anil",    lastName: "Chavan",  email: "anilchavan@gmail.com",    designation: "operator", joiningDate: "2026-05-18", licenseNumber: "MH-OL-312679", licenseExpiry: "29-06-2026", assignedMhe: [] },
  { id: "UB1NK5W", firstName: "Vishal",  lastName: "Sawant",  email: "vishalsawant@gmail.com",  designation: "operator", joiningDate: "2025-11-02", licenseNumber: "MH-OL-857304", licenseExpiry: "30-07-2026", assignedMhe: [] },
  { id: "UT2YC6J", firstName: "Sunil",   lastName: "Jadhav",  email: "suniljadhav@gmail.com",   designation: "operator", joiningDate: "2024-03-14", licenseNumber: "MH-OL-734851", licenseExpiry: "14-02-2028", assignedMhe: [] },
  { id: "UF7QL3R", firstName: "Deepak",  lastName: "Pawar",   email: "deepakpawar@gmail.com",   designation: "operator", joiningDate: "2023-08-21", licenseNumber: "MH-OL-489217", licenseExpiry: "28-06-2027", assignedMhe: [] },
  { id: "UP5GH8K", firstName: "Nilesh",  lastName: "Bhosale", email: "nileshbhosale@gmail.com", designation: "operator", joiningDate: "2025-01-09", licenseNumber: "MH-OL-648130", licenseExpiry: "22-08-2026", assignedMhe: [] },
  { id: "UD9VB4M", firstName: "Rajesh",  lastName: "Shinde",  email: "rajeshshinde@gmail.com",  designation: "operator", joiningDate: "2022-06-30", licenseNumber: "MH-OL-205893", licenseExpiry: "05-11-2027", assignedMhe: [] },
  { id: "U6LWN1F", firstName: "Ganesh",  lastName: "More",    email: "ganeshmore@gmail.com",    designation: "operator", joiningDate: "2024-09-17", licenseNumber: "MH-OL-921547", licenseExpiry: "09-07-2028", assignedMhe: [] },
  { id: "UZ3RT9C", firstName: "Mahesh",  lastName: "Gaikwad", email: "maheshgaikwad@gmail.com", designation: "operator", joiningDate: "2023-12-05", licenseNumber: "MH-OL-376412", licenseExpiry: "18-04-2027", assignedMhe: [] },
  { id: "U8XKD2W", firstName: "Prakash", lastName: "Joshi",   email: "prakashjoshi@gmail.com",  designation: "operator", joiningDate: "2025-04-27", licenseNumber: "MH-OL-849263", licenseExpiry: "30-01-2028", assignedMhe: [] },
  { id: "UQ4MZ7P", firstName: "Sandeep", lastName: "Kulkarni",email: "sandeepkulkarni@gmail.com",designation: "operator", joiningDate: "2024-02-11", licenseNumber: "MH-OL-512378", licenseExpiry: "12-09-2027", assignedMhe: [] },
  { id: "UX1LM9V", firstName: "Ravi",    lastName: "Deshmukh",email: "ravideshmukh@gmail.com",  designation: "operator", joiningDate: "2023-07-19", licenseNumber: "MH-OL-671245", licenseExpiry: "03-03-2027", assignedMhe: [] },
  { id: "UY2NP0B", firstName: "Santosh", lastName: "Patil",   email: "santoshpatil@gmail.com",  designation: "operator", joiningDate: "2024-10-08", licenseNumber: "MH-OL-118342", licenseExpiry: "21-05-2026", assignedMhe: [] },
  { id: "UC3OQ1D", firstName: "Kiran",   lastName: "Kadam",   email: "kirankadam@gmail.com",    designation: "operator", joiningDate: "2025-02-25", licenseNumber: "MH-OL-902764", licenseExpiry: "16-12-2027", assignedMhe: [] },
  { id: "UE4PR2F", firstName: "Amol",    lastName: "Salunkhe",email: "amolsalunkhe@gmail.com",  designation: "operator", joiningDate: "2022-11-13", licenseNumber: "MH-OL-345981", licenseExpiry: "08-10-2026", assignedMhe: [] },
  { id: "UG5QS3H", firstName: "Vikas",   lastName: "Thorat",  email: "vikasthorat@gmail.com",   designation: "operator", joiningDate: "2024-06-01", licenseNumber: "MH-OL-560129", licenseExpiry: "27-02-2028", assignedMhe: [] },
]

// license expiring within ~1 year of "today" is flagged red in this dataset (all 2026 dates)
function isExpiringSoon(dmy: string): boolean {
  const d = parseDMYToDate(dmy)
  if (!d) return false
  return d.getFullYear() <= 2026
}

// ─── Small UI helpers ────────────────────────────────────────────────────────

function initialsOf(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase()
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  )
}

function DatePickerField({
  value,
  onChange,
  placeholder = "Pick a date",
}: {
  value: Date | undefined
  onChange: (d: Date | undefined) => void
  placeholder?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full h-9 justify-start font-normal gap-2 border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)]"
          style={{ color: value ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          <CalendarIcon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
          {value ? value.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarPicker mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

function SectionHeader({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
      <h3 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
        {children}
      </h3>
    </div>
  )
}

// ─── Edit Operator Sheet ─────────────────────────────────────────────────────

function EditOperatorSheet({
  operator,
  open,
  onClose,
  onSave,
}: {
  operator: Operator | null
  open: boolean
  onClose: () => void
  onSave: (form: OperatorForm) => void
}) {
  const [form, setForm] = React.useState<OperatorForm>(emptyForm())

  useEffect(() => {
    if (open && operator) setForm(operatorToForm(operator))
  }, [open, operator])

  function set<K extends keyof OperatorForm>(key: K, value: OperatorForm[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  const canSave = form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.designation.trim()

  function handleSave() {
    if (!canSave) {
      toast.error("Please fill all required fields")
      return
    }
    onSave(form)
  }

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0">
        <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
          <SheetTitle className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)]">
            Edit Operator
          </SheetTitle>
        </SheetHeader>

        {operator && (
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">

            {/* Identity */}
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-semibold text-[13px]"
                style={{ background: "color-mix(in srgb, var(--primary) 14%, transparent)", color: "var(--primary)" }}
              >
                {initialsOf(form.firstName || operator.firstName, form.lastName || operator.lastName)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)] truncate">
                  {form.firstName || operator.firstName} {form.lastName || operator.lastName}
                </span>
                <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>PIN: {operator.id}</span>
              </div>
            </div>

            {/* Personal Information */}
            <div className="flex flex-col gap-3">
              <SectionHeader icon={User}>Personal Information</SectionHeader>
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>First Name</FieldLabel>
                  <Input
                    value={form.firstName}
                    onChange={e => set("firstName", e.target.value)}
                    className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <FieldLabel required>Last Name</FieldLabel>
                  <Input
                    value={form.lastName}
                    onChange={e => set("lastName", e.target.value)}
                    className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Email</FieldLabel>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
                />
              </div>
            </div>

            {/* Employment */}
            <div className="flex flex-col gap-3 pt-1 border-t border-[var(--border)]">
              <div className="pt-4">
                <SectionHeader icon={Briefcase}>Employment</SectionHeader>
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Designation</FieldLabel>
                <Input
                  value={form.designation}
                  onChange={e => set("designation", e.target.value)}
                  className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Joining Date</FieldLabel>
                <DatePickerField value={form.joiningDate} onChange={d => set("joiningDate", d)} />
              </div>
            </div>

            {/* License Information */}
            <div className="flex flex-col gap-3 pt-1 border-t border-[var(--border)]">
              <div className="pt-4">
                <SectionHeader icon={IdCard}>License Information</SectionHeader>
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>License Number</FieldLabel>
                <Input
                  value={form.licenseNumber}
                  onChange={e => set("licenseNumber", e.target.value)}
                  className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>License Expiry Date</FieldLabel>
                <DatePickerField value={form.licenseExpiry} onChange={d => set("licenseExpiry", d)} />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)] shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="border-[var(--border)] bg-transparent shadow-none">
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white shadow-none">
            Update
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Assign MHE Sheet ────────────────────────────────────────────────────────

function AssignMheSheet({
  operator,
  open,
  onClose,
  onAssign,
}: {
  operator: Operator | null
  open: boolean
  onClose: () => void
  onAssign: (mheIds: string[]) => void
}) {
  const [search, setSearch] = React.useState("")
  const [selected, setSelected] = React.useState<string[]>([])

  useEffect(() => {
    if (open) { setSearch(""); setSelected(operator?.assignedMhe ?? []) }
  }, [open, operator])

  const filtered = MHE_OPTIONS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.type.toLowerCase().includes(search.toLowerCase())
  )

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0">
        <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
          <SheetTitle className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)]">
            Assign MHE to Operator
          </SheetTitle>
        </SheetHeader>

        {operator && (
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 min-h-0">

            {/* Identity */}
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-semibold text-[13px]"
                style={{ background: "var(--warning)", color: "white" }}
              >
                {initialsOf(operator.firstName, operator.lastName)}
              </div>
              <div className="flex flex-col min-w-0 gap-1">
                <span className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)] truncate">
                  {operator.firstName} {operator.lastName}
                </span>
                <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>ID: {operator.id}</span>
                <Badge variant="outline" className="w-fit text-[10px] font-medium">{operator.designation}</Badge>
              </div>
            </div>

            {/* Select MHE(s) */}
            <div className="flex flex-col gap-2">
              <FieldLabel>Select MHE(s)</FieldLabel>
              <Button
                type="button"
                variant="outline"
                className="w-full h-9 justify-between font-normal border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)]"
                style={{ color: selected.length ? "var(--foreground)" : "var(--muted-foreground)" }}
              >
                {selected.length ? `${selected.length} MHE(s) selected` : "Select MHE assets..."}
                <ChevronDown className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
                <Input
                  placeholder="Search MHE assets..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-9 pl-8 border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)]"
                />
              </div>

              <div className="flex flex-col rounded-[var(--radius)] border border-[var(--border)] max-h-[360px] overflow-y-auto">
                {filtered.map(m => (
                  <label
                    key={m.id}
                    className="flex items-center gap-3 px-3 py-2.5 border-b border-[var(--border)] last:border-0 cursor-pointer hover:bg-[var(--muted)]/30"
                  >
                    <Checkbox
                      checked={selected.includes(m.id)}
                      onCheckedChange={() => toggle(m.id)}
                    />
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "var(--muted)" }}
                    >
                      <Truck className="w-4 h-4" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[13px] font-medium text-[var(--foreground)] truncate">{m.name}</span>
                      <span className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>{m.type}</span>
                    </div>
                    <Badge variant="outline" className="border-transparent font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      {m.status}
                    </Badge>
                  </label>
                ))}
                {filtered.length === 0 && (
                  <div className="py-8 text-center text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                    No MHE assets found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)] shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="border-[var(--border)] bg-transparent shadow-none">
            Cancel
          </Button>
          <Button
            type="button"
            disabled={selected.length === 0}
            onClick={() => onAssign(selected)}
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-none disabled:opacity-40"
          >
            Assign
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function OperatorAssignment() {
  const sidebar = useSidebar()
  useEffect(() => { sidebar?.setSubPageTitle("Operator Assignment") }, [])

  const [operators, setOperators] = React.useState<Operator[]>(MOCK_OPERATORS)
  const [search, setSearch] = React.useState("")
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)

  const [editOpen, setEditOpen] = React.useState(false)
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [activeOperator, setActiveOperator] = React.useState<Operator | null>(null)

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return operators
    return operators.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.firstName.toLowerCase().includes(q) ||
      o.lastName.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.licenseNumber.toLowerCase().includes(q)
    )
  }, [operators, search])

  const totalRows = filtered.length
  const pagedRows = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  function handleOpenEdit(op: Operator) {
    setActiveOperator(op)
    setEditOpen(true)
  }

  function handleOpenAssign(op: Operator) {
    setActiveOperator(op)
    setAssignOpen(true)
  }

  function handleOpenDelete(op: Operator) {
    setActiveOperator(op)
    setDeleteOpen(true)
  }

  function handleSaveOperator(form: OperatorForm) {
    if (!activeOperator) return
    setOperators(prev => prev.map(o => o.id === activeOperator.id ? {
      ...o,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      designation: form.designation.trim(),
      joiningDate: form.joiningDate ? form.joiningDate.toISOString() : o.joiningDate,
      licenseNumber: form.licenseNumber.trim(),
      licenseExpiry: form.licenseExpiry ? formatDMY(form.licenseExpiry) : o.licenseExpiry,
    } : o))
    toast.success("Operator updated")
    setEditOpen(false)
    setActiveOperator(null)
  }

  function handleAssignMhe(mheIds: string[]) {
    if (!activeOperator) return
    setOperators(prev => prev.map(o => o.id === activeOperator.id ? { ...o, assignedMhe: mheIds } : o))
    toast.success(`${mheIds.length} MHE asset(s) assigned to ${activeOperator.firstName} ${activeOperator.lastName}`)
    setAssignOpen(false)
    setActiveOperator(null)
  }

  function handleDelete() {
    if (!activeOperator) return
    setOperators(prev => prev.filter(o => o.id !== activeOperator.id))
    toast.success("Operator deleted")
    setDeleteOpen(false)
    setActiveOperator(null)
  }

  return (
    <div className="h-full flex flex-col bg-[var(--background)] p-6 gap-4">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
          <Input
            placeholder="Search Operators..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPageIndex(0) }}
            className="h-9 pl-9 border-[var(--border)] bg-[var(--card)] shadow-none text-[length:var(--text-sm)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Operator ID</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">First Name</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Last Name</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Email</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">License Number</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">License Expiry</TableHead>
                <TableHead className="px-5 h-10 w-[70px] text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedRows.length > 0 ? (
                pagedRows.map(op => (
                  <TableRow key={op.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20">
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">{op.id}</TableCell>
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{op.firstName}</TableCell>
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{op.lastName}</TableCell>
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{op.email}</TableCell>
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{op.licenseNumber}</TableCell>
                    <TableCell
                      className="px-5 py-3 text-[length:var(--text-sm)] font-medium"
                      style={{ color: isExpiringSoon(op.licenseExpiry) ? "var(--destructive)" : "var(--foreground)" }}
                    >
                      {op.licenseExpiry}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                            <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(op)}>
                            <Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} /> Additional Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenAssign(op)}>
                            <UserPlus className="mr-2 h-4 w-4" strokeWidth={1.5} /> Assign MHE
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleOpenDelete(op)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <p className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">No operators found</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">Try adjusting your search</p>
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

      <EditOperatorSheet
        operator={activeOperator}
        open={editOpen}
        onClose={() => { setEditOpen(false); setActiveOperator(null) }}
        onSave={handleSaveOperator}
      />

      <AssignMheSheet
        operator={activeOperator}
        open={assignOpen}
        onClose={() => { setAssignOpen(false); setActiveOperator(null) }}
        onAssign={handleAssignMhe}
      />

      <AlertDialog open={deleteOpen} onOpenChange={v => { if (!v) { setDeleteOpen(false); setActiveOperator(null) } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Operator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete operator "{activeOperator?.firstName} {activeOperator?.lastName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
