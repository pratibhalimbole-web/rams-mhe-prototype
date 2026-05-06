/**
 * Global Test Engine - Execution Engine
 * 
 * Generic test execution that works for ALL global tests (G1-G20+).
 * No hardcoded test logic - everything driven by configuration.
 */

import type {
  GlobalTestDefinition,
  TestExecutionInput,
  TestExecutionResult,
  ParameterResult,
  MeasurementResult,
  OverallResult,
  AcceptabilityStatus,
  ResultLogic,
} from './types';
import { evaluateFormula, evaluateCondition } from './formula-engine';

/**
 * Execute a test based on its definition and measurements
 * 
 * This is the CORE ENGINE - it works for ANY test definition.
 * 
 * @param definition - Test configuration (from test-definitions.ts)
 * @param input - Measurement data
 * @returns Complete test execution result
 */
export function executeTest(
  definition: GlobalTestDefinition,
  input: TestExecutionInput
): TestExecutionResult {
  // Create measurement lookup map
  const measurementMap = new Map(
    input.measurements.map(m => [m.parameterId, m])
  );

  // Evaluate each parameter
  const parameterResults: ParameterResult[] = definition.parameters.map(param => {
    const measurement = measurementMap.get(param.id);
    
    if (!measurement) {
      throw new Error(`Missing measurement for parameter: ${param.id}`);
    }

    return evaluateParameter(param, measurement.measuredValue, measurement.threshold, input.context);
  });

  // Calculate overall result
  const overallResult = calculateOverallResult(
    parameterResults,
    definition.overallLogic
  );

  // Calculate acceptability
  const acceptability = calculateAcceptability(parameterResults, overallResult);

  // Calculate statistics
  const maxDeviation = Math.max(
    ...parameterResults.map(r => Math.abs(r.deviation))
  );
  const failedCount = parameterResults.filter(r => r.result === "Fail").length;

  return {
    testCode: definition.code,
    testName: definition.name,
    overallResult,
    acceptability,
    parameterResults,
    maxDeviation,
    failedCount,
    totalCount: parameterResults.length,
    executedAt: new Date().toISOString(),
    executedBy: input.executedBy,
  };
}

/**
 * Evaluate a single parameter
 */
function evaluateParameter(
  param: GlobalTestDefinition['parameters'][0],
  measuredValue: number,
  thresholdOverride?: number,
  context?: Record<string, number>
): ParameterResult {
  // Determine threshold
  let threshold: number;
  
  if (thresholdOverride !== undefined) {
    // Use explicit override if provided
    threshold = thresholdOverride;
  } else if (param.thresholdSource === 'formula' && param.thresholdFormula) {
    // Calculate threshold from formula using context
    threshold = evaluateFormula(param.thresholdFormula, {
      measured: measuredValue,
      threshold: 0, // Placeholder
      ...(context || {}),
    });
  } else {
    // Use static threshold value
    threshold = param.thresholdValue ?? 0;
  }

  // Calculate deviation using formula
  const deviation = evaluateFormula(param.deviationFormula, {
    measured: measuredValue,
    threshold,
    ...(context || {}),
  });

  // Determine result (Pass/Fail/Borderline)
  const result = evaluateResultLogic(
    param.resultLogic,
    measuredValue,
    threshold
  );

  return {
    parameterId: param.id,
    parameterLabel: param.label,
    measuredValue,
    threshold,
    unit: param.unit,
    deviation,
    result,
  };
}

/**
 * Evaluate result logic to determine Pass/Fail/Borderline
 */
function evaluateResultLogic(
  logic: ResultLogic,
  measuredValue: number,
  threshold: number
): MeasurementResult {
  const context = { measured: measuredValue, threshold };

  // Check pass condition
  const passes = evaluateCondition(logic.passCondition, context);
  if (passes) {
    return "Pass";
  }

  // Check borderline condition (if exists)
  if (logic.borderlineCondition) {
    const isBorderline = evaluateCondition(logic.borderlineCondition, context);
    if (isBorderline) {
      return "Borderline";
    }
  }

  // Otherwise, it's a fail
  return "Fail";
}

/**
 * Calculate overall test result based on aggregation rules
 */
function calculateOverallResult(
  parameterResults: ParameterResult[],
  overallLogic: GlobalTestDefinition['overallLogic']
): OverallResult {
  const { aggregationRule, failIfAnyParameterFails, borderlineIfAnyBorderline } = overallLogic;

  // Check for any failures
  const hasFail = parameterResults.some(r => r.result === "Fail");
  const hasBorderline = parameterResults.some(r => r.result === "Borderline");

  // Apply fail-fast logic
  if (failIfAnyParameterFails && hasFail) {
    return "Fail";
  }

  // Apply aggregation rules
  switch (aggregationRule) {
    case "anyFail":
      if (hasFail) return "Fail";
      if (borderlineIfAnyBorderline && hasBorderline) return "Borderline";
      return "Pass";

    case "majorityFail": {
      const failCount = parameterResults.filter(r => r.result === "Fail").length;
      const majority = Math.ceil(parameterResults.length / 2);
      
      if (failCount >= majority) return "Fail";
      if (hasBorderline) return "Borderline";
      return "Pass";
    }

    case "maxDeviation": {
      // Use maximum deviation to determine result
      const maxDev = Math.max(...parameterResults.map(r => Math.abs(r.deviation)));
      
      if (maxDev > 20) return "Fail";
      if (maxDev > 10) return "Borderline";
      return "Pass";
    }

    case "weighted": {
      // Weighted scoring (if weights are defined)
      const totalWeight = parameterResults.reduce((sum, r) => {
        const param = parameterResults.find(p => p.parameterId === r.parameterId);
        return sum + (param ? 1 : 1); // Default weight = 1
      }, 0);

      const failWeight = parameterResults
        .filter(r => r.result === "Fail")
        .reduce((sum) => sum + 1, 0);

      if (failWeight / totalWeight > 0.5) return "Fail";
      if (hasBorderline) return "Borderline";
      return "Pass";
    }

    default:
      // Default: any fail = overall fail
      if (hasFail) return "Fail";
      if (hasBorderline) return "Borderline";
      return "Pass";
  }
}

/**
 * Calculate acceptability status
 */
function calculateAcceptability(
  parameterResults: ParameterResult[],
  overallResult: OverallResult
): AcceptabilityStatus {
  // Simple mapping for now
  if (overallResult === "Pass") {
    return "Acceptable";
  } else if (overallResult === "Borderline") {
    return "Borderline";
  } else {
    return "Not Acceptable";
  }
}

/**
 * Validate test execution input
 */
export function validateTestInput(
  definition: GlobalTestDefinition,
  input: TestExecutionInput
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check test code matches
  if (input.testCode !== definition.code) {
    errors.push(`Test code mismatch: expected ${definition.code}, got ${input.testCode}`);
  }

  // Check all required parameters have measurements
  const measurementIds = new Set(input.measurements.map(m => m.parameterId));
  const requiredIds = new Set(definition.parameters.map(p => p.id));

  for (const id of requiredIds) {
    if (!measurementIds.has(id)) {
      errors.push(`Missing measurement for parameter: ${id}`);
    }
  }

  // Check for extra measurements
  for (const id of measurementIds) {
    if (!requiredIds.has(id)) {
      errors.push(`Unknown parameter: ${id}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
