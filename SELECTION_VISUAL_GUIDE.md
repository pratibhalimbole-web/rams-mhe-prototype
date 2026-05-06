# Selection Visual Guide

## Single Selection Principle

**Only one element highlighted at a time with blue border.**

---

## Scenario 1: Text Block Selected

```
┌───────────────────────────────────────────────────────────┐
│ Section Header                           [border: grey]   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────┐  [border: grey] │
│  │ Module Header                       │                 │
│  ├─────────────────────────────────────┤                 │
│  │                                     │                 │
│  │  [Chart Preview Display]            │                 │
│  │                                     │                 │
│  ├─────────────────────────────────────┤                 │
│  │                                     │                 │
│  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │ [border: BLUE]  │
│  │  ┃ Notes                       ┃  │                 │
│  │  ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫  │  ← SELECTED    │
│  │  ┃                             ┃  │                 │
│  │  ┃  This is my content text... ┃  │                 │
│  │  ┃                             ┃  │                 │
│  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │                 │
│  │                                     │                 │
│  └─────────────────────────────────────┘                 │
│                                                           │
└───────────────────────────────────────────────────────────┘

Result:
✅ Text Block: Blue border + ring
❌ Module: Grey border (not highlighted)
❌ Section: Grey border (not highlighted)
```

---

## Scenario 2: Module Selected

```
┌───────────────────────────────────────────────────────────┐
│ Section Header                           [border: grey]   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  [border: BLUE]   │
│  ┃ Module Header                   ┃                     │
│  ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫  ← SELECTED       │
│  ┃                                 ┃                     │
│  ┃  [Chart Preview Display]        ┃                     │
│  ┃                                 ┃                     │
│  ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫                     │
│  ┃                                 ┃                     │
│  ┃  ┌───────────────────────────┐  ┃  [border: grey]    │
│  ┃  │ Notes                     │  ┃                     │
│  ┃  ├───────────────────────────┤  ┃                     │
│  ┃  │                           │  ┃                     │
│  ┃  │  This is my content...    │  ┃                     │
│  ┃  │                           │  ┃                     │
│  ┃  └───────────────────────────┘  ┃                     │
│  ┃                                 ┃                     │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛                     │
│                                                           │
└───────────────────────────────────────────────────────────┘

Result:
✅ Module: Blue border + ring + shadow
❌ Text Block: Grey border (not highlighted)
❌ Section: Grey border (not highlighted)
```

---

## Scenario 3: Section Selected

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Section Header                           [border: BLUE]  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                          ┃  ← SELECTED
┃  ┌─────────────────────────────────────┐  [border: grey]┃
┃  │ Module Header                       │                ┃
┃  ├─────────────────────────────────────┤                ┃
┃  │                                     │                ┃
┃  │  [Chart Preview Display]            │                ┃
┃  │                                     │                ┃
┃  ├─────────────────────────────────────┤                ┃
┃  │                                     │                ┃
┃  │  ┌───────────────────────────────┐  │                ┃
┃  │  │ Notes                         │  │ [border: grey] ┃
┃  │  ├───────────────────────────────┤  │                ┃
┃  │  │                               │  │                ┃
┃  │  │  This is my content text...   │  │                ┃
┃  │  │                               │  │                ┃
┃  │  └───────────────────────────────┘  │                ┃
┃  │                                     │                ┃
┃  └─────────────────────────────────────┘                ┃
┃                                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Result:
✅ Section: Blue border + ring
❌ Module: Grey border (not highlighted)
❌ Text Block: Grey border (not highlighted)
```

---

## Scenario 4: Nothing Selected

```
┌───────────────────────────────────────────────────────────┐
│ Section Header                           [border: grey]   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────┐  [border: grey] │
│  │ Module Header                       │                 │
│  ├─────────────────────────────────────┤                 │
│  │                                     │                 │
│  │  [Chart Preview Display]            │                 │
│  │                                     │                 │
│  ├─────────────────────────────────────┤                 │
│  │                                     │                 │
│  │  ┌───────────────────────────────┐  │  [border: grey] │
│  │  │ Notes                         │  │                 │
│  │  ├───────────────────────────────┤  │                 │
│  │  │                               │  │                 │
│  │  │  This is my content text...   │  │                 │
│  │  │                               │  │                 │
│  │  └───────────────────────────────┘  │                 │
│  │                                     │                 │
│  └─────────────────────────────────────┘                 │
│                                                           │
└───────────────────────────────────────────────────────────┘

Result:
❌ All elements: Grey borders
❌ Right panel: Closed
```

---

## Color Reference

### Border Colors (CSS Variables)

```css
/* Default - Not Selected */
border-color: var(--border);
/* Light grey, neutral */

/* Selected - Active Element */
border-color: var(--primary);
/* Blue, prominent */

/* Error State */
border-color: var(--destructive);
/* Red, for validation errors */
```

### Selection Enhancements

**Ring (Selected Only):**
```css
ring: 1px solid rgba(var(--primary), 0.2);
```

**Shadow (Module Only):**
```css
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

**Ring Offset (Text Block Only):**
```css
ring-offset: 2px;
```

---

## Hover States

All elements show hover feedback even when not selected:

```
Default:    border: var(--border)
Hover:      border: rgba(var(--primary), 0.3)  ← Light blue hint
Selected:   border: var(--primary)             ← Full blue
```

---

## Selection Flow Diagram

```
User Action                 State Change                Visual Result
───────────────────────────────────────────────────────────────────────

Click Section      →        selectedSectionId = 'X'    Section: BLUE
                           selectedModuleId = null     Module:  grey
                           selectedBlockId = null      Block:   grey

Click Module       →        selectedSectionId = null   Section: grey
                           selectedModuleId = 'Y'      Module:  BLUE
                           selectedBlockId = null      Block:   grey

Click Text Block   →        selectedSectionId = null   Section: grey
                           selectedModuleId = 'Y'      Module:  grey
                           selectedBlockId = 'Z'       Block:   BLUE

Click Canvas       →        selectedSectionId = null   Section: grey
                           selectedModuleId = null     Module:  grey
                           selectedBlockId = null      Block:   grey
```

---

## Implementation Logic

### Section Border Logic
```typescript
borderColor = 
  hasErrors ? 'var(--destructive)' :
  (selectedSectionId === section.id 
    && !selectedModuleId 
    && !selectedContentBlockId) 
      ? 'var(--primary)' 
      : 'var(--border)'
```

### Module Border Logic
```typescript
borderColor = 
  (selectedModuleId === mod.instanceId 
    && !selectedContentBlockId)
      ? 'var(--primary)' 
      : 'var(--border)'
```

### Text Block Border Logic
```typescript
borderColor = 
  selectedContentBlockId === block.id
    ? 'var(--primary)' 
    : 'var(--border)'
```

---

## Key Principle

**Only the actively selected element receives the blue border.**

Parents do NOT inherit selection styling from their children.

```
❌ WRONG:
Text Block selected → Module blue → Section blue
(Multiple blue borders = confusing)

✅ CORRECT:
Text Block selected → Text Block blue → Module grey → Section grey
(Single blue border = clear)
```

---

*Visual Legend:*
- `┌─┐` = Grey border (default/unselected)
- `┏━┓` = Blue border (selected)
- `✅` = This element is highlighted
- `❌` = This element is NOT highlighted

*Last Updated: 2024-03-05*
