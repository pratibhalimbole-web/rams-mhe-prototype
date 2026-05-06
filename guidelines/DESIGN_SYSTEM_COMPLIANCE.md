# 🎨 Design System Compliance Guide

## Overview
The RAMS application uses a custom design system defined in CSS custom properties (CSS variables) located in `/src/styles/theme.css`. All UI components must use these variables instead of hardcoded Tailwind classes to ensure consistency and easy theme updates.

## Design System Files

### 1. `/src/styles/theme.css`
Contains all design tokens:
- **Colors**: `--primary`, `--secondary`, `--background`, `--foreground`, etc.
- **Spacing**: `--spacing-1` through `--spacing-12`
- **Typography**: `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, etc.
- **Font Weights**: `--font-weight-normal`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`
- **Border Radius**: `--radius`, `--radius-sm`, `--radius-lg`, etc.
- **Borders**: `--border`, `--border-width`, etc.

### 2. `/src/styles/fonts.css`
Defines font families:
- **Inter**: Primary UI font
- **Space Grotesk**: Alternative/accent font (if needed)

Only use fonts defined in this file.

### 3. `/src/styles/tailwind.css`
Imports Tailwind v4 base styles

### 4. `/src/styles/index.css`
Main entry point that imports all other stylesheets

## ✅ Correct Usage Patterns

### Colors
```tsx
// ✅ CORRECT - Uses CSS variables
<div style={{ 
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
  borderColor: "var(--border)"
}}>

// ❌ WRONG - Hardcoded Tailwind classes
<div className="bg-white text-black border-gray-300">
```

### Spacing
```tsx
// ✅ CORRECT - Uses CSS variables
<div style={{ 
  padding: "var(--spacing-4)",
  margin: "var(--spacing-2)",
  gap: "var(--spacing-3)"
}}>

// ❌ WRONG - Hardcoded spacing
<div className="p-4 m-2 gap-3">
```

### Typography
```tsx
// ✅ CORRECT - Uses CSS variables
<h1 style={{
  fontFamily: "Inter, sans-serif",
  fontSize: "var(--text-2xl)",
  fontWeight: "var(--font-weight-bold)",
  lineHeight: "var(--line-height-tight)"
}}>

// ❌ WRONG - Hardcoded typography
<h1 className="font-inter text-2xl font-bold leading-tight">
```

### Border Radius
```tsx
// ✅ CORRECT - Uses CSS variables
<div style={{ 
  borderRadius: "var(--radius)"
}}>

// ❌ WRONG - Hardcoded radius
<div className="rounded-md">
```

## 🎨 When to Use Tailwind Classes vs. CSS Variables

### Use Tailwind Classes For:
- **Layout**: `flex`, `grid`, `relative`, `absolute`, etc.
- **Display**: `block`, `inline-block`, `hidden`, etc.
- **Positioning**: `top-0`, `left-0`, `z-10`, etc.
- **Flexbox/Grid**: `flex-row`, `justify-between`, `items-center`, etc.
- **Sizing**: `w-full`, `h-screen`, `min-h-0`, etc.
- **Overflow**: `overflow-hidden`, `overflow-auto`, etc.
- **Transitions**: `transition-all`, `duration-200`, `ease-in-out`, etc.

### Use CSS Variables For:
- **Colors**: All background, text, border colors
- **Spacing**: Padding, margin, gap
- **Typography**: Font size, weight, line height
- **Border Radius**: All corner rounding
- **Shadows**: Box shadows (if using design system shadows)
- **Borders**: Border width, border color

## 📋 Component Examples

### Button Component
```tsx
// ✅ CORRECT
<button
  type="button"
  className="flex items-center justify-center transition-opacity"
  style={{
    fontFamily: "Inter, sans-serif",
    fontSize: "var(--text-base)",
    fontWeight: "var(--font-weight-medium)",
    padding: "var(--spacing-2) var(--spacing-4)",
    backgroundColor: "var(--primary)",
    color: "var(--primary-foreground)",
    borderRadius: "var(--radius)",
    border: "none",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
>
  Click Me
</button>
```

### Card Component
```tsx
// ✅ CORRECT
<div
  className="flex flex-col overflow-hidden"
  style={{
    backgroundColor: "var(--card)",
    color: "var(--card-foreground)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
    padding: "var(--spacing-6)",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  }}
>
  <h2 style={{
    fontFamily: "Inter, sans-serif",
    fontSize: "var(--text-xl)",
    fontWeight: "var(--font-weight-semibold)",
    marginBottom: "var(--spacing-4)",
  }}>
    Card Title
  </h2>
  <p style={{
    fontFamily: "Inter, sans-serif",
    fontSize: "var(--text-sm)",
    color: "var(--muted-foreground)",
  }}>
    Card content goes here
  </p>
</div>
```

