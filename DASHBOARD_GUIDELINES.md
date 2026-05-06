# RAMS Dashboard Design Guidelines

> **Mandatory.** Read and follow this file in full before building any dashboard page.  
> Reference project: `f:\Rack\Cursor\RAMS First Half (IRDS)`

---

## 1. PAGE WRAPPER

Every dashboard page must use this exact outer shell:

```tsx
<div className="flex-1 space-y-6 p-6 bg-[var(--background)]">
  {/* optional top action bar */}
  <div className="flex items-center justify-between">
    <div>{/* title / breadcrumb */}</div>
    <div className="flex items-center gap-2">{/* action buttons */}</div>
  </div>

  {/* rows of content go here */}
</div>
```

- Outer padding: `p-6` (24 px all sides)
- Vertical rhythm between rows: `space-y-6` (24 px)
- Background: always `bg-[var(--background)]`

---

## 2. THE 12-COLUMN GRID RULE

**Every row of widgets must sit inside a `grid grid-cols-12` container.**  
All cards/widgets inside it must carry a `col-span-*` that adds up to exactly 12.

```tsx
<div className="grid grid-cols-12 gap-6">
  {/* children must sum to 12 cols */}
</div>
```

### Allowed column splits

| Layout | col-span per card | Cards in row |
|---|---|---|
| 4 equal cards | `col-span-3` | 4 |
| 3 equal cards | `col-span-4` | 3 |
| 2 equal cards | `col-span-6` | 2 |
| Wide + narrow (2/3 + 1/3) | `col-span-8` + `col-span-4` | 2 |
| Full-width card / table | `col-span-12` | 1 |

**Never** use `col-span` values that don't sum to 12 within the same row.

---

## 3. KPI STAT CARDS

Use for top-of-dashboard summary numbers. Always 4 per row (`col-span-3` each).

### Structure

```tsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-3">
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)]">
          Fleet Size
        </CardTitle>
        <Truck className="h-4 w-4 text-[var(--muted-foreground)]" />
      </CardHeader>
      <CardContent>
        <div className="text-[length:var(--text-2xl)] font-[var(--font-weight-semi-bold)]">42</div>
        <p className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
          Total machines in operation
        </p>
      </CardContent>
    </Card>
  </div>
  {/* repeat × 3 */}
</div>
```

### Rules
- Card always has `shadow-none`
- Header is `flex flex-row items-center justify-between space-y-0 pb-2`
- Title uses `text-[length:var(--text-sm)] font-[var(--font-weight-medium)]`
- Icon is `h-4 w-4 text-[var(--muted-foreground)]` (use a relevant lucide icon)
- KPI value uses `text-[length:var(--text-2xl)] font-[var(--font-weight-semi-bold)]`
- Sub-label uses `text-[length:var(--text-xs)] text-[var(--muted-foreground)]`

---

## 4. CHART CARDS

### Half-width chart (`col-span-6`)

```tsx
<Card className="col-span-6 shadow-none border-[var(--border)]">
  <CardHeader>
    <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
      Chart Title
    </CardTitle>
    <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
      Short description of what the chart shows.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="w-full h-[300px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        {/* Recharts component */}
      </ChartContainer>
    </div>
  </CardContent>
</Card>
```

### Wide chart (`col-span-8`) + sidebar (`col-span-4`)

```tsx
<div className="grid grid-cols-12 gap-6">
  <Card className="col-span-8 shadow-none border-[var(--border)]">
    {/* chart */}
  </Card>
  <Card className="col-span-4 shadow-none border-[var(--border)]">
    {/* legend / recent activity / summary list */}
  </Card>
</div>
```

### Chart rules
- Always set an explicit height on the chart wrapper: `h-[300px]` or `h-[350px]`
- Use `ChartContainer` from `../../components/ui/chart` — never raw `ResponsiveContainer`
- Chart colors must come from CSS variables: `var(--primary)`, `var(--chart-1)` … `var(--chart-5)`
- `CartesianGrid`: `vertical={false} stroke="var(--border)"`
- `XAxis` / `YAxis`: `tickLine={false} axisLine={false} tick={{ fontSize: 11 }}`
- Add `ChartTooltip` and `ChartLegend` using the shadcn wrappers

