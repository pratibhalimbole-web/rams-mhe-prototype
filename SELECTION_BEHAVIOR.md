# Selection Behavior - Template Builder

## Overview

The Template Builder implements a strict single-selection system where only one element can be selected at a time, with clear visual feedback showing exactly which element is active.

---

## Selection Rules

### **Mutual Exclusivity**
Only one element can be selected at any given time:
- Section OR
- Module OR  
- Text Block

When a new element is selected, all other selections are automatically cleared.

### **Parent Container Rules**
Selection styling does NOT propagate to parent containers:
- When a text block is selected → Only the text block shows blue border
- When a module is selected → Only the module shows blue border  
- When a section is selected → Only the section shows blue border

---

## Visual States

### **Section**

**Default State:**
```
Border: Light grey (var(--border))
Hover: Light blue border (border-primary/30)
```

**Selected State:**
```
Border: Blue (var(--primary))
Ring: 1px blue ring with 20% opacity
```

**Selection Condition:**
```typescript
selectedSectionId === section.id 
  && !selectedModuleId 
  && !selectedContentBlockId
```

### **Module**

**Default State:**
```
Border: Light grey with 60% opacity (border-border/60)
Hover: Light blue border (border-primary/30)
```

**Selected State:**
```
Border: Blue (var(--primary))
Ring: 1px blue ring with 20% opacity
Shadow: Medium shadow
```

**Selection Condition:**
```typescript
selectedModuleId === mod.instanceId 
  && !selectedContentBlockId
```

### **Text Block**

**Default State:**
```
Border: Light grey (var(--border))
Hover: Light blue border (border-primary/50)
```

**Selected State:**
```
Border: Blue (var(--primary))
Ring: 2px blue ring with offset
Shadow: Small shadow
```

**Selection Condition:**
```typescript
selectedContentBlockId === block.id
```

---

## Selection State Management

### **State Variables**
```typescript
// In TemplateBuilder.tsx
const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
const [selectedContentBlockId, setSelectedContentBlockId] = useState<string | null>(null);
```

### **Selection Handlers**

**Section Click:**
```typescript
const handleSectionClick = (e: React.MouseEvent, id: string) => {
  e.stopPropagation();
  setSelectedSectionId(id);
  setSelectedModuleId(null);
  setSelectedContentBlockId(null);
};
```

**Module Click:**
```typescript
const handleModuleClick = (e: React.MouseEvent, id: string) => {
  e.stopPropagation();
  setSelectedModuleId(id);
  setSelectedSectionId(null);
  setSelectedContentBlockId(null);
};
```

**Content Block Click:**
```typescript
const handleContentBlockClick = (moduleId: string, blockId: string) => {
  setSelectedModuleId(moduleId);      // Set parent for context
  setSelectedSectionId(null);
  setSelectedContentBlockId(blockId);  // Active selection
};
```

**Canvas Click (Deselect All):**
```typescript
const handleCanvasClick = () => {
  setSelectedModuleId(null);
  setSelectedSectionId(null);
  setSelectedContentBlockId(null);
};
```

---

## Implementation Details

### **Section Selection Logic**

```tsx
<div
  className={cn(
    "border",
    hasErrors 
      ? "border-destructive" 
      : (selectedSectionId === section.id && !selectedModuleId && !selectedContentBlockId)
        ? "border-primary ring-1 ring-primary/20" 
        : "border-border hover:border-primary/30"
  )}
  style={{
    borderColor: hasErrors 
      ? 'var(--destructive)' 
      : (selectedSectionId === section.id && !selectedModuleId && !selectedContentBlockId)
        ? 'var(--primary)' 
        : 'var(--border)',
    borderRadius: 'var(--radius-lg)',
  }}
  onClick={(e) => handleSectionClick(e, section.id)}
>
```

**Key Point:** Section only shows as selected when NO module or content block is selected.

### **Module Selection Logic**

```tsx
<DraggableModuleCard
  module={mod}
  isSelected={selectedModuleId === mod.instanceId && !selectedContentBlockId}
  onClick={(e) => handleModuleClick(e, mod.instanceId)}
/>
```

**In ModuleBuilderCard:**
```tsx
<div 
  onClick={onClick}
  className={cn(
    "border",
    isSelected 
      ? "border-primary ring-1 ring-primary/20 shadow-md" 
      : "border-border/60 hover:border-primary/30"
  )}
  style={{
    borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
    borderRadius: 'var(--radius-lg)',
  }}
>
```

**Key Point:** Module only shows as selected when NO content block within it is selected.

### **Content Block Selection Logic**

```tsx
<ModuleContentBlock
  block={block}
  isSelected={selectedContentBlockId === block.id}
  onClick={() => onContentBlockClick?.(block.id)}
/>
```

**In ModuleContentBlock:**
```tsx
<div 
  className={cn(
    "relative group cursor-pointer",
    isSelected && "ring-2 ring-primary ring-offset-2"
  )}
>
  <div 
    className={cn(
      "border",
      isSelected 
        ? "border-primary shadow-sm" 
        : "border-border hover:border-primary/50"
    )}
    style={{
      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
      borderRadius: 'var(--radius)',
    }}
  >
```

