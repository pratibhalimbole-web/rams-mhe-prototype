import * as React from "react"
import { useEffect } from "react"
import { LineChart as LineChartIcon } from "lucide-react"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { PalletEfficiencyTab } from "./efficiency/PalletEfficiencyTab"

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = "pallet" | "fleet" | "environment" | "trends"

const TABS: { id: TabId; label: string }[] = [
  { id: "pallet", label: "Pallet Efficiency" },
  { id: "fleet", label: "Fleet Efficiency" },
  { id: "environment", label: "Environment Productivity" },
  { id: "trends", label: "Trends & Insights" },
]

function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, borderBottom: "1px solid var(--w-border)" }}>
      {TABS.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          style={{
            position: "relative", paddingBottom: 10, background: "none", border: "none", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
            color: active === t.id ? "var(--w-text-1)" : "var(--w-text-2)",
          }}
        >
          {t.label}
          {active === t.id && (
            <span style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2, borderRadius: 2, background: "var(--primary)" }} />
          )}
        </button>
      ))}
    </div>
  )
}

function ComingSoonTab({ label }: { label: string }) {
  return (
    <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "64px 24px" }}>
      <LineChartIcon size={28} strokeWidth={1.5} style={{ color: "var(--w-text-3)" }} />
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--w-text-1)" }}>{label}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "var(--w-text-2)" }}>Design coming soon</span>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function EfficiencyAnalytics() {
  const sidebar = useSidebar()
  useEffect(() => { sidebar?.setSubPageTitle("efficiency analytics") }, [])

  const [tab, setTab] = React.useState<TabId>("pallet")

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 16, padding: 24, overflowY: "auto", background: "var(--w-bg-page)" }}>
      <TabBar active={tab} onChange={setTab} />

      {tab === "pallet" && <PalletEfficiencyTab />}
      {tab === "fleet" && <ComingSoonTab label="Fleet Efficiency" />}
      {tab === "environment" && <ComingSoonTab label="Environment Productivity" />}
      {tab === "trends" && <ComingSoonTab label="Trends & Insights" />}
    </div>
  )
}
