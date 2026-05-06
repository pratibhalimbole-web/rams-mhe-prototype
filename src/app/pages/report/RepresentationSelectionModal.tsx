/**
 * Representation Selection Modal
 * 
 * Prompts user to select a representation type when adding a module to a section.
 * Each module instance must have exactly one representation type.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import {
  BarChart3,
  Table2,
  Grid3x3,
  SplitSquareHorizontal,
} from 'lucide-react';

interface RepresentationSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
  onConfirm: (representationType: string) => void;
}

const REPRESENTATION_TYPES = [
  {
    id: 'table',
    name: 'Table',
    icon: Table2,
    description: 'Display data in rows and columns with sorting and filtering',
  },
  {
    id: 'chart',
    name: 'Chart',
    icon: BarChart3,
    description: 'Visualize data with bar, line, pie, or radar charts',
  },
  {
    id: 'heatmap',
    name: 'Heatmap',
    icon: Grid3x3,
    description: 'Show matrix-style data with color-coded values',
  },
  {
    id: 'insights',
    name: 'Insights',
    icon: BarChart3,
    description: 'Display KPIs, metrics, and analytical summaries',
  },
];

export function RepresentationSelectionModal({
  open,
  onOpenChange,
  moduleName,
  onConfirm,
}: RepresentationSelectionModalProps) {
  const [selectedType, setSelectedType] = useState<string>('table');

  const handleConfirm = () => {
    onConfirm(selectedType);
  };

  const handleCancel = () => {
    setSelectedType('table');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        // User clicked outside or pressed escape - cancel the action
        handleCancel();
      }
    }}>
      <DialogContent 
        className="max-w-2xl"
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
            Select Representation Type
          </DialogTitle>
          <DialogDescription 
            style={{
              fontSize: 'var(--text-sm)',
              marginTop: 'var(--spacing-1)',
            }}
          >
            Choose how "{moduleName}" should display data in this section
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div 
          style={{
            padding: 'var(--spacing-6)',
          }}
        >
          <div 
            className="grid grid-cols-2"
            style={{ gap: 'var(--spacing-4)' }}
          >
            {REPRESENTATION_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
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
                      {type.name}
                    </h4>
                    <p 
                      className="text-muted-foreground leading-relaxed"
                      style={{
                        fontSize: 'var(--text-xs)',
                        lineHeight: '1.5',
                      }}
                    >
                      {type.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter 
          style={{
            padding: 'var(--spacing-6)',
            paddingTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-3)',
          }}
        >
          <Button 
            type="button"
            variant="outline" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleConfirm}
          >
            Add Module
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}