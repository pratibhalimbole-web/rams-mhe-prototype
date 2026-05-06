# VARIATION 1: MHE Fleet Management Dashboard — Complete Summary

## 📋 Overview

**Variation 1** is the **original, functional MHE Fleet Management Dashboard** designed to monitor and manage Material Handling Equipment (MHE) assets. It provides a comprehensive view of fleet health, equipment status, inspection findings, and warranty management across all MHE units in operation.

**Purpose:** Real-time operational monitoring and maintenance compliance tracking for warehouse/logistics MHE operations.

---

## 🏗️ Dashboard Structure

Variation 1 is organized in **4 rows** with a grid-based 12-column layout:

```
┌─────────────────────────────────────────────────────┐
│ Row 1: 4 KPI Cards (Key Metrics Overview)           │
├──────────────────────┬──────────────────────────────┤
│ Row 2: Health Chart  │ Failure Distribution Chart   │
├──────────────────────┬──────────────────────────────┤
│ Row 3: Inspection    │ Severity Timeline            │
│        Attention     │                              │
├─────────────────────────────────────────────────────┤
│ Row 4: Warranty Expiry Monitoring (Full Width)      │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Detailed Component Breakdown

### **ROW 1: KPI Cards (4 × col-span-3)**

#### What It Shows
High-level fleet health indicators at a glance.

#### Each KPI Card:

| Card Name | Value | Meaning | Icon |
|-----------|-------|---------|------|
| **Fleet Size** | 42 | Total number of MHE machines currently in the system | Truck |
| **Fleet Utilization** | 78% | Percentage of fleet actively in use/operation | Activity |
| **Fleet Safety Score** | 92% | Overall safety performance rating (inspection findings aggregate) | ShieldCheck |
| **Sensor Health** | 95% | Percentage of active IoT sensors functioning properly | Wifi |

#### Purpose
Provides a quick health snapshot before diving into detailed analysis.

#### Filter Cases
**None** — KPI cards are static summaries. They aggregate data across all equipment types.

---

### **ROW 2: Two Charts**

#### Widget 1: Fleet Equipment Health Distribution (Left, col-span-6)

**What It Shows:**
Warranty validity status breakdown for all MHE units (or filtered by equipment type).

**Visualization:** Donut Chart with center total count

**Data Categories:**
- **No Issues** — Warranty valid, no findings
- **Green** — Active warranty, minor findings noted
- **Amber** — Warranty expiring soon OR pending issues
- **Red** — Warranty expired OR critical findings

**Center Display:**
- Total count of machines in selected category
- Label: "Total MHEs"

**Filter Options:**
```
Dropdown: "Select Equipment"
├── Overall (all equipment combined)
├── Electric Forklift
├── Reach Truck
└── Pallet Jack
```

**How Filtering Works:**
1. User selects equipment type from dropdown
2. Chart data switches to `equipmentHealthDataByType[selectedEquipment]`
3. Donut chart re-renders with type-specific data
4. Center count updates dynamically
5. Legend adjusts to show only relevant status categories

**Example:**
- Select "Electric Forklift" → shows only Electric Forklift warranty breakdown
- Select "Overall" → aggregates all equipment types

---

#### Widget 2: Component Failure Distribution (Right, col-span-6)

**What It Shows:**
Frequency of inspection findings by component/part name across selected equipment type.

**Visualization:** Stacked Bar Chart

**Chart Axis:**
- **X-Axis:** Component/Part name (e.g., "Battery", "Hydraulics", "Motor", etc.)
- **Y-Axis:** Count of findings

**Bar Segments (Stacked):**
Each bar is divided into colored segments showing severity:
1. **"No Issues"** — Dark Blue (hsl(217, 98%, 54%))
2. **"Green"** — Blue (hsl(222, 84%, 62%))
3. **"Amber"** — Light Blue (hsl(226, 75%, 68%))
4. **"Red"** — Very Light Blue (hsl(230, 67%, 85%))

**Hover Behavior:**
- Tooltip shows exact count for each severity level
- Highlights the hovered bar segment

**Filter Options:**
```
Dropdown: "Select Equipment"
├── Electric Forklift
├── Reach Truck
└── Pallet Jack
```

**How Filtering Works:**
1. User selects equipment type
2. System filters inspection data to show only that equipment type
3. Bar chart recalculates component failure counts for filtered data
4. Chart re-renders with updated data
5. Scrollable if more than 5 components exist (`min-w-[600px]` triggered)

**Example:**
- Select "Electric Forklift" → shows components with issues for all Electric Forklifts combined
- Select "Reach Truck" → shows components with issues for all Reach Trucks combined

---

### **ROW 3: Two Widgets**

#### Widget 3: Machines Requiring Inspection Attention (Left, col-span-6)

**What It Shows:**
List of MHE units with recent warning or critical findings from inspections.

**Height:** Fixed at 448px (scrollable if more than ~8 machines)

**Display Format:** Card-based list (one card per machine)

**Each Card Contains:**

1. **Header Section:**
   - Machine Icon (Truck)
   - **MHE ID** (e.g., "MHE-001") — Primary identifier
   - **Last Inspection Date** (formatted as "Day Mon, Year")
   - **Status Badge** (right side) — Shows severity:
     - 🟢 **"All Good"** — No red/amber findings (green background)
     - 🔵 **"Most Issues: [Part Name]"** — Primary problem component highlighted (blue background)

2. **Findings Summary Row:**
   - Red count (with color dot)
   - Amber count (with color dot)
   - Green count (with color dot)
   - Total Parts count

**Filter Options:**
```
Dropdown: "Select Equipment" (shared with Row 2 Widget 2)
├── Electric Forklift
├── Reach Truck
└── Pallet Jack
```

**How Filtering Works:**
1. User selects equipment type
2. `machinesInspectionData` is filtered to show only machines of that type
3. Card list re-renders with filtered machines
4. Only machines matching selected equipment type are displayed
5. If no machines of that type have findings, list appears empty

**Data Dependencies:**
```
machinesInspectionData = [
  {
    mheId: "MHE-001",
    lastInspection: Date,
    redFindings: 2,
    amberFindings: 1,
    greenFindings: 5,
    parts: 8
  },
  ...
]
```

**Color Coding:**
- **Red Findings:** `var(--destructive)` (critical issues)
- **Amber Findings:** `var(--warning)` (pending issues)
- **Green Findings:** `var(--success)` (resolved/minor issues)

---

#### Widget 4: MHE Inspection Severity Timeline (Right, col-span-6)

**What It Shows:**
Chronological timeline of inspection severity events across the fleet.

**Component:** `<MheInspectionSeverityTimeline />` (separate custom component)

**Purpose:** Visual trend analysis — shows when critical findings occur and patterns over time.

**Likely Display:**
- Horizontal or vertical timeline
- Color-coded by severity (red = critical, amber = warning, green = resolved)
- Time progression left-to-right or top-to-bottom
- Interactive hover/click for detail view

**Filter Cases:**
- Likely filters by equipment type (uses `selectedEquipment` state)
- May also support date range filtering

---

### **ROW 4: Warranty Expiry Monitoring (Full Width, col-span-12)**

**What It Shows:**
Critical warranty expiry status for all MHE units with expired or soon-to-expire licenses.

**Visualization:** System Table (standard data table)

**Table Columns:**

| Column | Content | Format |
|--------|---------|--------|
| **MHE Type** | Equipment type | Text (Electric Forklift, Reach Truck, etc.) |
| **MHE ID** | Unique identifier | Monospace font (e.g., "MHE-001") |
| **License Expiry** | Expiration date | Formatted date (e.g., "15 Jan, 2024") |
| **Days Remaining** | Countdown | Number with "Days" label |
| **Status** | Expiry state | Badge (Expiring / Expired) |
| **Action** | User action | Button ("Renew") |

**Row Properties:**
- Hover state: `hover:bg-muted/50` (light background highlight)
- Border: Subtle bottom border (`border-b border-border`)
- Height: 48px per row
- Max visible rows: 5 (with pagination/scrolling for more)

**Filter Options:**
```
Dropdown: "Select Equipment Type" (shared with Warranty section)
├── All (shows all equipment types)
├── Electric Forklift
├── Reach Truck
├── Pallet Jack
├── Order Picker
└── Tow Tractor
```

**How Filtering Works:**

```javascript
warrantyExpiryData
  .filter(row => 
    (row.status === "expiring" || row.status === "expired") &&  // 1. Filter by status
    (selectedWarrantyFilter === "All" || 
     row.mheType === selectedWarrantyFilter)                     // 2. Filter by equipment type
  )
  .slice(0, 5)                                                   // 3. Show first 5 rows
  .map(row => <TableRow ... />)
