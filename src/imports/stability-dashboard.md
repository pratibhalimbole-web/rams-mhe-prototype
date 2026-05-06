[SPECS BLOCK]

Figma Make Prompt:

Update the **Stability Dashboard main container**.

IMPORTANT RULE:
The global layout already provides **Page Title + Breadcrumbs in the Top Bar**.  
Do **NOT add another heading or subtitle inside the page container**.

Remove:
- "Stability" section heading
- "Evaluate structural stability of racks based on inspection and testing findings."

The page content must **start directly with controls and data components**.

--------------------------------------------------

Container Layout Order:

1. Action / Utility Row

Components aligned horizontally:

• Search racks  
• Filter button  
• Export Report button

Purpose:
Allow quick rack lookup, filtering, and reporting.

--------------------------------------------------

2. Stability Summary Cards

Show four cards:

• Total Racks  
• Stable Racks  
• Conditional Racks  
• Not Stable Racks  

Each card shows:
• Count value
• Status indicator color
• Click interaction (optional future filtering)

--------------------------------------------------

3. Rack Stability Table

Columns:

Rack ID  
Location  
Total Issues  
Red Issues  
Amber Issues  
Green Issues  
Last Inspection Date  
Stability Status  
Action

Status Types:

Stable  
Conditional  
Not Stable  
Not Evaluated

Action Column:

Button:
View Rack

Click Behavior:

Opens **Rack Stability Detail View**.

--------------------------------------------------

4. Empty State

If no racks exist:

Message:
No racks available.

Primary Action:
Import Rack Data

--------------------------------------------------

Interaction Rules:

Search
→ Filters table rows in real time.

Filter
→ Opens filter panel.

Export Report
→ Generates stability report.

--------------------------------------------------

Feedback Rules:

Inline Error
Used only for input validation.

Toast
Used only for success, API responses, or system errors.

Never show both for the same event.

--------------------------------------------------

Goal:

Ensure the **Stability page respects the global layout system** by avoiding duplicated titles and starting directly with functional dashboard components.

End.