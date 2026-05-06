"use client"

import * as React from "react"
import { 
  ArrowLeft, 
  FileText,
  FileSpreadsheet,
  ArrowUpDown,
  CircleHelp,
  Info
} from "lucide-react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { toast } from "sonner"
import { useSidebar } from "../layout/SidebarLayout"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

// --- Types ---

export interface BOQSummary {
  id: string
  boqId: string
  inspectionDateRange: string
  totalItems: number
  oemCount: number
  createdBy: { name: string; initials: string }
  createdOn: string
}

export type BOQDetailItem = {
  id: string
  elementType: string
  specification: string
  totalObservations: number
  repairQty: number
  replaceQty: number
  installationQty: number
  labourQty: number
  requiredQty: number
  oem: string
  availableStock: number
  remarks: string
  isManual: boolean
}

// --- Mock Data ---

const generateMockItems = (): BOQDetailItem[] => {
  const elementTypes = ["Upright", "Beam", "Bracing", "Base Plate", "Row Spacer"]
  const specs = ["H:3000mm W:100mm", "L:2700mm D:100mm", "L:1100mm", "Standard 150x150", "L:300mm"]
  const oems = ["Dexion", "SSI Schaefer", "Mecalux", "Unknown", "Stow"]

  return Array.from({ length: 12 }).map((_, i) => {
    const typeIndex = i % elementTypes.length
    const totalObs = Math.floor(Math.random() * 10) + 1
    
    // Distribute randomly ensuring sum equals totalObs
    const repair = Math.floor(Math.random() * (totalObs + 1))
    const replace = Math.floor(Math.random() * (totalObs - repair + 1))
    const labour = totalObs - repair - replace
    
    // Installation qty default 0
    const installation = 0

    return {
      id: `item-${i}`,
      elementType: elementTypes[typeIndex],
      specification: specs[typeIndex],
      totalObservations: totalObs,
      repairQty: repair,
      replaceQty: replace,
      installationQty: installation,
      labourQty: labour,
      requiredQty: Math.floor(Math.random() * 5),
      oem: oems[Math.floor(Math.random() * oems.length)],
      availableStock: Math.floor(Math.random() * 50),
      remarks: i % 3 === 0 ? "Urgent replacement required. Check base plate." : "",
      isManual: i > 8, // Make last few items manual for demo
    }
  })
}

// --- Component ---

interface BOQDetailsProps {
  onBack: () => void
  boqData: BOQSummary
}

