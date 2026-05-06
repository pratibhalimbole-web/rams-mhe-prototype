/**
 * Save Confirmation Modal
 * 
 * Professional enterprise-grade modal for confirming report save operations.
 * Supports three states: Saving, Success, and Error.
 */

import React from 'react';
import { Check, AlertCircle, Loader2, FileText, Clock, LayoutTemplate } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

type SaveState = 'saving' | 'success' | 'error';

interface SaveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SaveState;
  reportName?: string;
  templateName?: string;
  errorMessage?: string;
  onContinueEditing?: () => void;
  onGoToReports?: () => void;
  onPublishNow?: () => void;
  onRetry?: () => void;
  showPublishButton?: boolean;
}

export function SaveConfirmationModal({
  isOpen,
  onClose,
  state,
  reportName = 'Untitled Report',
  templateName = 'None',
  errorMessage = 'An unexpected error occurred while saving the report. Please try again.',
  onContinueEditing,
  onGoToReports,
  onPublishNow,
  onRetry,
  showPublishButton = false,
}: SaveConfirmationModalProps) {
  
  const handleContinueEditing = () => {
    onContinueEditing?.();
    onClose();
  };
  
  const handleGoToReports = () => {
    onGoToReports?.();
    onClose();
  };
  
  const handlePublishNow = () => {
    onPublishNow?.();
    onClose();
  };
  
  const handleRetry = () => {
    onRetry?.();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[540px]"
        aria-describedby={undefined}
        style={{
          padding: 0,
          border: `1px solid var(--border)`,
          borderRadius: 'calc(var(--radius) * 1.5)',
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12), 0 2px 6px -2px rgba(0, 0, 0, 0.05)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ========================================= */}
        {/* SAVING STATE                              */}
        {/* ========================================= */}
        {state === 'saving' && (
          <>
            {/* Accessible Title for Screen Readers */}
            <DialogTitle className="sr-only">Saving Report</DialogTitle>
            
            {/* Header */}
            <div 
              style={{ 
                padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-5)',
                borderBottom: `1px solid var(--border)`,
              }}
            >
              <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
                <div 
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--muted)',
                  }}
                >
                  <Loader2 
                    className="h-5 w-5 animate-spin" 
                    style={{ color: 'var(--foreground)' }} 
                  />
                </div>
                
                <div>
                  <h2 
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-weight-semi-bold)',
                      color: 'var(--foreground)',
                      lineHeight: 1.3,
                      marginBottom: 'var(--spacing-1)',
                    }}
                  >
                    Saving Report
                  </h2>
                  <p 
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)',
                      fontWeight: 'var(--font-weight-normal)',
                      lineHeight: 1.4,
                    }}
                  >
                    Please wait while we save your changes...
                  </p>
                </div>
              </div>
            </div>
            
            {/* Body - Empty for saving state */}
            <div style={{ padding: 'var(--spacing-6)' }}>
              <div 
                className="flex items-center justify-center"
                style={{ 
                  padding: 'var(--spacing-8)',
                }}
              >
                <Loader2 
                  className="h-8 w-8 animate-spin" 
                  style={{ color: 'var(--muted-foreground)' }} 
                />
              </div>
            </div>
          </>
        )}
        
        {/* ========================================= */}
        {/* SUCCESS STATE                             */}
        {/* ========================================= */}
        {state === 'success' && (
          <>
            {/* Accessible Title and Description for Screen Readers */}
            <DialogTitle className="sr-only">Report Saved Successfully</DialogTitle>
            <DialogDescription className="sr-only">
              The report has been saved as a draft. Review the report details and choose your next action.
            </DialogDescription>
            
            {/* Header */}
            <div 
              style={{ 
                padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-5)',
                borderBottom: `1px solid var(--border)`,
              }}
            >
              <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
                <div 
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)', // Soft green background
                  }}
                >
                  <Check 
                    className="h-5 w-5" 
                    style={{ color: 'rgb(34, 197, 94)' }} // Subtle green
                  />
                </div>
                
                <div>
                  <h2 
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-weight-semi-bold)',
                      color: 'var(--foreground)',
                      lineHeight: 1.3,
                    }}
                  >
                    Report Saved Successfully
                  </h2>
                </div>
              </div>
            </div>
            
            {/* Body */}
            <div style={{ padding: 'var(--spacing-6)' }}>
              <p 
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-normal)',
                  lineHeight: 1.6,
                  marginBottom: 'var(--spacing-6)',
                }}
              >
                The report has been saved as a draft. You can continue editing or publish it when ready.
              </p>
              
              {/* Metadata Grid */}
              <div 
                style={{
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--spacing-4) var(--spacing-5)',
                  border: `1px solid var(--border)`,
                }}
              >
                {/* Report Name */}
                <div 
                  className="flex items-start"
                  style={{ 
                    gap: 'var(--spacing-4)',
                    marginBottom: 'var(--spacing-4)',
                  }}
                >
                  <FileText 
                    className="h-4 w-4 shrink-0" 
                    style={{ 
                      color: 'var(--muted-foreground)',
                      marginTop: '2px',
                    }} 
                  />
                  <div className="flex-1 min-w-0">
                    <p 
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--muted-foreground)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 'var(--spacing-1)',
                      }}
                    >
                      Report Name
                    </p>
                    <p 
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--foreground)',
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                      }}
                    >
                      {reportName}
                    </p>
                  </div>
                </div>
                
                {/* Last Saved */}
                <div 
                  className="flex items-start"
                  style={{ 
                    gap: 'var(--spacing-4)',
                    marginBottom: 'var(--spacing-4)',
                  }}
                >
                  <Clock 
                    className="h-4 w-4 shrink-0" 
                    style={{ 
                      color: 'var(--muted-foreground)',
                      marginTop: '2px',
                    }} 
                  />
                  <div className="flex-1 min-w-0">
                    <p 
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--muted-foreground)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 'var(--spacing-1)',
                      }}
                    >
                      Last Saved
                    </p>
                    <p 
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--foreground)',
                        lineHeight: 1.4,
                      }}
                    >
                      Just now
                    </p>
                  </div>
                </div>
                
                {/* Template */}
                <div 
                  className="flex items-start"
                  style={{ 
                    gap: 'var(--spacing-4)',
                  }}
                >
                  <LayoutTemplate 
                    className="h-4 w-4 shrink-0" 
                    style={{ 
                      color: 'var(--muted-foreground)',
                      marginTop: '2px',
                    }} 
                  />
                  <div className="flex-1 min-w-0">
                    <p 
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--muted-foreground)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 'var(--spacing-1)',
                      }}
                    >
                      Template
                    </p>
                    <p 
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--foreground)',
                        lineHeight: 1.4,
                      }}
                    >
                      {templateName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div 
              style={{ 
                padding: 'var(--spacing-4) var(--spacing-6)',
                borderTop: `1px solid var(--border)`,
                backgroundColor: 'var(--muted)',
              }}
            >
              <div className="flex items-center justify-end" style={{ gap: 'var(--spacing-3)' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoToReports}
                  style={{
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Go to Reports
                </Button>
                
                {showPublishButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePublishNow}
                    style={{
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Publish Now
                  </Button>
                )}
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleContinueEditing}
                  style={{
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Continue Editing
                </Button>
              </div>
            </div>
          </>
        )}
        
        {/* ========================================= */}
        {/* ERROR STATE                               */}
        {/* ========================================= */}
        {state === 'error' && (
          <>
            {/* Accessible Title and Description for Screen Readers */}
            <DialogTitle className="sr-only">Save Failed</DialogTitle>
            <DialogDescription className="sr-only">
              An error occurred while saving the report. Review the error details and troubleshooting tips.
            </DialogDescription>
            
            {/* Header */}
            <div 
              style={{ 
                padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-5)',
                borderBottom: `1px solid var(--border)`,
              }}
            >
              <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
                <div 
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Soft red background
                  }}
                >
                  <AlertCircle 
                    className="h-5 w-5" 
                    style={{ color: 'rgb(239, 68, 68)' }} // Subtle red
                  />
                </div>
                
                <div>
                  <h2 
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-weight-semi-bold)',
                      color: 'var(--foreground)',
                      lineHeight: 1.3,
                    }}
                  >
                    Save Failed
                  </h2>
                </div>
              </div>
            </div>
            
            {/* Body */}
            <div style={{ padding: 'var(--spacing-6)' }}>
              <p 
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-normal)',
                  lineHeight: 1.6,
                  marginBottom: 'var(--spacing-5)',
                }}
              >
                {errorMessage}
              </p>
              
              {/* Error Details Box */}
              <div 
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--spacing-4) var(--spacing-5)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <p 
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 'var(--spacing-2)',
                  }}
                >
                  Troubleshooting Tips
                </p>
                <ul 
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    lineHeight: 1.6,
                    paddingLeft: 'var(--spacing-5)',
                    margin: 0,
                  }}
                >
                  <li style={{ marginBottom: 'var(--spacing-1)' }}>Check your internet connection</li>
                  <li style={{ marginBottom: 'var(--spacing-1)' }}>Ensure you have the necessary permissions</li>
                  <li>Try refreshing the page if the issue persists</li>
                </ul>
              </div>
            </div>
            
            {/* Footer */}
            <div 
              style={{ 
                padding: 'var(--spacing-4) var(--spacing-6)',
                borderTop: `1px solid var(--border)`,
                backgroundColor: 'var(--muted)',
              }}
            >
              <div className="flex items-center justify-end" style={{ gap: 'var(--spacing-3)' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  style={{
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRetry}
                  style={{
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Retry Save
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}