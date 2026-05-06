"use client"

import * as React from "react"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  ArrowUpDown,
  Trash2,
  Eye,
  Pencil,
  Power,
  Settings,
  Info,
  Check,
  X as XIcon
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

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Switch } from "../ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "sonner"
import { DashboardTable } from "./DashboardTable"
import { EvaluationConfigDrawer } from "./EvaluationConfigDrawer"
import { ThresholdConfigDrawer } from "./ThresholdConfigDrawer"
import { testData, TestItem as ImportedTestItem } from "./test-data"

// --- Type Definitions ---

export type ElementItem = {
  internalId: string // unique identifier for React keys
  elementId: string // Display ID (e.g. BOQ-APR25)
  elementName: string
  testType?: number // Optional numeric test classification (ID)
  testTypeCount?: number // Number of test types assigned
  category: "Structural" | "General"
  isActive: boolean
}

export type TestItem = ImportedTestItem

// --- Mock Data ---

const allowedElements = [
  "Baseplate",
  "Upright",
  "Beam",
  "Bracing",
  "Unitstopper",
  "Runspacer",
  "Tiebeam",
  "Pallet",
  "Safety Accessory"
]

const inspectionData: ElementItem[] = Array.from({ length: 25 }).map((_, i) => {
  const categories = ["Structural", "General"] as const
  return {
    internalId: `insp-${i}`,
    elementId: `BOQ-APR25-${(100 + i).toString().padStart(3, '0')}`,
    elementName: allowedElements[i % allowedElements.length],
    category: categories[i % categories.length],
    isActive: i % 5 !== 0, // Mostly active
  }
})

// Testing data now uses the imported testData from test-data.ts
// No need for testingData mock data anymore

// --- Main Component ---

