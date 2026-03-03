import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
    phone: '+1 (555) 123-4567',
    department: 'Inventory Management',
    location: 'New York, NY',
    joinDate: 'January 15, 2023',
    bio: 'Inventory manager with 5+ years of experience in supply chain optimization and warehouse management.'
  });

  const [stats, setStats] = useState({
    totalItems: 156,
    alerts: 8,
    categories: 12,
    activeProjects: 3
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'login',
      title: 'Logged into system',
      description: 'Successfully authenticated from Chrome browser',
      time: 'Today, 10:30 AM'
    },
    {
      id: 2,
      type: 'update',
      title: 'Updated profile information',
      description: 'Changed contact phone number',
      time: 'Yesterday, 2:15 PM'
    },
    {
      id: 3,
      type: 'item',
      title: 'Added new item',
      description: 'Added "iPhone 15 Pro" to Electronics category',
      time: '2 days ago'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Resolved alert',
      description: 'Fixed low stock issue for Office Chairs',
      time: '3 days ago'
    },
    {
      id: 5,
      type: 'category',
      title: 'Created new category',
      description: 'Added "Raw Materials" category',
      time: '1 week ago'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'login': return '🔐';
      case 'update': return '✏️';
      case 'item': return '📦';
      case 'alert': return '🔔';
      case 'category': return '🏷️';
      default: return '📝';
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to API
    console.log('Profile saved:', user);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">
          Manage your personal information, activity, and account settings
        </p>
      </div>

      <div className="profile-content">
        {/* Profile Sidebar */}
        <div className="profile-sidebar">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" 
                alt="Profile" 
                className="profile-avatar"
              />
              <div className="avatar-upload" title="Upload new photo">
                📷
              </div>
            </div>
            <div className="user-info">
              <h2 className="user-name">{user.name}</h2>
              <div className="user-role">{user.role}</div>
            </div>
          </div>

          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.totalItems}</span>
              <span className="stat-label">Items</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.alerts}</span>
              <span className="stat-label">Alerts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.categories}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>

          <div className="join-date">
            <span className="join-label">Member Since</span>
            <span className="join-value">{user.joinDate}</span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="details-header">
            <h2 className="details-title">Personal Information</h2>
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              <span>{isEditing ? '💾' : '✏️'}</span>
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="profile-sections">
            {/* Basic Information */}
            <div className="section">
              <h3 className="section-title">Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="form-input"
                      value={user.name}
                      onChange={(e) => setUser({...user, name: e.target.value})}
                    />
                  ) : (
                    <div className="info-value">{user.name}</div>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      className="form-input"
                      value={user.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                    />
                  ) : (
                    <div className="info-value">{user.email}</div>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      className="form-input"
                      value={user.phone}
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                    />
                  ) : (
                    <div className="info-value">{user.phone}</div>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Department</label>
                  {isEditing ? (
                    <select 
                      className="form-select"
                      value={user.department}
                      onChange={(e) => setUser({...user, department: e.target.value})}
                    >
                      <option value="Inventory Management">Inventory Management</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Procurement">Procurement</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Management">Management</option>
                    </select>
                  ) : (
                    <div className="info-value">{user.department}</div>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Location</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="form-input"
                      value={user.location}
                      onChange={(e) => setUser({...user, location: e.target.value})}
                    />
                  ) : (
                    <div className="info-value">{user.location}</div>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Role</label>
                  <div className="info-value">{user.role}</div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="section">
              <h3 className="section-title">About Me</h3>
              <div className="info-item full-width">
                <label className="info-label">Bio</label>
                {isEditing ? (
                  <textarea 
                    className="form-textarea"
                    value={user.bio}
                    onChange={(e) => setUser({...user, bio: e.target.value})}
                    rows="4"
                  />
                ) : (
                  <div className="info-value editable" onClick={() => setIsEditing(true)}>
                    {user.bio}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="section">
              <h3 className="section-title">Recent Activity</h3>
              <div className="activity-timeline">
                {recentActivity.slice(0, 3).map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <h4 className="activity-title">{activity.title}</h4>
                      <p className="activity-desc">{activity.description}</p>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Activity Timeline */}
      <div className="recent-activity-section">
        <h2 className="recent-activity-title">Activity Timeline</h2>
        <div className="activity-timeline">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <h4 className="activity-title">{activity.title}</h4>
                <p className="activity-desc">{activity.description}</p>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;