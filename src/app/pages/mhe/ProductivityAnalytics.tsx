import * as React from "react"
import { useEffect } from "react"
import {
  ArrowLeftRight,
  Package,
  Clock,
  TrafficCone,
  ChevronDown,
  RotateCw,
  LineChart,
  BarChart3,
} from "lucide-react"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = "task" | "asset" | "environment"

// ─── Shared UI ───────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: "task", label: "Task Productivity" },
  { id: "asset", label: "Asset Productivity" },
  { id: "environment", label: "Environment Productivity" },
]

function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div className="flex items-center gap-6 border-b border-[var(--border)]">
      {TABS.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className="relative pb-2.5 text-[length:var(--text-sm)] font-medium transition-colors"
          style={{ color: active === t.id ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          {t.label}
          {active === t.id && (
            <span className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full" style={{ background: "var(--primary)" }} />
          )}
        </button>
      ))}
    </div>
  )
}

function KpiCard({
  icon: Icon, iconColor, title, value, subtitle,
}: {
  icon: React.ElementType; iconColor: string; title: string; value: string; subtitle?: string
}) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `color-mix(in srgb, ${iconColor} 14%, transparent)` }}
        >
          <Icon className="w-4 h-4" strokeWidth={1.5} style={{ color: iconColor }} />
        </div>
        <span className="text-[13px] font-medium" style={{ color: "var(--muted-foreground)" }}>{title}</span>
      </div>
      <span className="text-[length:var(--text-2xl)] font-semibold text-[var(--foreground)]">{value}</span>
      {subtitle && <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{subtitle}</span>}
    </div>
  )
}

function FilterPill({ label }: { label: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-8 gap-1.5 px-2.5 border-[var(--border)] bg-[var(--background)] shadow-none text-[12px] font-normal"
        >
          {label}
          <ChevronDown className="w-3 h-3" strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>No options available</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function RefreshButton() {
  return (
    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
      <RotateCw className="w-3.5 h-3.5" strokeWidth={1.5} />
    </Button>
  )
}

function EmptyState({ icon: Icon, title, message }: { icon: React.ElementType; title: string; message: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 py-16">
      <Icon className="w-8 h-8 mb-1" strokeWidth={1.5} style={{ color: "var(--muted-foreground)", opacity: 0.5 }} />
      <p className="text-[length:var(--text-sm)] font-semibold text-[var(--foreground)]">{title}</p>
      <p className="text-[12px] text-center max-w-xs" style={{ color: "var(--muted-foreground)" }}>{message}</p>
    </div>
  )
}

function ChartCard({
  title, subtitle, badge, filters, children,
}: {
  title: string; subtitle: string; badge?: string; filters?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[length:var(--text-sm)] font-semibold text-[var(--foreground)]">{title}</span>
              {badge && <Badge variant="outline" className="border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]">{badge}</Badge>}
            </div>
            <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{subtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">{filters}</div>
      </div>
      <div className="flex flex-1 flex-col min-h-[260px]">{children}</div>
    </div>
  )
}

// ─── Task Productivity ───────────────────────────────────────────────────────

function TaskProductivityTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard icon={ArrowLeftRight} iconColor="var(--chart-1, #3b82f6)" title="Loaded vs Empty Travel %" value="- | -" subtitle="Loaded vs empty travel" />
        <KpiCard icon={Package} iconColor="var(--chart-2, #8b5cf6)" title="Avg Pallets Moved/Hour" value="- -" />
        <KpiCard icon={Clock} iconColor="var(--muted-foreground)" title="Idle-with-Load Time Lost" value="- -" />
        <KpiCard icon={TrafficCone} iconColor="var(--destructive)" title="Lost Hours Due to Aisle" value="0" subtitle="Lost to congestion" />
      </div>

      <ChartCard
        title="Pallets Moved per Hour"
        subtitle="Hourly Productivity Trend"
        filters={
          <>
            <FilterPill label="Today" />
            <FilterPill label="All Sessions" />
            <FilterPill label="All MHE" />
            <FilterPill label="All Operator" />
            <RefreshButton />
          </>
        }
      >
        <EmptyState icon={LineChart} title="No Data Available" message="No pallets moved in this period" />
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Lost Hours due to Congestion" subtitle="Aisle Impact Analysis" filters={<RefreshButton />}>
          <EmptyState icon={BarChart3} title="No Congestion Data" message="There is no lost hours data available for the selected period." />
        </ChartCard>
        <ChartCard title="Break Impact on Output Timeline" subtitle="Productivity Drop Analysis" badge="Last 7 days" filters={<RefreshButton />}>
          <EmptyState icon={BarChart3} title="No Break Impact Data" message="There is no break impact data available for the selected period." />
        </ChartCard>
      </div>
    </div>
  )
}

// ─── Asset / Environment Productivity (no reference design yet) ─────────────

function GenericProductivityTab({ label }: { label: string }) {
  return (
    <ChartCard title={label} subtitle="Productivity Trend" filters={<RefreshButton />}>
      <EmptyState icon={LineChart} title="No Data Available" message={`No ${label.toLowerCase()} data for this period`} />
    </ChartCard>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ProductivityAnalytics() {
  const sidebar = useSidebar()
  useEffect(() => { sidebar?.setSubPageTitle("productivity analytics") }, [])

  const [tab, setTab] = React.useState<TabId>("task")

  return (
    <div className="h-full flex flex-col bg-[var(--background)] p-6 gap-4 overflow-y-auto">
      <TabBar active={tab} onChange={setTab} />

      {tab === "task" && <TaskProductivityTab />}
      {tab === "asset" && <GenericProductivityTab label="Asset Productivity" />}
      {tab === "environment" && <GenericProductivityTab label="Environment Productivity" />}
    </div>
  )
}
