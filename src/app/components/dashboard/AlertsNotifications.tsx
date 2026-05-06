"use client";

import React from "react";

interface AlertItem {
  id: string;
  title: string;
  timestamp: string;
  severity: "critical" | "warning" | "info" | "success";
  onClick?: () => void;
}

const mockAlerts: AlertItem[] = [
  {
    id: "1",
    title: "Critical Structural Risk in Zone C",
    timestamp: "25 mins ago",
    severity: "critical",
  },
  {
    id: "2",
    title: "Re-test Overdue Plumbness Test",
    timestamp: "1 hour ago",
    severity: "success",
  },
  {
    id: "3",
    title: "Repeated Failures – Rack Upright",
    timestamp: "3 hours ago",
    severity: "success",
  },
  {
    id: "4",
    title: "Safety Escalation Triggered",
    timestamp: "15 mins ago",
    severity: "critical",
  },
  {
    id: "5",
    title: "Baseplate Settlement Threshold Exceeded",
    timestamp: "4 hours ago",
    severity: "info",
  },
  {
    id: "6",
    title: "New Inspection Cycle Started",
    timestamp: "6 hours ago",
    severity: "warning",
  },
];

const getSeverityColor = (severity: AlertItem["severity"]) => {
  const colors = {
    critical: "var(--destructive)",
    warning: "var(--chart-1)", // Blue 500
    info: "var(--chart-4)", // Cyan 500
    success: "var(--success)",
  };
  return colors[severity];
};

export function AlertsNotifications() {
  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        borderRadius: "var(--radius-lg)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "1px",
        position: "relative",
      }}
    >
      {/* Border overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          pointerEvents: "none",
        }}
      />

      {/* Header Container */}
      <div
        style={{
          height: "58px",
          flexShrink: 0,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "26px",
            left: "var(--spacing-6)",
            top: "var(--spacing-4)",
            right: "var(--spacing-6)",
          }}
        >
          {/* Title */}
          <div style={{ height: "22.391px", position: "relative" }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semi-bold)",
                lineHeight: "1.4",
                color: "var(--foreground)",
                margin: 0,
                position: "absolute",
                left: 0,
                top: "-1px",
              }}
            >
              Alerts & Notifications
            </p>
          </div>

          {/* Badge */}
          <div
            style={{
              backgroundColor: "var(--muted)",
              height: "26px",
              borderRadius: "9999px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              paddingLeft: "var(--spacing-3)",
              paddingRight: "var(--spacing-3)",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                lineHeight: "1.5",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              Last 15 mins
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "var(--spacing-6)",
            overflow: "clip",
            borderRadius: "inherit",
            height: "100%",
          }}
        >
          <div
            style={{
              height: "421px",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "clip",
                paddingRight: "18px",
                borderRadius: "inherit",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-3)",
                  height: "564px",
                  flexShrink: 0,
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                {mockAlerts.map((alert) => (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={alert.onClick}
                    style={{
                      position: "relative",
                      borderRadius: "var(--radius)",
                      flexShrink: 0,
                      width: "100%",
                      backgroundColor: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {/* Border overlay */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        pointerEvents: "none",
                      }}
                    />
                    
                    {/* Content */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--spacing-3)",
                          alignItems: "center",
                          paddingLeft: "13px",
                          paddingRight: "13px",
                          paddingTop: "1px",
                          paddingBottom: "1px",
                          position: "relative",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {/* Severity dot */}
                        <div
                          style={{
                            backgroundColor: getSeverityColor(alert.severity),
                            borderRadius: "var(--radius-sm)",
                            flexShrink: 0,
                            width: "8px",
                            height: "8px",
                          }}
                        />

                        {/* Text content */}
                        <div
                          style={{
                            flex: 1,
                            minHeight: "1px",
                            minWidth: "1px",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--spacing-1)",
                              height: "100%",
                            }}
                          >
                            {/* Title */}
                            <div
                              style={{
                                flex: 1,
                                minHeight: "1px",
                                minWidth: "1px",
                                position: "relative",
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-medium)",
                                  lineHeight: "1.4",
                                  color: "var(--foreground)",
                                  margin: 0,
                                  position: "absolute",
                                  left: 0,
                                  top: alert.id === "3" ? "-0.41px" : 0,
                                }}
                              >
                                {alert.title}
                              </p>
                            </div>

                            {/* Timestamp */}
                            <div
                              style={{
                                height: "18px",
                                flexShrink: 0,
                                position: "relative",
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "var(--text-xs)",
                                  fontWeight: "var(--font-weight-normal)",
                                  lineHeight: "1.5",
                                  color: "var(--muted-foreground)",
                                  margin: 0,
                                  position: "absolute",
                                  left: 0,
                                  top: 0,
                                }}
                              >
                                {alert.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Arrow icon */}
                        <div
                          style={{
                            position: "relative",
                            flexShrink: 0,
                            width: "16px",
                            height: "16px",
                          }}
                        >
                          <svg
                            style={{
                              position: "absolute",
                              display: "block",
                              width: "100%",
                              height: "100%",
                            }}
                            fill="none"
                            preserveAspectRatio="none"
                            viewBox="0 0 16 16"
                          >
                            <g>
                              <path
                                d="M6 12L10 8L6 4"
                                stroke="var(--muted-foreground)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.33333"
                              />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}