import * as React from "react"
import { useEffect } from "react"
import {
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Download,
  Upload as UploadIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  Check,
  FileText,
  Paperclip,
  Info,
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
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../../components/ui/command"
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

type EntityType = "MHE" | "Operator" | "Sensor"

interface DocumentRow {
  id: string
  name: string
  docType: string
  entityType: EntityType
  entityName: string
}

const DOCUMENT_TYPES = [
  "Maintenance Record", "Warranty Certificate", "Service Report", "Inspection Certificate", "Installation Certificate", "Other",
]

const MHE_OPTIONS = [
  "Test No Warranty Field", "MHE 09", "MHE 10", "MHE 08", "MHE 07", "MHE 06",
  "MHE 05", "MHE 04", "MHE 03", "MHE 02", "MHE 01",
]

const OPERATOR_OPTIONS = [
  "Anil Chavan", "Vishal Sawant", "Sunil Jadhav", "Deepak Pawar", "Nilesh Bhosale",
  "Rajesh Shinde", "Ganesh More", "Mahesh Gaikwad", "Prakash Joshi", "Sandeep Kulkarni",
]

const MHE_SENSORS: Record<string, string[]> = {
  "MHE 09": ["Reverse Assist"],
  "MHE 03": ["Speed"],
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_DOCS: DocumentRow[] = [
  { id: "d1",  name: "tess",                          docType: "Maintenance Record",   entityType: "Sensor", entityName: "LD-20121" },
  { id: "d2",  name: "Jetson Nano attachment1",        docType: "Warranty Certificate", entityType: "Sensor", entityName: "-" },
  { id: "d3",  name: "test",                           docType: "Maintenance Record",   entityType: "Sensor", entityName: "-" },
  { id: "d4",  name: "Installation Docdfghhghfghgfg",  docType: "Service Report",       entityType: "Sensor", entityName: "-" },
  { id: "d5",  name: "Installation Doc",               docType: "Service Report",       entityType: "Sensor", entityName: "-" },
  { id: "d6",  name: "Jetson Nano attachment3",        docType: "Warranty Certificate", entityType: "Sensor", entityName: "-" },
  { id: "d7",  name: "Jetson Nano attachment2",        docType: "Warranty Certificate", entityType: "Sensor", entityName: "-" },
  { id: "d8",  name: "Lidar attachment2",              docType: "Warranty Certificate", entityType: "Sensor", entityName: "-" },
  { id: "d9",  name: "360 Camera attachment1",         docType: "Warranty Certificate", entityType: "Sensor", entityName: "-" },
  { id: "d10", name: "Installation Doc",               docType: "Inspection Certificate", entityType: "Sensor", entityName: "-" },
]

// ─── Entity badge ────────────────────────────────────────────────────────────

function EntityTypeBadge({ type }: { type: EntityType }) {
  return (
    <Badge variant="outline" className="border-transparent font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 tracking-wide">
      {type.toUpperCase()}
    </Badge>
  )
}

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
          className="w-full h-9 justify-between font-normal border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)] disabled:opacity-60"
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

// ─── Field helpers ───────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  )
}

function SectionHeader({ icon: Icon, title, hint }: { icon: React.ElementType; title: string; hint: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
      <div className="flex flex-col">
        <span className="text-[length:var(--text-sm)] font-semibold text-[var(--foreground)]">{title}</span>
        <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{hint}</span>
      </div>
    </div>
  )
}

// ─── Upload Document Sheet ───────────────────────────────────────────────────

interface UploadForm {
  entityType: EntityType | ""
  entityValue: string
  sensorMhe: string
  sensorValue: string
  docType: string
  fileName: string
  description: string
  file: File | null
}

const emptyUploadForm = (): UploadForm => ({
  entityType: "", entityValue: "", sensorMhe: "", sensorValue: "",
  docType: "", fileName: "", description: "", file: null,
})

function UploadDocumentSheet({
  open, onClose, onSave,
}: {
  open: boolean; onClose: () => void; onSave: (row: Omit<DocumentRow, "id">) => void
}) {
  const [form, setForm] = React.useState<UploadForm>(emptyUploadForm())

  useEffect(() => { if (open) setForm(emptyUploadForm()) }, [open])

  function set<K extends keyof UploadForm>(k: K, v: UploadForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  const entitySelected = form.entityType === "Sensor" ? !!form.sensorValue : !!form.entityValue
  const canSave = form.entityType && entitySelected && form.docType && form.fileName.trim() && form.file

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      set("file", f)
      if (!form.fileName) set("fileName", f.name.replace(/\.[^.]+$/, ""))
    }
  }

  function handleSave() {
    if (!canSave) { toast.error("Please fill all required fields"); return }
    const entityName = form.entityType === "Sensor" ? form.sensorValue : form.entityValue
    onSave({
      name: form.fileName.trim(),
      docType: form.docType,
      entityType: form.entityType as EntityType,
      entityName,
    })
  }

  const sensorOptions = form.sensorMhe ? (MHE_SENSORS[form.sensorMhe] ?? []) : []

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col bg-[var(--card)] border-l border-[var(--border)] gap-0">
        <SheetHeader className="px-5 py-4 border-b border-[var(--border)]">
          <SheetTitle className="text-[length:var(--text-base)] font-semibold text-[var(--foreground)]">Upload Document</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

          {/* Attach To */}
          <div className="flex flex-col gap-3">
            <SectionHeader icon={Paperclip} title="Attach To" hint="Select the entity this document belongs to" />

            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Entity Type</FieldLabel>
              <Select
                value={form.entityType}
                onValueChange={v => setForm(f => ({ ...emptyUploadForm(), entityType: v as EntityType, docType: f.docType, fileName: f.fileName, description: f.description, file: f.file }))}
              >
                <SelectTrigger className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MHE">MHE</SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                  <SelectItem value="Sensor">Sensor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.entityType === "MHE" && (
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Entity</FieldLabel>
                <SearchableSelect
                  value={form.entityValue}
                  onChange={v => set("entityValue", v)}
                  options={MHE_OPTIONS}
                  placeholder="Select MHE"
                  searchPlaceholder="Search MHE..."
                />
              </div>
            )}

            {form.entityType === "Operator" && (
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Entity</FieldLabel>
                <SearchableSelect
                  value={form.entityValue}
                  onChange={v => set("entityValue", v)}
                  options={OPERATOR_OPTIONS}
                  placeholder="Select operator"
                  searchPlaceholder="Search operator..."
                />
              </div>
            )}

            {form.entityType === "Sensor" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel required>MHE</FieldLabel>
                  <SearchableSelect
                    value={form.sensorMhe}
                    onChange={v => { set("sensorMhe", v); set("sensorValue", "") }}
                    options={MHE_OPTIONS}
                    placeholder="Select MHE"
                    searchPlaceholder="Search MHE..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel required>Sensor</FieldLabel>
                  <SearchableSelect
                    value={form.sensorValue}
                    onChange={v => set("sensorValue", v)}
                    options={sensorOptions}
                    placeholder="Select sensor"
                    searchPlaceholder="Search sensor..."
                    disabled={!form.sensorMhe}
                  />
                </div>
              </>
            )}
          </div>

          {/* Document Details */}
          <div className="flex flex-col gap-3 pt-1 border-t border-[var(--border)]">
            <div className="pt-4">
              <SectionHeader icon={Info} title="Document Details" hint="Type, name, and optional description" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Document Type</FieldLabel>
              <Select value={form.docType} onValueChange={v => set("docType", v)} disabled={!form.entityType}>
                <SelectTrigger className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none disabled:opacity-60">
                  <SelectValue placeholder={form.entityType ? "Select document type" : "Select entity first"} />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>File Name</FieldLabel>
              <Input
                placeholder="Enter file name"
                value={form.fileName}
                onChange={e => set("fileName", e.target.value)}
                className="h-9 border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Description <span className="font-normal text-[11px]" style={{ color: "var(--muted-foreground)" }}>(optional)</span></FieldLabel>
              <textarea
                rows={3}
                placeholder="Add a short description"
                value={form.description}
                onChange={e => set("description", e.target.value)}
                className="w-full rounded-[var(--radius)] border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              />
            </div>
          </div>

          {/* File */}
          <div className="flex flex-col gap-3 pt-1 border-t border-[var(--border)]">
            <div className="pt-4">
              <SectionHeader icon={UploadIcon} title="File" hint="PDF, DOC, or image up to 10 MB" />
            </div>
            <label className="flex flex-col items-center justify-center gap-2 py-10 rounded-[var(--radius)] border-2 border-dashed cursor-pointer hover:bg-[var(--muted)]/30 transition-colors" style={{ borderColor: "var(--border)" }}>
              <input type="file" accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={handleFilePick} />
              <UploadIcon className="w-6 h-6" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
              <span className="text-[13px] font-medium text-[var(--foreground)]">
                {form.file ? form.file.name : "Click to upload or drag and drop"}
              </span>
              <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>PDF, DOC, Images (Max 10 MB)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)] shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="border-[var(--border)] bg-transparent shadow-none">Cancel</Button>
          <Button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white shadow-none">Upload</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Entity filter dropdown ──────────────────────────────────────────────────

