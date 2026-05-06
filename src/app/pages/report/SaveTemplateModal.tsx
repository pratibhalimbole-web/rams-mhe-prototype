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

interface SaveTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSaving?: boolean;
}

export function SaveTemplateModal({ 
  open, 
  onOpenChange, 
  onConfirm,
  isSaving = false 
}: SaveTemplateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-full"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <DialogHeader>
          <DialogTitle
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: "var(--font-weight-semi-bold)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Save Template
          </DialogTitle>
          <DialogDescription
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            You are about to save changes to this template. This will update the current draft version.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter
          style={{
            gap: "var(--spacing-2)",
            marginTop: "var(--spacing-4)",
          }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {isSaving ? 'Saving...' : 'Confirm Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}