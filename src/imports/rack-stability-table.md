[SPECS BLOCK]

Figma Make Prompt:

Redesign the **Rack Stability Table** in the Stability dashboard using **shadcn table patterns**, matching the clean structure used in the BOQ table.

IMPORTANT RULES

• Follow the same visual structure used in the BOQ list table  
• Do NOT use colored background boxes for numbers  
• Keep the table visually clean and data-first  
• Status badges only for **Stability Status**, not for issue counts  
• Numeric columns must be right-aligned for readability

--------------------------------------------------

TABLE STRUCTURE

Columns

Rack ID  
Location  
Total Issues  
Red Issues  
Amber Issues  
Green Issues  
Last Inspection Date  
Stability Status  
Action

--------------------------------------------------

COLUMN DESIGN RULES

Rack ID  
Clickable link style (primary accent color)

Location  
Secondary text style

Total Issues  
Bold numeric value

Red Issues  
Plain number  
Color: red text

Amber Issues  
Plain number  
Color: amber text

Green Issues  
Plain number  
Color: green text

Last Inspection Date  
Muted secondary text

Stability Status  
Use small status badges only here

Badge Types

Stable → green badge  
Conditional → amber badge  
Not Stable → red badge  
Not Evaluated → neutral badge

Action  
Button: **View Rack**

--------------------------------------------------

TABLE BEHAVIOR

Row Hover  
Subtle background highlight

Clickable Row  
Only Rack ID clickable (not full row)

Pagination

Bottom Right

Controls

Previous  
Next  
Page number

Left Side Footer

Showing X–Y of Z racks

--------------------------------------------------

SEARCH + FILTER BAR

Above table include

Search racks  
Filter button  
Export Report button

--------------------------------------------------

EMPTY STATE

Message

No racks available

Primary Action

Import Rack Data

--------------------------------------------------

VISUAL ALIGNMENT RULES

Numbers right aligned  
Text left aligned  
Actions centered

Remove colored pill backgrounds from issue counts

Use consistent column spacing

--------------------------------------------------

GOAL

Make the Stability table match the **BOQ table clarity and readability**, while keeping status indicators only where needed.

End.