import api from './api';

const interviewService = {
  // Get interview prep for a resume
  getInterviewPrep: async (resumeId) => {
    try {
      const response = await api.get(`/interview/${resumeId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to get interview prep';
      return { success: false, message };
    }
  },
};

export default interviewService;
