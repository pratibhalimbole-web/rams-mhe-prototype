# MHE Operations Intelligence Dashboard
### Complete System Documentation — Variation 3

---

## 1. Overview

The MHE Operations Intelligence Dashboard is a unified command surface for warehouse managers to monitor, diagnose, and act on the complete health of their Material Handling Equipment fleet. Rather than checking four separate tools (FMS, MEPS, RTSS, IMDS), every signal from every system is pulled into a single view — correlated, ranked by urgency, and linked to a direct action.

The core premise of the dashboard is:

> **MHE Health = Productivity + Efficiency + Safety**

No single dimension tells the full story. An MHE running at 90% utilization looks healthy until you learn it has an open red finding and three impact events this week. The dashboard makes these intersections visible by design — every widget draws from at least two systems.

---

## 2. Data Sources Integrated

| System | Full Name | What It Contributes |
|---|---|---|
| **RTSS** | Real-Time Safety System | Violations, impact events, near-misses, overspeed, restricted zone entries, rack impacts, collisions, pedestrian warnings |
| **MEPS** | Maintenance & Equipment Planning System | Inspection findings (Red/Amber), warranty expiry, inspection history, missed checks |
| **FMS** | Fleet Management System | Fleet utilization, task assignment, charge scheduling, route data, productivity metrics |
| **IMDS** | Equipment & Maintenance Data System | Compliance scores, operator licensing, warranty data, asset registration |
| **Command Center** | Operational Command Layer | Near-miss tracking, escalation patterns, shift-level operational context |

Data is aggregated across all five systems in real time. Every widget shows which systems feed it — visible in the widget subtitle and footer source tags.

---

## 3. The Health Model — How the Dashboard Thinks

```
                    ┌─────────────────────────────────────┐
                    │         MHE SYSTEM HEALTH            │
                    └──────────────┬──────────────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            │                      │                      │
     ┌──────▼──────┐        ┌──────▼──────┐       ┌──────▼──────┐
     │ PRODUCTIVITY │        │  EFFICIENCY │       │   SAFETY    │
     │   (FMS)      │        │  (FMS+MEPS) │       │(RTSS+MEPS)  │
     └──────┬──────┘        └──────┬──────┘       └──────┬──────┘
            │                      │                      │
     Task completion        Fleet utilisation      Violation count
     Shift output           Idle MHE time          Impact events
     Operator scores        Congestion loss         Near-misses
     Fleet readiness        Charge scheduling       Red findings
```

These three pillars combine to produce the **Warehouse Readiness Index** — the single top-line metric shown in the first KPI card. At 74%, the current warehouse is operating below the healthy threshold (~85%+), driven by low fleet efficiency and elevated safety risk.

### Why maintenance is a fourth dimension

Maintenance (MEPS + IMDS) acts as the **root cause layer** beneath all three pillars:

- An unresolved red finding degrades **safety** (MHE operating with known fault)
- Repeated amber findings reduce **efficiency** (mast misalignment = 12% productivity drop)
- Missed inspections increase **warranty expiry risk**, threatening **long-term productivity**
- Skipped MEPS checks directly reduce the **compliance** component of the Warehouse Readiness Index

The dashboard surfaces maintenance signals in every pillar — it is never siloed into one corner.

---

## 4. Dashboard Layout — Section by Section

```
┌──────────────────────────────────────────────────────────────┐
│  ROW 1 — Four KPI Cards (fleet-wide health at a glance)       │
│  [Readiness Index] [Safety Risk] [Efficiency Score] [At Risk] │
└──────────────────────────────────────────────────────────────┘
┌────────────────────────────┐  ┌──────────────────────────────┐
│  Safety Violation Trend    │  │  Active Safety Alerts        │
│  (trend line — 8 cols)     │  │  (live feed — 4 cols)        │
└────────────────────────────┘  └──────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│  OPERATIONAL ACTION STATUS — Four action cards               │
│  [Operators] [Efficiency] [Safety] [Utilization]             │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────┐  ┌───────────────────────────────────┐
│  Shift Performance   │  │  Inspection Failure × Safety      │
│  (stacked bar chart) │  │  Impact Correlation               │
└──────────────────────┘  └───────────────────────────────────┘
```

---

## 5. Widget Reference

---

### 5.1 KPI Strip — Four Cards

