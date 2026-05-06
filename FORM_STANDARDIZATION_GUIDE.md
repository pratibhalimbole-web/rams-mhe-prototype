# 🎯 GLOBAL INPUT STANDARDIZATION GUIDE

## Overview

This guide ensures **all form inputs across the entire project** use the official ShadCN design system components and patterns for full consistency.

---

## ✅ Required Changes (Project-Wide)

### 1. Replace All Raw HTML `<input>` Elements

**❌ BAD - Raw Input:**
```tsx
<input type="text" placeholder="Enter value" />
```

**✅ GOOD - ShadCN Form Pattern:**
```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input {...field} type="text" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### 2. Required Imports

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
```

---

### 3. Schema Definition with Zod

```tsx
const formSchema = z.object({
  baseLimit: z.number().min(0, "Must be greater than or equal to 0"),
  elementName: z.string().min(1, "Element name is required"),
  crossAisleLimit: z.number().min(0, "Must be greater than or equal to 0"),
})

type FormValues = z.infer<typeof formSchema>
```

---

### 4. Form Initialization

```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    baseLimit: 0,
    elementName: "",
    crossAisleLimit: 0,
  },
})
```

---

### 5. Form Submission Handler

```tsx
const onSubmit = (data: FormValues) => {
  console.log("Form submitted:", data)
  // Handle form submission
}
```

---

### 6. Complete Form Structure

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    {/* Text Input Field */}
    <FormField
      control={form.control}
      name="elementName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Element Name</FormLabel>
          <FormControl>
            <Input {...field} type="text" className="h-11" />
          </FormControl>
          <FormMessage className="text-[#E72547]" />
        </FormItem>
      )}
    />

    {/* Number Input Field */}
    <FormField
      control={form.control}
      name="baseLimit"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Base Limit (mm)</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              type="number" 
              className="h-11"
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormMessage className="text-[#E72547]" />
        </FormItem>
      )}
    />

    <Button type="submit">Submit</Button>
  </form>
</Form>
```

---

## 📋 Component Patterns

### Number Input with Validation

```tsx
<FormField
  control={form.control}
  name="crossAisleLimit"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Cross-Aisle Limit (mm)
        <span className="text-destructive ml-1">*</span>
      </FormLabel>
      <FormControl>
        <Input
          {...field}
          type="number"
          min={0}
          step={0.1}
          className="h-11"
          onChange={(e) => field.onChange(Number(e.target.value))}
        />
      </FormControl>
      <FormMessage className="text-[#E72547]" />
    </FormItem>
  )}
/>
```

---

### Switch/Toggle Input

```tsx
import { Switch } from "@/components/ui/switch"

<FormField
  control={form.control}
  name="isEnabled"
  render={({ field }) => (
    <FormItem className="flex items-center justify-between">
      <FormLabel>Enable Feature</FormLabel>
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### Select/Dropdown Input

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<FormField
  control={form.control}
  name="testType"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Test Type</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select test type" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="upright">Upright</SelectItem>
          <SelectItem value="beam">Beam</SelectItem>
          <SelectItem value="base">Base</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### Textarea Input

```tsx
import { Textarea } from "@/components/ui/textarea"

<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea {...field} rows={4} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### Search Input (with Icon)

```tsx
import { Search } from "lucide-react"

<div className="relative w-full sm:w-[350px]">
  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  <FormField
    control={form.control}
    name="searchQuery"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            placeholder="Search..."
            className="pl-8 h-11"
          />
        </FormControl>
      </FormItem>
    )}
  />
</div>
```

---

### Disabled/Read-Only Input

```tsx
<FormField
  control={form.control}
  name="elementId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Element ID</FormLabel>
      <FormControl>
        <Input {...field} disabled className="h-11" />
      </FormControl>
    </FormItem>
  )}
/>
```

---

## 🎨 Styling Standards

### Input Height
```tsx
className="h-11" // 44px standard height for all inputs
```

### Spacing Between Fields
```tsx
<form className="space-y-6"> // or space-y-4 for tighter spacing
```

### Error Message Color
```tsx
<FormMessage className="text-[#E72547]" />
```

### Design Token Usage
```tsx
style={{
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-weight-medium)",
  fontFamily: "'Inter', sans-serif",
}}
```

---

## 🚫 What NOT to Do

### ❌ Never Use Placeholders as Labels
```tsx
// BAD
<Input placeholder="Element Name" />

