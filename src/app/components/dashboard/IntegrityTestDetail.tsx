import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useSidebar } from "../layout/SidebarLayout";
import {
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Download,
  ExternalLink,
} from "lucide-react";
import {
  executeTest,
  getTestDefinition,
  type TestExecutionResult,
  type MeasurementResult,
  type AcceptabilityStatus,
  type TestScope,
} from "./test-engine";

// Types
type RAGStatus = "green" | "amber" | "red" | "critical";

interface TestDetailData {
  id: string;
  testId: string;
  testName: string;
  testCode: string;
  testScope: TestScope;
  elementType: string;
  rackName: string;
  bay: string;
  level?: string;
  position?: string;
  location: string;
  executionDate: string;
  executedBy: string;
  cycle?: string;
  standardReference?: string;
  clauseReference?: string;
  notes?: string;
  possibleReason?: string;
  risk?: string;
  correctiveAction?: string;
  remarks?: string;
  flags?: string[];
  // Engine-driven execution result
  executionResult: TestExecutionResult;
}

// Mock data generator - NOW USES TEST ENGINE
function getMockTestDetail(testId: string): TestDetailData {
  // Determine test code from testId (e.g., "G1-042" -> "G1", "L1-123" -> "L1")
  // If testId doesn't contain "-", check if it's a valid test code, otherwise default to G1
  let testCode = testId.includes("-") ? testId.split("-")[0] : testId.toUpperCase();
  
  // Validate test code exists, otherwise default to G1
  let testDefinition = getTestDefinition(testCode);
  
  if (!testDefinition) {
    // Silent fallback to G1 for invalid/empty test IDs (common during navigation)
    testCode = "G1";
    testDefinition = getTestDefinition("G1");
  }
  
  if (!testDefinition) {
    throw new Error("Critical error: G1 test definition not found");
  }

  // Execute test with mock measurements based on test type
  let executionResult: TestExecutionResult;
  let mockData: Partial<TestDetailData>;
  
  if (testCode === "G1") {
    executionResult = executeTest(testDefinition, {
      testCode: "G1",
      measurements: [
        { parameterId: "upright_tilt", measuredValue: 1.2 },
        { parameterId: "vertical_deflection", measuredValue: 3.5 },
        { parameterId: "beam_load_capacity", measuredValue: 85 },
      ],
      executedBy: "Sarah Taylor",
    });
    
    mockData = {
      testId: "G1-042",
      elementType: "—",
      rackName: "R3-Aisle-South",
      bay: "Bay 06",
      location: "R3-Aisle-South / Bay 06",
      notes: "Measured plumbness deviation exceeds threshold. Recommend immediate review.",
      possibleReason: "Impact damage from forklift collision. The baseplate shows signs of significant deformation consistent with a high-force impact.",
      risk: "The structural integrity of the rack is severely compromised. There is a significant risk of rack collapse under load.",
      correctiveAction: "Immediate unloading followed by replacement is necessary",
    };
  } else if (testCode === "L1") {
    executionResult = executeTest(testDefinition, {
      testCode: "L1",
      measurements: [
        { parameterId: "cross_aisle", measuredValue: 9.5 },
        { parameterId: "down_aisle", measuredValue: 7.2 },
      ],
      executedBy: "Sarah Taylor",
      // Engineering context: span values for threshold calculation
      context: {
        span_cross: 1600, // 1600mm span → Allowable = 1600/200 = 8mm
        span_down: 2400,  // 2400mm span → Allowable = 2400/200 = 12mm
      },
    });
    
    // Mark the governing direction (worst)
    const crossAisleResult = executionResult.parameterResults.find(p => p.parameterId === "cross_aisle");
    const downAisleResult = executionResult.parameterResults.find(p => p.parameterId === "down_aisle");
    
    if (crossAisleResult && downAisleResult) {
      if (crossAisleResult.deviation > downAisleResult.deviation) {
        crossAisleResult.evaluationDisplay = { isGoverning: true };
      } else {
        downAisleResult.evaluationDisplay = { isGoverning: true };
      }
    }
    
    mockData = {
      testId: "L1-123",
      elementType: "Upright",
      rackName: "R2-Aisle-North",
      bay: "Bay 12",
      level: "Level 3",
      position: "Front-Left",
      location: "R2-Aisle-North / Bay 12 / Level 3 / Front-Left",
      notes: "Visible bend detected in cross-aisle direction. Component shows permanent deformation from impact.",
      possibleReason: "Forklift impact causing local deformation of upright member.",
      risk: "Reduced load-bearing capacity in affected section. May propagate under continued loading.",
      correctiveAction: "Replace damaged upright section. Inspect adjacent components for secondary damage.",
    };
  } else {
    // Fallback to G1 for unknown test codes
    executionResult = executeTest(getTestDefinition("G1")!, {
      testCode: "G1",
      measurements: [
        { parameterId: "upright_tilt", measuredValue: 1.2 },
        { parameterId: "vertical_deflection", measuredValue: 3.5 },
        { parameterId: "beam_load_capacity", measuredValue: 85 },
      ],
      executedBy: "Sarah Taylor",
    });
    
    mockData = {
      testId: "G1-042",
      elementType: "—",
      rackName: "R3-Aisle-South",
      bay: "Bay 06",
      location: "R3-Aisle-South / Bay 06",
      notes: "Measured plumbness deviation exceeds threshold. Recommend immediate review.",
    };
  }

  return {
    id: testId,
    testId: mockData.testId!,
    testName: testDefinition.name,
    testCode: testDefinition.code,
    testScope: testDefinition.scope,
    elementType: mockData.elementType!,
    rackName: mockData.rackName!,
    bay: mockData.bay!,
    level: mockData.level,
    position: mockData.position,
    location: mockData.location!,
    executionDate: "21 Apr 2025, 02:14 PM",
    executedBy: "Sarah Taylor",
    cycle: "Q1-2025",
    standardReference: testDefinition.standardReference,
    clauseReference: testDefinition.clauseReference,
    notes: mockData.notes,
    possibleReason: mockData.possibleReason,
    risk: mockData.risk,
    correctiveAction: mockData.correctiveAction,
    remarks: "Check all other possible reasons and then make a decision",
    flags: ["🚩 High Urgency", "🔄 Severity Change"],
    executionResult,
  };
}

