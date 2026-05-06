Yes — you’re **100% correct**. Right now the **Stability panel is incomplete** because it only shows:

* Status
* Evaluated by
* Evaluated on

But it **does NOT show the data entered in the modal**, which creates a UX problem.

User fills forms like:

* Reason for Instability
* Recommended Action
* Condition Description
* Load Limit
* Reinspection Date

…and then **none of that appears in the panel**.
So the user cannot **review the decision** without reopening the modal.

That’s bad UX.

---

# Correct Behavior

The **Stability panel must display the evaluation details** based on the selected status.

The panel becomes the **summary of the evaluation**.

---

# Correct Panel Structure

## Case 1 — Not Stable

Panel should show:

```
Rack Stability
Evaluation Status

Current Status
Not Stable

Evaluated by
John Martinez

Evaluated on
13 Mar 2026
```

Divider

```
Reason for Instability
Severe upright deformation detected.
Rack must be taken out of service until repaired.
```

```
Recommended Action
Replace damaged upright frame and inspect beam connections.
```

CTA

```
Override Status
```

---

# Case 2 — Conditional

Panel should show:

```
Rack Stability
Evaluation Status

Current Status
Conditional

Evaluated by
John Martinez

Evaluated on
13 Mar 2026
```

Divider

```
Condition
Rack can operate at reduced load until damaged beam is replaced.
```

```
Allowed Load Limit
70%
```

```
Reinspection Date
20 Mar 2026
```

CTA

```
Override Status
```

---

# Case 3 — Stable

Panel:

```
Rack Stability
Evaluation Status

Current Status
Stable

Evaluated by
John Martinez

Evaluated on
13 Mar 2026
```

Optional:

```
Notes
Rack inspected and verified structurally safe.
```

CTA

```
Override Status
```

---

# Why This Is Important

Without this:

* User cannot **verify what was entered**
* User cannot **review conditions later**
* System loses **audit clarity**

The panel should act as a **decision summary card**.

---

# Visual Layout

```
Rack Stability
Evaluation Status
--------------------------------

Current Status
Not Stable

Evaluated by
John Martinez

Evaluated on
13 Mar 2026

--------------------------------

Reason for Instability
Severe upright deformation detected.

--------------------------------

Recommended Action
Replace damaged upright frame.

--------------------------------

[ Override Status ]
```

---

# Figma Update Prompt

Use this prompt:

Update the Rack Stability panel so that it displays the details entered during stability evaluation.

Currently the panel only shows:
Current Status
Evaluated by
Evaluated on

Enhance the panel to show the evaluation data depending on the selected rack status.

For "Not Stable" status:
Display additional sections:
Reason for Instability
Recommended Action

These fields should display the values entered in the Unsafe Rack Declaration form inside the Evaluate Rack Stability modal.

For "Conditional" status:
Display:
Condition Description
Allowed Load Limit
Reinspection Date

These fields should display the values entered in the Conditional Stability Requirements form.

For "Stable" status:
Only show:
Current Status
Evaluator
Evaluation date
Optional notes if provided.

Panel layout should follow this structure:

Header
Rack Stability
Evaluation Status

Section
Current Status

Section
Evaluated by

Section
Evaluated on

Divider

Dynamic Evaluation Details
Depending on status:
Reason and Recommended Action (Not Stable)
Condition Description, Load Limit, Reinspection Date (Conditional)

Footer CTA
Override Status

Ensure the panel remains a floating right-side panel and does not change the existing layout or modal evaluation workflow.

---

# One Small UX Improvement (Highly Recommended)

Under the **status badge**, add a **status explanation line**:

For example:

```
Not Stable
Rack is unsafe and must not be used until repaired.
```

```
Conditional
Rack can operate with defined restrictions.
```

This helps **warehouse operators understand immediately**.

---

Your Stability screen is now **very close to production-grade inspection software**.
