Here is the **final combined prompt** that merges both requirements:
1️⃣ **Single representation per module**
2️⃣ **Representation-driven data structure and dynamic configuration**

This is written cleanly so you can paste it into **Figma Make / documentation / dev instructions**.

---

The template builder must support **one representation type per module**. A module should render only one display format at a time. Supported representation types may include Table, Chart, Heatmap, and Hybrid.

When a user drags a module into a section, they must select the **representation type for that module**. The chosen representation determines how the module displays data and what configuration options appear in the Module Settings panel.

If the user wants the same module data displayed in another representation format, they must **add a new module instance** instead of changing the existing one.

Example workflow:

User drags **Module A** into a section.
User selects **Chart representation**.

If the user also wants to show the same data as a **Table**, they must drag **Module A again** into the section and choose **Table representation** for the second module.

The section would then contain:

Module A → Chart representation
Module A → Table representation

Each module instance is independent and maintains its own representation type and configuration settings. This approach keeps modules simple, predictable, and scalable.

---

The system must also ensure that **data configuration depends on the selected representation type**.

When a representation type is selected, the system should automatically determine what data structure is required and display only the relevant configuration fields.

Examples:

If the representation type is **Chart**, the Module Settings panel should show chart-related configuration such as:

* Chart Type (Bar, Line, Pie, etc.)
* Category field
* Value field
* Legend toggle
* Data labels toggle

If the chart type is **Pie Chart**, the required data structure should be:

Category + Value

Example data:
Passed → 18
Failed → 6

If the representation type is **Bar Chart**, the required data structure should also be:

Category + Value

Example data:
Zone A → 5 issues
Zone B → 3 issues

If the representation type is **Table**, the system should show table-specific configuration instead of chart settings, including:

* Column selection
* Column order
* Column labels
* Sorting options
* Pagination settings

Example table columns may include:
Inspection ID
Rack ID
Zone
Status
Issue Count

If the representation type is **Heatmap**, the system should show configuration fields for matrix-style data, such as:

* X-axis dimension
* Y-axis dimension
* Value field

If the representation type is **Hybrid**, the system should allow configuration for both chart and table views.

---

The Module Settings panel must behave dynamically based on the selected representation type.

Rules:

* Only show configuration fields relevant to the chosen representation.
* Hide irrelevant controls instead of disabling them.
* Switching representation types must instantly update the module preview.
* Configuration changes should apply only to the selected module instance.
* No page reload should occur during configuration changes.

---

The core principle of the system is:

Module → has one representation type
Representation type → defines required data structure
Data structure → determines configuration options

This design ensures that each module has a clear responsibility, keeps configuration simple for users, and allows the template builder to scale easily as more module types and visualizations are added.