### Modal Component
```tsx
// ✅ CORRECT
<div
  className="fixed inset-0 flex items-center justify-center z-50"
  style={{
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }}
>
  <div
    className="relative flex flex-col overflow-hidden"
    style={{
      backgroundColor: "var(--background)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border)",
      width: "90vw",
      maxWidth: "800px",
      maxHeight: "90vh",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    }}
  >
    {/* Modal content */}
  </div>
</div>
```

## 🚫 Common Mistakes

### ❌ Mistake 1: Mixing Tailwind Color Classes with Design System
```tsx
// WRONG
<div className="bg-blue-500 text-white p-4">
```

```tsx
// CORRECT
<div 
  className="flex items-center"
  style={{
    backgroundColor: "var(--primary)",
    color: "var(--primary-foreground)",
    padding: "var(--spacing-4)"
  }}
>
```

### ❌ Mistake 2: Hardcoding Spacing
```tsx
// WRONG
<div style={{ padding: "16px", margin: "8px" }}>
```

```tsx
// CORRECT
<div style={{ 
  padding: "var(--spacing-4)", 
  margin: "var(--spacing-2)" 
}}>
```

### ❌ Mistake 3: Using Non-Design-System Fonts
```tsx
// WRONG
<h1 className="font-sans">Title</h1>
```

```tsx
// CORRECT
<h1 style={{ fontFamily: "Inter, sans-serif" }}>Title</h1>
```

### ❌ Mistake 4: Hardcoded Border Radius
```tsx
// WRONG
<div className="rounded-lg">
```

```tsx
// CORRECT
<div style={{ borderRadius: "var(--radius-lg)" }}>
```

## 📊 Compliance Checklist

When creating or reviewing components:

- [ ] All colors use CSS variables (no `bg-blue-500`, `text-gray-600`, etc.)
- [ ] All spacing uses CSS variables (no hardcoded `px` values)
- [ ] All typography uses CSS variables for size and weight
- [ ] Only fonts from `/src/styles/fonts.css` are used
- [ ] Border radius uses CSS variables
- [ ] Tailwind classes only used for layout/positioning/display
- [ ] Inline styles use `var(--variable-name)` syntax
- [ ] Hover/active states respect design system colors

## 🔍 Auditing Existing Components

To check if a component follows design system:

1. **Look for hardcoded colors**:
   ```bash
   grep -E "(bg|text|border)-(red|blue|green|gray|slate|zinc)" component.tsx
   ```

2. **Look for hardcoded spacing**:
   ```bash
   grep -E "p-[0-9]|m-[0-9]|gap-[0-9]" component.tsx
   ```

3. **Look for hardcoded font sizes**:
   ```bash
   grep -E "text-(xs|sm|base|lg|xl|2xl)" component.tsx
   ```

If any matches found, refactor to use CSS variables.

## 🎯 Benefits of This Approach

1. **Theme Updates**: Change one CSS variable to update entire app
2. **Consistency**: All components use same design tokens
3. **Maintainability**: Single source of truth for design decisions
4. **Flexibility**: Easy to add dark mode, alternate themes, etc.
5. **Designer Handoff**: Designers can update CSS without touching React code

## 📝 Updating the Design System

To change design system values:

1. **Open `/src/styles/theme.css`**
2. **Modify CSS variable values**
3. **Changes propagate to ALL components automatically**

Example:
```css
/* Change primary color across entire app */
:root {
  --primary: 220 70% 50%; /* Old */
  --primary: 280 60% 55%; /* New - all buttons update! */
}
```

## 🚀 Quick Reference

| Category | Use CSS Variables | Use Tailwind Classes |
|----------|------------------|---------------------|
| Colors | ✅ Always | ❌ Never |
| Spacing | ✅ Always | ❌ Never |
| Typography | ✅ Always | ❌ Never |
| Layout | ❌ No | ✅ Always |
| Positioning | ❌ No | ✅ Always |
| Display | ❌ No | ✅ Always |
| Flexbox/Grid | ❌ No | ✅ Always |

---

**Remember**: If it affects VISUAL STYLING (colors, spacing, fonts), use CSS variables. If it affects LAYOUT (positioning, display, flexbox), use Tailwind classes.
