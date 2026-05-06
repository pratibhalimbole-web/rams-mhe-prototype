FEATURE: Conditional Page Orientation Setting

OBJECTIVE
Ensure that the Page Orientation setting is only displayed when the module
representation type is Table.

------------------------------------------------------------

1. VISIBILITY RULE

The "Page Orientation" section must only appear when:

Representation Type = Table

If the user selects:
- Chart
- Heatmap
- Hybrid

The Page Orientation section must be hidden.

------------------------------------------------------------

2. TABLE-SPECIFIC PURPOSE

Page Orientation affects how tables render in PDF and printed reports.

Portrait:
Maximum 6 columns recommended.

Landscape:
Maximum 10 columns recommended.

This rule is only relevant for table layouts because
table width depends on the number of columns.

------------------------------------------------------------

3. DYNAMIC PANEL BEHAVIOR

When the user switches Representation Type:

If Table is selected:
→ Show "Page Orientation"
→ Show "Table Configuration"

If Chart is selected:
→ Hide Page Orientation
→ Hide Table Configuration
→ Show Chart Configuration

If Heatmap is selected:
→ Hide Page Orientation
→ Hide Table Configuration
→ Show Heatmap Configuration

If Hybrid is selected:
→ Hide Page Orientation
→ Show Hybrid configuration

------------------------------------------------------------

4. UI TRANSITION

The settings panel should update dynamically when the representation type changes.

The panel must:
- show only relevant settings
- remove unnecessary options
- prevent configuration confusion

No page reload should occur.

------------------------------------------------------------

EXPECTED RESULT

The Module Settings panel displays only configuration options that are relevant to the selected representation type, keeping the interface clean and preventing incorrect configurations.