import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSidebar } from "../../components/layout/SidebarLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";
import { Search, Filter, FileDown, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, ArrowRight, X, ChevronDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { getAllRacks, initializeStabilityData, type RackData, type StabilityStatus } from "../../utils/stabilityData";

// Mock sparkline data for trends
const getTrendData = (variant: "total" | "stable" | "conditional" | "not-stable") => {
  switch (variant) {
    case "total":
      return [
        { value: 28 },
        { value: 30 },
        { value: 29 },
        { value: 32 },
        { value: 35 },
      ];
    case "stable":
      return [
        { value: 9 },
        { value: 10 },
        { value: 11 },
        { value: 11 },
        { value: 13 },
      ];
    case "conditional":
      return [
        { value: 8 },
        { value: 9 },
        { value: 9 },
        { value: 9 },
        { value: 10 },
      ];
    case "not-stable":
      return [
        { value: 11 },
        { value: 11 },
        { value: 9 },
        { value: 12 },
        { value: 9 },
      ];
  }
};

// Mock data for demonstration
const mockRacks: RackData[] = [
  {
    id: "1",
    rackId: "RCK-A-001",
    layout: "Warehouse A - Aisle 1",
    oem: "OEM1",
    totalIssues: 12,
    redIssues: 3,
    amberIssues: 5,
    greenIssues: 4,
    lastInspection: "2026-03-08",
    inspector: "Inspector1",
    status: "Not Stable",
  },
  {
    id: "2",
    rackId: "RCK-A-002",
    layout: "Warehouse A - Aisle 1",
    oem: "OEM2",
    totalIssues: 8,
    redIssues: 0,
    amberIssues: 4,
    greenIssues: 4,
    lastInspection: "2026-03-07",
    inspector: "Inspector2",
    status: "Conditional",
  },
  {
    id: "3",
    rackId: "RCK-A-003",
    layout: "Warehouse A - Aisle 2",
    oem: "OEM3",
    totalIssues: 5,
    redIssues: 0,
    amberIssues: 1,
    greenIssues: 4,
    lastInspection: "2026-03-09",
    inspector: "Inspector3",
    status: "Stable",
  },
  {
    id: "4",
    rackId: "RCK-B-001",
    layout: "Warehouse B - Aisle 1",
    oem: "OEM4",
    totalIssues: 15,
    redIssues: 5,
    amberIssues: 7,
    greenIssues: 3,
    lastInspection: "2026-03-06",
    inspector: "Inspector4",
    status: "Not Stable",
  },
  {
    id: "5",
    rackId: "RCK-B-002",
    layout: "Warehouse B - Aisle 2",
    oem: "OEM5",
    totalIssues: 3,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 3,
    lastInspection: "2026-03-10",
    inspector: "Inspector5",
    status: "Stable",
  },
  {
    id: "6",
    rackId: "RCK-C-001",
    layout: "Warehouse C - Aisle 1",
    oem: "OEM6",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "Inspector6",
    status: "Not Evaluated",
  },
  {
    id: "7",
    rackId: "RCK-A-004",
    layout: "Warehouse A - Aisle 2",
    oem: "OEM7",
    totalIssues: 6,
    redIssues: 1,
    amberIssues: 2,
    greenIssues: 3,
    lastInspection: "2026-03-09",
    inspector: "Inspector7",
    status: "Conditional",
  },
  {
    id: "8",
    rackId: "RCK-A-005",
    layout: "Warehouse A - Aisle 3",
    oem: "OEM8",
    totalIssues: 2,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 2,
    lastInspection: "2026-03-10",
    inspector: "Inspector8",
    status: "Stable",
  },
  {
    id: "9",
    rackId: "RCK-B-003",
    layout: "Warehouse B - Aisle 2",
    oem: "OEM9",
    totalIssues: 18,
    redIssues: 6,
    amberIssues: 8,
    greenIssues: 4,
    lastInspection: "2026-03-05",
    inspector: "Inspector9",
    status: "Not Stable",
  },
  {
    id: "10",
    rackId: "RCK-B-004",
    layout: "Warehouse B - Aisle 3",
    oem: "OEM10",
    totalIssues: 4,
    redIssues: 0,
    amberIssues: 1,
    greenIssues: 3,
    lastInspection: "2026-03-08",
    inspector: "Inspector10",
    status: "Stable",
  },
  {
    id: "11",
    rackId: "RCK-C-002",
    layout: "Warehouse C - Aisle 1",
    oem: "OEM11",
    totalIssues: 9,
    redIssues: 2,
    amberIssues: 3,
    greenIssues: 4,
    lastInspection: "2026-03-07",
    inspector: "Inspector11",
    status: "Conditional",
  },
  {
    id: "12",
    rackId: "RCK-C-003",
    layout: "Warehouse C - Aisle 2",
    oem: "OEM12",
    totalIssues: 7,
    redIssues: 0,
    amberIssues: 3,
    greenIssues: 4,
    lastInspection: "2026-03-06",
    inspector: "Inspector12",
    status: "Conditional",
  },
  {
    id: "13",
    rackId: "RCK-D-001",
    layout: "Warehouse D - Aisle 1",
    oem: "OEM13",
    totalIssues: 14,
    redIssues: 4,
    amberIssues: 6,
    greenIssues: 4,
    lastInspection: "2026-03-05",
    inspector: "Inspector13",
    status: "Not Stable",
  },
  {
    id: "14",
    rackId: "RCK-D-002",
    layout: "Warehouse D - Aisle 1",
    oem: "OEM14",
    totalIssues: 3,
    redIssues: 0,
    amberIssues: 1,
    greenIssues: 2,
    lastInspection: "2026-03-09",
    inspector: "Inspector14",
    status: "Stable",
  },
  {
    id: "15",
    rackId: "RCK-D-003",
    layout: "Warehouse D - Aisle 2",
    oem: "OEM15",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "Inspector15",
    status: "Not Evaluated",
  },
  {
    id: "16",
    rackId: "RCK-A-006",
    layout: "Warehouse A - Aisle 3",
    oem: "OEM16",
    totalIssues: 11,
    redIssues: 3,
    amberIssues: 4,
    greenIssues: 4,
    lastInspection: "2026-03-06",
    inspector: "Inspector16",
    status: "Not Stable",
  },
  {
    id: "17",
    rackId: "RCK-A-007",
    layout: "Warehouse A - Aisle 4",
    oem: "OEM17",
    totalIssues: 5,
    redIssues: 0,
    amberIssues: 2,
    greenIssues: 3,
    lastInspection: "2026-03-08",
    inspector: "Inspector17",
    status: "Stable",
  },
  {
    id: "18",
    rackId: "RCK-B-005",
    layout: "Warehouse B - Aisle 3",
    oem: "OEM18",
    totalIssues: 10,
    redIssues: 2,
    amberIssues: 5,
    greenIssues: 3,
    lastInspection: "2026-03-07",
    inspector: "Inspector18",
    status: "Conditional",
  },
  {
    id: "19",
    rackId: "RCK-B-006",
    layout: "Warehouse B - Aisle 4",
    oem: "OEM19",
    totalIssues: 1,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 1,
    lastInspection: "2026-03-10",
    inspector: "Inspector19",
    status: "Stable",
  },
  {
    id: "20",
    rackId: "RCK-C-004",
    layout: "Warehouse C - Aisle 2",
    oem: "OEM20",
    totalIssues: 13,
    redIssues: 4,
    amberIssues: 5,
    greenIssues: 4,
    lastInspection: "2026-03-04",
    inspector: "Inspector20",
    status: "Not Stable",
  },
  {
    id: "21",
    rackId: "RCK-C-005",
    layout: "Warehouse C - Aisle 3",
    oem: "OEM21",
    totalIssues: 6,
    redIssues: 0,
    amberIssues: 3,
    greenIssues: 3,
    lastInspection: "2026-03-08",
    inspector: "Inspector21",
    status: "Conditional",
  },
  {
    id: "22",
    rackId: "RCK-D-004",
    layout: "Warehouse D - Aisle 2",
    oem: "OEM22",
    totalIssues: 4,
    redIssues: 0,
    amberIssues: 1,
    greenIssues: 3,
    lastInspection: "2026-03-09",
    inspector: "Inspector22",
    status: "Stable",
  },
  {
    id: "23",
    rackId: "RCK-D-005",
    layout: "Warehouse D - Aisle 3",
    oem: "OEM23",
    totalIssues: 16,
    redIssues: 5,
    amberIssues: 7,
    greenIssues: 4,
    lastInspection: "2026-03-03",
    inspector: "Inspector23",
    status: "Not Stable",
  },
  {
    id: "24",
    rackId: "RCK-E-001",
    layout: "Warehouse E - Aisle 1",
    oem: "OEM24",
    totalIssues: 2,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 2,
    lastInspection: "2026-03-10",
    inspector: "Inspector24",
    status: "Stable",
  },
  {
    id: "25",
    rackId: "RCK-E-002",
    layout: "Warehouse E - Aisle 1",
    oem: "OEM25",
    totalIssues: 8,
    redIssues: 1,
    amberIssues: 4,
    greenIssues: 3,
    lastInspection: "2026-03-07",
    inspector: "Inspector25",
    status: "Conditional",
  },
  {
    id: "26",
    rackId: "RCK-E-003",
    layout: "Warehouse E - Aisle 2",
    oem: "OEM26",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "Inspector26",
    status: "Not Evaluated",
  },
  {
    id: "27",
    rackId: "RCK-A-008",
    layout: "Warehouse A - Aisle 4",
    oem: "OEM27",
    totalIssues: 7,
    redIssues: 1,
    amberIssues: 3,
    greenIssues: 3,
    lastInspection: "2026-03-08",
    inspector: "Inspector27",
    status: "Conditional",
  },
  {
    id: "28",
    rackId: "RCK-A-009",
    layout: "Warehouse A - Aisle 5",
    oem: "OEM28",
    totalIssues: 3,
    redIssues: 0,
    amberIssues: 1,
    greenIssues: 2,
    lastInspection: "2026-03-09",
    inspector: "Inspector28",
    status: "Stable",
  },
  {
    id: "29",
    rackId: "RCK-B-007",
    layout: "Warehouse B - Aisle 4",
    oem: "OEM29",
    totalIssues: 12,
    redIssues: 3,
    amberIssues: 6,
    greenIssues: 3,
    lastInspection: "2026-03-06",
    inspector: "Inspector29",
    status: "Not Stable",
  },
  {
    id: "30",
    rackId: "RCK-B-008",
    layout: "Warehouse B - Aisle 5",
    oem: "OEM30",
    totalIssues: 5,
    redIssues: 0,
    amberIssues: 2,
    greenIssues: 3,
    lastInspection: "2026-03-09",
    inspector: "Inspector30",
    status: "Stable",
  },
  {
    id: "31",
    rackId: "RCK-C-006",
    layout: "Warehouse C - Aisle 3",
    oem: "OEM31",
    totalIssues: 9,
    redIssues: 2,
    amberIssues: 4,
    greenIssues: 3,
    lastInspection: "2026-03-07",
    inspector: "Inspector31",
    status: "Conditional",
  },
  {
    id: "32",
    rackId: "RCK-C-007",
    layout: "Warehouse C - Aisle 4",
    oem: "OEM32",
    totalIssues: 15,
    redIssues: 5,
    amberIssues: 6,
    greenIssues: 4,
    lastInspection: "2026-03-05",
    inspector: "Inspector32",
    status: "Not Stable",
  },
  {
    id: "33",
    rackId: "RCK-D-006",
    layout: "Warehouse D - Aisle 3",
    oem: "OEM33",
    totalIssues: 4,
    redIssues: 0,
    amberIssues: 1,
    greenIssues: 3,
    lastInspection: "2026-03-08",
    inspector: "Inspector33",
    status: "Stable",
  },
  {
    id: "34",
    rackId: "RCK-E-004",
    layout: "Warehouse E - Aisle 2",
    oem: "OEM34",
    totalIssues: 10,
    redIssues: 2,
    amberIssues: 5,
    greenIssues: 3,
    lastInspection: "2026-03-06",
    inspector: "Inspector34",
    status: "Conditional",
  },
  {
    id: "35",
    rackId: "RCK-E-005",
    layout: "Warehouse E - Aisle 3",
    oem: "OEM35",
    totalIssues: 6,
    redIssues: 0,
    amberIssues: 2,
    greenIssues: 4,
    lastInspection: "2026-03-09",
    inspector: "Inspector35",
    status: "Stable",
  },
];

// Summary card component
function SummaryCard({
  title,
  count,
  variant,
  trend,
  onClick,
  isActive,
}: {
  title: string;
  count: number;
  variant: "total" | "stable" | "conditional" | "not-stable";
  trend: { change: number; direction: "up" | "down" | "neutral" };
  onClick?: () => void;
  isActive?: boolean;
}) {
  const getIndicatorColor = () => {
    switch (variant) {
      case "stable":
        return "bg-[var(--success)]";
      case "conditional":
        return "bg-[var(--warning)]";
      case "not-stable":
        return "bg-[var(--destructive)]";
      default:
        return "bg-[var(--border)]";
    }
  };

  const getStrokeColor = () => {
    switch (variant) {
      case "stable":
        return "var(--success)";
      case "conditional":
        return "var(--warning)";
      case "not-stable":
        return "var(--destructive)";
      default:
        return "var(--muted-foreground)";
    }
  };

  const getTrendIcon = () => {
    if (trend.direction === "up") {
      return <TrendingUp className="h-3 w-3" />;
    } else if (trend.direction === "down") {
      return <TrendingDown className="h-3 w-3" />;
    }
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    // Safety context-based coloring
    if (variant === "not-stable") {
      // For "Not Stable", decrease is positive (green), increase is negative (red)
      if (trend.direction === "down") return "text-[var(--success)]";
      if (trend.direction === "up") return "text-[var(--destructive)]";
    } else if (variant === "stable") {
      // For "Stable", increase is positive (green), decrease is negative (red)
      if (trend.direction === "up") return "text-[var(--success)]";
      if (trend.direction === "down") return "text-[var(--destructive)]";
    } else if (variant === "conditional") {
      // For "Conditional", increase is negative (red), decrease is positive (green)
      if (trend.direction === "up") return "text-[var(--destructive)]";
      if (trend.direction === "down") return "text-[var(--success)]";
    } else if (variant === "total") {
      // For "Total", changes are neutral
      return "text-[var(--muted-foreground)]";
    }
    return "text-[var(--muted-foreground)]";
  };

  const trendData = getTrendData(variant);

  return (
    <div
      onClick={onClick}
      className={`group relative border rounded-[var(--radius-lg)] bg-[var(--card)] p-5 flex flex-col gap-4 transition-all hover:shadow-md cursor-pointer ${
        isActive
          ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
          : "border-[var(--border)] hover:border-[var(--border)]/60"
      }`}
    >
      {/* Top Row: Title and Sparkline */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--muted-foreground)]">
          {title}
        </p>
        {/* Sparkline Chart */}
        <div className="h-8 w-16 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <LineChart width={64} height={32} data={trendData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={getStrokeColor()}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </div>
      </div>

      {/* Large Metric Value */}
      <div className="font-[var(--font-weight-bold)] text-[var(--foreground)] leading-none tracking-tight text-[length:var(--text-xl)]">
        {count}
      </div>

      {/* Trend Comparison */}
      <div className="flex items-center gap-1.5 text-[length:var(--text-xs)]">
        {trend.direction === "neutral" ? (
          <span className="font-[var(--font-weight-medium)] text-[var(--muted-foreground)]">
            No change vs Last Cycle
          </span>
        ) : (
          <>
            <span className={`font-[var(--font-weight-medium)] ${getTrendColor()}`}>
              {trend.change > 0 ? "+" : ""}{trend.change}
            </span>
            <span className={getTrendColor()}>
              {getTrendIcon()}
            </span>
            <span className="font-[var(--font-weight-normal)] text-[var(--muted-foreground)]">
              vs Last Cycle
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: StabilityStatus }) {
  const getVariant = (): "default" | "warning" | "destructive" | "outline" => {
    switch (status) {
      case "Stable":
        return "default";
      case "Conditional":
        return "warning";
      case "Not Stable":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getCustomStyles = () => {
    if (status === "Stable") {
      return "bg-[var(--success)] text-white border-transparent";
    }
    return "";
  };

  return (
    <Badge variant={getVariant()} className={getCustomStyles()}>
      {status}
    </Badge>
  );
}

export function Stability() {
  const sidebar = useSidebar();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [racks, setRacks] = useState<RackData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StabilityStatus | "all">("all");
  
  // Filter Panel State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterRackId, setFilterRackId] = useState("");
  const [filterLayouts, setFilterLayouts] = useState<string[]>([]);
  const [filterOEMs, setFilterOEMs] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<StabilityStatus[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<("red" | "amber" | "green")[]>([]);
  
  // Load racks from localStorage on mount and when navigating back
  useEffect(() => {
    initializeStabilityData();
    setRacks(getAllRacks());
  }, []);

  // Refresh data when stability data is updated (via custom event)
  useEffect(() => {
    const handleDataUpdate = () => {
      console.log("📡 Received stabilityDataUpdated event - refreshing table data");
      const updatedRacks = getAllRacks();
      console.log("📊 Updated racks loaded:", updatedRacks.length);
      setRacks(updatedRacks);
    };
    
    window.addEventListener('stabilityDataUpdated', handleDataUpdate);
    return () => window.removeEventListener('stabilityDataUpdated', handleDataUpdate);
  }, []);
  
  // Get unique layouts and OEMs from racks
  const uniqueLayouts = Array.from(new Set(racks.map(r => r.layout))).sort();
  const uniqueOEMs = Array.from(new Set(racks.map(r => r.oem))).sort();
  
  // Calculate active filter count
  const activeFilterCount = [
    filterRackId.length > 0,
    filterLayouts.length > 0,
    filterOEMs.length > 0,
    filterStatuses.length > 0,
    filterSeverity.length > 0,
  ].filter(Boolean).length;

  useEffect(() => {
    if (sidebar) {
      sidebar.setSubPageTitle("Stability");
    }
  }, [sidebar]);

  // Calculate summary stats
  const totalRacks = racks.length;
  const stableRacks = racks.filter((r) => r.status === "Stable").length;
  const conditionalRacks = racks.filter((r) => r.status === "Conditional").length;
  const notStableRacks = racks.filter((r) => r.status === "Not Stable").length;
  const notEvaluatedRacks = racks.filter((r) => r.status === "Not Evaluated").length;

  // Filter racks based on search and all filter criteria
  const filteredRacks = racks.filter((rack) => {
    // Search filter
    const matchesSearch =
      rack.rackId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rack.layout.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter from summary cards
    const matchesStatus = statusFilter === "all" || rack.status === statusFilter;
    
    // Advanced filters from filter panel
    const matchesRackId = filterRackId.length === 0 || 
      rack.rackId.toLowerCase().includes(filterRackId.toLowerCase());
    
    const matchesLayout = filterLayouts.length === 0 || 
      filterLayouts.includes(rack.layout);
    
    const matchesOEM = filterOEMs.length === 0 || 
      filterOEMs.includes(rack.oem);
    
    const matchesFilterStatus = filterStatuses.length === 0 || 
      filterStatuses.includes(rack.status);
    
    const matchesSeverity = filterSeverity.length === 0 || 
      filterSeverity.some(severity => {
        if (severity === "red") return rack.redIssues > 0;
        if (severity === "amber") return rack.amberIssues > 0;
        if (severity === "green") return rack.greenIssues > 0;
        return false;
      });
    
    return matchesSearch && matchesStatus && matchesRackId && 
           matchesLayout && matchesOEM && matchesFilterStatus && matchesSeverity;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRacks = filteredRacks.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, filterRackId, filterLayouts, filterOEMs, filterStatuses, filterSeverity]);

  const handleViewRack = (rackId: string) => {
    navigate(`/rack/irds/stability/${rackId}`);
  };

  const handleRackClick = (rackId: string) => {
    navigate(`/rack/irds/stability/${rackId}`);
  };

  const handleExportReport = () => {
    // TODO: Implement export functionality
    console.log("Export report");
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };
  
  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    // Filters are already applied via state
  };
  
  const handleResetFilters = () => {
    setFilterRackId("");
    setFilterLayouts([]);
    setFilterOEMs([]);
    setFilterStatuses([]);
    setFilterSeverity([]);
  };
  
  const handleClearFilters = () => {
    handleResetFilters();
  };
  
  const toggleLayout = (layout: string) => {
    setFilterLayouts(prev =>
      prev.includes(layout)
        ? prev.filter(l => l !== layout)
        : [...prev, layout]
    );
  };
  
  const toggleOEM = (oem: string) => {
    setFilterOEMs(prev =>
      prev.includes(oem)
        ? prev.filter(o => o !== oem)
        : [...prev, oem]
    );
  };
  
  const toggleStatus = (status: StabilityStatus) => {
    setFilterStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  const toggleSeverity = (severity: "red" | "amber" | "green") => {
    setFilterSeverity(prev =>
      prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };
  
  const handleCardClick = (status: StabilityStatus | "all") => {
    setStatusFilter(status);
  };

  const isEmpty = racks.length === 0;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-[var(--spacing-8)] py-[var(--spacing-6)]">
        {isEmpty ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full gap-[var(--spacing-6)]">
            <div className="text-center">
              <h3 className="text-[var(--text-lg)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)] mb-[var(--spacing-2)]">
                No racks available.
              </h3>
            </div>
            <Button variant="default" size="default">
              Import Rack Data
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-[var(--spacing-6)]">
            {/* Action / Utility Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-current opacity-50" />
                <Input
                  type="text"
                  placeholder="Search racks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 border-border focus-visible:ring-1 focus-visible:ring-ring rounded-[var(--radius-sm)]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 font-medium hover:bg-muted rounded-[var(--radius-sm)] relative" onClick={handleFilter}>
                  <Filter className="mr-2 h-4 w-4 text-current" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <Button variant="default" size="sm" className="h-9 rounded-[var(--radius-sm)]" onClick={handleExportReport}>
                  <FileDown className="mr-2 h-4 w-4 text-current" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-[var(--spacing-6)]">
              <SummaryCard 
                title="Total Racks" 
                count={totalRacks} 
                variant="total" 
                trend={{ change: 3, direction: "up" }} 
                onClick={() => handleCardClick("all")}
                isActive={statusFilter === "all"}
              />
              <SummaryCard 
                title="Stable Racks" 
                count={stableRacks} 
                variant="stable" 
                trend={{ change: 2, direction: "up" }} 
                onClick={() => handleCardClick("Stable")}
                isActive={statusFilter === "Stable"}
              />
              <SummaryCard
                title="Conditional Racks"
                count={conditionalRacks}
                variant="conditional"
                trend={{ change: 1, direction: "up" }}
                onClick={() => handleCardClick("Conditional")}
                isActive={statusFilter === "Conditional"}
              />
              <SummaryCard
                title="Not Stable Racks"
                count={notStableRacks}
                variant="not-stable"
                trend={{ change: 2, direction: "down" }}
                onClick={() => handleCardClick("Not Stable")}
                isActive={statusFilter === "Not Stable"}
              />
            </div>

            {/* Rack Stability Table */}
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] flex flex-col overflow-hidden">
              {/* Table */}
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[var(--border)] hover:bg-transparent bg-[var(--muted)]/30">
                      <TableHead className="h-11 font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Rack ID</TableHead>
                      <TableHead className="h-11 font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Layout</TableHead>
                      <TableHead className="h-11 font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">OEM</TableHead>
                      <TableHead className="h-11 text-center font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Total Issues</TableHead>
                      <TableHead className="h-11 text-center font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Red</TableHead>
                      <TableHead className="h-11 text-center font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Amber</TableHead>
                      <TableHead className="h-11 text-center font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Green</TableHead>
                      <TableHead className="h-11 font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Stability Status</TableHead>
                      <TableHead className="h-11 font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Last Inspection</TableHead>
                      <TableHead className="h-11 font-[var(--font-weight-semi-bold)] text-[var(--foreground)] pr-[160px]">Inspector</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRacks.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={8} className="h-[200px] text-center">
                          No racks found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRacks.map((rack) => (
                        <TableRow 
                          key={rack.id} 
                          className="group border-b border-[var(--border)] cursor-pointer hover:bg-[var(--muted)]/40 transition-colors relative"
                          onClick={() => handleRackClick(rack.rackId)}
                        >
                          <TableCell className="py-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewRack(rack.rackId);
                              }}
                              className="font-[var(--font-weight-medium)] text-[var(--primary)] hover:underline focus:underline focus:outline-none"
                            >
                              {rack.rackId}
                            </button>
                          </TableCell>
                          <TableCell className="text-[var(--muted-foreground)] py-4">
                            {rack.layout}
                          </TableCell>
                          <TableCell className="text-[var(--muted-foreground)] py-4">
                            {rack.oem}
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <span className="font-[var(--font-weight-bold)] text-[var(--foreground)]">
                              {rack.totalIssues}
                            </span>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <span className="text-[var(--destructive)]">
                              {rack.redIssues}
                            </span>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <span className="text-[var(--warning)]">
                              {rack.amberIssues}
                            </span>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <span className="text-[var(--success)]">
                              {rack.greenIssues}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <StatusBadge status={rack.status} />
                          </TableCell>
                          <TableCell className="text-[var(--muted-foreground)] text-[length:var(--text-sm)] py-4">
                            {rack.lastInspection}
                          </TableCell>
                          <TableCell className="pr-[160px] relative py-4">
                            <span className="text-[var(--muted-foreground)] text-[length:var(--text-sm)]">{rack.inspector}</span>
                            {/* Reserved Action Zone - Positioned absolutely within the last cell */}
                            <span className="absolute right-0 top-0 bottom-0 flex items-center pr-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 hover:bg-[var(--accent)] text-[var(--primary)] font-[var(--font-weight-medium)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewRack(rack.rackId);
                                }}
                              >
                                View Rack
                                <ArrowRight className="h-3.5 w-3.5 text-current" />
                              </Button>
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination inside container */}
              <div className="flex flex-row items-center justify-end gap-6 border-t border-[var(--border)] bg-[var(--background)] px-[var(--spacing-4)] py-[var(--spacing-3)]">
                <div className="flex flex-row items-center gap-2">
                  <p className="text-[length:var(--text-sm)] font-[var(--font-weight-normal)] text-[var(--foreground)] leading-none whitespace-nowrap">
                    Rows per page:
                  </p>
                  <Select
                    value={`${itemsPerPage}`}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px] rounded-[var(--radius-sm)] border-[var(--border)] bg-[var(--background)] shadow-none">
                      <SelectValue placeholder={itemsPerPage} />
                    </SelectTrigger>
                    <SelectContent side="top" className="bg-[var(--popover)] border-[var(--border)]">
                      {[10, 20, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <p className="text-[length:var(--text-sm)] font-[var(--font-weight-normal)] text-[var(--foreground)] leading-none whitespace-nowrap">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-[var(--radius-sm)] border-[var(--border)] bg-[var(--background)] disabled:opacity-50 shadow-none"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={!canGoPrevious}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeft className="h-4 w-4 text-current" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-[var(--radius-sm)] border-[var(--border)] bg-[var(--background)] disabled:opacity-50 shadow-none"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={!canGoNext}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRight className="h-4 w-4 text-current" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right" className="w-[480px] overflow-y-auto flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
            <SheetTitle className="text-[length:var(--text-lg)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
              Filter Racks
            </SheetTitle>
            <SheetDescription className="text-[length:var(--text-sm)] text-[var(--muted-foreground)]">
              Filter racks based on layout, stability status, and inspection severity
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
            {/* Rack ID Filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-rack-id" className="text-sm font-medium">
                Rack ID
              </Label>
              <Input
                id="filter-rack-id"
                placeholder="Search by Rack ID"
                value={filterRackId}
                onChange={(e) => setFilterRackId(e.target.value)}
              />
            </div>

            {/* Layout Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Layout
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    <span className={filterLayouts.length === 0 ? "text-muted-foreground" : ""}>
                      {filterLayouts.length === 0
                        ? "Select layouts"
                        : `${filterLayouts.length} layout${filterLayouts.length !== 1 ? 's' : ''} selected`}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[416px] p-0" align="start">
                  <div className="max-h-[280px] overflow-y-auto p-3 space-y-1">
                    {/* Select All Option */}
                    <div 
                      className="flex items-center space-x-2 rounded-sm p-2 hover:bg-accent cursor-pointer border-b border-[var(--border)] mb-2" 
                      onClick={() => {
                        if (filterLayouts.length === uniqueLayouts.length) {
                          setFilterLayouts([]);
                        } else {
                          setFilterLayouts([...uniqueLayouts]);
                        }
                      }}
                    >
                      <Checkbox
                        id="layout-select-all"
                        checked={filterLayouts.length === uniqueLayouts.length && uniqueLayouts.length > 0}
                        onCheckedChange={() => {
                          if (filterLayouts.length === uniqueLayouts.length) {
                            setFilterLayouts([]);
                          } else {
                            setFilterLayouts([...uniqueLayouts]);
                          }
                        }}
                      />
                      <Label
                        htmlFor="layout-select-all"
                        className="text-sm font-[var(--font-weight-semi-bold)] cursor-pointer flex-1"
                      >
                        Select All
                      </Label>
                    </div>
                    {/* Individual Layout Options */}
                    {uniqueLayouts.map((layout) => (
                      <div key={layout} className="flex items-center space-x-2 rounded-sm p-2 hover:bg-accent cursor-pointer" onClick={() => toggleLayout(layout)}>
                        <Checkbox
                          id={`layout-dropdown-${layout}`}
                          checked={filterLayouts.includes(layout)}
                          onCheckedChange={() => toggleLayout(layout)}
                        />
                        <Label
                          htmlFor={`layout-dropdown-${layout}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {layout}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* OEM Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                OEM
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    <span className={filterOEMs.length === 0 ? "text-muted-foreground" : ""}>
                      {filterOEMs.length === 0
                        ? "Select manufacturers"
                        : `${filterOEMs.length} OEM${filterOEMs.length !== 1 ? 's' : ''} selected`}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[416px] p-0" align="start">
                  <div className="max-h-[280px] overflow-y-auto p-3 space-y-1">
                    {/* Select All Option */}
                    <div 
                      className="flex items-center space-x-2 rounded-sm p-2 hover:bg-accent cursor-pointer border-b border-[var(--border)] mb-2" 
                      onClick={() => {
                        if (filterOEMs.length === uniqueOEMs.length) {
                          setFilterOEMs([]);
                        } else {
                          setFilterOEMs([...uniqueOEMs]);
                        }
                      }}
                    >
                      <Checkbox
                        id="oem-select-all"
                        checked={filterOEMs.length === uniqueOEMs.length && uniqueOEMs.length > 0}
                        onCheckedChange={() => {
                          if (filterOEMs.length === uniqueOEMs.length) {
                            setFilterOEMs([]);
                          } else {
                            setFilterOEMs([...uniqueOEMs]);
                          }
                        }}
                      />
                      <Label
                        htmlFor="oem-select-all"
                        className="text-sm font-[var(--font-weight-semi-bold)] cursor-pointer flex-1"
                      >
                        Select All
                      </Label>
                    </div>
                    {/* Individual OEM Options */}
                    {uniqueOEMs.map((oem) => (
                      <div key={oem} className="flex items-center space-x-2 rounded-sm p-2 hover:bg-accent cursor-pointer" onClick={() => toggleOEM(oem)}>
                        <Checkbox
                          id={`oem-dropdown-${oem}`}
                          checked={filterOEMs.includes(oem)}
                          onCheckedChange={() => toggleOEM(oem)}
                        />
                        <Label
                          htmlFor={`oem-dropdown-${oem}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {oem}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Stability Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Stability Status
              </Label>
              <div className="space-y-3">
                {(["Stable", "Conditional", "Not Stable", "Not Evaluated"] as StabilityStatus[]).map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filterStatuses.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    <Label
                      htmlFor={`status-${status}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Severity
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="severity-red"
                    checked={filterSeverity.includes("red")}
                    onCheckedChange={() => toggleSeverity("red")}
                  />
                  <Label
                    htmlFor="severity-red"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Red
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="severity-amber"
                    checked={filterSeverity.includes("amber")}
                    onCheckedChange={() => toggleSeverity("amber")}
                  />
                  <Label
                    htmlFor="severity-amber"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Amber
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="severity-green"
                    checked={filterSeverity.includes("green")}
                    onCheckedChange={() => toggleSeverity("green")}
                  />
                  <Label
                    htmlFor="severity-green"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Green
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t border-[var(--border)] flex flex-row gap-2 justify-end mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-9 font-[var(--font-weight-medium)] rounded-[var(--radius-sm)]"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-9 font-[var(--font-weight-medium)] rounded-[var(--radius-sm)]"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}