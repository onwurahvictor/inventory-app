import React, { useState } from 'react';
import './Categories.css';

const Categories = () => {
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

  const categoryIcons = {
    'Electronics': '💻',
    'Furniture': '🪑',
    'Appliances': '🔌',
    'Office Supplies': '📎',
    'Raw Materials': '⚙️',
    'Tools': '🛠️',
    'Books': '📚',
    'Clothing': '👕',
    'Food': '🍎',
    'Other': '📦'
  };

  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', itemCount: 15, color: '#3b82f6', icon: '💻' },
    { id: 2, name: 'Furniture', itemCount: 8, color: '#10b981', icon: '🪑' },
    { id: 3, name: 'Appliances', itemCount: 12, color: '#f59e0b', icon: '🔌' },
    { id: 4, name: 'Office Supplies', itemCount: 22, color: '#8b5cf6', icon: '📎' },
    { id: 5, name: 'Raw Materials', itemCount: 5, color: '#ef4444', icon: '⚙️' },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: colorOptions[0].value,
    icon: '📦'
  });
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    
    const newCat = {
      id: Date.now(),
      name: newCategory.name,
      itemCount: 0,
      color: selectedColor,
      icon: categoryIcons[newCategory.name] || '📦'
    };
    
    setCategories([...categories, newCat]);
    setNewCategory({ name: '', color: colorOptions[0].value, icon: '📦' });
    setSelectedColor(colorOptions[0].value);
  };

  const handleDeleteCategory = (id) => {
    const category = categories.find(cat => cat.id === id);
    if (category && category.itemCount > 0) {
      if (window.confirm(`Category "${category.name}" has ${category.itemCount} items. Are you sure you want to delete it?`)) {
        setCategories(categories.filter(cat => cat.id !== id));
      }
    } else {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const getIconForCategory = (categoryName) => {
    return categoryIcons[categoryName] || '📦';
  };

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
              <label className="form-label">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="form-input"
                placeholder="e.g., Electronics, Furniture, Tools"
                maxLength="50"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category Color</label>
              <div className="color-picker">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => {
                      setSelectedColor(color.value);
                      setNewCategory({...newCategory, color: color.value});
                    }}
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
              {categories.length} Categories
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
                  key={category.id}
                  className="category-item"
                  style={{ '--category-color': category.color }}
                >
                  <div className="category-info">
                    <div 
                      className="category-icon"
                      style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}99)` }}
                    >
                      {category.icon}
                    </div>
                    <div className="category-details">
                      <h3>{category.name}</h3>
                      <span className="category-items-count">
                        {category.itemCount} {category.itemCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                  <div className="category-actions">
                    <button className="edit-btn">
                      <span>✏️</span> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="delete-btn"
                      disabled={category.itemCount > 0}
                      title={category.itemCount > 0 ? "Cannot delete category with items" : "Delete category"}
                    >
                      <span>🗑️</span> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
            {categories.reduce((sum, cat) => sum + cat.itemCount, 0)}
          </h3>
          <p className="stat-label">Total Items</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <h3 className="stat-value">
            {categories.length > 0 
              ? categories.reduce((max, cat) => cat.itemCount > max.itemCount ? cat : max).name
              : 'N/A'
            }
          </h3>
          <p className="stat-label">Most Items Category</p>
        </div>
      </div>
    </div>
  );
};

export default Categories;