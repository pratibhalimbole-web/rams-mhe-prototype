Here is the **final prompt** you can use to redesign the Module Settings panel based on the new requirement that **representation type must control data structure and configuration**.

---

Redesign the **Module Settings panel** so that configuration is driven by the selected representation type. The panel must guide the user to correctly map data based on the chosen representation.

Currently the panel allows selecting a representation (Table, Chart, Heatmap, Hybrid) but does not guide the user to configure the required data structure. This must be improved.

First rename the section **“Layout Type” to “Representation Type” or “Display Type”**. Layout belongs to section structure and should not be used inside module settings.

The panel should follow this configuration flow:

Representation Type → Representation Configuration → Data Mapping → Display Options.

---

When the user selects a **Representation Type**, the panel should dynamically change and show only the configuration relevant to that representation.

Representation Type options:
Table, Chart, Heatmap, Hybrid.

---

If the user selects **Chart**, show a Chart Configuration section with:

Chart Type dropdown (Bar, Line, Pie, Area, Stacked Bar)

After selecting the chart type, show a **Data Mapping section** where the user defines the required data fields.

For most charts the required structure should be:

Category Field
Value Field

Example mapping:
Category → Zone
Value → Issue Count

If the chart type is **Pie Chart**, the system should require:

Category
Value

Example data:
Passed → 18
Failed → 6

The panel should guide the user to select fields for these mappings.

---

If the user selects **Table**, hide chart settings and show **Table Configuration** options:

Column Selection
Column Order (drag to reorder)
Column Labels
Sorting options
Pagination toggle

The user should be able to define which fields appear as table columns.

Example columns:
Inspection ID
Rack ID
Zone
Status
Issue Count

---

If the user selects **Heatmap**, show Heatmap configuration fields:

X Axis field
Y Axis field
Value field

Example mapping:
X Axis → Zone
Y Axis → Rack
Value → Issue Count

---

If the user selects **Hybrid**, allow configuration for both chart and table views.

---

The **Data Mapping section is mandatory** and must appear after the representation configuration. This section determines how the module connects to the data source.

Data Mapping may include:

Category Field
Value Field
Aggregation Type (Sum, Count, Average)
Filters (optional)

---

Finally, show **Display Options** such as:

Show Percentages
Show Raw Values
Show Labels

These controls should appear after data mapping.

---

Behavior requirements:

The settings panel must update dynamically when the representation type changes.
Only relevant configuration fields should appear.
Irrelevant settings must be hidden instead of disabled.
The module preview must update instantly when configuration changes.
Configuration should only affect the selected module instance.
No page reload should occur.

---

The goal is to make the module builder **representation-driven**, where the selected representation determines the required data structure and configuration options. This ensures the template builder remains simple, predictable, and scalable as more module types and visualizations are added.
