import * as React from "react"
import { AlertTriangle, ShieldCheck, Gauge, Siren } from "lucide-react"
import {
  LineChart, Line, ScatterChart, Scatter, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"
import {
  ChartCard, FilterSelect, cardStyle, seededRandom,
  Avatar, TableShell, Td, Pagination,
} from "../productivity/shared"
import { Badge } from "../../../components/ui/badge"

// ─── Mock data ───────────────────────────────────────────────────────────────

const TIME_POINTS = ["14:05", "14:10", "14:15", "14:20", "14:25", "14:30", "14:35"]

const MHE_SERIES = [
  { key: "MHE - 0009", color: "#16a34a" },
  { key: "MHE - 0010", color: "#f59e0b" },
  { key: "MHE - 0011", color: "#2563eb" },
  { key: "MHE - 0012", color: "#7c3aed" },
  { key: "MHE - 0013", color: "#d97706" },
]

const OPERATOR_SERIES = [
  { key: "Ramesh Kulkarni", color: "#16a34a" },
  { key: "Prakash Sharma", color: "#f59e0b" },
  { key: "Sameer Varma", color: "#2563eb" },
  { key: "Prakash Pandit", color: "#7c3aed" },
  { key: "Sumit Joshi", color: "#d97706" },
]

function generateSpeedData(seed: number, series: { key: string }[]) {
  const rand = seededRandom(seed)
  return TIME_POINTS.map(time => {
    const row: Record<string, number | string> = { time }
    series.forEach(s => { row[s.key] = Math.round((2 + rand() * 16) * 100) / 100 })
    return row
  })
}

function generateQuadrantData() {
  const rand = seededRandom(71)
  const names = [
    "Anil Sharma", "Ganesh More", "Karan Jadhav", "Prakash Joshi", "Vishal Sawant",
    "Rajesh Shinde", "Deepak Pawar", "Rahul Patil", "Anil Chavan", "James Wilson",
  ]
  return names.map((name, i) => {
    const skill = Math.round(rand() * 100)
    const behavior = Math.round(rand() * 100)
    return { name, skill, behavior, isHighlighted: i === names.length - 1 }
  })
}

function quadrantColor(skill: number, behavior: number) {
  if (skill >= 50 && behavior < 50) return "#f59e0b"
  if (skill >= 50 && behavior >= 50) return "#16a34a"
  if (skill < 50 && behavior < 50) return "#f87171"
  return "#2563eb"
}

const DRIVING_SESSIONS = (() => {
  const rand = seededRandom(81)
  const operators = ["Mahesh Pawar", "Suresh Pawar", "Anil Chavan", "Nilesh Bhosale", "Deepak Pawar", "Karan Jadhav", "Prakash Joshi", "Rahul Patil", "Vishal Sawant"]
  const mhes = ["MHE_B08", "MHE_B03", "MHE_B05", "MHE_B01", "MHE_B10"]
  return operators.map((operator, i) => ({
    operator,
    mhe: mhes[i % mhes.length],
    startTime: "12:27",
    duration: `${1 + Math.floor(rand() * 3)} min`,
    lastBreak: "12:27",
    status: rand() > 0.15 ? "Normal" : "Overdue",
  }))
})()

const ACCOUNTABILITY_ROWS = (() => {
  const rand = seededRandom(91)
  const names = ["James Wilson", "Karan Jadhav", "Anil Chavan", "Nilesh Bhosale", "Prakash Joshi", "Rahul Patil", "Vishal Sawant", "Deepak Pawar", "Suresh Pawar"]
  return names.map(name => ({
    name,
    overspeed: Math.round(5 + rand() * 20),
    fatigue: Math.round(5 + rand() * 20),
    rash: Math.round(5 + rand() * 20),
    overallScore: Math.round(5 + rand() * 20),
    todayScore: Math.round(rand() * 100),
    locationCompliance: Math.round(5 + rand() * 20),
  }))
})()

// ─── Safety KPI card (icon chip + value + subtitle) ──────────────────────────

function SafetyKpiCard({
  icon: Icon, color, title, value, valueSuffix, subtitle,
}: {
  icon: React.ElementType; color: string; title: string; value: string; valueSuffix?: string; subtitle: string
}) {
  return (
    <div style={{ ...cardStyle, padding: "16px 18px", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
          <Icon size={14} strokeWidth={1.5} style={{ color }} />
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "var(--w-text-2)" }}>{title}</span>
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--w-text-1)" }}>
        {value}
        {valueSuffix && <span style={{ fontWeight: 400, fontSize: 13, color: "var(--w-text-2)", marginLeft: 4 }}>{valueSuffix}</span>}
      </span>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11.5, color: "var(--w-text-2)" }}>{subtitle}</span>
    </div>
  )
}

// ─── Speed vs time tooltip ────────────────────────────────────────────────────

function SpeedTooltip({ active, payload, label, series }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 8, padding: "10px 14px",
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)", minWidth: 220,
    }}>
      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, color: "var(--w-text-1)", paddingBottom: 6, marginBottom: 8, borderBottom: "1px solid var(--w-divider)" }}>
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {series.map((s: { key: string; color: string }) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "var(--w-text-2)" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              {s.key}
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, color: "var(--w-text-1)" }}>
              {payload.find((p: any) => p.dataKey === s.key)?.value} km/h
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Decorative time range scrubber ──────────────────────────────────────────

