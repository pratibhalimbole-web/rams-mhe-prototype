export type EngineType = "STATIC" | "FORMULA"

export type RuleDefinition = {
  engineType: EngineType
  elementRules?: Record<string, "BASE_LIMIT" | "DUAL_AXIS" | "FORMULA">
  description: string
  formulaContent?: {
    title: string
    variables?: string[]
    formula?: string
    severityLevels?: Array<{
      icon: string
      label: "Green" | "Amber" | "Red"
      condition: string
    }>
    escalation?: string
    policyNote?: string
  }
}

export const RuleRegistry: Record<string, RuleDefinition> = {
  // ============================================================================
  // GLOBAL TESTS
  // ============================================================================
  
  PLUMBNESS: {
    engineType: "FORMULA",
    description: "Vertical deviation from true plumb position",
  },

  CROSS_AISLE_PLUMBNESS: {
    engineType: "FORMULA",
    description: "Out-of-vertical deviation in cross-aisle direction",
  },

  RACK_RUN_STRAIGHTNESS: {
    engineType: "FORMULA",
    description: "Horizontal alignment verification along rack runs",
  },

  SYSTEM_LATERAL_SWAY: {
    engineType: "FORMULA",
    description: "Lateral displacement under load conditions",
  },

  FLOOR_FLATNESS: {
    engineType: "FORMULA",
    description: "Surface levelness and flatness verification",
  },

  BASEPLATE_SETTLEMENT: {
    engineType: "FORMULA",
    description: "Foundation settlement baseline measurement",
  },

  // ============================================================================
  // LOCAL TESTS - COMPONENT
  // ============================================================================

  BEND: {
    engineType: "STATIC",
    description: "Geometric deformation tolerance",
    elementRules: {
      Upright: "DUAL_AXIS",
      Beam: "FORMULA",
      default: "BASE_LIMIT",
    },
  },

  DENT: {
    engineType: "FORMULA",
    description: "Surface depression severity evaluated using wall thickness ratio.",
    formulaContent: {
      title: "Component Dent Severity Model",
      variables: ["Dent Depth (d)", "Nominal Wall Thickness (t)"],
      severityLevels: [
        {
          icon: "🟢",
          label: "Green",
          condition: "d ≤ 1.0 × t",
        },
        {
          icon: "🟠",
          label: "Amber",
          condition: "1.0 × t < d < 2.0 × t",
        },
        {
          icon: "🔴",
          label: "Red",
          condition: "d ≥ 2.0 × t",
        },
      ],
      escalation:
        "If both Dent and Bend exist, Final Severity = Worst of (Dent, Bend). Worst condition governs.",
      policyNote:
        "Thickness is automatically derived from Section Library, OEM design data, or field reference measurement.",
    },
  },

  SPLICE: {
    engineType: "STATIC",
    description: "Connection integrity assessment",
    elementRules: {
      default: "BASE_LIMIT",
    },
  },

  THICKNESS: {
    engineType: "FORMULA",
    description: "Structural thickness verification",
    formulaContent: {
      title: "Structural Thickness Loss Model",
      variables: ["Original Thickness (t₀)", "Measured Thickness (tₘ)"],
      formula: "Loss % = ((t₀ − tₘ) / t₀) × 100",
      severityLevels: [
        {
          icon: "🟢",
          label: "Green",
          condition: "Loss ≤ 5%",
        },
        {
          icon: "🟠",
          label: "Amber",
          condition: "5% < Loss ≤ 10%",
        },
        {
          icon: "🔴",
          label: "Red",
          condition: "Loss > 10%",
        },
      ],
      escalation:
        "If thickness loss exceeds 10% at structural connections (beam-upright junction, baseplate anchor), immediate red-flag escalation is required.",
      policyNote:
        "Thresholds are fixed under IRDS structural engineering framework. Manual configuration is not permitted.",
    },
  },

  CORROSION: {
    engineType: "FORMULA",
    description: "Section loss percentage evaluation",
    formulaContent: {
      title: "Corrosion Section Loss Model",
      variables: ["Original Section Area (A₀)", "Remaining Section Area (Aᵣ)"],
      formula: "Loss % = ((A₀ − Aᵣ) / A₀) × 100",
      severityLevels: [
        {
          icon: "🟢",
          label: "Green",
          condition: "Loss ≤ 10%",
        },
        {
          icon: "🟠",
          label: "Amber",
          condition: "10% < Loss ≤ 20%",
        },
        {
          icon: "🔴",
          label: "Red",
          condition: "Loss > 20%",
        },
      ],
      escalation:
        "Severe corrosion at load-bearing connections requires immediate structural assessment.",
      policyNote:
        "Corrosion thresholds are system-defined based on IRDS structural safety standards.",
    },
  },

  MATERIAL_STRENGTH: {
    engineType: "STATIC",
    description: "Material property verification",
    elementRules: {
      default: "BASE_LIMIT",
    },
  },

  SURFACE_COATING: {
    engineType: "STATIC",
    description: "Protective layer condition assessment",
    elementRules: {
      default: "BASE_LIMIT",
    },
  },

  // ============================================================================
  // LOCAL TESTS - FLOOR
  // ============================================================================

  FLOOR_GPR: {
    engineType: "STATIC",
    description: "Ground penetrating radar evaluation",
    elementRules: {
      default: "BASE_LIMIT",
    },
  },

  FLOOR_HAMMER: {
    engineType: "STATIC",
    description: "Concrete rebound hardness test",
    elementRules: {
      default: "BASE_LIMIT",
    },
  },

  FLOOR_UPV: {
    engineType: "STATIC",
    description: "Ultrasonic pulse velocity measurement",
    elementRules: {
      default: "BASE_LIMIT",
    },
  },
}