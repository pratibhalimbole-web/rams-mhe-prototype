[SPECS BLOCK]

Figma Make Prompt:

Refine the **Stability Dashboard UI** to improve visual hierarchy, alignment, and interaction quality while keeping the existing structure intact.  
Do NOT change layout structure, table columns, or pagination.

Focus only on improving **Search/Filter alignment, Summary Cards layout, Table header clarity, Status spacing, and Action button visibility**.

--------------------------------------------------

1. SEARCH + ACTION BAR REFINEMENT

Improve alignment and grouping.

Layout pattern:

[ Search racks................................ ]  [Filter] [Export Report]

Rules:

• Search field should visually dominate the row  
• Filter and Export buttons should sit close to the search field  
• Maintain consistent vertical alignment with the search input  
• Buttons should appear as secondary actions next to the search

Purpose:

Create a cleaner **control bar similar to Jira / Linear dashboards**.

--------------------------------------------------

2. SUMMARY CARDS – SPARKLINE ALIGNMENT

Improve internal card layout for better balance.

Card structure:

Top row

Metric label (left)  
Sparkline chart (right)

Example:

Total Racks                     sparkline

Middle section

Large metric value

Example

35

Bottom row

Trend indicator

Example

+3 ▲ vs Last Cycle

Rules:

• Sparkline must align to the **top-right of the card**  
• Metric value must remain the strongest visual element  
• Trend indicator must sit below the value  
• Maintain generous whitespace inside the card

Goal:

Improve visual hierarchy and remove the floating sparkline feeling.

--------------------------------------------------

3. STABILITY STATUS COLUMN SPACING

Increase spacing for the **Stability Status column**.

Rules:

• Ensure badges have comfortable horizontal padding  
• Prevent the status badge from visually colliding with the Action column  
• Maintain consistent spacing between columns

Goal:

Improve readability and avoid cramped row layout.

--------------------------------------------------

4. TABLE HEADER CLARITY

Enhance the table header row.

Rules:

• Add subtle header background tint  
• Slightly increase header text contrast  
• Maintain the same typography style used across other IRDS tables

Goal:

Make column labels easier to scan without introducing heavy UI elements.

--------------------------------------------------

5. ACTION BUTTON IMPROVEMENT

Improve the **View Rack** action button.

Replace the current button style with a clearer primary action.

Example:

View Rack →

Rules:

• Add a small arrow icon to the button  
• Maintain ghost or subtle button style to avoid visual noise  
• Ensure the action stands out as the main interaction per row

Goal:

Make the primary action easier to discover and consistent with modern SaaS dashboards.

--------------------------------------------------

6. SUMMARY CARD INTERACTION

Add interaction behavior to summary cards.

Rules:

Clicking a card filters the table.

Examples:

Click "Stable Racks"  
→ Table shows only Stable racks

Click "Conditional Racks"  
→ Table shows only Conditional racks

Click "Not Stable Racks"  
→ Table shows only Not Stable racks

Click "Total Racks"  
→ Reset filter

Goal:

Turn summary cards into **interactive filters**, improving dashboard usability.

--------------------------------------------------

DESIGN PRINCIPLES

• Maintain minimal enterprise style  
• Follow patterns used in Asana, Linear, and Atlassian dashboards  
• Preserve whitespace and clean typography  
• Avoid heavy borders or unnecessary colors

End.