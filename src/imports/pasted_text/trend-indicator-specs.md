[SPECS BLOCK]

Figma Make Prompt:

Update the **Trend Indicator Layout** in the Stability Summary Cards.

Problem:
Currently the icon appears before the value ( ▲ +2 vs Last Cycle ).  
The required format is **value first, then icon**.

--------------------------------------------------

REQUIRED FORMAT

Display trend text in this order:

+2 ▲ vs Last Cycle  
-2 ▼ vs Last Cycle

Structure

[Value Change] [Arrow Icon] vs Last Cycle

Examples

Stable Racks increase

+2 ▲ vs Last Cycle

Stable Racks decrease

-1 ▼ vs Last Cycle

Conditional increase

+3 ▲ vs Last Cycle

Conditional decrease

-2 ▼ vs Last Cycle

--------------------------------------------------

ALIGNMENT

Trend row layout:

Value change → Arrow icon → Comparison label

Example layout:

+2 ▲   vs Last Cycle

Spacing must keep the value visually dominant.

--------------------------------------------------

COLOR RULES

Stable increase  
+2 ▲ → Green

Stable decrease  
-2 ▼ → Red

Conditional increase  
+2 ▲ → Red

Conditional decrease  
-2 ▼ → Green

Not Stable increase  
+2 ▲ → Red

Not Stable decrease  
-2 ▼ → Green

Total racks  
Neutral gray color

--------------------------------------------------

TYPOGRAPHY

Value change (+2 / -2)  
Medium weight

Arrow icon  
Small inline icon

Comparison text  
Muted text

--------------------------------------------------

GOAL

Ensure the trend indicator reads naturally:

“+2 increase vs Last Cycle”

instead of the confusing

“▲ +2 vs Last Cycle”.

End.