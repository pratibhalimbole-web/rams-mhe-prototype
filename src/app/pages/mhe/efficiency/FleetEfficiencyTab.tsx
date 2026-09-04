import * as React from "react"
import { ArrowUp, ArrowDown, Forklift } from "lucide-react"
import {
  ComposedChart, Scatter, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"
import {
  ChartCard, TooltipShell, cardStyle, seededRandom,
  Avatar, TableShell, Td, Pagination,
} from "../productivity/shared"

// ─── Mock data ───────────────────────────────────────────────────────────────

const MHE_TYPE_COLORS: Record<string, string> = {
  BOPT: "#16a34a",
  Forklift: "#f59e0b",
  "Reach Truck": "var(--primary)",
  "Reach Truck 1": "#7c3aed",
  "Reach Truck 2": "#d97706",
}
const MHE_TYPES = Object.keys(MHE_TYPE_COLORS)

function statusFor(utilization: number): string {
  if (utilization < 33) return "Underutilized"
  if (utilization > 75) return "Overutilized"
  return "Optimal"
}

function trendCurve(utilization: number) {
  const peakAt = 55
  const spread = 0.045
  return Math.max(20, 240 - spread * (utilization - peakAt) ** 2)
}

function generateFleetDistribution() {
  const rand = seededRandom(101)
  return MHE_TYPES.flatMap((type, ti) => Array.from({ length: 7 }, (_, i) => {
    const utilization = Math.round(rand() * 100)
    const noise = (rand() - 0.5) * 60
    const pallets = Math.max(5, Math.round(trendCurve(utilization) + noise))
    return {
      mheType: type,
      mheName: `MHE${String(ti * 7 + i + 1).padStart(3, "0")}`,
      utilization,
      pallets,
      status: statusFor(utilization),
    }
  }))
}

const TREND_LINE = Array.from({ length: 21 }, (_, i) => {
  const utilization = i * 5
  return { utilization, trend: Math.round(trendCurve(utilization)) }
})

const UTIL_DIST_TYPES = ["BOPT", "Forklift", "Reach Truck", "BOPT_1", "Forklift_2"]

function generateUtilizationDistribution() {
  const rand = seededRandom(111)
  return UTIL_DIST_TYPES.map(type => {
    const count = 8 + Math.floor(rand() * 14)
    const underUtilised = Math.round(15 + rand() * 25)
    const overUtilised = Math.round(15 + rand() * 25)
    const efficient = 100 - underUtilised - overUtilised
    return { type, count, underUtilised, efficient, overUtilised }
  })
}

const SHIFT_LABELS = ["1st Session", "2nd Session", "3rd Session", "4th Session"]
const SHIFT_MHE_LIST = ["MHE001", "MHE002", "MHE003", "MHE004", "MHE005", "MHE006"]

function generateShiftUtilization() {
  const rand = seededRandom(121)
  return SHIFT_MHE_LIST.map(mhe => {
    const raw = SHIFT_LABELS.map(() => 0.15 + rand())
    const total = raw.reduce((a, b) => a + b, 0)
    const pcts = raw.map(v => Math.round((v / total) * 100))
    const diff = 100 - pcts.reduce((a, b) => a + b, 0)
    pcts[0] += diff
    const optimalIndex = pcts.indexOf(Math.max(...pcts))
    return { mhe, pcts, optimalIndex }
  })
}

const OPERATOR_EFFICIENCY_ROWS = (() => {
  const rand = seededRandom(131)
  const names = ["James Wilson", "Karan Jadhav", "Anil Chavan", "Nilesh Bhosale", "Prakash Joshi", "Rahul Patil", "Vishal Sawant", "Deepak Pawar"]
  return names.map(name => {
    const efficiency = Math.round(10 + rand() * 80)
    return {
      name,
      efficiency,
      palletsPerHour: Math.round(15 + rand() * 15),
      idleWithLoad: Math.round(10 + rand() * 25),
      deadheadPct: Math.round(45 + rand() * 45),
      deadheadUp: rand() > 0.5,
    }
  })
})()

const MHE_EFFICIENCY_ROWS = (() => {
  const rand = seededRandom(141)
  const ids = ["MHE_B08", "MHE_B03", "MHE_B05", "MHE_B01", "MHE_B10", "MHE_B07"]
  return ids.map(id => ({
    id,
    palletsPerHour: Math.round(15 + rand() * 15),
    energyLoss: Math.round(40 + rand() * 55),
    efficiencyPct: Math.round(45 + rand() * 45),
    efficiencyUp: rand() > 0.5,
  }))
})()

const ZONES = ["Receiving", "Storage-A", "Storage-B", "Storage-C", "Picking", "Packing", "Staging", "Dispatch", "Loading"]

const CYCLE_MIN = 6
const CYCLE_MAX = 20

function cycleCategory(minutes: number): "fast" | "moderate" | "slow" {
  if (minutes <= 10) return "fast"
  if (minutes <= 15) return "moderate"
  return "slow"
}

function cycleIntensity(minutes: number): number {
  return Math.min(1, Math.max(0, (minutes - CYCLE_MIN) / (CYCLE_MAX - CYCLE_MIN)))
}

function zoneCellColor(minutes: number): string {
  const intensity = cycleIntensity(minutes)
  return `color-mix(in srgb, var(--primary) ${Math.round(intensity * 80) + 12}%, var(--w-bg-muted))`
}

function generateZoneFlow() {
  const rand = seededRandom(151)
  const grid: Record<string, Record<string, { pallets: number; cycleTime: number } | null>> = {}
  ZONES.forEach(from => {
    grid[from] = {}
    ZONES.forEach(to => {
      grid[from][to] = from === to ? null : {
        pallets: Math.round(80 + rand() * 300),
        cycleTime: Math.round((CYCLE_MIN + rand() * (CYCLE_MAX - CYCLE_MIN)) * 10) / 10,
      }
    })
  })
  return grid
}

// ─── KPI card (icon top-right + delta line) ─────────────────────────────────

function FleetKpiCard({
  title, value, deltaPct, deltaGood,
}: {
  title: string; value: string; deltaPct: number; deltaGood: boolean
}) {
  const color = deltaGood ? "#16a34a" : "#dc2626"
  const Icon = deltaPct >= 0 ? ArrowUp : ArrowDown
  return (
    <div style={{ ...cardStyle, padding: "16px 18px", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12.5, color: "var(--w-text-2)" }}>{title}</span>
        <Icon size={15} strokeWidth={1.75} style={{ color: "var(--w-text-3)" }} />
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--w-text-1)" }}>{value}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11.5, color }}>
        {deltaPct >= 0 ? "↑" : "↓"}{Math.abs(deltaPct)}% vs last week
      </span>
    </div>
  )
}

