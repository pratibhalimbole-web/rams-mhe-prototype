"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"

interface ThresholdConfigDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testName: string
  testId: string
  testScope?: string
  linkedElement?: string
  linkedElements?: string[]
  engineType?: string
  ruleKey?: string
  onSave: (elementName: string, config: ThresholdConfig) => void
}

export interface ThresholdConfig {
  elasticDivisor: number
  permanentDivisor: number
  redMultiplier: number
}

export function ThresholdConfigDrawer({
  open,
  onOpenChange,
  testName,
  testId,
  testScope,
  linkedElement,
  linkedElements,
  engineType,
  ruleKey,
  onSave,
}: ThresholdConfigDrawerProps) {
  // Form State
  const [elasticDivisor, setElasticDivisor] = React.useState<string>("200")
  const [permanentDivisor, setPermanentDivisor] = React.useState<string>("1000")
  const [redMultiplier, setRedMultiplier] = React.useState<string>("1.5")

  // Validation Errors
  const [elasticError, setElasticError] = React.useState<string>("")
  const [permanentError, setPermanentError] = React.useState<string>("")
  const [multiplierError, setMultiplierError] = React.useState<string>("")

  // Sample span for preview
  const sampleSpan = 2700
  
  // Determine the linked element to display
  const displayElement = linkedElement || (linkedElements && linkedElements.length > 0 ? linkedElements[0] : "Beam")

  // Reset form when drawer closes
  React.useEffect(() => {
    if (!open) {
      setElasticDivisor("200")
      setPermanentDivisor("1000")
      setRedMultiplier("1.5")
      setElasticError("")
      setPermanentError("")
      setMultiplierError("")
    }
  }, [open])

  // Validation Functions
  const validateElasticDivisor = (value: string): boolean => {
    const num = parseInt(value)
    if (isNaN(num)) {
      setElasticError("Divisor must be a valid number")
      return false
    }
    if (num < 100) {
      setElasticError("Minimum value is 100")
      return false
    }
    if (num > 1000) {
      setElasticError("Maximum value is 1000")
      return false
    }
    if (value.includes('.')) {
      setElasticError("Decimals not allowed")
      return false
    }
    setElasticError("")
    return true
  }

  const validatePermanentDivisor = (value: string, elasticValue: string): boolean => {
    const num = parseInt(value)
    const elasticNum = parseInt(elasticValue)
    
    if (isNaN(num)) {
      setPermanentError("Divisor must be a valid number")
      return false
    }
    if (num < 200) {
      setPermanentError("Minimum value is 200")
      return false
    }
    if (num > 2000) {
      setPermanentError("Maximum value is 2000")
      return false
    }
    if (value.includes('.')) {
      setPermanentError("Decimals not allowed")
      return false
    }
    if (!isNaN(elasticNum) && num <= elasticNum) {
      setPermanentError("Must be greater than Elastic Divisor")
      return false
    }
    setPermanentError("")
    return true
  }

  const validateMultiplier = (value: string): boolean => {
    const num = parseFloat(value)
    if (isNaN(num)) {
      setMultiplierError("Multiplier must be a valid number")
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

  // Handle Input Changes
  const handleElasticChange = (value: string) => {
    setElasticDivisor(value)
    validateElasticDivisor(value)
    // Re-validate permanent divisor to check comparison
    if (permanentDivisor) {
      validatePermanentDivisor(permanentDivisor, value)
    }
  }

  const handlePermanentChange = (value: string) => {
    setPermanentDivisor(value)
    validatePermanentDivisor(value, elasticDivisor)
  }

  const handleMultiplierChange = (value: string) => {
    setRedMultiplier(value)
    validateMultiplier(value)
  }

  // Calculate Preview Values
  const elasticAllowable = elasticDivisor && !isNaN(parseInt(elasticDivisor))
    ? (sampleSpan / parseInt(elasticDivisor)).toFixed(2)
    : "—"
  
  const elasticRedLimit = elasticAllowable !== "—" && redMultiplier && !isNaN(parseFloat(redMultiplier))
    ? (parseFloat(elasticAllowable) * parseFloat(redMultiplier)).toFixed(2)
    : "—"

  const permanentAllowable = permanentDivisor && !isNaN(parseInt(permanentDivisor))
    ? (sampleSpan / parseInt(permanentDivisor)).toFixed(2)
    : "—"
  
  const permanentRedLimit = permanentAllowable !== "—" && redMultiplier && !isNaN(parseFloat(redMultiplier))
    ? (parseFloat(permanentAllowable) * parseFloat(redMultiplier)).toFixed(2)
    : "—"

  // Check if form is valid
  const isFormValid = 
    elasticDivisor !== "" && 
    permanentDivisor !== "" && 
    redMultiplier !== "" &&
    elasticError === "" && 
    permanentError === "" && 
    multiplierError === ""

  // Handle Save
  const handleSave = () => {
    const isElasticValid = validateElasticDivisor(elasticDivisor)
    const isPermanentValid = validatePermanentDivisor(permanentDivisor, elasticDivisor)
    const isMultiplierValid = validateMultiplier(redMultiplier)

    if (isElasticValid && isPermanentValid && isMultiplierValid) {
      onSave(displayElement, {
        elasticDivisor: parseInt(elasticDivisor),
        permanentDivisor: parseInt(permanentDivisor),
        redMultiplier: parseFloat(redMultiplier),
      })
      onOpenChange(false)
    }
  }

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
                  {testName} ({testId}) — Threshold Configuration
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
                  {testScope || "Local"}
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
                Configure allowable deflection parameters for {displayElement}. Formula-based and span-dependent.
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
                  gap: "var(--spacing-6)",
                }}
              >
                {/* SECTION 1 — Deflection Mode Configuration */}
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
                    Deflection Modes
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-6)",
                    }}
                  >
                    {/* Elastic Mode */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-3)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <h5
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Elastic Mode (Service Condition)
                        </h5>
                        <div
                          className="bg-muted border border-border"
                          style={{
                            borderRadius: "var(--radius)",
                            padding: "var(--spacing-3) var(--spacing-4)",
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
                            Δ<sub>allow</sub> = L / <span className="text-primary">[{elasticDivisor || "___"}]</span>
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <Label 
                          htmlFor="elasticDivisor"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Elastic Divisor
                        </Label>
                        <Input
                          id="elasticDivisor"
                          type="number"
                          min="100"
                          max="1000"
                          step="1"
                          value={elasticDivisor}
                          onChange={(e) => handleElasticChange(e.target.value)}
                          className={elasticError ? 'border-destructive focus-visible:ring-destructive' : ''}
                          style={{
                            height: "40px",
                            fontSize: "var(--text-sm)",
                            fontFamily: "'Inter', sans-serif",
                          }}
                          placeholder="200"
                        />
                        {elasticError && (
                          <p
                            className="text-destructive"
                            style={{
                              fontSize: "var(--text-xs)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            {elasticError}
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
                          Range: 100 – 1000 (integers only)
                        </p>
                      </div>
                    </div>

                    {/* Permanent Mode */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-3)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <h5
                          className="text-foreground"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            margin: 0,
                          }}
                        >
                          Permanent Mode (Residual Condition)
                        </h5>
                        <div
                          className="bg-muted border border-border"
                          style={{
                            borderRadius: "var(--radius)",
                            padding: "var(--spacing-3) var(--spacing-4)",
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
                            Δ<sub>allow</sub> = L / <span className="text-primary">[{permanentDivisor || "___"}]</span>
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-2)",
                        }}
                      >
                        <Label 
                          htmlFor="permanentDivisor"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Permanent Divisor
                        </Label>
                        <Input
                          id="permanentDivisor"
                          type="number"
                          min="200"
                          max="2000"
                          step="1"
                          value={permanentDivisor}
                          onChange={(e) => handlePermanentChange(e.target.value)}
                          className={permanentError ? 'border-destructive focus-visible:ring-destructive' : ''}
                          style={{
                            height: "40px",
                            fontSize: "var(--text-sm)",
                            fontFamily: "'Inter', sans-serif",
                          }}
                          placeholder="1000"
                        />
                        {permanentError && (
                          <p
                            className="text-destructive"
                            style={{
                              fontSize: "var(--text-xs)",
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}
                          >
                            {permanentError}
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
                    </div>

                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      Allowable deflection is calculated automatically based on beam span L.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* SECTION 2 — Red Escalation Multiplier */}
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
                    Escalation Multiplier
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-4)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <div
                        className="bg-muted border border-border"
                        style={{
                          borderRadius: "var(--radius)",
                          padding: "var(--spacing-3) var(--spacing-4)",
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
                          Red when Δ &gt; <span className="text-destructive">{redMultiplier || "___"}</span> × Δ<sub>allow</sub>
                        </p>
                      </div>
                    </div>
                    
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
                        Red Threshold Multiplier
                      </Label>
                      <Input
                        id="redMultiplier"
                        type="number"
                        min="1.0"
                        max="3.0"
                        step="0.1"
                        value={redMultiplier}
                        onChange={(e) => handleMultiplierChange(e.target.value)}
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
                        Range: 1.0 – 3.0 (decimals allowed)
                      </p>
                    </div>

                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      Multiplier defines escalation from Amber to Red.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* SECTION 3 — Live Formula Preview */}
                <div>
                  <h4
                    className="text-foreground"
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: "var(--spacing-2)",
                    }}
                  >
                    Calculation Preview
                  </h4>
                  <p
                    className="text-muted-foreground"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: "var(--spacing-4)",
                    }}
                  >
                    Example Span: <span className="text-foreground" style={{ fontWeight: "var(--font-weight-semi-bold)" }}>{sampleSpan} mm</span>
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-5)",
                    }}
                  >
                    {/* Elastic Preview */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <h6
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Elastic Mode Example
                      </h6>
                      <div
                        className="bg-accent border border-border"
                        style={{
                          borderRadius: "var(--radius)",
                          padding: "var(--spacing-3) var(--spacing-4)",
                        }}
                      >
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
                            Δ<sub>allow</sub> = {sampleSpan} / {elasticDivisor || "___"} = <span className="text-success" style={{ fontWeight: "var(--font-weight-bold)" }}>{elasticAllowable} mm</span>
                          </p>
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-xs)",
                              fontFamily: "'Courier New', monospace",
                              margin: 0,
                            }}
                          >
                            Red Limit = {redMultiplier || "___"} × {elasticAllowable} = <span className="text-destructive" style={{ fontWeight: "var(--font-weight-bold)" }}>{elasticRedLimit} mm</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Permanent Preview */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-2)",
                      }}
                    >
                      <h6
                        className="text-foreground"
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          fontFamily: "'Inter', sans-serif",
                          margin: 0,
                        }}
                      >
                        Permanent Mode Example
                      </h6>
                      <div
                        className="bg-accent border border-border"
                        style={{
                          borderRadius: "var(--radius)",
                          padding: "var(--spacing-3) var(--spacing-4)",
                        }}
                      >
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
                            Δ<sub>allow</sub> = {sampleSpan} / {permanentDivisor || "___"} = <span className="text-success" style={{ fontWeight: "var(--font-weight-bold)" }}>{permanentAllowable} mm</span>
                          </p>
                          <p
                            className="text-foreground"
                            style={{
                              fontSize: "var(--text-xs)",
                              fontFamily: "'Courier New', monospace",
                              margin: 0,
                            }}
                          >
                            Red Limit = {redMultiplier || "___"} × {permanentAllowable} = <span className="text-destructive" style={{ fontWeight: "var(--font-weight-bold)" }}>{permanentRedLimit} mm</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: "var(--text-xs)",
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      Preview updates when inputs change.
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
              onClick={handleSave}
              disabled={!isFormValid}
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
      </SheetContent>
    </Sheet>
  )
}