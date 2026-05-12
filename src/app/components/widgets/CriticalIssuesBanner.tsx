import React from "react";
import arrowIcon from "../../../assets/icon-arrow-right.png";

interface CriticalIssuesBannerProps {
  count: number;
  trendNote?: string;
  onRemindLater?: () => void;
  onViewAll?: () => void;
}

export function CriticalIssuesBanner({
  count,
  trendNote,
  onRemindLater,
  onViewAll,
}: CriticalIssuesBannerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        height: "82px",
        borderRadius: "12px",
        background: "rgba(225, 29, 72, 0.12)",
        border: "1px solid #fda4af",
        padding: "17px 21px",
        boxSizing: "border-box",
      }}
    >
      {/* Left: label + subtitle */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "11px",
            lineHeight: "16.5px",
            letterSpacing: "0.275px",
            textTransform: "uppercase",
            color: "#e11d48",
            whiteSpace: "nowrap",
          }}
        >
          Critical Issues Need Attention
        </span>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "10px",
            lineHeight: "15px",
            color: "#64748b",
            whiteSpace: "nowrap",
          }}
        >
          Across warranty, license, and inspection findings
        </span>
      </div>

      {/* Count */}
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          fontSize: "48px",
          lineHeight: "48px",
          letterSpacing: "-1.2px",
          color: "#e11d48",
          flexShrink: 0,
        }}
      >
        {count}
      </span>

      {/* Trend note */}
      {trendNote && (
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "11px",
            lineHeight: "16.5px",
            color: "#e11d48",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {trendNote}
        </span>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Remind me later */}
      <button
        onClick={onRemindLater}
        style={{
          height: "30.5px",
          padding: "0 14px",
          borderRadius: "6px",
          border: "1px solid #fda4af",
          background: "transparent",
          color: "#e11d48",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "11px",
          lineHeight: "16.5px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Remind me later
      </button>

      {/* View All Issues */}
      <button
        onClick={onViewAll}
        style={{
          height: "28.5px",
          padding: "0 14px",
          borderRadius: "6px",
          border: "none",
          background: "#e11d48",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "11px",
          lineHeight: "16.5px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        View All Issues
        <img src={arrowIcon} alt="" style={{ width: "12px", height: "12px", display: "block" }} />
      </button>
    </div>
  );
}
