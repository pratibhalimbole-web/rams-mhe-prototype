/**
 * IRDS Test Master - Complete Inventory
 * 
 * This is the SINGLE SOURCE OF TRUTH for all test types in IRDS.
 * Total: 14 tests across 3 scopes (Local, Floor, Global)
 */

export interface TestMasterEntry {
  code: string;
  name: string;
  scope: "Local" | "Global";
  category?: "Local" | "Floor" | "Global";
  description?: string;
}

/**
 * Complete IRDS Test Inventory - 14 Tests
 * 
 * LOCAL (7):
 * - L1: Bend
 * - L2: Dent  
 * - L3: Splice
 * - L4: Thickness Verification
 * - L5: Corrosion
 * - L6: Material Strength Verification
 * - L7: Surface Coating Thickness
 * 
 * FLOOR (2):
 * - F1: Floor Rebound Hammer
 * - F2: Floor UPV
 * 
 * GLOBAL (5):
 * - G1: Overall Upright Plumbness
 * - G2: Rack Run Straightness
 * - G3: System Lateral Sway
 * - G4: Floor Flatness at Rack Base
 * - G5: Baseplate Settlement
 */
export const TEST_MASTER: TestMasterEntry[] = [
  // LOCAL TESTS (7)
  {
    code: "L1",
    name: "Bend",
    scope: "Local",
    category: "Local",
    description: "Visual and measurement assessment of bending deformation in rack components",
  },
  {
    code: "L2",
    name: "Dent",
    scope: "Local",
    category: "Local",
    description: "Detection and measurement of impact-induced dents in structural members",
  },
  {
    code: "L3",
    name: "Splice",
    scope: "Local",
    category: "Local",
    description: "Inspection of splice connections and joints in upright sections",
  },
  {
    code: "L4",
    name: "Thickness Verification",
    scope: "Local",
    category: "Local",
    description: "Ultrasonic measurement of material thickness for corrosion assessment",
  },
  {
    code: "L5",
    name: "Corrosion",
    scope: "Local",
    category: "Local",
    description: "Visual and depth measurement of corrosion damage on structural elements",
  },
  {
    code: "L6",
    name: "Material Strength Verification",
    scope: "Local",
    category: "Local",
    description: "Verification of material strength through hardness or tensile testing",
  },
  {
    code: "L7",
    name: "Surface Coating Thickness",
    scope: "Local",
    category: "Local",
    description: "Measurement of protective coating thickness using electromagnetic gauges",
  },

  // FLOOR TESTS (2)
  {
    code: "F1",
    name: "Floor Rebound Hammer",
    scope: "Local",
    category: "Floor",
    description: "Rebound hammer test to assess concrete floor surface strength",
  },
  {
    code: "F2",
    name: "Floor UPV",
    scope: "Local",
    category: "Floor",
    description: "Ultrasonic Pulse Velocity test for concrete floor integrity assessment",
  },

  // GLOBAL TESTS (5)
  {
    code: "G1",
    name: "Overall Upright Plumbness",
    scope: "Global",
    category: "Global",
    description: "Measurement of vertical alignment and plumbness across entire rack system",
  },
  {
    code: "G2",
    name: "Rack Run Straightness",
    scope: "Global",
    category: "Global",
    description: "Assessment of linear alignment along rack runs",
  },
  {
    code: "G3",
    name: "System Lateral Sway",
    scope: "Global",
    category: "Global",
    description: "Measurement of lateral displacement under operational conditions",
  },
  {
    code: "G4",
    name: "Floor Flatness at Rack Base",
    scope: "Global",
    category: "Global",
    description: "Floor levelness measurement at rack baseplate locations",
  },
  {
    code: "G5",
    name: "Baseplate Settlement",
    scope: "Global",
    category: "Global",
    description: "Detection and measurement of baseplate settlement over time",
  },
];

/**
 * Get test master entry by code
 */
export function getTestMasterEntry(code: string): TestMasterEntry | undefined {
  return TEST_MASTER.find(t => t.code === code);
}

/**
 * Get all test codes
 */
export function getAllTestCodes(): string[] {
  return TEST_MASTER.map(t => t.code);
}

/**
 * Get tests by scope
 */
export function getTestsByScope(scope: "Local" | "Global"): TestMasterEntry[] {
  return TEST_MASTER.filter(t => t.scope === scope);
}

/**
 * Get tests by category
 */
export function getTestsByCategory(category: "Local" | "Floor" | "Global"): TestMasterEntry[] {
  return TEST_MASTER.filter(t => t.category === category);
}

/**
 * Check if test code exists
 */
export function isValidTestCode(code: string): boolean {
  return TEST_MASTER.some(t => t.code === code);
}

/**
 * Get test count by scope
 */
export function getTestCountByScope(): Record<string, number> {
  return {
    Local: TEST_MASTER.filter(t => t.scope === "Local").length,
    Global: TEST_MASTER.filter(t => t.scope === "Global").length,
  };
}

/**
 * Get test count by category
 */
export function getTestCountByCategory(): Record<string, number> {
  return {
    Local: TEST_MASTER.filter(t => t.category === "Local").length,
    Floor: TEST_MASTER.filter(t => t.category === "Floor").length,
    Global: TEST_MASTER.filter(t => t.category === "Global").length,
  };
}
