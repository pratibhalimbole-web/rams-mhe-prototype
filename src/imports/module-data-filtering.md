Got it. You’re talking specifically about **data filtering based on module type**, not UI grouping.

Your requirement is:

> When a user drags a module (for example **Inspection Findings**), the dropdowns for selecting data fields should only show **data related to that module**, not all datasets.

This is correct architecture. Each module should have its **own data schema scope**.

Here is the **clean prompt for implementing this behavior**:

---

**Prompt — Module-Specific Data Selection in Template Builder**

Update the Template Builder so that the **data selection dropdowns are filtered based on the selected module type**.

Currently the data dropdowns combine fields from multiple modules and datasets. This should be corrected so that when a module is selected, only the data fields relevant to that module appear in the dropdown.

The system must work as follows:

When a user drags a module from the Module Library into the canvas, the system identifies the module type and loads the **corresponding dataset for that module**. All dropdowns for selecting data fields must only display fields from that dataset.

For example:

If the user adds **Inspection Findings Module**, the data dropdowns should only contain fields from the **Inspection Findings dataset**, such as:

* Rack ID
* Zone
* Issue Type
* Severity
* Inspection Date
* Status

The dropdown should not include unrelated fields such as stock data, maintenance logs, or integrity test results.

If the user adds **Integrity Test Module**, the dropdown should instead display fields related to integrity tests, such as:

* Test Type
* Test Result
* Location
* Timestamp
* Inspector

Each module must define its own **data schema and allowed fields**, and the configuration panel must only expose those fields.

---

**Behavior Rules**

* The settings panel must dynamically load the correct dataset when a module is selected.
* Data dropdowns must only show fields belonging to that module's dataset.
* Do not mix fields from multiple modules.
* When the user switches to another module, the dropdown options must update accordingly.
* The preview should update automatically based on the selected fields.

---

**Goal**

Ensure that the template builder behaves like a structured reporting system where each module is connected to its own dataset. This prevents confusion, improves usability, and ensures that users only configure modules with relevant data fields.
