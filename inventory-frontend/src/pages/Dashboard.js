// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { dashboardAPI, itemAPI, alertsAPI } from '../services/api';
// import './Dashboard.css';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalItems: 0,
//     totalValue: 0,
//     lowStockCount: 0,
//     outOfStockCount: 0,
//     categoriesCount: 0,
//     activeAlerts: 0
//   });

//   const [recentItems, setRecentItems] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [categoryDistribution, setCategoryDistribution] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch all dashboard data in parallel
//       const [statsRes, itemsRes, activityRes, alertsRes, categoriesRes] = await Promise.all([
//         dashboardAPI.getStats(),
//         itemAPI.getAll({ limit: 5, sort: '-createdAt' }),
//         dashboardAPI.getRecentActivity(),
//         alertsAPI.getAll(),
//         dashboardAPI.getCategoryDistribution()
//       ]);

//       if (statsRes.data.success) {
//         setStats(statsRes.data.data.stats);
//       }

//       if (itemsRes.data.success) {
//         setRecentItems(itemsRes.data.data.items);
//       }

//       if (activityRes.data.success) {
//         setRecentActivity(activityRes.data.data.activities);
//       }

//       if (alertsRes.data.success) {
//         setStats(prev => ({
//           ...prev,
//           activeAlerts: alertsRes.data.data.alerts.filter(a => !a.read).length
//         }));
//       }

//       if (categoriesRes.data.success) {
//         setCategoryDistribution(categoriesRes.data.data.distribution);
//       }

//     } catch (error) {
//       toast.error('Failed to load dashboard data');
//       console.error('Dashboard error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (quantity, threshold = 5) => {
//     if (quantity === 0) return 'status-out';
//     if (quantity <= threshold) return 'status-low';
//     return 'status-good';
//   };

//   const getStatusText = (quantity, threshold = 5) => {
//     if (quantity === 0) return 'Out of Stock';
//     if (quantity <= threshold) return 'Low Stock';
//     return 'In Stock';
//   };

//   const getActivityIcon = (type) => {
//     switch(type) {
//       case 'create': return '➕';
//       case 'update': return '✏️';
//       case 'delete': return '🗑️';
//       case 'login': return '🔐';
//       case 'logout': return '👋';
//       case 'alert': return '🔔';
//       default: return '📝';
//     }
//   };

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(value);
//   };

//   if (loading) {
//     return (
//       <div className="loading-spinner">
//         <div className="spinner"></div>
//         <p>Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard">
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="welcome-section">
//           <h1>Dashboard Overview</h1>
//           <p>Welcome back! Here's what's happening with your inventory today.</p>
//         </div>
//         <div className="date-display">
//           {new Date().toLocaleDateString('en-US', { 
//             weekday: 'long', 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric' 
//           })}
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="stats-grid">
//         <div className="stat-card" onClick={() => navigate('/items')}>
//           <div className="stat-icon">📦</div>
//           <div className="stat-content">
//             <h3 className="stat-value">{stats.totalItems}</h3>
//             <p className="stat-label">Total Items</p>
//           </div>
//           <div className="stat-trend positive">+{stats.totalItems > 0 ? '12' : '0'}%</div>
//         </div>

//         <div className="stat-card" onClick={() => navigate('/items?filter=low-stock')}>
//           <div className="stat-icon">⚠️</div>
//           <div className="stat-content">
//             <h3 className="stat-value">{stats.lowStockCount}</h3>
//             <p className="stat-label">Low Stock Items</p>
//           </div>
//           <div className="stat-trend negative">{stats.lowStockCount > 0 ? 'Needs attention' : 'All good'}</div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon">💰</div>
//           <div className="stat-content">
//             <h3 className="stat-value">{formatCurrency(stats.totalValue)}</h3>
//             <p className="stat-label">Total Inventory Value</p>
//           </div>
//           <div className="stat-trend positive">+8.2%</div>
//         </div>

//         <div className="stat-card" onClick={() => navigate('/alerts')}>
//           <div className="stat-icon">🔔</div>
//           <div className="stat-content">
//             <h3 className="stat-value">{stats.activeAlerts}</h3>
//             <p className="stat-label">Active Alerts</p>
//           </div>
//           <div className={`stat-trend ${stats.activeAlerts > 0 ? 'negative' : 'positive'}`}>
//             {stats.activeAlerts > 0 ? `${stats.activeAlerts} unread` : 'No alerts'}
//           </div>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="dashboard-grid">
//         {/* Recent Items */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2 className="card-title">Recent Items</h2>
//             <Link to="/items" className="view-all-link">
//               View All <span>→</span>
//             </Link>
//           </div>

//           <div className="recent-items-list">
//             {recentItems.length > 0 ? (
//               recentItems.map(item => (
//                 <div 
//                   key={item._id} 
//                   className="recent-item"
//                   onClick={() => navigate(`/items/${item._id}`)}
//                 >
//                   <div className="item-icon">
//                     {item.category?.icon || '📦'}
//                   </div>
//                   <div className="item-info">
//                     <h4 className="item-name">{item.name}</h4>
//                     <p className="item-meta">
//                       {item.category?.name} • SKU: {item.sku || 'N/A'}
//                     </p>
//                   </div>
//                   <div className="item-stock">
//                     <span className={`stock-badge ${getStatusColor(item.quantity, item.lowStockThreshold)}`}>
//                       {getStatusText(item.quantity, item.lowStockThreshold)}
//                     </span>
//                     <span className="item-quantity">{item.quantity} units</span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="empty-state">
//                 <p>No items found</p>
//                 <Link to="/items/new" className="btn-primary btn-sm">
//                   Add Your First Item
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2 className="card-title">Recent Activity</h2>
//             <Link to="/activity" className="view-all-link">
//               View All <span>→</span>
//             </Link>
//           </div>

//           <div className="activity-timeline">
//             {recentActivity.length > 0 ? (
//               recentActivity.map(activity => (
//                 <div key={activity._id} className="activity-item">
//                   <div className="activity-icon">
//                     {getActivityIcon(activity.type)}
//                   </div>
//                   <div className="activity-content">
//                     <h4 className="activity-title">{activity.action}</h4>
//                     <p className="activity-description">{activity.description}</p>
//                     <span className="activity-time">
//                       {new Date(activity.createdAt).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="empty-state">
//                 <p>No recent activity</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Category Distribution */}
//         <div className="dashboard-card full-width">
//           <div className="card-header">
//             <h2 className="card-title">Category Distribution</h2>
//             <Link to="/categories" className="view-all-link">
//               Manage Categories <span>→</span>
//             </Link>
//           </div>

//           <div className="category-distribution">
//             {categoryDistribution.length > 0 ? (
//               categoryDistribution.map(cat => (
//                 <div key={cat._id} className="category-progress">
//                   <div className="category-info">
//                     <span className="category-name">{cat._id}</span>
//                     <span className="category-count">{cat.count} items</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div 
//                       className="progress-fill"
//                       style={{ 
//                         width: `${(cat.count / stats.totalItems) * 100}%`,
//                         backgroundColor: cat.color || '#3b82f6'
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="empty-state">
//                 <p>No categories yet</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="quick-actions">
//         <h2 className="quick-actions-title">Quick Actions</h2>
//         <div className="actions-grid">
//           <button 
//             className="action-card"
//             onClick={() => navigate('/items/new')}
//           >
//             <span className="action-icon">➕</span>
//             <span className="action-label">Add New Item</span>
//           </button>
          
//           <button 
//             className="action-card"
//             onClick={() => navigate('/categories/new')}
//           >
//             <span className="action-icon">🏷️</span>
//             <span className="action-label">Create Category</span>
//           </button>
          
//           <button 
//             className="action-card"
//             onClick={() => navigate('/alerts')}
//           >
//             <span className="action-icon">🔔</span>
//             <span className="action-label">View Alerts</span>
//           </button>
          
//           <button 
//             className="action-card"
//             onClick={() => window.location.reload()}
//           >
//             <span className="action-icon">🔄</span>
//             <span className="action-label">Refresh Data</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { dashboardAPI, itemAPI, alertsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    categoriesCount: 0,
    activeAlerts: 0,
    recentActivities: 0
  });

  const [recentItems, setRecentItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [alertsSummary, setAlertsSummary] = useState({
    total: 0,
    unread: 0,
    critical: 0,
    warning: 0,
    today: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching dashboard data...');

      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view dashboard');
        toast.error('Please login to view dashboard');
        return;
      }

      // Fetch all dashboard data in parallel with error handling
      const results = await Promise.allSettled([
        dashboardAPI.getStats().catch(err => {
          console.error('Stats API error:', err);
          return { data: { success: false, data: { stats: {} } } };
        }),
        itemAPI.getAll({ limit: 5, sort: '-createdAt' }).catch(err => {
          console.error('Items API error:', err);
          return { data: { success: false, data: { items: [] } } };
        }),
        dashboardAPI.getRecentActivity().catch(err => {
          console.error('Activity API error:', err);
          return { data: { success: false, data: { activities: [] } } };
        }),
        alertsAPI.getAll().catch(err => {
          console.error('Alerts API error:', err);
          return { data: { success: false, data: { alerts: [] } } };
        }),
        dashboardAPI.getCategoryDistribution().catch(err => {
          console.error('Category API error:', err);
          return { data: { success: false, data: { distribution: [] } } };
        }),
        dashboardAPI.getAlertsSummary().catch(err => {
          console.error('Alerts summary API error:', err);
          return { data: { success: false, data: { summary: {} } } };
        })
      ]);

      // Process stats
      if (results[0].status === 'fulfilled' && results[0].value?.data?.success) {
        const statsData = results[0].value.data.data;
        setStats(prev => ({
          ...prev,
          totalItems: statsData.stats?.totalItems || 0,
          totalValue: statsData.stats?.totalValue || 0,
          lowStockCount: statsData.stats?.lowStockCount || 0,
          outOfStockCount: statsData.stats?.outOfStockCount || 0,
          categoriesCount: statsData.stats?.categoriesCount || 0,
          recentActivities: statsData.stats?.recentActivities || 0
        }));
        
        // Set top categories if available
        if (statsData.topCategories) {
          setTopCategories(statsData.topCategories);
        }
      }

      // Process recent items
      if (results[1].status === 'fulfilled' && results[1].value?.data?.success) {
        setRecentItems(results[1].value.data.data.items || []);
      }

      // Process recent activity
      if (results[2].status === 'fulfilled' && results[2].value?.data?.success) {
        setRecentActivity(results[2].value.data.data.activities || []);
      }

      // Process alerts to update active alerts count
      if (results[3].status === 'fulfilled' && results[3].value?.data?.success) {
        const alerts = results[3].value.data.data.alerts || [];
        setStats(prev => ({
          ...prev,
          activeAlerts: alerts.filter(a => !a.read).length
        }));
      }

      // Process category distribution
      if (results[4].status === 'fulfilled' && results[4].value?.data?.success) {
        setCategoryDistribution(results[4].value.data.data.distribution || []);
      }

      // Process alerts summary
      if (results[5].status === 'fulfilled' && results[5].value?.data?.success) {
        setAlertsSummary(results[5].value.data.data.summary || {
          total: 0,
          unread: 0,
          critical: 0,
          warning: 0,
          today: 0
        });
      }

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (quantity, threshold = 5) => {
    if (quantity === 0) return 'status-out';
    if (quantity <= threshold) return 'status-low';
    return 'status-good';
  };

  const getStatusText = (quantity, threshold = 5) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= threshold) return 'Low Stock';
    return 'In Stock';
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'login': return '🔐';
      case 'logout': return '👋';
      case 'alert': return '🔔';
      default: return '📝';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={fetchDashboardData}
        >
          Try Again
        </button>
        <button 
          className="login-btn"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with your inventory today.</p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/items')}>
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalItems}</h3>
            <p className="stat-label">Total Items</p>
          </div>
          <div className="stat-trend positive">
            {stats.totalItems > 0 ? 'Active' : 'No items'}
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/items?filter=low-stock')}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.lowStockCount}</h3>
            <p className="stat-label">Low Stock Items</p>
          </div>
          <div className={`stat-trend ${stats.lowStockCount > 0 ? 'negative' : 'positive'}`}>
            {stats.lowStockCount > 0 ? 'Needs attention' : 'All good'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-value">{formatCurrency(stats.totalValue)}</h3>
            <p className="stat-label">Total Inventory Value</p>
          </div>
          <div className="stat-trend positive">
            {stats.totalValue > 0 ? 'Active' : 'No value'}
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/alerts')}>
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.activeAlerts}</h3>
            <p className="stat-label">Active Alerts</p>
          </div>
          <div className={`stat-trend ${stats.activeAlerts > 0 ? 'negative' : 'positive'}`}>
            {stats.activeAlerts > 0 ? `${stats.activeAlerts} unread` : 'No alerts'}
          </div>
        </div>
      </div>

      {/* Alerts Summary */}
      {alertsSummary.critical > 0 && (
        <div className="alerts-banner critical">
          <span className="banner-icon">🚨</span>
          <span className="banner-text">
            You have {alertsSummary.critical} critical alert{alertsSummary.critical > 1 ? 's' : ''} that need immediate attention!
          </span>
          <button className="banner-btn" onClick={() => navigate('/alerts')}>
            View Alerts
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Items */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Recent Items</h2>
            <Link to="/items" className="view-all-link">
              View All <span>→</span>
            </Link>
          </div>

          <div className="recent-items-list">
            {recentItems.length > 0 ? (
              recentItems.map(item => (
                <div 
                  key={item._id} 
                  className="recent-item"
                  onClick={() => navigate(`/items/${item._id}`)}
                >
                  <div className="item-icon">
                    {item.category?.icon || '📦'}
                  </div>
                  <div className="item-info">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-meta">
                      {item.category?.name || 'Uncategorized'} • SKU: {item.sku || 'N/A'}
                    </p>
                  </div>
                  <div className="item-stock">
                    <span className={`stock-badge ${getStatusColor(item.quantity, item.minimumStock)}`}>
                      {getStatusText(item.quantity, item.minimumStock)}
                    </span>
                    <span className="item-quantity">{item.quantity} units</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No items found</p>
                <Link to="/items/new" className="btn-primary btn-sm">
                  Add Your First Item
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
            <Link to="/activity" className="view-all-link">
              View All <span>→</span>
            </Link>
          </div>

          <div className="activity-timeline">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <h4 className="activity-title">{activity.action}</h4>
                    <p className="activity-description">{activity.description}</p>
                    <span className="activity-time">
                      {formatDate(activity.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h2 className="card-title">Category Distribution</h2>
            <Link to="/categories" className="view-all-link">
              Manage Categories <span>→</span>
            </Link>
          </div>

          <div className="category-distribution">
            {categoryDistribution.length > 0 ? (
              categoryDistribution.map(cat => (
                <div key={cat._id || cat.name} className="category-progress">
                  <div className="category-info">
                    <span className="category-name">
                      <span className="category-color-dot" style={{ backgroundColor: cat.color || '#3b82f6' }}></span>
                      {cat.name || cat._id}
                    </span>
                    <span className="category-count">{cat.itemCount || cat.count || 0} items</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${((cat.itemCount || cat.count || 0) / Math.max(stats.totalItems, 1)) * 100}%`,
                        backgroundColor: cat.color || '#3b82f6'
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏷️</div>
                <p>No categories yet</p>
                <Link to="/categories/new" className="btn-primary btn-sm">
                  Create Category
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="quick-actions-title">Quick Actions</h2>
        <div className="actions-grid">
          <button 
            className="action-card"
            onClick={() => navigate('/items/new')}
          >
            <span className="action-icon">➕</span>
            <span className="action-label">Add New Item</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => navigate('/categories/new')}
          >
            <span className="action-icon">🏷️</span>
            <span className="action-label">Create Category</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => navigate('/alerts')}
          >
            <span className="action-icon">🔔</span>
            <span className="action-label">View Alerts</span>
          </button>
          
          <button 
            className="action-card"
            onClick={fetchDashboardData}
          >
            <span className="action-icon">🔄</span>
            <span className="action-label">Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Top Categories Section (if available) */}
      {topCategories.length > 0 && (
        <div className="top-categories">
          <h2 className="section-title">Top Categories</h2>
          <div className="categories-grid">
            {topCategories.map(cat => (
              <div key={cat._id} className="category-stat-card" style={{ borderColor: cat.color }}>
                <div className="category-stat-header">
                  <span className="category-stat-icon">{cat.icon || '📦'}</span>
                  <h3 className="category-stat-name">{cat.name}</h3>
                </div>
                <div className="category-stat-details">
                  <div className="category-stat-item">
                    <span className="stat-label">Items</span>
                    <span className="stat-value">{cat.count}</span>
                  </div>
                  <div className="category-stat-item">
                    <span className="stat-label">Value</span>
                    <span className="stat-value">{formatCurrency(cat.totalValue || 0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

