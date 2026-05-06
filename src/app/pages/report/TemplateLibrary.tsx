import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Copy,
  Trash2,
  LayoutTemplate,
  Search,
  Pin,
  PinOff,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/app/components/ui/dropdown-menu";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { reportService, ReportTemplate } from '@/app/services/reportService';
import { useTemplateStore } from '@/app/stores/templateStore';
import { duplicateTemplate } from '@/app/utils/templateDuplication';
import { ReportCreationWizard } from './ReportCreationWizard';
import { DatabaseErrorModal } from './DatabaseErrorModal';
import { toast } from 'sonner';
import { cn } from '@/app/components/ui/utils';
import { useSidebar } from '@/app/components/layout/SidebarLayout';

export function TemplateLibrary() {
  const navigate = useNavigate();
  const sidebar = useSidebar();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [pinnedTemplateIds, setPinnedTemplateIds] = useState<string[]>([]);
  
  // Add a refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Report Creation Wizard State
  const [isReportWizardOpen, setIsReportWizardOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);

  // Database Error State
  const [showDatabaseError, setShowDatabaseError] = useState(false);
  const [databaseErrorMessage, setDatabaseErrorMessage] = useState<string>("");

  // Use template store
  const { templates, setTemplates } = useTemplateStore();

  useEffect(() => {
    if (sidebar) {
      sidebar.setSubPageTitle("Templates");
    }
  }, [sidebar]);

  useEffect(() => {
    async function loadTemplates() {
      setLoading(true);
      
      try {
        // Always reload from backend to get fresh data
        const templatesData = await reportService.getTemplates().catch(() => []);
        console.log('📋 Loaded templates from backend:', templatesData.map((t: any) => ({ id: t.id, name: t.name, version: t.version })));
        setTemplates(templatesData);
        
        // Load pinned templates from localStorage
        const savedPinnedIds = localStorage.getItem('pinnedTemplateIds');
        if (savedPinnedIds) {
          setPinnedTemplateIds(JSON.parse(savedPinnedIds));
        }
      } catch (error) {
        console.error("Failed to load templates:", error);
        setDatabaseErrorMessage("Failed to load templates. Please try again later.");
        setShowDatabaseError(true);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, [setTemplates, refreshTrigger]);
  
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

  const handleCreateTemplate = () => {
    navigate('/report/templates/new');
  };

  const handleEditTemplate = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    navigate(`/report/templates/${templateId}`);
  };

  const handleDuplicateTemplate = async (e: React.MouseEvent, template: ReportTemplate) => {
    e.stopPropagation();
    
    try {
      const duplicatedTemplate = duplicateTemplate(template);
      const savedTemplate = await reportService.saveTemplate(duplicatedTemplate);
      setTemplates([savedTemplate, ...templates]);
      
      toast.success("Template duplicated successfully", {
        duration: 3000,
      });
      
      setTimeout(() => {
        navigate(`/report/templates/${savedTemplate.id}`);
      }, 500);
      
    } catch (error) {
      console.error("Failed to duplicate template:", error);
      toast.error("Failed to duplicate template. Please try again.", {
        duration: 3000,
      });
    }
  };

  const handleDeleteTemplate = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      await reportService.deleteTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
      toast.success("Template deleted successfully");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template");
    }
  };

  const togglePin = (templateId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    let newPinnedIds: string[];
    
    if (pinnedTemplateIds.includes(templateId)) {
      newPinnedIds = pinnedTemplateIds.filter(id => id !== templateId);
      toast.success("Template unpinned");
    } else {
      if (pinnedTemplateIds.length >= 5) {
        toast.error("Maximum 5 templates can be pinned");
        return;
      }
      newPinnedIds = [...pinnedTemplateIds, templateId];
      toast.success("Template pinned");
    }
    
    setPinnedTemplateIds(newPinnedIds);
    localStorage.setItem('pinnedTemplateIds', JSON.stringify(newPinnedIds));
  };

  const handleUseTemplate = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    setSelectedTemplateId(templateId);
    setIsReportWizardOpen(true);
  };

  // Get pinned templates
  const pinnedTemplates = templates
    .filter(t => pinnedTemplateIds.includes(t.id))
    .slice(0, 5);

  // Get recent used templates (system-controlled, top 5 by last edited, excluding pinned)
  const recentTemplates = templates
    .filter(t => !pinnedTemplateIds.includes(t.id))
    .sort((a, b) => {
      const dateA = new Date(a.lastEdited || 0).getTime();
      const dateB = new Date(b.lastEdited || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  // Filter and sort all templates
  const filteredTemplates = templates
    .filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.lastEdited || 0).getTime() - new Date(a.lastEdited || 0).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTemplates.length / rowsPerPage);
  const paginatedTemplates = filteredTemplates.slice(
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
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: 'var(--spacing-10)',
                fontSize: 'var(--text-sm)',
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>

          {/* Right: Action Button */}
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Button 
              variant="outline"
              onClick={async () => {
                try {
                  const templates = await reportService.getTemplates();
                  console.log('🔍 DEBUG: All templates in database:', templates);
                  toast.success(`Found ${templates.length} templates - check console`);
                } catch (error) {
                  console.error('DEBUG: Failed to fetch templates:', error);
                  toast.error('Failed to fetch templates');
                }
              }}
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Debug: Check DB
            </Button>
            <Button 
              onClick={handleCreateTemplate}
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> New Template
            </Button>
          </div>
        </div>

        {/* 2. PINNED TEMPLATES SECTION */}
        {pinnedTemplates.length > 0 && (
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
                Pinned Templates
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
              {pinnedTemplates.map((template) => (
                <Card
                  key={template.id}
                  onClick={(e) => {
                    // Make card click open the wizard
                    if (!(e.target as HTMLElement).closest('button')) {
                      handleUseTemplate(e, template.id);
                    }
                  }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/report/templates/${template.id}`);
                      }}
                      style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semi-bold)',
                        color: 'var(--foreground)',
                        fontFamily: "'Inter', sans-serif",
                        flex: 1,
                        cursor: 'pointer',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      {template.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => togglePin(template.id, e)}
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
                    variant={template.status === "Published" ? "default" : "secondary"}
                    className={cn(
                      "font-normal text-xs w-fit",
                      template.status === "Published" && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                      (!template.status || template.status === "Draft") && "bg-muted text-muted-foreground"
                    )}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {template.status || 'Draft'}
                  </Badge>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {template.sections?.length || 0} Sections · {template.sections?.reduce((acc, section) => acc + (section.modules?.length || 0), 0) || 0} Modules
                    </p>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {template.lastEdited ? format(new Date(template.lastEdited), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                  
                  {/* Lightweight View Details Link */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseTemplate(e, template.id);
                    }}
                    style={{
                      width: 'fit-content',
                      padding: '0',
                      height: 'auto',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--muted-foreground)',
                      fontFamily: "'Inter', sans-serif",
                      justifyContent: 'flex-start',
                    }}
                    className="hover:text-foreground"
                  >
                    Use Template →
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 3. RECENT USED TEMPLATES SECTION */}
        {templates.length >= 3 && recentTemplates.length > 0 && (
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
              Recent Used Templates
            </h2>
            
            <div 
              style={{ 
                display: 'flex',
                gap: 'var(--spacing-4)',
                overflowX: 'auto',
                paddingBottom: 'var(--spacing-2)',
              }}
            >
              {recentTemplates.map((template) => (
                <Card
                  key={template.id}
                  onClick={(e) => {
                    // Make card click open the wizard
                    if (!(e.target as HTMLElement).closest('button')) {
                      handleUseTemplate(e, template.id);
                    }
                  }}
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
                      {template.name}
                    </h3>
                  </div>
                  
                  <Badge 
                    variant={template.status === "Published" ? "default" : "secondary"}
                    className={cn(
                      "font-normal text-xs w-fit",
                      template.status === "Published" && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                      (!template.status || template.status === "Draft") && "bg-muted text-muted-foreground"
                    )}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {template.status || 'Draft'}
                  </Badge>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {template.sections?.length || 0} Sections · {template.sections?.reduce((acc, section) => acc + (section.modules?.length || 0), 0) || 0} Modules
                    </p>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {template.lastEdited ? format(new Date(template.lastEdited), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                  
                  {/* Lightweight View Details Link */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/report/templates/${template.id}`);
                    }}
                    style={{
                      width: 'fit-content',
                      padding: '0',
                      height: 'auto',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--muted-foreground)',
                      fontFamily: "'Inter', sans-serif",
                      justifyContent: 'flex-start',
                    }}
                    className="hover:text-foreground"
                  >
                    View Details →
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 4. ALL TEMPLATES SECTION */}
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
            All Templates
          </h2>

          {/* Empty State */}
          {templates.length === 0 ? (
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
                <LayoutTemplate className="h-6 w-6" style={{ color: 'var(--muted-foreground)' }} />
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
                Create your first template
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
                Get started by creating a template to use for report generation.
              </p>
              <Button 
                onClick={handleCreateTemplate}
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> New Template
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
                        placeholder="Search templates..."
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
                        <SelectItem value="Published">Published</SelectItem>
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
                    {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Template' : 'Templates'}
                  </p>
                </div>
              </CardHeader>

              {/* CARD CONTENT - Table */}
              <CardContent style={{ padding: 0 }}>
                {/* Table Header */}
                <div 
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 120px 120px 120px 80px',
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
                    Template Name
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
                    Sections
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
                    Modules
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
                    Updated
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
                {paginatedTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 120px 120px 120px 80px',
                      gap: 'var(--spacing-4)',
                      alignItems: 'center',
                      padding: 'var(--spacing-4) var(--spacing-6)',
                      borderBottom: index !== paginatedTemplates.length - 1 ? `1px solid var(--border)` : 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    className="group hover:bg-muted/50"
                  >
                    {/* Template Icon with Pin Indicator */}
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
                      <LayoutTemplate className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />
                      {pinnedTemplateIds.includes(template.id) && (
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

                    {/* Template Name & Version */}
                    <div 
                      style={{ minWidth: 0, cursor: 'pointer' }}
                      onClick={() => navigate(`/report/templates/${template.id}`)}
                    >
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none';
                        }}
                      >
                        {template.name}
                      </h3>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        v{template.version}
                      </p>
                    </div>

                    {/* Sections */}
                    <div>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted-foreground)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {template.sections?.length || 0}
                      </p>
                    </div>

                    {/* Modules */}
                    <div>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted-foreground)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {template.sections?.reduce((acc, section) => acc + (section.modules?.length || 0), 0) || 0}
                      </p>
                    </div>

                    {/* Updated Date */}
                    <div>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted-foreground)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {template.lastEdited ? format(new Date(template.lastEdited), "MMM d, yyyy") : "—"}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Badge 
                        variant={template.status === "Published" ? "default" : "secondary"}
                        className={cn(
                          "font-normal text-xs",
                          template.status === "Published" && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                          (!template.status || template.status === "Draft") && "bg-muted text-muted-foreground"
                        )}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {template.status || "Draft"}
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
                          <DropdownMenuItem onClick={(e) => handleUseTemplate(e, template.id)}>
                            <FileText className="mr-2 h-4 w-4" /> Use Template
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); togglePin(template.id); }}>
                            {pinnedTemplateIds.includes(template.id) ? (
                              <>
                                <PinOff className="mr-2 h-4 w-4" /> Unpin
                              </>
                            ) : (
                              <>
                                <Pin className="mr-2 h-4 w-4" /> Pin
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleEditTemplate(e, template.id)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleDuplicateTemplate(e, template)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive" 
                            onClick={(e) => handleDeleteTemplate(e, template.id)}
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
              {filteredTemplates.length > rowsPerPage && (
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

      </div>

      {/* REPORT CREATION WIZARD MODAL */}
      <ReportCreationWizard
        open={isReportWizardOpen}
        onOpenChange={setIsReportWizardOpen}
        templates={templates}
        preselectedTemplateId={selectedTemplateId}
      />

      {/* DATABASE ERROR MODAL */}
      <DatabaseErrorModal
        open={showDatabaseError}
        onOpenChange={setShowDatabaseError}
        errorMessage={databaseErrorMessage}
      />
    </div>
  );
}