function TimeRangeScrubber({ startLabel, endLabel }: { startLabel: string; endLabel: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "var(--w-text-2)", whiteSpace: "nowrap" }}>{startLabel}</span>
      <div style={{ position: "relative", flex: 1, height: 8, borderRadius: 4, background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
        <div style={{ position: "absolute", left: "28%", width: "16%", top: 0, bottom: 0, borderRadius: 4, background: "var(--primary)" }} />
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "var(--w-text-2)", whiteSpace: "nowrap" }}>{endLabel}</span>
    </div>
  )
}

// ─── Quadrant tooltip ─────────────────────────────────────────────────────────

function QuadrantTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 8, padding: "10px 14px",
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)", minWidth: 190,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 6, marginBottom: 8, borderBottom: "1px solid var(--w-divider)" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: quadrantColor(d.skill, d.behavior) }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, color: "var(--w-text-1)" }}>{d.name}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "var(--w-text-2)" }}>Skill Score</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, color: "var(--w-text-1)" }}>{d.skill.toFixed(2)}/100</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "var(--w-text-2)" }}>Behaviour Score</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, color: "var(--w-text-1)" }}>{d.behavior}/100</span>
        </div>
      </div>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const color = status === "Normal" ? "#16a34a" : "#dc2626"
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 6,
      background: color, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11,
    }}>
      {status}
    </span>
  )
}

// ─── Gradient safety score bar ────────────────────────────────────────────────

function SafetyScoreBar({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
      <div style={{ position: "relative", flex: 1, height: 6, borderRadius: 4, background: "linear-gradient(to right, #16a34a, #f59e0b, #dc2626)" }}>
        <div style={{ position: "absolute", left: `calc(${value}% - 6px)`, top: -3, width: 12, height: 12, borderRadius: "50%", background: "var(--w-bg)", border: "2px solid var(--w-text-1)" }} />
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11.5, color: "var(--w-text-1)", whiteSpace: "nowrap" }}>{value}%</span>
    </div>
  )
}

// ─── Main tab ────────────────────────────────────────────────────────────────

