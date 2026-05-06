"use client"

import { useState, useEffect, useRef } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../ui/card"
import { PieChart } from "@mui/x-charts/PieChart"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"

// ✅ Custom Tooltip Component
function CustomTooltip({ data }: { data?: any }) {
  if (!data) return null

  const percentage = data.totalTests
    ? ((data.value / data.totalTests) * 100).toFixed(0)
    : '0'

  return (
    <div
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        padding: 'var(--spacing-2) var(--spacing-3)',
        fontSize: 'var(--text-sm)',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: data.color,
        }}
      />
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {data.status ? `${data.element} ${data.status}` : data.element}
      </div>
      <div style={{ fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
        {data.value} ({percentage}%)
      </div>
    </div>
  )
}

interface DonutItem {
  name: string
  total: number
  done: number
  failed: number
}

interface Props {
  byElement: DonutItem[]
  byTestType: DonutItem[]
}

export function StackedDonutAnalytics({
  byElement,
  byTestType,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [containerReady, setContainerReady] = useState(false)
  const [view, setView] = useState<"element" | "test">("element")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [chartColors, setChartColors] = useState<Array<{ base: string; light: string }>>([
    { base: 'rgba(59, 130, 246, 1.00)', light: 'rgba(59, 130, 246, 0.35)' },
    { base: 'rgba(34, 197, 94, 1.00)', light: 'rgba(34, 197, 94, 0.35)' },
    { base: 'rgba(251, 191, 36, 1.00)', light: 'rgba(251, 191, 36, 0.35)' },
    { base: 'rgba(239, 68, 68, 1.00)', light: 'rgba(239, 68, 68, 0.35)' },
    { base: 'rgba(168, 85, 247, 1.00)', light: 'rgba(168, 85, 247, 0.35)' },
  ])

  useEffect(() => {
    // Add a small delay to ensure the container is fully rendered
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Check if container has dimensions before allowing chart render
    if (isMounted && containerRef.current) {
      const checkDimensions = () => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect && rect.width > 0 && rect.height > 0) {
          setContainerReady(true)
        } else {
          // Retry after a short delay
          setTimeout(checkDimensions, 50)
        }
      }
      
      checkDimensions()
    }
  }, [isMounted])

  useEffect(() => {
    // Extract colors from CSS variables after mount
    if (isMounted && typeof window !== 'undefined') {
      const style = getComputedStyle(document.documentElement)
      const extractedColors = []
      
      for (let i = 1; i <= 5; i++) {
        const colorValue = style.getPropertyValue(`--chart-${i}`).trim()
        if (colorValue) {
          extractedColors.push({
            base: colorValue,
            light: colorValue.replace('1.00)', '0.35)').replace('1)', '0.35)'),
          })
        }
      }
      
      if (extractedColors.length === 5) {
        setChartColors(extractedColors)
      }
    }
  }, [isMounted])

  const dataset = view === "element" ? byElement : byTestType
  const total = dataset.reduce((sum, item) => sum + item.total, 0)

  // 🎯 Ring dimensions - ultra-tight spacing for premium look
  const INNER_RING_INNER = 55
  const INNER_RING_OUTER = 90
  const OUTER_RING_INNER = 92   // Only 2px gap between rings!
  const OUTER_RING_OUTER = 108

  // 🎯 Helper function to extract base element key from ID
  const getBaseKey = (id: string) => {
    // "inner-Beam" or "outer-Beam-done" → "Beam"
    const parts = id.split('-')
    return parts[1] || parts[0]
  }

  // Helper function to apply opacity
  const applyOpacity = (color: string, opacity: number) => {
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/, `${opacity})`)
    }
    return color
  }

  // 🎯 INNER RING DATA - Element totals with smart opacity
  const innerData = dataset.map((item, index) => {
    const baseColor = chartColors[index % chartColors.length].base
    const id = `inner-${item.name}`
    
    // 🔥 Manual opacity control based on activeId
    let finalColor = baseColor
    
    if (activeId) {
      const activeBase = getBaseKey(activeId)
      const currentBase = getBaseKey(id)
      
      if (activeId === id) {
        finalColor = baseColor  // Active: 1.0 opacity
      } else if (activeBase === currentBase) {
        finalColor = applyOpacity(baseColor, 0.35)  // Related: 0.35 opacity
      } else {
        finalColor = applyOpacity(baseColor, 0.12)  // Others: 0.12 opacity
      }
    }
    
    return {
      id,
      label: item.name,
      value: item.total,
      color: finalColor,
      // Metadata for tooltip
      element: item.name,
      done: item.done,
      failed: item.failed,
      totalTests: item.total,
      ringType: "inner",
    }
  })

  // 🎯 OUTER RING DATA - Done/Failed segments with smart opacity
  const outerData = dataset.flatMap((item, index) => {
    const colorPair = chartColors[index % chartColors.length]
    const segments = []

    // Done segment
    if (item.done > 0) {
      const baseColor = colorPair.base
      const id = `outer-${item.name}-done`
      
      let finalColor = baseColor
      
      if (activeId) {
        const activeBase = getBaseKey(activeId)
        const currentBase = getBaseKey(id)
        
        if (activeId === id) {
          finalColor = baseColor  // Active: 1.0 opacity
        } else if (activeBase === currentBase) {
          finalColor = applyOpacity(baseColor, 0.35)  // Related: 0.35 opacity
        } else {
          finalColor = applyOpacity(baseColor, 0.12)  // Others: 0.12 opacity
        }
      }
      
      segments.push({
        id,
        label: `${item.name} Test Pass`,
        value: item.done,
        color: finalColor,
        element: item.name,
        status: "Test Pass",
        totalTests: item.total,
        ringType: "outer",
      })
    }

    // Failed segment - uses light variant
    if (item.failed > 0) {
      const baseColor = colorPair.light // Already at 0.35 opacity
      const id = `outer-${item.name}-failed`
      
      let finalColor = baseColor
      
      if (activeId) {
        const activeBase = getBaseKey(activeId)
        const currentBase = getBaseKey(id)
        
        if (activeId === id) {
          finalColor = baseColor  // Active: 0.35 (base for failed)
        } else if (activeBase === currentBase) {
          finalColor = applyOpacity(baseColor.replace('0.35)', '1)'), 0.20)  // Related: 0.20
        } else {
          finalColor = applyOpacity(baseColor.replace('0.35)', '1)'), 0.08)  // Others: 0.08
        }
      }
      
      segments.push({
        id,
        label: `${item.name} Test Failed`,
        value: item.failed,
        color: finalColor,
        element: item.name,
        status: "Test Failed",
        totalTests: item.total,
        ringType: "outer",
      })
    }

    return segments
  })

  // Helper function to convert hex to rgba (kept for compatibility)
  const hexToRgba = (color: string, opacity: number) => {
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/, `${opacity})`)
    }
    return color
  }

  return (
    <Card
      style={{
        height: "100%",
        minHeight: "var(--card-height-md)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--radius-lg)",
        overflow: "visible", // CRITICAL: Allow tooltip to escape
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
            flexDirection: "column",
            gap: "var(--spacing-2)",
          }}
        >
          {/* Title + Subtitle Group */}
          <div>
            <CardTitle
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.4,
              }}
            >
              Element Test Distribution
            </CardTitle>
            <div
              style={{
                fontSize: "var(--text-sm)",
                fontFamily: "'Inter', sans-serif",
                color: "hsl(var(--muted-foreground))",
                marginTop: "var(--spacing-1)",
              }}
            >
              January – June 2024
            </div>
          </div>

          {/* Tabs Component */}
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "element" | "test")}
            style={{
              width: "100%",
            }}
          >
            <TabsList
              style={{
                height: "38px",
                width: "100%",
                backgroundColor: "var(--muted)",
                borderRadius: "var(--radius)",
                padding: "var(--spacing-2)",
                gap: "0",
              }}
            >
              <TabsTrigger
                value="test"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  paddingLeft: "var(--spacing-4)",
                  paddingRight: "var(--spacing-4)",
                  paddingTop: "var(--spacing-2)",
                  paddingBottom: "var(--spacing-2)",
                  borderRadius: "var(--radius-sm)",
                  height: "27px",
                  backgroundColor: view === "test" ? "var(--card)" : "transparent",
                  color: "var(--foreground)",
                  border: "none",
                }}
              >
                By Test Type
              </TabsTrigger>
              <TabsTrigger
                value="element"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "'Inter', sans-serif",
                  paddingLeft: "var(--spacing-4)",
                  paddingRight: "var(--spacing-4)",
                  paddingTop: "var(--spacing-2)",
                  paddingBottom: "var(--spacing-2)",
                  borderRadius: "var(--radius-sm)",
                  height: "27px",
                  backgroundColor: view === "element" ? "var(--card)" : "transparent",
                  color: "var(--foreground)",
                  border: "none",
                }}
              >
                By Element
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "var(--spacing-2)",
          paddingBottom: "var(--spacing-4)",
          paddingLeft: "var(--spacing-6)",
          paddingRight: "var(--spacing-6)",
          flex: "1",
        }}
      >
        {/* Chart Container - overflow visible for tooltip */}
        <div
          ref={containerRef}
          style={{
            width: '240px',
            height: '240px',
            minWidth: '240px',
            minHeight: '240px',
            position: 'relative',
            overflow: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isMounted && containerReady && (
            <PieChart
              series={[
                {
                  innerRadius: INNER_RING_INNER,
                  outerRadius: INNER_RING_OUTER,
                  paddingAngle: 1,
                  cornerRadius: 3,
                  data: innerData,
                  // 🔥 NO highlightScope - we control manually
                },
                {
                  innerRadius: OUTER_RING_INNER,
                  outerRadius: OUTER_RING_OUTER,
                  paddingAngle: 1,
                  cornerRadius: 3,
                  data: outerData,
                  // 🔥 NO highlightScope - we control manually
                },
              ]}
              width={240}
              height={240}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              slotProps={{
                legend: { hidden: true },
                tooltip: {
                  trigger: "item",
                  sx: {
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    padding: "var(--spacing-2-5) var(--spacing-3-5)",
                    fontSize: "var(--text-sm)",
                    fontFamily: "'Inter', sans-serif",
                    zIndex: 9999,
                  },
                },
              }}
              tooltip={{
                trigger: "item",
                itemContent: (props: any) => {
                  const data = props?.itemData
                  if (!data) return null

                  // 🔵 INNER RING → Total Executed
                  if (data.ringType === "inner") {
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
                        <div
                          style={{
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          {data.element} – Test Executed
                        </div>
                        <div
                          style={{
                            color: "hsl(var(--muted-foreground))",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {data.totalTests} Total Tests
                        </div>
                      </div>
                    )
                  }

                  // 🟢 OUTER RING → Pass / Fail Breakdown
                  if (data.ringType === "outer") {
                    const percentage = ((data.value / data.totalTests) * 100).toFixed(0)

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
                        <div
                          style={{
                            fontWeight: "var(--font-weight-semi-bold)",
                            fontFamily: "'Inter', sans-serif",
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          {data.status}
                        </div>
                        <div
                          style={{
                            color: "hsl(var(--muted-foreground))",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {data.value} out of {data.totalTests} ({percentage}%)
                        </div>
                      </div>
                    )
                  }

                  return null
                },
              }}
              onItemClick={(event, params) => {
                console.log('Item clicked:', params)
              }}
              onHighlightChange={(highlighted) => {
                console.log('🎯 Highlight event:', highlighted)
                
                // ✅ Use stable seriesIndex from highlighting context
                if (!highlighted) {
                  console.log('  → Clearing activeId')
                  setActiveId(null)
                  return
                }

                // Extract seriesIndex and dataIndex from the highlight event
                const seriesIndex = (highlighted as any).seriesIndex ?? (highlighted as any).seriesId === 'auto-generated-id-0' ? 0 : 1
                const dataIndex = (highlighted as any).dataIndex
                
                if (dataIndex !== undefined) {
                  const isInner = seriesIndex === 0
                  const hoveredData = isInner
                    ? innerData[dataIndex]
                    : outerData[dataIndex]

                  console.log('  → Setting activeId:', hoveredData?.id)
                  setActiveId(hoveredData?.id ?? null)
                }
              }}
              sx={{
                "& .MuiPieArc-root": {
                  stroke: "none",
                  cursor: "pointer",
                },
                "& .MuiChartsTooltip-root": {
                  pointerEvents: "none",  // ✅ FIX 4: Prevent tooltip interference
                },
              }}
            >
              {/* Custom tooltip passed via slotProps */}
            </PieChart>
          )}

          {/* CENTER STATIC LABEL */}
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
                  fontSize: "24px",
                  fontWeight: "var(--font-weight-semi-bold)",
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1,
                  color: "hsl(var(--foreground))",
                }}
              >
                {total}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontFamily: "'Inter', sans-serif",
                  marginTop: "var(--spacing-1)",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                Total Tests
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text - Inside CardContent */}
        <div
          style={{
            textAlign: "center",
            marginTop: "var(--spacing-4)",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "'Inter', sans-serif",
              color: "hsl(var(--foreground))",
            }}
          >
            Trending up by 5.2% this month
          </div>
          <div
            style={{
              fontSize: "var(--text-sm)",
              fontFamily: "'Inter', sans-serif",
              color: "#64748B",
              marginTop: "var(--spacing-1)",
            }}
          >
            Showing total tests for the last 6 months
          </div>
        </div>
      </CardContent>

    </Card>
  )
}