export function RulesAndAction() {
  // Shared State
  const [activeTab, setActiveTab] = React.useState("inspection")

  // Inspection Table State
  const [inspectionSorting, setInspectionSorting] = React.useState<SortingState>([])
  const [inspectionFilter, setInspectionFilter] = React.useState("")
  const [inspectionPagination, setInspectionPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [inspectionItems, setInspectionItems] = React.useState<ElementItem[]>(inspectionData)

  // Testing Table State
  const [testingSorting, setTestingSorting] = React.useState<SortingState>([])
  const [testingFilter, setTestingFilter] = React.useState("")
  const [testingPagination, setTestingPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [testingItems, setTestingItems] = React.useState<TestItem[]>(testData)

  // Modal States
  const [itemToDelete, setItemToDelete] = React.useState<{ id: string, name: string, type: 'inspection' | 'testing' } | null>(null)
  const [statusChangeItem, setStatusChangeItem] = React.useState<{ item: ElementItem | TestItem, type: 'inspection' | 'testing', newValue: boolean } | null>(null)
  const [isEvaluationConfigOpen, setIsEvaluationConfigOpen] = React.useState(false)
  const [selectedTestForConfig, setSelectedTestForConfig] = React.useState<TestItem | null>(null)
  const [isThresholdConfigOpen, setIsThresholdConfigOpen] = React.useState(false)
  const [selectedTestForThreshold, setSelectedTestForThreshold] = React.useState<TestItem | null>(null)
  
  const [dialogState, setDialogState] = React.useState<{
    open: boolean
    mode: 'create' | 'edit'
    type: 'inspection' | 'testing'
    item?: ElementItem
  }>({
    open: false,
    mode: 'create',
    type: 'inspection'
  })
  
  const [formData, setFormData] = React.useState<{
    elementId: string
    elementName: string
    category: "Structural" | "General"
    testType: string
  }>({
    elementId: "",
    elementName: "",
    category: "Structural",
    testType: ""
  })

  // Handlers
  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'inspection') {
        setInspectionItems(prev => prev.filter(i => i.internalId !== itemToDelete.id))
      } else {
        setTestingItems(prev => prev.filter(i => i.internalId !== itemToDelete.id))
      }
      toast.success(`${itemToDelete.type === 'inspection' ? 'Inspection rule' : 'Test'} deleted successfully`)
      setItemToDelete(null)
    }
  }

  const handleStatusConfirm = () => {
    if (statusChangeItem) {
      const { item, type, newValue } = statusChangeItem
      
      if (type === 'inspection') {
        setInspectionItems(prev => prev.map(i => i.internalId === item.internalId ? { ...i, isActive: newValue } : i))
      } else {
        setTestingItems(prev => prev.map(i => i.internalId === item.internalId ? { ...i, isActive: newValue } : i))
      }
      
      // Access the correct ID field based on type
      const itemId = 'elementId' in item ? item.elementId : item.testId
      toast.success(`Status updated for ${itemId}`)
      setStatusChangeItem(null)
    }
  }

  const openCreateDialog = (type: 'inspection' | 'testing') => {
    setDialogState({ open: true, mode: 'create', type })
    setFormData({
      elementId: "",
      elementName: "",
      category: "Structural",
      testType: ""
    })
  }

  const openEditDialog = (item: ElementItem, type: 'inspection' | 'testing') => {
    setDialogState({ open: true, mode: 'edit', type, item })
    setFormData({
      elementId: item.elementId,
      elementName: item.elementName,
      category: item.category,
      testType: item.testType !== undefined && item.testType !== null ? item.testType.toString() : ""
    })
  }
  
  const handleSave = () => {
    const newItem: ElementItem = {
      internalId: dialogState.mode === 'create' ? `${dialogState.type}-${Date.now()}` : dialogState.item!.internalId,
      elementId: formData.elementId || "NEW-ID", // Fallback for demo
      elementName: formData.elementName || "New Item", // Fallback for demo
      category: formData.category,
      isActive: dialogState.mode === 'create' ? true : dialogState.item!.isActive,
      testType: dialogState.type === 'testing' && formData.testType ? parseInt(formData.testType) : undefined,
      testTypeCount: dialogState.mode === 'create' ? 0 : dialogState.item?.testTypeCount // Preserve existing count on edit, 0 on create
    }

    if (dialogState.type === 'inspection') {
      if (dialogState.mode === 'create') {
        setInspectionItems(prev => [newItem, ...prev])
      } else {
        setInspectionItems(prev => prev.map(i => i.internalId === newItem.internalId ? newItem : i))
      }
    } else {
      if (dialogState.mode === 'create') {
        setTestingItems(prev => [newItem, ...prev])
      } else {
        setTestingItems(prev => prev.map(i => i.internalId === newItem.internalId ? newItem : i))
      }
    }
    
    setDialogState(prev => ({ ...prev, open: false }))
    toast.success(`${dialogState.type === 'inspection' ? 'Inspection element' : 'Test'} ${dialogState.mode === 'create' ? 'created' : 'updated'} successfully`)
  }

  // Column Definitions (Shared structure, reused logic)
  const createColumns = (type: 'inspection' | 'testing'): ColumnDef<ElementItem>[] => [
    {
      accessorKey: "elementId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Element ID
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-[var(--font-weight-medium)] text-[var(--foreground)]">
          {row.getValue("elementId")}
        </div>
      ),
    },
    {
      accessorKey: "elementName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Element Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-[var(--foreground)] font-[var(--font-weight-medium)]">
          {row.getValue("elementName")}
        </div>
      ),
    },
    ...(type === 'testing' ? [{
      accessorKey: "testTypeCount",
      header: ({ column }: { column: any }) => (
        <div className="flex justify-center w-full">
          <Button
            variant="ghost"
            className="h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Test Type Assigned
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      ),
      cell: ({ row }: { row: any }) => {
        const val = row.getValue("testTypeCount")
        // Empty State Rules: If no test types are assigned -> display 0. Do NOT display "—"
        const displayVal = (val === undefined || val === null) ? 0 : val
        return (
          <div className="text-center text-[var(--foreground)] font-[var(--font-weight-medium)]">
            {displayVal}
          </div>
        )
      },
    }] : []),
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        
        // Semantic coloring based on category name
        // Structural: Purple/Indigo (using chart-5 variable which is purple)
        // General: Green (using chart-2 variable which is green)
        let badgeClass = "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
        
        if (category === "Structural") {
          badgeClass = "bg-[var(--chart-5)]/15 text-[var(--chart-5)] hover:bg-[var(--chart-5)]/25"
        } else if (category === "General") {
          badgeClass = "bg-[var(--chart-2)]/15 text-[var(--chart-2)] hover:bg-[var(--chart-2)]/25"
        }
        
        return (
          <Badge variant="outline" className={`${badgeClass} shadow-none border-0`}>
            {category}
          </Badge>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: () => <div className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">Status</div>,
      cell: ({ row }) => {
        const isActive = row.original.isActive
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setStatusChangeItem({ item: row.original, type, newValue: checked })}
              className="data-[state=checked]:bg-[var(--primary)] data-[state=unchecked]:bg-[var(--muted)]"
            />
            <span className={`text-[length:var(--text-sm)] ${isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              className="h-8 w-8 p-0 bg-transparent text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
              style={{ borderRadius: "var(--radius)" }}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--popover)] border-[var(--border)] shadow-none">
            <DropdownMenuItem 
              onClick={() => openEditDialog(row.original, type)}
              className="focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]"
            >
              <Pencil className="mr-2 h-4 w-4 text-[var(--muted-foreground)]" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => toast.info(`Viewing details for ${row.original.elementId}`)}
              className="focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]"
            >
              <Eye className="mr-2 h-4 w-4 text-[var(--muted-foreground)]" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setStatusChangeItem({ item: row.original, type, newValue: !row.original.isActive })}
              className="focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]"
            >
              <Power className="mr-2 h-4 w-4 text-[var(--muted-foreground)]" />
              {row.original.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[var(--border)]" />
            <DropdownMenuItem 
              className="text-[var(--destructive)] focus:text-[var(--destructive)] focus:bg-[var(--destructive)]/10"
              onClick={() => setItemToDelete({ id: row.original.internalId, name: row.original.elementId, type })}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Testing Column Definitions for TestItem
  const createTestingColumns = (): ColumnDef<TestItem>[] => [
    {
      accessorKey: "testId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Test ID
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-[var(--font-weight-medium)] text-[var(--foreground)]">
          {row.getValue("testId")}
        </div>
      ),
    },
    {
      accessorKey: "testName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Test Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const hasMetadata = row.original.metadataChips || row.original.description || row.original.instrumentSupport
        
        if (!hasMetadata) {
          return (
            <div className="text-[var(--foreground)] font-[var(--font-weight-medium)]">
              {row.getValue("testName")}
            </div>
          )
        }
        
        return (
          <TooltipProvider>
            <div className="flex flex-col gap-[var(--spacing-2)]">
              <div className="flex items-center gap-[var(--spacing-2)]">
                <span className="text-[var(--foreground)] font-[var(--font-weight-medium)]">
                  {row.getValue("testName")}
                </span>
                {row.original.description && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-[var(--muted-foreground)] cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent 
                      className="bg-[var(--popover)] border-[var(--border)] text-[var(--popover-foreground)] max-w-[300px]"
                      style={{ fontSize: "var(--text-xs)" }}
                    >
                      <p>{row.original.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "testScope",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent text-[var(--muted-foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Test Scope
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const scope = row.getValue("testScope") as string
        
        // Semantic coloring based on scope
        // Global: Blue (using chart-1 variable)
        // Local: Purple (using chart-5 variable)
        let badgeClass = "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
        
        if (scope === "Global") {
          badgeClass = "bg-[var(--chart-1)]/15 text-[var(--chart-1)] hover:bg-[var(--chart-1)]/25"
        } else if (scope === "Local") {
          badgeClass = "bg-[var(--chart-5)]/15 text-[var(--chart-5)] hover:bg-[var(--chart-5)]/25"
        }
        
        return (
          <Badge variant="outline" className={`${badgeClass} shadow-none border-0`}>
            {scope}
          </Badge>
        )
      },
    },
    {
      accessorKey: "linkedElementTypes",
      header: () => <div className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">Linked Element Types</div>,
      cell: ({ row }) => {
        const elementTypesArray = row.original.linkedElementTypesArray
        const elementTypesText = row.getValue("linkedElementTypes") as string
        
        // If no element types array or empty, show "—"
        if (!elementTypesArray || elementTypesArray.length === 0 || elementTypesText === "—") {
          return (
            <div className="text-[var(--muted-foreground)] font-[var(--font-weight-medium)]">
              —
            </div>
          )
        }
        
        // Display chips for linked element types
        return (
          <div className="flex flex-wrap gap-[var(--spacing-2)]">
            {elementTypesArray.map((elementType, index) => (
              <span
                key={`${row.original.internalId}-${elementType}-${index}`}
                className="inline-flex items-center px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--muted)] text-[length:var(--text-xs)] font-[var(--font-weight-medium)] text-[var(--foreground)]"
              >
                {elementType}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: () => <div className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">Status</div>,
      cell: ({ row }) => {
        const isActive = row.original.isActive
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setStatusChangeItem({ item: row.original, type: 'testing', newValue: checked })}
              className="data-[state=checked]:bg-[var(--primary)] data-[state=unchecked]:bg-[var(--muted)]"
            />
            <span className={`text-[length:var(--text-sm)] ${isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 bg-transparent text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
              style={{ borderRadius: "var(--radius)" }}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--popover)] border-[var(--border)] shadow-none">
            <DropdownMenuItem 
              onClick={() => {
                if (process.env.NODE_ENV === 'development') {
                  console.log("🔵 Opening evaluation config for:", row.original)
                  console.log("🔍 linkedElementTypesArray:", row.original.linkedElementTypesArray)
                  console.log("🔍 ruleKey:", row.original.ruleKey)
                  console.log("🔍 engineType:", row.original.engineType)
                  console.log("🔍 Full test object:", JSON.stringify(row.original, null, 2))
                }
                setSelectedTestForConfig(row.original)
                setIsEvaluationConfigOpen(true)
              }}
              className="focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]"
            >
              <Settings className="mr-2 h-4 w-4 text-[var(--muted-foreground)]" />
              Configure Evaluation
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                console.log("🔵 Opening threshold config for:", row.original)
                console.log("🔍 linkedElementTypesArray:", row.original.linkedElementTypesArray)
                console.log("🔍 ruleKey:", row.original.ruleKey)
                console.log("🔍 engineType:", row.original.engineType)
                console.log("🔍 Full test object:", JSON.stringify(row.original, null, 2))
                setSelectedTestForThreshold(row.original)
                setIsThresholdConfigOpen(true)
              }}
              className="focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]"
            >
              <Settings className="mr-2 h-4 w-4 text-[var(--muted-foreground)]" />
              Configure Thresholds
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setStatusChangeItem({ item: row.original, type: 'testing', newValue: !row.original.isActive })}
              className="focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]"
            >
              <Power className="mr-2 h-4 w-4 text-[var(--muted-foreground)]" />
              {row.original.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[var(--border)]" />
            <DropdownMenuItem 
              className="text-[var(--destructive)] focus:text-[var(--destructive)] focus:bg-[var(--destructive)]/10"
              onClick={() => setItemToDelete({ id: row.original.internalId, name: row.original.testId, type: 'testing' })}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const inspectionColumns = React.useMemo(() => createColumns('inspection'), [inspectionItems])
  const testingColumns = React.useMemo(() => createTestingColumns(), [testingItems])

  // Table Instances
  const inspectionTable = useReactTable({
    data: inspectionItems,
    columns: inspectionColumns,
    onSortingChange: setInspectionSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setInspectionFilter,
    onPaginationChange: setInspectionPagination,
    state: {
      sorting: inspectionSorting,
      globalFilter: inspectionFilter,
      pagination: inspectionPagination,
    },
  })

  const testingTable = useReactTable({
    data: testingItems,
    columns: testingColumns,
    onSortingChange: setTestingSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setTestingFilter,
    onPaginationChange: setTestingPagination,
    state: {
      sorting: testingSorting,
      globalFilter: testingFilter,
      pagination: testingPagination,
    },
  })

  return (
    <div className="h-full flex flex-col space-y-6 bg-[var(--background)]">
      <Tabs defaultValue="inspection" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col p-[24px]">
        {/* Tabs List */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <TabsList className="bg-[var(--muted)] p-1 rounded-[var(--radius)]">
            <TabsTrigger 
              value="inspection" 
              className="gap-2 px-4 py-2 text-[length:var(--text-sm)] font-[var(--font-weight-medium)] rounded-[var(--radius-sm)] shadow-none data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] transition-colors"
            >
              Inspection
            </TabsTrigger>
            <TabsTrigger 
              value="testing" 
              className="gap-2 px-4 py-2 text-[length:var(--text-sm)] font-[var(--font-weight-medium)] rounded-[var(--radius-sm)] shadow-none data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] transition-colors"
            >
              Testing
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="inspection" className="flex-1 mt-0 flex flex-col min-h-0 focus-visible:ring-0 outline-none">
          <DashboardTable
            table={inspectionTable}
            totalColumns={inspectionColumns.length}
            toolbar={
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                <div className="relative w-full sm:w-[350px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <Input 
                    placeholder="Search inspections..." 
                    value={inspectionFilter ?? ""}
                    onChange={(event) => setInspectionFilter(event.target.value)}
                    className="pl-9 h-9 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
                  />
                </div>
                <Button type="button" className="h-9 gap-2 w-full sm:w-auto bg-[var(--primary)] text-[var(--primary-foreground)] shadow-none hover:bg-[var(--primary)]/90" onClick={() => openCreateDialog('inspection')}>
                  <Plus className="h-4 w-4" />
                  Add New Element
                </Button>
              </div>
            }
            emptyState={
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="rounded-full bg-[var(--muted)]/50 p-4 mb-4">
                  <Search className="h-8 w-8 text-[var(--muted-foreground)]" />
                </div>
                <h3 className="text-[length:var(--text-lg)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)] mb-1">No items found</h3>
                <p className="text-[length:var(--text-sm)] text-[var(--muted-foreground)] max-w-sm mx-auto mb-4">
                  Add a new element to get started.
                </p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="testing" className="flex-1 mt-0 flex flex-col min-h-0 focus-visible:ring-0 outline-none">
          <DashboardTable
            table={testingTable}
            totalColumns={testingColumns.length}
            onRowClick={(row) => {
              console.log("🔵 Row clicked, opening drawer for:", row.original)
              console.log("🔍 testId:", row.original.testId)
              
              // Check if it's the B1 test - open ThresholdConfigDrawer
              if (row.original.testId === "B1") {
                console.log("🔵 Opening Threshold Config for B1")
                setSelectedTestForThreshold(row.original)
                setIsThresholdConfigOpen(true)
              } else {
                // For other tests, open EvaluationConfigDrawer
                console.log("🔵 Opening Evaluation Config for other test")
                setSelectedTestForConfig(row.original)
                setIsEvaluationConfigOpen(true)
              }
            }}
            toolbar={
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                <div className="relative w-full sm:w-[350px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <Input 
                    placeholder="Search tests..." 
                    value={testingFilter ?? ""}
                    onChange={(event) => setTestingFilter(event.target.value)}
                    className="pl-9 h-9 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
                  />
                </div>
              </div>
            }
            emptyState={
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="rounded-full bg-[var(--muted)]/50 p-4 mb-4">
                  <Search className="h-8 w-8 text-[var(--muted-foreground)]" />
                </div>
                <h3 className="text-[length:var(--text-lg)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)] mb-1">No items found</h3>
                <p className="text-[length:var(--text-sm)] text-[var(--muted-foreground)] max-w-sm mx-auto mb-4">
                  Add a new element to get started.
                </p>
              </div>
            }
          />
        </TabsContent>
      </Tabs>
      
      {/* Delete Alert Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)] shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--foreground)]">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted-foreground)]">
              This action cannot be undone. This will permanently delete the item
              {itemToDelete && <span className="font-[var(--font-weight-medium)] text-[var(--foreground)]"> {itemToDelete.name} </span>}
              and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80 shadow-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={!!statusChangeItem} onOpenChange={(open) => !open && setStatusChangeItem(null)}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)] shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--foreground)]">Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted-foreground)]">
              This change will apply everywhere this item is used. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setStatusChangeItem(null)}
              className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStatusConfirm}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 shadow-none"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogState.open} onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] shadow-none sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">
              {dialogState.mode === 'create' ? `Create ${dialogState.type === 'inspection' ? 'Inspection' : 'Test'}` : `Edit ${dialogState.type === 'inspection' ? 'Inspection' : 'Test'}`}
            </DialogTitle>
            <DialogDescription className="text-[var(--muted-foreground)]">
              {dialogState.mode === 'create' ? "Add a new item to your list. Click save when you're done." : "Make changes to your item here. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="elementId" className="text-right text-[var(--foreground)]">
                Element ID
              </Label>
              <Input
                id="elementId"
                value={formData.elementId}
                onChange={(e) => setFormData(prev => ({ ...prev, elementId: e.target.value }))}
                className="col-span-3 bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="elementName" className="text-right text-[var(--foreground)]">
                Name
              </Label>
              <Input
                id="elementName"
                value={formData.elementName}
                onChange={(e) => setFormData(prev => ({ ...prev, elementName: e.target.value }))}
                className="col-span-3 bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-[var(--foreground)]">
                Category
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as "Structural" | "General" }))}
              >
                <SelectTrigger className="col-span-3 bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--popover)] border-[var(--border)] text-[var(--popover-foreground)]">
                  <SelectItem value="Structural">Structural</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dialogState.type === 'testing' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="testType" className="text-right text-[var(--foreground)]">
                  Test Type
                </Label>
                <Input
                  id="testType"
                  type="number"
                  value={formData.testType}
                  onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value }))}
                  className="col-span-3 bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogState(prev => ({ ...prev, open: false }))} className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none">
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 shadow-none">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evaluation Configuration Drawer - Always mounted, controlled by open state */}
      <EvaluationConfigDrawer
        testName={selectedTestForConfig?.testName || ""}
        testId={selectedTestForConfig?.testId || ""}
        testScope={selectedTestForConfig?.testScope}
        linkedElements={selectedTestForConfig?.linkedElementTypesArray || []}
        engineType={selectedTestForConfig?.engineType}
        ruleKey={selectedTestForConfig?.ruleKey}
        open={isEvaluationConfigOpen && selectedTestForConfig !== null}
        onOpenChange={(open) => {
          setIsEvaluationConfigOpen(open)
          if (!open) {
            setSelectedTestForConfig(null)
          }
        }}
        onSave={(elementName, config) => {
          console.log("Saved config for:", elementName, config)
          toast.success("Evaluation configuration saved successfully")
        }}
      />

      {/* Threshold Configuration Drawer - Always mounted, controlled by open state */}
      <ThresholdConfigDrawer
        testName={selectedTestForThreshold?.testName || ""}
        testId={selectedTestForThreshold?.testId || ""}
        testScope={selectedTestForThreshold?.testScope}
        linkedElements={selectedTestForThreshold?.linkedElementTypesArray || []}
        engineType={selectedTestForThreshold?.engineType}
        ruleKey={selectedTestForThreshold?.ruleKey}
        open={isThresholdConfigOpen && selectedTestForThreshold !== null}
        onOpenChange={(open) => {
          setIsThresholdConfigOpen(open)
          if (!open) {
            setSelectedTestForThreshold(null)
          }
        }}
        onSave={(elementName, config) => {
          console.log("Saved config for:", elementName, config)
          toast.success("Threshold configuration saved successfully")
        }}
      />
    </div>
  )
}