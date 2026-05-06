[SPECS BLOCK]

Figma Make Prompt:

Refine the **Stability Dashboard Filter Panel** so that filters correspond **only to the columns visible in the rack table**.

IMPORTANT RULES

• Filters must map directly to table columns  
• Do NOT introduce filters for fields that are not visible in the table  
• This prevents user confusion and keeps filtering predictable  
• Use shadcn UI form components  
• Panel opens from the **Filter button** as a right-side drawer

--------------------------------------------------

TABLE COLUMNS (REFERENCE)

Rack ID  
Location  
Total Issues  
Red Issues  
Amber Issues  
Green Issues  
Last Inspection Date  
Stability Status

Filters must correspond to these fields.

--------------------------------------------------

FILTER SECTION 1

Label  
Rack ID

Component  
Search input

Behavior

User can type rack ID.

Example

RCK-A-001

Table shows matching rack rows.

--------------------------------------------------

FILTER SECTION 2

Label  
Location

Component  
Multi-select dropdown

Options example

Warehouse A – Aisle 1  
Warehouse A – Aisle 2  
Warehouse B – Aisle 1  
Warehouse B – Aisle 2  
Warehouse C – Aisle 1

Purpose

Filter racks based on warehouse aisle location.

--------------------------------------------------

FILTER SECTION 3

Label  
Total Issues

Component  
Range slider

Example

0 — 20+

Purpose

Filter racks by number of inspection findings.

--------------------------------------------------

FILTER SECTION 4

Label  
Red Issues

Component  
Checkbox

Options

Has Red Issues

Logic

Red Issues > 0

--------------------------------------------------

FILTER SECTION 5

Label  
Amber Issues

Component  
Checkbox

Options

Has Amber Issues

Logic

Amber Issues > 0

--------------------------------------------------

FILTER SECTION 6

Label  
Green Issues

Component  
Checkbox

Options

Has Green Issues

Logic

Green Issues > 0

--------------------------------------------------

FILTER SECTION 7

Label  
Stability Status

Component  
Checkbox group

Options

Stable  
Conditional  
Not Stable  
Not Evaluated

--------------------------------------------------

FILTER PANEL FOOTER

Primary Button

Apply Filters

Secondary Button

Reset Filters

--------------------------------------------------

FILTER INDICATOR

If filters are active

Show badge on Filter button.

Example

Filter (2)

--------------------------------------------------

EMPTY RESULT STATE

If filters return no results

Show message

No racks match the selected filters.

Provide action

Clear Filters

--------------------------------------------------

DESIGN GOAL

Ensure the filtering system feels **logical, predictable, and directly tied to the table data**, reducing confusion for inspectors and safety managers.

End.