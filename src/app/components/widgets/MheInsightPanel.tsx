import React from "react";

interface MheInsightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  mainValue: string | number;
  subtitle?: string;
  sections: Array<{
    heading: string;
    content: React.ReactNode;
  }>;
}

export function MheInsightPanel({
  isOpen,
  onClose,
  title,
  mainValue,
  subtitle,
  sections,
}: MheInsightPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
        style={{ backdropFilter: "blur(2px)" }}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full bg-[var(--background)] border-l border-[var(--border)] overflow-y-auto z-50 w-[40vw]"
        style={{ animation: "slideIn 0.3s ease-out" }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Sticky Header */}
        <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--border)] p-6 z-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1"
              aria-label="Close panel"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Header Content */}
          <div>
            <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
              {mainValue}
            </p>
            {subtitle && (
              <p className="text-xs text-[var(--muted-foreground)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
                {section.heading}
              </h3>
              <div className="text-sm text-[var(--muted-foreground)]">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
