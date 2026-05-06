Yes — your thinking is correct. If **Stability is the main purpose of this screen**, the UI should guide the user to it immediately. That means:

* Stability panel should be **the primary context panel**
* It should **open by default when the screen loads**
* The **bottom evaluation panel should be removed** (to avoid canvas obstruction)
* All stability actions should live in the **Stability panel + modal**

This keeps the rack canvas fully visible and avoids duplicate CTAs.

---

# Final UX Structure

## Right Side Icon Order

Move **Stability icon to the first position**.

```
🛡 Stability
ⓘ Rack Info
📊 Insights
⚠ Observations
```

Reason: Stability is the **main action of this module**, the others are supporting panels.

---

# Default Behavior

When the rack detail page loads:

```
Stability panel opens automatically
```

User immediately sees:

* current rack stability status
* evaluation state
* ability to evaluate

No extra clicks required.

---

# Remove Bottom Panel

Remove the entire bottom bar that contains:

```
Set Final Rack Status
Stable / Conditional / Not Stable
Cancel / Save
```

Reason:

* It hides the rack canvas
* It duplicates the evaluation flow
* Modal already handles evaluation

The bottom can optionally keep **only the observation warning text**, but even that can move to the stability panel.

---

# Final Stability Panel Behavior

## Case 1 — Rack Not Evaluated

Panel:

```
Rack Stability
Not yet evaluated

Status
Not Evaluated

This rack has not yet been assessed for stability.
Review inspection findings and assign a stability status.

[ Evaluate Stability ]
```

Click → open **Evaluate Rack Stability modal**

---

## Case 2 — Stable

```
Rack Stability
Stable

Evaluated by
John Martinez

Evaluated on
13 Mar 2026

No operational restrictions.

[ Override Status ]
```

---

## Case 3 — Conditional

```
Rack Stability
Conditional
Conditions Applied

Evaluated by
John Martinez

Evaluated on
13 Mar 2026

Condition
Rack can operate at reduced load until beam replacement.

Allowed Load Limit
70%

Reinspection Date
20 Mar 2026

[ Override Status ]
```

---

## Case 4 — Not Stable

```
Rack Stability
Not Stable

Evaluated by
John Martinez

Evaluated on
13 Mar 2026

Reason
Severe upright deformation detected.

Recommended Action
Rack must remain out of service until repaired.

[ Override Status ]
```

---

# Modal Remains Unchanged

Your current modal design is good.

```
Evaluate Rack Stability
Stable
Conditional
Not Stable
```

Conditional → show conditional form
Not Stable → show unsafe declaration form

Save → update stability panel.

---

# Final Screen Layout

```
| Sidebar | Rack Canvas | Right Panel |
|         |             |             |
|         | Rack View   | Stability   |
|         |             | Rack Info   |
|         |             | Insights    |
|         |             | Observations|
```

Stability panel **opens by default**.

---

# Interaction Flow

1. User opens rack
2. Stability panel already visible
3. User clicks **Evaluate Stability**
4. Modal opens
5. User sets status
6. Modal closes
7. Stability panel updates

---

# Final Figma Prompt

Use this for the design update:

Update the Rack Stability detail page to make Stability the primary contextual panel.

Move the Stability icon to the first position in the right-side vertical icon stack.

New icon order:

1. Stability
2. Rack Info
3. Insights
4. Observations

When the rack detail screen loads, the Stability panel should open automatically by default.

Remove the entire bottom evaluation panel that previously contained:

* Set Final Rack Status
* Stable / Conditional / Not Stable buttons
* Cancel / Save buttons

This panel should be removed to prevent obstruction of the rack canvas.

All stability actions should now occur through the Stability panel and the existing Evaluate Rack Stability modal.

The Stability panel should display the rack evaluation state.

If the rack has not yet been evaluated:
Show:
Title: Rack Stability
Status badge: Not Evaluated
Description text explaining that the rack has not been assessed yet.

Provide CTA:
Evaluate Stability

Clicking this CTA opens the existing Evaluate Rack Stability modal.

If the rack has been evaluated:
Show:
Current Status badge (Stable / Conditional / Not Stable)
Evaluator name
Evaluation date

If Conditional:
Display:
Condition description
Allowed load limit
Reinspection date

If Not Stable:
Display:
Reason for instability
Recommended action

Provide button:
Override Status

Clicking Override Status opens the Evaluate Rack Stability modal again.

The Stability panel must follow the same layout and floating behavior as the other right-side panels:
Width: 360px
Top margin: 24px
Bottom margin: 24px
Right margin: 24px
Overlay floating panel on rack canvas.

Ensure this change does not modify:
Rack canvas layout
Rack Info panel
Insights panel
Observations panel
Existing evaluation modal design.

---

If you want, I can also show **one powerful visual improvement** for this module:
a **rack-level stability indicator directly on the rack canvas** so inspectors instantly see whether the rack is Stable, Conditional, or Not Stable without opening the panel.
