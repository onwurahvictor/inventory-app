import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activity, setActivity] = useState([]);

  // Job role options based on your enum in User model
  const jobRoleOptions = [
    { value: 'Inventory Management', label: 'Inventory Management' },
    { value: 'Warehouse', label: 'Warehouse' },
    { value: 'Procurement', label: 'Procurement' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Management', label: 'Management' },
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' }
  ];

  useEffect(() => {
    fetchUserProfile();
    fetchUserActivity();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching user profile...');
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view profile');
        toast.error('Please login to view profile');
        return;
      }

      const response = await authAPI.getMe();
      console.log('Profile response:', response);
      
      if (response.data && response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        setFormData({
          ...userData,
          // Map role to jobRole for display in form
          jobRole: userData.role || userData.jobRole || ''
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      
      let errorMessage = 'Failed to load profile';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.status === 404) {
        errorMessage = 'Profile endpoint not found';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivity = async () => {
    try {
      const response = await authAPI.getActivity();
      if (response.data && response.data.success) {
        setActivity(response.data.data.activities || []);
      }
    } catch (error) {
      console.error('Failed to load activity:', error);
      // Don't show toast for activity failure, just log it
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Prepare data for API - map jobRole back to role for backend
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        // Map jobRole to role (what backend expects)
        role: formData.jobRole || formData.role,
        department: formData.department,
        location: formData.location,
        bio: formData.bio
      };

      console.log('Sending update to backend:', updateData); // Debug log
      
      const response = await authAPI.updateProfile(updateData);
      
      if (response.data.success) {
        // Update local user state with response
        setUser(response.data.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
        
        // Refresh profile data to ensure everything is in sync
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await authAPI.uploadAvatar(formData);
      
      if (response.data.success) {
        setUser(prev => ({ ...prev, avatar: response.data.data.avatar }));
        toast.success('Avatar updated successfully');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'login': return '🔐';
      case 'logout': return '👋';
      case 'update': return '✏️';
      case 'create': return '➕';
      case 'delete': return '🗑️';
      default: return '📝';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'Not set';
    // Convert role to proper case if needed
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={fetchUserProfile}
        >
          Try Again
        </button>
        <button 
          className="login-btn"
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-state">
        <div className="error-icon">👤</div>
        <h2>Not Logged In</h2>
        <p>Please login to view your profile</p>
        <button 
          className="login-btn"
          onClick={() => window.location.href = '/login'}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="profile-content">
        {/* Profile Sidebar */}
        <div className="profile-sidebar">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="profile-avatar"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <label className="avatar-upload" title="Change photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
                <span>📷</span>
              </label>
            </div>
            <div className="user-info">
              <h2 className="user-name">{user?.name}</h2>
              <div className="user-role">{formatRole(user?.role)}</div>
            </div>
          </div>

          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-value">{user?.itemsCount || 0}</span>
              <span className="stat-label">Items</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user?.alertsCount || 0}</span>
              <span className="stat-label">Alerts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user?.categoriesCount || 0}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>

          <div className="user-meta">
            <div className="meta-item">
              <span className="meta-icon">📧</span>
              <div className="meta-content">
                <span className="meta-label">Email:</span>
                <span className="meta-value">{user?.email}</span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📱</span>
              <div className="meta-content">
                <span className="meta-label">Phone:</span>
                <span className="meta-value">{user?.phone || 'Not set'}</span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <div className="meta-content">
                <span className="meta-label">Location:</span>
                <span className="meta-value">{user?.location || 'Not set'}</span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <div className="meta-content">
                <span className="meta-label">Joined:</span>
                <span className="meta-value">
                  {formatDate(user?.createdAt)}
                </span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🕒</span>
              <div className="meta-content">
                <span className="meta-label">Last Login:</span>
                <span className="meta-value">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'First time'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="details-header">
            <h2 className="details-title">Personal Information</h2>
            {!isEditing ? (
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <span>✏️</span> Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      ...user,
                      jobRole: user?.role || ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <div className="info-value">{user?.name}</div>
              )}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <div className="info-value">{user?.email}</div>
              )}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <div className="info-value">{user?.phone || 'Not set'}</div>
              )}
            </div>

            {/* Job Role Field */}
            <div className="form-group">
              <label>Job Role</label>
              {isEditing ? (
                <select
                  name="jobRole"
                  value={formData.jobRole || ''}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select job role</option>
                  {jobRoleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="info-value">{formatRole(user?.role)}</div>
              )}
            </div>

            {/* Department Field */}
            <div className="form-group">
              <label>Department</label>
              {isEditing ? (
                <select
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select department</option>
                  <option value="Inventory Management">Inventory Management</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Management">Management</option>
                </select>
              ) : (
                <div className="info-value">{user?.department || 'Not set'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="City, Country"
                />
              ) : (
                <div className="info-value">{user?.location || 'Not set'}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="info-value bio-text">
                  {user?.bio || 'No bio provided'}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h3 className="activity-title">Recent Activity</h3>
            <div className="activity-timeline">
              {activity.length > 0 ? (
                activity.map(act => (
                  <div key={act._id} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(act.type)}
                    </div>
                    <div className="activity-content">
                      <h4 className="activity-action">{act.action}</h4>
                      <p className="activity-description">{act.description}</p>
                      <span className="activity-time">
                        {new Date(act.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;