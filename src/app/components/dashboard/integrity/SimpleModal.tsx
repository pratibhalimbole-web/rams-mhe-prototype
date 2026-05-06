import React, { useEffect, useRef, createContext, useContext } from "react";
import { X } from "lucide-react";

interface SimpleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

// Context to share modal IDs with child components
interface ModalContextType {
  titleId: string;
  descriptionId: string;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function SimpleModal({ open, onOpenChange, children }: SimpleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).substr(2, 9)}`).current;
  const descriptionId = useRef(`modal-description-${Math.random().toString(36).substr(2, 9)}`).current;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Mark that modal is open in DOM for Figma detection
      document.body.setAttribute('data-modal-active', 'true');
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute('data-modal-active');
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute('data-modal-active');
    };
  }, [open]);

  // Prevent overlay click handler
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on overlay, not on modal content
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  // Handle backdrop clicks separately
  const handleBackdropClick = (e: React.MouseEvent) => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <ModalContext.Provider value={{ titleId, descriptionId }}>
      <div
        data-modal-overlay="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none", // ✅ CRITICAL FIX: Changed to "none" so dropdown portals can receive clicks
        }}
        onMouseDown={(e) => {
          // Prevent mousedown from bubbling during edit mode
          if (document.querySelector('[data-figma-editing-mode]')) {
            e.stopPropagation();
          }
        }}
      >
        {/* Overlay */}
        <div
          data-modal-backdrop="true"
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            pointerEvents: "auto", // ✅ Enable clicks on backdrop for close-on-outside-click
            zIndex: 49, // ✅ Below modal content but above everything else
          }}
        />

        {/* Content Container - FLEXBOX with max-height */}
        <div
          ref={modalRef}
          data-modal-content="true"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onClick={(e) => {
            // Stop propagation to prevent closing modal when clicking inside
            e.stopPropagation();
          }}
          style={{
            position: "relative",
            zIndex: 51,
            backgroundColor: "var(--card)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            maxWidth: "920px",
            width: "calc(100% - 2rem)",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            overflow: "visible", // ✅ CRITICAL: Changed from "hidden" to "visible" to allow Select dropdown portals
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            pointerEvents: "auto",
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            data-modal-close="true"
            aria-label="Close modal"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenChange(false);
            }}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-foreground)",
              borderRadius: "var(--radius-sm)",
              transition: "background-color 0.2s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X className="size-4" />
          </button>

          {/* Content - Uses children directly */}
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

interface SimpleModalHeaderProps {
  children: React.ReactNode;
}

export function SimpleModalHeader({ children }: SimpleModalHeaderProps) {
  return (
    <div
      data-modal-header="true"
      style={{
        flexShrink: 0,
        padding: "var(--spacing-6)",
        paddingBottom: "var(--spacing-4)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  );
}

interface SimpleModalTitleProps {
  children: React.ReactNode;
}

export function SimpleModalTitle({ children }: SimpleModalTitleProps) {
  const context = useContext(ModalContext);
  
  return (
    <h2
      id={context?.titleId}
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "var(--text-xl)",
        fontWeight: "var(--font-weight-semi-bold)",
        color: "var(--foreground)",
        lineHeight: "1.33",
        margin: 0,
      }}
    >
      {children}
    </h2>
  );
}

interface SimpleModalDescriptionProps {
  children: React.ReactNode;
}

export function SimpleModalDescription({ children }: SimpleModalDescriptionProps) {
  const context = useContext(ModalContext);
  
  return (
    <p
      id={context?.descriptionId}
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--muted-foreground)",
        lineHeight: "1.43",
        margin: 0,
        marginTop: "var(--spacing-2)",
      }}
    >
      {children}
    </p>
  );
}

interface SimpleModalBodyProps {
  children: React.ReactNode;
}

export function SimpleModalBody({ children }: SimpleModalBodyProps) {
  return (
    <div
      data-modal-body="true"
      style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "var(--spacing-5) var(--spacing-6)",
        paddingBottom: "var(--spacing-6)",
      }}
    >
      {children}
    </div>
  );
}

interface SimpleModalFooterProps {
  children: React.ReactNode;
}

export function SimpleModalFooter({ children }: SimpleModalFooterProps) {
  return (
    <div
      data-modal-footer="true"
      style={{
        flexShrink: 0,
        padding: "var(--spacing-4) var(--spacing-6)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "flex-end",
        gap: "var(--spacing-3)",
        backgroundColor: "var(--card)",
      }}
    >
      {children}
    </div>
  );
}