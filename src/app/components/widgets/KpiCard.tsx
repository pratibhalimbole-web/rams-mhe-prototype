import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  icon: LucideIcon;
  value: string | number;
  contextLine: string;
  onClick?: () => void;
  accentColor?: string;
  subtitle?: string;
}

export function KpiCard({
  icon: Icon,
  value,
  contextLine,
  onClick,
  accentColor = "#2563EB",
  subtitle,
}: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg border border-[var(--border)] bg-[var(--background)] transition-all ${
        onClick ? "cursor-pointer hover:bg-[var(--muted)]/30 hover:shadow-sm" : ""
      }`}
    >
      {/* Icon + Value Row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div style={{ color: accentColor }}>
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>

      {/* Big Value */}
      <p className="text-3xl font-bold text-[var(--foreground)] mb-2 leading-tight">
        {value}
      </p>

      {/* Subtitle if provided */}
      {subtitle && (
        <p className="text-xs text-[var(--muted-foreground)] mb-2">
          {subtitle}
        </p>
      )}

      {/* Context Line (compact, single line) */}
      <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
        {contextLine}
      </p>
    </div>
  );
}
