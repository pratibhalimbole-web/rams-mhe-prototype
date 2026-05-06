# Text Block Interaction Guide

## Unified Configuration Pattern

Text blocks now follow the same interaction pattern as Chart, Table, and Heatmap modules.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     TEMPLATE BUILDER                             │
├──────────────────────────────┬──────────────────────────────────┤
│         CANVAS               │      RIGHT SETTINGS PANEL         │
│                              │                                   │
│  ┌────────────────────┐      │  ┌─────────────────────────┐    │
│  │   Module Preview   │      │  │  Text Block Settings    │    │
│  │                    │      │  │                         │    │
│  │  [Chart Display]   │      │  │  Mode: [Static/Dynamic] │    │
│  │                    │      │  │                         │    │
│  └────────────────────┘      │  │  Content:               │    │
│                              │  │  ┌───────────────────┐  │    │
│  ┌────────────────────┐      │  │  │ [B] [•] [1.]     │  │    │
│  │   Text Block       │ ◄────┼──┤  ├───────────────────┤  │    │
│  │   (PREVIEW ONLY)   │      │  │  │                   │  │    │
│  │                    │      │  │  │  Type here...     │  │    │
│  │  "Notes content"   │      │  │  │                   │  │    │
│  └────────────────────┘      │  │  └───────────────────┘  │    │
│         ▲                    │  │                         │    │
│         │                    │  └─────────────────────────┘    │
│         │                    │                                 │
│    Click to Select           │        Edit Here                │
│    Shows Preview             │        Updates Live             │
└──────────────────────────────┴──────────────────────────────────┘
```

---

## Interaction Flow

### 1. **Adding a Text Block**

```
User clicks "+" button on module header
    ↓
AddContentMenu opens
    ↓
User selects "Text / Notes"
    ↓
New text block created with empty content
    ↓
Text block auto-selected
    ↓
Right panel shows TextBlockSettings
    ↓
User can immediately start typing
```

### 2. **Selecting a Text Block**

```
User clicks text block in canvas
    ↓
Block highlights with blue ring
    ↓
Right panel opens/updates
    ↓
Shows TextBlockSettings component
    ↓
User sees current mode and content
```

### 3. **Editing Content**

```
Text block is selected
    ↓
User types in rich text editor (right panel)
    ↓
Content updates in real-time
    ↓
Canvas preview updates immediately
    ↓
No save button needed (auto-save)
```

### 4. **Changing Mode**

```
Text block is selected
    ↓
User clicks "Dynamic" tab in right panel
    ↓
Mode switches from Static to Dynamic
    ↓
Canvas preview updates to show AI insights
    ↓
