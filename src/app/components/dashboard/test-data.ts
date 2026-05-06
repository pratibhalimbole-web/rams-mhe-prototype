// Test Data for the Testing Tab
// G1-G5: Global Tests
// L1-L10: Local Tests (L1-L7: Component tests, L8-L10: Floor tests)
// B1: Beam Vertical Deflection (Structural Beam Test)

export type TestItem = {
  internalId: string // unique identifier for React keys
  testId: string // Test ID (e.g. G1, L1)
  testName: string // Test name
  testScope: "Global" | "Local" // Test scope
  linkedElementTypes: string // Linked element types (comma-separated or "—" for none)
  linkedElementTypesArray?: string[] // Array of linked element types for easier rendering
  engineType: "STATIC" | "FORMULA"
  ruleKey: string
  isActive: boolean // Status
  // Extended metadata for enhanced test details
  category?: string // Category (e.g., "Structural – Beam")
  inputType?: string // Input type (e.g., "Multi-Method")
  metadataChips?: string[] // Metadata chips for display
  description?: string // Expandable description tooltip
  instrumentSupport?: {
    label: string
    supported: boolean
  }[] // Instrument support indicators
  hasThresholdConfig?: boolean // Whether test has threshold configuration button
}

export const testData: TestItem[] = [
  // Global Tests (G1-G5)
  {
    internalId: "test-g1",
    testId: "G1",
    testName: "Plumbness",
    testScope: "Global",
    linkedElementTypes: "—",
    engineType: "FORMULA",
    ruleKey: "PLUMBNESS",
    isActive: true
  },
  {
    internalId: "test-g2",
    testId: "G2",
    testName: "Rack Run Straightness",
    testScope: "Global",
    linkedElementTypes: "—",
    engineType: "FORMULA",
    ruleKey: "RACK_RUN_STRAIGHTNESS",
    isActive: true
  },
  {
    internalId: "test-g3",
    testId: "G3",
    testName: "System Lateral Sway",
    testScope: "Global",
    linkedElementTypes: "—",
    engineType: "FORMULA",
    ruleKey: "SYSTEM_LATERAL_SWAY",
    isActive: true
  },
  {
    internalId: "test-g4",
    testId: "G4",
    testName: "Floor Flatness",
    testScope: "Global",
    linkedElementTypes: "—",
    engineType: "FORMULA",
    ruleKey: "FLOOR_FLATNESS",
    isActive: true
  },
  {
    internalId: "test-g5",
    testId: "G5",
    testName: "Baseplate Settlement Baseline",
    testScope: "Global",
    linkedElementTypes: "—",
    engineType: "FORMULA",
    ruleKey: "BASEPLATE_SETTLEMENT",
    isActive: true
  },
  
  // Local Tests - Structural Components (L1-L7)
  {
    internalId: "test-l1",
    testId: "L1",
    testName: "Component Bend",
    testScope: "Local",
    linkedElementTypes: "Beam, Upright, Bracing",
    linkedElementTypesArray: ["Beam", "Upright", "Bracing"],
    engineType: "STATIC",
    ruleKey: "BEND",
    isActive: true
  },
  // B1 - Beam Vertical Deflection (Structural Beam Test)
  {
    internalId: "test-b1",
    testId: "B1",
    testName: "Beam Vertical Deflection",
    testScope: "Local",
    linkedElementTypes: "Beam",
    linkedElementTypesArray: ["Beam"],
    engineType: "FORMULA",
    ruleKey: "BEAM_VERTICAL_DEFLECTION",
    isActive: true,
    category: "Structural – Beam",
    inputType: "Multi-Method",
    metadataChips: ["Elastic Mode (L/200)", "Permanent Mode (L/1000)", "Multi-Measurement", "String Supported"],
    description: "Evaluates vertical beam deflection under service or residual conditions. Supports String, Total Station, and Drone + AI measurement methods. RAG based on L/200 (elastic) or L/1000 (permanent) with 1.5× escalation rule.",
    instrumentSupport: [
      { label: "String Method", supported: true },
      { label: "Total Station", supported: true },
      { label: "Drone + AI", supported: true }
    ],
    hasThresholdConfig: false
  },
  {
    internalId: "test-l2",
    testId: "L2",
    testName: "Component Dent",
    testScope: "Local",
    linkedElementTypes: "Beam, Upright, Bracing, Baseplate",
    linkedElementTypesArray: ["Beam", "Upright", "Bracing", "Baseplate"],
    engineType: "FORMULA",
    ruleKey: "DENT",
    isActive: true
  },
  {
    internalId: "test-l3",
    testId: "L3",
    testName: "Component Splice",
    testScope: "Local",
    linkedElementTypes: "Upright",
    linkedElementTypesArray: ["Upright"],
    engineType: "STATIC",
    ruleKey: "SPLICE",
    isActive: true
  },
  {
    internalId: "test-l4",
    testId: "L4",
    testName: "Component Thickness",
    testScope: "Local",
    linkedElementTypes: "Beam, Upright, Bracing, Baseplate",
    linkedElementTypesArray: ["Beam", "Upright", "Bracing", "Baseplate"],
    engineType: "FORMULA",
    ruleKey: "THICKNESS",
    isActive: true
  },
  {
    internalId: "test-l5",
    testId: "L5",
    testName: "Component Corrosion",
    testScope: "Local",
    linkedElementTypes: "Beam, Upright, Bracing, Baseplate",
    linkedElementTypesArray: ["Beam", "Upright", "Bracing", "Baseplate"],
    engineType: "FORMULA",
    ruleKey: "CORROSION",
    isActive: true
  },
  {
    internalId: "test-l6",
    testId: "L6",
    testName: "Material Strength",
    testScope: "Local",
    linkedElementTypes: "Beam, Upright, Baseplate",
    linkedElementTypesArray: ["Beam", "Upright", "Baseplate"],
    engineType: "STATIC",
    ruleKey: "MATERIAL_STRENGTH",
    isActive: true
  },
  {
    internalId: "test-l7",
    testId: "L7",
    testName: "Surface Coating",
    testScope: "Local",
    linkedElementTypes: "Beam, Upright, Bracing",
    linkedElementTypesArray: ["Beam", "Upright", "Bracing"],
    engineType: "STATIC",
    ruleKey: "SURFACE_COATING",
    isActive: true
  },
  
  // Local Tests - Floor Tests (L8-L10)
  {
    internalId: "test-l8",
    testId: "L8",
    testName: "Floor – GPR",
    testScope: "Local",
    linkedElementTypes: "Floor",
    linkedElementTypesArray: ["Floor"],
    engineType: "STATIC",
    ruleKey: "FLOOR_GPR",
    isActive: true
  },
  {
    internalId: "test-l9",
    testId: "L9",
    testName: "Floor – Hammer Rebound",
    testScope: "Local",
    linkedElementTypes: "Floor",
    linkedElementTypesArray: ["Floor"],
    engineType: "STATIC",
    ruleKey: "FLOOR_HAMMER",
    isActive: true
  },
  {
    internalId: "test-l10",
    testId: "L10",
    testName: "Floor – UPV",
    testScope: "Local",
    linkedElementTypes: "Floor",
    linkedElementTypesArray: ["Floor"],
    engineType: "STATIC",
    ruleKey: "FLOOR_UPV",
    isActive: true
  }
]