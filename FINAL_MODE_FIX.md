# 🔧 FINAL FIX REQUIRED: Text Block Mode Selector

## What's Been Fixed
✅ Canvas preview now shows correct placeholder text based on mode
✅ Mode selector buttons have proper click handlers and z-index
✅ Settings panel UI is fully interactive

## What Still Needs Manual Fix

You need to make **TWO small edits** to `/src/app/pages/report/TemplateBuilder.tsx`:

---

### 📝 Edit #1: Line ~1427 - Add mode to virtualTextBlockModule config

**Find this code (around line 1426-1428):**
```typescript
config: {
  content: selectedBlock.content || '',
}
```

**Replace with:**
```typescript
config: {
  content: selectedBlock.content || '',
  mode: selectedBlock.mode || 'static',
}
```

---

### 📝 Edit #2: Line ~1438 - Update the spread operator in updateContentBlock

**Find this code (around line 1437-1439):**
```typescript
block.id === selectedContentBlockId 
  ? { ...block, content: updates.content } 
  : block
```

**Replace with:**
```typescript
block.id === selectedContentBlockId 
  ? { ...block, ...updates } 
  : block
```

---

## Why These Changes Are Critical

1. **Edit #1** ensures the `mode` field is passed from the content block to the settings panel
2. **Edit #2** allows ALL updates (including `mode`) to be saved, not just `content`

Without these changes, the mode toggle buttons won't save their state.

---

## After Making These Changes

The Text Block module will work perfectly:
- ✅ Static/Dynamic buttons will be clickable and save state
- ✅ Canvas shows "Click to edit content in report draft" for Static mode
- ✅ Canvas shows "System generated insights will appear here" for Dynamic mode
- ✅ Settings panel editor is enabled/disabled based on mode
