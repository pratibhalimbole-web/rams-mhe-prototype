[SPECS BLOCK]

Figma Make Prompt:

Redesign the **Stability Summary Cards** in the Stability Dashboard to be more engaging while staying **minimal, clean, and enterprise-grade**, inspired by **Asana, Jira, Apple, and Google analytics cards**, implemented with **shadcn UI components**.

IMPORTANT

Do NOT use thick borders or heavy colors.  
Use subtle indicators, trend comparison, and micro charts.  
Cards should communicate **status + trend vs last inspection cycle**.

--------------------------------------------------

CARD LAYOUT

Show 4 cards:

• Total Racks  
• Stable Racks  
• Conditional Racks  
• Not Stable Racks

Cards arranged horizontally.

--------------------------------------------------

CARD STRUCTURE

Each card contains:

Top Row

Metric Title  
Small status indicator line on top edge

Middle Section

Large Metric Value

Bottom Section

Trend indicator  
Comparison text  
Mini sparkline chart

--------------------------------------------------

CARD CONTENT EXAMPLE

Card 1

Title  
Total Racks

Value  
35

Comparison

+3 vs Last Cycle

Sparkline  
Small rack count trend over inspection cycles

--------------------------------------------------

Card 2

Title  
Stable Racks

Value  
13

Comparison

+2 vs Last Cycle

Sparkline  
Stable rack trend

Indicator color  
Green

--------------------------------------------------

Card 3

Title  
Conditional Racks

Value  
10

Comparison

+1 vs Last Cycle

Indicator color  
Amber

Sparkline  
Conditional trend

--------------------------------------------------

Card 4

Title  
Not Stable Racks

Value  
9

Comparison

-2 vs Last Cycle

Indicator color  
Red

Sparkline  
Failure trend

--------------------------------------------------

TREND INDICATORS

Use subtle micro badges

Increase

▲ +X vs Last Cycle

Decrease

▼ -X vs Last Cycle

Neutral

— No change vs Last Cycle

--------------------------------------------------

VISUAL STYLE

Inspired by

Asana analytics cards  
Jira dashboards  
Apple analytics widgets

Design Characteristics

Soft shadows  
Clean typography  
Subtle sparkline charts  
Minimal borders

--------------------------------------------------

SPARKLINE BEHAVIOR

Right side of card

Shows last inspection cycle trend

Hover interaction

Tooltip

Cycle date  
Rack count

--------------------------------------------------

INTERACTION

Card Click

Filters table below

Examples

Click Stable → Show only stable racks

Click Conditional → Show conditional racks

Click Not Stable → Show critical racks

--------------------------------------------------

DATA SOURCE

Comparison is based on

Current Inspection Cycle  
vs  
Previous Inspection Cycle

--------------------------------------------------

EMPTY STATE

If no previous cycle data

Show

No previous cycle data available

--------------------------------------------------

GOAL

Transform the static summary cards into **insight-driven analytics cards** that quickly communicate rack stability trends for warehouse safety managers.

End.