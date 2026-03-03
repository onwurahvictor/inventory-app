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
  
  sku: yup.string(),
  description: yup.string().max(500, 'Description cannot exceed 500 characters'),
  location: yup.string(),
  lowStockThreshold: yup.number()
    .min(0, 'Threshold cannot be negative')
    .integer('Threshold must be a whole number')
    .default(5)
    .typeError('Threshold must be a number')
});

const ItemNew = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      quantity: 0,
      price: 0,
      lowStockThreshold: 5
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      toast.error('Failed to load categories');
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
      const response = await itemAPI.create(data);
      
      if (response.data.success) {
        toast.success('Item created successfully!');
        navigate('/items');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="item-form-page">
      <div className="form-header">
        <h1>Add New Item</h1>
        <p className="subtitle">Fill in the details to add a new item to your inventory</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="item-form">
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
                placeholder="Enter item name"
              />
              {errors.name && (
                <span className="error-message">{errors.name.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU</label>
              <input
                type="text"
                id="sku"
                {...register('sku')}
                className="form-input"
                placeholder="Enter SKU (optional)"
              />
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
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="error-message">{errors.category.message}</span>
              )}
            </div>

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
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                {...register('location')}
                className="form-input"
                placeholder="e.g., Warehouse A, Shelf B3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
              <input
                type="number"
                id="lowStockThreshold"
                {...register('lowStockThreshold')}
                className="form-input"
                min="0"
                step="1"
              />
              <small className="help-text">Alert when stock falls below this level</small>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register('description')}
                className="form-textarea"
                rows="3"
                placeholder="Enter item description"
              />
            </div>
          </div>

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
              {submitting ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemNew;