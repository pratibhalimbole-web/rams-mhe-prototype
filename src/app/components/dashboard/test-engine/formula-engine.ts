/**
 * Global Test Engine - Formula Evaluation
 * 
 * Safe mathematical expression evaluator using mathjs.
 * Prevents arbitrary code execution while allowing dynamic formulas.
 */

import { evaluate } from 'mathjs';

/**
 * Context for formula evaluation
 */
export interface FormulaContext {
  measured: number;
  threshold: number;
  [key: string]: number;
}

/**
 * Safely evaluate a mathematical formula with given context
 * 
 * @param formula - Mathematical expression (e.g., "(measured / threshold - 1) * 100")
 * @param context - Variables available in the formula
 * @returns Computed result
 * 
 * @example
 * evaluateFormula("(measured / threshold - 1) * 100", { measured: 12, threshold: 10 })
 * // Returns: 20
 */
export function evaluateFormula(
  formula: string,
  context: FormulaContext
): number {
  try {
    // Use mathjs for safe evaluation
    const result = evaluate(formula, context);
    
    // Ensure result is a number
    if (typeof result !== 'number' || !isFinite(result)) {
      console.error(`Formula evaluation returned invalid result: ${result}`);
      return 0;
    }
    
    return result;
  } catch (error) {
    console.error(`Formula evaluation error: ${error}`);
    console.error(`Formula: ${formula}`);
    console.error(`Context:`, context);
    return 0;
  }
}

/**
 * Evaluate a boolean condition (for result logic)
 * 
 * @param condition - Boolean expression (e.g., "measured <= threshold")
 * @param context - Variables available in the condition
 * @returns True if condition is met
 * 
 * @example
 * evaluateCondition("measured <= threshold", { measured: 8, threshold: 10 })
 * // Returns: true
 */
export function evaluateCondition(
  condition: string,
  context: FormulaContext
): boolean {
  try {
    const result = evaluate(condition, context);
    return Boolean(result);
  } catch (error) {
    console.error(`Condition evaluation error: ${error}`);
    console.error(`Condition: ${condition}`);
    console.error(`Context:`, context);
    return false;
  }
}

/**
 * Validate a formula syntax without executing it
 * 
 * @param formula - Formula to validate
 * @returns Object with validation result
 */
export function validateFormula(formula: string): {
  valid: boolean;
  error?: string;
} {
  try {
    // Try to parse with dummy values
    evaluate(formula, { measured: 10, threshold: 10 });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get available formula variables
 */
export function getAvailableVariables(): string[] {
  return ['measured', 'threshold'];
}

/**
 * Common formula templates for reuse
 */
export const FORMULA_TEMPLATES = {
  /** Percentage deviation from threshold */
  percentageDeviation: "(measured / threshold - 1) * 100",
  
  /** Absolute deviation */
  absoluteDeviation: "measured - threshold",
  
  /** Ratio to threshold */
  ratioToThreshold: "measured / threshold",
  
  /** Inverse ratio (for minimum thresholds) */
  inverseRatio: "threshold / measured",
  
  /** Percentage of threshold */
  percentageOfThreshold: "(measured / threshold) * 100",
};

/**
 * Common condition templates for result logic
 */
export const CONDITION_TEMPLATES = {
  /** Pass if measured is less than or equal to threshold */
  lessThanOrEqual: "measured <= threshold",
  
  /** Pass if measured is greater than or equal to threshold */
  greaterThanOrEqual: "measured >= threshold",
  
  /** Pass if within 10% of threshold */
  within10Percent: "abs(measured - threshold) / threshold <= 0.1",
  
  /** Borderline if within 10% over threshold */
  borderline10Percent: "measured / threshold <= 1.1",
};
