/**
 * Test execution input
 */
export interface TestExecutionInput {
  testCode: string;
  measurements: ParameterMeasurement[];
  executedBy?: string;
  notes?: string;
  /** Additional context for formula evaluation (e.g., span, height, diameter) */
  context?: Record<string, number>;
}