These four cards are the first thing a manager reads. They answer the question: *"How bad is it right now?"*

---

#### **Warehouse Readiness Index**
`FMS × IMDS × MEPS`

- **What it shows:** A single composite score (0–100) representing how ready the warehouse fleet is to operate at full capacity.
- **Formula:** Utilization Rate × Inspection Health × Compliance Score (normalized)
- **Current value:** 74%
- **What drives it down:** Low fleet utilization (FMS), open red findings (MEPS), expired warranties (IMDS), missed inspections (MEPS), operator license lapses (IMDS)
- **Why it matters:** A warehouse at 74% readiness is operating with 26% of its potential capacity degraded — either idle equipment, unsafe equipment, or non-compliant equipment.

---

#### **Active Safety Risk Level**
`RTSS · MEPS`

- **What it shows:** The current safety severity classification for the fleet — Low / Medium / High / Critical
- **Supporting signals:** 50 total safety events this week, 6 open Red findings, ongoing violation patterns
- **Current level:** HIGH
- **What drives it up:** Impact event frequency (RTSS), unresolved Red findings (MEPS), pedestrian zone violations, near-miss clustering in one zone
- **Why it matters:** This card tells the manager whether they are within acceptable safety operating parameters. HIGH means immediate intervention is needed — the fleet is operating at elevated risk of a serious incident.

---

#### **Operational Efficiency Score**
`FMS · RTSS`

- **What it shows:** How much productive capacity is being lost to inefficiency, expressed as a score and a time-lost figure
- **Current value:** 62% efficiency | 52.5 hours lost this period
- **Loss sources:** Congestion delays (route conflicts), unsafe behavior (slowing due to violation patterns), idle MHEs awaiting task assignment
- **Why it matters:** Every percentage point below 100% represents wasted labour and equipment hours. At 62%, over a third of the fleet's productive capacity is being eroded — much of it preventable through routing fixes and task scheduling.

---

#### **Assets at Critical Risk**
`MEPS · IMDS · RTSS`

- **What it shows:** Count of MHEs that meet two or more of: repeated inspection findings, active impact events, expiry within 30 days, open red finding
- **Methodology:** An asset is "at critical risk" when maintenance, safety, and compliance signals converge on the same unit
- **Why it matters:** Individual signals can look manageable in isolation. This card flags when multiple systems are raising alarms on the same MHE — the highest-priority intervention targets.

---

### 5.2 Safety Violation Trend Intelligence
`RTSS · MEPS · FMS · Command Center`

**What it shows:**
A time-series area chart plotting safety violations, impact events, and near-misses across the selected time range. Each data point is enriched with operational context — active MHEs, active operators, most affected zone, MEPS red findings.

**Filters:**
- **Time range:** 24h / 7d / 30d (hourly → daily → weekly granularity)
- **Zone:** All / Storage A / Storage B / Loading / Picking
- **MHE Type:** All / Forklift / Reach Truck / Pallet Jack
- **Shift:** All / Morning / Evening / Night

**Trend lines:**
| Line | Source | What it tracks |
|---|---|---|
| Safety Violations | RTSS | Speed, zone, seatbelt, and operational rule breaches |
| Impact Events | RTSS + FMS | Rack impacts, collisions, near-collisions detected by sensors |
| Near Misses | Command Center | Pedestrian proximity events and operator-reported near-misses |

**Hover tooltip** shows the full operational picture for any single time point — including how many MHEs were active, which zone was most affected, and how many MEPS red findings were open at that moment. This connects safety events to maintenance state in real time.

**Why it matters:**
Trend direction is more important than any single count. A warehouse with 3 impact events in one day is concerning; 3 impact events every day for a week — consistently on the same shift, in the same zone — points to a structural problem (routing, operator behaviour, or zone layout). The trend makes that pattern visible.

---

### 5.3 Active Safety Alerts
`RTSS · MEPS · FMS`

**What it shows:**
A live feed of the 7 highest-priority open alerts across all three systems, filtered by severity. Each alert card shows:
- Alert title and full description
- Source system, category, affected MHE, zone, and time
- Severity classification (Critical / High / Medium / Low)

**Severity filter tabs** show counts per band so a manager can immediately see the breakdown without reading every card.

**Alert categories and their meaning:**

