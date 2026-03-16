import api from './api';

const userService = {
  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to get user';
      return { success: false, message };
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to get user';
      return { success: false, message };
    }
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update user';
      return { success: false, message };
    }
  },
};

export default userService;
