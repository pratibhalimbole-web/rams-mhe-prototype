import * as React from "react"
import { RotateCw, AlertTriangle, ShieldAlert, ShieldCheck, HardHat } from "lucide-react"
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import {
  ChartCard, TooltipShell, cardStyle, seededRandom, FilterSelect,
} from "../productivity/shared"
import { Badge } from "../../../components/ui/badge"

// ─── Safety KPI card (icon chip + value + subtitle, matches Driving Safety) ──

function SafetyKpiCard({
  icon: Icon, color, title, value, subtitle,
}: {
  icon: React.ElementType; color: string; title: string; value: string; subtitle: string
}) {
  return (
    <div style={{ ...cardStyle, padding: "16px 18px", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
          <Icon size={14} strokeWidth={1.5} style={{ color }} />
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "var(--w-text-2)" }}>{title}</span>
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--w-text-1)" }}>{value}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11.5, color: "var(--w-text-2)" }}>{subtitle}</span>
    </div>
  )
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const EVENT_CATEGORIES = [
  { key: "Speed Violation", value: 16 },
  { key: "Near Miss", value: 9 },
  { key: "Zone Violations", value: 8 },
  { key: "Operator Compliance", value: 7 },
  { key: "Break Management", value: 5 },
  { key: "Impact Events", value: 5 },
]
const TOTAL_EVENTS = EVENT_CATEGORIES.reduce((a, c) => a + c.value, 0)
const CATEGORY_COLORS = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "var(--primary)"]

const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F", "Zone G"]

function generateIncidentsByZone() {
  const rand = seededRandom(211)
  return ZONES.map((zone, i) => ({ zone, count: i === 2 ? 14 : Math.round(2 + rand() * 6) }))
}

const WEEKDAYS = ["Mon", "Tue", "wed", "Thu", "Fri", "Sat", "Sun"]

function generateIncidentsByShift() {
  const rand = seededRandom(221)
  return WEEKDAYS.map(day => {
    const critical = day === "Tue" ? 5 : Math.round(rand() * 3)
    const high = day === "Tue" ? 2 : Math.round(rand() * 2)
    const warning = day === "Tue" ? 12 : Math.round(2 + rand() * 8)
    return { day, critical, high, warning }
  })
}

const VIOLATION_TYPES = [
  { label: "Harsh Acceleration", value: 240 },
  { label: "Impact", value: 187 },
  { label: "Overspeed", value: 183 },
  { label: "No Vest Detected", value: 170 },
  { label: "Restricted Zone Entry", value: 61 },
]

const SPEED_ZONES = ["Transit", "Parking", "Intersection", "Ramp", "Pedestrian Zone"]

function generateSpeedViolationByZone() {
  const rand = seededRandom(231)
  return SPEED_ZONES.map((zone, i) => {
    const scale = 1 - i * 0.16
    return {
      zone,
      excessive: Math.round((10 + rand() * 20) * scale),
      moderate: Math.round((30 + rand() * 40) * scale),
      minor: Math.round((40 + rand() * 50) * scale),
    }
  })
}

const TREND_WEEKS = ["week1", "week2", "week3", "week4", "week5"]

function generateIncidentTrend() {
  const rand = seededRandom(241)
  return TREND_WEEKS.map(week => ({
    week,
    critical: Math.round(2 + rand() * 5),
    high: Math.round(1 + rand() * 3),
    warning: Math.round(4 + rand() * 10),
    total: Math.round(6 + rand() * 10),
  }))
}

const HEAT_DAYS = ["Mon", "Tue", "wed", "Thu", "Fri"]
const HEAT_HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = ((i) % 12) + 1
  const suffix = i < 12 ? "am" : "pm"
  return `${h}${suffix}`
})

function generateProximityHeatmap() {
  const rand = seededRandom(251)
  const grid: Record<string, Record<string, number>> = {}
  HEAT_DAYS.forEach(d => {
    grid[d] = {}
    HEAT_HOURS.forEach(h => { grid[d][h] = Math.round(rand() * 5) })
  })
  return grid
}

// ─── Header refresh row ───────────────────────────────────────────────────────

function RefreshRow({ range, onRangeChange }: { range: string; onRangeChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600, color: "var(--w-text-1)" }}>Safety Event Analytics</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "var(--w-text-2)" }}>Trends and breakdowns across the fleet</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Badge variant="outline" className="border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
        Refreshed Just Now
      </Badge>
      <FilterSelect value={range} onChange={onRangeChange} options={["Last 7 days", "Last 30 days", "Today"]} minWidth={110} />
      <button
        type="button"
        style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "1px solid var(--w-border)", background: "var(--w-bg)", cursor: "pointer" }}
      >
        <RotateCw size={14} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
      </button>
      </div>
    </div>
  )
}

// ─── Tooltips ─────────────────────────────────────────────────────────────────

function CategoryTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return <TooltipShell headerLeft="" rows={[{ label: d.key, value: String(d.value), bold: true }]} />
}

function ZoneIncidentTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return <TooltipShell headerLeft="" rows={[{ label: "Total Incident", value: String(d.count), bold: true }]} />
}

function ShiftTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft={label}
      rows={[
        { label: "Critical", value: String(d.critical), color: "var(--primary)" },
        { label: "High", value: String(d.high), color: "color-mix(in srgb, var(--primary) 55%, transparent)" },
        { label: "Warning", value: String(d.warning), color: "color-mix(in srgb, var(--primary) 22%, transparent)" },
      ]}
    />
  )
}

function ViolationTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return <TooltipShell headerLeft="" rows={[{ label: d.label, value: String(d.value), bold: true }]} />
}

function SpeedZoneTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft={label}
      rows={[
        { label: "Excessive", value: String(d.excessive), color: "var(--primary)" },
        { label: "Moderate", value: String(d.moderate), color: "color-mix(in srgb, var(--primary) 55%, transparent)" },
        { label: "Minor", value: String(d.minor), color: "color-mix(in srgb, var(--primary) 20%, transparent)" },
      ]}
    />
  )
}

function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <TooltipShell
      headerLeft={label}
      rows={[
        { label: "Total", value: String(d.total), color: "color-mix(in srgb, var(--primary) 55%, transparent)" },
        { label: "Warning", value: String(d.warning), color: "var(--primary)" },
      ]}
    />
  )
}

// ─── Donut center label ──────────────────────────────────────────────────────

function DonutCenterLabel() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 26, color: "var(--w-text-1)" }}>{TOTAL_EVENTS}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--w-text-2)" }}>Total Events</span>
    </div>
  )
}

// ─── Proximity heatmap ────────────────────────────────────────────────────────

function ProximityHeatmap({ data }: { data: ReturnType<typeof generateProximityHeatmap> }) {
  const [hover, setHover] = React.useState<{ day: string; hour: string; value: number; x: number; y: number } | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  function handleEnter(day: string, hour: string, value: number, e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    setHover({ day, hour, value, x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) })
  }

  return (
    <div ref={containerRef} style={{ position: "relative", overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: `44px repeat(${HEAT_HOURS.length}, minmax(28px, 1fr))`, gap: 3, minWidth: 44 + HEAT_HOURS.length * 28 }}>
        {[...HEAT_DAYS].reverse().map(day => (
          <React.Fragment key={day}>
            <div style={{ display: "flex", alignItems: "center", fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "var(--w-text-2)" }}>{day}</div>
            {HEAT_HOURS.map(hour => {
              const v = data[day][hour]
              return (
                <div
                  key={hour}
                  onMouseEnter={e => handleEnter(day, hour, v, e)}
                  onMouseMove={e => handleEnter(day, hour, v, e)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    height: 26, borderRadius: 4, cursor: "pointer",
                    background: `color-mix(in srgb, var(--primary) ${Math.round((v / 5) * 85) + 10}%, var(--w-bg-muted))`,
                  }}
                />
              )
            })}
          </React.Fragment>
        ))}
        <div />
        {HEAT_HOURS.map(hour => (
          <div key={hour} style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)", paddingTop: 4 }}>{hour}</div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, color: "var(--w-text-2)", marginTop: 6, letterSpacing: 0.3 }}>
        TIME
      </div>
      {hover && (
        <div style={{ position: "absolute", left: Math.min(hover.x + 12, 700), top: Math.max(hover.y - 50, 0), zIndex: 20, pointerEvents: "none" }}>
          <TooltipShell headerLeft={hover.day} rows={[{ label: "Events", value: String(hover.value), bold: true }]} />
        </div>
      )}
    </div>
  )
}

// ─── Main tab ────────────────────────────────────────────────────────────────

