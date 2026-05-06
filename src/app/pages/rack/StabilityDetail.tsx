import { useEffect, useState, useRef } from "react";
import React from "react";
import { useParams } from "react-router";
import { useSidebar } from "../../components/layout/SidebarLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { BarChart3, Info, AlertTriangle, Package, MapPin, Layers, Ruler, Weight, AlertCircle, Activity, Wrench, CalendarIcon, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { getRackById, updateRackStatus, type StabilityStatus as ImportedStabilityStatus } from "../../utils/stabilityData";

// Types
type IssueSeverity = "critical" | "warning" | "minor";

type IssuePin = {
  id: string;
  x: number;
  y: number;
  severity: IssueSeverity;
  observationId: string;
};

type Observation = {
  id: string;
  severity: IssueSeverity;
  location: string;
  title: "Observation";
  description: string;
  inspector: string;
  timestamp: string;
  pinId: string;
};

type RackZone = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: "blocked" | "restricted" | "normal";
  label?: string;
};

type PanelType = "observations" | "insights" | "rackInfo" | "stability" | null;

// Mock data
const mockObservations: Observation[] = [
  {
    id: "obs-1",
    severity: "critical",
    location: "ST-C1-T | Bay_4 | Level_1 | Upright",
    title: "Observation",
    description: "Dent",
    inspector: "John Martinez",
    timestamp: "5 min ago",
    pinId: "pin-1",
  },
  {
    id: "obs-2",
    severity: "warning",
    location: "ST-C1-T | Bay_2 | Level_3 | Beam",
    title: "Observation",
    description: "Minor rust detected",
    inspector: "Sarah Chen",
    timestamp: "12 min ago",
    pinId: "pin-2",
  },
  {
    id: "obs-3",
    severity: "minor",
    location: "ST-C1-T | Bay_5 | Level_2 | Base Plate",
    title: "Observation",
    description: "Paint chip",
    inspector: "Mike Johnson",
    timestamp: "25 min ago",
    pinId: "pin-3",
  },
  {
    id: "obs-4",
    severity: "critical",
    location: "ST-C1-T | Bay_3 | Level_2 | Upright",
    title: "Observation",
    description: "Structural damage on vertical column",
    inspector: "Emily Rodriguez",
    timestamp: "32 min ago",
    pinId: "pin-4",
  },
  {
    id: "obs-5",
    severity: "warning",
    location: "ST-C1-T | Bay_1 | Level_1 | Beam",
    title: "Observation",
    description: "Loose connection detected",
    inspector: "David Kim",
    timestamp: "45 min ago",
    pinId: "pin-5",
  },
];

const mockPins: IssuePin[] = [
  { id: "pin-1", x: 180, y: 320, severity: "critical", observationId: "obs-1" },
  { id: "pin-2", x: 280, y: 180, severity: "warning", observationId: "obs-2" },
  { id: "pin-3", x: 480, y: 260, severity: "minor", observationId: "obs-3" },
  { id: "pin-4", x: 380, y: 260, severity: "critical", observationId: "obs-4" },
  { id: "pin-5", x: 100, y: 320, severity: "warning", observationId: "obs-5" },
];

const mockZones: RackZone[] = [
  {
    id: "zone-1",
    x: 140,
    y: 280,
    width: 120,
    height: 100,
    state: "blocked",
    label: "BLOCKED",
  },
  {
    id: "zone-2",
    x: 340,
    y: 140,
    width: 120,
    height: 100,
    state: "restricted",
    label: "RESTRICTED",
  },
];

// Mock rack stability data - simulates backend data
const mockRackStabilityData: Record<string, {
  status: "stable" | "conditional" | "not-stable" | null;
  evaluator?: string;
  evaluationDate?: string;
  conditionDescription?: string;
  loadLimit?: string;
  reinspectionDate?: string;
  instabilityReason?: string;
  recommendedAction?: string;
}> = {
  "RCK-A-001": {
    status: "not-stable",
    evaluator: "Inspector1",
    evaluationDate: "08 Mar 2026",
    instabilityReason: "Severe upright deformation detected.",
    recommendedAction: "Rack must remain out of service until repaired.",
  },
  "RCK-A-002": {
    status: "conditional",
    evaluator: "Inspector2",
    evaluationDate: "07 Mar 2026",
    conditionDescription: "Rack can operate at reduced load until beam replacement.",
    loadLimit: "70",
    reinspectionDate: "20 Mar 2026",
  },
  "RCK-A-003": {
    status: "stable",
    evaluator: "Inspector3",
    evaluationDate: "09 Mar 2026",
  },
  "RCK-A-004": {
    status: "conditional",
    evaluator: "Inspector7",
    evaluationDate: "09 Mar 2026",
    conditionDescription: "Minor beam damage observed. Reduce loading until repair.",
    loadLimit: "65",
    reinspectionDate: "18 Mar 2026",
  },
  "RCK-A-005": {
    status: "stable",
    evaluator: "Inspector8",
    evaluationDate: "10 Mar 2026",
  },
  "RCK-B-001": {
    status: "not-stable",
    evaluator: "Inspector4",
    evaluationDate: "06 Mar 2026",
    instabilityReason: "Critical structural damage to upright frame.",
    recommendedAction: "Immediate decommission required until structural repairs completed.",
  },
  "RCK-B-002": {
    status: "stable",
    evaluator: "Inspector5",
    evaluationDate: "10 Mar 2026",
  },
  "RCK-B-003": {
    status: "not-stable",
    evaluator: "Inspector9",
    evaluationDate: "05 Mar 2026",
    instabilityReason: "Multiple beam connections showing signs of failure.",
    recommendedAction: "Do not load until all connections are replaced and re-inspected.",
  },
  "RCK-B-004": {
    status: "stable",
    evaluator: "Inspector10",
    evaluationDate: "08 Mar 2026",
  },
  "RCK-C-001": {
    status: null,
    // Not yet evaluated
  },
};

export function StabilityDetail() {
  const sidebar = useSidebar();
  const { stabilityId } = useParams<{ stabilityId: string }>();
  const [selectedObservation, setSelectedObservation] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  
  // Panel state management
  const [activePanelType, setActivePanelType] = useState<PanelType>("stability");
  
  // Load rack-specific data
  const rackData = mockRackStabilityData[stabilityId || ""] || { status: null };
  
  // Debug logging
  console.log("Stability ID (Rack ID):", stabilityId);
  console.log("Rack Data:", rackData);
  
  // Rack status state management
  const [currentStatus, setCurrentStatus] = useState<"stable" | "conditional" | "not-stable" | null>(rackData.status);
  const [selectedStatus, setSelectedStatus] = useState<"stable" | "conditional" | "not-stable" | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false);
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  
  // Evaluation metadata
  const [evaluatorName, setEvaluatorName] = useState<string>(rackData.evaluator || "John Martinez");
  const [evaluationDate, setEvaluationDate] = useState<string>(rackData.evaluationDate || "13 Mar 2026");
  
  // Conditional form state
  const [conditionDescription, setConditionDescription] = useState(rackData.conditionDescription || "");
  const [loadLimit, setLoadLimit] = useState(rackData.loadLimit || "");
  const [reinspectionDate, setReinspectionDate] = useState<Date | undefined>(undefined);
  
  // Not Stable form state
  const [instabilityReason, setInstabilityReason] = useState(rackData.instabilityReason || "");
  const [recommendedAction, setRecommendedAction] = useState(rackData.recommendedAction || "");
  
  const observationRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (sidebar) {
      sidebar.setSubPageTitle(`Stability — ${stabilityId || "Unknown Rack"}`);
    }
  }, [sidebar, stabilityId]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (stabilityId) {
      const savedRack = getRackById(stabilityId);
      if (savedRack) {
        // Map storage status to local status type
        const statusMap: Record<ImportedStabilityStatus, "stable" | "conditional" | "not-stable" | null> = {
          "Stable": "stable",
          "Conditional": "conditional",
          "Not Stable": "not-stable",
          "Not Evaluated": null
        };
        
        const mappedStatus = statusMap[savedRack.status];
        setCurrentStatus(mappedStatus);
        
        if (savedRack.evaluatedBy) {
          setEvaluatorName(savedRack.evaluatedBy);
        }
        if (savedRack.evaluatedOn) {
          setEvaluationDate(savedRack.evaluatedOn);
        }
        if (savedRack.conditionDescription) {
          setConditionDescription(savedRack.conditionDescription);
        }
        if (savedRack.instabilityReason) {
          setInstabilityReason(savedRack.instabilityReason);
        }
        if (savedRack.recommendedAction) {
          setRecommendedAction(savedRack.recommendedAction);
        }
      }
    }
  }, [stabilityId]);

  // Initialize selectedStatus when currentStatus changes
  useEffect(() => {
    if (currentStatus !== null) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus]);

  const handlePanelIconClick = (panelType: PanelType) => {
    if (activePanelType === panelType) {
      setActivePanelType(null);
    } else {
      setActivePanelType(panelType);
    }
  };

  const handlePinClick = (pinId: string) => {
    const pin = mockPins.find((p) => p.id === pinId);
    if (pin) {
      setSelectedObservation(pin.observationId);
      // Open observations panel and scroll
      setActivePanelType("observations");
      setTimeout(() => {
        const ref = observationRefs.current[pin.observationId];
        if (ref) {
          ref.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const handleObservationClick = (observationId: string) => {
    setSelectedObservation(observationId === selectedObservation ? null : observationId);
  };

  const getSeverityColor = (severity: IssueSeverity) => {
    switch (severity) {
      case "critical":
        return "var(--destructive)";
      case "warning":
        return "var(--warning)";
      case "minor":
        return "var(--success)";
    }
  };

  const getSeverityBgColor = (severity: IssueSeverity) => {
    switch (severity) {
      case "critical":
        return "rgba(225, 29, 72, 0.10)";
      case "warning":
        return "rgba(245, 158, 11, 0.10)";
      case "minor":
        return "rgba(22, 163, 74, 0.10)";
    }
  };

  const getPinGlowColor = (severity: IssueSeverity) => {
    switch (severity) {
      case "critical":
        return "rgba(225, 29, 72, 0.10)";
      case "warning":
        return "rgba(245, 158, 11, 0.10)";
      case "minor":
        return "rgba(22, 163, 74, 0.10)";
    }
  };

  const criticalCount = mockObservations.filter(obs => obs.severity === "critical").length;

  const getStatusDisplayName = (status?: "stable" | "conditional" | "not-stable" | null) => {
    const statusToUse = status !== undefined ? status : selectedStatus;
    switch (statusToUse) {
      case "stable":
        return "Stable";
      case "conditional":
        return "Conditional";
      case "not-stable":
        return "Not Stable";
      default:
        return "";
    }
  };

  const getStatusColor = (status: "stable" | "conditional" | "not-stable") => {
    switch (status) {
      case "stable":
        return "var(--success)";
      case "conditional":
        return "var(--warning)";
      case "not-stable":
        return "var(--destructive)";
    }
  };

  const getStatusBgColor = (status: "stable" | "conditional" | "not-stable") => {
    switch (status) {
      case "stable":
        return "rgba(22, 163, 74, 0.10)";
      case "conditional":
        return "rgba(245, 158, 11, 0.10)";
      case "not-stable":
        return "rgba(225, 29, 72, 0.10)";
    }
  };

  // Button enable logic
  const isSaveButtonEnabled = currentStatus === null 
    ? (selectedStatus !== null && 
       (selectedStatus === "stable" || 
        (selectedStatus === "conditional" && conditionDescription.trim() !== "") ||
        (selectedStatus === "not-stable" && instabilityReason.trim() !== "")))
    : (selectedStatus !== null && selectedStatus !== currentStatus && 
       (selectedStatus === "stable" || 
        (selectedStatus === "conditional" && conditionDescription.trim() !== "") ||
        (selectedStatus === "not-stable" && instabilityReason.trim() !== "")));

  const handleSaveClick = () => {
    if (!selectedStatus) return;
    setConfirmModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (!selectedStatus || !stabilityId) return;
    
    console.log("Saving rack status:", selectedStatus);
    const previousStatus = currentStatus;
    setCurrentStatus(selectedStatus);
    setConfirmModalOpen(false);
    setEvaluationModalOpen(false);
    setIsOverriding(false);
    
    // Update evaluation metadata
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
    setEvaluationDate(formattedDate);
    
    // Map local status type to storage status type
    const statusMap: Record<string, ImportedStabilityStatus> = {
      "stable": "Stable",
      "conditional": "Conditional",
      "not-stable": "Not Stable",
      "not-evaluated": "Not Evaluated"
    };
    
    const mappedStatus = statusMap[selectedStatus] || "Not Evaluated";
    
    // Save to localStorage via utility
    updateRackStatus(
      stabilityId,
      mappedStatus,
      evaluatorName,
      formattedDate,
      selectedStatus === "conditional" ? conditionDescription : undefined,
      selectedStatus === "not-stable" ? instabilityReason : undefined,
      selectedStatus === "not-stable" ? recommendedAction : undefined
    );
    
    console.log(`🚀 Dispatching stabilityDataUpdated event for rack ${stabilityId}`);
    // Dispatch custom event to notify other components of the update
    window.dispatchEvent(new CustomEvent("stabilityDataUpdated"));
    
    // Show appropriate toast message
    if (previousStatus === null) {
      toast.success("Rack stability status updated successfully", {
        description: "Evaluation has been recorded in the audit log",
      });
    } else {
      toast.success("Rack stability status updated successfully", {
        description: "Evaluation has been recorded in the audit log",
      });
    }
  };

  const handleOpenEvaluationModal = () => {
    setEvaluationModalOpen(true);
    if (currentStatus) {
      setIsOverriding(true);
      setSelectedStatus(currentStatus);
    } else {
      setSelectedStatus(null);
    }
  };

  const handleCloseEvaluationModal = () => {
    setEvaluationModalOpen(false);
    if (isOverriding) {
      setIsOverriding(false);
      setSelectedStatus(null);
      setConditionDescription(rackData.conditionDescription || "");
      setLoadLimit(rackData.loadLimit || "");
      setReinspectionDate(undefined);
      setInstabilityReason(rackData.instabilityReason || "");
      setRecommendedAction(rackData.recommendedAction || "");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >


      {/* MAIN WORKSPACE - Canvas + Floating Panel + Icon Toolbar */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#F9FAFB",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* 3D RACK CANVAS */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="relative" style={{ transform: "scale(1.2)" }}>
            {/* SVG Rack Structure */}
            <svg
              width="600"
              height="400"
              viewBox="0 0 600 400"
              className="relative z-10"
            >
              {/* Rack Uprights - Vertical Columns */}
              <line x1="100" y1="100" x2="100" y2="350" stroke="var(--foreground)" strokeWidth="3" opacity="0.8" />
              <line x1="220" y1="100" x2="220" y2="350" stroke="var(--foreground)" strokeWidth="3" opacity="0.8" />
              <line x1="340" y1="100" x2="340" y2="350" stroke="var(--foreground)" strokeWidth="3" opacity="0.8" />
              <line x1="460" y1="100" x2="460" y2="350" stroke="var(--foreground)" strokeWidth="3" opacity="0.8" />

              {/* Horizontal Beams */}
              <line x1="100" y1="160" x2="460" y2="160" stroke="var(--foreground)" strokeWidth="2" opacity="0.6" />
              <line x1="100" y1="240" x2="460" y2="240" stroke="var(--foreground)" strokeWidth="2" opacity="0.6" />
              <line x1="100" y1="320" x2="460" y2="320" stroke="var(--foreground)" strokeWidth="2" opacity="0.6" />

              {/* Base Plates */}
              <rect x="90" y="350" width="20" height="8" fill="var(--foreground)" opacity="0.7" />
              <rect x="210" y="350" width="20" height="8" fill="var(--foreground)" opacity="0.7" />
              <rect x="330" y="350" width="20" height="8" fill="var(--foreground)" opacity="0.7" />
              <rect x="450" y="350" width="20" height="8" fill="var(--foreground)" opacity="0.7" />

              {/* Zones */}
              {mockZones.map((zone) => (
                <g key={zone.id}>
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    fill="none"
                    stroke={zone.state === "blocked" ? "var(--destructive)" : "var(--warning)"}
                    strokeWidth="3.75"
                    strokeDasharray={zone.state === "restricted" ? "10 5" : "0"}
                    opacity="0.8"
                  />
                  {zone.label && (
                    <text
                      x={zone.x + zone.width / 2}
                      y={zone.y + zone.height / 2 + 5}
                      textAnchor="middle"
                      fill={zone.state === "blocked" ? "var(--destructive)" : "var(--warning)"}
                      fontSize="15"
                      fontWeight="400"
                    >
                      {zone.label}
                    </text>
                  )}
                </g>
              ))}

              {/* Issue Pins */}
              {mockPins.map((pin) => {
                const isHovered = hoveredPin === pin.id;
                const isObservationSelected = selectedObservation === pin.observationId;
                return (
                  <g
                    key={pin.id}
                    onClick={() => handlePinClick(pin.id)}
                    onMouseEnter={() => setHoveredPin(pin.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    style={{ cursor: "pointer" }}
                    opacity={isObservationSelected ? 1 : isHovered ? 1 : 0.9}
                  >
                    {/* Glow ring for selected pins */}
                    {isObservationSelected && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={18}
                        fill="none"
                        stroke={getSeverityColor(pin.severity)}
                        strokeWidth="2"
                        opacity="0.4"
                      />
                    )}
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={isHovered || isObservationSelected ? 14 : 10}
                      fill={getPinGlowColor(pin.severity)}
                      opacity="0.3"
                    />
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={isHovered || isObservationSelected ? 10 : 8}
                      fill={getSeverityColor(pin.severity)}
                      stroke="white"
                      strokeWidth="2.5"
                      style={{
                        transform: isObservationSelected ? "scale(1.1)" : "scale(1)",
                        transformOrigin: `${pin.x}px ${pin.y}px`,
                        transition: "all 0.2s",
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Rack Identifier and Status */}
            <div className="mt-4" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
                <p
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--font-weight-semi-bold)",
                    color: "var(--foreground)",
                    margin: 0,
                  }}
                >
                  {stabilityId || "CN-L1 — Rack 05"}
                </p>
                {currentStatus && (
                  <div
                    style={{
                      height: "24px",
                      padding: "0 10px",
                      borderRadius: "9999px",
                      display: "inline-flex",
                      alignItems: "center",
                      backgroundColor: getStatusBgColor(currentStatus),
                      border: `1px solid ${getStatusColor(currentStatus)}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        color: getStatusColor(currentStatus),
                      }}
                    >
                      {getStatusDisplayName(currentStatus)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ICON TOOLBAR - Right Edge */}
        <div
          style={{
            position: "absolute",
            right: "24px",
            top: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-2)",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => handlePanelIconClick("stability")}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius)",
              backgroundColor: activePanelType === "stability" ? "var(--primary)" : "var(--card)",
              border: `1px solid ${activePanelType === "stability" ? "var(--primary)" : "var(--border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            title="Rack Stability"
          >
            <ShieldCheck
              size={18}
              color={activePanelType === "stability" ? "white" : "var(--foreground)"}
            />
          </button>
          <button
            onClick={() => handlePanelIconClick("rackInfo")}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius)",
              backgroundColor: activePanelType === "rackInfo" ? "var(--primary)" : "var(--card)",
              border: `1px solid ${activePanelType === "rackInfo" ? "var(--primary)" : "var(--border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            title="Rack Information"
          >
            <Info
              size={18}
              color={activePanelType === "rackInfo" ? "white" : "var(--foreground)"}
            />
          </button>
          <button
            onClick={() => handlePanelIconClick("insights")}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius)",
              backgroundColor: activePanelType === "insights" ? "var(--primary)" : "var(--card)",
              border: `1px solid ${activePanelType === "insights" ? "var(--primary)" : "var(--border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            title="Stability Insights"
          >
            <BarChart3
              size={18}
              color={activePanelType === "insights" ? "white" : "var(--foreground)"}
            />
          </button>
          <button
            onClick={() => handlePanelIconClick("observations")}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius)",
              backgroundColor: activePanelType === "observations" ? "var(--primary)" : "var(--card)",
              border: `1px solid ${activePanelType === "observations" ? "var(--primary)" : "var(--border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            title="Observations"
          >
            <AlertTriangle
              size={18}
              color={activePanelType === "observations" ? "white" : "var(--foreground)"}
            />
          </button>
        </div>

        {/* FLOATING CONTEXT PANEL */}
        {activePanelType && (
          <div
            style={{
              position: "absolute",
              right: "72px",
              top: "24px",
              bottom: "24px",
              width: "330px",
              backgroundColor: "var(--card)",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 9,
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                padding: "var(--spacing-5)",
                borderBottom: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "var(--font-weight-semi-bold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-1)",
                }}
              >
                {activePanelType === "observations" && "Observations"}
                {activePanelType === "insights" && "Rack Stability Indicators"}
                {activePanelType === "rackInfo" && "Rack Information"}
                {activePanelType === "stability" && "Rack Stability"}
              </h3>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--muted-foreground)",
                  margin: 0,
                }}
              >
                {activePanelType === "observations" && `${mockObservations.length} findings detected`}
                {activePanelType === "insights" && "Inspection severity by category"}
                {activePanelType === "rackInfo" && "Configuration details"}
                {activePanelType === "stability" && (currentStatus ? "Evaluation status" : "Not yet evaluated")}
              </p>
            </div>

            {/* Panel Content - Scrollable */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "var(--spacing-4)",
              }}
            >
              {/* Observations Panel */}
              {activePanelType === "observations" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                  {mockObservations.map((observation) => {
                    const isSelected = selectedObservation === observation.id;
                    return (
                      <div
                        key={observation.id}
                        ref={(el) => {
                          observationRefs.current[observation.id] = el;
                        }}
                        onClick={() => handleObservationClick(observation.id)}
                        style={{
                          borderRadius: "var(--radius)",
                          padding: "var(--spacing-4)",
                          border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                          backgroundColor: isSelected ? "rgba(37, 99, 235, 0.05)" : "var(--background)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {/* Observation Header */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "var(--spacing-2)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--primary)",
                            }}
                          >
                            #{observation.id}
                          </span>
                          <div
                            style={{
                              padding: "4px 12px",
                              borderRadius: "9999px",
                              backgroundColor: getSeverityBgColor(observation.severity),
                              color: getSeverityColor(observation.severity),
                              fontSize: "10px",
                              fontWeight: "var(--font-weight-medium)",
                            }}
                          >
                            {observation.severity.charAt(0).toUpperCase() + observation.severity.slice(1)}
                          </div>
                        </div>

                        {/* Location */}
                        <p
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--muted-foreground)",
                            marginBottom: "var(--spacing-2)",
                          }}
                        >
                          📍 {observation.location}
                        </p>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--foreground)",
                            marginBottom: "var(--spacing-2)",
                          }}
                        >
                          {observation.description}
                        </p>

                        {/* Inspector and Timestamp */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "var(--text-xs)",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          <span>{observation.inspector}</span>
                          <span>{observation.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Insights Panel */}
              {activePanelType === "insights" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
                  {/* Top Metrics - Red, Amber, Green */}
                  <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
                    {/* Red */}
                    <div
                      style={{
                        flex: 1,
                        padding: "19px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--background)",
                      }}
                    >
                      <p style={{ fontSize: "24px", fontWeight: "var(--font-weight-bold)", color: "var(--foreground)", margin: 0, lineHeight: "1", marginBottom: "8px" }}>
                        {criticalCount}
                      </p>
                      <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--destructive)", margin: 0, lineHeight: "1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        RED
                      </p>
                    </div>

                    {/* Amber */}
                    <div
                      style={{
                        flex: 1,
                        padding: "19px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--background)",
                      }}
                    >
                      <p style={{ fontSize: "24px", fontWeight: "var(--font-weight-bold)", color: "var(--foreground)", margin: 0, lineHeight: "1", marginBottom: "8px" }}>
                        {mockObservations.filter(obs => obs.severity === "warning").length}
                      </p>
                      <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--warning)", margin: 0, lineHeight: "1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        AMBER
                      </p>
                    </div>

                    {/* Green */}
                    <div
                      style={{
                        flex: 1,
                        padding: "19px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--background)",
                      }}
                    >
                      <p style={{ fontSize: "24px", fontWeight: "var(--font-weight-bold)", color: "var(--foreground)", margin: 0, lineHeight: "1", marginBottom: "8px" }}>
                        {mockObservations.filter(obs => obs.severity === "minor").length}
                      </p>
                      <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--success)", margin: 0, lineHeight: "1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        GREEN
                      </p>
                    </div>
                  </div>

                  {/* Installation Card */}
                  <div 
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "12px",
                      padding: "var(--spacing-4)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--background)",
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)", margin: 0 }}>
                        Installation
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <p style={{ fontSize: "10px", fontWeight: "500", color: "var(--foreground)", margin: 0 }}>
                          Total
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>
                          {mockObservations.length}
                        </p>
                      </div>
                    </div>

                    {/* Bar Visualization */}
                    <div style={{ display: "flex", gap: "2px", height: "18px" }}>
                      {(() => {
                        const totalSegments = 30;
                        const redCount = criticalCount;
                        const amberCount = mockObservations.filter(obs => obs.severity === "warning").length;
                        const greenCount = mockObservations.filter(obs => obs.severity === "minor").length;
                        const total = mockObservations.length;
                        
                        const redSegments = Math.round((redCount / total) * totalSegments);
                        const amberSegments = Math.round((amberCount / total) * totalSegments);
                        const greenSegments = totalSegments - redSegments - amberSegments;
                        
                        return Array.from({ length: totalSegments }).map((_, i) => {
                          let color;
                          if (i < redSegments) {
                            color = "var(--destructive)";
                          } else if (i < redSegments + amberSegments) {
                            color = "var(--warning)";
                          } else {
                            color = "var(--success)";
                          }
                          
                          return (
                            <div
                              key={i}
                              style={{
                                flex: "1 0 0",
                                minWidth: "1px",
                                height: "100%",
                                backgroundColor: color,
                              }}
                            />
                          );
                        });
                      })()}
                    </div>

                    {/* Legend */}
                    <div style={{ display: "flex", gap: "86px", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--destructive)" }} />
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
                          {criticalCount}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--warning)" }} />
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
                          {mockObservations.filter(obs => obs.severity === "warning").length}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--success)" }} />
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
                          {mockObservations.filter(obs => obs.severity === "minor").length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Design Discrepancy Card */}
                  <div 
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "12px",
                      padding: "var(--spacing-4)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--background)",
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)", margin: 0 }}>
                        Design Discrepancy
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <p style={{ fontSize: "10px", fontWeight: "500", color: "var(--foreground)", margin: 0 }}>
                          Total
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>
                          {mockObservations.length}
                        </p>
                      </div>
                    </div>

                    {/* Bar Visualization */}
                    <div style={{ display: "flex", gap: "2px", height: "18px" }}>
                      {(() => {
                        const totalSegments = 30;
                        const redCount = criticalCount;
                        const amberCount = mockObservations.filter(obs => obs.severity === "warning").length;
                        const greenCount = mockObservations.filter(obs => obs.severity === "minor").length;
                        const total = mockObservations.length;
                        
                        const redSegments = Math.round((redCount / total) * totalSegments);
                        const amberSegments = Math.round((amberCount / total) * totalSegments);
                        const greenSegments = totalSegments - redSegments - amberSegments;
                        
                        return Array.from({ length: totalSegments }).map((_, i) => {
                          let color;
                          if (i < redSegments) {
                            color = "var(--destructive)";
                          } else if (i < redSegments + amberSegments) {
                            color = "var(--warning)";
                          } else {
                            color = "var(--success)";
                          }
                          
                          return (
                            <div
                              key={`dd-${i}`}
                              style={{
                                flex: "1 0 0",
                                minWidth: "1px",
                                height: "100%",
                                backgroundColor: color,
                              }}
                            />
                          );
                        });
                      })()}
                    </div>

                    {/* Legend */}
                    <div style={{ display: "flex", gap: "86px", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--destructive)" }} />
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
                          {criticalCount}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--warning)" }} />
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
                          {mockObservations.filter(obs => obs.severity === "warning").length}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--success)" }} />
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
                          {mockObservations.filter(obs => obs.severity === "minor").length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Operation & Maintenance Card */}
                  <div 
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "12px",
                      padding: "var(--spacing-4)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--background)",
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)", margin: 0 }}>
                        Operation & Maintenance
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <p style={{ fontSize: "10px", fontWeight: "500", color: "var(--foreground)", margin: 0 }}>
                          Total
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>
                          {mockObservations.length}
                        </p>
                      </div>
                    </div>

                    {/* Bar Visualization */}
                    <div style={{ display: "flex", gap: "2px", height: "18px" }}>
                      {(() => {
                        const totalSegments = 30;
                        const redCount = criticalCount;
                        const amberCount = mockObservations.filter(obs => obs.severity === "warning").length;
                        const greenCount = mockObservations.filter(obs => obs.severity === "minor").length;
                        const total = mockObservations.length;
                        
                        const redSegments = Math.round((redCount / total) * totalSegments);
                        const amberSegments = Math.round((amberCount / total) * totalSegments);
                        const greenSegments = totalSegments - redSegments - amberSegments;
                        
                        return Array.from({ length: totalSegments }).map((_, i) => {
                          let color;
                          if (i < redSegments) {
                            color = "var(--destructive)";
                          } else if (i < redSegments + amberSegments) {
                            color = "var(--warning)";
                          } else {
                            color = "var(--success)";
                          }
                          
                          return (
                            <div
                              key={`om-${i}`}
                              style={{
                                flex: "1 0 0",
                                minWidth: "1px",
                                height: "100%",
                                backgroundColor: color,
                              }}
                            />
                          );
                        });
                      })()}
                    </div>

                    {/* Legend */}
                    <div style={{ display: "flex", gap: "86px", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--destructive)" }} />
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
                          {criticalCount}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--warning)" }} />
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
                          {mockObservations.filter(obs => obs.severity === "warning").length}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--success)" }} />
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)", margin: 0 }}>
                          {mockObservations.filter(obs => obs.severity === "minor").length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rack Info Panel */}
              {activePanelType === "rackInfo" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Stability Status Section */}
                  {currentStatus && (
                    <>


                    </>
                  )}
                  
                  {/* Rack ID */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                      Rack ID
                    </p>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0 }}>
                      CN-L1
                    </p>
                  </div>

                  {/* Location */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                      Location
                    </p>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0 }}>
                      Aisle 3 Bay 5
                    </p>
                  </div>

                  {/* Rack Type */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                      Rack Type
                    </p>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0 }}>
                      Selective
                    </p>
                  </div>

                  {/* Height */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                      Height
                    </p>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0 }}>
                      9m
                    </p>
                  </div>

                  {/* Capacity */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                      Capacity
                    </p>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0 }}>
                      1200kg
                    </p>
                  </div>
                </div>
              )}

              {/* Stability Panel */}
              {activePanelType === "stability" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
                  {currentStatus ? (
                    <>
                      {/* Current Status Section */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                        <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0, fontWeight: "var(--font-weight-medium)" }}>
                          Current Status
                        </p>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px var(--spacing-3)",
                            backgroundColor: currentStatus === "stable" ? "rgba(34, 197, 94, 0.1)" : currentStatus === "conditional" ? "rgba(251, 191, 36, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            border: `1px solid ${currentStatus === "stable" ? "var(--success)" : currentStatus === "conditional" ? "var(--warning)" : "var(--destructive)"}`,
                            borderRadius: "var(--radius)",
                            width: "fit-content",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-semi-bold)",
                              color: currentStatus === "stable" ? "var(--success)" : currentStatus === "conditional" ? "var(--warning)" : "var(--destructive)",
                            }}
                          >
                            {currentStatus === "stable" ? "Stable" : currentStatus === "conditional" ? "Conditional" : "Not Stable"}
                          </span>
                        </div>
                        
                        {/* Status Explanation */}
                        <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0, lineHeight: "1.5" }}>
                          {currentStatus === "stable" && "Rack meets all safety requirements."}
                          {currentStatus === "conditional" && "Rack can operate with defined restrictions."}
                          {currentStatus === "not-stable" && "Rack is unsafe and must not be used until repaired."}
                        </p>
                      </div>

                      {/* Evaluator Info */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                            Evaluated by
                          </p>
                          <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0 }}>
                            {rackData.evaluator || "John Martinez"}
                          </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                            Evaluated on
                          </p>
                          <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0 }}>
                            {rackData.evaluationDate || "13 Mar 2026"}
                          </p>
                        </div>
                      </div>

                      {/* Stable - No additional details needed */}
                      {currentStatus === "stable" && (
                        <></>
                      )}

                      {/* Conditional Details */}
                      {currentStatus === "conditional" && (
                        <>
                          <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "var(--spacing-2) 0" }} />
                          
                          {rackData.conditionDescription && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                              <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0, fontWeight: "var(--font-weight-medium)" }}>
                                Condition Description
                              </p>
                              <p style={{ fontSize: "var(--text-sm)", color: "var(--foreground)", margin: 0, lineHeight: "1.5" }}>
                                {rackData.conditionDescription}
                              </p>
                            </div>
                          )}

                          {rackData.loadLimit && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                                Allowed Load Limit
                              </p>
                              <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0 }}>
                                {rackData.loadLimit}%
                              </p>
                            </div>
                          )}

                          {rackData.reinspectionDate && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                                Reinspection Date
                              </p>
                              <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0 }}>
                                {rackData.reinspectionDate}
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {/* Not Stable Details */}
                      {currentStatus === "not-stable" && (
                        <>
                          <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "var(--spacing-2) 0" }} />
                          
                          {rackData.instabilityReason && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                              <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0, fontWeight: "var(--font-weight-medium)" }}>
                                Reason for Instability
                              </p>
                              <p style={{ fontSize: "var(--text-sm)", color: "var(--foreground)", margin: 0, lineHeight: "1.5" }}>
                                {rackData.instabilityReason}
                              </p>
                            </div>
                          )}

                          {rackData.recommendedAction && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                              <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0, fontWeight: "var(--font-weight-medium)" }}>
                                Recommended Action
                              </p>
                              <p style={{ fontSize: "var(--text-sm)", color: "var(--foreground)", margin: 0, lineHeight: "1.5" }}>
                                {rackData.recommendedAction}
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {/* Override Button */}
                      <div style={{ marginTop: "var(--spacing-2)" }}>
                        <button
                          onClick={handleOpenEvaluationModal}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-3)",
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                            border: "none",
                            borderRadius: "var(--radius)",
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          Override Status
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Not Evaluated State */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                        <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0, fontWeight: "var(--font-weight-medium)" }}>
                          Status
                        </p>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px var(--spacing-3)",
                            backgroundColor: "var(--muted)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius)",
                            width: "fit-content",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-semi-bold)",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            Not Evaluated
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: "var(--text-sm)", color: "var(--muted-foreground)", margin: 0, lineHeight: "1.5" }}>
                        This rack has not yet been assessed for stability. Review inspection findings and assign a stability status.
                      </p>

                      {/* Evaluate Button */}
                      <div style={{ marginTop: "var(--spacing-2)" }}>
                        <button
                          onClick={handleOpenEvaluationModal}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-3)",
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                            border: "none",
                            borderRadius: "var(--radius)",
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          Evaluate Stability
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* EVALUATION MODAL */}
      <Dialog open={evaluationModalOpen} onOpenChange={(open) => {
        if (!open) handleCloseEvaluationModal();
        else setEvaluationModalOpen(open);
      }}>
        <DialogContent 
          className="bg-[var(--card)] border-[var(--border)] shadow-none max-w-[680px]"
          style={{
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]" style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semi-bold)" }}>
              Evaluate Rack Stability
            </DialogTitle>
            <DialogDescription className="text-[var(--muted-foreground)]" style={{ fontSize: "var(--text-sm)" }}>
              Assess the structural stability of this rack based on inspection findings.
            </DialogDescription>
          </DialogHeader>

          <div style={{ flex: 1, overflowY: "auto", padding: "var(--spacing-2) 0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
              {/* Status Selection Header */}
              <div>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground)",
                  }}
                >
                  Set Rack Status
                </span>
              </div>

              {/* Status Selector Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
                <button
                  onClick={() => setSelectedStatus("stable")}
                  style={{
                    height: "var(--input-height)",
                    padding: "0 var(--spacing-4)",
                    borderRadius: "var(--radius)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    backgroundColor: selectedStatus === "stable" ? "var(--success)" : "var(--background)",
                    color: selectedStatus === "stable" ? "white" : "var(--foreground)",
                    border: `1px solid ${selectedStatus === "stable" ? "var(--success)" : "var(--border)"}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Stable
                </button>
                <button
                  onClick={() => setSelectedStatus("conditional")}
                  style={{
                    height: "var(--input-height)",
                    padding: "0 var(--spacing-4)",
                    borderRadius: "var(--radius)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    backgroundColor: selectedStatus === "conditional" ? "var(--warning)" : "var(--background)",
                    color: selectedStatus === "conditional" ? "white" : "var(--foreground)",
                    border: `1px solid ${selectedStatus === "conditional" ? "var(--warning)" : "var(--border)"}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Conditional
                </button>
                <button
                  onClick={() => setSelectedStatus("not-stable")}
                  style={{
                    height: "var(--input-height)",
                    padding: "0 var(--spacing-4)",
                    borderRadius: "var(--radius)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    backgroundColor: selectedStatus === "not-stable" ? "var(--destructive)" : "var(--background)",
                    color: selectedStatus === "not-stable" ? "white" : "var(--foreground)",
                    border: `1px solid ${selectedStatus === "not-stable" ? "var(--destructive)" : "var(--border)"}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Not Stable
                </button>
              </div>

              {/* Conditional Form */}
              {selectedStatus === "conditional" && (
                <div style={{ padding: "var(--spacing-4)", borderRadius: "var(--radius)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                  <div>
                    <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)", margin: 0, marginBottom: "2px" }}>
                      Conditional Stability Requirements
                    </h4>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                Define operational restrictions for this rack
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
                <label
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground)",
                  }}
                >
                  Condition Description <span style={{ color: "var(--destructive)" }}>*</span>
                </label>
                <Textarea
                  value={conditionDescription}
                  onChange={(e) => setConditionDescription(e.target.value)}
                  placeholder="Rack can operate at reduced load until damaged beam is replaced."
                  className="resize-vertical"
                  style={{
                    minHeight: "60px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-3)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
                  <label
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--foreground)",
                    }}
                  >
                    Allowed Load Limit
                  </label>
                  <input
                    type="text"
                    value={loadLimit}
                    onChange={(e) => setLoadLimit(e.target.value)}
                    style={{
                      height: "var(--input-height)",
                      padding: "0 var(--spacing-2)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      fontSize: "var(--text-sm)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                    placeholder="e.g., 70%"
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
                  <label
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--foreground)",
                    }}
                  >
                    Reinspection Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        style={{
                          height: "var(--input-height)",
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reinspectionDate ? format(reinspectionDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={reinspectionDate}
                        onSelect={setReinspectionDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
              </div>
            )}

            {/* Not Stable Form - Only shown when "not-stable" is selected */}
            {selectedStatus === "not-stable" && (
              <div
                style={{
                  padding: "var(--spacing-4)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-3)",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)",
                      margin: 0,
                      marginBottom: "2px",
                    }}
                  >
                    Unsafe Rack Declaration
                  </h4>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", margin: 0 }}>
                    Explain why this rack is unsafe for operation
                  </p>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
                    <label
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground)",
                      }}
                    >
                      Reason for Instability <span style={{ color: "var(--destructive)" }}>*</span>
                    </label>
                    <Textarea
                      value={instabilityReason}
                      onChange={(e) => setInstabilityReason(e.target.value)}
                      placeholder="Describe the structural issue causing instability"
                      className="resize-vertical"
                      style={{
                        minHeight: "80px",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
                    <label
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground)",
                      }}
                    >
                      Recommended Action
                    </label>
                    <Textarea
                      value={recommendedAction}
                      onChange={(e) => setRecommendedAction(e.target.value)}
                      placeholder="Suggested repair or corrective action"
                      className="resize-vertical"
                      style={{
                        minHeight: "80px",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Observations Warning */}
            {selectedStatus && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", padding: "var(--spacing-3)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--destructive)" }} />
                <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)" }}>
                  2 Critical Observations
                </span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                  ⚠ Ensure status reflects safety conditions
                </span>
              </div>
            )}
            </div>
          </div>

          <DialogFooter style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--spacing-4)" }}>
            <button
              onClick={handleCloseEvaluationModal}
              style={{
                height: "var(--input-height)",
                padding: "0 var(--spacing-4)",
                borderRadius: "var(--radius)",
                fontSize: "var(--text-sm)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              disabled={!isSaveButtonEnabled}
              style={{
                height: "var(--input-height)",
                padding: "0 var(--spacing-4)",
                borderRadius: "var(--radius)",
                fontSize: "var(--text-sm)",
                backgroundColor: isSaveButtonEnabled ? "var(--primary)" : "var(--muted)",
                color: isSaveButtonEnabled ? "white" : "var(--muted-foreground)",
                border: "none",
                cursor: isSaveButtonEnabled ? "pointer" : "not-allowed",
                opacity: isSaveButtonEnabled ? 1 : 0.6,
              }}
            >
              Save Rack Status
            </button>
          </DialogFooter>
            </DialogContent>
          </Dialog>

      {/* CONFIRMATION MODAL */}
      <AlertDialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)] shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--foreground)]">
              Confirm Stability Status Update
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted-foreground)]">
              {currentStatus === null ? (
                <>
                  You are about to mark this rack as{" "}
                  <span className="font-[var(--font-weight-medium)] text-[var(--foreground)]">
                    "{getStatusDisplayName()}"
                  </span>
                  .
                  <br /><br />
                  {selectedStatus === "not-stable" && (
                    <>This status indicates the rack is unsafe for operation.</>
                  )}
                  Please confirm that this evaluation reflects the current rack condition.
                </>
              ) : (
                <>
                  You are about to update rack status from{" "}
                  <span className="font-[var(--font-weight-medium)] text-[var(--foreground)]">
                    "{getStatusDisplayName(currentStatus)}"
                  </span>
                  {" "}to{" "}
                  <span className="font-[var(--font-weight-medium)] text-[var(--foreground)]">
                    "{getStatusDisplayName()}"
                  </span>
                  .
                  <br /><br />
                  {selectedStatus === "not-stable" && (
                    <>This status indicates the rack is unsafe for operation.<br /></>
                  )}
                  Please confirm that this evaluation reflects the current rack condition.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] shadow-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSave}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 shadow-none"
            >
              Confirm & Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}