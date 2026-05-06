FEATURE: Module Auto-Update After Configuration Save

OBJECTIVE
Ensure that when a user saves module configuration in the Module Settings panel,
the corresponding module on the canvas updates immediately to reflect the new settings.

------------------------------------------------------------

1. SAVE CONFIGURATION BEHAVIOR

When the user clicks "Save Configuration":

• The configuration must be stored in the module configuration object.
• The selected module instance on the canvas must re-render immediately.
• The UI must reflect the new configuration without refreshing the page.

The system must NOT require:
- page reload
- section reload
- manual refresh.

------------------------------------------------------------

2. MODULE VISUAL UPDATE

After saving configuration, the module card inside the canvas must update:

Example updates:

Representation Type
- Table → module renders table layout
- Chart → module renders chart preview
- Heatmap → module renders heatmap preview
- Hybrid → module renders combined layout

Table Configuration
- Selected columns update in module preview
- Sorting applied
- Pagination applied

Page Orientation
- Portrait or Landscape indicator updates
- Column limit rules update accordingly

------------------------------------------------------------

3. PREVIEW BEHAVIOR

The module preview inside the builder must simulate
the final report rendering.

Preview must show:

• Correct layout type
• Correct number of columns
• Chart type if chart is selected
• Pagination behavior
• Data mapping applied

------------------------------------------------------------

4. STATE MANAGEMENT RULE

Saving configuration should:

• Update only the selected module instance
• Not affect other modules
• Maintain section structure
• Keep scroll position stable

------------------------------------------------------------

5. USER FEEDBACK

After successful save:

• Module preview updates immediately
• Optional small success indicator:

"Configuration Updated"

This should disappear automatically.

------------------------------------------------------------

EXPECTED RESULT

Users can immediately see how the module will appear in the report after configuration changes, making the template builder behave like a real-time report design tool.