// Settings.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';
import './Settings.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    priceChangeAlerts: false,
    weeklyReports: true,
    
    // Privacy Settings
    showEmail: false,
    activityTracking: true,
    dataSharing: false,
    
    // Account Settings
    twoFactorAuth: false,
    autoLogout: 30,
    sessionLimit: 3,
    
    // General Settings
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    
    // Theme Settings
    theme: 'light'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🛡️' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching settings...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view settings');
        toast.error('Please login to view settings');
        return;
      }

      // Try to get user settings from the profile endpoint
      const response = await authAPI.getMe();
      console.log('Settings response:', response);
      
      if (response.data && response.data.success) {
        const userData = response.data.data.user;
        // Extract settings from user data
        setSettings({
          // Notification Settings
          emailNotifications: userData.emailNotifications ?? true,
          pushNotifications: userData.pushNotifications ?? true,
          lowStockAlerts: userData.lowStockAlerts ?? true,
          priceChangeAlerts: userData.priceChangeAlerts ?? false,
          weeklyReports: userData.weeklyReports ?? true,
          
          // Privacy Settings
          showEmail: userData.showEmail ?? false,
          activityTracking: userData.activityTracking ?? true,
          dataSharing: userData.dataSharing ?? false,
          
          // Account Settings
          twoFactorAuth: userData.twoFactorAuth ?? false,
          autoLogout: userData.autoLogout || 30,
          sessionLimit: userData.sessionLimit || 3,
          
          // General Settings
          language: userData.language || 'en',
          timezone: userData.timezone || 'America/New_York',
          dateFormat: userData.dateFormat || 'MM/DD/YYYY',
          
          // Theme Settings
          theme: userData.theme || 'light'
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      
      let errorMessage = 'Failed to load settings';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key) => {
    try {
      setSaving(true);
      const newValue = !settings[key];
      
      // Update settings via API
      const response = await authAPI.updateSettings({ [key]: newValue });
      
      if (response.data.success) {
        setSettings(prev => ({ ...prev, [key]: newValue }));
        toast.success('Setting updated successfully');
      }
    } catch (error) {
      console.error('Update setting error:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = async (key, value) => {
    try {
      setSaving(true);
      const response = await authAPI.updateSettings({ [key]: value });
      
      if (response.data.success) {
        setSettings(prev => ({ ...prev, [key]: value }));
        toast.success('Setting updated successfully');
      }
    } catch (error) {
      console.error('Update setting error:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setSaving(true);
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await authAPI.deleteAccount();
      
      if (response.data.success) {
        toast.success('Account deleted successfully');
        localStorage.clear();
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Failed to delete account');
    }
  };

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' }
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'GMT (London)' },
    { value: 'Europe/Paris', label: 'CET (Paris)' },
    { value: 'Asia/Tokyo', label: 'JST (Tokyo)' }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Settings</h2>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={fetchSettings}
        >
          Try Again
        </button>
      </div>
    );
  }

  const renderSection = () => {
    switch(activeSection) {
      case 'general':
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2 className="section-title">General Settings</h2>
              <p className="section-subtitle">
                Configure your display preferences and language settings
              </p>
            </div>
            
            <div className="settings-form">
              <div className="form-group">
                <label className="form-label">Language</label>
                <select
                  className="form-select"
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  disabled={saving}
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Timezone</label>
                <select
                  className="form-select"
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  disabled={saving}
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Date Format</label>
                <select
                  className="form-select"
                  value={settings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  disabled={saving}
                >
                  {dateFormats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2 className="section-title">Notification Settings</h2>
              <p className="section-subtitle">
                Control how and when you receive notifications
              </p>
            </div>
            
            <div className="toggle-list">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive important updates via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser notifications' },
                { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Get notified when items are running low' },
                { key: 'priceChangeAlerts', label: 'Price Change Alerts', desc: 'Notify when item prices change' },
                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary reports' }
              ].map(item => (
                <div key={item.key} className="toggle-group">
                  <div className="toggle-label">
                    <span className="toggle-title">{item.label}</span>
                    <span className="toggle-description">{item.desc}</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={() => handleToggle(item.key)}
                      disabled={saving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2 className="section-title">Privacy Settings</h2>
              <p className="section-subtitle">
                Manage your privacy preferences and data sharing
              </p>
            </div>
            
            <div className="toggle-list">
              {[
                { key: 'showEmail', label: 'Show Email to Others', desc: 'Allow other users to see your email' },
                { key: 'activityTracking', label: 'Activity Tracking', desc: 'Allow tracking your activity for analytics' },
                { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data for product improvement' }
              ].map(item => (
                <div key={item.key} className="toggle-group">
                  <div className="toggle-label">
                    <span className="toggle-title">{item.label}</span>
                    <span className="toggle-description">{item.desc}</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={() => handleToggle(item.key)}
                      disabled={saving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2 className="section-title">Account Settings</h2>
              <p className="section-subtitle">
                Manage your account preferences and security
              </p>
            </div>
            
            <div className="settings-form">
              <div className="toggle-group">
                <div className="toggle-label">
                  <span className="toggle-title">Two-Factor Authentication</span>
                  <span className="toggle-description">
                    Add an extra layer of security to your account
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={() => handleToggle('twoFactorAuth')}
                    disabled={saving}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="form-group">
                <label className="form-label">Auto-logout After (minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  min="5"
                  max="240"
                  value={settings.autoLogout}
                  onChange={(e) => handleChange('autoLogout', parseInt(e.target.value))}
                  disabled={saving}
                />
                <div className="form-help">
                  Automatically log out after specified minutes of inactivity
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Maximum Concurrent Sessions</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="10"
                  value={settings.sessionLimit}
                  onChange={(e) => handleChange('sessionLimit', parseInt(e.target.value))}
                  disabled={saving}
                />
                <div className="form-help">
                  Maximum number of devices that can be logged in simultaneously
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2 className="section-title">Appearance Settings</h2>
              <p className="section-subtitle">
                Customize the look and feel of your dashboard
              </p>
            </div>
            
            <div className="theme-selector">
              {['light', 'dark', 'auto'].map(theme => (
                <div
                  key={theme}
                  className={`theme-option theme-${theme} ${settings.theme === theme ? 'active' : ''}`}
                  onClick={() => handleChange('theme', theme)}
                >
                  <div className="theme-preview"></div>
                  <span className="theme-name">
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <>
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">Security Settings</h2>
                <p className="section-subtitle">
                  Change your password and manage security options
                </p>
              </div>
              
              <form onSubmit={handlePasswordChange} className="settings-form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                    required
                    disabled={saving}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                    required
                    minLength="8"
                    disabled={saving}
                  />
                  <div className="form-help">
                    Must be at least 8 characters long
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })}
                    required
                    disabled={saving}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
            
            <div className="danger-zone">
              <div className="danger-header">
                <div className="danger-icon">⚠️</div>
                <h3 className="danger-title">Danger Zone</h3>
              </div>
              
              <p className="danger-description">
                Deleting your account will permanently remove all your data, 
                including inventory items, categories, and activity history. 
                This action cannot be undone.
              </p>
              
              <button 
                className="btn-danger"
                onClick={handleAccountDeletion}
                disabled={saving}
              >
                <span>🗑️</span> Delete My Account
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">
          Configure your application preferences, notifications, and account settings
        </p>
      </div>

      <div className="settings-content">
        {/* Settings Sidebar */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Main Content */}
        <div className="settings-main">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Settings;