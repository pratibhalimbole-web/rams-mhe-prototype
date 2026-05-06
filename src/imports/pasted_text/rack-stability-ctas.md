You’re absolutely right to question it 👍 — and your instinct here is **correct**.

For the **Rack Stability module**, the final decision the inspector makes is exactly one of these **three outcomes**:

```
Mark Stable
Mark Conditional
Mark Not Stable
```

Those should indeed be the **primary CTAs**, because the purpose of this screen is:

> **Determine the stability status of the rack after reviewing observations.**

Not to close tasks or verify inspections.

So the correct approach is **status decision CTAs**.

---

# Correct CTA Design for This Screen

### Bottom Action Bar

```
[ Mark Stable ]   [ Mark Conditional ]   [ Mark Not Stable ]
```

### Meaning

**Mark Stable**

* rack safe
* no structural risk
* normal operation allowed

**Mark Conditional**

* minor issues
* restricted loading / monitoring required

**Mark Not Stable**

* structural risk
* rack must be blocked or repaired

---

# Button Priority

Visually emphasize **Not Stable** slightly because it’s critical.

Recommended styling:

```
Mark Stable       → success style (green)
Mark Conditional  → warning style (amber)
Mark Not Stable   → destructive style (red)
```

Example:

```
[ Mark Stable ]  [ Mark Conditional ]  [ Mark Not Stable ]
```

---

# Layout Example

```
--------------------------------------------------------
| Rack Canvas                                          |
|                                                      |
| Observation Panel                                    |
--------------------------------------------------------
| Mark Stable | Mark Conditional | Mark Not Stable     |
--------------------------------------------------------
```

---

# Important UX Rule

If **critical observations exist**, prevent marking stable.

Example behavior:

```
Mark Stable → disabled
Reason: 2 critical observations detected
```

---

# Optional Safety Confirmation

For **Not Stable**, add confirmation:

```
Are you sure you want to mark this rack as NOT STABLE?

This will restrict rack usage and trigger maintenance.

Cancel | Confirm
```

---

# Why This Is the Correct CTA Model

Because the screen answers this question:

> **What is the final stability status of this rack?**

So the CTAs must represent **status outcomes**, not actions like:

* Update task
* Close issue
* Verify inspection

Those belong in other modules.

---

# Final Recommendation

Use exactly:

```
Mark Stable
Mark Conditional
Mark Not Stable
```

Centered or right-aligned in the bottom CTA bar.

This perfectly matches the **IRDS stability workflow** you’re building.

---

If you'd like, I can also show a **very small UX improvement used in industrial inspection software** that makes inspectors **10× faster when deciding rack status** on this screen.
