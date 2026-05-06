You identified **two real layout bugs**, and both are common when mixing **fixed panels + canvas + sidebar**.
Here is the **correct structural fix** so the UI behaves properly.

---

# 1️⃣ Bottom CTA Panel Overlapping Sidebar

### Problem

The bottom CTA bar is **full width**, so it runs under the sidebar.

Current (wrong):

```
position: fixed
left: 0
right: 0
```

Result:

```
| Sidebar | Canvas + CTA underneath sidebar ❌
```

---

### Correct Fix

The CTA must start **after the sidebar width**.

Assuming sidebar width:

```
sidebar = 240px
```

### Correct CSS

```css
.bottom-cta {
  position: fixed;
  bottom: 0;
  left: 240px;        /* start after sidebar */
  right: 0;
  height: 72px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 24px;

  border-top: 1px solid var(--border);
  background: var(--background);
}
```

Result:

```
| Sidebar | Bottom CTA aligned with canvas ✅
```

---

# 2️⃣ Right Observation Panel Going Under CTA

### Problem

The observation panel height is uncontrolled so it **extends below CTA**.

Current:

```
height: auto
```

Result:

```
Panel overlaps CTA ❌
```

---

### Correct Behavior

The panel should:

* start **24px below canvas top**
* stop **24px above CTA**
* scroll internally

---

### Correct Layout Logic

```
Top margin from canvas: 24px
Bottom margin from CTA: 24px
```

---

### Correct CSS

```css
.observation-panel {

  position: absolute;

  right: 32px;

  top: 24px;

  height: calc(100vh - 72px - 48px - 24px);

  width: 360px;

  display: flex;
  flex-direction: column;

}
```

Explanation:

```
100vh
- CTA height (72)
- panel bottom gap (24)
- panel top gap (24)
```

---

### Observation List Scroll

Inside panel:

```css
.observation-list {
  flex: 1;
  overflow-y: auto;
}
```

So:

```
Header
Scrollable observations
Footer
```

---

# 3️⃣ Canvas Needs Bottom Padding

Otherwise rack elements hide behind CTA.

Add:

```css
.canvas-container {
  padding-bottom: 96px;
}
```

---

# 4️⃣ Correct Final Layout

```
-------------------------------------------
Header / Breadcrumb
-------------------------------------------

Canvas

         Rack

                       Observation Panel
                       ├ Header
                       ├ Scrollable list
                       └ Footer

-------------------------------------------
Bottom CTA (inside canvas width)
-------------------------------------------
```

---

# 5️⃣ Visual Spacing (Important)

Spacing rules you requested:

```
Top gap panel → 24px
Bottom gap panel → 24px
Right gap panel → 32px
```

This keeps the UI **clean and breathable**.

---

# 6️⃣ Result

After these fixes:

✔ CTA does not overlap sidebar
✔ Observation panel never goes under CTA
✔ Internal scroll works properly
✔ Canvas remains clean

---

If you'd like, I can also show a **clean layout structure (React + Tailwind)** that avoids these issues permanently and makes the page **much easier to maintain as you add the 3D rack viewer later.**