| Category | Source | Meaning |
|---|---|---|
| Impact Event | RTSS | Physical collision or rack strike detected |
| Red Finding | MEPS | Critical maintenance finding — MHE should not operate |
| Overspeed | RTSS | Speed limit exceeded, repeated pattern |
| Zone Violation | RTSS | MHE entered pedestrian-restricted zone |
| Skipped Inspection | MEPS | Scheduled MEPS check was missed |
| Utilization | FMS | Fleet utilization below threshold |
| Near Miss | RTSS | Pedestrian near-miss event pattern detected |

**Click to expand — Alert Detail Popup:**
Clicking any alert card opens a full detail popup with:
- Full description
- 6-field details grid (MHE unit, zone, source, time, alert ID, category)
- 3 recommended actions specific to the alert category
- **Acknowledge** and **Dismiss** action buttons

This turns the feed from a passive list into an actionable workflow — a manager can acknowledge, escalate, or dismiss without leaving the dashboard.

---

### 5.4 Operational Action Status — Four Cards

This section answers the question: *"Where do I need to act right now, and on what?"*

Each card represents a domain. Together they cover the full operational picture.

---

#### **Card 1: Operators**
`RTSS · MEPS · IMDS` — *Operator-wise safety breakdown*

Shows per-operator safety performance, combining violation data from RTSS with findings data from MEPS and licence status from IMDS.

**Per-operator row:**
- Safety score (0–100) — composite of violations, incidents, and compliance
- Thin progress bar showing score position — darker grey for higher scores
- Three metrics: **Violations** | **Near-Miss** | **Compliance %**

**Why grey shades (no red/green):**
The operator view deliberately avoids colour-coded judgement. The numbers are for informed review — not automated pass/fail. A manager reviews these in context; the bar shows relative position, not a verdict.

**How it connects to health:**
Operators are the primary driver of safety events. A low score (e.g. OP-007 at 61) combined with an open finding on the MHE they operate is a compounded risk — the dashboard shows both in the same view, while the detailed Alert popup links to the specific finding.

---

#### **Card 2: Efficiency**
`FMS · MEPS` — *Fleet & operational performance signals*

Shows the efficiency pillar in three layers:

**Stat strip (top):**
- **89** tasks queued — demand is there
- **3** idle MHEs with no assigned task — supply is there but not meeting demand
- **4.2 hrs** lost to congestion — route conflicts are eating productive time

**Progress bars:**
| Metric | Value | Target |
|---|---|---|
| Fleet Efficiency | 62% | 82% |
| Task Completion | 82% | 82% |
| Peak Utilization | 74% | 80% |
| Congestion Impact | 18% | 10% |

**Why no colour coding:**
Efficiency is shown in a neutral grey palette — matching the visual language of the Operators card. The numbers and targets speak clearly without a red/green overlay that implies automated decisions.

**What the gap tells you:**
Fleet Efficiency at 62% vs Task Completion at 82% reveals the disconnect: tasks are being completed when MHEs are deployed, but a large portion of the fleet isn't being deployed. The 3 idle MHEs + 89 queued tasks is the specific actionable finding.

---

#### **Card 3: Safety**
`RTSS · MEPS` — *Live safety metrics*

Shows four hard safety counts — not trends, not scores, just the current raw numbers that demand attention.

| Metric | Today's Value | What it means |
|---|---|---|
| Impact Events | 3 | Physical rack or MHE collision today |
| Open Red Findings | 1 | MHE operating with a critical unresolved fault |
| Restricted Zone Entries | 9 | Pedestrian zone breaches this shift |
| Near-Miss Events | 4 | Pedestrian proximity events over 3 consecutive shifts |

Below the counts, active alert rows show the specific incidents driving these numbers — sorted with LIVE alerts first.

**LIVE badge (red):** Marks alerts that are actively developing — not historical. A LIVE impact event means the risk is current and potentially escalating, not already resolved.

**Why this card exists alongside the KPI strip:**
The KPI card shows "HIGH risk level" — a classification. This card shows *why*: 3 impacts today, an MHE running with a brake failure finding, 9 zone violations. The specificity is what enables a manager to act.

---

#### **Card 4: Utilization**
`FMS · RTSS` — *Equipment utilization by fleet type*

Shows utilization performance by fleet type, followed by actionable items where utilization is creating operational risk.

