import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  AlertTriangle,
  MessageSquare,
  FileText,
  Download,
  X,
  Filter,
} from "lucide-react";
import { cn } from "../ui/utils";
import { TEST_MASTER, type TestMasterEntry } from "./test-engine";

// Types
type RAGStatus = "green" | "amber" | "red" | "critical";
type TestScope = "Global" | "Local";
type AcceptabilityStatus = "Acceptable" | "Borderline" | "Not Acceptable";
type OverallResult = "Pass" | "Fail" | "Borderline";
type DensityMode = "comfortable" | "compact";

interface ColumnVisibility {
  testId: boolean;
  testName: boolean;
  scope: boolean;
  element: boolean;
  location: boolean;
  measured: boolean;
  threshold: boolean;
  acceptability: boolean;
  riskStatus: boolean;
  deviation: boolean;
}

/**
 * CORRECTED DATA MODEL FOR INTEGRITY SUMMARY
 * 
 * Multi-parameter tests need aggregated results, not single measuredValue/threshold
 */
interface TestResult {
  id: string;
  testId: string;
  testCode: string; // L1, G1, F1, etc. - MUST match TEST_MASTER
  testName: string; // From TEST_MASTER
  testScope: TestScope;
  elementType: string;
  location: string;
  
  // MULTI-PARAMETER SUMMARY (not single measurement)
  overallResult: OverallResult;
  maxDeviationPercent: number;
  failedParameterCount: number;
  totalParameterCount: number;
  
  // Legacy for compatibility (will be deprecated)
  rag: RAGStatus;
}

// Helper function to calculate acceptability from overall result
function calculateAcceptability(
  overallResult: OverallResult
): AcceptabilityStatus {
  switch (overallResult) {
    case "Pass":
      return "Acceptable";
    case "Borderline":
      return "Borderline";
    case "Fail":
      return "Not Acceptable";
  }
}

// Generate mock data using REAL TEST_MASTER (14 tests only)
function generateMockData(): TestResult[] {
  const elements = ["Beam", "Upright", "Baseplate", "Anchor", "Decking", "—"];
  const racks = ["Rack A", "Rack B", "Rack C", "Rack D", "Rack E", "Rack F"];
  const statuses: RAGStatus[] = ["green", "green", "green", "amber", "red", "critical"];
  const overallResults: OverallResult[] = ["Pass", "Pass", "Pass", "Borderline", "Fail", "Fail"];

  const data: TestResult[] = [];
  
  // Generate ~15-20 instances per test type = ~210-280 total rows
  const instancesPerTest = 15;
  
  TEST_MASTER.forEach((testMaster, testIndex) => {
    for (let i = 0; i < instancesPerTest; i++) {
      const globalIndex = testIndex * instancesPerTest + i;
      const isGlobal = testMaster.scope === "Global";
      const rack = racks[Math.floor(globalIndex / 40) % racks.length];
      const bay = Math.floor((globalIndex % 40) / 10) + 1;
      const level = (globalIndex % 5) + 1;
      const element = isGlobal ? "—" : elements[globalIndex % elements.length];
      const position = String.fromCharCode(65 + (globalIndex % 4)) + ((globalIndex % 4) + 1);
      
      // Random multi-parameter result
      const maxDeviation = Math.random() * 30 - 5; // -5% to +25%
      const totalParams = isGlobal ? 3 : (Math.floor(Math.random() * 3) + 2); // 2-4 for local, 3 for global
      const failedParams = maxDeviation > 10 ? Math.floor(Math.random() * 2) + 1 : 0;
      const resultIndex = Math.floor(Math.random() * overallResults.length);

      data.push({
        id: `test-${globalIndex + 1}`,
        testId: `${testMaster.code}-${String(i + 1).padStart(3, "0")}`,
        testCode: testMaster.code,
        testName: testMaster.name,
        testScope: testMaster.scope,
        elementType: element,
        location: isGlobal
          ? `${rack} / Bay ${bay}`
          : `${rack} / Bay ${bay} / Level ${level} / Position ${position}`,
        overallResult: overallResults[resultIndex],
        maxDeviationPercent: parseFloat(maxDeviation.toFixed(1)),
        failedParameterCount: failedParams,
        totalParameterCount: totalParams,
        rag: statuses[resultIndex],
      });
    }
  });

  return data;
}

