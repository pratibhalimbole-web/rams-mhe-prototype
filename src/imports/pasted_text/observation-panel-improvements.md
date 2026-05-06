From your screenshot and requirement, you want **three improvements in the Observation Panel**:

1. **More observation cards visible**
2. **Panel aligned correctly to the top**
3. **Internal vertical scroll only inside the list**

Below is the **correct layout structure + code changes**.

---

# 1. Panel Must Stretch Vertically

Right now the panel height is probably **auto**, so only a few cards appear.

Make the panel use **viewport height**.

```css
height: calc(100vh - 120px);
```

This keeps it aligned with header spacing.

---

# 2. Correct Panel Layout Structure

The panel must have **3 sections**:

```
Panel
 ├── Header (fixed)
 ├── Scroll Area (scrollable)
 └── Footer (fixed)
```

Only the **middle section scrolls**.

---

# 3. Correct React Layout

```tsx
<div className="absolute right-8 top-24 w-[360px]">

  <div className="bg-card rounded-xl shadow-lg border flex flex-col h-[calc(100vh-120px)]">

    {/* Header */}
    <div className="p-4 border-b">
      <h3 className="font-semibold">CN-L1 — Rack 05</h3>
      <p className="text-sm text-muted-foreground">3D Rack View</p>
    </div>

    {/* Scrollable Observations */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      <ObservationCard />
      <ObservationCard />
      <ObservationCard />
      <ObservationCard />
      <ObservationCard />
      <ObservationCard />

    </div>

    {/* Footer */}
    <div className="p-4 border-t flex justify-between items-center">
      <span className="text-sm text-muted-foreground">
        Showing 3 of 12 alerts
      </span>

      <Button size="sm">View All</Button>
    </div>

  </div>

</div>
```

---

# 4. Why This Fix Works

| Section     | Behavior           |
| ----------- | ------------------ |
| Header      | Always visible     |
| Scroll area | Scrolls internally |
| Footer      | Always visible     |

The page **never scrolls**, only the observation list scrolls.

---

# 5. Extra UX Improvement (Recommended)

Limit max visible cards to ~8 before scroll.

```
max-height: calc(100vh - 120px)
```

This prevents the panel from touching the bottom of the screen.

---

# 6. Optional: Smooth Scrollbar

```css
overflow-y: auto;
scrollbar-width: thin;
```

For Tailwind:

```tsx
className="flex-1 overflow-y-auto space-y-3 pr-2"
```

---

# Final Result

✔ Panel aligns with top
✔ Shows many observations
✔ Scroll happens inside panel
✔ Footer always visible

Exactly like **modern inspection dashboards**.

---

If you want, I can also show you **how to highlight rack components when hovering observation cards** — that will make this screen **10× more interactive**.
