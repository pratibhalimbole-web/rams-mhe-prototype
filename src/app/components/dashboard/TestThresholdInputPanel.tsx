"use client"

import * as React from "react"
import { AlertCircle, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { TestType } from "../../types/test-types"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

interface TestThresholdInputPanelProps {
  test: TestType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (testId: string, thresholds: ElementRAGThreshold[] | GlobalRAGThreshold) => void
}

// RAG threshold for a single element type (Local tests)
export interface ElementRAGThreshold {
  elementType: string
  green: number
  amber: number
  red: number
}

// RAG threshold for Global tests
export interface GlobalRAGThreshold {
  green: number
  amber: number
  red: number
}

export function TestThresholdInputPanel({ 
  test, 
  open, 
  onOpenChange, 
  onSave 
}: TestThresholdInputPanelProps) {
  const [globalThresholds, setGlobalThresholds] = React.useState<GlobalRAGThreshold>({
    green: 2.0,
    amber: 4.0,
    red: 6.0
  })
  const [elementThresholds, setElementThresholds] = React.useState<ElementRAGThreshold[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [showExitWarning, setShowExitWarning] = React.useState(false)

  // Load data when test changes
  React.useEffect(() => {
    if (test && open) {
      if (test.scope === "Global") {
        // Load from existing thresholds if available
        if (test.thresholds) {
          setGlobalThresholds({
            green: test.thresholds.green.max,
            amber: test.thresholds.amber.max,
            red: test.thresholds.red.min
          })
        } else {
          setGlobalThresholds({ green: 2.0, amber: 4.0, red: 6.0 })
        }
      } else {
        // For Local tests, create thresholds for each linked element type
        const linkedElements = test.linkedElementTypes || []
        setElementThresholds(
          linkedElements.map(elem => ({
            elementType: elem,
            green: 2.0,
            amber: 4.0,
            red: 6.0
          }))
        )
      }
      setHasUnsavedChanges(false)
      setShowExitWarning(false)
    }
  }, [test, open])

  const handleGlobalThresholdChange = (field: 'green' | 'amber' | 'red', value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setGlobalThresholds(prev => ({ ...prev, [field]: numValue }))
      setHasUnsavedChanges(true)
    }
  }

  const handleElementThresholdChange = (elementType: string, field: 'green' | 'amber' | 'red', value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setElementThresholds(prev => 
        prev.map(et => 
          et.elementType === elementType 
            ? { ...et, [field]: numValue }
            : et
        )
      )
      setHasUnsavedChanges(true)
    }
  }

  const validateThresholds = (green: number, amber: number, red: number): boolean => {
    return green >= 0 && amber >= 0 && red >= 0 && green < amber && amber < red
  }

  const handleSave = async () => {
    if (!test) return

    // Validation
    if (test.scope === "Global") {
      if (!validateThresholds(globalThresholds.green, globalThresholds.amber, globalThresholds.red)) {
        toast.error("Thresholds must satisfy: 0 ≤ Green < Amber < Red")
        return
      }
      await new Promise(resolve => setTimeout(resolve, 300))
      onSave(test.id, globalThresholds)
    } else {
      const hasInvalidValues = elementThresholds.some(et => 
        !validateThresholds(et.green, et.amber, et.red)
      )
      if (hasInvalidValues) {
        toast.error("All thresholds must satisfy: 0 ≤ Green < Amber < Red")
        return
      }
      const hasEmptyValues = elementThresholds.length === 0
      if (hasEmptyValues) {
        toast.error("At least one element type must be configured")
        return
      }
      await new Promise(resolve => setTimeout(resolve, 300))
      onSave(test.id, elementThresholds)
    }

    setHasUnsavedChanges(false)
    onOpenChange(false)
    toast.success("Thresholds saved successfully")
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowExitWarning(true)
    } else {
      onOpenChange(false)
    }
  }

  const confirmExit = () => {
    setShowExitWarning(false)
    setHasUnsavedChanges(false)
    onOpenChange(false)
  }

  const cancelExit = () => {
    setShowExitWarning(false)
  }

  if (!test) return null

  const isValid = test.scope === "Global" 
    ? validateThresholds(globalThresholds.green, globalThresholds.amber, globalThresholds.red)
    : elementThresholds.every(et => validateThresholds(et.green, et.amber, et.red)) && elementThresholds.length > 0

  return (
    <Sheet open={open} onOpenChange={(val) => {
      if (!val) handleCancel()
    }}>
      <SheetContent 
        hideDefaultClose={true}
        className="w-[90vw] sm:max-w-[700px] sm:w-[700px] bg-background border-l border-border p-0 flex flex-col gap-0 overflow-y-auto" 
        side="right"
      >
        <SheetHeader className="px-[--spacing-6] py-[--spacing-5] border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-start justify-between gap-[--spacing-4]">
            <div className="flex-1">
              <SheetTitle className="text-[length:var(--text-base)] font-[number:var(--font-weight-semi-bold)] leading-[1.5] text-foreground">
                {test.name} ({test.id}) — Threshold Settings
              </SheetTitle>
              <SheetDescription className="sr-only">
                Configure RAG threshold values for {test.name} test. This panel allows you to set Green, Amber, and Red evaluation thresholds.
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-[--spacing-6] w-[--spacing-6] rounded-[--radius-sm] opacity-70 hover:opacity-100 hover:bg-muted flex-shrink-0"
              onClick={handleCancel}
              aria-label="Close panel"
            >
              <X className="h-[--spacing-4] w-[--spacing-4]" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[800px] px-[--spacing-6] py-[--spacing-8]">
            {/* Unsaved Changes Warning Banner */}
            {showExitWarning && hasUnsavedChanges && (
              <div className="mb-[--spacing-6] rounded-[--radius] border border-[var(--chart-3)] bg-[color-mix(in_srgb,var(--chart-3)_8%,transparent)] p-[--spacing-4]">
                <div className="flex items-start gap-[--spacing-3]">
                  <AlertCircle className="h-[--spacing-5] w-[--spacing-5] flex-shrink-0 text-[var(--chart-3)]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[length:var(--text-sm)] font-[number:var(--font-weight-semi-bold)] text-foreground">
                      Unsaved Changes
                    </p>
                    <p className="mt-[--spacing-1] text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-muted-foreground">
                      You have unsaved changes that will be lost if you leave.
                    </p>
                    <div className="mt-[--spacing-3] flex gap-[--spacing-2]">
                      <Button 
                        type="button"
                        onClick={cancelExit}
                        size="sm"
                        className="h-8 px-[--spacing-3] text-[length:var(--text-sm)] font-[number:var(--font-weight-medium)]"
                      >
                        Keep Editing
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={confirmExit}
                        size="sm"
                        className="h-8 px-[--spacing-3] text-[length:var(--text-sm)] font-[number:var(--font-weight-medium)]"
                      >
                        Discard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-[--spacing-8]">
              {/* Section 1 — Test Context (Read-Only) */}
              <div className="space-y-[--spacing-4]">
                <div>
                  <h3 className="text-[length:var(--text-sm)] font-[number:var(--font-weight-semi-bold)] text-foreground">
                    Test Context
                  </h3>
                  <p className="mt-[--spacing-1] text-[length:var(--text-xs)] font-[number:var(--font-weight-normal)] text-muted-foreground">
                    Basic information about this test
                  </p>
                </div>
                <div className="rounded-[--radius] border border-border bg-card">
                  <div className="divide-y divide-border">
                    <div className="flex items-center px-[--spacing-4] py-[--spacing-3]">
                      <div className="w-[160px] text-[length:var(--text-sm)] font-[number:var(--font-weight-medium)] text-muted-foreground">
                        Test ID
                      </div>
                      <div className="flex-1 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-foreground">
                        {test.id}
                      </div>
                    </div>
                    <div className="flex items-center px-[--spacing-4] py-[--spacing-3]">
                      <div className="w-[160px] text-[length:var(--text-sm)] font-[number:var(--font-weight-medium)] text-muted-foreground">
                        Test Scope
                      </div>
                      <div className="flex-1 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-foreground">
                        {test.scope}
                      </div>
                    </div>
                    <div className="flex items-center px-[--spacing-4] py-[--spacing-3]">
                      <div className="w-[160px] text-[length:var(--text-sm)] font-[number:var(--font-weight-medium)] text-muted-foreground">
                        Evaluation Metric
                      </div>
                      <div className="flex-1 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-foreground">
                        {test.metric} ({test.unit})
                      </div>
                    </div>
                    <div className="flex items-center px-[--spacing-4] py-[--spacing-3]">
                      <div className="w-[160px] text-[length:var(--text-sm)] font-[number:var(--font-weight-medium)] text-muted-foreground">
                        Standard(s)
                      </div>
                      <div className="flex-1 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-foreground">
                        {test.standard}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2 — Threshold Settings (Inputs) */}
              <div className="space-y-[--spacing-4]">
                <div>
                  <h3 className="text-[length:var(--text-sm)] font-[number:var(--font-weight-semi-bold)] text-foreground">
                    Threshold Settings
                  </h3>
                  <p className="mt-[--spacing-1] text-[length:var(--text-xs)] font-[number:var(--font-weight-normal)] text-muted-foreground">
                    Configure RAG thresholds for test evaluation
                  </p>
                </div>
                
                {test.scope === "Global" ? (
                  // 2A: Global Test - Single Row RAG Threshold
                  <div className="rounded-[--radius] border border-border bg-card overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border hover:bg-transparent">
                          <TableHead className="h-10 px-[--spacing-4] text-[length:var(--text-xs)] font-[number:var(--font-weight-medium)] text-muted-foreground text-right">
                            Green (≤)
                          </TableHead>
                          <TableHead className="h-10 px-[--spacing-4] text-[length:var(--text-xs)] font-[number:var(--font-weight-medium)] text-muted-foreground text-right">
                            Amber (≤)
                          </TableHead>
                          <TableHead className="h-10 px-[--spacing-4] text-[length:var(--text-xs)] font-[number:var(--font-weight-medium)] text-muted-foreground text-right">
                            Red (&gt;)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-0 hover:bg-transparent">
                          <TableCell className="h-14 px-[--spacing-4]">
                            <div className="flex items-center justify-end gap-[--spacing-2]">
                              <Input
                                type="number"
                                step="any"
                                value={globalThresholds.green}
                                onChange={(e) => handleGlobalThresholdChange('green', e.target.value)}
                                className="h-9 w-28 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-right"
                              />
                              <span className="text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-muted-foreground w-12">
                                {test.unit}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="h-14 px-[--spacing-4]">
                            <div className="flex items-center justify-end gap-[--spacing-2]">
                              <Input
                                type="number"
                                step="any"
                                value={globalThresholds.amber}
                                onChange={(e) => handleGlobalThresholdChange('amber', e.target.value)}
                                className="h-9 w-28 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-right"
                              />
                              <span className="text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-muted-foreground w-12">
                                {test.unit}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="h-14 px-[--spacing-4]">
                            <div className="flex items-center justify-end gap-[--spacing-2]">
                              <Input
                                type="number"
                                step="any"
                                value={globalThresholds.red}
                                onChange={(e) => handleGlobalThresholdChange('red', e.target.value)}
                                className="h-9 w-28 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-right"
                              />
                              <span className="text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-muted-foreground w-12">
                                {test.unit}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  // 2B: Local Test - RAG Threshold per Element Type
                  <div className="rounded-[--radius] border border-border bg-card overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border hover:bg-transparent">
                          <TableHead className="h-10 px-[--spacing-4] text-[length:var(--text-xs)] font-[number:var(--font-weight-medium)] text-muted-foreground">
                            Element Type
                          </TableHead>
                          <TableHead className="h-10 px-[--spacing-4] text-[length:var(--text-xs)] font-[number:var(--font-weight-medium)] text-muted-foreground text-right">
                            Green (≤)
                          </TableHead>
                          <TableHead className="h-10 px-[--spacing-4] text-[length:var(--text-xs)] font-[number:var(--font-weight-medium)] text-muted-foreground text-right">
                            Amber (≤)
                          </TableHead>
                          <TableHead className="h-10 px-[--spacing-4] text-[length:var(--text-xs)] font-[number:var(--font-weight-medium)] text-muted-foreground text-right">
                            Red (&gt;)
                          </TableHead>
                          <TableHead className="h-10 px-[--spacing-4] text-[length:var(--text-xs)] font-[number:var(--font-weight-medium)] text-muted-foreground">
                            Unit
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {elementThresholds.length === 0 ? (
                          <TableRow className="border-0 hover:bg-transparent">
                            <TableCell colSpan={5} className="h-24 text-center">
                              <div className="flex flex-col items-center gap-[--spacing-2] py-[--spacing-4]">
                                <p className="text-[length:var(--text-sm)] font-[number:var(--font-weight-medium)] text-muted-foreground">
                                  No element types configured
                                </p>
                                <p className="text-[length:var(--text-xs)] font-[number:var(--font-weight-normal)] text-muted-foreground">
                                  Configure element linking to add thresholds
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          elementThresholds.map((et, index) => (
                            <TableRow 
                              key={et.elementType} 
                              className={`${index === elementThresholds.length - 1 ? 'border-0' : 'border-b border-border'} hover:bg-muted/30`}
                            >
                              <TableCell className="h-14 px-[--spacing-4] text-[length:var(--text-sm)] font-[number:var(--font-weight-medium)] text-foreground">
                                {et.elementType}
                              </TableCell>
                              <TableCell className="h-14 px-[--spacing-4]">
                                <div className="flex justify-end">
                                  <Input
                                    type="number"
                                    step="any"
                                    value={et.green}
                                    onChange={(e) => handleElementThresholdChange(et.elementType, 'green', e.target.value)}
                                    className="h-9 w-24 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-right"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="h-14 px-[--spacing-4]">
                                <div className="flex justify-end">
                                  <Input
                                    type="number"
                                    step="any"
                                    value={et.amber}
                                    onChange={(e) => handleElementThresholdChange(et.elementType, 'amber', e.target.value)}
                                    className="h-9 w-24 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-right"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="h-14 px-[--spacing-4]">
                                <div className="flex justify-end">
                                  <Input
                                    type="number"
                                    step="any"
                                    value={et.red}
                                    onChange={(e) => handleElementThresholdChange(et.elementType, 'red', e.target.value)}
                                    className="h-9 w-24 text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-right"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="h-14 px-[--spacing-4] text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] text-muted-foreground">
                                {test.unit}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Section 3 — System Evaluation Note (Read-Only) */}
              <div className="space-y-[--spacing-4]">
                <div>
                  <h3 className="text-[length:var(--text-sm)] font-[number:var(--font-weight-semi-bold)] text-foreground">
                    Evaluation Logic
                  </h3>
                  <p className="mt-[--spacing-1] text-[length:var(--text-xs)] font-[number:var(--font-weight-normal)] text-muted-foreground">
                    How test results are processed
                  </p>
                </div>
                <div className="rounded-[--radius] border border-border bg-muted/50 px-[--spacing-4] py-[--spacing-3]">
                  <p className="text-[length:var(--text-sm)] font-[number:var(--font-weight-normal)] leading-[1.6] text-muted-foreground">
                    The system evaluates test results using the configured thresholds. Severity (Green / Amber / Red) is calculated automatically based on the final computed test value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="px-[--spacing-6] py-[--spacing-4] border-t border-border bg-card flex-row justify-end gap-[--spacing-3] sm:gap-[--spacing-3] sticky bottom-0">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleCancel}
            className="flex-1 sm:flex-none h-9 px-[--spacing-4] text-[length:var(--text-base)] font-[number:var(--font-weight-medium)] leading-[1.5] border-border bg-transparent hover:bg-muted text-foreground"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="flex-1 sm:flex-none h-9 px-[--spacing-4] text-[length:var(--text-base)] font-[number:var(--font-weight-medium)] leading-[1.5] bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Thresholds
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}