/**
 * Download Report Modal
 * 
 * Professional export modal for downloading reports in various formats.
 * Clean, enterprise-focused design for audit and inspection platforms.
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
import { FileText, FileSpreadsheet, Check } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportName: string;
  reportId?: string;
}

type FileFormat = 'pdf' | 'docx' | 'csv';

interface FormatOption {
  id: FileFormat;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  recommended?: boolean;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'pdf',
    icon: FileText,
    title: 'PDF Document',
    description: 'Professional format for reports and presentations',
    recommended: true,
  },
  {
    id: 'docx',
    icon: FileText,
    title: 'Word Document',
    description: 'Editable format for further modifications',
  },
  {
    id: 'csv',
    icon: FileSpreadsheet,
    title: 'Data Export (CSV)',
    description: 'Raw data for analysis and processing',
  },
];

export function DownloadReportModal({
  open,
  onOpenChange,
  reportName,
  reportId,
}: DownloadReportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<FileFormat>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Download started', {
        description: `Downloading ${reportName}.${selectedFormat}`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed', {
        description: 'Please try again',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 gap-0 overflow-hidden"
        style={{
          maxWidth: '520px',
          borderRadius: 'calc(var(--radius) * 2)',
        }}
      >
        {/* Header */}
        <DialogHeader 
          className="border-b border-border"
          style={{
            padding: 'var(--spacing-6)',
          }}
        >
          <DialogTitle 
            className="text-foreground"
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semi-bold)',
            }}
          >
            Download Report
          </DialogTitle>
          <DialogDescription 
            className="text-muted-foreground"
            style={{
              fontSize: 'var(--text-sm)',
              marginTop: 'var(--spacing-1)',
            }}
          >
            Choose a file format for your report
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div 
          style={{
            padding: 'var(--spacing-6)',
          }}
        >
          <div 
            className="space-y-3"
          >
            {FORMAT_OPTIONS.map((format) => {
              const Icon = format.icon;
              const isSelected = selectedFormat === format.id;

              return (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => setSelectedFormat(format.id)}
                  className={cn(
                    'w-full flex items-start gap-4 text-left transition-all duration-200',
                    'bg-card',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 hover:bg-muted/30'
                  )}
                  style={{
                    padding: 'var(--spacing-4)',
                    borderRadius: 'calc(var(--radius) * 1.25)',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                  }}
                >
                  {/* Icon Container */}
                  <div
                    className={cn(
                      'flex items-center justify-center flex-shrink-0 transition-colors',
                      isSelected ? 'bg-primary/10' : 'bg-muted/50'
                    )}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <Icon
                      className={cn(
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      )}
                      style={{
                        width: '18px',
                        height: '18px',
                      }}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className="font-semibold text-foreground"
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-semi-bold)',
                        }}
                      >
                        {format.title}
                      </h4>
                      {format.recommended && (
                        <span
                          className="text-primary"
                          style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          Recommended
                        </span>
                      )}
                    </div>
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: 'var(--text-xs)',
                        marginTop: 'var(--spacing-1)',
                        lineHeight: '1.4',
                      }}
                    >
                      {format.description}
                    </p>
                  </div>

                  {/* Check Icon */}
                  {isSelected && (
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: '20px',
                        height: '20px',
                      }}
                    >
                      <Check
                        className="text-primary"
                        style={{
                          width: '16px',
                          height: '16px',
                        }}
                        strokeWidth={2.5}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter
          className="border-t border-border flex-row items-center justify-end gap-3"
          style={{
            padding: 'var(--spacing-5) var(--spacing-6)',
            backgroundColor: 'var(--muted-subtle, var(--muted))',
          }}
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDownloading}
            style={{
              height: '36px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            style={{
              height: '36px',
            }}
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}