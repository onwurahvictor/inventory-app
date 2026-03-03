import React, { useState } from 'react';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Low Stock Alert',
      description: 'iPhone 15 Pro stock is below minimum threshold (3 units left)',
      type: 'critical',
      item: 'iPhone 15 Pro',
      category: 'Electronics',
      currentStock: 3,
      minimumStock: 5,
      time: '10 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'Price Change Detected',
      description: 'MacBook Air price increased by 15%',
      type: 'warning',
      item: 'MacBook Air M2',
      category: 'Electronics',
      oldPrice: 1299.99,
      newPrice: 1499.99,
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'New Item Added',
      description: 'Office Chair has been added to inventory',
      type: 'info',
      item: 'Office Chair',
      category: 'Furniture',
      addedBy: 'Admin',
      quantity: 12,
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      title: 'Stock Replenished',
      description: 'Desk Lamp stock has been replenished',
      type: 'success',
      item: 'Desk Lamp',
      category: 'Furniture',
      oldQuantity: 2,
      newQuantity: 15,
      time: '1 day ago',
      read: true
    },
    {
      id: 5,
      title: 'Expiring Items',
      description: '5 items are approaching expiration date',
      type: 'warning',
      itemsCount: 5,
      category: 'Food',
      expirationDate: '2024-01-15',
      time: '2 days ago',
      read: false
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical': return '⚠️';
      case 'warning': return '🔔';
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

  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const resolveAlert = (id) => {
    if (window.confirm('Mark this alert as resolved?')) {
      setAlerts(alerts.filter(alert => alert.id !== id));
    }
  };

  const clearAllAlerts = () => {
    if (window.confirm('Are you sure you want to clear all alerts?')) {
      setAlerts([]);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread' && alert.read) return false;
    if (filter === 'critical' && alert.type !== 'critical') return false;
    if (filter === 'warning' && alert.type !== 'warning') return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        (alert.item && alert.item.toLowerCase().includes(query)) ||
        (alert.category && alert.category.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const stats = {
    total: alerts.length,
    unread: alerts.filter(a => !a.read).length,
    critical: alerts.filter(a => a.type === 'critical').length,
    resolvedToday: 3 // This could be dynamic
  };

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
          <div className="stat-icon">⚠️</div>
          <h3 className="stat-value">{stats.unread}</h3>
          <p className="stat-label">Unread Alerts</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <h3 className="stat-value">{stats.critical}</h3>
          <p className="stat-label">Critical Alerts</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3 className="stat-value">{stats.resolvedToday}</h3>
          <p className="stat-label">Resolved Today</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h2 className="filters-title">Filter Alerts</h2>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <span>📋</span> All
            </button>
            <button 
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              <span>📬</span> Unread
            </button>
            <button 
              className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
              onClick={() => setFilter('critical')}
            >
              <span>🚨</span> Critical
            </button>
            <button 
              className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
              onClick={() => setFilter('warning')}
            >
              <span>⚠️</span> Warning
            </button>
          </div>
        </div>

        <div className="search-box">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            className="search-input"
            placeholder="Search alerts by title, item, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-list-section">
        <div className="alerts-list-header">
          <h2 className="alerts-list-title">
            Recent Alerts ({filteredAlerts.length})
          </h2>
          <div className="alerts-actions">
            <button 
              className="action-btn mark-all-read"
              onClick={markAllAsRead}
              disabled={alerts.every(a => a.read)}
            >
              <span>✓</span> Mark All Read
            </button>
            <button 
              className="action-btn clear-all"
              onClick={clearAllAlerts}
              disabled={alerts.length === 0}
            >
              <span>🗑️</span> Clear All
            </button>
          </div>
        </div>

        <div className="alerts-list">
          {filteredAlerts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h3 className="empty-title">No Alerts Found</h3>
              <p className="empty-desc">
                {filter === 'all' && alerts.length === 0 
                  ? "You're all caught up! No alerts at the moment."
                  : `No ${filter !== 'all' ? filter : ''} alerts found${searchQuery ? ` for "${searchQuery}"` : ''}.`
                }
              </p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`alert-item ${alert.type} ${alert.read ? 'read' : 'unread'}`}
                onClick={() => !alert.read && markAsRead(alert.id)}
              >
                <div className="alert-icon">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="alert-content">
                  <h3 className="alert-title">
                    {alert.title}
                    <span className="badge">{getAlertTypeLabel(alert.type)}</span>
                  </h3>
                  <p className="alert-description">{alert.description}</p>
                  
                  <div className="alert-meta">
                    {alert.item && (
                      <span className="meta-item">
                        <span>📦</span> {alert.item}
                      </span>
                    )}
                    {alert.category && (
                      <span className="meta-item">
                        <span>🏷️</span> {alert.category}
                      </span>
                    )}
                    {alert.currentStock !== undefined && (
                      <span className="meta-item">
                        <span>📊</span> Stock: {alert.currentStock}/{alert.minimumStock}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="alert-actions">
                  <div className="alert-time">
                    <span>🕒</span> {alert.time}
                  </div>
                  <div className="alert-buttons">
                    <button 
                      className="alert-btn resolve-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveAlert(alert.id);
                      }}
                    >
                      <span>✓</span> Resolve
                    </button>
                    <button 
                      className="alert-btn view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to item detail
                      }}
                    >
                      <span>👁️</span> View
                    </button>
                    {!alert.read && (
                      <button 
                        className="alert-btn ignore-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(alert.id);
                        }}
                      >
                        <span>👌</span> Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;