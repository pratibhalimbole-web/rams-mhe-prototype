Below is a **clear implementation prompt** you can give to your developer / AI code generator (Claude / Cursor / Copilot etc.) to update the **Rack Stability Detail page UX** so it handles **all real scenarios correctly**.

This prompt assumes your current page already has:

* Rack canvas
* Observation panel
* Bottom decision panel
* Status buttons
* Save modal + sonner toast

---

# Detailed Prompt — Update Rack Stability Detail UX Logic

## Objective

Update the **Rack Stability Detail page** so the bottom decision panel correctly handles **three rack stability states**:

1. **Not Evaluated**
2. **Already Evaluated**
3. **View Only / Review Mode**

The UI must clearly communicate the rack's **current status** and avoid forcing the user to re-assign status unnecessarily.

---

# Page Context

This page is used by an **inspector reviewing rack stability**.

User workflow:

```
Open rack
↓
Review observations
↓
Assign or update rack stability
↓
Save status
```

Rack stability statuses:

```
Stable
Conditional
Not Stable
```

---

# Required Logic

Introduce a rack property:

```
rack.status
```

Possible values:

```
null
"stable"
"conditional"
"not-stable"
```

---

# Scenario 1 — Rack Not Evaluated

Condition:

```
rack.status === null
```

UI behavior:

### Bottom panel header

```
Set Final Rack Status
```

### Status selector

```
[ Stable ] [ Conditional ] [ Not Stable ]
```

### Primary CTA

```
Save Rack Status
```

Button state:

```
disabled until status selected
```

### Confirmation Modal

```
Confirm Rack Status

You are marking this rack as {status}

Cancel | Confirm
```

After confirm:

```
toast.success("Rack status saved")
```

---

# Scenario 2 — Rack Already Evaluated

Condition:

```
rack.status !== null
```

Example:

```
rack.status = "conditional"
```

### Bottom panel header

```
Current Rack Status
```

Display badge:

```
Conditional
```

### Status selector

Buttons still visible for editing.

Selected button must match current status.

```
[ Stable ] [ Conditional ] [ Not Stable ]
```

### CTA label

Change from:

```
Save Rack Status
```

to:

```
Update Rack Status
```

### Confirmation modal text

```
Confirm Status Update

You are updating rack status from
{previousStatus} → {newStatus}

Cancel | Confirm Update
```

Toast:

```
toast.success("Rack status updated")
```

---

# Scenario 3 — Review Mode (Optional UX Improvement)

If user has **not changed the status**, do not allow update.

Example:

```
currentStatus = "conditional"
selectedStatus = "conditional"
```

Disable button:

```
Update Rack Status (disabled)
```

Enable only when status changes.

---

# Bottom Panel Layout

Structure must remain:

```
--------------------------------------------------
Critical Observations Summary

Set / Update Rack Status
[ Stable ] [ Conditional ] [ Not Stable ]

Cancel            Save / Update Rack Status
--------------------------------------------------
```

Panel is:

```
fixed
full canvas width
not overlapping sidebar
```

---

# UI Indicators

Add a visible **status badge** above selectors.

Example:

```
Current Rack Status: Conditional
```

Badge colors:

```
Stable → green
Conditional → amber
Not Stable → red
```

---

# Additional UX Rules

### If rack has critical observations

Show warning message:

```
⚠ This rack has critical observations.
Ensure status reflects safety conditions.
```

---

### Prevent accidental saving

Require:

```
status selection
confirmation modal
```

---

# State Model

Recommended state:

```
const [currentStatus, setCurrentStatus]
const [selectedStatus, setSelectedStatus]
const [confirmModalOpen, setConfirmModalOpen]
```

---

# Button Enable Logic

```
if currentStatus === null
   enable when selectedStatus != null

if currentStatus !== null
   enable when selectedStatus !== currentStatus
```

---

# Expected UX Result

User flows:

### New rack

```
Not Evaluated
↓
Select status
↓
Save Rack Status
```

### Existing rack

```
Conditional
↓
Inspector decides to change
↓
Update Rack Status
```

### Review only

```
Conditional
↓
Inspector reads observations
↓
No action required
```

---

# Important UX Goal

Avoid forcing inspectors to **reassign status when it already exists**.

System must behave like:

```
Assign → Edit → Review
```

Not:

```
Assign → Assign again
```

---

If you want, I can also help you add **one more missing scenario that will appear once racks have hundreds of observations**, which will affect this page layout.
