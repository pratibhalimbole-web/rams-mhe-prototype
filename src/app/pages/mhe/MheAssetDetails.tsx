import * as React from "react"
import { useEffect } from "react"
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Calendar as CalendarIcon,
  Info,
  Zap,
  ShieldCheck,
  Wrench,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { toast } from "sonner"

// ─── Types ───────────────────────────────────────────────────────────────────

type Ownership = "Buy" | "Lease" | "Rental"
type WarrantyStatus = "Active" | "Expired" | "-"

interface MheAsset {
  id: string
  name: string
  type: string
  oem: string
  ownership: Ownership | ""
  yearOfMfg: string
  warranty: WarrantyStatus
}

interface AssetForm {
  name: string
  type: string
  oem: string
  model: string
  yearOfMfg: Date | undefined
  ownership: string
  powerType: string
  supplier: string
  warrantyExpiry: Date | undefined
  loadCapacity: string
  lastServiceDate: Date | undefined
  serviceIntervalKm: string
  serviceIntervalDays: string
  hydraulicServiceInterval: string
}

const emptyForm = (): AssetForm => ({
  name: "",
  type: "",
  oem: "",
  model: "",
  yearOfMfg: undefined,
  ownership: "",
  powerType: "",
  supplier: "",
  warrantyExpiry: undefined,
  loadCapacity: "",
  lastServiceDate: undefined,
  serviceIntervalKm: "",
  serviceIntervalDays: "",
  hydraulicServiceInterval: "",
})

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MHE_TYPES = ["forklift", "Order Picker", "BOPT", "Electric Pallet Jack", "Reach Truck", "VNA Truck", "Stacker", "Aisle Master"]
const OEM_OPTIONS = ["Toyota", "Crown", "Elite Handling Technologies", "Hyster", "Jungheinrich"]

const MOCK_ASSETS: MheAsset[] = [
  { id: "KTTHCL4WO5X9HLO", name: "Test No Warranty Field", type: "forklift",            oem: "",                            ownership: "",       yearOfMfg: "",     warranty: "-" },
  { id: "9QGSSML13VDD4IU", name: "MHE 09",                type: "Order Picker",         oem: "Toyota",                      ownership: "Buy",    yearOfMfg: "2017", warranty: "Active" },
  { id: "IICM7QXZ7HHXIXT", name: "MHE 10",                type: "forklift",             oem: "Crown",                       ownership: "Lease",  yearOfMfg: "2018", warranty: "Expired" },
  { id: "LQIYUA09VVK6GJ7", name: "MHE 08",                type: "BOPT",                 oem: "Toyota",                      ownership: "Buy",    yearOfMfg: "2021", warranty: "Expired" },
  { id: "2T8L8UKCESTDF99", name: "MHE 07",                type: "forklift",             oem: "Toyota",                      ownership: "Lease",  yearOfMfg: "2009", warranty: "Expired" },
  { id: "U5GW3B1XCQESNHL", name: "MHE 06",                type: "Electric Pallet Jack", oem: "Toyota",                      ownership: "Buy",    yearOfMfg: "2022", warranty: "Active" },
  { id: "OE2BQ63OX8TSGTT", name: "MHE 05",                type: "BOPT",                 oem: "Elite Handling Technologies", ownership: "Buy",    yearOfMfg: "2022", warranty: "Expired" },
  { id: "9AAIEIY84GNJUMN", name: "MHE 04",                type: "Order Picker",         oem: "Toyota",                      ownership: "Buy",    yearOfMfg: "2020", warranty: "Active" },
  { id: "Z89H1I7IO9G84ZH", name: "MHE 03",                type: "Electric Pallet Jack", oem: "Elite Handling Technologies", ownership: "Rental", yearOfMfg: "2016", warranty: "Active" },
  { id: "MUAQET9EOCA4SZF", name: "MHE 02",                type: "Reach Truck",          oem: "Crown",                       ownership: "Lease",  yearOfMfg: "2012", warranty: "Active" },
  { id: "9YQPLM2XVCTR55A", name: "MHE 01",                type: "forklift",             oem: "Hyster",                      ownership: "Buy",    yearOfMfg: "2019", warranty: "Active" },
]

// ─── Badges ──────────────────────────────────────────────────────────────────