// GOOD
<FormItem>
  <FormLabel>Element Name</FormLabel>
  <FormControl>
    <Input placeholder="e.g., Upright-A1" />
  </FormControl>
</FormItem>
```

### ❌ Never Use Raw `<input>` Tags
```tsx
// BAD
<input type="number" value={value} onChange={handleChange} />

// GOOD - Use ShadCN Input component
<FormControl>
  <Input {...field} type="number" />
</FormControl>
```

### ❌ Never Use Custom CSS for Inputs
```tsx
// BAD
<input className="custom-input-class" />

// GOOD - Use ShadCN styling
<Input className="h-11 bg-input-background border-border" />
```

---

## 📦 Component Reference

### Available ShadCN Form Components

| Component | Import | Usage |
|-----------|--------|-------|
| Form | `import { Form } from "@/components/ui/form"` | Wrapper for entire form |
| FormField | `import { FormField } from "@/components/ui/form"` | Individual field wrapper |
| FormItem | `import { FormItem } from "@/components/ui/form"` | Field container |
| FormLabel | `import { FormLabel } from "@/components/ui/form"` | Field label |
| FormControl | `import { FormControl } from "@/components/ui/form"` | Input control wrapper |
| FormMessage | `import { FormMessage } from "@/components/ui/form"` | Error/validation message |
| Input | `import { Input } from "@/components/ui/input"` | Text/number input |
| Textarea | `import { Textarea } from "@/components/ui/textarea"` | Multi-line text |
| Select | `import { Select } from "@/components/ui/select"` | Dropdown select |
| Switch | `import { Switch } from "@/components/ui/switch"` | Toggle switch |

---

## 🧪 Validation Patterns

### Required Field
```tsx
fieldName: z.string().min(1, "This field is required")
```

### Number with Min/Max
```tsx
baseLimit: z.number()
  .min(0, "Must be at least 0")
  .max(1000, "Must be less than 1000")
```

### Email Validation
```tsx
email: z.string().email("Invalid email address")
```

### Custom Validation
```tsx
crossAisleLimit: z.number().refine(
  (val) => val > 0 && val < 1000,
  { message: "Must be between 0 and 1000" }
)
```

---

## 🔍 Files to Update

Based on project search, these files contain raw inputs that need refactoring:

1. `/src/app/components/dashboard/RulesAndAction.tsx` - Search inputs, form inputs
2. `/src/app/components/dashboard/CreateBOQ.tsx` - BOQ ID input
3. `/src/app/components/dashboard/AddManualItemsSheet.tsx` - Search and quantity inputs
4. `/src/app/components/dashboard/BillOfQuantity.tsx` - Search input
5. `/src/app/components/dashboard/ElementStockManagement.tsx` - Quantity update input
6. `/src/app/components/dashboard/EvaluationConfigDrawer.tsx` - Limit inputs ✅ **Updated**
7. `/src/app/components/dashboard/IntegritySummary.tsx` - Search input
8. `/src/app/components/dashboard/TestThresholdInputPanel.tsx` - Threshold value inputs

---

## ✨ Expected Outcome

After applying these standards:

✅ All inputs visually identical across the project
✅ Consistent label spacing and typography
✅ Unified error message styling (#E72547)
✅ Standardized validation patterns
✅ Type-safe form handling with TypeScript
✅ Automatic accessibility attributes
✅ Consistent 44px input height
✅ No raw `<input>` tags outside ShadCN components

---

## 📌 Quick Migration Checklist

- [ ] Install required dependencies (`react-hook-form`, `@hookform/resolvers`, `zod`)
- [ ] Import ShadCN form components
- [ ] Define Zod schema for validation
- [ ] Initialize form with `useForm` hook
- [ ] Wrap all inputs in `<FormField>` pattern
- [ ] Replace placeholders with proper `<FormLabel>`
- [ ] Add `<FormMessage>` for error display
- [ ] Test validation and submission
- [ ] Remove all raw `<input>` tags
- [ ] Apply consistent styling (44px height, design tokens)

---

## 🎓 Additional Resources

- [ShadCN Form Documentation](https://ui.shadcn.com/docs/components/form)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Validation Documentation](https://zod.dev/)

---

**Last Updated:** February 12, 2026
**Version:** 1.0.0
