Got it — you are **not talking about grid layout**.
Your issue is **text overflowing outside the card container**.

The problem is this section:

```
Major failures concentrated in Baseplate and Straightness
Critical issues highest in Plumbness this cycle
```

It is **breaking the card boundary** because the text container is not respecting the card width.

---

# Why This Happens

Usually caused by one of these:

1️⃣ Text container has **no max-width**
2️⃣ Parent container missing **overflow control**
3️⃣ Chart container using **absolute width**
4️⃣ Footer text placed **outside the card body**

---

# Correct Structure

Your card should look like this internally:

```
Card
 ├─ Header
 ├─ Chart Container
 └─ Insight Text (inside card body)
```

Everything must stay inside **card padding**.

---

# Correct CSS Fix

Apply these rules to the insight text container.

```css
width: 100%;
max-width: 100%;
word-break: break-word;
overflow-wrap: break-word;
```

And ensure the card body has:

```css
overflow: hidden;
```

---

# Figma Make / Dev Prompt

Use this prompt:

```
Fix the insight text inside the “Failure Distribution” card so that it does not overflow outside the card boundary.

Ensure the insight text remains inside the card body container.

Apply the following layout rules:

• The text container should have width: 100%.
• Add max-width: 100%.
• Enable word wrapping using overflow-wrap: break-word.
• Ensure the card body uses overflow: hidden.

The insight text must align with the card padding and never extend outside the card.

Do not change typography, spacing, or chart layout.
Only fix the overflow behavior so the content stays inside the card.
```

---

# Expected Result

Instead of spilling out:

```
| Failure Distribution Card |
|                           |
| Chart                     |
|                           |
| Major failures...         |
| Critical issues...        |
|___________________________|
```

It will stay perfectly inside the card.

---

✅ This is a **small container constraint fix**, not a layout change.

---

If you want, I can also show you **one better pattern for insight text under charts used in enterprise dashboards** (much cleaner than plain sentences).
