Your note is talking about **something very important that most report builders miss**:

You are designing **not just for screen preview**, but also for **PDF export / printing**.
So the representation settings must consider **layout constraints**.

I converted your handwritten points into a **clear product requirement**.

---

# Requirement — Representation Settings for Report Output (Screen + PDF)

## Objective

Ensure that module representations (Table, Chart, Heatmap, etc.) are designed in a way that works both:

* Inside the **report builder preview**
* Inside **exported PDF reports**
* For **printed hard copies**

The system must enforce layout constraints to prevent broken report formatting during export.

---

# 1. Configuration Save Behavior

When a user clicks **Save Configuration** in Module Settings:

* The configuration must immediately reflect in the **module preview on the canvas**
* The preview must render exactly how it will appear in the **final report output**
* The preview should simulate **PDF layout constraints**

Goal:
The builder preview must be a **true representation of the final exported report**.

---

# 2. Report Output Context

Templates created in the Template Builder will be used for:

1. **Interactive report viewing in the system**
2. **PDF export**
3. **Printed reports (hard copy)**

Because of this, representation settings must consider **page layout limitations**.

---

# 3. Representation Design Constraints

Each representation type must have its own layout rules to ensure proper rendering.

---

# 4. Table Representation Rules

Tables must enforce constraints because of PDF page width limitations.

### Column Limit

Tables must have a **maximum column limit** depending on page orientation.

Portrait page:

Recommended max columns = **6**

Landscape page:

Recommended max columns = **10**

If user selects more columns than allowed:

System must show a warning:
"Selected columns may not fit within the report page width."

---

### Row Pagination

Tables must support **automatic pagination** when rows exceed page height.

Example:

If a table has 150 rows:

* The table should automatically continue on the next page
* Table header must repeat on each page

---

### Column Width Handling

Columns must support:

* Auto width
* Fixed width
* Text wrapping

Long values must wrap instead of overflowing.

---

# 5. Chart Representation Rules

Charts must consider readability in PDF format.

Rules:

* Minimum chart width must be enforced
* Axis labels must not overlap
* Chart legends must wrap when too long
* Charts must scale correctly in portrait and landscape pages

Chart types supported:

* Bar chart
* Pie chart
* Line chart
* Stacked bar

---

# 6. Heatmap Representation Rules

Heatmaps must:

* Limit number of rows and columns
* Maintain cell readability
* Use color scales that remain readable in print

If dataset is too large:

System should suggest filtering or grouping.

---

# 7. Hybrid Representation Rules

Hybrid modules (table + chart) must:

* Stack vertically
* Not place chart and table side-by-side in PDF
* Ensure chart appears before table

This prevents layout breakage in print format.

---

# 8. Page Orientation Awareness

Template must support page orientation configuration:

Portrait (default)

Landscape (for wide data tables)

Some modules may require landscape orientation automatically.

Example:

Large inspection tables.

---

# 9. Representation Validation

Before saving configuration, the system should validate:

* Column limits
* Chart readability
* Data density

If the layout may break the report format, show a warning but allow override.

---

# 10. Goal

The Template Builder should produce **export-safe report layouts** that:

* Render correctly in the application
* Export correctly to PDF
* Print correctly on paper

This ensures the system produces **professional inspection reports suitable for operational use and compliance documentation**.

---

If you want, I can also show you the **next critical thing your builder will soon need** (which almost every SaaS report builder implements):

**"PDF Layout Engine + Page Break Control"**

That will become your **next big requirement** very soon.
