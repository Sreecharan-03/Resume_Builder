import api from './api';

const authService = {
  // Register a new user
  register: async (fullName, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password,
      });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      return { success: false, error: errorMsg };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      return { success: false, error: errorMsg };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: 'Failed to get user' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is logged in
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;
