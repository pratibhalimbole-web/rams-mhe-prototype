/**
 * Template Duplication Utility
 * 
 * Handles duplication logic for RAMS IRDS templates.
 * Creates independent draft copies of existing templates.
 */

import { ReportTemplate } from '../services/reportService';

/**
 * Creates a duplicate of a template with proper defaults
 * - Deep clones the template structure
 * - Generates new template ID
 * - Resets to draft status with version 1
 * - Appends " (Copy)" to name
 * - Preserves all sections, modules, and settings
 */
export function duplicateTemplate(originalTemplate: ReportTemplate): ReportTemplate {
  // Deep clone sections to avoid mutations
  const clonedSections = originalTemplate.sections 
    ? JSON.parse(JSON.stringify(originalTemplate.sections)) 
    : [];

  // Create the duplicated template
  const duplicatedTemplate: ReportTemplate = {
    ...originalTemplate,
    // Generate new unique ID
    id: `template-${Date.now()}-copy`,
    
    // Append (Copy) to name
    name: `${originalTemplate.name} (Copy)`,
    
    // Reset to draft with version 1
    status: "Draft",
    version: 1,
    
    // Update timestamps
    lastEdited: new Date().toISOString(),
    createdDate: new Date().toISOString(),
    
    // Keep structure
    sections: clonedSections,
    sectionsCount: originalTemplate.sectionsCount,
    modulesCount: originalTemplate.modulesCount,
    
    // Keep description
    description: originalTemplate.description,
    createdBy: originalTemplate.createdBy,
  };

  console.log(`Duplicated template: "${originalTemplate.name}" → "${duplicatedTemplate.name}" (v${duplicatedTemplate.version})`);

  return duplicatedTemplate;
}
