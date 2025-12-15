import React, { useState, useRef } from 'react';

const InventoryForm = ({ onAddItem, availableCategories }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    image: null
  });
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }

    if (formData.quantity < 0) {
      alert('Quantity cannot be negative');
      return;
    }

    if (formData.price < 0) {
      alert('Price cannot be negative');
      return;
    }

    onAddItem(formData);
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      price: 0,
      image: null
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Show success message
    alert(`"${formData.name}" has been added to inventory!`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? 
              (value === '' ? '' : Number(value)) : value
    }));
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="inventory-form">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="category-select"
          >
            <option value="">Select a category</option>
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="">-- Add New Category --</option>
          </select>
          {formData.category === '' && (
            <input
              type="text"
              name="newCategory"
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Or type new category"
              className="new-category-input"
            />
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              step="1"
            />
          </div>

          <div className="form-group">
            <label>Price (£)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Item Image (Optional)</label>
          <div className="image-upload-area">
            {imagePreview ? (
              <div className="image-preview-container">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="image-preview"
                />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="btn-remove-image"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <label htmlFor="image-upload" className="upload-label">
                  <span>📷 Click or drag to upload image</span>
                  <input
                    id="image-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="image-input"
                  />
                </label>
                <small>Supports: JPEG, PNG, GIF | Max size: 2MB</small>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn-primary">
          ➕ Add Item to Inventory
        </button>
      </form>
    </div>
  );
};

export default InventoryForm;