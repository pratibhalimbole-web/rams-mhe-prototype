import React, { useState, useMemo } from "react";
import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "../../components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Pie,
  PieChart,
  Cell,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Truck,
  Activity,
  ShieldCheck,
  Wifi,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  IdCard,
  FileWarning,
  Trophy,
  Award,
  ShieldAlert,
  ClipboardCheck,
  User,
  Route,
  Package,
  Clock,
  CheckCircle2,
  Wrench,
  MinusCircle,
  RefreshCw,
  AlertCircle,
  Forklift,
} from "lucide-react";
import { MheImpactResponsibilityAnalysis } from "../../components/widgets/MheImpactResponsibilityAnalysis";
import { ImpactTrendByZoneAndMHE } from "../../components/widgets/ImpactTrendByZoneAndMHE";
import { KpiCard } from "../../components/widgets/KpiCard";
import { KpiExpandPanel } from "../../components/widgets/KpiExpandPanel";
import { MheInsightPanel } from "../../components/widgets/MheInsightPanel";
import { MachinesRequiringInspectionAttention } from "../../components/widgets/MachinesRequiringInspectionAttention";
import { CriticalIssuesBanner } from "../../components/widgets/CriticalIssuesBanner";
import { KpiCardV3 } from "../../components/widgets/v3/KpiCardV3";
import { WarrantyExpiryTableV3 } from "../../components/widgets/v3/WarrantyExpiryTableV3";
import { MonitoringCardV3 } from "../../components/widgets/v3/MonitoringCardV3";
import { MonitoringSplitCardV3 } from "../../components/widgets/v3/MonitoringSplitCardV3";
import { TopFailingPartsV3 } from "../../components/widgets/v3/TopFailingPartsV3";
import { TopMhesWithFindingsV3 } from "../../components/widgets/v3/TopMhesWithFindingsV3";

// ─── Design System Colors ────────────────────────────────────────────────────
export const COLORS = {
  noIssues: "#1B59F8",
  healthy:  "#4C7DFF",
  warning:  "#8FB2FF",
  critical: "#C9DBFF",
};

// ─── Chart Configs ───────────────────────────────────────────────────────────
export const donutChartConfig = {
  noIssues: { label: "No Issues",       color: COLORS.noIssues },
  healthy:  { label: "Healthy (Green)", color: COLORS.healthy  },
  warning:  { label: "Warning (Amber)", color: COLORS.warning  },
  critical: { label: "Critical (Red)",  color: COLORS.critical },
} satisfies ChartConfig;

export const failureChartConfig = {
  "No Issues": { label: "No Issues", color: "hsl(217, 98%, 54%)" },
  "Green":     { label: "Healthy",   color: "hsl(222, 84%, 62%)" },
  "Amber":     { label: "Warning",   color: "hsl(226, 75%, 68%)" },
  "Red":       { label: "Critical",  color: "hsl(230, 67%, 85%)" },
} satisfies ChartConfig;

// ─── Mock Data ───────────────────────────────────────────────────────────────
export const equipmentHealthDataByType: Record<string, any[]> = {
  "Overall": [
    { name: "No Issues",      value: 20, inspections: 46, parts: 16, mhe: 10 },
    { name: "Healthy (Green)", value: 12, inspections: 28, parts: 12, mhe: 8  },
    { name: "Warning (Amber)", value: 6,  inspections: 18, parts: 8,  mhe: 3  },
    { name: "Critical (Red)",  value: 4,  inspections: 12, parts: 5,  mhe: 2  },
  ],
  "Electric Forklift": [
    { name: "No Issues",      value: 8, inspections: 18, parts: 6, mhe: 4 },
    { name: "Healthy (Green)", value: 5, inspections: 12, parts: 5, mhe: 3 },
    { name: "Warning (Amber)", value: 2, inspections: 6,  parts: 3, mhe: 1 },
    { name: "Critical (Red)",  value: 1, inspections: 4,  parts: 2, mhe: 1 },
  ],
  "Reach Truck": [
    { name: "No Issues",      value: 7, inspections: 16, parts: 5, mhe: 3 },
    { name: "Healthy (Green)", value: 4, inspections: 10, parts: 4, mhe: 2 },
    { name: "Warning (Amber)", value: 2, inspections: 5,  parts: 2, mhe: 1 },
    { name: "Critical (Red)",  value: 1, inspections: 3,  parts: 1, mhe: 1 },
  ],
  "Pallet Jack": [
    { name: "No Issues",      value: 5, inspections: 12, parts: 5, mhe: 3 },
    { name: "Healthy (Green)", value: 3, inspections: 6,  parts: 3, mhe: 2 },
    { name: "Warning (Amber)", value: 2, inspections: 7,  parts: 3, mhe: 1 },
    { name: "Critical (Red)",  value: 2, inspections: 5,  parts: 2, mhe: 1 },
  ],
};

export const equipmentHealthData = equipmentHealthDataByType["Overall"];

export const componentFailureDataByType: Record<string, any[]> = {
  "Electric Forklift": [
    { part: "Hydraulics", "No Issues": 12, Green: 5, Amber: 3, Red: 2, mhe: 10 },
    { part: "Battery",    "No Issues": 14, Green: 4, Amber: 4, Red: 3, mhe: 10 },
    { part: "Fork",       "No Issues": 16, Green: 3, Amber: 2, Red: 1, mhe: 10 },
    { part: "Lights",     "No Issues": 13, Green: 5, Amber: 3, Red: 2, mhe: 10 },
  ],
  "Reach Truck": [
    { part: "Hydraulics", "No Issues": 10, Green: 4, Amber: 2, Red: 1, mhe: 8 },
    { part: "Battery",    "No Issues": 12, Green: 3, Amber: 3, Red: 2, mhe: 8 },
    { part: "Fork",       "No Issues": 14, Green: 2, Amber: 2, Red: 1, mhe: 8 },
    { part: "Lights",     "No Issues": 11, Green: 4, Amber: 2, Red: 1, mhe: 8 },
  ],
  "Pallet Jack": [
    { part: "Hydraulics", "No Issues": 8, Green: 3, Amber: 2, Red: 1, mhe: 6 },
    { part: "Battery",    "No Issues": 9, Green: 2, Amber: 2, Red: 1, mhe: 6 },
    { part: "Fork",       "No Issues": 10, Green: 2, Amber: 1, Red: 1, mhe: 6 },
    { part: "Lights",     "No Issues": 8, Green: 3, Amber: 2, Red: 1, mhe: 6 },
  ],
};

export const machinesInspectionData = [
  { mheId: "MHE-001", equipmentType: "Electric Forklift", redFindings: 2, amberFindings: 3, greenFindings: 5, parts: 10, lastInspection: "2026-04-20", part_issues: [{ part_name: "Battery", amber_count: 2, red_count: 1 }, { part_name: "Hydraulics", amber_count: 1, red_count: 1 }] },
  { mheId: "MHE-004", equipmentType: "Reach Truck", redFindings: 1, amberFindings: 2, greenFindings: 4, parts: 7,  lastInspection: "2026-04-18", part_issues: [{ part_name: "Fork", amber_count: 1, red_count: 1 }, { part_name: "Motor", amber_count: 1, red_count: 0 }] },
  { mheId: "MHE-012", equipmentType: "Electric Forklift", redFindings: 0, amberFindings: 4, greenFindings: 6, parts: 10, lastInspection: "2026-04-19", part_issues: [{ part_name: "Hydraulics", amber_count: 2, red_count: 0 }, { part_name: "Brakes", amber_count: 2, red_count: 0 }] },
  { mheId: "MHE-025", equipmentType: "Pallet Jack", redFindings: 3, amberFindings: 5, greenFindings: 2, parts: 10, lastInspection: "2026-04-15", part_issues: [{ part_name: "Transmission", amber_count: 2, red_count: 2 }, { part_name: "Battery", amber_count: 2, red_count: 1 }, { part_name: "Fork", amber_count: 1, red_count: 0 }] },
  { mheId: "MHE-031", equipmentType: "Reach Truck", redFindings: 0, amberFindings: 1, greenFindings: 8, parts: 9,  lastInspection: "2026-04-21", part_issues: [{ part_name: "Motor", amber_count: 1, red_count: 0 }] },
];

export const warrantyExpiryData = [
  { mheType: "Electric Forklift", mheId: "MHE-001", licenseExpiry: "2026-05-15", daysRemaining: 18,  status: "active"   },
  { mheType: "Reach Truck",       mheId: "MHE-002", licenseExpiry: "2026-05-05", daysRemaining: 8,   status: "expiring" },
  { mheType: "Pallet Jack",       mheId: "MHE-003", licenseExpiry: "2026-04-28", daysRemaining: 1,   status: "expiring" },
  { mheType: "Order Picker",      mheId: "MHE-004", licenseExpiry: "2026-03-10", daysRemaining: -48, status: "expired"  },
  { mheType: "Tow Tractor",       mheId: "MHE-005", licenseExpiry: "2026-06-20", daysRemaining: 54,  status: "active"   },
  { mheType: "Reach Truck",       mheId: "MHE-007", licenseExpiry: "2026-05-08", daysRemaining: 11,  status: "expiring" },
  { mheType: "Electric Forklift", mheId: "MHE-009", licenseExpiry: "2026-04-25", daysRemaining: -5,  status: "expired"  },
  { mheType: "Pallet Jack",       mheId: "MHE-011", licenseExpiry: "2026-05-02", daysRemaining: 5,   status: "expiring" },
  { mheType: "Order Picker",      mheId: "MHE-013", licenseExpiry: "2026-04-30", daysRemaining: 3,   status: "expiring" },
];

export const operatorLicenseData = [
  { operator: "Vikram Deshmukh", operatorId: "OP-001", licenseExpiry: "2026-05-10", daysRemaining: 13,  assignedMhe: "Electric Forklift", status: "active"   },
  { operator: "Priya Sharma",    operatorId: "OP-002", licenseExpiry: "2026-05-01", daysRemaining: 4,   assignedMhe: "Reach Truck",       status: "expiring" },
  { operator: "Rajesh Kumar",    operatorId: "OP-003", licenseExpiry: "2026-06-15", daysRemaining: 49,  assignedMhe: "Pallet Jack",       status: "active"   },
  { operator: "Anjali Patel",    operatorId: "OP-004", licenseExpiry: "2026-04-25", daysRemaining: -2,  assignedMhe: "Order Picker",      status: "expired"  },
  { operator: "Suresh Reddy",    operatorId: "OP-005", licenseExpiry: "2026-07-01", daysRemaining: 65,  assignedMhe: "Tow Tractor",       status: "active"   },
];

// ─── KPI Card ────────────────────────────────────────────────────────────────
export function KPICard({
  title,
  description,
  value,
  icon: Icon,
}: {
  title: string;
  description: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div style={{ border: "1px solid var(--w-border)", borderRadius: 10, padding: "14px 16px", background: "var(--w-bg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--w-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={14} strokeWidth={1.5} color="var(--w-text-4)" />
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--w-text-2)" }}>{title}</span>
      </div>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 26, fontWeight: 700, color: "var(--w-text-1)", margin: "0 0 3px", lineHeight: 1 }}>{value}</p>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-3)", margin: 0 }}>{description}</p>
    </div>
  );
}

// ─── Status Badge (guideline pill pattern) ───────────────────────────────────
export function StatusBadge({ status }: { status: "active" | "expiring" | "expired" }) {
  const cfg: Record<string, { color: string; bg: string; label: string }> = {
    active:   { color: "#16a34a", bg: "rgba(22,163,74,0.10)",  label: "Active"        },
    expiring: { color: "#d97706", bg: "rgba(217,119,6,0.10)",  label: "Expiring Soon" },
    expired:  { color: "#ef4444", bg: "rgba(239,68,68,0.10)",  label: "Expired"       },
  };
  const { color, bg, label } = cfg[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap"
      style={{ color, background: bg }}
    >
      {label}
    </span>
  );
}

// ─── License Renew Drawer Component ──────────────────────────────────────────
export function LicenseRenewDrawer({
  isOpen,
  onClose,
  mheId,
}: {
  isOpen: boolean;
  onClose: () => void;
  mheId: string | null;
}) {
  const [warrantyStatus, setWarrantyStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Form is valid when both required fields are filled
  const isFormValid = warrantyStatus && selectedDate && selectedDate > new Date();

  const handleUpdate = () => {
    if (isFormValid) {
      // Show success feedback
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 40,
          }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "480px",
          background: "#FFFFFF",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.08)",
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <h2 className="text-sm font-semibold">Edit MHE Asset</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Update asset information for {mheId}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
        >
          <div className="space-y-6">
            {/* Basic Details - Read Only */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold border-b pb-2">Basic Details</h4>
              <div className="grid gap-3">
                <div className="space-y-1">
                  <Label htmlFor="serial">MHE Serial No</Label>
                  <Input id="serial" defaultValue={mheId || ""} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="type">MHE Type</Label>
                  <Select defaultValue="forklift" disabled>
                    <SelectTrigger disabled>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forklift">Electric Forklift</SelectItem>
                      <SelectItem value="reach">Reach Truck</SelectItem>
                      <SelectItem value="pallet">Pallet Jack</SelectItem>
                      <SelectItem value="picker">Order Picker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="oem">OEM / Make</Label>
                  <Input id="oem" defaultValue="Toyota" disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="model">Model Number</Label>
                  <Input id="model" defaultValue="8FBE20" disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="year">Year of Manufacture</Label>
                  <Input id="year" type="number" defaultValue="2024" disabled />
                </div>
              </div>
            </div>

            {/* Ownership & Power - Read Only */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold border-b pb-2">Ownership & Power</h4>
              <div className="grid gap-3">
                <div className="space-y-1">
                  <Label htmlFor="ownership">Ownership Type</Label>
                  <Select defaultValue="owned" disabled>
                    <SelectTrigger disabled>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="leased">Leased</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="supplier">Supplier Name</Label>
                  <Input id="supplier" defaultValue="Toyota Material Handling" disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="power">Power Type</Label>
                  <Select defaultValue="electric" disabled>
                    <SelectTrigger disabled>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="lpg">LPG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="capacity">Load Capacity (kg)</Label>
                  <Input id="capacity" type="number" defaultValue="2000" disabled />
                </div>
              </div>
            </div>

            {/* Safety Compliance - Editable */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold border-b pb-2">Safety Compliance</h4>
              <div className="grid gap-3">
                <div className="space-y-1">
                  <Label htmlFor="warranty-status">Warranty Status *</Label>
                  <Select value={warrantyStatus} onValueChange={setWarrantyStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expiring">Expiring Soon</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="warranty-date">Warranty Expiry Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {selectedDate
                          ? selectedDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "16px 24px",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            flexShrink: 0,
            background: "var(--background)",
          }}
        >
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={!isFormValid}>
            Update Asset
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Operator License Expiry Drawer ──────────────────────────────────────────
interface OperatorInfo {
  operatorId: string;
  name: string;
  email: string;
  designation: string;
}

const mockOperators: Record<string, OperatorInfo> = {
  "OP-001": { operatorId: "OP-001", name: "Vikram Deshmukh", email: "vikram.deshmukh@company.com", designation: "Senior Forklift Operator" },
  "OP-002": { operatorId: "OP-002", name: "Priya Sharma", email: "priya.sharma@company.com", designation: "Material Handler" },
  "OP-003": { operatorId: "OP-003", name: "Rajesh Kumar", email: "rajesh.kumar@company.com", designation: "Warehouse Manager" },
  "OP-004": { operatorId: "OP-004", name: "Anjali Patel", email: "anjali.patel@company.com", designation: "Senior Operator" },
  "OP-005": { operatorId: "OP-005", name: "Suresh Reddy", email: "suresh.reddy@company.com", designation: "Equipment Handler" },
  "OP-008": { operatorId: "OP-008", name: "Rahul Sharma", email: "rahul.sharma@company.com", designation: "Forklift Operator" },
  "OP-012": { operatorId: "OP-012", name: "Priya Kumar", email: "priya.kumar@company.com", designation: "Material Handler" },
  "OP-019": { operatorId: "OP-019", name: "Vikram Singh", email: "vikram.singh@company.com", designation: "Warehouse Operator" },
  "OP-021": { operatorId: "OP-021", name: "Meera Nair", email: "meera.nair@company.com", designation: "Equipment Handler" },
  "OP-027": { operatorId: "OP-027", name: "Arjun Das", email: "arjun.das@company.com", designation: "Senior Forklift Operator" },
};

export function OperatorLicenseExpiryDrawer({
  isOpen,
  onClose,
  operatorId,
}: {
  isOpen: boolean;
  onClose: () => void;
  operatorId: string | null;
}) {
  const operator = operatorId && mockOperators[operatorId] ? mockOperators[operatorId] : null;

  const [licenseNumber, setLicenseNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [reminderDays, setReminderDays] = useState("30");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ licenseNumber?: string; expiryDate?: string }>({});
  const [showToast, setShowToast] = useState(false);

  // Reset form when drawer opens with operator
  React.useEffect(() => {
    if (isOpen && operator) {
      setLicenseNumber("");
      setExpiryDate(undefined);
      setReminderDays("30");
      setNotes("");
      setErrors({});
    }
  }, [isOpen, operator]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
    }

    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (expiryDate <= new Date()) {
      newErrors.expiryDate = "Expiry date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 2000);
    }
  };

  const isFormValid = licenseNumber.trim() && expiryDate && expiryDate > new Date();

  if (!operator) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 40,
          }}
          onClick={onClose}
        />
      )}

      {/* Drawer - Same as MHE Warranty */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "480px",
          background: "#FFFFFF",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.08)",
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <h2 className="text-sm font-semibold">Update License Expiry</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Update operator license details
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
        >
          <div className="space-y-6">
            {/* Operator Info - Read Only */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold border-b pb-2">Operator Info</h4>
              <div className="grid gap-3">
                <div className="space-y-1">
                  <Label htmlFor="op-name">Operator Name</Label>
                  <Input id="op-name" defaultValue={operator.name} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="op-id">Email / ID</Label>
                  <Input id="op-id" defaultValue={`${operator.email}`} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="op-designation">Designation</Label>
                  <Input id="op-designation" defaultValue={operator.designation} disabled />
                </div>
              </div>
            </div>

            {/* License Details - Editable */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold border-b pb-2">License Details</h4>
              <div className="grid gap-3">
                {/* License Number */}
                <div className="space-y-1">
                  <Label htmlFor="license-number">License Number</Label>
                  <Input
                    id="license-number"
                    placeholder="Enter license number"
                    value={licenseNumber}
                    onChange={(e) => {
                      setLicenseNumber(e.target.value);
                      if (errors.licenseNumber) setErrors({ ...errors, licenseNumber: undefined });
                    }}
                    autoFocus
                  />
                  {errors.licenseNumber && (
                    <p className="text-xs text-red-500">{errors.licenseNumber}</p>
                  )}
                </div>

                {/* License Expiry Date */}
                <div className="space-y-1">
                  <Label htmlFor="license-expiry">License Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {expiryDate
                          ? expiryDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={setExpiryDate}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.expiryDate && (
                    <p className="text-xs text-red-500">{errors.expiryDate}</p>
                  )}
                </div>

                {/* Reminder Before Expiry */}
                <div className="space-y-1">
                  <Label htmlFor="reminder">Reminder Before Expiry</Label>
                  <Select value={reminderDays} onValueChange={setReminderDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days before</SelectItem>
                      <SelectItem value="15">15 days before</SelectItem>
                      <SelectItem value="30">30 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    placeholder="Add remarks (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Same as MHE Warranty */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "16px 24px",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            flexShrink: 0,
            background: "var(--background)",
          }}
        >
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={!isFormValid}>
            Update License
          </Button>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            background: "#10B981",
            color: "white",
            padding: "12px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            zIndex: 60,
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
          }}
        >
          ✓ License updated successfully
        </div>
      )}
    </>
  );
}

