Below is the **final detailed Figma Make prompt** to implement your decision:

**Remove the bottom evaluation panel** and instead use a **CTA + modal workflow** to evaluate rack stability **without breaking any existing functionality**.

This prompt preserves:

* rack canvas
* right side panels
* observation panel
* conditional form
* not stable form
* override logic
* status display

Only the **evaluation interaction changes**.

---

# Figma Make Prompt — Stability Evaluation via Modal

## Objective

Refactor the **Rack Stability Detail screen** so that rack status evaluation happens inside a **modal dialog triggered by a CTA**, instead of using the large bottom panel.

This prevents the rack canvas from being hidden and keeps the workspace clean while preserving all current evaluation features.

---

# Change 1 — Remove Bottom Evaluation Panel

Delete the entire bottom panel currently containing:

```
Set Final Rack Status
Stable | Conditional | Not Stable
Conditional / Not Stable forms
Cancel | Save Rack Status
```

This panel currently blocks the rack canvas and reduces visibility.

All evaluation functionality must move to the **modal dialog**.

---

# Change 2 — Add Evaluate Stability CTA

Add a primary action button on the rack detail page.

### Location

Place the CTA **above the rack canvas area**, aligned with the canvas header or near the observations panel header.

Example placement:

```
Rack Canvas Header
----------------------------
CN-L1 — Rack 05

Evaluate Stability
```

Button style:

```
Primary Button
```

Label:

```
Evaluate Stability
```

Icon (optional):

```
shield-check
```

---

# Change 3 — Modal Dialog for Stability Evaluation

Clicking **Evaluate Stability** opens a modal.

Modal title:

```
Evaluate Rack Stability
```

Modal width:

```
640px–720px
```

Modal structure:

```
Evaluate Rack Stability
Assess the structural stability of this rack based on inspection findings.

----------------------------------------------------

Set Rack Status

Stable | Conditional | Not Stable

----------------------------------------------------

[Dynamic Form Area]

----------------------------------------------------

Cancel        Save Rack Status
```

---

# Change 4 — Status Selector

Inside the modal include the same status selector currently used:

```
Stable
Conditional
Not Stable
```

Buttons should maintain existing color logic:

| Status      | Color |
| ----------- | ----- |
| Stable      | Green |
| Conditional | Amber |
| Not Stable  | Red   |

Only one can be selected.

---

# Change 5 — Conditional Status Form

If **Conditional** is selected, display the existing form inside the modal.

Section title:

```
Conditional Stability Requirements
```

Subtitle:

```
Define operational restrictions for this rack
```

Fields:

**Condition Description***
Textarea

Placeholder:

```
Rack can operate with reduced load until damaged beam is replaced.
```

---

**Allowed Load Limit**

Input field

Placeholder:

```
e.g., 70%
```

---

**Reinspection Date**

Date picker

Placeholder:

```
Pick a date
```

---

# Change 6 — Not Stable Form

If **Not Stable** is selected, display the form.

Section title:

```
Unsafe Rack Declaration
```

Subtitle:

```
Explain why this rack is unsafe for operation
```

Fields:

### Reason for Instability *

Textarea

Placeholder:

```
Describe the structural issue that makes this rack unsafe.
Example: Severe upright deformation detected. Rack must be taken out of service until repaired.
```

Required field.

---

### Recommended Action

Textarea

Placeholder:

```
Describe the recommended repair or corrective action.
Example: Replace damaged upright frame and inspect beam connections.
```

Optional field.

---

# Change 7 — Observations Context Indicator

Inside the modal, above the Save button, display the observation warning.

Example:

```
● 2 Critical Observations
⚠ Ensure status reflects safety conditions
```

This information should be dynamically pulled from rack findings.

---

# Change 8 — Save Behavior

Buttons at bottom of modal:

```
Cancel
Save Rack Status
```

Rules:

Save button disabled until required fields are filled.

After saving:

```
Close modal
```

Update rack detail page.

---

# Change 9 — Display Status in Rack Info Panel

After a status is saved, show the result inside the **Rack Info panel (first right side tab)**.

Add a new section:

```
Stability Status
```

Example display:

```
Stability Status
Conditional

Conditions Applied

Evaluated by
John Martinez

Evaluated on
13 Mar 2026
```

Status badge should use the same colors as evaluation buttons.

---

# Change 10 — Override Status

Inside the Rack Info panel add a secondary button:

```
Override Status
```

Clicking this button opens the **same evaluation modal again** with existing values pre-filled.

---

# Change 11 — Status Badge in Canvas Header

Add a small status badge near the rack title for quick visibility.

Example:

```
CN-L1 — Rack 05
Status: Conditional
```

Badge colors:

| Status      | Color |
| ----------- | ----- |
| Stable      | Green |
| Conditional | Amber |
| Not Stable  | Red   |

---

# Interaction Logic

```
IF rack_status == null
    Show Evaluate Stability CTA
ELSE
    Show status badge + Override button
```

---

# Components to Reuse

Reuse existing components:

* status selector buttons
* conditional form
* not stable form
* observation warning indicator
* button styles
* form field styling

No redesign required.

---

# Important Constraint

Do NOT modify:

* rack canvas visualization
* observation panel
* insight panel
* right panel structure
* inspection findings cards

Only change the **evaluation interaction pattern**.

---

# Final Result

The rack detail page will support:

1. Clean canvas workspace
2. Modal-based evaluation workflow
3. Persistent status display
4. Ability to override previous evaluation

This maintains **all current functionality while fixing the canvas visibility problem**.

---

If you'd like, I can also give you a **second prompt to optimize the Rack Info panel layout**, because the stability status block can be integrated there in a much cleaner SaaS-style layout.
