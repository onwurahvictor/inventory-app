// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { itemAPI, categoryAPI } from '../services/api';
// import './Items.css';

// const Items = () => {
//   const navigate = useNavigate();

//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     category: '',
//     status: '',
//     search: '',
//     sort: '-createdAt'
//   });

//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     fetchItems();
//   }, [filters, pagination.page]);

//   const fetchCategories = async () => {
//     try {
//       const response = await categoryAPI.getAll();

//       if (response?.data?.success) {
//         setCategories(response.data.data?.categories || []);
//       }
//     } catch (error) {
//       toast.error('Failed to load categories');
//     }
//   };

//   const fetchItems = async () => {
//     try {
//       setLoading(true);

//       const response = await itemAPI.getAll({
//         ...filters,
//         page: pagination.page,
//         limit: pagination.limit
//       });

//       if (response?.data?.success) {
//         setItems(response.data.data?.items || []);

//         // SAFE pagination update
//         if (response.data.pagination) {
//           setPagination(prev => ({
//             ...prev,
//             ...response.data.pagination
//           }));
//         }
//       }
//     } catch (error) {
//       toast.error('Failed to load items');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return;

//     try {
//       const response = await itemAPI.delete(id);

//       if (response?.data?.success) {
//         toast.success('Item deleted successfully');
//         fetchItems();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to delete item');
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchItems();
//   };

//   const getStatusBadge = (item) => {
//     if (item.quantity === 0)
//       return <span className="status-badge status-out">Out of Stock</span>;

//     if (item.quantity <= (item.lowStockThreshold || 5))
//       return <span className="status-badge status-low">Low Stock</span>;

//     return <span className="status-badge status-good">In Stock</span>;
//   };

//   const formatCurrency = (value) =>
//     new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(value);

//   if (loading && items.length === 0) {
//     return (
//       <div className="loading-spinner">
//         <div className="spinner"></div>
//         <p>Loading items...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="items-page">
//       <div className="items-header">
//         <div>
//           <h1>Inventory Items</h1>
//           <p className="subtitle">Manage your inventory items</p>
//         </div>
//         <button
//           onClick={() => navigate('/items/new')}
//           className="btn-primary"
//         >
//           ➕ Add New Item
//         </button>
//       </div>

//       {items.length === 0 ? (
//         <div className="empty-state">
//           <div className="empty-icon">📦</div>
//           <h3>No Items Found</h3>
//           <p>Get started by adding your first inventory item</p>
//           <button
//             onClick={() => navigate('/items/new')}
//             className="btn-primary"
//           >
//             Add New Item
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="items-table-container">
//             <table className="items-table">
//               <thead>
//                 <tr>
//                   <th>Item</th>
//                   <th>SKU</th>
//                   <th>Quantity</th>
//                   <th>Price</th>
//                   <th>Total Value</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map(item => (
//                   <tr key={item._id}>
//                     <td>{item.name}</td>
//                     <td>{item.sku || 'N/A'}</td>
//                     <td>{item.quantity}</td>
//                     <td>{formatCurrency(item.price)}</td>
//                     <td>{formatCurrency(item.quantity * item.price)}</td>
//                     <td>{getStatusBadge(item)}</td>
//                     <td>
//                       <button onClick={() => navigate(`/items/${item._id}`)}>👁️</button>
//                       <button onClick={() => navigate(`/items/${item._id}/edit`)}>✏️</button>
//                       <button onClick={() => handleDelete(item._id)}>🗑️</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {pagination.pages > 1 && (
//             <div className="pagination">
//               <button
//                 onClick={() =>
//                   setPagination(prev => ({ ...prev, page: prev.page - 1 }))
//                 }
//                 disabled={pagination.page === 1}
//               >
//                 ← Previous
//               </button>

//               <span>
//                 Page {pagination.page} of {pagination.pages}
//               </span>

//               <button
//                 onClick={() =>
//                   setPagination(prev => ({ ...prev, page: prev.page + 1 }))
//                 }
//                 disabled={pagination.page === pagination.pages}
//               >
//                 Next →
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Items;


// Items.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { itemAPI, categoryAPI } from '../services/api';
import './Items.css';

const Items = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: '',
    sort: '-createdAt'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Don't show toast for categories failure, just log it
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching items with filters:', filters);
      
      const response = await itemAPI.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      console.log('Items response:', response);

      if (response.data && response.data.success) {
        setItems(response.data.data.items || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to load items');
      }
    } catch (error) {
      console.error('Failed to load items:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load items');
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await itemAPI.delete(id);
      
      if (response.data.success) {
        toast.success('Item deleted successfully');
        fetchItems(); // Refresh the list
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const getStatusBadge = (item) => {
    if (item.quantity === 0) {
      return <span className="status-badge status-out">Out of Stock</span>;
    }
    if (item.quantity <= (item.minimumStock || 5)) {
      return <span className="status-badge status-low">Low Stock</span>;
    }
    return <span className="status-badge status-good">In Stock</span>;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  if (loading && items.length === 0) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Items</h3>
        <p>{error}</p>
        <button onClick={fetchItems} className="retry-btn">
          Try Again
        </button>
        <button onClick={() => navigate('/login')} className="login-btn">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="items-page">
      {/* Header */}
      <div className="items-header">
        <div>
          <h1>Inventory Items</h1>
          <p className="subtitle">Manage your inventory items</p>
        </div>
        <button
          onClick={() => navigate('/items/new')}
          className="btn-primary"
        >
          <span>➕</span> Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            placeholder="Search items..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="filter-select"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
          <option value="-quantity">Most Stock</option>
          <option value="quantity">Least Stock</option>
          <option value="-price">Highest Price</option>
          <option value="price">Lowest Price</option>
        </select>
      </div>

      {/* Items Table */}
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Items Found</h3>
          <p>Get started by adding your first inventory item</p>
          <button
            onClick={() => navigate('/items/new')}
            className="btn-primary"
          >
            Add New Item
          </button>
        </div>
      ) : (
        <>
          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="item-row">
                    <td className="item-name-cell">
                      <div className="item-info">
                        <div className="item-icon">
                          {item.category?.icon || '📦'}
                        </div>
                        <div>
                          <div className="item-name">{item.name}</div>
                          {item.description && (
                            <div className="item-description">{item.description.substring(0, 50)}...</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{item.sku || 'N/A'}</td>
                    <td>
                      <span 
                        className="category-badge"
                        style={{ 
                          backgroundColor: `${item.category?.color}20`, 
                          color: item.category?.color 
                        }}
                      >
                        {item.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td>
                      <div className="quantity-cell">
                        <span className={`quantity-value ${item.quantity <= (item.minimumStock || 5) ? 'critical' : ''}`}>
                          {item.quantity}
                        </span>
                        {item.quantity <= (item.minimumStock || 5) && (
                          <span className="warning-icon" title="Low Stock">⚠️</span>
                        )}
                      </div>
                    </td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{getStatusBadge(item)}</td>
                    <td>
                      <div className="item-actions">
                        <button
                          onClick={() => navigate(`/items/${item._id}`)}
                          className="btn-icon"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => navigate(`/items/${item._id}/edit`)}
                          className="btn-icon"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn-icon delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Items;