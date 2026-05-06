"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card"

import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts"

interface RiskScoreBucket {
  id?: string
  range: string
  count: number
  percentage: number
  highestDeviation: number
  color: string
}

interface RiskScoreDistributionProps {
  data?: RiskScoreBucket[]
  criticalThreshold?: number
  totalRacks?: number
}

// Default histogram data: number of racks in each risk score bucket
const defaultData: RiskScoreBucket[] = [
  { id: "bucket-0-20", range: "0-20", count: 25, percentage: 25, highestDeviation: 15.2, color: "rgba(134, 239, 172, 1.00)" }, // Light green (lowest risk)
  { id: "bucket-21-40", range: "21-40", count: 30, percentage: 30, highestDeviation: 38.5, color: "rgba(34, 197, 94, 1.00)" }, // --success (medium-low risk)
  { id: "bucket-41-60", range: "41-60", count: 27, percentage: 27, highestDeviation: 58.3, color: "rgba(251, 191, 36, 1.00)" }, // --warning (amber)
  { id: "bucket-61-80", range: "61-80", count: 12, percentage: 12, highestDeviation: 76.1, color: "rgba(251, 146, 60, 1.00)" }, // Orange (high risk)
  { id: "bucket-81-100", range: "81-100", count: 6, percentage: 6, highestDeviation: 94.8, color: "rgba(239, 68, 68, 1.00)" }, // --destructive (critical risk)
];

export function RiskIndexTrendChart({
  data = defaultData,
  criticalThreshold = 60,
  totalRacks = 100,
}: RiskScoreDistributionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    // Add a small delay to ensure the container is fully rendered
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Calculate dynamic insights - returns primary and secondary lines
  const getInsight = () => {
    const highRiskRacks = data
      .filter(bucket => {
        const minScore = parseInt(bucket.range.split('-')[0])
        return minScore > 60
      })
      .reduce((sum, bucket) => sum + bucket.count, 0)

    // Find bucket with highest concentration
    const maxBucket = data.reduce((max, bucket) => 
      bucket.count > max.count ? bucket : max
    , data[0])

    if (highRiskRacks > 15) {
      return {
        primary: `${highRiskRacks} racks fall in high-risk range (>60).`,
        secondary: `Majority concentration between ${maxBucket.range}.`
      }
    } else if (highRiskRacks > 5) {
      return {
        primary: `${highRiskRacks} racks in elevated risk range (>60).`,
        secondary: `Primary concentration in ${maxBucket.range} bucket.`
      }
    } else {
      return {
        primary: `${maxBucket.count} racks concentrated in ${maxBucket.range} range.`,
        secondary: `Overall risk profile is manageable.`
      }
    }
  }

  const insight = getInsight()

  // Custom background highlight for active bar
  const CustomBackground = (props: any) => {
    const { x, y, width, height, index } = props
    if (activeIndex === index) {
      return (
        <Rectangle
          x={x}
          y={0}
          width={width}
          height={height + 50}
          fill="hsl(var(--muted-foreground))"
          opacity={0.08}
          radius={6}
        />
      )
    }
    return null
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as RiskScoreBucket
      
      return (
        <div
          style={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "var(--spacing-3)",
            fontSize: "var(--text-xs)",
            fontFamily: "'Inter', sans-serif",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              fontWeight: "var(--font-weight-semi-bold)",
              color: data.color,
              marginBottom: "var(--spacing-2)",
              fontSize: "var(--text-sm)",
            }}
          >
            Risk Range: {data.range}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Number of Racks:</span>
              <span style={{ fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
                {data.count}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted-foreground)" }}>% of Total:</span>
              <span style={{ fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
                {data.percentage.toFixed(1)}%
              </span>
            </div>
            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "var(--spacing-2)",
                marginTop: "var(--spacing-1)",
              }}
            >
              <div style={{ color: "var(--muted-foreground)", marginBottom: "var(--spacing-1)" }}>
                Highest Deviation:
              </div>
              <div style={{ fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
                {data.highestDeviation.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card
      className="rounded-xl border bg-card h-full flex flex-col"
      style={{
        borderRadius: "var(--radius-lg)",
        height: "100%",
        minHeight: "var(--card-height-md)",
      }}
    >
      <CardHeader 
        className="pb-2"
        style={{
          paddingBottom: "var(--spacing-2)",
        }}
      >
        <CardTitle 
          className="text-base font-semibold"
          style={{
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-weight-semi-bold)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Risk Score Distribution
        </CardTitle>
        <CardDescription
          style={{
            fontSize: "var(--text-sm)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Number of racks grouped by risk score range (Selected test cycle)
        </CardDescription>
      </CardHeader>

      <CardContent 
        className="pt-0"
        style={{
          paddingTop: "0",
        }}
      >
        {/* Minimal Insight Block */}
        <div
          style={{
            marginTop: "var(--spacing-4)",
          }}
        >
          <div className="font-[Inter]"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "'Inter', sans-serif",
              color: "hsl(var(--foreground))",
            }}
          >
            {insight.primary}
          </div>
          <div
            style={{
              fontSize: "var(--text-sm)",
              fontFamily: "'Inter', sans-serif",
              color: "#64748B",
              marginTop: "var(--spacing-1)",
            }}
          >
            {insight.secondary}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}