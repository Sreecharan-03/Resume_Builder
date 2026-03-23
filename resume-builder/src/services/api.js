import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8083/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Avoid stale browser/proxy caches for dynamic GET endpoints.
    if ((config.method || '').toLowerCase() === 'get') {
      config.params = {
        ...(config.params || {}),
        _t: Date.now(),
      };
      config.headers['Cache-Control'] = 'no-cache';
      config.headers.Pragma = 'no-cache';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ========================================
// Template API Functions
// ========================================

/**
 * Get all templates
 */
export const getAllTemplates = async () => {
  const response = await api.get('/templates');
  return response.data;
};

/**
 * Get template by ID
 */
export const getTemplateById = async (id) => {
  const response = await api.get(`/templates/${id}`);
  return response.data;
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = async (category) => {
  const response = await api.get(`/templates/category/${category}`);
  return response.data;
};

/**
 * Get free templates
 */
export const getFreeTemplates = async () => {
  const response = await api.get('/templates/free');
  return response.data;
};

/**
 * Get pro templates
 */
export const getProTemplates = async () => {
  const response = await api.get('/templates/pro');
  return response.data;
};

/**
 * Get template filters
 */
export const getTemplateFilters = async () => {
  const response = await api.get('/templates/filters');
  return response.data;
};

export default api;