// ─── Y-axis title, vertically centered in the widget ─────────────────────────

function YAxisTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, flexShrink: 0 }}>
      <span style={{
        fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: 0.3, color: "var(--w-text-3)",
        whiteSpace: "nowrap", transform: "rotate(-90deg)", display: "inline-block",
      }}>
        {children}
      </span>
    </div>
  )
}

// ─── Legend ──────────────────────────────────────────────────────────────────

function FleetTypeLegend() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
        <span style={{ width: 14, height: 0, borderTop: "2px dashed #dc2626" }} /> Underutilized
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
        <span style={{ width: 14, height: 0, borderTop: "2px dashed #16a34a" }} /> Optimal
      </span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>MHE Type:</span>
      {MHE_TYPES.map(t => (
        <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: MHE_TYPE_COLORS[t] }} />
          {t}
        </span>
      ))}
    </div>
  )
}

function UtilZoneLegend() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>Zone:</span>
      {[["Under-utilised", "color-mix(in srgb, var(--primary) 18%, transparent)"], ["Efficient", "color-mix(in srgb, var(--primary) 45%, transparent)"], ["Over Utilised", "var(--primary)"]].map(([label, color]) => (
        <span key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
          {label}
        </span>
      ))}
    </div>
  )
}

function CycleTimeLegend() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>Cycle Time:</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-3)" }}>Fast</span>
      <div style={{ width: 90, height: 6, borderRadius: 4, background: "linear-gradient(to right, var(--w-bg-muted), var(--primary))" }} />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-3)" }}>Slow</span>
    </div>
  )
}

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function UtilizationDistTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft=""
      rows={[
        { label: "MHE Type:", value: label, bold: true },
        { label: "MHE Count:", value: String(d.count) },
        { label: "Under-utilised:", value: `${d.underUtilised.toFixed(2)}%` },
        { label: "Efficient:", value: `${d.efficient.toFixed(2)}%` },
        { label: "Over Utilised:", value: `${d.overUtilised.toFixed(2)}%` },
      ]}
    />
  )
}

