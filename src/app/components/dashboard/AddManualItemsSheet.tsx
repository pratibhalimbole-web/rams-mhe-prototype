"use client"

import * as React from "react"
import { Search, Info, AlertCircle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { CreateBOQItem } from "./CreateBOQ"

// --- Mock Catalog Data Generation ---

type CatalogItem = {
  id: string
  elementType: string
  specification: string
  oem: string
  availableStock: number
}

const ELEMENT_TYPES = ["Upright", "Beam", "Bracing", "Base Plate", "Row Spacer", "Safety Clip", "Barrier", "Decking"]
const OEMS = ["Dexion", "SSI Schaefer", "Mecalux", "Stow", "Generic", "Link 51", "Unknown"]

const generateMockCatalog = (count: number): CatalogItem[] => {
  return Array.from({ length: count }).map((_, i) => {
    const type = ELEMENT_TYPES[Math.floor(Math.random() * ELEMENT_TYPES.length)]
    const oem = OEMS[Math.floor(Math.random() * OEMS.length)]
    
    let spec = ""
    switch (type) {
      case "Upright": spec = `H:${2000 + Math.floor(Math.random() * 80) * 100}mm W:${80 + Math.floor(Math.random() * 5) * 10}mm`; break;
      case "Beam": spec = `L:${1000 + Math.floor(Math.random() * 30) * 100}mm D:${80 + Math.floor(Math.random() * 10) * 10}mm`; break;
      case "Bracing": spec = `L:${600 + Math.floor(Math.random() * 15) * 100}mm`; break;
      case "Base Plate": spec = Math.random() > 0.5 ? "Standard 150x150" : "Heavy Duty 200x200"; break;
      case "Row Spacer": spec = `L:${200 + Math.floor(Math.random() * 8) * 50}mm`; break;
      case "Safety Clip": spec = `Type ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`; break;
      default: spec = "Standard Specification";
    }

    return {
      id: `c-${i + 1}`,
      elementType: type,
      specification: spec,
      oem: oem,
      availableStock: Math.floor(Math.random() * 1000)
    }
  })
}

// Generate 150+ items
const MOCK_CATALOG = generateMockCatalog(180)

// --- Component ---

interface AddManualItemsSheetProps {
  isOpen: boolean
  onClose: () => void
  existingItems: CreateBOQItem[]
  onAddItems: (items: CreateBOQItem[]) => void
}

type SelectionState = {
  [catalogId: string]: {
    requiredQty: number | string
    labourQty: number | string
  }
}

export function AddManualItemsSheet({ isOpen, onClose, existingItems, onAddItems }: AddManualItemsSheetProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [oemFilter, setOemFilter] = React.useState("ALL")
  const [typeFilter, setTypeFilter] = React.useState("ALL")
  const [selectedItems, setSelectedItems] = React.useState<SelectionState>({})
  
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  const [showDiscardAlert, setShowDiscardAlert] = React.useState(false)

  // Reset state when opening
  React.useEffect(() => {
    if (isOpen) {
      setSearchTerm("")
      setOemFilter("ALL")
      setTypeFilter("ALL")
      setSelectedItems({})
      setCurrentPage(1)
      setItemsPerPage(10)
      setShowDiscardAlert(false)
    }
  }, [isOpen])

  // Helper to check if item is already in BOQ
  const isAlreadyAdded = React.useCallback((item: CatalogItem) => {
    return existingItems.some(existing => 
      existing.elementType === item.elementType &&
      existing.specification === item.specification &&
      existing.oem === item.oem
    )
  }, [existingItems])

  // Filter logic
  const filteredCatalog = React.useMemo(() => {
    return MOCK_CATALOG.filter(item => {
      // 1. Check if already added (exclude if true)
      if (isAlreadyAdded(item)) return false

      // 2. Apply other filters
      const matchesSearch = 
        item.elementType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.specification.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesOem = oemFilter === "ALL" || item.oem === oemFilter
      const matchesType = typeFilter === "ALL" || item.elementType === typeFilter

      return matchesSearch && matchesOem && matchesType
    })
  }, [searchTerm, oemFilter, typeFilter, isAlreadyAdded])

  // Pagination logic
  const totalPages = Math.ceil(filteredCatalog.length / itemsPerPage)
  const paginatedItems = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCatalog.slice(start, start + itemsPerPage)
  }, [filteredCatalog, currentPage, itemsPerPage])

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, oemFilter, typeFilter])

  const toggleSelection = (item: CatalogItem) => {
    setSelectedItems(prev => {
      const next = { ...prev }
      if (next[item.id]) {
        delete next[item.id]
      } else {
        next[item.id] = { requiredQty: "", labourQty: "" }
      }
      return next
    })
  }

  const updateQuantity = (itemId: string, field: 'requiredQty' | 'labourQty', value: string) => {
    setSelectedItems(prev => {
      const isSelected = !!prev[itemId]
      
      // Auto-select if user types in quantity
      if (!isSelected) {
         return {
           ...prev,
           [itemId]: {
             requiredQty: field === 'requiredQty' ? value : "",
             labourQty: field === 'labourQty' ? value : "",
           }
         }
      }

      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [field]: value
        }
      }
    })
  }

  const handleAdd = () => {
    const newItems: CreateBOQItem[] = []
    
    Object.entries(selectedItems).forEach(([catalogId, quantities]) => {
      const catalogItem = MOCK_CATALOG.find(i => i.id === catalogId)
      const reqQty = parseInt(quantities.requiredQty as string) || 0
      const labQty = parseInt(quantities.labourQty as string) || 0

      if (catalogItem) {
        newItems.push({
          id: `manual-${Date.now()}-${catalogId}`,
          elementType: catalogItem.elementType,
          specification: catalogItem.specification,
          totalObservations: 0,
          repairQty: 0,
          replaceQty: 0,
          installationQty: 0,
          labourQty: labQty,
          requiredQty: reqQty,
          oem: catalogItem.oem,
          availableStock: catalogItem.availableStock,
          remarks: "",
          isManual: true,
        })
      }
    })

    onAddItems(newItems)
    onClose()
  }

  const selectedCount = Object.keys(selectedItems).length
  
  // Validation: Check if all selected items have Required Qty > 0
  const isValid = selectedCount > 0 && Object.values(selectedItems).every(
    item => (parseInt(item.requiredQty as string) || 0) > 0
  )

  const hasActiveFilters = searchTerm !== "" || oemFilter !== "ALL" || typeFilter !== "ALL"

  const clearFilters = () => {
    setSearchTerm("")
    setOemFilter("ALL")
    setTypeFilter("ALL")
  }

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      // User is trying to close
      if (selectedCount > 0) {
        setShowDiscardAlert(true)
      } else {
        onClose()
      }
    } else {
      // Opening (controlled by parent essentially, but just in case)
      // Usually this prop is called when user clicks outside or hits escape
    }
  }

  const handleCancel = () => {
    if (selectedCount > 0) {
      setShowDiscardAlert(true)
    } else {
      onClose()
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent side="right" className="w-[900px] sm:max-w-[1000px] flex flex-col p-0 gap-0">
          
          {/* A. Fixed Header */}
          <SheetHeader className="px-6 py-4 border-b border-border flex-none">
            <SheetTitle>Add Items to BOQ</SheetTitle>
            <SheetDescription>
              Select items you want to add in addition to inspection-based requirements.
            </SheetDescription>
          </SheetHeader>

          {/* B. Table Toolbar (Fixed) - Aligned with Project Toolbar pattern */}
          {/* Added consistent horizontal padding (px-6) */}
          <div className="flex items-center justify-between px-6 py-4 flex-none">
            <div className="flex flex-1 items-center space-x-2">
              <Input 
                placeholder="Search element, size, or profile..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-[250px] lg:w-[350px]"
              />
              <Select value={oemFilter} onValueChange={setOemFilter}>
                <SelectTrigger className="h-8 w-[150px]">
                  <div className="flex items-center gap-2">
                      <span className="truncate">
                        {oemFilter === "ALL" ? "OEM" : oemFilter}
                      </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All OEMs</SelectItem>
                  {OEMS.map(oem => (
                    <SelectItem key={oem} value={oem}>{oem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 w-[150px]">
                  <div className="flex items-center gap-2">
                    <span className="truncate">
                      {typeFilter === "ALL" ? "Element Type" : typeFilter}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {ELEMENT_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Global Selection Indicator (Toolbar) */}
            {selectedCount > 0 && (
               <div className="text-sm text-primary font-medium mr-2">
                 {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
               </div>
            )}
          </div>

          {/* C. Scrollable Table Body Container */}
          <div className="flex-1 overflow-hidden relative flex flex-col border-t border-border">
            {/* Added px-6 padding to the scrollable table container */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">Select</TableHead>
                    <TableHead>Element Type</TableHead>
                    <TableHead>Item Size / Profile</TableHead>
                    <TableHead>OEM</TableHead>
                    <TableHead className="text-center">Available Stock</TableHead>
                    <TableHead className="w-[120px] text-center">Required Qty <span className="text-destructive">*</span></TableHead>
                    <TableHead className="w-[120px] text-center">Labour Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCatalog.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        {hasActiveFilters 
                          ? "No items found matching your filters." 
                          : "All available items have been added to the BOQ."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map(item => {
                      const isSelected = !!selectedItems[item.id]
                      
                      return (
                        <TableRow 
                          key={item.id} 
                          data-state={isSelected ? "selected" : undefined}
                          className="group"
                        >
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={isSelected}
                              onCheckedChange={() => toggleSelection(item)}
                              aria-label="Select item"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.elementType}</TableCell>
                          <TableCell>{item.specification}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">{item.oem}</Badge>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {item.availableStock}
                          </TableCell>
                          <TableCell>
                            <Input 
                                type="number"
                                min="0"
                                placeholder="0"
                                className="h-8 w-full text-center"
                                disabled={!isSelected}
                                value={selectedItems[item.id]?.requiredQty ?? ""}
                                onChange={(e) => updateQuantity(item.id, 'requiredQty', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                                type="number"
                                min="0"
                                placeholder="0"
                                className="h-8 w-full text-center"
                                disabled={!isSelected}
                                value={selectedItems[item.id]?.labourQty ?? ""}
                                onChange={(e) => updateQuantity(item.id, 'labourQty', e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls - Moved outside scroll container for fixed position */}
            {filteredCatalog.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-background/50 flex-none">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${itemsPerPage}`}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPage} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    {`${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, filteredCatalog.length)} of ${filteredCatalog.length}`}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* D. Footer Actions (Fixed) */}
          <SheetFooter className="border-t border-border px-6 py-4 bg-muted/10 flex-none">
            <div className="flex w-full justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {selectedCount > 0 && (
                    !isValid ? (
                      <span className="text-red-500 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Please enter Required Qty for all selected items.
                      </span>
                    ) : (
                      <span>{selectedCount} item{selectedCount !== 1 ? 's' : ''} selected</span>
                    )
                )}
              </div>
              <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleCancel} className="w-32">
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleAdd} 
                    disabled={!isValid} 
                    className="w-48"
                  >
                    Add Selected Items ({selectedCount})
                  </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDiscardAlert} onOpenChange={setShowDiscardAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Selection?</AlertDialogTitle>
            <AlertDialogDescription>
              You have selected items that haven't been added to the BOQ yet. Closing the sheet will discard your selection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={onClose} className="bg-destructive hover:bg-destructive/90">
              Discard & Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}