**Key Point:** Content block shows blue border only when it's the active selection.

---

## CSS Variables

All border colors use CSS variables from the design system:

### **Default Borders**
```css
border-color: var(--border);
```

### **Selected Borders**
```css
border-color: var(--primary);
```

### **Error Borders**
```css
border-color: var(--destructive);
```

### **Border Radius**
```css
border-radius: var(--radius);       /* Text blocks */
border-radius: var(--radius-lg);    /* Modules, Sections */
```

---

## Visual Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│ Section (grey border)                                   │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ Module (grey border)                           │   │
│  │                                                 │   │
│  │  [Chart Preview]                                │   │
│  │                                                 │   │
│  │  ┌──────────────────────────────────────────┐  │   │
│  │  │ Text Block (BLUE border - SELECTED)      │  │   │
│  │  │                                           │  │   │
│  │  │  Content preview...                       │  │   │
│  │  └──────────────────────────────────────────┘  │   │
│  │                                                 │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Result:** Only the text block shows blue border, module and section remain grey.

---

## Selection Flow Examples

### **Example 1: Selecting a Text Block**

**Initial State:**
- Section: Grey border
- Module: Grey border
- Text Block: Grey border

**User clicks text block:**
```
handleContentBlockClick('module-123', 'block-456')
  ↓
selectedModuleId = 'module-123'
selectedContentBlockId = 'block-456'
selectedSectionId = null
```

**Visual Result:**
- Section: Grey border (not selected - has selectedModuleId)
- Module: Grey border (not selected - has selectedContentBlockId)
- Text Block: **Blue border** (selected)

### **Example 2: Selecting a Module**

**User clicks module:**
```
handleModuleClick(event, 'module-123')
  ↓
selectedModuleId = 'module-123'
selectedContentBlockId = null
selectedSectionId = null
```

**Visual Result:**
- Section: Grey border (not selected - has selectedModuleId)
- Module: **Blue border** (selected - no selectedContentBlockId)
- Text Block: Grey border (not selected)

### **Example 3: Selecting a Section**

**User clicks section:**
```
handleSectionClick(event, 'section-1')
  ↓
selectedSectionId = 'section-1'
selectedModuleId = null
selectedContentBlockId = null
```

**Visual Result:**
- Section: **Blue border** (selected - no module or block selected)
- Module: Grey border (not selected)
- Text Block: Grey border (not selected)

---

## Right Panel Behavior

The right panel opens based on what's selected:

### **Text Block Selected**
```typescript
if (selectedModuleId && selectedContentBlockId) {
  // Show TextBlock settings (via virtual module)
  return <ModuleSettingsPanel module={virtualTextBlockModule} />;
}
```

### **Module Selected**
```typescript
if (selectedModuleId && !selectedContentBlockId) {
  // Show Module settings
  return <ModuleSettingsPanel module={selectedModule} />;
}
```

### **Section Selected**
```typescript
if (selectedSectionId && !selectedModuleId) {
  // Show Section settings
  return <SectionSettings />;
}
```

---

## Event Propagation

All click handlers use `e.stopPropagation()` to prevent:
- Text block clicks from triggering module selection
- Module clicks from triggering section selection
- Unwanted selection bubbling

```typescript
const handleContentBlockClick = (moduleId: string, blockId: string) => {
  // No event parameter - called directly, not from DOM event
  setSelectedModuleId(moduleId);
  setSelectedContentBlockId(blockId);
  setSelectedSectionId(null);
};

// In ModuleContentBlock
onClick={(e) => {
  e.stopPropagation();  // Prevent module click
  onClick?.();           // Call parent handler
}}
```

---

## Testing Checklist

- ✅ Click text block → Only text block shows blue border
- ✅ Click text block → Module stays grey
- ✅ Click text block → Section stays grey
- ✅ Click module → Only module shows blue border
- ✅ Click module → Section stays grey
- ✅ Click module → Text blocks stay grey
- ✅ Click section → Only section shows blue border
- ✅ Click section → Modules stay grey
- ✅ Click canvas → All borders revert to grey
- ✅ Hover states work on all elements
- ✅ Right panel opens for correct selection
- ✅ CSS variables used for all borders

---

## Troubleshooting

### **Multiple elements showing blue border**
**Cause:** Selection condition not checking for child selections  
**Fix:** Ensure conditions include `&& !selectedContentBlockId` for modules and `&& !selectedModuleId && !selectedContentBlockId` for sections

### **Parent container shows blue border with child**
**Cause:** Missing condition in isSelected prop  
**Fix:** Add `&& !selectedContentBlockId` to module selection condition

### **Borders not using CSS variables**
**Cause:** Only using Tailwind classes without inline styles  
**Fix:** Add `style={{ borderColor: ... }}` with CSS variables

### **Selection not clearing**
**Cause:** Handler not clearing other selection states  
**Fix:** Ensure all handlers set non-relevant selections to `null`

---

*Last Updated: 2024-03-05*
*Status: ✅ Fixed - Only Active Element Highlighted*
