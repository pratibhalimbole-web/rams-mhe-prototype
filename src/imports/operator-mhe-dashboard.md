[SPECS BLOCK]

Figma Make Prompt:

Design a scalable enterprise analytics screen for RAMS called
"Operator ↔ MHE Optimization Dashboard".

Goal
Help warehouse managers assign the best operator to each MHE when there are 50+ operators and 50+ machines. The interface must avoid large heatmaps and instead focus on automated recommendations and ranked insights.

Frame
Desktop dashboard
1440 × 1024
12 column grid
80 px side margins
24 px gutters
Base background: #F8FAFC

Top Header
Height: 64 px
Title: Operator ↔ MHE Optimization
Subtitle: Intelligent pairing recommendations based on productivity data

Right side actions:
Auto Optimize button (Primary)
Export Assignments button
Filter dropdowns:
Warehouse
Shift
Time Range

------------------------------------------------

SECTION 1 — KPI SUMMARY

Card row with 4 cards.

Card design
Height: 120 px
Padding: 20 px
Radius: 8 px
Background: #FFFFFF
Shadow: subtle

Cards

1
Title: Best Operator
Value: Prashant Rao
Subtext: Avg productivity 88%

2
Title: Best MHE
Value: MHE-005
Subtext: Avg productivity 87%

3
Title: Best Pair
Value: Prashant Rao + MHE-005
Subtext: Score 95%

4
Title: Low Efficiency Pairs
Value: 6
Subtext: Need reassignment

------------------------------------------------

SECTION 2 — SYSTEM RECOMMENDED ASSIGNMENTS

Card container
Height: 320 px
Radius: 8 px
Background: #FFFFFF
Padding: 24 px

Title
Recommended Operator Assignments

Description
System-optimized pairings maximizing productivity.

Table columns

Operator
Assigned MHE
Productivity Score
Confidence
Action

Example rows

Prashant Rao | MHE-005 | 95% | High | Edit
Ajay Malhotra | MHE-002 | 91% | High | Edit
Kunal Dehmukh | MHE-001 | 88% | Medium | Edit
Rajesh Patil | MHE-007 | 87% | Medium | Edit

Table rules

Row height: 48 px
Column padding: 16 px
Hover highlight: #F1F5F9
Sortable columns

Footer actions

Approve All Assignments
Manual Adjust

------------------------------------------------

SECTION 3 — TOP PRODUCTIVITY COMBINATIONS

Card container
Height: 300 px

Title
Top Operator-Machine Pairings

Description
Highest productivity combinations across all operators and machines.

Table columns

Rank
Operator
MHE
Productivity
Operator Avg
MHE Avg

Example rows

1 | Prashant Rao | MHE-005 | 95 | 88 | 87
2 | Ajay Malhotra | MHE-002 | 91 | 85 | 86
3 | Kunal Dehmukh | Test-MHE | 90 | 83 | 84
4 | Rajesh Patil | MHE-007 | 88 | 82 | 83

Top rows highlight color
Light green background #ECFDF5

Filter dropdown above table

Top 10
Top 25
Top 50
Worst 10

------------------------------------------------

SECTION 4 — OPERATOR FOCUS PANEL

Two column layout.

Left side
Operator list panel

Width: 280 px
Scrollable list

Search field
Search operator

List items
Operator name
Avg productivity
Small bar indicator

Example

Prashant Rao
Avg 88%

Ajay Malhotra
Avg 85%

-----------------------------------------------

Right side
Operator performance detail

Title
Operator Performance

Selected operator
Prashant Rao

Table

Rank | MHE | Productivity
1 | MHE-005 | 95
2 | MHE-002 | 93
3 | Test-MHE | 91
4 | MHE-007 | 88

Footer button
Assign Selected MHE

------------------------------------------------

SECTION 5 — MHE FOCUS PANEL

Mirrors operator panel.

Left list
Search MHE

Example

MHE-005
MHE-002
MHE-007
Test-MHE

Right detail panel

Title
Machine Performance

Selected machine
MHE-005

Table

Rank | Operator | Productivity
1 | Prashant Rao | 95
2 | Ajay Malhotra | 90
3 | Rajesh Patil | 87
4 | Suresh Kumar | 85

------------------------------------------------

INTERACTION RULES

Auto Optimize
Runs assignment optimization and updates recommendation table.

Edit Assignment
Opens right drawer with operator-machine selection dropdown.

Hover states
Row highlight
Tooltip showing detailed metrics.

Drawer width
420 px

Drawer content
Operator
MHE
Productivity
Operator average
Machine average
Confirm assignment button

------------------------------------------------

EMPTY STATE

Icon
Analytics placeholder

Title
No productivity data available

Text
Run operations with operators and machines to generate pairing insights.

------------------------------------------------

LOADING STATE

Skeleton rows
Grey placeholders
Pulse animation

------------------------------------------------

ACCESSIBILITY

Minimum click area
44 × 44 px

Contrast
WCAG AA compliant

Keyboard navigation
Arrow keys move through table rows.

------------------------------------------------

DATA MODEL

operator_id
operator_name
mhe_id
mhe_name
productivity_score
operator_average
mhe_average
rank

------------------------------------------------

NEXT ITERATION PATH

Add AI compatibility scoring that predicts optimal operator-machine pairings using historical task performance and learning patterns.

END PROMPT