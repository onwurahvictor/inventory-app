// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import StatsCard from '../components/dashboard/StatsCard';
// import LowStockTable from '../components/dashboard/LowStockTable';
// import CategoryChart from '../components/dashboard/CategoryChart';
// import RecentActivity from '../components/dashboard/RecentActivity';
// import './Dashboard.css';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       setStats({
//         totalItems: 45,
//         totalValue: 125000,
//         lowStockCount: 8,
//         outOfStockCount: 3,
//         categoryStats: [
//           { _id: 'Electronics', count: 15 },
//           { _id: 'Furniture', count: 8 },
//           { _id: 'Appliances', count: 12 },
//           { _id: 'Office Supplies', count: 10 },
//         ]
//       });
//       setLoading(false);
//     }, 500);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   const statCards = [
//     {
//       title: 'Total Items',
//       value: stats?.totalItems || 0,
//       icon: () => <span>📦</span>,
//       color: 'blue',
//       trend: '+12%',
//       trendUp: true
//     },
//     {
//       title: 'Low Stock',
//       value: stats?.lowStockCount || 0,
//       icon: () => <span>⚠️</span>,
//       color: 'yellow',
//       trend: '+5%',
//       trendUp: false
//     },
//     {
//       title: 'In Stock',
//       value: (stats?.totalItems || 0) - (stats?.lowStockCount || 0) - (stats?.outOfStockCount || 0),
//       icon: () => <span>✅</span>,
//       color: 'green',
//       trend: '+8%',
//       trendUp: true
//     },
//     {
//       title: 'Total Value',
//       value: `$${(stats?.totalValue || 0).toLocaleString()}`,
//       icon: () => <span>💰</span>,
//       color: 'blue',
//       trend: '+15%',
//       trendUp: true
//     }
//   ];

//   const lowStockItems = [
//     { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', quantity: 2 },
//     { id: 2, name: 'MacBook Air', category: 'Electronics', quantity: 3 },
//     { id: 3, name: 'Office Chair', category: 'Furniture', quantity: 4 },
//   ];

//   return (
//     <div className="p-6">
//       {/* Welcome section */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Welcome back, {user?.username}!
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Here's what's happening with your inventory today.
//         </p>
//       </div>

//       {/* Stats grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {statCards.map((stat, index) => (
//           <StatsCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* Charts and tables */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Low stock items */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Low Stock Items</h2>
//             <Link to="/alerts" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//               View all
//             </Link>
//           </div>
//           <LowStockTable items={lowStockItems} />
//         </div>

//         {/* Category distribution */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h2>
//           <CategoryChart data={stats?.categoryStats || []} />
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="mt-8 bg-white rounded-lg shadow p-6">
//         <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
//         <RecentActivity />
//       </div>

