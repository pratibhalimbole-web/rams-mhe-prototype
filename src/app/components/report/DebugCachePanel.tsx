/**
 * Debug Cache Panel
 * 
 * Shows what's stored in localStorage cache for debugging purposes
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { localReportCache } from '@/app/services/localReportCache';
import { Database, RefreshCw, Trash2 } from 'lucide-react';

export function DebugCachePanel() {
  const [cachedIds, setCachedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const refreshCache = () => {
    const ids = localReportCache.getCachedReportIds();
    setCachedIds(ids);
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Cached Report IDs:', ids);
    }
  };

  useEffect(() => {
    refreshCache();
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-lg transition-all z-50"
        style={{
          padding: 'var(--spacing-3)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-xs)',
        }}
      >
        <Database style={{ width: '16px', height: '16px' }} />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 bg-card border border-border shadow-xl z-50"
      style={{
        padding: 'var(--spacing-4)',
        borderRadius: 'var(--radius-lg)',
        width: '400px',
        maxHeight: '500px',
        overflow: 'auto',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
          <Database style={{ width: '16px', height: '16px' }} className="text-foreground" />
          <h3
            className="font-semibold text-foreground"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semi-bold)',
            }}
          >
            localStorage Cache Debug
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground"
          style={{
            fontSize: 'var(--text-xs)',
          }}
        >
          ✕
        </button>
      </div>

      <div className="flex" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
        <Button
          size="sm"
          variant="outline"
          onClick={refreshCache}
          className="flex items-center"
          style={{ gap: 'var(--spacing-1)' }}
        >
          <RefreshCw style={{ width: '14px', height: '14px' }} />
          Refresh
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            localReportCache.clearAll();
            refreshCache();
          }}
          className="flex items-center text-destructive hover:text-destructive"
          style={{ gap: 'var(--spacing-1)' }}
        >
          <Trash2 style={{ width: '14px', height: '14px' }} />
          Clear All
        </Button>
      </div>

      <div
        className="border border-border bg-muted/30"
        style={{
          padding: 'var(--spacing-3)',
          borderRadius: 'var(--radius)',
          marginBottom: 'var(--spacing-3)',
        }}
      >
        <p
          className="text-muted-foreground mb-2"
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          Cached Reports: <Badge variant="secondary">{cachedIds.length}</Badge>
        </p>
        
        {cachedIds.length === 0 ? (
          <p
            className="text-muted-foreground italic"
            style={{
              fontSize: 'var(--text-xs)',
            }}
          >
            No reports cached
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {cachedIds.map((id) => {
              const report = localReportCache.getReport(id);
              return (
                <div
                  key={id}
                  className="border border-border bg-card"
                  style={{
                    padding: 'var(--spacing-2)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <p
                    className="font-mono text-foreground mb-1"
                    style={{
                      fontSize: 'var(--text-xs)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {id}
                  </p>
                  {report && (
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      {report.name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20"
        style={{
          padding: 'var(--spacing-3)',
          borderRadius: 'var(--radius)',
        }}
      >
        <p
          className="text-yellow-800 dark:text-yellow-200"
          style={{
            fontSize: 'var(--text-xs)',
          }}
        >
          💡 This panel shows reports cached in browser localStorage to survive server restarts.
        </p>
      </div>
    </div>
  );
}
