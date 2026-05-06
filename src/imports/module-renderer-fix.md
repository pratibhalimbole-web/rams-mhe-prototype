I checked your **actual code**, and I can see exactly why **charts and other previews are not appearing after Save Configuration**.

Your renderer logic is **correct**, but the **condition to render the preview is too strict**.

Let me show you the exact issue.

---

# The Critical Condition in Your Code

In `ModuleRenderer` you have:

```tsx
if (config?.isSaved && representationType) {
  switch (representationType) {
    case 'table':
      return <TableRepresentationPreview config={config} />;
    case 'chart':
      return <ChartRepresentationPreview config={config} />;
    case 'heatmap':
      return <HeatmapRepresentationPreview config={config} />;
    case 'hybrid':
      return <HybridRepresentationPreview config={config} />;
  }
}
```

This means **preview will render ONLY if**

```
config.isSaved === true
AND
representationType exists
```

---

# Why Table Works but Chart Doesn't

Table preview probably works because **TableRepresentationPreview doesn't depend on data mapping**.

But your **ChartRepresentationPreview has another check**:

```tsx
if (!config?.xAxisField || !config?.yAxisField) {
  return "Chart Not Configured"
}
```

So if these fields are missing, **chart preview will not render**.

---

# Another Possible Issue

When saving configuration, you might only be saving:

```
chartType
```

but not saving:

```
xAxisField
yAxisField
```

So the renderer receives:

```js
config = {
  chartType: "bar"
}
```

Which triggers this:

```
Chart Not Configured
```

---

# The Real Fix

Your **Save Configuration** must store these fields:

```
representationType
chartType
xAxisField
yAxisField
aggregationMethod
groupBy
isSaved: true
```

Example saved config:

```js
config: {
  isSaved: true,
  chartType: "bar",
  xAxisField: "report_period",
  yAxisField: "total_inspections",
  aggregationMethod: "sum",
  groupBy: null
}
```

---

# Another Thing I Noticed

Your renderer is correct here:

```tsx
const { type, tag, name, representationType, config } = module;
```

But **representationType must also be saved in the module state**, not just inside config.

So your module should look like:

```js
{
  name: "Compliance Score",
  representationType: "chart",
  config: { ... }
}
```

If representationType is not saved properly, the switch never runs.

---

# Quick Debug Checklist

Check these 3 things:

### 1️⃣ After save

Log module state:

```js
console.log(module)
```

You should see:

```
representationType: "chart"
config.isSaved: true
```

---

### 2️⃣ Ensure fields exist

```
config.xAxisField
config.yAxisField
```

---

### 3️⃣ Ensure Save sets isSaved

```
config.isSaved = true
```

---

# If you want, send me **this one file next**

```
ModuleSettingsPanel.tsx
```

That file likely contains the **Save Configuration logic**, and I can pinpoint the exact line causing the problem.
