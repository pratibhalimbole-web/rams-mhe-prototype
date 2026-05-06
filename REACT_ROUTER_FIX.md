# React Router Error Fix - Invalid Hook Call

## 🔴 Problem
```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
React Router caught the following error during render...
```

## 🔍 Root Cause
**Both `react-router` and `react-router-dom` packages are installed** in `/package.json` (lines 62-63):

```json
"react-router": "^7.13.0",
"react-router-dom": "^7.13.0",
```

This creates **duplicate React instances** because both packages bundle React hooks internally, causing the "Invalid hook call" error.

## ✅ Solution

### **Step 1: Remove `react-router-dom` from package.json**

Edit `/package.json` and **remove line 63**:

**Before:**
```json
{
  "dependencies": {
    "react-router": "^7.13.0",
    "react-router-dom": "^7.13.0",   // ← REMOVE THIS LINE
    ...
  }
}
```

**After:**
```json
{
  "dependencies": {
    "react-router": "^7.13.0",
    ...
  }
}
```

### **Step 2: Reinstall Dependencies**

After removing the line, you need to reinstall dependencies. The exact command depends on your package manager:

**If using npm:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**If using pnpm (recommended for Figma Make):**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**If using yarn:**
```bash
rm -rf node_modules yarn.lock
yarn install
```

---

## 📚 Context: React Router v7 Architecture

In **React Router v7**, the package structure changed:

### **Old (v6):**
- `react-router` = Core routing logic
- `react-router-dom` = Browser-specific bindings + re-exports react-router

Both packages were needed.

### **New (v7):**
- `react-router` = **All-in-one package** (includes DOM bindings)
- `react-router-dom` = **Legacy compatibility layer** (optional)

**You should only install `react-router`** for v7 projects.

---

## ✅ Verification

### **Current Code Status:**
✅ All imports correctly use `react-router`:
- `/src/app/App.tsx`: `import { RouterProvider } from "react-router"`
- `/src/app/routes.tsx`: `import { createBrowserRouter, Navigate } from "react-router"`
- `/src/app/components/layout/SidebarLayout.tsx`: `import { useNavigate, useLocation, Outlet } from "react-router"`
- All other files: Correctly using `react-router`

✅ **No files import from `react-router-dom`** - Code is already migrated correctly!

### **After Fix:**
Once you remove `react-router-dom` from package.json and reinstall:

1. Open the application in browser
2. Check browser console - should see no React Router errors
3. Navigate between pages - routing should work normally
4. No "Invalid hook call" warnings

---

## 🚨 Why This Happened

The `react-router-dom@7.13.0` package still exists for **backward compatibility** but:
1. It re-exports everything from `react-router@7.13.0`
2. Both packages include React hooks
3. When both are installed, npm/pnpm installs duplicate copies
4. React detects multiple hook instances → throws "Invalid hook call"

**The fix:** Only use `react-router` in v7+ projects.

---

## 📝 Related Files

### **Files Using React Router (All Correct):**
- `/src/app/App.tsx`
- `/src/app/routes.tsx`
- `/src/app/components/layout/SidebarLayout.tsx`
- `/src/app/components/dashboard/IntegritySummary.tsx`
- `/src/app/components/dashboard/IntegrityTestDetail.tsx`
- `/src/app/pages/report/TemplateBuilder.tsx`
- `/src/app/pages/report/ReportBuilder.tsx`
- `/src/app/pages/report/ReportBuilderTest.tsx`
- `/src/app/pages/report/ReportCreate.tsx`
- `/src/app/pages/report/ReportCreationWizard.tsx`
- `/src/app/pages/report/ReportDashboard.tsx`
- `/src/app/pages/report/ReportTemplates.tsx`
- `/src/app/pages/report/TemplateLibrary.tsx`
- `/src/app/hooks/useModalState.ts`

All these files **correctly import from `react-router`**, not `react-router-dom`.

---

## ⚡ Quick Fix Summary

1. Open `/package.json`
2. Delete line 63: `"react-router-dom": "^7.13.0",`
3. Run: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
4. Refresh your application
5. ✅ Error should be resolved!

---

**Status:** ⚠️ Requires Manual Fix  
**Impact:** High (Blocks entire application)  
**Difficulty:** Easy (1-line change + reinstall)