//       {/* Quick actions */}
//       <div className="mt-8">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Link
//             to="/items/new"
//             className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center border border-gray-200"
//           >
//             <div className="text-2xl mb-2">➕</div>
//             <p className="font-medium text-gray-900">Add New Item</p>
//           </Link>
//           <Link
//             to="/items"
//             className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center border border-gray-200"
//           >
//             <div className="text-2xl mb-2">📦</div>
//             <p className="font-medium text-gray-900">View Inventory</p>
//           </Link>
//           <Link
//             to="/alerts"
//             className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center border border-gray-200"
//           >
//             <div className="text-2xl mb-2">⚠️</div>
//             <p className="font-medium text-gray-900">Check Alerts</p>
//           </Link>
//           <Link
//             to="/categories"
//             className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center border border-gray-200"
//           >
//             <div className="text-2xl mb-2">🏷️</div>
//             <p className="font-medium text-gray-900">Manage Categories</p>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0,
    alerts: 0
  });

  const [recentItems, setRecentItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setStats({
        totalItems: 156,
        lowStock: 12,
        totalValue: 52480.75,
        alerts: 8
      });

      setRecentItems([
        { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', quantity: 5, price: 999.99, status: 'in-stock' },
        { id: 2, name: 'MacBook Air M2', category: 'Electronics', quantity: 3, price: 1299.99, status: 'low' },
        { id: 3, name: 'Office Chair', category: 'Furniture', quantity: 12, price: 199.99, status: 'in-stock' },
        { id: 4, name: 'Coffee Machine', category: 'Appliances', quantity: 7, price: 89.99, status: 'in-stock' },
      ]);

      setRecentActivity([
        { id: 1, type: 'add', title: 'New item added', description: 'iPhone 15 Pro added to inventory', time: '10 min ago' },
        { id: 2, type: 'update', title: 'Stock updated', description: 'MacBook Air quantity updated', time: '1 hour ago' },
        { id: 3, type: 'alert', title: 'Low stock alert', description: 'Desk Lamp stock is running low', time: '2 hours ago' },
        { id: 4, type: 'category', title: 'Category created', description: 'New "Tools" category added', time: '1 day ago' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getCurrentDate = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome back, Admin! 👋</h1>
            <p>Here's what's happening with your inventory today.</p>
          </div>
          <div className="date-display">
            <span className="day">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
            <span className="date">{getCurrentDate()}</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">📦</div>
            <div className="stat-trend positive">↑ 12%</div>
          </div>
          <h3 className="stat-value">{stats.totalItems}</h3>
          <p className="stat-label">Total Items</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">⚠️</div>
            <div className="stat-trend negative">↑ 3</div>
          </div>
          <h3 className="stat-value">{stats.lowStock}</h3>
          <p className="stat-label">Low Stock Items</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">💰</div>
            <div className="stat-trend positive">↑ 8%</div>
          </div>
          <h3 className="stat-value">${stats.totalValue.toLocaleString()}</h3>
          <p className="stat-label">Total Inventory Value</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">🔔</div>
            <div className="stat-trend">5 new</div>
          </div>
          <h3 className="stat-value">{stats.alerts}</h3>
          <p className="stat-label">Active Alerts</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Recent Items</h2>
            <Link to="/items" className="view-all">
              View All <span>→</span>
            </Link>
          </div>

          <div className="recent-items">
            {recentItems.length > 0 ? (
              recentItems.map(item => (
                <div key={item.id} className="item-row">
                  <div className="item-icon">
                    {item.category === 'Electronics' ? '💻' : 
                     item.category === 'Furniture' ? '🪑' : 
                     item.category === 'Appliances' ? '🔌' : '📦'}
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <span className="item-category">{item.category}</span>
                  </div>
                  <div className="item-quantity">{item.quantity} units</div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className={`item-status status-${item.status}`}>
                    {item.status === 'in-stock' ? 'In Stock' : 'Low Stock'}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3 className="empty-title">No items yet</h3>
                <p className="empty-desc">Start by adding your first inventory item</p>
                <Link to="/items/new" className="btn-primary">
                  Add New Item
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <Link to="/alerts" className="view-all">
              View All <span>→</span>
            </Link>
          </div>

          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'add' ? '➕' :
                   activity.type === 'update' ? '✏️' :
                   activity.type === 'alert' ? '⚠️' : '🏷️'}
                </div>
                <div className="activity-details">
                  <h4 className="activity-title">{activity.title}</h4>
                  <p className="activity-desc">{activity.description}</p>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>

          <div className="quick-actions">
            <Link to="/items/new" className="action-btn">
              <div>➕</div>
              <span>Add Item</span>
            </Link>
            <Link to="/categories" className="action-btn">
              <div>🏷️</div>
              <span>Manage Categories</span>
            </Link>
            <Link to="/alerts" className="action-btn">
              <div>🔔</div>
              <span>View Alerts</span>
            </Link>
            <Link to="/settings" className="action-btn">
              <div>⚙️</div>
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;