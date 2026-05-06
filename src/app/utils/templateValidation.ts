/**
 * Template Validation Utility
 * 
 * Validates RAMS IRDS templates before publishing.
 * Save is allowed anytime, but Publish requires a valid template.
 */

// Enable debug logging for validation
const DEBUG_VALIDATION = false;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sectionErrors?: Map<number, string[]>; // Map section index to its errors
}

export interface TemplateSection {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  modules: TemplateModule[];
}

export interface TemplateModule {
  type?: string;
  [key: string]: any;
}

export interface Template {
  name?: string;
  sections?: TemplateSection[];
}

/**
 * Validates a template against all required rules
 * 
 * Rules:
 * 1. Template name is not empty
 * 2. Template contains at least 1 section
 * 3. Every section has a non-empty title
 * 4. All sections except 'text' type must contain at least 1 module
 * 5. No duplicate section titles (case insensitive)
 * 6. Every module must have a valid type
 */
export function validateTemplate(template: Template): ValidationResult {
  const errors: string[] = [];
  const sectionErrors = new Map<number, string[]>();

  // Rule 1: Template name is required
  if (!template.name || template.name.trim() === "") {
    errors.push("Template name is required.");
  }

  // Rule 2: At least one section is required
  if (!template.sections || template.sections.length === 0) {
    errors.push("At least one section is required.");
  } else {
    const sectionTitles = new Set<string>();

    template.sections.forEach((section, index) => {
      const sectionErrs: string[] = [];
      
      // Get the title from either 'title' or 'name' field
      const sectionTitle = section.title || section.name || '';
      
      // Rule 3: Section must have a title
      if (!sectionTitle || sectionTitle.trim() === "") {
        const error = `Section ${index + 1} must have a title.`;
        errors.push(error);
        sectionErrs.push("Missing section title");
      } else {
        // Rule 5: No duplicate section titles (case insensitive)
        const normalizedTitle = sectionTitle.toLowerCase().trim();
        if (sectionTitles.has(normalizedTitle)) {
          const error = `Duplicate section title: "${sectionTitle}"`;
          errors.push(error);
          sectionErrs.push("Duplicate title");
        }
        sectionTitles.add(normalizedTitle);
      }

      // Rule 4: All sections except 'text' type must contain at least one module
      if (section.type !== "text") {
        if (!section.modules || section.modules.length === 0) {
          const displayTitle = sectionTitle || `Section ${index + 1}`;
          const error = `Section "${displayTitle}" must contain at least one module.`;
          errors.push(error);
          sectionErrs.push("No modules added");
        }
      }

      // Rule 6: Every module must have a valid type
      if (section.modules && section.modules.length > 0) {
        section.modules.forEach((module, moduleIndex) => {
          if (!module.type) {
            const displayTitle = sectionTitle || `Section ${index + 1}`;
            const error = `Invalid module in section "${displayTitle}" (module ${moduleIndex + 1} has no type).`;
            errors.push(error);
            sectionErrs.push(`Module ${moduleIndex + 1} has no type`);
          }
        });
      }
      
      // Store section-specific errors
      if (sectionErrs.length > 0) {
        sectionErrors.set(index, sectionErrs);
      }
    });
  }

  if (DEBUG_VALIDATION) {
    console.log("Validation Result:", {
      isValid: errors.length === 0,
      errors,
      sectionErrors,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sectionErrors,
  };
}

/**
 * Returns the first invalid section index (for scrolling/highlighting)
 * Returns -1 if no invalid sections found
 */
export function getFirstInvalidSectionIndex(template: Template): number {
  if (!template.sections || template.sections.length === 0) {
    return -1;
  }

  for (let i = 0; i < template.sections.length; i++) {
    const section = template.sections[i];
    const sectionTitle = section.title || section.name || '';
    
    // Check if section has empty title
    if (!sectionTitle || sectionTitle.trim() === "") {
      return i;
    }

    // Check if non-text section has no modules
    // All sections except 'text' type must contain modules
    if (section.type !== "text" && (!section.modules || section.modules.length === 0)) {
      return i;
    }

    // Check if any module has no type
    if (section.modules && section.modules.length > 0) {
      const hasInvalidModule = section.modules.some(module => !module.type);
      if (hasInvalidModule) {
        return i;
      }
    }
  }

  return -1;
}