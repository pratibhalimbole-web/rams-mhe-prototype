import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTemplateStore } from '@/app/stores/templateStore';
import { useReportStore } from '@/app/stores/reportStore';
import { ReportCreationWizard } from './ReportCreationWizard';
import { toast } from 'sonner';
import { cn } from '@/app/components/ui/utils';
import { 
  AlertCircle, 
  Search, 
  Plus, 
  ArrowRight, 
  Pin, 
  PinOff, 
  FileText, 
  Download, 
  Copy, 
  Archive, 
  Trash2, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/app/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { reportService } from '@/app/services/reportService';

export function ReportDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [pinnedReportIds, setPinnedReportIds] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Use stores
  const { templates, setTemplates } = useTemplateStore();
  const { reports, setReports } = useReportStore();

  // Report Creation Wizard State
  const [isReportWizardOpen, setIsReportWizardOpen] = useState(false);
  
  // Add a refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // DEBUG: Add state to track what's happening - REMOVED, no longer needed
  // const [debugInfo, setDebugInfo] = useState<{
  //   lastFetch: string;
  //   reportsInStore: number;
  //   reportsFromServer: number;
  //   reportIds: string[];
  // } | null>(null);

  // Load data on mount and whenever we navigate to this page
  useEffect(() => {
    async function loadData() {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 ========================================');
        console.log('🔄 ReportDashboard: LOADING DATA');
        console.log('🔄 ========================================');
        console.log('📍 Current pathname:', location.pathname);
        console.log('🔢 Refresh trigger:', refreshTrigger);
        console.log('📊 Current reports in store:', reports.length);
        console.log('📋 Report IDs in store:', reports.map((r: any) => r.id));
        console.log('📋 Report names in store:', reports.map((r: any) => r.name));
      }
      
      setLoading(true);
      setServerError(null);
      
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('🌐 Fetching data from server...');
        }
        
        const [reportsData, templatesData] = await Promise.all([
          reportService.getReports().catch((err) => {
            console.error("❌ Failed to fetch reports:", err);
            
            // Check if it's a network error
            if (err.message?.includes('Network offline') || err.message?.includes('Unable to connect to server')) {
              setServerError('Running in offline mode. Changes will be saved locally.');
            }
            
            return [];
          }),
          reportService.getTemplates().catch((err) => {
            console.error("❌ Failed to fetch templates:", err);
            
            // Check if it's a network error
            if (err.message?.includes('Network offline') || err.message?.includes('Unable to connect to server')) {
              setServerError('Running in offline mode. Changes will be saved locally.');
            }
            
            return [];
          }),
        ]);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ ========================================');
          console.log('✅ DATA FETCHED FROM SERVER!');
          console.log('✅ ========================================');
          console.log('📊 Reports received:', reportsData.length);
          console.log('📋 Report IDs from server:', reportsData.map((r: any) => r.id));
          console.log('📋 Report names from server:', reportsData.map((r: any) => r.name));
          console.log('📋 Report statuses:', reportsData.map((r: any) => ({ id: r.id, name: r.name, status: r.status })));
          console.log('📚 Templates received:', templatesData.length);
          console.log('');
          console.log('💾 Setting reports in store...');
        }
        
        setReports(reportsData);
        setTemplates(templatesData);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Reports and templates set in store!');
        }
        
        // Load pinned reports from localStorage
        const savedPinnedIds = localStorage.getItem('pinnedReportIds');
        if (savedPinnedIds) {
          setPinnedReportIds(JSON.parse(savedPinnedIds));
        }
        
        // DEBUG: Update debug info
        // setDebugInfo({
        //   lastFetch: new Date().toISOString(),
        //   reportsInStore: reportsData.length,
        //   reportsFromServer: reportsData.length,
        //   reportIds: reportsData.map((r: any) => r.id),
        // });
      } catch (error: any) {
        console.error("❌ Failed to load dashboard data:", error);
        
        // Set server error for critical failures
        if (error.message?.includes('Network offline') || error.message?.includes('Unable to connect')) {
          setServerError('Running in offline mode. Changes will be saved locally.');
        }
      } finally {
        setLoading(false);
        if (process.env.NODE_ENV === 'development') {
          console.log('🏁 Loading complete!');
          console.log('========================================');
        }
      }
    }
    loadData();
  }, [location.pathname, refreshTrigger]); // REMOVED setReports, setTemplates to prevent dependency issues
  
  // Add visibility change listener to reload data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible, trigger a refresh
        setRefreshTrigger(prev => prev + 1);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleCreateReport = () => {
    setIsReportWizardOpen(true);
  };

  const togglePin = (reportId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    let newPinnedIds: string[];
    
    if (pinnedReportIds.includes(reportId)) {
      newPinnedIds = pinnedReportIds.filter(id => id !== reportId);
      toast.success("Report unpinned");
    } else {
      if (pinnedReportIds.length >= 5) {
        toast.error("Maximum 5 reports can be pinned");
        return;
      }
      newPinnedIds = [...pinnedReportIds, reportId];
      toast.success("Report pinned");
    }
    
    setPinnedReportIds(newPinnedIds);
    localStorage.setItem('pinnedReportIds', JSON.stringify(newPinnedIds));
  };

  // Get pinned reports
  const pinnedReports = reports
    .filter(r => pinnedReportIds.includes(r.id))
    .slice(0, 5);

  // Get recent reports (system-controlled, top 5 by last activity, excluding pinned)
  const recentReports = reports
    .filter(r => !pinnedReportIds.includes(r.id))
    .sort((a, b) => {
      const dateA = new Date(a.lastActivityAt || a.inspectionDate || 0).getTime();
      const dateB = new Date(b.lastActivityAt || b.inspectionDate || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  // Filter and sort all reports
  const filteredReports = reports
    .filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           r.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           r.site.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.inspectionDate || 0).getTime() - new Date(a.inspectionDate || 0).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  if (loading) {
    return (
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: 'var(--background)',
        }}
      >
        <div 
          style={{
            width: '32px',
            height: '32px',
            borderTop: '2px solid var(--primary)',
            borderRight: '2px solid transparent',
            borderBottom: '2px solid transparent',
            borderLeft: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div 
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        
        {/* SERVER ERROR BANNER */}
        {serverError && (
          <div
            style={{
              backgroundColor: 'var(--destructive)',
              color: 'white',
              padding: 'var(--spacing-4) var(--spacing-5)',
              borderRadius: 'var(--radius-lg)',
              marginTop: 'var(--spacing-6)',
              marginBottom: 'var(--spacing-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertCircle className="h-5 w-5" />
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semi-bold)',
                  marginBottom: 'var(--spacing-1)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Server Connection Error
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  fontFamily: "'Inter', sans-serif",
                  opacity: 0.95,
                }}
              >
                {serverError}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'var(--destructive)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Retry
            </Button>
          </div>
        )}
        
        {/* 1. PAGE HEADER */}
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--spacing-8)',
            paddingBottom: 'var(--spacing-8)',
          }}
        >
          {/* Left: Search Input */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
              style={{ color: 'var(--muted-foreground)' }}
            />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: 'var(--spacing-10)',
                fontSize: 'var(--text-sm)',
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>

          {/* Right: Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
            {/* FORCE REFRESH BUTTON - Reconnects to DB and refreshes data */}
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (process.env.NODE_ENV === 'development') {
                  console.log('🔄 FORCE REFRESH CLICKED - Reconnecting to database...');
                }
                try {
                  // Force the server to reconnect to the database
                  const response = await fetch(
                    `https://${projectId}.supabase.co/functions/v1/make-server-02ca646a/reconnect-db`,
                    {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${publicAnonKey}`,
                      },
                    }
                  );
                  const result = await response.json();
                  if (process.env.NODE_ENV === 'development') {
                    console.log('📊 Database reconnection result:', result);
                  }
                  
                  if (result.storage === 'database') {
                    toast.success('Connected to database!');
                  } else {
                    // Show detailed error
                    const errorMsg = result.errorDetails 
                      ? `${result.errorDetails.message} (Code: ${result.errorDetails.code})`
                      : result.message;
                    toast.error(errorMsg, { duration: 8000 });
                    console.error('❌ Database error:', result.errorDetails);
                  }
                } catch (error) {
                  console.error('Failed to reconnect:', error);
                  toast.error('Failed to reconnect to database');
                }
                
                // Then trigger a data refresh
                setRefreshTrigger(prev => prev + 1);
              }}
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              🔄 Refresh
            </Button>
            
            <button
              onClick={() => navigate('/report/templates')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                fontFamily: "'Inter', sans-serif",
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--foreground)';
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--muted-foreground)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Manage Templates
              <ArrowRight className="h-4 w-4" />
            </button>

            <Button 
              onClick={handleCreateReport}
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Report
            </Button>
          </div>
        </div>

        {/* 2. PINNED REPORTS SECTION */}
        {pinnedReports.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-10)' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                marginBottom: 'var(--spacing-5)',
              }}
            >
              <Pin className="h-4 w-4" style={{ color: 'var(--foreground)' }} />
              <h2 
                style={{ 
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semi-bold)',
                  color: 'var(--foreground)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Pinned Reports
              </h2>
            </div>
            
            <div 
              style={{ 
                display: 'flex',
                gap: 'var(--spacing-4)',
                overflowX: 'auto',
                paddingBottom: 'var(--spacing-2)',
              }}
            >
              {pinnedReports.map((report) => (
                <Card
                  key={report.id}
                  onClick={() => navigate(`/report/${report.id}`)}
                  style={{
                    minWidth: '280px',
                    padding: 'var(--spacing-5)',
                    border: `1px solid var(--border)`,
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--card)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <h3 
                      style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semi-bold)',
                        color: 'var(--foreground)',
                        fontFamily: "'Inter', sans-serif",
                        flex: 1,
                      }}
                    >
                      {report.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => togglePin(report.id, e)}
                      style={{
                        width: '16px',
                        height: '16px',
                        padding: 0,
                        flexShrink: 0,
                      }}
                    >
                      <Pin className="h-4 w-4" style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
                    </Button>
                  </div>
                  
                  <Badge 
                    variant={report.status === "Published" || report.status === "Final" ? "default" : "secondary"}
                    className={cn(
                      "font-normal text-xs w-fit",
                      report.status === "Published" && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                      report.status === "Final" && "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
                      (!report.status || report.status === "Draft") && "bg-muted text-muted-foreground"
                    )}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {report.status || 'Draft'}
                  </Badge>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {report.templateName}
                    </p>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {report.inspectionDate ? format(new Date(report.inspectionDate), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 3. RECENT REPORTS SECTION */}
        {reports.length >= 3 && recentReports.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-10)' }}>
            <h2 
              style={{ 
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--foreground)',
                marginBottom: 'var(--spacing-5)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Recent Reports
            </h2>
            
            <div 
              style={{ 
                display: 'flex',
                gap: 'var(--spacing-4)',
                overflowX: 'auto',
                paddingBottom: 'var(--spacing-2)',
              }}
            >
              {recentReports.map((report) => (
                <Card
                  key={report.id}
                  onClick={() => navigate(`/report/${report.id}`)}
                  style={{
                    minWidth: '280px',
                    padding: 'var(--spacing-5)',
                    border: `1px solid var(--border)`,
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--card)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <h3 
                      style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semi-bold)',
                        color: 'var(--foreground)',
                        fontFamily: "'Inter', sans-serif",
                        flex: 1,
                      }}
                    >
                      {report.name}
                    </h3>
                    <ArrowRight className="h-4 w-4" style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                  </div>
                  
                  <Badge 
                    variant={report.status === "Published" || report.status === "Final" ? "default" : "secondary"}
                    className={cn(
                      "font-normal text-xs w-fit",
                      report.status === "Published" && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                      report.status === "Final" && "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
                      (!report.status || report.status === "Draft") && "bg-muted text-muted-foreground"
                    )}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {report.status || 'Draft'}
                  </Badge>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {report.templateName}
                    </p>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {report.inspectionDate ? format(new Date(report.inspectionDate), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 4. ALL REPORTS SECTION */}
        <div style={{ marginBottom: 'var(--spacing-10)' }}>
          <h2 
            style={{ 
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-semi-bold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-5)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            All Reports
          </h2>

          {/* Empty State */}
          {reports.length === 0 ? (
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-16) var(--spacing-8)',
                border: `2px dashed var(--border)`,
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--muted)',
                textAlign: 'center',
              }}
            >
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--background)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--spacing-4)',
                }}
              >
                <FileText className="h-6 w-6" style={{ color: 'var(--muted-foreground)' }} />
              </div>
              <h3 
                style={{ 
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semi-bold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Create your first report
              </h3>
              <p 
                style={{ 
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  marginBottom: 'var(--spacing-5)',
                  maxWidth: '400px',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Get started by creating a report using one of the available templates.
              </p>
              <Button 
                onClick={handleCreateReport}
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Create Report
              </Button>
            </div>
          ) : (
            <Card style={{ borderRadius: 'var(--radius-xl)', gap: 0 }}>
              {/* CARD HEADER - Filters and Search */}
              <CardHeader className="border-b" style={{ paddingBottom: 'var(--spacing-4)' }}>
                <div 
                  style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--spacing-3)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1 }}>
                    <div style={{ position: 'relative', minWidth: '320px' }}>
                      <Search 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                        style={{ color: 'var(--muted-foreground)' }}
                      />
                      <Input
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          paddingLeft: 'var(--spacing-10)',
                          fontSize: 'var(--text-sm)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger style={{ width: '160px' }}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Final">Ready</SelectItem>
                        <SelectItem value="Published">Downloaded</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger style={{ width: '160px' }}>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <p 
                    style={{ 
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)',
                      fontFamily: "'Inter', sans-serif",
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {filteredReports.length} {filteredReports.length === 1 ? 'Report' : 'Reports'}
                  </p>
                </div>
              </CardHeader>

              {/* CARD CONTENT - Table */}
              <CardContent style={{ padding: 0 }}>
                {/* Table Header */}
                <div 
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 200px 120px 80px',
                    gap: 'var(--spacing-4)',
                    padding: 'var(--spacing-3) var(--spacing-6)',
                    borderBottom: `1px solid var(--border)`,
                    backgroundColor: 'var(--muted/30)',
                  }}
                >
                  <div></div>
                  <div 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--muted-foreground)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Report Name
                  </div>
                  <div 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--muted-foreground)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Template
                  </div>
                  <div 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--muted-foreground)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Date
                  </div>
                  <div 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--muted-foreground)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: "'Inter', sans-serif",
                      textAlign: 'center',
                    }}
                  >
                    Status
                  </div>
                </div>

                {/* Table Rows */}
                {paginatedReports.map((report, index) => (
                  <div
                    key={report.id}
                    onClick={() => navigate(`/report/${report.id}`)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 200px 120px 80px',
                      gap: 'var(--spacing-4)',
                      alignItems: 'center',
                      padding: 'var(--spacing-4) var(--spacing-6)',
                      borderBottom: index !== paginatedReports.length - 1 ? `1px solid var(--border)` : 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    className="group hover:bg-muted/50"
                  >
                    {/* Report Icon with Pin Indicator */}
                    <div 
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      <FileText className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />
                      {pinnedReportIds.includes(report.id) && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Pin className="h-2.5 w-2.5" style={{ color: 'white', fill: 'white' }} />
                        </div>
                      )}
                    </div>

                    {/* Report Name & Site */}
                    <div style={{ minWidth: 0 }}>
                      <h3 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--foreground)',
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: 'var(--spacing-1)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {report.name}
                      </h3>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          fontFamily: "'Inter', sans-serif",
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {report.site}
                      </p>
                    </div>

                    {/* Template Name */}
                    <div>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted-foreground)',
                          fontFamily: "'Inter', sans-serif",
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {report.templateName}
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted-foreground)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {report.inspectionDate ? format(new Date(report.inspectionDate), "MMM d, yyyy") : "—"}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Badge 
                        variant={
                          report.status === "Published" || report.status === "Final" ? "default" : "secondary"
                        }
                        className={cn(
                          "font-normal text-xs",
                          report.status === "Published" && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                          report.status === "Final" && "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
                          (!report.status || report.status === "Draft") && "bg-muted text-muted-foreground"
                        )}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {report.status || "Draft"}
                      </Badge>
                      
                      {/* Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              color: 'var(--muted-foreground)',
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); togglePin(report.id); }}>
                            {pinnedReportIds.includes(report.id) ? (
                              <>
                                <PinOff className="mr-2 h-4 w-4" /> Unpin
                              </>
                            ) : (
                              <>
                                <Pin className="mr-2 h-4 w-4" /> Pin
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Archive className="mr-2 h-4 w-4" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* CARD FOOTER - Pagination */}
              {filteredReports.length > rowsPerPage && (
                <CardFooter className="border-t" style={{ paddingTop: 'var(--spacing-6)', justifyContent: 'flex-end' }}>
                  {/* Right-aligned group: Rows per page + Pagination */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
                    {/* Rows per page */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                      <span 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted-foreground)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Rows per page:
                      </span>
                      <Select 
                        value={String(rowsPerPage)} 
                        onValueChange={(value) => {
                          setRowsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger style={{ width: '80px' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Page info and navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                      <span 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted-foreground)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Page {currentPage} of {totalPages}
                      </span>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          style={{
                            width: '32px',
                            height: '32px',
                          }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          style={{
                            width: '32px',
                            height: '32px',
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          )}
        </div>

        {/* REPORT CREATION WIZARD MODAL */}
        <ReportCreationWizard
          open={isReportWizardOpen}
          onOpenChange={setIsReportWizardOpen}
          templates={templates}
        />

      </div>
    </div>
  );
}