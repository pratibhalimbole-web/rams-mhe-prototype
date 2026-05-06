Below is a **clean implementation prompt/spec** you can give to the developer (or Claude/Cursor) to add the **bottom fixed CTA panel** to the **Rack Stability Detail (second screen)** exactly like in your screenshot.

---

# CTA Panel Addition — Rack Stability Detail Page

### Objective

Add a **fixed bottom action bar** to the **Rack Stability Detail page**.
The bar must remain visible while the rack canvas and observation panel remain scrollable.

---

# Placement

The CTA panel should appear:

* **Fixed to the bottom of the viewport**
* **Aligned with the content area (not overlapping the left sidebar)**
* **Below the rack canvas**

Structure:

```
-------------------------------------------------------------
|                       Rack Canvas                          |
|                                                            |
|                                                            |
|                         Floating Panel                     |
|                                                            |
-------------------------------------------------------------
|                 Bottom Fixed CTA Panel                     |
|  Update & Reassign Task      Verify & Close Issue          |
-------------------------------------------------------------
```

---

# Layout Specifications

Container:

```
position: fixed
bottom: 0
left: sidebarWidth
right: 0
height: 72px
background: var(--background)
border-top: 1px solid var(--border)
z-index: 40
```

Spacing:

```
padding: 0 24px
display: flex
align-items: center
justify-content: flex-end
gap: 12px
```

Shadow (subtle elevation):

```
box-shadow: 0 -2px 10px rgba(0,0,0,0.04)
```

---

# CTA Buttons

Two actions appear on the right side.

### Secondary Action

Label:

```
Update & Reassign Task
```

Style:

```
variant: outline
size: default
```

Purpose:
Allows updating the observation or assigning it to another inspector.

---

### Primary Action

Label:

```
Verify & Close Issue
```

Style:

```
variant: default (primary)
size: default
```

Purpose:
Confirms inspection verification and closes the issue.

---

# Button Alignment

Right aligned layout:

```
[ Update & Reassign Task ]   [ Verify & Close Issue ]
```

Spacing between buttons:

```
12px
```

---

# Behavior

### Update & Reassign Task

Opens update dialog for:

* editing observation
* assigning task
* adding notes

---

### Verify & Close Issue

Finalizes the issue verification.

Possible confirmation modal:

```
Are you sure you want to verify and close this issue?
```

Actions:

```
Cancel | Confirm
```

---

# Responsive Behavior

On smaller screens:

Buttons stack:

```
Update & Reassign Task
Verify & Close Issue
```

---

# React Example

```
<div className="fixed bottom-0 left-[72px] right-0 h-[72px] bg-background border-t flex items-center justify-end px-6 gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">

  <Button variant="outline">
    Update & Reassign Task
  </Button>

  <Button>
    Verify & Close Issue
  </Button>

</div>
```

*(Replace `left-[72px]` with your sidebar width.)*

---

# UX Reasoning

This pattern is used because:

* inspectors must **review rack + observations simultaneously**
* decision actions must remain **accessible at all times**
* avoids scrolling back to perform actions

---

# Result

You will have a **professional inspection workflow layout**:

```
Rack Canvas
Observation Panel
Bottom Fixed CTA
```

which matches the **enterprise rack inspection tools UI pattern**.

---

If you'd like, I can also show a **much stronger CTA design (used in real rack inspection software)** that prevents inspectors from accidentally closing unresolved critical observations.
