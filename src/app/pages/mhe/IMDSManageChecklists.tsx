"use client"

import * as React from "react"
import { useEffect } from "react"
import { useParams } from "react-router"
import { Plus, Pencil, ChevronLeft, ChevronRight as ChevronRightIcon, Wrench, ClipboardList, Lock } from "lucide-react"
import { supabase } from "../../supabase-client"
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

type Part = { id: string; name: string; isActive: boolean; requiresMheStart?: boolean }
type ChecklistItem = { id: string; name: string; isActive: boolean; formData?: ChecklistForm }

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

const conditionMeta = [
  {
    key: "red"   as const,
    label: "Red — Critical",
    color: "#dc2626",
    dot: "#ef4444",
    activeBg: "rgba(220,38,38,0.06)",
    placeholder: "Describe the critical condition...",
  },
  {
    key: "amber" as const,
    label: "Amber — Warning",
    color: "#b45309",
    dot: "#f59e0b",
    activeBg: "rgba(245,158,11,0.06)",
    placeholder: "Describe the warning condition...",
  },
  {
    key: "green" as const,
    label: "Green — Normal",
    color: "#059669",
    dot: "#10b981",
    activeBg: "rgba(16,185,129,0.06)",
    placeholder: "Describe the normal condition...",
  },
]

const taClass = "w-full resize-none rounded-[var(--radius)] text-[var(--foreground)] text-[length:var(--text-sm)] placeholder:text-[var(--muted-foreground)] px-3 py-2.5 outline-none border border-[var(--border)] focus:border-[#9ca3af] transition-colors bg-[var(--background)]"

