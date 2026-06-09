import React from "react";
import { Activity } from "lucide-react";

interface MonitoringSplitCardV3Props {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  metrics: Array<{ label: string; value: string; suffix?: string }>;
  actionLabel?: string;
  footerCaption?: string;
}

export function MonitoringSplitCardV3({ title, metrics, actionLabel, footerCaption }: MonitoringSplitCardV3Props) {
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
      {/* Header: icon badge + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width: "20px",
            height: "20px",
            background: "rgba(37, 99, 235, 0.08)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Activity style={{ width: "10px", height: "10px", color: "#2563eb" }} />
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
          {title}
        </span>
      </div>

      {/* Metrics row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {metrics.map((metric, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <div
                style={{
                  width: "1px",
                  height: "44px",
                  background: "var(--w-border)",
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
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
                  {metric.value}
                </span>
                {metric.suffix && (
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "var(--w-text-2)",
                      marginLeft: "2px",
                    }}
                  >
                    {metric.suffix}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "15px",
                  color: "var(--w-text-2)",
                }}
              >
                {metric.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Footer */}
      {actionLabel && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "10px",
              lineHeight: "15px",
              color: "var(--w-text-2)",
            }}
          >
            {actionLabel}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px", color: "var(--w-text-2)" }}>
            ›
          </span>
        </div>
      )}
      {footerCaption && (
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "10px",
            lineHeight: "15px",
            color: "#1b59f8",
          }}
        >
          {footerCaption}
        </span>
      )}
    </div>
  );
}
