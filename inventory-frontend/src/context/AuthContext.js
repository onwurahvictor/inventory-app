// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.data.user || response.data.user); // handle backend shape
    } catch (err) {
      console.error('Failed to load user:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
  try {
    setError(null);
    const response = await authAPI.login({ email, password });

    if (response.data.success) {
      const userData = response.data.data.user;
      localStorage.setItem('token', userData.token); // ✅ token is inside data.user
      setUser(userData);
      return { success: true };
    } else {
      return { success: false, error: response.data.message || 'Login failed' };
    }
  } catch (err) {
    console.error('Login error:', err);
    return { 
      success: false, 
      error: err.response?.data?.message || 'Network error. Please try again.' 
    };
  }
};

const register = async (name, email, password) => {
  try {
    setError(null);
    const response = await authAPI.register({ name, email, password });

    if (response.data.success) {
      const userData = response.data.data.user;
      localStorage.setItem('token', userData.token); // ✅ same fix
      setUser(userData);
      return { success: true };
    } else {
      return { success: false, error: response.data.message || 'Registration failed' };
    }
  } catch (err) {
    console.error('Registration error:', err);
    return { 
      success: false, 
      error: err.response?.data?.message || 'Network error. Please try again.' 
    };
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
