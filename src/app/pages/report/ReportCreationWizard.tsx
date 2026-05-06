/**
 * Universal Report Creation Wizard Modal
 * 
 * A progressive multi-step wizard for creating RAMS IRDS reports.
 * Template-driven structure with clean 3-step flow.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { cn } from '@/app/components/ui/utils';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronRight,
  LayoutGrid,
  Columns2,
  Layers,
  ListOrdered,
  Warehouse,
  Grid3x3,
  List,
  Info,
  Search,
  FileText,
  Lock,
} from 'lucide-react';
import { format } from 'date-fns';
import { reportService } from '@/app/services/reportService';
import { useReportStore } from '@/app/stores/reportStore';

// Types
interface WarehouseCoverageOption {
  id: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

interface WizardState {
  // Step 1
  templateId: string;
  
  // Step 2
  reportName: string;
  warehouseCoverage: string;
  selectedZones: string[];
  selectedAisle: string;
  dateScope: string;
  startDate: string;
  endDate: string;
}

interface ReportCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates?: any[];
  preselectedTemplateId?: string;
}

const WAREHOUSE_COVERAGE_OPTIONS: WarehouseCoverageOption[] = [
  {
    id: 'full',
    icon: Warehouse,
    title: 'Full Warehouse',
    description: 'Include all zones and aisles in the report',
  },
  {
    id: 'zones',
    icon: Grid3x3,
    title: 'Selected Zones',
    description: 'Select specific zones to include in the report',
  },
  {
    id: 'aisle',
    icon: List,
    title: 'Selected Aisle',
    description: 'Select a specific aisle to include in the report',
  },
];

export function ReportCreationWizard({
  open,
  onOpenChange,
  templates = [],
  preselectedTemplateId,
}: ReportCreationWizardProps) {
  const navigate = useNavigate();
  const { addReport } = useReportStore();
  const [isCreating, setIsCreating] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  
  // Track if template was preselected (from "Use Template" flow)
  const isTemplatePreselected = !!preselectedTemplateId;
  
  // Always start at step 1
  const [currentStep, setCurrentStep] = useState(1);
  
  const [wizardState, setWizardState] = useState<WizardState>({
    templateId: preselectedTemplateId || '',
    reportName: '',
    warehouseCoverage: 'full',
    selectedZones: [],
    selectedAisle: '',
    dateScope: 'all-records',
    startDate: '',
    endDate: '',
  });

  // Reset wizard when modal opens
  useEffect(() => {
    if (open) {
      // Always start at step 1
      setCurrentStep(1);
      setWizardState({
        templateId: preselectedTemplateId || '',
        reportName: '',
        warehouseCoverage: 'full',
        selectedZones: [],
        selectedAisle: '',
        dateScope: 'all-records',
        startDate: '',
        endDate: '',
      });
      setTemplateSearchQuery('');
    }
  }, [open, preselectedTemplateId]);

  // Update wizard state helper
  const updateWizardState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  // Total steps is always 3
  const totalSteps = 3;

  // Handle next step
  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && !wizardState.templateId) {
      toast.error('Please select a template');
      return;
    }

    if (currentStep === 2) {
      if (!wizardState.reportName.trim()) {
        toast.error('Please enter a report name');
        return;
      }
      if (wizardState.dateScope === 'date-range') {
        if (!wizardState.startDate || !wizardState.endDate) {
          toast.error('Please select both start and end dates');
          return;
        }
      }
    }

    // Move to next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle back
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle create report
  const handleCreateReport = async () => {
    setIsCreating(true);
    
    try {
      // Build payload
      const payload = {
        projectId: 'current-project', // Replace with actual project ID
        reportName: wizardState.reportName,
        reportType: 'IRDS Report', // Default report type since we removed the selection step
        scopeType: wizardState.dateScope,
        startDate: wizardState.startDate || undefined,
        endDate: wizardState.endDate || undefined,
        layoutType: 'standard', // Layout type is fixed in this version
        templateId: wizardState.templateId,
        templateName: selectedTemplate?.name || undefined,
        warehouseCoverage: wizardState.warehouseCoverage,
        selectedZones: wizardState.selectedZones,
        selectedAisle: wizardState.selectedAisle,
      };

      // Call backend to create report
      const response = await reportService.createReport(payload);
      
      // Extract report ID from response
      const reportId = response.id;
      
      if (!reportId) {
        throw new Error('No report ID returned from server');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Report created with ID:', reportId);
      }
      
      // Add the newly created report to the store immediately
      // This ensures the report appears in the list when navigating back
      if (response.report) {
        if (process.env.NODE_ENV === 'development') {
          console.log('📝 Adding newly created report to store:', response.report.id);
        }
        addReport(response.report);
      }
      
      // CRITICAL: Verify the report is in localStorage before navigating
      // This is essential because the server might restart and we need the cache
      let retries = 0;
      let cached = null;
      while (retries < 5 && !cached) {
        await new Promise(resolve => setTimeout(resolve, 100));
        cached = localStorage.getItem(`rams_report_${reportId}`);
        if (!cached) {
          console.warn(`⚠️ Report not yet in localStorage, retry ${retries + 1}/5...`);
          retries++;
        }
      }
      
      if (cached) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ VERIFIED: Report is cached in localStorage before navigation');
        }
      } else {
        console.error('❌ WARNING: Report NOT in localStorage after 500ms!');
        console.error('❌ This will cause a 404 error if the server restarts');
        
        // Emergency cache directly
        if (response.report) {
          if (process.env.NODE_ENV === 'development') {
            console.log('🚨 Emergency: Manually caching report...');
          }
          localStorage.setItem(`rams_report_${reportId}`, JSON.stringify(response.report));
          
          // Update index
          const indexData = localStorage.getItem('rams_report_index');
          const ids = indexData ? JSON.parse(indexData) : [];
          if (!ids.includes(reportId)) {
            ids.push(reportId);
            localStorage.setItem('rams_report_index', JSON.stringify(ids));
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Emergency cache complete');
          }
        }
      }

      // Close modal
      onOpenChange(false);
      
      // Show success message
      toast.success('Report created successfully', {
        description: 'Opening report builder...',
        duration: 2000,
      });
      
      // Navigate to report builder with the created report ID
      // Small delay to ensure state updates are complete
      setTimeout(() => {
        navigate(`/report/${reportId}`);
      }, 300);
      
    } catch (error: any) {
      console.error('Failed to create report:', error);
      toast.error('Failed to create report', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Get selected template
  const selectedTemplate = templates.find(t => t.id === wizardState.templateId);

  // Step indicator component
  const StepIndicator = () => {
    const steps = [
      { number: 1, label: 'Select Template' },
      { number: 2, label: 'Scope & Layout' },
      { number: 3, label: 'Review & Create' },
    ];

    return (
      <div 
        className="flex items-center justify-center mb-6"
        style={{ gap: 'var(--spacing-3)' }}
      >
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
            <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
              <div
                className={cn(
                  'flex items-center justify-center rounded-full border-2 transition-all',
                  currentStep === step.number
                    ? 'border-primary bg-primary text-primary-foreground'
                    : currentStep > step.number
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground'
                )}
                style={{
                  width: '36px',
                  height: '36px',
                }}
              >
                {currentStep > step.number ? (
                  <Check style={{ width: '16px', height: '16px' }} />
                ) : (
                  <span 
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semi-bold)',
                    }}
                  >
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'transition-colors',
                  currentStep === step.number
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight 
                style={{ 
                  width: '16px', 
                  height: '16px',
                  marginLeft: 'var(--spacing-2)',
                  marginRight: 'var(--spacing-2)',
                }} 
                className="text-muted-foreground" 
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Filter published templates based on search query
        const publishedTemplates = templates
          .filter(t => t.status === 'Published')
          .filter(t => templateSearchQuery === '' || t.name.toLowerCase().includes(templateSearchQuery.toLowerCase()));
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            {/* Header */}
            <div>
              <h3 
                className="font-semibold text-foreground mb-1"
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semi-bold)',
                }}
              >
                Select Template
              </h3>
              <p 
                className="text-muted-foreground"
                style={{
                  fontSize: 'var(--text-xs)',
                }}
              >
                Choose a published template to structure your report
              </p>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <Search 
                className="absolute text-muted-foreground" 
                style={{
                  left: 'var(--spacing-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                }}
              />
              <Input
                id="template-search"
                type="text"
                placeholder="Search templates..."
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                className="h-9"
                style={{
                  paddingLeft: 'calc(var(--spacing-3) + 16px + var(--spacing-2))',
                }}
              />
            </div>

            {/* Template Grid */}
            {publishedTemplates.length === 0 ? (
              <div 
                className="flex flex-col items-center justify-center bg-muted border border-border"
                style={{
                  padding: 'var(--spacing-12)',
                  borderRadius: 'var(--radius-lg)',
                  minHeight: '300px',
                }}
              >
                <FileText 
                  className="text-muted-foreground"
                  style={{
                    width: '48px',
                    height: '48px',
                    marginBottom: 'var(--spacing-4)',
                  }}
                />
                <p 
                  className="font-medium text-foreground"
                  style={{
                    fontSize: 'var(--text-sm)',
                    marginBottom: 'var(--spacing-1)',
                  }}
                >
                  No published templates found
                </p>
                <p 
                  className="text-muted-foreground text-center"
                  style={{
                    fontSize: 'var(--text-xs)',
                    maxWidth: '400px',
                  }}
                >
                  {templateSearchQuery 
                    ? 'Try adjusting your search or create a new template in the Template Library.'
                    : 'Create and publish a template in the Template Library to get started.'}
                </p>
              </div>
            ) : (
              <div 
                className="grid grid-cols-3"
                style={{ 
                  gap: 'var(--spacing-4)',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: 'var(--spacing-2)',
                }}
              >
                {publishedTemplates.map((template) => {
                  const isSelected = wizardState.templateId === template.id;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => updateWizardState({ templateId: template.id })}
                      className={cn(
                        "group flex flex-col items-start transition-all duration-200 text-left bg-card",
                        isSelected
                          ? "border-primary shadow-sm bg-primary/5"
                          : "border-border hover:border-primary/40 hover:shadow-sm"
                      )}
                      style={{
                        padding: 'var(--spacing-4)',
                        borderRadius: 'var(--radius-lg)',
                        border: isSelected 
                          ? '1.5px solid var(--primary)' 
                          : '1px solid var(--border)',
                      }}
                    >
                      <div style={{ width: '100%' }}>
                        <h4 
                          className="font-semibold text-foreground leading-snug"
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-semi-bold)',
                            marginBottom: 'var(--spacing-2)',
                          }}
                        >
                          {template.name}
                        </h4>
                        <div 
                          className="flex items-center"
                          style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}
                        >
                          <Badge 
                            variant="secondary"
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            {template.status}
                          </Badge>
                          {template.version && (
                            <span 
                              className="text-muted-foreground"
                              style={{
                                fontSize: 'var(--text-xs)',
                              }}
                            >
                              v{template.version}
                            </span>
                          )}
                        </div>
                        {template.description && (
                          <p 
                            className="text-muted-foreground leading-relaxed line-clamp-2"
                            style={{
                              fontSize: 'var(--text-xs)',
                              lineHeight: '1.5',
                            }}
                          >
                            {template.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            {/* SECTION 1 — Basic Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <div>
                <h3 
                  className="font-semibold text-foreground mb-1"
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semi-bold)',
                  }}
                >
                  Report Information
                </h3>
                <p 
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  Configure Report Scope
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label 
                  htmlFor="report-name"
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Report Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="report-name"
                  type="text"
                  placeholder="Enter report name"
                  value={wizardState.reportName}
                  onChange={(e) => updateWizardState({ reportName: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            {/* SECTION 2 — Warehouse Coverage */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <div>
                <h3 
                  className="font-semibold text-foreground mb-1"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semi-bold)',
                  }}
                >
                  Warehouse Coverage
                </h3>
                <p 
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  Define which area of the warehouse this report applies to
                </p>
              </div>

              {/* 3-column card grid */}
              <div className="grid grid-cols-3" style={{ gap: 'var(--spacing-4)' }}>
                {WAREHOUSE_COVERAGE_OPTIONS.map((coverage) => {
                  const Icon = coverage.icon;
                  const isSelected = wizardState.warehouseCoverage === coverage.id;

                  return (
                    <button
                      key={coverage.id}
                      type="button"
                      onClick={() => updateWizardState({ warehouseCoverage: coverage.id })}
                      className={cn(
                        "group flex flex-col items-start transition-all duration-200 text-left bg-card",
                        isSelected
                          ? "border-primary shadow-sm bg-primary/5"
                          : "border-border hover:border-primary/40 hover:shadow-sm"
                      )}
                      style={{
                        padding: 'var(--spacing-5)',
                        borderRadius: 'var(--radius-lg)',
                        border: isSelected 
                          ? '1.5px solid var(--primary)' 
                          : '1px solid var(--border)',
                      }}
                    >
                      {/* Icon container */}
                      <div
                        className={cn(
                          "flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-primary/10"
                            : "bg-muted/40 group-hover:bg-muted"
                        )}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: 'var(--radius)',
                          marginBottom: 'var(--spacing-3)',
                        }}
                      >
                        <Icon
                          className={cn(
                            isSelected
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                          style={{
                            width: '20px',
                            height: '20px',
                          }}
                          strokeWidth={2}
                        />
                      </div>

                      {/* Text */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                        <h4 
                          className="font-semibold text-foreground leading-snug"
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-semi-bold)',
                          }}
                        >
                          {coverage.title}
                        </h4>
                        <p 
                          className="text-muted-foreground leading-relaxed"
                          style={{
                            fontSize: 'var(--text-xs)',
                            lineHeight: '1.5',
                          }}
                        >
                          {coverage.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Conditional UI based on selection */}
              {wizardState.warehouseCoverage === 'full' && (
                <div 
                  className="flex items-start bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30"
                  style={{
                    gap: 'var(--spacing-2)',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <Info 
                    className="text-blue-600 dark:text-blue-400 flex-shrink-0" 
                    style={{
                      width: '16px',
                      height: '16px',
                      marginTop: '2px',
                    }}
                  />
                  <p 
                    className="text-blue-700 dark:text-blue-300"
                    style={{
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    This report will include all warehouse elements.
                  </p>
                </div>
              )}

              {wizardState.warehouseCoverage === 'zones' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label 
                    htmlFor="select-zones"
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Select Zones
                  </Label>
                  <Select
                    value={wizardState.selectedZones.length > 0 ? wizardState.selectedZones[0] : ''}
                    onValueChange={(value) => updateWizardState({ selectedZones: [value] })}
                  >
                    <SelectTrigger id="select-zones" className="h-9">
                      <SelectValue placeholder="Choose zones to include" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zone-a">Zone A</SelectItem>
                      <SelectItem value="zone-b">Zone B</SelectItem>
                      <SelectItem value="zone-c">Zone C</SelectItem>
                      <SelectItem value="zone-d">Zone D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {wizardState.warehouseCoverage === 'aisle' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label 
                    htmlFor="select-aisle"
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Select Aisle
                  </Label>
                  <Select
                    value={wizardState.selectedAisle}
                    onValueChange={(value) => updateWizardState({ selectedAisle: value })}
                  >
                    <SelectTrigger id="select-aisle" className="h-9">
                      <SelectValue placeholder="Choose an aisle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aisle-1">Aisle 1</SelectItem>
                      <SelectItem value="aisle-2">Aisle 2</SelectItem>
                      <SelectItem value="aisle-3">Aisle 3</SelectItem>
                      <SelectItem value="aisle-4">Aisle 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* SECTION 3 — Date Scope */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <div>
                <h3 
                  className="font-semibold text-foreground mb-1"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semi-bold)',
                  }}
                >
                  Date Scope
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label 
                    htmlFor="date-scope"
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Date Scope
                  </Label>
                  <Select
                    value={wizardState.dateScope}
                    onValueChange={(value) => updateWizardState({ dateScope: value })}
                  >
                    <SelectTrigger id="date-scope" className="h-9">
                      <SelectValue placeholder="Select date scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-records">All Records</SelectItem>
                      <SelectItem value="date-range">Date Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {wizardState.dateScope === 'date-range' && (
                  <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-4)', paddingTop: 'var(--spacing-2)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                      <Label 
                        htmlFor="start-date"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Start Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full h-9 justify-start text-left font-normal',
                              !wizardState.startDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon 
                              className="mr-2" 
                              style={{
                                width: '16px',
                                height: '16px',
                              }}
                            />
                            {wizardState.startDate ? (
                              format(new Date(wizardState.startDate), 'MMM dd, yyyy')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={wizardState.startDate ? new Date(wizardState.startDate) : undefined}
                            onSelect={(date) => updateWizardState({ startDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                      <Label 
                        htmlFor="end-date"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        End Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full h-9 justify-start text-left font-normal',
                              !wizardState.endDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon 
                              className="mr-2" 
                              style={{
                                width: '16px',
                                height: '16px',
                              }}
                            />
                            {wizardState.endDate ? (
                              format(new Date(wizardState.endDate), 'MMM dd, yyyy')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={wizardState.endDate ? new Date(wizardState.endDate) : undefined}
                            onSelect={(date) => updateWizardState({ endDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            {/* Header */}
            <div>
              <h3 
                className="font-semibold text-foreground mb-1"
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semi-bold)',
                }}
              >
                Review & Create
              </h3>
              <p 
                className="text-muted-foreground"
                style={{
                  fontSize: 'var(--text-xs)',
                }}
              >
                Review your report configuration before creating
              </p>
            </div>

            {/* Configuration Grid */}
            <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-6)' }}>
              {/* Template */}
              <div 
                className="border border-border bg-card"
                style={{
                  padding: 'var(--spacing-5)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <p 
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: 'var(--spacing-2)',
                  }}
                >
                  Template
                </p>
                <p 
                  className="font-semibold text-foreground"
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semi-bold)',
                  }}
                >
                  {selectedTemplate?.name || '-'}
                </p>
              </div>

              {/* Report Name */}
              <div 
                className="border border-border bg-card"
                style={{
                  padding: 'var(--spacing-5)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <p 
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: 'var(--spacing-2)',
                  }}
                >
                  Report Name
                </p>
                <p 
                  className="font-semibold text-foreground"
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semi-bold)',
                  }}
                >
                  {wizardState.reportName || '-'}
                </p>
              </div>

              {/* Warehouse Coverage */}
              <div 
                className="border border-border bg-card"
                style={{
                  padding: 'var(--spacing-5)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <p 
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: 'var(--spacing-2)',
                  }}
                >
                  Warehouse Coverage
                </p>
                <p 
                  className="font-semibold text-foreground"
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semi-bold)',
                  }}
                >
                  {WAREHOUSE_COVERAGE_OPTIONS.find(w => w.id === wizardState.warehouseCoverage)?.title || '-'}
                </p>
              </div>

              {/* Date Scope */}
              <div 
                className="border border-border bg-card"
                style={{
                  padding: 'var(--spacing-5)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <p 
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: 'var(--spacing-2)',
                  }}
                >
                  Date Scope
                </p>
                <p 
                  className="font-semibold text-foreground"
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semi-bold)',
                  }}
                >
                  {wizardState.dateScope === 'all-records' ? 'All Records' : `${wizardState.startDate} to ${wizardState.endDate}`}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          padding: 0,
        }}
      >
        {/* Header */}
        <DialogHeader 
          style={{
            padding: 'var(--spacing-6)',
            paddingBottom: 'var(--spacing-4)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <DialogTitle 
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semi-bold)',
            }}
          >
            Create Draft Report
          </DialogTitle>
          <DialogDescription 
            style={{
              fontSize: 'var(--text-sm)',
            }}
          >
            {isTemplatePreselected 
              ? 'Configure your report settings and scope'
              : 'Select a template and configure your report settings'}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div 
          style={{
            paddingLeft: 'var(--spacing-6)',
            paddingRight: 'var(--spacing-6)',
            paddingTop: 'var(--spacing-4)',
          }}
        >
          <StepIndicator />
        </div>

        {/* Content Area */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{
            paddingLeft: 'var(--spacing-6)',
            paddingRight: 'var(--spacing-6)',
            paddingTop: 'var(--spacing-4)',
            paddingBottom: 'var(--spacing-6)',
          }}
        >
          {renderStepContent()}
        </div>

        {/* Footer */}
        <DialogFooter 
          style={{
            padding: 'var(--spacing-6)',
            paddingTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            {currentStep > 1 && (
              <Button 
                type="button"
                variant="outline" 
                onClick={handleBack}
                disabled={isCreating}
              >
                Back
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            {currentStep < totalSteps ? (
              <Button 
                type="button"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleCreateReport}
                disabled={isCreating}
              >
                {isCreating ? 'Creating Draft...' : 'Create Draft'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}