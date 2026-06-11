"use client"

import * as React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
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

// --- Types ---

type MHETypeRow = {
  typeId: string
  mheType: string
  parts: number
  checklists: number
}

// --- Mock Data (mirroring the image) ---

const mheTypeData: MHETypeRow[] = [
  { typeId: "Y8ZJNAKO7AIVM1H", mheType: "Order Picker",       parts: 2,  checklists: 5 },
  { typeId: "3MQ24R5DKDTCUQR", mheType: "Electric Pallet Jack", parts: 1, checklists: 1 },
  { typeId: "EJPSLTSFAOTF4LD", mheType: "BOPT",               parts: 5,  checklists: 6 },
  { typeId: "KRGTL1NKXNBWR6Y", mheType: "Aisle Master",       parts: 11, checklists: 8 },
  { typeId: "KHL6EYYZNWGV6CZ", mheType: "VNA Truck",          parts: 0,  checklists: 0 },
  { typeId: "H87JWMGA4BCAKZS", mheType: "Reach Truck",        parts: 0,  checklists: 0 },
  { typeId: "M3QD9DNMDM9CBSF", mheType: "Stacker",            parts: 0,  checklists: 0 },
  { typeId: "C016YCUTYUO6MRY", mheType: "Electric Forklift",  parts: 0,  checklists: 0 },
  { typeId: "307NDKTMPALKX0Y", mheType: "Diesel Forklift",    parts: 0,  checklists: 0 },
  { typeId: "WQ9CVSX4ARCCYA8", mheType: "Forklift",           parts: 1,  checklists: 2 },
]

// --- Column Definitions ---

function buildColumns(navigate: (path: string) => void): ColumnDef<MHETypeRow>[] {
  return [
    {
      accessorKey: "typeId",
      header: () => (
        <span className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">
          Type ID
        </span>
      ),
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => navigate(`/mhe/imds/rules-action-imds/${row.getValue("typeId")}`)}
          className="text-[length:var(--text-sm)] font-normal hover:underline transition-colors text-left"
          style={{ color: "var(--primary)" }}
        >
          {row.getValue("typeId")}
        </button>
      ),
    },
    {
      accessorKey: "mheType",
      header: () => (
        <span className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">
          MHE Type
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-[length:var(--text-sm)] text-[var(--foreground)]">
          {row.getValue("mheType")}
        </span>
      ),
    },
    {
      accessorKey: "parts",
      header: () => (
        <span className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">
          Parts
        </span>
      ),
      cell: ({ row }) => {
        const count = row.getValue("parts") as number
        return (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[length:var(--text-xs)] font-normal"
            style={{ backgroundColor: "rgba(124, 58, 237, 0.12)", color: "#a78bfa" }}
          >
            {count} Parts
          </span>
        )
      },
    },
    {
      accessorKey: "checklists",
      header: () => (
        <span className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">
          Checklists
        </span>
      ),
      cell: ({ row }) => {
        const count = row.getValue("checklists") as number
        return (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[length:var(--text-xs)] font-normal"
            style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#34d399" }}
          >
            {count} Items
          </span>
        )
      },
    },
  ]
}

// --- Main Component ---

export function IMDSRulesAndAction() {
  const sidebar = useSidebar()
  const navigate = useNavigate()
  useEffect(() => {
    sidebar?.setSubPageTitle("Rules and Action")
  }, [])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const columns = React.useMemo(() => buildColumns(navigate), [navigate])

  const table = useReactTable({
    data: mheTypeData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: { sorting, globalFilter, pagination },
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const firstRow = pageIndex * pageSize + 1
  const lastRow = Math.min(firstRow + pageSize - 1, totalRows)

  return (
    <div className="h-full flex flex-col bg-[var(--background)] p-6">
      {/* Container */}
      <div className="flex-1 flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">

        {/* Search bar */}
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <div className="relative w-[260px]">
            <Search strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search MHE types..."
              value={globalFilter ?? ""}
              onChange={e => setGlobalFilter(e.target.value)}
              className="pl-9 h-9 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] text-[length:var(--text-sm)]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="border-b border-[var(--border)] hover:bg-transparent">
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="h-10 px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-40 text-center text-[var(--muted-foreground)] text-[length:var(--text-sm)]">
                    No MHE types found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-3 px-4 py-2 border-t border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[11px] font-[var(--font-weight-normal)] text-[var(--muted-foreground)]">
              Rows per page:
            </span>
            <Select
              value={`${pageSize}`}
              onValueChange={value => table.setPageSize(Number(value))}
            >
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
            {firstRow} – {lastRow} of {totalRows}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none disabled:opacity-30"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft strokeWidth={1.5} className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none disabled:opacity-30"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight strokeWidth={1.5} className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