export function IncidentTrendsTab() {
  const incidentsByZone = React.useMemo(generateIncidentsByZone, [])
  const incidentsByShift = React.useMemo(generateIncidentsByShift, [])
  const speedViolationByZone = React.useMemo(generateSpeedViolationByZone, [])
  const incidentTrend = React.useMemo(generateIncidentTrend, [])
  const proximityHeatmap = React.useMemo(generateProximityHeatmap, [])
  const [range, setRange] = React.useState("Last 7 days")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <SafetyKpiCard icon={AlertTriangle} color="#dc2626" title="Total Alerts" value="05" subtitle="Alerts raised this week" />
        <SafetyKpiCard icon={ShieldAlert} color="#f59e0b" title="Near Misses" value="14" subtitle="Close-call events logged" />
        <SafetyKpiCard icon={ShieldCheck} color="#16a34a" title="Fleet Safety Score" value="85%" subtitle="Overall fleet safety rating" />
        <SafetyKpiCard icon={HardHat} color="#2563eb" title="PPE Compliances" value="70%" subtitle="Operators wearing required PPE" />
      </div>

      <RefreshRow range={range} onRangeChange={setRange} />

      {/* Events category + incidents by zone */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard title="Events Category Distribution" subtitle="Distribution of Events by its Category">
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CategoryTooltip />} />
                  <Pie data={EVENT_CATEGORIES} dataKey="value" nameKey="key" innerRadius={62} outerRadius={100} paddingAngle={2}>
                    {EVENT_CATEGORIES.map((c, i) => <Cell key={c.key} fill={CATEGORY_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <DonutCenterLabel />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {EVENT_CATEGORIES.map((c, i) => (
                <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "var(--w-text-1)" }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: CATEGORY_COLORS[i] }} />
                  {c.key}
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Incidents by zone" subtitle="Where events are concentrated">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incidentsByZone} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis dataKey="zone" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6}
                label={{ value: "ZONES", position: "insideBottom", offset: -2, fontSize: 9, fill: "var(--w-text-3)" }} />
              <YAxis domain={[0, 16]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4}
                label={{ value: "INCIDENT COUNT", angle: -90, position: "insideLeft", fontSize: 9, fill: "var(--w-text-3)" }} />
              <Tooltip content={<ZoneIncidentTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={44}>
                {incidentsByZone.map(d => (
                  <Cell key={d.zone} fill={d.count >= 14 ? "var(--primary)" : "color-mix(in srgb, var(--primary) 16%, transparent)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Incidents by shift + top violation types */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard title="Incidents By Shifts" subtitle="When are incidents happening?">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incidentsByShift} margin={{ top: 10, right: 10, left: -10, bottom: 16 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis dataKey="day" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6}
                label={{ value: "WEEKS", position: "insideBottom", offset: -6, fontSize: 9, fill: "var(--w-text-3)", textAnchor: "middle" }} />
              <YAxis domain={[0, 16]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4}
                label={{ value: "INCIDENT COUNT", angle: -90, position: "insideLeft", fontSize: 9, fill: "var(--w-text-3)", textAnchor: "middle" }} />
              <Tooltip content={<ShiftTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="warning" stackId="s" fill="color-mix(in srgb, var(--primary) 22%, transparent)" maxBarSize={40} />
              <Bar dataKey="high" stackId="s" fill="color-mix(in srgb, var(--primary) 55%, transparent)" maxBarSize={40} />
              <Bar dataKey="critical" stackId="s" fill="var(--primary)" maxBarSize={40} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Violation Types" subtitle="Most frequent alert categories.">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={VIOLATION_TYPES} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 16 }}>
              <CartesianGrid strokeDasharray="" horizontal={false} stroke="var(--w-bg-muted)" />
              <XAxis type="number" domain={[0, 250]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false}
                label={{ value: "INCIDENT COUNT", position: "insideBottom", offset: -6, fontSize: 9, fill: "var(--w-text-3)", textAnchor: "middle" }} />
              <YAxis type="category" dataKey="label" width={130} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ViolationTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {VIOLATION_TYPES.map((d, i) => (
                  <Cell key={d.label} fill={`color-mix(in srgb, var(--primary) ${100 - i * 15}%, transparent)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Speed violation by zone + incident trend */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard title="Speed Violation By Zone" subtitle="Severity-tiered breaches.">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={speedViolationByZone} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 16 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="" horizontal={false} stroke="var(--w-bg-muted)" />
              <XAxis type="number" domain={[0, 250]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false}
                label={{ value: "INCIDENT COUNT", position: "insideBottom", offset: -6, fontSize: 9, fill: "var(--w-text-3)", textAnchor: "middle" }} />
              <YAxis type="category" dataKey="zone" width={90} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<SpeedZoneTooltip />} cursor={{ fill: "var(--w-bg-muted)" }} />
              <Bar dataKey="minor" stackId="v" fill="color-mix(in srgb, var(--primary) 20%, transparent)" />
              <Bar dataKey="moderate" stackId="v" fill="color-mix(in srgb, var(--primary) 55%, transparent)" />
              <Bar dataKey="excessive" stackId="v" fill="var(--primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Incident Trend" subtitle="Severity trend over selected period.">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={incidentTrend} margin={{ top: 10, right: 10, left: -10, bottom: 16 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--w-bg-muted)" />
              <XAxis dataKey="week" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6}
                label={{ value: "WEEKS", position: "insideBottom", offset: -6, fontSize: 9, fill: "var(--w-text-3)", textAnchor: "middle" }} />
              <YAxis domain={[0, 16]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4}
                label={{ value: "INCIDENT COUNT", angle: -90, position: "insideLeft", fontSize: 9, fill: "var(--w-text-3)", textAnchor: "middle" }} />
              <Tooltip content={<TrendTooltip />} cursor={{ stroke: "var(--w-border)" }} />
              <Line type="monotone" dataKey="total" stroke="color-mix(in srgb, var(--primary) 55%, transparent)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="warning" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Proximity heatmap */}
      <ChartCard title="Speed Violation By Zone" subtitle="Hour × Day pattern for proximity events" minHeight={0}>
        <ProximityHeatmap data={proximityHeatmap} />
      </ChartCard>
    </div>
  )
}
