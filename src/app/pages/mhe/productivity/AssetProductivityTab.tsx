import * as React from "react"
import {
  BarChart, Bar, ScatterChart, Scatter, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from "recharts"
import {
  KpiCard, ChartCard, TooltipShell, seededRandom,
} from "./shared"

// ─── Mock data ───────────────────────────────────────────────────────────────

const OPERATOR_NAMES: Record<string, string> = {
  "Operator 01": "Prakash Patil", "Operator 02": "Neha Kapoor", "Operator 03": "Amit Desai",
  "Operator 04": "Rahul Sharma", "Operator 05": "Vikas Thorat",
}

function generateOperatorLeaderboard() {
  const rand = seededRandom(11)
  return ["Operator 05", "Operator 04", "Operator 03", "Operator 02", "Operator 01"].map(id => ({
    id, score: Math.round(10 + rand() * 25), operatorId: `${id.slice(-2)}GJDLP`.toUpperCase(),
  }))
}

function generateMheLeaderboard() {
  const rand = seededRandom(23)
  return ["MHE 05", "MHE 04", "MHE 03", "MHE 02", "MHE 01"].map(id => ({
    id, score: Math.round(10 + rand() * 25), mheId: `JKGSJGDGFJH`,
  }))
}

function generateIdleScatter() {
  const rand = seededRandom(31)
  return Array.from({ length: 8 }, () => ({
    idle: Math.round(30 + rand() * 400),
    productivity: Math.round(3 + rand() * 15),
  }))
}

const SHIFTS = ["Day", "Evening", "Night"]
const MHE_ROWS = ["MHE_08", "MHE_07", "MHE_06", "MHE_05", "MHE_04", "MHE_03", "MHE_02", "MHE_01"]

function generateShiftUtilization() {
  const rand = seededRandom(51)
  const grid: Record<string, Record<string, number>> = {}
  MHE_ROWS.forEach(m => {
    grid[m] = {}
    SHIFTS.forEach(s => { grid[m][s] = rand() })
  })
  return grid
}

const OPERATORS_MATRIX = ["Operator 01", "Operator 02", "Operator 03", "Operator 04", "Operator 05", "Operator 06"]

function generatePairingMatrix() {
  const rand = seededRandom(61)
  const grid: Record<string, Record<string, number>> = {}
  MHE_ROWS.forEach(m => {
    grid[m] = {}
    OPERATORS_MATRIX.forEach(o => { grid[m][o] = rand() })
  })
  return grid
}

function generateDailyUtilization() {
  const rand = seededRandom(71)
  return ["MHE 01", "MHE 02", "MHE 03", "MHE 04", "MHE 05"].map(id => {
    const hours = Math.round(3 + rand() * 6)
    const status = hours >= 7 ? "Overutilized" : hours <= 4 ? "Optimal Utilized" : "Underutilized"
    return { id, hours, status }
  })
}

const STATUS_COLOR: Record<string, string> = {
  "Overutilized": "#dc2626",
  "Optimal Utilized": "var(--primary)",
  "Underutilized": "#f59e0b",
}

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function LeaderboardTooltip({ active, payload, isMhe }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft={isMhe ? "MHE_03" : (OPERATOR_NAMES[d.id] ?? d.id)}
      rows={[
        { label: isMhe ? "MHE ID" : "Operator ID", value: isMhe ? d.mheId : d.operatorId },
        { label: "Score", value: String(d.score), bold: true },
      ]}
    />
  )
}

function IdleScatterTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft="Prakash Patil"
      rows={[
        { label: "Operator ID", value: "UGJDLP" },
        { label: "Productivity", value: `${d.productivity} pallets/hr` },
        { label: "Idle Time", value: `${d.idle} min` },
      ]}
    />
  )
}

function DailyUtilTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft={d.id}
      rows={[{ label: d.status, value: `${d.hours} Hours`, bold: true }]}
    />
  )
}

// ─── Heatmap grid with hover tooltip ─────────────────────────────────────────

