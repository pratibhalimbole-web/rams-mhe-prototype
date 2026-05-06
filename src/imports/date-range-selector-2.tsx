Add a **Date Range Selector dropdown** to the **Integrity Overview dashboard**.

Do NOT change:
• Sidebar navigation
• Page breadcrumb
• KPI cards layout
• Charts layout
• Existing spacing grid

Only add the date range control.

---

PLACEMENT

Place the **Date Range dropdown on the top-right side of the page header**, aligned horizontally with the page title **"Integrity Test"**.

Layout example:

Integrity Test                                         [ 📅 Last 6 Months ▼ ]

The selector must appear **above the KPI cards** and stay within the header area of the page.

---

DEFAULT VALUE

Default selected value:

Last 6 Months

Display format:

📅 Last 6 Months ▼

Include a small calendar icon on the left.

---

DROPDOWN OPTIONS

The dropdown must contain the following options:

Last 7 Days
Last 30 Days
Last 90 Days
Last 6 Months
Last 12 Months
Custom Range

---

CUSTOM RANGE BEHAVIOR

Selecting **Custom Range** should open a date picker allowing:

Start Date
End Date

User must confirm the selection.

---

DATA INTERACTION

The selected date range must control all analytics widgets on the page:

• Total Tests Defined
• Tests Executed
• Tests Passed
• Tests Failed
• Risk Score Distribution chart
• Element Test Distribution chart
• Failure Distribution chart
• Alerts & Notifications

All widgets refresh automatically when the date range changes.

---

CHART LABEL UPDATE

Remove hardcoded date text such as:

"January – June 2024"

Charts should automatically display data according to the selected date range.

Example:

Element Test Distribution
Showing data for: Last 6 Months

---

STYLE

Use the existing design system dropdown component.

• Width: 180–220px
• Height: match existing controls
• Use design system colors, spacing, and typography.
