/**
 * Save Report Modal
 * 
 * Professional enterprise-grade modal for confirming report save intent.
 * Appears before saving to confirm user action.
 */

import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

interface SaveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  reportName: string;
  reportStatus: string;
  templateName?: string;
}

export function SaveReportModal({
  isOpen,
  onClose,
  onSave,
  reportName,
  reportStatus,
  templateName = 'None',
}: SaveReportModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    
    try {
      await onSave();
      // On success, parent component should close modal
      onClose();
    } catch (error: any) {
      // On failure, keep modal open and show error
      setErrorMessage(
        error?.message || 'Failed to save report. Please check your connection and try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    if (!isSaving) {
      setErrorMessage(null);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent 
        className="sm:max-w-[500px]"
        aria-describedby={undefined}
        style={{
          padding: 0,
          border: `1px solid var(--border)`,
          borderRadius: 'calc(var(--radius) * 1.5)',
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12), 0 2px 6px -2px rgba(0, 0, 0, 0.05)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Accessible Title and Description for Screen Readers */}
        <DialogTitle className="sr-only">Save Report Changes</DialogTitle>
        
        {/* ========================================= */}
        {/* HEADER                                    */}
        {/* ========================================= */}
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
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--muted)',
              }}
            >
              <Save 
                className="h-4 w-4" 
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
                }}
              >Save Report</h2>
            </div>
          </div>
        </div>
        
        {/* ========================================= */}
        {/* BODY                                      */}
        {/* ========================================= */}
        <div style={{ padding: 'var(--spacing-6)' }}>
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: 1.6,
              marginBottom: 'var(--spacing-6)',
            }}
          >This will save the report.</p>
          
          {/* Metadata Block */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-4)',
            }}
          >
            {/* Report Name */}
            <div 
              style={{ 
                paddingBottom: 'var(--spacing-4)',
                borderBottom: `1px solid var(--border)`,
              }}
            >
              <p 
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--muted-foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}
              >
                Report Name
              </p>
              <p 
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}
              >
                {reportName}
              </p>
            </div>
            
            {/* Status */}
            <div 
              style={{ 
                paddingBottom: 'var(--spacing-4)',
                borderBottom: `1px solid var(--border)`,
              }}
            >
              <p 
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--muted-foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}
              >
                Status
              </p>
              <p 
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  lineHeight: 1.5,
                }}
              >
                {reportStatus}
              </p>
            </div>
            
            {/* Template */}
            <div>
              <p 
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--muted-foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}
              >
                Template
              </p>
              <p 
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  lineHeight: 1.5,
                }}
              >
                {templateName}
              </p>
            </div>
          </div>
          
          {/* Error Message - Only show if error exists */}
          {errorMessage && (
            <div 
              className="flex items-start"
              style={{
                marginTop: 'var(--spacing-5)',
                padding: 'var(--spacing-4)',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius)',
                gap: 'var(--spacing-3)',
              }}
            >
              <AlertCircle 
                className="h-4 w-4 shrink-0" 
                style={{ 
                  color: 'rgb(239, 68, 68)',
                  marginTop: '2px',
                }} 
              />
              <p 
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'rgb(239, 68, 68)',
                  fontWeight: 'var(--font-weight-normal)',
                  lineHeight: 1.5,
                }}
              >
                {errorMessage}
              </p>
            </div>
          )}
        </div>
        
        {/* ========================================= */}
        {/* FOOTER                                    */}
        {/* ========================================= */}
        <div 
          style={{ 
            padding: 'var(--spacing-4) var(--spacing-6)',
            borderTop: `1px solid var(--border)`,
            backgroundColor: 'var(--muted)',
          }}
        >
          <div className="flex items-center justify-end" style={{ gap: 'var(--spacing-3)' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
              style={{
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Cancel
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                fontWeight: 'var(--font-weight-medium)',
                minWidth: '120px',
              }}
            >
              {isSaving ? (
                <span className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}