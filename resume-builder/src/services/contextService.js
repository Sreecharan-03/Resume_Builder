import api from './api';

const contextService = {
  // Save job context
  saveContext: async (contextData) => {
    try {
      const response = await api.post('/context/save', contextData);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to save context';
      return { success: false, message };
    }
  },

  // Get context for a resume
  getContext: async (resumeId) => {
    try {
      const response = await api.get(`/context/${resumeId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to get context';
      return { success: false, message };
    }
  },
};

export default contextService;
