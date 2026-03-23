import api from './api';

const applicationService = {
  saveApplication: async (payload) => {
    try {
      const response = await api.post('/applications/save', payload);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save application';
      return { success: false, message };
    }
  },

  getHistory: async () => {
    try {
      const response = await api.get('/applications/history');
      return { success: true, data: response.data.data || [] };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load application history';
      return { success: false, message, data: [] };
    }
  },
};

export default applicationService;
