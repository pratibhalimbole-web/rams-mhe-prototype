/**
 * Report Workspace - Document-Style SaaS Report View
 * 
 * Professional PDF-style document interface:
 * - Left: Section navigation sidebar
 * - Right: Centered white document canvas
 * - Export-ready appearance
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  Save, 
  Eye,
  Check,
  Loader2,
  AlertCircle,
  Download,
  Edit2,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { toast } from "sonner";
import { cn } from '@/app/components/ui/utils';
import { reportService, Report, ReportTemplate } from '@/app/services/reportService';
import { useSidebar } from '@/app/components/layout/SidebarLayout';
import { Input } from '@/app/components/ui/input';
import { SaveReportModal } from '@/app/components/report/SaveReportModal';
import { DownloadReportModal } from '@/app/components/report/DownloadReportModal';
import { DebugCachePanel } from '@/app/components/report/DebugCachePanel';
import { useReportStore } from '@/app/stores/reportStore';

export function ReportBuilder() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const sidebar = useSidebar(); // Call hook at top level
  const [report, setReport] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [wasRestoredFromCache, setWasRestoredFromCache] = useState(false);
  const [reportSections, setReportSections] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'unsaved' | 'saving' | 'saved'>('saved');
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const documentHeaderRef = useRef<HTMLDivElement>(null);
  
  // Report store
  const { updateReport: updateReportInStore } = useReportStore();
  
  // Set breadcrumb title
  useEffect(() => {
    if (sidebar && report) {
      sidebar.setSubPageTitle(report.name);
    }
    return () => {
      if (sidebar) {
        sidebar.setSubPageTitle(null);
      }
    };
  }, [sidebar, report]);
  
  // Load report data
  useEffect(() => {
    const loadReport = async () => {
      if (!reportId) {
        toast.error('No report ID provided');
        navigate('/report');
        return;
      }
      
      setIsLoading(true);
      
      // Retry logic with exponential backoff
      const maxRetries = 3;
      let retryCount = 0;
      let reportData = null;
      let lastError = null;
      let wasRestoredFromCache = false;
      
      while (retryCount < maxRetries && !reportData) {
        try {
          reportData = await reportService.getReportById(reportId);
          
          // Check if this was restored from cache (reportService handles this internally)
          // We can detect this by checking if the error was caught and recovered
          
        } catch (error: any) {
          lastError = error;
          retryCount++;
          
          // If report not found and we have retries left, wait and retry
          if (error.message?.includes('not found') && retryCount < maxRetries) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`Report not found, retrying... (${retryCount}/${maxRetries})`);
            }
            const delay = Math.pow(2, retryCount) * 500; // 1s, 2s, 4s
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            // For other errors or exhausted retries, break the loop
            break;
          }
        }
      }
      
      // Handle the result after retries
      if (!reportData) {
        console.error('Failed to load report:', lastError);
        
        const errorMessage = lastError?.message || String(lastError);
        
        if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          toast.error('Report not found', {
            description: 'The report could not be found on the server or in local cache. It may have been deleted.',
            duration: 5000,
          });
        } else if (errorMessage.includes('Network offline') || errorMessage.includes('Unable to connect')) {
          toast.error('Running in offline mode', {
            description: 'Changes will be saved locally. Check your connection.',
          });
        } else {
          toast.error('Failed to load report', {
            description: errorMessage.substring(0, 100),
          });
        }
        
        navigate('/report');
        setIsLoading(false);
        return;
      }
      
      try {
        setReport(reportData);
        setEditedTitle(reportData.name);
        
        // Show notification if report was restored from cache
        if ((reportData as any)._wasRestored) {
          setWasRestoredFromCache(true);
          toast.success('Report restored from local cache', {
            description: 'The server was restarted. Your report has been automatically recovered.',
            duration: 5000,
          });
        }
        
        // Load template if exists
        if (reportData.templateId) {
          try {
            const templateData = await reportService.getTemplateById(reportData.templateId);
            setTemplate(templateData);
            
            // Clone template structure into report if not already stored
            if (!reportData.content?.sections && templateData.sections) {
              const clonedSections = JSON.parse(JSON.stringify(templateData.sections));
              
              const updatedReport = {
                ...reportData,
                content: {
                  ...reportData.content,
                  sections: clonedSections,
                },
              };
              
              await reportService.updateReport(updatedReport);
              setReport(updatedReport);
              setReportSections(clonedSections);
            } else if (reportData.content?.sections) {
              setReportSections(reportData.content.sections);
            }
          } catch (templateError: any) {
            // Handle template not found gracefully - don't show error toast
            // The report will continue to work with its saved content
            const errorMessage = templateError?.message || String(templateError);
            if (errorMessage.includes('404') || errorMessage.includes('not found')) {
              // Silent handling - template may have been deleted but report content is still valid
              console.log(`ℹ️ Template "${reportData.templateName || reportData.templateId}" not found. Using saved report content.`);
              
              // Continue with report content if available
              if (reportData.content?.sections) {
                setReportSections(reportData.content.sections);
              } else {
                setReportSections([]);
              }
            } else {
              // Only show error for non-404 template loading issues
              console.error('Unexpected error loading template:', errorMessage);
              toast.error('Failed to load template', {
                description: 'Using saved report content instead.',
                duration: 3000,
              });
            }
          }
        } else {
          setReportSections(reportData.content?.sections || []);
        }
        
      } catch (error: any) {
        console.error('Failed to load report:', error);
        
        const errorMessage = error?.message || String(error);
        
        // Provide more specific error messages
        if (errorMessage.includes('Report not found') || errorMessage.includes('404')) {
          toast.error('Report not found', {
            description: 'This report may have been deleted or the ID is invalid.',
            duration: 4000,
          });
        } else if (errorMessage.includes('Database table not found') || errorMessage.includes('schema cache')) {
          toast.error('Database connection issue', {
            description: 'Using temporary storage. Your report will be available after server restart.',
            duration: 5000,
          });
        } else {
          toast.error('Failed to load report', {
            description: errorMessage,
            duration: 4000,
          });
        }
        
        navigate('/report');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReport();
  }, [reportId, navigate]);
  
  // Observe sections for active state with enhanced scroll detection
  useEffect(() => {
    if (!mainScrollRef.current) return;
    
    const scrollContainer = mainScrollRef.current;
    let isScrolling = false;
    
    // IntersectionObserver for section visibility
    const observerOptions: IntersectionObserverInit = {
      root: scrollContainer,
      // Top 20% of viewport triggers, bottom 60% to avoid flickering
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the most visible section
      let mostVisibleEntry: IntersectionObserverEntry | null = null;
      let maxRatio = 0;
      
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });
      
      if (mostVisibleEntry) {
        const id = mostVisibleEntry.target.id.replace('section-', '');
        setActiveSection(id);
      }
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe overview section (document header)
    if (documentHeaderRef.current) {
      observer.observe(documentHeaderRef.current);
    }
    
    // Observe all report sections
    reportSections.forEach((_, index) => {
      const element = document.getElementById(`section-${index}`);
      if (element) observer.observe(element);
    });
    
    // Scroll event listener to detect when at top (overview)
    const handleScroll = () => {
      if (scrollContainer.scrollTop < 100) {
        setActiveSection('overview');
      }
    };
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      observer.disconnect();
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [reportSections]);
  
  // Handle save
  const handleSave = async () => {
    if (!report) return;
    
    setIsSaving(true);
    setAutoSaveStatus('saving');
    
    try {
      const updatedReport = {
        ...report,
        content: {
          ...report.content,
          sections: reportSections,
        },
      };
      
      await reportService.updateReport(updatedReport);
      setReport(updatedReport);
      
      // Update report store so ReportDashboard shows latest data
      updateReportInStore(report.id, updatedReport);
      
      setAutoSaveStatus('saved');
      
      toast.success('Report saved successfully');
    } catch (error: any) {
      console.error('Failed to save report:', error);
      setAutoSaveStatus('unsaved');
      
      toast.error('Failed to save report', {
        description: error?.message?.substring(0, 100) || 'An error occurred while saving the report.',
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle title edit
  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };
  
  const handleTitleSave = async () => {
    if (!report || !editedTitle.trim()) {
      setEditedTitle(report?.name || '');
      setIsEditingTitle(false);
      return;
    }
    
    if (editedTitle === report.name) {
      setIsEditingTitle(false);
      return;
    }
    
    try {
      const updatedReport = { ...report, name: editedTitle };
      await reportService.updateReport(updatedReport);
      setReport(updatedReport);
      toast.success('Report title updated');
    } catch (error) {
      toast.error('Failed to update title');
      setEditedTitle(report.name);
    } finally {
      setIsEditingTitle(false);
    }
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(report?.name || '');
      setIsEditingTitle(false);
    }
  };
  
  // Handle content block change
  const handleContentBlockChange = (sectionIndex: number, moduleIndex: number, blockId: string, newContent: string) => {
    const updatedSections = [...reportSections];
    const module = updatedSections[sectionIndex].modules[moduleIndex];
    
    if (module.contentBlocks) {
      const blockIndex = module.contentBlocks.findIndex((b: any) => b.id === blockId);
      if (blockIndex !== -1) {
        module.contentBlocks[blockIndex].content = newContent;
        setReportSections(updatedSections);
        setAutoSaveStatus('unsaved');
      }
    }
  };
  
  // Scroll to section with smooth behavior
  const scrollToSection = (sectionId: string) => {
    if (!mainScrollRef.current) return;
    
    const scrollContainer = mainScrollRef.current;
    const element = document.getElementById(`section-${sectionId}`);
    
    if (element) {
      // Get element position relative to scroll container
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollOffset = 80; // Offset from top for better positioning
      
      const targetScroll = scrollContainer.scrollTop + elementRect.top - containerRect.top - scrollOffset;
      
      scrollContainer.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };
  
  // Scroll to overview (top)
  const scrollToOverview = () => {
    if (!mainScrollRef.current) return;
    
    mainScrollRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Render unconfigured module placeholder
  const renderUnconfiguredModule = (moduleName: string) => {
    return (
      <div>
        <h3 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-4)',
          fontFamily: "'Inter', sans-serif",
        }}>
          {moduleName}
        </h3>
        <div
          style={{
            padding: 'var(--spacing-8)',
            backgroundColor: 'var(--muted)',
            borderRadius: 'var(--radius)',
            border: '1px dashed var(--border)',
            textAlign: 'center',
          }}
        >
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            fontFamily: "'Inter', sans-serif",
          }}>
            Module not yet configured. Configure this module in the template builder.
          </p>
        </div>
      </div>
    );
  };
  
  // Render table representation
  const renderTableRepresentation = (config: any) => {
    return (
      <div>
        <h3 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-4)',
          fontFamily: "'Inter', sans-serif",
        }}>
          {config.title || 'Data Table'}
        </h3>
        <div 
          style={{ 
            border: `1px solid var(--border)`,
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          {/* Table header */}
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              backgroundColor: 'var(--muted)',
            }}
          >
            {['Item', 'Status', 'Inspector', 'Date'].map((col, i) => (
              <div 
                key={`table-header-${i}`}
                style={{ 
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semi-bold)',
                  color: 'var(--foreground)',
                  fontFamily: "'Inter', sans-serif",
                  borderRight: i < 3 ? `1px solid var(--border)` : 'none',
                }}
              >
                {col}
              </div>
            ))}
          </div>
          {/* Table rows */}
          {[
            ['Equipment A', 'Passed', 'J. Smith', '02/20/2026'],
            ['Equipment B', 'Failed', 'M. Johnson', '02/21/2026'],
            ['Equipment C', 'Passed', 'J. Smith', '02/22/2026'],
            ['Equipment D', 'Pending', 'K. Williams', '02/23/2026'],
          ].map((row, rowIndex) => (
            <div 
              key={`table-row-${rowIndex}`}
              style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                backgroundColor: rowIndex % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.5)',
                borderTop: `1px solid var(--border)`,
              }}
            >
              {row.map((cell, colIndex) => (
                <div 
                  key={`table-cell-${rowIndex}-${colIndex}`}
                  style={{ 
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    fontFamily: "'Inter', sans-serif",
                    borderRight: colIndex < 3 ? `1px solid var(--border)` : 'none',
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render chart representation  
  const renderChartRepresentation = (config: any) => {
    const chartType = config.chartType || 'bar';
    
    return (
      <div>
        <h3 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-4)',
          fontFamily: "'Inter', sans-serif",
        }}>
          {config.title || 'Chart'}
        </h3>
        <div 
          style={{ 
            backgroundColor: 'var(--card)',
            borderRadius: 'var(--radius)',
            border: `1px solid var(--border)`,
            padding: 'var(--spacing-6)',
          }}
        >
          {/* Chart placeholder with bars */}
          <div 
            style={{ 
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '240px',
              borderBottom: `1px solid var(--border)`,
              borderLeft: `1px solid var(--border)`,
              padding: 'var(--spacing-4)',
            }}
          >
            {[
              { height: 65, label: 'Jan' },
              { height: 82, label: 'Feb' },
              { height: 58, label: 'Mar' },
              { height: 91, label: 'Apr' },
              { height: 75, label: 'May' },
            ].map((bar, i) => (
              <div 
                key={`chart-bar-${i}`}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                }}
              >
                <div 
                  style={{ 
                    width: '48px',
                    height: `${bar.height}%`,
                    backgroundColor: 'var(--primary)',
                    opacity: 0.8,
                    borderRadius: `var(--radius-xs) var(--radius-xs) 0 0`,
                  }}
                />
                <span style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--muted-foreground)',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--muted-foreground)',
            marginTop: 'var(--spacing-3)',
            fontFamily: "'Inter', sans-serif",
            textAlign: 'center',
          }}>
            Chart Type: {chartType} • X-Axis: {config.xAxisField || 'Not configured'} • Y-Axis: {config.yAxisField || 'Not configured'}
          </p>
        </div>
      </div>
    );
  };
  
  // Render heatmap representation
  const renderHeatmapRepresentation = (config: any) => {
    // Sample heatmap data
    const yLabels = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
    const xLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    const heatmapData = [
      [85, 72, 91, 68],
      [64, 88, 75, 82],
      [92, 81, 69, 95],
      [78, 86, 94, 73],
    ];
    
    const getHeatmapColor = (value: number) => {
      if (value >= 90) return 'rgb(16, 185, 129)'; // emerald-500
      if (value >= 75) return 'rgb(34, 197, 94)';  // green-400
      if (value >= 60) return 'rgb(250, 204, 21)'; // yellow-400
      if (value >= 45) return 'rgb(251, 146, 60)'; // orange-400
      return 'rgb(239, 68, 68)'; // red-400
    };
    
    return (
      <div>
        <h3 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-4)',
          fontFamily: "'Inter', sans-serif",
        }}>
          {config.title || 'Heatmap'}
        </h3>
        <div 
          style={{ 
            backgroundColor: 'var(--card)',
            borderRadius: 'var(--radius)',
            border: `1px solid var(--border)`,
            padding: 'var(--spacing-4)',
            overflow: 'auto',
          }}
        >
          <div style={{ display: 'inline-block', minWidth: '100%' }}>
            {/* Heatmap Grid */}
            <div style={{ display: 'flex', gap: '2px' }}>
              {/* Y-axis labels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '28px' }}>
                {yLabels.map((label, i) => (
                  <div
                    key={`y-label-${i}`}
                    style={{
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingRight: 'var(--spacing-2)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--foreground)',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              
              {/* Heatmap cells */}
              <div>
                {/* X-axis labels */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                  {xLabels.map((label, i) => (
                    <div
                      key={`x-label-${i}`}
                      style={{
                        width: '80px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--foreground)',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                
                {/* Heatmap rows */}
                {heatmapData.map((row, rowIndex) => (
                  <div key={`heatmap-row-${rowIndex}`} style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                    {row.map((value, colIndex) => (
                      <div
                        key={`heatmap-cell-${rowIndex}-${colIndex}`}
                        style={{
                          width: '80px',
                          height: '48px',
                          backgroundColor: getHeatmapColor(value),
                          borderRadius: 'var(--radius-xs)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-semi-bold)',
                          color: 'white',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--muted-foreground)',
            marginTop: 'var(--spacing-3)',
            fontFamily: "'Inter', sans-serif",
            textAlign: 'center',
          }}>
            X-Axis: {config.xAxisField || 'Not configured'} • Y-Axis: {config.yAxisField || 'Not configured'} • Value: {config.valueField || 'Not configured'}
          </p>
        </div>
      </div>
    );
  };
  
  // Render insights representation
  const renderInsightsRepresentation = (config: any) => {
    const narrativeDepth = config.narrativeDepth || 'executive';
    
    return (
      <div>
        <h3 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-4)',
          fontFamily: "'Inter', sans-serif",
        }}>
          {config.title || 'AI-Generated Insights'}
        </h3>
        <div 
          style={{ 
            backgroundColor: 'var(--card)',
            borderRadius: 'var(--radius)',
            border: `1px solid var(--border)`,
            padding: 'var(--spacing-6)',
          }}
        >
          {/* Insights content */}
          <div style={{ 
            fontSize: 'var(--text-base)', 
            color: 'var(--foreground)',
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.7,
          }}>
            <p style={{ marginBottom: 'var(--spacing-4)' }}>
              The inspection data reveals several critical patterns requiring immediate attention. 
              The structural integrity assessment indicates moderate compliance levels across Zone A and Zone B, 
              with notable deficiencies in anchor bolt systems.
            </p>
            {narrativeDepth === 'detailed' && (
              <>
                <p style={{ marginBottom: 'var(--spacing-4)' }}>
                  Analysis of failure distributions shows concentrated issues in specific rack sections, 
                  particularly affecting load-bearing components. The correlation between environmental 
                  factors and degradation rates suggests accelerated maintenance schedules may be warranted.
                </p>
                <p style={{ marginBottom: 'var(--spacing-4)' }}>
                  Comparative benchmarking against industry standards indicates performance within acceptable 
                  ranges for most parameters, though outliers in specific measurement categories warrant 
                  targeted remediation efforts.
                </p>
              </>
            )}
            <p style={{
              padding: 'var(--spacing-3)',
              backgroundColor: 'var(--muted)',
              borderRadius: 'var(--radius)',
              borderLeft: `3px solid var(--primary)`,
              fontSize: 'var(--text-sm)',
              fontStyle: 'italic',
            }}>
              <strong>Key Recommendation:</strong> Prioritize corrective actions for high-severity findings 
              within the next 30 days to maintain operational safety standards.
            </p>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--muted-foreground)',
            marginTop: 'var(--spacing-4)',
            fontFamily: "'Inter', sans-serif",
            textAlign: 'center',
          }}>
            Narrative Depth: {narrativeDepth} • Data Source: {config.dataSource || 'All inspection data'}
          </p>
        </div>
      </div>
    );
  };
  
  // Render module content (export-ready style)
  const renderModuleContent = (module: any, sectionIndex: number, moduleIndex: number) => {
    const { representationType, config, contentBlocks, name, type } = module;
    
    // Helper function to render representation block
    const renderRepresentation = () => {
      // Handle special content blocks that don't have representations
      if (type === 'TextBlock' || type === 'Divider') {
        return null;
      }
      
      // If module is configured with a representation type, render it
      if (config?.isSaved && representationType) {
        switch (representationType) {
          case 'table':
            return renderTableRepresentation(config);
          case 'chart':
            return renderChartRepresentation(config);
          case 'heatmap':
            return renderHeatmapRepresentation(config);
          case 'insights':
            return renderInsightsRepresentation(config);
          default:
            return renderUnconfiguredModule(name);
        }
      }
      
      // Fallback for unconfigured modules
      return renderUnconfiguredModule(name);
    };
    
    // Helper function to render content blocks (text and dividers)
    const renderContentBlocks = () => {
      if (!contentBlocks || contentBlocks.length === 0) {
        return null;
      }
      
      return (
        <div style={{ marginTop: 'var(--spacing-6)' }}>
          {contentBlocks.map((block: any) => {
            if (block.type === 'divider') {
              return (
                <div
                  key={block.id}
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--border)',
                    margin: 'var(--spacing-6) 0',
                  }}
                />
              );
            }
            
            if (block.type === 'text') {
              return (
                <div
                  key={block.id}
                  style={{
                    marginBottom: 'var(--spacing-4)',
                  }}
                >
                  {block.mode === 'static' ? (
                    <textarea
                      value={block.content || ''}
                      onChange={(e) => handleContentBlockChange(sectionIndex, moduleIndex, block.id, e.target.value)}
                      placeholder="Type observations or notes here..."
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: 'var(--spacing-4)',
                        fontSize: 'var(--text-base)',
                        color: 'var(--foreground)',
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.7,
                        border: `1px solid var(--border)`,
                        borderRadius: 'var(--radius)',
                        backgroundColor: 'var(--background)',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        padding: 'var(--spacing-4)',
                        backgroundColor: 'var(--muted)',
                        borderRadius: 'var(--radius)',
                        border: '1px dashed var(--border)',
                      }}
                    >
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--muted-foreground)',
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: 'italic',
                      }}>
                        Dynamic insight placeholder - Content will be generated from system data
                      </p>
                    </div>
                  )}
                </div>
              );
            }
            
            return null;
          })}
        </div>
      );
    };
    
    return (
      <div>
        {renderRepresentation()}
        {renderContentBlocks()}
      </div>
    );
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center h-screen" 
        style={{ 
          backgroundColor: 'var(--background)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="flex flex-col items-center" style={{ gap: 'var(--spacing-3)' }}>
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--primary)' }} />
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-normal)',
          }}>
            Loading report...
          </p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (!report) {
    return (
      <div 
        className="flex items-center justify-center h-screen" 
        style={{ 
          backgroundColor: 'var(--background)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div 
          className="flex flex-col items-center text-center" 
          style={{ 
            gap: 'var(--spacing-3)', 
            maxWidth: '28rem' 
          }}
        >
          <AlertCircle className="h-12 w-12" style={{ color: 'var(--destructive)' }} />
          <h3 style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: 'var(--font-weight-semi-bold)',
            color: 'var(--foreground)',
          }}>
            Report Not Found
          </h3>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-normal)',
          }}>
            The report you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/report')} style={{ marginTop: 'var(--spacing-4)' }}>
            Return to Reports
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="flex flex-col h-screen" 
      style={{ 
        backgroundColor: 'var(--background)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ========================================= */}
      {/* STICKY TOP ACTION BAR                    */}
      {/* ========================================= */}
      <header 
        className="h-14 border-b border-border flex items-center justify-between px-6 bg-background shrink-0 z-30"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="mr-1 h-8 w-8" onClick={() => navigate('/report')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <Input 
                  ref={titleInputRef}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleTitleKeyDown}
                  className="h-8 text-lg font-semibold border-border px-1 focus-visible:ring-0 w-[300px] bg-transparent" 
                />
              ) : (
                <Input 
                  value={report.name}
                  onClick={handleTitleEdit}
                  readOnly
                  className="h-8 text-lg font-semibold border-border px-1 focus-visible:ring-0 w-[300px] bg-transparent cursor-pointer hover:border-primary/50 transition-colors" 
                />
              )}
              <Badge 
                variant={report.status === 'Draft' ? 'secondary' : 'default'}
                className={cn(report.status === "Published" && "bg-green-100 text-green-700 hover:bg-green-200")}
              >
                {report.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 font-medium hover:bg-muted" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button onClick={() => setShowSaveModal(true)} size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={() => setShowDownloadModal(true)} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </header>
      
      {/* ========================================= */}
      {/* MAIN LAYOUT: Sidebar + Document Canvas   */}
      {/* ========================================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* ========================================= */}
        {/* LEFT SIDEBAR - Section Navigation        */}
        {/* ========================================= */}
        <aside 
          className="flex-shrink-0 overflow-y-auto"
          style={{ 
            width: '260px',
            backgroundColor: 'var(--background)',
            borderRight: `1px solid var(--border)`,
            padding: 'var(--spacing-6) 0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '0 var(--spacing-4)', 
            marginBottom: 'var(--spacing-4)',
          }}>
            <h3 style={{ 
              fontSize: 'var(--text-xs)', 
              fontWeight: 'var(--font-weight-semi-bold)',
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: "'Inter', sans-serif",
              margin: 0,
            }}>
              Contents
            </h3>
          </div>
          
          {/* Navigation Items */}
          <nav style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--spacing-1)',
            padding: '0 var(--spacing-3)',
          }}>
            {/* Overview - Always present */}
            <button
              onClick={scrollToOverview}
              className={cn("w-full text-left transition-all")}
              style={{
                padding: 'var(--spacing-2) var(--spacing-3)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                backgroundColor: activeSection === 'overview' ? 'var(--accent)' : 'transparent',
                borderRadius: 'var(--radius)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (activeSection !== 'overview') {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== 'overview') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: activeSection === 'overview' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                color: activeSection === 'overview' ? 'var(--accent-foreground)' : 'var(--foreground)',
                transition: 'color 0.15s ease',
                fontFamily: "'Inter', sans-serif",
              }}>
                Overview
              </span>
            </button>
            
            {/* Section Divider */}
            {reportSections.length > 0 && (
              <div style={{
                height: '1px',
                backgroundColor: 'var(--border)',
                margin: 'var(--spacing-2) 0',
              }} />
            )}
            
            {/* Section list */}
            {reportSections.length > 0 && (
              <>
                {reportSections.map((section, index) => {
                  const sectionId = `${index}`;
                  return (
                    <button
                      key={sectionId}
                      onClick={() => scrollToSection(sectionId)}
                      className={cn("w-full text-left transition-all")}
                      style={{
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        backgroundColor: activeSection === sectionId ? 'var(--accent)' : 'transparent',
                        borderRadius: 'var(--radius)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (activeSection !== sectionId) {
                          e.currentTarget.style.backgroundColor = 'var(--accent)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeSection !== sectionId) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span style={{ 
                        fontSize: 'var(--text-sm)', 
                        fontWeight: activeSection === sectionId ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                        color: activeSection === sectionId ? 'var(--accent-foreground)' : 'var(--foreground)',
                        transition: 'color 0.15s ease',
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        {section.title || `Section ${index + 1}`}
                      </span>
                    </button>
                  );
                })}
              </>
            )}
          </nav>
        </aside>
        
        {/* ========================================= */}
        {/* MAIN DOCUMENT CANVAS                     */}
        {/* ========================================= */}
        <main 
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto"
          style={{ 
            backgroundColor: 'rgba(249, 250, 251, 1)',
            padding: 'var(--spacing-12) var(--spacing-8)',
          }}
        >
          {/* Centered White Document Canvas */}
          <div 
            className="mx-auto"
            style={{ 
              maxWidth: '1000px',
              backgroundColor: 'var(--card)',
              borderRadius: 'var(--radius)',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              padding: 'var(--spacing-12)',
              minHeight: 'calc(100vh - 200px)',
            }}
          >
            {/* ========================================= */}
            {/* DOCUMENT HEADER                          */}
            {/* ========================================= */}
            <div 
              ref={documentHeaderRef}
              id="section-overview"
              style={{ marginBottom: 'calc(var(--spacing-12) * 1.5)' }}
            >
              <h1 style={{ 
                fontSize: 'calc(var(--text-4xl) * 1.1)', 
                fontWeight: 'var(--font-weight-extra-bold)',
                color: 'var(--foreground)',
                marginBottom: 'calc(var(--spacing-10) * 1.2)',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}>
                {report.name}
              </h1>
              
              {/* Metadata Grid */}
              <div 
                className="grid grid-cols-3"
                style={{ gap: 'var(--spacing-12)', marginBottom: 'calc(var(--spacing-10) * 1.2)' }}
              >
                {/* Site */}
                <div>
                  <p style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--muted-foreground)',
                    marginBottom: 'var(--spacing-2)',
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    Site
                  </p>
                  <p style={{ 
                    fontSize: 'var(--text-base)', 
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.5,
                  }}>
                    {report.site || 'Not specified'}
                  </p>
                </div>
                
                {/* Inspection Date */}
                <div>
                  <p style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--muted-foreground)',
                    marginBottom: 'var(--spacing-2)',
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    Inspection Date
                  </p>
                  <p style={{ 
                    fontSize: 'var(--text-base)', 
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.5,
                  }}>
                    {report.inspectionDate 
                      ? new Date(report.inspectionDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : '24 February 2026'}
                  </p>
                </div>
                
                {/* Template */}
                <div>
                  <p style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--muted-foreground)',
                    marginBottom: 'var(--spacing-2)',
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    Template
                  </p>
                  <p style={{ 
                    fontSize: 'var(--text-base)', 
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.5,
                  }}>
                    {template ? `${template.name} v${template.version}` : 'None'}
                  </p>
                </div>
              </div>
              
              {/* Divider */}
              <div 
                style={{ 
                  height: '1px',
                  backgroundColor: 'var(--border)',
                  opacity: 0.6,
                }}
              />
            </div>
            
            {/* ========================================= */}
            {/* REPORT CONTENT (Sections & Modules)      */}
            {/* ========================================= */}
            {reportSections.length === 0 ? (
              <div 
                className="flex flex-col items-center justify-center text-center"
                style={{ 
                  padding: 'var(--spacing-12)',
                }}
              >
                <AlertCircle 
                  className="h-12 w-12" 
                  style={{ 
                    color: 'var(--muted-foreground)',
                    marginBottom: 'var(--spacing-4)',
                  }} 
                />
                <h3 style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  No Content Available
                </h3>
                <p 
                  className="max-w-md"
                  style={{ 
                    fontSize: 'var(--text-sm)', 
                    color: 'var(--muted-foreground)',
                    fontWeight: 'var(--font-weight-normal)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  This report has no sections or content yet.
                </p>
              </div>
            ) : (
              <div>
                {reportSections.map((section, index) => {
                  const sectionId = `${index}`;
                  
                  return (
                    <div
                      key={sectionId}
                      id={`section-${sectionId}`}
                      style={{ 
                        marginTop: index === 0 ? 0 : 'calc(var(--spacing-12) * 1.5)',
                        paddingTop: index === 0 ? 0 : 'calc(var(--spacing-12) * 0.5)',
                      }}
                    >
                      {/* Section Label + Heading */}
                      <div style={{ marginBottom: 'calc(var(--spacing-8) * 1.2)' }}>
                        <p style={{ 
                          fontSize: 'var(--text-xs)', 
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--muted-foreground)',
                          marginBottom: 'var(--spacing-3)',
                          fontFamily: "'Inter', sans-serif",
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                        }}>
                          Section {index + 1}
                        </p>
                        <h2 style={{ 
                          fontSize: 'calc(var(--text-2xl) * 1.05)', 
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--foreground)',
                          fontFamily: "'Inter', sans-serif",
                          lineHeight: 1.25,
                          letterSpacing: '-0.01em',
                        }}>
                          {section.title || `Section ${index + 1}`}
                        </h2>
                      </div>
                      
                      {section.description && (
                        <p style={{ 
                          fontSize: 'var(--text-base)', 
                          color: 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-normal)',
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: 'calc(var(--spacing-8) * 1.2)',
                          lineHeight: 1.7,
                          maxWidth: '85%',
                        }}>
                          {section.description}
                        </p>
                      )}
                      
                      {/* Module Content */}
                      {section.modules && section.modules.length > 0 ? (
                        <div>
                          {section.modules.map((module: any, moduleIndex: number) => (
                            <div
                              key={`${sectionId}-${module.id || moduleIndex}`}
                              style={{
                                marginTop: moduleIndex === 0 ? 'var(--spacing-8)' : 'calc(var(--spacing-10) * 1.3)',
                              }}
                            >
                              {renderModuleContent(module, index, moduleIndex)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p 
                          style={{ 
                            fontSize: 'var(--text-sm)', 
                            color: 'var(--muted-foreground)',
                            fontStyle: 'italic',
                            fontWeight: 'var(--font-weight-normal)',
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          No content in this section
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Save Report Modal */}
      <SaveReportModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        reportName={report.name}
        reportStatus={report.status}
        templateName={template ? `${template.name} v${template.version}` : 'None'}
        onSave={handleSave}
      />
      
      {/* Download Report Modal */}
      <DownloadReportModal
        open={showDownloadModal}
        onOpenChange={setShowDownloadModal}
        reportName={report.name}
        reportId={reportId}
      />
      
      {/* Debug Cache Panel */}
      <DebugCachePanel />
    </div>
  );
}