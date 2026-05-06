import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Lock, FileCheck, Layers, Box } from 'lucide-react';

interface PublishConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  templateName: string;
  version: number;
  sectionsCount: number;
  modulesCount: number;
  isPublishing?: boolean;
}

export function PublishConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  templateName,
  version,
  sectionsCount,
  modulesCount,
  isPublishing = false,
}: PublishConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[480px] p-6 rounded-2xl gap-0"
        style={{
          borderRadius: "var(--radius-2xl)",
        }}
      >
        <DialogHeader className="mb-4 space-y-2">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 shrink-0"
              style={{
                borderRadius: "var(--radius-xl)",
              }}
            >
              <FileCheck className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle 
              className="text-foreground"
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Publish Template
            </DialogTitle>
          </div>
          <DialogDescription 
            className="text-muted-foreground leading-relaxed pt-1"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              fontFamily: "'Inter', sans-serif",
              lineHeight: "1.6",
            }}
          >
            You are about to publish this template. Once published, the template structure will be locked. Future changes will create a new version.
          </DialogDescription>
        </DialogHeader>

        {/* Template Information */}
        <div 
          className="mb-6 space-y-4"
          style={{
            marginBottom: "var(--spacing-6)",
          }}
        >
          {/* Template Name */}
          <div className="flex items-start justify-between gap-4">
            <span 
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Template
            </span>
            <span 
              className="text-foreground text-right"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {templateName}
            </span>
          </div>

          {/* Version */}
          <div className="flex items-center justify-between gap-4">
            <span 
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Version
            </span>
            <span 
              className="text-muted-foreground font-mono"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
              }}
            >
              v{version}
            </span>
          </div>

          {/* Sections Count */}
          <div className="flex items-center justify-between gap-4">
            <span 
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Sections
            </span>
            <span 
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {sectionsCount}
            </span>
          </div>

          {/* Modules Count */}
          <div className="flex items-center justify-between gap-4">
            <span 
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Modules
            </span>
            <span 
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {modulesCount}
            </span>
          </div>
        </div>

        {/* Warning Notice */}
        <div 
          className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl mb-6"
          style={{
            borderRadius: "var(--radius-xl)",
            padding: "var(--spacing-3)",
            marginBottom: "var(--spacing-6)",
          }}
        >
          <Lock className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p 
              className="text-amber-900 dark:text-amber-200 leading-relaxed"
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
                lineHeight: "1.5",
              }}
            >
              <strong>Important:</strong> Once published, you cannot modify this template. Any edits will create a new draft version.
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter 
          className="gap-3 sm:gap-3"
          style={{
            gap: "var(--spacing-3)",
          }}
        >
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isPublishing}
            className="min-w-[140px]"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-semi-bold)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {isPublishing ? "Publishing..." : "Confirm Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}