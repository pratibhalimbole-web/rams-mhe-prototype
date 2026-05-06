Replace the four separate filter dropdowns in the Integrity Summary toolbar with a single unified **Filters** control.

Do NOT modify:
• Search field
• Table layout
• Sorting
• Pagination
• Data logic
• Filter logic itself

Only change the filter UI structure.

---

## CURRENT STATE

Toolbar currently shows four dropdown filters:

• Scope
• Risk Status
• Acceptability
• Element

These should be removed from the toolbar.

---

## NEW TOOLBAR STRUCTURE

Toolbar should now display:

Search Field | Filters Button

Example layout:

[ Search by Test, Rack, Bay, Level, Position ]   [ Filters ]

---

## FILTER BUTTON

Button label:

Filters

If filters are active, show count:

Filters (3)

Style:
• Same height as existing controls
• Use outline / secondary button style
• Include filter icon on the left

Example:

[ 🔎 Search ]   [ ⛃ Filters (2) ]

---

## FILTER POPOVER

Clicking **Filters** opens a popover/dropdown panel.

Panel width: ~320px
Panel padding: design system spacing.

Inside the popover, group filters into sections.

---

## SECTION 1 — Scope

Checkbox group:

☐ Global
☐ Local

---

## SECTION 2 — Risk Status

Checkbox group:

☐ Green
☐ Amber
☐ Red
☐ Critical

---

## SECTION 3 — Acceptability

Checkbox group:

☐ Acceptable
☐ Borderline
☐ Not Acceptable

---

## SECTION 4 — Element

Checkbox group populated dynamically from available elements.

Example:

☐ Beam
☐ Upright
☐ Baseplate
☐ Anchor
☐ Decking

---

## FOOTER ACTIONS

Bottom of the popover should include:

[ Clear Filters ]   [ Apply ]

Clear Filters:
Resets all selections.

Apply:
Applies filter selections and closes the popover.

---

## FILTER COUNT LOGIC

The Filters button should display the number of active filters.

Example:

Filters (3)

Count includes:
• Scope selections
• Risk status selections
• Acceptability selections
• Element selections

---

## OPTIONAL (RECOMMENDED UX)

When filters are applied, show chips under the toolbar:

[Global] [Red] [Beam]  ✕ Clear All

Each chip can be removed individually.

---

## IMPORTANT

Do not change filter logic or backend structure.
Only consolidate the UI controls into a single popover interface.
