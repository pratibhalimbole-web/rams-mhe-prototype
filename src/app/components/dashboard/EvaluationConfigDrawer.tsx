"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { RuleRegistry } from "./rule-engine"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementConfiguration = {
  baseLimit?: number
  crossAisleLimit?: number
  downAisleLimit?: number
  isDirty: boolean
  isValid: boolean
  lastUpdated?: {
    user: string
    date: string
  }
}

export type EvaluationConfigDrawerProps = {
  testName: string
  testId: string
  testScope?: "Global" | "Local"
  linkedElements?: string[]
  engineType?: "STATIC" | "FORMULA"
  ruleKey?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (elementName: string, config: ElementConfiguration) => void
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createInitialElementConfig(
  elementName: string,
  elementRule: "BASE_LIMIT" | "DUAL_AXIS" | "FORMULA"
): ElementConfiguration {
  if (elementRule === "DUAL_AXIS") {
    return {
      crossAisleLimit: 0,
      downAisleLimit: 0,
      isDirty: false,
      isValid: true,
    }
  }

  if (elementRule === "FORMULA") {
    return {
      isDirty: false,
      isValid: true,
    }
  }

  return {
    baseLimit: 0,
    isDirty: false,
    isValid: true,
  }
}

function validateElement(
  config: ElementConfiguration,
  elementRule: "BASE_LIMIT" | "DUAL_AXIS" | "FORMULA"
): boolean {
  if (elementRule === "FORMULA") {
    return true
  }

  if (elementRule === "DUAL_AXIS") {
    return (
      config.crossAisleLimit !== undefined &&
      config.crossAisleLimit >= 0 &&
      config.downAisleLimit !== undefined &&
      config.downAisleLimit >= 0
    )
  }

  return config.baseLimit !== undefined && config.baseLimit >= 0
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EvaluationConfigDrawer({
  testName,
  testId,
  testScope = "Local",
  linkedElements = [],
  engineType,
  ruleKey,
  open,
  onOpenChange,
  onSave,
}: EvaluationConfigDrawerProps) {
  // ALWAYS call all hooks at the top level - no conditional hook calls
  const [elementConfigs, setElementConfigs] = React.useState<Record<string, ElementConfiguration>>({})
  const [showUnsavedBanner, setShowUnsavedBanner] = React.useState(false)
  const elementSnapshotRef = React.useRef<Record<string, ElementConfiguration>>({})

  // G1 Plumbness Threshold Configuration State
  const [thresholdMode, setThresholdMode] = React.useState<"mm_per_m" | "height_ratio">("mm_per_m")
  const [greenLimit, setGreenLimit] = React.useState<string>("1.0")
  const [amberLimit, setAmberLimit] = React.useState<string>("2.0")
  const [divisor, setDivisor] = React.useState<string>("500")
  const [redMultiplier, setRedMultiplier] = React.useState<string>("1.5")
  
  // Validation errors for threshold config
  const [greenLimitError, setGreenLimitError] = React.useState<string>("")
  const [amberLimitError, setAmberLimitError] = React.useState<string>("")
  const [divisorError, setDivisorError] = React.useState<string>("")
  const [multiplierError, setMultiplierError] = React.useState<string>("")

  // Get rule definition from registry
  const ruleDefinition = ruleKey ? RuleRegistry[ruleKey] : null

  // Debug logging
  React.useEffect(() => {
    if (open && ruleDefinition) {
      console.log("🔍 EvaluationConfigDrawer Props:", {
        testName,
        testId,
        ruleKey,
        engineType,
        linkedElements,
        open,
      })
      console.log("🔍 RuleDefinition:", ruleDefinition)
    }
  }, [testName, testId, ruleKey, engineType, linkedElements, open, ruleDefinition])

  // Initialize configs when linkedElements changes
  React.useEffect(() => {
    if (!ruleDefinition || ruleDefinition.engineType === "FORMULA") {
      setElementConfigs({})
      return
    }

    const configs: Record<string, ElementConfiguration> = {}
    linkedElements.forEach((element) => {
      const elementRule =
        ruleDefinition.elementRules?.[element] ||
        ruleDefinition.elementRules?.default ||
        "BASE_LIMIT"
      configs[element] = createInitialElementConfig(element, elementRule)
    })
    setElementConfigs(configs)
  }, [linkedElements, ruleDefinition])

  // Initialize snapshot when drawer opens
  React.useEffect(() => {
    if (open) {
      elementSnapshotRef.current = JSON.parse(JSON.stringify(elementConfigs))
      setShowUnsavedBanner(false)
    }
  }, [open, elementConfigs])

  // Check if ANY element has unsaved changes
  const hasUnsavedChanges = React.useMemo(() => {
    return linkedElements.some((elementName) => {
      if (!elementSnapshotRef.current[elementName]) return false
      const snapshot = elementSnapshotRef.current[elementName]
      const current = elementConfigs[elementName]
      return JSON.stringify(snapshot) !== JSON.stringify(current)
    })
  }, [linkedElements, elementConfigs])

  // Check if ALL elements are valid
  const allElementsValid = React.useMemo(() => {
    if (!ruleDefinition) return true

    return linkedElements.every((elementName) => {
      const config = elementConfigs[elementName]
      if (!config) return false

      const elementRule =
        ruleDefinition.elementRules?.[elementName] ||
        ruleDefinition.elementRules?.default ||
        "BASE_LIMIT"

      return validateElement(config, elementRule)
    })
  }, [linkedElements, elementConfigs, ruleDefinition])

  // Update specific field for an element
  const updateElementField = (elementName: string, field: string, value: number) => {
    if (!ruleDefinition) return

    setElementConfigs((prev) => {
      const elementRule =
        ruleDefinition.elementRules?.[elementName] ||
        ruleDefinition.elementRules?.default ||
        "BASE_LIMIT"

      const updated = {
        ...prev,
        [elementName]: {
          ...prev[elementName],
          [field]: value,
          isDirty: true,
        },
      }

      updated[elementName].isValid = validateElement(updated[elementName], elementRule)

      return updated
    })
  }

  // Handle discard unsaved changes
  const handleDiscardChanges = () => {
    setElementConfigs(JSON.parse(JSON.stringify(elementSnapshotRef.current)))
    setShowUnsavedBanner(false)
  }

  // Handle keep editing
  const handleKeepEditing = () => {
    setShowUnsavedBanner(false)
  }

  // Handle close
  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedBanner(true)
    } else {
      onOpenChange(false)
    }
  }

  // Handle save all configurations
  const handleSaveAll = () => {
    if (!allElementsValid) {
      return
    }

    const updatedConfigs = { ...elementConfigs }
    const timestamp = {
      user: "Current User",
      date: new Date().toLocaleDateString(),
    }

    linkedElements.forEach((elementName) => {
      updatedConfigs[elementName] = {
        ...updatedConfigs[elementName],
        isDirty: false,
        lastUpdated: timestamp,
      }

      onSave(elementName, updatedConfigs[elementName])
    })

    setElementConfigs(updatedConfigs)
    elementSnapshotRef.current = JSON.parse(JSON.stringify(updatedConfigs))
    setShowUnsavedBanner(false)
  }

  // ============================================================================
  // G1 PLUMBNESS THRESHOLD VALIDATION & HANDLERS
  // ============================================================================

  // Validation functions for threshold config
  const validateGreenLimit = (value: string): boolean => {
    const num = parseFloat(value)
    if (isNaN(num)) {
      setGreenLimitError("Must be a valid number")
      return false
    }
    if (num <= 0) {
      setGreenLimitError("Must be greater than 0")
      return false
    }
    setGreenLimitError("")
    return true
  }

  const validateAmberLimit = (value: string, greenValue: string): boolean => {
    const num = parseFloat(value)
    const greenNum = parseFloat(greenValue)
    
    if (isNaN(num)) {
      setAmberLimitError("Must be a valid number")
      return false
    }
    if (num <= 0) {
      setAmberLimitError("Must be greater than 0")
      return false
    }
    if (!isNaN(greenNum) && num <= greenNum) {
      setAmberLimitError("Must be greater than Green Limit")
      return false
    }
    setAmberLimitError("")
    return true
  }

  const validateDivisor = (value: string): boolean => {
    const num = parseInt(value)
    if (isNaN(num)) {
      setDivisorError("Must be a valid integer")
      return false
    }
    if (num < 200) {
      setDivisorError("Minimum value is 200")
      return false
    }
    if (num > 2000) {
      setDivisorError("Maximum value is 2000")
      return false
    }
    if (value.includes('.')) {
      setDivisorError("Decimals not allowed")
      return false
    }
    setDivisorError("")
    return true
  }

  const validateRedMultiplier = (value: string): boolean => {
    const num = parseFloat(value)
    if (isNaN(num)) {
      setMultiplierError("Must be a valid number")
      return false
    }
    if (num < 1.0) {
      setMultiplierError("Minimum value is 1.0")
      return false
    }
    if (num > 3.0) {
      setMultiplierError("Maximum value is 3.0")
      return false
    }
    setMultiplierError("")
    return true
  }

  // Input handlers
  const handleGreenLimitChange = (value: string) => {
    setGreenLimit(value)
    validateGreenLimit(value)
    // Re-validate amber limit to check comparison
    if (amberLimit) {
      validateAmberLimit(amberLimit, value)
    }
  }

  const handleAmberLimitChange = (value: string) => {
    setAmberLimit(value)
    validateAmberLimit(value, greenLimit)
  }

  const handleDivisorChange = (value: string) => {
    setDivisor(value)
    validateDivisor(value)
  }

  const handleRedMultiplierChange = (value: string) => {
    setRedMultiplier(value)
    validateRedMultiplier(value)
  }

  // Calculate preview values for Height Ratio mode
  const sampleHeight = 6000 // mm
  const allowableDeflection = divisor && !isNaN(parseInt(divisor))
    ? (sampleHeight / parseInt(divisor)).toFixed(2)
    : "—"
  const redThreshold = allowableDeflection !== "—" && redMultiplier && !isNaN(parseFloat(redMultiplier))
    ? (parseFloat(allowableDeflection) * parseFloat(redMultiplier)).toFixed(2)
    : "—"

  // Check if threshold form is valid
  const isThresholdFormValid = thresholdMode === "mm_per_m"
    ? greenLimit !== "" && 
      amberLimit !== "" && 
      greenLimitError === "" && 
      amberLimitError === ""
    : divisor !== "" && 
      redMultiplier !== "" && 
      divisorError === "" && 
      multiplierError === ""

  // Handle save for G1 threshold configuration
  const handleSaveThresholdConfig = () => {
    if (thresholdMode === "mm_per_m") {
      const isGreenValid = validateGreenLimit(greenLimit)
      const isAmberValid = validateAmberLimit(amberLimit, greenLimit)
      
      if (isGreenValid && isAmberValid) {
        console.log("Saving mm/m threshold config:", {
          mode: thresholdMode,
          greenLimit: parseFloat(greenLimit),
          amberLimit: parseFloat(amberLimit),
        })
        onOpenChange(false)
      }
    } else {
      const isDivisorValid = validateDivisor(divisor)
      const isMultiplierValid = validateRedMultiplier(redMultiplier)
      
      if (isDivisorValid && isMultiplierValid) {
        console.log("Saving height ratio threshold config:", {
          mode: thresholdMode,
          divisor: parseInt(divisor),
          redMultiplier: parseFloat(redMultiplier),
        })
        onOpenChange(false)
      }
    }
  }

  // Reset threshold form when drawer closes
  React.useEffect(() => {
    if (!open) {
      setThresholdMode("mm_per_m")
      setGreenLimit("1.0")
      setAmberLimit("2.0")
      setDivisor("500")
      setRedMultiplier("1.5")
      setGreenLimitError("")
      setAmberLimitError("")
      setDivisorError("")
      setMultiplierError("")
    }
  }, [open])

  // ============================================================================
  // SYSTEM-DEFINED TEST CHECKS
  // ============================================================================

  // Helper to check if it's a Splice test (either full name or base + ID)
  const isSpliceTest = 
    testName === "Upright Splice Inspection" || 
    testName === "Component Splice (L3)" ||
    (testName === "Component Splice" && testId === "L3")

  // Helper to check if it's a Material Strength test
  const isMaterialStrengthTest = 
    ruleKey === "MATERIAL_STRENGTH" ||
    testName === "Material Strength Verification" ||
    (testName === "Material Strength" && testId === "L6")

  // Helper to check if it's a Surface Coating test
  const isSurfaceCoatingTest = 
    ruleKey === "SURFACE_COATING" ||
    testName === "Surface Coating Thickness" ||
    (testName === "Surface Coating" && testId === "L7")

  // Helper to check if it's a Floor Rebound Hammer test
  const isFloorHammerTest = 
    ruleKey === "FLOOR_HAMMER" ||
    testName === "Floor Rebound Hammer Test" ||
    (testName === "Floor – Hammer Rebound" && testId === "L9")

  // Helper to check if it's a Floor UPV test
  const isFloorUPVTest = 
    ruleKey === "FLOOR_UPV" ||
    testName === "Floor UPV Test" ||
    (testName === "Floor – UPV" && testId === "L10")

  // Helper to check if it's a Global Plumbness test
  const isPlumbnessTest = testId === "G1"

  // Helper to check if it's a Cross-Aisle Plumbness test
  const isCrossAislePlumbnessTest = testId === "G2"

  // Helper to check if it's a System Lateral Sway test
  const isSystemLateralSwayTest = testId === "G3"

  // Helper to check if it's a Floor Flatness test
  const isFloorFlatnessTest = testId === "G4"

  // Helper to check if it's a Baseplate Settlement test
  const isBaseplateSettlementTest = testId === "G5"

  // Check if this is a system-defined test with a custom panel
  const isSystemDefinedTest = 
    isPlumbnessTest ||
    isCrossAislePlumbnessTest ||
    isSystemLateralSwayTest ||
    isFloorFlatnessTest ||
    isBaseplateSettlementTest ||
    isFloorUPVTest ||
    isFloorHammerTest ||
    isSurfaceCoatingTest ||
    isMaterialStrengthTest ||
    isSpliceTest

  // ============================================================================
  // FORMULA ENGINE RENDER
  // ============================================================================

  if (ruleDefinition && ruleDefinition.engineType === "FORMULA" && !isSystemDefinedTest) {
    const formulaContent = ruleDefinition.formulaContent

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-[600px] max-w-none flex flex-col h-full p-0"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div
                  className="flex items-center mb-3"
                  style={{
                    gap: "var(--spacing-3)",
                  }}
                >
                  <SheetTitle
                    className="text-foreground leading-tight"
                    style={{
                      fontSize: "var(--text-lg)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {testName} ({testId}) — Configuration
                  </SheetTitle>
                  <Badge
                    variant="secondary"
                    className="text-foreground bg-muted"
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-medium)",
                      fontFamily: "'Inter', sans-serif",
                      padding: "var(--spacing-1) var(--spacing-3)",
                    }}
                  >
                    {testScope}
                  </Badge>
                </div>
                <SheetDescription
                  className="text-muted-foreground leading-relaxed"
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-normal)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {ruleDefinition.description}
                </SheetDescription>
              </div>
            </div>
          </div>

          <Separator />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div
              className="flex justify-center"
              style={{
                padding: "var(--spacing-8)",
                minHeight: "100%",
              }}
            >
              <div style={{ width: "100%", maxWidth: "600px" }}>
                {formulaContent ? (
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-5)",
                    }}
                  >
                    {/* Section 1: Measured Parameters */}
                    {formulaContent.variables && (
                      <div>
                        <h4
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: "var(--spacing-3)",
                          }}
                        >
                          Measured Parameters
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-2)",
                          }}
                        >
                          {formulaContent.variables.map((variable, index) => (
                            <p
                              key={index}
                              className="text-foreground"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-normal)",
                                fontFamily: "'Inter', sans-serif",
                                margin: 0,
                              }}
                            >
                              {variable}
                            </p>
                          ))}
                        </div>
                        {formulaContent.policyNote && (
                          <p
                            className="text-muted-foreground"
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                              marginTop: "var(--spacing-2)",
                            }}
                          >
                            {formulaContent.policyNote}
                          </p>
                        )}
                      </div>
                    )}

                    {formulaContent.variables && <Separator />}

                    {/* Section 2: Severity Logic */}

                    {formulaContent.severityLevels && (
                      <div>
                        <h4
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: "var(--spacing-3)",
                          }}
                        >
                          Severity Logic
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-4)",
                          }}
                        >
                          {formulaContent.severityLevels.map((level, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "var(--text-lg)",
                                  lineHeight: 1,
                                }}
                              >
                                {level.icon}
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span
                                  className="text-foreground"
                                  style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: "var(--font-weight-medium)",
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  {level.label}
                                </span>
                                <span
                                  className="text-foreground"
                                  style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: "var(--font-weight-normal)",
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  {level.condition}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Separator before escalation/formula */}
                    {(formulaContent.escalation || formulaContent.formula) && formulaContent.severityLevels && <Separator />}

                    {/* Section 3: Interaction Rule / Escalation */}

                    {formulaContent.escalation && (
                      <div>
                        <h4
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: "var(--spacing-3)",
                          }}
                        >
                          {formulaContent.formula ? "Critical Escalation" : "Interaction with Bend Test"}
                        </h4>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          {formulaContent.escalation}
                        </p>
                      </div>
                    )}

                    {/* Formula Section (for tests that have calculation formulas) */}
                    {formulaContent.formula && (
                      <>
                        {formulaContent.escalation && <Separator />}
                        <div>
                          <h4
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-semi-bold)",
                              fontFamily: "'Inter', sans-serif",
                              marginBottom: "var(--spacing-3)",
                            }}
                          >
                            Calculation Method
                          </h4>
                          <div
                            className="bg-muted border border-border"
                            style={{
                              borderRadius: "var(--radius)",
                              padding: "var(--spacing-4)",
                            }}
                          >
                            <p
                              className="text-foreground"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                fontFamily: "'Courier New', monospace",
                                margin: 0,
                              }}
                            >
                              {formulaContent.formula}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h3
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-base)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      {testName} Evaluation Model
                    </h3>
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-normal)",
                        fontFamily: "'Inter', sans-serif",
                        margin: 0,
                      }}
                    >
                      This test uses a system-defined evaluation model. No manual configuration
                      is required.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between bg-background border-t border-border"
            style={{
              padding: "var(--spacing-4) var(--spacing-8)",
            }}
          >
            <div
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-xs)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              System Defined
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              style={{
                height: "40px",
                padding: "0 var(--spacing-4)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
                borderRadius: "var(--radius-sm)",
              }}
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // ============================================================================
  // STATIC ENGINE RENDER
  // ============================================================================

  // If no rule definition or not open, render nothing
  if (!open || !ruleDefinition) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={(newOpen) => !newOpen && handleClose()}>
      <SheetContent
        side="right"
        className="w-[600px] max-w-none flex flex-col h-full p-0"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
        onInteractOutside={(e) => {
          if (hasUnsavedChanges) {
            e.preventDefault()
            setShowUnsavedBanner(true)
          }
        }}
      >
        {isPlumbnessTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Overall Upright Plumbness (G1) — Evaluation Model
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      Global
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Derived from δ(z) survey data — vertical deviation profile.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                className="flex justify-center"
                style={{
                  padding: "var(--spacing-8)",
                  minHeight: "100%",
                }}
              >
                <div style={{ width: "100%", maxWidth: "600px" }}>
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-5)",
                    }}
                  >
                    
                    {/* Section 1 - Measurement Basis */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Measurement Basis
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Computed from deviation profile δ(z).
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          δ(z) = deviation of upright from nominal position at height z, derived from instrument-normalized survey engine.
                        </p>
                        <p
                          className="text-muted-foreground"
                          style={{
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Derived from δ(z) survey deviation engine.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 2 - Calculation Logic */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Calculation Logic (Read-Only)
                      </h4>
                      <div
                        className="bg-muted"
                        style={{
                          borderRadius: "var(--radius)",
                          padding: "var(--spacing-4)",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-2)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Courier New', monospace",
                              margin: 0,
                            }}
                          >
                            1. Δδ(zᵢ) = δ(zᵢ) − δ(z_base)
                          </p>
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Courier New', monospace",
                              margin: 0,
                            }}
                          >
                            2. Δδ_max = max(|Δδ(zᵢ)|)
                          </p>
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Courier New', monospace",
                              margin: 0,
                            }}
                          >
                            3. Plumbness (mm/m) = Δδ_max / H_m
                          </p>
                        </div>
                      </div>
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Where: H_m = measured upright height in meters.
                      </p>
                    </div>

                    <Separator />

                    {/* Section 3 - Threshold Configuration */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-base)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-4)",
                        }}
                      >
                        Threshold Configuration
                      </h4>
                      
                      {/* Threshold Mode Selector */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-3)",
                          marginBottom: "var(--spacing-5)",
                        }}
                      >
                        <Label
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Threshold Basis
                        </Label>
                        <RadioGroup
                          value={thresholdMode}
                          onValueChange={(value) => setThresholdMode(value as "mm_per_m" | "height_ratio")}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <RadioGroupItem value="mm_per_m" id="mode-mm" />
                            <Label
                              htmlFor="mode-mm"
                              className="text-foreground cursor-pointer"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-normal)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              mm per meter (Default)
                            </Label>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <RadioGroupItem value="height_ratio" id="mode-ratio" />
                            <Label
                              htmlFor="mode-ratio"
                              className="text-foreground cursor-pointer"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-normal)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              Height Ratio (H / X)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Conditional Content Based on Mode */}
                      {thresholdMode === "mm_per_m" ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-5)",
                          }}
                        >
                          {/* Green Limit */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <Label
                              htmlFor="greenLimit"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              Green Limit (mm/m)
                            </Label>
                            <Input
                              id="greenLimit"
                              type="number"
                              min="0"
                              step="0.1"
                              value={greenLimit}
                              onChange={(e) => handleGreenLimitChange(e.target.value)}
                              className={greenLimitError ? 'border-destructive focus-visible:ring-destructive' : ''}
                              style={{
                                height: "40px",
                                fontSize: "var(--text-sm)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                              placeholder="1.0"
                            />
                            {greenLimitError && (
                              <p
                                className="text-destructive"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Inter', sans-serif",
                                  margin: 0,
                                }}
                              >
                                {greenLimitError}
                              </p>
                            )}
                          </div>

                          {/* Amber Upper Limit */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <Label
                              htmlFor="amberLimit"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              Amber Upper Limit (mm/m)
                            </Label>
                            <Input
                              id="amberLimit"
                              type="number"
                              min="0"
                              step="0.1"
                              value={amberLimit}
                              onChange={(e) => handleAmberLimitChange(e.target.value)}
                              className={amberLimitError ? 'border-destructive focus-visible:ring-destructive' : ''}
                              style={{
                                height: "40px",
                                fontSize: "var(--text-sm)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                              placeholder="2.0"
                            />
                            {amberLimitError && (
                              <p
                                className="text-destructive"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Inter', sans-serif",
                                  margin: 0,
                                }}
                              >
                                {amberLimitError}
                              </p>
                            )}
                            <p
                              className="text-muted-foreground"
                              style={{
                                fontSize: "var(--text-xs)",
                                fontFamily: "'Inter', sans-serif",
                                margin: 0,
                              }}
                            >
                              Validation: Green &lt; Amber
                            </p>
                          </div>

                          {/* Preview */}
                          <div
                            className="bg-accent border border-border"
                            style={{
                              borderRadius: "var(--radius)",
                              padding: "var(--spacing-4)",
                            }}
                          >
                            <h5
                              className="text-foreground"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-semi-bold)",
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: "var(--spacing-2)",
                              }}
                            >
                              Preview
                            </h5>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--spacing-1)",
                              }}
                            >
                              <p
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Inter', sans-serif",
                                  margin: 0,
                                }}
                              >
                                Green ≤ {greenLimit || "___"} mm/m
                              </p>
                              <p
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Inter', sans-serif",
                                  margin: 0,
                                }}
                              >
                                Amber {greenLimit || "___"}–{amberLimit || "___"} mm/m
                              </p>
                              <p
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Inter', sans-serif",
                                  margin: 0,
                                }}
                              >
                                Red &gt; {amberLimit || "___"} mm/m
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-5)",
                          }}
                        >
                          {/* Formula Preview */}
                          <div
                            className="bg-muted border border-border"
                            style={{
                              borderRadius: "var(--radius)",
                              padding: "var(--spacing-4)",
                            }}
                          >
                            <p
                              className="text-foreground"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                fontFamily: "'Courier New', monospace",
                                margin: 0,
                              }}
                            >
                              Allowable = H / [{divisor || "___"}]
                            </p>
                          </div>

                          {/* Divisor Input */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <Label
                              htmlFor="divisor"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              Divisor
                            </Label>
                            <Input
                              id="divisor"
                              type="number"
                              min="200"
                              max="2000"
                              step="1"
                              value={divisor}
                              onChange={(e) => handleDivisorChange(e.target.value)}
                              className={divisorError ? 'border-destructive focus-visible:ring-destructive' : ''}
                              style={{
                                height: "40px",
                                fontSize: "var(--text-sm)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                              placeholder="500"
                            />
                            {divisorError && (
                              <p
                                className="text-destructive"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Inter', sans-serif",
                                  margin: 0,
                                }}
                              >
                                {divisorError}
                              </p>
                            )}
                            <p
                              className="text-muted-foreground"
                              style={{
                                fontSize: "var(--text-xs)",
                                fontFamily: "'Inter', sans-serif",
                                margin: 0,
                              }}
                            >
                              Range: 200 – 2000 (integers only)
                            </p>
                          </div>

                          {/* Red Multiplier */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <Label
                              htmlFor="redMultiplier"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              Red Multiplier (Optional)
                            </Label>
                            <Input
                              id="redMultiplier"
                              type="number"
                              min="1.0"
                              max="3.0"
                              step="0.1"
                              value={redMultiplier}
                              onChange={(e) => handleRedMultiplierChange(e.target.value)}
                              className={multiplierError ? 'border-destructive focus-visible:ring-destructive' : ''}
                              style={{
                                height: "40px",
                                fontSize: "var(--text-sm)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                              placeholder="1.5"
                            />
                            {multiplierError && (
                              <p
                                className="text-destructive"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Inter', sans-serif",
                                  margin: 0,
                                }}
                              >
                                {multiplierError}
                              </p>
                            )}
                            <p
                              className="text-muted-foreground"
                              style={{
                                fontSize: "var(--text-xs)",
                                fontFamily: "'Inter', sans-serif",
                                margin: 0,
                              }}
                            >
                              Range: 1.0 – 3.0
                            </p>
                          </div>

                          {/* Preview Example */}
                          <div
                            className="bg-accent border border-border"
                            style={{
                              borderRadius: "var(--radius)",
                              padding: "var(--spacing-4)",
                            }}
                          >
                            <h5
                              className="text-foreground"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-semi-bold)",
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: "var(--spacing-2)",
                              }}
                            >
                              Preview Example
                            </h5>
                            <p
                              className="text-muted-foreground"
                              style={{
                                fontSize: "var(--text-xs)",
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: "var(--spacing-3)",
                              }}
                            >
                              For H = {sampleHeight} mm
                            </p>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--spacing-1)",
                              }}
                            >
                              <p
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Courier New', monospace",
                                  margin: 0,
                                }}
                              >
                                Allowable = {sampleHeight} / {divisor || "___"} = <span className="text-success" style={{ fontWeight: "var(--font-weight-bold)" }}>{allowableDeflection} mm</span>
                              </p>
                              <p
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Courier New', monospace",
                                  margin: 0,
                                }}
                              >
                                Red Threshold = {redMultiplier || "___"} × {allowableDeflection} = <span className="text-destructive" style={{ fontWeight: "var(--font-weight-bold)" }}>{redThreshold} mm</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Section 4 - Output Preview */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Output Preview
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Upright Height (H_m): <span className="text-muted-foreground">Auto</span>
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Δδ_max (mm): <span className="text-muted-foreground">Auto</span>
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Plumbness (mm/m): <span className="text-muted-foreground">Auto</span>
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Governing Height (z_at_max): <span className="text-muted-foreground">Auto</span>
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • RAG: <span className="text-muted-foreground">Auto</span>
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Formula-Based Threshold
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-2)",
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-transparent border-border text-foreground hover:bg-muted"
                  style={{
                    height: "40px",
                    padding: "0 var(--spacing-4)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    fontFamily: "'Inter', sans-serif",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveThresholdConfig}
                  disabled={!isThresholdFormValid}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  style={{
                    height: "40px",
                    padding: "0 var(--spacing-4)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    fontFamily: "'Inter', sans-serif",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </>
        ) : isCrossAislePlumbnessTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Rack Run Straightness (G2) — Evaluation Model
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      Global
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Derived from δ(z) survey data — in-plan alignment verification.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                style={{
                  padding: "var(--spacing-8)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-6)",
                  }}
                >
                  {/* Section 1: Measurement Basis */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Measurement Basis
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Computed from base deviation values δ_base for all uprights in rack run.
                      </p>
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Run alignment derived from base δ(z) values.
                      </p>
                    </div>
                  </div>

                  {/* Section 2: Calculation Logic */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Calculation Logic (Read-Only)
                    </h4>
                    <div
                      className="bg-muted"
                      style={{
                        borderRadius: "var(--radius)",
                        padding: "var(--spacing-4)",
                        marginBottom: "var(--spacing-3)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-3)",
                        }}
                      >
                        <div>
                          <div
                            className="text-muted-foreground"
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "'Inter', sans-serif",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            1. Adjacent Deviation:
                          </div>
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Courier New', monospace",
                              margin: 0,
                            }}
                          >
                            δ_adj,max = max(|δ_j+1 − δ_j|)
                          </p>
                        </div>
                        <div>
                          <div
                            className="text-muted-foreground"
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "'Inter', sans-serif",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            2. Cumulative Deviation:
                          </div>
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Courier New', monospace",
                              margin: 0,
                            }}
                          >
                            δ_cum = max(δ_j) − min(δ_j)
                          </p>
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-normal)",
                        fontFamily: "'Inter', sans-serif",
                        margin: 0,
                      }}
                    >
                      3. Rack Run Length (L) derived from Digital Twin geometry.
                    </p>
                  </div>

                  {/* Section 3: RAG Criteria */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      RAG Criteria (Locked)
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-3)",
                      }}
                    >
                      <div>
                        <div
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: "var(--spacing-1)",
                          }}
                        >
                          Green:
                        </div>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          δ_adj,max ≤ 5 mm AND δ_cum ≤ L/1000
                        </p>
                      </div>
                      <div>
                        <div
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: "var(--spacing-1)",
                          }}
                        >
                          Amber:
                        </div>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          One limit exceeded
                        </p>
                      </div>
                      <div>
                        <div
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: "var(--spacing-1)",
                          }}
                        >
                          Red:
                        </div>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Both limits exceeded
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Output Display */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Output Preview
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • δ_adj,max (mm): <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • δ_cum (mm): <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Rack Run Length (L): <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Governing Upright Pair: <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • RAG: <span className="text-muted-foreground">Auto</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                System Defined — In-Plan Alignment Check
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  height: "40px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Close
              </Button>
            </div>
          </>
        ) : isSystemLateralSwayTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      System Lateral Sway (G3) — Evaluation Model
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      Global
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Derived from δ(z) survey data — global horizontal drift assessment.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                style={{
                  padding: "var(--spacing-8)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-6)",
                  }}
                >
                  {/* Section 1: Measurement Basis */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Measurement Basis
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Computed from δ(z) at base and top for all uprights in rack run.
                      </p>
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        System drift derived from mean top and base δ(z) values.
                      </p>
                    </div>
                  </div>

                  {/* Section 2: Calculation Logic */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Calculation Logic (Read-Only)
                    </h4>
                    <div
                      className="bg-muted"
                      style={{
                        borderRadius: "var(--radius)",
                        padding: "var(--spacing-4)",
                        marginBottom: "var(--spacing-3)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Courier New', monospace",
                            margin: 0,
                          }}
                        >
                          1. δ_base,mean = average of base deviations
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Courier New', monospace",
                            margin: 0,
                          }}
                        >
                          2. δ_top,mean = average of top deviations
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Courier New', monospace",
                            margin: 0,
                          }}
                        >
                          3. Δ_sys = |δ_top,mean − δ_base,mean|
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Courier New', monospace",
                            margin: 0,
                          }}
                        >
                          4. Drift Ratio = Δ_sys / H_m
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-normal)",
                        fontFamily: "'Inter', sans-serif",
                        margin: 0,
                      }}
                    >
                      Where: H_m = frame height in meters.
                    </p>
                  </div>

                  {/* Section 3: RAG Criteria */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      RAG Criteria (Corrected to Ratio-Based)
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Drift ≤ 1/500 → <span style={{ fontWeight: "var(--font-weight-semi-bold)" }}>GREEN</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • 1/500 &lt; Drift ≤ 1/300 → <span style={{ fontWeight: "var(--font-weight-semi-bold)" }}>AMBER</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Drift &gt; 1/300 → <span style={{ fontWeight: "var(--font-weight-semi-bold)" }}>RED</span>
                      </p>
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                          marginTop: "var(--spacing-2)",
                        }}
                      >
                        (Drift is dimensionless.)
                      </p>
                    </div>
                  </div>

                  {/* Section 4: Output Preview */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Output Preview
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Δ_sys (mm): <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Drift Ratio: <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Drift expressed as 1/N where N = H(mm) / Δ_sys: <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • RAG: <span className="text-muted-foreground">Auto</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                System Defined — Global Stability Check
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  height: "40px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Close
              </Button>
            </div>
          </>
        ) : isFloorFlatnessTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Floor Flatness at Rack Base (G4) — Evaluation Model
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      Global
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Derived from base elevation survey data (Z coordinates).
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                style={{
                  padding: "var(--spacing-8)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-6)",
                  }}
                >
                  {/* Section 1: Measurement Basis */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Measurement Basis
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-3)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Computed from base elevation values Z_base,j measured at each upright base location.
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Computed across all uprights within the same rack run.
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                          paddingLeft: "var(--spacing-4)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Z_base,j = elevation at base of upright j
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Data derived from Drone+Laser or Total Station
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Absolute elevation used (not deviation profile δ(z))
                        </p>
                      </div>
                      <div
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        <p style={{ margin: 0, fontStyle: "italic" }}>
                          Note: Plumb Bob instrument does not support G4.
                        </p>
                        <p style={{ margin: 0, marginTop: "var(--spacing-2)" }}>
                          Minimum 2 base elevations required. Recommended: All uprights in run measured.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Calculation Logic */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Calculation Logic (Read-Only)
                    </h4>
                    <div
                      className="bg-muted"
                      style={{
                        borderRadius: "var(--radius)",
                        padding: "var(--spacing-4)",
                        marginBottom: "var(--spacing-3)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Courier New', monospace",
                            margin: 0,
                          }}
                        >
                          1. Collect base elevations:
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Courier New', monospace",
                            margin: 0,
                            paddingLeft: "var(--spacing-4)",
                          }}
                        >
                          Z_base,j
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Courier New', monospace",
                            margin: 0,
                            marginTop: "var(--spacing-2)",
                          }}
                        >
                          2. Maximum differential:
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Courier New', monospace",
                            margin: 0,
                            paddingLeft: "var(--spacing-4)",
                          }}
                        >
                          ΔZ_max = max(Z_base,j) − min(Z_base,j)
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-normal)",
                        fontFamily: "'Inter', sans-serif",
                        margin: 0,
                      }}
                    >
                      Where: ΔZ_max = maximum elevation difference across rack run (mm)
                    </p>
                  </div>

                  {/* Section 3: RAG Criteria */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      RAG Criteria (Locked)
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • ΔZ_max ≤ 3 mm → <span style={{ fontWeight: "var(--font-weight-semi-bold)" }}>GREEN</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • 3 mm &lt; ΔZ_max ≤ 5 mm → <span style={{ fontWeight: "var(--font-weight-semi-bold)" }}>AMBER</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • ΔZ_max &gt; 5 mm → <span style={{ fontWeight: "var(--font-weight-semi-bold)" }}>RED</span>
                      </p>
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                          marginTop: "var(--spacing-2)",
                        }}
                      >
                        Limits based on rack installation tolerance and floor settlement control guidance.
                      </p>
                    </div>
                  </div>

                  {/* Section 4: Output Preview */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Output Preview
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • ΔZ_max (mm): <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Highest Base Location: <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Lowest Base Location: <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Governing Upright Pair: <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Rack Run ID: <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • RAG: <span className="text-muted-foreground">Auto</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                System Defined — Based on EN 15620 floor tolerance philosophy
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  height: "40px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Close
              </Button>
            </div>
          </>
        ) : isBaseplateSettlementTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Baseplate Settlement (G5) — Evaluation Model
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      Global
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Derived from base elevation survey data (Z coordinates). Detects localized vertical settlement of individual baseplates relative to rack run reference.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                style={{
                  padding: "var(--spacing-8)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-6)",
                  }}
                >
                  {/* Section 1: Measurement Basis */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Measurement Basis
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-3)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Computed from base elevation values Z_base,j measured at each upright base location within a rack run.
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                          paddingLeft: "var(--spacing-4)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Z_base,j = measured elevation at base of upright j
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Reference elevation Z_ref = mean base elevation of rack run
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Settlement S_j = Z_base,j − Z_ref
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Absolute settlement governs: |S_j|
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          • Computed across all uprights in the same rack run
                        </p>
                      </div>
                      <div
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          Minimum 2 base elevations required. Recommended: All uprights in run measured.
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                          marginTop: "var(--spacing-2)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Instrument Support:
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-1)",
                            paddingLeft: "var(--spacing-4)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            • Drone + Laser → Supported
                          </p>
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            • Total Station → Supported
                          </p>
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            • Plumb Bob → Not supported
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Calculation Logic */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Calculation Logic (Read-Only)
                    </h4>
                    <div
                      className="bg-muted"
                      style={{
                        borderRadius: "var(--radius)",
                        padding: "var(--spacing-4)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-3)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Courier New', monospace",
                          margin: 0,
                        }}
                      >
                        1. Collect base elevations:
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Courier New', monospace",
                          margin: 0,
                          paddingLeft: "var(--spacing-4)",
                        }}
                      >
                        Z_base,j
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Courier New', monospace",
                          margin: 0,
                        }}
                      >
                        2. Compute reference elevation:
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Courier New', monospace",
                          margin: 0,
                          paddingLeft: "var(--spacing-4)",
                        }}
                      >
                        Z_ref = mean(Z_base,j)
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Courier New', monospace",
                          margin: 0,
                        }}
                      >
                        3. Settlement per upright:
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Courier New', monospace",
                          margin: 0,
                          paddingLeft: "var(--spacing-4)",
                        }}
                      >
                        S_j = Z_base,j − Z_ref
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Courier New', monospace",
                          margin: 0,
                        }}
                      >
                        4. Governing settlement:
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Courier New', monospace",
                          margin: 0,
                          paddingLeft: "var(--spacing-4)",
                        }}
                      >
                        S_max = max(|S_j|)
                      </p>
                    </div>
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-normal)",
                        fontFamily: "'Inter', sans-serif",
                        margin: 0,
                        marginTop: "var(--spacing-3)",
                      }}
                    >
                      Where: S_max = maximum absolute vertical settlement within rack run (mm)
                    </p>
                  </div>

                  {/* Section 3: RAG Criteria */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      RAG Criteria (Locked)
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • S_max ≤ 2 mm → <span style={{ fontWeight: "var(--font-weight-semi-bold)" }}>GREEN</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • 2 mm &lt; S_max ≤ 4 mm → <span style={{ fontWeight: "var(--font-weight-semi-bold)" }}>AMBER</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • S_max &gt; 4 mm → <span style={{ fontWeight: "var(--font-weight-semi-bold)" }}>RED</span>
                      </p>
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                          marginTop: "var(--spacing-2)",
                        }}
                      >
                        Limits based on practical rack support tolerance and localized slab settlement behavior.
                      </p>
                    </div>
                  </div>

                  {/* Section 4: Output Preview */}
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                    }}
                  >
                    <h4
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "var(--spacing-4)",
                      }}
                    >
                      Output Preview
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • S_max (mm): <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Governing Upright ID: <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Settlement Direction (Up/Down): <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Reference Elevation (Z_ref): <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • Rack Run ID: <span className="text-muted-foreground">Auto</span>
                      </p>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        • RAG: <span className="text-muted-foreground">Auto</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                System Defined — Based on survey-derived elevation logic
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  height: "40px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Close
              </Button>
            </div>
          </>
        ) : isFloorUPVTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Floor UPV Test — Evaluation Model
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      Global
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Concrete internal quality assessment using ultrasonic pulse velocity.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                className="flex justify-center"
                style={{
                  padding: "var(--spacing-8)",
                  minHeight: "100%",
                }}
              >
                <div style={{ width: "100%", maxWidth: "600px" }}>
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-5)",
                    }}
                  >
                    
                    {/* Section 1 - Velocity Calculation */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Velocity Calculation
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-3)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Velocity (V)
                        </p>
                        <div
                          className="bg-muted border border-border"
                          style={{
                            borderRadius: "var(--radius)",
                            padding: "var(--spacing-4)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            V = L / T
                          </p>
                        </div>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Where:
                        </p>
                        <ul
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                            paddingLeft: "var(--spacing-6)",
                            listStyleType: "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-1)",
                          }}
                        >
                          <li>L = Path Length</li>
                          <li>T = Travel Time</li>
                        </ul>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Convert result to km/s.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 2 - Acceptance Criteria */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Concrete Quality Classification
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "rgb(5, 150, 105)",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            V &gt; 3.5 km/s
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "rgb(245, 158, 11)",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            3.0 ≤ V ≤ 3.5 km/s
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="bg-destructive"
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            V &lt; 3.0 km/s
                          </span>
                        </div>
                      </div>
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: "var(--spacing-3) 0 0 0",
                        }}
                      >
                        Velocity bands aligned with IS 13311 concrete quality classification.
                      </p>
                    </div>

                    <Separator />

                    {/* Section 3 - Overall Severity Logic */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Overall Severity Logic
                      </h4>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Final RAG determined directly from calculated velocity.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                System Defined
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  height: "40px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Close
              </Button>
            </div>
          </>
        ) : isFloorHammerTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Floor Rebound Hammer Test — Evaluation Model
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      Global
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    In-situ concrete surface strength estimation using rebound hammer readings.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                className="flex justify-center"
                style={{
                  padding: "var(--spacing-8)",
                  minHeight: "100%",
                }}
              >
                <div style={{ width: "100%", maxWidth: "600px" }}>
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-5)",
                    }}
                  >
                    
                    {/* Section 1 - Measurement Method */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Measurement Method
                      </h4>
                      <ul
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                          paddingLeft: "var(--spacing-6)",
                          listStyleType: "disc",
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-1)",
                        }}
                      >
                        <li>Minimum 10 rebound readings per zone</li>
                        <li>Remove outliers where |R<sub>i</sub> − R<sub>mean</sub>| &gt; 6</li>
                        <li>Recompute final mean rebound value</li>
                      </ul>
                    </div>

                    <Separator />

                    {/* Section 2 - Strength Conversion */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Strength Calculation
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-3)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Final Mean Rebound (R<sub>f</sub>)
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Convert using calibration curve:
                        </p>
                        <div
                          className="bg-muted border border-border"
                          style={{
                            borderRadius: "var(--radius)",
                            padding: "var(--spacing-4)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            f<sub>ck,test</sub> = f(R<sub>f</sub>)
                          </p>
                        </div>
                        <p
                          className="text-muted-foreground"
                          style={{
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Calibration curve stored in system based on hammer type.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 3 - Strength Ratio */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Strength Ratio
                      </h4>
                      <div
                        className="bg-muted border border-border"
                        style={{
                          borderRadius: "var(--radius)",
                          padding: "var(--spacing-4)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          SR = f<sub>ck,test</sub> / f<sub>ck,design</sub>
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 4 - Acceptance Criteria */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Acceptance Criteria
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "rgb(5, 150, 105)",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            SR ≥ 1.00
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "rgb(245, 158, 11)",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            0.85 ≤ SR &lt; 1.00
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="bg-destructive"
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            SR &lt; 0.85
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 5 - Overall Severity Logic */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Overall Severity Logic
                      </h4>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Final RAG based on strength ratio after outlier removal.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                System Defined
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  height: "40px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Close
              </Button>
            </div>
          </>
        ) : isSurfaceCoatingTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Surface Coating Thickness — Evaluation Model
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      Local
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Verification of protective coating thickness against design specification.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                className="flex justify-center"
                style={{
                  padding: "var(--spacing-8)",
                  minHeight: "100%",
                }}
              >
                <div style={{ width: "100%", maxWidth: "600px" }}>
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-5)",
                    }}
                  >
                    
                    {/* Section 1 - Measurement Principle */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Measurement Principle
                      </h4>
                      <ul
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                          paddingLeft: "var(--spacing-6)",
                          listStyleType: "disc",
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-1)",
                        }}
                      >
                        <li>Minimum 3 readings required</li>
                        <li>Flat area selection</li>
                        <li>Avoid edges and welds</li>
                        <li>Minimum reading governs durability assessment</li>
                      </ul>
                    </div>

                    <Separator />

                    {/* Section 2 - Thickness Calculation */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Thickness Calculation
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-3)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Minimum Thickness (t<sub>min</sub>) = min(readings)
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Thickness Ratio (CR)
                        </p>
                        <div
                          className="bg-muted border border-border"
                          style={{
                            borderRadius: "var(--radius)",
                            padding: "var(--spacing-4)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            CR = t<sub>min</sub> / t<sub>design</sub>
                          </p>
                        </div>
                        <p
                          className="text-muted-foreground"
                          style={{
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Design thickness derived from coating specification.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 3 - Acceptance Criteria */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Acceptance Criteria
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "rgb(5, 150, 105)",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            CR ≥ 0.80
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "rgb(245, 158, 11)",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            0.60 ≤ CR &lt; 0.80
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="bg-destructive"
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            CR &lt; 0.60
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 4 - Governing Rule */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Governing Rule
                      </h4>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Minimum measured thickness governs classification.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                System Defined
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  height: "40px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Close
              </Button>
            </div>
          </>
        ) : isMaterialStrengthTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Material Strength Verification — Evaluation Model
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      Local
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Verification of yield and tensile strength against design assumptions.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                className="flex justify-center"
                style={{
                  padding: "var(--spacing-8)",
                  minHeight: "100%",
                }}
              >
                <div style={{ width: "100%", maxWidth: "600px" }}>
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-5)",
                    }}
                  >
                    
                    {/* Section 1 - Strength Ratio Calculation */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Strength Ratio Calculation
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-3)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Strength Ratio (SR)
                        </p>
                        <div
                          className="bg-muted border border-border"
                          style={{
                            borderRadius: "var(--radius)",
                            padding: "var(--spacing-4)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            SR = f<sub>y_test</sub> / f<sub>y_design</sub>
                          </p>
                        </div>
                        <p
                          className="text-muted-foreground"
                          style={{
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Design yield strength is derived from OEM specification. Tested yield strength is obtained from MTC, hardness conversion, or laboratory test.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 2 - Yield Strength Acceptance */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Yield Strength Acceptance
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "rgb(5, 150, 105)",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            SR ≥ 1.00
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "rgb(245, 158, 11)",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            0.95 ≤ SR &lt; 1.00
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="bg-destructive"
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                              }}
                            />
                          </div>
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-normal)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            SR &lt; 0.95
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 3 - Tensile Strength Verification */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Tensile Strength Verification
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          If tensile strength (f<sub>u</sub>) is specified:
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-2)",
                            marginLeft: "var(--spacing-6)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--spacing-3)",
                            }}
                          >
                            <div
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                backgroundColor: "rgb(5, 150, 105)",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  backgroundColor: "white",
                                }}
                              />
                            </div>
                            <span
                              className="text-foreground"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-normal)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              f<sub>u_test</sub> / f<sub>u_design</sub> ≥ 0.95 → Acceptable
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--spacing-3)",
                            }}
                          >
                            <div
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              className="bg-destructive"
                            >
                              <div
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  backgroundColor: "white",
                                }}
                              />
                            </div>
                            <span
                              className="text-foreground"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-normal)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              Else → RED
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 4 - Pending Verification Rule */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Pending Verification Rule
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          If:
                        </p>
                        <ul
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                            paddingLeft: "var(--spacing-6)",
                            listStyleType: "disc",
                          }}
                        >
                          <li>No certificate provided</li>
                          <li>No material test performed</li>
                          <li>Steel grade unknown</li>
                        </ul>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-3)",
                            marginTop: "var(--spacing-2)",
                          }}
                        >
                          <span
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            Classification →
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <div
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                backgroundColor: "rgb(245, 158, 11)",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  backgroundColor: "white",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                color: "rgb(245, 158, 11)",
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              AMBER (Pending Verification)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Section 5 - Overall Severity Logic */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Overall Severity Logic
                      </h4>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                          marginBottom: "var(--spacing-2)",
                        }}
                      >
                        Final Severity governed by worst of:
                      </p>
                      <ul
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                          paddingLeft: "var(--spacing-6)",
                          listStyleType: "disc",
                        }}
                      >
                        <li>Yield strength check</li>
                        <li>Tensile strength check (if applicable)</li>
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                System Defined
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  height: "40px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Close
              </Button>
            </div>
          </>
        ) : isSpliceTest ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className="flex items-center mb-3"
                    style={{
                      gap: "var(--spacing-3)",
                    }}
                  >
                    <SheetTitle
                      className="text-foreground leading-tight"
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-weight-semi-bold)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {testName === "Upright Splice Inspection"
                        ? "Upright Splice Inspection — Evaluation Model"
                        : "Component Splice (L3) — Evaluation Model"}
                    </SheetTitle>
                    <Badge
                      variant="secondary"
                      className="text-foreground bg-muted"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        padding: "var(--spacing-1) var(--spacing-3)",
                      }}
                    >
                      {testScope}
                    </Badge>
                  </div>
                  <SheetDescription
                    className="text-muted-foreground leading-relaxed"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {testName === "Upright Splice Inspection"
                      ? "Splice alignment and connection integrity verification."
                      : "Connection integrity assessment for upright splice."}
                  </SheetDescription>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                className="flex justify-center"
                style={{
                  padding: "var(--spacing-8)",
                  minHeight: "100%",
                }}
              >
                <div style={{ width: "100%", maxWidth: "600px" }}>
                  <div
                    className="bg-card border border-border"
                    style={{
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-6)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-5)",
                    }}
                  >
                    
                    {/* Section 1 - Alignment Checks */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Alignment Checks
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-4)",
                        }}
                      >
                        
                        {/* Down-Aisle Offset */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-2)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            Down-Aisle Offset (δDA)
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(5, 150, 105)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                ≤ 1.0 mm
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(245, 158, 11)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                &gt; 1.0 mm and ≤ 2.0 mm
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                className="bg-destructive"
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                &gt; 2.0 mm
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Cross-Aisle Offset */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-2)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            Cross-Aisle Offset (δCA)
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(5, 150, 105)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                ≤ 1.0 mm
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(245, 158, 11)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                &gt; 1.0 mm and ≤ 2.0 mm
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                className="bg-destructive"
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                &gt; 2.0 mm
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Vertical Gap */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-2)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            Vertical Gap (gv)
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(5, 150, 105)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                ≤ 1.0 mm
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(245, 158, 11)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                &gt; 1.0 mm and ≤ 2.0 mm
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                className="bg-destructive"
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                &gt; 2.0 mm
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <Separator />

                    {/* Section 2 - Connection Integrity */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Connection Integrity
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-4)",
                        }}
                      >
                        
                        {/* Bolt Torque */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-2)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            Bolt Torque (Tm vs Td)
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(5, 150, 105)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                0.9 × Td ≤ Tm ≤ 1.1 × Td
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(245, 158, 11)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                0.8 × Td ≤ Tm &lt; 0.9 × Td
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                className="bg-destructive"
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                Tm &lt; 0.8 × Td
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bolt Count */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-2)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            Bolt Count
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(5, 150, 105)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                Nm ≥ Nd
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                className="bg-destructive"
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                Nm &lt; Nd (Missing bolt)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Visible Crack */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-2)",
                          }}
                        >
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            Visible Crack
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgb(5, 150, 105)",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                No crack observed
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                className="bg-destructive"
                              >
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                  }}
                                />
                              </div>
                              <span
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                Crack visible
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <Separator />

                    {/* Section 3 - Overall Severity Logic */}
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Overall Severity Logic
                      </h4>
                      <p
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                          marginBottom: "var(--spacing-2)",
                        }}
                      >
                        Final Severity = Worst of all individual checks.
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-1)",
                        }}
                      >
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          If any parameter is{" "}
                          <span
                            className="text-destructive"
                            style={{
                              fontWeight: "var(--font-weight-medium)",
                            }}
                          >
                            RED
                          </span>{" "}
                          → Final ={" "}
                          <span
                            className="text-destructive"
                            style={{
                              fontWeight: "var(--font-weight-medium)",
                            }}
                          >
                            RED
                          </span>
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Else if any parameter is{" "}
                          <span
                            style={{
                              color: "rgb(245, 158, 11)",
                              fontWeight: "var(--font-weight-medium)",
                            }}
                          >
                            AMBER
                          </span>{" "}
                          → Final ={" "}
                          <span
                            style={{
                              color: "rgb(245, 158, 11)",
                              fontWeight: "var(--font-weight-medium)",
                            }}
                          >
                            AMBER
                          </span>
                        </p>
                        <p
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Else → Final ={" "}
                          <span
                            style={{
                              color: "rgb(5, 150, 105)",
                              fontWeight: "var(--font-weight-medium)",
                            }}
                          >
                            GREEN
                          </span>
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between bg-background border-t border-border"
              style={{
                padding: "var(--spacing-4) var(--spacing-8)",
              }}
            >
              <div
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                System Defined
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  height: "40px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Close
              </Button>
            </div>
          </>
        ) : (
        <>
        {/* Header */}
        <div
          style={{
            padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4) var(--spacing-8)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div
                className="flex items-center mb-3"
                style={{
                  gap: "var(--spacing-3)",
                }}
              >
                <SheetTitle
                  className="text-foreground leading-tight"
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--font-weight-semi-bold)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {testName} ({testId}) — Configuration
                </SheetTitle>
                <Badge
                  variant="secondary"
                  className="text-foreground bg-muted"
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-weight-medium)",
                    fontFamily: "'Inter', sans-serif",
                    padding: "var(--spacing-1) var(--spacing-3)",
                  }}
                >
                  {testScope}
                </Badge>
              </div>
              <SheetDescription
                className="text-muted-foreground leading-relaxed"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {ruleDefinition.description}
              </SheetDescription>
            </div>
          </div>
        </div>

        <Separator />

        {/* Unsaved Changes Banner */}
        {showUnsavedBanner && (
          <div
            className="flex-shrink-0 bg-muted/50 border-b border-border flex items-center justify-between"
            style={{
              padding: "var(--spacing-4) var(--spacing-8)",
            }}
          >
            <div
              className="flex items-center"
              style={{
                gap: "var(--spacing-3)",
              }}
            >
              <AlertCircle
                className="text-foreground"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
              <span
                className="text-foreground"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Unsaved Changes — Leaving will discard your changes.
              </span>
            </div>
            <div
              className="flex items-center"
              style={{
                gap: "var(--spacing-3)",
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleKeepEditing}
                className="hover:bg-background"
                style={{
                  height: "36px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Keep Editing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscardChanges}
                className="text-destructive hover:bg-destructive/10"
                style={{
                  height: "36px",
                  padding: "0 var(--spacing-4)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Discard
              </Button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div
            className="flex justify-center"
            style={{
              padding: "var(--spacing-8)",
              minHeight: "100%",
            }}
          >
            <div style={{ width: "100%", maxWidth: "600px" }}>
              <Accordion
                type="multiple"
                defaultValue={linkedElements}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-4)",
                }}
              >
                {linkedElements.map((elementName) => {
                  const config = elementConfigs[elementName]
                  if (!config) return null

                  const elementRule =
                    ruleDefinition.elementRules?.[elementName] ||
                    ruleDefinition.elementRules?.default ||
                    "BASE_LIMIT"

                  return (
                    <AccordionItem
                      key={elementName}
                      value={elementName}
                      className="border border-border bg-card"
                      style={{
                        borderRadius: "var(--radius)",
                      }}
                    >
                      <AccordionTrigger
                        className="hover:no-underline px-6 py-4 hover:bg-muted/50"
                        style={{
                          fontSize: "var(--text-base)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="text-foreground">{elementName}</span>
                          <Badge
                            variant={config.isValid ? "default" : "destructive"}
                            className="ml-auto mr-4"
                            style={{
                              fontSize: "var(--text-xs)",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {config.isValid ? "Valid" : "Invalid"}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      
                      {/* Divider between trigger and content */}
                      <Separator className="m-0" />
                      
                      <AccordionContent
                        className="px-6 pb-6"
                        style={{
                          paddingTop: "var(--spacing-6)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-5)",
                        }}
                      >
                        {elementRule === "DUAL_AXIS" ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-5)",
                            }}
                          >
                            {/* Cross-Aisle Limit */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--spacing-2)",
                              }}
                            >
                              <Label
                                htmlFor={`${elementName}-crossAisle`}
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-medium)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                Cross-Aisle Limit (mm)
                                <span className="text-destructive ml-1">*</span>
                              </Label>
                              <Input
                                id={`${elementName}-crossAisle`}
                                type="number"
                                value={config.crossAisleLimit ?? ""}
                                onChange={(e) => {
                                  const value = Number(e.target.value)
                                  if (value < 0) return
                                  updateElementField(elementName, "crossAisleLimit", value)
                                }}
                                min={0}
                                step={0.1}
                                className="bg-background border-border text-foreground"
                                style={{
                                  height: "44px",
                                  fontSize: "var(--text-sm)",
                                  fontFamily: "'Inter', sans-serif",
                                  borderRadius: "var(--radius-sm)",
                                }}
                              />
                              {config.crossAisleLimit !== undefined &&
                                config.crossAisleLimit < 0 && (
                                  <span
                                    className="text-destructive"
                                    style={{
                                      fontSize: "var(--text-xs)",
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  >
                                    Must be greater than or equal to 0
                                  </span>
                                )}
                            </div>

                            {/* Down-Aisle Limit */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--spacing-2)",
                              }}
                            >
                              <Label
                                htmlFor={`${elementName}-downAisle`}
                                className="text-foreground"
                                style={{
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-medium)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                Down-Aisle Limit (mm)
                                <span className="text-destructive ml-1">*</span>
                              </Label>
                              <Input
                                id={`${elementName}-downAisle`}
                                type="number"
                                value={config.downAisleLimit ?? ""}
                                onChange={(e) => {
                                  const value = Number(e.target.value)
                                  if (value < 0) return
                                  updateElementField(elementName, "downAisleLimit", value)
                                }}
                                min={0}
                                step={0.1}
                                className="bg-background border-border text-foreground"
                                style={{
                                  height: "44px",
                                  fontSize: "var(--text-sm)",
                                  fontFamily: "'Inter', sans-serif",
                                  borderRadius: "var(--radius-sm)",
                                }}
                              />
                              {config.downAisleLimit !== undefined && config.downAisleLimit < 0 && (
                                <span
                                  className="text-destructive"
                                  style={{
                                    fontSize: "var(--text-xs)",
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  Must be greater than or equal to 0
                                </span>
                              )}
                            </div>
                          </div>
                        ) : elementRule === "FORMULA" ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-3)",
                            }}
                          >
                            <h4
                              className="text-foreground"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              Lateral Deformation Rule
                            </h4>

                            <div
                              className="bg-muted border border-border"
                              style={{
                                borderRadius: "var(--radius)",
                                padding: "var(--spacing-4)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "var(--spacing-4)",
                                }}
                              >
                                {/* Allowable Lateral Deformation Field */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--spacing-2)",
                                  }}
                                >
                                  <label
                                    className="text-foreground"
                                    style={{
                                      fontSize: "var(--text-sm)",
                                      fontWeight: "var(--font-weight-medium)",
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  >
                                    Allowable Lateral Deformation
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue="Span / 400"
                                    className="bg-background text-foreground border border-border"
                                    style={{
                                      fontSize: "var(--text-sm)",
                                      fontWeight: "var(--font-weight-normal)",
                                      fontFamily: "'Inter', sans-serif",
                                      padding: "var(--spacing-2) var(--spacing-3)",
                                      borderRadius: "var(--radius)",
                                      outline: "none",
                                      width: "100%",
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                                    onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
                                  />
                                </div>

                                {/* Red Threshold Field with Dynamic Multiplier */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--spacing-2)",
                                  }}
                                >
                                  <label
                                    className="text-foreground"
                                    style={{
                                      fontSize: "var(--text-sm)",
                                      fontWeight: "var(--font-weight-medium)",
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  >
                                    Red Threshold
                                  </label>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--spacing-2)",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      defaultValue="2"
                                      min="0"
                                      step="0.1"
                                      className="bg-background text-foreground border border-border"
                                      style={{
                                        fontSize: "var(--text-sm)",
                                        fontWeight: "var(--font-weight-normal)",
                                        fontFamily: "'Inter', sans-serif",
                                        padding: "var(--spacing-2) var(--spacing-3)",
                                        borderRadius: "var(--radius)",
                                        outline: "none",
                                        width: "80px",
                                      }}
                                      onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                                      onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
                                    />
                                    <span
                                      className="text-muted-foreground"
                                      style={{
                                        fontSize: "var(--text-sm)",
                                        fontWeight: "var(--font-weight-normal)",
                                        fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      × (Span / 400)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <p
                              className="text-muted-foreground"
                              style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: "var(--font-weight-normal)",
                                fontFamily: "'Inter', sans-serif",
                                margin: 0,
                              }}
                            >
                              Span (L) is automatically derived from the Digital Twin. No manual
                              configuration required.
                            </p>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-2)",
                            }}
                          >
                            <Label
                              htmlFor={`${elementName}-base`}
                              className="text-foreground"
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              Base Limit (mm)
                              <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Input
                              id={`${elementName}-base`}
                              type="number"
                              value={config.baseLimit ?? ""}
                              onChange={(e) => {
                                const value = Number(e.target.value)
                                if (value < 0) return
                                updateElementField(elementName, "baseLimit", value)
                              }}
                              min={0}
                              step={0.1}
                              className="bg-background border-border text-foreground"
                              style={{
                                height: "44px",
                                fontSize: "var(--text-sm)",
                                fontFamily: "'Inter', sans-serif",
                                borderRadius: "var(--radius-sm)",
                              }}
                            />
                            {config.baseLimit !== undefined && config.baseLimit < 0 && (
                              <span
                                className="text-destructive"
                                style={{
                                  fontSize: "var(--text-xs)",
                                  fontFamily: "'Inter', sans-serif",
                                }}
                              >
                                Must be greater than or equal to 0
                              </span>
                            )}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between bg-background border-t border-border"
          style={{
            padding: "var(--spacing-4) var(--spacing-8)",
          }}
        >
          <div
            className="text-muted-foreground"
            style={{
              fontSize: "var(--text-xs)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {linkedElements.length > 0 && elementConfigs[linkedElements[0]]?.lastUpdated ? (
              <>
                Last updated by {elementConfigs[linkedElements[0]].lastUpdated.user} on{" "}
                {elementConfigs[linkedElements[0]].lastUpdated.date}
              </>
            ) : (
              <>Not yet configured</>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "var(--spacing-3)",
            }}
          >
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-border text-foreground hover:bg-muted"
              style={{
                height: "40px",
                padding: "0 var(--spacing-4)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
                borderRadius: "var(--radius-sm)",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={!allElementsValid || !hasUnsavedChanges}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              style={{
                height: "40px",
                padding: "0 var(--spacing-4)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
                borderRadius: "var(--radius-sm)",
              }}
            >
              Save Configuration
            </Button>
          </div>
        </div>
        </>
        )}
      </SheetContent>
    </Sheet>
  )
}