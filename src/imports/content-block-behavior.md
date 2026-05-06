FEATURE: Content Block Behavior in Report Draft

OBJECTIVE
Ensure that Content / Text Blocks added in the Template Builder act only as placeholders and become editable fields in the Report Draft for manual user input.

---

TEMPLATE BUILDER BEHAVIOR

In the Template Builder, users can add a Content Block (Text Block) under a module.

Purpose of this block:
• Provide space for manual observations
• Allow report authors to write explanations or findings related to the module output

Important rules:

1. Content blocks in the template must NOT contain actual report data.

2. They only define the structure and position where manual text will be entered later.

3. The block should display a placeholder message such as:

   "Click to edit content in report draft"

4. The template only stores the block type and configuration, not actual report content.

Example Template Structure:

Section
Module: Executive Summary
Visualization Block (Chart/Table/etc.)
Content Block (Notes placeholder)

---

REPORT DRAFT BEHAVIOR

When a report draft is created from a template:

1. The system must copy the full template structure including:
   • Sections
   • Modules
   • Visualization blocks
   • Content blocks

2. Content blocks must initialize with empty content.

3. The content block must render as an editable text area in the report draft.

Example Draft Rendering:

Executive Summary

[ Chart Output ]

Notes
[ Editable text field where user can type ]

4. The text area should show placeholder text such as:

   "Type observations or notes here..."

5. The user must be able to type, edit, and save content in this block.

6. This content must be stored with the report draft.

---

EDITABILITY RULES

Only Content Blocks should be editable in the report draft.

The following elements must remain read-only:
• Charts
• Tables
• Heatmaps
• Insights / KPI blocks
• System-generated content

Editable elements:
• Content / Text Blocks only.

---

DATA STRUCTURE

Template Block Example:

{
"type": "text_block",
"mode": "static",
"defaultContent": ""
}

Report Draft Block Example:

{
"type": "text_block",
"mode": "static",
"content": ""
}

---

RENDERING RULE

The report renderer must always follow this hierarchy:

Section
Module
Visualization Block
Content Block

The renderer must preserve the same order defined in the template builder.

---

GOAL

Ensure that Content Blocks serve as editable spaces for manual observations in the report draft while maintaining the template-defined report structure.
