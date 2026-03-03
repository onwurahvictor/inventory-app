import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Items.css';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setItems(data.items);
      } else {
        setError(data.error || 'Failed to fetch items');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/items/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setItems(items.filter(item => item._id !== id));
        } else {
          alert(data.error || 'Failed to delete item');
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading items...</p>
      </div>
    );
  }

  return (
    <div className="items-page">
      <div className="items-header">
        <div>
          <h1>Inventory Items</h1>
          <p className="subtitle">Manage your inventory items</p>
        </div>
        <Link to="/items/new" className="btn btn-primary">
          Add New Item
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No items found in your inventory</p>
          <Link to="/items/new" className="btn btn-secondary">
            Add Your First Item
          </Link>
        </div>
      ) : (
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Name</th>
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
                    <div className="item-name">{item.name}</div>
                    <div className="item-sku">SKU: {item.sku}</div>
                  </td>
                  <td>{item.sku}</td>
                  <td>
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: `${item.category?.color}20`, color: item.category?.color }}
                    >
                      {item.category?.name}
                    </span>
                  </td>
                  <td className="quantity-cell">
                    <div className="item-quantity">{item.quantity}</div>
                  </td>
                  <td className="price-cell">
                    <div className="item-price">${item.price.toFixed(2)}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      item.quantity === 0 ? 'status-out' :
                      item.quantity <= (item.minimumStock || 5) ? 'status-low' : 'status-good'
                    }`}>
                      {item.quantity === 0 ? 'Out of Stock' :
                       item.quantity <= (item.minimumStock || 5) ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="item-actions">
                      <Link
                        to={`/items/${item._id}`}
                        className="btn-action btn-view"
                      >
                        View
                      </Link>
                      <Link
                        to={`/items/${item._id}/edit`}
                        className="btn-action btn-edit"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn-action btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Items;