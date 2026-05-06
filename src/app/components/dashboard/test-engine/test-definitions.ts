import type { GlobalTestDefinition } from './types';

/**
 * G1 - Overall Upright Plumbness
 * 
 * Measures vertical alignment deviation of rack uprights.
 * Evaluation: Calculated as (Δ / Height), compared against EN limit.
 * Worst upright governs overall result.
 * 
 * Standard: EN 15635:2008
 * Clause: 9.7.3
 */
export const G1_GLOBAL_PLUMBNESS: GlobalTestDefinition = {
  code: "G1",
  name: "Overall Upright Plumbness",
  scope: "Global",
  standardReference: "EN 15635:2008+A1:2011",
  clauseReference: "9.7.3",
  description: "Measurement of vertical alignment and plumbness across entire rack system. Worst upright governs.",
  
  parameters: [
    {
      id: "upright_tilt",
      label: "Upright Tilt (Δ)",
      unit: "mm",
      inputType: "number",
      thresholdSource: "config",
      thresholdValue: 10,
      deviationFormula: "(measured / threshold - 1) * 100",
      resultLogic: {
        passCondition: "measured <= threshold",
        borderlineCondition: "measured / threshold <= 1.1",
        failFirst: false,
      },
      description: "Measured horizontal deviation from plumb at top of upright",
    },
    {
      id: "vertical_deflection",
      label: "Vertical Deflection",
      unit: "mm",
      inputType: "number",
      thresholdSource: "config",
      thresholdValue: 5,
      deviationFormula: "(measured / threshold - 1) * 100",
      resultLogic: {
        passCondition: "measured <= threshold",
        borderlineCondition: "measured / threshold <= 1.1",
        failFirst: false,
      },
      description: "Vertical sag or compression of upright under load",
    },
    {
      id: "beam_load_capacity",
      label: "Beam Load Capacity Reduction",
      unit: "%",
      inputType: "number",
      thresholdSource: "config",
      thresholdValue: 15,
      deviationFormula: "(measured / threshold - 1) * 100",
      resultLogic: {
        passCondition: "measured <= threshold",
        borderlineCondition: "measured / threshold <= 1.1",
        failFirst: false,
      },
      description: "Percentage reduction in safe working load due to plumbness deviation",
    },
  ],
  
  overallLogic: {
    aggregationRule: "anyFail",
    failIfAnyParameterFails: true,
    borderlineIfAnyBorderline: true,
  },
  
  version: "1.0",
};

/**
 * L1 - Local Bend Test
 * 
 * Measures local deflection at damaged sections.
 * Evaluation: Simple threshold comparison - Measured ≤ Allowable Limit.
 * Worst direction governs overall result.
 * 
 * Allowable limit calculated from span: Allowable = Span / Ratio
 * Typical ratio = 200 for structural members (EN 15635)
 * 
 * Standard: EN 15635:2008
 * Clause: 9.7.1
 */
export const L1_LOCAL_BEND: GlobalTestDefinition = {
  code: "L1",
  name: "Local Bend Test",
  scope: "Local",
  standardReference: "EN 15635:2008+A1:2011",
  clauseReference: "9.7.1",
  description: "Local deflection measurement at damaged section. Limit based on component type and span (Span/200). Worst direction governs.",
  
  parameters: [
    {
      id: "cross_aisle",
      label: "Cross-Aisle",
      unit: "mm",
      inputType: "number",
      thresholdSource: "formula",
      thresholdFormula: "span_cross / 200",
      deviationFormula: "(measured / threshold - 1) * 100",
      resultLogic: {
        passCondition: "measured <= threshold",
        borderlineCondition: "measured / threshold <= 1.1",
        failFirst: false,
      },
      description: "Deflection measured perpendicular to rack run. Limit = Span/200",
    },
    {
      id: "down_aisle",
      label: "Down-Aisle",
      unit: "mm",
      inputType: "number",
      thresholdSource: "formula",
      thresholdFormula: "span_down / 200",
      deviationFormula: "(measured / threshold - 1) * 100",
      resultLogic: {
        passCondition: "measured <= threshold",
        borderlineCondition: "measured / threshold <= 1.1",
        failFirst: false,
      },
      description: "Deflection measured parallel to rack run. Limit = Span/200",
    },
  ],
  
  overallLogic: {
    aggregationRule: "anyFail",
    failIfAnyParameterFails: true,
    borderlineIfAnyBorderline: true,
  },
  
  version: "1.0",
};

// ============================================
// TEST REGISTRY
// ============================================

/**
 * Master registry of all global tests
 */
export const TEST_REGISTRY: Record<string, GlobalTestDefinition> = {
  G1: G1_GLOBAL_PLUMBNESS,
  L1: L1_LOCAL_BEND,
};

/**
 * Get test definition by code
 */
export function getTestDefinition(testCode: string): GlobalTestDefinition | undefined {
  return TEST_REGISTRY[testCode];
}

/**
 * Get all test codes
 */
export function getAllTestCodes(): string[] {
  return Object.keys(TEST_REGISTRY);
}

/**
 * Check if test code exists
 */
export function testExists(testCode: string): boolean {
  return testCode in TEST_REGISTRY;
}