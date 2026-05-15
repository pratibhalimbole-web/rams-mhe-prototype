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
import { MheInspectionSeverityTimeline } from "../../components/widgets/MheInspectionSeverityTimeline";
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
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);
  const [selectedInspectionMhe, setSelectedInspectionMhe] = useState("Forklift");
  const [selectedInspectionOem, setSelectedInspectionOem] = useState("all");
  const [fleetOem,  setFleetOem]  = useState("all");
  const [fleetType, setFleetType] = useState("all");
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
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px 18px", height: "100%", boxSizing: "border-box" }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>{label}</p>
                <p style={{ fontSize: "32px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{sub}</p>
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>Today's Activity</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Real-time fleet engagement</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <RefreshCw size={13} style={{ color: "#1b59f8" }} />
                <span style={{ fontSize: "10px", fontStyle: "italic", color: "#1b59f8", whiteSpace: "nowrap" }}>Last Refresh 02:02:00</span>
              </div>
            </div>
            <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col" style={{ gap: "20px" }}>

              {/* Section 1 — Fleet Status */}
              <div>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 10px" }}>
                  FLEET STATUS: <span style={{ color: "#0f172a" }}>42 total MHEs</span>
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: "0" }}>
                  {([
                    { icon: CheckCircle2, label: "ACTIVE",      value: 28, pct: "67%", iconColor: "#16a34a", iconBg: "#f0fdf4" },
                    { icon: Wrench,       label: "MAINTENANCE", value: 4,  pct: "10%", iconColor: "#f59e0b", iconBg: "#fffbeb" },
                    { icon: MinusCircle,  label: "IDLE",        value: 10, pct: "24%", iconColor: "#94a3b8", iconBg: "#f1f5f9" },
                  ] as { icon: React.ElementType; label: string; value: number; pct: string; iconColor: string; iconBg: string }[]).flatMap(({ icon: Icon, label, value, iconColor, iconBg }, i, arr) => [
                    <div key={label} style={{ padding: "4px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={13} style={{ color: iconColor }} />
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.06em" }}>{label}</span>
                      </div>
                      <p style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1 }}>{value}</p>
                    </div>,
                    ...(i < arr.length - 1 ? [<div key={`sep-${i}`} style={{ background: "#e2e8f0" }} />] : []),
                  ])}
                </div>
              </div>

              {/* Section 2 — Productivity Metrics */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 12px" }}>PRODUCTIVITY METRICS</p>
                {([
                  { label: "Trips Today",   value: "342",   sub: "↑ +18 vs yesterday" },
                  { label: "Pallets Moved", value: "1,284", sub: "Across 4 zones"      },
                  { label: "Fleet Hours",   value: "186h",  sub: "Total time logged"   },
                ] as { label: string; value: string; sub: string }[]).map(({ label, value, sub }, i, arr) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0" }}>{sub}</p>
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>{value}</span>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* ── TRIP LOAD BREAKDOWN ── */}
          <Card className="col-span-12 xl:col-span-4 shadow-none border-[var(--border)] flex flex-col min-h-[422px]">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>Trip Load Breakdown</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>Loaded vs empty trips · last 30 days</span>
              </div>
            </div>
            <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col" style={{ gap: "20px" }}>

              {/* Section 1 — Trip Overview */}
              <div>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 10px" }}>TRIP OVERVIEW</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
                  <div style={{ paddingRight: "20px" }}>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 8px", fontWeight: 500 }}>Total Trips</p>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", lineHeight: 1, margin: "0 0 8px" }}>342</p>
                    <p style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500, margin: 0 }}>Across all zones</p>
                  </div>
                  <div style={{ background: "#e2e8f0" }} />
                  <div style={{ paddingLeft: "20px" }}>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 8px", fontWeight: 500 }}>Load Efficiency</p>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", lineHeight: 1, margin: "0 0 8px" }}>73%</p>
                    <p style={{ fontSize: "10px", color: "#16a34a", fontWeight: 500, margin: 0 }}>↑ Exceeds 65% target</p>
                  </div>
                </div>
              </div>

              {/* Section 2 — Load Distribution */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 10px" }}>LOAD DISTRIBUTION</p>

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
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8" }}>{pct}</span>
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
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", margin: 0 }}>{label}</p>
                          <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0" }}>{sub} · {count} trips</p>
                        </div>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>{pct}</span>
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a", whiteSpace: "nowrap" }}>
                  Inspection Health
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b", whiteSpace: "nowrap" }}>
                  Severity distribution by MHE type
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Select value={selectedInspectionOem} onValueChange={setSelectedInspectionOem}>
                  <SelectTrigger style={{ height: "32px", width: "auto", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "#0f172a", fontFamily: "Inter, sans-serif" }}>
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
                  <SelectTrigger style={{ height: "32px", width: "auto", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "#0f172a", fontFamily: "Inter, sans-serif" }}>
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
                    <span style={{ fontSize: "30px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.75px", lineHeight: "36px" }}>42</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 400 }}>
                    {selectedInspectionMhe} MHEs{selectedInspectionOem !== "all" ? ` · ${selectedInspectionOem === "toyota-industries" ? "Toyota Industries" : selectedInspectionOem.charAt(0).toUpperCase() + selectedInspectionOem.slice(1)}` : ""}
                  </span>
                </div>
                {/* Parts Comparison */}
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 10px" }}>PARTS COMPARISON</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: "10px", columnGap: "8px" }}>
                    {([
                      { sub: "Most Red",   value: "Battery", dot: "#ef4444" },
                      { sub: "Most Amber", value: "Tyres",   dot: "#f59e0b" },
                      { sub: "Most Green", value: "Light",   dot: "#16a34a" },
                    ] as { sub: string; value: string; dot: string }[]).map(({ sub, value, dot }) => (
                      <div key={sub}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, flexShrink: 0 }} />
                          <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>{sub}</p>
                        </div>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#0f172a", margin: 0 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2 — Severity Distribution */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: 0 }}>SEVERITY DISTRIBUTION</p>
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
                        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={13} style={{ color }} />
                        </div>
                        <span style={{ fontSize: "9px", fontWeight: 600, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
                      </div>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "#64748b", letterSpacing: "-0.027em" }}>{count}</span>
                    </div>
                    {/* Insight: MHE ID | Part inline */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 400 }}>MHE ID: </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{insight.mheId}</span>
                      <span style={{ fontSize: "10px", color: "#64748b" }}>|</span>
                      <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 400 }}>Part: </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{insight.part}</span>
                    </div>
                  </div>
                ))}
                </div>
              </div>

            </CardContent>

          </Card>

          {/* ── FLEET COMPOSITION ── */}
          {(() => {
            type FleetRow = { label: string; count: number; color: string };
            const FLEET_DATA: Record<string, { total: number; types: FleetRow[] }> = { // eslint-disable-line
              "all|all":                    { total: 42, types: [{ label: "Forklift", count: 18, color: "#1B59F8" }, { label: "Reach Truck", count: 12, color: "#4C7DFF" }, { label: "Pallet Jack", count: 8,  color: "#8FB2FF" }, { label: "Stacker", count: 4, color: "#C9DBFF" }] },
              "forklift|all":               { total: 18, types: [{ label: "Forklift", count: 18, color: "#1B59F8" }] },
              "reach-truck|all":            { total: 12, types: [{ label: "Reach Truck", count: 12, color: "#4C7DFF" }] },
              "pallet-jack|all":            { total: 8,  types: [{ label: "Pallet Jack", count: 8,  color: "#8FB2FF" }] },
              "stacker|all":                { total: 4,  types: [{ label: "Stacker", count: 4, color: "#C9DBFF" }] },
              "all|toyota":                 { total: 20, types: [{ label: "Forklift", count: 8,  color: "#1B59F8" }, { label: "Reach Truck", count: 10, color: "#4C7DFF" }, { label: "Stacker", count: 2, color: "#C9DBFF" }] },
              "forklift|toyota":            { total: 8,  types: [{ label: "Forklift", count: 8,  color: "#1B59F8" }] },
              "reach-truck|toyota":         { total: 10, types: [{ label: "Reach Truck", count: 10, color: "#4C7DFF" }] },
              "all|toyota-industries":      { total: 5,  types: [{ label: "Pallet Jack", count: 5,  color: "#8FB2FF" }] },
              "pallet-jack|toyota-industries": { total: 5, types: [{ label: "Pallet Jack", count: 5, color: "#8FB2FF" }] },
              "all|tata":                   { total: 8,  types: [{ label: "Forklift", count: 5,  color: "#1B59F8" }, { label: "Stacker", count: 3, color: "#C9DBFF" }] },
              "forklift|tata":              { total: 5,  types: [{ label: "Forklift", count: 5,  color: "#1B59F8" }] },
              "all|mahindra":               { total: 6,  types: [{ label: "Reach Truck", count: 2, color: "#4C7DFF" }, { label: "Stacker", count: 4, color: "#C9DBFF" }] },
              "stacker|mahindra":           { total: 4,  types: [{ label: "Stacker", count: 4,  color: "#C9DBFF" }] },
              "all|raymond":                { total: 3,  types: [{ label: "Forklift", count: 2,  color: "#1B59F8" }, { label: "Pallet Jack", count: 1, color: "#8FB2FF" }] },
              "pallet-jack|raymond":        { total: 1,  types: [{ label: "Pallet Jack", count: 1, color: "#8FB2FF" }] },
            };
            const key = `${fleetType}|${fleetOem}`;
            const fd  = FLEET_DATA[key] ?? FLEET_DATA[`all|${fleetOem}`] ?? FLEET_DATA["all|all"];
            const filterStyle2: React.CSSProperties = { height: "32px", width: "auto", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0 13px", fontSize: "10px", color: "#0f172a", fontFamily: "Inter, sans-serif", fontWeight: 400 };
            return (
              <Card className="col-span-12 xl:col-span-4 shadow-none border-[var(--border)] flex flex-col min-h-[422px]">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a" }}>Fleet Composition</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b" }}>MHEs by type</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <Select value={fleetOem} onValueChange={setFleetOem}>
                      <SelectTrigger style={filterStyle2}><SelectValue placeholder="All OEMs" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All OEMs</SelectItem>
                        <SelectItem value="toyota">Toyota</SelectItem>
                        <SelectItem value="toyota-industries">Toyota Industries</SelectItem>
                        <SelectItem value="tata">TATA</SelectItem>
                        <SelectItem value="mahindra">Mahindra</SelectItem>
                        <SelectItem value="raymond">Raymond</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={fleetType} onValueChange={setFleetType}>
                      <SelectTrigger style={filterStyle2}><SelectValue placeholder="All Types" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="forklift">Forklift</SelectItem>
                        <SelectItem value="reach-truck">Reach Truck</SelectItem>
                        <SelectItem value="pallet-jack">Pallet Jack</SelectItem>
                        <SelectItem value="stacker">Stacker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col justify-between">
                  {/* Donut */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <div style={{ position: "relative" }}>
                      <PieChart width={200} height={200}>
                        <Pie data={fd.types.map(t => ({ value: t.count }))} cx={96} cy={96} innerRadius={66} outerRadius={86} startAngle={90} endAngle={-270} paddingAngle={0} dataKey="value" strokeWidth={0}>
                          {fd.types.map(({ label, color }) => <Cell key={label} fill={color} />)}
                        </Pie>
                      </PieChart>
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                        <p style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1 }}>{fd.total}</p>
                        <p style={{ fontSize: "10px", color: "#94a3b8", margin: "4px 0 0" }}>MHEs</p>
                      </div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div>
                    <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "12px" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "14px", columnGap: "8px" }}>
                      {fd.types.map(({ label, count, color }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{label}</span>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* ── INSPECTIONS BY MHE TYPE ── */}
          <Card className="col-span-12 xl:col-span-4 shadow-none border-[var(--border)] flex flex-col min-h-[422px]">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a" }}>Inspections by MHE Type</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b" }}>Severity distribution per type · last 30 days</span>
              </div>
            </div>
            <CardContent className="flex-1 px-5 pt-4 pb-4 flex flex-col" style={{ gap: "12px" }}>
              {/* Legend */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {([{ label: "Red", color: "#ef4444" }, { label: "Amber", color: "#f59e0b" }, { label: "Green", color: "#16a34a" }]).map(({ label, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: "10px", color: "#64748b" }}>{label}</span>
                  </div>
                ))}
              </div>
              {/* Bar chart */}
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Reach Truck", Red: 8,  Amber: 5,  Green: 22 },
                      { name: "Forklift",    Red: 2,  Amber: 3,  Green: 20 },
                      { name: "Pallet Jack", Red: 2,  Amber: 3,  Green: 23 },
                      { name: "Stacker",     Red: 1,  Amber: 2,  Green: 11 },
                      { name: "Order Picker",Red: 0,  Amber: 2,  Green: 8  },
                      { name: "VNA Truck",   Red: 0,  Amber: 1,  Green: 5  },
                    ]}
                    barSize={24}
                    margin={{ top: 4, right: 0, left: -28, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px", border: "1px solid #e2e8f0" }} cursor={{ fill: "#f8fafc" }} />
                    <Bar dataKey="Red"   stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Amber" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Green" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* ── TOP PERFORMING OPERATORS ── */}
          <Card className="col-span-12 xl:col-span-4 shadow-none border-[var(--border)] flex flex-col min-h-[422px]">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px 14px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0, height: "81px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "12px", lineHeight: "18px", color: "#0f172a" }}>Top Performing Operators</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "15px", color: "#64748b" }}>Composite score · last 7 days</span>
              </div>
            </div>
            <CardContent className="flex-1 px-5 pt-4 pb-5 flex flex-col justify-between">
              {([
                { rank: 1, initials: "RK", name: "Rajesh Kumar",  score: 92, rankColor: "#f59e0b" },
                { rank: 2, initials: "SP", name: "Suresh Patil",  score: 88, rankColor: "#f59e0b" },
                { rank: 3, initials: "VS", name: "Vikram Singh",  score: 85, rankColor: "#f59e0b" },
                { rank: 4, initials: "PN", name: "Priya Nair",    score: 80, rankColor: "#94a3b8" },
                { rank: 5, initials: "MS", name: "Manoj Sharma",  score: 76, rankColor: "#94a3b8" },
              ]).map(({ rank, initials, name, score, rankColor }, i, arr) => {
                const barColor = rank <= 3 ? "#16a34a" : "#1B59F8";
                return (
                  <div key={name} style={{ padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: rankColor, width: "20px", flexShrink: 0 }}>#{rank}</span>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed" }}>{initials}</span>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "#374151", flex: 1 }}>{name}</span>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: barColor }}>{score}</span>
                    </div>
                    <div style={{ marginLeft: "30px", height: "4px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${score}%`, height: "100%", background: barColor, borderRadius: "3px" }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

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