```

**Step-by-step Filtering Logic:**

1. **Status Filter (Implicit):**
   - Only shows rows where `status === "expiring"` OR `status === "expired"`
   - Excludes "active" (valid warranties)

2. **Equipment Type Filter (User-Controlled):**
   - If `selectedWarrantyFilter === "All"` → Show all equipment types
   - If specific type selected → Show only that equipment type's rows
   - Example: Select "Electric Forklift" → Only shows expiring/expired Electric Forklifts

3. **Pagination:**
   - Displays first 5 rows only
   - Implies pagination controls exist (or scrolling for remaining rows)

**Status Badge Behavior:**

```javascript
Status Variants:
├── "active"   → Green badge (not shown in this widget - filtered out)
├── "expiring" → Yellow/Amber badge ("Expiring soon")
└── "expired"  → Red badge ("Expired")
```

**Action Button (Renew):**

```javascript
onClick: () => {
  setSelectedMheForRenewal(row.mheId);  // Store which machine to renew
  setIsRenewDrawerOpen(true);            // Open drawer for renewal process
}
```

---

## 🔄 Filter State Management

### **Global Filter States (Variation 1):**

```javascript
// Equipment type filters
const [selectedEquipment, setSelectedEquipment] = useState("Electric Forklift");
const [selectedHealthEquipment, setSelectedHealthEquipment] = useState("Overall");
const [selectedWarrantyFilter, setSelectedWarrantyFilter] = useState("All");

