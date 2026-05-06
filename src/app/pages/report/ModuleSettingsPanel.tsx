/**
 * Module Settings Panel
 * 
 * Representation-driven configuration panel that dynamically shows relevant settings
 * based on the selected representation type (Table, Chart, Heatmap, Insights).
 * 
 * Flow: Representation Type → Data Mapping → Representation-Specific Settings
 * 
 * Features:
 * - Representation type is editable until saved
 * - Automatic dataset loading based on module type
 * - Field selection via dropdowns (like Asana/Notion chart builders)
 * - Dynamic configuration based on representation type
 * - Module-specific data filtering - each module only shows its own dataset fields
 * 
 * Module Data Architecture:
 * Each module type has its own specific dataset. When a module is selected,
 * only the data fields relevant to that module appear in the configuration dropdowns.
 * This prevents confusion and ensures users only configure modules with relevant data.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { Switch } from '@/app/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { cn } from '@/app/components/ui/utils';
import { toast } from 'sonner';
import { Check, ChevronDown, AlertCircle, BarChart3 } from 'lucide-react';
import { TextBlockEditor } from '@/app/components/report/TextBlockEditor';

interface ModuleSettingsPanelProps {
  selectedModuleId: string;
  module: any;
  onUpdateConfig: (updates: any) => void;
  sectionName?: string; // Section name for better context
}

// ============================================================================
// FIELD TYPE VALIDATION HELPERS
// ============================================================================

/**
 * Determines which field types are valid for X-axis based on chart type
 */
const getValidXAxisTypes = (chartType: string): string[] => {
  const typeMap: { [key: string]: string[] } = {
    'bar': ['string', 'date', 'category'],
    'line': ['date', 'string'], // Line charts prefer temporal/sequential data
    'pie': ['string', 'category'],
    'stacked-bar': ['string', 'date', 'category'],
    'area': ['date', 'string'],
  };
  
  return typeMap[chartType] || ['string', 'date', 'category'];
};

/**
 * Determines which field types are valid for Y-axis based on chart type
 * Y-axis typically requires numeric values for most chart types
 */
const getValidYAxisTypes = (chartType: string): string[] => {
  const typeMap: { [key: string]: string[] } = {
    'bar': ['number'],
    'line': ['number'],
    'pie': ['number'],
    'stacked-bar': ['number'],
    'area': ['number'],
  };
  
  return typeMap[chartType] || ['number'];
};

/**
 * Filters fields based on allowed types
 */
const filterFieldsByType = (
  fields: Array<{ id: string; name: string; type: string }>,
  allowedTypes: string[]
): Array<{ id: string; name: string; type: string }> => {
  return fields.filter(field => allowedTypes.includes(field.type));
};

/**
 * Validates if selected fields are compatible with chart type
 */
const validateChartFieldCompatibility = (
  chartType: string,
  xAxisField: string,
  yAxisField: string,
  availableFields: Array<{ id: string; name: string; type: string }>
): { isValid: boolean; errorMessage: string } => {
  if (!xAxisField || !yAxisField) {
    return {
      isValid: false,
      errorMessage: 'Please select both X-axis and Y-axis fields'
    };
  }
  
  const xField = availableFields.find(f => f.id === xAxisField);
  const yField = availableFields.find(f => f.id === yAxisField);
  
  if (!xField || !yField) {
    return {
      isValid: false,
      errorMessage: 'Selected fields are invalid'
    };
  }
  
  const validXTypes = getValidXAxisTypes(chartType);
  const validYTypes = getValidYAxisTypes(chartType);
  
  if (!validXTypes.includes(xField.type)) {
    return {
      isValid: false,
      errorMessage: `X-axis field "${xField.name}" (${xField.type}) is not compatible with ${chartType} chart. Expected: ${validXTypes.join(', ')}`
    };
  }
  
  if (!validYTypes.includes(yField.type)) {
    return {
      isValid: false,
      errorMessage: `Y-axis field "${yField.name}" (${yField.type}) must be numeric for ${chartType} chart`
    };
  }
  
  return { isValid: true, errorMessage: '' };
};

