Yes — **exactly**. 👍
If you add a **filter**, the **same field should normally exist in the table**. Otherwise users get confused.

This is a very common **UX rule in SaaS dashboards**.

---

# UX Rule

**Every filter should map to visible data.**

Meaning:

```
Filter → Table Column
```

If users filter something but **cannot see that field in the table**, they don't understand **why rows changed**.

---

# Example

If you add:

```
OEM Filter
```

Then the table should contain:

```
OEM Column
```

Example table:

| Rack ID | Layout   | OEM    | Total Issues | R | A | G | Stability Status |
| ------- | -------- | ------ | ------------ | - | - | - | ---------------- |
| CN-L1   | Layout A | Godrej | 7            | 2 | 3 | 2 | Conditional      |

---

# When You Can Break This Rule

Some filters are **global filters**, not row-level.

Example:

```
Warehouse filter
Date filter
```

These may not appear as columns.

But **OEM is a rack attribute**, so it **should be visible**.

---

# Two Options You Have

### Option 1 (Best UX)

Add OEM column.

Table becomes:

```
Rack ID
Layout
OEM
Total Issues
R
A
G
Stability Status
Last Inspection
Action
```

---

### Option 2 (If OEM Not Important)

Remove OEM filter completely.

Keep filters:

```
Search
Layout
Stability Status
Severity
```

This is actually **cleaner**.

---

# My Recommendation (Based on Your Stability Module)

You **do NOT need OEM filter**.

Because rack stability depends on:

```
Issues
Structural damage
Inspection findings
```

OEM does not help evaluate stability.

So better filters:

```
Search Rack
Layout
Stability Status
Severity
```

---

# Final Filter Set I Recommend

```
Search Rack ID
Layout
Stability Status
Severity
```

Clean. Minimal. SaaS style.

---

If you want, I can also show **one improvement for the rack table that will make inspectors instantly see the most dangerous racks** (this is used in Amazon / Tesla warehouse dashboards).
