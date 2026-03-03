import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { itemAPI, categoryAPI } from '../services/api';
import './ItemForm.css';

const schema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  
  category: yup.string()
    .required('Category is required'),
  
  quantity: yup.number()
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative')
    .integer('Quantity must be a whole number')
    .typeError('Quantity must be a number'),
  
  price: yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative')
    .typeError('Price must be a number'),
  
  sku: yup.string()
    .nullable()
    .transform(value => value || undefined),
  
  description: yup.string()
    .nullable()
    .transform(value => value || undefined)
    .max(500, 'Description cannot exceed 500 characters'),
  
  location: yup.string()
    .nullable()
    .transform(value => value || undefined),
  
  lowStockThreshold: yup.number()
    .min(0, 'Threshold cannot be negative')
    .integer('Threshold must be a whole number')
    .default(5)
    .typeError('Threshold must be a number'),
  
  reorderPoint: yup.number()
    .min(0, 'Reorder point cannot be negative')
    .integer('Reorder point must be a whole number')
    .default(10)
    .typeError('Reorder point must be a number'),
  
  unitOfMeasure: yup.string()
    .default('pieces')
});

const CreateItem = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      quantity: 0,
      price: 0,
      lowStockThreshold: 5,
      reorderPoint: 10,
      unitOfMeasure: 'pieces'
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Categories fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quantity = watch('quantity');
  const price = watch('price');
  const totalValue = (quantity || 0) * (price || 0);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Prepare the data
      const itemData = {
        ...data,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        lowStockThreshold: parseInt(data.lowStockThreshold || 5),
        reorderPoint: parseInt(data.reorderPoint || 10)
      };

      const response = await itemAPI.create(itemData);
      
      if (response.data.success) {
        toast.success('Item created successfully! 🎉');
        navigate('/items');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create item';
      toast.error(message);
      console.error('Create item error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="item-form-page">
      <div className="form-header">
        <div>
          <h1>Add New Item</h1>
          <p className="subtitle">
            Fill in the details below to add a new item to your inventory
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/items')}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="item-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">
                  Item Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g., iPhone 15 Pro Max"
                />
                {errors.name && (
                  <span className="error-message">{errors.name.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  id="sku"
                  {...register('sku')}
                  className="form-input"
                  placeholder="e.g., IP15PM-256GB-BLK"
                />
                <small className="help-text">
                  Leave empty for auto-generated SKU
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className={`form-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} {cat.itemCount ? `(${cat.itemCount} items)` : ''}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="error-message">{errors.category.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="unitOfMeasure">Unit of Measure</label>
                <select
                  id="unitOfMeasure"
                  {...register('unitOfMeasure')}
                  className="form-select"
                >
                  <option value="pieces">Pieces</option>
                  <option value="boxes">Boxes</option>
                  <option value="kg">Kilograms</option>
                  <option value="lbs">Pounds</option>
                  <option value="liters">Liters</option>
                  <option value="gallons">Gallons</option>
                  <option value="meters">Meters</option>
                  <option value="feet">Feet</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register('description')}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                rows="4"
                placeholder="Add a detailed description of the item..."
              />
              {errors.description && (
                <span className="error-message">{errors.description.message}</span>
              )}
            </div>
          </div>

          {/* Stock & Pricing */}
          <div className="form-section">
            <h2 className="section-title">Stock & Pricing</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="quantity">
                  Quantity <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  {...register('quantity')}
                  className={`form-input ${errors.quantity ? 'error' : ''}`}
                  min="0"
                  step="1"
                />
                {errors.quantity && (
                  <span className="error-message">{errors.quantity.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Price ($) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  {...register('price')}
                  className={`form-input ${errors.price ? 'error' : ''}`}
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <span className="error-message">{errors.price.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Total Value</label>
                <div className="form-input bg-gray-50">
                  ${totalValue.toFixed(2)}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">Storage Location</label>
                <input
                  type="text"
                  id="location"
                  {...register('location')}
                  className="form-input"
                  placeholder="e.g., Warehouse A, Shelf B3"
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="form-section">
            <div className="section-header">
              <h2 className="section-title">Advanced Settings</h2>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="toggle-btn"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced
              </button>
            </div>

            {showAdvanced && (
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="lowStockThreshold">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    id="lowStockThreshold"
                    {...register('lowStockThreshold')}
                    className={`form-input ${errors.lowStockThreshold ? 'error' : ''}`}
                    min="0"
                    step="1"
                  />
                  <small className="help-text">
                    Receive alerts when stock falls below this number
                  </small>
                  {errors.lowStockThreshold && (
                    <span className="error-message">
                      {errors.lowStockThreshold.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="reorderPoint">Reorder Point</label>
                  <input
                    type="number"
                    id="reorderPoint"
                    {...register('reorderPoint')}
                    className={`form-input ${errors.reorderPoint ? 'error' : ''}`}
                    min="0"
                    step="1"
                  />
                  <small className="help-text">
                    Recommended quantity to reorder when stock is low
                  </small>
                  {errors.reorderPoint && (
                    <span className="error-message">
                      {errors.reorderPoint.message}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/items')}
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
                  Creating...
                </>
              ) : (
                'Create Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;