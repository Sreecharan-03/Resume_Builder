import api from './api';

const jobService = {
  fetchJobs: async ({ role, page = 1, limit = 20, resumeId } = {}) => {
    try {
      const response = await api.get('/jobs', {
        params: {
          role,
          page,
          limit,
          ...(resumeId ? { resumeId } : {}),
        },
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      const status = error.response?.status;
      const message = backendMessage
        ? `Failed to fetch jobs: ${backendMessage}`
        : status
          ? `Failed to fetch jobs (HTTP ${status})`
          : 'Failed to fetch jobs';
      return { success: false, message };
    }
  },

  generateContent: async (payload) => {
    try {
      const response = await api.post('/jobs/generate-content', payload);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate AI content';
      return { success: false, message };
    }
  },
};

export default jobService;
