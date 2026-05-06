# Chart Components

Reusable, standardized chart components for the RAMS Dashboard application.

## LineChartMain

A fully responsive, enterprise-ready line chart component with consistent styling, variant-based colors, and optional threshold support.

### Features

- ✅ **Responsive Design**: Adapts to container width
- ✅ **Consistent Styling**: Uses design system variables from `/src/styles/theme.css`
- ✅ **Variant-based Colors**: Contextual colors (default, risk, success, danger, warning)
- ✅ **Optional Threshold Line**: Display reference lines for targets/limits
- ✅ **Standardized Height**: Default 280px, configurable
- ✅ **Area Fill Support**: Optional gradient area fill
- ✅ **Trend Indicators**: Display trend percentage with visual indicators
- ✅ **Enterprise Typography**: Uses Inter font from design system

### Basic Usage

```tsx
import { LineChartMain } from "@/app/components/charts";

const data = [
  { date: "Jan", value: 25 },
  { date: "Feb", value: 30 },
  { date: "Mar", value: 45 },
];

function MyChart() {
  return (
    <LineChartMain
      title="Monthly Performance"
      description="Tracking key metrics over time"
      data={data}
      dataKey="value"
      xKey="date"
      variant="default"
    />
  );
}
```

### Advanced Usage with Threshold

```tsx
<LineChartMain
  title="Risk Index Trend"
  description="Tracking weighted risk score over time"
  data={riskData}
  dataKey="score"
  xKey="date"
  trend={180}
  threshold={{
    value: 40,
    label: "Acceptable Threshold",
  }}
  footerText="Risk score increased from 25 to 70 in April 2024"
  variant="risk"
  height={280}
  yAxisLabel="Weighted Risk Score"
  showArea={true}
/>
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | Chart title displayed in header |
| `description` | `string` | ❌ | - | Optional subtitle/description |
| `data` | `any[]` | ✅ | - | Array of data points |
| `dataKey` | `string` | ✅ | - | Key name for Y-axis values |
| `xKey` | `string` | ✅ | - | Key name for X-axis values |
| `variant` | `"default" \| "risk" \| "success" \| "danger" \| "warning"` | ❌ | `"default"` | Color variant using design system |
| `trend` | `number` | ❌ | - | Trend percentage (positive or negative) |
| `threshold` | `{ value: number; label: string }` | ❌ | - | Optional reference line |
| `footerText` | `string` | ❌ | - | Additional context text in footer |
| `height` | `number` | ❌ | `280` | Chart height in pixels |
| `yAxisLabel` | `string` | ❌ | - | Label for Y-axis |
| `showArea` | `boolean` | ❌ | `true` | Show gradient area fill |
| `onClick` | `(e: any) => void` | ❌ | - | Click handler for chart |

### Color Variants

The component supports the following variants, mapped to design system CSS variables:

- **default**: `--chart-1` (Blue)
- **risk**: `--chart-4` (Red) with gradient from green → amber → red
- **success**: `--chart-2` (Green)
- **danger**: `--chart-4` (Red)
- **warning**: `--chart-3` (Amber)

### Gradient Area Fill

When `showArea={true}`, the component displays a gradient fill beneath the line:

- **risk variant**: Uses a gradient from green (`--chart-2`) → amber (`--chart-3`) → red (`--chart-4`)
- **other variants**: Uses a single-color gradient based on the variant color

### Styling Standards

All charts follow these standards:

- **Border Radius**: `var(--radius-lg)`
- **Spacing**: Uses design system spacing variables (`--spacing-2`, `--spacing-4`, etc.)
- **Typography**: Inter font family with design system font sizes
- **Grid**: Horizontal grid lines only, 3-3 dash pattern
- **Axes**: No tick lines or axis lines, clean minimal design
- **Stroke Width**: 3px for visibility
- **No Animation**: `isAnimationActive={false}` for better performance

### Design System Integration

This component strictly adheres to the design system defined in:
- `/src/styles/theme.css` - Colors, spacing, typography, radius
- `/src/styles/fonts.css` - Font faces

All styling uses CSS variables, allowing global theme updates by modifying the CSS files.

### Migration from Legacy Charts

If you have an existing line chart implementation, refactor it as follows:

**Before:**
```tsx
<Card className="shadow-sm border bg-card">
  <CardHeader className="pb-2">
    <CardTitle>Risk Index Trend</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig} className="h-[260px]">
      <LineChart data={riskData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" />
        <YAxis />
        <Line dataKey="score" stroke="red" />
      </LineChart>
    </ChartContainer>
  </CardContent>
</Card>
```

**After:**
```tsx
<LineChartMain
  title="Risk Index Trend"
  data={riskData}
  dataKey="score"
  xKey="date"
  variant="risk"
/>
```

### Benefits

✅ **Consistency**: All line charts look and behave the same  
✅ **Maintainability**: Single source of truth for styling updates  
✅ **Accessibility**: Proper ARIA labels and semantic structure  
✅ **Performance**: Optimized rendering with disabled animations  
✅ **Scalability**: Easy to add new charts across the project  
✅ **Design System Compliance**: Automatic adherence to theme variables  

---

## Future Chart Components

Additional chart components will be added following the same pattern:
- `BarChartMain`
- `PieChartMain`
- `AreaChartMain`
- `ComposedChartMain`
