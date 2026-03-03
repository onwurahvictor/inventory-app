// ItemEdit.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { itemAPI, categoryAPI } from '../services/api';
import './ItemForm.css';

const ItemEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: 0,
    price: 0,
    sku: '',
    location: '',
    minimumStock: 5,
    reorderPoint: 10,
    unitOfMeasure: 'pieces'
  });
  const [errors, setErrors] = useState({});

  const unitOptions = [
    { value: 'pieces', label: 'Pieces' },
    { value: 'boxes', label: 'Boxes' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'lbs', label: 'Pounds' },
    { value: 'liters', label: 'Liters' },
    { value: 'gallons', label: 'Gallons' },
    { value: 'meters', label: 'Meters' },
    { value: 'feet', label: 'Feet' }
  ];

  // Debug useEffect - MOVED INSIDE COMPONENT
  useEffect(() => {
    console.log('ItemEdit mounted with ID:', id);
    console.log('Current URL:', window.location.href);
  }, [id]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [id]);

  // FetchData function with error handling
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching item with ID:', id);
      
      // Validate ID format
      if (!id || id.length !== 24) {
        toast.error('Invalid item ID format');
        navigate('/items');
        return;
      }
      
      // Fetch both item and categories in parallel
      const [itemResponse, categoriesResponse] = await Promise.all([
        itemAPI.getById(id),
        categoryAPI.getAll()
      ]);

      console.log('Item response:', itemResponse);
      console.log('Categories response:', categoriesResponse);

      if (itemResponse.data && itemResponse.data.success) {
        const itemData = itemResponse.data.data.item;
        setFormData({
          name: itemData.name || '',
          description: itemData.description || '',
          category: itemData.category?._id || itemData.category || '',
          quantity: itemData.quantity || 0,
          price: itemData.price || 0,
          sku: itemData.sku || '',
          location: itemData.location || '',
          minimumStock: itemData.minimumStock || 5,
          reorderPoint: itemData.reorderPoint || 10,
          unitOfMeasure: itemData.unitOfMeasure || 'pieces'
        });
      } else {
        throw new Error(itemResponse?.data?.message || 'Item not found');
      }

      if (categoriesResponse.data && categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data.categories || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      
      if (error.response?.status === 404) {
        toast.error('Item not found. It may have been deleted.');
        setTimeout(() => {
          navigate('/items');
        }, 2000);
      } else if (error.response?.status === 400) {
        toast.error('Invalid item ID');
        navigate('/items');
      } else if (error.response?.status === 401) {
        toast.error('Please login to continue');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load item data');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    if (formData.minimumStock < 0) {
      newErrors.minimumStock = 'Minimum stock cannot be negative';
    }
    
    if (formData.reorderPoint < 0) {
      newErrors.reorderPoint = 'Reorder point cannot be negative';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('Updating item with data:', formData);
      
      const response = await itemAPI.update(id, formData);
      console.log('Update response:', response);
      
      if (response.data && response.data.success) {
        toast.success('Item updated successfully!');
        navigate(`/items/${id}`);
      } else {
        throw new Error(response.data?.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      
      // Handle validation errors from server
      if (error.response?.data?.details) {
        const serverErrors = {};
        error.response.data.details.forEach(err => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
        toast.error('Validation failed');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update item');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await itemAPI.delete(id);
      
      if (response.data && response.data.success) {
        toast.success('Item deleted successfully');
        navigate('/items');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotalValue = () => {
    return (formData.quantity * formData.price).toFixed(2);
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
          <p className="subtitle">Update the details of your item</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
            disabled={submitting}
          >
            Delete Item
          </button>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">
                Item Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter item name"
                disabled={submitting}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            {/* SKU */}
            <div className="form-group">
              <label htmlFor="sku">SKU (Stock Keeping Unit)</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter SKU"
                disabled={submitting}
                readOnly
              />
              <small className="help-text">SKU cannot be changed</small>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-select ${errors.category ? 'error' : ''}`}
                disabled={submitting}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name} {cat.icon}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="error-message">{errors.category}</span>
              )}
            </div>

            {/* Unit of Measure */}
            <div className="form-group">
              <label htmlFor="unitOfMeasure">Unit of Measure</label>
              <select
                id="unitOfMeasure"
                name="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={handleChange}
                className="form-select"
                disabled={submitting}
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label htmlFor="quantity">
                Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`form-input ${errors.quantity ? 'error' : ''}`}
                min="0"
                step="1"
                disabled={submitting}
              />
              {errors.quantity && (
                <span className="error-message">{errors.quantity}</span>
              )}
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">
                Price ($) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`form-input ${errors.price ? 'error' : ''}`}
                min="0"
                step="0.01"
                disabled={submitting}
              />
              {errors.price && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>

            {/* Total Value (Read-only) */}
            <div className="form-group">
              <label>Total Value</label>
              <div className="form-input bg-gray-50">
                ${calculateTotalValue()}
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Storage Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Warehouse A, Shelf B3"
                disabled={submitting}
              />
            </div>

            {/* Minimum Stock */}
            <div className="form-group">
              <label htmlFor="minimumStock">Minimum Stock Level</label>
              <input
                type="number"
                id="minimumStock"
                name="minimumStock"
                value={formData.minimumStock}
                onChange={handleChange}
                className={`form-input ${errors.minimumStock ? 'error' : ''}`}
                min="0"
                step="1"
                disabled={submitting}
              />
              {errors.minimumStock && (
                <span className="error-message">{errors.minimumStock}</span>
              )}
              <small className="help-text">
                Alert when stock falls below this level
              </small>
            </div>

            {/* Reorder Point */}
            <div className="form-group">
              <label htmlFor="reorderPoint">Reorder Point</label>
              <input
                type="number"
                id="reorderPoint"
                name="reorderPoint"
                value={formData.reorderPoint}
                onChange={handleChange}
                className={`form-input ${errors.reorderPoint ? 'error' : ''}`}
                min="0"
                step="1"
                disabled={submitting}
              />
              {errors.reorderPoint && (
                <span className="error-message">{errors.reorderPoint}</span>
              )}
              <small className="help-text">
                Recommended quantity to reorder when stock is low
              </small>
            </div>

            {/* Description - Full Width */}
            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="Enter item description"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/items/${id}`)}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-small"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemEdit;