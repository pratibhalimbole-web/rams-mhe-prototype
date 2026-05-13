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
  PieChart,
  Pie,
  Cell,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
} from "lucide-react";
import { MheInspectionSeverityTimeline } from "../../components/widgets/MheInspectionSeverityTimeline";
import { MheImpactResponsibilityAnalysis } from "../../components/widgets/MheImpactResponsibilityAnalysis";
import { ImpactTrendByZoneAndMHE } from "../../components/widgets/ImpactTrendByZoneAndMHE";
import { KpiCard } from "../../components/widgets/KpiCard";
import { KpiExpandPanel } from "../../components/widgets/KpiExpandPanel";
import { MheInsightPanel } from "../../components/widgets/MheInsightPanel";
import { MachinesRequiringInspectionAttention } from "../../components/widgets/MachinesRequiringInspectionAttention";
import { CriticalIssuesBanner } from "../../components/widgets/CriticalIssuesBanner";
import { KpiCardV3 } from "../../components/widgets/v3/KpiCardV3";
import { EquipmentHealthCardV3 } from "../../components/widgets/v3/EquipmentHealthCardV3";
import { SeverityTrendLineV3 } from "../../components/widgets/v3/SeverityTrendLineV3";
import { MachinesAttentionV3 } from "../../components/widgets/v3/MachinesAttentionV3";
import { ImpactDonutV3 } from "../../components/widgets/v3/ImpactDonutV3";
import { ImpactTrendRankedV3 } from "../../components/widgets/v3/ImpactTrendRankedV3";
import { WarrantyExpiryTableV3 } from "../../components/widgets/v3/WarrantyExpiryTableV3";
import { MonitoringCardV3 } from "../../components/widgets/v3/MonitoringCardV3";
import { MonitoringSplitCardV3 } from "../../components/widgets/v3/MonitoringSplitCardV3";

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
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
        <CardTitle className="text-[length:var(--text-xs)] font-[var(--font-weight-medium)]">
          {title}
        </CardTitle>
        <Icon className="h-3 w-3 text-[var(--muted-foreground)]" />
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="text-[length:var(--text-lg)] font-[var(--font-weight-semi-bold)]">
          {value}
        </div>
        <p className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] leading-tight">
          {description}
        </p>
      </CardContent>
    </Card>
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

