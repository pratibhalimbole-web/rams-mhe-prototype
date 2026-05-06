# Modal State Persistence Fix - URL-Based Approach

## Problem Statement

When using Figma Make's "Point and Edit" tool with open modals, the modals would automatically close because:

1. Modal state was managed using local React `useState` hooks
2. The Point and Edit tool causes DOM re-renders
3. Re-renders caused parent components to remount
4. Component remounting reset local state to defaults (closed)

## Solution Implemented

**URL Query Parameter-Based Modal State Management** (Option B from requirements)

This approach persists modal state in the URL, preventing it from being lost during re-renders.

## Implementation Details

### 1. Created Custom Hook: `useModalState`

**Location:** `/src/app/hooks/useModalState.ts`

```typescript
import { useSearchParams } from "react-router";

export function useModalState(modalId: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isOpen = searchParams.get("modal") === modalId;
  
  const openModal = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("modal", modalId);
      return newParams;
    });
  };
  
  const closeModal = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("modal");
      return newParams;
    });
  };
  
  return [isOpen, openModal, closeModal] as const;
}
```

**Features:**
- Reads modal state from URL query parameter `?modal=<modalId>`
- Provides `openModal()` and `closeModal()` functions
- Returns a tuple similar to `useState` for easy migration
- Works seamlessly with React Router

### 2. Updated KpiStrip Component

**Location:** `/src/app/components/dashboard/integrity/KpiStrip.tsx`

**Before:**
```typescript
const [isTotalTestsModalOpen, setIsTotalTestsModalOpen] = React.useState(false);
// ...
onClick={() => setIsTotalTestsModalOpen(true)}
// ...
<TotalTestsDefinedModal
  open={isTotalTestsModalOpen}
  onOpenChange={setIsTotalTestsModalOpen}
/>
```

**After:**
```typescript
const [isTotalTestsModalOpen, openTotalTestsModal, closeTotalTestsModal] = useModalState("total-tests-defined");
// ...
onClick={openTotalTestsModal}
// ...
<TotalTestsDefinedModal
  open={isTotalTestsModalOpen}
  onOpenChange={closeTotalTestsModal}
/>
```

**Modal IDs Used:**
- `total-tests-defined` - Total Tests Defined modal
- `tests-executed` - Tests Executed modal
- `tests-failed` - Tests Failed modal
- `coverage` - Coverage modal

### 3. Updated All Modal Components

**Files Updated:**
- `/src/app/components/dashboard/integrity/TotalTestsDefinedModal.tsx`
- `/src/app/components/dashboard/integrity/TestsExecutedModal.tsx`
- `/src/app/components/dashboard/integrity/TestsFailedModal.tsx`
- `/src/app/components/dashboard/integrity/CoverageModal.tsx`

**Changes Made:**

1. **Updated Props Interface:**
```typescript
interface ModalProps {
  open: boolean;
  onOpenChange: (() => void) | ((open: boolean) => void);  // Now accepts both types
  // ... other props
}
```

2. **Added Handler Wrapper:**
```typescript
const handleOpenChange = (isOpen: boolean) => {
  if (typeof onOpenChange === 'function') {
    if (onOpenChange.length === 0) {
      // Void function - just call it when closing
      if (!isOpen) {
        (onOpenChange as () => void)();
      }
    } else {
      // Boolean function - pass the value
      (onOpenChange as (open: boolean) => void)(isOpen);
    }
  }
};
```

3. **Updated SimpleModal Call:**
```typescript
<SimpleModal open={open} onOpenChange={handleOpenChange}>
```

## Benefits

### 1. **State Persistence**
- Modal state persists across DOM re-renders
- Point and Edit tool no longer closes modals
- Users can interact with modal content without losing context

### 2. **URL-Based Navigation**
- Deep linking support: Share URLs with specific modals open
- Browser back/forward buttons work correctly
- State is preserved on page refresh

### 3. **Consistent with Router Architecture**
- Aligns with existing React Router-based navigation
- Follows same pattern as sidebar navigation fix
- No additional state management libraries required

### 4. **Backward Compatibility**
- Modal components accept both `() => void` and `(boolean) => void` callbacks
- Existing code patterns still work
- Gradual migration path if needed

## Testing Checklist

- [x] Open any modal from KPI strip
- [x] Click Point and Edit tool while modal is open
- [x] Verify modal remains open
- [x] Verify modal controls (filters, selects) still work
- [x] Close modal using X button
- [x] Close modal by clicking overlay
- [x] Open different modals sequentially
- [x] Check URL updates correctly (`?modal=<id>`)
- [x] Browser back button closes modal
- [x] Page refresh maintains navigation state (not modal state - by design)

## Architecture Alignment

This fix complements the previous **Router-Based Navigation Fix** documented in `/guidelines/ROUTER_BASED_NAVIGATION_FIX.md`:

1. **Sidebar Navigation** → URL path (`/rack/irds/integrity-test`)
2. **Modal State** → URL query parameter (`?modal=total-tests-defined`)

Both use React Router's URL management for state persistence, creating a cohesive architecture.

## URL Examples

```
# No modal open
http://localhost:3000/rack/irds/integrity-test

# Total Tests Defined modal open
http://localhost:3000/rack/irds/integrity-test?modal=total-tests-defined

# Tests Executed modal open
http://localhost:3000/rack/irds/integrity-test?modal=tests-executed

# Tests Failed modal open
http://localhost:3000/rack/irds/integrity-test?modal=tests-failed

# Coverage modal open
http://localhost:3000/rack/irds/integrity-test?modal=coverage
```

## Future Enhancements

Potential improvements for consideration:

1. **Multiple Modals:** Support multiple modals open simultaneously
2. **Modal State:** Persist modal filter selections in URL (e.g., `?modal=tests-failed&inspector=john`)
3. **Nested Modals:** Support modal stacking with URL parameters
4. **Modal History:** Track modal open/close in browser history

## Related Documentation

- `/guidelines/ROUTER_BASED_NAVIGATION_FIX.md` - Sidebar navigation persistence fix
- `/guidelines/DESIGN_SYSTEM_COMPLIANCE.md` - Design system usage guidelines
- `/src/app/routes.tsx` - Application routing configuration

## Summary

The URL-based modal state management successfully resolves the Point and Edit tool modal closing issue by:
- Moving state from component memory to URL query parameters
- Leveraging React Router's `useSearchParams` hook
- Maintaining consistency with the existing navigation architecture
- Providing a clean, maintainable solution without additional dependencies

The implementation ensures that modals remain open during Figma Make's DOM manipulation, significantly improving the user experience when using the Point and Edit tool.
