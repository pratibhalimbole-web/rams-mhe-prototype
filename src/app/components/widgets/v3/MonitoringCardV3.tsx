import React from "react";
import { TrendingUp } from "lucide-react";

interface MonitoringCardV3Props {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  highlight: string;
  value: string;
  suffix?: string;
  progress?: number;
  caption?: string;
}

export function MonitoringCardV3({ title, highlight, value, suffix, progress, caption }: MonitoringCardV3Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "16px 20px",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header: icon badge + title + highlight */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width: "20px",
            height: "20px",
            background: "rgba(22, 163, 74, 0.08)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <TrendingUp style={{ width: "10px", height: "10px", color: "#16a34a" }} />
        </div>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "10px",
            lineHeight: "15px",
            color: "var(--w-text-2)",
            whiteSpace: "nowrap",
          }}
        >
          {title}{" "}
          <span style={{ fontWeight: 600, color: "var(--w-text-1)" }}>{highlight}</span>
        </span>
      </div>

      {/* Value */}
      <div>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "30px",
            lineHeight: "30px",
            color: "var(--w-text-1)",
            letterSpacing: "-0.75px",
          }}
        >
          {value}
        </span>
        {suffix && (
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: "var(--w-text-2)",
              marginLeft: "4px",
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* Progress bar + caption */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {progress !== undefined && (
          <div
            style={{
              width: "100%",
              height: "3px",
              background: "var(--w-bg-muted)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#16a34a",
                borderRadius: "3px",
              }}
            />
          </div>
        )}
        {caption && (
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "10px",
              lineHeight: "15px",
              color: "#16a34a",
            }}
          >
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
