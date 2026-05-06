import React, { useState } from "react";
import { cn } from "../ui/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { 
  MoreVertical, 
  Search, 
  Plus, 
  ListChecks, 
  ArrowUpDown,
  FileText,
  FileQuestion
} from "lucide-react";

// --- Types & Mock Data ---

type ElementStatus = "Active" | "Inactive";
type ElementCategory = "Structural" | "General";

interface ElementItem {
  id: string;
  name: string;
  category: ElementCategory;
  status: ElementStatus;
}

const MOCK_ELEMENTS: ElementItem[] = [
  { id: "BOQ-APR25", name: "Baseplate", category: "Structural", status: "Active" },
  { id: "BOQ-MAY10", name: "Upright Column", category: "Structural", status: "Active" },
  { id: "BOQ-JUN15", name: "Safety Label", category: "General", status: "Inactive" },
  { id: "BOQ-JUL20", name: "Horizontal Brace", category: "Structural", status: "Active" },
  { id: "BOQ-AUG05", name: "Guide Rail", category: "General", status: "Active" },
  { id: "BOQ-SEP12", name: "Frame Protector", category: "General", status: "Inactive" },
  { id: "BOQ-OCT30", name: "Mesh Decking", category: "Structural", status: "Active" },
  { id: "BOQ-NOV08", name: "Row Spacer", category: "Structural", status: "Active" },
  { id: "BOQ-DEC14", name: "Load Sign", category: "General", status: "Active" },
  { id: "BOQ-JAN22", name: "Splice Kit", category: "Structural", status: "Inactive" },
  { id: "BOQ-FEB11", name: "Anchor Bolt", category: "Structural", status: "Active" },
  { id: "BOQ-MAR03", name: "Shims", category: "General", status: "Active" },
];

// --- Risk Assessment Chart Data (Legacy) ---
const RISK_DATA = [
  { level: "Low", count: 12, color: "var(--chart-2)" },
  { level: "Medium", count: 8, color: "var(--chart-3)" },
  { level: "High", count: 5, color: "var(--chart-5)" },
  { level: "Severe", count: 2, color: "var(--chart-4)" },
];

const MATRIX_ROWS = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
const MATRIX_COLS = ["Insignificant", "Minor", "Moderate", "Major", "Severe"];

const getRiskLevel = (row: number, col: number) => {
  const score = (row + 1) * (col + 1);
  if (score <= 5) return { label: "Low", color: "bg-[var(--chart-2)]/20 text-[var(--chart-2)]" };
  if (score <= 10) return { label: "Medium", color: "bg-[var(--chart-3)]/20 text-[var(--chart-3)]" };
  if (score <= 15) return { label: "High", color: "bg-[var(--chart-5)]/20 text-[var(--chart-5)]" };
  return { label: "Severe", color: "bg-[var(--chart-4)]/20 text-[var(--chart-4)]" };
};

interface NoDataProps {
  title?: string;
  message?: string;
  className?: string;
}

export function NoData({ title, message, className }: NoDataProps) {
  const [view, setView] = useState<"table" | "chart">("table");
  const [elements, setElements] = useState<ElementItem[]>(MOCK_ELEMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof ElementItem; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  // Confirmation Dialog State
  const [confirmItem, setConfirmItem] = useState<ElementItem | null>(null);

  // --- Filter & Sort Logic ---
  const filteredElements = elements.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedElements = React.useMemo(() => {
    if (!sortConfig) return filteredElements;
    return [...filteredElements].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredElements, sortConfig]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(sortedElements.length / rowsPerPage);
  const paginatedElements = sortedElements.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key: keyof ElementItem) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleToggleStatus = (item: ElementItem) => {
    setConfirmItem(item);
  };

  const confirmToggle = () => {
    if (confirmItem) {
      setElements(prev => prev.map(e => 
        e.id === confirmItem.id 
          ? { ...e, status: e.status === "Active" ? "Inactive" : "Active" }
          : e
      ));
      setConfirmItem(null);
    }
  };

  return (
    <div className={cn("w-full h-full flex flex-col bg-[var(--background)]", className)}>
      {/* Empty State Content */}
      <div className="flex-1 w-full min-w-0 flex items-center justify-center p-[var(--spacing-6)]">
        <div className="flex flex-col items-center justify-center gap-[var(--spacing-4)] max-w-md text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--muted)]">
            <FileQuestion className="w-8 h-8 text-[var(--muted-foreground)]" />
          </div>
          <div className="space-y-[var(--spacing-2)]">
            <h3 className="text-[length:var(--text-lg)] font-[var(--font-weight-semibold)] text-[var(--foreground)]">
              {title || "No Data Available"}
            </h3>
            <p className="text-[length:var(--text-sm)] text-[var(--muted-foreground)]">
              {message || "This section is currently under development or has no data to display."}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Confirmation Dialog */}
      <AlertDialog open={!!confirmItem} onOpenChange={(open) => !open && setConfirmItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              This change will apply wherever this element is used. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}