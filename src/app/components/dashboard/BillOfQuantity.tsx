"use client"

import * as React from "react"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  ArrowUpDown,
  FileText,
  FileSpreadsheet,
  Trash2,
  Eye
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
import { Avatar, AvatarFallback } from "../ui/avatar"
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
import { toast } from "sonner"
import { CreateBOQ } from "./CreateBOQ"
import { BOQDetails, BOQSummary } from "./BOQDetails"
import { useSidebar } from "../layout/SidebarLayout"
import { DashboardTable } from "./DashboardTable"

// --- Type Definitions ---

export type BOQItem = BOQSummary

// --- Mock Data ---

const data: BOQItem[] = Array.from({ length: 25 }).map((_, i) => {
  const isEven = i % 2 === 0
  const month = i % 3 === 0 ? "Mar" : "Apr"
  return {
    id: `boq-${i}`,
    boqId: `BOQ-${month.toUpperCase()}25-${1000 + i}`,
    inspectionDateRange: `${month} 01 - ${month} 15, 2025`,
    totalItems: Math.floor(Math.random() * 50) + 10,
    oemCount: Math.floor(Math.random() * 5) + 1,
    createdBy: isEven 
      ? { name: "Sarah Taylor", initials: "ST" }
      : { name: "James Wilson", initials: "JW" },
    createdOn: `${month} ${(i % 28) + 1}, 2025`,
  }
})

// --- Main Component ---

interface BillOfQuantityProps {
  onSubViewChange?: (title: string | null) => void;
  activeSubPage?: string | null;
}

export function BillOfQuantity({ onSubViewChange: propOnSubViewChange, activeSubPage: propActiveSubPage }: BillOfQuantityProps) {
  const [view, setView] = React.useState<"list" | "create" | "details">("list")
  const [selectedBOQ, setSelectedBOQ] = React.useState<BOQItem | null>(null)
  
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [boqToDelete, setBoqToDelete] = React.useState<BOQItem | null>(null)

  const handleDeleteConfirm = () => {
    toast.success("BOQ deleted successfully")
    setBoqToDelete(null)
  }

  // Try to use Context, fallback to props
  const sidebarContext = useSidebar();
  const onSubViewChange = sidebarContext ? sidebarContext.setSubPageTitle : propOnSubViewChange;
  const activeSubPage = sidebarContext ? sidebarContext.subPageTitle : propActiveSubPage;

  // Sync breadcrumb state
  React.useEffect(() => {
    if (onSubViewChange) {
      if (view === "create") {
        onSubViewChange("Create BOQ")
      } else if (view === "details" && selectedBOQ) {
        onSubViewChange(selectedBOQ.boqId)
      } else {
        onSubViewChange(null)
      }
    }
  }, [view, onSubViewChange, selectedBOQ])

  // React to breadcrumb navigation (parent changing activeSubPage to null)
  React.useEffect(() => {
    if (activeSubPage === null) {
      setView("list")
      setSelectedBOQ(null)
    }
  }, [activeSubPage])

  const handleViewBOQ = (boq: BOQItem) => {
    setSelectedBOQ(boq)
    setView("details")
  }

  // Define columns inside component to access handlers if needed, 
  // or pass handlers to column definition if defined outside.
  // For simplicity, I'll redefine columns here or wrap the cell renderer.
  // Ideally, columns should be static, but the cell renderer needs access to handleViewBOQ.
  // So let's define columns using useMemo or just keep them static and use a custom cell renderer that we can't easily do with static definition unless we pass a callback in meta.
  
  // Alternatively, just define columns inside the component (less performant but fine for now).
  const columns: ColumnDef<BOQItem>[] = React.useMemo(() => [
    {
      accessorKey: "boqId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3 h-8 text-xs font-semibold uppercase hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            BOQ ID
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div 
          className="font-medium cursor-pointer text-primary hover:underline underline-offset-4"
          onClick={() => handleViewBOQ(row.original)}
        >
          {row.getValue("boqId")}
        </div>
      ),
    },
    {
      accessorKey: "inspectionDateRange",
      header: () => <div className="text-xs font-semibold uppercase text-muted-foreground">Inspection Date Range</div>,
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("inspectionDateRange")}</div>,
    },
    {
      accessorKey: "totalItems",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            className="h-8 px-2 text-xs font-semibold uppercase hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Items
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center font-medium">{row.getValue("totalItems")}</div>,
    },
    {
      accessorKey: "oemCount",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            className="h-8 px-2 text-xs font-semibold uppercase hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            OEM Count
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("oemCount")}</div>,
    },
    {
      accessorKey: "createdBy",
      header: () => <div className="text-xs font-semibold uppercase text-muted-foreground">Created By</div>,
      cell: ({ row }) => {
        const creator = row.original.createdBy
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                {creator.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground">{creator.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdOn",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-xs font-semibold uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created On
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("createdOn")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewBOQ(row.original)}>
                <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                View BOQ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setTimeout(() => toast.success("BOQ PDF downloaded successfully."), 800)
              }}>
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setTimeout(() => toast.success("BOQ Excel downloaded successfully."), 800)
              }}>
                <FileSpreadsheet className="mr-2 h-4 w-4 text-muted-foreground" />
                Download Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => setBoqToDelete(row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete BOQ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
  })

  if (view === "create") {
    return <CreateBOQ onCancel={() => setView("list")} onCreate={() => setView("list")} />
  }

  if (view === "details" && selectedBOQ) {
    return (
      <BOQDetails 
        onBack={() => {
          setView("list")
          setSelectedBOQ(null)
        }} 
        boqData={selectedBOQ} 
      />
    )
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Content Area */}
      <DashboardTable
        table={table}
        totalColumns={columns.length}
        toolbar={
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-[350px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search BOQ..." 
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-9 h-9 border border-input"
              />
            </div>
            <Button type="button" className="h-9 gap-2 w-full sm:w-auto" onClick={() => setView("create")}>
              <Plus className="h-4 w-4" />
              Create BOQ
            </Button>
          </div>
        }
        emptyState={
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="rounded-full bg-muted/50 p-4 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No BOQs found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              There are no generated Bill of Quantities yet. Create one to get started.
            </p>
          </div>
        }
      />
      
      <AlertDialog open={!!boqToDelete} onOpenChange={(open) => !open && setBoqToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the BOQ
              {boqToDelete && <span className="font-medium text-foreground"> {boqToDelete.boqId} </span>}
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}