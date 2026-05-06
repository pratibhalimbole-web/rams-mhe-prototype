/**
 * EXAMPLE USAGE - Element Test Distribution (Top 5 Elements)
 * 
 * This demonstrates the correct data structure for the nested donut chart.
 * 
 * Delete this file after reviewing the example.
 */

import { SeverityAnalytics } from "./SeverityAnalytics"

export function SeverityAnalyticsExample() {
  // ✅ CORRECT DATA STRUCTURE
  const elementData = [
    { element: "Beam", total: 40, done: 35, failed: 5 },
    { element: "Baseplate", total: 25, done: 20, failed: 5 },
    { element: "Bracing", total: 30, done: 28, failed: 2 },
    { element: "Upright", total: 35, done: 30, failed: 5 },
    { element: "Other", total: 20, done: 18, failed: 2 },
  ]

  return (
    <div style={{ maxWidth: "600px" }}>
      <SeverityAnalytics data={elementData} />
    </div>
  )
}

/**
 * INTEGRATION GUIDE:
 * 
 * 1. Data Structure (MANDATORY):
 * 
 *    interface ElementData {
 *      element: string   // Element name (Beam, Baseplate, etc.)
 *      total: number     // Total tests for this element
 *      done: number      // Tests completed (passed)
 *      failed: number    // Tests failed
 *    }
 * 
 * 2. Top 5 Elements:
 *    - Beam
 *    - Baseplate
 *    - Bracing
 *    - Upright
 *    - Other (aggregated)
 * 
 * 3. Visualization:
 *    - INNER RING → Element total distribution
 *    - OUTER RING → Done (green) vs Failed (red) for each element
 * 
 * 4. On Hover:
 *    - Element name
 *    - Done count
 *    - Failed count
 * 
 * 5. Center Label:
 *    - Total number of tests across all elements
 * 
 * 6. Colors:
 *    - Done: Uses element color (var(--chart-1) through var(--chart-5))
 *    - Failed: Always red (hsl(var(--destructive)))
 * 
 * 7. Usage:
 * 
 *    <SeverityAnalytics data={elementData} />
 * 
 * ⚠️ DO NOT pass severity counts (Critical/Major/Minor)
 * ✅ ONLY pass element distribution data
 */
