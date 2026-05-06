# Design System Usage Guide

## Overview
This document defines how to properly use CSS variables from `/src/styles/theme.css` in all UI components. All styling MUST use these variables to ensure design consistency and allow easy theme updates.

## ✅ CORRECT Usage Examples

### Colors
```tsx
// ✅ CORRECT - Using CSS variables
<div className="bg-background text-foreground">
<Button className="bg-primary text-primary-foreground">
<div className="border border-border">
<p className="text-muted-foreground">

// ❌ WRONG - Hardcoded Tailwind classes
<div className="bg-white text-gray-900">
<Button className="bg-blue-600 text-white">
<div className="border border-gray-200">
<p className="text-gray-500">
```

### Typography
```tsx
// ✅ CORRECT - Using CSS variable font sizes
<h1 className="text-[length:var(--text-4xl)] font-[number:var(--font-weight-extra-bold)]">
<h2 className="text-[length:var(--text-2xl)] font-[number:var(--font-weight-semi-bold)]">
<h3 className="text-[length:var(--text-xl)] font-[number:var(--font-weight-semi-bold)]">
<p className="text-[length:var(--text-base)] font-[number:var(--font-weight-normal)]">
<label className="text-[length:var(--text-sm)] font-[number:var(--font-weight-medium)]">
<span className="text-[length:var(--text-xs)]">

// ❌ WRONG - Hardcoded Tailwind sizes
<h1 className="text-5xl font-extrabold">
<h2 className="text-3xl font-semibold">
<p className="text-base font-normal">
```

### Spacing
```tsx
// ✅ CORRECT - Using CSS variable spacing
<div className="p-[--spacing-4] gap-[--spacing-3]">
<div className="mt-[--spacing-6] mb-[--spacing-2]">
<div className="space-y-[--spacing-4]">

// ❌ WRONG - Hardcoded Tailwind spacing
<div className="p-4 gap-3">
<div className="mt-6 mb-2">
<div className="space-y-4">
```

### Border Radius
```tsx
// ✅ CORRECT - Using CSS variable radius
<div className="rounded-[--radius]">
<Button className="rounded-[--radius-sm]">
<Checkbox className="rounded-[--radius-xs]">

// ❌ WRONG - Hardcoded Tailwind radius
<div className="rounded-md">
<Button className="rounded-sm">
<Checkbox className="rounded">
```

### Inline Styles (when necessary)
```tsx
// ✅ CORRECT - Using CSS variables in inline styles
<div style={{ 
  backgroundColor: "var(--card)",
  color: "var(--card-foreground)",
  padding: "var(--spacing-4)",
  borderRadius: "var(--radius)",
  fontSize: "var(--text-base)",
  fontWeight: "var(--font-weight-medium)"
}}>
```

## 🎨 Available CSS Variables

### Colors
- `--background` / `--foreground`
- `--card` / `--card-foreground`
- `--popover` / `--popover-foreground`
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--muted` / `--muted-foreground`
- `--accent` / `--accent-foreground`
- `--destructive` / `--destructive-foreground`
- `--warning`
- `--success`
- `--border`
- `--input` / `--input-background`
- `--ring`

### Typography Sizes
- `--text-4xl` (48px)
- `--text-2xl` (30px)
- `--text-xl` (24px)
- `--text-lg` (20px)
- `--text-base` (16px)
- `--text-sm` (14px)
- `--text-xs` (12px)

### Font Weights
- `--font-weight-extra-bold` (800)
- `--font-weight-semi-bold` (600)
- `--font-weight-medium` (500)
- `--font-weight-normal` (400)

### Spacing
- `--spacing-1` (4px)
- `--spacing-2` (8px)
- `--spacing-3` (12px)
- `--spacing-4` (16px)
- `--spacing-5` (20px)
- `--spacing-6` (24px)
- `--spacing-8` (32px)
- `--spacing-10` (40px)
- `--spacing-12` (48px)

### Border Radius
- `--radius-xs` (2px)
- `--radius-sm` (3px)
- `--radius` (6px)

### Charts
- `--chart-1` through `--chart-5`

### Sidebar
- `--sidebar` / `--sidebar-foreground`
- `--sidebar-primary` / `--sidebar-primary-foreground`
- `--sidebar-accent` / `--sidebar-accent-foreground`
- `--sidebar-border`
- `--sidebar-ring`

## 📏 Font Family
All text MUST use: `font-family: 'Inter', sans-serif;`

This is automatically applied through base styles in theme.css, but can be explicitly set when needed.

## 🚫 What NOT to Use

### Avoid These Hardcoded Values:
- ❌ `text-gray-500` → Use `text-muted-foreground`
- ❌ `bg-blue-600` → Use `bg-primary`
- ❌ `text-white` → Use `text-primary-foreground` or `text-background`
- ❌ `border-gray-200` → Use `border-border`
- ❌ `p-4` → Use `p-[--spacing-4]`
- ❌ `text-sm` → Use `text-[length:var(--text-sm)]`
- ❌ `font-semibold` → Use `font-[number:var(--font-weight-semi-bold)]`
- ❌ `rounded-md` → Use `rounded-[--radius]`

## 🎯 Key Principles

1. **Always use CSS variables** for colors, spacing, typography, and radii
2. **Use Tailwind utility classes** only when they reference your CSS variables
3. **Font family** is Inter - already applied globally
4. **Allow theme customization** - users can update the entire app by editing `/src/styles/theme.css`
5. **Consistency** - every component should follow these patterns

## 🔧 Migration Strategy

When updating existing components:
1. Find hardcoded colors → Replace with semantic color variables
2. Find hardcoded spacing → Replace with spacing variables
3. Find hardcoded font sizes → Replace with text size variables
4. Find hardcoded font weights → Replace with weight variables
5. Find hardcoded border radius → Replace with radius variables
