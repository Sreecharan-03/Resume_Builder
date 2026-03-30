
import api from './api';
import { getTemplateSections } from '../templates/templateConfig';

// Helper: get the active template's sections for AI context
const getActiveTemplateSections = () => {
  const templateId = parseInt(localStorage.getItem('selectedTemplate') || '1');
  return getTemplateSections(templateId);
};

const atsService = {
  /**
   * AI-assisted ATS analysis for a resume
   * @param {number} resumeId - The resume ID to analyze
   * @param {object} options - Analysis options
   * @param {string} options.jobDescription - Optional job description for matching
   * @param {string} options.phase - PHASE1 (completeness), PHASE2 (improvement), PHASE3 (role-based)
   * @param {string} options.targetRole - Target role for analysis
   * @param {boolean} options.useAI - Whether to use AI-assisted analysis (default: true)
   * @param {string[]} options.templateSections - Sections present in the selected template
   */
  analyzeResume: async (resumeId, options = {}) => {
    try {
      const {
        jobDescription = null,
        phase = 'PHASE3',
        targetRole = null,
        useAI = true,
        templateSections = getActiveTemplateSections(),
      } = options;
      
      const response = await api.post(`/ats/analyze/${resumeId}`, {
        jobDescription,
        phase,
        targetRole,
        useAI,
        templateSections,
      });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to analyze resume';
      return { success: false, message };
    }
  },

  /**
   * Calculate ATS score with AI assistance
   * @param {number} resumeId - The resume ID
   * @param {object} options - Calculation options
   */
  calculateATS: async (resumeId, options = {}) => {
    try {
      const {
        jobDescription = null,
        phase = 'PHASE3',
        targetRole = null,
        useAI = true,
        templateSections = getActiveTemplateSections(),
      } = options;
      
      const response = await api.post('/ats/calculate', {
        resumeId,
        jobDescription,
        phase,
        targetRole,
        useAI,
        templateSections,
      });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to calculate ATS score';
      return { success: false, message };
    }
  },

  /**
   * Get latest ATS result for a resume
   */
  getATSResult: async (resumeId) => {
    try {
      const response = await api.get(`/ats/result/${resumeId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get ATS result';
      return { success: false, message };
    }
  },

  /**
   * Get best (highest) historical ATS result for a resume
   */
  getBestATSResult: async (resumeId) => {
    try {
      const response = await api.get(`/ats/result/best/${resumeId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get best ATS result';
      return { success: false, message };
    }
  },

  /**
   * Get ATS result by resume ID (alternative endpoint)
   */
  getATSByResumeId: async (resumeId) => {
    try {
      const response = await api.get(`/ats/${resumeId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get ATS result';
      return { success: false, message };
    }
  },

  /**
   * Get recommendations for a resume
   */
  getRecommendations: async (resumeId) => {
    try {
      const response = await api.get(`/ats/recommendations/${resumeId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get recommendations';
      return { success: false, message };
    }
  },

  /**
   * Calculate ATS score locally (for preview/quick check without API call)
   */
  calculateLocalScore: (resumeData, targetRole) => {
    const roleKeywords = {
      'software_engineer': ['java', 'python', 'javascript', 'react', 'node', 'sql', 'git', 'agile', 'api', 'aws'],
      'java_developer': ['java', 'spring', 'spring boot', 'hibernate', 'sql', 'rest', 'api', 'maven', 'junit', 'microservices'],
      'frontend_developer': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'typescript', 'responsive', 'webpack', 'figma'],
      'backend_developer': ['java', 'python', 'node', 'sql', 'mongodb', 'api', 'docker', 'aws', 'microservices', 'redis'],
      'full_stack_developer': ['react', 'node', 'java', 'python', 'sql', 'mongodb', 'docker', 'api', 'git', 'aws'],
      'data_scientist': ['python', 'r', 'sql', 'machine learning', 'tensorflow', 'pandas', 'numpy', 'statistics', 'visualization', 'deep learning'],
      'product_manager': ['product', 'strategy', 'roadmap', 'agile', 'scrum', 'analytics', 'stakeholder', 'user research', 'metrics', 'kpi'],
      'devops_engineer': ['docker', 'kubernetes', 'aws', 'azure', 'ci/cd', 'jenkins', 'terraform', 'linux', 'monitoring', 'ansible'],
    };

    const role = targetRole?.toLowerCase().replace(/\s+/g, '_') || 'software_engineer';
    const keywords = roleKeywords[role] || roleKeywords['software_engineer'];

    const content = [
      resumeData.fullName || '',
      resumeData.summary || '',
      resumeData.skills || '',
      resumeData.experience || '',
      resumeData.education || '',
      resumeData.projects || '',
      resumeData.certifications || '',
    ].join(' ').toLowerCase();

    let matchedCount = 0;
    const matchedKeywords = [];
    const missingKeywords = [];

    keywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        matchedCount++;
        matchedKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });

    const keywordScore = Math.round((matchedCount / keywords.length) * 100);
    
    // Section completeness score
    let sectionScore = 0;
    if (resumeData.fullName) sectionScore += 10;
    if (resumeData.email) sectionScore += 10;
    if (resumeData.phone) sectionScore += 10;
    if (resumeData.summary && resumeData.summary.length > 50) sectionScore += 20;
    if (resumeData.skills && resumeData.skills.length > 20) sectionScore += 20;
    if (resumeData.experience && resumeData.experience.length > 100) sectionScore += 20;
    if (resumeData.education && resumeData.education.length > 30) sectionScore += 10;

    const overallScore = Math.round((keywordScore * 0.6) + (sectionScore * 0.4));

    // Determine status
    let status;
    if (overallScore >= 85) status = 'EXCELLENT';
    else if (overallScore >= 70) status = 'GOOD';
    else if (overallScore >= 50) status = 'AVERAGE';
    else status = 'POOR';

    return {
      overallScore,
      keywordScore,
      sectionScore,
      matchedKeywords,
      missingKeywords,
      status,
      isAiAnalyzed: false,
    };
  },

  /**
   * Get score status text and color class
   */
  getScoreStatus: (score) => {
    if (score >= 85) return { text: 'Excellent', class: 'excellent', color: '#10B981' };
    if (score >= 70) return { text: 'Good', class: 'good', color: '#3B82F6' };
    if (score >= 50) return { text: 'Average', class: 'average', color: '#F59E0B' };
    return { text: 'Needs Work', class: 'poor', color: '#EF4444' };
  },

  /**
   * Get phase description
   */
  getPhaseDescription: (phase) => {
    const descriptions = {
      'PHASE1': 'Resume Completeness Check',
      'PHASE2': 'Resume Improvement Analysis',
      'PHASE3': 'Role-Based ATS Analysis',
    };
    return descriptions[phase] || 'ATS Analysis';
  },
};

export default atsService;
