Replace the current filter popover with a right-side filter panel.

Do NOT change:
• Table layout
• Search field
• Data logic
• Pagination
• Sorting

Only change the filter UI.

---

FILTER PANEL BEHAVIOR

Clicking the "Filters" button should open a right-side sliding panel.

Panel width: 360px
Panel position: right side of screen
Panel animation: slide-in from right

The main table remains visible on the left.

---

PANEL HEADER

Top section:

Filters        [X]

The X button closes the panel.

---

FILTER SECTIONS

Filters are grouped vertically.

SECTION — Risk Status

Use pill buttons:

[ Green ] [ Amber ] [ Red ] [ Critical ]

Multiple selection allowed.

---

SECTION — Scope

Checkbox group:

☐ Global
☐ Local

---

SECTION — Acceptability

Checkbox group:

☐ Acceptable
☐ Borderline
☐ Not Acceptable

---

SECTION — Element Type

Checkbox grid layout:

☐ Beam
☐ Upright
☐ Baseplate
☐ Anchor
☐ Decking
☐ Bracing

---

SCROLLING

The filter panel must be vertically scrollable if content exceeds screen height.

---

PANEL FOOTER

Sticky footer at bottom of panel:

[ Clear All ]        [ Apply Filters ]

Clear All:
Removes all filter selections.

Apply Filters:
Applies selected filters and refreshes the table.

---

STYLE

Use design system variables for:
• spacing
• border
• typography
• colors

Maintain consistent styling with the rest of the dashboard.
