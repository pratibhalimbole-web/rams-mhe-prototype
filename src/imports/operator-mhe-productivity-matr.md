[SPECS BLOCK]

Figma Make Prompt:
Redesign the analytics component "Operator ↔ MHE Pairing Productivity Matrix" to improve readability, pattern detection, and decision-making while keeping the matrix as the core visualization.

Frame
Desktop analytics module inside RAMS dashboard
Container width: Full dashboard card (responsive)
Background: #FFFFFF
Border radius: 8 px
Internal padding: 24 px

Purpose
Help warehouse managers quickly identify the best operator–MHE combinations and detect poor productivity pairings using a heatmap matrix.

Layout Structure
1. Header Section
Title: "Operator ↔ MHE Pairing Productivity Matrix"
Subheading: "Optimal Combination Analysis"
Right side actions:
• Filter dropdown: Time Range
• Filter dropdown: Shift
• Filter dropdown: Warehouse

2. Heatmap Legend (Top Right)
Horizontal legend showing productivity color scale:

Red #E5533D → <75
Orange #F59E0B → 75–79
Yellow #FACC15 → 80–84
Light Green #84CC16 → 85–89
Green #22C55E → 90–94
Dark Green #15803D → 95+

Legend label:
"Productivity Score (%)"

3. Matrix Grid Layout

Grid Type
Scrollable matrix with frozen headers.

Columns
Operators (horizontal axis)

Rows
MHE machines (vertical axis)

Header Row
Sticky header with operator names.

First Column
Sticky column with MHE names.

Cell Size
72 px height
90 px width
8 px internal padding

Typography
Score value
Font: Inter
Size: 13 px
Weight: Medium
Color: #FFFFFF when background dark
Color: #1F2937 when background light

Heatmap Cell Coloring Logic
Score determines background color using legend scale.

Interaction States

Hover
• Slight brightness increase
• Tooltip appears

Tooltip Content
Operator: {Operator Name}
MHE: {Machine Name}
Productivity: {Score}%

Operator Average: {Value}
MHE Average: {Value}
Rank: #{Combination Rank}

Selection
Clicking cell opens right-side insights panel.

4. Row Insight Column (Right Side)

Add final column labeled "Avg".

Purpose
Show average productivity per MHE row.

Style
Background: #F9FAFB
Font: 13 px
Weight: SemiBold
Color: #111827

Row max highlight
Best score in row:
Green outline 2 px (#22C55E)

Row min highlight
Worst score in row:
Red outline 2 px (#EF4444)

5. Column Insight Row (Bottom)

Add final bottom row labeled "Operator Avg".

Purpose
Show operator performance summary.

Style
Background: #F3F4F6
Font: 13 px
Weight: SemiBold

6. Top Combination Highlight

Top 5 highest productivity cells across the matrix.

Visual indicator
Gold border:
2 px #FBBF24

Hover label
"Top Performance Pair"

7. Scroll Behavior

Horizontal scroll for operators.

Frozen areas:
• Operator header row
• MHE first column

This ensures context remains visible during scrolling.

8. Interaction Panel (Optional Right Drawer)

When clicking a cell open right drawer (width 420 px).

Panel Title
"Operator–MHE Performance Details"

Content
Operator Name
MHE Name
Productivity Score

Metrics
Operator Avg Productivity
MHE Avg Productivity
Total Tasks Completed
Shift Performance Trend

Footer Action
Button:
"Recommend Assignment"

9. Empty State

If no data available:

Illustration icon: analytics placeholder
Title:
"No productivity data available"

Message:
"Run tasks with operators and MHE machines to generate pairing insights."

10. Loading State

Matrix skeleton shimmer rows.

Structure
Grey blocks representing cells.

Animation duration
1.2s infinite shimmer.

Accessibility

Color contrast
WCAG AA compliant.

Cell clickable area
Minimum 44 px.

Keyboard navigation
Arrow keys move between cells.

Tooltip accessible via focus.

Data Structure

Matrix Data Model
{
  operator_id,
  operator_name,
  mhe_id,
  mhe_name,
  productivity_score
}

Derived Metrics
operator_average
mhe_average
global_rank

Validation Metrics

User scan time target
< 3 seconds to detect best pair.

Pattern recognition
Top and worst combinations visually identifiable without reading numbers.

Next Iteration Path

Future enhancement
Add AI-based recommendation engine that automatically suggests optimal operator–MHE assignments based on highest productivity clusters.

End of Prompt
