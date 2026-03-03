import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { alertsAPI } from '../services/api';
import './Alerts.css';

const Alerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    critical: 0,
    resolvedToday: 0
  });

  // Fetch alerts from backend
  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await alertsAPI.getAll();
      
      if (response.data.success) {
        const alertsData = response.data.data.alerts;
        setAlerts(alertsData);
        updateStats(alertsData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark alert as read
  const markAsRead = async (id) => {
    try {
      const response = await alertsAPI.markAsRead(id);
      
      if (response.data.success) {
        setAlerts(alerts.map(alert => 
          alert._id === id ? { ...alert, read: true } : alert
        ));
        updateStats(alerts.map(alert => 
          alert._id === id ? { ...alert, read: true } : alert
        ));
        toast.success('Alert marked as read');
      }
    } catch (err) {
      toast.error('Failed to mark alert as read');
    }
  };

  // Mark all alerts as read
  const markAllAsRead = async () => {
    try {
      const response = await alertsAPI.markAllAsRead();
      
      if (response.data.success) {
        const updatedAlerts = alerts.map(alert => ({ ...alert, read: true }));
        setAlerts(updatedAlerts);
        updateStats(updatedAlerts);
        toast.success('All alerts marked as read');
      }
    } catch (err) {
      toast.error('Failed to mark all alerts as read');
    }
  };

  // Resolve/delete alert
  const resolveAlert = async (id) => {
    if (!window.confirm('Mark this alert as resolved?')) return;

    try {
      const response = await alertsAPI.delete(id);
      
      if (response.data.success) {
        const updatedAlerts = alerts.filter(alert => alert._id !== id);
        setAlerts(updatedAlerts);
        updateStats(updatedAlerts);
        toast.success('Alert resolved successfully');
      }
    } catch (err) {
      toast.error('Failed to resolve alert');
    }
  };

  // Clear all alerts
  const clearAllAlerts = async () => {
    if (!window.confirm('Are you sure you want to clear all alerts?')) return;

    try {
      const response = await alertsAPI.deleteAll();
      
      if (response.data.success) {
        setAlerts([]);
        updateStats([]);
        toast.success('All alerts cleared');
      }
    } catch (err) {
      toast.error('Failed to clear alerts');
    }
  };

  // Update alert statistics
  const updateStats = (alertList) => {
    const today = new Date().toDateString();
    
    setStats({
      total: alertList.length,
      unread: alertList.filter(a => !a.read).length,
      critical: alertList.filter(a => a.type === 'critical').length,
      resolvedToday: alertList.filter(a => 
        a.resolvedAt && new Date(a.resolvedAt).toDateString() === today
      ).length
    });
  };

  // Navigate to item details
  const viewItemDetails = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  // Initial fetch and real-time updates
  useEffect(() => {
    fetchAlerts();

    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchAlerts, 30000);

    return () => clearInterval(intervalId);
  }, [fetchAlerts]);

  // Filter alerts based on current filter and search
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread' && alert.read) return false;
    if (filter === 'critical' && alert.type !== 'critical') return false;
    if (filter === 'warning' && alert.type !== 'warning') return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.title?.toLowerCase().includes(query) ||
        alert.description?.toLowerCase().includes(query) ||
        (alert.itemName && alert.itemName.toLowerCase().includes(query)) ||
        (alert.category && alert.category.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '🔔';
    }
  };

  const getAlertTypeLabel = (type) => {
    switch(type) {
      case 'critical': return 'Critical';
      case 'warning': return 'Warning';
      case 'info': return 'Info';
      case 'success': return 'Success';
      default: return 'Alert';
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="alerts-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alerts-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Alerts</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchAlerts}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h1 className="alerts-title">Alerts & Notifications</h1>
        <p className="alerts-subtitle">
          Stay informed about critical events, low stock, and important updates in your inventory
        </p>
      </div>

      {/* Stats Section */}
      <div className="alert-stats">
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <h3 className="stat-value">{stats.total}</h3>
          <p className="stat-label">Total Alerts</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <h3 className="stat-value">{stats.unread}</h3>
          <p className="stat-label">Unread</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <h3 className="stat-value">{stats.critical}</h3>
          <p className="stat-label">Critical</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3 className="stat-value">{stats.resolvedToday}</h3>
          <p className="stat-label">Resolved Today</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({stats.unread})
          </button>
          <button 
            className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
            onClick={() => setFilter('critical')}
          >
            Critical ({stats.critical})
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="actions">
          <button 
            className="action-btn"
            onClick={markAllAsRead}
            disabled={stats.unread === 0}
          >
            Mark All Read
          </button>
          <button 
            className="action-btn danger"
            onClick={clearAllAlerts}
            disabled={alerts.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h3>No Alerts Found</h3>
            <p>You're all caught up! No alerts at the moment.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div 
              key={alert._id} 
              className={`alert-item ${alert.type} ${alert.read ? 'read' : 'unread'}`}
              onClick={() => !alert.read && markAsRead(alert._id)}
            >
              <div className="alert-icon">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="alert-content">
                <div className="alert-header">
                  <h3 className="alert-title">{alert.title}</h3>
                  <span className="alert-badge">{getAlertTypeLabel(alert.type)}</span>
                </div>
                
                <p className="alert-description">{alert.description}</p>
                
                <div className="alert-meta">
                  {alert.itemName && (
                    <span className="meta-item">📦 {alert.itemName}</span>
                  )}
                  {alert.category && (
                    <span className="meta-item">🏷️ {alert.category}</span>
                  )}
                  {alert.currentStock !== undefined && (
                    <span className="meta-item">
                      📊 Stock: {alert.currentStock}/{alert.minimumStock}
                    </span>
                  )}
                  <span className="meta-item">
                    🕒 {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="alert-actions">
                {alert.itemId && (
                  <button 
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewItemDetails(alert.itemId);
                    }}
                    title="View Item"
                  >
                    👁️
                  </button>
                )}
                <button 
                  className="btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    resolveAlert(alert._id);
                  }}
                  title="Resolve"
                >
                  ✓
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;