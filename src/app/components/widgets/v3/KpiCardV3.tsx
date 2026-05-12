import React from "react";

interface KpiCardV3Props {
  label: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
}

export function KpiCardV3({ label, value, description, icon: Icon }: KpiCardV3Props) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "1px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px 4px 16px",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "18px",
            color: "#0f172a",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <Icon
          style={{
            width: "12px",
            height: "12px",
            color: "#64748b",
            flexShrink: 0,
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: "8px 16px 12px 16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "30px",
            color: "#0f172a",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "15px",
            color: "#64748b",
          }}
        >
          {description}
        </span>
      </div>
    </div>
  );
}
