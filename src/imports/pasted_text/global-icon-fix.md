To resolve this **across the entire project**, fix it at the **design-system level (Button + Icon usage)** instead of changing every screen.

Below is the **minimal global fix**.

---

# Root Issue

Two patterns are causing the blue background/icon problems everywhere:

1. **SVG color forcing**

```
[&_svg]:text-...
```

2. Icons not inheriting color properly.

---

# Global Fix (Design System Level)

## 1. Remove all SVG forcing selectors

Search in project and remove patterns like:

```
[&_svg]:text-
hover:[&_svg]:text-
```

These override icon color everywhere.

---

## 2. Make all icons inherit color

Where icons are rendered:

```tsx
<domain.icon className="h-5 w-5" />
```

Change to:

```tsx
<domain.icon className="h-5 w-5 text-current" />
```

`text-current` ensures icons follow the button text color.

---

## 3. Fix base button for icon usage

In **button.tsx** (design system), update icon button styling.

Replace any global rule like:

```
[&_svg]:pointer-events-none
```

with:

```
svg {
  color: currentColor;
}
```

Or if using Tailwind:

```tsx
className="inline-flex items-center justify-center [&>svg]:size-4"
```

(No color forcing)

---

## 4. Standardize icon buttons

Use this everywhere:

```tsx
<Button variant="ghost" size="icon">
  <Icon className="h-5 w-5 text-current" />
</Button>
```

---

# Sidebar Button Example (Correct)

```tsx
<Button
  variant="ghost"
  size="icon"
  className={cn(
    "h-12 w-12 rounded-lg transition-colors",
    activeDomainId === domain.id
      ? "bg-sidebar-primary text-sidebar-primary-foreground"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  )}
>
  <domain.icon className="h-5 w-5 text-current" />
</Button>
```

---

# Result

After this global fix:

✔ Sidebar active icon = blue
✔ Other sidebar icons = neutral
✔ Table action icons = neutral
✔ No random blue icons
✔ Consistent icon coloring across the project

---

If you want, I can also show the **cleanest production-ready Button component (shadcn style)** that prevents these problems permanently.
