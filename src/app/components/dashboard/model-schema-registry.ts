// ============================================================================
// UNIVERSAL MODEL SCHEMA REGISTRY
// Schema-driven approach: Add new models here without touching UI code
// ============================================================================

import { EvaluationSchema, EvaluationModelType } from "./evaluation-models"

export const MODEL_SCHEMAS: Record<EvaluationModelType, EvaluationSchema> = {
  STATIC_LIMIT: {
    model: "STATIC_LIMIT",
    displayName: "Static Limit",
    description: "Fixed threshold with multiplier-based severity calculation",
    parameters: [
      {
        key: "baseLimit",
        label: "Base Limit",
        type: "number",
        required: true,
        min: 0,
        placeholder: "e.g., 10",
        helperText: "Numeric threshold for evaluation"
      },
      {
        key: "unit",
        label: "Unit",
        type: "text",
        defaultValue: "mm",
        readOnly: true,
        helperText: "Unit is auto-derived from test configuration"
      },
      {
        key: "redMultiplier",
        label: "Red Multiplier",
        type: "number",
        required: true,
        min: 1.01,
        step: 0.1,
        defaultValue: 2.0,
        placeholder: "e.g., 2.0",
        helperText: "Multiplier must be > 1.0"
      }
    ]
  },

  DIRECTION_BASED: {
    model: "DIRECTION_BASED",
    displayName: "Direction Based",
    description: "Different limits based on measurement direction",
    parameters: [
      {
        key: "enabled",
        label: "Enable Direction-Based Evaluation",
        type: "toggle",
        defaultValue: true,
        helperText: "Apply different limits based on measurement direction"
      },
      {
        key: "directionALabel",
        label: "Direction A Label",
        type: "text",
        required: true,
        defaultValue: "Cross Aisle",
        placeholder: "e.g., Cross Aisle"
      },
      {
        key: "directionALimit",
        label: "Direction A Limit",
        type: "number",
        required: true,
        min: 0,
        placeholder: "e.g., 10"
      },
      {
        key: "directionBLabel",
        label: "Direction B Label",
        type: "text",
        required: true,
        defaultValue: "Down Aisle",
        placeholder: "e.g., Down Aisle"
      },
      {
        key: "directionBLimit",
        label: "Direction B Limit",
        type: "number",
        required: true,
        min: 0,
        placeholder: "e.g., 15"
      },
      {
        key: "redMultiplier",
        label: "Red Multiplier",
        type: "number",
        required: true,
        min: 1.01,
        step: 0.1,
        defaultValue: 2.0,
        placeholder: "e.g., 2.0"
      }
    ]
  },

  SCALED: {
    model: "SCALED",
    displayName: "Scaled (Pro-rata)",
    description: "Scale limits based on reference length",
    parameters: [
      {
        key: "baseLimit",
        label: "Base Limit",
        type: "number",
        required: true,
        min: 0,
        placeholder: "e.g., 10"
      },
      {
        key: "referenceLength",
        label: "Reference Length",
        type: "number",
        required: true,
        min: 1,
        defaultValue: 1000,
        placeholder: "e.g., 1000"
      },
      {
        key: "enableProRata",
        label: "Enable Pro-rata Scaling",
        type: "toggle",
        defaultValue: true,
        helperText: "Scale limit based on measured length"
      },
      {
        key: "redMultiplier",
        label: "Red Multiplier",
        type: "number",
        required: true,
        min: 1.01,
        step: 0.1,
        defaultValue: 2.0,
        placeholder: "e.g., 2.0"
      }
    ]
  },

  RATIO: {
    model: "RATIO",
    displayName: "Ratio / Multiplier",
    description: "Apply ratio-based calculations",
    parameters: [
      {
        key: "baseLimit",
        label: "Base Limit",
        type: "number",
        required: true,
        min: 0,
        placeholder: "e.g., 10"
      },
      {
        key: "ratioMultiplier",
        label: "Ratio Multiplier",
        type: "number",
        required: true,
        min: 0,
        step: 0.1,
        defaultValue: 1.0,
        placeholder: "e.g., 1.0"
      },
      {
        key: "redMultiplier",
        label: "Red Multiplier",
        type: "number",
        required: true,
        min: 1.01,
        step: 0.1,
        defaultValue: 2.0,
        placeholder: "e.g., 2.0"
      }
    ]
  },

  DUAL_PARAMETER: {
    model: "DUAL_PARAMETER",
    displayName: "Dual Parameter",
    description: "Evaluate multiple parameters simultaneously",
    parameters: [
      {
        key: "paramALabel",
        label: "Parameter A Label",
        type: "text",
        required: true,
        defaultValue: "Displacement",
        placeholder: "e.g., Displacement"
      },
      {
        key: "paramALimit",
        label: "Parameter A Limit",
        type: "number",
        required: true,
        min: 0,
        placeholder: "e.g., 10"
      },
      {
        key: "paramBLabel",
        label: "Parameter B Label",
        type: "text",
        required: true,
        defaultValue: "Rotation",
        placeholder: "e.g., Rotation"
      },
      {
        key: "paramBLimit",
        label: "Parameter B Limit",
        type: "number",
        required: true,
        min: 0,
        placeholder: "e.g., 5"
      },
      {
        key: "redMultiplier",
        label: "Red Multiplier",
        type: "number",
        required: true,
        min: 1.01,
        step: 0.1,
        defaultValue: 2.0,
        placeholder: "e.g., 2.0"
      }
    ]
  },

  VISUAL: {
    model: "VISUAL",
    displayName: "Visual Classification",
    description: "Severity based on visual inspection criteria",
    parameters: [
      {
        key: "levels",
        label: "Severity Levels",
        type: "list",
        defaultValue: [
          { id: "1", label: "No Damage", description: "", color: "#22C55E" },
          { id: "2", label: "Minor Damage", description: "", color: "#FBBF24" },
          { id: "3", label: "Major Damage", description: "", color: "#EF4444" }
        ],
        helperText: "No numeric thresholds. Severity is assigned based on visual inspection criteria."
      }
    ]
  },

  CUSTOM: {
    model: "CUSTOM",
    displayName: "Custom Formula",
    description: "Define custom calculation formula",
    parameters: [
      {
        key: "formula",
        label: "Custom Formula",
        type: "text",
        required: true,
        placeholder: "e.g., (A × B) / C",
        helperText: "Define a custom calculation formula"
      },
      {
        key: "redMultiplier",
        label: "Red Multiplier",
        type: "number",
        required: true,
        min: 1.01,
        step: 0.1,
        defaultValue: 2.0,
        placeholder: "e.g., 2.0"
      }
    ]
  }
}

/**
 * Get default parameter values for a given model
 */
export function getDefaultParameters(modelType: EvaluationModelType): Record<string, any> {
  const schema = MODEL_SCHEMAS[modelType]
  const defaults: Record<string, any> = {}

  schema.parameters.forEach(param => {
    if (param.defaultValue !== undefined) {
      defaults[param.key] = param.defaultValue
    } else if (param.type === "number") {
      defaults[param.key] = ""
    } else if (param.type === "text") {
      defaults[param.key] = ""
    } else if (param.type === "toggle") {
      defaults[param.key] = false
    } else if (param.type === "list") {
      defaults[param.key] = []
    }
  })

  return defaults
}
