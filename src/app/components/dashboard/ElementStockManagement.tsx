"use client"

import * as React from "react"
import { 
  Search, 
  ArrowUpDown,
  Filter,
  Package,
  Save,
  Trash2,
  CircleAlert
} from "lucide-react"
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { toast } from "sonner"
import { DashboardTable } from "./DashboardTable"

// --- Type Definitions ---
export interface StockItem {
  id: string;
  elementType: string;
  itemSize: string;
  oem: string;
  quantity: number;
  lastUpdated: string;
}

// --- Mock Data Generator ---
const generateMockData = (): StockItem[] => {
  return Array.from({ length: 50 }).map((_, i) => {
    const types = ["Upright", "Beam", "Frame", "Base Plate", "Row Spacer"];
    const oems = ["Dexion", "Colby", "Schaefer", "Apex", "Macrack"];
    const sizes = ["80x40", "90x50", "100x50", "2700mm", "1350mm"];
    
    return {
      id: `item-${i + 1}`,
      elementType: types[i % types.length],
      itemSize: sizes[i % sizes.length],
      oem: oems[i % oems.length],
      quantity: Math.floor(Math.random() * 500),
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    };
  });
};

export function ElementStockManagement() {
  const [data, setData] = React.useState<StockItem[]>(generateMockData);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // State for pending bulk updates
  const [pendingUpdates, setPendingUpdates] = React.useState<Record<string, number>>({});

  // Guardrail for unsaved changes on page leave/refresh
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(pendingUpdates).length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pendingUpdates]);

  // Handlers
  const handleStockUpdateChange = (id: string, value: string) => {
    const numValue = parseInt(value, 10);
    
    if (value === "" || isNaN(numValue)) {
      const newUpdates = { ...pendingUpdates };
      delete newUpdates[id];
      setPendingUpdates(newUpdates);
      return;
    }

    setPendingUpdates(prev => ({
      ...prev,
      [id]: numValue
    }));
  };

  const applyStockUpdates = () => {
    const updatesToProcess = Object.entries(pendingUpdates);
    
    if (updatesToProcess.length === 0) {
      toast.info("No stock updates entered.");
      return;
    }

    const newData = data.map(item => {
      if (pendingUpdates[item.id] !== undefined) {
        const delta = pendingUpdates[item.id];
        const newQuantity = Math.max(0, item.quantity + delta);
        
        // Audit log simulation
        console.log(`[AUDIT] Stock Update: ${item.elementType} (${item.itemSize}, ${item.oem}) | Delta: ${delta > 0 ? '+' : ''}${delta} | New Qty: ${newQuantity} | User: Current User | Time: ${new Date().toISOString()}`);
        
        return {
          ...item,
          quantity: newQuantity,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });

    setData(newData);
    setPendingUpdates({});
    toast.success(`Successfully updated stock for ${updatesToProcess.length} item(s).`);
  };

  const handleRowClick = (item: StockItem) => {
    // In a real application, this would navigate to the detail page
    toast.info(`Navigating to details for ${item.elementType} (${item.oem})`);
  };

  const columns: ColumnDef<StockItem>[] = React.useMemo(() => [
    {
      accessorKey: "elementType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Element Type
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-[var(--font-weight-medium)]">{row.getValue("elementType")}</div>,
    },
    {
      accessorKey: "itemSize",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size / Profile
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("itemSize")}</div>,
    },
    {
      accessorKey: "oem",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          OEM
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("oem")}</div>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Current Stock
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const qty = row.getValue("quantity") as number;
        return (
          <div className={qty < 50 ? "text-[color:var(--destructive)] font-[var(--font-weight-medium)]" : "text-[color:var(--chart-2)] font-[var(--font-weight-medium)]"}>
            {qty}
          </div>
        )
      },
    },
    {
      id: "stockUpdate",
      header: () => <div className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase">Stock Update</div>,
      cell: ({ row }) => {
        const pendingValue = pendingUpdates[row.original.id] ?? "";
        return (
          <Input 
            type="number" 
            placeholder="+ / - Qty"
            className={`w-32 h-8 ${pendingValue !== "" ? "border-[color:var(--chart-3)] bg-[color:var(--chart-3)]/10" : ""}`}
            value={pendingValue}
            onChange={(e) => handleStockUpdateChange(row.original.id, e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking input
          />
        );
      },
    },
    {
      accessorKey: "lastUpdated",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-[color:var(--muted-foreground)]">{row.getValue("lastUpdated")}</div>,
    },
  ], [pendingUpdates]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  })

  // Helper to safely get unique values for filters
  const getUniqueValues = (key: keyof StockItem) => {
    return Array.from(new Set(data.map(item => item[key])));
  };

  const updateCount = Object.keys(pendingUpdates).length;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      {updateCount > 0 && (
        <div className="flex-none flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[color:var(--chart-3)] bg-[color:var(--chart-3)]/10 px-2.5 py-0.5 rounded-full border border-[color:var(--chart-3)]/20">
              <CircleAlert className="w-3.5 h-3.5 mr-1.5" />
              You have unsaved stock updates
            </span>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" className="gap-2">
                <Save className="h-4 w-4" />
                Apply {updateCount} Update{updateCount !== 1 ? 's' : ''}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Stock Update</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to apply stock updates for the selected elements.
                  This action will update current stock quantities and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={applyStockUpdates}>Apply Updates</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Content Area */}
      <DashboardTable
        table={table}
        totalColumns={columns.length}
        onRowClick={(row) => handleRowClick(row.original)}
        toolbar={
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
              <div className="relative w-full sm:w-[350px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[color:var(--muted-foreground)]" />
                <Input
                  placeholder="Search elements..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-9 h-9 border-[color:var(--input)]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Select
                  value={(table.getColumn("oem")?.getFilterValue() as string) ?? "all"}
                  onValueChange={(value) =>
                    table.getColumn("oem")?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger className="h-9 w-[150px]">
                    <div className="flex items-center gap-2 truncate">
                      <Filter className="h-4 w-4 text-[color:var(--muted-foreground)]" />
                      <SelectValue placeholder="OEM" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All OEMs</SelectItem>
                    {getUniqueValues("oem").map((oem) => (
                      <SelectItem key={String(oem)} value={String(oem)}>
                        {String(oem)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={(table.getColumn("elementType")?.getFilterValue() as string) ?? "all"}
                  onValueChange={(value) =>
                    table.getColumn("elementType")?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Element Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {getUniqueValues("elementType").map((type) => (
                      <SelectItem key={String(type)} value={String(type)}>
                        {String(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={(table.getColumn("itemSize")?.getFilterValue() as string) ?? "all"}
                  onValueChange={(value) =>
                    table.getColumn("itemSize")?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger className="h-9 w-[150px] border-[color:var(--input)]">
                    <SelectValue placeholder="Item Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {getUniqueValues("itemSize").map((size) => (
                      <SelectItem key={String(size)} value={String(size)}>
                        {String(size)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Secondary Action Area */}
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={updateCount === 0}
                    className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                  >
                     <Trash2 className="h-3.5 w-3.5 mr-2" />
                     Clear Updates
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Stock Updates</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all entered stock update values.
                      No stock quantities will be changed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setPendingUpdates({})}>Clear Updates</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        }
        emptyState={
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="rounded-full bg-[color:var(--muted)]/50 p-4 mb-4">
              <Package className="h-8 w-8 text-[color:var(--muted-foreground)]" />
            </div>
            <h3 className="text-[length:var(--text-lg)] font-[var(--font-weight-semi-bold)] text-[color:var(--foreground)] mb-1">No stock items found</h3>
            <p className="text-[length:var(--text-sm)] text-[color:var(--muted-foreground)] max-w-sm mx-auto mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        }
      />
    </div>
  )
}