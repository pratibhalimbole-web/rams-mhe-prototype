# 📁 Import Path Reference Guide

## Figma Make Utilities Import Paths

### File Location:
`/src/utils/figma-make.ts`

---

## Import Paths by Component Location

### From `/src/app/App.tsx`:
```typescript
import { isFigmaMakeActive, isEventFromFigmaMake } from "../utils/figma-make";
```

**Path Breakdown:**
- `../` → goes up from `/src/app/` to `/src/`
- `utils/figma-make` → goes to `/src/utils/figma-make.ts`

---

### From `/src/app/components/layout/[Component].tsx`:
```typescript
import { createSafeClickHandler } from "../../../utils/figma-make";
```

**Path Breakdown:**
- `../` → goes up from `/src/app/components/layout/` to `/src/app/components/`
- `../` → goes up from `/src/app/components/` to `/src/app/`
- `../` → goes up from `/src/app/` to `/src/`
- `utils/figma-make` → goes to `/src/utils/figma-make.ts`

**Components:**
- `PrimarySidebar.tsx`
- `SecondarySidebar.tsx`
- `SidebarLayout.tsx`

---

### From `/src/app/components/dashboard/[Component].tsx`:
```typescript
import { createSafeClickHandler } from "../../../utils/figma-make";
```

**Path Breakdown:** Same as layout components (same depth)

**Components:**
- `IntegrityTestModule.tsx`
- `BillOfQuantity.tsx`
- `RulesAndAction.tsx`
- etc.

---

### From `/src/app/components/ui/[Component].tsx`:
```typescript
import { createSafeClickHandler } from "../../../utils/figma-make";
```

**Path Breakdown:** Same as layout components (same depth)

**Components:**
- `button.tsx`
- `dialog.tsx`
- etc.

---

## Quick Reference Table

| From Location | Import Path | Up Levels |
|---------------|-------------|-----------|
| `/src/app/App.tsx` | `../utils/figma-make` | 1 level |
| `/src/app/components/*/[file].tsx` | `../../utils/figma-make` | 2 levels |
| `/src/app/components/*/*/[file].tsx` | `../../../utils/figma-make` | 3 levels |

---

## Available Functions

### From `figma-make.ts`:

```typescript
// Detection Functions
export function isFigmaMakeActive(): boolean
export function isEventFromFigmaMake(e: Event): boolean

// Safe Handler Functions
export function createSafeClickHandler(handler: () => void): (e: React.MouseEvent) => void
export function safeFigmaMakeHandler<T extends Event>(handler: (e: T) => void, options?): (e: T) => void

// Navigation Functions
export function createSafeNavigator(navigate: (path: string) => void): (path: string) => void
```

---

## Example Usage by Component

### App.tsx
```typescript
import { isFigmaMakeActive, isEventFromFigmaMake } from "../utils/figma-make";

useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    if (isFigmaMakeActive()) {
      console.log('Figma Make is active');
      return;
    }
  };
  
  document.addEventListener('click', handleClick, true);
  return () => document.removeEventListener('click', handleClick, true);
}, []);
```

### PrimarySidebar.tsx
```typescript
import { createSafeClickHandler } from "../../../utils/figma-make";

<Button
  type="button"
  onClick={createSafeClickHandler(() => onDomainSelect(domain.id))}
>
  {domain.label}
</Button>
```

### IntegrityTestModule.tsx (hypothetical)
```typescript
import { createSafeClickHandler } from "../../../utils/figma-make";

<Button
  type="button"
  onClick={createSafeClickHandler(() => navigate('/path'))}
>
  Navigate
</Button>
```

---

## Common Mistakes

### ❌ Wrong: Too few levels
```typescript
// From /src/app/components/layout/PrimarySidebar.tsx
import { createSafeClickHandler } from "../../utils/figma-make";
// ❌ ERROR: This goes to /src/app/utils/figma-make (doesn't exist)
```

### ❌ Wrong: Too many levels
```typescript
// From /src/app/App.tsx
import { isFigmaMakeActive } from "../../utils/figma-make";
// ❌ ERROR: This goes to /utils/figma-make (outside /src)
```

### ✅ Correct: Right number of levels
```typescript
// From /src/app/components/layout/PrimarySidebar.tsx
import { createSafeClickHandler } from "../../../utils/figma-make";
// ✅ CORRECT: Goes to /src/utils/figma-make.ts
```

---

## Troubleshooting Import Errors

### Error: "Failed to resolve import"

**Check:**
1. Count the directory levels from your file to `/src/`
2. Use that many `../` to go up
3. Then add `utils/figma-make`

**Example:**
```
Your file: /src/app/components/layout/SidebarLayout.tsx
Target: /src/utils/figma-make.ts

Steps:
1. /src/app/components/layout/ → ../
2. /src/app/components/ → ../
3. /src/app/ → ../
4. /src/ → utils/figma-make

Result: ../../../utils/figma-make ✅
```

---

## File Structure Reference

```
/src/
├── app/
│   ├── App.tsx                    → ../utils/figma-make
│   └── components/
│       ├── layout/
│       │   ├── PrimarySidebar.tsx → ../../../utils/figma-make
│       │   ├── SecondarySidebar.tsx → ../../../utils/figma-make
│       │   └── SidebarLayout.tsx  → ../../../utils/figma-make
│       ├── dashboard/
│       │   └── [components].tsx   → ../../../utils/figma-make
│       └── ui/
│           └── [components].tsx   → ../../../utils/figma-make
└── utils/
    └── figma-make.ts              ← TARGET FILE
```

---

**Quick Rule**: 
- Count the slashes in your component path after `/src/app/`
- Use that many `../` plus one more
- Then add `utils/figma-make`

**Examples:**
- `/src/app/` (0 slashes after app) → `../` (1 level up)
- `/src/app/components/` (1 slash) → `../../` (2 levels up)
- `/src/app/components/layout/` (2 slashes) → `../../../` (3 levels up)

---

**Version**: 1.0.7  
**Last Updated**: 2026-02-11
