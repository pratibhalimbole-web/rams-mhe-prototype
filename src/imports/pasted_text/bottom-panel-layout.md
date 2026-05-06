Great — the **layout is now correct** (canvas + right panel + full-width bottom dock). 👍
Now we only need to **structure the bottom panel content exactly like your second wireframe**.

Your sketch shows a **two-row bottom panel**, not the current mixed layout.

---

# 1. What Your Wireframe Actually Shows

From your drawing the bottom panel should be:

```
------------------------------------------------------------
| Set Rack Status   [Stable] [Conditional] [Not Stable]    |
|                                                          |
| ● 3 Critical Observations        [CTA]        [CTA]      |
------------------------------------------------------------
```

So the **correct hierarchy is**:

**Row 1**

* Status label
* Status buttons

**Row 2**

* Critical observation summary
* Issue action buttons

This is much clearer.

---

# 2. Correct Bottom Panel Layout

Final structure:

```
┌──────────────────────────────────────────────────────────┐
│ Set Final Rack Status                                    │
│ [ Stable ] [ Conditional ] [ Not Stable ]                │
│                                                          │
│ ● 3 Critical Observations                                │
│ Review observations before confirming rack stability     │
│                                            Update Task   |
│                                      Verify & Close Issue|
└──────────────────────────────────────────────────────────┘
```

Key rule:

**Decision first → Actions second**

---

# 3. Recommended Spacing

Use this spacing so it feels SaaS-grade:

```
padding: 16px 24px
row gap: 10px
button gap: 8px
panel height: ~110px
```

---

# 4. Correct Code Structure

Replace your bottom panel content with this pattern:

```tsx
<div className="flex flex-col gap-3 w-full">

  {/* ROW 1 — Rack Status */}
  <div className="flex items-center justify-between">
    
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-[var(--foreground)]">
        Set Final Rack Status
      </span>

      <div className="flex items-center gap-2">
        <button>Stable</button>
        <button>Conditional</button>
        <button>Not Stable</button>
      </div>
    </div>

  </div>


  {/* ROW 2 — Observations + Actions */}
  <div className="flex items-center justify-between">

    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[var(--destructive)]"/>
      <span className="text-sm font-medium">
        3 Critical Observations
      </span>

      <span className="text-xs text-[var(--muted-foreground)]">
        Review observations before setting rack status
      </span>
    </div>

    <div className="flex items-center gap-2">
      <button>Update & Reassign Task</button>
      <button>Verify & Close Issue</button>
    </div>

  </div>

</div>
```

---

# 5. Button Behavior (Important UX Rule)

Status buttons should behave like a **segmented control**:

Initial state

```
[ Stable ] [ Conditional ] [ Not Stable ]
```

Selected example

```
[ Stable ] [ Conditional ] [ Not Stable ]
                     ▲
```

Only one active at a time.

---

# 6. Critical UX Detail

You should **NOT preselect status**.

Change this:

```ts
const [rackStatus, setRackStatus] = useState("stable");
```

to

```
const [rackStatus, setRackStatus] = useState(null);
```

Otherwise the rack looks **already approved**.

---

# 7. Visual Alignment (Important)

Your bottom panel currently pushes actions too far right.

Better alignment:

```
Status row → left aligned
Observation row → left summary / right actions
```

This creates a clear reading flow.

---

# 8. Final Result

Your screen becomes:

```
Canvas
      + Observation Panel
      + Decision Dock
```

And the bottom panel becomes a **clear decision workflow** instead of random buttons.

---

# 9. One Small UX Improvement (Highly Recommended)

Add a subtle warning when critical observations exist:

```
● 3 Critical Observations Detected
```

This prevents inspectors from **accidentally marking rack stable**.

---

If you want, I can also show a **much cleaner bottom panel design used in industrial inspection software (Amazon warehouse style)** that will make this page look **10x more professional without adding any UI elements**.
