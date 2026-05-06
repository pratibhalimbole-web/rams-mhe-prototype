"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { ChevronRight } from "lucide-react";

const alerts = [
  {
    severity: "Critical",
    message: "Critical Structural Risk in Zone C",
    timestamp: "25 mins ago",
    color: "var(--destructive)",
  },
  {
    severity: "Major",
    message: "Re-test Overdue Plumbness Test",
    timestamp: "1 hour ago",
    color: "var(--chart-3)",
  },
  {
    severity: "Major",
    message: "Repeated Failures – Rack Upright",
    timestamp: "3 hours ago",
    color: "var(--chart-3)",
  },
  {
    severity: "Critical",
    message: "Safety Escalation Triggered",
    timestamp: "15 mins ago",
    color: "var(--destructive)",
  },
  {
    severity: "Minor",
    message: "Baseplate Settlement Threshold Exceeded",
    timestamp: "4 hours ago",
    color: "var(--chart-4)",
  },
  {
    severity: "Info",
    message: "New Inspection Cycle Started",
    timestamp: "6 hours ago",
    color: "var(--chart-1)",
  },
];

export function AlertsNotifications() {
  return (
    <Card
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <CardHeader
        style={{
          paddingTop: "var(--spacing-4)",
          paddingBottom: "var(--spacing-4)",
          paddingLeft: "var(--spacing-6)",
          paddingRight: "var(--spacing-6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <CardTitle
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.4,
              }}
            >
              Alerts & Notifications
            </CardTitle>
          </div>
          
          {/* Badge */}
          <div
            style={{
              padding: "var(--spacing-1) var(--spacing-3)",
              backgroundColor: "var(--muted)",
              borderRadius: "9999px",
              fontSize: "var(--text-xs)",
              fontFamily: "'Inter', sans-serif",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--muted-foreground)",
            }}
          >
            Last 15 mins
          </div>
        </div>
      </CardHeader>

      <CardContent
        style={{
          paddingTop: "0",
          paddingBottom: "0",
          paddingLeft: "var(--spacing-6)",
          paddingRight: "var(--spacing-6)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Alert List - Scrollable Container (Max 4 visible) */}
        <div
          style={{
            maxHeight: "340px",
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "var(--spacing-2)",
            paddingBottom: "var(--spacing-3)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-3)",
            }}
          >
            {alerts.map((alert, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-3)",
                  padding: "var(--spacing-3)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  transition: "background-color 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* Colored Dot */}
                <div
                  style={{
                    minWidth: "8px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: alert.color,
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      fontFamily: "'Inter', sans-serif",
                      color: "var(--foreground)",
                      lineHeight: 1.4,
                    }}
                  >
                    {alert.message}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      fontFamily: "'Inter', sans-serif",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {alert.timestamp}
                  </div>
                </div>

                {/* Chevron Icon */}
                <ChevronRight
                  style={{
                    width: "16px",
                    height: "16px",
                    color: "var(--muted-foreground)",
                    flexShrink: 0,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer - View All Link */}
        {/* Removed per user request */}
      </CardContent>
    </Card>
  );
}