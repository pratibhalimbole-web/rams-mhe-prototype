import React from 'react';
import { AlertCircle, Database, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

interface DatabaseErrorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage?: string;
}

export function DatabaseErrorModal({ open, onOpenChange, errorMessage }: DatabaseErrorModalProps) {
  const isDatabaseTableError = errorMessage?.includes('Could not find the table') || 
                                errorMessage?.includes('Database table not found');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10">
              <Database className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {isDatabaseTableError ? 'Database Setup Required' : 'Connection Error'}
            </DialogTitle>
          </div>
          <DialogDescription
            className="text-foreground/80"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              fontFamily: "'Inter', sans-serif",
              lineHeight: "1.5",
            }}
          >
            {isDatabaseTableError ? (
              <>
                <p className="mb-3">
                  The required database table is not set up yet. This typically happens when:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-3 text-muted-foreground">
                  <li>The database schema hasn't been initialized</li>
                  <li>The table was accidentally deleted</li>
                  <li>There's a configuration mismatch</li>
                </ul>
                <p>
                  Please check the server logs for the expected table name and ensure it exists in your Supabase database.
                </p>
              </>
            ) : (
              <p>
                Unable to connect to the database. Please check your connection and try again.
                {errorMessage && (
                  <span className="block mt-2 text-xs font-mono bg-muted p-2 rounded border border-border">
                    {errorMessage}
                  </span>
                )}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {isDatabaseTableError && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p 
                  className="text-amber-900 dark:text-amber-200"
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Technical Details
                </p>
                <p 
                  className="text-amber-800 dark:text-amber-300 mt-1"
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-weight-normal)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Check the server console logs to find the expected table name (look for "kv_store_" prefix). 
                  Create this table in your Supabase dashboard using the schema defined in <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">kv_store.tsx</code>.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            style={{
              fontSize: "var(--text-sm)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Close
          </Button>
          {isDatabaseTableError && (
            <Button 
              onClick={() => {
                window.open('https://supabase.com/dashboard', '_blank');
              }}
              style={{
                fontSize: "var(--text-sm)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Supabase Dashboard
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