---

## 5. TABLE CARDS

Full-width (`col-span-12`) or inside a grid row.

```tsx
<Card className="col-span-12 shadow-none border-[var(--border)]">
  <CardHeader>
    <div className="flex items-start justify-between">
      <div>
        <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
          Table Title
        </CardTitle>
        <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
          Description of the data shown.
        </CardDescription>
      </div>
      {/* optional: filter Select or action button */}
    </div>
  </CardHeader>
  <CardContent>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="px-6 h-12 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase tracking-wide">
              Column
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="h-12 border-b border-border hover:bg-muted/50">
            <TableCell className="px-6 text-[length:var(--text-sm)]">Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    {/* Pagination */}
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
      <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
        1–10 of 42
      </span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">Rows:</span>
          <Select defaultValue="10">
            <SelectTrigger className="h-8 w-16 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-muted rounded" disabled>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)] min-w-[40px] text-center">
            1 / 5
          </span>
          <button className="p-1 hover:bg-muted rounded">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

### Table rules
- Header row background: `bg-muted/50`
- Header cell: `px-6 h-12 text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase tracking-wide`
- Body row: `h-12 border-b border-border hover:bg-muted/50`
- Body cell: `px-6 text-[length:var(--text-sm)]`
- IDs / codes: add `text-[color:var(--primary)] font-mono font-semibold`
- Always include pagination when data can exceed 10 rows

---

## 6. TYPOGRAPHY SCALE

Use CSS variables exclusively — never hardcode font sizes or weights.

| Use | Class |
|---|---|
| KPI value (large number) | `text-[length:var(--text-2xl)] font-[var(--font-weight-semi-bold)]` |
| Card / section title | `text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]` |
| Card description | `text-[length:var(--text-xs)] text-[var(--muted-foreground)]` |
| Table header | `text-[length:var(--text-xs)] font-[var(--font-weight-semi-bold)] uppercase tracking-wide` |
| Table body cell | `text-[length:var(--text-sm)]` |
| Sub / helper text | `text-[length:var(--text-xs)] text-[var(--muted-foreground)]` |
| Mono ID (MHE-001) | `font-mono font-semibold text-[color:var(--primary)]` |

### Type scale reference
```
--text-xs:   12px
--text-sm:   14px
--text-base: 16px
--text-lg:   20px
--text-xl:   24px
--text-2xl:  30px
--text-4xl:  48px

--font-weight-normal:    400
--font-weight-medium:    500
--font-weight-semi-bold: 600
--font-weight-extra-bold:800
```

---

## 7. SPACING SCALE

Always use Tailwind utilities that map to these variables. Never use arbitrary `px-[13px]` values.

```
--spacing-1:  4px   → gap-1  / p-1
--spacing-2:  8px   → gap-2  / p-2
--spacing-3:  12px  → gap-3  / p-3
--spacing-4:  16px  → gap-4  / p-4
--spacing-5:  20px  → gap-5  / p-5
--spacing-6:  24px  → gap-6  / p-6   ← primary dashboard spacing
--spacing-8:  32px  → gap-8  / p-8
--spacing-10: 40px  → gap-10 / p-10
--spacing-12: 48px  → gap-12 / p-12
--spacing-16: 64px  → gap-16 / p-16
```

- Between rows in a dashboard: `space-y-6` (24 px)
- Between columns in a grid: `gap-6` (24 px)
- Card internal padding: handled automatically by `CardHeader` (`px-6 pt-6`) and `CardContent` (`px-6 pb-6`)

---

## 8. COLOR TOKENS

Use CSS variables — never raw hex values inside className or style.

| Token | Value | Use |
|---|---|---|
| `var(--background)` | `#ffffff` | Page background |
| `var(--foreground)` | `#0f172a` | Primary text |
| `var(--card)` | `#ffffff` | Card background |
| `var(--primary)` | `#2563eb` | Brand blue, links, active states |
| `var(--muted-foreground)` | `#64748b` | Secondary / helper text |
| `var(--border)` | `#e2e8f0` | Card and table borders |
| `var(--muted)` | `#f1f5f9` | Subtle backgrounds, hover states |
| `var(--destructive)` | `#ef4444` | Errors, critical alerts |
| `var(--warning)` | `#fbbf24` | Amber / warning states |
| `var(--success)` | `#22c55e` | Green / healthy states |
| `var(--chart-1..5)` | blues | Chart series colors |

