import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  BarChart, Bar, ScatterChart, Scatter, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import {
  ChartCard, TooltipShell, cardStyle, seededRandom,
} from "./shared"

// ─── Mock data ───────────────────────────────────────────────────────────────

const OPERATOR_IDS: Record<string, string> = {
  "Karan Jadhav": "KRJDLP", "Nilesh Bhosale": "NBGJDL", "Anil Chavan": "ANCHVN",
  "Prakash Joshi": "PRJOSH", "Sunil Jadhav": "SUJDLP",
}

function generateOperatorLeaderboard() {
  return [
    { id: "Karan Jadhav", score: 100 },
    { id: "Nilesh Bhosale", score: 66.32 },
    { id: "Anil Chavan", score: 65.88 },
    { id: "Prakash Joshi", score: 62.1 },
    { id: "Sunil Jadhav", score: 61.45 },
  ]
}

function generateMheLeaderboard() {
  return [
    { id: "MHE 03", score: 100 },
    { id: "MHE 05", score: 39.35 },
    { id: "MHE 04", score: 32.2 },
    { id: "MHE 08", score: 24.41 },
    { id: "MHE 01", score: 4.48 },
  ]
}

function generateIdleScatter() {
  const rand = seededRandom(31)
  return Array.from({ length: 8 }, () => ({
    idle: Math.round(30 + rand() * 400),
    productivity: Math.round(3 + rand() * 15),
  }))
}

// MHE list matches the MHE Asset Details mock data
const MHE_ROWS = ["MHE 03", "MHE 06", "MHE 05", "MHE 02", "MHE 08", "Test No Warranty Field", "MHE 01", "MHE 10", "MHE 09", "MHE 04", "MHE 07"]

const SESSIONS = ["Morning session", "Afternoon session", "Night session"]

function generateSessionUtilization() {
  const rand = seededRandom(51)
  const grid: Record<string, Record<string, number>> = {}
  MHE_ROWS.forEach(m => {
    grid[m] = {}
    SESSIONS.forEach(s => { grid[m][s] = rand() })
  })
  return grid
}

// Operator list matches the Operator Assignment mock data
const OPERATORS_MATRIX = [
  "Anil Sharma", "Ganesh More", "Karan Jadhav", "Prakash Joshi", "Vishal Sawant",
  "Rajesh Shinde", "Deepak Pawar", "Rahul Patil", "Anil Chavan", "Nilesh Bhosale",
  "Sandeep Kulkarni", "Vivek Deshmukh", "Sunil Jadhav", "Suresh Patil", "Mahesh Gaikwad",
]

function generatePairingMatrix() {
  const rand = seededRandom(61)
  const grid: Record<string, Record<string, number>> = {}
  MHE_ROWS.forEach(m => {
    grid[m] = {}
    OPERATORS_MATRIX.forEach(o => { grid[m][o] = rand() })
  })
  return grid
}

// ─── Score KPI card (with trend icon) ────────────────────────────────────────

function ScoreKpiCard({
  icon: Icon, tone, title, value, score,
}: {
  icon: React.ElementType; tone: "up" | "down"; title: string; value: string; score: string
}) {
  const color = tone === "up" ? "#16a34a" : "#dc2626"
  return (
    <div style={{ ...cardStyle, padding: "16px 18px", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
          <Icon size={13} strokeWidth={2} style={{ color }} />
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "var(--w-text-2)" }}>{title}</span>
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--w-text-1)" }}>{value}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11.5, color: "var(--w-text-2)" }}>Score: {score}</span>
    </div>
  )
}

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function OperatorLeaderboardTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft={d.id}
      rows={[
        { label: "Operator ID", value: OPERATOR_IDS[d.id] ?? "-" },
        { label: "Score", value: String(d.score), bold: true },
      ]}
    />
  )
}

function MheLeaderboardTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft={d.id}
      rows={[
        { label: "MHE ID", value: d.id.replace(/\s/g, "") },
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
      headerLeft="Prakash Joshi"
      rows={[
        { label: "Operator ID", value: OPERATOR_IDS["Prakash Joshi"] },
        { label: "Productivity", value: `${d.productivity} pallets/hr` },
        { label: "Idle Time", value: `${d.idle} min` },
      ]}
    />
  )
}

// ─── Bar % label ──────────────────────────────────────────────────────────────

function PercentLabel(props: any) {
  const { x, y, width, height, value } = props
  return (
    <text x={x + width + 6} y={y + height / 2} dy={4} fontFamily="Inter, sans-serif" fontSize={11} fontWeight={600} fill="var(--w-text-1)">
      {value}%
    </text>
  )
}

// ─── Heatmap grid with hover tooltip ─────────────────────────────────────────

function HeatmapGrid<Row extends string, Col extends string>({
  rows, cols, data, renderTooltip, colWidth = 70, truncateCols = false,
}: {
  rows: Row[]
  cols: Col[]
  data: Record<string, Record<string, number>>
  renderTooltip: (row: Row, col: Col, value: number) => React.ReactNode
  colWidth?: number
  truncateCols?: boolean
}) {
  const [hover, setHover] = React.useState<{ row: Row; col: Col; value: number; x: number; y: number } | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  function handleEnter(row: Row, col: Col, value: number, e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    setHover({ row, col, value, x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) })
  }

  return (
    <div ref={containerRef} style={{ position: "relative", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: `92px repeat(${cols.length}, minmax(${colWidth}px, 1fr))`, gap: 4, minWidth: 92 + cols.length * colWidth }}>
        <div />
        {cols.map(c => (
          <div
            key={c}
            title={c}
            style={{
              textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", paddingBottom: 4,
              overflow: truncateCols ? "hidden" : undefined, textOverflow: truncateCols ? "ellipsis" : undefined, whiteSpace: "nowrap",
            }}
          >
            {truncateCols && c.length > 8 ? `${c.slice(0, 7)}…` : c}
          </div>
        ))}
        {rows.map(r => (
          <React.Fragment key={r}>
            <div title={r} style={{ display: "flex", alignItems: "center", fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.length > 10 ? `${r.slice(0, 9)}…` : r}
            </div>
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
  const sessionUtil = React.useMemo(generateSessionUtilization, [])
  const pairingMatrix = React.useMemo(generatePairingMatrix, [])

  const topOperator = operatorLeaderboard[0]
  const lowestOperator = operatorLeaderboard[operatorLeaderboard.length - 1]
  const topMhe = mheLeaderboard[0]
  const lowestMhe = mheLeaderboard[mheLeaderboard.length - 1]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <ScoreKpiCard icon={TrendingUp} tone="up" title="Top Operator Productivity Score" value={topOperator.id} score={String(topOperator.score)} />
        <ScoreKpiCard icon={TrendingDown} tone="down" title="Lowest Operator Productivity Score" value={lowestOperator.id} score={String(lowestOperator.score)} />
        <ScoreKpiCard icon={TrendingUp} tone="up" title="Top MHE Productivity Score" value={topMhe.id} score={String(topMhe.score)} />
        <ScoreKpiCard icon={TrendingDown} tone="down" title="Lowest MHE Productivity Score" value={lowestMhe.id} score={String(lowestMhe.score)} />
      </div>

      {/* Leaderboards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 16 }}>
        <ChartCard title="Operator Productivity Leaderboard — Top 5" subtitle="Ranked by productivity score" onRefresh={() => {}}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={operatorLeaderboard} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" horizontal={false} stroke="var(--w-bg-muted)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="id" width={90} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<OperatorLeaderboardTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {operatorLeaderboard.map((_, i) => (
                  <Cell key={i} fill={`color-mix(in srgb, var(--primary) ${100 - i * 15}%, transparent)`} />
                ))}
                <LabelList dataKey="score" content={<PercentLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="MHE Productivity Leaderboard — Top 5" subtitle="Highlighting utilization status" onRefresh={() => {}}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mheLeaderboard} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" horizontal={false} stroke="var(--w-bg-muted)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="id" width={70} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<MheLeaderboardTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {mheLeaderboard.map((_, i) => (
                  <Cell key={i} fill={`color-mix(in srgb, var(--primary) ${100 - i * 15}%, transparent)`} />
                ))}
                <LabelList dataKey="score" content={<PercentLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Idle time scatter + session heatmap */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 16 }}>
        <ChartCard title="Operator Productivity vs Idle Time" subtitle="Wasted time analysis" onRefresh={() => {}}>
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

        <ChartCard title="MHE Utilization Across Sessions" subtitle="Usage Pattern Analysis(Sessions)" onRefresh={() => {}}>
          <HeatmapGrid
            rows={MHE_ROWS}
            cols={SESSIONS}
            data={sessionUtil}
            renderTooltip={(row, col, value) => (
              <TooltipShell
                headerLeft={row}
                rows={[
                  { label: "Status", value: value > 0.75 ? "Overworked" : value > 0.4 ? "Balanced" : "Underutilized" },
                  { label: "Session", value: col },
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

      {/* Pairing matrix */}
      <ChartCard title="Operator ↔ MHE Pairing Productivity Matrix" subtitle="Optimal Combinations Analysis" onRefresh={() => {}}>
        <HeatmapGrid
          rows={MHE_ROWS}
          cols={OPERATORS_MATRIX}
          data={pairingMatrix}
          colWidth={64}
          truncateCols
          renderTooltip={(row, col, value) => (
            <TooltipShell
              headerLeft={col}
              rows={[
                { label: row, value: String(Math.round(value * 100)) },
              ]}
            />
          )}
        />
      </ChartCard>
    </div>
  )
}