Configuration options appear for dynamic settings
```

---

## Component Responsibilities

### **Canvas (ModuleContentBlock)**
- ✅ Display read-only preview
- ✅ Handle click events for selection
- ✅ Show visual selection state (highlight/ring)
- ✅ Show delete button on hover
- ❌ NO editing controls
- ❌ NO modal dialogs
- ❌ NO inline toolbars

### **Right Panel (TextBlockSettings)**
- ✅ Show mode selector (Static/Dynamic)
- ✅ Show rich text editor for Static mode
- ✅ Show configuration for Dynamic mode
- ✅ Handle all content editing
- ✅ Update parent state on changes
- ✅ Real-time updates to canvas

### **Template Builder**
- ✅ Track selectedContentBlockId
- ✅ Route selection to right panel
- ✅ Update content blocks in state
- ✅ Manage selection lifecycle

---

## State Management

### Selection State (Mutually Exclusive)
```typescript
const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
const [selectedContentBlockId, setSelectedContentBlockId] = useState<string | null>(null);
```

Only ONE can be active at a time:
- Select module → Clear section and content block
- Select section → Clear module and content block  
- Select content block → Set module (parent) + Clear section

### Content Block Data Structure
```typescript
interface ContentBlock {
  id: string;                    // Unique identifier
  type: 'text' | 'divider';      // Block type
  mode?: 'static' | 'dynamic';   // Text block mode
  content?: string;              // HTML content (static mode)
  dynamicConfig?: {              // AI insights config (dynamic mode)
    insightSource?: string;
    insightType?: string;
    maxInsights?: number;
  };
}
```

### Module Structure
```typescript
interface Module {
  instanceId: string;
  name: string;
  type: string;
  config: {...};
  contentBlocks?: ContentBlock[];  // Array of content blocks
}
```

---

## CSS Variables Usage

All components use design system CSS variables:

### Typography
```tsx
style={{
  fontFamily: "'Inter', sans-serif",
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
}}
```

### Colors
```tsx
style={{
  color: 'var(--foreground)',
  backgroundColor: 'var(--background)',
  borderColor: 'var(--border)',
}}
```

### Spacing
```tsx
style={{
  marginTop: 'var(--spacing-4)',
  padding: 'var(--spacing-3)',
}}
```

### Border Radius
```tsx
style={{
  borderRadius: 'var(--radius)',
}}
```

---

## Comparison: Before vs After

### Before (Modal-based)
```
Canvas                    Modal Dialog
┌──────────────┐         ┌────────────────────┐
│ Text Block   │ Click → │ Text Block Settings│
│              │         │                    │
│ [Settings ⚙️] │         │ [Rich Editor]      │
│              │         │                    │
│ Preview      │         │ [Apply] [Cancel]   │
└──────────────┘         └────────────────────┘
```
❌ Inconsistent with modules  
❌ Modal blocks view  
❌ Requires open/close actions  
❌ No real-time preview  

### After (Right Panel)
```
Canvas                    Right Panel
┌──────────────┐         ┌────────────────────┐
│ Text Block   │ Click → │ Text Block Settings│
│ ┌──────────┐ │         │                    │
│ │ Preview  │ │         │ Mode: Static       │
│ │  Only    │ │    ◄────┤                    │
│ └──────────┘ │ Updates │ [Rich Editor]      │
│              │ Live    │  Type here...      │
└──────────────┘         └────────────────────┘
```
✅ Consistent with modules  
✅ Non-blocking interface  
✅ Real-time updates  
✅ Single source of configuration  

---

## Rich Text Editor Features

Available in Right Panel Settings:

### Formatting Toolbar
- **Bold** - `Ctrl+B` or click button
- **Bullet List** - Unordered list
- **Numbered List** - Ordered list  
- **Highlight** - Yellow background highlight

### Editor Behavior
- Real-time updates to canvas preview
- Placeholder text when empty
- Keyboard shortcuts supported
- Undo/Redo via browser (Ctrl+Z / Ctrl+Y)

---

## Best Practices

### For Users
1. Click text block to select it
2. Use right panel to edit content
3. Canvas shows live preview
4. Click anywhere on canvas to deselect

### For Developers
1. Always use CSS variables for styling
2. Pass selection state through props
3. Update state via callback functions
4. Keep canvas read-only (no inline editing)

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Bold text | `Ctrl+B` |
| Undo | `Ctrl+Z` |
| Redo | `Ctrl+Y` |
| Deselect | `Esc` (when implemented) |

---

## Troubleshooting

### Text block not selecting
- Check: `onClick` handler is passed
- Check: `handleContentBlockClick` is called
- Check: `selectedContentBlockId` state updates

### Settings panel not showing
- Check: `selectedModuleId` is set (parent module)
- Check: `selectedContentBlockId` is set
- Check: Content block exists in module.contentBlocks

### Canvas not updating
- Check: `onUpdate` callback is called
- Check: State updates in TemplateBuilder
- Check: Component re-renders with new content

### Styles not applying
- Check: CSS variables are defined in theme.css
- Check: Using `style={{...}}` prop, not className for custom values
- Check: Font family is `'Inter', sans-serif`

---

## Future Enhancements

Potential improvements:
- [ ] Markdown support
- [ ] Image insertion
- [ ] Link formatting
- [ ] Table support in text blocks
- [ ] Text block templates
- [ ] Copy/paste formatting
- [ ] Keyboard shortcut: `Esc` to deselect

---

## Related Components

- `ModuleContentBlock.tsx` - Canvas preview component
- `TextBlockSettings.tsx` - Right panel configuration
- `TextBlockEditor.tsx` - Rich text editor
- `DynamicInsightConfig.tsx` - AI insights configuration
- `AddContentMenu.tsx` - Content addition dropdown
- `TemplateBuilder.tsx` - Main orchestrator

---

## API Reference

### ModuleContentBlock Props
```typescript
interface ModuleContentBlockProps {
  block: ContentBlock;           // Content block data
  onDelete: () => void;          // Delete handler
  isSelected?: boolean;          // Selection state
  onClick?: () => void;          // Selection handler
  isEditable?: boolean;          // Edit mode flag
}
```

### TextBlockSettings Props
```typescript
interface TextBlockSettingsProps {
  block: ContentBlock;           // Content block data
  onUpdate: (updates: Partial<ContentBlock>) => void;  // Update handler
}
```

### TextBlockEditor Props
```typescript
interface TextBlockEditorProps {
  value: string;                 // HTML content
  onChange: (value: string) => void;  // Change handler
  placeholder?: string;          // Placeholder text
}
```

---

*Last Updated: 2024-03-05*
