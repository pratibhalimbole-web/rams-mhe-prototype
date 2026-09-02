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
  Truck,
  User,
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
  model: string
  ownership: Ownership | ""
  powerType: string
  supplier: string
  yearOfMfg: string
  warranty: WarrantyStatus
  warrantyExpiry: string
  loadCapacity: string
  lastServiceDate: string
  serviceIntervalKm: string
  serviceIntervalDays: string
  hydraulicServiceInterval: string
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

function parseDMY(str: string): Date | undefined {
  if (!str) return undefined
  const d = new Date(str)
  return isNaN(d.getTime()) ? undefined : d
}

function formToAsset(form: AssetForm, id: string, existingId?: string): MheAsset {
  const warrantyExpiry = form.warrantyExpiry
  return {
    id: existingId ?? id,
    name: form.name.trim(),
    type: form.type,
    oem: form.oem.trim(),
    model: form.model.trim(),
    ownership: (form.ownership as Ownership) || "",
    powerType: form.powerType,
    supplier: form.supplier.trim(),
    yearOfMfg: form.yearOfMfg ? String(form.yearOfMfg.getFullYear()) : "",
    warranty: warrantyExpiry ? (warrantyExpiry > new Date() ? "Active" : "Expired") : "-",
    warrantyExpiry: warrantyExpiry ? warrantyExpiry.toISOString() : "",
    loadCapacity: form.loadCapacity,
    lastServiceDate: form.lastServiceDate ? form.lastServiceDate.toISOString() : "",
    serviceIntervalKm: form.serviceIntervalKm,
    serviceIntervalDays: form.serviceIntervalDays,
    hydraulicServiceInterval: form.hydraulicServiceInterval,
  }
}

