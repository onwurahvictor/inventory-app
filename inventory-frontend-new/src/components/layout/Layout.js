// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import Sidebar from './Sidebar';
// import Header from './Header';
// // import styles from './Layout.module.css';
// import styles from './Layout.css';

// const Layout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const { user } = useAuth();

//   if (!user) return null;

//   return (
//     <div className={styles.layout}>
//       {/* Mobile sidebar */}
//       {sidebarOpen && (
//         <div className={styles.sidebarMobile}>
//           <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
//           <div className={styles.sidebarInner}>
//             <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//           </div>
//         </div>
//       )}
      
//       {/* Desktop sidebar */}
//       <div className={styles.sidebarDesktop}>
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//       </div>
      
//       {/* Main content */}
//       <div className={`${styles.mainContent}`}>
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <main style={{ flex: 1 }}>
//           <Outlet />
//         </main>
        
//         {/* Footer */}
//         <footer className={styles.footer}>
//           <div className={styles.footerContent}>
//             <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
//               © {new Date().getFullYear()} Inventory Manager. All rights reserved.
//             </p>
//             <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
//               v1.0.0
//             </p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Layout;


// src/components/layout/Layout.js
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if user exists to prevent duplicate rendering
  if (!user) {
    return null; // or redirect to login
  }

  return (
    <div className="layout">
      <nav className="sidebar">
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
          <Link to="/" className="menu-item">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/items" className="menu-item">
            <span>📦</span> Items
          </Link>
          <Link to="/categories" className="menu-item">
            <span>🏷️</span> Categories
          </Link>
          <Link to="/alerts" className="menu-item">
            <span>🔔</span> Alerts
          </Link>
          <Link to="/profile" className="menu-item">
            <span>👤</span> Profile
          </Link>
          <Link to="/settings" className="menu-item">
            <span>⚙️</span> Settings
          </Link>
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