FEATURE: Chart Data Mapping Configuration

OBJECTIVE
When Representation Type is set to Chart, the Module Settings panel must allow the user to configure chart data by selecting X-axis and Y-axis fields from the module dataset.

------------------------------------------------------------

1. VISIBILITY RULE

If Representation Type = Chart:

Show Chart Configuration section.

Hide:
- Page Orientation
- Table Configuration

------------------------------------------------------------

2. CHART CONFIGURATION STRUCTURE

Display the following fields:

Chart Type
Dropdown options:
- Bar Chart
- Line Chart
- Pie Chart
- Stacked Bar
- Area Chart

X-Axis Field
Dropdown populated from module dataset fields.

Examples:
Zone
Rack ID
Inspection Type
Date

Y-Axis Metric
Dropdown populated from numeric dataset fields.

Examples:
Issue Count
Fail Count
Inspection Score
Risk Count

Aggregation Method
Dropdown options:
- Count
- Sum
- Average
- Maximum
- Minimum

------------------------------------------------------------

3. MULTIPLE SERIES SUPPORT

Optional advanced configuration:

Group By (Series)
Dropdown from dataset fields.

Example:
Severity
Zone
Inspection Type

This allows charts like:
Issues by Zone grouped by Severity.

------------------------------------------------------------

4. DATA SOURCE RULE

The dropdown fields must be populated only from the dataset associated with the selected module.

Example:

Inspection Findings module:
Fields:
- Zone
- Rack ID
- Severity
- Issue Type
- Inspection Date

Integrity Test module:
Fields:
- Test Type
- Result
- Location
- Timestamp

Do not mix datasets across modules.

------------------------------------------------------------

5. PREVIEW BEHAVIOR

When user selects:

- Chart Type
- X-axis
- Y-axis

The module preview must update immediately to display the chart with selected configuration.

No page refresh required.

------------------------------------------------------------

EXPECTED RESULT

Chart modules can be configured using proper data mapping (X-axis and Y-axis), similar to professional analytics tools like:

- Tableau
- Power BI
- Metabase
- Asana chart builder