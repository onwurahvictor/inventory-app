import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'TechCorp Inventory',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    
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
    
    // Theme Settings
    theme: 'light'
  });

  const [formData, setFormData] = useState({
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

  const themes = [
    { id: 'light', name: 'Light', preview: 'theme-light' },
    { id: 'dark', name: 'Dark', preview: 'theme-dark' },
    { id: 'auto', name: 'Auto', preview: 'theme-auto' }
  ];

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password changed');
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAccountDeletion = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
    }
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'general':
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2 className="section-title">General Settings</h2>
              <p className="section-subtitle">
                Configure your company information and display preferences
              </p>
            </div>
            
            <form className="settings-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select
                    className="form-select"
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
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
                  >
                    {dateFormats.map(format => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary">
                  Cancel
                </button>
                <button type="button" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
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
              <div className="toggle-group">
                <div className="toggle-label">
                  <span className="toggle-title">Email Notifications</span>
                  <span className="toggle-description">
                    Receive important updates and alerts via email
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-group">
                <div className="toggle-label">
                  <span className="toggle-title">Push Notifications</span>
                  <span className="toggle-description">
                    Receive browser notifications for urgent alerts
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle('pushNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-group">
                <div className="toggle-label">
                  <span className="toggle-title">Low Stock Alerts</span>
                  <span className="toggle-description">
                    Get notified when items are running low
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.lowStockAlerts}
                    onChange={() => handleToggle('lowStockAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-group">
                <div className="toggle-label">
                  <span className="toggle-title">Price Change Alerts</span>
                  <span className="toggle-description">
                    Notify when item prices change significantly
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.priceChangeAlerts}
                    onChange={() => handleToggle('priceChangeAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-group">
                <div className="toggle-label">
                  <span className="toggle-title">Weekly Reports</span>
                  <span className="toggle-description">
                    Receive weekly summary reports every Monday
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={() => handleToggle('weeklyReports')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
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
              <div className="toggle-group">
                <div className="toggle-label">
                  <span className="toggle-title">Show Email to Others</span>
                  <span className="toggle-description">
                    Allow other users to see your email address
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.showEmail}
                    onChange={() => handleToggle('showEmail')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-group">
                <div className="toggle-label">
                  <span className="toggle-title">Activity Tracking</span>
                  <span className="toggle-description">
                    Allow system to track your activity for analytics
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.activityTracking}
                    onChange={() => handleToggle('activityTracking')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-group">
                <div className="toggle-label">
                  <span className="toggle-title">Data Sharing</span>
                  <span className="toggle-description">
                    Share anonymized data for product improvement
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.dataSharing}
                    onChange={() => handleToggle('dataSharing')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
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
            
            <div className="toggle-list">
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
              {themes.map(theme => (
                <div
                  key={theme.id}
                  className={`theme-option ${theme.preview} ${settings.theme === theme.id ? 'active' : ''}`}
                  onClick={() => handleChange('theme', theme.id)}
                >
                  <div className="theme-preview"></div>
                  <span className="theme-name">{theme.name}</span>
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
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Current Password <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      New Password <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                      required
                      minLength="8"
                    />
                    <div className="form-help">
                      Must be at least 8 characters long
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Confirm New Password <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </div>
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
              
              <div className="danger-actions">
                <button 
                  className="btn btn-danger"
                  onClick={handleAccountDeletion}
                >
                  <span>🗑️</span> Delete My Account
                </button>
              </div>
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
              <li key={section.id} className="nav-item">
                <a
                  href="#"
                  className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(section.id);
                  }}
                >
                  <span className="nav-icon">{section.icon}</span>
                  {section.label}
                </a>
              </li>
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