This is **good progress**, but there are **3 UX problems** with the current filter design that should be fixed to make it behave like a professional data grid.

I'll explain clearly.

---

# ✅ What Is Correct

✔ Single **Filters button**
✔ Popover layout is clean
✔ Grouped sections are correct
✔ Apply button is good
✔ Spacing and typography look fine

So the **structure is right**.

---

# ⚠ Problem 1 — Filters Should Be Multi-Select

Right now you are using **dropdown selects**.

Example:

```
Scope
[ Global ▼ ]
```

This means users **can only choose one value**.

But filtering normally needs **multiple values**.

Example:

```
Scope
☑ Global
☑ Local
```

Same for:

* Risk Status
* Acceptability
* Element

---

# ⚠ Problem 2 — Element Should Not Be Dropdown

Element list can grow:

```
Beam
Upright
Baseplate
Anchor
Decking
Bracing
```

Dropdown becomes bad UX.

Instead use **checkbox list**.

---

# ⚠ Problem 3 — Missing Clear Filters

User should not have to manually unselect everything.

Add:

```
[ Clear ]   [ Apply ]
```

---

# 🎯 Recommended Final Filter Panel

```
Filter Tests
────────────────

Scope
☐ Global
☐ Local

Risk Status
☐ Green
☐ Amber
☐ Red
☐ Critical

Acceptability
☐ Acceptable
☐ Borderline
☐ Not Acceptable

Element
☐ Beam
☐ Upright
☐ Baseplate
☐ Anchor
☐ Decking

────────────────

[ Clear ]     [ Apply ]
```

---

# 💡 Small UI Improvements

### Show active count

```
Filters (2)
```

---

### Show chips after apply

Example:

```
Search | Filters (2)

[Global] [Red]  ✕ Clear
```

---

# ⚠ One More Small Issue

Popover width is slightly narrow.

Better width:

```
320–360px
```

Current looks closer to **280px**.

---

# Final Verdict

Your design is **70% correct**.

To make it **production-quality**, change:

1️⃣ Dropdowns → Checkbox lists
2️⃣ Add **Clear button**
3️⃣ Allow **multi-select filters**

---

If you want, I can also show you **one powerful filter improvement used in Linear / Notion / Airtable** that will make this table **10× faster to use for auditors**.