**Fleet rows:**
| Fleet | Zone | Utilization | Status |
|---|---|---|---|
| Reach Trucks | Zones C, D | 41% | At Risk |
| Pallet Jacks | Loading | 54% | Warning |
| Electric Forklifts | All Zones | 76% | On Target |

**Action items below the fleet rows:**
These are not passive observations — each has a direct action button:

- *"Reach Truck fleet at 41% — 4 units below threshold"* → **Move to Zone** — physically redeploy idle units to where demand is building
- *"MHE-009 charge window overlaps with peak demand"* → **Adjust Schedule** — shift the charge window to off-peak hours so the unit is available when needed
- *"Electric Forklift fleet at 76% — above weekly target"* → **View Report** — review for fleet rightsizing opportunity

**Action label design intent:**
Labels are written as plain outcomes ("Move to Zone", "Adjust Schedule") rather than technical jargon ("Pre-Position", "Reschedule Charge"). A warehouse manager should be able to read the button and know exactly what will happen.

---

### 5.5 Shift Performance vs Operational Risk
`FMS · RTSS · IMDS`

**What it shows:**
A stacked bar chart showing three performance dimensions side-by-side for each of the four shifts. Each bar represents the complete operational profile of a shift session — not just how many tasks were done, but how safely and how compliantly.

**Three stacked layers:**
| Layer | Source | Colour | What it measures |
|---|---|---|---|
| Productivity | FMS | Blue | Task completion rate vs fleet capacity |
| Safety Score | RTSS | Green | Inverse of violation and incident frequency |
| Compliance | IMDS | Amber | Inspection, licence, and documentation adherence |

**Filters:** Module filter (view each dimension independently) and Period filter (this week vs last week)

**What the stacking reveals:**
A tall bar is not necessarily a good bar. 4th shift (night) shows the lowest combined score — not because of one underperforming dimension, but because all three decline together. This is the signature of a structural shift problem (staffing, fatigue, supervision) rather than a single system failure.

When the blue (productivity) layer is disproportionately taller than the green (safety) layer on the same shift, it means that shift is achieving output *by compromising safety margins* — a critical pattern that would be invisible in a productivity-only view.

---

### 5.6 Repeated Inspection Failures vs Safety Impact Correlation
`MEPS · RTSS`

**What it shows:**
A horizontal bar chart plotting each MHE's inspection finding count (MEPS — amber bar) against its impact event count (RTSS — dark bar). MHEs are sorted by finding count, highest first.

**Hover tooltip:** Shows MHE ID, equipment type, specific finding count, specific impact count, and the correlation inference.

**The core insight this widget proves:**
> Unresolved inspection findings are predictive of safety impact events.

MHEs with 4+ repeated findings consistently appear in the top of the impact event list. This is not coincidence — it reflects the physical reality that equipment with degraded mechanical state (mast alignment, brake condition, sensor calibration) operates less safely, resulting in more impacts and near-misses.

**Why this is the most important cross-system widget:**
It transforms MEPS data from a compliance record into a predictive safety signal. A manager looking only at MEPS sees "amber finding on MHE-022" — routine. A manager looking at this chart sees "MHE-022 has 3 findings AND 4 impact events" — urgent. Maintenance is no longer a separate conversation from safety.

---

## 6. Cross-System Correlations — How the Dashboard Connects Signals

The dashboard is designed around five explicit data correlations that no single system can produce alone:

### Correlation 1: Maintenance Findings → Safety Events
`MEPS findings × RTSS impact events`

**Widget:** Inspection Failure × Safety Impact chart
**Signal:** MHEs with 3+ repeated MEPS findings have 2.4× the impact event rate of those with 0–1 findings
**Implication:** Prioritise MEPS finding closure not just for compliance, but to reduce safety risk

---

### Correlation 2: Operator Score → Safety Risk
`IMDS compliance × RTSS violations × MEPS findings`

**Widget:** Operators card
**Signal:** An operator with low compliance score (OP-007 at 61) may be operating an MHE with an open red finding — compounded risk
**Implication:** Operator reviews must reference the MHE's maintenance state, not just the operator's violation history

---

### Correlation 3: Fleet Efficiency → Task Queue Pressure
`FMS idle count × FMS task queue`

**Widget:** Efficiency card stat strip
**Signal:** 3 idle MHEs + 89 queued tasks = task bottleneck caused by deployment, not demand
**Implication:** The inefficiency is solvable operationally (task assignment), not structurally

---

