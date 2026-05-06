import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Search, 
  GripVertical, 
  Settings, 
  ChevronDown, 
  ChevronLeft, 
  Plus, 
  Save, 
  Trash2,
  LayoutTemplate,
  Copy,
  MoreHorizontal,
  AlertCircle,
  ArrowLeft,
  FileText,
  Minus
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Switch } from '@/app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { toast } from "sonner";
import { cn } from '@/app/components/ui/utils';
import { AddSectionModal } from './AddSectionModal';
import { ModuleBuilderCard } from './ModulePreviews';
import { ReportPreview } from './ReportPreview';
import { SaveTemplateModal } from './SaveTemplateModal';
import { ValidationErrorModal } from './ValidationErrorModal';
import { PublishConfirmationModal } from './PublishConfirmationModal';
import { reportService } from '@/app/services/reportService';
import { useTemplateStore } from '@/app/stores/templateStore';
import { validateTemplate, getFirstInvalidSectionIndex } from '@/app/utils/templateValidation';
import { cloneTemplateAsNewDraft, needsVersioning, initializeVersionOnPublish } from '@/app/utils/templateVersioning';
import { duplicateTemplate as createDuplicateTemplate } from '@/app/utils/templateDuplication';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/app/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { RepresentationSelectionModal } from './RepresentationSelectionModal';
import { ModuleSettingsPanel } from './ModuleSettingsPanel';

// Drag Types
const ItemTypes = {
  MODULE: 'module',
  MODULE_REORDER: 'module_reorder', // For reordering modules within sections
  SECTION: 'section'
};

// Helper: Determine default representation type based on module type/category
const getDefaultRepresentationType = (moduleType: string): string => {
  const typeMap: { [key: string]: string } = {
    'Table': 'table',
    'Chart': 'chart',
    'List': 'table',
    'Text': 'table',
    'Gallery': 'table',
    'Timeline': 'table',
    'Insight': 'insights',
    'default': 'table'
  };
  
  return typeMap[moduleType] || typeMap['default'];
};

// Mock Data for Library
const MODULE_LIBRARY = [
  { category: 'Executive', modules: [
    { id: 'm1', name: 'Executive Summary', type: 'Text', tag: 'Summary' },
    { id: 'm2', name: 'Key Risks', type: 'List', tag: 'Risks' },
    { id: 'm3', name: 'Compliance Score', type: 'Chart', tag: 'Visual' }
  ]},
  { category: 'Inspection', modules: [
    { id: 'm4', name: 'Visual Inspection', type: 'Table', tag: 'Inspection' },
    { id: 'm5', name: 'Findings Log', type: 'Table', tag: 'Data' },
    { id: 'm6', name: 'Photo Gallery', type: 'Gallery', tag: 'Media' }
  ]},
  { category: 'Engineering Tests', modules: [
    { id: 'm7', name: 'Load Test Results', type: 'Chart', tag: 'Engineering' },
    { id: 'm8', name: 'Material Analysis', type: 'Text', tag: 'Technical' }
  ]},
  { category: 'Lifecycle', modules: [
    { id: 'm9', name: 'Depreciation', type: 'Chart', tag: 'Finance' },
    { id: 'm10', name: 'Replacement Plan', type: 'Timeline', tag: 'Planning' }
  ]},
  { category: 'Intelligence', modules: [
    { id: 'm11', name: 'AI Insight', type: 'Insight', tag: 'AI' }
  ]}
];

