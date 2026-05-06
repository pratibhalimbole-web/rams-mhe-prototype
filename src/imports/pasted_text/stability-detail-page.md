Below is a **final, structured prompt** you can give to **Figma Make / design system AI** to complete the **Stability Detail Page (Screen 2)**.
It **keeps everything already implemented** and **adds only the remaining required UX states and components**.

---

# Final Prompt for Figma Make

### Module: TPI → IRDS → Stability

### Screen: Rack Stability Detail (Screen 2)

---

# Objective

Complete the **Rack Stability Detail page** by adding the **remaining interaction states and forms** required by the Stability module specification.

⚠️ **Do not modify or redesign existing UI components.**
Extend the current layout only.

Existing elements that must remain unchanged:

* 3D rack visualization canvas
* Rack markers / severity pins
* Restricted / blocked zones
* Right-side floating panel system
* Rack Information panel
* Rack Stability Indicators panel
* Observations panel
* Bottom stability decision panel
* Page layout and spacing
* Sidebar and navigation

All additions must **fit into the existing structure**.

---

# Current Layout Structure

### Left Area

3D rack visualization canvas with inspection markers.

### Right Floating Panel

Accessible via icon rail:

1. Rack Information
2. Rack Stability Indicators
3. Observations

These panels slide over the right side of the canvas.

### Bottom Panel

Rack Stability Decision Panel.

Contains:

```
Current Rack Status
Stable | Conditional | Not Stable

Cancel | Update Rack Status
```

This bottom panel must remain **fixed and unchanged visually**.

---

# Add the Following Missing Features

---

# 1. Conditional Stability Form

### Trigger

When user selects:

```
Conditional
```

from the **bottom stability selector**.

---

### Behavior

A **Conditional Stability Form panel appears above the bottom panel**.

Interaction:

```
Bottom panel stays fixed
Conditional form slides up above it
```

---

### Layout

Title:

```
Conditional Stability Requirements
Define operational restrictions for this rack
```

Fields:

```
Condition Description *
Textarea
Placeholder:
Rack can operate with reduced load until repairs are completed.

Allowed Load Limit
Numeric field (percentage)

Required Repairs
Textarea

Reinspection Date
Date picker

Additional Notes
Optional textarea
```

---

### Form Actions

Buttons at bottom of form:

```
Cancel
Save Conditions
```

Saving enables **Update Rack Status**.

---

# 2. Status Override State

If the rack **already has a stability status assigned**.

Example:

```
Current Rack Status
[ Not Stable ]
```

Add secondary control:

```
Override Status
```

---

### Behavior

When **Override Status** is clicked:

Status buttons become active again.

```
Stable
Conditional
Not Stable
```

Until override is clicked, status buttons remain disabled.

---

# 3. Confirmation Modal

Before updating rack status.

Trigger:

```
Update Rack Status
```

---

### Modal Content

Title:

```
Confirm Stability Status Update
```

Message:

```
You are about to mark this rack as "Not Stable".

This status indicates the rack is unsafe for operation.
Please confirm that this evaluation reflects the current rack condition.
```

Buttons:

```
Cancel
Confirm & Save
```

Modal should follow **existing IRDS modal design style**.

---

# 4. Success Toast Notification

After status update confirmation.

Display toast notification in top-right.

Message:

```
Rack stability status updated successfully
```

Optional secondary line:

```
Evaluation has been recorded in the audit log
```

Toast auto-dismiss after **4 seconds**.

---

# 5. Observation Interaction Sync

Ensure interaction between **rack pins and observation list**.

---

### Behavior

Click rack pin:

```
Highlight observation card
Scroll observation list to card
```

Click observation card:

```
Highlight rack pin
Center rack camera on pin
```

---

### Visual State

Active observation card:

```
Primary border highlight
Subtle background tint
```

Active rack pin:

```
Glow ring
Slight scale increase
```

---

# 6. Empty Evaluation State

If rack has **not yet been evaluated**.

Replace bottom panel content with:

```
Rack Stability Not Evaluated

Review inspection findings and assign a stability status.

[ Start Evaluation ]
```

Clicking **Start Evaluation** reveals:

```
Stable
Conditional
Not Stable
```

---

# 7. Conditional Status Indicator

If rack status is **Conditional**, display indicator in header.

Example:

```
Rack Status
Conditional
Conditions Applied
```

Hover tooltip:

```
Rack is operating under defined restrictions.
```

---

# 8. Layout Rules

New components must respect existing layout.

Rules:

```
Right panels float above canvas
Bottom panel fixed to viewport
Conditional form appears above bottom panel
No existing panels should move
```

Spacing:

```
Canvas padding top: 24px
Canvas padding bottom: 24px
Right panel margin from canvas: 24px
```

---

# 9. Components to Create

Create reusable components:

```
Conditional Stability Form
Status Confirmation Modal
Success Toast Notification
Empty Evaluation State
Observation Highlight State
Rack Pin Active State
```

---

# 10. Interaction Prototype States

Prototype these flows:

```
Select Conditional → show conditional form
Save conditions → enable Update Rack Status
Update Rack Status → open confirmation modal
Confirm → show success toast
Click rack pin ↔ highlight observation
Start evaluation → enable status selection
```

---

# Expected Result

The **Rack Stability Detail page becomes fully functional** with:

* Stability evaluation workflow
* Conditional restrictions capture
* Status confirmation and audit behavior
* Observation-to-rack interaction
* Empty evaluation state

All while **preserving the current UI layout and design**.

---

If you want, I can also provide the **final UX rule set for rack status logic** (Stable vs Conditional vs Not Stable), which prevents incorrect stability assignments.