// UI state
const [activeIndex, setActiveIndex] = useState(maxIndex);  // Donut chart hover
const [selectedMheForRenewal, setSelectedMheForRenewal] = useState(null);
const [isRenewDrawerOpen, setIsRenewDrawerOpen] = useState(false);
```

### **Filter Propagation:**

```
User Selects Equipment Type
    ↓
setSelectedEquipment(value)
    ↓
Component State Updates
    ↓
Filtered Data Recalculates:
  - equipmentHealthDataByType[selectedEquipment]
  - currentFailureData (filtered by selectedEquipment)
  - machinesInspectionData (filtered by selectedEquipment)
  - warrantyExpiryData (filtered by selectedWarrantyFilter)
    ↓
Charts & Tables Re-render
    ↓
UI Updates Instantly
```

### **Independent vs. Shared Filters:**

| Widget | Filter Name | Shared With | Behavior |
|--------|------------|-------------|----------|
| Health Distribution | `selectedHealthEquipment` | None | Independent |
| Failure Distribution | `selectedEquipment` | Inspection Attention | Shared |
| Inspection Attention | `selectedEquipment` | Failure Distribution | Shared |
| Severity Timeline | `selectedEquipment` (likely) | Components 2 & 3 | Shared |
| Warranty Expiry | `selectedWarrantyFilter` | None | Independent |

**Note:** `selectedEquipment` is reused across multiple widgets, so changing it updates all connected visualizations simultaneously.

---

## 📈 Data Flow Example

### **Scenario: User selects "Reach Truck" from Failure Distribution dropdown**

1. **User Action:** Clicks dropdown → Selects "Reach Truck"
2. **State Update:** `setSelectedEquipment("Reach Truck")`
3. **Component Re-render:** React re-evaluates all components using `selectedEquipment`
4. **Data Filtering:**
   - Failure Distribution chart filters to Reach Truck parts only
   - Inspection Attention cards filter to Reach Truck machines only
   - Severity Timeline updates to show only Reach Truck events
5. **Visual Updates:**
   - Bar chart shows only Reach Truck components with failure counts
   - Card list shows only Reach Trucks with recent findings
   - Timeline shows only Reach Truck inspection events
6. **Result:** Dashboard now displays Reach Truck-specific insights

---

## 🎯 Key Design Principles (Variation 1)

1. **Grid-based Layout:** 12-column responsive grid for flexible widget sizing
2. **Color-coded Status:** Red/Amber/Green system for quick visual assessment
3. **Filterable Views:** Equipment type filters reduce cognitive load by focusing on specific asset classes
4. **Actionable Insights:** Each widget has clear CTA (e.g., "Renew" button, "Most Issues" badge)
5. **Real-time Monitoring:** Data updates dynamically as filters change
6. **System Consistency:** Uses standardized card, table, and badge components

---

## ⚠️ Important Notes

- **Variation 1 is LOCKED:** Do not make changes. It serves as the baseline/original design.
- **Filter State Persistence:** Filters are React local state only (reset on page reload).
- **Warranty Table Limit:** Shows only 5 rows — implies there may be pagination (not shown in snippet).
- **Shared Filters Caveat:** `selectedEquipment` affects widgets 2, 3, and 4 simultaneously — changing one filter updates multiple widgets.

---

## 📌 Summary Table

| Aspect | Details |
|--------|---------|
| **Dashboard Type** | Operational Fleet Monitoring |
| **Total Widgets** | 6 (4 KPI cards + 2 charts + 2 detail widgets + 1 table) |
| **Primary Use Case** | Track MHE health, warranty, and inspection status |
| **Key Metrics** | Fleet size, utilization, safety, sensor health |
| **Filter Mechanism** | Dropdown selectors (equipment type) |
| **Data Update** | Real-time on filter change |
| **Target Users** | Fleet managers, maintenance coordinators, safety officers |

---
