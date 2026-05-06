Create the Rack Stability Detail page for the IRDS Stability module.

IMPORTANT:
Do NOT create a split layout. This page must use a full workspace canvas container where the rack visualization occupies the entire center area. The issue list must appear as a floating panel on the right side.

The page header and breadcrumb already exist in the system, so do NOT recreate them.

--------------------------------------------

MAIN PAGE STRUCTURE

Use one main container acting as a canvas workspace.

Structure:

MainContainer
 ├── RackCanvas (center visualization)
 └── FloatingObservationPanel (right side overlay)

The main container must use relative positioning so floating UI can be placed inside it.

Example layout:

--------------------------------------------------
|                                                |
|                                                |
|              RACK VISUALIZATION                |
|                                                |
|                                                |
|                               [ISSUE PANEL]    |
|                                                |
--------------------------------------------------

--------------------------------------------

MAIN CONTAINER

Requirements:

• full width
• full height
• position: relative
• background uses subtle grid pattern
• rack centered inside container

The container acts as the workspace for future features like zoom, pan, and 3D rack viewing.

--------------------------------------------

RACK CANVAS

The rack visualization must be a **front elevation view** of a warehouse pallet rack.

Do NOT implement rotation or complex 3D controls.

Rack elements:

• vertical uprights
• horizontal beams
• bays
• levels

Style:

• thin industrial steel lines
• blueprint / structural drawing style
• clean and minimal

The rack should be centered horizontally.

--------------------------------------------

RACK HIGHLIGHT STATES

Certain rack bays must show inspection state overlays.

States:

BLOCKED  
Red border rectangle around bay

RESTRICTED  
Amber dashed rectangle around bay

NORMAL  
No highlight

Each highlighted zone must contain the text label:

BLOCKED  
RESTRICTED

--------------------------------------------

ISSUE PINS

Add circular markers on rack components.

Colors:

Red → Critical issue  
Amber → Warning issue  
Green → Minor issue

Pins appear on:

• uprights
• beam connections
• base plates

Pins should have:

• soft glow
• slight hover animation

--------------------------------------------

RACK IDENTIFIER

Below the rack center display the rack label.

Example:

ST-C1-T

--------------------------------------------

FLOATING OBSERVATION PANEL

Create a floating panel positioned inside the canvas container.

Position:

top: 100px  
right: 24px  
width: 360px  

Use a card style with shadow and rounded corners.

--------------------------------------------

PANEL HEADER

Display rack identification.

Example:

CN-L1 — Rack 05

Below it show:

3D Rack View

Add a small status badge:

LIVE

--------------------------------------------

OBSERVATION CARDS

The panel must contain a vertical list of observation cards.

Each card includes:

Observation ID  
Example:

#Observation_Pin

Severity badge:

Red  
Amber  
Green

Location reference:

Rack_Name | Bay_4 | Level_1 | Upright

Observation title:

Observation

Observation description:

Dent

Inspector name:

John Martinez

Timestamp:

5 min ago

Cards should be scrollable.

--------------------------------------------

INTERACTION BEHAVIOR

Click rack pin → scroll corresponding observation card into view.

Click observation card → highlight the rack location.

Hover pin → show tooltip with observation summary.

--------------------------------------------

PANEL FOOTER

At the bottom display:

Showing 3 of 12 alerts

Add a right-aligned button:

View All

--------------------------------------------

DESIGN STYLE

Use the existing IRDS design system:

• CSS variables
• card components
• badge components
• consistent spacing
• subtle grid background in canvas
• clean structural rack lines

--------------------------------------------

TECHNICAL NOTE

The rack canvas should be implemented in a way that allows replacing the front-view rack with a future interactive 3D rack viewer without changing the page layout.

--------------------------------------------