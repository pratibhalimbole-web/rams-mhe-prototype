import React, { useEffect, useState } from 'react';
import { AlertTriangle, Database, X } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface StorageStatus {
  usingMemoryStore: boolean;
  storageType: 'in-memory' | 'database';
  warning: string | null;
}

export function StorageWarningBanner() {
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);
  const [serverUnreachable, setServerUnreachable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner in this session
    const isDismissed = sessionStorage.getItem('storage-warning-dismissed');
    if (isDismissed) {
      setDismissed(true);
      return;
    }

    // Skip check if projectId or publicAnonKey are not configured
    if (!projectId || !publicAnonKey || projectId === 'your-project-id') {
      console.log('Supabase not configured - skipping storage check');
      setDismissed(true); // Auto-dismiss if not configured
      return;
    }

    async function checkStorageStatus() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-02ca646a/storage-status`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const status = await response.json();
          setStorageStatus(status);
          setServerUnreachable(false);
        } else {
          // Silently handle non-OK responses - server may not be deployed yet
          setServerUnreachable(true);
          setDismissed(true); // Auto-dismiss to prevent showing error banner
        }
      } catch (error: any) {
        // Silently handle errors - server may not be deployed yet
        setServerUnreachable(true);
        setDismissed(true); // Auto-dismiss to prevent showing error banner
      }
    }

    checkStorageStatus();
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02ca646a/health`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        setServerUnreachable(false);
        // Reload the page to fetch data
        window.location.reload();
      } else {
        console.error('Server health check failed');
      }
    } catch (error) {
      console.error('Server is still unreachable:', error);
    } finally {
      setRetrying(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('storage-warning-dismissed', 'true');
  };

  // Show server unreachable error (highest priority)
  if (serverUnreachable && !dismissed) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: 'rgb(254, 226, 226)', // red-100
          borderBottom: '1px solid rgb(248, 113, 113)', // red-400
          padding: 'var(--spacing-3) var(--spacing-6)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgb(252, 165, 165)', // red-300
              flexShrink: 0,
            }}
          >
            <AlertTriangle className="h-5 w-5" style={{ color: 'rgb(153, 27, 27)' }} /> {/* red-900 */}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                marginBottom: 'var(--spacing-1)',
                color: 'rgb(153, 27, 27)', // red-900
              }}
            >
              Server Unreachable
            </p>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                fontFamily: "'Inter', sans-serif",
                color: 'rgb(127, 29, 29)', // red-950
              }}
            >
              Cannot connect to Supabase Edge Function. Please verify the server is deployed and running.{' '}
              <a
                href="/SUPABASE_SERVER_FIX.md"
                target="_blank"
                style={{
                  color: 'rgb(153, 27, 27)',
                  textDecoration: 'underline',
                }}
              >
                View troubleshooting guide
              </a>
            </p>
          </div>

          <button
            onClick={handleRetry}
            disabled={retrying}
            style={{
              padding: 'var(--spacing-2) var(--spacing-4)',
              backgroundColor: 'rgb(153, 27, 27)', // red-900
              color: 'white',
              border: 'none',
              cursor: retrying ? 'not-allowed' : 'pointer',
              borderRadius: 'var(--radius-md)',
              fontFamily: "'Inter', sans-serif",
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              opacity: retrying ? 0.6 : 1,
            }}
          >
            {retrying ? 'Retrying...' : 'Retry'}
          </button>

          <button
            onClick={handleDismiss}
            style={{
              padding: 'var(--spacing-2)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              color: 'rgb(153, 27, 27)', // red-900
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(252, 165, 165)'; // red-300
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Dismiss warning"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Don't show banner if using database or if dismissed
  if (!storageStatus || !storageStatus.usingMemoryStore || dismissed) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'rgb(254, 243, 199)', // amber-100
        borderBottom: '1px solid rgb(251, 191, 36)', // amber-400
        padding: 'var(--spacing-3) var(--spacing-6)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgb(252, 211, 77)', // amber-300
            flexShrink: 0,
          }}
        >
          <AlertTriangle className="h-5 w-5" style={{ color: 'rgb(146, 64, 14)' }} /> {/* amber-900 */}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              fontFamily: "'Inter', sans-serif",
              marginBottom: 'var(--spacing-1)',
            }}
          >
            Using In-Memory Storage - Data will be lost on server restart. The database table{' '}
            <code
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              kv_store_02ca646a
            </code>{' '}
            needs to be created in Supabase.
          </p>
        </div>

        <button
          onClick={handleDismiss}
          style={{
            padding: 'var(--spacing-2)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            color: 'rgb(146, 64, 14)', // amber-900
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgb(252, 211, 77)'; // amber-300
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Dismiss warning"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}