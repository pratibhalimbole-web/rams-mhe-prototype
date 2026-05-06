/**
 * Template Versioning Utility
 * 
 * Handles versioning logic for RAMS IRDS templates.
 * Ensures published templates remain immutable by creating new draft versions when edited.
 */

import { ReportTemplate } from '../services/reportService';

/**
 * Creates a new draft version from a published template
 * - Deep clones the template
 * - Increments version number
 * - Sets status to "Draft"
 * - Generates new template ID
 */
export function cloneTemplateAsNewDraft(template: ReportTemplate): ReportTemplate {
  // Deep clone the template to avoid mutations
  const newTemplate: ReportTemplate = {
    ...template,
    id: `template-${Date.now()}-v${template.version + 1}`,
    version: template.version + 1,
    status: "Draft",
    lastEdited: new Date().toISOString(),
    // Deep clone sections array
    sections: template.sections ? JSON.parse(JSON.stringify(template.sections)) : [],
  };

  console.log(`Created new draft version ${newTemplate.version} from published template v${template.version}`);

  return newTemplate;
}

/**
 * Checks if a template is published
 */
export function isPublished(template: ReportTemplate | null): boolean {
  return template?.status === "Published";
}

/**
 * Initializes version for a new template on first publish
 * - Sets version = 1 if undefined
 * - Sets status = "Published"
 */
export function initializeVersionOnPublish(template: ReportTemplate): ReportTemplate {
  return {
    ...template,
    version: template.version || 1,
    status: "Published",
    lastEdited: new Date().toISOString(),
  };
}

/**
 * Checks if a template needs versioning before modification
 * Returns true if the template is published and any modification should trigger versioning
 */
export function needsVersioning(currentStatus: string): boolean {
  return currentStatus === "Published";
}
