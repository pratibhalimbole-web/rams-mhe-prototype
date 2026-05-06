Below is the **detailed Figma Make prompt** to fix the UX issue where the **Rack Detail page still shows “Set Final Rack Status” even when a status already exists**.
This prompt adds a **View Mode + Override Mode** without changing the existing layout you already designed.

---

# Figma Make Prompt — Stability Status State Logic

## Objective

Update the **Rack Stability Detail screen** to support two UI states:

1. **Not Evaluated State** (first evaluation)
2. **Evaluated State** (status already assigned)

Currently the UI always shows **“Set Final Rack Status”**, which is incorrect if the rack already has a status.

The new design must:

* Show **Current Rack Status summary** when a status exists
* Allow editing only when the user clicks **Override Status**
* Keep the existing bottom panel layout unchanged

---

# State 1 — Not Evaluated (First Time)

If the rack has **no stability status**, show the current UI unchanged.

Header:

```
Set Final Rack Status
```

Buttons:

```
[ Stable ]   [ Conditional ]   [ Not Stable ]
```

Forms:

* Conditional form appears when **Conditional** is selected
* Not Stable form appears when **Not Stable** is selected

Bottom actions:

```
Cancel         Save Rack Status
```

No changes required in this state.

---

# State 2 — Status Already Evaluated (View Mode)

If a rack already has a status, replace the **status selector** with a summary panel.

### Replace this block

```
Set Final Rack Status
[ Stable ] [ Conditional ] [ Not Stable ]
```

### With

```
Current Rack Status
```

Status badge example:

```
🔴 Not Stable
```

Below it show evaluation metadata:

```
Evaluated by: John Martinez
Evaluated on: 13 Mar 2026
```

Keep typography consistent with the rest of the page.

---

# Override Action

Below the status summary, add a button:

```
Override Status
```

Button style:

* Secondary button
* Neutral color
* Same button system used elsewhere in the app

Purpose:

Allows inspectors to **change a previously assigned stability status**.

---

# State 3 — Override Mode (Edit Mode)

When user clicks **Override Status**, show the existing evaluation UI again.

Display:

```
Update Rack Status
```

Buttons:

```
[ Stable ]   [ Conditional ]   [ Not Stable ]
```

Forms behave the same as in the **Not Evaluated state**.

Bottom actions remain:

```
Cancel       Update Rack Status
```

---

# Visual Layout

Do not change the existing bottom panel structure.

Replace only the content inside it.

### View Mode

```
Current Rack Status

🔴 Not Stable

Evaluated by John Martinez
13 Mar 2026

[ Override Status ]
```

### Edit Mode

```
Update Rack Status

[ Stable ] [ Conditional ] [ Not Stable ]

Cancel      Update Rack Status
```

---

# Color Rules

Use existing status colors:

| Status      | Color |
| ----------- | ----- |
| Stable      | Green |
| Conditional | Amber |
| Not Stable  | Red   |

Status should appear as a **badge or pill**.

---

# Spacing Rules

Keep the same spacing used in the current panel.

Suggested spacing:

```
Section padding: 16px
Status → metadata spacing: 8px
Metadata → override button spacing: 16px
```

---

# Interaction Logic

The UI must support this logic:

```
IF rack_status == null
    show "Set Final Rack Status"
ELSE
    show "Current Rack Status"
```

When **Override Status** is clicked:

```
switch to Edit Mode
```

---

# Components to Add

Add one reusable component:

```
Rack Status Summary
```

Structure:

```
Status Badge
Evaluator Name
Evaluation Date
Override Button
```

This component can later be reused in **reports and rack lists**.

---

# Important Constraint

Do NOT modify:

* Rack canvas
* Right insight panels
* Observations panel
* Status selector styling
* Conditional form
* Not Stable form

Only introduce **state-based rendering for the status section**.

---

# Result

The rack detail page will now correctly support:

1. **First-time evaluation**
2. **Viewing an existing decision**
3. **Overriding a previous decision**

This aligns with the **FRD requirement for stability evaluation persistence and auditability**.

---

If you want, I can also show **one more critical UX fix for this screen** that inspectors will run into during real warehouse inspections.
