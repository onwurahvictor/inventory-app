import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { itemAPI, categoryAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiPhoto, HiX } from 'react-icons/hi';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  category: yup.string().required('Category is required'),
  quantity: yup.number()
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative')
    .integer('Quantity must be a whole number'),
  price: yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  description: yup.string(),
  sku: yup.string(),
  lowStockThreshold: yup.number()
    .min(0, 'Threshold cannot be negative')
    .integer('Threshold must be a whole number')
    .default(10),
});

const CreateItem = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category: '',
      quantity: 0,
      price: 0,
      lowStockThreshold: 10,
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue('image', null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await itemAPI.create(data);
      toast.success('Item created successfully');
      navigate('/items');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create item';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const quantity = watch('quantity');
  const price = watch('price');
  const totalValue = quantity * price;

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/items')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <HiArrowLeft className="mr-2 h-5 w-5" />
            Back to Inventory
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Item</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to add a new item to your inventory.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="input"
                  placeholder="e.g., iPhone 15 Pro Max"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select {...register('category')} className="input">
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name} ({cat.itemCount} items)
                    </option>
                  ))}
                  <option value="Uncategorized">Uncategorized</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-danger-600">{errors.category.message}</p>
                )}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  {...register('sku')}
                  className="input"
                  placeholder="e.g., IP15PM-256GB-BLK"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Image
                </label>
                <div className="mt-1 flex items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-danger-500 text-white rounded-full p-1 hover:bg-danger-600"
                      >
                        <HiX className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400">
                        <HiPhoto className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">Upload image</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input"
                  placeholder="Add a description for this item..."
                />
              </div>
            </div>
          </div>

          {/* Stock & Pricing */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Stock & Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  {...register('quantity')}
                  className="input"
                  min="0"
                  step="1"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-danger-600">{errors.quantity.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  {...register('price')}
                  className="input"
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-danger-600">{errors.price.message}</p>
                )}
              </div>

              {/* Total Value (Calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Value
                </label>
                <div className="input bg-gray-50">
                  ${totalValue.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Advanced Settings</h2>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced
              </button>
            </div>

            {showAdvanced && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    {...register('lowStockThreshold')}
                    className="input"
                    min="0"
                    step="1"
                    placeholder="Default: 10"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Receive alerts when stock falls below this number
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/items')}
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
              {loading ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
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