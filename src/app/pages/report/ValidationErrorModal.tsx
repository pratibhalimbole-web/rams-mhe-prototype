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
import { AlertCircle } from 'lucide-react';

interface ValidationErrorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errors: string[];
  onGoToFirstError?: () => void; // Optional callback to scroll to first error
}

export function ValidationErrorModal({ 
  open, 
  onOpenChange, 
  errors,
  onGoToFirstError
}: ValidationErrorModalProps) {
  const handleFixIssues = () => {
    if (onGoToFirstError) {
      onGoToFirstError();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[480px] animate-in fade-in-0 duration-150"
        style={{
          fontFamily: "'Inter', sans-serif",
          padding: "var(--spacing-6)",
          borderRadius: "var(--radius)",
        }}
      >
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div 
                className="flex items-center justify-center rounded-full bg-destructive/10"
                style={{
                  width: "var(--spacing-10)",
                  height: "var(--spacing-10)",
                }}
              >
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <div className="flex-1">
              <DialogTitle
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--font-weight-semi-bold)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Cannot Publish Template
              </DialogTitle>
              <DialogDescription
                className="mt-1.5"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--muted-foreground)",
                }}
              >
                This template contains validation issues that must be resolved before publishing.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div 
          className="mt-4 bg-red-50 border border-red-200"
          style={{
            padding: "var(--spacing-4)",
            borderRadius: "12px",
          }}
        >
          <h4 
            className="mb-3 text-destructive"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-semi-bold)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Validation Issues ({errors.length})
          </h4>
          <ul className="space-y-2">
            {errors.map((error, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 text-foreground/90"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <span className="flex-shrink-0 mt-1.5 h-1 w-1 rounded-full bg-destructive"></span>
                <span className="flex-1">{error}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter
          className="flex-row items-center !justify-end"
          style={{
            marginTop: "var(--spacing-6)",
            gap: "var(--spacing-4)",
          }}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-10"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "'Inter', sans-serif",
              borderRadius: "10px",
            }}
          >
            Close
          </Button>
          {onGoToFirstError && (
            <Button
              type="button"
              onClick={handleFixIssues}
              className="h-10"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
                borderRadius: "10px",
              }}
            >
              Fix Issues
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}