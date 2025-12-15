import React from 'react';
import SearchFilter from './SearchFilter';
import InventoryItem from './InventoryItem';
import ExportCSV from './ExportCSV';

const InventoryList = ({ 
  items, 
  allItems,
  onUpdateQuantity, 
  onDeleteItem,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterStock,
  setFilterStock,
  categories
}) => {
  if (items.length === 0) {
    return (
      <div className="inventory-list">
        <SearchFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStock={filterStock}
          setFilterStock={setFilterStock}
          categories={categories}
        />
        
        <div className="empty-state">
          <h2>📦 Inventory Items</h2>
          <p>No items found matching your criteria.</p>
          <p>Try changing your search or filters, or add new items!</p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalValue = items.reduce((total, item) => {
    return total + (item.quantity * item.price);
  }, 0);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="inventory-list">
      <SearchFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStock={filterStock}
        setFilterStock={setFilterStock}
        categories={categories}
      />
      
      <div className="list-header">
        <h2>📋 Inventory Items ({items.length} items, {totalItems} units)</h2>
        <div className="header-actions">
          <div className="total-value">
            Total Value: £{totalValue.toFixed(2)}
          </div>
          <ExportCSV items={allItems} />
        </div>
      </div>
      
      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-label">In Stock:</span>
          <span className="stat-value in-stock">
            {items.filter(item => item.quantity >= 10).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Low Stock:</span>
          <span className="stat-value low-stock">
            {items.filter(item => item.quantity > 0 && item.quantity < 10).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Out of Stock:</span>
          <span className="stat-value out-of-stock">
            {items.filter(item => item.quantity === 0).length}
          </span>
        </div>
      </div>
      
      <div className="items-grid">
        {items.map(item => (
          <InventoryItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </div>
      
      <div className="list-footer">
        <p>
          Showing {items.length} of {allItems.length} items | 
          Filtered by: {filterCategory === 'all' ? 'All Categories' : filterCategory} | 
          Stock: {filterStock === 'all' ? 'All' : filterStock === 'in' ? 'In Stock' : filterStock === 'low' ? 'Low Stock' : 'Out of Stock'}
        </p>
      </div>
    </div>
  );
};

export default InventoryList;