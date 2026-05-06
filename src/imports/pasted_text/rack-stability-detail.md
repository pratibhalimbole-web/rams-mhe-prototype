Below is a **complete, structured prompt** you can give to your **UI/Frontend developer or AI coding tool (Claude/Cursor)** to implement the **Rack Stability Detail Page exactly as discussed**, including:

* 3D rack canvas
* floating right contextual panel
* icon toolbar
* bottom decision panel
* conditional status form
* proper spacing
* correct interaction logic

This prompt focuses **only on the Detail Page**.

---

# Detailed Implementation Prompt

### Page: Rack Stability Detail

### Module: TPI → IRDS → Stability

---

# 1. Objective

Create a **Rack Stability Detail Page** where inspectors can:

* View rack in **3D visualization**
* Review **inspection observations**
* View **rack insights**
* Check **rack metadata**
* Assign or update **stability status**

The page must maintain a **clean engineering inspection layout** with the **canvas as the primary workspace**.

---

# 2. Page Layout Structure

The page layout must be divided into **three main regions**:

```
---------------------------------------------------------
Header
---------------------------------------------------------
Main Workspace
   Left → 3D Rack Canvas
   Right → Floating Context Panel (dynamic)
   Right Edge → Vertical Icon Toolbar
---------------------------------------------------------
Bottom Decision Panel
---------------------------------------------------------
```

---

# 3. Header Section

Display rack identification and navigation.

Layout:

```
Stability — Rack CN-L1
Rack > IRDS > Stability > Rack CN-L1
```

Show:

* Rack ID
* Breadcrumb navigation

Optional metadata row:

```
Rack ID
Location
Rack Type
Height
Load Capacity
Last Inspection Date
```

---

# 4. Main Workspace

The workspace contains the **3D rack canvas** and contextual inspection tools.

Container:

```
position: relative
height: 100%
overflow: hidden
```

---

# 5. Rack Canvas

The canvas is the **primary inspection workspace**.

Features:

* 3D rack visualization
* issue markers
* structural zones
* stability overlay

Capabilities:

```
zoom
pan
rotate
hover highlight
click markers
```

Issue markers must display:

```
Red → critical
Amber → warning
Green → safe
```

Markers should be clickable.

Clicking a marker should scroll to the related observation.

---

# 6. Stability Overlay

The rack visualization must show stability status using a subtle overlay.

Example:

```
Stable → green overlay
Conditional → amber overlay
Not Stable → red overlay
```

Overlay opacity should be low (5–10%) to avoid hiding rack structure.

---

# 7. Right Edge Icon Toolbar

A vertical toolbar must appear on the **right edge of the canvas**.

Layout:

```
| Insights Icon |
| Rack Info Icon |
| Observations Icon |
```

Icons must be vertically stacked.

Recommended icons (Lucide):

```
BarChart3 → Stability Insights
Info → Rack Information
AlertTriangle → Observations
```

Behavior:

```
Click icon → open floating panel
Click same icon again → close panel
Click another icon → switch panel
```

Default state:

```
Observations panel open
```

---

# 8. Floating Context Panel

When an icon is clicked, a **floating panel opens inside the canvas**.

Panel must not occupy full height.

Spacing requirement:

```
top: 24px
bottom: 24px
```

Panel width:

```
360px
```

Panel position:

```
position: absolute
right: 72px
top: 24px
bottom: 24px
```

Panel style:

```
background: white
border-radius: 12px
shadow
overflow hidden
```

Panel layout:

```
Panel Header
Scrollable Content
Panel Footer (optional)
```

---

# 9. Panel Types

The floating panel supports **three content modes**.

---

# 9.1 Observations Panel

Default panel.

Display all inspection findings related to the rack.

Layout:

```
Observation Card
------------------------
Issue ID
Severity badge
Component affected
Location
Description
Inspector
Timestamp
```

Severity badges:

```
Critical → red
Warning → amber
Minor → green
```

Cards must be clickable.

When clicked:

```
highlight related marker on rack
```

Scrollable content required.

---

# 9.2 Stability Insights Panel

Provide aggregated insights to support stability decisions.

Layout:

```
Critical Issues       3
Impact Events         5
Structural Damage     2
Anchor Issues         1
Beam Deflection       2
```

Display using **stat widgets or compact cards**.

Example widget:

```
Critical Issues
3
```

Insights must come from aggregated inspection data.

---

# 9.3 Rack Information Panel

Display rack metadata.

Fields:

```
Rack ID
Warehouse
Aisle
Bay
Rack Type
Height
Load Capacity
Installation Date
Last Inspection Date
```

Display in key-value format.

Example:

```
Rack ID            CN-L1
Location           Aisle 3 Bay 5
Rack Type          Selective
Height             9m
Capacity           1200kg
```

---

# 10. Panel Interaction

Panel behavior:

```
Panel opens when icon clicked
Panel content switches when another icon selected
Panel closes if icon clicked again
```

Panel must have internal scroll.

---

# 11. Bottom Decision Panel

The bottom panel is used to assign rack stability status.

It must span **the entire canvas width**.

Structure:

```
-------------------------------------------------------
Issue Summary

3 Critical Observations
Review observations before setting rack status

-------------------------------------------------------

Set Final Rack Status

[ Stable ] [ Conditional ] [ Not Stable ]

-------------------------------------------------------

Action Buttons

Cancel
Save Rack Status / Update Rack Status
```

---

# 12. Status Logic

Case 1 — Rack not evaluated

```
status = null
```

Button label:

```
Save Rack Status
```

---

Case 2 — Rack already evaluated

Display current status:

```
Current Rack Status: Conditional
```

Buttons preselect current status.

Button label becomes:

```
Update Rack Status
```

---

# 13. Conditional Status Form

If user selects **Conditional**, expand additional inputs.

Fields:

```
Condition Description
Allowed Load Limit
Required Repairs
Reinspection Date
Notes
```

Form appears above the Save button.

Example layout:

```
Conditional Details

Condition Description
[text area]

Allowed Load Limit
[number input]

Reinspection Date
[date picker]

Notes
[text area]
```

---

# 14. Confirmation Modal

When saving status:

Show confirmation dialog.

Example:

```
Confirm Stability Status

You are marking this rack as NOT STABLE.

This indicates the rack is unsafe for operation.

Cancel | Confirm
```

---

# 15. Toast Notification

After saving:

```
✔ Rack status updated
```

---

# 16. Responsive Behavior

Panel and canvas must support:

```
tablet inspection devices
touch gestures
```

Floating panel must adapt height but maintain:

```
24px top and bottom spacing
```

---

# 17. Performance

3D rack viewer must support:

```
smooth rendering
large rack models
multiple markers
```

Observation panel must support **large datasets (100+ findings)**.

---

# 18. Accessibility

Include:

```
color + icon indicators
tooltips for severity
keyboard navigation for panel switching
```

---

# 19. Future Scalability

The right contextual panel system must allow additional panels in future:

Example:

```
Sensor Data
Repair History
Load Simulation
```

---

# Final Result

The final page should behave like a **professional inspection workspace**:

```
3D Rack Canvas
+
Contextual Right Panels
+
Status Decision Panel
```

with the canvas remaining the **primary inspection area**.

---

If you want, I can also give you a **Figma wireframe structure for this page (very useful for the design team)** so they can build it correctly in one pass.