function OwnershipBadge({ ownership }: { ownership: Ownership | "" }) {
  if (!ownership) return <span className="inline-block w-10 h-4 rounded bg-[var(--muted)]" />
  const styles: Record<Ownership, string> = {
    Buy: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    Lease: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    Rental: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  }
  return (
    <Badge variant="outline" className={`border-transparent font-medium ${styles[ownership]}`}>
      {ownership}
    </Badge>
  )
}

function WarrantyBadge({ warranty }: { warranty: WarrantyStatus }) {
  if (warranty === "-") {
    return <span className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>-</span>
  }
  const styles: Record<Exclude<WarrantyStatus, "-">, string> = {
    Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Expired: "bg-red-500/10 text-red-600 dark:text-red-400",
  }
  return (
    <Badge variant="outline" className={`border-transparent font-medium ${styles[warranty]}`}>
      {warranty}
    </Badge>
  )
}

// ─── Form field helpers ──────────────────────────────────────────────────────

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
          {value ? value.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarPicker mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

function SectionHeader({ icon: Icon, children, hint }: { icon: React.ElementType; children: React.ReactNode; hint?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
      <h3 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
        {children}
      </h3>
      {hint && <Info className="w-3 h-3" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />}
    </div>
  )
}

// ─── Add / Edit Asset Sheet ──────────────────────────────────────────────────

function AssetFormSheet({
  open,
  onClose,
  onSave,
  editing,
}: {
  open: boolean
  onClose: () => void
  onSave: (form: AssetForm) => void
  editing: boolean
}) {
  const [form, setForm] = React.useState<AssetForm>(emptyForm())

  useEffect(() => { if (open) setForm(emptyForm()) }, [open])

  function set<K extends keyof AssetForm>(key: K, value: AssetForm[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  const canSave = form.name.trim() && form.type && form.oem.trim() && form.model.trim() && form.yearOfMfg && form.powerType && form.loadCapacity

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
            {editing ? "Edit MHE Asset" : "Add MHE Asset"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">

          {/* Basic Details */}
          <div className="flex flex-col gap-3">
            <SectionHeader icon={Info}>Basic Details</SectionHeader>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>MHE Name</FieldLabel>
              <Input
                placeholder="Enter MHE Name"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>MHE Type</FieldLabel>
              <Select value={form.type} onValueChange={v => set("type", v)}>
                <SelectTrigger className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none">
                  <SelectValue placeholder="Select MHE Type" />
                </SelectTrigger>
                <SelectContent>
                  {MHE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>OEM / Make</FieldLabel>
              <Input
                placeholder="e.g. Toyota"
                value={form.oem}
                onChange={e => set("oem", e.target.value)}
                className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Model Number</FieldLabel>
              <Input
                placeholder="e.g. L14AP"
                value={form.model}
                onChange={e => set("model", e.target.value)}
                className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Year of Manufacture</FieldLabel>
              <DatePickerField value={form.yearOfMfg} onChange={d => set("yearOfMfg", d)} placeholder="Pick a year" />
            </div>
          </div>

          {/* Ownership & Power */}
          <div className="flex flex-col gap-3 pt-1 border-t border-[var(--border)]">
            <div className="pt-4">
              <SectionHeader icon={Zap}>Ownership &amp; Power</SectionHeader>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Ownership Type</FieldLabel>
              <Select value={form.ownership} onValueChange={v => set("ownership", v)}>
                <SelectTrigger className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none">
                  <SelectValue placeholder="Select Ownership Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buy">Buy</SelectItem>
                  <SelectItem value="Lease">Lease</SelectItem>
                  <SelectItem value="Rental">Rental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Fuel / Power Type</FieldLabel>
              <Select value={form.powerType} onValueChange={v => set("powerType", v)}>
                <SelectTrigger className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none">
                  <SelectValue placeholder="Select Power Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="LPG">LPG</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Supplier Name</FieldLabel>
              <Input
                placeholder="Enter Supplier Name"
                value={form.supplier}
                onChange={e => set("supplier", e.target.value)}
                className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
              />
            </div>
          </div>

          {/* Safety Compliance */}
          <div className="flex flex-col gap-3 pt-1 border-t border-[var(--border)]">
            <div className="pt-4">
              <SectionHeader icon={ShieldCheck}>Safety Compliance</SectionHeader>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Warranty Expiry Date</FieldLabel>
              <DatePickerField value={form.warrantyExpiry} onChange={d => set("warrantyExpiry", d)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Load Capacity (kg)</FieldLabel>
              <Input
                type="number"
                placeholder="0.00"
                value={form.loadCapacity}
                onChange={e => set("loadCapacity", e.target.value)}
                className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
              />
            </div>
          </div>

          {/* Service Information */}
          <div className="flex flex-col gap-3 pt-1 border-t border-[var(--border)]">
            <div className="pt-4">
              <SectionHeader icon={Wrench} hint>Service Information</SectionHeader>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Last Service Date</FieldLabel>
              <DatePickerField value={form.lastServiceDate} onChange={d => set("lastServiceDate", d)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Service Interval (km)</FieldLabel>
              <Input
                type="number"
                placeholder="e.g. 2000"
                value={form.serviceIntervalKm}
                onChange={e => set("serviceIntervalKm", e.target.value)}
                className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Service Interval (days)</FieldLabel>
              <Input
                type="number"
                placeholder="e.g. 60"
                value={form.serviceIntervalDays}
                onChange={e => set("serviceIntervalDays", e.target.value)}
                className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Hydraulic Service Interval</FieldLabel>
              <Input
                type="number"
                placeholder="e.g. 40000"
                value={form.hydraulicServiceInterval}
                onChange={e => set("hydraulicServiceInterval", e.target.value)}
                className="h-9 text-[length:var(--text-sm)] border-[var(--border)] bg-[var(--background)] shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)] shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="border-[var(--border)] bg-transparent shadow-none">
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white shadow-none">
            Save Asset
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function MheAssetDetails() {
  const sidebar = useSidebar()
  useEffect(() => { sidebar?.setSubPageTitle("Mhe Asset Details") }, [])

  const [assets, setAssets] = React.useState<MheAsset[]>(MOCK_ASSETS)
  const [search, setSearch] = React.useState("")
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)

  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return assets
    return assets.filter(a =>
      a.id.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.oem.toLowerCase().includes(q)
    )
  }, [assets, search])

  const totalRows = filtered.length
  const pagedRows = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  function handleAddAsset() {
    setEditingId(null)
    setSheetOpen(true)
  }

  function handleSaveAsset(form: AssetForm) {
    const newAsset: MheAsset = {
      id: `NEW${Date.now()}`,
      name: form.name.trim(),
      type: form.type,
      oem: form.oem.trim(),
      ownership: (form.ownership as Ownership) || "",
      yearOfMfg: form.yearOfMfg ? String(form.yearOfMfg.getFullYear()) : "",
      warranty: form.warrantyExpiry ? (form.warrantyExpiry > new Date() ? "Active" : "Expired") : "-",
    }
    setAssets(prev => [newAsset, ...prev])
    toast.success("MHE asset added")
    setSheetOpen(false)
  }

  function handleDelete(id: string) {
    setAssets(prev => prev.filter(a => a.id !== id))
    toast.success("MHE asset removed")
  }

  return (
    <div className="h-full flex flex-col bg-[var(--background)] p-6 gap-4">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
          <Input
            placeholder="Search MHE Assets..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPageIndex(0) }}
            className="h-9 pl-9 border-[var(--border)] bg-[var(--card)] shadow-none text-[length:var(--text-sm)]"
          />
        </div>
        <Button onClick={handleAddAsset} className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-none shrink-0">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add MHE Asset
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">MHE ID</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">MHE Name</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">MHE Type</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">OEM / Make</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Ownership</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Year of Mfg.</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Warranty</TableHead>
                <TableHead className="px-5 h-10 w-[70px] text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedRows.length > 0 ? (
                pagedRows.map(asset => (
                  <TableRow key={asset.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20">
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">{asset.id}</TableCell>
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{asset.name}</TableCell>
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{asset.type}</TableCell>
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{asset.oem || "—"}</TableCell>
                    <TableCell className="px-5 py-3"><OwnershipBadge ownership={asset.ownership} /></TableCell>
                    <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{asset.yearOfMfg || "—"}</TableCell>
                    <TableCell className="px-5 py-3"><WarrantyBadge warranty={asset.warranty} /></TableCell>
                    <TableCell className="px-5 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                            <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" strokeWidth={1.5} /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(asset.id)}
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
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <p className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">No MHE assets found</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">Try adjusting your search or add a new asset</p>
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

      <AssetFormSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={handleSaveAsset}
        editing={!!editingId}
      />
    </div>
  )
}
