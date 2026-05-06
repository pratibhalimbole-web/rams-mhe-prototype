Yes — you **can and should reduce some fields**. Your current form is a bit **over-specified for a UI decision form**, which is why it feels redundant. In most **SaaS safety/inspection tools**, Conditional status typically requires **2–3 fields max**, not 5.

Below is the **cleanest and most practical reduction** while still meeting compliance and documentation needs.

---

# Recommended Reduced Conditional Form

Keep **only 3 fields**.

### 1️⃣ Condition Description *(Required)*

Purpose: Explain why the rack is conditional and under what restriction it can operate.

Example placeholder:

> “Rack can operate at reduced load until damaged beam is replaced.”

---

### 2️⃣ Allowed Load Limit *(Optional)*

Purpose: Operational restriction.

Example:

```
70%
```

You can also allow:

```
70% of rated capacity
```

---

### 3️⃣ Reinspection Date *(Optional)*

Purpose: When rack should be evaluated again.

Example:

```
dd/mm/yyyy
```

---

# Remove These Fields

### ❌ Required Repairs

Reason:
This belongs to **maintenance workflow or work orders**, not stability evaluation.

Repairs should live in:

```
Maintenance
TPI Findings
Task management
```

---

### ❌ Additional Notes

Reason:
Notes can be written in **Condition Description** already.

---

# Final Simplified Form

```
Conditional Stability Requirements

Condition Description *
[ textarea ]

Allowed Load Limit
[ 70% ]

Reinspection Date
[ date picker ]
```

That's it.

---

# Why This Is Better

| Before             | After                  |
| ------------------ | ---------------------- |
| 5 fields           | 3 fields               |
| Looks bureaucratic | Looks decision-focused |
| Redundant info     | Clear intent           |
| Slow to fill       | Quick                  |

---

# UX Rule

Conditional status should feel like:

```
Explain restriction
Define limit
Set follow-up
```

Not like filling a **maintenance report**.

---

# Bonus UX Improvement (Highly Recommended)

Add quick templates under description:

```
Common Conditions
• Operate at reduced load
• Replace damaged beam
• Reinspect after repair
```

This makes form **very fast to fill**.

---

# Final Recommendation

Your **Conditional form should be only:**

```
Condition Description *
Allowed Load Limit
Reinspection Date
```

This keeps the Stability module **clean, fast, and professional**.