// ─── Operational Status Layer ─────────────────────────────────────────────────
// 4 light-card operational pulse cards — Fleet Readiness · Operator Safety · Utilization · Inspection

const DSL_CARD: React.CSSProperties = {
  background: "var(--w-bg)",
  border: "1px solid var(--w-border)",
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

const DSL_DIVIDER: React.CSSProperties = {
  height: 1,
  background: "var(--w-bg-muted)",
};

type DarkBadgeVariant = "low" | "medium" | "high" | "healthy" | "warning" | "critical" | "info";

const DARK_BADGE_STYLES: Record<DarkBadgeVariant, { bg: string; text: string; border: string; label: string }> = {
  low:      { bg: "var(--w-green-bg)", text: "#16a34a", border: "var(--w-green-border)", label: "LOW RISK"    },
  medium:   { bg: "var(--w-amber-bg)", text: "#92400e", border: "var(--w-amber-border)", label: "MEDIUM RISK" },
  high:     { bg: "var(--w-red-bg)",   text: "#dc2626", border: "var(--w-red-border)",   label: "HIGH RISK"   },
  healthy:  { bg: "var(--w-green-bg)", text: "#16a34a", border: "var(--w-green-border)", label: "HEALTHY"     },
  warning:  { bg: "var(--w-amber-bg)", text: "#92400e", border: "var(--w-amber-border)", label: "WARNING"     },
  critical: { bg: "var(--w-red-bg)",   text: "#dc2626", border: "var(--w-red-border)",   label: "CRITICAL"    },
  info:     { bg: "var(--w-bg-muted)", text: "var(--w-text-4)", border: "var(--w-border)", label: "INFO"        },
};

function DarkStatusBadge({ variant }: { variant: DarkBadgeVariant }) {
  const s = DARK_BADGE_STYLES[variant];
  return (
    <span style={{
      fontFamily: "Inter, sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.05em",
      padding: "3px 7px", borderRadius: 10, whiteSpace: "nowrap" as const,
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
    }}>
      {s.label}
    </span>
  );
}

export function OperationalStatusLayer() {
  return (
    <>
      {/* ── Section label ── */}
      <div className="col-span-12">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: -2 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>
            Operational Status Layer
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--w-border)" }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)", whiteSpace: "nowrap" }}>FMS · RTSS · MEPS · IMDS</span>
        </div>
      </div>

      {/* ══ CARD 1 — Fleet Operational Readiness ══════════════════════════════ */}
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div style={{ ...DSL_CARD }}>

          {/* Header */}
          <div style={{ padding: "16px 18px 13px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 3px", lineHeight: "17px" }}>Fleet Operational Readiness</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", margin: 0, lineHeight: "14px" }}>Operational availability of active warehouse fleet</p>
          </div>
          <div style={{ ...DSL_DIVIDER }} />

          {/* 3-metric icon row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", padding: "18px 0 16px" }}>
            {([
              { label: "ACTIVE",      value: "42", color: "#1b59f8", bg: "var(--w-blue-bg)",  icon: CheckCircle2 },
              { label: "READY",       value: "36", color: "#16a34a", bg: "var(--w-green-bg)", icon: ShieldCheck  },
              { label: "MAINTENANCE", value: "06", color: "#dc2626", bg: "var(--w-red-bg)",   icon: Wrench       },
            ] as { label: string; value: string; color: string; bg: string; icon: React.ElementType }[]).flatMap((item, i, arr) => [
              <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "0 6px" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.icon size={13} color={item.color} />
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 22, fontWeight: 700, color: "var(--w-text-1)", margin: 0, lineHeight: 1 }}>{item.value}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 8, fontWeight: 600, color: "var(--w-text-3)", margin: 0, letterSpacing: "0.07em", textAlign: "center" as const, lineHeight: "11px" }}>{item.label}</p>
              </div>,
              ...(i < arr.length - 1 ? [<div key={`dv${i}`} style={{ width: 1, background: "var(--w-bg-muted)", alignSelf: "stretch" }} />] : []),
            ])}
          </div>

          <div style={{ ...DSL_DIVIDER }} />

          {/* Progress section */}
          <div style={{ padding: "13px 18px 14px", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 500, color: "var(--w-text-2)" }}>Fleet Readiness</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700, color: "#1b59f8" }}>86%</span>
            </div>
            <div style={{ height: 4, background: "var(--w-border)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: "86%", height: "100%", background: "linear-gradient(90deg,#1b59f8 0%,#3b82f6 100%)", borderRadius: 3 }} />
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid var(--w-divider)", padding: "10px 18px 14px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: "var(--w-text-3)", margin: "0 0 3px", letterSpacing: "0.06em" }}>FMS · MEPS · IMDS</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", margin: 0, lineHeight: "14px" }}>12% of fleet unavailable due to unresolved inspection findings.</p>
          </div>
        </div>
      </div>

      {/* ══ CARD 2 — Operator Safety Status ══════════════════════════════════ */}
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div style={{ ...DSL_CARD }}>

          {/* Header */}
          <div style={{ padding: "16px 18px 13px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 3px", lineHeight: "17px" }}>Operator Safety Status</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", margin: 0, lineHeight: "14px" }}>Live operator safety compliance overview</p>
          </div>
          <div style={{ ...DSL_DIVIDER }} />

          {/* Operator rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 0" }}>
            {([
              { initials: "RJ", name: "R. Johnson", score: 92, violations: "01", badge: "low"    as DarkBadgeVariant, avatarBg: "var(--w-green-bg)", avatarColor: "#16a34a" },
              { initials: "MK", name: "M. Kumar",   score: 74, violations: "05", badge: "medium" as DarkBadgeVariant, avatarBg: "var(--w-amber-bg)", avatarColor: "#92400e" },
              { initials: "AS", name: "A. Sharma",  score: 58, violations: "09", badge: "high"   as DarkBadgeVariant, avatarBg: "var(--w-red-bg)",   avatarColor: "#dc2626" },
            ]).map((op, i, arr) => (
              <div key={op.initials} style={{ flex: 1 }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 18px", cursor: "default", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--w-bg-page)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: op.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700, color: op.avatarColor }}>{op.initials}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 3px", lineHeight: "14px" }}>{op.name}</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)" }}>Safe Score <span style={{ color: "var(--w-text-2)", fontWeight: 600 }}>{op.score}</span></span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)" }}>Violations <span style={{ color: op.violations !== "01" ? "#dc2626" : "var(--w-text-2)", fontWeight: 600 }}>{op.violations}</span></span>
                    </div>
                  </div>
                  <DarkStatusBadge variant={op.badge} />
                </div>
                {i < arr.length - 1 && <div style={{ ...DSL_DIVIDER, margin: "0 18px" }} />}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid var(--w-divider)", padding: "10px 18px 14px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: "var(--w-text-3)", margin: "0 0 3px", letterSpacing: "0.06em" }}>RTSS · MEPS</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", margin: 0, lineHeight: "14px" }}>A. Sharma recorded highest unsafe driving frequency.</p>
          </div>
        </div>
      </div>

      {/* ══ CARD 3 — Fleet Utilization ════════════════════════════════════════ */}
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div style={{ ...DSL_CARD }}>

          {/* Header */}
          <div style={{ padding: "16px 18px 13px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 3px", lineHeight: "17px" }}>Fleet Utilization</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", margin: 0, lineHeight: "14px" }}>Current warehouse equipment utilization state</p>
          </div>
          <div style={{ ...DSL_DIVIDER }} />

          {/* Utilization status rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 0" }}>
            {([
              { label: "Active Utilization",  pct: 74, barColor: "#1b59f8", barBg: "var(--w-blue-bg)",  valueColor: "#1b59f8" },
              { label: "Idle with Load",       pct: 12, barColor: "#f59e0b", barBg: "var(--w-amber-bg)", valueColor: "#d97706" },
              { label: "Underutilized Fleet",  pct: 8,  barColor: "#ef4444", barBg: "var(--w-red-bg)",   valueColor: "#dc2626" },
              { label: "Congestion Loss",      pct: 6,  barColor: "#6366f1", barBg: "var(--w-blue-bg)",  valueColor: "#4f46e5" },
            ]).map((row, i, arr) => (
              <div key={row.label} style={{ flex: 1 }}>
                <div
                  style={{ padding: "9px 18px", cursor: "default", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--w-bg-page)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 500, color: "var(--w-text-2)" }}>{row.label}</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, color: row.valueColor }}>{row.pct}%</span>
                  </div>
                  <div style={{ height: 3, background: row.barBg, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${row.pct}%`, height: "100%", background: row.barColor, borderRadius: 2 }} />
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ ...DSL_DIVIDER, margin: "0 18px" }} />}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid var(--w-divider)", padding: "10px 18px 14px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: "var(--w-text-3)", margin: "0 0 3px", letterSpacing: "0.06em" }}>FMS · RTSS</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", margin: 0, lineHeight: "14px" }}>Reach trucks underutilized during Shift B.</p>
          </div>
        </div>
      </div>

      {/* ══ CARD 4 — Inspection Compliance ═══════════════════════════════════ */}
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div style={{ ...DSL_CARD }}>

          {/* Header */}
          <div style={{ padding: "16px 18px 13px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 3px", lineHeight: "17px" }}>Inspection Compliance</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", margin: 0, lineHeight: "14px" }}>Inspection execution and operational readiness</p>
          </div>
          <div style={{ ...DSL_DIVIDER }} />

          {/* MHE compliance rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 0" }}>
            {([
              { mheId: "MHE-002", type: "Electric Forklift", completed: 20, overdue: "01", badge: "warning"  as DarkBadgeVariant },
              { mheId: "MHE-014", type: "Reach Truck",       completed: 18, overdue: "00", badge: "healthy"  as DarkBadgeVariant },
              { mheId: "MHE-007", type: "Pallet Jack",       completed: 9,  overdue: "04", badge: "critical" as DarkBadgeVariant },
            ]).map((row, i, arr) => (
              <div key={row.mheId} style={{ flex: 1 }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 18px", cursor: "default", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--w-bg-page)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--w-blue-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: "#1b59f8", textAlign: "center" as const, lineHeight: 1.2 }}>{row.mheId.replace("MHE-", "")}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 3px", lineHeight: "14px" }}>{row.mheId}</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)" }}>Completed <span style={{ color: "var(--w-text-2)", fontWeight: 600 }}>{row.completed}</span></span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "var(--w-text-3)" }}>Overdue <span style={{ color: row.overdue !== "00" ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{row.overdue}</span></span>
                    </div>
                  </div>
                  <DarkStatusBadge variant={row.badge} />
                </div>
                {i < arr.length - 1 && <div style={{ ...DSL_DIVIDER, margin: "0 18px" }} />}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid var(--w-divider)", padding: "10px 18px 14px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: "var(--w-text-3)", margin: "0 0 3px", letterSpacing: "0.06em" }}>MEPS · IMDS</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "var(--w-text-2)", margin: 0, lineHeight: "14px" }}>Forklift inspections show highest skip rate this week.</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export function FMSDashboard() {
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);
  const [selectedInspectionMhe, setSelectedInspectionMhe] = useState("Forklift");
  const [selectedInspectionOem, setSelectedInspectionOem] = useState("all");
  const [impactOem,   setImpactOem]   = useState("all");
  const [impactType,  setImpactType]  = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("Electric Forklift");
  const [selectedHealthEquipment, setSelectedHealthEquipment] = useState("Overall");
  const [isRenewDrawerOpen, setIsRenewDrawerOpen] = useState(false);
  const [selectedMheForRenewal, setSelectedMheForRenewal] = useState<string | null>(null);
  const [selectedWarrantyFilter, setSelectedWarrantyFilter] = useState("All");
  const [isLicenseDrawerOpen, setIsLicenseDrawerOpen] = useState(false);
  const [selectedOperatorForLicense, setSelectedOperatorForLicense] = useState<string | null>(null);

  const totalMHE = equipmentHealthData.reduce((sum, item) => sum + item.value, 0);
  const maxIndex = equipmentHealthData.reduce(
    (maxIdx, item, index, arr) => (item.value > arr[maxIdx].value ? index : maxIdx),
    0
  );
  const [activeIndex, setActiveIndex] = useState(maxIndex);

  const getPartWithMostIssuesForMHE = (mheId: string) => {
    const machine = machinesInspectionData.find((m) => m.mheId === mheId);
    if (!machine || !machine.part_issues || machine.part_issues.length === 0) return null;

    const partIssueMap = new Map<string, number>();
    machine.part_issues.forEach((issue) => {
      const totalIssues = issue.amber_count + issue.red_count;
      partIssueMap.set(issue.part_name, totalIssues);
    });

    if (partIssueMap.size === 0) return null;
    return Array.from(partIssueMap.entries()).reduce((max, [part, count]) =>
      count > (max[1] || 0) ? [part, count] : max, ["", 0])[0] || null;
  };
  const currentFailureData = componentFailureDataByType[selectedEquipment];

  const colorMap: Record<string, string> = {
    "No Issues":      COLORS.noIssues,
    "Healthy (Green)": COLORS.healthy,
    "Warning (Amber)": COLORS.warning,
    "Critical (Red)":  COLORS.critical,
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx} cy={cy}
          innerRadius={outerRadius} outerRadius={outerRadius + 8}
          startAngle={startAngle} endAngle={endAngle}
          fill="var(--muted)"
        />
        <Sector
          cx={cx} cy={cy}
          innerRadius={innerRadius} outerRadius={outerRadius}
          startAngle={startAngle} endAngle={endAngle}
          fill={fill} stroke="var(--w-bg)" strokeWidth={3}
        />
      </g>
    );
  };

  // Calculate insights for Fleet Equipment Health
  const fleetHealthInsights = useMemo(() => {
    const currentData = equipmentHealthDataByType[selectedHealthEquipment];
    if (!currentData || currentData.length === 0) return null;

    const topStatus = currentData.reduce((max, item) =>
      item.value > max.value ? item : max
    );
    const topStatusLabel = topStatus.name.replace(" (Green)", "").replace(" (Amber)", "").replace(" (Red)", "");
    const secondaryStatus = currentData.filter(item => item.name !== topStatus.name).sort((a, b) => b.value - a.value)[0];
    const secondaryLabel = secondaryStatus?.name.replace(" (Green)", "").replace(" (Amber)", "").replace(" (Red)", "") || "Others";

    return {
      topStatus: topStatusLabel,
      secondaryStatus: secondaryLabel,
      equipmentFilter: selectedHealthEquipment,
    };
  }, [selectedHealthEquipment]);

  // Calculate insights for Component Failure Distribution
  const componentFailureInsights = useMemo(() => {
    const currentData = componentFailureDataByType[selectedEquipment];
    if (!currentData || currentData.length === 0) return null;

    const componentWithMostFailures = currentData.reduce((max, item) => {
      const totalRed = item.Red || 0;
      const totalAmber = item.Amber || 0;
      const maxRed = (max.Red || 0);
      const maxAmber = (max.Amber || 0);
      return (totalRed + totalAmber) > (maxRed + maxAmber) ? item : max;
    });

    const topComponent = componentWithMostFailures.part;
    const redCount = componentWithMostFailures.Red || 0;
    const amberCount = componentWithMostFailures.Amber || 0;
    const severityLabel = redCount > amberCount ? "high severity" : amberCount > 0 ? "medium severity" : "low severity";

    return {
      topComponent,
      severityLabel,
      equipmentFilter: selectedEquipment,
    };
  }, [selectedEquipment]);

  return (
    <div className="flex-1 p-6 bg-[var(--background)]">
      <div className="space-y-5">

        <div className="grid grid-cols-12 gap-5">
          {/* ── KPI strip ── */}
          {(
            [
              { label: "FLEET SIZE",       value: "42",  sub: "MHEs registered"             },
              { label: "TOTAL OPERATORS",  value: "24",  sub: "Workforce"                   },
              { label: "TOTAL SENSORS",    value: "126", sub: "93.7% online"                },
              { label: "OPEN FINDINGS",    value: "25",  sub: "2 critical · 3 MHEs blocked" },
            ] as { label: string; value: string; sub: string }[]
          ).map(({ label, value, sub }) => (
            <div key={label} className="col-span-12 md:col-span-6 xl:col-span-3">
              <div style={{ background: "#fff", border: "1px solid var(--w-border)", borderRadius: "12px", padding: "16px 20px 18px", height: "100%", boxSizing: "border-box" }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--w-text-3)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>{label}</p>
                <p style={{ fontSize: "32px", fontWeight: 700, color: "var(--w-text-1)", margin: "0 0 6px", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "12px", color: "var(--w-text-2)", margin: 0 }}>{sub}</p>
              </div>
            </div>
          ))}

          {/* Row — Top MHEs with Findings + Top Failing Parts */}
          <div className="col-span-12 xl:col-span-8 flex min-h-[422px]">
            <TopMhesWithFindingsV3 />
          </div>
          <div className="col-span-12 xl:col-span-4 flex min-h-[422px]">
            <TopFailingPartsV3 />
          </div>

          {/* ── TODAY'S ACTIVITY ── */}
          <Card className="col-span-12 xl:col-span-4 shadow-none border-[var(--border)] flex flex-col min-h-[422px]">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>Today's Activity</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>Real-time fleet engagement</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <RefreshCw size={13} style={{ color: "#1b59f8" }} />
                <span style={{ fontSize: "10px", fontStyle: "italic", color: "#1b59f8", whiteSpace: "nowrap" }}>Last Refresh 02:02:00</span>
              </div>
            </div>
            <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col" style={{ gap: "20px" }}>

              {/* Section 1 — Fleet Status */}
              <div>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: "0 0 10px" }}>
                  FLEET STATUS: <span style={{ color: "var(--w-text-1)" }}>42 total MHEs</span>
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: "0" }}>
                  {([
                    { icon: CheckCircle2, label: "ACTIVE",      value: 28, pct: "67%", iconColor: "#16a34a", iconBg: "var(--w-green-bg)" },
                    { icon: Wrench,       label: "MAINTENANCE", value: 4,  pct: "10%", iconColor: "#f59e0b", iconBg: "var(--w-amber-bg)" },
                    { icon: MinusCircle,  label: "IDLE",        value: 10, pct: "24%", iconColor: "var(--w-text-3)", iconBg: "var(--w-bg-muted)" },
                  ] as { icon: React.ElementType; label: string; value: number; pct: string; iconColor: string; iconBg: string }[]).flatMap(({ icon: Icon, label, value, iconColor, iconBg }, i, arr) => [
                    <div key={label} style={{ padding: "4px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={13} style={{ color: iconColor }} />
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--w-text-3)", letterSpacing: "0.06em" }}>{label}</span>
                      </div>
                      <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--w-text-1)", margin: 0, lineHeight: 1 }}>{value}</p>
                    </div>,
                    ...(i < arr.length - 1 ? [<div key={`sep-${i}`} style={{ background: "var(--w-border)" }} />] : []),
                  ])}
                </div>
              </div>

              {/* Section 2 — Productivity Metrics */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: "0 0 12px" }}>PRODUCTIVITY METRICS</p>
                {([
                  { label: "Trips Today",   value: "342",   sub: "↑ +18 vs yesterday" },
                  { label: "Pallets Moved", value: "1,284", sub: "Across 4 zones"      },
                  { label: "Fleet Hours",   value: "186h",  sub: "Total time logged"   },
                ] as { label: string; value: string; sub: string }[]).map(({ label, value, sub }, i, arr) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--w-divider)" : "none" }}>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: "11px", color: "var(--w-text-3)", margin: "2px 0 0" }}>{sub}</p>
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--w-text-1)", letterSpacing: "-0.02em" }}>{value}</span>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* ── TRIP LOAD BREAKDOWN ── */}
          <Card className="col-span-12 xl:col-span-4 shadow-none border-[var(--border)] flex flex-col min-h-[422px]">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>Trip Load Breakdown</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>Loaded vs empty trips · last 30 days</span>
              </div>
            </div>
            <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col" style={{ gap: "20px" }}>

              {/* Section 1 — Trip Overview */}
              <div>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: "0 0 10px" }}>TRIP OVERVIEW</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
                  <div style={{ paddingRight: "20px" }}>
                    <p style={{ fontSize: "11px", color: "var(--w-text-3)", margin: "0 0 8px", fontWeight: 500 }}>Total Trips</p>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--w-text-1)", lineHeight: 1, margin: "0 0 8px" }}>342</p>
                    <p style={{ fontSize: "10px", color: "var(--w-text-3)", fontWeight: 500, margin: 0 }}>Across all zones</p>
                  </div>
                  <div style={{ background: "var(--w-border)" }} />
                  <div style={{ paddingLeft: "20px" }}>
                    <p style={{ fontSize: "11px", color: "var(--w-text-3)", margin: "0 0 8px", fontWeight: 500 }}>Load Efficiency</p>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--w-text-1)", lineHeight: 1, margin: "0 0 8px" }}>73%</p>
                    <p style={{ fontSize: "10px", color: "#16a34a", fontWeight: 500, margin: 0 }}>↑ Exceeds 65% target</p>
                  </div>
                </div>
              </div>

              {/* Section 2 — Load Distribution */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: "0 0 10px" }}>LOAD DISTRIBUTION</p>

                {/* Stacked horizontal bar — TopFailingParts style */}
                <div style={{ display: "flex", height: "10px", marginBottom: "8px" }}>
                  <div style={{ flex: 64, background: COLORS.noIssues, borderRadius: "3px 0 0 3px" }} />
                  <div style={{ flex: 19, background: COLORS.healthy }} />
                  <div style={{ flex: 18, background: COLORS.warning,  borderRadius: "0 3px 3px 0" }} />
                </div>

                {/* Labels below each segment */}
                <div style={{ display: "flex", marginBottom: "14px" }}>
                  {([
                    { pct: "64%", flex: 64 },
                    { pct: "19%", flex: 19 },
                    { pct: "18%", flex: 18 },
                  ]).map(({ pct, flex }) => (
                    <div key={pct} style={{ flex, paddingTop: "5px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--w-text-3)" }}>{pct}</span>
                    </div>
                  ))}
                </div>

                {/* Legend rows */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  {[
                    { label: "Loaded",           sub: "Full load trips",      count: 218, pct: "64%", color: COLORS.noIssues },
                    { label: "Partial",          sub: "Partially filled",     count: 64,  pct: "19%", color: COLORS.healthy  },
                    { label: "Empty (Deadhead)", sub: "No load — return run", count: 60,  pct: "18%", color: COLORS.warning  },
                  ].map(({ label, sub, count, pct, color }, i, arr) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--w-divider)" : "none" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", margin: 0 }}>{label}</p>
                          <p style={{ fontSize: "11px", color: "var(--w-text-3)", margin: "2px 0 0" }}>{sub} · {count} trips</p>
                        </div>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--w-text-1)", letterSpacing: "-0.02em" }}>{pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* ── INSPECTION HEALTH ── */}
          <Card className="col-span-12 xl:col-span-4 shadow-none border-[var(--border)] flex flex-col min-h-[422px]">
            {/* Header — common dashboard widget style */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>
                  Inspection Health
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>
                  Severity distribution by MHE type
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Select value={selectedInspectionOem} onValueChange={setSelectedInspectionOem}>
                  <SelectTrigger style={{ height: "32px", width: "auto", background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "var(--w-text-1)", fontFamily: "Inter, sans-serif" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All OEMs</SelectItem>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="toyota-industries">Toyota Industries</SelectItem>
                    <SelectItem value="tata">TATA</SelectItem>
                    <SelectItem value="mahindra">Mahindra</SelectItem>
                    <SelectItem value="raymond">Raymond</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedInspectionMhe} onValueChange={setSelectedInspectionMhe}>
                  <SelectTrigger style={{ height: "32px", width: "auto", background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "var(--w-text-1)", fontFamily: "Inter, sans-serif" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Forklift">Forklift</SelectItem>
                    <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                    <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                    <SelectItem value="Stacker">Stacker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col" style={{ gap: "20px" }}>

              {/* Section 1 — Inspection Status Hero */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Hero row */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Forklift size={16} style={{ color: "#2563eb" }} />
                  </div>
                  <div style={{ padding: "0 6px" }}>
                    <span style={{ fontSize: "30px", fontWeight: 700, color: "var(--w-text-1)", letterSpacing: "-0.75px", lineHeight: "36px" }}>42</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--w-text-2)", fontWeight: 400 }}>
                    {selectedInspectionMhe} MHEs{selectedInspectionOem !== "all" ? ` · ${selectedInspectionOem === "toyota-industries" ? "Toyota Industries" : selectedInspectionOem.charAt(0).toUpperCase() + selectedInspectionOem.slice(1)}` : ""}
                  </span>
                </div>
                {/* Parts Comparison */}
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: "0 0 10px" }}>PARTS COMPARISON</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: "10px", columnGap: "8px" }}>
                    {([
                      { sub: "Most Red",   value: "Battery", dot: "#ef4444" },
                      { sub: "Most Amber", value: "Tyres",   dot: "#f59e0b" },
                      { sub: "Most Green", value: "Light",   dot: "#16a34a" },
                    ] as { sub: string; value: string; dot: string }[]).map(({ sub, value, dot }) => (
                      <div key={sub}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, flexShrink: 0 }} />
                          <p style={{ fontSize: "10px", color: "var(--w-text-3)", margin: 0 }}>{sub}</p>
                        </div>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--w-text-1)", margin: 0 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2 — Severity Distribution */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--w-text-3)", letterSpacing: "0.08em", margin: 0 }}>SEVERITY DISTRIBUTION</p>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {([
                  { label: "RED",   insight: { mheId: "MHE0015", part: "Battery" }, count: 120, color: "#ef4444", Icon: AlertCircle   },
                  { label: "AMBER", insight: { mheId: "MHE0023", part: "Tyres"   }, count: 90,  color: "#f59e0b", Icon: AlertTriangle },
                  { label: "GREEN", insight: { mheId: "MHE0008", part: "Light"   }, count: 90,  color: "#16a34a", Icon: CheckCircle2  },
                ] as { label: string; insight: { mheId: string; part: string }; count: number; color: string; Icon: React.ElementType }[]).map(({ label, insight, count, color, Icon }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {/* Top: icon+label | count */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--w-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={13} style={{ color }} />
                        </div>
                        <span style={{ fontSize: "9px", fontWeight: 600, color: "var(--w-text-2)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
                      </div>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--w-text-2)", letterSpacing: "-0.027em" }}>{count}</span>
                    </div>
                    {/* Insight: MHE ID | Part inline */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "10px", color: "var(--w-text-2)", fontWeight: 400 }}>MHE ID: </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--w-text-1)" }}>{insight.mheId}</span>
                      <span style={{ fontSize: "10px", color: "var(--w-text-2)" }}>|</span>
                      <span style={{ fontSize: "10px", color: "var(--w-text-2)", fontWeight: 400 }}>Part: </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--w-text-1)" }}>{insight.part}</span>
                    </div>
                  </div>
                ))}
                </div>
              </div>

            </CardContent>

          </Card>

          {/* ── FLEET COMPOSITION (pie chart) ── */}
          {(() => {
            type ImpactRow = { label: string; count: number; color: string };
            const IMPACT_DATA: Record<string, { total: number; oemLabel: string; types: ImpactRow[] }> = {
              "all|all":               { total: 42, oemLabel: "All OEMs",          types: [{ label: "Reach Truck",  count: 10, color: "#1b59f8" }, { label: "Forklift",     count: 8,  color: "#4c7dff" }, { label: "Order Picker", count: 9,  color: "#7397f6" }, { label: "Pallet Jack",  count: 6,  color: "#8fb2ff" }, { label: "VNA Truck",    count: 5,  color: "#a8c4ff" }, { label: "Stacker",      count: 4,  color: "#c9dbff" }] },
              "all|toyota":            { total: 18, oemLabel: "Toyota",            types: [{ label: "Reach Truck",  count: 10, color: "#1b59f8" }, { label: "Forklift",     count: 5,  color: "#4c7dff" }, { label: "VNA Truck",    count: 3,  color: "#a8c4ff" }] },
              "all|toyota-industries": { total: 9,  oemLabel: "Toyota Industries", types: [{ label: "Order Picker", count: 6,  color: "#7397f6" }, { label: "Pallet Jack",  count: 3,  color: "#8fb2ff" }] },
              "all|tata":              { total: 7,  oemLabel: "TATA",              types: [{ label: "Forklift",     count: 3,  color: "#4c7dff" }, { label: "Order Picker", count: 2,  color: "#7397f6" }, { label: "Stacker",      count: 2,  color: "#c9dbff" }] },
              "all|mahindra":          { total: 5,  oemLabel: "Mahindra",          types: [{ label: "Stacker",      count: 2,  color: "#c9dbff" }, { label: "Pallet Jack",  count: 2,  color: "#8fb2ff" }, { label: "VNA Truck",    count: 1,  color: "#a8c4ff" }] },
              "all|raymond":           { total: 3,  oemLabel: "Raymond",           types: [{ label: "Forklift",     count: 2,  color: "#4c7dff" }, { label: "Order Picker", count: 1,  color: "#7397f6" }] },
              "forklift|all":          { total: 8,  oemLabel: "All OEMs",          types: [{ label: "Forklift",     count: 8,  color: "#4c7dff" }] },
              "reach-truck|all":       { total: 10, oemLabel: "All OEMs",          types: [{ label: "Reach Truck",  count: 10, color: "#1b59f8" }] },
              "pallet-jack|all":       { total: 6,  oemLabel: "All OEMs",          types: [{ label: "Pallet Jack",  count: 6,  color: "#8fb2ff" }] },
              "stacker|all":           { total: 4,  oemLabel: "All OEMs",          types: [{ label: "Stacker",      count: 4,  color: "#c9dbff" }] },
              "order-picker|all":      { total: 9,  oemLabel: "All OEMs",          types: [{ label: "Order Picker", count: 9,  color: "#7397f6" }] },
              "vna-truck|all":         { total: 5,  oemLabel: "All OEMs",          types: [{ label: "VNA Truck",    count: 5,  color: "#a8c4ff" }] },
              "reach-truck|toyota":    { total: 10, oemLabel: "Toyota",            types: [{ label: "Reach Truck",  count: 10, color: "#1b59f8" }] },
              "forklift|toyota":       { total: 5,  oemLabel: "Toyota",            types: [{ label: "Forklift",     count: 5,  color: "#4c7dff" }] },
              "order-picker|toyota-industries": { total: 6, oemLabel: "Toyota Industries", types: [{ label: "Order Picker", count: 6, color: "#7397f6" }] },
              "forklift|tata":         { total: 3,  oemLabel: "TATA",              types: [{ label: "Forklift",     count: 3,  color: "#4c7dff" }] },
              "stacker|mahindra":      { total: 2,  oemLabel: "Mahindra",          types: [{ label: "Stacker",      count: 2,  color: "#c9dbff" }] },
            };
            const key     = `${impactType}|${impactOem}`;
            const d       = IMPACT_DATA[key] ?? IMPACT_DATA[`all|${impactOem}`] ?? IMPACT_DATA["all|all"];
            const pieData = d.types.map(({ label, count, color }) => ({ name: label, value: count, color }));
            const topType = pieData[0];
            const fsImpact: React.CSSProperties = { height: "32px", width: "auto", background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "var(--w-text-1)", fontFamily: "Inter, sans-serif", fontWeight: 400 };

            function PieTooltip({ active, payload }: any) {
              if (!active || !payload?.length) return null;
              const { name, value, color } = payload[0].payload;
              const pct = Math.round((value / d.total) * 100);
              return (
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "6px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "140px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: color, flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "11px", color: "var(--w-text-1)" }}>{name}</span>
                  </div>
                  {([["Count", value], ["Share", `${pct}%`]] as [string, string | number][]).map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "2px" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>{l}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "var(--w-text-1)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div className="col-span-12 xl:col-span-4 flex flex-col" style={{ minHeight: "422px" }}>
                <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>Fleet Composition</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>MHEs by type · {d.oemLabel}</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Select value={impactOem} onValueChange={setImpactOem}>
                        <SelectTrigger style={fsImpact}><SelectValue placeholder="All OEMs" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All OEMs</SelectItem>
                          <SelectItem value="toyota">Toyota</SelectItem>
                          <SelectItem value="toyota-industries">Toyota Industries</SelectItem>
                          <SelectItem value="tata">TATA</SelectItem>
                          <SelectItem value="mahindra">Mahindra</SelectItem>
                          <SelectItem value="raymond">Raymond</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={impactType} onValueChange={setImpactType}>
                        <SelectTrigger style={fsImpact}><SelectValue placeholder="All Types" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="reach-truck">Reach Truck</SelectItem>
                          <SelectItem value="forklift">Forklift</SelectItem>
                          <SelectItem value="pallet-jack">Pallet Jack</SelectItem>
                          <SelectItem value="stacker">Stacker</SelectItem>
                          <SelectItem value="order-picker">Order Picker</SelectItem>
                          <SelectItem value="vna-truck">VNA Truck</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Body: outer centres the row vertically */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "16px 20px", minHeight: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      {/* Donut chart */}
                      <div style={{ width: "180px", height: "180px", position: "relative", flexShrink: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={2} dataKey="value" strokeWidth={0}>
                              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip content={<PieTooltip />} wrapperStyle={{ zIndex: 20 }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "24px", fontWeight: 700, color: "var(--w-text-1)", lineHeight: 1.1 }}>{d.total}</div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "var(--w-text-3)", lineHeight: 1.6 }}>Total MHEs</div>
                        </div>
                      </div>

                      {/* Legend */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {pieData.map(({ name, value, color }) => (
                          <div key={name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: color, flexShrink: 0, display: "inline-block" }} />
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>{name}</span>
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "var(--w-text-1)" }}>· {value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box", overflow: "hidden" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {topType?.name} is the largest segment · {topType?.value} of {d.total} units
                      </span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── MACHINES REQUIRING INSPECTION ATTENTION ── */}
          {(() => {
            const inspStats: Record<string, { reported: number; closed: number }> = {
              "MHE-001": { reported: 10, closed: 5 },
              "MHE-004": { reported: 7,  closed: 4 },
              "MHE-012": { reported: 9,  closed: 6 },
              "MHE-025": { reported: 13, closed: 2 },
              "MHE-031": { reported: 4,  closed: 3 },
            };
            return (
              <Card className="col-span-12 xl:col-span-4 shadow-none border-[var(--border)] flex flex-col overflow-hidden" style={{ height: "422px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)" }}>Machines Requiring Inspection Attention</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)" }}>Inspection workload by operator</span>
                  </div>
                  <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                    <SelectTrigger style={{ height: "32px", width: "auto", background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "var(--w-text-1)", fontFamily: "Inter, sans-serif", fontWeight: 400 }}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electric Forklift">Forklift</SelectItem>
                      <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                      <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Scrollable list */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {machinesInspectionData.map((row: any) => {
                    const formattedDate = new Date(row.lastInspection).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    const partWithMostIssues = getPartWithMostIssuesForMHE(row.mheId);
                    const stats = inspStats[row.mheId] ?? { reported: 10, closed: 5 };
                    return (
                      <div key={row.mheId} style={{ border: "1px solid var(--w-border)", borderRadius: "10px", padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {/* Row 1: icon + ID + date + badge */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "var(--w-blue-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Truck style={{ width: "13px", height: "13px", color: "#1b59f8" }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1px", minWidth: 0 }}>
                              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, color: "#1b59f8", fontVariantNumeric: "tabular-nums" }}>{row.mheId}</span>
                              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "var(--w-text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Last Inspection: {formattedDate}</span>
                            </div>
                          </div>
                          {partWithMostIssues ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "99px", background: "#eef2ff", border: "1px solid #e0e7ff", flexShrink: 0, maxWidth: "120px" }}>
                              <AlertTriangle style={{ width: "10px", height: "10px", color: "#2563eb", flexShrink: 0 }} />
                              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 500, color: "#1e40af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Most Issues: {partWithMostIssues}</span>
                            </div>
                          ) : (
                            <div style={{ padding: "2px 7px", borderRadius: "99px", background: "#ecfdf5", border: "1px solid #d1fae5", flexShrink: 0 }}>
                              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 500, color: "#065f46" }}>All Good</span>
                            </div>
                          )}
                        </div>

                        {/* Row 2: Reported | Closed */}
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "var(--w-text-1)", lineHeight: 1.2 }}>{String(stats.reported).padStart(2, "0")}</span>
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "var(--w-text-3)" }}>Reported</span>
                          </div>
                          <div style={{ width: "1px", height: "28px", background: "var(--w-border)", flexShrink: 0 }} />
                          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "var(--w-text-1)", lineHeight: 1.2 }}>{String(stats.closed).padStart(2, "0")}</span>
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "var(--w-text-3)" }}>Closed</span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: "1px", background: "var(--w-bg-muted)" }} />

                        {/* Row 3: findings */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {[
                            { label: "Red",   value: row.redFindings,   color: "#ef4444" },
                            { label: "Amber", value: row.amberFindings, color: "#f59e0b" },
                            { label: "Green", value: row.greenFindings, color: "#16a34a" },
                          ].map(({ label, value, color }) => (
                            <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
                              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>{label} {value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box", overflow: "hidden" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      9 inspections skipped per MHE; Battery drives amber severity
                    </span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8" }}>
                      May 7 – May 13, 2026
                    </span>
                  </div>
                </div>
              </Card>
            );
          })()}

          {/* ── INSPECTIONS BY MHE TYPE ── */}
          {(() => {
            const INSP_DATA: Record<string, { name: string; short: string; Critical: number; Attention: number; Healthy: number }[]> = {
              "all":          [{ name: "Reach Truck",  short: "Reach",   Critical: 8,  Attention: 5,  Healthy: 22 }, { name: "Forklift",     short: "Fork",    Critical: 2,  Attention: 3,  Healthy: 20 }, { name: "Pallet Jack",  short: "Pallet",  Critical: 2,  Attention: 3,  Healthy: 23 }, { name: "Stacker",      short: "Stacker", Critical: 1,  Attention: 2,  Healthy: 11 }, { name: "Order Picker", short: "Order",   Critical: 0,  Attention: 2,  Healthy: 8  }, { name: "VNA Truck",    short: "VNA",     Critical: 0,  Attention: 1,  Healthy: 5  }],
              "last_7_days":  [{ name: "Reach Truck",  short: "Reach",   Critical: 3,  Attention: 2,  Healthy: 8  }, { name: "Forklift",     short: "Fork",    Critical: 1,  Attention: 1,  Healthy: 7  }, { name: "Pallet Jack",  short: "Pallet",  Critical: 1,  Attention: 1,  Healthy: 9  }, { name: "Stacker",      short: "Stacker", Critical: 0,  Attention: 1,  Healthy: 4  }, { name: "Order Picker", short: "Order",   Critical: 0,  Attention: 1,  Healthy: 3  }, { name: "VNA Truck",    short: "VNA",     Critical: 0,  Attention: 0,  Healthy: 2  }],
              "last_90_days": [{ name: "Reach Truck",  short: "Reach",   Critical: 22, Attention: 14, Healthy: 60 }, { name: "Forklift",     short: "Fork",    Critical: 6,  Attention: 9,  Healthy: 55 }, { name: "Pallet Jack",  short: "Pallet",  Critical: 5,  Attention: 8,  Healthy: 62 }, { name: "Stacker",      short: "Stacker", Critical: 3,  Attention: 6,  Healthy: 30 }, { name: "Order Picker", short: "Order",   Critical: 1,  Attention: 5,  Healthy: 22 }, { name: "VNA Truck",    short: "VNA",     Critical: 0,  Attention: 3,  Healthy: 14 }],
            };
            const filterStyle: React.CSSProperties = { height: "32px", width: "auto", background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "var(--w-text-1)", fontFamily: "Inter, sans-serif", fontWeight: 400 };

            function InspByTypeWidget() {
              const [period, setPeriod] = React.useState("all");
              const data = INSP_DATA[period] ?? INSP_DATA["all"];
              const chartData = data.map(r => ({ ...r, name: r.short }));
              const top  = data.reduce((a, b) => (a.Critical > b.Critical ? a : b));

              function CustomTooltip({ active, payload, label }: any) {
                if (!active || !payload?.length) return null;
                const fullName = data.find(r => r.short === label)?.name ?? label;
                const c = payload.find((p: any) => p.dataKey === "Critical")?.value  ?? 0;
                const a = payload.find((p: any) => p.dataKey === "Attention")?.value ?? 0;
                const h = payload.find((p: any) => p.dataKey === "Healthy")?.value   ?? 0;
                return (
                  <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "6px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "150px" }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "11px", color: "var(--w-text-1)", margin: "0 0 8px" }}>{fullName}</p>
                    {([["Red", "#1b59f8", c], ["Amber", "#7397f6", a], ["Green", "#c9dbff", h]] as [string, string, number][]).map(([l, col, v]) => (
                      <div key={l} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>
                          <span style={{ width: "7px", height: "7px", borderRadius: "2px", background: col, flexShrink: 0, display: "inline-block" }} />{l}
                        </span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "var(--w-text-1)" }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ height: "0.5px", background: "var(--w-border)", margin: "6px 0 4px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "var(--w-text-2)" }}>Total</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "var(--w-text-1)" }}>{c + a + h}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div className="col-span-12 xl:col-span-4 flex flex-col" style={{ minHeight: "422px" }}>
                  <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid var(--w-divider)", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap" }}>Inspections by MHE Type</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "var(--w-text-2)", whiteSpace: "nowrap" }}>Severity findings by type · last 30 days</span>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Select value={period} onValueChange={setPeriod}>
                          <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Last 30 days</SelectItem>
                            <SelectItem value="last_7_days">Last 7 days</SelectItem>
                            <SelectItem value="last_90_days">Last 90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Chart */}
                    <div style={{ flex: 1, padding: "14px 16px 12px 4px", minHeight: 0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 2, right: 8, left: 0, bottom: 2 }} barSize={10} barCategoryGap="30%">
                          <CartesianGrid vertical={false} stroke="var(--w-bg-muted)" strokeDasharray="" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-2)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "var(--w-text-3)" }}
                            axisLine={false}
                            tickLine={false}
                            width={32}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--w-bg-page)" }} />
                          <Bar dataKey="Critical"  fill="#1b59f8" stackId="s" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="Attention" fill="#7397f6" stackId="s" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="Healthy"   fill="#c9dbff" stackId="s" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Footer */}
                    <div style={{ borderTop: "1px solid var(--w-divider)", padding: "11px 16px 0 16px", flexShrink: 0, height: "59.5px", boxSizing: "border-box", overflow: "hidden" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "18px", color: "var(--w-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {top.name} has highest Red severity — {top.Critical} Red · {top.Attention} Amber
                        </span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", lineHeight: "16.5px", color: "#1b59f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            }
            return <InspByTypeWidget />;
          })()}

          {/* ── Operational Status Layer ── */}
          <OperationalStatusLayer />

          {/* Warranty / License Expiry Table */}
          <div className="col-span-12">
            <WarrantyExpiryTableV3
              onRenew={(id, type) => {
                if (type === "operator") {
                  setSelectedOperatorForLicense(id);
                  setIsLicenseDrawerOpen(true);
                } else {
                  setSelectedMheForRenewal(id);
                  setIsRenewDrawerOpen(true);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Shared drawers */}
      <LicenseRenewDrawer
        isOpen={isRenewDrawerOpen}
        onClose={() => {
          setIsRenewDrawerOpen(false);
          setSelectedMheForRenewal(null);
        }}
        mheId={selectedMheForRenewal}
      />
      <OperatorLicenseExpiryDrawer
        isOpen={isLicenseDrawerOpen}
        onClose={() => {
          setIsLicenseDrawerOpen(false);
          setSelectedOperatorForLicense(null);
        }}
        operatorId={selectedOperatorForLicense}
      />
    </div>
  );
}
