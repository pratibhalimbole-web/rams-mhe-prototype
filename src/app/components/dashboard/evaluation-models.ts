// ============================================================================
// UNIVERSAL EVALUATION MODEL TYPE SYSTEM
// ============================================================================

export type EvaluationModelType =
  | "STATIC_LIMIT"
  | "DIRECTION_BASED"
  | "SCALED"
  | "RATIO"
  | "DUAL_PARAMETER"
  | "VISUAL"
  | "CUSTOM"

export type ParameterType = "number" | "text" | "toggle" | "color" | "list"

export interface ParameterSchema {
  key: string
  label: string
  type: ParameterType
  required?: boolean
  min?: number
  max?: number
  step?: number
  defaultValue?: any
  helperText?: string
  placeholder?: string
  readOnly?: boolean
}

export interface EvaluationSchema {
  model: EvaluationModelType
  displayName: string
  parameters: ParameterSchema[]
  description?: string
}
