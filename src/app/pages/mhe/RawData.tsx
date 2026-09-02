import * as React from "react"
import { useEffect } from "react"
import { Download, ChevronDown, Check, Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../../components/ui/command"
import { Calendar as CalendarPicker } from "../../components/ui/calendar"
import { toast } from "sonner"

// ─── Mock data ───────────────────────────────────────────────────────────────

const MHE_OPTIONS = [
  "Test No Warranty Field", "MHE 09", "MHE 10", "MHE 08", "MHE 07", "MHE 06",
  "MHE 05", "MHE 04", "MHE 03", "MHE 02", "MHE 01",
]

const SENSOR_OPTIONS = ["Access Control Sensor", "Speed Sensor", "Location Sensor"]

// ─── Searchable select combobox ──────────────────────────────────────────────

function SearchableSelect({
  value, onChange, options, placeholder, searchPlaceholder, disabled,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  searchPlaceholder: string
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full h-10 justify-between font-normal border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)] disabled:opacity-60"
          style={{ color: value ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          {value || placeholder}
          <ChevronDown className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(o => (
                <CommandItem key={o} value={o} onSelect={() => { onChange(o); setOpen(false) }}>
                  {o}
                  {value === o && <Check className="ml-auto w-3.5 h-3.5" strokeWidth={1.5} />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function DateRangeField({
  value, onChange, disabled, placeholder,
}: {
  value: DateRange | undefined
  onChange: (r: DateRange | undefined) => void
  disabled?: boolean
  placeholder: string
}) {
  const [open, setOpen] = React.useState(false)

  const label = value?.from
    ? value.to
      ? `${value.from.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${value.to.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : value.from.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : placeholder

  return (
    <Popover open={open} onOpenChange={v => !disabled && setOpen(v)}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full h-10 justify-start gap-2 font-normal border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)] disabled:opacity-60"
          style={{ color: value?.from ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          <CalendarIcon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarPicker
          mode="range"
          numberOfMonths={2}
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function RawData() {
  const sidebar = useSidebar()
  useEffect(() => { sidebar?.setSubPageTitle("Raw Data") }, [])

  const [mhe, setMhe] = React.useState("")
  const [sensor, setSensor] = React.useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)

  function handleMheChange(v: string) {
    setMhe(v)
    setSensor("")
    setDateRange(undefined)
  }

  function handleSensorChange(v: string) {
    setSensor(v)
    setDateRange(undefined)
  }

  const canDownload = mhe && sensor && dateRange?.from && dateRange?.to

  function handleDownload() {
    if (!canDownload) return
    toast.success(`Preparing CSV for ${mhe} · ${sensor}`)
  }

  return (
    <div className="h-full flex flex-col bg-[var(--background)] p-6 gap-4">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col gap-5">
        <h2 className="text-[length:var(--text-lg)] font-semibold text-[var(--foreground)]">Download Raw Data (CSV)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">
              Select MHE <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              value={mhe}
              onChange={handleMheChange}
              options={MHE_OPTIONS}
              placeholder="Select MHE asset"
              searchPlaceholder="Search MHE..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">
              Select Sensor <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              value={sensor}
              onChange={handleSensorChange}
              options={SENSOR_OPTIONS}
              placeholder={mhe ? "Select sensor" : "Select MHE first"}
              searchPlaceholder="Search sensor..."
              disabled={!mhe}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">
              Select Date Range <span className="text-red-500">*</span>
            </label>
            <DateRangeField
              value={dateRange}
              onChange={setDateRange}
              disabled={!sensor}
              placeholder={sensor ? "Pick a date range" : "Select sensor first"}
            />
          </div>
        </div>

        <div>
          <Button
            type="button"
            disabled={!canDownload}
            onClick={handleDownload}
            className="h-10 gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-none disabled:opacity-50"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            Download CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