// Module-Specific Dataset Definitions
// Each module type has its own specific dataset with relevant fields
const MODULE_DATASETS: Record<string, {
  datasetName: string;
  fields: Array<{ id: string; name: string; type: string }>;
}> = {
  // EXECUTIVE MODULES
  'Executive Summary': {
    datasetName: 'Executive Summary Data',
    fields: [
      { id: 'summary_id', name: 'Summary ID', type: 'string' },
      { id: 'report_period', name: 'Report Period', type: 'date' },
      { id: 'total_inspections', name: 'Total Inspections', type: 'number' },
      { id: 'critical_findings', name: 'Critical Findings', type: 'number' },
      { id: 'compliance_score', name: 'Compliance Score', type: 'number' },
      { id: 'overall_status', name: 'Overall Status', type: 'string' },
    ],
  },
  'Key Risks': {
    datasetName: 'Risk Assessment Data',
    fields: [
      { id: 'risk_id', name: 'Risk ID', type: 'string' },
      { id: 'risk_category', name: 'Risk Category', type: 'string' },
      { id: 'severity', name: 'Severity', type: 'string' },
      { id: 'likelihood', name: 'Likelihood', type: 'string' },
      { id: 'risk_score', name: 'Risk Score', type: 'number' },
      { id: 'mitigation_status', name: 'Mitigation Status', type: 'string' },
      { id: 'zone', name: 'Zone', type: 'string' },
    ],
  },
  'Compliance Score': {
    datasetName: 'Compliance Metrics',
    fields: [
      { id: 'zone', name: 'Zone', type: 'string' },
      { id: 'compliance_percentage', name: 'Compliance %', type: 'number' },
      { id: 'passed_tests', name: 'Passed Tests', type: 'number' },
      { id: 'failed_tests', name: 'Failed Tests', type: 'number' },
      { id: 'period', name: 'Period', type: 'date' },
    ],
  },

  // INSPECTION MODULES
  'Visual Inspection': {
    datasetName: 'Visual Inspection Data',
    fields: [
      { id: 'inspection_id', name: 'Inspection ID', type: 'string' },
      { id: 'rack_id', name: 'Rack ID', type: 'string' },
      { id: 'zone', name: 'Zone', type: 'string' },
      { id: 'location', name: 'Location', type: 'string' },
      { id: 'inspector', name: 'Inspector', type: 'string' },
      { id: 'inspection_date', name: 'Inspection Date', type: 'date' },
      { id: 'status', name: 'Status', type: 'string' },
      { id: 'findings_count', name: 'Findings Count', type: 'number' },
    ],
  },
  'Findings Log': {
    datasetName: 'Inspection Findings Data',
    fields: [
      { id: 'finding_id', name: 'Finding ID', type: 'string' },
      { id: 'rack_id', name: 'Rack ID', type: 'string' },
      { id: 'zone', name: 'Zone', type: 'string' },
      { id: 'issue_type', name: 'Issue Type', type: 'string' },
      { id: 'severity', name: 'Severity', type: 'string' },
      { id: 'inspection_date', name: 'Inspection Date', type: 'date' },
      { id: 'status', name: 'Status', type: 'string' },
      { id: 'inspector', name: 'Inspector', type: 'string' },
    ],
  },
  'Photo Gallery': {
    datasetName: 'Inspection Media',
    fields: [
      { id: 'photo_id', name: 'Photo ID', type: 'string' },
      { id: 'rack_id', name: 'Rack ID', type: 'string' },
      { id: 'zone', name: 'Zone', type: 'string' },
      { id: 'photo_url', name: 'Photo URL', type: 'string' },
      { id: 'caption', name: 'Caption', type: 'string' },
      { id: 'timestamp', name: 'Timestamp', type: 'date' },
    ],
  },

  // ENGINEERING TEST MODULES
  'Load Test Results': {
    datasetName: 'Load Test Data',
    fields: [
      { id: 'test_id', name: 'Test ID', type: 'string' },
      { id: 'test_type', name: 'Test Type', type: 'string' },
      { id: 'zone', name: 'Zone', type: 'string' },
      { id: 'rack_id', name: 'Rack ID', type: 'string' },
      { id: 'load_capacity', name: 'Load Capacity', type: 'number' },
      { id: 'actual_load', name: 'Actual Load', type: 'number' },
      { id: 'test_result', name: 'Test Result', type: 'string' },
      { id: 'test_date', name: 'Test Date', type: 'date' },
    ],
  },
  'Material Analysis': {
    datasetName: 'Material Test Data',
    fields: [
      { id: 'analysis_id', name: 'Analysis ID', type: 'string' },
      { id: 'material_type', name: 'Material Type', type: 'string' },
      { id: 'test_method', name: 'Test Method', type: 'string' },
      { id: 'tensile_strength', name: 'Tensile Strength', type: 'number' },
      { id: 'corrosion_rating', name: 'Corrosion Rating', type: 'string' },
      { id: 'test_date', name: 'Test Date', type: 'date' },
    ],
  },

  // LIFECYCLE MODULES
  'Depreciation': {
    datasetName: 'Asset Depreciation Data',
    fields: [
      { id: 'asset_id', name: 'Asset ID', type: 'string' },
      { id: 'zone', name: 'Zone', type: 'string' },
      { id: 'purchase_date', name: 'Purchase Date', type: 'date' },
      { id: 'original_value', name: 'Original Value', type: 'number' },
      { id: 'current_value', name: 'Current Value', type: 'number' },
      { id: 'depreciation_rate', name: 'Depreciation Rate', type: 'number' },
      { id: 'estimated_lifespan', name: 'Estimated Lifespan', type: 'number' },
    ],
  },
  'Replacement Plan': {
    datasetName: 'Replacement Schedule',
    fields: [
      { id: 'plan_id', name: 'Plan ID', type: 'string' },
      { id: 'rack_id', name: 'Rack ID', type: 'string' },
      { id: 'zone', name: 'Zone', type: 'string' },
      { id: 'replacement_date', name: 'Replacement Date', type: 'date' },
      { id: 'priority', name: 'Priority', type: 'string' },
      { id: 'estimated_cost', name: 'Estimated Cost', type: 'number' },
      { id: 'status', name: 'Status', type: 'string' },
    ],
  },

  // INTELLIGENCE MODULES
  'AI Insight': {
    datasetName: 'AI Analysis Data',
    fields: [
      { id: 'insight_id', name: 'Insight ID', type: 'string' },
      { id: 'category', name: 'Category', type: 'string' },
      { id: 'confidence_score', name: 'Confidence Score', type: 'number' },
      { id: 'prediction', name: 'Prediction', type: 'string' },
      { id: 'generated_date', name: 'Generated Date', type: 'date' },
      { id: 'zone', name: 'Zone', type: 'string' },
    ],
  },
};