function assetToForm(asset: MheAsset): AssetForm {
  return {
    name: asset.name,
    type: asset.type,
    oem: asset.oem,
    model: asset.model,
    yearOfMfg: asset.yearOfMfg ? new Date(Number(asset.yearOfMfg), 0, 1) : undefined,
    ownership: asset.ownership,
    powerType: asset.powerType,
    supplier: asset.supplier,
    warrantyExpiry: parseDMY(asset.warrantyExpiry),
    loadCapacity: asset.loadCapacity,
    lastServiceDate: parseDMY(asset.lastServiceDate),
    serviceIntervalKm: asset.serviceIntervalKm,
    serviceIntervalDays: asset.serviceIntervalDays,
    hydraulicServiceInterval: asset.hydraulicServiceInterval,
  }
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MHE_TYPES = ["forklift", "Order Picker", "BOPT", "Electric Pallet Jack", "Reach Truck", "VNA Truck", "Stacker", "Aisle Master"]

const MOCK_ASSETS: MheAsset[] = [
  { id: "KTTHCL4WO5X9HLO", name: "Test No Warranty Field", type: "forklift",            oem: "",                            model: "",         ownership: "",       powerType: "",         supplier: "",                        yearOfMfg: "",     warranty: "-",       warrantyExpiry: "",                loadCapacity: "",     lastServiceDate: "",               serviceIntervalKm: "",    serviceIntervalDays: "",  hydraulicServiceInterval: "" },
  { id: "9QGSSML13VDD4IU", name: "MHE 09",                type: "Order Picker",         oem: "Toyota",                      model: "TOY-1000", ownership: "Buy",    powerType: "Electric", supplier: "Toyota Material Handling", yearOfMfg: "2017", warranty: "Active",  warrantyExpiry: "2027-09-10",       loadCapacity: "2000", lastServiceDate: "2026-05-01",      serviceIntervalKm: "200", serviceIntervalDays: "60", hydraulicServiceInterval: "200" },
  { id: "IICM7QXZ7HHXIXT", name: "MHE 10",                type: "forklift",             oem: "Crown",                       model: "CR-500",   ownership: "Lease",  powerType: "Diesel",   supplier: "Crown Equipment",          yearOfMfg: "2018", warranty: "Expired", warrantyExpiry: "2023-01-15",       loadCapacity: "2500", lastServiceDate: "2026-02-12",      serviceIntervalKm: "250", serviceIntervalDays: "45", hydraulicServiceInterval: "300" },
  { id: "LQIYUA09VVK6GJ7", name: "MHE 08",                type: "BOPT",                 oem: "Toyota",                      model: "TOY-BOPT2",ownership: "Buy",    powerType: "Electric", supplier: "Toyota Material Handling", yearOfMfg: "2021", warranty: "Expired", warrantyExpiry: "2024-06-20",       loadCapacity: "1800", lastServiceDate: "2026-03-08",      serviceIntervalKm: "150", serviceIntervalDays: "30", hydraulicServiceInterval: "180" },
  { id: "2T8L8UKCESTDF99", name: "MHE 07",                type: "forklift",             oem: "Toyota",                      model: "TOY-800",  ownership: "Lease",  powerType: "Diesel",   supplier: "Toyota Material Handling", yearOfMfg: "2009", warranty: "Expired", warrantyExpiry: "2014-11-01",       loadCapacity: "3000", lastServiceDate: "2026-01-22",      serviceIntervalKm: "300", serviceIntervalDays: "60", hydraulicServiceInterval: "400" },
  { id: "U5GW3B1XCQESNHL", name: "MHE 06",                type: "Electric Pallet Jack", oem: "Toyota",                      model: "TOY-EPJ1", ownership: "Buy",    powerType: "Electric", supplier: "Toyota Material Handling", yearOfMfg: "2022", warranty: "Active",  warrantyExpiry: "2027-04-18",       loadCapacity: "1500", lastServiceDate: "2026-06-02",      serviceIntervalKm: "100", serviceIntervalDays: "30", hydraulicServiceInterval: "150" },
  { id: "OE2BQ63OX8TSGTT", name: "MHE 05",                type: "BOPT",                 oem: "Elite Handling Technologies", model: "EHT-B3",   ownership: "Buy",    powerType: "Electric", supplier: "Elite Handling Technologies", yearOfMfg: "2022", warranty: "Expired", warrantyExpiry: "2025-02-14",    loadCapacity: "1900", lastServiceDate: "2026-04-19",      serviceIntervalKm: "180", serviceIntervalDays: "40", hydraulicServiceInterval: "220" },
  { id: "9AAIEIY84GNJUMN", name: "MHE 04",                type: "Order Picker",         oem: "Toyota",                      model: "TOY-OP4",  ownership: "Buy",    powerType: "Electric", supplier: "Toyota Material Handling", yearOfMfg: "2020", warranty: "Active",  warrantyExpiry: "2027-08-09",       loadCapacity: "1200", lastServiceDate: "2026-05-30",      serviceIntervalKm: "120", serviceIntervalDays: "30", hydraulicServiceInterval: "160" },
  { id: "Z89H1I7IO9G84ZH", name: "MHE 03",                type: "Electric Pallet Jack", oem: "Elite Handling Technologies", model: "EHT-EPJ2", ownership: "Rental", powerType: "Electric", supplier: "Elite Handling Technologies", yearOfMfg: "2016", warranty: "Active", warrantyExpiry: "2027-12-01",    loadCapacity: "1600", lastServiceDate: "2026-06-15",      serviceIntervalKm: "110", serviceIntervalDays: "30", hydraulicServiceInterval: "140" },
  { id: "MUAQET9EOCA4SZF", name: "MHE 02",                type: "Reach Truck",          oem: "Crown",                       model: "CR-RT2",   ownership: "Lease",  powerType: "Electric", supplier: "Crown Equipment",          yearOfMfg: "2012", warranty: "Active",  warrantyExpiry: "2027-03-25",       loadCapacity: "2200", lastServiceDate: "2026-05-11",      serviceIntervalKm: "200", serviceIntervalDays: "45", hydraulicServiceInterval: "260" },
  { id: "9YQPLM2XVCTR55A", name: "MHE 01",                type: "forklift",             oem: "Hyster",                      model: "HY-F100",  ownership: "Buy",    powerType: "LPG",      supplier: "Hyster India",              yearOfMfg: "2019", warranty: "Active",  warrantyExpiry: "2027-07-04",       loadCapacity: "2800", lastServiceDate: "2026-04-28",      serviceIntervalKm: "220", serviceIntervalDays: "50", hydraulicServiceInterval: "300" },
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
  initial,
}: {
  open: boolean
  onClose: () => void
  onSave: (form: AssetForm) => void
  editing: boolean
  initial?: AssetForm
}) {
  const [form, setForm] = React.useState<AssetForm>(emptyForm())

  useEffect(() => { if (open) setForm(initial ?? emptyForm()) }, [open, initial])

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
            {editing ? "Update Asset" : "Save Asset"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── View / Overview Sheet ───────────────────────────────────────────────────

function formatShortDate(iso: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[var(--border)] last:border-0">
      <span className="text-[10.5px] font-semibold uppercase tracking-wide shrink-0" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </span>
      <span className="text-[length:var(--text-sm)] font-medium text-right text-[var(--foreground)]">
        {children}
      </span>
    </div>
  )
}

function OverviewSection({ icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 border-b border-[var(--border)]">
      <div className="pb-1">
        <SectionHeader icon={icon}>{title}</SectionHeader>
      </div>
      {children}
    </div>
  )
}

function AssetViewSheet({
  asset,
  open,
  onClose,
}: {
  asset: MheAsset | null
  open: boolean
  onClose: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0">
        <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
          <SheetTitle className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)]">
            MHE Asset Overview
          </SheetTitle>
        </SheetHeader>

        {asset && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Identity header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}>
                <Truck className="w-5 h-5" strokeWidth={1.5} style={{ color: "var(--primary)" }} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)] truncate">{asset.name}</span>
                <span className="text-[12px] truncate" style={{ color: "var(--muted-foreground)" }}>
                  {asset.type}{asset.oem ? ` · ${asset.oem}` : ""}
                </span>
              </div>
            </div>

            <OverviewSection icon={Info} title="Basic Details">
              <DetailRow label="MHE Name">{asset.name || "—"}</DetailRow>
              <DetailRow label="MHE Type">{asset.type || "—"}</DetailRow>
              <DetailRow label="OEM / Make">{asset.oem || "—"}</DetailRow>
              <DetailRow label="Model Number">
                {asset.model ? <span style={{ color: "var(--primary)" }}>{asset.model}</span> : "—"}
              </DetailRow>
              <DetailRow label="Year of Mfg.">{asset.yearOfMfg || "—"}</DetailRow>
            </OverviewSection>

            <OverviewSection icon={Zap} title="Ownership & Power">
              <DetailRow label="Ownership Type"><OwnershipBadge ownership={asset.ownership} /></DetailRow>
              <DetailRow label="Supplier Name">{asset.supplier || "—"}</DetailRow>
              <DetailRow label="Fuel / Power Type">{asset.powerType || "—"}</DetailRow>
            </OverviewSection>

            <OverviewSection icon={ShieldCheck} title="Safety Compliance">
              <DetailRow label="Warranty Status"><WarrantyBadge warranty={asset.warranty} /></DetailRow>
              <DetailRow label="Warranty Expiry">{formatShortDate(asset.warrantyExpiry)}</DetailRow>
              <DetailRow label="Load Capacity">{asset.loadCapacity ? `${asset.loadCapacity} kg` : "—"}</DetailRow>
            </OverviewSection>

            <OverviewSection icon={Wrench} title="Service Information">
              <DetailRow label="Last Service Date">{formatShortDate(asset.lastServiceDate)}</DetailRow>
              <DetailRow label="Service Interval (km)">{asset.serviceIntervalKm || "—"}</DetailRow>
              <DetailRow label="Service Interval (days)">{asset.serviceIntervalDays || "—"}</DetailRow>
              <DetailRow label="Hydraulic Service Interval">{asset.hydraulicServiceInterval || "—"}</DetailRow>
            </OverviewSection>

            <div className="flex flex-col gap-2 px-5 py-4">
              <SectionHeader icon={User}>Assigned Operators</SectionHeader>
              <div className="flex items-center gap-2 py-2 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
                <User className="w-4 h-4" strokeWidth={1.5} />
                No operators assigned
              </div>
            </div>
          </div>
        )}
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
  const [editingForm, setEditingForm] = React.useState<AssetForm | undefined>(undefined)

  const [viewOpen, setViewOpen] = React.useState(false)
  const [viewAsset, setViewAsset] = React.useState<MheAsset | null>(null)

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
    setEditingForm(undefined)
    setSheetOpen(true)
  }

  function handleEditAsset(asset: MheAsset) {
    setEditingId(asset.id)
    setEditingForm(assetToForm(asset))
    setSheetOpen(true)
  }

  function handleViewAsset(asset: MheAsset) {
    setViewAsset(asset)
    setViewOpen(true)
  }

  function handleSaveAsset(form: AssetForm) {
    if (editingId) {
      setAssets(prev => prev.map(a => a.id === editingId ? formToAsset(form, editingId, editingId) : a))
      toast.success("MHE asset updated")
    } else {
      const newAsset = formToAsset(form, `NEW${Date.now()}`)
      setAssets(prev => [newAsset, ...prev])
      toast.success("MHE asset added")
    }
    setSheetOpen(false)
    setEditingId(null)
    setEditingForm(undefined)
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
                          <DropdownMenuItem onClick={() => handleViewAsset(asset)}>
                            <Eye className="mr-2 h-4 w-4" strokeWidth={1.5} /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditAsset(asset)}>
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
        onClose={() => { setSheetOpen(false); setEditingId(null); setEditingForm(undefined) }}
        onSave={handleSaveAsset}
        editing={!!editingId}
        initial={editingForm}
      />

      <AssetViewSheet
        asset={viewAsset}
        open={viewOpen}
        onClose={() => { setViewOpen(false); setViewAsset(null) }}
      />
    </div>
  )
}
