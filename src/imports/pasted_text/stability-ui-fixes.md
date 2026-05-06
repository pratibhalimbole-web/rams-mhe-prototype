You’re right — in the earlier discussion the **Stability detail page had 3 CTAs**, not 2. The current screen only shows two and they are also **wrong actions** for this module. Also the **observation list pushing down the layout** needs to be corrected with proper height control.

I'll break the solution into **two parts: CTA correction and observation panel layout fix**.

---

# 1. Correct CTA Panel (3 Buttons)

From the previous workflow decision for **Rack Stability module**, the final actions were:

### Final CTA set

```
Update Observation
Create Action / Task
Verify Rack Stability
```

### Button hierarchy

Left → Right:

```
[ Update Observation ]   [ Create Action ]   [ Verify Stability ]
```

### Purpose

**Update Observation**

* edit observation details
* change severity
* add notes/photos

**Create Action**

* send issue to maintenance / CTA module
* create follow-up task

**Verify Stability** (Primary)

* finalize rack inspection
* update rack status
* close inspection cycle

---

# 2. Correct CTA Layout

The CTA bar should stay **fixed to bottom** but aligned with content.

Structure:

```
------------------------------------------------------------
| Rack Canvas                                              |
|                                                          |
| Observation Panel (floating)                             |
------------------------------------------------------------
| Update Observation | Create Action | Verify Stability    |
------------------------------------------------------------
```

### Container style

```
position: fixed
bottom: 0
left: sidebarWidth
right: 0
height: 72px
border-top: 1px solid var(--border)
background: var(--background)
display: flex
align-items: center
justify-content: flex-end
gap: 12px
padding: 0 24px
```

---

# 3. Observation Panel Problem (List Expanding Down)

Right now the observation list is **growing downward** because its height is not restricted.

You must **lock the panel height** and allow **internal scrolling**.

### Correct panel structure

```
Observation Panel
 ├─ Header
 ├─ Observation List (scrollable)
 └─ Footer (View All)
```

### CSS solution

Panel container:

```
position: absolute
right: 32px
top: 96px
width: 360px
height: calc(100vh - 220px)
display: flex
flex-direction: column
```

Observation list:

```
flex: 1
overflow-y: auto
padding-right: 4px
```

Footer:

```
flex-shrink: 0
border-top: 1px solid var(--border)
padding: 12px
```

This ensures:

* header stays fixed
* list scrolls internally
* footer always visible
* panel never grows downward

---

# 4. Prevent CTA Overlap

Since CTA is fixed bottom, the canvas must have bottom padding:

```
padding-bottom: 80px
```

Otherwise rack or list will hide under CTA.

---

# 5. Final Correct Layout

```
Header / Breadcrumb
--------------------------------------------------

Rack Canvas (dotted grid)

             Rack

                         Observation Panel
                         ├ Header
                         ├ Scrollable Observations
                         └ Footer

--------------------------------------------------
Fixed CTA Bar
Update Observation | Create Action | Verify Stability
```

---

# 6. Small UX Improvement (Recommended)

Add **status indicator near CTA**:

Example:

```
3 critical observations pending
```

So inspectors know whether verification is allowed.

---

# Result

After these fixes:

✔ 3 correct CTAs
✔ observation panel scrolls internally
✔ layout no longer pushes downward
✔ CTA never overlaps content

---

If you want, I can also show you **one small layout improvement used in Amazon warehouse inspection dashboards** that will make this screen look **10× more professional without adding complexity**.
