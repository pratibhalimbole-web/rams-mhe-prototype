# 🔍 Debugging Figma Make "Point and Edit" Issues

## Quick Diagnostic Steps

### 1. Open Browser Console
Press `F12` or `Cmd+Option+I` (Mac) to open DevTools

### 2. Click "Point and Edit"
Watch the console for these messages:

#### ✅ **Expected Messages (Tool is Working)**
```
🔒 Reload prevention active - Figma Make tools should work normally
✅ Figma Make tool detected - allowing action
```

#### ⚠️ **Warning Messages (Investigate)**
```
⚠️ Page unload/reload detected!
```
**Action**: Check what triggered the reload. Look at stack trace.

```
🛑 Prevented form submission that would reload page
```
**Action**: A form was submitted. This is expected and protection worked.

```
🛑 Prevented anchor navigation that would reload page: <url>
```
**Action**: An anchor was clicked. This is expected and protection worked.

### 3. Check SessionStorage
In console, run:
```javascript
sessionStorage.getItem('rams-active-domain')
sessionStorage.getItem('rams-active-suite')
sessionStorage.getItem('rams-active-feature')
```

**Expected**: Should show your current page state (e.g., "rack", "irds", "integrity-test")

### 4. Verify Element Detection
When you click "Point and Edit", run this in console:
```javascript
document.querySelectorAll('[data-figma-make-overlay]')
document.querySelectorAll('[data-figma-make-edit-mode]')
```

**Expected**: Should find Figma Make elements

## Common Issues & Solutions

### Issue: Page Still Reloads to IRDS > Project Planner

**Symptoms**:
- Click "Point and Edit"
- Page refreshes
- Ends up at IRDS > Project Planner (not current page)

**Diagnosis**:
1. Check console for `⚠️ Page unload/reload detected!`
2. If present, a full reload is happening

**Solutions**:
1. **If sessionStorage is working**: Page will return to current location after reload
2. **If sessionStorage is empty**: Check browser privacy settings (might block storage)
3. **If still broken**: Figma Make might be forcing a hard refresh - contact Figma support

### Issue: Cannot Select Components

**Symptoms**:
- "Point and Edit" activates
- No reload happens
- But clicking components doesn't select them

**Diagnosis**:
1. Check z-index of modal overlays
2. Check if `pointer-events: none` is set somewhere

**Solutions**:
1. Verify `/src/styles/index.css` has the Figma Make CSS rules
2. Check modal has `data-modal-active` attribute on `<body>`
3. Inspect element to see if overlay is blocking

### Issue: Modal Closes When Clicking Point and Edit

**Symptoms**:
- Modal is open
- Click "Point and Edit"
- Modal closes

**Diagnosis**:
1. Check if modal close handler is triggered
2. Look for click event bubbling

**Solutions**:
1. Verify `SimpleModal.tsx` has the Figma Make detection code
2. Check that event.stopPropagation() is being called
3. Ensure modal overlay click handler checks for Figma tools

## Testing Script

Run this in the console to verify all protections are active:

```javascript
// Check for reload prevention
console.log('Reload prevention listeners:', 
  window.getEventListeners?.(document).submit?.length > 0,
  window.getEventListeners?.(document).click?.length > 0
);

// Check sessionStorage
console.log('SessionStorage state:', {
  domain: sessionStorage.getItem('rams-active-domain'),
  suite: sessionStorage.getItem('rams-active-suite'),
  feature: sessionStorage.getItem('rams-active-feature')
});

// Check Figma Make elements
console.log('Figma Make elements:', 
  document.querySelectorAll('[data-figma-make-overlay], [data-figma-make-edit-mode]').length
);

// Check modal state
console.log('Modal active:', document.body.getAttribute('data-modal-active'));
```

## Manual Test Checklist

- [ ] Navigate to Integrity Test page
- [ ] Open "Tests Failed" modal
- [ ] Open browser console (F12)
- [ ] Click "Point and Edit" from Figma Make toolbar
- [ ] Console shows: `✅ Figma Make tool detected - allowing action`
- [ ] Console does NOT show: `⚠️ Page unload/reload detected!`
- [ ] Modal stays open
- [ ] Can select component inside modal
- [ ] Edit panel opens
- [ ] Navigate to different page (e.g., BOQ)
- [ ] Click "Point and Edit" again
- [ ] Stays on BOQ page (doesn't jump to Project Planner)

## Files to Check

If issues persist, verify these files have the correct code:

1. **`/src/app/App.tsx`**
   - Has `preventFigmaReload` function
   - Event listeners with capture phase
   - Console logging

2. **`/src/app/components/dashboard/integrity/SimpleModal.tsx`**
   - Has Figma Make detection in `preventAllDefaults`
   - Returns early for Figma tools

3. **`/src/app/components/layout/SidebarLayout.tsx`**
   - State initialized from sessionStorage
   - Updates sessionStorage on state change

4. **`/src/styles/index.css`**
   - Figma Make CSS rules with high z-index
   - Pointer events set to auto

## Need More Help?

If none of these solutions work:

1. **Export console logs**: Right-click in console → "Save as..."
2. **Take screenshot** of the issue happening
3. **Note exact steps** that cause the problem
4. **Check Figma Make version** - there might be a tool update
5. **Try in incognito mode** - rules out browser extensions

## Version Info

- **Fix Version**: 1.0.5
- **Files Modified**: App.tsx, SimpleModal.tsx, SidebarLayout.tsx, index.css
- **Date**: 2026-02-11
