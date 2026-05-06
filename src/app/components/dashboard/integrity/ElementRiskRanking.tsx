"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

const riskData = [
  { element: "Rack Upright", failures: 9, severity: "Critical", trend: "+12%" },
  { element: "Beam", failures: 7, severity: "Critical", trend: "+8%" },
  { element: "Baseplate Settlement", failures: 5, severity: "Major", trend: "-3%" },
  { element: "System", failures: 3, severity: "Minor", trend: "0%" },
  { element: "Floor", failures: 2, severity: "Minor", trend: "-5%" },
];

const getSeverityColor = (severity: string) => {
  if (severity === "Critical") return "var(--destructive)";
  if (severity === "Major") return "var(--warning)";
  return "var(--muted-foreground)";
};

const getSeverityBg = (severity: string) => {
  if (severity === "Critical") return "rgba(239, 68, 68, 0.1)";
  if (severity === "Major") return "rgba(251, 191, 36, 0.1)";
  return "rgba(100, 116, 139, 0.06)";
};

export function ElementRiskRanking() {
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
          paddingBottom: "0",
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
              Element Risk Ranking
            </CardTitle>
            <div
              style={{
                fontSize: "var(--text-sm)",
                fontFamily: "'Inter', sans-serif",
                color: "var(--muted-foreground)",
                marginTop: "var(--spacing-1)",
              }}
            >
              Sorted by failure count
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent
        style={{
          paddingTop: "0",
          paddingBottom: "var(--spacing-6)",
          paddingLeft: "var(--spacing-6)",
          paddingRight: "var(--spacing-6)",
          flex: "1",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-3)",
        }}
      >
        {riskData.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
              padding: "var(--spacing-4)",
              backgroundColor: "var(--muted)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {/* Rank Badge */}
            <div
              style={{
                minWidth: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius)",
                backgroundColor: index === 0 
                  ? "var(--primary)" 
                  : index === 1 
                  ? "var(--warning)" 
                  : "var(--secondary)",
                color: index === 0 
                  ? "var(--primary-foreground)" 
                  : index === 1 
                  ? "var(--card)" 
                  : "var(--muted-foreground)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {index + 1}
            </div>

            {/* Element Name */}
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
                  fontWeight: "var(--font-weight-semi-bold)",
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--foreground)",
                }}
              >
                {item.element}
              </div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--muted-foreground)",
                }}
              >
                {item.failures} failure{item.failures !== 1 ? 's' : ''} detected
              </div>
            </div>

            {/* Severity Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--spacing-1) var(--spacing-3)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: getSeverityBg(item.severity),
                border: `1px solid ${getSeverityColor(item.severity)}`,
              }}
            >
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  color: getSeverityColor(item.severity),
                }}
              >
                {item.severity}
              </span>
            </div>

            {/* Trend Indicator */}
            <div
              style={{
                minWidth: "48px",
                textAlign: "right",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
                color: item.trend.startsWith('+') 
                  ? "var(--destructive)" 
                  : item.trend.startsWith('-') 
                  ? "var(--success)" 
                  : "var(--muted-foreground)",
              }}
            >
              {item.trend}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}