export function ModuleSettingsPanel({
  selectedModuleId,
  module,
  onUpdateConfig,
  sectionName,
}: ModuleSettingsPanelProps) {
  // Ref for scrollable content container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Local state for representation type (editable until saved)
  const [localRepresentationType, setLocalRepresentationType] = useState(
    module.representationType || 'table'
  );

  // Local state for page orientation (affects column limits)
  const [pageOrientation, setPageOrientation] = useState<'portrait' | 'landscape'>(
    module.config?.pageOrientation || 'portrait'
  );

  // SCROLL LOCK SYNCHRONIZATION: Reset scroll position when module changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedModuleId]); // Trigger when selected module changes

  const moduleConfig = module.config || {
    chartType: 'bar',
    // Data mapping fields
    categoryField: '',
    valueField: '',
    aggregationType: 'count',
    // Table fields
    columns: [],
    sortBy: '',
    pagination: true,
    // Heatmap fields
    xAxisField: '',
    yAxisField: '',
    // Insights fields
    insightType: 'kpi', // 'kpi' | 'kpi-grid' | 'key-observations' | 'trend-summary'
    metricSource: '',
    metricsSelection: [], // For kpi-grid
    maxKPIs: 4, // For kpi-grid
    observationSource: '',
    maxObservations: 5,
    trendMetric: '',
    timeInterval: 'quarter',
    // Page orientation
    pageOrientation: 'portrait',
    // Track if configuration has been saved
    isSaved: false,
  };

  // Get module-specific dataset based on module name
  const moduleDataset = MODULE_DATASETS[module.name];
  const availableFields = moduleDataset?.fields || [];

  // Column limits based on page orientation (for PDF export)
  const MAX_COLUMNS_PORTRAIT = 6;
  const MAX_COLUMNS_LANDSCAPE = 10;
  const maxColumns = pageOrientation === 'portrait' ? MAX_COLUMNS_PORTRAIT : MAX_COLUMNS_LANDSCAPE;

  // Check if selected columns exceed the limit
  const selectedColumnsCount = moduleConfig.columns?.length || 0;
  const columnsExceedLimit = selectedColumnsCount > maxColumns;

  const handleSaveConfiguration = () => {
    // Validate that required fields are configured
    let isValid = true;
    let errorMessage = '';

    if (localRepresentationType === 'table') {
      if (!moduleConfig.columns || moduleConfig.columns.length === 0) {
        isValid = false;
        errorMessage = 'Please select at least one column for the table';
      }
    } else if (localRepresentationType === 'chart') {
      const validation = validateChartFieldCompatibility(
        moduleConfig.chartType,
        moduleConfig.xAxisField,
        moduleConfig.yAxisField,
        availableFields
      );
      isValid = validation.isValid;
      errorMessage = validation.errorMessage;
    } else if (localRepresentationType === 'heatmap') {
      if (!moduleConfig.xAxisField || !moduleConfig.yAxisField || !moduleConfig.valueField) {
        isValid = false;
        errorMessage = 'Please select all required fields for heatmap';
      }
    } else if (localRepresentationType === 'insights') {
      const insightType = moduleConfig.insightType || 'kpi';
      if (insightType === 'kpi') {
        if (!moduleConfig.metricSource || !moduleConfig.aggregationType) {
          isValid = false;
          errorMessage = 'Please select metric source and aggregation type';
        }
      } else if (insightType === 'kpi-grid') {
        if (!moduleConfig.metricsSelection || moduleConfig.metricsSelection.length === 0) {
          isValid = false;
          errorMessage = 'Please select at least one metric for KPI grid';
        }
      } else if (insightType === 'key-observations') {
        if (!moduleConfig.observationSource) {
          isValid = false;
          errorMessage = 'Please select observation source dataset';
        }
      } else if (insightType === 'trend-summary') {
        if (!moduleConfig.trendMetric || !moduleConfig.timeInterval) {
          isValid = false;
          errorMessage = 'Please select trend metric and time interval';
        }
      }
    }

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    // Save the representation type AND all current config fields to the module
    // This ensures fields like xAxisField, yAxisField, chartType, etc. are persisted
    onUpdateConfig({ 
      ...moduleConfig, // Include ALL existing config fields
      representationType: localRepresentationType,
      isSaved: true,
    });
    toast.success("Configuration saved successfully");
  };

  const isConfigSaved = moduleConfig.isSaved;

  // ============================================================================
  // SPECIAL HANDLING: TEXT BLOCK
  // ============================================================================
  if (module.type === 'TextBlock') {
    return (
      <>
        {/* HEADER */}
        <div 
          className="px-6 py-4 border-b border-border bg-background shrink-0"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h3 
            className="font-semibold text-foreground"
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-semi-bold)',
            }}
          >
            Module Settings
          </h3>
          <p 
            className="text-muted-foreground mt-1"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
            }}
          >
            Module Type: Text Block
          </p>
        </div>

        {/* CONTENT */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-0"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* MODE SELECTOR */}
          <div className="space-y-3">
            <label 
              className="text-foreground font-medium"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Mode
            </label>
            <div className="flex gap-2 relative z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateConfig({ mode: 'static' });
                }}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg border transition-all cursor-pointer",
                  (moduleConfig.mode || 'static') === 'static'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/50"
                )}
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  borderRadius: 'var(--radius)',
                  borderColor: (moduleConfig.mode || 'static') === 'static' ? 'var(--primary)' : 'var(--border)',
                  pointerEvents: 'auto',
                }}
              >
                Static
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateConfig({ mode: 'dynamic' });
                }}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg border transition-all cursor-pointer",
                  moduleConfig.mode === 'dynamic'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/50"
                )}
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  borderRadius: 'var(--radius)',
                  borderColor: moduleConfig.mode === 'dynamic' ? 'var(--primary)' : 'var(--border)',
                  pointerEvents: 'auto',
                }}
              >
                Dynamic
              </button>
            </div>
          </div>

          {/* CONTENT EDITOR */}
          <div className="space-y-3">
            <label 
              className="text-foreground font-medium"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Content
            </label>
            {(moduleConfig.mode || 'static') === 'static' ? (
              <>
                <TextBlockEditor
                  value={moduleConfig.content || ''}
                  onChange={(content) => onUpdateConfig({ content })}
                  placeholder="Type your text here..."
                />
                <p 
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  This text will appear in your report template.
                </p>
              </>
            ) : (
              <>
                <div
                  className="border rounded-lg px-4 py-8 bg-muted/30 text-center"
                  style={{
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <p 
                    className="text-muted-foreground"
                    style={{
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    This content will be generated automatically in reports
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // SPECIAL HANDLING: DIVIDER
  // ============================================================================
  if (module.type === 'Divider') {
    return (
      <>
        {/* HEADER */}
        <div 
          className="px-6 py-4 border-b border-border bg-background shrink-0"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h3 
            className="font-semibold text-foreground"
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-semi-bold)',
            }}
          >
            Module Settings
          </h3>
          <p 
            className="text-muted-foreground mt-1"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
            }}
          >
            Module Type: Divider
          </p>
        </div>

        {/* CONTENT */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-0"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div 
            className="p-4 border border-border bg-muted/20 rounded-lg text-center"
          >
            <p 
              className="text-muted-foreground"
              style={{
                fontSize: 'var(--text-sm)',
              }}
            >
              Dividers are simple visual separators and don't require configuration.
            </p>
            <div className="my-4">
              <div className="border-t border-border/60" />
            </div>
            <p 
              className="text-muted-foreground"
              style={{
                fontSize: 'var(--text-xs)',
              }}
            >
              This element will appear as a horizontal line in your report
            </p>
          </div>
        </div>
      </>
    );
  }

  // ============================================================================
  // STANDARD MODULE SETTINGS (Data-driven modules)
  // ============================================================================
  return (
    <>
      {/* 1. HEADER */}
      <div 
        className="px-6 py-4 border-b border-border bg-background shrink-0"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 
              className="font-semibold text-foreground"
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-semi-bold)',
              }}
            >
              Module Settings
            </h3>
          </div>
          
          {/* User Context Information */}
          <div className="space-y-1">
            {/* Module Name */}
            <div 
              className="font-semibold text-foreground"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semi-bold)',
              }}
            >
              {module.name}
            </div>
            
            {/* Section Name */}
            {sectionName && (
              <div 
                className="text-muted-foreground"
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                }}
              >
                Section: {sectionName}
              </div>
            )}
            
            {/* Module Type Badge */}
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="secondary"
                className="text-[10px] font-medium"
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {module.category || 'Module'}
              </Badge>
              {localRepresentationType && (
                <Badge 
                  variant="outline"
                  className="text-[10px] font-medium capitalize"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {localRepresentationType}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 2. SCROLLABLE CONTENT */}
      <div 
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-0"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
        ref={scrollContainerRef}
      >
        
        {!moduleDataset && (
          <div 
            className="p-4 border border-border bg-muted/20"
            style={{
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <p 
              className="text-muted-foreground"
              style={{
                fontSize: 'var(--text-sm)',
              }}
            >
              No dataset configured for this module type yet. Please contact your administrator.
            </p>
          </div>
        )}

        {/* Representation Type (Editable until saved) */}
        <div className="space-y-3">
          <label 
            className="text-foreground font-medium"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Representation Type
          </label>
          <div 
            className="grid grid-cols-2"
            style={{ gap: 'var(--spacing-3)' }}
          >
            {['table', 'chart', 'heatmap', 'insights'].map((type) => {
              const isSelected = localRepresentationType === type;
              const isDisabled = isConfigSaved;
              
              return (
                <button
                  key={type}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) {
                      setLocalRepresentationType(type);
                      // Set default chart type when switching to chart representation
                      if (type === 'chart' && !moduleConfig.chartType) {
                        onUpdateConfig({ chartType: 'bar' });
                      }
                      // Set default insight type when switching to insights representation
                      if (type === 'insights' && !moduleConfig.insightType) {
                        onUpdateConfig({ insightType: 'kpi' });
                      }
                    }
                  }}
                  className={cn(
                    "border p-3 text-center font-medium capitalize transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5 text-primary shadow-sm" 
                      : "border-border text-muted-foreground hover:border-primary/40",
                    isDisabled && "cursor-not-allowed opacity-60"
                  )}
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
          <p 
            className="text-muted-foreground"
            style={{
              fontSize: 'var(--text-xs)',
            }}
          >
            {isConfigSaved 
              ? "To change representation type, add a new module instance" 
              : "Select representation type and configure below"}
          </p>
        </div>

        {/* Only show configuration if dataset exists */}
        {moduleDataset && availableFields.length > 0 && (
          <>
            <Separator />

            {/* PAGE ORIENTATION (Only for Table representation) */}
            {localRepresentationType === 'table' && (
              <>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label 
                      className="text-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Page Orientation
                    </label>
                    <p 
                      className="text-muted-foreground"
                      style={{
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Affects PDF export and print layout
                    </p>
                  </div>
                  <div 
                    className="grid grid-cols-2"
                    style={{ gap: 'var(--spacing-3)' }}
                  >
                    {[
                      { value: 'portrait', label: 'Portrait', maxCols: MAX_COLUMNS_PORTRAIT },
                      { value: 'landscape', label: 'Landscape', maxCols: MAX_COLUMNS_LANDSCAPE }
                    ].map((orientation) => {
                      const isSelected = pageOrientation === orientation.value;
                      
                      return (
                        <button
                          key={orientation.value}
                          type="button"
                          onClick={() => {
                            setPageOrientation(orientation.value as 'portrait' | 'landscape');
                            onUpdateConfig({ pageOrientation: orientation.value });
                          }}
                          className={cn(
                            "border p-3 text-left font-medium transition-all",
                            isSelected 
                              ? "border-primary bg-primary/5 text-primary shadow-sm" 
                              : "border-border text-muted-foreground hover:border-primary/40"
                          )}
                          style={{
                            borderRadius: 'var(--radius-lg)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          <div>{orientation.label}</div>
                          <div 
                            className={cn(
                              "mt-1",
                              isSelected ? "text-primary/70" : "text-muted-foreground"
                            )}
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-normal)',
                            }}
                          >
                            Max {orientation.maxCols} cols
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* CHART CONFIGURATION */}
            {localRepresentationType === 'chart' && (
              <>
                <div className="space-y-3">
                  <label 
                    className="text-foreground font-medium"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Chart Type
                  </label>
                  <Select 
                    value={moduleConfig.chartType} 
                    onValueChange={(val) => onUpdateConfig({ chartType: val })}
                  >
                    <SelectTrigger 
                      style={{
                        height: '40px',
                      }}
                    >
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="stacked-bar">Stacked Bar</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Data Mapping for Charts */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label 
                      className="text-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Data Mapping
                    </label>
                    <p 
                      className="text-muted-foreground"
                      style={{
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Configure chart data from module dataset
                    </p>
                  </div>
                  
                  {/* X-Axis Field */}
                  <div className="space-y-2">
                    <label 
                      className="text-muted-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      X-Axis Field
                    </label>
                    <Select 
                      value={moduleConfig.xAxisField || ''} 
                      onValueChange={(val) => onUpdateConfig({ xAxisField: val })}
                      disabled={!moduleConfig.chartType}
                    >
                      <SelectTrigger 
                        style={{
                          height: '36px',
                        }}
                      >
                        <SelectValue placeholder={moduleConfig.chartType ? "Select X-axis field" : "Select chart type first"} />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        {moduleConfig.chartType && filterFieldsByType(availableFields, getValidXAxisTypes(moduleConfig.chartType)).map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Y-Axis Metric */}
                  <div className="space-y-2">
                    <label 
                      className="text-muted-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Y-Axis Metric
                    </label>
                    <Select 
                      value={moduleConfig.yAxisField || ''} 
                      onValueChange={(val) => onUpdateConfig({ yAxisField: val })}
                      disabled={!moduleConfig.chartType}
                    >
                      <SelectTrigger 
                        style={{
                          height: '36px',
                        }}
                      >
                        <SelectValue placeholder={moduleConfig.chartType ? "Select Y-axis metric" : "Select chart type first"} />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        {moduleConfig.chartType && filterFieldsByType(availableFields, getValidYAxisTypes(moduleConfig.chartType)).map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name}
                            {field.type === 'number' && (
                              <span 
                                className="text-muted-foreground ml-1"
                                style={{ fontSize: 'var(--text-xs)' }}
                              >
                                (numeric)
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Aggregation Method */}
                  <div className="space-y-2">
                    <label 
                      className="text-muted-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Aggregation Method
                    </label>
                    <Select 
                      value={moduleConfig.aggregationType || 'count'} 
                      onValueChange={(val) => onUpdateConfig({ aggregationType: val })}
                    >
                      <SelectTrigger 
                        style={{
                          height: '36px',
                        }}
                      >
                        <SelectValue placeholder="Select aggregation" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="sum">Sum</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="minimum">Minimum</SelectItem>
                        <SelectItem value="maximum">Maximum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Group By (Series) - Optional Advanced Configuration */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Group By (Series)
                      </label>
                      <span 
                        className="text-muted-foreground/60"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontStyle: 'italic',
                        }}
                      >
                        Optional
                      </span>
                    </div>
                    <Select 
                      value={moduleConfig.groupByField || 'none'} 
                      onValueChange={(val) => onUpdateConfig({ groupByField: val === 'none' ? undefined : val })}
                    >
                      <SelectTrigger 
                        style={{
                          height: '36px',
                        }}
                      >
                        <SelectValue placeholder="Select group by field" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        <SelectItem value="none">
                          <span className="text-muted-foreground">None (Single series)</span>
                        </SelectItem>
                        {availableFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {moduleConfig.groupByField && moduleConfig.groupByField !== 'none' && (
                      <p 
                        className="text-muted-foreground/70 italic"
                        style={{
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        Chart will show multiple series grouped by {availableFields.find(f => f.id === moduleConfig.groupByField)?.name}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* TABLE CONFIGURATION */}
            {localRepresentationType === 'table' && (
              <>
                <div className="space-y-4">
                  <label 
                    className="text-foreground font-medium"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Table Configuration
                  </label>
                  
                  <div className="space-y-2">
                    <label 
                      className="text-muted-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Columns
                    </label>
                    
                    {/* Multi-select dropdown for columns */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="w-full flex items-center justify-between px-3 py-2 border border-border bg-background text-left hover:bg-muted/40 transition-colors"
                          style={{
                            height: '40px',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-normal)',
                          }}
                        >
                          <span className={moduleConfig.columns?.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                            {moduleConfig.columns?.length > 0 
                              ? `${moduleConfig.columns.length} column(s) selected`
                              : 'Select columns'}
                          </span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-[var(--radix-popover-trigger-width)] p-2"
                        align="start"
                        style={{
                          maxHeight: '240px',
                          overflowY: 'auto',
                        }}
                      >
                        <div className="space-y-1">
                          {availableFields.map((field) => {
                            const isSelected = moduleConfig.columns?.includes(field.id);
                            
                            return (
                              <button
                                key={field.id}
                                type="button"
                                onClick={() => {
                                  const currentColumns = moduleConfig.columns || [];
                                  const newColumns = isSelected
                                    ? currentColumns.filter((col: string) => col !== field.id)
                                    : [...currentColumns, field.id];
                                  onUpdateConfig({ columns: newColumns });
                                }}
                                className={cn(
                                  "w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors",
                                  isSelected 
                                    ? "bg-primary/8 text-primary" 
                                    : "hover:bg-muted/40 text-foreground bg-background"
                                )}
                                style={{
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-weight-normal)',
                                  borderRadius: 'var(--radius-md)',
                                }}
                              >
                                <span>{field.name}</span>
                                {isSelected && (
                                  <Check 
                                    className="h-4 w-4 text-primary flex-shrink-0" 
                                    strokeWidth={2.5}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Column Limit Warning */}
                    {columnsExceedLimit && (
                      <div 
                        className="flex items-start gap-2 p-3 border border-orange-500/30 bg-orange-500/5"
                        style={{
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <svg 
                          className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                          />
                        </svg>
                        <div className="flex-1">
                          <p 
                            className="text-orange-600 font-medium"
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            Too many columns for {pageOrientation} layout
                          </p>
                          <p 
                            className="text-orange-600/80 mt-1"
                            style={{
                              fontSize: 'var(--text-xs)',
                            }}
                          >
                            {selectedColumnsCount} columns selected. Maximum recommended: {maxColumns} for {pageOrientation} PDF export. Columns may not fit within page width.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label 
                      className="text-muted-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Sort By
                    </label>
                    <Select 
                      value={moduleConfig.sortBy || 'none'} 
                      onValueChange={(val) => onUpdateConfig({ sortBy: val === 'none' ? '' : val })}
                    >
                      <SelectTrigger 
                        style={{
                          height: '36px',
                        }}
                      >
                        <SelectValue placeholder="Select sort field" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        <SelectItem value="none">None</SelectItem>
                        {availableFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div 
                    className="flex items-center justify-between"
                    style={{
                      paddingTop: 'var(--spacing-1)',
                      paddingBottom: 'var(--spacing-1)',
                    }}
                  >
                    <span 
                      className="text-muted-foreground"
                      style={{
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      Enable Pagination
                    </span>
                    <Switch 
                      checked={moduleConfig.pagination ?? true} 
                      onCheckedChange={(c) => onUpdateConfig({ pagination: c })} 
                    />
                  </div>
                </div>
              </>
            )}

            {/* HEATMAP CONFIGURATION */}
            {localRepresentationType === 'heatmap' && (
              <>
                <div className="space-y-4">
                  <label 
                    className="text-foreground font-medium"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Heatmap Configuration
                  </label>
                  
                  <div className="space-y-2">
                    <label 
                      className="text-muted-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      X-Axis Field
                    </label>
                    <Select 
                      value={moduleConfig.xAxisField || ''} 
                      onValueChange={(val) => onUpdateConfig({ xAxisField: val })}
                    >
                      <SelectTrigger 
                        style={{
                          height: '36px',
                        }}
                      >
                        <SelectValue placeholder="Select X-axis field" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        {availableFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label 
                      className="text-muted-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Y-Axis Field
                    </label>
                    <Select 
                      value={moduleConfig.yAxisField || ''} 
                      onValueChange={(val) => onUpdateConfig({ yAxisField: val })}
                    >
                      <SelectTrigger 
                        style={{
                          height: '36px',
                        }}
                      >
                        <SelectValue placeholder="Select Y-axis field" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        {availableFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label 
                      className="text-muted-foreground font-medium"
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Value Field
                    </label>
                    <Select 
                      value={moduleConfig.valueField || ''} 
                      onValueChange={(val) => onUpdateConfig({ valueField: val })}
                    >
                      <SelectTrigger 
                        style={{
                          height: '36px',
                        }}
                      >
                        <SelectValue placeholder="Select value field" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        {availableFields
                          .filter(f => f.type === 'number')
                          .map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                              {field.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* INSIGHTS CONFIGURATION */}
            {localRepresentationType === 'insights' && (
              <>
                {/* Insight Type Selector */}
                <div className="space-y-3">
                  <label 
                    className="text-foreground font-medium"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Insight Type
                  </label>
                  <Select 
                    value={moduleConfig.insightType || 'kpi'} 
                    onValueChange={(val) => onUpdateConfig({ insightType: val })}
                  >
                    <SelectTrigger 
                      style={{
                        height: '40px',
                      }}
                    >
                      <SelectValue placeholder="Select insight type" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      <SelectItem value="kpi">KPI</SelectItem>
                      <SelectItem value="kpi-grid">KPI Grid</SelectItem>
                      <SelectItem value="key-observations">Key Observations</SelectItem>
                      <SelectItem value="trend-summary">Trend Summary</SelectItem>
                    </SelectContent>
                  </Select>
                  <p 
                    className="text-muted-foreground"
                    style={{
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    {moduleConfig.insightType === 'kpi' && 'Display a single key metric'}
                    {moduleConfig.insightType === 'kpi-grid' && 'Display multiple KPI metrics in a dashboard grid'}
                    {moduleConfig.insightType === 'key-observations' && 'Display bullet-based analytical observations'}
                    {moduleConfig.insightType === 'trend-summary' && 'Generate analytical narrative based on time-based trends'}
                  </p>
                </div>

                <Separator />

                {/* KPI Configuration */}
                {moduleConfig.insightType === 'kpi' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Metric Source
                      </label>
                      <Select 
                        value={moduleConfig.metricSource || ''} 
                        onValueChange={(val) => onUpdateConfig({ metricSource: val })}
                      >
                        <SelectTrigger 
                          style={{
                            height: '36px',
                          }}
                        >
                          <SelectValue placeholder="Select metric field" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          {availableFields
                            .filter(f => f.type === 'number')
                            .map((field) => (
                              <SelectItem key={field.id} value={field.id}>
                                {field.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Aggregation Type
                      </label>
                      <Select 
                        value={moduleConfig.aggregationType || 'count'} 
                        onValueChange={(val) => onUpdateConfig({ aggregationType: val })}
                      >
                        <SelectTrigger 
                          style={{
                            height: '36px',
                          }}
                        >
                          <SelectValue placeholder="Select aggregation" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="count">Count</SelectItem>
                          <SelectItem value="sum">Sum</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Value Format (Optional)
                      </label>
                      <Select 
                        value={moduleConfig.valueFormat || 'number'} 
                        onValueChange={(val) => onUpdateConfig({ valueFormat: val })}
                      >
                        <SelectTrigger 
                          style={{
                            height: '36px',
                          }}
                        >
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* KPI Grid Configuration */}
                {moduleConfig.insightType === 'kpi-grid' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Metrics Selection
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="w-full flex items-center justify-between px-3 py-2 border border-border bg-background text-left hover:bg-muted/40 transition-colors"
                            style={{
                              height: '40px',
                              borderRadius: 'var(--radius-lg)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-normal)',
                            }}
                          >
                            <span className={moduleConfig.metricsSelection?.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                              {moduleConfig.metricsSelection?.length > 0 
                                ? `${moduleConfig.metricsSelection.length} metric(s) selected`
                                : 'Select metrics'}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-[var(--radix-popover-trigger-width)] p-2"
                          align="start"
                          style={{
                            maxHeight: '240px',
                            overflowY: 'auto',
                          }}
                        >
                          <div className="space-y-1">
                            {availableFields
                              .filter(f => f.type === 'number')
                              .map((field) => {
                                const isSelected = moduleConfig.metricsSelection?.includes(field.id);
                                const currentCount = moduleConfig.metricsSelection?.length || 0;
                                const maxReached = currentCount >= (moduleConfig.maxKPIs || 6);
                                
                                return (
                                  <button
                                    key={field.id}
                                    type="button"
                                    disabled={!isSelected && maxReached}
                                    onClick={() => {
                                      const currentMetrics = moduleConfig.metricsSelection || [];
                                      const newMetrics = isSelected
                                        ? currentMetrics.filter((m: string) => m !== field.id)
                                        : [...currentMetrics, field.id];
                                      onUpdateConfig({ metricsSelection: newMetrics });
                                    }}
                                    className={cn(
                                      "w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors",
                                      isSelected 
                                        ? "bg-primary/8 text-primary" 
                                        : "hover:bg-muted/40 text-foreground bg-background",
                                      !isSelected && maxReached && "opacity-40 cursor-not-allowed"
                                    )}
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: 'var(--font-weight-normal)',
                                      borderRadius: 'var(--radius-md)',
                                    }}
                                  >
                                    <span>{field.name}</span>
                                    {isSelected && (
                                      <Check 
                                        className="h-4 w-4 text-primary flex-shrink-0" 
                                        strokeWidth={2.5}
                                      />
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Maximum KPIs (2-6)
                      </label>
                      <Select 
                        value={String(moduleConfig.maxKPIs || 4)} 
                        onValueChange={(val) => onUpdateConfig({ maxKPIs: parseInt(val) })}
                      >
                        <SelectTrigger 
                          style={{
                            height: '36px',
                          }}
                        >
                          <SelectValue placeholder="Select max KPIs" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          {[2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={String(num)}>{num} KPIs</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Key Observations Configuration */}
                {moduleConfig.insightType === 'key-observations' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Observation Source Dataset
                      </label>
                      <Select 
                        value={moduleConfig.observationSource || ''} 
                        onValueChange={(val) => onUpdateConfig({ observationSource: val })}
                      >
                        <SelectTrigger 
                          style={{
                            height: '36px',
                          }}
                        >
                          <SelectValue placeholder="Select dataset" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          {availableFields.map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                              {field.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Maximum Observations
                      </label>
                      <Select 
                        value={String(moduleConfig.maxObservations || 5)} 
                        onValueChange={(val) => onUpdateConfig({ maxObservations: parseInt(val) })}
                      >
                        <SelectTrigger 
                          style={{
                            height: '36px',
                          }}
                        >
                          <SelectValue placeholder="Select max observations" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          {[3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={String(num)}>{num} observations</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Trend Summary Configuration */}
                {moduleConfig.insightType === 'trend-summary' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Trend Metric
                      </label>
                      <Select 
                        value={moduleConfig.trendMetric || ''} 
                        onValueChange={(val) => onUpdateConfig({ trendMetric: val })}
                      >
                        <SelectTrigger 
                          style={{
                            height: '36px',
                          }}
                        >
                          <SelectValue placeholder="Select trend metric" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          {availableFields
                            .filter(f => f.type === 'number')
                            .map((field) => (
                              <SelectItem key={field.id} value={field.id}>
                                {field.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label 
                        className="text-muted-foreground font-medium"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Time Interval
                      </label>
                      <Select 
                        value={moduleConfig.timeInterval || 'quarter'} 
                        onValueChange={(val) => onUpdateConfig({ timeInterval: val })}
                      >
                        <SelectTrigger 
                          style={{
                            height: '36px',
                          }}
                        >
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="quarter">Quarter</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

      </div>
      
      {/* 3. FOOTER */}
      <div 
        className="flex-shrink-0 border-t bg-background"
        style={{
          padding: 'var(--spacing-4)',
        }}
      >
        <Button 
          className="w-full" 
          onClick={handleSaveConfiguration}
          disabled={!moduleDataset}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          Save Configuration
        </Button>
        {!moduleDataset && (
          <p 
            className="text-muted-foreground text-center mt-2"
            style={{
              fontSize: 'var(--text-xs)',
            }}
          >
            Dataset not available for this module
          </p>
        )}
      </div>
    </>
  );
}