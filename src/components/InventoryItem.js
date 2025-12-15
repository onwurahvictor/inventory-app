import React, { useState } from 'react';

const InventoryItem = ({ item, onUpdateQuantity, onDeleteItem }) => {
  const [editMode, setEditMode] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(item.quantity);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleSave = () => {
    if (tempQuantity < 0) {
      alert('Quantity cannot be negative');
      return;
    }
    onUpdateQuantity(item.id, tempQuantity);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempQuantity(item.quantity);
    setEditMode(false);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  };

  const stockStatus = getStockStatus(item.quantity);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDeleteItem(item.id);
    }
  };

  const openImageModal = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  return (
    <>
      <div className={`inventory-item ${stockStatus}`}>
        <div className="item-header">
          <h3>{item.name}</h3>
          <span className="category">{item.category || 'Uncategorized'}</span>
        </div>

        {item.image && (
          <div className="item-image" onClick={openImageModal}>
            <img 
              src={item.image} 
              alt={item.name}
              title="Click to enlarge"
            />
          </div>
        )}

        <div className="item-details">
          <div className="quantity-section">
            <label>Quantity:</label>
            {editMode ? (
              <div className="quantity-edit">
                <input
                  type="number"
                  value={tempQuantity}
                  onChange={(e) => setTempQuantity(Number(e.target.value))}
                  min="0"
                  step="1"
                  autoFocus
                />
                <div className="edit-buttons">
                  <button onClick={handleSave} className="btn-save" title="Save">
                    ✓ Save
                  </button>
                  <button onClick={handleCancel} className="btn-cancel" title="Cancel">
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="quantity-display">
                <span className={`quantity ${stockStatus}`}>
                  {item.quantity} units
                </span>
                <button 
                  onClick={() => setEditMode(true)}
                  className="btn-edit"
                  title="Edit quantity"
                >
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>

          <div className="price">
            <strong>Price: £{item.price.toFixed(2)}</strong>
            <span className="price-per-unit">
              £{item.price.toFixed(2)}/unit
            </span>
          </div>

          <div className="value">
            <strong>Total Value: £{(item.quantity * item.price).toFixed(2)}</strong>
          </div>

          <div className="last-updated">
            📅 Last Updated: {item.lastUpdated}
          </div>
          
          {item.addedDate && (
            <div className="added-date">
              📥 Added: {item.addedDate}
            </div>
          )}
        </div>

        <button 
          onClick={handleDelete}
          className="btn-delete"
          title={`Delete ${item.name}`}
        >
          🗑️ Delete Item
        </button>
      </div>

      {showImageModal && item.image && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={item.image} alt={item.name} />
            <button onClick={closeImageModal}>×</button>
            <div className="modal-info">
              <h3>{item.name}</h3>
              <p>Category: {item.category || 'Uncategorized'}</p>
              <p>Quantity: {item.quantity} units</p>
              <p>Price: £{item.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryItem;