"use client";

import React, { useState } from "react";

// Import section components
import { KpiStrip } from "./integrity/KpiStrip";
import { RiskIndexTrendChart } from "./integrity/RiskIndexTrendChart";
import { SeverityAnalytics } from "./integrity/SeverityAnalytics";
import { StackedDonutAnalytics } from "./integrity/StackedDonutAnalytics";
import { FailureDistribution } from "./integrity/FailureDistribution";
import { ElementRiskRanking } from "./integrity/ElementRiskRanking";
import { AlertsNotifications } from "./integrity/AlertsNotifications";
import { SafetyIntelligence } from "./integrity/SafetyIntelligence";

export function IntegrityOverview() {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--background)",
      }}
    >
      {/* Main Content - Single Scroll Layer */}
      <main className="flex-1">
        <div 
          style={{
            maxWidth: "var(--container-max-width)",
            margin: "0 auto",
            paddingLeft: "0px",
            paddingRight: "0px",
            paddingTop: "0px",
            paddingBottom: "0px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
            {/* 2️⃣ KPI STRIP */}
            <section>
              <KpiStrip
                totalTests={72}
                testsExecuted={67}
                testsFailed={12}
                criticalFailures={5}
              />
            </section>

            {/* 3️⃣ PRIMARY ANALYTICS ROW */}
            <section 
              className="grid"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--spacing-6)",
                alignItems: "stretch",
              }}
            >
              {/* LEFT: Failure Distribution (2 cols) */}
              <div 
                className="h-full"
                style={{
                  gridColumn: "span 2",
                }}
              >
                <FailureDistribution />
              </div>

              {/* RIGHT: Severity Analytics (1 col) */}
              <div 
                className="h-full"
                style={{
                  gridColumn: "span 1",
                }}
              >
                <StackedDonutAnalytics 
                  byElement={[
                    { name: "Beam", total: 40, done: 35, failed: 5 },
                    { name: "Baseplate", total: 25, done: 20, failed: 5 },
                    { name: "Bracing", total: 30, done: 28, failed: 2 },
                    { name: "Upright", total: 35, done: 30, failed: 5 },
                    { name: "Other", total: 20, done: 18, failed: 2 },
                  ]}
                  byTestType={[
                    { name: "Integrity", total: 50, done: 45, failed: 5 },
                    { name: "Load", total: 40, done: 35, failed: 5 },
                    { name: "Stability", total: 35, done: 32, failed: 3 },
                    { name: "Deflection", total: 25, done: 23, failed: 2 },
                  ]}
                />
              </div>
            </section>

            {/* 6️⃣ SAFETY INTELLIGENCE SECTION */}
          </div>
        </div>
      </main>
    </div>
  );
}