# ⚡ Quick Reference Card - Figma Make Integration

## 🎯 ONE-PAGE CHEAT SHEET

---

## ✅ ISSUE RESOLVED

**Problem**: Page reloads when clicking "Point and Edit" or navigates to wrong page  
**Status**: ✅ **FIXED**  
**Version**: 2.0.0 (Router-based navigation)

---

## 📋 WHAT WAS FIXED

1. ✅ **Button in sidebar** - Added `type="button"` to SidebarRail
2. ✅ **Event handlers** - Added Figma Make tool detection
3. ✅ **Router navigation** - Converted to React Router URL-based navigation
4. ✅ **CSS protection** - Ensured Figma tools always on top
5. ✅ **Debug logging** - Added console messages for tracking
6. ✅ **Navigation persistence** - URL-based routing survives re-renders

---

## 🔍 HOW TO VERIFY IT WORKS

### 30-Second Test:
1. Navigate to any page (e.g., Integrity Test)
2. Press F12 (open console)
3. Click "Point and Edit"
4. Verify URL stays the same (e.g., `/rack/irds/integrity-test`)
5. Verify page doesn't reset to Project Planner ✅

---

## 🚨 CONSOLE MESSAGES

### ✅ Good (Expected):
```
🔒 Enhanced reload prevention active
✅ Figma Make tool detected - allowing action
```

### ⚠️ OK (Protection working):
```
🛑 Prevented form submission
🛑 Blocked navigation - Figma Make edit mode is active
```

### 🚨 Bad (Investigate):
```
⚠️ Page unload detected while Figma Make is active!
```

---

## 🧭 NAVIGATION PATTERNS

### ✅ URL Structure:

**Flat Domains** (Digital Twin, Analytics, IoT, Library, Admin):
```
/{domainId}/{featureId}
Example: /analytics/global-dashboard
```

**Suite Domains** (Rack, MHE, Pallet):
```
/{domainId}/{suiteId}/{featureId}
Example: /rack/irds/integrity-test
```

### ✅ Navigation Code:

```tsx
import { useNavigate } from 'react-router';

const navigate = useNavigate();

// Navigate to a page
navigate('/rack/irds/integrity-test');

// Get current location
import { useLocation } from 'react-router';
const location = useLocation();
console.log(location.pathname); // e.g., "/rack/irds/integrity-test"
```

### ✅ Adding New Routes:

Edit `/src/app/routes.tsx`:
```tsx
{
  path: "rack/irds/new-feature",
  element: <NewFeatureComponent />,
}
```

---

## 🎨 DESIGN SYSTEM RULES

### ✅ USE CSS VARIABLES FOR:
- Colors: `var(--primary)`, `var(--background)`
- Spacing: `var(--spacing-4)`, `var(--spacing-2)`
- Typography: `var(--text-base)`, `var(--font-weight-medium)`
- Borders: `var(--radius)`, `var(--border)`

### ✅ USE TAILWIND CLASSES FOR:
- Layout: `flex`, `grid`, `relative`
- Display: `hidden`, `block`
- Positioning: `top-0`, `left-0`
- Flexbox: `justify-between`, `items-center`

### ❌ NEVER USE:
- Hardcoded colors: `bg-blue-500`, `text-gray-600`
- Hardcoded spacing: `p-4`, `m-2` (use CSS vars)
- Hardcoded fonts: `text-lg`, `font-bold` (use CSS vars)

---

## 🔧 CODE PATTERNS

### ✅ Correct Button:
```tsx
<button
  type="button"  // ← REQUIRED!
  onClick={handleClick}
  style={{
    backgroundColor: "var(--primary)",
    padding: "var(--spacing-2) var(--spacing-4)",
    borderRadius: "var(--radius)"
  }}
>
  Click Me
</button>
```

### ✅ Correct Event Handler:
```tsx
const handleClick = (e: Event) => {
  const target = e.target as HTMLElement;
  
  // Check for Figma Make first!
  if (target.closest('[data-figma-make-overlay]')) {
    return; // Let Figma work
  }
  
  // Your logic here
  e.preventDefault();
};
```

