Add a global **Date Range selector dropdown** to the Integrity Overview page.

Do NOT modify:
• KPI cards
• Charts
• Sidebar
• Page title
• Existing layout spacing

Only add the date range control.

---

PLACEMENT

Add the Date Range selector on the **right side of the tab navigation**.

Current layout:

Integrity Overview | Integrity Summary

New layout:

Integrity Overview | Integrity Summary                         [ Date Range ▼ ]

The selector must align vertically with the tabs.

---

DEFAULT VALUE

Default selection:

Last 6 Months

Display format:

📅 Last 6 Months ▼

Include a small calendar icon on the left.

---

AVAILABLE OPTIONS

Dropdown options:

Last 7 Days
Last 30 Days
Last 90 Days
Last 6 Months
Last 12 Months
Custom Range

---

CUSTOM RANGE

Selecting **Custom Range** opens a date picker allowing:

Start Date
End Date

User selects both dates and applies.

---

DATA BEHAVIOR

The selected date range should control the data shown in:

• KPI summary cards
• Risk Score Distribution chart
• Element Test Distribution chart
• Failure Distribution chart
• Alerts & Notifications

All widgets refresh when the date range changes.

---

UI COMPONENT

Use the existing **Select / Dropdown component** from the design system.

Control height must match other toolbar controls.

---

VISUAL STYLE

• Use design system spacing variables
• Use Inter font
• Use standard dropdown styling
• Keep control width between **180px – 220px**

---

IMPORTANT

Remove any **hardcoded date text inside charts** (for example "January – June 2024").

Charts should automatically follow the selected global date range.
