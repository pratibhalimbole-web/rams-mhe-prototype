import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Radio, RotateCcw,
  CalendarDays, Truck, User, Layers, LayoutDashboard, Network, Flame,
  Square, Globe, PersonStanding, Crosshair, Maximize2, BarChart2,
  ChevronLeft, ChevronRight, X, Zap, Activity, MapPin, ShieldAlert,
  TrendingUp, Navigation, CheckCircle2, AlertTriangle, Clock3,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { WarehouseScene, TaskAssignment, TaskStatus, NearMissEvent } from "../digital-twin/WarehouseScene3D";
import { useTheme } from "../../hooks/useTheme";

// ─── Mock data (from Figma design) ────────────────────────────────────────────


// ─── Left toolbar ─────────────────────────────────────────────────────────────
const TOP_BTNS = [
  { id: "schedule", icon: CalendarDays,     label: "Schedule"      },
  { id: "mhe",      icon: Truck,            label: "MHE"           },
  { id: "operator", icon: User,             label: "Operator"      },
  { id: "layers",   icon: Layers,           label: "Layers"        },
  { id: "overview", icon: LayoutDashboard,  label: "Overview",     defaultActive: true },
  { id: "trips",    icon: Network,          label: "Trips"         },
  { id: "alerts",   icon: Flame,            label: "Alerts"        },
  { id: "tasks",    icon: Navigation,       label: "Task Manager"  },
] as const;

const BOTTOM_BTNS = [
  { id: "2d",      icon: Square,          label: "2D View"    },
  { id: "3d",      icon: Globe,           label: "3D View",   defaultActive: true },
  { id: "avatar",  icon: PersonStanding,  label: "Trail View" },
  { id: "focus",   icon: Crosshair,       label: "Focus"      },
  { id: "expand",  icon: Maximize2,       label: "Expand"     },
] as const;

function IconBtn({
  icon: Icon, active, onClick, label, disabled,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  active: boolean; onClick: () => void; label: string; disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => { if (disabled) return; setHovered(false); onClick(); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)",
          background: disabled ? "transparent" : active ? "#1b59f8" : hovered ? "var(--muted)" : "var(--card)",
          color: disabled ? "var(--border)" : active ? "white" : "var(--muted-foreground)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: disabled ? "not-allowed" : "pointer", flexShrink: 0,
          opacity: disabled ? 0.4 : 1,
          transition: "background 0.15s, color 0.15s",
        }}
      >
        <Icon size={15} strokeWidth={1.6} />
      </button>
      {hovered && !disabled && (
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

function CalendarPanel({ historyMode }: { historyMode?: boolean }) {
  const now = new Date();
  const initMonth = historyMode ? (now.getMonth() === 0 ? 11 : now.getMonth() - 1) : now.getMonth();
  const initYear  = historyMode ? (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()) : now.getFullYear();
  const [year, setYear]   = useState(initYear);
  const [month, setMonth] = useState(initMonth);
  const [sel, setSel]     = useState<number | null>(null);

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
          const selected = c.cur && sel !== null && c.day === sel;
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
  { name: "MHE 01", type: "Forklift",              id: "MHE_01", on: true  },
  { name: "MHE 02", type: "Reach Truck",            id: "MHE_02", on: true  },
  { name: "MHE 03", type: "Electric Pallet Jack",   id: "MHE_03", on: true  },
  { name: "MHE 04", type: "Order Picker",           id: "MHE_04", on: false },
  { name: "MHE 05", type: "BPOT",                   id: "MHE_05", on: false },
  { name: "MHE 06", type: "Electric Pallet Jack",   id: "MHE_06", on: false },
];
type MHEItem = typeof MHE_LIST[0];

function MHELayerPanel({ onViewAnalytics }: { onViewAnalytics: (mhe: MHEItem) => void }) {
  const [checked, setChecked] = useState<boolean[]>(MHE_LIST.map(m => m.on));
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
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
          Total MHE = {MHE_LIST.length}
        </div>
      </div>

      <div style={{ height: 1, background: "var(--border)" }} />

      {/* List */}
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {MHE_LIST.map((m, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredRow(i)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              position: "relative",
              display: "flex", alignItems: "center", padding: "9px 14px", gap: 10,
              borderBottom: i < MHE_LIST.length - 1 ? "1px solid var(--border)" : "none",
              background: hoveredRow === i ? "var(--muted)" : "transparent",
              transition: "background 0.12s",
            }}
          >
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
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{m.type}</div>
            </div>

            {/* View analytics button (hover) */}
            {hoveredRow === i ? (
              <button
                onClick={() => onViewAnalytics(m)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "3px 8px", borderRadius: 5, border: "none",
                  background: "#1b59f8", color: "white",
                  fontSize: 10, fontWeight: 600, cursor: "pointer",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                <TrendingUp size={10} strokeWidth={1.8} />
                View analytics
              </button>
            ) : (
              <BarChart2 size={13} strokeWidth={1.5} color="var(--muted-foreground)" style={{ flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MHE Analytics Panel ─────────────────────────────────────────────────────
const ACTIVITY_DATA = [
  { name: "Move Time",    value: 20, color: "#1b59f8" },
  { name: "Active Time",  value: 12, color: "#38bdf8" },
  { name: "Without Load", value: 15, color: "#94a3b8" },
  { name: "Down Time",    value: 11, color: "#334155" },
];

const SCORE_TREND_DATA = [
  { date: "13 Jun", prev: 72, curr: 68 },
  { date: "14 Jun", prev: 68, curr: 75 },
  { date: "15 Jun", prev: 74, curr: 82 },
  { date: "16 Jun", prev: 70, curr: 62 },
  { date: "17 Jun", prev: 76, curr: 78 },
  { date: "18 Jun", prev: 72, curr: 85 },
  { date: "19 Jun", prev: 68, curr: 58 },
];

const SAFETY_EVENTS = [
  { label: "Overloaded",     value: 125 },
  { label: "Safety Driving", value: 622 },
  { label: "Fatigue Alerts", value: 18  },
  { label: "Close Headroom", value: 2   },
];

function AnalyticsCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--background)", borderRadius: 12,
      border: "1px solid var(--border)", padding: "14px 16px", marginBottom: 12,
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{title}</div>
        <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 2 }}>{subtitle}</div>
      </div>
      <div style={{ height: 1, background: "var(--border)", marginBottom: 12 }} />
      {children}
    </div>
  );
}

function MHEAnalyticsPanel({ mhe, onClose }: { mhe: MHEItem; onClose: () => void }) {
  const { isDark } = useTheme();
  const totalHrs = ACTIVITY_DATA.reduce((s, d) => s + d.value, 0);

  const kpis = [
    { label: "Trips Today",  value: "26",  icon: <Truck    size={14} strokeWidth={1.5} />, color: "#1b59f8" },
    { label: "Health Score", value: "60",  icon: <Activity size={14} strokeWidth={1.5} />, color: "#1b59f8" },
    { label: "Idle Time",    value: "15%", icon: <Zap      size={14} strokeWidth={1.5} />, color: "#1b59f8" },
  ];

  return (
    <div style={{
      position: "absolute", right: 0, top: 0, bottom: 0, zIndex: 25,
      width: 380, display: "flex", flexDirection: "column",
      background: "var(--card)", borderLeft: "1px solid var(--border)",
      boxShadow: "-4px 0 18px rgba(0,0,0,0.12)",
    }}>
      {/* ── Header ── */}
      <div style={{ padding: "14px 16px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--muted-foreground)", display: "flex" }}>
              <ChevronLeft size={16} strokeWidth={1.8} />
            </button>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", lineHeight: 1.2 }}>{mhe.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{mhe.type} · Zone / Aisle View</div>
            </div>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#16a34a", letterSpacing: "0.06em",
            background: isDark ? "rgba(22,163,74,0.15)" : "#f0fdf4",
            border: `1px solid ${isDark ? "rgba(22,163,74,0.3)" : "#bbf7d0"}`,
            borderRadius: 6, padding: "3px 9px",
          }}>ACTIVE</span>
        </div>
      </div>

      <div style={{ height: 1, background: "var(--border)", flexShrink: 0 }} />

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 24px" }}>

        {/* KPI Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{
              background: "var(--background)", borderRadius: 12, padding: "14px 12px 14px",
              border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10,
            }}>
              {/* Icon square */}
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: isDark ? `${k.color}20` : `${k.color}15`,
                border: `1px solid ${k.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: k.color, flexShrink: 0,
              }}>
                {k.icon}
              </div>
              {/* Label + Value stacked */}
              <div>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--foreground)", lineHeight: 1 }}>{k.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Breakdown */}
        <AnalyticsCard title="Activity Breakdown" subtitle="Last 7 days | Hrs / Break">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Donut */}
            <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
              <PieChart width={120} height={120}>
                <Pie data={ACTIVITY_DATA} cx={60} cy={60} innerRadius={36} outerRadius={54} dataKey="value" strokeWidth={0}>
                  {ACTIVITY_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                textAlign: "center" as const, pointerEvents: "none",
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", lineHeight: 1 }}>{totalHrs}</div>
                <div style={{ fontSize: 9, color: "var(--muted-foreground)", marginTop: 2 }}>Total Hrs</div>
              </div>
            </div>
            {/* Legend */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {ACTIVITY_DATA.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "var(--foreground)", flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)" }}>{d.value}h</span>
                </div>
              ))}
            </div>
          </div>
        </AnalyticsCard>

        {/* Score Trend */}
        <AnalyticsCard title="Score Trend" subtitle="Last 7 Days">
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={SCORE_TREND_DATA} margin={{ top: 4, right: 6, left: -16, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <RTooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Line type="monotone" dataKey="prev" stroke="#94a3b8" strokeWidth={1.5} dot={false} strokeDasharray="4 3" name="Previous" />
              <Line type="monotone" dataKey="curr" stroke="#1b59f8" strokeWidth={2}   dot={false} name="Attribs" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[
              { label: "Previous", color: "#94a3b8", dashed: true  },
              { label: "Attribs",  color: "#1b59f8", dashed: false },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="20" height="2" viewBox="0 0 20 2">
                  {l.dashed
                    ? <line x1="0" y1="1" x2="20" y2="1" stroke={l.color} strokeWidth="2" strokeDasharray="4 3" />
                    : <line x1="0" y1="1" x2="20" y2="1" stroke={l.color} strokeWidth="2" />}
                </svg>
                <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Safety Events */}
        <AnalyticsCard title="Safety Events" subtitle="Corner Analytics · 07 Logs">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {SAFETY_EVENTS.map((e, i) => (
              <div key={i} style={{ paddingBottom: 4 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", lineHeight: 1 }}>{e.value}</div>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4 }}>{e.label}</div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Best Operator Pairing */}
        <AnalyticsCard title="Best Operator Pairing" subtitle="Optimal Operator">
          {/* Column headers */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Operator</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Amir Sharma</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { label: "Productivity",  value: "80"  },
              { label: "Pallets Moved", value: "—"   },
              { label: "Cycle Time",    value: "4h"  },
            ].map((r, i, arr) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 0",
                borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{r.value}</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

      </div>
    </div>
  );
}

// ─── Trips Panel ──────────────────────────────────────────────────────────────
const TRIP_TYPE_OPTIONS = [
  { label: "Loaded",           color: "#22c55e" },
  { label: "Empty",            color: "#3b82f6" },
  { label: "Partially Loaded", color: "#f97316" },
];

const CYCLE_TIME_OPTIONS = ["0 – 5 min", "6 – 10 min", "11 – 15 min", "16 – 20 min", "21 – 25 min", "25+ min"];

function TripsPanel() {
  const { isDark } = useTheme();
  const [typeChecked, setTypeChecked] = useState(TRIP_TYPE_OPTIONS.map(() => true));
  const [cycleActive, setCycleActive] = useState<number | null>(null);

  const toggleType  = (i: number) => setTypeChecked(p => p.map((v, idx) => idx === i ? !v : v));
  const toggleCycle = (i: number) => setCycleActive(prev => prev === i ? null : i);

  return (
    <div style={{
      position: "absolute", left: 56, top: 12, zIndex: 30,
      width: 262, background: "var(--card)", borderRadius: 10,
      border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      overflow: "hidden",
    }}>
      {/* Trip Types */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase",
          color: "var(--muted-foreground)", marginBottom: 10,
        }}>
          Trip Types
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {TRIP_TYPE_OPTIONS.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Checkbox checked={typeChecked[i]} onClick={() => toggleType(i)} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Cycle Time */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase",
            color: "var(--muted-foreground)",
          }}>
            Cycle Time
          </div>
          {cycleActive !== null && (
            <button onClick={() => setCycleActive(null)} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontSize: 11, fontWeight: 500, color: "#1b59f8",
            }}>
              Clear
            </button>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {CYCLE_TIME_OPTIONS.map((label, i) => {
            const active = cycleActive === i;
            return (
              <button key={i} onClick={() => toggleCycle(i)} style={{
                padding: "8px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                border: `1px solid ${active ? "#1b59f8" : "var(--border)"}`,
                background: active
                  ? isDark ? "rgba(27,89,248,0.18)" : "rgba(27,89,248,0.08)"
                  : "var(--background)",
                color: active ? "#1b59f8" : "var(--foreground)",
                cursor: "pointer", transition: "all 0.15s",
                textAlign: "center" as const,
              }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PANEL_IDS = new Set(["schedule", "mhe", "operator", "layers", "overview", "trips", "alerts", "tasks"]);

function LeftToolbar({ mode, onViewAnalytics, taskAssignments, onAssignTask, onRemoveTask, onExpand, isExpanded }: {
  mode: "live" | "history";
  onViewAnalytics: (mhe: MHEItem) => void;
  taskAssignments: TaskAssignment[];
  onAssignTask: (taskId: string, mheId: string, status: TaskStatus) => void;
  onRemoveTask: (id: string) => void;
  onExpand: () => void;
  isExpanded: boolean;
}) {
  const [topActive, setTopActive]   = useState<string>("overview");
  const [bottomActive, setBottomActive] = useState<string>("3d");
  const [openPanel, setOpenPanel]   = useState<string | null>(null);

  useEffect(() => {
    if (mode === "history") {
      setTopActive("schedule");
      setOpenPanel("schedule");
    } else {
      setOpenPanel(prev => prev === "schedule" ? null : prev);
    }
  }, [mode]);

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
            disabled={b.id === "schedule" && mode === "live"}
            onClick={() => handleTopClick(b.id)}
          />
        ))}
      </div>

      {/* Bottom group */}
      <div style={{ position: "absolute", left: 12, bottom: 16, zIndex: 20, display: "flex", flexDirection: "column", gap: 5 }}>
        {BOTTOM_BTNS.map(b => (
          <IconBtn key={b.id} icon={b.icon} label={b.label}
            active={b.id === "expand" ? isExpanded : bottomActive === b.id}
            onClick={() => {
              if (b.id === "expand") { onExpand(); return; }
              setBottomActive(b.id);
            }}
          />
        ))}
      </div>

      {/* Panels */}
      {openPanel === "schedule" && <CalendarPanel historyMode={mode === "history"} />}
      {openPanel === "mhe"      && <MHELayerPanel onViewAnalytics={onViewAnalytics} />}
      {openPanel === "operator" && <LayerPanel title="Operator Layer" subtitle="Operator visibility control" badge="Total = 05"       items={OPERATOR_ITEMS} />}
      {openPanel === "trips"    && <TripsPanel />}
      {openPanel === "layers"   && <LayerPanel title="Zone Layer"     subtitle="Zone visibility control"     badge="Total Zone = 06"  items={ZONE_ITEMS}    />}
      {openPanel === "overview" && <EventsPanel />}
      {openPanel === "alerts"   && <LayerPanel title="Trip Layer"     subtitle="Trip visibility control"     badge="Total Event = 06" items={TRIP_ITEMS}    />}
      {openPanel === "tasks"    && (
        <TasksPanel
          assignments={taskAssignments}
          onAssign={onAssignTask}
          onRemove={onRemoveTask}
        />
      )}
    </>
  );
}

// ─── Task Manager ─────────────────────────────────────────────────────────────
const TASK_TEMPLATES = [
  { id: "pick-deliver",    name: "Pick & Deliver",    fromLabel: "Side Storage",  toLabel: "Shipping Station" },
  { id: "replenishment",   name: "Replenishment Run",  fromLabel: "Receiving",     toLabel: "Bulk Storage"     },
  { id: "cross-dock",      name: "Cross-Dock",         fromLabel: "Receiving",     toLabel: "QC → Shipping"    },
  { id: "charging-run",    name: "Charging Run",        fromLabel: "Any Location",  toLabel: "Charging Bay"     },
];

// Pre-baked paths + metrics for each template
const TASK_PATH_DATA: Record<string, {
  plannedPath: [number,number,number][];
  actualPath: [number,number,number][];
  deviationZone: { cx: number; cz: number; w: number; d: number };
  metrics: { plannedDist: number; actualDist: number; plannedTime: number; actualTime: number;
    batteryPlanned: number; batteryActual: number; efficiencyScore: number;
    operatorScore: { before: number; after: number }; issues: string[]; };
}> = {
  "pick-deliver": {
    plannedPath:   [[-24,0,-11],[-24,0,-1],[-8,0,-1],[-8,0,10]],
    actualPath:    [[-24,0,-11],[-24,0,-5],[-15,0,-5],[-15,0,4],[-8,0,4],[-8,0,10]],
    deviationZone: { cx: -19, cz: -0.5, w: 11, d: 10 },
    metrics: { plannedDist: 24, actualDist: 37, plannedTime: 3.8, actualTime: 6.4,
      batteryPlanned: 2.8, batteryActual: 4.9, efficiencyScore: 65,
      operatorScore: { before: 88, after: 72 }, issues: ["Entered restricted zone", "Wrong aisle (C vs A)", "+2.6 min delay"] },
  },
  "replenishment": {
    plannedPath:   [[-26,0,2],[-10,0,2],[6,0,3]],
    actualPath:    [[-26,0,2],[-10,0,2],[6,0,3]],
    deviationZone: { cx: -10, cz: 2, w: 4, d: 4 },
    metrics: { plannedDist: 32, actualDist: 32, plannedTime: 4.5, actualTime: 4.5,
      batteryPlanned: 3.0, batteryActual: 3.0, efficiencyScore: 100,
      operatorScore: { before: 82, after: 85 }, issues: [] },
  },
  "cross-dock": {
    plannedPath:   [[-27,0,0],[-10,0,0],[5,0,9],[-8,0,12]],
    actualPath:    [[-27,0,0],[-10,0,0],[5,0,9],[-8,0,12]],
    deviationZone: { cx: 0, cz: 4, w: 4, d: 4 },
    metrics: { plannedDist: 28, actualDist: 28, plannedTime: 4.0, actualTime: 3.8,
      batteryPlanned: 2.5, batteryActual: 2.4, efficiencyScore: 100,
      operatorScore: { before: 80, after: 83 }, issues: [] },
  },
  "charging-run": {
    plannedPath:   [[0,0,0],[10,0,-2],[22,0,-4]],
    actualPath:    [[0,0,0],[6,0,4],[14,0,2],[22,0,-4]],
    deviationZone: { cx: 10, cz: 1, w: 10, d: 8 },
    metrics: { plannedDist: 22, actualDist: 31, plannedTime: 3.2, actualTime: 5.0,
      batteryPlanned: 2.0, batteryActual: 3.2, efficiencyScore: 71,
      operatorScore: { before: 85, after: 76 }, issues: ["Longer route taken", "+1.8 min delay"] },
  },
};

const MHE_IDS = ["MHE-01","MHE-02","MHE-03","MHE-04","MHE-05","MHE-06"];

const STATUS_CFG: Record<TaskStatus, { color: string; icon: React.ReactNode; label: string }> = {
  "assigned":    { color: "#f59e0b", icon: <Clock3 size={10} strokeWidth={1.5} />,       label: "Assigned"    },
  "in-progress": { color: "#1b59f8", icon: <Navigation size={10} strokeWidth={1.5} />,   label: "In Progress" },
  "deviated":    { color: "#ef4444", icon: <AlertTriangle size={10} strokeWidth={1.5} />, label: "Deviated"    },
  "completed":   { color: "#22c55e", icon: <CheckCircle2 size={10} strokeWidth={1.5} />, label: "Completed"   },
};

function TasksPanel({
  assignments,
  onAssign,
  onRemove,
}: {
  assignments: TaskAssignment[];
  onAssign: (taskId: string, mheId: string, status: TaskStatus) => void;
  onRemove: (id: string) => void;
}) {
  const { isDark } = useTheme();
  const [taskSel, setTaskSel] = useState(TASK_TEMPLATES[0].id);
  const [mheSel, setMheSel]   = useState("MHE-03");
  const [simMode, setSimMode] = useState<"in-progress" | "deviated" | "completed">("in-progress");

  const card = isDark ? "rgba(255,255,255,0.04)" : "var(--background)";
  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "5px 8px", fontSize: 11, borderRadius: 5,
    border: "1px solid var(--border)", background: "var(--card)",
    color: "var(--foreground)", cursor: "pointer", outline: "none",
  };

  return (
    <div style={{
      position: "absolute", left: 56, top: 12, zIndex: 30,
      width: 300, background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
      fontFamily: "system-ui,sans-serif", overflow: "hidden",
      maxHeight: "calc(100vh - 100px)", display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Navigation size={14} strokeWidth={1.5} style={{ color: "#1b59f8" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>Task Manager</span>
          {assignments.length > 0 && (
            <span style={{
              background: "#1b59f8", color: "#fff", borderRadius: 20,
              fontSize: 9, fontWeight: 700, padding: "1px 6px", marginLeft: "auto",
            }}>{assignments.length}</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>
          Assign routes · track compliance · view impact
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1, padding: "10px 10px 0" }}>

        {/* Active assignments */}
        {assignments.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: 11, padding: "20px 0" }}>
            No active tasks. Assign one below.
          </div>
        )}

        {assignments.map(a => {
          const cfg = STATUS_CFG[a.status];
          const tpl = TASK_TEMPLATES.find(t => t.id === a.taskId);
          const m = a.metrics;
          return (
            <div key={a.id} style={{
              marginBottom: 8, padding: "10px 10px",
              background: `${cfg.color}10`,
              border: `1px solid ${cfg.color}30`,
              borderRadius: 8,
            }}>
              {/* Row 1: title + badge + remove */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{tpl?.name}</div>
                  <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 1 }}>
                    {a.mheId} · {tpl?.fromLabel} → {tpl?.toLabel}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, marginLeft: 6 }}>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 3,
                    fontSize: 9, fontWeight: 700, color: cfg.color,
                    background: `${cfg.color}18`, borderRadius: 4, padding: "2px 6px",
                  }}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <button onClick={() => onRemove(a.id)} style={{
                    background: "none", border: "none", cursor: "pointer", padding: "2px 4px",
                    color: "var(--muted-foreground)", fontSize: 13, lineHeight: 1,
                    borderRadius: 3,
                  }}>✕</button>
                </div>
              </div>

              {/* Metrics strip */}
              {m && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                  {[
                    { lbl: "Distance", v: `${m.actualDist}m`,       d: m.actualDist - m.plannedDist,       suffix: "m",  neg: m.actualDist > m.plannedDist },
                    { lbl: "Time",     v: `${m.actualTime}m`,        d: +(m.actualTime - m.plannedTime).toFixed(1), suffix: "m", neg: m.actualTime > m.plannedTime },
                    { lbl: "Eff.",     v: `${m.efficiencyScore}%`,   d: null, neg: m.efficiencyScore < 90 },
                  ].map((row, i) => (
                    <div key={i} style={{
                      background: card, border: "1px solid var(--border)",
                      borderRadius: 5, padding: "4px 6px",
                    }}>
                      <div style={{ fontSize: 8, color: "var(--muted-foreground)", marginBottom: 1 }}>{row.lbl}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: row.neg ? "#ef4444" : "#22c55e" }}>{row.v}</div>
                      {row.d !== null && (
                        <div style={{ fontSize: 8, color: (row.d as number) > 0 ? "#ef4444" : "#22c55e" }}>
                          {(row.d as number) > 0 ? `+${row.d}` : row.d}{row.suffix}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Operator score delta */}
              {m && (
                <div style={{
                  marginTop: 5, fontSize: 10,
                  color: (m.operatorScore.after - m.operatorScore.before) < 0 ? "#ef4444" : "#22c55e",
                }}>
                  Operator score: {m.operatorScore.before} → {m.operatorScore.after}{" "}
                  ({m.operatorScore.after - m.operatorScore.before >= 0 ? "+" : ""}{m.operatorScore.after - m.operatorScore.before} pts)
                </div>
              )}
            </div>
          );
        })}

        {/* Assign new task form */}
        <div style={{
          marginBottom: 10, padding: "10px 10px",
          background: card, border: "1px solid var(--border)", borderRadius: 8,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>
            Assign New Task
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 3 }}>Task Type</div>
              <select value={taskSel} onChange={e => setTaskSel(e.target.value)} style={selectStyle}>
                {TASK_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name} — {t.fromLabel} → {t.toLabel}</option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 3 }}>Assign to MHE</div>
              <select value={mheSel} onChange={e => setMheSel(e.target.value)} style={selectStyle}>
                {MHE_IDS.map(id => <option key={id} value={id}>{id}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 3 }}>Simulate As</div>
              <div style={{ display: "flex", gap: 4 }}>
                {(["in-progress","deviated","completed"] as const).map(s => (
                  <button key={s} onClick={() => setSimMode(s)} style={{
                    flex: 1, padding: "4px 4px", fontSize: 9, fontWeight: 600,
                    borderRadius: 5, border: `1px solid ${simMode === s ? STATUS_CFG[s].color : "var(--border)"}`,
                    background: simMode === s ? `${STATUS_CFG[s].color}15` : "transparent",
                    color: simMode === s ? STATUS_CFG[s].color : "var(--muted-foreground)",
                    cursor: "pointer",
                  }}>
                    {STATUS_CFG[s].label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => onAssign(taskSel, mheSel, simMode)}
              style={{
                marginTop: 2, padding: "8px", background: "#1b59f8", color: "#fff",
                border: "none", borderRadius: 6, cursor: "pointer",
                fontSize: 12, fontWeight: 600,
                boxShadow: "0 2px 8px rgba(27,89,248,0.3)",
              }}
            >
              Assign Task to {mheSel}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          marginBottom: 10, padding: "8px 10px",
          background: card, border: "1px solid var(--border)", borderRadius: 8,
        }}>
          <div style={{ fontSize: 9, color: "var(--muted-foreground)", marginBottom: 5, fontWeight: 600 }}>
            3D MAP LEGEND
          </div>
          {[
            { color: "#1b59f8", dash: true,  label: "Planned Route (blue dashed)" },
            { color: "#ef4444", dash: false, label: "Actual Deviated Route (red)" },
            { color: "#22c55e", dash: false, label: "Completed On-Route (green)"  },
            { color: "#ef4444", dash: false, label: "Deviation Zone (red area)",   area: true },
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
              <div style={{
                width: 24, height: l.area ? 10 : 3, flexShrink: 0, borderRadius: 2,
                background: l.area ? `${l.color}25` : l.color,
                border: l.area ? `1px solid ${l.color}60` : "none",
                backgroundImage: l.dash ? `repeating-linear-gradient(90deg,${l.color} 0,${l.color} 4px,transparent 4px,transparent 7px)` : "none",
              }} />
              <span style={{ fontSize: 9, color: "var(--muted-foreground)" }}>{l.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── Impact Events Panel ──────────────────────────────────────────────────────
type ImpactSev = "Low" | "Medium" | "Critical";

function sevStyle(isDark: boolean): Record<ImpactSev, { dot: string; bg: string; color: string }> {
  return {
    Low:      { dot: "#22c55e", bg: isDark ? "rgba(22,163,74,0.15)"  : "#f0fdf4", color: isDark ? "#4ade80" : "#16a34a" },
    Medium:   { dot: "#f97316", bg: isDark ? "rgba(249,115,22,0.15)" : "#fff7ed", color: isDark ? "#fb923c" : "#ea580c" },
    Critical: { dot: "#ef4444", bg: isDark ? "rgba(239,68,68,0.15)"  : "#fef2f2", color: isDark ? "#f87171" : "#dc2626" },
  };
}

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
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<"All" | ImpactSev>("All");

  const SEV_STYLE = sevStyle(isDark);

  const stripBg    = isDark ? "rgba(71,85,105,0.45)"  : "#eef2ff";
  const activeBg   = isDark ? "rgba(59,130,246,0.20)" : "#dbeafe";
  const activeColor  = "#1b59f8";
  const inactiveColor = isDark ? "#94a3b8" : "#374151";
  const badgeBg    = isDark ? "#334155" : "white";
  const badgeColor = isDark ? "#e2e8f0" : "#374151";

  const visibleGroups = IMPACT_GROUPS.map(g => ({
    ...g,
    events: activeFilter === "All" ? g.events : g.events.filter(e => e.severity === activeFilter),
  })).filter(g => g.events.length > 0);

  const FILTERS: ("All" | ImpactSev)[] = ["All", "Low", "Medium", "Critical"];

  return (
    <div style={{
      position: "absolute", right: 0, top: 0, bottom: 0, zIndex: 25,
      width: 380, display: "flex", flexDirection: "column",
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
        <div style={{ display: "flex", alignItems: "center", background: stripBg, borderRadius: 10, padding: "4px 6px", gap: 2 }}>
          {FILTERS.map(f => {
            const active = activeFilter === f;
            const count = f === "All" ? ALL_EVENTS_COUNT : IMPACT_GROUPS.reduce((s, g) => s + g.events.filter(e => e.severity === f).length, 0);
            return (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                flex: 1, padding: "5px 8px", borderRadius: 7, border: "none", cursor: "pointer",
                background: active ? activeBg : "transparent",
                color: active ? activeColor : inactiveColor,
                fontSize: 12, fontWeight: active ? 600 : 400,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "background 0.15s",
              }}>
                {f}
                {active && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: badgeColor,
                    background: badgeBg, borderRadius: 100,
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
                const s = SEV_STYLE[ev.severity as ImpactSev];
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


// ─── Events Trigger Button ────────────────────────────────────────────────────
function EventsTriggerButton({ onOpen }: { onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: "absolute", right: 12, top: 14, zIndex: 30 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onOpen}
        style={{
          position: "relative",
          width: 34, height: 34, borderRadius: 8,
          border: "1px solid var(--border)",
          background: hovered ? "var(--muted)" : "var(--card)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
          transition: "background 0.15s, color 0.15s",
        }}
      >
        <Zap size={15} strokeWidth={1.6} color="var(--muted-foreground)" />
        <span style={{
          position: "absolute", top: -5, right: -5,
          fontSize: 9, fontWeight: 700, color: "white",
          background: "#ef4444", borderRadius: 100,
          minWidth: 16, height: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 3px", lineHeight: 1,
          border: "1.5px solid var(--card)",
        }}>{ALL_EVENTS_COUNT}</span>
      </button>

      {/* Label tooltip — same style as left toolbar */}
      {hovered && (
        <div style={{
          position: "absolute", right: "calc(100% + 9px)", top: "50%",
          transform: "translateY(-50%)", zIndex: 50, pointerEvents: "none",
          background: "#1b59f8", color: "white", borderRadius: 6,
          padding: "4px 10px", fontSize: 11, fontWeight: 500,
          whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(27,89,248,0.25)",
        }}>
          {/* arrow pointing right */}
          <div style={{
            position: "absolute", left: "100%", top: "50%", transform: "translateY(-50%)",
            width: 0, height: 0,
            borderTop: "4px solid transparent", borderBottom: "4px solid transparent",
            borderLeft: "4px solid #1b59f8",
          }} />
          Events
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
// Pre-baked initial assignments (deviated + in-progress examples on load)
const INITIAL_ASSIGNMENTS: TaskAssignment[] = [
  {
    id: "ta-init-1",
    taskId: "pick-deliver",
    taskName: "Staging → Shipping",
    mheId: "MHE-03",
    status: "deviated",
    // Planned: straight up the left aisle then across to shipping dock
    plannedPath: [[-6,0,5],[-6,0,12],[-1,0,12]],
    // Actual: detoured right through staging, came back around
    actualPath:  [[-6,0,5],[2,0,5],[2,0,12],[-1,0,12]],
    deviationZone: { cx: -2, cz: 8.5, w: 10, d: 9 },
    metrics: {
      plannedDist: 14, actualDist: 23,
      plannedTime: 2.1, actualTime: 3.9,
      batteryPlanned: 1.4, batteryActual: 2.5,
      efficiencyScore: 62,
      operatorScore: { before: 83, after: 67 },
      issues: ["Wrong aisle used", "Staged area congestion", "+1.8 min delay"],
    },
  },
];

export function CommandCenter3D() {
  const [mode, setMode] = useState<"live" | "history">("live");
  const [showEvents, setShowEvents] = useState(false);
  const [analyticsMHE, setAnalyticsMHE] = useState<MHEItem | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>(INITIAL_ASSIGNMENTS);
  const [isExpanded, setIsExpanded] = useState(false);

  // Near-miss alert state
  type NearMissAlert = { id: string; mheId: string; mheLabel: string; rackLabel: string };
  const [nearMissAlerts, setNearMissAlerts] = useState<NearMissAlert[]>([]);
  const nearMissCountRef = useRef(0);

  const handleNearMiss = (e: NearMissEvent) => {
    const alert: NearMissAlert = {
      id: `nm-${++nearMissCountRef.current}`,
      mheId: e.mheId, mheLabel: e.mheLabel, rackLabel: e.rackLabel,
    };
    setNearMissAlerts(prev => [alert, ...prev].slice(0, 5));
    setTimeout(() => setNearMissAlerts(prev => prev.filter(a => a.id !== alert.id)), 6000);
  };

  const openAnalytics = (mhe: MHEItem) => {
    setShowEvents(false);
    setAnalyticsMHE(mhe);
  };

  const handleAssignTask = (taskId: string, mheId: string, status: TaskStatus) => {
    const data = TASK_PATH_DATA[taskId];
    const tpl  = TASK_TEMPLATES.find(t => t.id === taskId)!;
    const isDeviated  = status === "deviated";
    const isCompleted = status === "completed";
    const newAssignment: TaskAssignment = {
      id: `ta-${Date.now()}`,
      taskId, mheId, status,
      taskName: tpl.name,
      plannedPath: data.plannedPath,
      actualPath:  (isDeviated || isCompleted) ? data.actualPath : undefined,
      deviationZone: isDeviated ? data.deviationZone : undefined,
      metrics: (isDeviated || isCompleted) ? data.metrics : undefined,
    };
    setTaskAssignments(prev => [...prev, newAssignment]);
  };

  const handleRemoveTask = (id: string) => {
    setTaskAssignments(prev => prev.filter(a => a.id !== id));
  };

  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(e => setCanvasHeight(e[0].contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Escape key closes expanded mode
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsExpanded(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isExpanded]);

  return (
    <div style={{
      display: "flex", flexDirection: "column", width: "100%", height: "100%",
      background: "var(--background)", overflow: "hidden", fontFamily: "system-ui,sans-serif",
    }}>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div style={{ flex: "1 1 0", minHeight: 0, display: "flex", overflow: "hidden" }}>

        {/* 3D Canvas */}
        <div ref={canvasWrapRef} style={isExpanded ? {
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          zIndex: 9999, background: "#eeeef0",
        } : { flex: 1, position: "relative", overflow: "hidden" }}>

          {/* ── Left toolbar ── */}
          <LeftToolbar
            mode={mode}
            onViewAnalytics={openAnalytics}
            taskAssignments={taskAssignments}
            onAssignTask={handleAssignTask}
            onRemoveTask={handleRemoveTask}
            onExpand={() => setIsExpanded(p => !p)}
            isExpanded={isExpanded}
          />

          {/* ── Events trigger button (top-right) ── */}
          {!showEvents && !analyticsMHE && <EventsTriggerButton onOpen={() => setShowEvents(true)} />}

          {/* ── Impact events panel ── */}
          {showEvents && <ImpactEventsPanel onClose={() => setShowEvents(false)} />}

          {/* ── MHE Analytics panel ── */}
          {analyticsMHE && <MHEAnalyticsPanel mhe={analyticsMHE} onClose={() => setAnalyticsMHE(null)} />}

          {/* ── Near-miss alert toasts ── */}
          {nearMissAlerts.length > 0 && (
            <div style={{
              position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)",
              zIndex: 40, display: "flex", flexDirection: "column", gap: 4, pointerEvents: "none",
            }}>
              {nearMissAlerts.map(a => (
                <div key={a.id} style={{
                  background: "rgba(220,38,38,0.95)", color: "#fff",
                  borderRadius: 8, padding: "7px 14px",
                  fontSize: 12, fontWeight: 600, fontFamily: "system-ui,sans-serif",
                  display: "flex", alignItems: "center", gap: 10,
                  boxShadow: "0 4px 18px rgba(220,38,38,0.5)",
                  whiteSpace: "nowrap", pointerEvents: "auto",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}>
                  <span style={{ fontSize: 14 }}>⚠</span>
                  <span>
                    <strong>Near Miss</strong> — {a.mheLabel} approaching {a.rackLabel} safety zone
                  </span>
                  <button
                    onClick={() => setNearMissAlerts(prev => prev.filter(x => x.id !== a.id))}
                    style={{
                      background: "rgba(255,255,255,0.18)", border: "none", color: "#fff",
                      borderRadius: 4, cursor: "pointer", padding: "2px 7px", fontSize: 12, marginLeft: 4,
                      pointerEvents: "auto",
                    }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Floating Live / History pill — centered top */}
          <div style={{
            position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
            zIndex: 20, display: "flex", alignItems: "center",
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 100, padding: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}>
            {/* Live */}
            <button onClick={() => setMode("live")} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer",
              background: mode === "live" ? "#1b59f8" : "transparent",
              color: mode === "live" ? "white" : "var(--muted-foreground)",
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
              color: mode === "history" ? "white" : "var(--muted-foreground)",
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
              <Suspense fallback={null}>
                <WarehouseScene taskAssignments={taskAssignments} onNearMiss={handleNearMiss} />
              </Suspense>
            </Canvas>
          )}

        </div>

      </div>
    </div>
  );
}