export function IntegrityTestDetail() {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const sidebar = useSidebar();
  const [activeTab, setActiveTab] = useState<"testing" | "observation">("testing");
  const [isReferenceDiagramOpen, setIsReferenceDiagramOpen] = useState(false);

  // Mock data - in production, fetch based on testId
  const testDetail = getMockTestDetail(testId || "");

  // Set breadcrumb in global header - just test ID, "Integrity Test" becomes clickable automatically
  useEffect(() => {
    if (sidebar) {
      sidebar.setSubPageTitle(testDetail.testId);
    }
    return () => {
      if (sidebar) {
        sidebar.setSubPageTitle(null);
      }
    };
  }, [sidebar, testDetail.testId]);

  const getRiskStatusBadge = (rag: RAGStatus) => {
    const config = {
      green: { label: "Green", className: "bg-success/10 text-success border-0" },
      amber: { label: "Amber", className: "bg-warning/10 text-warning border-0" },
      red: { label: "Red", className: "bg-destructive/10 text-destructive border-0" },
      critical: { label: "Critical", className: "bg-destructive text-destructive-foreground border-0" },
    };

    const { label, className } = config[rag];
    return <Badge className={className} style={{ fontSize: "var(--text-xs)" }}>{label}</Badge>;
  };

  const getAcceptabilityBadge = (acceptability: AcceptabilityStatus) => {
    const config = {
      Acceptable: "bg-success/10 text-success border-0",
      Borderline: "bg-warning/10 text-warning border-0",
      "Not Acceptable": "bg-destructive/10 text-destructive border-0",
    };

    return <Badge className={config[acceptability]} style={{ fontSize: "var(--text-xs)" }}>{acceptability}</Badge>;
  };

  // Use the engine's calculated acceptability
  const acceptability = testDetail.executionResult.acceptability;
  const overallResult = testDetail.executionResult.overallResult;

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "var(--background)" }}>
      {/* Underline Tabs */}
      <div className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex" style={{ paddingLeft: "24px", paddingRight: "24px", gap: "var(--spacing-6)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("testing")}
            className="relative transition-colors"
            style={{
              paddingTop: "var(--spacing-4)",
              paddingBottom: "var(--spacing-3)",
              fontSize: "var(--text-sm)",
              fontWeight: activeTab === "testing" ? "var(--font-weight-medium)" : "var(--font-weight-normal)",
              color: activeTab === "testing" ? "var(--foreground)" : "var(--muted-foreground)",
              borderBottom: activeTab === "testing" ? "2px solid var(--primary)" : "2px solid transparent",
            }}
          >
            Testing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("observation")}
            className="relative transition-colors"
            style={{
              paddingTop: "var(--spacing-4)",
              paddingBottom: "var(--spacing-3)",
              fontSize: "var(--text-sm)",
              fontWeight: activeTab === "observation" ? "var(--font-weight-medium)" : "var(--font-weight-normal)",
              color: activeTab === "observation" ? "var(--foreground)" : "var(--muted-foreground)",
              borderBottom: activeTab === "observation" ? "2px solid var(--primary)" : "2px solid transparent",
            }}
          >
            Observation
          </button>
        </div>
      </div>

      {/* Tab Content - Scrollable Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === "testing" ? (
          <div style={{ padding: "24px" }}>
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1px_2fr]" style={{ gap: "var(--spacing-8)" }}>
              {/* Left Column (60%) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                {/* Location Details */}
                <section>
                  <h3
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-4)",
                    }}
                  >
                    Location Details
                  </h3>
                  <div className="grid grid-cols-2" style={{ gap: "var(--spacing-4)" }}>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Rack Name
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                        {testDetail.rackName}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Bay
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                        {testDetail.bay}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Element
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                        {testDetail.elementType}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Full Location Path
                      </p>
                      <p className="flex items-center" style={{ fontSize: "var(--text-xs)", color: "var(--primary)", gap: "var(--spacing-1)", cursor: "pointer" }}>
                        <LinkIcon className="h-3 w-3" />
                        {testDetail.location}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Scope
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          testDetail.testScope === "Global"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-secondary/10 text-secondary-foreground border-border"
                        }
                        style={{ fontSize: "var(--text-xs)" }}
                      >
                        {testDetail.testScope}
                      </Badge>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Test Information - CLEAN TECHNICAL ONLY */}
                <section>
                  <h3
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-4)",
                    }}
                  >
                    Test Information
                  </h3>
                  <div className="grid grid-cols-2" style={{ gap: "var(--spacing-4)" }}>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Test Name
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                        {testDetail.testName}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Test Code
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                        {testDetail.testCode}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Test ID
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                        {testDetail.testId}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Test Method
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                        {(() => {
                          const methodMap: Record<string, string> = {
                            // Global Tests
                            "G1": "Drone + Laser Survey",
                            "G2": "Total Station Survey",
                            "G3": "Drone Survey",
                            "G4": "Total Station Elevation Scan",
                            "G5": "Total Station Z-Level Scan",
                            // Local Tests
                            "L1": "Manual 1m Straightedge Gauge",
                            "L2": "Manual Depth Gauge Measurement",
                            "L3": "Manual Offset + Torque Inspection",
                            "L4": "Ultrasonic Thickness Gauge",
                            "L5": "Manual Section Loss Measurement",
                            // Material & Surface Tests
                            "M1": "Material Certificate Verification",
                            "S1": "Magnetic Coating Thickness Gauge",
                            // Floor Tests
                            "F1": "Schmidt Rebound Hammer Test",
                            "F2": "Ultrasonic Pulse Velocity Test",
                            // Special Tests
                            "B1": "String Line Midspan Measurement",
                          };
                          return methodMap[testDetail.testCode] || "—";
                        })()}
                      </p>
                    </div>
                    {/* Flags section removed */}
                  </div>
                </section>

                <Separator />

                {/* Technical Summary */}
                <section>
                  <h3
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-4)",
                    }}
                  >
                    Test Evaluation Summary
                  </h3>
                  <div
                    style={{
                      padding: "var(--spacing-4)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      backgroundColor: "color-mix(in srgb, var(--muted) 30%, transparent)",
                    }}
                  >
                    {testDetail.testCode === "L1" ? (
                      <div className="grid grid-cols-2" style={{ gap: "var(--spacing-4)" }}>
                        <div>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--foreground)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            Overall Result
                          </p>
                          <div className="flex items-center" style={{ gap: "var(--spacing-2)" }}>
                            {overallResult === "Fail" ? (
                              <>
                                <XCircle className="h-3.5 w-3.5" style={{ color: "var(--destructive)" }} />
                                <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--destructive)" }}>Fail</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />
                                <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--success)" }}>Pass</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--foreground)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            Overall Acceptability
                          </p>
                          {getAcceptabilityBadge(acceptability)}
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--foreground)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            Governing Direction
                          </p>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--foreground)",
                            }}
                          >
                            {testDetail.executionResult.parameterResults.find(p => p.evaluationDisplay?.isGoverning)?.parameterLabel || "—"}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--foreground)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            Maximum Measured Deflection
                          </p>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--destructive)",
                            }}
                          >
                            {Math.max(...testDetail.executionResult.parameterResults.map(p => p.measuredValue)).toFixed(2)} mm
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2" style={{ gap: "var(--spacing-4)" }}>
                        <div>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--foreground)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            Overall Result
                          </p>
                          <div className="flex items-center" style={{ gap: "var(--spacing-2)" }}>
                            {overallResult === "Fail" ? (
                              <>
                                <XCircle className="h-3.5 w-3.5" style={{ color: "var(--destructive)" }} />
                                <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--destructive)" }}>Fail</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />
                                <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--success)" }}>Pass</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--foreground)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            Overall Acceptability
                          </p>
                          {getAcceptabilityBadge(acceptability)}
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--foreground)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            Max Deviation
                          </p>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--destructive)",
                            }}
                          >
                            {testDetail.executionResult.maxDeviation.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--foreground)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            Failed Parameters
                          </p>
                          <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                            {testDetail.executionResult.failedCount} of {testDetail.executionResult.totalCount}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {testDetail.notes && (
                  <>
                    <Separator />
                    
                    {/* Technical Notes */}
                    <section>
                      <h3
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semi-bold)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-3)",
                        }}
                      >
                        Test Notes
                      </h3>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", lineHeight: "1.6" }}>
                        {testDetail.notes}
                      </p>
                    </section>
                  </>
                )}

                <Separator />

                {/* Execution Metadata - LOW EMPHASIS */}
                <section>
                  <h3
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--muted-foreground)",
                      marginBottom: "var(--spacing-3)",
                    }}
                  >
                    Execution Metadata
                  </h3>
                  <div className="grid grid-cols-2" style={{ gap: "var(--spacing-3)" }}>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--muted-foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Executed By
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                        {testDetail.executedBy}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--muted-foreground)",
                          marginBottom: "var(--spacing-1)",
                        }}
                      >
                        Execution Date
                      </p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>
                        {testDetail.executionDate}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Vertical Divider */}
              <Separator orientation="vertical" className="hidden lg:block" />

              {/* Right Column (40%) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
                {/* Media Evidence */}
                <section>
                  <h3
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-4)",
                    }}
                  >
                    Media Evidence
                  </h3>

                  {/* Images */}
                  <div style={{ marginBottom: "var(--spacing-5)" }}>
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground)",
                        marginBottom: "var(--spacing-3)",
                      }}
                    >
                      Images
                    </p>
                    <div className="grid grid-cols-4" style={{ gap: "var(--spacing-3)" }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="aspect-square flex items-center justify-center"
                          style={{
                            borderRadius: "var(--radius)",
                            backgroundColor: "var(--muted)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>{i}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Videos */}
                  <div style={{ marginBottom: "var(--spacing-5)" }}>
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground)",
                        marginBottom: "var(--spacing-3)",
                      }}
                    >
                      Videos
                    </p>
                    <div className="grid grid-cols-4" style={{ gap: "var(--spacing-3)" }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="relative aspect-square"
                          style={{
                            borderRadius: "var(--radius)",
                            backgroundColor: "var(--muted)",
                            border: "1px solid var(--border)",
                            overflow: "hidden",
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full border border-white/80 flex items-center justify-center">
                              <Play className="h-2.5 w-2.5 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audio */}
                  <div>
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground)",
                        marginBottom: "var(--spacing-3)",
                      }}
                    >
                      Audio
                    </p>
                    <div
                      className="flex items-center"
                      style={{
                        gap: "var(--spacing-3)",
                        padding: "var(--spacing-3)",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border)",
                        backgroundColor: "color-mix(in srgb, var(--muted) 30%, transparent)",
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full flex-shrink-0"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <Play className="h-3 w-3" style={{ color: "color-mix(in srgb, var(--foreground) 60%, transparent)" }} />
                      </Button>
                      <div className="flex-1 min-w-0">
                        <p
                          className="truncate"
                          style={{
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--foreground)",
                            marginBottom: "var(--spacing-1)",
                          }}
                        >
                          inspection-notes-baseplate-w328f28.mp3
                        </p>
                        <div className="flex items-center" style={{ gap: "var(--spacing-2)" }}>
                          <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: "var(--muted)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: "1.5%", backgroundColor: "var(--primary)" }}
                            />
                          </div>
                          <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>2:35</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full flex-shrink-0">
                        <Download className="h-3 w-3" style={{ color: "var(--foreground)" }} />
                      </Button>
                    </div>
                  </div>

                  {/* Reference Diagram */}
                  <div style={{ marginTop: "var(--spacing-5)" }}>
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground)",
                        marginBottom: "var(--spacing-3)",
                      }}
                    >
                      Reference Technical Diagram
                    </p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                      {/* Diagram Preview */}
                      <div
                        onClick={() => setIsReferenceDiagramOpen(true)}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                        style={{
                          width: "100%",
                          aspectRatio: "4/3",
                          borderRadius: "var(--radius)",
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "var(--spacing-4)",
                        }}
                      >
                        {testDetail.testCode === "G1" ? (
                          <svg viewBox="0 0 300 240" style={{ width: "100%", height: "100%" }}>
                            {/* Ground reference line */}
                            <line x1="50" y1="200" x2="250" y2="200" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                            
                            {/* Vertical reference line (dashed) */}
                            <line x1="120" y1="40" x2="120" y2="200" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                            
                            {/* Tilted upright */}
                            <line x1="130" y1="40" x2="145" y2="200" stroke="hsl(var(--foreground))" strokeWidth="2" />
                            
                            {/* Measurement arrow (blue) - tilt deviation */}
                            <defs>
                              <marker id="arrowhead-g1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                <polygon points="0 0, 6 3, 0 6" fill="hsl(var(--primary))" />
                              </marker>
                            </defs>
                            <line x1="120" y1="120" x2="130" y2="120" stroke="hsl(var(--primary))" strokeWidth="1.5" markerEnd="url(#arrowhead-g1)" />
                            
                            {/* Dimension labels */}
                            <text x="125" y="110" fontSize="10" fill="hsl(var(--primary))" textAnchor="middle" fontFamily="var(--font-family-mono)">δ</text>
                            <text x="120" y="30" fontSize="9" fill="hsl(var(--muted-foreground))" textAnchor="middle" fontFamily="var(--font-family-mono)">Vertical</text>
                            <text x="145" y="30" fontSize="9" fill="hsl(--foreground))" textAnchor="middle" fontFamily="var(--font-family-mono)">Upright</text>
                            <text x="150" y="215" fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="start" fontFamily="var(--font-family-mono)">Baseplate</text>
                          </svg>
                        ) : testDetail.testCode === "L1" ? (
                          <svg viewBox="0 0 300 240" style={{ width: "100%", height: "100%" }}>
                            {/* Upright member (vertical, with bulge) */}
                            <path d="M 100 40 Q 115 120, 100 200" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
                            
                            {/* Straightedge (1m reference) */}
                            <line x1="90" y1="70" x2="90" y2="170" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                            
                            {/* Measurement arrows (blue) - deflection */}
                            <defs>
                              <marker id="arrowhead-l1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                <polygon points="0 0, 6 3, 0 6" fill="hsl(var(--primary))" />
                              </marker>
                            </defs>
                            <line x1="90" y1="120" x2="108" y2="120" stroke="hsl(var(--primary))" strokeWidth="1.5" markerEnd="url(#arrowhead-l1)" />
                            
                            {/* Dimension labels */}
                            <text x="99" y="115" fontSize="10" fill="hsl(var(--primary))" textAnchor="middle" fontFamily="var(--font-family-mono)">Δ (mm)</text>
                            <text x="75" y="120" fontSize="9" fill="hsl(var(--muted-foreground))" textAnchor="end" fontFamily="var(--font-family-mono)">1m</text>
                            <text x="70" y="75" fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="end" fontFamily="var(--font-family-mono)">Straightedge</text>
                            <text x="125" y="120" fontSize="8" fill="hsl(var(--foreground))" textAnchor="start" fontFamily="var(--font-family-mono)">Bulge/Deflection</text>
                            
                            {/* Straightedge bracket markers */}
                            <line x1="85" y1="70" x2="90" y2="70" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                            <line x1="85" y1="170" x2="90" y2="170" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 300 240" style={{ width: "100%", height: "100%" }}>
                            <text x="150" y="120" fontSize="11" fill="hsl(var(--muted-foreground))" textAnchor="middle" fontFamily="var(--font-family-mono)">
                              {testDetail.testCode} Measurement Schematic
                            </text>
                          </svg>
                        )}
                      </div>
                      
                      {/* View Full Drawing Link */}
                      <button
                        type="button"
                        onClick={() => setIsReferenceDiagramOpen(true)}
                        className="flex items-center transition-colors hover:opacity-80"
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--primary)",
                          gap: "var(--spacing-1)",
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          width: "fit-content",
                        }}
                      >
                        View Full Drawing
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ padding: "var(--spacing-12)" }}>
            <div className="text-center">
              <p style={{ fontSize: "var(--text-sm)", color: "var(--muted-foreground)" }}>
                Observation details would be displayed here
              </p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)", marginTop: "var(--spacing-2)" }}>
                This tab mirrors the structure from Inspection Findings
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reference Diagram Modal */}
      <Dialog open={isReferenceDiagramOpen} onOpenChange={setIsReferenceDiagramOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--foreground)" }}>
              Reference Diagram: {testDetail.testCode}
            </DialogTitle>
            <DialogDescription style={{ fontSize: "var(--text-sm)", color: "var(--muted-foreground)", lineHeight: "1.6" }}>
              This diagram illustrates the measurement methodology for {testDetail.testName}. 
              {testDetail.standardReference && ` Reference: ${testDetail.standardReference}`}
            </DialogDescription>
          </DialogHeader>
          <div style={{ paddingTop: "var(--spacing-4)" }}>
            {/* Large Diagram Display */}
            <div
              style={{
                width: "100%",
                aspectRatio: "16/10",
                borderRadius: "var(--radius)",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--spacing-8)",
              }}
            >
              {testDetail.testCode === "G1" ? (
                <svg viewBox="0 0 600 400" style={{ width: "100%", height: "100%" }}>
                  {/* Ground reference line */}
                  <line x1="100" y1="340" x2="500" y2="340" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
                  
                  {/* Vertical reference line (dashed) */}
                  <line x1="250" y1="60" x2="250" y2="340" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.6" />
                  
                  {/* Tilted upright */}
                  <line x1="270" y1="60" x2="305" y2="340" stroke="hsl(var(--foreground))" strokeWidth="3" />
                  
                  {/* Measurement arrow (blue) - tilt deviation */}
                  <defs>
                    <marker id="arrowhead-g1-modal" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                      <polygon points="0 0, 10 5, 0 10" fill="hsl(var(--primary))" />
                    </marker>
                  </defs>
                  <line x1="250" y1="200" x2="275" y2="200" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrowhead-g1-modal)" />
                  
                  {/* Dimension labels */}
                  <text x="262" y="185" fontSize="16" fill="hsl(var(--primary))" textAnchor="middle" fontFamily="var(--font-family-mono)" fontWeight="600">δ (mm)</text>
                  <text x="250" y="45" fontSize="13" fill="hsl(var(--muted-foreground))" textAnchor="middle" fontFamily="var(--font-family-mono)">Vertical Reference</text>
                  <text x="290" y="45" fontSize="13" fill="hsl(var(--foreground))" textAnchor="middle" fontFamily="var(--font-family-mono)">Actual Upright</text>
                  <text x="310" y="360" fontSize="12" fill="hsl(var(--muted-foreground))" textAnchor="start" fontFamily="var(--font-family-mono)">Baseplate</text>
                  
                  {/* Height annotation */}
                  <line x1="90" y1="60" x2="90" y2="340" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
                  <line x1="85" y1="60" x2="95" y2="60" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
                  <line x1="85" y1="340" x2="95" y2="340" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
                  <text x="75" y="205" fontSize="12" fill="hsl(var(--muted-foreground))" textAnchor="end" fontFamily="var(--font-family-mono)">H</text>
                </svg>
              ) : testDetail.testCode === "L1" ? (
                <svg viewBox="0 0 600 400" style={{ width: "100%", height: "100%" }}>
                  {/* Upright member (vertical, with bulge) */}
                  <path d="M 220 80 Q 250 200, 220 320" stroke="hsl(var(--foreground))" strokeWidth="3" fill="none" />
                  
                  {/* Straightedge (1m reference) */}
                  <line x1="200" y1="110" x2="200" y2="290" stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" />
                  
                  {/* Measurement arrows (blue) - deflection */}
                  <defs>
                    <marker id="arrowhead-l1-modal" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                      <polygon points="0 0, 10 5, 0 10" fill="hsl(var(--primary))" />
                    </marker>
                  </defs>
                  <line x1="200" y1="200" x2="238" y2="200" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrowhead-l1-modal)" />
                  
                  {/* Dimension labels */}
                  <text x="219" y="185" fontSize="16" fill="hsl(var(--primary))" textAnchor="middle" fontFamily="var(--font-family-mono)" fontWeight="600">Δ (mm)</text>
                  <text x="170" y="205" fontSize="14" fill="hsl(var(--muted-foreground))" textAnchor="end" fontFamily="var(--font-family-mono)">1000 mm</text>
                  <text x="160" y="120" fontSize="12" fill="hsl(var(--muted-foreground))" textAnchor="end" fontFamily="var(--font-family-mono)">Straightedge</text>
                  <text x="260" y="205" fontSize="13" fill="hsl(var(--foreground))" textAnchor="start" fontFamily="var(--font-family-mono)">Local Deflection</text>
                  
                  {/* Straightedge bracket markers */}
                  <line x1="190" y1="110" x2="200" y2="110" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                  <line x1="190" y1="290" x2="200" y2="290" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                  
                  {/* Bulge annotation */}
                  <circle cx="243" cy="200" r="3" fill="hsl(var(--primary))" />
                  <text x="260" y="230" fontSize="11" fill="hsl(var(--muted-foreground))" textAnchor="start" fontFamily="var(--font-family-mono)" fontStyle="italic">Maximum point</text>
                </svg>
              ) : (
                <svg viewBox="0 0 600 400" style={{ width: "100%", height: "100%" }}>
                  <text x="300" y="200" fontSize="18" fill="hsl(var(--muted-foreground))" textAnchor="middle" fontFamily="var(--font-family-mono)">
                    {testDetail.testCode} Measurement Schematic
                  </text>
                </svg>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}