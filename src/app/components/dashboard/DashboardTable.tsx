import * as React from "react"
import { Table as ReactTable, flexRender } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DashboardTableProps<TData> {
  table: ReactTable<TData>
  totalColumns: number
  toolbar?: React.ReactNode
  emptyState?: React.ReactNode
  onRowClick?: (row: any) => void
}

export function DashboardTable<TData>({
  table,
  totalColumns,
  toolbar,
  emptyState,
  onRowClick,
}: DashboardTableProps<TData>) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] flex flex-col overflow-hidden">
      {/* Toolbar inside container */}
      {toolbar && (
        <div className="px-[var(--spacing-4)] py-[var(--spacing-4)] border-b border-[var(--border)] bg-[var(--card)]">
          {toolbar}
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-[var(--border)] hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-[var(--border)] ${
                    onRowClick ? "cursor-pointer hover:bg-[var(--muted)]/30" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={totalColumns}
                  className="h-[200px] text-center"
                >
                  {emptyState || "No results found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination inside container */}
      <div className="flex flex-row items-center justify-end gap-6 border-t border-[var(--border)] bg-[var(--background)] px-[var(--spacing-4)] py-[var(--spacing-3)]">
        <div className="flex flex-row items-center gap-2">
          <p className="text-[length:var(--text-sm)] font-[var(--font-weight-normal)] text-[var(--foreground)] leading-none">
            Rows per page:
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px] rounded-[var(--radius-sm)] border-[var(--border)] bg-[var(--background)] shadow-none">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="bg-[var(--popover)] border-[var(--border)]">
              {[10, 20, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row items-center gap-2">
          <p className="text-[length:var(--text-sm)] font-[var(--font-weight-normal)] text-[var(--foreground)] leading-none">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <div className="flex flex-row items-center gap-1">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-[var(--radius-sm)] border-[var(--border)] bg-[var(--background)] disabled:opacity-50 shadow-none"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-[var(--radius-sm)] border-[var(--border)] bg-[var(--background)] disabled:opacity-50 shadow-none"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}