import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { 
  FileText, 
  LayoutGrid, 
  Layers, 
  Sparkles,
  Check,
  Plus
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

export type SectionType = 'text' | 'module' | 'group' | 'ai';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const SECTION_TYPES = [
  {
    id: 'text' as SectionType,
    title: 'Custom Text Section',
    description: 'Add a section with custom narrative content, paragraphs, and text.',
    icon: FileText
  },
  {
    id: 'module' as SectionType,
    title: 'Module Container',
    description: 'A section that will contain predefined configurable modules.',
    icon: LayoutGrid
  },
  {
    id: 'group' as SectionType,
    title: 'Section Group',
    description: 'A parent section that can contain multiple subsections.',
    icon: Layers
  },
  {
    id: 'ai' as SectionType,
    title: 'AI Insight Section',
    description: 'Generates intelligent insights based on report data.',
    icon: Sparkles
  }
];

export function AddSectionModal({ isOpen, onClose, onAdd }: AddSectionModalProps) {
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Conditional fields
  const [initialContent, setInitialContent] = useState('');
  const [insightSource, setInsightSource] = useState('all');
  const [narrativeDepth, setNarrativeDepth] = useState('executive');

  // Progressive disclosure state
  const [showInitialContent, setShowInitialContent] = useState(false);

  const handleSubmit = () => {
    if (!selectedType || !title) return;

    const newSection = {
      title,
      description,
      type: selectedType,
      config: {
        ...(selectedType === 'text' && { initialContent }),
        ...(selectedType === 'ai' && { insightSource, narrativeDepth }),
      }
    };
    
    onAdd(newSection);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedType(null);
    setInitialContent('');
    setInsightSource('all');
    setNarrativeDepth('executive');
    setShowInitialContent(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[92vw] sm:max-w-[1160px] max-h-[85vh] p-0 gap-0 rounded-2xl flex flex-col overflow-hidden bg-background outline-none">
        {/* Header */}
        <div className="px-8 pt-8 pb-0 shrink-0">
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">Add Section</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Choose a section type and configure its properties.
          </DialogDescription>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Section Type Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECTION_TYPES.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "relative flex flex-col items-start p-5 border rounded-xl cursor-pointer transition-all min-h-[150px] min-w-[240px] select-none",
                  selectedType === type.id 
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm" 
                    : "border-border bg-card hover:border-border hover:bg-neutral-50 hover:shadow-sm"
                )}
              >
                {selectedType === type.id && (
                  <div className="absolute top-3 right-3 text-primary bg-background rounded-full p-0.5 border border-primary/20 shadow-sm animate-in zoom-in-50 duration-200">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className={cn(
                  "mb-3 h-9 w-9 rounded-lg flex items-center justify-center transition-colors shrink-0",
                  selectedType === type.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <type.icon className="h-5 w-5" />
                </div>
                <div className="w-full">
                  <h4 className="font-semibold text-[15px] text-foreground">{type.title}</h4>
                  <p className="text-sm text-muted-foreground leading-5 mt-1.5 max-w-full line-clamp-3">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="h-px bg-border my-6" />

          {/* Section Details Label */}
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-6">
            Section Details
          </div>

          {/* Form Fields */}
          <div className="space-y-6 max-w-4xl">
            {/* Title Field (Always visible) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Section Title <span className="text-destructive">*</span>
              </label>
              <Input 
                placeholder="e.g., Executive Summary" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="h-11 rounded-lg"
              />
            </div>

            {/* Description Field (Always visible now) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Textarea 
                placeholder="Briefly describe the purpose of this section..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none min-h-[88px] rounded-lg"
              />
            </div>

            {/* Progressive Actions (Only Initial Content remains) */}
            {!showInitialContent && selectedType === 'text' && (
              <div className="flex flex-wrap items-center gap-5 text-sm">
                <button 
                  onClick={() => setShowInitialContent(true)}
                  className="flex items-center text-primary hover:text-primary/80 font-medium transition-colors focus:outline-none"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add initial content
                </button>
              </div>
            )}

            {showInitialContent && selectedType === 'text' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-sm font-medium text-foreground">Initial Content</label>
                <Textarea 
                  placeholder="Start typing your content here..." 
                  value={initialContent}
                  onChange={(e) => setInitialContent(e.target.value)}
                  className="resize-none min-h-[120px] rounded-lg"
                />
              </div>
            )}

            {/* AI Insight Specific Fields */}
            {selectedType === 'ai' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Insight Source</label>
                  <Select value={insightSource} onValueChange={setInsightSource}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Available Data</SelectItem>
                      <SelectItem value="modules">Selected Modules</SelectItem>
                      <SelectItem value="external">External Inputs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Narrative Depth</label>
                    <Select value={narrativeDepth} onValueChange={setNarrativeDepth}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive">Executive Summary</SelectItem>
                      <SelectItem value="detailed">Detailed Analysis</SelectItem>
                      <SelectItem value="technical">Technical Breakdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-8 pt-6 pb-6 border-t border-border bg-background flex items-center justify-end shrink-0 gap-3">
          <Button variant="ghost" onClick={handleClose} className="h-10 px-5 rounded-lg">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedType || !title.trim()}
            className="h-10 px-6 rounded-lg"
          >
            Add Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}