// ─── MHE shift utilization card ──────────────────────────────────────────────

function MheShiftCard({ mhe, pcts, optimalIndex }: { mhe: string; pcts: number[]; optimalIndex: number }) {
  return (
    <div style={{ border: "1px solid var(--w-border)", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}>
            <Forklift size={16} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--w-text-1)" }}>{mhe}</span>
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, color: "var(--w-text-2)", background: "var(--w-bg-muted)", borderRadius: 6, padding: "5px 10px", whiteSpace: "nowrap" }}>
          Optimal Shift : {SHIFT_LABELS[optimalIndex]}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${SHIFT_LABELS.length}, 1fr)`, gap: 12 }}>
        {SHIFT_LABELS.map((label, i) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "var(--w-text-2)" }}>{label}</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--w-text-1)" }}>{pcts[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Circular efficiency ring ─────────────────────────────────────────────────

function EfficiencyRing({ value }: { value: number }) {
  const color = value >= 70 ? "#16a34a" : value >= 40 ? "#f59e0b" : "#dc2626"
  const r = 15
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div style={{ position: "relative", width: 36, height: 36, flexShrink: 0 }}>
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--w-bg-muted)" strokeWidth="3" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 18 18)" />
      </svg>
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 9, color: "var(--w-text-1)" }}>
        {value}%
      </span>
    </div>
  )
}

function EfficiencyBadge({ pct, up }: { pct: number; up: boolean }) {
  const color = up ? "#16a34a" : "#dc2626"
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 6,
      background: `color-mix(in srgb, ${color} 12%, transparent)`, color, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11,
    }}>
      {up ? "↑" : "↓"} {pct}%
    </span>
  )
}

// ─── Zone-to-zone flow matrix ─────────────────────────────────────────────────

function ZoneFlowMatrix({ data }: { data: ReturnType<typeof generateZoneFlow> }) {
  const [hover, setHover] = React.useState<{ from: string; to: string; x: number; y: number } | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  function handleEnter(from: string, to: string, e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    setHover({ from, to, x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) })
  }

  const hoverCell = hover ? data[hover.from][hover.to] : null
  const containerSize = containerRef.current?.getBoundingClientRect()
  const tooltipLeft = hover ? Math.min(hover.x + 12, Math.max(0, (containerSize?.width ?? 600) - 200)) : 0
  const tooltipTop = hover ? Math.min(Math.max(hover.y - 60, 0), Math.max(0, (containerSize?.height ?? 300) - 140)) : 0

  return (
    <div ref={containerRef} style={{ position: "relative", overflow: "visible" }}>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `84px repeat(${ZONES.length}, minmax(110px, 1fr))`, gap: 6, minWidth: 84 + ZONES.length * 110 }}>
          {ZONES.map(from => (
            <React.Fragment key={from}>
              <div style={{ display: "flex", alignItems: "center", fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>{from}</div>
              {ZONES.map(to => {
                const cell = data[from][to]
                if (!cell) {
                  return <div key={to} style={{ height: 32, borderRadius: 6, background: "var(--w-bg)", border: "1px solid var(--w-border)" }} />
                }
                return (
                  <div
                    key={to}
                    onMouseEnter={e => handleEnter(from, to, e)}
                    onMouseMove={e => handleEnter(from, to, e)}
                    onMouseLeave={() => setHover(null)}
                    style={{ height: 32, borderRadius: 6, background: zoneCellColor(cell.cycleTime), cursor: "pointer" }}
                  />
                )
              })}
            </React.Fragment>
          ))}
          <div />
          {ZONES.map(z => (
            <div key={z} style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)", paddingTop: 4 }}>{z}</div>
          ))}
        </div>
      </div>
      {hover && hoverCell && (
        <div style={{ position: "absolute", left: tooltipLeft, top: tooltipTop, zIndex: 20, pointerEvents: "none" }}>
          <TooltipShell
            headerLeft=""
            rows={[
              { label: "Status", value: cycleCategory(hoverCell.cycleTime), bold: true, color: zoneCellColor(hoverCell.cycleTime) },
              { label: "From", value: hover.from, hideDot: true },
              { label: "To", value: hover.to, hideDot: true },
              { label: "No of pallets", value: String(hoverCell.pallets), hideDot: true },
              { label: "Average cycle time", value: `${hoverCell.cycleTime} min`, hideDot: true },
            ]}
          />
        </div>
      )}
    </div>
  )
}

// ─── Main tab ────────────────────────────────────────────────────────────────

export function FleetEfficiencyTab() {
  const fleetDistribution = React.useMemo(generateFleetDistribution, [])
  const utilizationDistribution = React.useMemo(generateUtilizationDistribution, [])
  const shiftUtil = React.useMemo(generateShiftUtilization, [])
  const zoneFlow = React.useMemo(generateZoneFlow, [])

  const [distributionHover, setDistributionHover] = React.useState<{ x: number; y: number; d: any } | null>(null)

  const [operatorPageSize, setOperatorPageSize] = React.useState(5)
  const [operatorPageIndex, setOperatorPageIndex] = React.useState(0)
  const operatorPaged = OPERATOR_EFFICIENCY_ROWS.slice(operatorPageIndex * operatorPageSize, operatorPageIndex * operatorPageSize + operatorPageSize)

  const [mhePageSize, setMhePageSize] = React.useState(5)
  const [mhePageIndex, setMhePageIndex] = React.useState(0)
  const mhePaged = MHE_EFFICIENCY_ROWS.slice(mhePageIndex * mhePageSize, mhePageIndex * mhePageSize + mhePageSize)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <FleetKpiCard title="% MHEs Underutilized" value="23%" deltaPct={-8} deltaGood />
        <FleetKpiCard title="% MHEs Overutilized" value="23%" deltaPct={5} deltaGood={false} />
        <FleetKpiCard title="Fleet Idle Time" value="387 hrs/wk" deltaPct={-12} deltaGood />
        <FleetKpiCard title="Energy Wasted (Idle)" value="2,847 kWh" deltaPct={-8} deltaGood />
        <FleetKpiCard title="Top Operator Efficiency" value="96.8%" deltaPct={3} deltaGood />
      </div>

      {/* Fleet efficiency distribution */}
      <ChartCard title="Fleet Efficiency Distribution" subtitle="" badge="Last 7 days" legend={<FleetTypeLegend />} onRefresh={() => {}}>
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <YAxisTitle>PALLETS MOVED PER HOUR</YAxisTitle>
          <div style={{ position: "relative", flex: 1 }}>
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart margin={{ top: 10, right: 20, left: 4, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--w-bg-muted)" />
                <XAxis type="number" dataKey="utilization" domain={[0, 100]} unit="%" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false}
                  label={{ value: "UTILIZATION (%)", position: "insideBottom", offset: -6, fontSize: 9, fill: "var(--w-text-3)", textAnchor: "middle" }} />
                <YAxis type="number" dataKey="pallets" domain={[0, "dataMax + 30"]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
                <ReferenceLine x={33} stroke="#dc2626" strokeDasharray="4 4" />
                <ReferenceLine x={75} stroke="#16a34a" strokeDasharray="4 4" />
                <Line data={TREND_LINE} type="monotone" dataKey="trend" stroke="var(--primary)" strokeWidth={2} strokeDasharray="7 5" dot={false} isAnimationActive={false} />
                {MHE_TYPES.map(t => (
                  <Scatter
                    key={t}
                    data={fleetDistribution.filter(d => d.mheType === t)}
                    fill={MHE_TYPE_COLORS[t]}
                    shape={(props: any) => <circle cx={props.cx} cy={props.cy} r={4} fill={props.fill} />}
                    onMouseEnter={(point: any) => setDistributionHover({ x: point.cx, y: point.cy, d: point.payload })}
                    onMouseLeave={() => setDistributionHover(null)}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
            {distributionHover && (
              <div style={{ position: "absolute", left: Math.min(distributionHover.x + 12, 620), top: Math.max(distributionHover.y - 70, 0), zIndex: 20, pointerEvents: "none" }}>
                <TooltipShell
                  headerLeft=""
                  rows={[
                    { label: "Status", value: distributionHover.d.status, bold: true },
                    { label: "MHE Name", value: distributionHover.d.mheName },
                    { label: "MHE", value: distributionHover.d.mheType },
                    { label: "Productivity", value: `${distributionHover.d.pallets} pallets/hour` },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </ChartCard>

      {/* Utilization distribution + shifts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard title="MHE Utilization Distribution" subtitle="" badge="Last 7 days" legend={<UtilZoneLegend />} onRefresh={() => {}}>
          <div style={{ flex: 1, minHeight: 280, overflow: "hidden", display: "flex", alignItems: "stretch" }}>
            <YAxisTitle>UTILIZATION DISTRIBUTION</YAxisTitle>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationDistribution} margin={{ top: 10, right: 10, left: 4, bottom: 16 }} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--w-bg-muted)" />
                <XAxis dataKey="type" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6}
                  label={{ value: "MHE", position: "insideBottom", offset: -6, fontSize: 9, fill: "var(--w-text-3)", textAnchor: "middle" }} />
                <YAxis domain={[0, 100]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4} />
                <Tooltip content={<UtilizationDistTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
                <Bar dataKey="underUtilised" stackId="u" fill="color-mix(in srgb, var(--primary) 18%, transparent)" maxBarSize={40} />
                <Bar dataKey="efficient" stackId="u" fill="color-mix(in srgb, var(--primary) 45%, transparent)" maxBarSize={40} />
                <Bar dataKey="overUtilised" stackId="u" fill="var(--primary)" maxBarSize={40} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="MHE Utilization Across Shifts" subtitle="Usage Pattern Analysis(Shifts)" onRefresh={() => {}}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, height: 280, overflowY: "auto", paddingRight: 4 }}>
            {shiftUtil.map(row => (
              <MheShiftCard key={row.mhe} mhe={row.mhe} pcts={row.pcts} optimalIndex={row.optimalIndex} />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Efficiency tables */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard title="Operator Efficiency Table" subtitle="Operator performance and productivity metrics" onRefresh={() => {}}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <TableShell columns={["Operator", "Pallets Per Hour", "Idle-with-Load (min)", "Deadhead %"]}>
              {operatorPaged.map((r, i) => (
                <tr key={i}>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <EfficiencyRing value={r.efficiency} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: "var(--w-text-1)" }}>{r.name}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>{r.efficiency}% Efficiency</span>
                      </div>
                    </div>
                  </Td>
                  <Td>{r.palletsPerHour}</Td>
                  <Td>{r.idleWithLoad}</Td>
                  <Td><EfficiencyBadge pct={r.deadheadPct} up={r.deadheadUp} /></Td>
                </tr>
              ))}
            </TableShell>
            <div style={{ flex: 1 }} />
            <Pagination pageSize={operatorPageSize} setPageSize={setOperatorPageSize} pageIndex={operatorPageIndex} setPageIndex={setOperatorPageIndex} totalRows={OPERATOR_EFFICIENCY_ROWS.length} />
          </div>
        </ChartCard>

        <ChartCard title="MHE Efficiency Table" subtitle="Machine performance and energy metrics" onRefresh={() => {}}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <TableShell columns={["MHE", "Pallets Per Hour", "Energy Loss (Kwh)", "Efficiency"]}>
              {mhePaged.map((r, i) => (
                <tr key={i}>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 36 }}>
                      <Avatar label="MH" seed={r.id} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: "var(--w-text-1)" }}>{r.id}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>{r.efficiencyPct}% Efficiency</span>
                      </div>
                    </div>
                  </Td>
                  <Td>{r.palletsPerHour}</Td>
                  <Td>{r.energyLoss}%</Td>
                  <Td><EfficiencyBadge pct={r.efficiencyPct} up={r.efficiencyUp} /></Td>
                </tr>
              ))}
            </TableShell>
            <div style={{ flex: 1 }} />
            <Pagination pageSize={mhePageSize} setPageSize={setMhePageSize} pageIndex={mhePageIndex} setPageIndex={setMhePageIndex} totalRows={MHE_EFFICIENCY_ROWS.length} />
          </div>
        </ChartCard>
      </div>

      {/* Zone-to-zone pallet flow matrix */}
      <ChartCard title="Zone-to-Zone Pallet Flow Matrix" subtitle="" legend={<CycleTimeLegend />} onRefresh={() => {}}>
        <ZoneFlowMatrix data={zoneFlow} />
      </ChartCard>
    </div>
  )
}