### ✅ Correct Styling:
```tsx
<div 
  className="flex items-center"  // ← Layout
  style={{
    backgroundColor: "var(--card)",  // ← Colors
    padding: "var(--spacing-4)",     // ← Spacing
    borderRadius: "var(--radius)"    // ← Radius
  }}
>
```

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `/src/app/App.tsx` | Global protection |
| `/src/app/components/ui/sidebar.tsx` | Fixed button |
| `/src/app/components/dashboard/integrity/SimpleModal.tsx` | Modal protection |
| `/src/app/components/layout/SidebarLayout.tsx` | State persistence |
| `/src/styles/index.css` | CSS protection |
| `/src/styles/theme.css` | Design tokens |

---

## 📚 DOCUMENTATION

| Doc | When to Read |
|-----|--------------|
| `FIGMA_MAKE_FIX.md` | Deep technical details |
| `BUTTON_TYPE_FIX.md` | Button implementation |
| `DEBUGGING_POINT_AND_EDIT.md` | Troubleshooting |
| `FIX_SUMMARY.md` | Quick overview |
| `DESIGN_SYSTEM_COMPLIANCE.md` | Styling guide |
| `VERIFICATION_COMPLETE.md` | Test results |

---

## ✅ NEW COMPONENT CHECKLIST

Before committing:

- [ ] All buttons have `type="button"`
- [ ] Colors use CSS variables
- [ ] Spacing uses CSS variables
- [ ] Typography uses CSS variables
- [ ] Event handlers check for Figma Make
- [ ] Tested with "Point and Edit"
- [ ] Console shows no errors
- [ ] No page reload on interaction

---

## 🐛 DEBUGGING STEPS

1. **Open Console** (F12)
2. **Check for messages** (look for ✅ or 🛑)
3. **Check sessionStorage** (Application tab)
4. **Verify button types** (Inspect element)
5. **Check CSS** (Computed styles)
6. **Review** `/guidelines/DEBUGGING_POINT_AND_EDIT.md`

---

## 🎯 sessionStorage Keys

```javascript
sessionStorage.getItem('rams-active-domain')   // e.g., "rack"
sessionStorage.getItem('rams-active-suite')    // e.g., "irds"
sessionStorage.getItem('rams-active-feature')  // e.g., "integrity-test"
```

---

## 🚀 QUICK COMMANDS

### Find buttons without type:
```bash
grep -rn "<button" src --include="*.tsx" | grep -v "type="
```

### Find hardcoded colors:
```bash
grep -rE "bg-(red|blue|green|gray)" src --include="*.tsx"
```

### Find hardcoded spacing:
```bash
grep -rE "p-[0-9]|m-[0-9]" src --include="*.tsx"
```

---

## 💡 PRO TIPS

1. **Always check console** - Debug messages tell you what's happening
2. **Use sessionStorage** - Persist critical UI state
3. **Test with Point and Edit** - Before every commit
4. **Follow design system** - CSS variables for all styling
5. **Document as you go** - Update guidelines when patterns change

---

## ⚠️ COMMON MISTAKES

### ❌ Mistake 1: Forgetting Button Type
```tsx
<button onClick={...}>  // ← Defaults to type="submit"!
```
✅ **Fix**: Always add `type="button"`

### ❌ Mistake 2: Hardcoded Colors
```tsx
className="bg-blue-500"  // ← Not in design system
```
✅ **Fix**: Use `style={{ backgroundColor: "var(--primary)" }}`

### ❌ Mistake 3: No Figma Make Check
```tsx
onClick={(e) => {
  e.preventDefault();  // ← Blocks Figma Make!
}}
```
✅ **Fix**: Check for Figma Make elements first

---

## 📞 NEED HELP?

1. Check `/guidelines/README.md` for doc index
2. Review `/guidelines/DEBUGGING_POINT_AND_EDIT.md`
3. Verify all files match `/guidelines/VERIFICATION_COMPLETE.md`
4. Check console for error messages
5. Test in incognito mode

---

## ✅ SUCCESS INDICATORS

You know it's working when:
- ✅ Console shows `✅ Figma Make tool detected`
- ✅ No page reload when clicking "Point and Edit"
- ✅ Modals stay open
- ✅ Components can be selected
- ✅ Navigation state persists

---

**Version**: 2.0.0  
**Last Updated**: 2026-02-11  
**Status**: ✅ **FULLY OPERATIONAL**

---

*Keep this card handy while developing!* 🚀