import React, { useState, useEffect } from 'react';
import './App.css';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';
import LowStockAlert from './components/LowStockAlert';
import CategoriesManager from './components/CategoriesManager';

function App() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [allCategories, setAllCategories] = useState(['Electronics', 'Clothing', 'Office', 'Food']);

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    
    const savedCategories = localStorage.getItem('inventoryCategories');
    if (savedCategories) {
      setAllCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem('inventoryCategories', JSON.stringify(allCategories));
  }, [allCategories]);

  // Get unique categories from items
  const getItemCategories = () => {
    const itemCategories = items
      .map(item => item.category)
      .filter(cat => cat && cat.trim() !== '');
    return ['all', ...new Set(itemCategories)];
  };

  // Filtered items function
  const filteredItems = items.filter(item => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesCategory = filterCategory === 'all' || 
      item.category === filterCategory;
    
    // Stock status filter
    let matchesStock = true;
    if (filterStock === 'low') {
      matchesStock = item.quantity > 0 && item.quantity < 10;
    } else if (filterStock === 'out') {
      matchesStock = item.quantity === 0;
    } else if (filterStock === 'in') {
      matchesStock = item.quantity >= 10;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Add new item
  const addItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: Date.now(), // Simple ID generation
      lastUpdated: new Date().toLocaleDateString(),
      addedDate: new Date().toISOString().split('T')[0]
    };
    setItems([...items, itemWithId]);
    
    // Add new category to allCategories if it doesn't exist
    if (newItem.category && !allCategories.includes(newItem.category)) {
      setAllCategories([...allCategories, newItem.category]);
    }
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 0) return; // Prevent negative quantities
    
    setItems(items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            quantity: newQuantity,
            lastUpdated: new Date().toLocaleDateString()
          }
        : item
    ));
  };

  // Delete item
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Add new category
  const addCategory = (category) => {
    if (category && !allCategories.includes(category)) {
      setAllCategories([...allCategories, category]);
    }
  };

  // Delete category
  const deleteCategory = (categoryToDelete) => {
    // Check if any items use this category
    const itemsUsingCategory = items.filter(item => item.category === categoryToDelete);
    
    if (itemsUsingCategory.length > 0) {
      alert(`Cannot delete category "${categoryToDelete}" - ${itemsUsingCategory.length} item(s) use it.`);
      return;
    }
    
    setAllCategories(allCategories.filter(cat => cat !== categoryToDelete));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📦 Advanced Inventory Manager</h1>
        <p>Complete inventory management with search, filters, and more!</p>
      </header>
      
      <LowStockAlert items={items} />
      
      <div className="app-container">
        <div className="left-panel">
          <InventoryForm 
            onAddItem={addItem} 
            availableCategories={allCategories}
          />
          <CategoriesManager 
            categories={allCategories}
            items={items}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
        </div>
        
        <div className="right-panel">
          <InventoryList 
            items={filteredItems}
            allItems={items}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterStock={filterStock}
            setFilterStock={setFilterStock}
            categories={getItemCategories()}
            onUpdateQuantity={updateQuantity}
            onDeleteItem={deleteItem}
          />
        </div>
      </div>
      
      <footer className="app-footer">
        <p>Total Items: {items.length} | Total Value: £{items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2)}</p>
        <p className="footer-note">Data is saved automatically in your browser</p>
      </footer>
    </div>
  );
}

export default App;