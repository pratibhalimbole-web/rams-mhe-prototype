Good observation. What you are asking is **two important improvements**:

1️⃣ Representation type should be **changeable until the user saves**
2️⃣ User must be able to **select data fields from backend data source (like Asana chart builder)**

I’ll turn this into a **clear prompt you can give to Figma Make / dev**.

---

# Prompt — Improve Module Settings Data Configuration

Redesign the **Module Settings panel** so users can configure representation and map data from the backend.

Currently the panel allows selecting a representation type (Table, Chart, Heatmap, Hybrid) but does not allow proper data selection. The system must allow users to select fields from the backend dataset and configure how those fields are used in the representation.

---

## Representation Type Behavior

The representation type should remain **editable until the user saves the configuration**.

Rules:

* User can change representation type freely before clicking **Save Configuration**
* When representation type changes, the configuration fields should update dynamically
* After the user saves, the representation type becomes locked
* If the user wants a different representation later, they must add a new module instance

Example message under representation selector:

“To change representation type after saving, add a new module instance.”

---

## Data Source Selection

Add a **Data Source section** below Representation Type.

User should be able to select which backend dataset the module uses.

Example:

Data Source
Dropdown → Inspection Data / Rack Health Data / Integrity Tests

This dropdown should pull available datasets from the backend.

---

## Data Mapping Section

After selecting a data source, show a **Data Mapping section**.

Users must be able to select fields from backend data using dropdowns (similar to chart builders in tools like Asana).

Example configuration:

Category Field
Dropdown → Zone / Rack / Inspection Type

Value Field
Dropdown → Issue Count / Fail Count / Score

Aggregation
Dropdown → Count / Sum / Average

The dropdown options must come from the selected dataset.

---

## Table Configuration

If Representation Type = **Table**

Show table-specific configuration:

Columns
Multi-select dropdown → fields from dataset

Sort By
Dropdown → dataset fields

Pagination
Toggle

Do not require users to manually type column names.
Columns must be selected from backend fields.

---

## Chart Configuration

If Representation Type = **Chart**

Show:

Chart Type
Dropdown → Bar / Line / Pie / Area

Then show Data Mapping:

Category Field → dropdown
Value Field → dropdown
Aggregation → dropdown

Example:

Category → Zone
Value → Issue Count

---

## Heatmap Configuration

If Representation Type = **Heatmap**

Show:

X Axis Field → dropdown
Y Axis Field → dropdown
Value Field → dropdown

Example:

X Axis → Zone
Y Axis → Rack
Value → Issue Count

---

## Display Options

After Data Mapping show display controls such as:

Show Percentages
Show Raw Values
Show Labels

---

## Dynamic Behavior

The settings panel must behave dynamically:

* Representation type controls which configuration fields appear
* Data mapping fields must come from backend dataset
* Irrelevant controls should be hidden
* Module preview must update instantly
* No page reload

---

## Goal

The module configuration should behave like modern chart builders (similar to Asana, Notion, or analytics tools) where users select data fields from dropdowns instead of manually entering column names.

This ensures the system is scalable, easier to configure, and tightly integrated with backend data.

---

If you want, I can also show you **the ideal UI layout for this panel** that would make your builder feel like a **professional analytics tool instead of a simple form**.