### Correlation 4: Shift Productivity → Safety Trade-off
`FMS productivity × RTSS safety score per shift`

**Widget:** Shift Performance chart
**Signal:** Shifts with high productivity but low safety score are achieving output through safety shortcuts
**Implication:** KPIs measured on productivity alone will miss this; both dimensions must be tracked together

---

### Correlation 5: Safety Events → Affected Zone Pattern
`RTSS violations × zone data`

**Widget:** Safety Violation Trend (tooltip) + Safety card alerts
**Signal:** Storage B appears repeatedly across impact events, zone violations, and near-miss events
**Implication:** The issue is zone-specific — routing, barrier placement, or zone layout — not fleet-wide

---

## 7. Maintenance Coverage — How the Dashboard Addresses It

Maintenance is not a standalone section in this dashboard. It is embedded in every pillar:

| Pillar | Maintenance Signal | Source | Widget |
|---|---|---|---|
| **Safety** | Open Red Findings | MEPS | KPI card, Safety card, Alert feed |
| **Safety** | Repeated findings → impact events | MEPS + RTSS | Correlation chart |
| **Productivity** | Productivity drop post-finding | MEPS + FMS | Efficiency card (E003 item) |
| **Efficiency** | Mast misalignment reducing lift speed | MEPS | Efficiency inbox item |
| **Compliance** | Skipped inspections | MEPS | Compliance layer in Shift chart |
| **Asset Risk** | Warranty expiry approaching | IMDS | Assets at Critical Risk KPI |
| **Asset Risk** | Multi-system risk convergence on one MHE | MEPS + RTSS + IMDS | Assets at Critical Risk KPI |

**The maintenance workflow this dashboard enables:**

1. Manager opens dashboard → sees Assets at Critical Risk count elevated
2. Checks Active Safety Alerts → sees "Red finding on MHE-004 unresolved — 3 days overdue"
3. Opens alert detail → sees recommended actions: Ground MHE, Schedule Emergency Repair, Notify Fleet Manager
4. Checks Inspection × Impact correlation → confirms MHE-004 is in the top tier of both findings and impacts
5. Takes action: grounds MHE-004, opens MEPS work order, assigns standby unit from Utilization card

This is a complete maintenance intervention loop — triggered by a safety signal, confirmed by a maintenance correlation, resolved with a fleet redeployment — all from one dashboard.

---

## 8. How a Manager Reads This Dashboard

**Morning briefing (2–3 minutes):**
1. Check the four KPI cards — establish the health baseline for the shift
2. Scan Safety Violation Trend — is today tracking higher or lower than yesterday?
3. Check Active Safety Alerts Critical tab — any new critical alerts since last shift?
4. Review Operational Action Status — which items need decisions this shift?

**During shift (as needed):**
- Alert notification → click alert card → read detail → acknowledge or escalate
- Utilization drop detected → check Efficiency card → act on idle MHE action items
- Safety event reported → check Safety card counts — is this an isolated incident or part of a pattern?

**End-of-shift review:**
- Shift Performance chart — how did today's shift compare to targets?
- Inspection Correlation chart — did any MHE move up the risk ladder?
- Review operator scores for any operator who generated incidents

---

## 9. Summary — What This Dashboard Does That Individual Systems Cannot

| Capability | FMS Alone | MEPS Alone | RTSS Alone | This Dashboard |
|---|---|---|---|---|
| See fleet utilization | ✓ | — | — | ✓ |
| See inspection findings | — | ✓ | — | ✓ |
| See safety violations | — | — | ✓ | ✓ |
| Link findings to impacts | — | — | — | **✓** |
| Score operator safety holistically | — | Partial | Partial | **✓** |
| Identify zone-level risk patterns | — | — | Partial | **✓** |
| Predict which MHE will cause next incident | — | — | — | **✓** |
| Enable action without leaving the view | — | — | — | **✓** |
| Show shift-level health across all dimensions | — | — | — | **✓** |
| Calculate fleet-wide Readiness Index | — | — | — | **✓** |

The dashboard does not replace FMS, MEPS, RTSS, or IMDS. It connects them — so the signals that each system generates in isolation become a coherent picture of fleet health, and every insight leads directly to an action.

---

*Document generated for RAMS MHE Prototype — Variation 3 Dashboard*
*Data sources: FMS · MEPS · RTSS · IMDS · Command Center*