function EntityFilter({ value, onChange }: { value: EntityType | "All"; onChange: (v: EntityType | "All") => void }) {
  const options: (EntityType | "All")[] = ["All", "MHE", "Operator", "Sensor"]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 justify-between gap-2 border-[var(--border)] bg-[var(--background)] shadow-none text-[length:var(--text-sm)] min-w-[150px]"
        >
          {value === "All" ? "All Entities" : value}
          <ChevronDown className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map(o => (
          <DropdownMenuItem key={o} onClick={() => onChange(o)} className="justify-between">
            {o === "All" ? "All Entities" : o}
            {value === o && <Check className="w-3.5 h-3.5" strokeWidth={1.5} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function Documents() {
  const sidebar = useSidebar()
  useEffect(() => { sidebar?.setSubPageTitle("Documents") }, [])

  const [docs, setDocs] = React.useState<DocumentRow[]>(MOCK_DOCS)
  const [search, setSearch] = React.useState("")
  const [entityFilter, setEntityFilter] = React.useState<EntityType | "All">("All")
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<DocumentRow | null>(null)

  const filtered = docs.filter(d => {
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.docType.toLowerCase().includes(q)
    const matchesEntity = entityFilter === "All" || d.entityType === entityFilter
    return matchesSearch && matchesEntity
  })

  const totalRows = filtered.length
  const pagedRows = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  function handleUpload(row: Omit<DocumentRow, "id">) {
    setDocs(prev => [{ id: `d${Date.now()}`, ...row }, ...prev])
    toast.success("Document uploaded")
    setUploadOpen(false)
  }

  function handleDelete() {
    if (!deleteTarget) return
    setDocs(prev => prev.filter(d => d.id !== deleteTarget.id))
    toast.success("Document deleted")
    setDeleteTarget(null)
  }

  return (
    <div className="h-full flex flex-col bg-[var(--background)] p-6 gap-4">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" strokeWidth={1.5} style={{ color: "var(--muted-foreground)" }} />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPageIndex(0) }}
              className="h-9 pl-9 border-[var(--border)] bg-[var(--card)] shadow-none text-[length:var(--text-sm)]"
            />
          </div>
          <EntityFilter value={entityFilter} onChange={v => { setEntityFilter(v); setPageIndex(0) }} />
        </div>
        <Button onClick={() => setUploadOpen(true)} className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-none shrink-0">
          <UploadIcon className="w-4 h-4" strokeWidth={1.5} />
          Upload Document
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Document Name</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Document Type</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Entity Type</TableHead>
                <TableHead className="px-5 h-10 text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Entity Name</TableHead>
                <TableHead className="px-5 h-10 w-[70px] text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedRows.length > 0 ? pagedRows.map(d => (
                <TableRow key={d.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20">
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 shrink-0" strokeWidth={1.5} style={{ color: "var(--primary)" }} />
                      <span className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">{d.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{d.docType}</TableCell>
                  <TableCell className="px-5 py-3"><EntityTypeBadge type={d.entityType} /></TableCell>
                  <TableCell className="px-5 py-3 text-[length:var(--text-sm)] text-[var(--foreground)]">{d.entityName}</TableCell>
                  <TableCell className="px-5 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                          <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" strokeWidth={1.5} /> Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(d)}>
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
                      <p className="text-[length:var(--text-sm)] font-medium text-[var(--foreground)]">No documents found</p>
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

      <UploadDocumentSheet open={uploadOpen} onClose={() => setUploadOpen(false)} onSave={handleUpload} />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
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