function ConditionTabs({
  value,
  onChange,
}: {
  value: { red: ConditionBlock; amber: ConditionBlock; green: ConditionBlock }
  onChange: (key: "red" | "amber" | "green", v: ConditionBlock) => void
}) {
  const [active, setActive] = React.useState<"red" | "amber" | "green">("red")
  const tab = conditionMeta.find(t => t.key === active)!
  const cur = value[active]
  const filled = (b: ConditionBlock) => b.description.trim().length > 0 || b.action.trim().length > 0

  return (
    <div className="flex-1 flex flex-col gap-5 min-h-0">

      {/* Segmented control */}
      <div
        className="flex shrink-0 gap-1 p-1 rounded-[var(--radius)]"
        style={{ background: "var(--muted)" }}
      >
        {conditionMeta.map(t => {
          const isActive = t.key === active
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className="flex flex-1 items-center justify-center gap-2 py-2 px-4 rounded-[calc(var(--radius)+1px)] text-[13px] font-medium transition-all"
              style={{
                background: isActive ? "var(--card)" : "transparent",
                color: isActive ? t.color : "var(--muted-foreground)",
                boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
              }}
            >
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: t.dot }} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Fields — fill remaining height evenly */}
      <div className="flex-1 flex flex-col gap-5 min-h-0">
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          <Label className="text-[length:var(--text-sm)] text-[var(--foreground)] shrink-0">Description</Label>
          <textarea
            placeholder={tab.placeholder}
            value={cur.description}
            onChange={e => onChange(active, { ...cur, description: e.target.value })}
            className={`${taClass} flex-1 min-h-0`}
          />
        </div>
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          <Label className="text-[length:var(--text-sm)] text-[var(--foreground)] shrink-0">Action Required</Label>
          <textarea
            placeholder="What action should be taken..."
            value={cur.action}
            onChange={e => onChange(active, { ...cur, action: e.target.value })}
            className={`${taClass} flex-1 min-h-0`}
          />
        </div>
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

  // ── load from Supabase on mount ──
  useEffect(() => {
    if (!typeId) return
    async function load() {
      const { data: partsData, error: partsError } = await supabase
        .from("mhe_parts")
        .select("*")
        .eq("type_id", typeId)
        .order("created_at", { ascending: true })

      if (partsError) {
        console.error("Load parts error:", partsError)
        toast.error("Failed to load parts: " + partsError.message)
        return
      }

      console.log("Loaded parts from Supabase:", partsData)

      if (!partsData || partsData.length === 0) {
        // First visit — seed fallback data into Supabase so it persists
        const fallbackParts = getFallbackParts(typeId)
        const fallbackChecklists = getFallbackChecklists(typeId)
        if (fallbackParts.length > 0) {
          await supabase.from("mhe_parts").insert(
            fallbackParts.map(p => ({
              id: p.id,
              type_id: typeId,
              name: p.name,
              is_active: p.isActive,
              requires_mhe_start: p.requiresMheStart ?? false,
            }))
          )
          const allItems = Object.entries(fallbackChecklists).flatMap(([partId, items]) =>
            items.map(item => ({
              id: item.id,
              part_id: partId,
              type_id: typeId,
              name: item.name,
              is_active: item.isActive,
              form_data: item.formData ?? null,
            }))
          )
          if (allItems.length > 0) {
            await supabase.from("mhe_checklist_items").insert(allItems)
          }
        }
        return
      }

      const loadedParts: Part[] = partsData.map(p => ({
        id: p.id,
        name: p.name,
        isActive: p.is_active,
        requiresMheStart: p.requires_mhe_start,
      }))
      setParts(loadedParts)
      setSelectedPartId(loadedParts[0]?.id ?? "")

      const { data: itemsData, error: itemsError } = await supabase
        .from("mhe_checklist_items")
        .select("*")
        .eq("type_id", typeId)
        .order("created_at", { ascending: true })

      if (itemsError) {
        console.error("Load checklists error:", itemsError)
        return
      }

      if (itemsData) {
        const map: Record<string, ChecklistItem[]> = {}
        for (const item of itemsData) {
          if (!map[item.part_id]) map[item.part_id] = []
          map[item.part_id].push({
            id: item.id,
            name: item.name,
            isActive: item.is_active,
            formData: item.form_data ?? undefined,
          })
        }
        setChecklists(map)
      }
    }
    load()
  }, [typeId])
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)

  // ── checklist sheet ──
  const [checklistSheetOpen, setChecklistSheetOpen] = React.useState(false)
  const [checklistForm, setChecklistForm] = React.useState<ChecklistForm>(emptyForm)
  const [editingChecklistId, setEditingChecklistId] = React.useState<string | null>(null)

  // ── add part sheet ──
  const [partSheetOpen, setPartSheetOpen] = React.useState(false)
  const [newPartName, setNewPartName] = React.useState("")

  // ── edit part dialog ──
  const [editPartDialogOpen, setEditPartDialogOpen] = React.useState(false)
  const [editingPartId, setEditingPartId] = React.useState<string | null>(null)
  const [editPartName, setEditPartName] = React.useState("")
  const [editPartRequiresMhe, setEditPartRequiresMhe] = React.useState(false)

  // ── derived ──
  const selectedPart = parts.find(p => p.id === selectedPartId)
  const activeChecklists = checklists[selectedPartId] ?? []
  const totalRows = activeChecklists.length
  const totalChecklistsAcrossAll = parts.reduce((acc, p) => acc + (checklists[p.id]?.length ?? 0), 0)
  const activeChecklistsAcrossAll = parts.reduce((acc, p) => acc + (checklists[p.id]?.filter(c => c.isActive).length ?? 0), 0)
  const pagedRows = activeChecklists.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  // ── handlers ──
  async function togglePart(partId: string, val: boolean) {
    setParts(prev => prev.map(p => p.id === partId ? { ...p, isActive: val } : p))
    await supabase.from("mhe_parts").update({ is_active: val }).eq("id", partId)
  }

  async function toggleChecklist(itemId: string, val: boolean) {
    setChecklists(prev => ({
      ...prev,
      [selectedPartId]: (prev[selectedPartId] ?? []).map(c =>
        c.id === itemId ? { ...c, isActive: val } : c
      ),
    }))
    await supabase.from("mhe_checklist_items").update({ is_active: val }).eq("id", itemId)
  }

  async function handleSaveChecklist() {
    if (!checklistForm.title.trim()) {
      toast.error("Checklist title is required")
      return
    }
    if (editingChecklistId) {
      setChecklists(prev => ({
        ...prev,
        [selectedPartId]: (prev[selectedPartId] ?? []).map(c =>
          c.id === editingChecklistId
            ? { ...c, name: checklistForm.title.trim(), formData: checklistForm }
            : c
        ),
      }))
      await supabase
        .from("mhe_checklist_items")
        .update({ name: checklistForm.title.trim(), form_data: checklistForm })
        .eq("id", editingChecklistId)
      toast.success("Checklist item updated")
    } else {
      const id = `c${Date.now()}`
      setChecklists(prev => ({
        ...prev,
        [selectedPartId]: [...(prev[selectedPartId] ?? []), { id, name: checklistForm.title.trim(), isActive: true, formData: checklistForm }],
      }))
      await supabase.from("mhe_checklist_items").insert({
        id,
        part_id: selectedPartId,
        type_id: typeId,
        name: checklistForm.title.trim(),
        is_active: true,
        form_data: checklistForm,
      })
      toast.success("Checklist item added")
    }
    setChecklistSheetOpen(false)
    setChecklistForm(emptyForm())
    setEditingChecklistId(null)
  }

  async function handleSavePart() {
    if (!newPartName.trim()) {
      toast.error("Part name is required")
      return
    }
    const id = `p${Date.now()}`
    const { error } = await supabase.from("mhe_parts").insert({
      id,
      type_id: typeId,
      name: newPartName.trim(),
      is_active: true,
      requires_mhe_start: false,
    })
    if (error) {
      console.error("Insert part error:", error)
      toast.error("Failed to save part: " + error.message)
      return
    }
    setParts(prev => [...prev, { id, name: newPartName.trim(), isActive: true }])
    setChecklists(prev => ({ ...prev, [id]: [] }))
    setSelectedPartId(id)
    setPageIndex(0)
    toast.success("Part added")
    setPartSheetOpen(false)
    setNewPartName("")
  }

  async function handleUpdatePart() {
    if (!editPartName.trim()) {
      toast.error("Part name is required")
      return
    }
    setParts(prev => prev.map(p =>
      p.id === editingPartId
        ? { ...p, name: editPartName.trim(), requiresMheStart: editPartRequiresMhe }
        : p
    ))
    await supabase
      .from("mhe_parts")
      .update({ name: editPartName.trim(), requires_mhe_start: editPartRequiresMhe })
      .eq("id", editingPartId)
    toast.success("Part updated")
    setEditPartDialogOpen(false)
    setEditingPartId(null)
    setEditPartName("")
    setEditPartRequiresMhe(false)
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
          <div className="flex items-center justify-between px-4 border-b border-[var(--border)]" style={{ minHeight: "57px" }}>
            <span className="text-[length:var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
              Parts
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--muted)]/60">
                <span className="text-[11px] font-normal text-[var(--foreground)]">{parts.length}</span>
                <span className="text-[11px] text-[var(--muted-foreground)]">parts</span>
              </div>
              <div className="w-px h-3 bg-[var(--border)]" />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--muted)]/60">
                <span className="text-[11px] font-normal text-blue-400">{activeChecklistsAcrossAll}</span>
                <span className="text-[11px] text-[var(--muted-foreground)]">/ {totalChecklistsAcrossAll} checklists</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
            {parts.map(part => (
              <div
                key={part.id}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-lg)] transition-colors cursor-pointer ${
                  selectedPartId === part.id
                    ? "border border-blue-500 bg-[var(--muted)]/40"
                    : "border border-transparent hover:bg-[var(--muted)]/30"
                }`}
                onClick={() => { setSelectedPartId(part.id); setPageIndex(0) }}
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)] truncate">
                    {part.name}
                  </span>
                  {(() => {
                    const total = checklists[part.id]?.length ?? 0
                    const active = checklists[part.id]?.filter(c => c.isActive).length ?? 0
                    return (
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        <span className="text-blue-400 font-normal">{active}</span>
                        {" / "}{total} checklist{total !== 1 ? "s" : ""}
                      </span>
                    )
                  })()}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Switch
                    checked={part.isActive}
                    onCheckedChange={val => togglePart(part.id, val)}
                    onClick={e => e.stopPropagation()}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-[var(--muted)] scale-90"
                  />
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      setEditingPartId(part.id)
                      setEditPartName(part.name)
                      setEditPartRequiresMhe(part.requiresMheStart ?? false)
                      setEditPartDialogOpen(true)
                    }}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-0.5 rounded"
                  >
                    <Pencil strokeWidth={1.5} className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {parts.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 py-8 gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: "var(--muted)" }}>
                  <Wrench strokeWidth={1.5} className="h-5 w-5 text-[var(--muted-foreground)]" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--foreground)]">No parts yet</p>
                  <p className="text-[11px] text-[var(--muted-foreground)] text-center">Add your first part to start building checklists</p>
                </div>
              </div>
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
              onClick={() => { setChecklistForm(emptyForm()); setEditingChecklistId(null); setChecklistSheetOpen(true) }}
              disabled={parts.length === 0 || !selectedPart}
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-none text-[length:var(--text-sm)] px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus strokeWidth={1.5} className="h-3.5 w-3.5" />
              Add Checklist
            </Button>
          </div>

          {parts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: "var(--muted)" }}>
                <Lock strokeWidth={1.5} className="h-5 w-5 text-[var(--muted-foreground)]" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--foreground)]">No parts created yet</p>
                <p className="text-[11px] text-[var(--muted-foreground)] text-center">Add a part on the left first to start creating checklists</p>
              </div>
            </div>
          ) : (
          <>
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
                        <button
                          type="button"
                          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                          onClick={() => {
                            setChecklistForm(item.formData ?? { ...emptyForm(), title: item.name })
                            setEditingChecklistId(item.id)
                            setChecklistSheetOpen(true)
                          }}
                        >
                          <Pencil strokeWidth={1.5} className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3}>
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: "var(--muted)" }}>
                          <ClipboardList strokeWidth={1.5} className="h-5 w-5 text-[var(--muted-foreground)]" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--foreground)]">No checklist items</p>
                          <p className="text-[11px] text-[var(--muted-foreground)] text-center">Click "+ Add Checklist" to create your first item</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-3 px-4 border-t border-[var(--border)] bg-[var(--card)]" style={{ paddingTop: "14px", paddingBottom: "14px" }}>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-[11px] text-[var(--muted-foreground)]">Rows per page:</span>
              <Select value={`${pageSize}`} onValueChange={v => { setPageSize(Number(v)); setPageIndex(0) }}>
                <SelectTrigger className="h-8 w-[60px] border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] shadow-none text-[11px] px-2 rounded-[var(--radius-sm)]">
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
              <Button variant="ghost" className="h-8 w-8 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none disabled:opacity-30"
                onClick={() => setPageIndex(i => Math.max(0, i - 1))} disabled={pageIndex === 0}>
                <ChevronLeft strokeWidth={1.5} className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" className="h-8 w-8 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none disabled:opacity-30"
                onClick={() => setPageIndex(i => Math.min(totalPages - 1, i + 1))} disabled={pageIndex >= totalPages - 1}>
                <ChevronRightIcon strokeWidth={1.5} className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      {/* ── Add New Checklist Sheet ── */}
      <Sheet open={checklistSheetOpen} onOpenChange={v => { setChecklistSheetOpen(v); if (!v) { setEditingChecklistId(null); setChecklistForm(emptyForm()) } }}>
        <SheetContent
          side="right"
          className="w-[620px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0"
        >
          {/* Header */}
          <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
            <SheetTitle className="text-[length:var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
              {editingChecklistId ? "Edit Checklist" : "Add New Checklist"}
            </SheetTitle>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-hidden px-6 py-6 flex flex-col gap-8 min-h-0">

            {/* Checklist Details */}
            <div className="shrink-0 flex flex-col gap-4">
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
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              <h3 className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)] shrink-0">
                Condition Definitions
              </h3>

              <ConditionTabs
                value={{ red: checklistForm.red, amber: checklistForm.amber, green: checklistForm.green }}
                onChange={(key, v) => setChecklistForm(f => ({ ...f, [key]: v }))}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setChecklistSheetOpen(false); setEditingChecklistId(null); setChecklistForm(emptyForm()) }}
              className="border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveChecklist}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-none"
            >
              {editingChecklistId ? "Update Checklist" : "Save Checklist"}
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
              <Label className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)]">
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

      {/* ── Edit Part Dialog ── */}
      <Dialog open={editPartDialogOpen} onOpenChange={v => { setEditPartDialogOpen(v); if (!v) { setEditingPartId(null); setEditPartName(""); setEditPartRequiresMhe(false) } }}>
        <DialogContent className="sm:max-w-[520px] bg-[var(--card)] border-[var(--border)] shadow-none p-0 gap-0">
          <DialogHeader className="px-7 py-5 border-b border-[var(--border)]">
            <DialogTitle className="text-[length:var(--text-lg)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
              Edit Part
            </DialogTitle>
            <p className="text-[length:var(--text-sm)] text-[var(--muted-foreground)] mt-0.5">
              Update the part information below
            </p>
          </DialogHeader>

          <div className="px-7 py-7 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)]">
                Part Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., Hydraulic Pump"
                value={editPartName}
                onChange={e => setEditPartName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleUpdatePart()}
                className="h-9 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] text-[length:var(--text-sm)]"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)]">
                Requires MHE Start
              </Label>
              <Switch
                checked={editPartRequiresMhe}
                onCheckedChange={setEditPartRequiresMhe}
                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-[var(--muted)]"
              />
            </div>
          </div>

          <DialogFooter className="px-7 py-4 border-t border-[var(--border)] flex flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setEditPartDialogOpen(false); setEditingPartId(null); setEditPartName(""); setEditPartRequiresMhe(false) }}
              className="h-9 border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none text-[length:var(--text-sm)]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdatePart}
              className="h-9 bg-blue-600 hover:bg-blue-500 text-white shadow-none text-[length:var(--text-sm)]"
            >
              Update Part
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
