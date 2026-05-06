Good 👍 — now we move to **Screen 1: Rack Stability Dashboard (Rack List Page)**.

This screen is the **entry point of the Stability module**, so it must show **all racks with their stability condition and issue distribution**.

Below is the **clear structure based on your requirement + what we already discussed**.

---

# Screen 1 — Rack Stability Dashboard

## Purpose

This page allows users to:

* see **all racks in the warehouse**
* quickly understand **risk level**
* see **RAG issue counts**
* see **current stability status**
* open the rack **detail stability evaluation page**

So the user flow is:

```text id="x1p5tg"
Open Stability module
↓
View racks list
↓
Identify risky racks
↓
Open rack detail
↓
Evaluate stability
```

---

# Layout Structure

```
--------------------------------------------------
Top Bar
--------------------------------------------------

Filters + Search

--------------------------------------------------
Rack Stability Table
--------------------------------------------------
```

---

# Top Section

### Page Title

```
Rack Stability
```

### Subtitle

```
Evaluate rack structural stability based on inspection findings
```

---

# Filters Row

Filters should match **table columns** to avoid confusion.

Recommended filters:

```
Layout
OEM
Stability Status
Severity
Search Rack ID
```

Do NOT include:

```
Date filter
Warehouse filter
```

(as you already decided earlier).

---

# KPI Summary (Optional but Good)

Above the table you can show **small metrics**.

Example:

```
Total Racks      148
Stable           92
Conditional      38
Not Stable       18
```

These help quickly understand **warehouse risk**.

---

# Rack Stability Table

Each row represents **one rack**.

### Columns

| Column           | Description                       |
| ---------------- | --------------------------------- |
| Rack ID          | Unique rack identifier            |
| Layout           | Layout A / B / C                  |
| OEM              | Manufacturer                      |
| Total Issues     | Total inspection findings         |
| Red              | Critical findings                 |
| Amber            | Warning findings                  |
| Green            | Safe findings                     |
| Stability Status | Stable / Conditional / Not Stable |
| Last Inspection  | Last inspection date              |
| Inspector        | Assigned inspector                |

---

# Example Table Row

```
Rack ID   Layout   OEM      Total   🔴   🟠   🟢   Stability     Inspector
CN-L1     A        Godrej   5       2    2    1    Not Stable    John M
```

---

# Issue Distribution Visualization

Inside the **Total Issues column** you already designed:

```
▮ ▮ ▮ ▮ ▮
```

Segmented bar showing severity distribution.

Important rule:

* bar is **discrete segments**
* **not continuous**
* **not proportional width**

---

# Stability Status Column

Display color-coded badge:

```
🟢 Stable
🟠 Conditional
🔴 Not Stable
⚪ Not Evaluated
```

---

# Row Interaction

When hovering the row:

Show action on right side:

```
View Rack →
```

Click opens:

```
Rack Stability Detail Page (Screen 2)
```

---

# Sorting

Users should be able to sort by:

```
Total Issues
Red Issues
Stability Status
Last Inspection
```

Default sorting:

```
Red issues (descending)
```

This ensures **critical racks appear first**.

---

# Empty State

If no racks exist:

```
No racks available

Import rack inspection data to begin stability evaluation
```

---

# Pagination

Keep existing pagination style used in other modules.

Example:

```
1 2 3 4 → Next
```

---

# UX Rules

Important rules for this page:

• Table rows should have **comfortable vertical spacing**
• Do not show **Action column header**
• Show action **only on row hover**
• RAG colors must match system tokens
• Table must follow **shadcn design system**

---

# Screen 1 Components

The page will contain:

1️⃣ Page header
2️⃣ Filters row
3️⃣ KPI summary
4️⃣ Rack stability table
5️⃣ Pagination

---

# Final Screen 1 Architecture

```
Rack Stability
Evaluate rack structural stability

[Filters]

--------------------------------------------------
KPI Summary
--------------------------------------------------

--------------------------------------------------
Rack Stability Table
--------------------------------------------------
Rack ID | Layout | OEM | Issues | RAG | Status

--------------------------------------------------
Pagination
--------------------------------------------------
```

---

# After Screen 1

Then the user goes to:

```
Screen 2
Rack Stability Detail
```

which you already built.

---

If you want, I can also show you **3 important UX improvements for Screen 1** that will make the dashboard **much more powerful for warehouse safety teams**.
