# Text Block Controls - Visual Guide

## Module Header Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  ≡  Module Title          [Chart] [Table]  [+]  [🗑️]              │
│  ↑                        ↑      ↑         ↑    ↑                   │
│  Drag                     Badges           Add  Delete               │
│  Handle                                   Menu                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Add Content Menu

```
Clicking [+] opens dropdown:

┌──────────────────┐
│  Add Content     │
├──────────────────┤
│  📄 Text / Notes │
│  ─  Divider      │
└──────────────────┘
```

## Module with Content Blocks

```
┌───────────────────────────────────────────────────────┐
│  ≡  Depreciation Analysis  [Chart]  [+]  [🗑️]        │  ← Module Header
├───────────────────────────────────────────────────────┤
│                                                       │
│  [Chart Visualization]                                │  ← Main Module Content
│                                                       │
│                                                       │
├───────────────────────────────────────────────────────┤
│  📄 Notes                                  [⚙️] [🗑️]  │  ← Text Block Header
├───────────────────────────────────────────────────────┤
│  [B] [•] [1.] [🖍️]                                    │  ← Formatting Toolbar
├───────────────────────────────────────────────────────┤
│  This depreciation trend shows...                     │  ← Text Content
│  • Key observation 1                                  │
│  • Key observation 2                                  │
│                                                       │
└───────────────────────────────────────────────────────┘
│                                                       │
├───────────────────────────────────────────────────────┤
│  ─────────────────────────────────────────────────    │  ← Divider Block
└───────────────────────────────────────────────────────┘
│                                                       │
├───────────────────────────────────────────────────────┤
│  ✨ Dynamic Insights                       [⚙️] [🗑️] │  ← Dynamic Block
├───────────────────────────────────────────────────────┤
│  🤖 AI-Generated Insights                             │
│  • Equipment failure rate decreased by 15%            │
│  • Zone B shows highest concentration of issues       │
│  • Recommended: Increase inspection frequency         │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## Text Block Settings Dialog

```
┌─────────────────────────────────────────────┐
│  Text Block Settings                     [✕]│
│  Configure the text block type and options  │
├─────────────────────────────────────────────┤
│  ┌─────────┬─────────┐                      │
│  │ Static  │ Dynamic │  ← Mode Tabs         │
│  └─────────┴─────────┘                      │
│                                             │
│  [Static Mode Selected]                     │
│  ┌─────────────────────────────────────┐   │
│  │ Static mode allows you to manually  │   │
│  │ type and format text with support   │   │
│  │ for bold, lists, and highlighting.  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│                          [Apply]            │
└─────────────────────────────────────────────┘

OR

┌─────────────────────────────────────────────┐
│  Text Block Settings                     [✕]│
│  Configure the text block type and options  │
├─────────────────────────────────────────────┤
│  ┌─────────┬─────────┐                      │
│  │ Static  │ Dynamic │  ← Mode Tabs         │
│  └─────────┴─────────┘                      │
│                                             │
│  [Dynamic Mode Selected]                    │
│                                             │
│  Insight Source                             │
│  ┌─────────────────────────────────────┐   │
│  │ Module Dataset            ▼         │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Insight Type                               │
│  ┌─────────────────────────────────────┐   │
│  │ Key Findings              ▼         │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Max Insights                               │
│  ┌─────────────────────────────────────┐   │
│  │ 3                                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ℹ️ Note: Dynamic insights will be   │   │
│  │ generated from the configured data  │   │
│  │ source when viewed or exported.     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│                          [Apply]            │
└─────────────────────────────────────────────┘
```

## Report Preview Mode

In preview mode, content blocks render without editing controls:

```
┌───────────────────────────────────────────────────────┐
│  Depreciation Analysis                                │
│                                                       │
│  [Chart Visualization]                                │
│                                                       │
├───────────────────────────────────────────────────────┤
│  📄 Notes                                             │
├───────────────────────────────────────────────────────┤
│  This depreciation trend shows significant decline    │
│  in asset value over the reporting period:            │
│  • Equipment depreciation: 15% annually               │
│  • Building depreciation: 3% annually                 │
│  • Total asset value reduction: $2.4M                 │
└───────────────────────────────────────────────────────┘
│                                                       │
│  ─────────────────────────────────────────────────    │
│                                                       │
├───────────────────────────────────────────────────────┤
│  ✨ Dynamic Insights                                  │
├───────────────────────────────────────────────────────┤
│  🤖 AI-Generated Insights                             │
│  • Equipment failure rate decreased by 15% quarterly  │
│  • Zone B shows highest concentration of issues       │
│  • Recommended: Increase inspection frequency         │
└───────────────────────────────────────────────────────┘
```

## Icon Reference

| Icon | Meaning |
|------|---------|
| ≡ | Drag handle (reorder modules) |
| + | Add content menu trigger |
| 🗑️ | Delete button |
| ⚙️ | Settings/configuration |
| 📄 | Static text/notes |
| ✨ | Dynamic insights |
| 🤖 | AI-generated content |
| [B] | Bold formatting |
| [•] | Bullet list |
| [1.] | Numbered list |
| [🖍️] | Highlight text |

## Color Coding (from Design System)

### Borders
- Default: `var(--border)` - Light gray
- Selected: `var(--primary)` - Blue
- Hover: `var(--primary)/30` - Light blue

### Backgrounds
- Card: `var(--card)` - White
- Muted: `var(--muted)` - Very light gray
- Primary highlight: `var(--primary)/5` - Very light blue

### Text
- Foreground: `var(--foreground)` - Dark gray/black
- Muted: `var(--muted-foreground)` - Medium gray
- Destructive: `var(--destructive)` - Red

## Interaction States

### Module Header Buttons
- **Default**: Subtle, low opacity
- **Hover**: Full opacity, background highlight
- **Active**: Pressed state with darker background

### Content Block Header
- **Default**: Visible but subtle
- **Hover**: Controls fade in (settings, delete)
- **Focus**: Border highlight when editing

### Text Editor
- **Default**: White background, gray border
- **Focus**: Primary border, ring shadow
- **Disabled**: Muted background, no interaction

## Responsive Behavior

### Desktop (Builder Mode)
- Full controls visible
- Hover states active
- Drag and drop enabled
- Side-by-side editing

### Tablet
- Touch-friendly button sizes
- Simplified hover states
- Scroll-based interactions

### Mobile
- Stacked layout
- Larger touch targets
- Simplified toolbar
- Bottom sheet for settings

### Preview/Report Mode (All Sizes)
- Clean, print-ready layout
- No editing controls
- Optimized spacing
- Professional appearance
