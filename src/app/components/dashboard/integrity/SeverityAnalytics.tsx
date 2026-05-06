"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../ui/card"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"

interface ElementData {
  element: string
  total: number
  done: number
  failed: number
}

interface Props {
  data?: ElementData[]
}

export function SeverityAnalytics({ data = [] }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle empty or undefined data
  if (!data || data.length === 0) {
    return (
      <Card
        style={{
          borderRadius: "var(--radius-lg)",
        }}
      >
        <CardHeader
          style={{
            paddingBottom: "var(--spacing-2)",
          }}
        >
          <CardTitle
            style={{
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-weight-semi-bold)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Element Test Distribution
          </CardTitle>
        </CardHeader>
        <CardContent
          style={{
            padding: "var(--spacing-6)",
            textAlign: "center",
            color: "hsl(var(--muted-foreground))",
            fontSize: "var(--text-sm)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          No element data available
        </CardContent>
      </Card>
    )
  }

  const totalTests = data.reduce((sum, item) => sum + item.total, 0)

  // Vibrant distinct colors like Titanic reference
  const elementColors = {
    0: { base: "var(--chart-1)", done: "rgba(59, 130, 246, 1.0)", failed: "rgba(59, 130, 246, 0.5)" },     // Blue
    1: { base: "var(--chart-2)", done: "rgba(34, 197, 94, 1.0)", failed: "rgba(34, 197, 94, 0.5)" },      // Green
    2: { base: "var(--chart-3)", done: "rgba(251, 191, 36, 1.0)", failed: "rgba(251, 191, 36, 0.5)" },    // Amber
    3: { base: "var(--chart-4)", done: "rgba(239, 68, 68, 1.0)", failed: "rgba(239, 68, 68, 0.5)" },      // Red
    4: { base: "var(--chart-5)", done: "rgba(168, 85, 247, 1.0)", failed: "rgba(168, 85, 247, 0.5)" },    // Purple
  }

  // INNER RING (Element totals)
  const innerData = data.map((item, index) => ({
    name: item.element,
    value: item.total,
    color: elementColors[index as keyof typeof elementColors]?.base || "var(--chart-1)",
  }))

  // OUTER RING (Done vs Failed with lighter shades)
  const outerData = data.flatMap((item, index) => {
    const colors = elementColors[index as keyof typeof elementColors] || elementColors[0]
    return [
      {
        name: `Done`,
        value: item.done,
        element: item.element,
        done: item.done,
        failed: item.failed,
        total: item.total,
        color: colors.done,
      },
      {
        name: `Failed`,
        value: item.failed,
        element: item.element,
        done: item.done,
        failed: item.failed,
        total: item.total,
        color: colors.failed,
      },
    ]
  })

  // Custom label renderer for INNER RING ONLY
  const renderInnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
    const percent = ((value / totalTests) * 100).toFixed(0)

    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--background))"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{
          fontSize: "var(--text-xs)",
          fontFamily: "'Inter', sans-serif",
          fontWeight: "var(--font-weight-semi-bold)",
        }}
      >
        {`${name} ${percent}%`}
      </text>
    )
  }

  // Custom tooltip
  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload

    return (
      <div
        style={{
          backgroundColor: "hsl(var(--popover))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
          padding: "var(--spacing-3)",
          fontSize: "var(--text-sm)",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "var(--elevation-sm)",
        }}
      >
        <div style={{ fontWeight: "var(--font-weight-semi-bold)", marginBottom: "var(--spacing-2)" }}>
          {data.element}
        </div>
        <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "var(--text-sm)", marginBottom: "var(--spacing-1)" }}>
          Done: {data.done} ({((data.done / data.total) * 100).toFixed(0)}%)
        </div>
        <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "var(--text-sm)" }}>
          Failed: {data.failed} ({((data.failed / data.total) * 100).toFixed(0)}%)
        </div>
      </div>
    )
  }

  return (
    <Card
      style={{
        borderRadius: "var(--radius-lg)",
      }}
    >
      <CardHeader
        style={{
          paddingBottom: "var(--spacing-2)",
        }}
      >
        <CardTitle
          style={{
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-weight-semi-bold)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Element Test Distribution
        </CardTitle>
      </CardHeader>

      <CardContent
        style={{
          position: "relative",
        }}
      >
        <div
          style={{
            height: "280px",
            minHeight: "280px",
            minWidth: "280px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isMounted && (
            <PieChart width={280} height={280}>

              <Tooltip content={customTooltip} />

              {/* INNER RING - Element totals (WITH LABELS) */}
              <Pie
                data={innerData}
                dataKey="value"
                innerRadius={55}
                outerRadius={85}
                stroke="hsl(var(--background))"
                strokeWidth={3}
                label={renderInnerLabel}
                labelLine={false}
              >
                {innerData.map((entry, index) => (
                  <Cell key={`inner-${index}`} fill={entry.color} />
                ))}
              </Pie>

              {/* OUTER RING - Done vs Failed (NO LABELS) */}
              <Pie
                data={outerData}
                dataKey="value"
                innerRadius={90}
                outerRadius={110}
                stroke="hsl(var(--background))"
                strokeWidth={3}
                label={false}
              >
                {outerData.map((entry, index) => (
                  <Cell key={`outer-${index}`} fill={entry.color} />
                ))}
              </Pie>

            </PieChart>
          )}
        </div>

        {/* CENTER LABEL */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.2,
                color: "hsl(var(--foreground))",
              }}
            >
              Elements
            </div>
          </div>
        </div>

        {/* LEGEND - Clean reference like Titanic chart */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--spacing-4)",
            marginTop: "var(--spacing-4)",
            justifyContent: "center",
          }}
        >
          {data.map((item, index) => {
            const colors = elementColors[index as keyof typeof elementColors] || elementColors[0]
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-2)",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "var(--radius-xs)",
                    backgroundColor: colors.base,
                  }}
                />
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: "var(--font-weight-medium)",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {item.element}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: "'Inter', sans-serif",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  ({((item.total / totalTests) * 100).toFixed(0)}%)
                </span>
              </div>
            )
          })}
        </div>

      </CardContent>
    </Card>
  )
}