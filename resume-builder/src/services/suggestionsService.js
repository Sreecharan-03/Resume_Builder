
import api from './api';

const suggestionsService = {
  // Get missing skills for a resume
  getMissingSkills: async (resumeId) => {
    try {
      const response = await api.get(`/skills/missing/${resumeId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to get missing skills';
      return { success: false, message };
    }
  },

  // Get AI suggestions
  getAISuggestions: async (requestData) => {
    try {
      const response = await api.post('/suggestions/ai', requestData);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to get AI suggestions';
      return { success: false, message };
    }
  },
};

export default suggestionsService;