// ─── Dashboard ───────────────────────────────────────────────────────────────
export function FMSDashboard() {
  const [activeTab, setActiveTab] = useState("variation3");
  const [selectedEquipment, setSelectedEquipment] = useState("Electric Forklift");
  const [selectedHealthEquipment, setSelectedHealthEquipment] = useState("Overall");
  const [isRenewDrawerOpen, setIsRenewDrawerOpen] = useState(false);
  const [selectedMheForRenewal, setSelectedMheForRenewal] = useState<string | null>(null);
  const [selectedWarrantyFilter, setSelectedWarrantyFilter] = useState("All");
  const [isLicenseDrawerOpen, setIsLicenseDrawerOpen] = useState(false);
  const [selectedOperatorForLicense, setSelectedOperatorForLicense] = useState<string | null>(null);

  // Variation 2 KPI expand panels
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);

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
          fill={fill} stroke="#ffffff" strokeWidth={3}
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
      {/* ── Tabs Navigation ── */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid var(--border)", marginBottom: "0" }}>
          <button
            onClick={() => setActiveTab("variation1")}
            style={{
              padding: "12px 0",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: activeTab === "variation1" ? "#2563EB" : "#6B7280",
              borderBottom: activeTab === "variation1" ? "2px solid #2563EB" : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            Variation 1
          </button>
          <button
            onClick={() => setActiveTab("variation2")}
            style={{
              padding: "12px 0",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: activeTab === "variation2" ? "#2563EB" : "#6B7280",
              borderBottom: activeTab === "variation2" ? "2px solid #2563EB" : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            Variation 2
          </button>
          <button
            onClick={() => setActiveTab("variation3")}
            style={{
              padding: "12px 0",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: activeTab === "variation3" ? "#2563EB" : "#6B7280",
              borderBottom: activeTab === "variation3" ? "2px solid #2563EB" : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            Variation 3
          </button>
        </div>
      </div>

      {/* ── Variation 1: Current Dashboard ── */}
      {activeTab === "variation1" && (
        <div className="space-y-6">

      {/* ── Row 1: KPI Cards — 4 × col-span-3 = 12 ── */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <KPICard title="Fleet Size"        description="Total machines in operation" value="42"  icon={Truck}       />
        </div>
        <div className="col-span-3">
          <KPICard title="Fleet Utilization" description="Percentage active equipment" value="78%" icon={Activity}    />
        </div>
        <div className="col-span-3">
          <KPICard title="Fleet Safety Score" description="Safety performance rating"  value="92%" icon={ShieldCheck} />
        </div>
        <div className="col-span-3">
          <KPICard title="Sensor Health"     description="Active sensors percentage"  value="95%" icon={Wifi}        />
        </div>
      </div>

      {/* ── Row 2: Charts — 2 × col-span-6 = 12 ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Widget 1: Fleet Equipment Health Distribution */}
        <Card className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <div className="flex items-start justify-between w-full gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
                  Fleet Equipment Health Distribution
                </CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                  Fleet equipment warranty validity status across all MHE assets.
                </CardDescription>
              </div>
              <div className="w-[200px] flex-shrink-0">
                <Select value={selectedHealthEquipment} onValueChange={setSelectedHealthEquipment}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="Select Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Overall">Overall</SelectItem>
                    <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                    <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                    <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-6 pb-0">
            <div style={{ width: "240px", height: "240px", position: "relative" }}>
              <ChartContainer config={donutChartConfig} className="w-full h-full">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    stroke="#ffffff" strokeWidth={3}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(maxIndex)}
                  >
                    {(equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colorMap[entry.name] || COLORS.noIssues} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              {/* Centre label */}
              <div
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center", pointerEvents: "none",
                }}
              >
                <div className="text-[length:var(--text-2xl)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
                  {(equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData).reduce((sum, item) => sum + item.value, 0)}
                </div>
                <div className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] mt-1">
                  Total MHEs
                </div>
              </div>
            </div>
          </CardContent>

          {/* Legend & Insight Footer - Full Width */}
          <>
            {/* Legend Section - No Divider */}
            <div style={{ padding: "16px 24px", zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                {(equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData).map((item) => (
                  <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: colorMap[item.name],
                        borderRadius: "2px",
                      }}
                    />
                    <span style={{ fontSize: "11px", color: "#64748B" }}>
                      {item.name.replace(" (Green)", "").replace(" (Amber)", "").replace(" (Red)", "")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight Callout - Divider Above */}
            {fleetHealthInsights && (
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  padding: "16px 24px",
                  zIndex: 10,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0, lineHeight: "1.4" }}>
                    <span style={{ fontWeight: "600" }}>{fleetHealthInsights.topStatus}</span> status reported most, mainly by <span style={{ fontWeight: "600" }}>{fleetHealthInsights.secondaryStatus}</span>
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "400", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>
                    {fleetHealthInsights.equipmentFilter === "Overall" ? "All Equipment Types" : fleetHealthInsights.equipmentFilter}
                  </p>
                </div>
              </div>
            )}
          </>
        </Card>

        {/* Widget 2: Component Failure Distribution */}
        <Card className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <div className="flex items-start justify-between w-full gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
                  Component Failure Distribution
                </CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                  Frequency of inspection findings units.
                </CardDescription>
              </div>
              <div className="w-[200px] flex-shrink-0">
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="Select Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                    <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                    <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pb-0 flex flex-col flex-1">
            <div className="overflow-x-auto scrollbar-hide flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className={currentFailureData.length > 5 ? "min-w-[600px]" : ""} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div style={{ position: "relative" }}>
                  {/* Custom Y-axis label — vertically centered, clear of tick values */}
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "20px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748B", letterSpacing: "0.02em", transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
                      Count
                    </span>
                  </div>
                  <ChartContainer config={failureChartConfig} className="h-[260px]" style={{ paddingLeft: "8px" }}>
                    <BarChart
                      accessibilityLayer
                      data={currentFailureData}
                      margin={{ top: 10, right: 20, left: 36, bottom: 10 }}
                      barGap="20%"
                    >
                      <CartesianGrid vertical={false} stroke="var(--border)" />
                      <XAxis
                        dataKey="part"
                        tickLine={false} tickMargin={10} axisLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={30} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="No Issues" stackId="a" fill="hsl(217, 98%, 54%)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Green"     stackId="a" fill="hsl(222, 84%, 62%)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Amber"     stackId="a" fill="hsl(226, 75%, 68%)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Red"       stackId="a" fill="hsl(230, 67%, 85%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Insight Callout Footer - Full Width */}
          {componentFailureInsights && (
            <div
              style={{
                borderTop: "1px solid var(--border)",
                padding: "16px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0, lineHeight: "1.4" }}>
                <span style={{ fontWeight: "600" }}>{componentFailureInsights.topComponent}</span> reported most failures, mainly by <span style={{ fontWeight: "600" }}>{componentFailureInsights.severityLabel}</span>
              </p>
              <p style={{ fontSize: "12px", fontWeight: "400", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>
                {componentFailureInsights.equipmentFilter}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Row 3: Machines + Timeline — 2 × col-span-6 = 12 ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Widget 3: Machines Requiring Inspection Attention */}
        <Card className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden" style={{ height: "448px" }}>
          <CardHeader className="pb-4 border-b border-[var(--border)]">
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
                  Machines Requiring Inspection Attention
                </CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                  MHE units with warning or critical findings from recent inspections.
                </CardDescription>
              </div>
              <div className="w-[200px] flex-shrink-0">
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                    <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                    <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {machinesInspectionData.map((row) => {
                const formattedDate = new Date(row.lastInspection).toLocaleDateString("en-US", {
                  day: "2-digit", month: "short", year: "numeric",
                });
                const partWithMostIssues = getPartWithMostIssuesForMHE(row.mheId);
                const hasIssues = row.redFindings > 0 || row.amberFindings > 0;

                return (
                  <Card key={row.mheId} className="shadow-none border rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#eff6ff" }}>
                          <Truck className="h-4 w-4" style={{ color: "#1b59f8" }} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)] font-mono text-[color:var(--primary)]">
                            {row.mheId}
                          </p>
                          <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                            Last Inspection: {formattedDate}
                          </span>
                        </div>
                      </div>
                      {hasIssues && partWithMostIssues && (
                        <div className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0" style={{ backgroundColor: "#EEF2FF", color: "#1E40AF", borderColor: "#E0E7FF" }}>
                          <AlertTriangle className="h-3.5 w-3.5" style={{ color: "#2563EB" }} />
                          <span>Most Issues: {partWithMostIssues}</span>
                        </div>
                      )}
                      {hasIssues && !partWithMostIssues && (
                        <div className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0" style={{ backgroundColor: "#ECFDF5", color: "#065F46", borderColor: "#D1FAE5" }}>
                          <span>All Good</span>
                        </div>
                      )}
                      {!hasIssues && (
                        <div className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0" style={{ backgroundColor: "#ECFDF5", color: "#065F46", borderColor: "#D1FAE5" }}>
                          <span>All Good</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      {[
                        { label: "Red",   value: row.redFindings,   color: "var(--destructive)" },
                        { label: "Amber", value: row.amberFindings, color: "var(--warning)"     },
                        { label: "Green", value: row.greenFindings, color: "var(--success)"     },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex flex-col items-center gap-1">
                          <span className="text-[length:var(--text-xs)]" style={{ color: "#9CA3AF" }}>{label}</span>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">{value}</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[length:var(--text-xs)]" style={{ color: "#9CA3AF" }}>Parts</span>
                        <span className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">{row.parts}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Widget 4: MHE Inspection Severity Timeline */}
        <div className="col-span-6 w-full overflow-auto" style={{ height: "448px" }}>
          <MheInspectionSeverityTimeline />
        </div>
      </div>

      {/* ── Row 4: MHE Warranty Expiry Monitoring — col-span-12 ── */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 shadow-none border-[var(--border)]">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
                  MHE Warranty Expiry Monitoring
                </CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] whitespace-nowrap">
                  MHE whose equipment licenses have expired or will expire soon.
                </CardDescription>
              </div>
              <div className="w-[200px] flex-shrink-0">
                <Select value={selectedWarrantyFilter} onValueChange={setSelectedWarrantyFilter}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                    <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                    <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                    <SelectItem value="Order Picker">Order Picker</SelectItem>
                    <SelectItem value="Tow Tractor">Tow Tractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {["MHE Type", "MHE ID", "License Expiry", "Days Remaining", "Status", "Action"].map((h) => (
                      <TableHead
                        key={h}
                        className="px-6 h-12 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase tracking-wide"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warrantyExpiryData
                    .filter((row) => (row.status === "expiring" || row.status === "expired") && (selectedWarrantyFilter === "All" || row.mheType === selectedWarrantyFilter))
                    .slice(0, 5)
                    .map((row) => {
                      const formattedDate = new Date(row.licenseExpiry).toLocaleDateString("en-US", {
                        day: "2-digit", month: "short", year: "numeric",
                      });
                      return (
                        <TableRow key={row.mheId} className="h-12 border-b border-border hover:bg-muted/50">
                          <TableCell className="px-6 text-[length:var(--text-sm)]">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: "#eff6ff" }}>
                                <Truck className="h-3 w-3" style={{ color: "#1b59f8" }} />
                              </div>
                              {row.mheType}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 text-[length:var(--text-sm)] font-mono font-semibold text-[color:var(--primary)]">
                            {row.mheId}
                          </TableCell>
                          <TableCell className="px-6 text-[length:var(--text-sm)]">{formattedDate}</TableCell>
                          <TableCell className="px-6 text-[length:var(--text-sm)] text-[var(--muted-foreground)]">
                            {row.daysRemaining} Days
                          </TableCell>
                          <TableCell className="px-6">
                            <StatusBadge status={row.status as "active" | "expiring" | "expired"} />
                          </TableCell>
                          <TableCell className="px-6">
                            <button
                              className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[color:var(--primary)]"
                              onClick={() => {
                                setSelectedMheForRenewal(row.mheId);
                                setIsRenewDrawerOpen(true);
                              }}
                            >
                              Renew
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                1–{Math.min(5, warrantyExpiryData.filter((r) => (r.status === "expiring" || r.status === "expired") && (selectedWarrantyFilter === "All" || r.mheType === selectedWarrantyFilter)).length)} of{" "}
                {warrantyExpiryData.filter((r) => (r.status === "expiring" || r.status === "expired") && (selectedWarrantyFilter === "All" || r.mheType === selectedWarrantyFilter)).length}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">Rows:</span>
                  <Select defaultValue="5">
                    <SelectTrigger className="h-8 w-16 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-muted rounded transition-colors" disabled>
                    <ChevronLeft className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </button>
                  <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] min-w-[40px] text-center">
                    1 / 1
                  </span>
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <ChevronRight className="w-4 h-4 text-[var(--foreground)]" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 5: MHE Impact Analysis & Impact Trend — 2 × col-span-6 = 12 ── */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6">
          <MheImpactResponsibilityAnalysis />
        </div>
        <div className="col-span-6">
          <ImpactTrendByZoneAndMHE />
        </div>
      </div>

      {/* ── Row 6: Operator License Expiry Monitoring — col-span-12 ── */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 shadow-none border-[var(--border)]">
          <CardHeader className="pb-2 border-b border-[var(--border)]">
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
              Operator License Expiry Monitoring
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              Track operator license expiration dates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {["Operator", "Operator ID", "License Expiry", "Days Remaining", "Assigned MHE", "Status", "Action"].map((h) => (
                      <TableHead
                        key={h}
                        className="px-6 h-12 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase tracking-wide"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operatorLicenseData.map((row) => {
                    const daysColor =
                      row.daysRemaining < 0  ? "var(--destructive)" :
                      row.daysRemaining < 15 ? "var(--warning)"     :
                                               "var(--foreground)";
                    return (
                      <TableRow key={row.operatorId} className="h-12 border-b border-border hover:bg-muted/50">
                        <TableCell className="px-6 text-[length:var(--text-sm)] font-[var(--font-weight-medium)]">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: "#f0fdf4" }}>
                              <User className="h-3 w-3" style={{ color: "#16a34a" }} />
                            </div>
                            {row.operator}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)] font-mono font-semibold text-[color:var(--primary)]">
                          {row.operatorId}
                        </TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)]">
                          {new Date(row.licenseExpiry).toLocaleDateString("en-US", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)] font-[var(--font-weight-medium)]">
                          <span style={{ color: daysColor }}>{row.daysRemaining} days</span>
                        </TableCell>
                        <TableCell className="px-6 text-[length:var(--text-sm)]">{row.assignedMhe}</TableCell>
                        <TableCell className="px-6">
                          <StatusBadge status={row.status as "active" | "expiring" | "expired"} />
                        </TableCell>
                        <TableCell className="px-6">
                          <button
                            onClick={() => {
                              setSelectedOperatorForLicense(row.operatorId);
                              setIsLicenseDrawerOpen(true);
                            }}
                            className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[color:var(--primary)] hover:underline"
                          >
                            License Renew
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

        </div>
      )}

      {/* ── Variation 2: IRDS-Based Fleet Management Dashboard ── */}
      {activeTab === "variation2" && (
        <div className="space-y-6">
          {/* ── Header ── */}
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-1">Fleet Management Dashboard</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Real-time equipment health, compliance, and maintenance tracking</p>
          </div>

          {/* ── Row 1: KPI Cards (IRDS Compressed - Max 3 Lines) ── */}
          <div className="grid grid-cols-4 gap-6">
            {/* KPI 1: Fleet Size */}
            <KpiCard
              icon={Truck}
              value="42"
              contextLine="78% operational • Safety: 92%"
              onClick={() => setExpandedKpi("fleet")}
              accentColor="#16a34a"
            />

            {/* KPI 2: Fleet Utilization */}
            <KpiCard
              icon={Activity}
              value="78%"
              contextLine="Active equipment • 4 in maintenance"
              onClick={() => setExpandedKpi("health")}
              accentColor="#2563EB"
            />

            {/* KPI 3: Equipment Health */}
            <KpiCard
              icon={ShieldCheck}
              value="92%"
              contextLine="Safety score • Sensor health: 95%"
              onClick={() => setExpandedKpi("inspection")}
              accentColor="#059669"
            />

            {/* KPI 4: Warranty Status */}
            <KpiCard
              icon={AlertTriangle}
              value="5"
              contextLine="Expiring soon • Requires attention"
              onClick={() => setExpandedKpi("warranty")}
              accentColor="#ef4444"
            />
          </div>

          {/* ── Row 2: Analysis Charts ── */}
          {/* ── Row 2: Equipment Health & Component Failure Distribution ── */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Fleet Equipment Health Distribution (Donut Chart) */}
            <Card className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden">
              <CardHeader className="pb-4 border-b border-[var(--border)]">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
                      Fleet Equipment Health
                    </CardTitle>
                    <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                      Warranty and maintenance status
                    </CardDescription>
                  </div>
                  <div className="w-[180px] flex-shrink-0">
                    <Select value={selectedHealthEquipment} onValueChange={setSelectedHealthEquipment}>
                      <SelectTrigger className="h-8 text-xs w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Overall">Overall</SelectItem>
                        <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                        <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                        <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center p-6 pb-0">
                <div style={{ width: "220px", height: "220px", position: "relative" }}>
                  <ChartContainer config={donutChartConfig} className="w-full h-full">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        stroke="#ffffff" strokeWidth={2}
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(maxIndex)}
                      >
                        {(equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colorMap[entry.name] || COLORS.noIssues} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div
                    style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center", pointerEvents: "none",
                    }}
                  >
                    <div className="text-xl font-semibold text-[var(--foreground)]">
                      {(equipmentHealthDataByType[selectedHealthEquipment] || equipmentHealthData).reduce((sum, item) => sum + item.value, 0)}
                    </div>
                    <div className="text-[10px] text-[var(--muted-foreground)] mt-1">
                      Total MHEs
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Legend & Insight Footer - Full Width */}
              <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px", zIndex: 10 }}>
                {/* Legend */}
                <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                    {[
                      { name: "No Issues", color: COLORS.noIssues },
                      { name: "Healthy (Green)", color: COLORS.healthy },
                      { name: "Warning (Amber)", color: COLORS.warning },
                      { name: "Critical (Red)", color: COLORS.critical },
                    ].map(item => (
                      <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "8px", height: "8px", backgroundColor: item.color, borderRadius: "2px" }}></div>
                        <span style={{ fontSize: "11px", color: "#64748B" }}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insight Callout */}
                {fleetHealthInsights && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0, lineHeight: "1.4" }}>
                      <span style={{ fontWeight: "600" }}>{fleetHealthInsights.topStatus}</span> status reported most, mainly by <span style={{ fontWeight: "600" }}>{fleetHealthInsights.secondaryStatus}</span>
                    </p>
                    <p style={{ fontSize: "12px", fontWeight: "400", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>
                      {fleetHealthInsights.equipmentFilter === "Overall" ? "All Equipment Types" : fleetHealthInsights.equipmentFilter}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Right: Component Failure Distribution (Stacked Bar Chart) */}
            <Card className="col-span-6 shadow-none border-[var(--border)] flex flex-col overflow-hidden">
              <CardHeader className="pb-4 border-b border-[var(--border)]">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
                      Component Failure Distribution
                    </CardTitle>
                    <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                      Inspection findings by component
                    </CardDescription>
                  </div>
                  <div className="w-[180px] flex-shrink-0">
                    <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                      <SelectTrigger className="h-8 text-xs w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                        <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                        <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6 pb-0 overflow-x-auto">
                <ChartContainer config={failureChartConfig} className="min-w-[600px] h-64">
                  <BarChart data={currentFailureData} margin={{ top: 16, right: 12, left: 12, bottom: 48 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="part" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: "Count", angle: -90, position: "center", dx: -10, fontSize: 11, fontWeight: 600, fill: "#64748B", textAnchor: "middle" }} />
                    <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
                    <Bar dataKey="No Issues" stackId="a" fill={COLORS.noIssues} />
                    <Bar dataKey="Green" stackId="a" fill={COLORS.healthy} />
                    <Bar dataKey="Amber" stackId="a" fill={COLORS.warning} />
                    <Bar dataKey="Red" stackId="a" fill={COLORS.critical} />
                  </BarChart>
                </ChartContainer>
              </CardContent>

              {/* Legend & Insight Footer - Full Width */}
              <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px", zIndex: 10 }}>
                {/* Legend */}
                <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                    {[
                      { name: "No Issues", color: COLORS.noIssues },
                      { name: "Healthy (Green)", color: COLORS.healthy },
                      { name: "Warning (Amber)", color: COLORS.warning },
                      { name: "Critical (Red)", color: COLORS.critical },
                    ].map(item => (
                      <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "8px", height: "8px", backgroundColor: item.color, borderRadius: "2px" }}></div>
                        <span style={{ fontSize: "11px", color: "#64748B" }}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insight Callout */}
                {componentFailureInsights && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#1F2937", margin: 0, lineHeight: "1.4" }}>
                      <span style={{ fontWeight: "600" }}>{componentFailureInsights.topComponent}</span> reported most failures, mainly by <span style={{ fontWeight: "600" }}>{componentFailureInsights.severityLabel}</span>
                    </p>
                    <p style={{ fontSize: "12px", fontWeight: "400", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>
                      {componentFailureInsights.equipmentFilter}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* ── Row 3: Inspection Attention & Severity Timeline ── */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Inspector-wise Inspection Breakdown */}
            <MachinesRequiringInspectionAttention />

            {/* Right: Inspection Severity Timeline */}
            <div className="col-span-6">
              <MheInspectionSeverityTimeline />
            </div>
          </div>

          {/* ── Row 4: Warranty Expiry Monitoring ── */}
          <Card className="col-span-12 shadow-none border-[var(--border)]">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
                    Warranty Expiry Status
                  </CardTitle>
                  <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                    Equipment with expiring or expired warranties
                  </CardDescription>
                </div>
                <div className="w-[180px] flex-shrink-0">
                  <Select value={selectedWarrantyFilter} onValueChange={setSelectedWarrantyFilter}>
                    <SelectTrigger className="h-8 text-xs w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Equipment</SelectItem>
                      <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                      <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                      <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
                      <SelectItem value="Order Picker">Order Picker</SelectItem>
                      <SelectItem value="Tow Tractor">Tow Tractor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-[var(--muted-foreground)] border-b border-[var(--border)]">
                    <tr>
                      <th className="text-left p-4 font-medium">MHE Type</th>
                      <th className="text-left p-4 font-medium">MHE ID</th>
                      <th className="text-left p-4 font-medium">License Expiry</th>
                      <th className="text-right p-4 font-medium">Days Remaining</th>
                      <th className="text-center p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warrantyExpiryData
                      .filter(row =>
                        (row.status === "expiring" || row.status === "expired") &&
                        (selectedWarrantyFilter === "All" || row.mheType === selectedWarrantyFilter)
                      )
                      .slice(0, 5)
                      .map((row, idx) => (
                        <tr key={idx} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/50 transition-colors">
                          <td className="p-4 text-[var(--foreground)]">{row.mheType}</td>
                          <td className="p-4 font-mono text-[var(--foreground)]">{row.mheId}</td>
                          <td className="p-4 text-[var(--foreground)]">
                            {new Date(row.licenseExpiry).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-4 text-right text-[var(--foreground)] font-semibold">{row.daysRemaining}</td>
                          <td className="p-4 text-center">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              row.status === "expired"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100"
                            }`}>
                              {row.status === "expired" ? "Expired" : "Expiring"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedMheForRenewal(row.mheId);
                                setIsRenewDrawerOpen(true);
                              }}
                              className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                            >
                              Renew
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ── Expand Panels (following IRDS pattern) ── */}

          {/* Fleet Status Panel (KPI 1: Fleet Size) */}
          <MheInsightPanel
            isOpen={expandedKpi === "fleet"}
            onClose={() => setExpandedKpi(null)}
            title="Fleet Status Analysis"
            mainValue="42"
            subtitle="Total units • 78% operational"
            sections={[
              {
                heading: "Equipment Distribution",
                content: (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--foreground)]">Electric Forklift</span>
                      <span className="font-semibold">18 units</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--foreground)]">Reach Truck</span>
                      <span className="font-semibold">12 units</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--foreground)]">Pallet Jack</span>
                      <span className="font-semibold">12 units</span>
                    </div>
                  </div>
                ),
              },
              {
                heading: "Fleet Status Summary",
                content: (
                  <p className="text-xs text-[var(--foreground)]">
                    Active: 33 • Maintenance: 4 • Idle: 5 • Utilization: <span className="font-semibold">78%</span>
                  </p>
                ),
              },
              {
                heading: "Operational Insight",
                content: (
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Fleet is operating at optimal capacity with healthy utilization. 4 units in preventive maintenance is within acceptable range.
                  </p>
                ),
              },
              {
                heading: "Status Breakdown",
                content: (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">All Good</span>
                      <span className="font-semibold">28 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Minor Issues</span>
                      <span className="font-semibold">10 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Pending Issues</span>
                      <span className="font-semibold">4 units</span>
                    </div>
                  </div>
                ),
              },
              {
                heading: "Recommended Actions",
                content: (
                  <ul className="space-y-2 text-xs">
                    <li>→ Complete maintenance on 4 units this week</li>
                    <li>→ Schedule inspections for 10 units with minor issues</li>
                    <li>→ Monitor utilization trends weekly</li>
                  </ul>
                ),
              },
            ]}
          />

          {/* Equipment Health Panel (KPI 2: Utilization / Equipment Health) */}
          <MheInsightPanel
            isOpen={expandedKpi === "health"}
            onClose={() => setExpandedKpi(null)}
            title="Equipment Health Analysis"
            mainValue="92%"
            subtitle="Safety score • Inspection findings overview"
            sections={[
              {
                heading: "Safety Status",
                content: (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Units with no issues</span>
                      <span className="font-semibold">20 (48%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Healthy (green)</span>
                      <span className="font-semibold">12 (29%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Warning (amber)</span>
                      <span className="font-semibold">6 (14%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Critical (red)</span>
                      <span className="font-semibold">4 (10%)</span>
                    </div>
                  </div>
                ),
              },
              {
                heading: "Sensor Health Summary",
                content: (
                  <p className="text-xs text-[var(--foreground)]">
                    Active sensors: 40 of 42 • Coverage: <span className="font-semibold">95%</span> • Last sync: 2 mins ago
                  </p>
                ),
              },
              {
                heading: "Health Insight",
                content: (
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Overall health is strong with 77% of equipment in good or excellent condition. Immediate attention needed for 4 units in critical status.
                  </p>
                ),
              },
              {
                heading: "Critical Equipment",
                content: (
                  <div className="space-y-2">
                    {[
                      { mhe: "MHE-025", issues: 3, status: "Critical" },
                      { mhe: "MHE-001", issues: 2, status: "Critical" },
                      { mhe: "MHE-012", issues: 4, status: "Warning" },
                      { mhe: "MHE-004", issues: 1, status: "Warning" },
                    ].map((item) => (
                      <div key={item.mhe} className="flex justify-between text-xs p-2 border-b border-[var(--border)] hover:bg-[var(--muted)]/20">
                        <div>
                          <p className="font-mono font-semibold text-[var(--foreground)]">{item.mhe}</p>
                          <p className="text-[10px] text-[var(--muted-foreground)]">{item.status}</p>
                        </div>
                        <span className="font-semibold">{item.issues} finding{item.issues !== 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                heading: "Recommended Actions",
                content: (
                  <ul className="space-y-2 text-xs">
                    <li>→ Service 4 critical units immediately</li>
                    <li>→ Schedule inspections for 6 warning units</li>
                    <li>→ Verify sensor connectivity on 2 offline devices</li>
                  </ul>
                ),
              },
              {
                heading: "Actions",
                content: (
                  <ul className="space-y-2 text-xs">
                    <li>→ <span className="font-semibold">TODAY</span> - Schedule maintenance for MHE-003 (HIGH PRIORITY)</li>
                    <li>→ <span className="font-semibold">ASAP</span> - Reassign load to operational MHEs</li>
                    <li>→ <span className="font-semibold">TRACK</span> - Update maintenance records & monitor daily</li>
                  </ul>
                ),
              },
            ]}
          />

          {/* Fleet Status Panel */}
          <MheInsightPanel
            isOpen={expandedKpi === "fleet"}
            onClose={() => setExpandedKpi(null)}
            title="Fleet Status Overview"
            mainValue="42"
            subtitle="38 operational • 4 in maintenance"
            sections={[
              {
                heading: "Primary Graph",
                content: (
                  <div className="bg-[var(--muted)]/20 rounded p-4 text-center text-xs text-[var(--muted-foreground)]">
                    Fleet capacity utilization over time <br /> (30-day trend)
                  </div>
                ),
              },
              {
                heading: "Summary",
                content: (
                  <p className="text-xs text-[var(--foreground)]">
                    Total: 42 units • Operational: 38 (90.5%) • Maintenance: 4 • Average age: 4.2 years
                  </p>
                ),
              },
              {
                heading: "Equipment Distribution",
                content: (
                  <div className="space-y-2 text-xs">
                    {[
                      { type: "Pallet Jack", count: 15, pct: "35.7%" },
                      { type: "Electric Forklift", count: 12, pct: "28.6%" },
                      { type: "Reach Truck", count: 8, pct: "19%" },
                      { type: "Stacker", count: 7, pct: "16.7%" },
                    ].map((item) => (
                      <div key={item.type} className="flex justify-between">
                        <span className="text-[var(--foreground)]">{item.type}</span>
                        <span className="font-semibold">{item.count} ({item.pct})</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                heading: "Insight",
                content: (
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Fleet operational at 90%+ capacity. Pallet Jacks represent largest fleet segment. No critical outages. Maintenance schedule is on track with 4 units in preventive services.
                  </p>
                ),
              },
              {
                heading: "Maintenance Schedule",
                content: (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Preventive Services</span>
                      <span className="font-semibold">2 scheduled (this week)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Warranty Inspections</span>
                      <span className="font-semibold">1 pending</span>
                    </div>
                  </div>
                ),
              },
              {
                heading: "Actions",
                content: (
                  <ul className="space-y-2 text-xs">
                    <li>→ <span className="font-semibold">Continue</span> scheduled maintenance - 2 units this week</li>
                    <li>→ <span className="font-semibold">Complete</span> warranty inspection (pending)</li>
                    <li>→ <span className="font-semibold">Monitor</span> Pallet Jacks for wear patterns</li>
                  </ul>
                ),
              },
            ]}
          />

          {/* Zone Analysis Panel */}
          <MheInsightPanel
            isOpen={expandedKpi === "zones"}
            onClose={() => setExpandedKpi(null)}
            title="Zone Impact Analysis"
            mainValue="Aisle 1"
            subtitle="18 events • 3x above average"
            sections={[
              {
                heading: "Primary Graph",
                content: (
                  <div className="bg-[var(--muted)]/20 rounded p-4 text-center text-xs text-[var(--muted-foreground)]">
                    Zone impact distribution across 5 zones <br /> (Events and risk density)
                  </div>
                ),
              },
              {
                heading: "Summary",
                content: (
                  <p className="text-xs text-[var(--foreground)]">
                    Highest impact zone: Aisle 1 • Impact density: <span className="font-semibold">3x above average</span> • Zones analyzed: 5
                  </p>
                ),
              },
              {
                heading: "Zone Breakdown",
                content: (
                  <div className="space-y-3">
                    {[
                      { zone: "Aisle 1", events: 18, pct: "12.7%" },
                      { zone: "Loading Bay", events: 12, pct: "8.5%" },
                      { zone: "Rack R12", events: 8, pct: "5.6%" },
                      { zone: "Storage Area", events: 5, pct: "3.5%" },
                      { zone: "Aisle 2", events: 4, pct: "2.8%" },
                    ].map((item) => (
                      <div key={item.zone} className="text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="text-[var(--foreground)]">{item.zone}</span>
                          <span className="font-semibold">{item.events} events</span>
                        </div>
                        <div className="w-full bg-[var(--muted)] rounded h-1.5 overflow-hidden">
                          <div
                            style={{
                              height: "100%",
                              width: item.pct,
                              backgroundColor: item.zone === "Aisle 1" ? "#ef4444" : "#2563EB",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                heading: "Insight",
                content: (
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Aisle 1 is a significant risk zone with 3x more impact than average. Pattern is consistent across all MHE types, suggesting environmental or layout factors rather than equipment-specific issues.
                  </p>
                ),
              },
              {
                heading: "Risk Factors",
                content: (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">High Traffic Volume</span>
                      <span className="font-semibold">Confirmed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Equipment Density</span>
                      <span className="font-semibold">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]">Layout Constraints</span>
                      <span className="font-semibold">Likely</span>
                    </div>
                  </div>
                ),
              },
              {
                heading: "Actions",
                content: (
                  <ul className="space-y-2 text-xs">
                    <li>→ <span className="font-semibold">Improve</span> Aisle 1 layout and clearance spacing</li>
                    <li>→ <span className="font-semibold">Increase</span> safety markings and barrier visibility</li>
                    <li>→ <span className="font-semibold">Implement</span> speed restrictions during peak hours</li>
                    <li>→ <span className="font-semibold">Schedule</span> equipment repositioning review</li>
                  </ul>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* ── Variation 3: Command Center Overview ── */}
      {activeTab === "variation3" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Critical Alert Banner */}
          <div className="col-span-12">
            <CriticalIssuesBanner count={11} trendNote="↑ 3 new today" />
          </div>

          {/* Section label */}
          <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
            <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
              FMS · COMMAND CENTER
            </span>
          </div>

          {/* Row 2 — 4 KPI cards */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
            <KpiCardV3 label="Fleet Size"         value="42"  description="Total machines in operation" icon={Truck} />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
            <KpiCardV3 label="Fleet Utilization"  value="78%" description="Percentage active equipment" icon={Activity} />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
            <KpiCardV3 label="Fleet Safety Score" value="92%" description="Safety performance rating"   icon={ShieldCheck} />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
            <KpiCardV3 label="Sensor Health"      value="95%" description="Active sensors percentage"   icon={Wifi} />
          </div>

          {/* Section label */}
          <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
            <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
              FMS · MEPS
            </span>
          </div>

          {/* Row 3 — Monitoring strip */}
          <div className="col-span-12">
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", height: "154px" }}>
              <div className="grid grid-cols-1 xl:grid-cols-4 divide-y xl:divide-y-0 xl:divide-x" style={{ height: "100%", borderColor: "#e2e8f0" }}>
                <MonitoringSplitCardV3
                  icon={ShieldAlert}
                  title="Expiry Monitoring"
                  metrics={[
                    { label: "Operator License", value: "04", suffix: "/ 12" },
                    { label: "MHE Warranty",     value: "04", suffix: "/ 40" },
                  ]}
                  actionLabel="Renew All"
                />
                <MonitoringSplitCardV3
                  icon={ClipboardCheck}
                  title="Inspection Performance"
                  metrics={[
                    { label: "Performed", value: "124" },
                    { label: "Skipped",   value: "38"  },
                  ]}
                  footerCaption="76% completion rate this week"
                />
                <MonitoringCardV3
                  icon={Trophy}
                  title="Top Operator Productivity :"
                  highlight="Abhishek Sharma"
                  value="94.55"
                  suffix="Score"
                  progress={91}
                  caption="Ranked by productivity score"
                />
                <MonitoringCardV3
                  icon={Award}
                  title="Top MHE Productivity :"
                  highlight="MHE 05"
                  value="90"
                  suffix="Score"
                  progress={84}
                  caption="Ranked by productivity score"
                />
              </div>
            </div>
          </div>

          {/* Section label */}
          <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
            <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
              FMS · RTSS
            </span>
          </div>

          {/* Row 4 — Severity trend + Fleet status */}
          <div className="col-span-12 xl:col-span-8 flex min-h-[422px]">
            <SeverityTrendLineV3 />
          </div>
          <div className="col-span-12 xl:col-span-4 flex min-h-[422px]">
            <ImpactDonutV3 />
          </div>

          {/* Section label */}
          <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
            <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
              COMMAND CENTER · RTSS · IMDS
            </span>
          </div>

          {/* Row 5 — 3 Operational widgets */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 flex min-h-[360px]">
            <MachinesAttentionV3 />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-4 flex min-h-[360px]">
            <EquipmentHealthCardV3 />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-4 flex min-h-[360px]">
            <ImpactTrendRankedV3 />
          </div>

          {/* Section label */}
          <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
            <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
              COMMAND CENTER · IMDS
            </span>
          </div>

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
      )}

      {/* Shared drawers — rendered once at root, work across all variations */}
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
