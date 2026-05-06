FEATURE: Text Block Editing via Right Panel

OBJECTIVE
Improve text block UX by moving editing controls to the right settings panel while keeping text block preview under module.

------------------------------------------------

TEXT BLOCK CANVAS DESIGN

Text blocks must render as simple preview blocks in the canvas.

Example:

Text Block

Write notes or explanation...

Do NOT render a rich text editor in the canvas.

Remove inline formatting toolbar from the module preview.

------------------------------------------------

TEXT BLOCK INTERACTION

When user clicks the text block:

- Select the text block module
- Highlight it with active state
- Load text block settings in the right settings panel

------------------------------------------------

RIGHT SETTINGS PANEL

When a text block is selected, show:

Module Settings
Text Block

Content
[ Rich text editor ]

Formatting options:
• Bold
• Bullet list
• Numbered list

User edits content in the right panel.

------------------------------------------------

LIVE PREVIEW

When text content is updated:

- Update the module preview instantly
- Do not reload the page
- Preserve module order

------------------------------------------------

MODULE PLACEMENT

Text blocks remain positioned under modules inside the section.

Example layout:

Module
Visualization

Text Block
Write notes or explanation...

------------------------------------------------

GOAL

Provide clean module previews while keeping editing controls centralized in the settings panel.