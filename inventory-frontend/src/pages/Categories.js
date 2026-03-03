import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { categoryAPI, itemAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: '📦'
  });

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' },
  ];

  const iconOptions = [
    { value: '📦', label: 'Box' },
    { value: '💻', label: 'Electronics' },
    { value: '🪑', label: 'Furniture' },
    { value: '🔌', label: 'Appliances' },
    { value: '📎', label: 'Office' },
    { value: '⚙️', label: 'Tools' },
    { value: '📚', label: 'Books' },
    { value: '👕', label: 'Clothing' },
    { value: '🍎', label: 'Food' },
    { value: '🏷️', label: 'Other' }
  ];

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching categories...');
      
      const response = await categoryAPI.getAll();
      console.log('Categories response:', response);
      
      if (response.data && response.data.success) {
        setCategories(response.data.data.categories || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError(error.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch items for selected category
  const fetchCategoryItems = async (categoryId) => {
    try {
      setItemsLoading(true);
      const response = await itemAPI.getAll({ category: categoryId });
      
      if (response.data.success) {
        setCategoryItems(response.data.data.items || []);
      }
    } catch (error) {
      console.error('Failed to load category items:', error);
      toast.error('Failed to load items for this category');
    } finally {
      setItemsLoading(false);
    }
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    if (selectedCategory?._id === category._id) {
      // If clicking the same category, close the items view
      setSelectedCategory(null);
      setCategoryItems([]);
    } else {
      // Select new category and fetch its items
      setSelectedCategory(category);
      fetchCategoryItems(category._id);
    }
  };

  // Close items view
  const handleCloseItems = () => {
    setSelectedCategory(null);
    setCategoryItems([]);
  };

  // Navigate to item details
  const handleViewItem = (itemId) => {
  console.log('Navigating to item:', itemId); // Debug log
  navigate(`/items/${itemId}`);
};
  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const categoryData = {
        name: newCategory.name.trim(),
        description: newCategory.description?.trim() || '',
        color: newCategory.color || '#3b82f6',
        icon: newCategory.icon || '📦'
      };

      console.log('Sending category data:', categoryData);

      const response = await categoryAPI.create(categoryData);
      
      if (response.data.success) {
        toast.success('Category created successfully');
        setCategories([...categories, response.data.data.category]);
        setNewCategory({ 
          name: '', 
          description: '', 
          color: '#3b82f6', 
          icon: '📦' 
        });
      }
    } catch (error) {
      console.error('Create category error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create category';
      toast.error(errorMessage);
    }
  };

  // Update category
  const handleUpdateCategory = async (id, data) => {
    try {
      const response = await categoryAPI.update(id, data);
      
      if (response.data.success) {
        toast.success('Category updated successfully');
        setCategories(categories.map(cat => 
          cat._id === id ? response.data.data.category : cat
        ));
        setEditingCategory(null);
        
        // If the updated category is currently selected, update it
        if (selectedCategory?._id === id) {
          setSelectedCategory(response.data.data.category);
        }
      }
    } catch (error) {
      console.error('Update category error:', error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    const category = categories.find(cat => cat._id === id);
    
    if (!category) return;

    if (category.itemCount > 0) {
      if (!window.confirm(`Category "${category.name}" has ${category.itemCount} items. Are you sure you want to delete it?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
        return;
      }
    }

    try {
      const response = await categoryAPI.delete(id);
      
      if (response.data.success) {
        toast.success('Category deleted successfully');
        setCategories(categories.filter(cat => cat._id !== id));
        
        // If the deleted category is currently selected, close the items view
        if (selectedCategory?._id === id) {
          setSelectedCategory(null);
          setCategoryItems([]);
        }
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Categories</h3>
        <p>{error}</p>
        <button onClick={fetchCategories} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1 className="categories-title">Categories</h1>
        <p className="categories-subtitle">
          Organize your inventory into categories for better management and tracking
        </p>
      </div>

      <div className="content-grid">
        {/* Add Category Card */}
        <div className="add-category-card">
          <h2 className="card-title">Create New Category</h2>
          <form onSubmit={handleAddCategory} className="category-form">
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="form-input"
                placeholder="e.g., Electronics, Furniture, Tools"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                className="form-input"
                placeholder="Category description..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category Icon</label>
              <select
                value={newCategory.icon}
                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                className="form-select"
              >
                {iconOptions.map(icon => (
                  <option key={icon.value} value={icon.value}>
                    {icon.value} {icon.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category Color</label>
              <div className="color-picker">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`color-option ${newCategory.color === color.value ? 'selected' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewCategory({...newCategory, color: color.value})}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <span className="btn-icon">+</span>
              Add Category
            </button>
          </form>
        </div>

        {/* Categories List Card */}
        <div className="categories-list-card">
          <div className="list-header">
            <h2 className="list-title">All Categories</h2>
            <div className="categories-count">
              {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
            </div>
          </div>

          <div className="categories-list">
            {categories.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏷️</div>
                <h3 className="empty-title">No Categories Yet</h3>
                <p className="empty-desc">
                  Create your first category to start organizing your inventory
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className={`category-item ${selectedCategory?._id === category._id ? 'selected' : ''}`}
                  style={{ '--category-color': category.color }}
                  onClick={() => handleCategoryClick(category)}
                >
                  {editingCategory === category._id ? (
                    <div className="category-edit-form" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        defaultValue={category.name}
                        className="edit-input"
                        id={`name-${category._id}`}
                      />
                      <div className="edit-actions">
                        <button
                          onClick={() => {
                            const input = document.getElementById(`name-${category._id}`);
                            handleUpdateCategory(category._id, { 
                              name: input.value,
                              description: category.description,
                              color: category.color,
                              icon: category.icon
                            });
                          }}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="category-info">
                        <div 
                          className="category-icon"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          {category.icon || '📦'}
                        </div>
                        <div className="category-details">
                          <h3>{category.name}</h3>
                          {category.description && (
                            <p className="category-description">{category.description}</p>
                          )}
                          <span className="category-items-count">
                            {category.itemCount || 0} {category.itemCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>
                      <div className="category-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setEditingCategory(category._id)}
                          className="edit-btn"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="delete-btn"
                          disabled={category.itemCount > 0}
                          title={category.itemCount > 0 ? "Cannot delete category with items" : "Delete category"}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Category Items Section */}
      {selectedCategory && (
        <div className="category-items-section">
          <div className="items-header">
            <div className="items-header-left">
              <h2>
                <span className="category-icon-large">{selectedCategory.icon}</span>
                {selectedCategory.name} Items
              </h2>
              <p className="items-count">{categoryItems.length} items found</p>
            </div>
            <button onClick={handleCloseItems} className="close-btn">
              ✕
            </button>
          </div>

          {itemsLoading ? (
            <div className="items-loading">
              <div className="spinner-small"></div>
              <p>Loading items...</p>
            </div>
          ) : categoryItems.length === 0 ? (
            <div className="empty-items">
              <div className="empty-icon">📦</div>
              <h3>No Items in this Category</h3>
              <p>Add some items to this category to see them here</p>
              <button 
                onClick={() => navigate('/items/new', { state: { defaultCategory: selectedCategory._id } })}
                className="btn-primary"
              >
                Add Item to {selectedCategory.name}
              </button>
            </div>
          ) : (
            <div className="items-grid">
              {categoryItems.map(item => (
                <div 
                  key={item._id} 
                  className="item-card"
                  onClick={() => handleViewItem(item._id)}
                >
                  <div className="item-card-header">
                    <div className="item-icon-large">{selectedCategory.icon}</div>
                    <h3 className="item-name">{item.name}</h3>
                  </div>
                  <div className="item-details">
                    <div className="item-detail">
                      <span className="detail-label">SKU</span>
                      <span className="detail-value">{item.sku || 'N/A'}</span>
                    </div>
                    <div className="item-detail">
                      <span className="detail-label">Quantity</span>
                      <span className={`detail-value ${item.quantity <= (item.minimumStock || 5) ? 'text-warning' : ''}`}>
                        {item.quantity} units
                      </span>
                    </div>
                    <div className="item-detail">
                      <span className="detail-label">Price</span>
                      <span className="detail-value">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="item-detail">
                      <span className="detail-label">Total Value</span>
                      <span className="detail-value">{formatCurrency(item.quantity * item.price)}</span>
                    </div>
                  </div>
                  <div className="item-status">
                    <span className={`status-badge ${
                      item.quantity === 0 ? 'status-out' :
                      item.quantity <= (item.minimumStock || 5) ? 'status-low' : 'status-good'
                    }`}>
                      {item.quantity === 0 ? 'Out of Stock' :
                       item.quantity <= (item.minimumStock || 5) ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <h3 className="stat-value">{categories.length}</h3>
          <p className="stat-label">Total Categories</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <h3 className="stat-value">
            {categories.reduce((sum, cat) => sum + (cat.itemCount || 0), 0)}
          </h3>
          <p className="stat-label">Total Items</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <h3 className="stat-value">
            {categories.length > 0 
              ? categories.reduce((max, cat) => 
                  (cat.itemCount || 0) > (max.itemCount || 0) ? cat : max
                ).name
              : 'N/A'
            }
          </h3>
          <p className="stat-label">Most Used Category</p>
        </div>
      </div>
    </div>
  );
};

export default Categories;