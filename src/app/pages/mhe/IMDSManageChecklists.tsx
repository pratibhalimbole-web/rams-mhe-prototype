"use client"

import * as React from "react"
import { useEffect } from "react"
import { useParams } from "react-router"
import { Plus, Pencil, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
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

type Part = { id: string; name: string; isActive: boolean }
type ChecklistItem = { id: string; name: string; isActive: boolean }

type ConditionBlock = { description: string; action: string }
type ChecklistForm = {
  title: string
  inspectionMethod: string
  evidence: { audio: boolean; video: boolean; image: boolean; note: boolean }
  red: ConditionBlock
  amber: ConditionBlock
  green: ConditionBlock
}

const emptyForm = (): ChecklistForm => ({
  title: "",
  inspectionMethod: "",
  evidence: { audio: false, video: false, image: false, note: false },
  red:   { description: "", action: "" },
  amber: { description: "", action: "" },
  green: { description: "", action: "" },
})

// ─── Static Data ─────────────────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  "Y8ZJNAKO7AIVM1H": "Order Picker",
  "3MQ24R5DKDTCUQR": "Electric Pallet Jack",
  "EJPSLTSFAOTF4LD": "BOPT",
  "KRGTL1NKXNBWR6Y": "Aisle Master",
  "KHL6EYYZNWGV6CZ": "VNA Truck",
  "H87JWMGA4BCAKZS": "Reach Truck",
  "M3QD9DNMDM9CBSF": "Stacker",
  "C016YCUTYUO6MRY": "Electric Forklift",
  "307NDKTMPALKX0Y": "Diesel Forklift",
  "WQ9CVSX4ARCCYA8": "Forklift",
}

const defaultParts: Record<string, Part[]> = {
  "Y8ZJNAKO7AIVM1H": [
    { id: "p1", name: "Lights",  isActive: true },
    { id: "p2", name: "Battery", isActive: true },
  ],
  "3MQ24R5DKDTCUQR": [
    { id: "p1", name: "Forks", isActive: true },
  ],
  "EJPSLTSFAOTF4LD": [
    { id: "p1", name: "Mast",    isActive: true },
    { id: "p2", name: "Forks",   isActive: true },
    { id: "p3", name: "Battery", isActive: true },
    { id: "p4", name: "Tires",   isActive: true },
    { id: "p5", name: "Horn",    isActive: true },
  ],
  "KRGTL1NKXNBWR6Y": [
    { id: "p1",  name: "Mast",           isActive: true  },
    { id: "p2",  name: "Forks",          isActive: true  },
    { id: "p3",  name: "Battery",        isActive: true  },
    { id: "p4",  name: "Tires",          isActive: false },
    { id: "p5",  name: "Horn",           isActive: true  },
    { id: "p6",  name: "Overhead Guard", isActive: true  },
    { id: "p7",  name: "Hydraulics",     isActive: true  },
    { id: "p8",  name: "Seatbelt",       isActive: true  },
    { id: "p9",  name: "Camera",         isActive: false },
    { id: "p10", name: "Lights",         isActive: true  },
    { id: "p11", name: "Brakes",         isActive: true  },
  ],
  "WQ9CVSX4ARCCYA8": [
    { id: "p1", name: "Engine", isActive: true },
  ],
}

const defaultChecklists: Record<string, Record<string, ChecklistItem[]>> = {
  "Y8ZJNAKO7AIVM1H": {
    p1: [
      { id: "c1", name: "dsfghjk",                isActive: true },
      { id: "c2", name: "Light lens condition",    isActive: true },
      { id: "c3", name: "Light turns ON properly", isActive: true },
    ],
    p2: [
      { id: "c1", name: "Battery charge above 20%",          isActive: true  },
      { id: "c2", name: "No visible corrosion on terminals",  isActive: true  },
      { id: "c3", name: "Battery secure in tray",             isActive: false },
    ],
  },
  "3MQ24R5DKDTCUQR": {
    p1: [
      { id: "c1", name: "Fork tip not cracked",        isActive: true },
      { id: "c2", name: "Fork heel wear within limit", isActive: true },
      { id: "c3", name: "Forks level and parallel",    isActive: true },
      { id: "c4", name: "Fork locking pin engaged",    isActive: true },
    ],
  },
  "WQ9CVSX4ARCCYA8": {
    p1: [
      { id: "c1", name: "Oil level within range", isActive: true  },
      { id: "c2", name: "No exhaust smoke",        isActive: false },
    ],
  },
}

function getFallbackParts(typeId: string): Part[] {
  return defaultParts[typeId] ?? []
}
function getFallbackChecklists(typeId: string): Record<string, ChecklistItem[]> {
  return defaultChecklists[typeId] ?? {}
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const conditionStyles = {
  red: {
    label: "Red - Critical",
    title: "#f87171",
    border: "1px solid rgba(185, 28, 28, 0.7)",
    cardBg: "#2a0a0a",
    textareaBg: "#1a0505",
    placeholder: "Describe the critical condition...",
  },
  amber: {
    label: "Amber - Warning",
    title: "#fbbf24",
    border: "1px solid rgba(180, 83, 9, 0.7)",
    cardBg: "#2a1503",
    textareaBg: "#1a0e02",
    placeholder: "Describe the warning condition...",
  },
  green: {
    label: "Green - Normal",
    title: "#34d399",
    border: "1px solid rgba(4, 120, 87, 0.7)",
    cardBg: "#04201a",
    textareaBg: "#021410",
    placeholder: "Describe the normal condition...",
  },
} as const

function ConditionCard({
  variant,
  value,
  onChange,
}: {
  variant: keyof typeof conditionStyles
  value: ConditionBlock
  onChange: (v: ConditionBlock) => void
}) {
  const s = conditionStyles[variant]
  const taClass = "w-full resize-none rounded-[var(--radius)] text-[var(--foreground)] text-[length:var(--text-sm)] placeholder:text-[#4a4a5a] px-3 py-2.5 outline-none border border-[#3a3a3a] focus:border-[#555555] transition-colors"

  return (
    <div style={{ background: s.cardBg, border: s.border, borderRadius: "var(--radius-lg)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <span style={{ color: s.title, fontSize: "var(--text-sm)", fontWeight: 600 }}>{s.label}</span>

      <div className="flex flex-col gap-1.5">
        <Label className="text-[length:var(--text-sm)] text-[var(--foreground)]">Description</Label>
        <textarea
          rows={4}
          placeholder={s.placeholder}
          value={value.description}
          onChange={e => onChange({ ...value, description: e.target.value })}
          style={{ background: s.textareaBg }}
          className={taClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-[length:var(--text-sm)] text-[var(--foreground)]">Action Required</Label>
        <textarea
          rows={4}
          placeholder="What action should be taken..."
          value={value.action}
          onChange={e => onChange({ ...value, action: e.target.value })}
          style={{ background: s.textareaBg }}
          className={taClass}
        />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function IMDSManageChecklists() {
  const { typeId = "" } = useParams<{ typeId: string }>()
  const sidebar = useSidebar()
  useEffect(() => { sidebar?.setSubPageTitle("Manage Checklists") }, [])

  // ── state ──
  const [parts, setParts] = React.useState<Part[]>(() => getFallbackParts(typeId))
  const [checklists, setChecklists] = React.useState<Record<string, ChecklistItem[]>>(
    () => getFallbackChecklists(typeId)
  )
  const [selectedPartId, setSelectedPartId] = React.useState<string>(
    () => getFallbackParts(typeId)[0]?.id ?? ""
  )
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)

  // ── checklist sheet ──
  const [checklistSheetOpen, setChecklistSheetOpen] = React.useState(false)
  const [checklistForm, setChecklistForm] = React.useState<ChecklistForm>(emptyForm)

  // ── add part sheet ──
  const [partSheetOpen, setPartSheetOpen] = React.useState(false)
  const [newPartName, setNewPartName] = React.useState("")

  // ── derived ──
  const selectedPart = parts.find(p => p.id === selectedPartId)
  const activeChecklists = checklists[selectedPartId] ?? []
  const totalRows = activeChecklists.length
  const pagedRows = activeChecklists.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  // ── handlers ──
  function togglePart(partId: string, val: boolean) {
    setParts(prev => prev.map(p => p.id === partId ? { ...p, isActive: val } : p))
  }

  function toggleChecklist(itemId: string, val: boolean) {
    setChecklists(prev => ({
      ...prev,
      [selectedPartId]: (prev[selectedPartId] ?? []).map(c =>
        c.id === itemId ? { ...c, isActive: val } : c
      ),
    }))
  }

  function handleSaveChecklist() {
    if (!checklistForm.title.trim()) {
      toast.error("Checklist title is required")
      return
    }
    const id = `c${Date.now()}`
    setChecklists(prev => ({
      ...prev,
      [selectedPartId]: [...(prev[selectedPartId] ?? []), { id, name: checklistForm.title.trim(), isActive: true }],
    }))
    toast.success("Checklist item added")
    setChecklistSheetOpen(false)
    setChecklistForm(emptyForm())
  }

  function handleSavePart() {
    if (!newPartName.trim()) {
      toast.error("Part name is required")
      return
    }
    const id = `p${Date.now()}`
    setParts(prev => [...prev, { id, name: newPartName.trim(), isActive: true }])
    setChecklists(prev => ({ ...prev, [id]: [] }))
    setSelectedPartId(id)
    setPageIndex(0)
    toast.success("Part added")
    setPartSheetOpen(false)
    setNewPartName("")
  }

  function setEv(key: keyof ChecklistForm["evidence"], val: boolean) {
    setChecklistForm(f => ({ ...f, evidence: { ...f.evidence, [key]: val } }))
  }

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">

      {/* Two-panel body */}
      <div className="flex-1 flex gap-0 p-6 min-h-0">

        {/* LEFT — Parts */}
        <div className="w-[280px] shrink-0 flex flex-col rounded-l-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <span className="text-[length:var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
              Parts
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
            {parts.map(part => (
              <button
                key={part.id}
                type="button"
                onClick={() => { setSelectedPartId(part.id); setPageIndex(0) }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-lg)] text-left transition-colors ${
                  selectedPartId === part.id
                    ? "border border-blue-500 bg-[var(--muted)]/40"
                    : "border border-transparent hover:bg-[var(--muted)]/30"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Switch
                    checked={part.isActive}
                    onCheckedChange={val => togglePart(part.id, val)}
                    onClick={e => e.stopPropagation()}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-[var(--muted)] scale-90"
                  />
                  <span className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--foreground)]">
                    {part.name}
                  </span>
                </div>
                <Pencil strokeWidth={1.5} className="h-3.5 w-3.5 text-[var(--muted-foreground)] shrink-0" />
              </button>
            ))}

            {parts.length > 0 && (
              <p className="text-center text-[11px] text-[var(--muted-foreground)] pt-1">No more parts</p>
            )}
            {parts.length === 0 && (
              <p className="text-center text-[11px] text-[var(--muted-foreground)] py-4">No parts added yet</p>
            )}
          </div>

          <div className="p-3 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              className="w-full h-9 gap-2 border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none text-[length:var(--text-sm)]"
              onClick={() => { setNewPartName(""); setPartSheetOpen(true) }}
            >
              <Plus strokeWidth={1.5} className="h-4 w-4" />
              Add New Part
            </Button>
          </div>
        </div>

        {/* RIGHT — Checklists */}
        <div className="flex-1 flex flex-col rounded-r-[var(--radius)] border-t border-r border-b border-[var(--border)] bg-[var(--card)] overflow-hidden min-w-0">

          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <span className="text-[length:var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
              Checklist :{" "}
              <span className="font-[var(--font-weight-normal)]">{selectedPart?.name ?? "—"}</span>
            </span>
            <Button
              type="button"
              onClick={() => { setChecklistForm(emptyForm()); setChecklistSheetOpen(true) }}
              disabled={!selectedPart}
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-none text-[length:var(--text-sm)] px-3"
            >
              <Plus strokeWidth={1.5} className="h-3.5 w-3.5" />
              Add Checklist
            </Button>
          </div>

          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                  <TableHead className="px-5 h-10 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">Checklist</TableHead>
                  <TableHead className="px-5 h-10 w-[160px] text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">Status</TableHead>
                  <TableHead className="px-5 h-10 w-[80px] text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedRows.length > 0 ? (
                  pagedRows.map(item => (
                    <TableRow key={item.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20">
                      <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{item.name}</TableCell>
                      <TableCell className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={val => toggleChecklist(item.id, val)}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-[var(--muted)] scale-90"
                          />
                          <span className="text-[length:var(--text-sm)] text-[var(--foreground)]">
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <button type="button" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                          <Pencil strokeWidth={1.5} className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3} className="h-40 text-center text-[length:var(--text-sm)] text-[var(--muted-foreground)]">
                      No checklist items. Click "+ Add Checklist" to add one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-3 px-4 py-2 border-t border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-[11px] text-[var(--muted-foreground)]">Rows per page:</span>
              <Select value={`${pageSize}`} onValueChange={v => { setPageSize(Number(v)); setPageIndex(0) }}>
                <SelectTrigger className="h-7 w-[60px] border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] shadow-none text-[11px] px-2 rounded-[var(--radius-sm)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top" className="bg-[var(--popover)] border-[var(--border)]">
                  {[10, 20, 50].map(s => (
                    <SelectItem key={s} value={`${s}`} className="text-[length:var(--text-sm)]">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-[11px] text-[var(--muted-foreground)]">
              {firstRow === 0 ? "0" : `${firstRow} – ${lastRow}`} of {totalRows}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none disabled:opacity-30"
                onClick={() => setPageIndex(i => Math.max(0, i - 1))} disabled={pageIndex === 0}>
                <ChevronLeft strokeWidth={1.5} className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none disabled:opacity-30"
                onClick={() => setPageIndex(i => Math.min(totalPages - 1, i + 1))} disabled={pageIndex >= totalPages - 1}>
                <ChevronRightIcon strokeWidth={1.5} className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add New Checklist Sheet ── */}
      <Sheet open={checklistSheetOpen} onOpenChange={setChecklistSheetOpen}>
        <SheetContent
          side="right"
          className="w-[560px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0"
        >
          {/* Header */}
          <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
            <SheetTitle className="text-[length:var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
              Add New Checklist
            </SheetTitle>
          </SheetHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">

            {/* Checklist Details */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
                Checklist Details
              </h3>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[length:var(--text-sm)] text-[var(--foreground)]">
                  Checklist Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g., Check if the battery is functioning properly"
                  value={checklistForm.title}
                  onChange={e => setChecklistForm(f => ({ ...f, title: e.target.value }))}
                  className="h-9 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] text-[length:var(--text-sm)]"
                />
              </div>

              {/* Inspection Method */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[length:var(--text-sm)] text-[var(--foreground)]">
                  Inspection Method <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={checklistForm.inspectionMethod}
                  onValueChange={v => setChecklistForm(f => ({ ...f, inspectionMethod: v }))}
                >
                  <SelectTrigger className="h-9 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none text-[length:var(--text-sm)]">
                    <SelectValue placeholder="Select inspection method" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                    <SelectItem value="visual">Visual</SelectItem>
                    <SelectItem value="manual">Manual / Touch</SelectItem>
                    <SelectItem value="operational">Operational Test</SelectItem>
                    <SelectItem value="instrument">Instrument-based</SelectItem>
                    <SelectItem value="measurement">Measurement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Evidence Submission */}
              <div className="flex flex-col gap-2">
                <Label className="text-[length:var(--text-sm)] text-[var(--foreground)]">
                  Evidence Submission Method <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-2.5">
                  {(["audio", "video", "image", "note"] as const).map(key => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <Checkbox
                        checked={checklistForm.evidence[key]}
                        onCheckedChange={val => setEv(key, val === true)}
                        className="h-[18px] w-[18px] rounded-[var(--radius-sm)] border-[var(--border)] bg-[var(--background)] data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shadow-none [&_svg]:strokeWidth-[1.5]"
                      />
                      <span className="text-[length:var(--text-sm)] text-[var(--foreground)] capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Condition Definitions */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
                Condition Definitions
              </h3>

              <ConditionCard
                variant="red"
                value={checklistForm.red}
                onChange={v => setChecklistForm(f => ({ ...f, red: v }))}
              />

              <ConditionCard
                variant="amber"
                value={checklistForm.amber}
                onChange={v => setChecklistForm(f => ({ ...f, amber: v }))}
              />

              <ConditionCard
                variant="green"
                value={checklistForm.green}
                onChange={v => setChecklistForm(f => ({ ...f, green: v }))}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setChecklistSheetOpen(false)}
              className="border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveChecklist}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-none"
            >
              Save Checklist
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Add New Part Dialog ── */}
      <Dialog open={partSheetOpen} onOpenChange={setPartSheetOpen}>
        <DialogContent className="sm:max-w-[520px] bg-[var(--card)] border-[var(--border)] shadow-none p-0 gap-0">
          <DialogHeader className="px-7 py-5 border-b border-[var(--border)]">
            <DialogTitle className="text-[length:var(--text-lg)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
              Add New Part
            </DialogTitle>
            <p className="text-[length:var(--text-sm)] text-[var(--muted-foreground)] mt-0.5">
              Define a new inspectable part for this MHE type.
            </p>
          </DialogHeader>

          <div className="px-7 py-7">
            <div className="flex flex-col gap-2">
              <Label className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--foreground)]">
                Part Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., Hydraulic Pump"
                value={newPartName}
                onChange={e => setNewPartName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSavePart()}
                className="h-9 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] text-[length:var(--text-sm)]"
                autoFocus
              />
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Use a clear, descriptive name (e.g., Forks, Battery, Overhead Guard).
              </p>
            </div>
          </div>

          <DialogFooter className="px-7 py-4 border-t border-[var(--border)] flex flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPartSheetOpen(false)}
              className="h-9 border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none text-[length:var(--text-sm)]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSavePart}
              className="h-9 bg-blue-600 hover:bg-blue-500 text-white shadow-none text-[length:var(--text-sm)]"
            >
              Add Part
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
