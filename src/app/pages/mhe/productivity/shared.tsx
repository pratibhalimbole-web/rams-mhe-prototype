import * as React from "react"
import { RotateCw, Info, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { Badge } from "../../../components/ui/badge"

// ─── Seeded random ───────────────────────────────────────────────────────────

export function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

// ─── Shared style tokens ─────────────────────────────────────────────────────

export const cardStyle: React.CSSProperties = {
  background: "var(--w-bg)",
  border: "1px solid var(--w-border)",
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}

export const filterStyle: React.CSSProperties = {
  height: "32px",
  width: "auto",
  background: "var(--w-bg)",
  border: "1px solid var(--w-border)",
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "10px",
  color: "var(--w-text-1)",
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

export function KpiCard({ title, value, valueSuffix }: { title: string; value: string; valueSuffix?: string }) {
  return (
    <div style={{ ...cardStyle, padding: "16px 18px", gap: 10 }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "var(--w-text-2)" }}>
        {title}
      </span>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--w-text-1)" }}>
        {value}
        {valueSuffix && (
          <span style={{ fontWeight: 400, fontSize: 13, color: "var(--w-text-2)", marginLeft: 6 }}>
            {valueSuffix}
          </span>
        )}
      </span>
    </div>
  )
}

// ─── Chart card shell ────────────────────────────────────────────────────────

export function RefreshButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}
    >
      <RotateCw size={14} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
    </button>
  )
}

export function FilterSelect({ value, onChange, options, minWidth }: { value: string; onChange: (v: string) => void; options: string[]; minWidth?: number }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger style={{ ...filterStyle, minWidth }}><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o} value={o} style={{ whiteSpace: "nowrap" }}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

export function ChartCard({
  title, subtitle, badge, lastUpdated, filters, legend, onRefresh, children, minHeight = 300,
}: {
  title: string
  subtitle: string
  badge?: string
  lastUpdated?: string
  filters?: React.ReactNode
  legend?: React.ReactNode
  onRefresh?: () => void
  children: React.ReactNode
  minHeight?: number
}) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--w-divider)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--w-text-1)" }}>{title}</span>
            {badge && (
              <Badge variant="outline" className="border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                {badge}
              </Badge>
            )}
            {lastUpdated && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10.5, color: "var(--w-text-3)" }}>
                <Info size={11} strokeWidth={1.5} />
                Last Updated: {lastUpdated}
              </span>
            )}
          </div>
          {subtitle && <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11, color: "var(--w-text-2)" }}>{subtitle}</span>}
          {legend && <div style={{ marginTop: 2 }}>{legend}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {filters}
          {onRefresh && <RefreshButton onClick={onRefresh} />}
        </div>
      </div>
      <div style={{ flex: 1, minHeight, padding: "16px 18px", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  )
}

// ─── Custom tooltip shell (matches SeverityTrendLineV3 convention) ──────────

export function TooltipShell({
  headerLeft, headerRight, rows,
}: {
  headerLeft: string
  headerRight?: string
  rows: { label: string; value: string; bold?: boolean; color?: string; hideDot?: boolean }[]
}) {
  return (
    <div style={{
      background: "var(--w-bg)",
      border: "1px solid var(--w-border)",
      borderRadius: 8,
      padding: "10px 14px",
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      minWidth: 190,
    }}>
      {(headerLeft || headerRight) && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 6, marginBottom: 8,
          borderBottom: rows.length > 1 ? "1px solid var(--w-divider)" : "none",
        }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, color: "var(--w-text-1)" }}>{headerLeft}</span>
          {headerRight && <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10, color: "var(--w-text-2)" }}>{headerRight}</span>}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11.5, color: "var(--w-text-2)" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color ?? "var(--primary)", flexShrink: 0, visibility: r.hideDot ? "hidden" : "visible" }} />
              {r.label}
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: r.bold ? 700 : 600, fontSize: 12.5, color: "var(--w-text-1)" }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Range brush (draggable time-window scrubber) ────────────────────────────

export function RangeBrush({
  labels, start, end, onChange,
}: {
  labels: string[]
  start: number
  end: number
  onChange: (start: number, end: number) => void
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const dragRef = React.useRef<{ mode: "left" | "right" | "move"; x: number; start: number; end: number } | null>(null)
  const total = labels.length - 1

  function idxFromClientX(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || total <= 0) return 0
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return Math.round(pct * total)
  }

  function onDown(mode: "left" | "right" | "move", e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = { mode, x: e.clientX, start, end }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  function onMove(e: React.PointerEvent) {
    const drag = dragRef.current
    if (!drag || total <= 0) return
    e.preventDefault()
    if (drag.mode === "left") {
      const idx = Math.min(idxFromClientX(e.clientX), drag.end - 1)
      onChange(Math.max(0, idx), drag.end)
    } else if (drag.mode === "right") {
      const idx = Math.max(idxFromClientX(e.clientX), drag.start + 1)
      onChange(drag.start, Math.min(total, idx))
    } else {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const deltaIdx = Math.round(((e.clientX - drag.x) / rect.width) * total)
      const width = drag.end - drag.start
      let newStart = drag.start + deltaIdx
      let newEnd = drag.end + deltaIdx
      if (newStart < 0) { newStart = 0; newEnd = width }
      if (newEnd > total) { newEnd = total; newStart = total - width }
      onChange(newStart, newEnd)
    }
  }

  function onUp(e: React.PointerEvent) {
    dragRef.current = null
    try { (e.target as Element).releasePointerCapture(e.pointerId) } catch {}
  }

  const leftPct = total > 0 ? (start / total) * 100 : 0
  const widthPct = total > 0 ? ((end - start) / total) * 100 : 100
  const dragProps = { onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "var(--w-text-3)", whiteSpace: "nowrap" }}>{labels[start]}</span>
      <div ref={containerRef} style={{ flex: 1, height: 22, borderRadius: 6, background: "var(--w-bg-muted)", position: "relative", touchAction: "none", userSelect: "none" }}>
        <div
          onPointerDown={e => onDown("move", e)}
          {...dragProps}
          style={{
            position: "absolute", left: `${leftPct}%`, width: `${widthPct}%`, top: 0, bottom: 0,
            background: "color-mix(in srgb, var(--primary) 35%, transparent)",
            borderLeft: "2px solid var(--primary)", borderRight: "2px solid var(--primary)",
            cursor: "grab", touchAction: "none",
          }}
        >
          <div
            onPointerDown={e => onDown("left", e)}
            {...dragProps}
            style={{ position: "absolute", left: -6, top: -3, bottom: -3, width: 14, cursor: "ew-resize", touchAction: "none" }}
          />
          <div
            onPointerDown={e => onDown("right", e)}
            {...dragProps}
            style={{ position: "absolute", right: -6, top: -3, bottom: -3, width: 14, cursor: "ew-resize", touchAction: "none" }}
          />
        </div>
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "var(--w-text-3)", whiteSpace: "nowrap" }}>{labels[end]}</span>
    </div>
  )
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2"]

export function Avatar({ label, seed }: { label: string; seed: string }) {
  const colorIdx = Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % AVATAR_COLORS.length
  const color = AVATAR_COLORS[colorIdx]
  return (
    <div
      style={{
        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `color-mix(in srgb, ${color} 18%, transparent)`,
        color, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 10,
      }}
    >
      {label}
    </div>
  )
}

// ─── Score pill + trend badge ────────────────────────────────────────────────

export function ScorePill({ score }: { score: number }) {
  const color = score >= 85 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#dc2626"
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 34, height: 22, padding: "0 8px", borderRadius: 6,
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 11.5,
      }}
    >
      {score}
    </span>
  )
}

export function TrendBadge({ pct, up }: { pct: number; up: boolean }) {
  const color = up ? "#16a34a" : "#dc2626"
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        padding: "3px 8px", borderRadius: 6,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        color, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11,
      }}
    >
      {up ? "↑" : "↓"} {pct}%
    </span>
  )
}

// ─── Table shell + pagination ────────────────────────────────────────────────

export function TableShell({ columns, children, maxVisibleRows = 5, align }: { columns: string[]; children: React.ReactNode; maxVisibleRows?: number; align?: ("left" | "center" | "right")[] }) {
  const rowCount = React.Children.count(children)
  const scroll = rowCount > maxVisibleRows
  return (
    <div style={{ overflowX: "auto", overflowY: scroll ? "auto" : "visible", maxHeight: scroll ? maxVisibleRows * 45 + 37 : undefined }}>
      <table className="w-table-shell" style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--w-border)" }}>
            {columns.map((c, i) => (
              <th key={c} style={{ position: scroll ? "sticky" : undefined, top: 0, background: "var(--w-bg)", textAlign: align?.[i] ?? "left", padding: "10px 8px", fontSize: 11, fontWeight: 600, color: "var(--w-text-2)", whiteSpace: "nowrap" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "center" | "right" }) {
  return <td style={{ padding: "12px 8px", fontSize: 12.5, color: "var(--w-text-1)", borderBottom: "1px solid var(--w-divider)", whiteSpace: "nowrap", textAlign: align }}>{children}</td>
}

export function Pagination({
  pageSize, setPageSize, pageIndex, setPageIndex, totalRows,
}: {
  pageSize: number; setPageSize: (n: number) => void
  pageIndex: number; setPageIndex: (fn: (i: number) => number) => void
  totalRows: number
}) {
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, marginTop: 4, borderTop: "1px solid var(--w-divider)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>Rows per page:</span>
        <Select value={`${pageSize}`} onValueChange={v => { setPageSize(Number(v)); setPageIndex(() => 0) }}>
          <SelectTrigger style={{ height: 28, width: 60, background: "var(--w-bg)", border: "1px solid var(--w-border)", fontSize: 11, borderRadius: 6 }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 20].map(s => <SelectItem key={s} value={`${s}`}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
          {firstRow === 0 ? "0" : `${firstRow}-${lastRow}`} of {totalRows}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => setPageIndex(i => Math.max(0, i - 1))}
            disabled={pageIndex === 0}
            style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "1px solid var(--w-border)", background: "var(--w-bg)", cursor: pageIndex === 0 ? "default" : "pointer", opacity: pageIndex === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={13} strokeWidth={1.5} style={{ color: "var(--w-text-2)" }} />
          </button>
          <button
            type="button"
            onClick={() => setPageIndex(i => Math.min(totalPages - 1, i + 1))}
            disabled={pageIndex >= totalPages - 1}
            style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "1px solid var(--w-border)", background: "var(--w-bg)", cursor: pageIndex >= totalPages - 1 ? "default" : "pointer", opacity: pageIndex >= totalPages - 1 ? 0.4 : 1 }}
          >
            <ChevronRightIcon size={13} strokeWidth={1.5} style={{ color: "var(--w-text-2)" }} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Heatmap grid ────────────────────────────────────────────────────────────

export function HeatCell({
  intensity, onHover, onLeave, children,
}: {
  intensity: number // 0..1
  onHover?: (e: React.MouseEvent) => void
  onLeave?: () => void
  children?: React.ReactNode
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      style={{
        background: `color-mix(in srgb, var(--primary) ${Math.round(intensity * 90) + 8}%, var(--w-bg-muted))`,
        borderRadius: 4,
        height: "100%",
        width: "100%",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  )
}