function HeatmapGrid<Row extends string, Col extends string>({
  rows, cols, data, renderTooltip,
}: {
  rows: Row[]
  cols: Col[]
  data: Record<string, Record<string, number>>
  renderTooltip: (row: Row, col: Col, value: number) => React.ReactNode
}) {
  const [hover, setHover] = React.useState<{ row: Row; col: Col; value: number; x: number; y: number } | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  function handleEnter(row: Row, col: Col, value: number, e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    setHover({ row, col, value, x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) })
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: `70px repeat(${cols.length}, 1fr)`, gap: 4 }}>
        <div />
        {cols.map(c => (
          <div key={c} style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", paddingBottom: 4 }}>{c}</div>
        ))}
        {rows.map(r => (
          <React.Fragment key={r}>
            <div style={{ display: "flex", alignItems: "center", fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)" }}>{r}</div>
            {cols.map(c => {
              const v = data[r]?.[c] ?? 0
              return (
                <div
                  key={c}
                  onMouseEnter={e => handleEnter(r, c, v, e)}
                  onMouseMove={e => handleEnter(r, c, v, e)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    height: 26,
                    borderRadius: 4,
                    background: `color-mix(in srgb, var(--primary) ${Math.round(v * 88) + 8}%, var(--w-bg-muted))`,
                    cursor: "pointer",
                  }}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>
      {hover && (
        <div style={{ position: "absolute", left: Math.min(hover.x + 12, 320), top: Math.max(hover.y - 40, 0), zIndex: 20, pointerEvents: "none" }}>
          {renderTooltip(hover.row, hover.col, hover.value)}
        </div>
      )}
    </div>
  )
}

// ─── Main tab ────────────────────────────────────────────────────────────────

export function AssetProductivityTab() {
  const operatorLeaderboard = React.useMemo(generateOperatorLeaderboard, [])
  const mheLeaderboard = React.useMemo(generateMheLeaderboard, [])
  const idleScatter = React.useMemo(generateIdleScatter, [])
  const shiftUtil = React.useMemo(generateShiftUtilization, [])
  const pairingMatrix = React.useMemo(generatePairingMatrix, [])
  const dailyUtil = React.useMemo(generateDailyUtilization, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <KpiCard title="Top Operator Productivity Score" value="OPERATOR_005" />
        <KpiCard title="Lowest Operator Productivity Score" value="OPERATOR_007" />
        <KpiCard title="Top MHE Productivity Score" value="MHE_005" />
        <KpiCard title="Lowest MHE Productivity Score" value="MHE_007" />
        <KpiCard title="Fleet Utilization Score" value="18%" valueSuffix="Warehouse Utilization Score" />
      </div>

      {/* Leaderboards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
        <ChartCard title="Operator Productivity Leaderboard - Top 05" subtitle="Ranked by Score" badge="Daily" lastUpdated="03-03-2026">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={operatorLeaderboard} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" horizontal={false} stroke="var(--w-bg-muted)" />
              <XAxis type="number" domain={[0, 35]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="id" width={70} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<LeaderboardTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {operatorLeaderboard.map((_, i) => (
                  <Cell key={i} fill={`color-mix(in srgb, var(--primary) ${100 - i * 15}%, transparent)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="MHE Productivity Leaderboard - Top 5" subtitle="Highlighting Utilization Status" badge="Weekly" lastUpdated="03-03-2026">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mheLeaderboard} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" horizontal={false} stroke="var(--w-bg-muted)" />
              <XAxis type="number" domain={[0, 35]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="id" width={70} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<LeaderboardTooltip isMhe />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {mheLeaderboard.map((_, i) => (
                  <Cell key={i} fill={`color-mix(in srgb, var(--primary) ${100 - i * 15}%, transparent)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Scatter + shift heatmap */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
        <ChartCard title="Operator Productivity vs Idle Time" subtitle="Wasted Time Analysis" badge="Daily">
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" stroke="var(--w-bg-muted)" />
              <XAxis type="number" dataKey="idle" name="Idle Time" domain={[0, 500]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="productivity" name="Productivity" domain={[0, 20]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<IdleScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={idleScatter} fill="var(--primary)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="MHE Utilization Across Shifts" subtitle="Usage Pattern Analysis">
          <HeatmapGrid
            rows={MHE_ROWS}
            cols={SHIFTS}
            data={shiftUtil}
            renderTooltip={(row, col, value) => (
              <TooltipShell
                headerLeft={row}
                rows={[
                  { label: "Status", value: value > 0.75 ? "Overworked" : value > 0.4 ? "Balanced" : "Underutilized" },
                  { label: "Shift", value: col },
                  { label: "Score", value: `${Math.round(value * 100)}${value > 0.75 ? "(High)" : ""}` },
                  { label: "Utilization %", value: `${Math.round(value * 100)}%` },
                ]}
              />
            )}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-3)" }}>0%</span>
            <div style={{ flex: 1, height: 6, borderRadius: 4, background: "linear-gradient(to right, var(--w-bg-muted), var(--primary))" }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-3)" }}>100%</span>
          </div>
        </ChartCard>
      </div>

      {/* Pairing matrix + daily utilization */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
        <ChartCard title="Operator ↔ MHE Pairing Efficiency Matrix" subtitle="Optimal Combinations Analysis">
          <HeatmapGrid
            rows={MHE_ROWS}
            cols={OPERATORS_MATRIX}
            data={pairingMatrix}
            renderTooltip={(row, col, value) => (
              <TooltipShell
                headerLeft={`${col} | ${row}`}
                rows={[{ label: "Efficiency", value: `${Math.round(value * 100)}%`, bold: true }]}
              />
            )}
          />
        </ChartCard>

        <ChartCard title="Daily MHE Utilization" subtitle="Workload Status" badge="Daily">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)" }} /> Optimal
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626" }} /> Overutilized
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} /> Underutilized
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={dailyUtil} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis dataKey="id" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 8]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <ReferenceLine y={7} stroke="#dc2626" strokeDasharray="4 4" strokeWidth={1.2} />
              <Tooltip content={<DailyUtilTooltip />} cursor={{ stroke: "var(--w-border)" }} />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="var(--w-text-3)"
                strokeWidth={1}
                dot={(props: any) => {
                  const { cx, cy, payload } = props
                  return <circle key={payload.id} cx={cx} cy={cy} r={5} fill={STATUS_COLOR[payload.status]} stroke="var(--w-bg)" strokeWidth={2} />
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
