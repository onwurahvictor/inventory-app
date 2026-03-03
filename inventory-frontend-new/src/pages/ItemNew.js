import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemForm.css';

const ItemNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: 0,
    price: 0,
    sku: '',
    location: '',
    minimumStock: 1
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = ['Electronics', 'Furniture', 'Appliances', 'Clothing', 'Books', 'Tools', 'Other'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Item created:', formData);
      setLoading(false);
      navigate('/items');
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/items');
  };

  return (
    <div className="item-form-page">
      <div className="form-header">
        <h1>Add New Item</h1>
        <p className="subtitle">Add a new item to your inventory</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                Item Name *
                {errors.name && <span className="error-message"> - {errors.name}</span>}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter item name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sku">
                SKU (Stock Keeping Unit) *
                {errors.sku && <span className="error-message"> - {errors.sku}</span>}
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={errors.sku ? 'error' : ''}
                placeholder="Enter SKU"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter item description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category *
                {errors.category && <span className="error-message"> - {errors.category}</span>}
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                Quantity
                {errors.quantity && <span className="error-message"> - {errors.quantity}</span>}
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={errors.quantity ? 'error' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Price ($)
                {errors.price && <span className="error-message"> - {errors.price}</span>}
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={errors.price ? 'error' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Warehouse A, Shelf B3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minimumStock">Minimum Stock Level</label>
              <input
                type="number"
                id="minimumStock"
                name="minimumStock"
                value={formData.minimumStock}
                onChange={handleChange}
                min="1"
              />
              <small className="help-text">Alert when stock goes below this level</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemNew;