import * as React from "react"
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"
import {
  KpiCard, ChartCard, FilterSelect, TooltipShell,
  Avatar, ScorePill, TrendBadge, TableShell, Td, Pagination,
  seededRandom,
} from "./shared"

// ─── Mock data ───────────────────────────────────────────────────────────────

const HOUR_LABELS = ["06AM", "08AM", "10AM", "12PM", "02PM", "04PM", "06PM", "08PM", "10PM"]

function generatePalletsData() {
  const rand = seededRandom(42)
  return HOUR_LABELS.map((label, i) => ({
    time: label,
    pallets: Math.round(6 + rand() * 14),
    idx: i,
  }))
}

function generateAisleData() {
  const rand = seededRandom(7)
  return ["Aisle 01", "Aisle 02", "Aisle 03", "Aisle 04", "Aisle 05", "Other"].map(a => ({
    aisle: a,
    lostHours: Math.round((1 + rand() * 6) * 100) / 100,
  }))
}

function generateBreakImpactData() {
  const rand = seededRandom(19)
  return HOUR_LABELS.map(label => ({
    time: label,
    breakTime: Math.round(rand() * 12),
    pallets: Math.round(2 + rand() * 18),
  }))
}

interface MheRow { id: string; utilization: number; palletHr: number; loaded: number; idle: number; score: number; trendPct: number; trendUp: boolean }
interface OperatorRow { name: string; active: number; palletHr: number; loadedVsEmpty: number; idle: number; score: number; trendPct: number; trendUp: boolean }

function generateMheRows(): MheRow[] {
  const rand = seededRandom(101)
  return Array.from({ length: 9 }, (_, i) => ({
    id: `MHE_B${String(i + 1).padStart(2, "0")}`,
    utilization: Math.round(50 + rand() * 48),
    palletHr: Math.round(8 + rand() * 14),
    loaded: Math.round(8 + rand() * 14),
    idle: Math.round(10 + rand() * 15),
    score: Math.round(45 + rand() * 55),
    trendPct: Math.round(2 + rand() * 8),
    trendUp: rand() > 0.5,
  }))
}

function generateOperatorRows(): OperatorRow[] {
  const rand = seededRandom(202)
  const names = ["James Wilson", "Priya Menon", "Carlos Diaz", "Aisha Khan", "Tom Becker", "Neha Rao", "Liam O'Connor", "Sara Ibrahim", "David Kim"]
  return names.map(name => ({
    name,
    active: Math.round(50 + rand() * 48),
    palletHr: Math.round(8 + rand() * 14),
    loadedVsEmpty: Math.round(8 + rand() * 14),
    idle: Math.round(10 + rand() * 15),
    score: Math.round(45 + rand() * 55),
    trendPct: Math.round(2 + rand() * 8),
    trendUp: rand() > 0.5,
  }))
}

// ─── Range brush (visual) ─────────────────────────────────────────────────────

function RangeBrush({
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

// ─── Custom tooltips ──────────────────────────────────────────────────────────

function PalletsTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return <TooltipShell headerLeft={d.time} rows={[{ label: "Pallets Moved", value: String(d.pallets) }]} />
}

function AisleTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return <TooltipShell headerLeft={d.aisle} rows={[{ label: "Lost Hours", value: d.lostHours.toFixed(2) }]} />
}

function BreakImpactTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return <TooltipShell headerLeft={label} rows={[{ label: "Pallets", value: `${payload[0]?.payload?.pallets ?? 0} units/hr` }]} />
}

// ─── Main tab ────────────────────────────────────────────────────────────────

export function TaskProductivityTab() {
  const palletsData = React.useMemo(generatePalletsData, [])
  const aisleData = React.useMemo(generateAisleData, [])
  const breakData = React.useMemo(generateBreakImpactData, [])
  const mheRows = React.useMemo(generateMheRows, [])
  const operatorRows = React.useMemo(generateOperatorRows, [])

  const avgPallets = Math.round(palletsData.reduce((a, d) => a + d.pallets, 0) / palletsData.length)

  const [mheSession, setMheSession] = React.useState("Today")
  const [mheSessionFilter, setMheSessionFilter] = React.useState("All Sessions")
  const [mheFilter, setMheFilter] = React.useState("All MHE")
  const [operatorFilter, setOperatorFilter] = React.useState("All Operator")

  const [brushRange, setBrushRange] = React.useState({ start: 1, end: 6 })
  const brushedPalletsData = palletsData.slice(brushRange.start, brushRange.end + 1)

  const [mhePageSize, setMhePageSize] = React.useState(5)
  const [mhePageIndex, setMhePageIndex] = React.useState(0)
  const [opPageSize, setOpPageSize] = React.useState(5)
  const [opPageIndex, setOpPageIndex] = React.useState(0)

  const mhePaged = mheRows.slice(mhePageIndex * mhePageSize, (mhePageIndex + 1) * mhePageSize)
  const opPaged = operatorRows.slice(opPageIndex * opPageSize, (opPageIndex + 1) * opPageSize)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <KpiCard title="Loaded vs Empty Travel %" value="72% loaded | 28% empty" />
        <KpiCard title="Average Pallets Moved/Hr" value={`${avgPallets} pallets/hr`} />
        <KpiCard title="Idle-with-Load Time Lost" value="1h 20m" />
        <KpiCard title="Lost Hours due to Aisle" value="18h" />
      </div>

      {/* Pallets Moved per Hour */}
      <ChartCard
        title="Pallets Moved per Hour"
        subtitle="Hourly Productivity Trend"
        onRefresh={() => {}}
        minHeight={340}
        filters={
          <>
            <FilterSelect value={mheSession} onChange={setMheSession} options={["Today", "Yesterday", "Last 7 Days"]} />
            <FilterSelect value={mheSessionFilter} onChange={setMheSessionFilter} options={["All Sessions", "Morning session", "Afternoon session", "Night session"]} />
            <FilterSelect value={mheFilter} onChange={setMheFilter} options={["All MHE", "MHE 01", "MHE 02", "MHE 03"]} />
            <FilterSelect value={operatorFilter} onChange={setOperatorFilter} options={["All Operator", "James Wilson", "Priya Menon"]} />
          </>
        }
      >
        <div style={{ flex: 1, minHeight: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={brushedPalletsData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="palletsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis
                dataKey="time"
                tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }}
                axisLine={false} tickLine={false} dy={6}
              />
              <YAxis
                domain={[0, 20]} ticks={[0, 5, 10, 15, 20]}
                tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }}
                axisLine={false} tickLine={false} dx={-4}
              />
              <ReferenceLine y={15} stroke="#a855f7" strokeDasharray="4 4" strokeWidth={1.2} />
              <Tooltip content={<PalletsTooltip />} cursor={{ stroke: "var(--w-border)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="pallets" stroke="var(--primary)" strokeWidth={2} fill="url(#palletsFill)" dot={{ fill: "var(--primary)", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <RangeBrush
          labels={HOUR_LABELS}
          start={brushRange.start}
          end={brushRange.end}
          onChange={(start, end) => setBrushRange({ start, end })}
        />
      </ChartCard>

      {/* Congestion + Break impact */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        <ChartCard title="Lost Hours due to Congestion" subtitle="Aisle Impact Analysis" onRefresh={() => {}}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={aisleData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis dataKey="aisle" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6} />
              <YAxis domain={[0, 8]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4} />
              <Tooltip content={<AisleTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="lostHours" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Break Impact on Output Timeline" subtitle="Productivity Drop Analysis" badge="Daily" onRefresh={() => {}}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: "#f59e0b" }} /> Break Time
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--primary)" }} /> Pallets Moved/Hr
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={breakData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis dataKey="time" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6} />
              <YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4} />
              <Tooltip content={<BreakImpactTooltip />} cursor={{ stroke: "var(--w-border)", strokeWidth: 1 }} />
              <Bar dataKey="breakTime" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={18} />
              <Line type="monotone" dataKey="pallets" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* MHE Task Productivity table */}
      <ChartCard title="MHE Task Productivity" subtitle="Equipment Utilization Performance" badge="Weekly" onRefresh={() => {}}>
        <TableShell columns={["MHE", "Utilization %", "Pallet/Hr", "Loaded vs Empty%", "Idle-with-Load (min)", "Productivity Score", "Trend"]}>
          {mhePaged.map(r => (
            <tr key={r.id}>
              <Td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar label={r.id.slice(-2)} seed={r.id} />{r.id}</div></Td>
              <Td>{r.utilization}%</Td>
              <Td>{r.palletHr}</Td>
              <Td>{r.loaded}</Td>
              <Td>{r.idle}</Td>
              <Td><ScorePill score={r.score} /></Td>
              <Td><TrendBadge pct={r.trendPct} up={r.trendUp} /></Td>
            </tr>
          ))}
        </TableShell>
        <Pagination pageSize={mhePageSize} setPageSize={setMhePageSize} pageIndex={mhePageIndex} setPageIndex={setMhePageIndex} totalRows={mheRows.length} />
      </ChartCard>

      {/* Operator Task Productivity table */}
      <ChartCard title="Operator Task Productivity" subtitle="Individual Operator Performance" badge="Weekly" onRefresh={() => {}}>
        <TableShell columns={["Operator", "Active %", "Pallet/Hr", "Loaded vs Empty%", "Idle-with-Load (min)", "Productivity Score", "Trend"]}>
          {opPaged.map(r => (
            <tr key={r.name}>
              <Td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar label={r.name.split(" ").map(p => p[0]).join("")} seed={r.name} />{r.name}</div></Td>
              <Td>{r.active}%</Td>
              <Td>{r.palletHr}</Td>
              <Td>{r.loadedVsEmpty}%</Td>
              <Td>{r.idle}</Td>
              <Td><ScorePill score={r.score} /></Td>
              <Td><TrendBadge pct={r.trendPct} up={r.trendUp} /></Td>
            </tr>
          ))}
        </TableShell>
        <Pagination pageSize={opPageSize} setPageSize={setOpPageSize} pageIndex={opPageIndex} setPageIndex={setOpPageIndex} totalRows={operatorRows.length} />
      </ChartCard>
    </div>
  )
}
