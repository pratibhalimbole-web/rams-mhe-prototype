You are thinking in the **right direction now** 👍 — in SaaS decision flows the **system should not pre-suggest a final status** with strong colors. If one button is already filled, the UI subconsciously tells the user **“this is the expected choice”**, which is wrong for an inspection decision.

So the correct pattern is:

**Neutral → User decides → Color appears after selection**

This is how **enterprise inspection systems, compliance tools, and audit dashboards** handle decisions.

---

# Correct UX Pattern for Your Case

### Initial State (Neutral)

All options should be **outline / neutral**.

```
● 3 Critical Observations
Review observations before setting rack status

Final Rack Status

[ Stable ]   [ Conditional ]   [ Not Stable ]
```

No filled colors initially.

---

# Visual Styling (Initial)

Buttons should look like **selectable states**, not alerts.

**Stable**

```
outline
border: neutral
text: default
```

**Conditional**

```
outline
border: neutral
text: default
```

**Not Stable**

```
outline
border: neutral
text: default
```

Example Tailwind style idea:

```
variant="outline"
```

---

# After User Selects

When the user clicks one option, **then the color appears**.

Example if user chooses **Not Stable**:

```
[ Stable ]   [ Conditional ]   [ Not Stable ]
 outline       outline           filled red
```

Example if user chooses **Conditional**:

```
[ Stable ]   [ Conditional ]   [ Not Stable ]
 outline        filled amber      outline
```

Example if user chooses **Stable**:

```
[ Stable ]   [ Conditional ]   [ Not Stable ]
 filled green     outline         outline
```

Now the UI clearly reflects the **decision state**.

---

# Why This Feels Better

Because the interface becomes a **decision control**, not a warning system.

User mentally reads it as:

```
"Choose the final rack status"
```

instead of

```
"System is warning me"
```

---

# Small Label Improvement

Your label:

```
Final Rack Status
```

is correct, but you can make it slightly clearer:

```
Set Final Rack Status
```

or

```
Select Rack Stability Status
```

Both work well in SaaS.

---

# Final Clean Layout

```
● 3 Critical Observations
Review observations before setting rack status

Set Final Rack Status

[ Stable ]   [ Conditional ]   [ Not Stable ]
```

---

# One More Small UX Improvement (Highly Recommended)

Make the buttons behave like **segmented controls**, not independent buttons.

Example:

```
( Stable )  ( Conditional )  ( Not Stable )
```

with equal width.

This visually communicates:

> “Choose one option”.

---

If you'd like, I can also show you a **very small visual tweak used in industrial inspection SaaS** that will make this decision bar look **much more premium and intuitive instantly**.
