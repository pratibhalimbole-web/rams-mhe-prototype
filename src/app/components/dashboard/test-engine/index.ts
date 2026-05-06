/**
 * Global Test Engine - Public API
 * 
 * Config-driven test execution for all Global Tests (G1-G20+).
 * No hardcoded test logic - fully scalable and future-proof.
 * 
 * @example
 * ```typescript
 * import { executeTest, getTestDefinition } from './test-engine';
 * 
 * const definition = getTestDefinition('G1');
 * const result = executeTest(definition!, {
 *   testCode: 'G1',
 *   measurements: [
 *     { parameterId: 'upright_tilt', measuredValue: 1.2 },
 *     { parameterId: 'vertical_deflection', measuredValue: 3.5 },
 *   ]
 * });
 * ```
 */

// Export types
export type {
  GlobalTestDefinition,
  TestParameter,
  ResultLogic,
  OverallLogicConfig,
  TestExecutionInput,
  TestExecutionResult,
  ParameterResult,
  ParameterMeasurement,
  MeasurementResult,
  OverallResult,
  AcceptabilityStatus,
  TestScope,
  AggregationRule,
} from './types';

// Export test master
export type { TestMasterEntry } from './test-master';
export {
  TEST_MASTER,
  getTestMasterEntry,
  getAllTestCodes,
  getTestsByScope,
  getTestsByCategory,
  isValidTestCode,
  getTestCountByScope,
  getTestCountByCategory,
} from './test-master';

// Export execution engine
export {
  executeTest,
  validateTestInput,
} from './execution-engine';

// Export formula engine utilities
export {
  evaluateFormula,
  evaluateCondition,
  validateFormula,
  getAvailableVariables,
  FORMULA_TEMPLATES,
  CONDITION_TEMPLATES,
} from './formula-engine';

// Export test registry
export {
  TEST_REGISTRY,
  getTestDefinition,
  getAllTestCodes as getAllDefinedTestCodes,
  testExists,
  G1_GLOBAL_PLUMBNESS,
  L1_LOCAL_BEND,
} from './test-definitions';

/**
 * Quick helper to execute a test by code
 */
export function executeTestByCode(
  testCode: string,
  measurements: Array<{ parameterId: string; measuredValue: number; threshold?: number }>,
  executedBy?: string
) {
  const definition = require('./test-definitions').getTestDefinition(testCode);
  
  if (!definition) {
    throw new Error(`Test definition not found for code: ${testCode}`);
  }

  const { executeTest } = require('./execution-engine');
  
  return executeTest(definition, {
    testCode,
    measurements,
    executedBy,
  });
}