---

## 9. STATUS BADGES

```tsx
<span
  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap"
  style={{ color: cfg.color, background: cfg.bg }}
>
  {label}
</span>
```

| Status | color | bg |
|---|---|---|
| Active / Healthy | `#16a34a` | `rgba(22,163,74,0.10)` |
| Expiring / Warning | `#d97706` | `rgba(217,119,6,0.10)` |
| Expired / Critical | `#ef4444` | `rgba(239,68,68,0.10)` |
| In Progress | `#2563eb` | `rgba(37,99,235,0.10)` |
| Inactive / Neutral | `#64748b` | `rgba(100,116,139,0.10)` |

---

## 10. CARD ANATOMY QUICK REFERENCE

```
┌─────────────────────────────────────────┐  ← rounded-xl border shadow-none
│  CardHeader  px-6 pt-6                  │
│  ┌─ CardTitle   (text-sm semi-bold) ──┐ │
│  └─ CardDescription (text-xs muted) ──┘ │
│  [optional CardAction top-right]         │
├─────────────────────────────────────────┤
│  CardContent  px-6 pb-6                 │
│  [chart / table / list / value]          │
└─────────────────────────────────────────┘
```

The `Card` component already applies: `flex flex-col gap-6 rounded-xl border bg-card`  
Do not re-add `rounded` or `bg-white` — they are built in.

---

## 11. COMPLETE DASHBOARD SKELETON

Copy this as a starting point for any new dashboard page:

```tsx
export function MyDashboard() {
  return (
    <div className="flex-1 space-y-6 p-6 bg-[var(--background)]">

      {/* ── Row 1: KPI Cards (4 × col-span-3 = 12) ── */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { title: "Metric A", value: "—", desc: "Description", icon: SomeIcon },
          { title: "Metric B", value: "—", desc: "Description", icon: SomeIcon },
          { title: "Metric C", value: "—", desc: "Description", icon: SomeIcon },
          { title: "Metric D", value: "—", desc: "Description", icon: SomeIcon },
        ].map(({ title, value, desc, icon: Icon }) => (
          <div key={title} className="col-span-3">
            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-medium)]">
                  {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-[var(--muted-foreground)]" />
              </CardHeader>
              <CardContent>
                <div className="text-[length:var(--text-2xl)] font-[var(--font-weight-semi-bold)]">{value}</div>
                <p className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">{desc}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* ── Row 2: Two equal charts (2 × col-span-6 = 12) ── */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-6 shadow-none border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
              Chart One
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              What this chart shows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              {/* ChartContainer + Recharts */}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-6 shadow-none border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
              Chart Two
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              What this chart shows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              {/* ChartContainer + Recharts */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Full-width table (col-span-12) ── */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 shadow-none border-[var(--border)]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
                  Table Title
                </CardTitle>
                <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
                  Table description.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                {/* TableHeader + TableBody */}
              </Table>
            </div>
            {/* pagination */}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
```

---

## 12. CHECKLIST BEFORE SUBMITTING A DASHBOARD

- [ ] Page wrapper uses `flex-1 space-y-6 p-6 bg-[var(--background)]`
- [ ] Every row of widgets sits inside `grid grid-cols-12 gap-6`
- [ ] All `col-span-*` values in each row sum to exactly **12**
- [ ] KPI cards: 4 per row, `col-span-3`, `shadow-none`, `text-[length:var(--text-2xl)]` value
- [ ] Chart cards: explicit height wrapper `h-[300px]` or `h-[350px]`, uses `ChartContainer`
- [ ] Table cards: header row `bg-muted/50`, cells `px-6 h-12`, pagination included
- [ ] All font sizes use `text-[length:var(--text-*)]`, all weights use `font-[var(--font-weight-*)]`
- [ ] All colors use CSS variable tokens — no raw hex in `className`
- [ ] Status badges use the inline-flex pill pattern with `style={{ color, background }}`
- [ ] No nested grids — Row 2, Row 3, Row 4 are siblings, not children of each other
