Below is the **final Figma Make prompt** to complete the **“Not Stable” status form** for the Stability Detail page **without changing any existing UI components**.

This prompt assumes your current design already includes:
• Status selector (Stable / Conditional / Not Stable)
• Conditional form
• Bottom action bar (Cancel / Save Rack Status)
• Observations warning row

---

# Figma Make Prompt — Not Stable Form

**Objective**

Enhance the **Stability Detail screen** by adding a minimal explanation form when the **“Not Stable”** status is selected.
This form should capture the reason for marking the rack unsafe without adding unnecessary complexity.

Do **not modify any existing UI structure or spacing**.

---

# Interaction Logic

When the user selects **Not Stable** in the **Set Final Rack Status** selector:

Display a new form section below the status selector.

Hide the **Conditional Stability Requirements** form.

---

# Section Title

```
Unsafe Rack Declaration
```

Subtitle:

```
Explain why this rack is unsafe for operation
```

Style:

• Same typography hierarchy as the **Conditional Stability Requirements** section
• Section container should use the **same card style** already used in Conditional form

---

# Form Fields

## Field 1 — Reason for Instability (Required)

Label:

```
Reason for Instability *
```

Component:

```
Textarea
```

Placeholder:

```
Describe the structural issue or safety concern that makes this rack unsafe for operation.
Example: Severe upright deformation detected. Rack must be taken out of service until repaired.
```

Textarea height:

```
80–100px
```

Validation:

Required field before allowing status save.

---

## Field 2 — Recommended Action (Optional)

Label:

```
Recommended Action
```

Component:

```
Textarea
```

Placeholder:

```
Describe the recommended repair or corrective action.
Example: Replace damaged upright frame and inspect beam connections.
```

Textarea height:

```
80px
```

Optional field.

---

# Safety Context Indicator

Above the form fields, display the existing safety indicator row:

```
● 2 Critical Observations
⚠ Ensure status reflects safety conditions
```

This component should remain unchanged and appear above the form.

---

# Layout Structure

```
Set Final Rack Status
[ Stable ] [ Conditional ] [ Not Stable ]

--------------------------------------

Unsafe Rack Declaration
Explain why this rack is unsafe for operation

Reason for Instability *
[ textarea ]

Recommended Action
[ textarea ]

--------------------------------------

● 2 Critical Observations
⚠ Ensure status reflects safety conditions

Cancel           Save Rack Status
```

---

# UI Consistency Rules

Follow the same design tokens used in the page:

Spacing

```
Section padding: 16–20px
Field spacing: 16px
```

Border

```
1px solid var(--border)
radius: var(--radius)
```

Typography

```
Section title → font-weight: 600
Subtitle → muted text color
Field labels → font-weight: 500
```

---

# Interaction States

Save button behavior:

Disabled when:

```
Reason for Instability is empty
```

Enabled when:

```
Reason for Instability contains text
```

---

# Conditional vs Not Stable Behavior

| Status      | Form Display                                 |
| ----------- | -------------------------------------------- |
| Stable      | No form                                      |
| Conditional | Show Conditional Stability Requirements form |
| Not Stable  | Show Unsafe Rack Declaration form            |

Only **one form visible at a time**.

---

# UX Goal

The Not Stable form should:

• Record **why the rack is unsafe**
• Support **safety audit and reporting**
• Be **fast to complete during inspections**
• Avoid redundant fields

Maximum **2 fields only**.

---

# Do Not Modify

Do **not change**:

• status selector layout
• bottom action bar
• observations warning row
• existing conditional form
• canvas spacing

Only add the **Not Stable form section**.

---

If you want, I can also give the **next Figma prompt to complete the remaining items for Screen-2**:

* 3D rack **stability overlay**
* **Conditional status empty state**
* **Stability insights panel improvements**
* **status history / audit block**

Those are the last pieces needed to fully satisfy the requirement document.
