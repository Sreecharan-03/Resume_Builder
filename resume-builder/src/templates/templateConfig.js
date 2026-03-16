/**
 * Template Section Configuration
 * Defines which resume sections each template uses.
 * Builder and Enhance pages read this to show only relevant steps.
 *
 * Section keys (must match Builder step sections):
 *   personal, education, experience, skills, projects,
 *   certifications, languages, activities
 */

export const templateSections = {
  // ── Custom / Special templates ──────────────────────────────
  100: {
    name: 'Data Scientist / Junior Dev',
    sections: ['personal', 'experience', 'education', 'skills', 'activities'],
    description: 'Focused on technical experience, education and activities.'
  },
  101: {
    name: 'Classic Academic',
    sections: ['personal', 'education', 'experience', 'skills', 'certifications', 'languages', 'activities'],
    description: 'Table-style academic CV with certifications and languages.'
  },
  102: {
    name: 'Three Column Showcase',
    sections: ['personal', 'experience', 'skills', 'education'],
    description: 'Compact three-column layout — keep it concise.'
  },
  103: {
    name: 'Traditional Clean',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications'],
    description: 'Classic professional template.'
  },

  // ── Standard templates 1-20 ──────────────────────────────────
  1: {
    name: 'Modern Professional',
    sections: ['personal', 'experience', 'education', 'skills', 'projects'],
    description: 'Clean modern design — core professional sections only.'
  },
  2: {
    name: 'Creative Designer',
    sections: ['personal', 'experience', 'skills', 'education', 'projects', 'certifications', 'languages', 'activities'],
    description: 'Full showcase for creatives with all sections.'
  },
  3: {
    name: 'Minimal Clean',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
    description: 'Minimalist design highlighting essential qualifications.'
  },
  4: {
    name: 'Executive Classic',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'activities'],
    description: 'Polished executive template with all key sections.'
  },
  5: {
    name: 'Tech Innovator',
    sections: ['personal', 'experience', 'projects', 'education', 'skills', 'certifications', 'languages'],
    description: 'Developer-focused with prominent projects and tech stack.'
  },
  6: {
    name: 'Elegant Serif',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'activities'],
    description: 'Sophisticated serif design for all professional fields.'
  },
  7: {
    name: 'Bold Impact',
    sections: ['personal', 'experience', 'skills', 'education', 'projects', 'certifications', 'languages', 'activities'],
    description: 'High-impact layout for competitive job markets.'
  },
  8: {
    name: 'Corporate Pro',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'activities'],
    description: 'Corporate structured layout with all sections covered.'
  },
  9: {
    name: 'Academic Scholar',
    sections: ['personal', 'education', 'experience', 'projects', 'skills', 'certifications', 'languages', 'activities'],
    description: 'Research-oriented — education first, then experience.'
  },
  10: {
    name: 'Startup Vibe',
    sections: ['personal', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages', 'activities'],
    description: 'Modern startup style — skills and projects front and center.'
  },
  11: {
    name: 'Healthcare Pro',
    sections: ['personal', 'experience', 'education', 'skills', 'certifications'],
    description: 'Healthcare-focused with certifications prominently displayed.'
  },
  12: {
    name: 'Finance Expert',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'activities'],
    description: 'Finance resume with competencies and credentials.'
  },
  13: {
    name: 'Artistic Portfolio',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'activities'],
    description: 'Portfolio layout — showcase your creative projects.'
  },
  14: {
    name: 'Clean Sidebar',
    sections: ['personal', 'experience', 'projects', 'education', 'skills', 'certifications', 'languages'],
    description: 'Two-column with sidebar for skills and education.'
  },
  15: {
    name: 'Minimal Plus',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
    description: 'Minimal with extra detail — clean and space-efficient.'
  },
  16: {
    name: 'Marketing Pro',
    sections: ['personal', 'experience', 'skills', 'education', 'projects', 'certifications', 'languages', 'activities'],
    description: 'Marketing-oriented layout with achievements focus.'
  },
  17: {
    name: 'Engineering Focus',
    sections: ['personal', 'experience', 'projects', 'education', 'skills', 'certifications', 'languages', 'activities'],
    description: 'Engineering template — projects and technical skills first.'
  },
  18: {
    name: 'Consultant Elite',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'activities'],
    description: 'Elite consulting resume with full professional profile.'
  },
  19: {
    name: 'Fresh Graduate',
    sections: ['personal', 'education', 'projects', 'experience', 'skills', 'certifications', 'languages', 'activities'],
    description: 'Graduate-focused — education and projects first.'
  },
  20: {
    name: 'Premium Executive',
    sections: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'activities'],
    description: 'Premium executive layout for senior professionals.'
  }
};

/**
 * All available builder sections in display order
 */
export const ALL_SECTIONS = [
  'personal',
  'education',
  'experience',
  'skills',
  'projects',
  'certifications',
  'languages',
  'activities'
];

/**
 * Get the sections for a template, falling back to core sections
 */
export const getTemplateSections = (templateId) => {
  return templateSections[templateId]?.sections || ['personal', 'experience', 'education', 'skills'];
};

/**
 * Check if a section is used by a template
 */
export const templateHasSection = (templateId, section) => {
  const sections = getTemplateSections(templateId);
  return sections.includes(section);
};

/**
 * Human-readable section labels
 */
export const sectionLabels = {
  personal: 'Personal Info',
  education: 'Education',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  activities: 'Activities'
};

export default templateSections;
