"use client";

import React from "react";
import {
  SimpleModal,
  SimpleModalHeader,
  SimpleModalTitle,
  SimpleModalDescription,
  SimpleModalBody,
  SimpleModalFooter,
} from "../integrity/SimpleModal";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface RackInspectionData {
  day: string;
  expected: number;
  completed: number;
  gap: number;
}

interface RacksInspectedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalRacksInspected: number;
}

// Sample data - Expected vs Completed by Day
const inspectionProgressData: RackInspectionData[] = [
  { day: "Day 1", expected: 80, completed: 75, gap: -5 },
  { day: "Day 2", expected: 100, completed: 98, gap: -2 },
  { day: "Day 3", expected: 110, completed: 112, gap: 2 },
  { day: "Day 4", expected: 120, completed: 96, gap: -24 },
  { day: "Day 5", expected: 100, completed: 102, gap: 2 },
  { day: "Day 6", expected: 90, completed: 88, gap: -2 },
  { day: "Day 7", expected: 105, completed: 81, gap: -24 },
  { day: "Day 8", expected: 95, completed: 94, gap: -1 },
];

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: RackInspectionData;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isAboveTarget = data.gap >= 0;
    
    return (
      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "var(--spacing-3)",
          boxShadow: "var(--elevation-sm)",
        }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semi-bold)",
            color: "var(--foreground)",
            margin: 0,
            marginBottom: "var(--spacing-2)",
          }}
        >
          {data.day}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-4)" }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--muted-foreground)",
              }}
            >
              Expected:
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-semi-bold)",
                color: "var(--foreground)",
              }}
            >
              {data.expected} racks
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-4)" }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--muted-foreground)",
              }}
            >
              Completed:
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-semi-bold)",
                color: "var(--primary)",
              }}
            >
              {data.completed} racks
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-4)" }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--muted-foreground)",
              }}
            >
              Gap:
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-semi-bold)",
                color: isAboveTarget ? "var(--success)" : "var(--foreground)",
              }}
            >
              {data.gap > 0 ? "+" : ""}{data.gap} racks
            </span>
          </div>
        </div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--muted-foreground)",
            margin: 0,
            marginTop: "var(--spacing-2)",
            fontStyle: "italic",
          }}
        >
          {isAboveTarget ? "Above planned target" : "Below planned target"}
        </p>
      </div>
    );
  }
  return null;
}

export function RacksInspectedModal({
  open,
  onOpenChange,
  totalRacksInspected,
}: RacksInspectedModalProps) {
  const [inspectionEvent, setInspectionEvent] = React.useState("Current");
  const [zone, setZone] = React.useState("All Zones");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Calculate insight text
  const avgPerDay = Math.round(
    inspectionProgressData.reduce((sum, d) => sum + d.completed, 0) / inspectionProgressData.length
  );
  const shortfallDays = inspectionProgressData
    .filter(d => d.gap < -20)
    .map(d => d.day)
    .join(" and ");
  
  const insightText = shortfallDays
    ? `Inspection pace is averaging ${avgPerDay} racks per day, with shortfalls observed on ${shortfallDays}.`
    : `Inspection pace is averaging ${avgPerDay} racks per day, maintaining consistent progress.`;

  // Prevent interactions from causing page reload
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <SimpleModal open={open} onOpenChange={onOpenChange}>
      {/* Header */}
      <SimpleModalHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-2)" }}>
          <SimpleModalTitle>Racks Inspected</SimpleModalTitle>
          {/* Context Chip */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px var(--spacing-2)",
              backgroundColor: "var(--muted)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--muted-foreground)",
              }}
            >
              Current Cycle
            </span>
          </div>
        </div>
        
        <SimpleModalDescription>
          Coverage progress for current inspection cycle
        </SimpleModalDescription>
      </SimpleModalHeader>

      {/* Body */}
      <SimpleModalBody>
        {/* Controls Row - Inspection Parity */}
        <div
          data-controls="true"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--spacing-3)",
            marginBottom: "var(--spacing-6)",
          }}
        >
          {/* Inspection Event Dropdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-1)",
            }}
          >
            <label
              htmlFor="inspection-event"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
                lineHeight: "1.43",
              }}
            >
              Inspection Event
            </label>
            <select
              id="inspection-event"
              value={inspectionEvent}
              onChange={(e) => setInspectionEvent(e.target.value)}
              className="modal-dropdown"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                padding: "var(--spacing-2) var(--spacing-3)",
                backgroundColor: "var(--input-background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                minWidth: "160px",
                lineHeight: "1.5",
              }}
            >
              <option value="Current">Current</option>
              <option value="Last Completed">Last Completed</option>
            </select>
          </div>

          {/* Zone Dropdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-1)",
            }}
          >
            <label
              htmlFor="zone"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
                lineHeight: "1.43",
              }}
            >
              Zone
            </label>
            <select
              id="zone"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="modal-dropdown"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                padding: "var(--spacing-2) var(--spacing-3)",
                backgroundColor: "var(--input-background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                minWidth: "160px",
                lineHeight: "1.5",
              }}
            >
              <option value="All Zones">All Zones</option>
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
              <option value="Zone D">Zone D</option>
            </select>
          </div>
        </div>

        {/* Chart Section */}
        <div
          data-chart-section="true"
          style={{
            width: "100%",
            height: "400px",
            minHeight: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={inspectionProgressData}
              margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
              onMouseMove={(state) => {
                if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
                  setHoveredIndex(state.activeTooltipIndex);
                } else {
                  setHoveredIndex(null);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="0"
                stroke="var(--border)"
                opacity={0.3}
              />
              
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0}
                tick={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                }}
              />

              <YAxis
                tick={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fill: "var(--muted-foreground)",
                }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Number of Racks",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    fill: "var(--muted-foreground)",
                    textAnchor: "middle",
                  },
                }}
              />

              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{
                  fill: "transparent",
                  stroke: "var(--muted-foreground)",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
              />

              {/* Expected bars - outlined/muted */}
              <Bar
                dataKey="expected"
                fill="transparent"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                radius={[6, 6, 0, 0]}
                opacity={hoveredIndex === null ? 1 : 0.3}
              />

              {/* Completed bars - solid primary */}
              <Bar
                dataKey="completed"
                fill="var(--primary)"
                radius={[6, 6, 0, 0]}
                opacity={hoveredIndex === null ? 1 : 0.3}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight Line */}
        <div
          data-insight="true"
          style={{
            marginTop: "var(--spacing-6)",
            padding: "var(--spacing-3) var(--spacing-4)",
            backgroundColor: "var(--muted)",
            borderLeft: "3px solid var(--primary)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--foreground)",
              lineHeight: "1.43",
              margin: 0,
            }}
          >
            {insightText}
          </p>
        </div>
      </SimpleModalBody>

      {/* Footer Actions */}
      <SimpleModalFooter>
        <button
          type="button"
          data-modal-action="close"
          onClick={(e) => handleButtonClick(e, () => onOpenChange(false))}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-weight-medium)",
            padding: "var(--spacing-2) var(--spacing-4)",
            backgroundColor: "var(--secondary)",
            color: "var(--secondary-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          Close
        </button>
        <button
          type="button"
          data-modal-action="view-details"
          onClick={(e) => handleButtonClick(e, () => {
            console.log("Navigate to inspection details");
          })}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-weight-medium)",
            padding: "var(--spacing-2) var(--spacing-4)",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          View Inspection Details
        </button>
      </SimpleModalFooter>
    </SimpleModal>
  );
}