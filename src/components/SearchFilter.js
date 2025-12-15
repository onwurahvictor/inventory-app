import React from 'react';

const SearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory,
  filterStock,
  setFilterStock,
  categories
}) => {
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterStock('all');
  };

  const hasActiveFilters = searchTerm || filterCategory !== 'all' || filterStock !== 'all';

  return (
    <div className="search-filter">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search items by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="clear-search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label>Category Filter:</label>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? '📁 All Categories' : `🏷️ ${cat}`}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Stock Status:</label>
          <select 
            value={filterStock} 
            onChange={(e) => setFilterStock(e.target.value)}
            className="filter-select"
          >
            <option value="all">📦 All Stock</option>
            <option value="in">✅ In Stock (10+)</option>
            <option value="low">⚠️ Low Stock (1-9)</option>
            <option value="out">❌ Out of Stock</option>
          </select>
        </div>
        
        <div className="clear-filters">
          <button 
            onClick={handleClearFilters}
            className="btn-clear"
            disabled={!hasActiveFilters}
          >
            {hasActiveFilters ? '🗑️ Clear All Filters' : 'No Active Filters'}
          </button>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="active-filters">
          <small>Active filters: </small>
          {searchTerm && <span className="filter-tag">Search: "{searchTerm}"</span>}
          {filterCategory !== 'all' && <span className="filter-tag">Category: {filterCategory}</span>}
          {filterStock !== 'all' && (
            <span className="filter-tag">
              Stock: {filterStock === 'in' ? 'In Stock' : filterStock === 'low' ? 'Low Stock' : 'Out of Stock'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;