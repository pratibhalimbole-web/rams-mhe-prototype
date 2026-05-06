Good — this tells us **your rendering pipeline is incomplete**, not a UI issue.

Right now your system behavior is:

```
Save Configuration
   ↓
Table preview updates ✅
Chart preview ❌
Heatmap preview ❌
Hybrid preview ❌
```

So the **builder rendering logic only supports table rendering**.

You need to implement **representation-based rendering**.

---

# Root Cause

Your module preview likely has something like:

```javascript
if (representationType === "table") {
   renderTable()
}
```

But **no logic exists for chart, heatmap, hybrid**.

So when those types are selected, the module stays blank.

---

# Correct Rendering Architecture

Your module preview must render **based on Representation Type**.

Example structure:

```
Module
 ├ Representation Type
 ├ Configuration
 └ Renderer
```

Renderer decides **how to display output**.

---

# Correct Requirement

Use this prompt for your fix.

---

## Feature — Representation Based Module Rendering

**Objective**

Ensure that module output updates correctly for all representation types after saving configuration.

Currently only **Table representation renders output**, while **Chart, Heatmap, and Hybrid do not display any preview**.

The builder must render module previews dynamically based on the selected representation type.

---

### Rendering Logic

When **Save Configuration** is clicked, the system must:

1. Store module configuration.
2. Identify the selected **Representation Type**.
3. Render the corresponding preview component inside the module card.

---

### Table Representation

Render a table preview.

Preview should reflect:

* Selected columns
* Sorting configuration
* Pagination setting
* Orientation rules

---

### Chart Representation

Render a chart preview using configured data mapping.

Preview must respect:

* Chart type (bar, line, pie)
* X-axis field
* Y-axis metric
* Aggregation method
* Group-by series

Example preview:

```
Bar Chart
X: Report Period
Y: Total Inspections
```

The chart must display inside the module container.

---

### Heatmap Representation

Render a matrix-style heatmap using:

* X-axis field
* Y-axis field
* Value field

Cells should use color gradients to represent value intensity.

---

### Hybrid Representation

Render both chart and table inside the module.

Layout structure:

```
Chart
────────────
Table
```

The chart must appear above the table.

---

### Dynamic Preview Behavior

After configuration save:

* Only the selected module instance should re-render.
* Other modules must remain unchanged.
* Rendering must occur without page reload.

---

### Fallback Handling

If chart configuration is incomplete (missing axis fields):

Show placeholder:

```
Configure chart data mapping
```

instead of leaving the module blank.

---

# Visual Result

Correct behavior:

```
Executive Summary [Table]
→ shows table preview

Compliance Score [Chart]
→ shows chart preview

Risk Distribution [Heatmap]
→ shows heatmap

Inspection Overview [Hybrid]
→ shows chart + table
```

---

# Important Note

Your builder must behave like a **live report designer** where the module preview always reflects the saved configuration.

---

If you want, I can also show you **one thing missing in your chart configuration that will break charts later** (it's visible in your screenshot but not implemented yet).
