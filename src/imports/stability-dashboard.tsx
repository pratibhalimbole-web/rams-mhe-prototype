[SPECS BLOCK]

Figma Make Prompt:

Create the **Stability Module Main Container** that loads when user selects  
TPI → IRDS → Stability from the sidebar.

Do NOT modify the existing sidebar or header.

Purpose:
Provide a workspace where users can view all racks with their stability overview and open a rack for detailed stability evaluation.

Main Container Sections:

1. Page Header

Title:
Stability

Subtitle:
Evaluate structural stability of racks based on inspection and testing findings.

Right Side Actions:
Search racks
Filter
Export Report

--------------------------------------------------

2. Stability Summary Cards

Display four summary cards at the top.

Cards:

Total Racks  
Stable Racks  
Conditional Racks  
Not Stable Racks  

Each card shows:
• Total count
• Small indicator color
• Quick insight label

--------------------------------------------------

3. Rack Stability Table

Primary workspace component.

Table Columns:

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

Clicking it opens the **Rack Stability Detail View**.

--------------------------------------------------

4. Empty State

If no racks exist:

Message:
No racks available for stability evaluation.

Primary Action:
Import Rack Data

--------------------------------------------------

5. Feedback Rules

Follow RAMS Validation & Feedback Guidelines:

Inline Error  
→ For user input issues in filters or forms

Toast Notification  
→ For success, system errors, or API responses

Never show both for the same event.

--------------------------------------------------

6. Interaction Flow

User clicks Stability in sidebar  
→ Stability Dashboard loads

User reviews rack list  
→ Clicks View Rack

System opens **Rack Stability Detail View with 3D rack + inspection findings**

--------------------------------------------------

Components To Reuse

RAMS Table  
RAMS Status Badge  
RAMS Card  
RAMS Button  
RAMS Search Field

--------------------------------------------------

Goal

Create the **primary stability dashboard container** where users can quickly identify racks requiring stability review and open them for deeper analysis.

End.