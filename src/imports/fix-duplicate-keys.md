TASK: Fix Duplicate React Keys in Recharts Components

OBJECTIVE
Resolve React warnings caused by duplicate keys inside Recharts chart components.

FILES TO CHECK
ModulePreviews.tsx

COMPONENTS
ChartRepresentationPreview
HybridRepresentationPreview

PROBLEM
Some Recharts elements are generated using .map() with non-unique keys.

Example problematic pattern:

<Cell key="cell" />
<Bar key="bar" />

This causes React warnings:
"Encountered two children with the same key."

REQUIRED FIX

1. Ensure every mapped chart element has a unique key.

Replace patterns like:

key="cell"

With:

key={`cell-${index}`}

or

key={`cell-${entry.name}`}

2. Apply this fix to the following Recharts components:

<Cell />
<Bar />
<Line />
<Pie />
<Area />

3. If elements are generated inside a .map() loop, always include index or unique data field.

Example:

data.map((entry, index) => (
  <Cell key={`cell-${index}`} fill={entry.color} />
))

4. Do NOT modify chart rendering logic.

Do NOT change:
- chart data structure
- chart configuration
- visualization behavior

Only fix duplicate keys.

EXPECTED RESULT

React warnings about duplicate keys should disappear.
Charts must render exactly the same as before.