export function BOQDetails({ onBack, boqData }: BOQDetailsProps) {
  const [items] = React.useState<BOQDetailItem[]>(generateMockItems())
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { setHeaderActions } = useSidebar() || {};

  // Inject header actions (Download buttons) into the main layout header
  React.useEffect(() => {
    if (setHeaderActions) {
      setHeaderActions(
        <>
          <Button 
            type="button"
            variant="outline" 
            className="gap-2"
            onClick={() => {
              // Simulate download completion
              setTimeout(() => {
                toast.success("PDF downloaded successfully")
              }, 800)
            }}
          >
            <FileText className="h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            type="button"
            variant="outline" 
            className="gap-2"
            onClick={() => {
              // Simulate download completion
              setTimeout(() => {
                toast.success("Excel downloaded successfully")
              }, 800)
            }}
          >
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            Download Excel
          </Button>
        </>
      );
    }

    return () => {
      if (setHeaderActions) {
        setHeaderActions(null);
      }
    };
  }, [setHeaderActions]);

  const columns: ColumnDef<BOQDetailItem>[] = [
    {
      id: "srNo",
      header: "Sr. No",
      cell: ({ row }) => <div className="text-muted-foreground">{row.index + 1}</div>,
    },
    {
      accessorKey: "elementType",
      header: "Element Type",
      cell: ({ row }) => <div className="font-medium">{row.getValue("elementType")}</div>,
    },
    {
      accessorKey: "specification",
      header: "Item Size / Profile",
      cell: ({ row }) => <div>{row.getValue("specification")}</div>,
    },
    {
      accessorKey: "totalObservations",
      header: ({ column }) => <div className="text-center">Total Obs</div>,
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.original.isManual ? "-" : row.getValue("totalObservations")}</div>,
    },
    {
      accessorKey: "repairQty",
      header: ({ column }) => <div className="text-center">Repair Qty</div>,
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.original.isManual ? "-" : row.getValue("repairQty")}</div>,
    },
    {
      accessorKey: "replaceQty",
      header: ({ column }) => <div className="text-center">Replace Qty</div>,
      cell: ({ row }) => <div className={`text-center font-semibold ${row.original.isManual ? "text-muted-foreground" : ""}`}>{row.original.isManual ? "-" : row.getValue("replaceQty")}</div>,
    },
    {
      accessorKey: "installationQty",
      header: ({ column }) => <div className="text-center">Installation Qty</div>,
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.getValue("installationQty")}</div>,
    },
    {
      accessorKey: "requiredQty",
      header: ({ column }) => <div className="text-center">Required Qty</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("requiredQty")}</div>,
    },
    {
      accessorKey: "labourQty",
      header: ({ column }) => (
        <div className="flex items-center justify-center gap-1">
          <span>Labour Required</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Used when work is required without part replacement (e.g. repair or adjustment).</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("labourQty")}</div>,
    },
    {
      accessorKey: "availableStock",
      header: ({ column }) => <div className="text-center text-muted-foreground">Available Stock</div>,
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.original.isManual ? "-" : row.getValue("availableStock")}</div>,
    },
    {
      accessorKey: "remarks",
      header: "Add Specs / Notes",
      cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("remarks") || "-"}</div>,
    },
    // Hidden column for grouping
    {
      accessorKey: "oem",
      header: "OEM",
    },
  ]

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-300">
      
      {/* 2. BOQ Summary */}
      <Card className="bg-muted/30 border-muted">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">BOQ ID</p>
              <p className="text-sm font-medium">{boqData.boqId}</p>
            </div>
            <div className="space-y-1 md:col-span-2 lg:col-span-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Inspection Date Range</p>
              <p className="text-sm font-medium">{boqData.inspectionDateRange}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Total Items</p>
              <p className="text-sm font-medium">{boqData.totalItems}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">OEM Count</p>
              <p className="text-sm font-medium">{boqData.oemCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Created By</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{boqData.createdBy.name}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Created On</p>
              <p className="text-sm font-medium">{boqData.createdOn}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. BOQ Items (OEM-wise Grouped) */}
      <Card className="flex-1 flex flex-col min-h-0 border border-border rounded-md overflow-hidden shadow-none">
        
        <div className="flex-1 overflow-auto relative">
           <div className="min-w-[1050px] inline-block align-middle min-h-full">
              <table className="w-full caption-bottom text-sm">
                <TableHeader className="bg-background sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-b border-border">
                      {headerGroup.headers
                        .filter((header) => header.column.id !== "oem")
                        .map((header) => {
                          let widthStyle = "auto";
                          let alignClass = "text-left";
                          
                          switch(header.column.id) {
                            case "srNo": 
                                widthStyle = "56px"; 
                                alignClass = "text-center";
                                break;
                            case "elementType": widthStyle = "151px"; break;
                            case "specification": widthStyle = "160px"; break;
                            case "existingSpec": widthStyle = "160px"; break; 
                            case "totalObservations": 
                                widthStyle = "83px"; 
                                alignClass = "text-center";
                                break;
                            case "repairQty": 
                                widthStyle = "86px"; 
                                alignClass = "text-center";
                                break;
                            case "replaceQty": 
                                widthStyle = "99px"; 
                                alignClass = "text-center";
                                break;
                            case "requiredQty": 
                                widthStyle = "114px"; 
                                alignClass = "text-center";
                                break;
                            case "labourQty": 
                                widthStyle = "145px"; 
                                alignClass = "text-center";
                                break; 
                            case "availableStock": 
                                widthStyle = "126px"; 
                                alignClass = "text-center";
                                break;
                            case "remarks": widthStyle = "150px"; break;
                          }

                          return (
                            <TableHead 
                              key={header.id} 
                              style={{ width: widthStyle, minWidth: widthStyle }}
                              className={`text-xs font-semibold uppercase h-12 px-2 ${alignClass} ${header.column.id === 'availableStock' ? 'text-muted-foreground' : 'text-foreground'}`}
                            >
                              {header.isPlaceholder ? null : (
                                <div className={`flex items-center ${alignClass === 'text-center' ? 'justify-center' : ''} gap-1`}>
                                   {header.column.id === 'elementType' ? (
                                      <Button 
                                        variant="ghost" 
                                        className="h-8 p-0 hover:bg-transparent font-semibold uppercase text-xs text-foreground"
                                        onClick={header.column.getToggleSortingHandler()}
                                      >
                                        ELEMENT TYPE
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2">
                                          <path d="M14 10.6667L11.3333 13.3333L8.66667 10.6667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M11.3333 13.3333V2.66667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M2 5.33333L4.66667 2.66667L7.33333 5.33333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M4.66667 2.66667V13.3333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      </Button>
                                   ) : header.column.id === 'requiredQty' ? (
                                      <>
                                        REQUIRED QTY <span className="text-destructive">*</span>
                                      </>
                                   ) : header.column.id === 'labourQty' ? (
                                      <>
                                        LABOUR REQUIRED
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="cursor-help">
                                                  <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                                  <path d="M4.54498 4.5C4.66253 4.16584 4.89456 3.88406 5.19996 3.70457C5.50536 3.52508 5.86443 3.45947 6.21357 3.51936C6.56271 3.57925 6.87939 3.76076 7.10752 4.03177C7.33565 4.30277 7.46051 4.64576 7.45998 5C7.45998 6 5.95998 6.5 5.95998 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                                  <path d="M6 8.5H6.005" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Used when work is required without part replacement.</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </>
                                   ) : (
                                      flexRender(header.column.columnDef.header, header.getContext())
                                   )}
                                </div>
                              )}
                            </TableHead>
                          );
                        })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  <TooltipProvider>
                  {(() => {
                    const rows = table.getRowModel().rows;
                    const inspectionRows = rows.filter(row => !row.original.isManual);
                    const manualRows = rows.filter(row => row.original.isManual);
                    const flatRows: React.ReactNode[] = [];
                    
                    if (rows.length === 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={11} className="h-24 text-center">
                            No items found.
                          </TableCell>
                        </TableRow>
                      );
                    }

                    // --- SECTION A: Inspection-Based Items (Grouped by OEM) ---
                    if (inspectionRows.length > 0) {
                      const groupedRows = inspectionRows.reduce((acc, row) => {
                        const oem = row.getValue("oem") as string;
                        if (!acc[oem]) acc[oem] = [];
                        acc[oem].push(row);
                        return acc;
                      }, {} as Record<string, typeof rows>);

                      Object.entries(groupedRows).forEach(([oem, groupRows]) => {
                        // Group Header
                        flatRows.push(
                          <TableRow key={`group-header-${oem}`} className="bg-muted/20 hover:bg-muted/20">
                             <TableCell colSpan={11} className="py-2 px-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-primary text-sm">{oem}</span>
                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                                      {groupRows.length} items
                                    </Badge>
                                </div>
                             </TableCell>
                          </TableRow>
                        );
                        
                        // Group Items
                        groupRows.forEach((row) => {
                          flatRows.push(
                            <TableRow key={row.id}>
                              {row.getVisibleCells()
                                .filter(cell => cell.column.id !== "oem")
                                .map((cell) => {
                                  let widthStyle = "auto";
                                  switch(cell.column.id) {
                                    case "srNo": widthStyle = "56px"; break;
                                    case "elementType": widthStyle = "151px"; break;
                                    case "specification": widthStyle = "160px"; break;
                                    case "totalObservations": widthStyle = "83px"; break;
                                    case "repairQty": widthStyle = "86px"; break;
                                    case "replaceQty": widthStyle = "99px"; break;
                                    case "installationQty": widthStyle = "110px"; break;
                                    case "requiredQty": widthStyle = "114px"; break;
                                    case "labourQty": widthStyle = "145px"; break; 
                                    case "availableStock": widthStyle = "126px"; break;
                                    case "remarks": widthStyle = "200px"; break;
                                  }

                                const isTextCell = ["elementType", "specification", "remarks"].includes(cell.column.id);

                                return (
                                  <TableCell 
                                    key={cell.id} 
                                    style={{ width: widthStyle, minWidth: widthStyle, maxWidth: widthStyle }}
                                    className="py-2 px-2 text-xs"
                                  >
                                     {isTextCell ? (
                                       <Tooltip delayDuration={500}>
                                         <TooltipTrigger asChild>
                                           <div className="line-clamp-2 w-full cursor-default text-left break-words">
                                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                           </div>
                                         </TooltipTrigger>
                                         <TooltipContent side="top" className="max-w-[300px] break-words">
                                            {row.getValue(cell.column.id) as string || "-"}
                                         </TooltipContent>
                                       </Tooltip>
                                    ) : (
                                      flexRender(cell.column.columnDef.cell, cell.getContext())
                                    )}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          );
                        });
                      });
                    }

                    // --- SECTION B: Additional Items (Manual) ---
                    if (manualRows.length > 0) {
                      flatRows.push(
                        <TableRow key="manual-section-header" className="bg-primary/5 hover:bg-primary/5 border-y">
                          <TableCell colSpan={11} className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary">Additional Items (Added Manually)</span>
                                <Badge variant="outline" className="text-xs font-normal bg-background">
                                  {manualRows.length} items
                                </Badge>
                              </div>
                          </TableCell>
                        </TableRow>
                      );

                      manualRows.forEach((row) => {
                        flatRows.push(
                          <TableRow key={row.id} className="bg-primary/5 hover:bg-muted/50">
                            {row.getVisibleCells()
                              .filter(cell => cell.column.id !== "oem")
                              .map((cell) => {
                                let widthStyle = "auto";
                                switch(cell.column.id) {
                                  case "srNo": widthStyle = "56px"; break;
                                  case "elementType": widthStyle = "151px"; break;
                                  case "specification": widthStyle = "160px"; break;
                                  case "totalObservations": widthStyle = "83px"; break;
                                  case "repairQty": widthStyle = "86px"; break;
                                  case "replaceQty": widthStyle = "99px"; break;
                                  case "installationQty": widthStyle = "110px"; break;
                                  case "requiredQty": widthStyle = "114px"; break;
                                  case "labourQty": widthStyle = "145px"; break; 
                                  case "availableStock": widthStyle = "126px"; break;
                                  case "remarks": widthStyle = "200px"; break;
                                }

                                const isTextCell = ["elementType", "specification", "remarks"].includes(cell.column.id);

                                return (
                                  <TableCell 
                                    key={cell.id} 
                                    style={{ width: widthStyle, minWidth: widthStyle, maxWidth: widthStyle }}
                                    className="py-2 px-2 text-xs"
                                  >
                                     {isTextCell ? (
                                       <Tooltip delayDuration={500}>
                                         <TooltipTrigger asChild>
                                           <div className="line-clamp-2 w-full cursor-default text-left break-words">
                                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                           </div>
                                         </TooltipTrigger>
                                         <TooltipContent side="top" className="max-w-[300px] break-words">
                                            {row.getValue(cell.column.id) as string || "-"}
                                         </TooltipContent>
                                       </Tooltip>
                                    ) : (
                                      flexRender(cell.column.columnDef.cell, cell.getContext())
                                    )}
                                  </TableCell>
                                )
                            })}
                          </TableRow>
                        );
                      });
                    }

                    return flatRows;
                  })()}
                  </TooltipProvider>
                </TableBody>
              </table>
           </div>
        </div>
      </Card>
    </div>
  )
}