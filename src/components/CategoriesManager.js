import React, { useState } from 'react';

const CategoriesManager = ({ categories, items, onAddCategory, onDeleteCategory }) => {
  const [newCategory, setNewCategory] = useState('');
  const [showManager, setShowManager] = useState(false);
  const [error, setError] = useState('');

  // Count items per category
  const itemsCount = {};
  items.forEach(item => {
    if (item.category) {
      itemsCount[item.category] = (itemsCount[item.category] || 0) + 1;
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const trimmedCategory = newCategory.trim();
    
    if (!trimmedCategory) {
      setError('Category name cannot be empty');
      return;
    }
    
    if (categories.includes(trimmedCategory)) {
      setError(`Category "${trimmedCategory}" already exists`);
      return;
    }
    
    if (trimmedCategory.toLowerCase() === 'all') {
      setError('"all" is a reserved keyword');
      return;
    }
    
    onAddCategory(trimmedCategory);
    setNewCategory('');
  };

  const handleDeleteCategory = (category) => {
    if (window.confirm(`Delete category "${category}"? This cannot be undone.`)) {
      onDeleteCategory(category);
    }
  };

  return (
    <div className="categories-manager">
      <button 
        onClick={() => setShowManager(!showManager)}
        className="btn-toggle-categories"
      >
        {showManager ? '🔽 Hide Categories Manager' : '🔼 Manage Categories'}
      </button>
      
      {showManager && (
        <div className="categories-panel">
          <h3>🏷️ Categories Manager</h3>
          <p className="panel-description">
            Add, view, and manage categories for your inventory items.
          </p>
          
          <form onSubmit={handleSubmit} className="add-category-form">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setError('');
              }}
              placeholder="Enter new category name"
              className="category-input"
            />
            <button type="submit" className="btn-add-category">
              ➕ Add
            </button>
          </form>
          
          {error && <div className="error-message">❌ {error}</div>}
          
          <div className="categories-stats">
            <div className="stat">
              <span className="stat-number">{categories.length - 1}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {Object.keys(itemsCount).length}
              </span>
              <span className="stat-label">In Use</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {categories.filter(cat => cat !== 'all' && !itemsCount[cat]).length}
              </span>
              <span className="stat-label">Unused</span>
            </div>
          </div>
          
          <div className="categories-lists">
            <div className="categories-in-use">
              <h4>📊 Categories in Use:</h4>
              {categories.filter(cat => cat !== 'all' && itemsCount[cat]).length === 0 ? (
                <p className="no-categories">No categories are currently in use.</p>
              ) : (
                <div className="categories-grid">
                  {categories
                    .filter(cat => cat !== 'all' && itemsCount[cat])
                    .map(category => (
                      <div key={category} className="category-item in-use">
                        <span className="category-name">{category}</span>
                        <span className="item-count">{itemsCount[category]} items</span>
                        <button 
                          onClick={() => handleDeleteCategory(category)}
                          className="btn-delete-category"
                          title={`Cannot delete: ${itemsCount[category]} items use this category`}
                          disabled={true}
                        >
                          🔒
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <div className="categories-unused">
              <h4>🗑️ Unused Categories (Can be deleted):</h4>
              {categories.filter(cat => cat !== 'all' && !itemsCount[cat]).length === 0 ? (
                <p className="no-categories">All categories are in use.</p>
              ) : (
                <div className="categories-grid">
                  {categories
                    .filter(cat => cat !== 'all' && !itemsCount[cat])
                    .map(category => (
                      <div key={category} className="category-item unused">
                        <span className="category-name">{category}</span>
                        <button 
                          onClick={() => handleDeleteCategory(category)}
                          className="btn-delete-category"
                          title="Delete this category"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="categories-tips">
            <h5>💡 Tips:</h5>
            <ul>
              <li>Categories in use cannot be deleted</li>
              <li>Deleting a category will not delete the items in it</li>
              <li>Items without categories will show as "Uncategorized"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;