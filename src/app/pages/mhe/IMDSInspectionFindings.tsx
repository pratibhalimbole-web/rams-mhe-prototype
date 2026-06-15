"use client"

import * as React from "react"
import { useEffect } from "react"
import {
  Search,
  Camera,
  Mic,
  PlayCircle,
  Play,
  Pause,
  Volume2,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  ExternalLink,
} from "lucide-react"
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table"
import { useSidebar } from "../../components/layout/SidebarLayout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"

// --- Types ---

type InspectionSeverity = "Red" | "Amber" | "Green" | "No Issue"
type InspectionStatus = "Open" | "Reported" | "Closed"

type TimelineEvent = {
  time: string
  severity: InspectionSeverity
  userId: string
  evidenceCount?: number
  note?: string
  isActive?: boolean
}

type InspectionFinding = {
  id: string
  mheName: string
  mheId: string
  partName: string
  checklist: string
  reportedBy: string
  reportedByInitials: string
  severity: InspectionSeverity
  status: InspectionStatus
  createdAt: string
  lastUpdated: string
  transactionId: string
  notes?: string
  imageCount?: number
  videoCount?: number
  timeline: TimelineEvent[]
}

// --- Mock Data ---

const mockFindings: InspectionFinding[] = [
  {
    id: "MIFUSU4BN8-QZNHYX13",
    mheName: "MHE 05", mheId: "OE2BQ63OX8TSGTT",
    partName: "Tyre", checklist: "Check physical body condition.",
    reportedBy: "Vivek Deshmukh", reportedByInitials: "VD",
    severity: "Red", status: "Reported",
    createdAt: "2026-06-09 09:14", lastUpdated: "2026-06-09 11:30",
    transactionId: "TXN-20260609-0041",
    imageCount: 3, videoCount: 1,
    timeline: [
      { time: "2026-06-09 11:30", severity: "Red",   userId: "VKD4BN8", evidenceCount: 1, isActive: true },
      { time: "2026-06-09 11:00", severity: "Amber", userId: "VKD4BN8", evidenceCount: 1 },
      { time: "2026-06-09 09:14", severity: "Red",   userId: "VKD4BN8", evidenceCount: 1 },
    ],
  },
  {
    id: "MIFUSU4BN8-RTLMKQ72",
    mheName: "MHE 02", mheId: "P1WTZXKS9ANQBCJ",
    partName: "Battery", checklist: "Inspect battery charge level and terminals.",
    reportedBy: "Arjun Mehta", reportedByInitials: "AM",
    severity: "Amber", status: "Open",
    createdAt: "2026-06-10 08:22", lastUpdated: "2026-06-10 08:22",
    transactionId: "TXN-20260610-0017",
    timeline: [
      { time: "2026-06-10 08:22", severity: "Amber", userId: "ARM5BN8", isActive: true },
    ],
  },
  {
    id: "MIFUSU4BN8-JXKP9WN5",
    mheName: "MHE 07", mheId: "BKRT4HQNCM2GYXV",
    partName: "Lights", checklist: "Verify all lights are functional.",
    reportedBy: "Sneha Patil", reportedByInitials: "SP",
    severity: "Green", status: "Closed",
    createdAt: "2026-06-08 14:05", lastUpdated: "2026-06-08 16:40",
    transactionId: "TXN-20260608-0093",
    timeline: [
      { time: "2026-06-08 16:40", severity: "Green", userId: "SNP3BN8", evidenceCount: 2, isActive: true },
      { time: "2026-06-08 15:30", severity: "Amber", userId: "SNP3BN8", evidenceCount: 1 },
      { time: "2026-06-08 14:05", severity: "Green", userId: "SNP3BN8" },
    ],
  },
  {
    id: "MIFUSU4BN8-HVQZLR81",
    mheName: "MHE 01", mheId: "Y8ZJNAKO7AIVM1H",
    partName: "Forks", checklist: "Check fork alignment and wear.",
    reportedBy: "Vivek Deshmukh", reportedByInitials: "VD",
    severity: "Red", status: "Open",
    createdAt: "2026-06-11 07:55", lastUpdated: "2026-06-11 07:55",
    transactionId: "TXN-20260611-0003",
    imageCount: 2,
    timeline: [
      { time: "2026-06-11 07:55", severity: "Red", userId: "VKD4BN8", evidenceCount: 1, isActive: true },
    ],
  },
  {
    id: "MIFUSU4BN8-CZWN4MT6",
    mheName: "MHE 03", mheId: "EJPSLTSFAOTF4LD",
    partName: "Horn", checklist: "Test horn functionality during pre-shift check.",
    reportedBy: "Arjun Mehta", reportedByInitials: "AM",
    severity: "Red", status: "Reported",
    createdAt: "2026-06-09 10:30", lastUpdated: "2026-06-09 12:00",
    transactionId: "TXN-20260609-0058",
    timeline: [
      { time: "2026-06-09 12:00", severity: "Red",   userId: "ARM5BN8", evidenceCount: 1, isActive: true },
      { time: "2026-06-09 10:30", severity: "Amber", userId: "ARM5BN8" },
    ],
  },
  {
    id: "MIFUSU4BN8-KNRXBP90",
    mheName: "MHE 08", mheId: "KRGTL1NKXNBWR6Y",
    partName: "Frame", checklist: "Inspect frame welds and structural integrity.",
    reportedBy: "Sneha Patil", reportedByInitials: "SP",
    severity: "Amber", status: "Reported",
    createdAt: "2026-06-10 11:15", lastUpdated: "2026-06-10 13:45",
    transactionId: "TXN-20260610-0034",
    timeline: [
      { time: "2026-06-10 13:45", severity: "Amber", userId: "SNP3BN8", evidenceCount: 1, isActive: true },
      { time: "2026-06-10 11:15", severity: "Green", userId: "SNP3BN8" },
    ],
  },
  {
    id: "MIFUSU4BN8-LPWKQR47",
    mheName: "MHE 05", mheId: "OE2BQ63OX8TSGTT",
    partName: "Seatbelt", checklist: "Check seatbelt retraction and buckle lock.",
    reportedBy: "Vivek Deshmukh", reportedByInitials: "VD",
    severity: "Red", status: "Open",
    createdAt: "2026-06-11 08:40", lastUpdated: "2026-06-11 08:40",
    transactionId: "TXN-20260611-0009",
    timeline: [
      { time: "2026-06-11 08:40", severity: "Red", userId: "VKD4BN8", isActive: true },
    ],
  },
  {
    id: "MIFUSU4BN8-GXZMTP28",
    mheName: "MHE 04", mheId: "WQ9CVSX4ARCCYA8",
    partName: "Hydraulics", checklist: "Check hydraulic fluid level and leak points.",
    reportedBy: "Arjun Mehta", reportedByInitials: "AM",
    severity: "Green", status: "Closed",
    createdAt: "2026-06-07 09:00", lastUpdated: "2026-06-07 15:00",
    transactionId: "TXN-20260607-0071",
    timeline: [
      { time: "2026-06-07 15:00", severity: "Green", userId: "ARM5BN8", evidenceCount: 2, isActive: true },
      { time: "2026-06-07 13:30", severity: "Amber", userId: "ARM5BN8", evidenceCount: 1 },
      { time: "2026-06-07 11:00", severity: "Green", userId: "ARM5BN8" },
      { time: "2026-06-07 09:00", severity: "Green", userId: "ARM5BN8" },
    ],
  },
  {
    id: "MIFUSU4BN8-TQJYBZ63",
    mheName: "MHE 06", mheId: "M3QD9DNMDM9CBSF",
    partName: "Steering", checklist: "Test steering response and alignment.",
    reportedBy: "Sneha Patil", reportedByInitials: "SP",
    severity: "Amber", status: "Open",
    createdAt: "2026-06-10 14:20", lastUpdated: "2026-06-10 14:20",
    transactionId: "TXN-20260610-0049",
    timeline: [
      { time: "2026-06-10 14:20", severity: "Amber", userId: "SNP3BN8", isActive: true },
    ],
  },
  {
    id: "MIFUSU4BN8-RWNXKL55",
    mheName: "MHE 02", mheId: "P1WTZXKS9ANQBCJ",
    partName: "Brakes", checklist: "Check brake pad thickness and response.",
    reportedBy: "Vivek Deshmukh", reportedByInitials: "VD",
    severity: "No Issue", status: "Closed",
    createdAt: "2026-06-06 10:00", lastUpdated: "2026-06-06 14:00",
    transactionId: "TXN-20260606-0082",
    timeline: [
      { time: "2026-06-06 14:00", severity: "No Issue", userId: "VKD4BN8", isActive: true },
      { time: "2026-06-06 12:00", severity: "Green",    userId: "VKD4BN8" },
      { time: "2026-06-06 10:00", severity: "No Issue", userId: "VKD4BN8" },
    ],
  },
  {
    id: "MIFUSU4BN8-BMXQYL19",
    mheName: "MHE 09", mheId: "C016YCUTYUO6MRY",
    partName: "Tyre", checklist: "Inspect tyre tread depth and sidewall condition.",
    reportedBy: "Arjun Mehta", reportedByInitials: "AM",
    severity: "Amber", status: "Reported",
    createdAt: "2026-06-11 07:10", lastUpdated: "2026-06-11 09:00",
    transactionId: "TXN-20260611-0001",
    timeline: [
      { time: "2026-06-11 09:00", severity: "Amber", userId: "ARM5BN8", evidenceCount: 1, isActive: true },
      { time: "2026-06-11 07:10", severity: "Green", userId: "ARM5BN8" },
    ],
  },
  {
    id: "MIFUSU4BN8-DQCNFK36",
    mheName: "MHE 10", mheId: "307NDKTMPALKX0Y",
    partName: "Battery", checklist: "Check battery connectors and charge indicator.",
    reportedBy: "Sneha Patil", reportedByInitials: "SP",
    severity: "Green", status: "Closed",
    createdAt: "2026-06-05 11:30", lastUpdated: "2026-06-05 16:00",
    transactionId: "TXN-20260605-0067",
    timeline: [
      { time: "2026-06-05 16:00", severity: "Green",    userId: "SNP3BN8", evidenceCount: 1, isActive: true },
      { time: "2026-06-05 14:00", severity: "Green",    userId: "SNP3BN8" },
      { time: "2026-06-05 12:30", severity: "Amber",    userId: "SNP3BN8", evidenceCount: 1 },
      { time: "2026-06-05 11:30", severity: "No Issue", userId: "SNP3BN8" },
    ],
  },
]

// --- Badge helpers ---

function severityBadge(s: InspectionSeverity): React.ReactNode {
  const map: Record<InspectionSeverity, { bg: string; color: string }> = {
    Red:      { bg: "rgba(239,68,68,0.12)",   color: "#ef4444" },
    Amber:    { bg: "rgba(245,158,11,0.12)",  color: "#f59e0b" },
    Green:    { bg: "rgba(16,185,129,0.12)",  color: "#10b981" },
    "No Issue": { bg: "rgba(100,116,139,0.12)", color: "var(--muted-foreground)" },
  }
  const { bg, color } = map[s]
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[length:var(--text-xs)] font-normal"
      style={{ backgroundColor: bg, color }}
    >
      {s}
    </span>
  )
}

function statusBadge(s: InspectionStatus): React.ReactNode {
  const map: Record<InspectionStatus, { bg: string; color: string }> = {
    Open:     { bg: "rgba(239,68,68,0.10)",   color: "var(--destructive)" },
    Reported: { bg: "rgba(245,158,11,0.12)",  color: "#f59e0b" },
    Closed:   { bg: "rgba(100,116,139,0.12)", color: "var(--muted-foreground)" },
  }
  const { bg, color } = map[s]
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[length:var(--text-xs)] font-normal"
      style={{ backgroundColor: bg, color }}
    >
      {s}
    </span>
  )
}

// --- Avatar ---
function Avatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" }) {
  const sz = size === "md" ? "h-8 w-8 text-xs" : "h-6 w-6 text-[10px]"
  return (
    <span
      className={`${sz} rounded-full flex items-center justify-center font-normal shrink-0`}
      style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "var(--primary)" }}
    >
      {initials}
    </span>
  )
}

function formatTimelineDate(raw: string) {
  const d = new Date(raw.replace(" ", "T"))
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).replace(",", "")
}


// --- Detail Page ---

function ImageLightbox({
  total,
  index,
  onClose,
  onNav,
}: {
  total: number
  index: number
  onClose: () => void
  onNav: (i: number) => void
}) {
  const [zoom, setZoom] = React.useState(100)
  const [rotation, setRotation] = React.useState(0)

  React.useEffect(() => {
    setZoom(100)
    setRotation(0)
  }, [index])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && total > 1) onNav((index - 1 + total) % total)
      if (e.key === "ArrowRight" && total > 1) onNav((index + 1) % total)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, total])

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="flex flex-col rounded-[var(--radius)] overflow-hidden shadow-2xl"
        style={{
          width: "min(900px, calc(100vw - 80px))",
          height: "min(620px, calc(100vh - 80px))",
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)]">
            Image {index + 1} of {total}
          </p>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X strokeWidth={1.5} className="h-4 w-4" />
          </button>
        </div>

        {/* Image area */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#111118" }}
        >
          {total > 1 && (
            <button
              onClick={() => onNav((index - 1 + total) % total)}
              className="absolute left-3 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <ChevronLeft strokeWidth={1.5} className="h-5 w-5" />
            </button>
          )}

          {/* Placeholder */}
          <div
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Camera strokeWidth={1} className="h-20 w-20" style={{ color: "rgba(255,255,255,0.1)" }} />
          </div>

          {total > 1 && (
            <button
              onClick={() => onNav((index + 1) % total)}
              className="absolute right-3 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <ChevronRight strokeWidth={1.5} className="h-5 w-5" />
            </button>
          )}

          {/* Toolbar — floats inside image area */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(10,10,10,0.75)", backdropFilter: "blur(10px)" }}>
            <button
              onClick={() => setZoom(z => Math.max(25, z - 25))}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <ZoomOut strokeWidth={1.5} className="h-4 w-4" />
            </button>
            <span className="px-2 text-[length:var(--text-xs)] font-normal min-w-[46px] text-center" style={{ color: "rgba(255,255,255,0.7)" }}>
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(300, z + 25))}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <ZoomIn strokeWidth={1.5} className="h-4 w-4" />
            </button>
            <div className="w-px h-3.5 mx-1.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
            <button
              onClick={() => setRotation(r => (r + 90) % 360)}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <RotateCw strokeWidth={1.5} className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <Maximize2 strokeWidth={1.5} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoLightbox({
  total,
  index,
  onClose,
  onNav,
}: {
  total: number
  index: number
  onClose: () => void
  onNav: (i: number) => void
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && total > 1) onNav((index - 1 + total) % total)
      if (e.key === "ArrowRight" && total > 1) onNav((index + 1) % total)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, total])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col rounded-[var(--radius)] overflow-hidden shadow-2xl"
        style={{
          width: "min(900px, calc(100vw - 80px))",
          height: "min(560px, calc(100vh - 80px))",
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)]">
            Video {index + 1} of {total}
          </p>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X strokeWidth={1.5} className="h-4 w-4" />
          </button>
        </div>

        {/* Video area */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#111118" }}
        >
          {total > 1 && (
            <button
              onClick={() => onNav((index - 1 + total) % total)}
              className="absolute left-3 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <ChevronLeft strokeWidth={1.5} className="h-5 w-5" />
            </button>
          )}

          {/* Placeholder player */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 72, height: 72, backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <Play strokeWidth={1.5} className="h-8 w-8 ml-1" style={{ color: "rgba(255,255,255,0.5)" }} />
            </div>
            <span className="text-[length:var(--text-xs)] font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>
              Video {index + 1}
            </span>
          </div>

          {total > 1 && (
            <button
              onClick={() => onNav((index + 1) % total)}
              className="absolute right-3 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <ChevronRight strokeWidth={1.5} className="h-5 w-5" />
            </button>
          )}

          {/* Progress bar toolbar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(10,10,10,0.75)", backdropFilter: "blur(10px)", minWidth: 260 }}>
            <button className="p-1 rounded hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Play strokeWidth={1.5} className="h-4 w-4" />
            </button>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
            </div>
            <span className="text-[10px] font-normal shrink-0" style={{ color: "rgba(255,255,255,0.5)" }}>0:08 / 0:24</span>
            <button className="p-1 rounded hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Volume2 strokeWidth={1.5} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AudioPlayer({ durationSecs = 42 }: { durationSecs?: number }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [elapsed, setElapsed] = React.useState(0)
  const barRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      setElapsed(e => {
        if (e >= durationSecs) { setIsPlaying(false); return durationSecs }
        return e + 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isPlaying, durationSecs])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return
    const { left, width } = barRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - left) / width))
    setElapsed(Math.round(ratio * durationSecs))
  }

  return (
    <div
      className="w-full rounded-[var(--radius)] flex items-center gap-2 px-3 py-2.5"
      style={{ backgroundColor: "var(--muted)" }}
    >
      <button
        type="button"
        onClick={() => { if (elapsed >= durationSecs) setElapsed(0); setIsPlaying(p => !p) }}
        className="shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity"
        style={{ color: "var(--foreground)" }}
      >
        {isPlaying
          ? <Pause strokeWidth={1.5} className="h-3.5 w-3.5" />
          : <Play  strokeWidth={1.5} className="h-3.5 w-3.5" />
        }
      </button>
      <div
        ref={barRef}
        onClick={seek}
        className="flex-1 h-1 rounded-full overflow-hidden cursor-pointer"
        style={{ backgroundColor: "var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${(elapsed / durationSecs) * 100}%`, backgroundColor: "var(--primary)" }}
        />
      </div>
      <span className="text-[10px] text-[var(--muted-foreground)] font-normal shrink-0">
        {fmt(elapsed)} / {fmt(durationSecs)}
      </span>
    </div>
  )
}

function DetailPage({ finding }: { finding: InspectionFinding }) {
  const [activeTab, setActiveTab] = React.useState<"observation" | "timeline">("observation")
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)
  const [videoLightboxIndex, setVideoLightboxIndex] = React.useState<number | null>(null)
  const imageCount = finding.imageCount ?? 1

  return (
    <div className="h-full flex flex-col bg-[var(--background)] p-6">
      {/* Two-column body */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left — tabbed content */}
        <div className="flex-[2] flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">

          {/* Underline tab bar */}
          <div className="flex border-b border-[var(--border)] shrink-0">
            {(["observation", "timeline"] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="relative px-6 py-3 text-[length:var(--text-sm)] font-normal capitalize transition-colors"
                style={{
                  color: activeTab === tab ? "var(--foreground)" : "var(--muted-foreground)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: "var(--primary)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "observation" && (
              <div className="px-6 py-5 flex flex-col gap-5">

                <section>
                  <p className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)] tracking-wide mb-3">MHE Details</p>
                  <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <Field label="MHE Name" value={finding.mheName} />
                      <Field label="MHE ID" value={finding.mheId} mono />
                      <Field label="Part Name" value={finding.partName} />
                      <div className="col-span-2"><Field label="Checklist" value={finding.checklist} /></div>
                    </div>
                  </div>
                </section>

                <section>
                  <p className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)] tracking-wide mb-3">Finding Summary</p>
                  <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <p className="text-[length:var(--text-xs)] uppercase text-[var(--muted-foreground)] mb-1">Severity</p>
                        {severityBadge(finding.severity)}
                      </div>
                      <div>
                        <p className="text-[length:var(--text-xs)] uppercase text-[var(--muted-foreground)] mb-1">Finding ID</p>
                        <p className="text-[length:var(--text-sm)] font-normal" style={{ color: "var(--primary)" }}>{finding.id}</p>
                      </div>
                      <div>
                        <p className="text-[length:var(--text-xs)] uppercase text-[var(--muted-foreground)] mb-1">Issue Status</p>
                        {statusBadge(finding.status)}
                      </div>
                      <div>
                        <p className="text-[length:var(--text-xs)] uppercase text-[var(--muted-foreground)] mb-1">Transaction ID</p>
                        <p className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)]">{finding.transactionId}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <p className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)] tracking-wide mb-3">Reported Information</p>
                  <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-[length:var(--text-xs)] uppercase text-[var(--muted-foreground)] mb-1.5">Created By</p>
                        <div className="flex items-center gap-2">
                          <Avatar initials={finding.reportedByInitials} size="md" />
                          <p className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)]">{finding.reportedBy}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <Field label="Created On" value={finding.createdAt} />
                        <Field label="Last Updated" value={finding.lastUpdated} />
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {activeTab === "timeline" && (
              <div className="px-6 py-5">
                <div className="relative flex flex-col gap-0">
                  {/* Vertical connector line */}
                  <div
                    className="absolute top-3 bottom-3 w-px"
                    style={{ left: "11px", backgroundColor: "var(--border)" }}
                  />

                  {finding.timeline.map((evt, idx) => {
                    const isActive = evt.isActive === true || idx === 0
                    return (
                      <div key={idx} className="relative flex gap-3 pb-4 last:pb-0">
                        {/* Dot */}
                        <div className="relative z-10 shrink-0 mt-3" style={{ width: "22px" }}>
                          {isActive ? (
                            /* Blue hollow ring */
                            <div
                              className="h-[22px] w-[22px] rounded-full border-2 flex items-center justify-center"
                              style={{ borderColor: "var(--primary)", backgroundColor: "var(--card)" }}
                            >
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
                            </div>
                          ) : (
                            /* Green filled with checkmark */
                            <div
                              className="h-[22px] w-[22px] rounded-full flex items-center justify-center"
                              style={{ backgroundColor: "#10b981" }}
                            >
                              <Check strokeWidth={2.5} className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Card */}
                        <div className="flex-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] overflow-hidden">
                          {/* Card header */}
                          <div className="flex items-center justify-between px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <p className="text-[length:var(--text-xs)] font-normal" style={{ color: "var(--muted-foreground)" }}>Severity</p>
                              {severityBadge(evt.severity)}
                            </div>
                            <p className="text-[10px] font-normal" style={{ color: "var(--muted-foreground)" }}>
                              {formatTimelineDate(evt.time)}
                            </p>
                          </div>
                          {/* Divider */}
                          <div className="h-px" style={{ backgroundColor: "var(--border)" }} />
                          {/* Card body — two columns */}
                          <div className="grid grid-cols-2 divide-x divide-[var(--border)] px-0">
                            <div className="px-4 py-2.5">
                              <p className="text-[10px] uppercase tracking-wide font-normal mb-1" style={{ color: "var(--muted-foreground)" }}>BY</p>
                              <p className="text-[length:var(--text-xs)] font-normal text-[var(--foreground)]">{evt.userId}</p>
                            </div>
                            <div className="px-4 py-2.5">
                              <p className="text-[10px] uppercase tracking-wide font-normal mb-1" style={{ color: "var(--muted-foreground)" }}>NOTES / COMMENT</p>
                              <p className="text-[length:var(--text-xs)] font-normal text-[var(--foreground)]">
                                {evt.note
                                  ? evt.note
                                  : evt.evidenceCount
                                    ? `${evt.evidenceCount} evidence file${evt.evidenceCount !== 1 ? "s" : ""} attached`
                                    : "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — Media Evidence */}
        <div className="flex-[1] flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-[var(--border)] shrink-0">
            <p className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
              Media Evidence
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

            {/* Images */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] font-normal">Images</p>
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full text-[9px] font-normal" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>
                  {finding.imageCount ?? 1}
                </span>
              </div>
              <div className="flex flex-row gap-2 flex-wrap">
                {Array.from({ length: imageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="rounded-[var(--radius)] flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ width: "110px", height: "110px", backgroundColor: "var(--muted)" }}
                  >
                    <Camera strokeWidth={1.5} className="h-6 w-6 text-[var(--muted-foreground)]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] font-normal">Videos</p>
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full text-[9px] font-normal" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>
                  {finding.videoCount ?? 1}
                </span>
              </div>
              <div className="flex flex-row gap-2 flex-wrap">
                {Array.from({ length: finding.videoCount ?? 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setVideoLightboxIndex(i)}
                    className="rounded-[var(--radius)] flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ width: "110px", height: "110px", backgroundColor: "var(--muted)" }}
                  >
                    <PlayCircle strokeWidth={1.5} className="h-6 w-6 text-[var(--muted-foreground)]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Audio */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] font-normal">Audio</p>
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full text-[9px] font-normal" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>1</span>
              </div>
              <AudioPlayer durationSecs={42} />
            </div>

          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          total={imageCount}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
      {videoLightboxIndex !== null && (
        <VideoLightbox
          total={finding.videoCount ?? 1}
          index={videoLightboxIndex}
          onClose={() => setVideoLightboxIndex(null)}
          onNav={setVideoLightboxIndex}
        />
      )}
    </div>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[length:var(--text-xs)] uppercase text-[var(--muted-foreground)] mb-0.5">{label}</p>
      <p className={`text-[length:var(--text-sm)] font-normal text-[var(--foreground)] ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  )
}

// --- Main Component ---

export function IMDSInspectionFindings() {
  const sidebar = useSidebar()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [severityFilter, setSeverityFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [detailFinding, setDetailFinding] = React.useState<InspectionFinding | null>(null)

  useEffect(() => {
    if (detailFinding) {
      sidebar?.setSubPageTitle("Details")
      sidebar?.setSubPageBack(() => setDetailFinding(null))
    } else {
      sidebar?.setSubPageTitle(null)
      sidebar?.setSubPageBack(null)
    }
    return () => {
      sidebar?.setSubPageTitle(null)
      sidebar?.setSubPageBack(null)
    }
  }, [detailFinding])

  const filtered = React.useMemo(() => {
    return mockFindings.filter(f => {
      if (severityFilter !== "all" && f.severity !== severityFilter) return false
      if (statusFilter !== "all" && f.status !== statusFilter) return false
      return true
    })
  }, [severityFilter, statusFilter])

  const columns: ColumnDef<InspectionFinding>[] = React.useMemo(() => [
    {
      accessorKey: "id",
      header: () => <ColHeader>Finding ID</ColHeader>,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setDetailFinding(row.original)}
          className="group flex items-center gap-1.5 text-[length:var(--text-sm)] font-normal text-left transition-colors"
          style={{ color: "var(--foreground)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--foreground)")}
        >
          <span className="h-1 w-1 rounded-full shrink-0 group-hover:opacity-0 transition-opacity bg-slate-400 dark:bg-slate-500" />
          <span className="truncate max-w-[160px]">{row.getValue("id")}</span>
          <ExternalLink strokeWidth={1.5} className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ),
    },
    {
      accessorKey: "mheName",
      header: () => <ColHeader>MHE Name</ColHeader>,
      cell: ({ row }) => <CellText>{row.getValue("mheName")}</CellText>,
    },
    {
      accessorKey: "partName",
      header: () => <ColHeader>Part Name</ColHeader>,
      cell: ({ row }) => <CellText>{row.getValue("partName")}</CellText>,
    },
    {
      accessorKey: "checklist",
      header: () => <ColHeader>Checklist</ColHeader>,
      cell: ({ row }) => (
        <span className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)] line-clamp-1 max-w-[200px]">
          {row.getValue("checklist")}
        </span>
      ),
    },
    {
      accessorKey: "reportedBy",
      header: () => <ColHeader>Reported By</ColHeader>,
      cell: ({ row }) => {
        const f = row.original
        return (
          <div className="flex items-center gap-2">
            <Avatar initials={f.reportedByInitials} />
            <CellText>{f.reportedBy}</CellText>
          </div>
        )
      },
    },
    {
      accessorKey: "severity",
      header: () => <ColHeader>Severity</ColHeader>,
      cell: ({ row }) => severityBadge(row.getValue("severity")),
    },
    {
      accessorKey: "status",
      header: () => <ColHeader>Status</ColHeader>,
      cell: ({ row }) => statusBadge(row.getValue("status")),
    },
    {
      accessorKey: "createdAt",
      header: () => <ColHeader>Created At</ColHeader>,
      cell: ({ row }) => <CellText>{row.getValue("createdAt")}</CellText>,
    },
  ], [])

  const table = useReactTable({
    data: filtered,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: { sorting, globalFilter, pagination },
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const firstRow = pageIndex * pageSize + 1
  const lastRow = Math.min(firstRow + pageSize - 1, totalRows)

  if (detailFinding) {
    return <DetailPage finding={detailFinding} />
  }

  return (
    <div className="h-full flex flex-col gap-5 p-6 bg-[var(--background)]">
      {/* Table Card */}
      <div className="flex-1 flex flex-col min-h-0 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)]">
          <div className="relative w-[260px]">
            <Search strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search findings..."
              value={globalFilter ?? ""}
              onChange={e => setGlobalFilter(e.target.value)}
              className="pl-9 h-9 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] text-[length:var(--text-sm)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="h-9 w-[140px] border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none text-[length:var(--text-sm)]">
                <SelectValue placeholder="All Severity" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Amber">Amber</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
                <SelectItem value="No Issue">No Issue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[140px] border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none text-[length:var(--text-sm)]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Reported">Reported</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(hg => (
                <TableRow key={hg.id} className="border-b border-[var(--border)] hover:bg-transparent">
                  {hg.headers.map(h => (
                    <TableHead key={h.id} className="h-10 px-4">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--muted)]/20 transition-colors cursor-pointer"
                    onClick={() => setDetailFinding(row.original)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3"
                        onClick={e => {
                          if ((e.target as HTMLElement).tagName === "BUTTON") e.stopPropagation()
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-40 text-center text-[var(--muted-foreground)] text-[length:var(--text-sm)]">
                    No findings match the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-end gap-3 px-4 py-2 border-t border-[var(--border)] bg-[var(--card)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[11px] font-normal text-[var(--muted-foreground)]">
              Rows per page:
            </span>
            <Select
              value={`${pageSize}`}
              onValueChange={v => table.setPageSize(Number(v))}
            >
              <SelectTrigger className="h-7 w-[60px] border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] shadow-none text-[11px] px-2 rounded-[var(--radius-sm)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top" className="bg-[var(--popover)] border-[var(--border)]">
                {[10, 20, 50].map(s => (
                  <SelectItem key={s} value={`${s}`} className="text-[length:var(--text-sm)]">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-[11px] text-[var(--muted-foreground)] font-normal">
            {totalRows > 0 ? `${firstRow} – ${lastRow} of ${totalRows}` : "0 results"}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none disabled:opacity-30"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft strokeWidth={1.5} className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none disabled:opacity-30"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight strokeWidth={1.5} className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

// --- Small helpers ---
function ColHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase text-[var(--muted-foreground)]">
      {children}
    </span>
  )
}
function CellText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[length:var(--text-sm)] font-normal text-[var(--foreground)]">{children}</span>
  )
}
