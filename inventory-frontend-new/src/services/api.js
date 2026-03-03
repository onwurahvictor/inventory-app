// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
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
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || { error: 'Network error' });
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/update', userData),
};

// Item APIs
export const itemAPI = {
  getItems: (params) => api.get('/items', { params }),
  getItem: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => api.post('/items', itemData),
  updateItem: (id, itemData) => api.put(`/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/${id}`),
};

// Category APIs
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  getCategoryStats: () => api.get('/categories/stats/summary'),
};

// Alert APIs
export const alertAPI = {
  getAlerts: (params) => api.get('/alerts', { params }),
  getAlertStats: () => api.get('/alerts/stats'),
  markAsRead: (id) => api.put(`/alerts/${id}/read`),
  markAllAsRead: () => api.put('/alerts/mark-all-read'),
  resolveAlert: (id) => api.put(`/alerts/${id}/resolve`),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
  clearAllAlerts: () => api.delete('/alerts/clear-all'),
  getLowStockAlerts: () => api.get('/alerts/low-stock'),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: async () => {
    const [items, categories, alerts, categoryStats] = await Promise.all([
      itemAPI.getItems({ limit: 5 }),
      categoryAPI.getCategories(),
      alertAPI.getAlerts({ limit: 5 }),
      categoryAPI.getCategoryStats(),
    ]);
    
    return {
      items: items.items || [],
      categories: categories.categories || [],
      alerts: alerts.alerts || [],
      stats: {
        totalItems: items.total || 0,
        totalCategories: categories.count || 0,
        totalAlerts: alerts.total || 0,
        ...categoryStats.stats,
      },
    };
  },
};

export default api;