// Draggable Module Component
const DraggableModule = ({ module }: { module: any }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MODULE,
    item: { type: ItemTypes.MODULE, id: module.id, name: module.name, ...module },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      className={cn(
        "group flex items-center justify-between gap-2 p-3 bg-card border border-border/60 rounded-xl mb-2 cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-sm transition-all duration-200 ease-in-out",
        isDragging && "opacity-40 scale-[0.98] shadow-none ring-1 ring-primary/20"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <div className="text-muted-foreground/40 group-hover:text-foreground/80 transition-colors shrink-0">
          <GripVertical className="h-4 w-4" />
        </div>
        
        <div className="flex flex-col min-w-0 overflow-hidden">
          <div className="text-[13px] font-semibold text-foreground/90 leading-none mb-1 truncate pr-1" title={module.name}>
            {module.name}
          </div>
          <div className="text-[10px] text-muted-foreground font-medium capitalize truncate">
             {module.type}
          </div>
        </div>
      </div>
      
      <Badge 
        variant="secondary" 
        className={cn(
          "text-[10px] h-5 px-2 font-medium border-0 shrink-0 whitespace-nowrap ml-1",
          module.tag === 'Risks' && "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400",
          (module.tag === 'Visual' || module.tag === 'Media') && "bg-purple-100 text-purple-700 hover:bg-purple-100/80 dark:bg-purple-900/30 dark:text-purple-400",
          (module.tag === 'Finance' || module.tag === 'Planning') && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/30 dark:text-emerald-400",
          (module.tag === 'Engineering' || module.tag === 'Technical') && "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400",
          (module.tag === 'Summary' || module.tag === 'Inspection') && "bg-slate-100 text-slate-700 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-400"
        )}
      >
        {module.tag}
      </Badge>
    </div>
  );
};

// Main Component
export function TemplateBuilder() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("New Template");
  const [status, setStatus] = useState("Draft");
  const [version, setVersion] = useState(1); // Add version state
  const [showVersionBanner, setShowVersionBanner] = useState(false); // Banner for editing published template
  const [hasClonedFromPublished, setHasClonedFromPublished] = useState(false); // Track if we've cloned
  const [originalTemplateId, setOriginalTemplateId] = useState<string | null>(null); // Store original ID before clone
  
  // Canvas State
  const [sections, setSections] = useState<any[]>([]); // Start empty
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [mode, setMode] = useState<'builder' | 'preview'>('builder');
  
  // Selection State (Mutually Exclusive)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedContentBlockId, setSelectedContentBlockId] = useState<string | null>(null);

  // Configuration State
  const [config, setConfig] = useState({
    layoutType: 'table',
    chartType: 'bar',
    narrativeDepth: 'executive',
    showPercentages: true,
    showRawValues: false
  });

  // Save Flow State
  const [isDirty, setIsDirty] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewTemplate, setIsNewTemplate] = useState(!templateId || templateId === 'new');
  
  // Validation State
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [sectionValidationErrors, setSectionValidationErrors] = useState<Map<number, string[]>>(new Map());
  const [showValidationModal, setShowValidationModal] = useState(false);
  
  // Publish Confirmation State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Template Store
  const { addTemplate, updateTemplate } = useTemplateStore();

  // Derived state for current section editing
  const currentSection = sections.find(s => s.id === selectedSectionId);
  
  // Representation Selection Modal State
  const [isRepresentationModalOpen, setIsRepresentationModalOpen] = useState(false);
  const [pendingModule, setPendingModule] = useState<{ sectionId: string; item: any } | null>(null);

  // Load template on mount
  useEffect(() => {
    async function loadTemplate() {
      // Only load if we have a valid templateId
      if (!templateId || templateId === 'new') {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const templateData = await reportService.getTemplateById(templateId);

        if (process.env.NODE_ENV === 'development') {
          console.log("Template loaded successfully:", templateData);
        }

        // Set all template state from loaded data
        setTemplateName(templateData.name || "Untitled Template");
        setStatus(templateData.status || "Draft");
        setVersion(templateData.version || 1); // Load version number
        setSections(templateData.sections || []);
        setIsNewTemplate(false);
        setIsDirty(false); // Template just loaded, not dirty

      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log("ℹ️ Template loading issue:", error);
        }
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Better error messages
        if (errorMessage.includes("404") || errorMessage.includes("not found") || errorMessage.toLowerCase().includes("template not found")) {
          setLoadError(`Template \"${templateId}\" not found. It may have been deleted or doesn't exist yet.`);
          
          // Only show toast and redirect if we're actually on the template builder page (not if loaded in background)
          // AND if this isn't the default template (which should be created automatically)
          if (window.location.pathname.includes('/templates/') && 
              templateId !== 'template-default-rams') {
            // Silent handling - just log and redirect without error toast
            if (process.env.NODE_ENV === 'development') {
              console.log(`ℹ️ Template "${templateId}" not found. Redirecting to template library...`);
            }
            
            // Auto-navigate back to template library after short delay
            setTimeout(() => {
              navigate('/report/templates');
            }, 1000);
          }
        } else {
          setLoadError(`Failed to load template: ${errorMessage}`);
          
          // Only show error toast for unexpected errors (not 404s)
          toast.error('Failed to load template', {
            description: errorMessage.substring(0, 100),
            duration: 3000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplate();
  }, [templateId]);

  // Drop Target for Canvas Section
  const SectionDropZone = ({ sectionId, children }: { sectionId: string, children: React.ReactNode }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.MODULE,
      drop: (item: any) => addModuleToSection(sectionId, item),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    return (
      <div 
        ref={drop} 
        className={cn(
          "min-h-[120px] transition-colors",
          isOver && "bg-primary/5"
        )}
      >
        {children}
      </div>
    );
  };

  // ============================================================================
  // DRAGGABLE MODULE CARD - For Reordering Within Section
  // ============================================================================
  const DraggableModuleCard = ({ 
    module, 
    sectionId, 
    index,
    onDelete,
    isSelected,
    onClick,
    onUpdateConfig,
    selectedContentBlockId,
    onContentBlockClick
  }: {
    module: any;
    sectionId: string;
    index: number;
    onDelete: (e: React.MouseEvent) => void;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
    onUpdateConfig: (updates: any) => void;
    selectedContentBlockId?: string | null;
    onContentBlockClick?: (blockId: string) => void;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);

    // Drag source
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.MODULE_REORDER,
      item: { module, sectionId, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }), [module, sectionId, index]);

    // Drop target
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ItemTypes.MODULE_REORDER,
      hover: (item: any, monitor) => {
        if (!ref.current) return;
        if (!monitor.isOver({ shallow: true })) return;
        
        const dragIndex = item.index;
        const hoverIndex = index;
        const dragSectionId = item.sectionId;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex && dragSectionId === sectionId) {
          return;
        }

        // Only allow reordering within the same section
        if (dragSectionId !== sectionId) {
          return;
        }

        // Perform the move
        moveModule(dragSectionId, dragIndex, hoverIndex);
        
        // Update the item's index for the next hover event
        item.index = hoverIndex;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }), [index, sectionId]);

    // Attach drag to the handle only
    drag(dragHandleRef);
    
    // Attach drop to the wrapper div
    drop(ref);

    return (
      <div
        ref={ref}
        className={cn(
          "relative transition-all duration-200",
          isDragging && "opacity-30"
        )}
        style={{
          opacity: isDragging ? 0.3 : 1,
        }}
      >
        {/* Drop indicator line - show above when hovering */}
        {isOver && canDrop && (
          <div 
            className="absolute -top-1.5 left-0 right-0 h-0.5 bg-primary rounded-full z-10"
            style={{
              boxShadow: '0 0 4px rgba(var(--primary), 0.5)',
            }}
          />
        )}
        
        <ModuleBuilderCard
          module={module}
          isSelected={isSelected}
          onClick={onClick}
          onDelete={onDelete}
          dragHandleRef={dragHandleRef}
          onUpdateConfig={onUpdateConfig}
          selectedContentBlockId={selectedContentBlockId}
          onContentBlockClick={onContentBlockClick}
        />
      </div>
    );
  };

  // Move module within section
  const moveModule = (sectionId: string, fromIndex: number, toIndex: number) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const modules = [...section.modules];
        const [movedModule] = modules.splice(fromIndex, 1);
        modules.splice(toIndex, 0, movedModule);
        return { ...section, modules };
      }
      return section;
    }));
    
    setIsDirty(true);
  };

  const addModuleToSection = async (sectionId: string, item: any) => {
    // Check if we need to clone from published template
    const wasCloned = await checkAndCloneIfNeeded();
    if (wasCloned) return; // Clone happened, action will be retried after navigation
    
    // Determine default representation type based on module type
    const defaultRepresentationType = getDefaultRepresentationType(item.type);
    
    // Create new module instance with default representation
    const newModule = { 
      ...item, 
      instanceId: `${item.id}-${Date.now()}`,
      representationType: defaultRepresentationType,
      config: {
        layoutType: defaultRepresentationType,
        chartType: 'bar',
        narrativeDepth: 'executive',
        showPercentages: true,
        showRawValues: false,
        pageOrientation: 'portrait', // Default page orientation
      }
    };
    
    // Add module to section immediately
    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return { ...s, modules: [...s.modules, newModule] };
      }
      return s;
    }));
    
    // Auto-select the newly added module to open settings panel
    setSelectedModuleId(newModule.instanceId);
    setSelectedSectionId(null); // Clear section selection
    setIsDirty(true);
    
    // Show success toast with module name
    toast.success(`Added ${item.name}`, {
      description: `Click "Save Configuration" after setting up the module`,
      duration: 3000,
    });
  };

  const addSection = async () => {
    // Check if we need to clone from published template
    const wasCloned = await checkAndCloneIfNeeded();
    if (wasCloned) return; // Clone happened, modal will be shown after navigation
    
    setIsAddSectionModalOpen(true);
  };

  const handleAddSection = async (data: any) => {
    const newId = `s-${Date.now()}`;
    const newSection = {
      id: newId,
      name: data.title,
      modules: [],
      description: data.description,
      type: data.type,
      config: data.config,
      layout: 'standard',
      isNew: true,
      isCollapsed: false,
    };
    setSections(prev => [...prev, newSection]);
    setSelectedSectionId(newId);
    setSelectedModuleId(null);
    setIsAddSectionModalOpen(false);
    setIsDirty(true); // Mark as dirty when adding section
    
    // Remove isNew flag after animation
    setTimeout(() => {
       setSections(prev => prev.map(s => s.id === newId ? { ...s, isNew: false } : s));
    }, 2000);

    // Scroll and focus
    setTimeout(() => {
      const el = document.getElementById(`section-${newId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = el.querySelector('input');
        if (input) input.focus();
      }
    }, 100);
  };

  const deleteSection = async (id: string) => {
    // Check if we need to clone from published template
    const wasCloned = await checkAndCloneIfNeeded();
    if (wasCloned) return; // Clone happened, action will be retried after navigation
    
    setSections(sections.filter(s => s.id !== id));
    if (selectedSectionId === id) setSelectedSectionId(null);
    setIsDirty(true); // Mark as dirty when deleting section
    toast.success("Section deleted");
  };

  const updateSection = async (id: string, updates: any) => {
    // Check if we need to clone from published template
    const wasCloned = await checkAndCloneIfNeeded();
    if (wasCloned) return; // Clone happened, action will be retried after navigation
    
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
    setIsDirty(true); // Mark as dirty when updating section
    
    // Clear validation errors when user makes changes
    if (sectionValidationErrors.size > 0) {
      setSectionValidationErrors(new Map());
    }
  };

  // Add Text Block to section
  const addTextBlock = async (sectionId: string) => {
    // Check if we need to clone from published template
    const wasCloned = await checkAndCloneIfNeeded();
    if (wasCloned) return;

    const newTextBlock = {
      id: `text-${Date.now()}`,
      instanceId: `text-${Date.now()}`,
      name: 'Text Block',
      type: 'TextBlock',
      tag: 'Content',
      representationType: 'textblock',
      config: {
        content: '',
        isSaved: false,
      }
    };

    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return { ...s, modules: [...s.modules, newTextBlock] };
      }
      return s;
    }));

    // Auto-select the newly added text block
    setSelectedModuleId(newTextBlock.instanceId);
    setSelectedSectionId(null);
    setIsDirty(true);

    toast.success('Text Block added', {
      description: 'Start typing to add notes or explanation',
      duration: 3000,
    });
  };

  // Add Divider to section
  const addDivider = async (sectionId: string) => {
    // Check if we need to clone from published template
    const wasCloned = await checkAndCloneIfNeeded();
    if (wasCloned) return;

    const newDivider = {
      id: `divider-${Date.now()}`,
      instanceId: `divider-${Date.now()}`,
      name: 'Divider',
      type: 'Divider',
      tag: 'Layout',
      representationType: 'divider',
      config: {
        style: 'solid',
        isSaved: true, // Dividers don't need configuration
      }
    };

    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return { ...s, modules: [...s.modules, newDivider] };
      }
      return s;
    }));

    setIsDirty(true);

    toast.success('Divider added', {
      description: 'Visual separator inserted',
      duration: 2000,
    });
  };

  // Track template name changes
  useEffect(() => {
    if (templateName !== "New Template") {
      setIsDirty(true);
    }
  }, [templateName]);

  /**
   * VERSIONING FUNCTION
   * Clone published template to new draft version
   */
  const cloneTemplateToNewDraft = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Starting template clone process...');
      console.log('Current state:', {
        templateId,
        templateName,
        version,
        sectionsCount: sections.length,
        status
      });
    }
    
    try {
      // Generate new ID and increment version
      const newId = `template-${Date.now()}`;
      const newVersion = version + 1;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📝 New template details:', { newId, newVersion });
      }

      // Count sections and modules
      const sectionsCount = sections.length;
      const modulesCount = sections.reduce((total, section) => total + section.modules.length, 0);

      // Build the new draft template
      const newDraftTemplate = {
        id: newId,
        name: templateName,
        description: `Template with ${sectionsCount} sections and ${modulesCount} modules`,
        version: newVersion,
        lastEdited: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        createdBy: "Current User",
        status: "Draft" as const,
        sections: JSON.parse(JSON.stringify(sections)), // Deep clone sections
        sectionsCount,
        modulesCount,
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('💾 Saving cloned template to database...');
      }
      
      // Save the new draft to the database FIRST
      const savedTemplate = await reportService.saveTemplate(newDraftTemplate);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Cloned template saved successfully:', savedTemplate.id);
      }

      // Add to template store
      addTemplate(savedTemplate);

      // Store original template ID for reference
      setOriginalTemplateId(templateId || null);

      // Update local state with new draft
      setStatus("Draft");
      setVersion(newVersion);
      setHasClonedFromPublished(true);
      setShowVersionBanner(true);
      setIsDirty(false); // Not dirty because we just saved
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Local state updated');
      }

      // Show notification
      toast.success(`New draft version created`, {
        description: `You are now editing v${newVersion} (Draft)`,
        duration: 5000,
      });

      // Navigate to new URL with new ID
      if (process.env.NODE_ENV === 'development') {
        console.log('🔀 Navigating to new template:', `/report/templates/${newId}`);
      }
      navigate(`/report/templates/${newId}`, { replace: true });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Clone process complete');
      }

    } catch (error) {
      console.error("❌ Failed to clone template:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack
        });
      }
      toast.error("Failed to create new version. Please try again.");
      throw error; // Re-throw to be caught by checkAndCloneIfNeeded
    }
  };

  /**
   * MUTATION GUARD
   * Check if we need to clone before allowing mutations
   */
  const checkAndCloneIfNeeded = async (): Promise<boolean> => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Mutation guard check:', { status, hasClonedFromPublished });
    }
    
    if (status === "Published" && !hasClonedFromPublished) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📦 Template is published - cloning to draft...');
      }
      try {
        await cloneTemplateToNewDraft();
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Successfully cloned template to draft');
        }
        return true; // Indicates we just cloned
      } catch (error) {
        console.error('❌ Failed to clone template:', error);
        toast.error('Failed to create draft version. Please try again.');
        return true; // Still return true to prevent mutation
      }
    }
    return false; // No cloning needed
  };

  // Save template handler
  const handleSave = () => {
    if (!isDirty) return;
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    
    try {
      // Count sections and modules
      const sectionsCount = sections.length;
      const modulesCount = sections.reduce((total, section) => total + section.modules.length, 0);
      
      // Build template object
      const templateData = {
        id: templateId && templateId !== 'new' ? templateId : `template-${Date.now()}`,
        name: templateName,
        description: `Template with ${sectionsCount} sections and ${modulesCount} modules`,
        version: version || 1, // Include version
        lastEdited: new Date().toISOString(),
        createdDate: isNewTemplate ? new Date().toISOString() : undefined,
        createdBy: "Current User",
        status: status as "Draft" | "Published",
        sections,
        sectionsCount,
        modulesCount,
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('💾 Saving template:', templateData.id, '- Version:', templateData.version);
      }

      // Save to backend
      const savedTemplate = await reportService.saveTemplate(templateData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Template saved successfully:', savedTemplate.id);
      }
      
      // Update template store
      if (isNewTemplate) {
        addTemplate(savedTemplate);
        setIsNewTemplate(false);
      } else {
        updateTemplate(savedTemplate.id, savedTemplate);
      }
      
      // Reset dirty state
      setIsDirty(false);
      setIsSaveModalOpen(false);
      
      // Show success toast
      toast.success("Template saved successfully", {
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template. Please try again.", {
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = () => {
    // Build template object for validation
    const templateData = {
      name: templateName,
      sections,
    };

    // Debug: Log template data before validation
    if (process.env.NODE_ENV === 'development') {
      console.log("Publishing template - validating data:", {
        templateName,
        sectionsCount: sections.length,
        sections: sections.map((s, i) => ({
          index: i,
          name: s.name,
          type: s.type,
          modulesCount: s.modules?.length || 0,
        })),
      });
    }

    // Run validation
    const validation = validateTemplate(templateData);

    if (!validation.isValid) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Validation failed:", validation);
      }
      // Show validation errors and store section-specific errors
      setValidationErrors(validation.errors);
      setSectionValidationErrors(validation.sectionErrors || new Map());
      setShowValidationModal(true);
      return;
    }

    // If valid, show publish confirmation modal
    setShowPublishModal(true);
  };

  const handleConfirmPublish = async () => {
    setIsPublishing(true);
    
    try {
      // Count sections and modules
      const sectionsCount = sections.length;
      const modulesCount = sections.reduce((total, section) => total + section.modules.length, 0);
      
      // Set version to 1 if undefined (first publish)
      const publishVersion = version || 1;
      
      // Build template object with Published status
      const templateData = {
        id: templateId && templateId !== 'new' ? templateId : `template-${Date.now()}`,
        name: templateName,
        description: `Template with ${sectionsCount} sections and ${modulesCount} modules`,
        lastEdited: new Date().toISOString(),
        createdDate: isNewTemplate ? new Date().toISOString() : undefined,
        createdBy: "Current User",
        status: "Published" as const,
        version: publishVersion,
        sections,
        sectionsCount,
        modulesCount,
      };

      // Save to backend
      const savedTemplate = await reportService.saveTemplate(templateData);
      
      // Update template store
      if (isNewTemplate) {
        addTemplate(savedTemplate);
        setIsNewTemplate(false);
      } else {
        updateTemplate(savedTemplate.id, savedTemplate);
      }
      
      // Update local state
      setStatus("Published");
      setVersion(publishVersion);
      setIsDirty(false);
      setShowPublishModal(false);
      
      // Show success toast
      toast.success("Template published successfully", {
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Failed to publish template:", error);
      toast.error("Failed to publish template. Please try again.", {
        duration: 3000,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Scroll to first invalid section when validation fails
  const handleScrollToFirstError = () => {
    const templateData = {
      name: templateName,
      sections,
    };
    
    const firstInvalidIndex = getFirstInvalidSectionIndex(templateData);
    
    if (firstInvalidIndex !== -1 && sections[firstInvalidIndex]) {
      const section = sections[firstInvalidIndex];
      const sectionId = section.id;
      
      // Auto-expand collapsed section if needed
      if (section.isCollapsed) {
        updateSection(sectionId, { isCollapsed: false });
      }
      
      // Close modal first
      setShowValidationModal(false);
      
      // Scroll to section with smooth animation
      setTimeout(() => {
        const el = document.getElementById(`section-${sectionId}`);
        
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Highlight section with red border and subtle red background
          el.classList.add('animate-shake');
          el.style.borderColor = 'rgb(239 68 68)'; // red-500
          el.style.borderWidth = '2px';
          el.style.backgroundColor = 'rgb(254 242 242)'; // red-50
          
          // Remove highlight after 2 seconds
          setTimeout(() => {
            el.classList.remove('animate-shake');
            el.style.borderColor = '';
            el.style.borderWidth = '';
            el.style.backgroundColor = '';
          }, 2000);
        }
      }, 150); // 150ms to match modal fade out
    }
  };

  // Selection Handlers
  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedSectionId(id);
    setSelectedModuleId(null);
    setSelectedContentBlockId(null);
  };

  const handleModuleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedModuleId(id);
    setSelectedSectionId(null);
    setSelectedContentBlockId(null);
  };

  const handleContentBlockClick = (moduleId: string, blockId: string) => {
    setSelectedModuleId(moduleId);
    setSelectedSectionId(null);
    setSelectedContentBlockId(blockId);
  };

  const handleCanvasClick = () => {
    setSelectedModuleId(null);
    setSelectedSectionId(null);
    setSelectedContentBlockId(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p 
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Loading template...
            </p>
          </div>
        </div>
      ) : loadError ? (
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="flex flex-col items-center gap-4 max-w-md text-center p-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10">
              <LayoutTemplate className="h-8 w-8 text-destructive" />
            </div>
            <h2 
              className="text-foreground"
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Template Not Found
            </h2>
            <p 
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {loadError}
            </p>
            <div className="flex gap-3 mt-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/report/templates')}
                style={{
                  fontSize: "var(--text-sm)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Button>
              <Button 
                onClick={() => navigate('/report/templates/new')}
                style={{
                  fontSize: "var(--text-sm)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </div>
          </div>
        </div>
      ) : (
      <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
        
        {/* TOP TOOLBAR - MODE AWARE */}
        <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-background shrink-0 z-30">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="mr-1 h-8 w-8" onClick={() => window.history.back()}>
               <ChevronLeft className="h-5 w-5" />
             </Button>
             <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Input 
                    value={templateName}
                    disabled={mode === 'preview'}
                    onChange={(e) => {
                      setTemplateName(e.target.value);
                      setIsDirty(true); // Mark dirty on user change
                    }}
                    className="h-8 text-lg font-semibold border-border px-1 focus-visible:ring-0 w-[300px] bg-transparent disabled:opacity-100" 
                  />
                  <span 
                    className="text-muted-foreground"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    v{version}
                  </span>
                  <Badge variant={status === "Published" ? "default" : "secondary"} className={cn(status === "Published" && "bg-green-100 text-green-700 hover:bg-green-200")}>
                    {status}
                  </Badge>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
            {mode === 'builder' ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 font-medium hover:bg-muted" 
                  onClick={addSection}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Section
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setMode('preview')}>Preview</Button>
                <div className="relative group">
                  <Button onClick={handleSave} size="sm" disabled={!isDirty}>
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
                <Button variant="secondary" onClick={handlePublish} disabled={status === "Published"} size="sm">
                  Publish
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setMode('builder')}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Builder
                </Button>
                <Button size="sm" onClick={() => toast.success("Export functionality coming soon")}>
                   Export PDF
                </Button>
              </>
            )}
          </div>
        </div>

        {/* VERSION BANNER - Show when editing a cloned published template */}
        {showVersionBanner && (
          <div className="bg-orange-50 dark:bg-orange-950/30 border-b border-orange-200 dark:border-orange-900 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                You are editing a published template. A new draft version (v{version}) has been created.
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowVersionBanner(false)}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:text-orange-400 dark:hover:bg-orange-900/50"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* MAIN WORKSPACE (Conditioned by Mode) */}
        {mode === 'builder' ? (
          <div className="flex flex-1 overflow-hidden">
            
            {/* LEFT PANEL - LIBRARY */}
            <div className="w-[300px] border-r border-border bg-muted/30 flex flex-col shrink-0">
              <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
                <h3 className="font-semibold mb-3">Module Library</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search modules..." className="pl-9 h-9 bg-background" />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="px-3 py-4">
                  <Accordion type="multiple" defaultValue={['Executive', 'Inspection']} className="w-full">
                    {MODULE_LIBRARY.map((category) => (
                      <AccordionItem key={category.category} value={category.category} className="border-b-0 mb-2">
                        <AccordionTrigger className="flex-row-reverse justify-end gap-2 text-sm font-medium py-2 hover:no-underline rounded-md hover:bg-muted/50 px-2 items-center [&[data-state=open]>svg]:rotate-0 [&[data-state=closed]>svg]:-rotate-90 [&>svg]:translate-y-0">
                          <div className="flex flex-1 items-center justify-between group-hover:text-primary transition-colors">
                            <span>{category.category}</span>
                            <span className="text-muted-foreground text-xs font-normal">{category.modules.length}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-1 px-2">
                            {category.modules.map((module) => (
                              <DraggableModule key={module.id} module={module} />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border bg-muted/20 text-xs text-muted-foreground text-center">
                Drag modules to the canvas to build your template.
              </div>
            </div>

            {/* MAIN CONTENT AREA (Flex Column) */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-[700px]">
              
              {/* SPLIT VIEW: Canvas + Settings */}
              <div className="flex-1 flex overflow-hidden relative">
                
                {/* Builder Canvas Scrollable Area */}
                <div 
                  className="flex-1 overflow-y-auto p-8 bg-muted/20 relative"
                  onClick={handleCanvasClick}
                >
                  {/* CANVAS CONTAINER */}
                  <div className={cn(
                    "max-w-[1100px] mx-auto min-h-[600px] pb-32 transition-all duration-300 space-y-6"
                  )}>
                  {sections.length === 0 ? (
                    <div className="w-full mt-8 mb-12 border border-border rounded-[20px] bg-background/50 p-8 animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-full flex flex-col items-center justify-center py-12 px-8 border border-dashed border-border rounded-2xl bg-background/50">
                        <div className="flex items-center justify-center h-14 w-14 rounded-[14px] bg-background border border-border mb-5 shadow-sm">
                          <LayoutTemplate className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-medium mb-2 text-foreground">Start Building Your Template</h3>
                        <p className="text-muted-foreground text-center max-w-[500px] mb-6 text-sm leading-relaxed">
                          Add sections to structure your template, then drag and drop modules to define data requirements.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {sections.map((section, sectionIndex) => {
                        // Check if this section has validation errors
                        const hasErrors = sectionValidationErrors.has(sectionIndex);
                        const errors = sectionValidationErrors.get(sectionIndex) || [];
                        
                        return (
                        <div 
                          key={section.id} 
                          id={`section-${section.id}`}
                          className={cn(
                            "bg-background border rounded-xl overflow-hidden transition-all duration-300 ease-in-out",
                            hasErrors ? "border-destructive" : (selectedSectionId === section.id && !selectedModuleId && !selectedContentBlockId) ? "border-primary ring-1 ring-primary/20" : "border-border hover:border-primary/30",
                            section.isNew && "ring-2 ring-primary ring-offset-2 scale-[1.01]"
                          )}
                          style={{
                            borderColor: hasErrors 
                              ? 'var(--destructive)' 
                              : (selectedSectionId === section.id && !selectedModuleId && !selectedContentBlockId) 
                                ? 'var(--primary)' 
                                : 'var(--border)',
                            borderRadius: 'var(--radius-lg)',
                          }}
                          onClick={(e) => handleSectionClick(e, section.id)}
                        >
                          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                <Input 
                                  value={section.name} 
                                  onChange={(e) => updateSection(section.id, { name: e.target.value })}
                                  className="h-7 border-transparent hover:border-border font-medium bg-transparent focus-visible:ring-0 w-[200px]" 
                                  onClick={(e) => e.stopPropagation()} 
                                />
                              </div>
                              {/* Inline validation errors */}
                              {hasErrors && (
                                <div 
                                  className="mt-2 ml-6 text-destructive flex items-start gap-1.5"
                                  style={{
                                    fontSize: "var(--text-xs)",
                                    fontWeight: "var(--font-weight-medium)",
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  <span className="shrink-0">⚠</span>
                                  <span>{errors.join(", ")}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {/* Add Content Popover */}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent 
                                  className="w-48 p-2" 
                                  align="end"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="space-y-1">
                                    <h4 
                                      className="font-semibold px-2 py-1.5 text-foreground"
                                      style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-weight-semi-bold)',
                                        fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      Add Content
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start h-9 px-2 hover:bg-muted"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        addTextBlock(section.id);
                                      }}
                                      style={{
                                        fontSize: 'var(--text-sm)',
                                        fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Text / Notes
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start h-9 px-2 hover:bg-muted"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        addDivider(section.id);
                                      }}
                                      style={{
                                        fontSize: 'var(--text-sm)',
                                        fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      <Minus className="h-4 w-4 mr-2" />
                                      Divider
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              
                              <Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="h-3.5 w-3.5" /></Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateSection(section.id, { isCollapsed: !section.isCollapsed });
                                }}
                              >
                                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", section.isCollapsed && "-rotate-90")} />
                              </Button>
                            </div>
                          </div>
                          
                          {/* COLLAPSIBLE CONTENT */}
                          <div className={cn(
                            "transition-all duration-300 ease-in-out overflow-hidden",
                            section.isCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
                          )}>
                            <div className="p-4">
                              <SectionDropZone sectionId={section.id}>
                              {section.modules.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 gap-2 min-h-[80px]">
                                  <Plus className="h-8 w-8 opacity-20" />
                                  <span className="text-sm">Drag modules here</span>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {section.modules.map((mod: any, idx: number) => (
                                    <DraggableModuleCard
                                      key={mod.instanceId}
                                      module={mod}
                                      sectionId={section.id}
                                      index={idx}
                                      isSelected={selectedModuleId === mod.instanceId && !selectedContentBlockId}
                                      onClick={(e) => handleModuleClick(e, mod.instanceId)}
                                      selectedContentBlockId={selectedContentBlockId}
                                      onContentBlockClick={(blockId) => handleContentBlockClick(mod.instanceId, blockId)}
                                      onDelete={(e) => {
                                        e.stopPropagation();
                                        const newMods = section.modules.filter(m => m.instanceId !== mod.instanceId);
                                        const newSections = sections.map(s => s.id === section.id ? { ...s, modules: newMods } : s);
                                        setSections(newSections);
                                        if (selectedModuleId === mod.instanceId) {
                                          setSelectedModuleId(null);
                                          setSelectedContentBlockId(null);
                                        }
                                      }}
                                      onUpdateConfig={(updates) => {
                                        // Update the module - can be either config updates or full module updates (for content blocks)
                                        setSections(prev => prev.map(s => ({
                                          ...s,
                                          modules: s.modules.map(m =>
                                            m.instanceId === mod.instanceId
                                              ? (updates.contentBlocks !== undefined 
                                                  ? { ...m, contentBlocks: updates.contentBlocks } // Update content blocks
                                                  : { ...m, config: { ...m.config, ...updates } }) // Update config
                                              : m
                                          )
                                        })));
                                        setIsDirty(true);
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </SectionDropZone>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL - SETTINGS (Fixed Width, Nested under Toolbar) */}
              <div className={cn(
                "border-l border-border bg-background flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden z-20 h-full",
                (selectedModuleId || selectedSectionId) ? "w-[320px] translate-x-0 opacity-100" : "w-0 translate-x-[20px] opacity-0 border-l-0"
              )}
              style={{
                pointerEvents: (selectedModuleId || selectedSectionId) ? 'auto' : 'none',
              }}
              >
                 {selectedModuleId ? (() => {
                   // Find the selected module and its parent section
                   const selectedModule = sections
                     .flatMap(s => s.modules)
                     .find(m => m.instanceId === selectedModuleId);
                   
                   const parentSection = sections.find(s => 
                     s.modules.some(m => m.instanceId === selectedModuleId)
                   );
                   
                   if (!selectedModule) return null;

                   // Check if a content block is selected
                   if (selectedContentBlockId) {
                     const selectedBlock = selectedModule.contentBlocks?.find(
                       (block: any) => block.id === selectedContentBlockId
                     );
                     
                     if (selectedBlock && selectedBlock.type === 'text') {
                       // Create a virtual "TextBlock" module for the settings panel
                       const virtualTextBlockModule = {
                         instanceId: selectedBlock.id,
                         type: 'TextBlock',
                         name: 'Text Block',
                         config: {
                           content: selectedBlock.content || '',
                         }
                       };
                       
                       const updateContentBlock = (updates: any) => {
                         setSections(prev => prev.map(section => ({
                           ...section,
                           modules: section.modules.map(mod => {
                             if (mod.instanceId === selectedModuleId) {
                               const updatedBlocks = (mod.contentBlocks || []).map((block: any) =>
                                 block.id === selectedContentBlockId 
                                   ? { ...block, content: updates.content } 
                                   : block
                               );
                               return { ...mod, contentBlocks: updatedBlocks };
                             }
                             return mod;
                           })
                         })));
                         setIsDirty(true);
                       };
                       
                       return (
                         <ModuleSettingsPanel
                           selectedModuleId={selectedContentBlockId}
                           module={virtualTextBlockModule}
                           onUpdateConfig={updateContentBlock}
                           sectionName={parentSection?.name}
                         />
                       );
                     }
                   }

                   const updateModuleConfig = (updates: any) => {
                     setSections(prev => prev.map(section => ({
                       ...section,
                       modules: section.modules.map(mod => {
                         if (mod.instanceId === selectedModuleId) {
                           // If representationType is being updated, also update module-level property
                           const moduleUpdates: any = { config: { ...mod.config, ...updates } };
                           if (updates.representationType !== undefined) {
                             moduleUpdates.representationType = updates.representationType;
                           }
                           return { ...mod, ...moduleUpdates };
                         }
                         return mod;
                       })
                     })));
                     setIsDirty(true);
                   };
                   
                   return (
                     <ModuleSettingsPanel
                       selectedModuleId={selectedModuleId}
                       module={selectedModule}
                       onUpdateConfig={updateModuleConfig}
                       sectionName={parentSection?.name}
                     />
                   );
                 })() : selectedSectionId && currentSection ? (
                   <>
                     {/* 1. HEADER */}
                     <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-background flex items-center justify-between">
                       <h3 className="font-semibold text-[16px]">Section Settings</h3>
                       <div className="flex items-center gap-2">
                         <Badge variant="outline" className="text-[10px] font-mono">ID: {currentSection.id}</Badge>
                       </div>
                     </div>
                     
                     {/* 2. SCROLLABLE CONTENT */}
                     <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-0">
                       
                       {/* Section Name */}
                       <div className="space-y-2">
                         <label className="text-sm font-medium text-foreground">Section Name</label>
                         <Input 
                           value={currentSection.name}
                           onChange={(e) => updateSection(currentSection.id, { name: e.target.value })}
                           className="h-10"
                         />
                       </div>

                       {/* Section Description */}
                       <div className="space-y-2">
                         <label className="text-sm font-medium text-foreground">Description</label>
                         <Textarea 
                           value={currentSection.description}
                           onChange={(e) => updateSection(currentSection.id, { description: e.target.value })}
                           placeholder="Describe the purpose of this section..."
                           className="resize-none min-h-[120px] leading-relaxed"
                         />
                       </div>

                       <Separator />

                       {/* Layout Type */}
                       <div className="space-y-3">
                         <label className="text-sm font-medium text-foreground">Section Layout</label>
                         <Select 
                           value={currentSection.layout || 'standard'} 
                           onValueChange={(val) => updateSection(currentSection.id, { layout: val })}
                         >
                           <SelectTrigger className="h-10">
                             <SelectValue placeholder="Select layout" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="standard">Standard (Vertical)</SelectItem>
                             <SelectItem value="grid">Grid (2 Column)</SelectItem>
                             <SelectItem value="full">Full Width</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>

                     </div>
                     
                     {/* 3. FOOTER */}
                     <div className="flex-shrink-0 border-t bg-background p-4 shadow-[0_-1px_0_0_theme(colors.border)]">
                       <Button 
                         variant="destructive" 
                         className="w-full h-10" 
                         onClick={() => deleteSection(currentSection.id)}
                       >
                         <Trash2 className="mr-2 h-4 w-4" /> Delete Section
                       </Button>
                     </div>
                   </>
                 ) : null}
              </div>

            </div>
          </div>

          </div>
        ) : (
          <ReportPreview sections={sections} templateName={templateName} />
        )}

        <AddSectionModal 
          isOpen={isAddSectionModalOpen} 
          onClose={() => setIsAddSectionModalOpen(false)} 
          onAdd={handleAddSection} 
        />
        <SaveTemplateModal 
          open={isSaveModalOpen} 
          onOpenChange={setIsSaveModalOpen} 
          onConfirm={handleConfirmSave} 
          isSaving={isSaving} 
        />
        <ValidationErrorModal 
          open={showValidationModal} 
          onOpenChange={setShowValidationModal} 
          errors={validationErrors}
          onGoToFirstError={handleScrollToFirstError}
        />
        <PublishConfirmationModal 
          open={showPublishModal} 
          onOpenChange={setShowPublishModal} 
          onConfirm={handleConfirmPublish} 
          templateName={templateName}
          version={version}
          sectionsCount={sections.length}
          modulesCount={sections.reduce((total, section) => total + (section.modules?.length || 0), 0)}
          isPublishing={isPublishing} 
        />
        <RepresentationSelectionModal 
          open={isRepresentationModalOpen} 
          onOpenChange={(isOpen) => {
            setIsRepresentationModalOpen(isOpen);
            if (!isOpen) {
              // Clear pending module when modal is closed
              setPendingModule(null);
            }
          }}
          moduleName={pendingModule?.item?.name || ''} 
          onConfirm={(representationType) => {
            if (pendingModule) {
              // Create the module with the selected representation type
              setSections(prev => prev.map(s => {
                if (s.id === pendingModule.sectionId) {
                  const newModule = { 
                    ...pendingModule.item, 
                    instanceId: `${pendingModule.item.id}-${Date.now()}`,
                    representationType,
                    config: {
                      layoutType: representationType,
                      chartType: 'bar',
                      narrativeDepth: 'executive',
                      showPercentages: true,
                      showRawValues: false,
                    }
                  };
                  return { ...s, modules: [...s.modules, newModule] };
                }
                return s;
              }));
              setIsDirty(true);
              toast.success(`Added ${pendingModule.item.name} with ${representationType} representation`);
              setIsRepresentationModalOpen(false);
              setPendingModule(null);
            }
          }}
        />
      </div>
      )}
    </DndProvider>
  );
}