export function DrivingSafetyTab() {
  const mheSpeed = React.useMemo(() => generateSpeedData(11, MHE_SERIES), [])
  const operatorSpeed = React.useMemo(() => generateSpeedData(21, OPERATOR_SERIES), [])
  const quadrantData = React.useMemo(generateQuadrantData, [])

  const [mheRange, setMheRange] = React.useState("Last 7 days")
  const [mheFilter, setMheFilter] = React.useState("All MHE")
  const [opRange, setOpRange] = React.useState("Last 7 days")
  const [opFilter, setOpFilter] = React.useState("All Operator")

  const [sessionPageSize, setSessionPageSize] = React.useState(5)
  const [sessionPageIndex, setSessionPageIndex] = React.useState(0)
  const sessionPaged = DRIVING_SESSIONS.slice(sessionPageIndex * sessionPageSize, sessionPageIndex * sessionPageSize + sessionPageSize)

  const [accPageSize, setAccPageSize] = React.useState(5)
  const [accPageIndex, setAccPageIndex] = React.useState(0)
  const accPaged = ACCOUNTABILITY_ROWS.slice(accPageIndex * accPageSize, accPageIndex * accPageSize + accPageSize)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <SafetyKpiCard icon={AlertTriangle} color="#dc2626" title="Safety Violation" value="05" subtitle="Incidents flagged this week" />
        <SafetyKpiCard icon={ShieldCheck} color="#16a34a" title="Compliance" value="94" valueSuffix="%" subtitle="Within safe speed limits" />
        <SafetyKpiCard icon={Gauge} color="#2563eb" title="Skill Score" value="85.4" subtitle="Avg skill score" />
        <SafetyKpiCard icon={Siren} color="#f59e0b" title="High Risk Session" value="30" valueSuffix="%" subtitle="Sessions flagged high risk" />
      </div>

      {/* Speed vs time charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard
          title="MHE Speed vs Time"
          subtitle=""
          filters={
            <>
              <FilterSelect value={mheRange} onChange={setMheRange} options={["Last 7 days", "Last 30 days", "Today"]} minWidth={110} />
              <FilterSelect value={mheFilter} onChange={setMheFilter} options={["All MHE", ...MHE_SERIES.map(s => s.key)]} minWidth={90} />
            </>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mheSpeed} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--w-bg-muted)" />
              <XAxis dataKey="time" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6}
                label={{ value: "TIME (IN SECONDS)", position: "insideBottom", offset: -2, fontSize: 9, fill: "var(--w-text-3)" }} />
              <YAxis domain={[0, 20]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4}
                label={{ value: "SPEED (KM/H)/EFFICIENCY", angle: -90, position: "insideLeft", fontSize: 9, fill: "var(--w-text-3)" }} />
              <Tooltip content={<SpeedTooltip series={MHE_SERIES} />} />
              {MHE_SERIES.map(s => (
                <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <TimeRangeScrubber startLabel="2026-01-03 11:26:08" endLabel="2026-01-03 01:26:08" />
        </ChartCard>

        <ChartCard
          title="Operator Speed vs Time"
          subtitle=""
          filters={
            <>
              <FilterSelect value={opRange} onChange={setOpRange} options={["Last 7 days", "Last 30 days", "Today"]} minWidth={110} />
              <FilterSelect value={opFilter} onChange={setOpFilter} options={["All Operator", ...OPERATOR_SERIES.map(s => s.key)]} minWidth={100} />
            </>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={operatorSpeed} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--w-bg-muted)" />
              <XAxis dataKey="time" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dy={6}
                label={{ value: "TIME (IN SECONDS)", position: "insideBottom", offset: -2, fontSize: 9, fill: "var(--w-text-3)" }} />
              <YAxis domain={[0, 20]} tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} dx={-4}
                label={{ value: "SPEED (KM/H)/EFFICIENCY", angle: -90, position: "insideLeft", fontSize: 9, fill: "var(--w-text-3)" }} />
              <Tooltip content={<SpeedTooltip series={OPERATOR_SERIES} />} />
              {OPERATOR_SERIES.map(s => (
                <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <TimeRangeScrubber startLabel="2026-01-03 11:26:08" endLabel="2026-01-03 01:26:08" />
        </ChartCard>
      </div>

      {/* Quadrant + detailed sessions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
        <ChartCard title="Skill vs Behavior Quadrant" subtitle="" badge="Last 7 days">
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--w-bg-muted)" />
              <XAxis type="number" dataKey="behavior" domain={[0, 100]} ticks={[0, 17, 33, 50, 67, 80, 100]}
                tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="skill" domain={[0, 100]} ticks={[0, 17, 33, 50, 67, 83, 100]}
                tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }} axisLine={false} tickLine={false} />
              <ReferenceLine x={50} stroke="var(--w-border)" />
              <ReferenceLine y={50} stroke="var(--w-border)" />
              <Tooltip content={<QuadrantTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={quadrantData}>
                {quadrantData.map((d, i) => (
                  <Cell key={i} fill={quadrantColor(d.skill, d.behavior)} r={d.isHighlighted ? 6 : 5} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: -4 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: 0.5, color: "var(--w-text-3)" }}>LOW SKILL</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: 0.5, color: "var(--w-text-3)" }}>BAD BEHAVIOR → GOOD BEHAVIOR</span>
          </div>
        </ChartCard>

        <ChartCard
          title="Detailed Driving Sessions"
          subtitle="Complete overview of current continuous driving sessions"
          lastUpdated="02:02:00"
          filters={
            <Badge variant="outline" className="border-[var(--w-border)] text-[var(--w-text-2)] text-[10px] font-semibold">
              Policy Limit - 180 min
            </Badge>
          }
          onRefresh={() => {}}
        >
          <TableShell columns={["Operator", "MHE", "Start Time", "Duration", "Last Break", "Status"]}>
            {sessionPaged.map((r, i) => (
              <tr key={i}>
                <Td>{r.operator}</Td>
                <Td>{r.mhe}</Td>
                <Td>{r.startTime}</Td>
                <Td>{r.duration}</Td>
                <Td>{r.lastBreak}</Td>
                <Td><StatusBadge status={r.status} /></Td>
              </tr>
            ))}
          </TableShell>
          <Pagination pageSize={sessionPageSize} setPageSize={setSessionPageSize} pageIndex={sessionPageIndex} setPageIndex={setSessionPageIndex} totalRows={DRIVING_SESSIONS.length} />
        </ChartCard>
      </div>

      {/* Operator accountability report */}
      <ChartCard title="Operator Accountability Report" subtitle="Overspeeding, fatigue, rash driving, and safety compliance by shift" badge="Realtime">
        <TableShell columns={["MHE Operator", "Overspeed Count", "Fatigue Alerts", "Rash Driving", "Overall Safety Score", "Today's Safety Score", "Location Compliance"]}>
          {accPaged.map((r, i) => (
            <tr key={i}>
              <Td>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar label={r.name.split(" ").map(p => p[0]).join("")} seed={r.name} />
                  {r.name}
                </div>
              </Td>
              <Td>{String(r.overspeed).padStart(2, "0")}</Td>
              <Td>{String(r.fatigue).padStart(2, "0")}</Td>
              <Td>{String(r.rash).padStart(2, "0")}</Td>
              <Td>{String(r.overallScore).padStart(2, "0")}</Td>
              <Td><SafetyScoreBar value={r.todayScore} /></Td>
              <Td>{String(r.locationCompliance).padStart(2, "0")}</Td>
            </tr>
          ))}
        </TableShell>
        <Pagination pageSize={accPageSize} setPageSize={setAccPageSize} pageIndex={accPageIndex} setPageIndex={setAccPageIndex} totalRows={ACCOUNTABILITY_ROWS.length} />
      </ChartCard>
    </div>
  )
}
