import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Radio, RotateCcw,
  CalendarDays, Truck, User, Layers, LayoutDashboard, Network, Flame,
  Square, Globe, PersonStanding, Crosshair, Maximize2, BarChart2,
  ChevronLeft, ChevronRight, X, Zap, Activity, MapPin, ShieldAlert,
} from "lucide-react";
import { WarehouseScene } from "../digital-twin/WarehouseScene3D";

// ─── Mock data (from Figma design) ────────────────────────────────────────────


// ─── Left toolbar ─────────────────────────────────────────────────────────────
const TOP_BTNS = [
  { id: "schedule", icon: CalendarDays,     label: "Schedule"    },
  { id: "mhe",      icon: Truck,            label: "MHE"         },
  { id: "operator", icon: User,             label: "Operator"    },
  { id: "layers",   icon: Layers,           label: "Layers"      },
  { id: "overview", icon: LayoutDashboard,  label: "Overview",   defaultActive: true },
  { id: "pairs",    icon: Network,          label: "Pairs"       },
  { id: "alerts",   icon: Flame,            label: "Alerts"      },
] as const;

const BOTTOM_BTNS = [
  { id: "2d",      icon: Square,          label: "2D View"    },
  { id: "3d",      icon: Globe,           label: "3D View",   defaultActive: true },
  { id: "avatar",  icon: PersonStanding,  label: "Trail View" },
  { id: "focus",   icon: Crosshair,       label: "Focus"      },
  { id: "expand",  icon: Maximize2,       label: "Expand"     },
] as const;

function IconBtn({
  icon: Icon, active, onClick, label,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  active: boolean; onClick: () => void; label: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => { setHovered(false); onClick(); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 34, height: 34, borderRadius: 8, border: "1px solid #d1d5db",
          background: active ? "#1b59f8" : hovered ? "#f3f4f6" : "white",
          color: active ? "white" : "#6b7280",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
          transition: "background 0.15s, color 0.15s",
        }}
      >
        <Icon size={15} strokeWidth={1.6} />
      </button>
      {hovered && (
        <div style={{
          position: "absolute", left: "calc(100% + 9px)", top: "50%",
          transform: "translateY(-50%)", zIndex: 50, pointerEvents: "none",
          background: "#1b59f8", color: "white", borderRadius: 6,
          padding: "4px 10px", fontSize: 11, fontWeight: 500,
          whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(27,89,248,0.25)",
        }}>
          {/* arrow */}
          <div style={{
            position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)",
            width: 0, height: 0,
            borderTop: "4px solid transparent", borderBottom: "4px solid transparent",
            borderRight: "4px solid #1b59f8",
          }} />
          {label}
        </div>
      )}
    </div>
  );
}

// ─── Calendar Panel ───────────────────────────────────────────────────────────
const CAL_DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const CAL_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function CalendarPanel() {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [sel, setSel]     = useState(now.getDate());

  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const daysInPrev   = new Date(year, month, 0).getDate();

  const cells: { day: number; cur: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++)   cells.push({ day: d, cur: true });
  while (cells.length < 42)                cells.push({ day: cells.length - firstDay - daysInMonth + 1, cur: false });

  const prev = () => month === 0  ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const next = () => month === 11 ? (setMonth(0),  setYear(y => y + 1)) : setMonth(m => m + 1);

  return (
    <div style={{
      position: "absolute", left: 56, top: 12, zIndex: 30,
      width: 262, padding: "12px 14px 14px",
      background: "var(--card)", borderRadius: 10,
      border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    }}>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={prev} style={{ width: 26, height: 26, border: "1px solid var(--border)", borderRadius: 6, background: "var(--background)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={12} strokeWidth={1.5} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
          {CAL_MONTHS[month]} {year}
        </span>
        <button onClick={next} style={{ width: 26, height: 26, border: "1px solid var(--border)", borderRadius: 6, background: "var(--background)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronRight size={12} strokeWidth={1.5} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
        {CAL_DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: "var(--muted-foreground)", padding: "2px 0" }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", rowGap: 2 }}>
        {cells.map((c, i) => {
          const selected = c.cur && c.day === sel;
          return (
            <div key={i} onClick={() => c.cur && setSel(c.day)} style={{
              textAlign: "center", padding: "5px 1px", borderRadius: 6,
              fontSize: 12, fontWeight: selected ? 700 : 400,
              color: selected ? "white" : c.cur ? "var(--foreground)" : "var(--muted-foreground)",
              background: selected ? "#1b59f8" : "transparent",
              cursor: c.cur ? "pointer" : "default",
            }}>
              {c.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Shared Layer Panel ────────────────────────────────────────────────────────
function LayerPanel({
  title, subtitle, badge, items,
}: {
  title: string; subtitle: string; badge: string;
  items: { label: string; id: string; on: boolean }[];
}) {
  const [checked, setChecked] = useState(items.map(m => m.on));
  const toggle = (i: number) => setChecked(p => p.map((v, idx) => idx === i ? !v : v));

  return (
    <div style={{
      position: "absolute", left: 56, top: 12, zIndex: 30,
      width: 280, background: "var(--card)", borderRadius: 10,
      border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "12px 14px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", lineHeight: 1.3 }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{
          flexShrink: 0, border: "1px solid var(--border)", borderRadius: 6,
          padding: "3px 7px", fontSize: 11, fontWeight: 500, color: "var(--foreground)",
          whiteSpace: "nowrap", background: "var(--background)",
        }}>{badge}</div>
      </div>

      <div style={{ height: 1, background: "var(--border)" }} />

      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {items.map((m, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", padding: "9px 14px", gap: 10,
            borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div onClick={() => toggle(i)} style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0, cursor: "pointer",
              background: checked[i] ? "#1b59f8" : "var(--background)",
              border: checked[i] ? "none" : "1.5px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {checked[i] && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{m.id}</div>
            </div>
            <BarChart2 size={13} strokeWidth={1.5} color="var(--muted-foreground)" />
          </div>
        ))}
      </div>
    </div>
  );
}

const EVENT_ITEMS = [
  { label: "Idle Time",        id: "MHE_032113", on: false },
  { label: "Forklift",         id: "MHE_14522",  on: false },
  { label: "BPOT",             id: "MHE_15033",  on: true  },
  { label: "Electric Stacker", id: "MHE_20441",  on: false },
  { label: "Electric Stacker", id: "MHE_A142",   on: false },
  { label: "Electric Stacker", id: "MHE_B201",   on: false },
];

const ZONE_ITEMS = [
  { label: "Receiving Zone",   id: "ZONE_A01",   on: true  },
  { label: "Storage Zone A",   id: "ZONE_B02",   on: true  },
  { label: "Storage Zone B",   id: "ZONE_C03",   on: false },
  { label: "Shipping Zone",    id: "ZONE_D04",   on: false },
  { label: "Staging Area",     id: "ZONE_E05",   on: false },
  { label: "Cross-Dock",       id: "ZONE_F06",   on: false },
];

const TRIP_ITEMS = [
  { label: "Loaded",   id: "MHE_032113", on: true },
  { label: "Forklift", id: "MHE_14522",  on: true },
  { label: "BPOT",     id: "MHE_15033",  on: true },
];

const OPERATOR_ITEMS = [
  { label: "Jack Wilson",   id: "OP_001", on: true  },
  { label: "James Wilson",  id: "OP_002", on: true  },
  { label: "Mahesh Pawar",  id: "OP_003", on: true  },
  { label: "Ravi Kumar",    id: "OP_004", on: false },
  { label: "Sameer Varma",  id: "OP_005", on: false },
];

// ─── Events Panel ─────────────────────────────────────────────────────────────
const EVENTS_LIST = [
  "Overspeed Events",
  "Harsh Acceleration",
  "Harsh Braking",
  "Jerk",
  "Restricted Zones",
  "Idle with Load",
  "Aisle Congestion",
];

function Checkbox({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{
      width: 16, height: 16, borderRadius: 4, flexShrink: 0, cursor: "pointer",
      background: checked ? "#1b59f8" : "var(--background)",
      border: checked ? "none" : "1.5px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function EventsPanel() {
  const [checked, setChecked] = useState(EVENTS_LIST.map(() => true));
  const allOn = checked.every(Boolean);
  const toggle = (i: number) => setChecked(p => p.map((v, idx) => idx === i ? !v : v));
  const toggleAll = () => setChecked(EVENTS_LIST.map(() => !allOn));

  return (
    <div style={{
      position: "absolute", left: 56, top: 12, zIndex: 30,
      width: 240, background: "var(--card)", borderRadius: 10,
      border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      overflow: "hidden",
    }}>
      {/* Header row — select-all */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px 10px" }}>
        <Checkbox checked={allOn} onClick={toggleAll} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
          Events
        </span>
      </div>

      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Items */}
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {EVENTS_LIST.map((label, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
            borderBottom: i < EVENTS_LIST.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <Checkbox checked={checked[i]} onClick={() => toggle(i)} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MHE Layer Panel ──────────────────────────────────────────────────────────
const MHE_LIST = [
  { type: "Electric Stacker", id: "MHE_032113", on: true  },
  { type: "Forklift",         id: "MHE_14522",  on: true  },
  { type: "BPOT",             id: "MHE_15033",  on: true  },
  { type: "Electric Stacker", id: "MHE_20441",  on: true  },
  { type: "Electric Stacker", id: "MHE_A142",   on: false },
  { type: "Electric Stacker", id: "MHE_B201",   on: false },
  { type: "Reach Truck",      id: "MHE_C305",   on: false },
];

function MHELayerPanel() {
  const [checked, setChecked] = useState<boolean[]>(MHE_LIST.map(m => m.on));
  const toggle = (i: number) => setChecked(p => p.map((v, idx) => idx === i ? !v : v));

  return (
    <div style={{
      position: "absolute", left: 56, top: 12, zIndex: 30,
      width: 280, background: "var(--card)", borderRadius: 10,
      border: "1px solid var(--border)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 14px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", lineHeight: 1.3 }}>Live MHE Layer</div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>MHE visibility control</div>
        </div>
        <div style={{
          flexShrink: 0, border: "1px solid var(--border)", borderRadius: 6,
          padding: "3px 7px", fontSize: 11, fontWeight: 500, color: "var(--foreground)",
          whiteSpace: "nowrap", background: "var(--background)",
        }}>
          Total MHE = 10
        </div>
      </div>

      <div style={{ height: 1, background: "var(--border)" }} />

      {/* List */}
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {MHE_LIST.map((m, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", padding: "9px 14px", gap: 10,
            borderBottom: i < MHE_LIST.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            {/* Checkbox */}
            <div onClick={() => toggle(i)} style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0, cursor: "pointer",
              background: checked[i] ? "#1b59f8" : "var(--background)",
              border: checked[i] ? "none" : "1.5px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {checked[i] && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>

            {/* Label */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3 }}>{m.type}</div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{m.id}</div>
            </div>

            <BarChart2 size={13} strokeWidth={1.5} color="var(--muted-foreground)" style={{ flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const PANEL_IDS = new Set(["schedule", "mhe", "operator", "layers", "overview", "pairs", "alerts"]);

function LeftToolbar() {
  const [topActive, setTopActive]   = useState<string>("overview");
  const [bottomActive, setBottomActive] = useState<string>("3d");
  const [openPanel, setOpenPanel]   = useState<string | null>(null);

  const handleTopClick = (id: string) => {
    setTopActive(id);
    setOpenPanel(prev => PANEL_IDS.has(id) ? (prev === id ? null : id) : null);
  };

  return (
    <>
      {/* Top group */}
      <div style={{ position: "absolute", left: 12, top: 12, zIndex: 20, display: "flex", flexDirection: "column", gap: 5 }}>
        {TOP_BTNS.map(b => (
          <IconBtn key={b.id} icon={b.icon} label={b.label}
            active={topActive === b.id}
            onClick={() => handleTopClick(b.id)}
          />
        ))}
      </div>

      {/* Bottom group */}
      <div style={{ position: "absolute", left: 12, bottom: 16, zIndex: 20, display: "flex", flexDirection: "column", gap: 5 }}>
        {BOTTOM_BTNS.map(b => (
          <IconBtn key={b.id} icon={b.icon} label={b.label}
            active={bottomActive === b.id}
            onClick={() => setBottomActive(b.id)}
          />
        ))}
      </div>

      {/* Panels */}
      {openPanel === "schedule" && <CalendarPanel />}
      {openPanel === "mhe"      && <MHELayerPanel />}
      {openPanel === "operator" && <LayerPanel title="Operator Layer" subtitle="Operator visibility control" badge="Total = 05"       items={OPERATOR_ITEMS} />}
      {openPanel === "pairs"    && <LayerPanel title="Event Layer"    subtitle="Event visibility control"    badge="Total Event = 06" items={EVENT_ITEMS}    />}
      {openPanel === "layers"   && <LayerPanel title="Zone Layer"     subtitle="Zone visibility control"     badge="Total Zone = 06"  items={ZONE_ITEMS}    />}
      {openPanel === "overview" && <EventsPanel />}
      {openPanel === "alerts"   && <LayerPanel title="Trip Layer"     subtitle="Trip visibility control"     badge="Total Event = 06" items={TRIP_ITEMS}    />}
    </>
  );
}

// ─── Impact Events Panel ──────────────────────────────────────────────────────
type ImpactSev = "Low" | "Medium" | "Critical";

const SEV_STYLE: Record<ImpactSev, { dot: string; bg: string; color: string }> = {
  Low:      { dot: "#22c55e", bg: "#f0fdf4", color: "#16a34a" },
  Medium:   { dot: "#f97316", bg: "#fff7ed", color: "#ea580c" },
  Critical: { dot: "#ef4444", bg: "#fef2f2", color: "#dc2626" },
};

const IMPACT_GROUPS = [
  {
    type: "Congestion", date: "02 June 2025",
    events: [
      { id: "IMP-ST-C5-T-1", severity: "Medium"   as ImpactSev, desc: "High Impact Collision", mhe: "MHE_14522", operator: "James Wilson", gforce: "4.5g", location: "Zone C", time: "02 June 2025 | 10:45 AM" },
      { id: "IMP-ST-C5-T-2", severity: "Low"      as ImpactSev, desc: "High Impact Collision", mhe: "MHE_14522", operator: "James Wilson", gforce: "4.5g", location: "Zone C", time: "02 June 2025 | 10:45 AM" },
      { id: "IMP-ST-C5-T-3", severity: "Critical" as ImpactSev, desc: "High Impact Collision", mhe: "MHE_14522", operator: "James Wilson", gforce: "4.5g", location: "Zone C", time: "02 June 2025 | 10:45 AM" },
    ],
  },
  {
    type: "Low Utilization", date: "02 June 2025",
    events: [
      { id: "IMP-ST-C5-T-1", severity: "Medium"   as ImpactSev, desc: "High Impact Collision", mhe: "MHE_14522", operator: "James Wilson", gforce: "4.5g", location: "Zone C", time: "02 June 2025 | 10:45 AM" },
      { id: "IMP-ST-C5-T-1", severity: "Medium"   as ImpactSev, desc: "High Impact Collision", mhe: "MHE_14522", operator: "James Wilson", gforce: "4.5g", location: "Zone C", time: "02 June 2025 | 10:45 AM" },
      { id: "MHE_15033",     severity: "Critical" as ImpactSev, desc: "High Impact Collision", mhe: "MHE_15033", operator: "Ravi Kumar",   gforce: "4.5g", location: "Zone C", time: "02 June 2025 | 10:45 AM" },
    ],
  },
  {
    type: "Overspeed", date: "02 June 2025",
    events: [
      { id: "IMP-ST-C5-T-4", severity: "Critical" as ImpactSev, desc: "Speed Limit Exceeded",  mhe: "MHE_20441", operator: "Sameer Varma", gforce: "3.2g", location: "Zone B", time: "02 June 2025 | 10:38 AM" },
      { id: "IMP-ST-C5-T-5", severity: "Medium"   as ImpactSev, desc: "Speed Limit Exceeded",  mhe: "MHE_032113",operator: "Mahesh Pawar", gforce: "2.8g", location: "Zone A", time: "02 June 2025 | 10:35 AM" },
    ],
  },
];

const ALL_EVENTS_COUNT = IMPACT_GROUPS.reduce((s, g) => s + g.events.length, 0);

function ImpactEventsPanel({ onClose }: { onClose: () => void }) {
  const [activeFilter, setActiveFilter] = useState<"All" | ImpactSev>("All");

  const visibleGroups = IMPACT_GROUPS.map(g => ({
    ...g,
    events: activeFilter === "All" ? g.events : g.events.filter(e => e.severity === activeFilter),
  })).filter(g => g.events.length > 0);

  const FILTERS: ("All" | ImpactSev)[] = ["All", "Low", "Medium", "Critical"];

  return (
    <div style={{
      position: "absolute", right: 0, top: 0, bottom: 0, zIndex: 25,
      width: 340, display: "flex", flexDirection: "column",
      background: "var(--card)", borderLeft: "1px solid var(--border)",
      boxShadow: "-4px 0 18px rgba(0,0,0,0.10)",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 16px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center", color: "var(--muted-foreground)" }}>
            <ChevronLeft size={16} strokeWidth={1.8} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>Events</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: "0 0 12px 24px" }}>
          Select severity to see impact details.
        </p>

        {/* Filter tabs */}
        <div style={{ display: "flex", alignItems: "center", background: "#eef2ff", borderRadius: 10, padding: "4px 6px", gap: 2 }}>
          {FILTERS.map(f => {
            const active = activeFilter === f;
            const count = f === "All" ? ALL_EVENTS_COUNT : IMPACT_GROUPS.reduce((s, g) => s + g.events.filter(e => e.severity === f).length, 0);
            return (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                flex: 1, padding: "5px 8px", borderRadius: 7, border: "none", cursor: "pointer",
                background: active ? "#dbeafe" : "transparent",
                color: active ? "#1b59f8" : "#374151",
                fontSize: 12, fontWeight: active ? 600 : 400,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "background 0.15s",
              }}>
                {f}
                {active && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "#374151",
                    background: "white", borderRadius: 100,
                    minWidth: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 5px", boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Groups + Events */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {visibleGroups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 4 }}>
            {/* Group header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldAlert size={16} strokeWidth={1.5} color="#1b59f8" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{g.type}</div>
                  <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>· on {g.date}</div>
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#1b59f8", border: "1px solid #1b59f8", borderRadius: 5, padding: "2px 7px", letterSpacing: "0.04em" }}>
                TOTAL={String(g.events.length).padStart(2, "0")}
              </span>
            </div>

            {/* Event cards */}
            <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              {g.events.map((ev, ei) => {
                const s = SEV_STYLE[ev.severity];
                return (
                  <div key={ei} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>

                    {/* ID row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 9, height: 9, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{ev.id}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, borderRadius: 6, padding: "3px 10px" }}>
                        {ev.severity}
                      </span>
                    </div>

                    <div style={{ height: 1, background: "var(--border)" }} />

                    {/* Description */}
                    <div style={{ padding: "8px 12px", fontSize: 12, color: "var(--muted-foreground)" }}>{ev.desc}</div>

                    {/* Meta row 1 */}
                    <div style={{ display: "flex", alignItems: "center", padding: "6px 12px", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1 }}>
                        <Truck size={12} strokeWidth={1.5} color="var(--muted-foreground)" />
                        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>MHE : </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground)" }}>{ev.mhe}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1 }}>
                        <User size={12} strokeWidth={1.5} color="var(--muted-foreground)" />
                        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Operator : </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground)" }}>{ev.operator}</span>
                      </div>
                    </div>

                    <div style={{ height: 1, background: "var(--border)", margin: "0 12px" }} />

                    {/* Meta row 2 */}
                    <div style={{ display: "flex", alignItems: "center", padding: "6px 12px", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1 }}>
                        <Activity size={12} strokeWidth={1.5} color="var(--muted-foreground)" />
                        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>G - Force : </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground)" }}>{ev.gforce}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1 }}>
                        <MapPin size={12} strokeWidth={1.5} color="var(--muted-foreground)" />
                        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Location : </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground)" }}>{ev.location}</span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div style={{ padding: "6px 12px 10px", fontSize: 11, color: "var(--muted-foreground)" }}>{ev.time}</div>

                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Main component ───────────────────────────────────────────────────────────
export function CommandCenter3D() {
  const [mode, setMode] = useState<"live" | "history">("live");
  const [showEvents, setShowEvents] = useState(false);

  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(e => setCanvasHeight(e[0].contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", width: "100%", height: "100%",
      background: "var(--background)", overflow: "hidden", fontFamily: "system-ui,sans-serif",
    }}>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div style={{ flex: "1 1 0", minHeight: 0, display: "flex", overflow: "hidden" }}>

        {/* 3D Canvas */}
        <div ref={canvasWrapRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>

          {/* ── Left toolbar ── */}
          <LeftToolbar />

          {/* ── Events trigger button (top-right) ── */}
          {!showEvents && (
            <button onClick={() => setShowEvents(true)} style={{
              position: "absolute", right: 12, top: 14, zIndex: 20,
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 11px", borderRadius: 8,
              background: "var(--card)", border: "1px solid var(--border)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              cursor: "pointer", color: "var(--foreground)",
            }}>
              <Zap size={13} strokeWidth={1.5} color="#f97316" />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Events</span>
              <span style={{
                fontSize: 10, fontWeight: 700, color: "white",
                background: "#ef4444", borderRadius: 100,
                padding: "1px 6px", lineHeight: 1.5,
              }}>{ALL_EVENTS_COUNT}</span>
            </button>
          )}

          {/* ── Impact events panel ── */}
          {showEvents && <ImpactEventsPanel onClose={() => setShowEvents(false)} />}

          {/* Floating Live / History pill — centered top */}
          <div style={{
            position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
            zIndex: 20, display: "flex", alignItems: "center",
            background: "white", border: "1px solid #e5e7eb",
            borderRadius: 100, padding: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}>
            {/* Live */}
            <button onClick={() => setMode("live")} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer",
              background: mode === "live" ? "#1b59f8" : "transparent",
              color: mode === "live" ? "white" : "#6b7280",
              fontWeight: mode === "live" ? 600 : 400, fontSize: 13,
              transition: "background 0.15s, color 0.15s",
            }}>
              <Radio size={14} strokeWidth={1.8} />
              <span>Live</span>
              {/* green dot */}
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
            </button>
            {/* History */}
            <button onClick={() => setMode("history")} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer",
              background: mode === "history" ? "#1b59f8" : "transparent",
              color: mode === "history" ? "white" : "#6b7280",
              fontWeight: mode === "history" ? 600 : 400, fontSize: 13,
              transition: "background 0.15s, color 0.15s",
            }}>
              <RotateCcw size={14} strokeWidth={1.8} />
              <span>History</span>
            </button>
          </div>

          {canvasHeight > 0 && (
            <Canvas shadows
              camera={{ position: [55, 42, 45], fov: 48, near: 0.1, far: 500 }}
              style={{ width: "100%", height: canvasHeight, background: "#eeeef0", display: "block" }}
              gl={{ antialias: true }}
            >
              <Suspense fallback={null}><WarehouseScene /></Suspense>
            </Canvas>
          )}

        </div>

      </div>
    </div>
  );
}
