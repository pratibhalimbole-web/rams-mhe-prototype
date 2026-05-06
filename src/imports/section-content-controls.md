FEATURE: Section Content Controls

OBJECTIVE
Allow users to add manual content elements (Text / Notes and Divider) directly within a section without interfering with the existing module drag-and-drop workflow.

SECTION HEADER UPDATE

1. Add a "+" action button in the Section Header.
   Placement:
   - Next to the existing settings icon in the section header.
   - Section header layout should be:

   [ Section Name ]      [ + ] [ ⚙ ] [ ⌄ ]

2. The "+" button must open a small contextual popover menu.

POPOVER MENU

3. When user clicks the "+" button, open a small tooltip-style popover.

Menu Title:
Add Content

Menu Items:
• Text / Notes
• Divider

Design Rules:
- Width: ~180–200px
- Soft shadow
- Rounded corners
- Appears directly below the "+" button
- Closes automatically after selection

IMPORTANT RULE

4. Do NOT include "Add Module" inside this menu.

Modules must continue to be added only via:
- Drag and drop from the left Module Library.

This avoids duplicate interaction patterns and user confusion.

TEXT / NOTES BEHAVIOR

5. When user selects "Text / Notes":

System should:
- Insert a new Text Block inside the current section
- Place it below existing modules in that section
- Automatically focus the newly created text block

Text Block UI (Canvas):

Text Block
-----------------------------
Write notes or explanation...

Right Panel Settings:

Module Settings
Module Type: Text Block

Content
Rich Text Editor

Formatting Options:
• Bold
• Bullet List
• Numbered List

DIVIDER BEHAVIOR

6. When user selects "Divider":

System should insert a visual divider block inside the section.

Divider UI:

-------------------------------

Purpose:
- Separate content visually in report layout
- Improve readability in exported PDF

INSERTION RULE

7. New content blocks (Text / Notes or Divider) must always insert at the bottom of the selected section.

Future drag-and-drop reordering can reposition them.

ARCHITECTURE RULE

8. Maintain separation of responsibilities:

Left Panel:
Module Library (data-driven modules only)

Section "+" Menu:
Content Blocks (manual content only)

Right Panel:
Module Settings / Content Editing

GOAL

- Prevent module creation confusion
- Keep drag-and-drop as the only way to add modules
- Allow manual narrative content within sections
- Maintain clean builder architecture