const MOCK_TEST_RESULTS = generateMockData();

export function IntegritySummary() {
  const navigate = useNavigate();
  const [testResults] = useState<TestResult[]>(MOCK_TEST_RESULTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState<TestScope[]>([]);
  const [ragFilter, setRAGFilter] = useState<RAGStatus[]>([]);
  const [acceptabilityFilter, setAcceptabilityFilter] = useState<AcceptabilityStatus[]>([]);
  const [elementFilter, setElementFilter] = useState<string[]>([]);
  
  // Temporary filter state for the popover (before Apply)
  const [tempScopeFilter, setTempScopeFilter] = useState<TestScope[]>([]);
  const [tempRAGFilter, setTempRAGFilter] = useState<RAGStatus[]>([]);
  const [tempAcceptabilityFilter, setTempAcceptabilityFilter] = useState<AcceptabilityStatus[]>([]);
  const [tempElementFilter, setTempElementFilter] = useState<string[]>([]);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  
  // Sync temp filters with actual filters when opening popover
  React.useEffect(() => {
    if (isFilterPopoverOpen) {
      setTempScopeFilter([...scopeFilter]);
      setTempRAGFilter([...ragFilter]);
      setTempAcceptabilityFilter([...acceptabilityFilter]);
      setTempElementFilter([...elementFilter]);
    }
  }, [isFilterPopoverOpen, scopeFilter, ragFilter, acceptabilityFilter, elementFilter]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [density, setDensity] = useState<DensityMode>("comfortable");
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    testId: true,
    testName: true,
    scope: true,
    element: true,
    location: true,
    measured: true,
    threshold: true,
    acceptability: true,
    riskStatus: true,
    deviation: true,
  });

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get unique elements for filter
  const uniqueElements = useMemo(() => {
    const elements = new Set(
      testResults.map((r) => r.elementType).filter((e) => e !== "—")
    );
    return Array.from(elements).sort();
  }, [testResults]);

  // Filter logic
  const filteredResults = useMemo(() => {
    return testResults.filter((result) => {
      const matchesSearch =
        result.testId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        result.testName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        result.location.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesScope =
        scopeFilter.length === 0 || scopeFilter.includes(result.testScope);
      const matchesRAG =
        ragFilter.length === 0 || ragFilter.includes(result.rag);

      const acceptability = calculateAcceptability(
        result.overallResult
      );
      const matchesAcceptability =
        acceptabilityFilter.length === 0 ||
        acceptabilityFilter.includes(acceptability);

      const matchesElement =
        elementFilter.length === 0 || elementFilter.includes(result.elementType);

      return (
        matchesSearch &&
        matchesScope &&
        matchesRAG &&
        matchesAcceptability &&
        matchesElement
      );
    });
  }, [
    testResults,
    debouncedSearch,
    scopeFilter,
    ragFilter,
    acceptabilityFilter,
    elementFilter,
  ]);

  // Sort logic
  const sortedResults = useMemo(() => {
    if (!sortConfig) return filteredResults;

    return [...filteredResults].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === "deviation") {
        aValue = a.maxDeviationPercent;
        bValue = b.maxDeviationPercent;
      } else {
        aValue = (a as any)[sortConfig.key];
        bValue = (b as any)[sortConfig.key];
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredResults, sortConfig]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Calculate pagination data BEFORE callbacks that use it
  const totalPages = Math.ceil(sortedResults.length / rowsPerPage);
  const currentResults = sortedResults.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, sortedResults.length);

  const isShowingAll = rowsPerPage >= sortedResults.length;
  const showPagination = sortedResults.length > 10;

  const getRiskStatusBadge = (rag: RAGStatus) => {
    const config = {
      green: {
        label: "Green",
        className: "bg-success/10 text-success border-0 h-6",
      },
      amber: {
        label: "Amber",
        className: "bg-warning/10 text-warning border-0 h-6",
      },
      red: {
        label: "Red",
        className: "bg-destructive/10 text-destructive border-0 h-6",
      },
      critical: {
        label: "Critical",
        className: "bg-destructive text-destructive-foreground border-0 h-6",
      },
    };

    const { label, className } = config[rag];
    return (
      <Badge className={className} style={{ fontSize: "var(--text-xs)" }}>
        {label}
      </Badge>
    );
  };

  const getAcceptabilityText = (acceptability: AcceptabilityStatus) => {
    return (
      <span
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-normal)",
          color: "var(--foreground)",
        }}
      >
        {acceptability}
      </span>
    );
  };

  const getDeviationText = (deviation: number) => {
    const sign = deviation >= 0 ? "+" : "";
    const color =
      deviation > 10
        ? "var(--destructive)"
        : deviation > 0
        ? "var(--warning)"
        : "var(--muted-foreground)";

    return (
      <span
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-normal)",
          color: color,
        }}
      >
        {sign}
        {deviation.toFixed(1)}%
      </span>
    );
  };

  const getRowBorderClass = (rag: RAGStatus) => {
    if (rag === "critical") return "border-l-4 border-l-destructive";
    if (rag === "red") return "border-l-4 border-l-warning";
    return "";
  };

  const handleViewDetails = (result: TestResult) => {
    setSelectedResult(result);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (result: TestResult) => {
    // Navigate to detail page with testId in URL (e.g., "G1-042", "L1-123")
    navigate(`/rack/irds/integrity-test/${result.testId}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedRows(new Set());
  };

  const handleRowsPerPageChange = (value: string) => {
    if (value === "all") {
      setRowsPerPage(sortedResults.length);
    } else {
      setRowsPerPage(parseInt(value, 10));
    }
    setCurrentPage(1);
    setSelectedRows(new Set());
  };

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === currentResults.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentResults.map((r) => r.id)));
    }
  }, [selectedRows.size, currentResults]);

  const handleSelectRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleClearFilters = () => {
    setScopeFilter([]);
    setRAGFilter([]);
    setAcceptabilityFilter([]);
    setElementFilter([]);
    setSearchTerm("");
    setDebouncedSearch("");
  };

  const activeFilterCount =
    scopeFilter.length +
    ragFilter.length +
    acceptabilityFilter.length +
    elementFilter.length +
    (debouncedSearch ? 1 : 0);

  const rowHeight = density === "comfortable" ? "48px" : "36px";

  return (
    <div className="w-full h-full flex flex-col bg-background overflow-hidden">
      <Card className="flex-1 flex flex-col min-h-0 border border-border rounded-lg">
        {/* Card Header - Filters & Actions */}
        <div
          className="flex flex-col gap-4 border-b"
          style={{
            padding: "var(--spacing-6)",
            borderColor: "var(--border)",
          }}
        >
          {/* Single-Line Toolbar: Search + Filters */}
          <div
            className="flex items-center gap-3"
            style={{
              flexWrap: "nowrap",
              width: "100%",
            }}
          >
            {/* Search */}
            <div
              className="relative"
              style={{
                width: "350px",
                flexShrink: 0,
              }}
            >
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Test, Rack, Bay, Level, Position"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Filters Group */}
            <div
              className="flex items-center gap-3"
              style={{
                flexWrap: "nowrap",
                flex: "1 1 auto",
                minWidth: 0,
              }}
            >
              <Button
                variant="outline"
                className="h-9"
                onClick={() => setIsFilterPopoverOpen(true)}
                style={{
                  minWidth: "140px",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5"
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-semibold)",
                    }}
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9"
                  onClick={handleClearFilters}
                  style={{ flexShrink: 0 }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedRows.size > 0 && (
          <div
            className="flex items-center justify-between px-6 py-3 border-b"
            style={{
              backgroundColor: "var(--muted)",
              borderColor: "var(--border)",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
              }}
            >
              {selectedRows.size} row{selectedRows.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalate
              </Button>
              <Button variant="outline" size="sm">
                Mark Reviewed
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRows(new Set())}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* DataGrid Container - Scrollable Body */}
        <div
          className="flex-1 overflow-x-auto overflow-y-auto"
          style={{
            maxHeight: "65vh",
          }}
        >
          <Table style={{ minWidth: "1200px" }}>
            <TableHeader
              className="sticky top-0 z-20"
              style={{
                backgroundColor: "var(--background)",
              }}
            >
              <TableRow
                className="border-b hover:bg-transparent"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Checkbox Column */}
                <TableHead className="w-12" style={{ minWidth: "48px" }}>
                  <Checkbox
                    checked={
                      currentResults.length > 0 &&
                      selectedRows.size === currentResults.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>

                {/* Test ID */}
                {columnVisibility.testId && (
                  <TableHead
                    style={{ width: "120px", minWidth: "120px" }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("testId")}
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                    >
                      Test ID
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                )}

                {/* Test Name */}
                {columnVisibility.testName && (
                  <TableHead
                    style={{ width: "220px", minWidth: "220px" }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("testName")}
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                    >
                      Test Name
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                )}

                {/* Scope */}
                {columnVisibility.scope && (
                  <TableHead style={{ width: "120px", minWidth: "120px" }}>
                    <button
                      type="button"
                      onClick={() => handleSort("testScope")}
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                    >
                      Impact Level
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                )}

                {/* Element */}
                {columnVisibility.element && (
                  <TableHead style={{ width: "140px", minWidth: "140px" }}>
                    <button
                      type="button"
                      onClick={() => handleSort("elementType")}
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                    >
                      Element
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                )}

                {/* Location - Flexible */}
                {columnVisibility.location && (
                  <TableHead style={{ minWidth: "280px" }}>
                    <button
                      type="button"
                      onClick={() => handleSort("location")}
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                    >
                      Location
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                )}

                {/* Acceptability */}
                {columnVisibility.acceptability && (
                  <TableHead style={{ width: "160px", minWidth: "160px" }}>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Test Result</div>
                  </TableHead>
                )}

                {/* Risk Status */}
                {columnVisibility.riskStatus && (
                  <TableHead style={{ width: "130px", minWidth: "130px" }}>
                    <button
                      type="button"
                      onClick={() => handleSort("rag")}
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                    >
                      Severity
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                )}

                {/* Deviation % */}
                {columnVisibility.deviation && (
                  <TableHead className="text-right" style={{ width: "130px", minWidth: "130px" }}>
                    <button
                      type="button"
                      onClick={() => handleSort("deviation")}
                      className="flex items-center justify-end gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors ml-auto"
                    >
                      Deviation %
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                )}

                {/* Actions */}
                <TableHead className="w-12" style={{ minWidth: "48px" }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResults.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={12}
                    className="h-[200px] text-center"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {activeFilterCount > 0
                      ? "No results match your filters"
                      : "No test results available"}
                  </TableCell>
                </TableRow>
              ) : (
                currentResults.map((result) => {
                  const acceptability = calculateAcceptability(
                    result.overallResult
                  );
                  const deviation = result.maxDeviationPercent;

                  return (
                    <TableRow
                      key={result.id}
                      onClick={() => handleRowClick(result)}
                      className={cn(
                        "border-b hover:bg-muted/30 transition-colors cursor-pointer",
                        getRowBorderClass(result.rag)
                      )}
                      style={{
                        height: rowHeight,
                        borderColor: "var(--border)",
                      }}
                    >
                      {/* Checkbox */}
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(result.id)}
                          onCheckedChange={() => handleSelectRow(result.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>

                      {/* Test ID */}
                      {columnVisibility.testId && (
                        <TableCell
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--foreground)",
                          }}
                        >
                          {result.testId}
                        </TableCell>
                      )}

                      {/* Test Name */}
                      {columnVisibility.testName && (
                        <TableCell
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--foreground)",
                          }}
                        >
                          {result.testName}
                        </TableCell>
                      )}

                      {/* Scope */}
                      {columnVisibility.scope && (
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "border h-5",
                              result.testScope === "Global"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-secondary/10 text-secondary-foreground border-border"
                            )}
                            style={{ fontSize: "var(--text-xs)" }}
                          >
                            {result.testScope}
                          </Badge>
                        </TableCell>
                      )}

                      {/* Element */}
                      {columnVisibility.element && (
                        <TableCell
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--foreground)",
                          }}
                        >
                          {result.elementType}
                        </TableCell>
                      )}

                      {/* Location */}
                      {columnVisibility.location && (
                        <TableCell
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {result.location}
                        </TableCell>
                      )}

                      {/* Acceptability */}
                      {columnVisibility.acceptability && (
                        <TableCell>{getAcceptabilityText(acceptability)}</TableCell>
                      )}

                      {/* Risk Status */}
                      {columnVisibility.riskStatus && (
                        <TableCell>{getRiskStatusBadge(result.rag)}</TableCell>
                      )}

                      {/* Deviation % */}
                      {columnVisibility.deviation && (
                        <TableCell className="text-right">
                          {getDeviationText(deviation)}
                        </TableCell>
                      )}

                      {/* Actions */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(result);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Raise CTA
                            </DropdownMenuItem>
                            {(result.rag === "red" || result.rag === "critical") && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Escalate
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Add Comment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Sticky Pagination Footer */}
        <div
          className="flex items-center justify-between border-t px-6 py-3 sticky bottom-0 z-10"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
          }}
        >
          {/* Results Info */}
          <p
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--muted-foreground)",
              whiteSpace: "nowrap",
            }}
          >
            {isShowingAll
              ? `Showing all ${sortedResults.length} tests`
              : `Showing ${startIndex}–${endIndex} of ${sortedResults.length} tests`}
          </p>

          {/* Pagination Controls - Only show if more than 10 rows */}
          {showPagination && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--foreground)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Rows per page:
                </p>
                <Select defaultValue="10" onValueChange={handleRowsPerPageChange}>
                  <SelectTrigger className="h-8 w-[70px] rounded-md border-[var(--border)] bg-[var(--background)]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    {sortedResults.length <= 250 && (
                      <SelectItem value="all">All</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {!isShowingAll && (
                <div className="flex items-center gap-2">
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      color: "var(--foreground)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-md border-[var(--border)] bg-[var(--background)] disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-md border-[var(--border)] bg-[var(--background)]"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedResult?.testName} ({selectedResult?.testId}) — Test Instance
              Details
            </SheetTitle>
            <SheetDescription>Read-only test execution information</SheetDescription>
          </SheetHeader>

          {selectedResult && (
            <div className="mt-6 space-y-6">
              {/* Test Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Test Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Test ID</span>
                    <span className="text-sm font-medium">{selectedResult.testId}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Test Name</span>
                    <span className="text-sm font-medium">{selectedResult.testName}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Scope</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border h-5",
                        selectedResult.testScope === "Global"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-secondary/10 text-secondary-foreground border-border"
                      )}
                    >
                      {selectedResult.testScope}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Element & Location */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Element & Location
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Element Type</span>
                    <span className="text-sm font-medium">
                      {selectedResult.elementType}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium text-right">
                      {selectedResult.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Measurement Results */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Measurement Results
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Overall Result</span>
                    <span className="text-sm font-medium">
                      {selectedResult.overallResult}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Max Deviation</span>
                    {getDeviationText(selectedResult.maxDeviationPercent)}
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Failed Parameters</span>
                    <span className="text-sm font-medium">
                      {selectedResult.failedParameterCount} of {selectedResult.totalParameterCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Acceptability</span>
                    {getAcceptabilityText(
                      calculateAcceptability(selectedResult.overallResult)
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Risk Status</span>
                    {getRiskStatusBadge(selectedResult.rag)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDrawerOpen(false)}
            >
              Close
            </Button>
            <Button type="button" variant="default">
              Raise CTA
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Filter Panel */}
      <Sheet open={isFilterPopoverOpen} onOpenChange={setIsFilterPopoverOpen}>
        <SheetContent
          side="right"
          className="w-[360px] overflow-hidden"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 0,
          }}
        >
          <SheetHeader
            style={{
              padding: "var(--spacing-6)",
              paddingBottom: "var(--spacing-5)",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <SheetTitle
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: "var(--font-weight-semibold)",
                fontFamily: "Inter, sans-serif",
                color: "var(--foreground)",
                marginBottom: "var(--spacing-1)",
              }}
            >
              Filters
            </SheetTitle>
            <SheetDescription
              style={{
                fontSize: "var(--text-sm)",
                fontFamily: "Inter, sans-serif",
                color: "var(--muted-foreground)",
                lineHeight: "1.5",
              }}
            >
              Apply multiple filters to refine test results
            </SheetDescription>
          </SheetHeader>

          {/* Scrollable Filter Content */}
          <div
            style={{
              flex: "1 1 auto",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-1)",
              padding: "var(--spacing-2)",
            }}
          >
            {/* Risk Status Section - Pill Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-3)",
                padding: "var(--spacing-4)",
                backgroundColor: "var(--muted)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <label
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-semibold)",
                  fontFamily: "Inter, sans-serif",
                  color: "var(--foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Risk Status
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--spacing-2)",
                }}
              >
                {(["green", "amber", "red", "critical"] as RAGStatus[]).map((status) => (
                  <Button
                    key={status}
                    variant={tempRAGFilter.includes(status) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (tempRAGFilter.includes(status)) {
                        setTempRAGFilter(tempRAGFilter.filter((s) => s !== status));
                      } else {
                        setTempRAGFilter([...tempRAGFilter, status]);
                      }
                    }}
                    style={{
                      fontSize: "var(--text-sm)",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "var(--font-weight-medium)",
                      borderRadius: "var(--radius-full)",
                      paddingLeft: "var(--spacing-4)",
                      paddingRight: "var(--spacing-4)",
                      height: "32px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Scope Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-3)",
                padding: "var(--spacing-4)",
                backgroundColor: "var(--muted)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <label
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-semibold)",
                  fontFamily: "Inter, sans-serif",
                  color: "var(--foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Scope
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                {(["Global", "Local"] as TestScope[]).map((scope) => (
                  <div
                    key={scope}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <Checkbox
                      id={`filter-scope-${scope}`}
                      checked={tempScopeFilter.includes(scope)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempScopeFilter([...tempScopeFilter, scope]);
                        } else {
                          setTempScopeFilter(tempScopeFilter.filter((s) => s !== scope));
                        }
                      }}
                    />
                    <label
                      htmlFor={`filter-scope-${scope}`}
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-normal)",
                        fontFamily: "Inter, sans-serif",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        lineHeight: "1.5",
                      }}
                    >
                      {scope}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Acceptability Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-3)",
                padding: "var(--spacing-4)",
                backgroundColor: "var(--muted)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <label
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-semibold)",
                  fontFamily: "Inter, sans-serif",
                  color: "var(--foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Acceptability
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                {(["Acceptable", "Borderline", "Not Acceptable"] as AcceptabilityStatus[]).map((acceptability) => (
                  <div
                    key={acceptability}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <Checkbox
                      id={`filter-acceptability-${acceptability}`}
                      checked={tempAcceptabilityFilter.includes(acceptability)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempAcceptabilityFilter([...tempAcceptabilityFilter, acceptability]);
                        } else {
                          setTempAcceptabilityFilter(tempAcceptabilityFilter.filter((a) => a !== acceptability));
                        }
                      }}
                    />
                    <label
                      htmlFor={`filter-acceptability-${acceptability}`}
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-normal)",
                        fontFamily: "Inter, sans-serif",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        lineHeight: "1.5",
                      }}
                    >
                      {acceptability}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Element Type Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-3)",
                padding: "var(--spacing-4)",
                backgroundColor: "var(--muted)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <label
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-semibold)",
                  fontFamily: "Inter, sans-serif",
                  color: "var(--foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Element Type
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                {uniqueElements.map((element) => (
                  <div
                    key={element}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <Checkbox
                      id={`filter-element-${element}`}
                      checked={tempElementFilter.includes(element)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTempElementFilter([...tempElementFilter, element]);
                        } else {
                          setTempElementFilter(tempElementFilter.filter((e) => e !== element));
                        }
                      }}
                    />
                    <label
                      htmlFor={`filter-element-${element}`}
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-normal)",
                        fontFamily: "Inter, sans-serif",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        lineHeight: "1.5",
                      }}
                    >
                      {element}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-3)",
              padding: "var(--spacing-6)",
              borderTop: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              flexShrink: 0,
            }}
          >
            <Button
              variant="default"
              size="default"
              onClick={() => {
                setScopeFilter(tempScopeFilter);
                setRAGFilter(tempRAGFilter);
                setAcceptabilityFilter(tempAcceptabilityFilter);
                setElementFilter(tempElementFilter);
                setIsFilterPopoverOpen(false);
              }}
              style={{
                fontSize: "var(--text-sm)",
                fontFamily: "Inter, sans-serif",
                fontWeight: "var(--font-weight-medium)",
                width: "100%",
                height: "40px",
              }}
            >
              Apply Filters
            </Button>
            <Button
              variant="ghost"
              size="default"
              onClick={() => {
                setTempScopeFilter([]);
                setTempRAGFilter([]);
                setTempAcceptabilityFilter([]);
                setTempElementFilter([]);
              }}
              style={{
                fontSize: "var(--text-sm)",
                fontFamily: "Inter, sans-serif",
                fontWeight: "var(--font-weight-normal)",
                width: "100%",
                height: "36px",
              }}
            >
              Clear All
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}