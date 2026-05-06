"use client"

import * as React from "react"
import { X, AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet"

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
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (elementName: string, config: ElementConfiguration) => void
}

// ============================================================================
// SCHEMA DEFINITIONS - Using Zod for validation
// ============================================================================

const uprightSchema = z.object({
  crossAisleLimit: z.coerce.number().min(0, "Must be ≥ 0"),
  downAisleLimit: z.coerce.number().min(0, "Must be ≥ 0"),
})

const standardSchema = z.object({
  baseLimit: z.coerce.number().min(0, "Must be ≥ 0"),
})

type UprightFormValues = z.infer<typeof uprightSchema>
type StandardFormValues = z.infer<typeof standardSchema>

// ============================================================================
// ELEMENT FORM COMPONENT - Handles individual element configuration
// ============================================================================

interface ElementFormProps {
  elementName: string
  initialConfig: ElementConfiguration
  onFieldChange: (elementName: string, field: string, value: number) => void
}

function ElementForm({ elementName, initialConfig, onFieldChange }: ElementFormProps) {
  const isUpright = elementName.toLowerCase().includes("upright")
  
  // Create form with appropriate schema
  const uprightForm = useForm<UprightFormValues>({
    resolver: zodResolver(uprightSchema),
    defaultValues: {
      crossAisleLimit: initialConfig.crossAisleLimit ?? 0,
      downAisleLimit: initialConfig.downAisleLimit ?? 0,
    },
  })

  const standardForm = useForm<StandardFormValues>({
    resolver: zodResolver(standardSchema),
    defaultValues: {
      baseLimit: initialConfig.baseLimit ?? 0,
    },
  })

  const form = isUpright ? uprightForm : standardForm

  return (
    <div 
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-6)",
      }}
    >
      {/* Element Title */}
      <h2 
        className="text-foreground"
        style={{
          fontSize: "16px",
          fontWeight: "var(--font-weight-semi-bold)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {elementName}
      </h2>

      {/* Form Fields */}
      <Form {...form}>
        <div 
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-5)",
          }}
        >
          {isUpright ? (
            <>
              {/* Cross-Aisle Limit - ShadCN Form Pattern */}
              <FormField
                control={form.control}
                name="crossAisleLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Cross-Aisle Limit (mm)
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step={0.1}
                        className="bg-input-background border-border text-foreground"
                        style={{
                          height: "44px",
                          fontSize: "var(--text-sm)",
                          fontFamily: "'Inter', sans-serif",
                        }}
                        onChange={(e) => {
                          field.onChange(e)
                          onFieldChange(elementName, "crossAisleLimit", Number(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[#E72547]" />
                  </FormItem>
                )}
              />

              {/* Down-Aisle Limit - ShadCN Form Pattern */}
              <FormField
                control={form.control}
                name="downAisleLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Down-Aisle Limit (mm)
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step={0.1}
                        className="bg-input-background border-border text-foreground"
                        style={{
                          height: "44px",
                          fontSize: "var(--text-sm)",
                          fontFamily: "'Inter', sans-serif",
                        }}
                        onChange={(e) => {
                          field.onChange(e)
                          onFieldChange(elementName, "downAisleLimit", Number(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[#E72547]" />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              {/* Base Limit - ShadCN Form Pattern */}
              <FormField
                control={form.control}
                name="baseLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-foreground"
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Base Limit (mm)
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step={0.1}
                        className="bg-input-background border-border text-foreground"
                        style={{
                          height: "44px",
                          fontSize: "var(--text-sm)",
                          fontFamily: "'Inter', sans-serif",
                        }}
                        onChange={(e) => {
                          field.onChange(e)
                          onFieldChange(elementName, "baseLimit", Number(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[#E72547]" />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </Form>
    </div>
  )
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createInitialElementConfig(elementName: string): ElementConfiguration {
  if (elementName.toLowerCase().includes("upright")) {
    return {
      crossAisleLimit: 0,
      downAisleLimit: 0,
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

function validateElement(elementName: string, config: ElementConfiguration): boolean {
  if (elementName.toLowerCase().includes("upright")) {
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
  open,
  onOpenChange,
  onSave,
}: EvaluationConfigDrawerProps) {
  const [elementConfigs, setElementConfigs] = React.useState<Record<string, ElementConfiguration>>({})
  const [showUnsavedBanner, setShowUnsavedBanner] = React.useState(false)
  const elementSnapshotRef = React.useRef<Record<string, ElementConfiguration>>({})

  // Initialize configs when linkedElements changes
  React.useEffect(() => {
    const configs: Record<string, ElementConfiguration> = {}
    linkedElements.forEach((element) => {
      configs[element] = createInitialElementConfig(element)
    })
    setElementConfigs(configs)
    console.log("🔧 Initialized elementConfigs:", configs)
  }, [linkedElements])

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
    return linkedElements.every((elementName) => {
      const config = elementConfigs[elementName]
      return config && validateElement(elementName, config)
    })
  }, [linkedElements, elementConfigs])

  // Update specific field for an element
  const updateElementField = (elementName: string, field: string, value: number) => {
    setElementConfigs((prev) => {
      const updated = {
        ...prev,
        [elementName]: {
          ...prev[elementName],
          [field]: value,
          isDirty: true,
        },
      }
      
      updated[elementName].isValid = validateElement(elementName, updated[elementName])
      
      return updated
    })
  }

  const handleDiscardChanges = () => {
    setElementConfigs(JSON.parse(JSON.stringify(elementSnapshotRef.current)))
    setShowUnsavedBanner(false)
  }

  const handleKeepEditing = () => {
    setShowUnsavedBanner(false)
  }

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedBanner(true)
    } else {
      onOpenChange(false)
    }
  }

  const handleSaveAll = () => {
    if (!allElementsValid) return

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

  return (
    <Sheet open={open} onOpenChange={(newOpen) => !newOpen && handleClose()}>
      <SheetContent
        side="right"
        className="w-[480px] max-w-none p-0 overflow-hidden flex flex-col bg-card border-l border-border"
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
        {/* Header */}
        <SheetHeader 
          className="flex-shrink-0 border-b border-border"
          style={{
            padding: "var(--spacing-8)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle 
                className="text-foreground leading-tight"
                style={{
                  fontSize: "var(--text-xl)",
                  fontWeight: "var(--font-weight-semi-bold)",
                  marginBottom: "var(--spacing-3)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {testName} ({testId}) — Evaluation Configuration
              </SheetTitle>
              <SheetDescription 
                className="text-muted-foreground leading-relaxed"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  marginBottom: "var(--spacing-4)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Configure evaluation logic per element. Severity is calculated automatically.
              </SheetDescription>
              <span 
                className="inline-block text-muted-foreground"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {testScope}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-muted -mt-1"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </SheetHeader>

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
              <AlertCircle className="h-5 w-5 text-foreground" />
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
            style={{
              paddingTop: "24px",
              paddingRight: "24px",
              paddingBottom: "24px",
              paddingLeft: "24px",
            }}
          >
            {linkedElements.length === 0 ? (
              <div 
                className="text-muted-foreground text-center"
                style={{
                  padding: "var(--spacing-12) var(--spacing-8)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                No linked elements configured for this test.
              </div>
            ) : (
              linkedElements.map((elementName, index) => {
                const config = elementConfigs[elementName] || createInitialElementConfig(elementName)
                const isLastElement = index === linkedElements.length - 1

                return (
                  <div key={elementName}>
                    {/* Element Form with ShadCN Components */}
                    <ElementForm
                      elementName={elementName}
                      initialConfig={config}
                      onFieldChange={updateElementField}
                    />

                    {/* Section Divider */}
                    {!isLastElement && (
                      <div 
                        className="bg-border"
                        style={{
                          height: "1px",
                          marginTop: "24px",
                          marginBottom: "24px",
                        }}
                      />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex-shrink-0 bg-card border-t border-border flex items-center justify-between"
          style={{
            padding: "var(--spacing-6) var(--spacing-10)",
          }}
        >
          <div 
            className="text-muted-foreground"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {Object.values(elementConfigs).some(c => c.lastUpdated) ? (
              <span>
                Last Updated: {Object.values(elementConfigs).find(c => c.lastUpdated)?.lastUpdated?.user} • {Object.values(elementConfigs).find(c => c.lastUpdated)?.lastUpdated?.date}
              </span>
            ) : (
              <span>No configuration saved yet</span>
            )}
          </div>
          <div 
            className="flex items-center"
            style={{
              gap: "var(--spacing-3)",
            }}
          >
            <Button
              variant="ghost"
              onClick={handleClose}
              className="hover:bg-muted"
              style={{
                height: "44px",
                padding: "0 var(--spacing-5)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={!allElementsValid}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                height: "44px",
                padding: "0 var(--spacing-6)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
