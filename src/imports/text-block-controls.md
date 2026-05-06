FEATURE: Text Block & Module Content Controls

OBJECTIVE
Introduce flexible text blocks that support static and dynamic modes and allow module-level content insertion.

------------------------------------------------

1. TEXT BLOCK MODES

Text blocks must support two modes:

Static
Dynamic

Add a selector in text block settings:

Text Block Type
[ Static | Dynamic ]

Static Mode
- Show rich text editor
- Allow manual typing
- Support formatting:
  • Bold
  • Bullet List
  • Numbered List
  • Highlight

Dynamic Mode
- Auto generate insights from module dataset
- Configuration fields:
  Insight Source
  Insight Type
  Max Insights

Dynamic block renders analytical observations.

------------------------------------------------

2. MODULE LEVEL CONTENT CONTROLS

Add a "+" button to the module header.

Placement:

[ Drag Handle ] Module Title        [ Chart ] [ Text ] [ + ] [ Delete ]

Clicking "+" opens contextual menu.

Menu options:

Add Content
Text / Notes
Divider

This content is attached to the module.

------------------------------------------------

3. CONTENT INSERTION RULE

When user selects Text / Notes:

Insert text block below the module visualization.

Example:

Depreciation
[ Chart ]

Notes
User text or generated insight.

------------------------------------------------

4. DIVIDER BLOCK

Divider adds visual separator under module.

Example:

------------------------------

Used to separate report sections.

------------------------------------------------

5. CONTENT HIERARCHY

Content can exist at two levels:

Section Level
Module Level

Section Level content applies to entire section.

Module Level content applies to specific module.

------------------------------------------------

6. PREVIEW BEHAVIOR

After saving configuration:

Module preview updates immediately.

Text blocks render inside module preview area.

------------------------------------------------

GOAL

Provide flexible narrative capability inside reports while preserving clean builder architecture.