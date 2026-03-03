import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ItemForm.css';

const ItemEdit = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = ['Electronics', 'Furniture', 'Appliances', 'Clothing', 'Books', 'Tools', 'Other'];

  // Mock data - in real app, fetch from API
  const mockItem = {
    id: parseInt(id),
    name: 'iPhone 15 Pro',
    description: 'Latest Apple smartphone with advanced camera',
    category: 'Electronics',
    quantity: 5,
    price: 999.99,
    sku: 'APP-IPH15-PRO',
    location: 'Warehouse A, Shelf 3B',
    minimumStock: 2
  };

  useEffect(() => {
    // Simulate API call to fetch item data
    setTimeout(() => {
      setFormData(mockItem);
      setLoading(false);
    }, 500);
  }, [id]);

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
    
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Item updated:', formData);
      setSaving(false);
      navigate('/items');
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/items');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      // Simulate delete API call
      setTimeout(() => {
        navigate('/items');
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading item data...</p>
      </div>
    );
  }

  return (
    <div className="item-form-page">
      <div className="form-header">
        <div>
          <h1>Edit Item</h1>
          <p className="subtitle">Editing: {formData.name}</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="btn btn-danger"
        >
          Delete Item
        </button>
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
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemEdit;