import * as React from "react"
import { ArrowUp, AlertTriangle, Maximize2, ChevronDown } from "lucide-react"
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, ZAxis, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"
import {
  ChartCard, TooltipShell, cardStyle, FilterSelect, seededRandom,
} from "../productivity/shared"

// ─── Mock data ───────────────────────────────────────────────────────────────

const MHE_TYPES = ["BOPT", "Forklift", "Reach Truck"] as const
const MHE_TYPE_COLORS: Record<string, string> = {
  BOPT: "color-mix(in srgb, var(--primary) 55%, transparent)",
  Forklift: "var(--primary)",
  "Reach Truck": "color-mix(in srgb, var(--primary) 30%, transparent)",
}

function generateCycleTimeDistribution() {
  const rand = seededRandom(9)
  const ranges = ["0-5 min", "5-10 min", "15-20 min", "20-25 min", "25-30 min", "30+ min"]
  return ranges.map(r => ({ range: r, pallets: Math.round(240 + rand() * 130) }))
}

const HOURS = ["6am", "7am", "8am", "9am", "10am", "11am", "12am", "1pm"]

function generateHourlyTrend() {
  const rand = seededRandom(15)
  return HOURS.map(h => {
    const row: any = { hour: h }
    MHE_TYPES.forEach(t => { row[t] = Math.round(80 + rand() * 280) })
    return row
  })
}

interface PairingRow { rank: number; operator: string; optimalMhe: string; cycleTimes: Record<typeof MHE_TYPES[number], number> }

function generatePairingRanking(): PairingRow[] {
  const rand = seededRandom(27)
  return [1, 2, 3].map(rank => ({
    rank,
    operator: "Jack Smith",
    optimalMhe: "Reach Truck",
    cycleTimes: {
      BOPT: Math.round((12 + rand() * 2) * 10) / 10,
      Forklift: Math.round((13 + rand() * 2) * 10) / 10,
      "Reach Truck": Math.round((14 + rand() * 2) * 10) / 10,
    },
  }))
}

function generateSpeedProductivity() {
  const rand = seededRandom(33)
  return MHE_TYPES.flatMap(type => Array.from({ length: 5 }, () => ({
    type,
    speed: Math.round((5 + rand() * 4.5) * 10) / 10,
    pallets: Math.round(50 + rand() * 280),
  })))
}

function generateDistanceEfficiency() {
  const rand = seededRandom(45)
  return MHE_TYPES.flatMap(type => Array.from({ length: 10 }, () => ({
    type,
    distance: Math.round((5 + rand() * 4.5) * 10) / 10,
    cycleTime: Math.round(2 + rand() * 38),
    size: Math.round(60 + rand() * 200),
  })))
}

function generateOperatorUtilization() {
  const rand = seededRandom(55)
  return Array.from({ length: 7 }, () => {
    const utilised = Math.round(30 + rand() * 55)
    const idle = Math.round(rand() * (100 - utilised) * 0.3)
    const nonUtilised = 100 - utilised - idle
    return { operator: "James Wilson", utilised, nonUtilised, idle }
  })
}

// ─── KPI card (icon top-right + delta line) ─────────────────────────────────

function DeltaKpiCard({
  icon: Icon, title, value, delta, deltaTone, footnote,
}: {
  icon: React.ElementType; title: string; value: string; delta: string; deltaTone: "up-good" | "up-bad" | "down-bad"; footnote?: string
}) {
  const deltaColor = deltaTone === "up-good" ? "#16a34a" : "#dc2626"
  return (
    <div style={{ ...cardStyle, padding: "16px 18px", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12.5, color: "var(--w-text-2)" }}>{title}</span>
        <Icon size={15} strokeWidth={1.75} style={{ color: "var(--w-text-3)" }} />
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--w-text-1)" }}>{value}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11.5, color: deltaColor }}>{delta}</span>
      {footnote && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>{footnote}</span>}
    </div>
  )
}

// ─── Legend ──────────────────────────────────────────────────────────────────

function MheTypeLegend({ label = "MHE Type:" }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>{label}</span>
      {MHE_TYPES.map(t => (
        <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: MHE_TYPE_COLORS[t] }} />
          {t}
        </span>
      ))}
    </div>
  )
}

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function CycleTimeTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return <TooltipShell headerLeft="" rows={[{ label: "pallets:", value: String(d.pallets), bold: true }, { label: "Time Range:", value: d.range }]} />
}

function HourlyTrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const p = payload[payload.length - 1]
  return (
    <TooltipShell
      headerLeft=""
      rows={[
        { label: "MHE Type:", value: p.dataKey, bold: true },
        { label: "Time:", value: label },
        { label: "Pallets/Hour:", value: String(p.value) },
      ]}
    />
  )
}

function SpeedProductivityTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft=""
      rows={[
        { label: "MHE Type:", value: d.type, bold: true },
        { label: "Speed:", value: `${d.speed} km/h` },
        { label: "Pallets/Hour:", value: String(d.pallets) },
      ]}
    />
  )
}

function DistanceTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft=""
      rows={[
        { label: "MHE Type:", value: d.type, bold: true },
        { label: "Distance:", value: `${d.distance} m` },
        { label: "Cycle Time:", value: `${d.cycleTime} min` },
      ]}
    />
  )
}

function UtilizationTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft=""
      rows={[
        { label: "Operator:", value: label, bold: true },
        { label: "Utilised:", value: `${d.utilised}%` },
        { label: "Non-Utilised:", value: `${d.nonUtilised}%` },
        { label: "Idle:", value: `${d.idle}%` },
      ]}
    />
  )
}

// ─── Ranked pairing list ──────────────────────────────────────────────────────

function PairingRankRow({ row }: { row: PairingRow }) {
  return (
    <div style={{ border: "1px solid var(--w-border)", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            background: "color-mix(in srgb, var(--primary) 14%, transparent)", color: "var(--primary)",
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12,
          }}>
            {row.rank}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--w-text-1)" }}>
            Operator ID - {row.operator}
          </span>
        </div>
        <span style={{
          padding: "4px 10px", borderRadius: 6, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10.5,
          background: "color-mix(in srgb, #16a34a 14%, transparent)", color: "#16a34a", whiteSpace: "nowrap",
        }}>
          Optimal MHE : {row.optimalMhe}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {MHE_TYPES.map(t => (
          <div key={t} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "var(--w-text-2)" }}>{t}</span>
          </div>
        ))}
        {MHE_TYPES.map(t => (
          <span key={t} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, color: "var(--w-text-1)" }}>
            {row.cycleTimes[t]} min
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Main tab ────────────────────────────────────────────────────────────────

export function PalletEfficiencyTab() {
  const cycleTimeData = React.useMemo(generateCycleTimeDistribution, [])
  const hourlyTrend = React.useMemo(generateHourlyTrend, [])
  const pairingRanking = React.useMemo(generatePairingRanking, [])
  const speedProductivity = React.useMemo(generateSpeedProductivity, [])
  const distanceEfficiency = React.useMemo(generateDistanceEfficiency, [])
  const operatorUtilization = React.useMemo(generateOperatorUtilization, [])

  const [utilFilter, setUtilFilter] = React.useState("All")

  const highlightedRange = "15-20 min"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <DeltaKpiCard icon={ArrowUp} title="Average Cycle Time" value="12.4 min" delta="↑ 8% vs last week" deltaTone="up-good" />
        <DeltaKpiCard icon={ArrowUp} title="Warehouse Efficiency Rate" value="8.4 min" delta="↑18% vs last week" deltaTone="up-bad" />
        <DeltaKpiCard icon={ArrowUp} title="Empty Travel Rate" value="38%" delta="↑5% vs last week" deltaTone="up-good" />
        <DeltaKpiCard icon={AlertTriangle} title="Worst Operator–MHE Pair" value="61.8% efficiency" delta="↓8% vs last week" deltaTone="down-bad" footnote="Operator #22 + MHE #3" />
      </div>

      {/* Cycle time distribution + hourly trend */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard
          title="Pallet Cycle Time Distribution"
          subtitle="Distribution of pallet movement frequency by cycle time duration."
          badge="Last 7 days"
          onRefresh={() => {}}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cycleTimeData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis dataKey="range" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6} />
              <YAxis domain={[0, 400]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4} />
              <Tooltip content={<CycleTimeTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="pallets" radius={[4, 4, 0, 0]} maxBarSize={44}>
                {cycleTimeData.map(d => (
                  <Cell key={d.range} fill={d.range === highlightedRange ? "var(--primary)" : "color-mix(in srgb, var(--primary) 16%, transparent)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Pallets Per Hour - Hourly Trends"
          subtitle=""
          onRefresh={() => {}}
          filters={
            <div style={{ display: "flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", border: "1px solid var(--w-border)", borderRadius: 6, background: "var(--w-bg)" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-1)" }}>7 Jan 2026</span>
              <ChevronDown size={12} strokeWidth={1.5} style={{ color: "var(--w-text-3)" }} />
            </div>
          }
        >
          <div style={{ marginBottom: 10 }}><MheTypeLegend /></div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis dataKey="hour" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6} />
              <YAxis domain={[0, 400]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4} />
              <ReferenceLine x="8am" stroke="#dc2626" strokeDasharray="4 4" strokeWidth={1.2} />
              <Tooltip content={<HourlyTrendTooltip />} cursor={{ stroke: "var(--w-border)" }} />
              {MHE_TYPES.map(t => (
                <Line key={t} type="monotone" dataKey={t} stroke={MHE_TYPE_COLORS[t]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Pairing ranking + speed correlation */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard
          title="Operator–MHE Efficiency Pairing"
          subtitle="Ranked by efficiency score"
          filters={
            <button type="button" style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "1px solid var(--w-border)", background: "var(--w-bg)", cursor: "pointer" }}>
              <Maximize2 size={13} strokeWidth={1.5} style={{ color: "var(--w-text-2)" }} />
            </button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pairingRanking.map(row => <PairingRankRow key={row.rank} row={row} />)}
          </div>
        </ChartCard>

        <ChartCard title="Speed vs Productivity Correlation" subtitle="" onRefresh={() => {}}>
          <div style={{ marginBottom: 10 }}><MheTypeLegend /></div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" stroke="var(--w-bg-muted)" />
              <XAxis type="number" dataKey="speed" name="Average Speed" domain={[5, 9.5]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} label={{ value: "AVERAGE SPEED (KM/H)", position: "insideBottom", offset: -4, fontSize: 9, fill: "var(--w-text-3)" }} />
              <YAxis type="number" dataKey="pallets" name="Pallets Per Hour" domain={[0, 400]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<SpeedProductivityTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              {MHE_TYPES.map(t => (
                <Scatter key={t} data={speedProductivity.filter(d => d.type === t)} fill={MHE_TYPE_COLORS[t]} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Distance efficiency + operator utilization */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard title="Distance Efficiency Analysis" subtitle="" badge="Weekly" onRefresh={() => {}}>
          <div style={{ marginBottom: 10 }}><MheTypeLegend /></div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" stroke="var(--w-bg-muted)" />
              <XAxis type="number" dataKey="distance" name="Average Distance Travelled" domain={[5, 9.5]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="cycleTime" name="Cycle Time Range" domain={[0, 40]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <ZAxis type="number" dataKey="size" range={[40, 300]} />
              <Tooltip content={<DistanceTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              {MHE_TYPES.map(t => (
                <Scatter key={t} data={distanceEfficiency.filter(d => d.type === t)} fill={MHE_TYPE_COLORS[t]} fillOpacity={0.7} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Operator Utilization"
          subtitle=""
          badge="Monthly"
          filters={<FilterSelect value={utilFilter} onChange={setUtilFilter} options={["All", "Day", "Evening", "Night"]} />}
        >
          <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>Cycle Time:</span>
            {[["Utilized", "var(--primary)"], ["Non-Utilized", "color-mix(in srgb, var(--primary) 55%, transparent)"], ["Idle", "color-mix(in srgb, var(--primary) 25%, transparent)"]].map(([label, color]) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                {label}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={operatorUtilization} margin={{ top: 10, right: 10, left: -10, bottom: 5 }} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis dataKey="operator" tick={{ fontFamily: "Inter, sans-serif", fontSize: 9, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6} interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4} />
              <Tooltip content={<UtilizationTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="utilised" stackId="u" fill="var(--primary)" maxBarSize={14} radius={[3, 3, 0, 0]} />
              <Bar dataKey="nonUtilised" stackId="u" fill="color-mix(in srgb, var(--primary) 55%, transparent)" maxBarSize={14} />
              <Bar dataKey="idle" stackId="u" fill="color-mix(in srgb, var(--primary) 25%, transparent)" maxBarSize={14} radius={[0, 0, 3, 3]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
