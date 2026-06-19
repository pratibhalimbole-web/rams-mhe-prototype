# 3D MHE Command Center — Feature Summary

**File:** `src/app/pages/mhe/CommandCenter3D.tsx`
**3D Scene:** `src/app/pages/digital-twin/WarehouseScene3D.tsx`
**Route:** Accessible via the Command Center tab in the MHE dashboard

---

## Overview

The 3D Command Center is a real-time warehouse operations view built on Three.js (`@react-three/fiber`). It gives warehouse managers a live bird's-eye view of the entire floor — MHE positions, task routes, rack safety zones, operator locations, and event hotspots — all in a single interactive 3D canvas with collapsible side panels.

---

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Left Toolbar (34px wide icon buttons)                      │
│  ┌──────┬──────────────────────────────────────┬─────────┐  │
│  │ Icon │          3D Canvas                   │ Right   │  │
│  │ bar  │    (Three.js warehouse scene)        │ Panel   │  │
│  │      │                                      │ (380px) │  │
│  │      │                                      │ slides  │  │
│  │      │                                      │ in/out  │  │
│  └──────┴──────────────────────────────────────┴─────────┘  │
│  Bottom toolbar (view mode buttons)                         │
└─────────────────────────────────────────────────────────────┘
```

- The canvas fills all remaining space via `flex: 1`
- The right panel (380 px) slides in over the canvas — it does not shrink the scene
- Fullscreen expand takes the canvas to `position: fixed; 100vw × 100vh` (press Escape to exit)

---

## Left Toolbar Panels

Each icon button in the toolbar opens a floating panel anchored at `left: 56px`. Only one panel is open at a time; clicking the same button again closes it.

| Button | Panel | Description |
|---|---|---|
| **Schedule** (CalendarDays) | Calendar Panel | Date picker; switches between Live mode and History mode. Calendar is disabled in Live mode. History mode shows previous months. |
| **MHE** (Truck) | MHE Layer Panel | Toggle visibility of each MHE unit. Shows MHE name, type, and online status. "View Analytics" link opens the right-side MHE Analytics Panel. |
| **Operator** (User) | — | Operator layer toggle (placeholder panel) |
| **Layers** (Layers) | Layer Panel | Show/hide scene layers: MHE Paths, Near-Miss Alerts, Event Hotspots, Rack Labels, Safety Zones |
| **Overview** (LayoutDashboard) | Events Panel | Checkbox list to toggle individual event types on/off (Near Miss, Path Deviation, Idle, Battery Low, Speed Violation, Zone Breach) |
| **Trips** (Network) | Trips Panel | Filter trip overlays by type (Productive, Idle, Mixed) and select a single cycle time slot |
| **Alerts** (Flame) | — | Alerts layer toggle |
| **Task Manager** (Navigation) | Tasks Panel | Assign tasks to MHEs, view active assignments, track status and remove completed tasks |

### View Mode Bottom Buttons

| Button | Function |
|---|---|
| **2D View** | Toggle label (no 2D map yet) |
| **3D View** | Default active — the Three.js scene |
| **Trail View** | Toggle label |
| **Focus** | Toggle label |
| **Expand** | Fullscreen toggle — canvas fills the entire viewport |

---

## 3D Warehouse Scene

### Building Structure
- Concrete floor (140 × 140 units)
- 6 perimeter walls (semi-transparent) with configurable dark/light opacity
- Glass roof panel (12% opacity)
- Loading dock ramp + dock doors
- Entry/exit roller doors
- Support columns along the walls

### Storage Sections

| Zone | Configuration | World Position |
|---|---|---|
| **Side Storage** | 2 rows × 6 bays × 5 levels | x: −26 to −19.4, z: −13 to −11.1 |
| **Main Storage** | 4 rows × 21 bays × 5 levels | x: −4 to 19.1, z: −19 to −15.2 |
| **Bulk Storage** | 2 rows × 12 bays × 5 levels | x: 6 to 19.2, z: 2 to 3.9 |

Each rack bay uses `THREE.InstancedMesh` for performant rendering. Row labels (Row A–D) and aisle markers (Aisle A–D) float above the floor.

### Floor Zones

| Zone | Color | Purpose |
|---|---|---|
| Pallet Receiving | Blue | Inbound staging |
| Shipping Station | Green | Outbound dispatch |
| Charging Bay | Purple | MHE battery charging |
| QC Station | Amber | Quality check area |
| Open Workflow / Staging Area | — | Label only |

### MHE Vehicles

6 animated vehicles patrol looping paths. Each is a `THREE.Group` with body, cabin, guard pillars, wheels, optional fork mast, and a blinker light.

| ID | Label | Type | Color | Patrol Area |
|---|---|---|---|---|
| MHE-01 | MHE 01 | Forklift | Amber | Side storage aisle |
| MHE-02 | MHE 02 | Reach Truck | Green | Main storage east |
| MHE-03 | MHE 03 | Electric Pallet Jack | Purple | Staging area center |
| MHE-04 | MHE 04 | Order Picker | Pink | Main storage aisle |
| MHE-05 | MHE 05 | BPOT | Cyan | Receiving area |
| MHE-06 | MHE 06 | Forklift | Orange | Main storage west |

**Focus mode:** When any MHE has an active task assignment, that MHE stays in full color. All others are dimmed to gray at 28% opacity with their trail particles hidden. This makes the focused MHE instantly identifiable.

Each vehicle leaves a 30-point particle trail (`THREE.Points`) that follows its path.

Click any MHE to select it — a blue ring appears on the floor beneath it. Click again to deselect.

### Operator Markers

4 operators rendered as humanoid figures (body cylinder + sphere head + hard hat). Active operators show in blue/amber; inactive in gray.

### Event Hotspots

Pulsing ring animations at key locations (near-miss zones, speed violations, etc.) with `Html` overlay labels.

---

## Rack Safety Zones

Each storage section has an invisible boundary expanded by `SAFETY_MARGIN = 1.5` units in all directions. The boundary is visualized as:

- 4 thin amber border strips at the perimeter edges
- Diamond markers at each corner
- A floating "⚠ ZONE NAME SAFETY ZONE" label

**Near-miss detection** runs every animation frame (`useFrame`) as an AABB check. When an MHE enters a safety zone:
1. The border strips turn red
2. A toast alert appears at the top-center of the canvas (max 5 visible, auto-dismiss in 6 s)
3. A 6-second cooldown per MHE–rack pair prevents alert spam

---

## Task Assignment System

### Task Templates

| ID | Name | Route |
|---|---|---|
| `pick-deliver` | Pick & Deliver | Side Storage → Shipping Station |
| `replenishment` | Replenishment Run | Receiving → Bulk Storage |
| `cross-dock` | Cross-Dock | Receiving → QC → Shipping |
| `charging-run` | Charging Run | Any Location → Charging Bay |

### Assigning a Task

1. Open the **Task Manager** panel (Navigation icon)
2. Select a task template and target MHE from dropdowns
3. Choose a status: Assigned / In Progress / Deviated / Completed
4. Click **Assign** — the route appears in the 3D scene immediately

### Path Visualization

Once assigned, two paths render as **vertical wall ribbons** (22 cm tall, 9 cm thick) standing above the floor:

| Path | Visual | Meaning |
|---|---|---|
| **Planned** | Blue dashed wall | The route the operator was given |
| **Actual** | Red solid wall | The route the operator actually took |

Direction chevrons sit on top of each wall every segment, pointing the way. Start/end flag poles mark the pickup and dropoff points.

If the status is `deviated`, a translucent red rectangle marks the **deviation zone** on the floor with a "DEVIATION ZONE" label.

### Task Impact Card

Click the focused MHE to reveal the impact card floating above the scene. Click the **×** button (or click the MHE again) to dismiss it.

The card uses the app's design system CSS variables (`--w-bg`, `--w-border`, `--w-text-*`, `--w-red-bg`, etc.) so it automatically renders correctly in both light and dark themes.

**Card sections:**

| Section | Content |
|---|---|
| Header | Status badge (DEVIATION / COMPLETED), MHE ID, task name, close button |
| Metric chips | Distance, Time, Battery — each shows Plan → Actual with a color-coded delta |
| Efficiency bar | Route efficiency % with green / amber / red color scale |
| Operator score | Before → After score comparison with point delta pill |
| Issues | Bullet list of specific problems (wrong aisle, congestion, time lost) |

### Task Status Colors

| Status | Color | Icon |
|---|---|---|
| Assigned | Amber | Clock |
| In Progress | Blue | Navigation arrow |
| Deviated | Red | Alert triangle |
| Completed | Green | Check circle |

---

## MHE Analytics Panel (Right Side)

Opens from the MHE Layer Panel → "View Analytics" link. Slides in from the right edge at 380 px wide.

**Sections:**
- **Header** — MHE name, type, active status badge, back button
- **KPI Strip** — 3 cards: Trips Today (26), Health Score (60), Idle Time (15%)
- **Activity Breakdown** — Bar chart of operational hours (Productive / Idle / Charging / Maintenance)
- **Battery Trend** — Area chart of battery % over time
- **Utilization Gauge** — Radial chart showing overall utilization %
- **Top Routes** — Table of most frequent routes with trip count and distance

---

## Events Panel (Right Side)

Triggered by the Events floating button (bottom-left of canvas, shows alert count badge). Opens a 380 px right panel.

**Structure:**
- Filter tab strip: All / Low / Medium / Critical (with count badges)
- Events grouped by category (e.g., Near-Miss, Path Deviation, Zone Breach)
- Each event card shows: severity dot, event description, timestamp, MHE involved

---

## Near-Miss Alerts (Toast)

Floating toasts positioned at top-center of the canvas (`position: absolute`, `transform: translateX(-50%)`):
- Red background with ⚠ icon
- Message: "Near Miss — [MHE Label] approaching [Zone Label] safety zone"
- Max 5 visible at once (oldest removed when limit is exceeded)
- Auto-dismiss after 6 seconds each

---

## Fullscreen Mode

The **Expand** button in the bottom toolbar toggles the canvas between its flex container size and `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999`.

Press **Escape** to exit fullscreen. All panels, alerts, and overlays remain functional in fullscreen.

---

## Key Files & Responsibilities

| File | Role |
|---|---|
| `CommandCenter3D.tsx` | Page shell, all left/right panels, task management state, near-miss alert toasts |
| `WarehouseScene3D.tsx` | Three.js scene: building, racks, MHEs, operators, safety zones, path overlays, impact card |
| `useTheme.ts` | `isDark` boolean from `next-themes` — used by panels for inline-style theming |

---

## Design System Tokens Used

The scene's HTML overlays (labels, impact card, panels) use the app's CSS variables directly:

| Token | Purpose |
|---|---|
| `--w-bg` | Card background |
| `--w-bg-muted` | Chip / section backgrounds |
| `--w-border` | All borders and dividers |
| `--w-text-1/2/3` | Primary / secondary / tertiary text |
| `--w-red-bg / --w-red-border` | Deviation / negative delta highlights |
| `--w-green-bg / --w-green-border` | Completed / positive delta highlights |
| `--w-amber-bg / --w-amber-border` | Warning states |
| `--card`, `--border`, `--foreground` | Panels and drawers |
