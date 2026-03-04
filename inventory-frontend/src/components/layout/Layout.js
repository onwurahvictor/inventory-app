// src/components/layout/Layout.js
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const navItems = [
    { to: '/', icon: '📊', label: 'Dashboard' },
    { to: '/items', icon: '📦', label: 'Items' },
    { to: '/categories', icon: '🏷️', label: 'Categories' },
    { to: '/alerts', icon: '🔔', label: 'Alerts' },
    { to: '/profile', icon: '👤', label: 'Profile' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h2 className="mobile-logo">Inventory</h2>
        <div className="mobile-avatar">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">Inventory</h2>
          <div className="user-info">
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name || 'User'}</span>
              <span className="user-email">{user.email || 'user@example.com'}</span>
            </div>
          </div>
        </div>

        <div className="sidebar-menu">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`menu-item ${isActive(item.to) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          <span>🚪</span> Sign Out
        </button>
      </nav>

      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;