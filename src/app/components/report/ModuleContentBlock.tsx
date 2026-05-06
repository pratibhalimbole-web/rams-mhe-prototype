/**
 * ModuleContentBlock - Renders text blocks and dividers attached to modules
 * Follows unified selection pattern - click to select, configure in right panel
 */

import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

export type ContentBlockType = 'text' | 'divider';
export type ContentBlockMode = 'static' | 'dynamic';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content?: string;
  mode?: ContentBlockMode; // 'static' | 'dynamic'
}

interface ModuleContentBlockProps {
  block: ContentBlock;
  onDelete: () => void;
  isSelected?: boolean;
  onClick?: () => void;
  isEditable?: boolean;
}

export function ModuleContentBlock({ 
  block, 
  onDelete,
  isSelected = false,
  onClick,
  isEditable = true 
}: ModuleContentBlockProps) {
  // Render divider
  if (block.type === 'divider') {
    return (
      <div className="relative group">
        <div 
          className="h-px bg-border my-4"
          style={{
            backgroundColor: 'var(--border)',
            marginTop: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-4)',
          }}
        />
        {isEditable && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        )}
      </div>
    );
  }

  // Render text block preview (canvas view only - no editing controls)
  return (
    <div 
      className="relative group cursor-pointer"
      style={{
        marginTop: 'var(--spacing-4)',
        marginBottom: 'var(--spacing-4)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <div 
        className={cn(
          "border rounded-lg overflow-hidden transition-all",
          isSelected 
            ? "border-primary shadow-sm" 
            : "border-border hover:border-primary/50"
        )}
        style={{
          borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
          borderRadius: 'var(--radius)',
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-3 py-2 bg-muted/20 border-b"
          style={{
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span 
              className="text-xs font-medium"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
              }}
            >
              Notes
            </span>
          </div>

          {isEditable && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          )}
        </div>

        {/* Content Preview (Read-only) */}
        <div 
          className="p-3 min-h-[80px] flex items-center justify-center"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--text-sm)',
            color: 'var(--foreground)',
            lineHeight: '1.6',
          }}
        >
          {block.mode === 'dynamic' ? (
            <p 
              style={{
                color: 'var(--muted-foreground)',
                opacity: 0.7,
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              System generated insights will appear here
            </p>
          ) : (
            <p 
              style={{
                color: 'var(--muted-foreground)',
                opacity: 0.6,
                textAlign: 'center',
              }}
            >
              Click to edit content in report draft
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
