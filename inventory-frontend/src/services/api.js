// api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  getSettings: () => api.get('/auth/settings'), // Add this
  getActivity: () => api.get('/auth/activity'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  updateSettings: (data) => api.patch('/auth/settings', data), // This should exist
  changePassword: (data) => api.patch('/auth/change-password', data),
  uploadAvatar: (formData) => api.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteAccount: () => api.delete('/auth/account'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getLowStockItems: () => api.get('/dashboard/low-stock'),
  getCategoryDistribution: () => api.get('/dashboard/category-distribution'),
  getMonthlyTrends: () => api.get('/dashboard/monthly-trends'),
  getAlertsSummary: () => api.get('/dashboard/alerts-summary'), // Add this line
};

// Items API
export const itemAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.patch(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  getLowStock: () => api.get('/items/low-stock'),
  getStats: () => api.get('/items/stats'),
};

// Categories API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  getStats: () => api.get('/categories/stats'),
};

// Alerts API
export const alertsAPI = {
  getAll: () => api.get('/alerts'),
  getById: (id) => api.get(`/alerts/${id}`),
  create: (data) => api.post('/alerts', data),
  markAsRead: (id) => api.patch(`/alerts/${id}/read`),
  markAllAsRead: () => api.post('/alerts/mark-all-read'),
  delete: (id) => api.delete(`/alerts/${id}`),
  deleteAll: () => api.delete('/alerts'),
  getStats: () => api.get('/alerts/stats'),
};

export default api;
