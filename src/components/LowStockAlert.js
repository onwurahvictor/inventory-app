import React, { useState } from 'react';

const LowStockAlert = ({ items }) => {
  const [expanded, setExpanded] = useState(true);
  
  const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity < 10);
  const outOfStockItems = items.filter(item => item.quantity === 0);
  
  // Sort by quantity (lowest first)
  const sortedLowStock = [...lowStockItems].sort((a, b) => a.quantity - b.quantity);
  const sortedOutOfStock = [...outOfStockItems].sort((a, b) => 
    new Date(b.lastUpdated) - new Date(a.lastUpdated)
  );

  if (lowStockItems.length === 0 && outOfStockItems.length === 0) {
    return (
      <div className="stock-alerts positive-alert">
        <div className="alert">
          <span className="alert-icon">✅</span>
          <div className="alert-content">
            <strong>All items are well stocked!</strong>
            <p>No low stock or out of stock items detected.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalAlertItems = lowStockItems.length + outOfStockItems.length;
  const totalValueAtRisk = lowStockItems.reduce((sum, item) => 
    sum + (item.quantity * item.price), 0
  );

  return (
    <div className="stock-alerts">
      <div className="alerts-header">
        <h3>
          ⚠️ Stock Alerts ({totalAlertItems})
          <button 
            onClick={() => setExpanded(!expanded)}
            className="btn-toggle-alerts"
          >
            {expanded ? '▲ Collapse' : '▼ Expand'}
          </button>
        </h3>
        <div className="alerts-summary">
          <span className="summary-item low-stock-count">
            ⚠️ {lowStockItems.length} low stock
          </span>
          <span className="summary-item out-stock-count">
            ❌ {outOfStockItems.length} out of stock
          </span>
          <span className="summary-item risk-value">
            💰 £{totalValueAtRisk.toFixed(2)} at risk
          </span>
        </div>
      </div>

      {expanded && (
        <>
          {lowStockItems.length > 0 && (
            <div className="alert low-stock-alert">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <div className="alert-header">
                  <strong>Low Stock Alert</strong>
                  <span className="alert-count">{lowStockItems.length} item(s)</span>
                </div>
                <p className="alert-description">
                  These items are running low and may need reordering soon.
                </p>
                <div className="alert-items">
                  {sortedLowStock.slice(0, 5).map(item => (
                    <div key={item.id} className="alert-item-detail">
                      <span className="item-name">{item.name} :</span><br />
                      <span className="item-quantity">
                        {item.quantity} unit{item.quantity !== 1 ? 's' : ''} left
                      </span><br />
                      <span className="item-value">
                        £{(item.quantity * item.price).toFixed(2)} value
                      </span><br />
                      <span className="item-category">{item.category || 'Uncategorized'} category </span>
                    </div>
                  ))}
                  {lowStockItems.length > 5 && (
                    <div className="more-items">
                      ... and {lowStockItems.length - 5} more items
                    </div>
                  )}
                </div>
              </div>
              <div className="alert-actions">
                <button 
                  className="btn-alert-action view-all"
                  onClick={() => alert(`Viewing all ${lowStockItems.length} low stock items`)}
                >
                  👁️ View All
                </button>
                <button 
                  className="btn-alert-action reorder"
                  onClick={() => {
                    const itemNames = lowStockItems.map(item => item.name).join(', ');
                    alert(`Consider reordering: ${itemNames}`);
                  }}
                >
                  📦 Reorder Suggestions
                </button>
              </div>
            </div>
          )}

          {outOfStockItems.length > 0 && (
            <div className="alert out-of-stock-alert">
              <span className="alert-icon">🚨</span>
              <div className="alert-content">
                <div className="alert-header">
                  <strong>Critical: Out of Stock</strong>
                  <span className="alert-count critical">{outOfStockItems.length} item(s)</span>
                </div>
                <p className="alert-description">
                  These items are completely out of stock and need immediate attention.
                </p>
                <div className="alert-items">
                  {sortedOutOfStock.slice(0, 3).map(item => (
                    <div key={item.id} className="alert-item-detail critical">
                      <span className="item-name">{item.name}</span>
                      <span className="item-status">OUT OF STOCK</span>
                      <span className="item-price">£{item.price.toFixed(2)} each</span>
                      <span className="item-updated">Last updated: {item.lastUpdated}</span>
                    </div>
                  ))}
                  {outOfStockItems.length > 3 && (
                    <div className="more-items critical">
                      ... and {outOfStockItems.length - 3} more out of stock items
                    </div>
                  )}
                </div>
              </div>
              <div className="alert-actions">
                <button 
                  className="btn-alert-action critical-action"
                  onClick={() => {
                    const totalCost = outOfStockItems.reduce((sum, item) => sum + item.price * 10, 0);
                    alert(`Restocking ${outOfStockItems.length} items (10 each) would cost approximately £${totalCost.toFixed(2)}`);
                  }}
                >
                  💰 Calculate Restock Cost
                </button>
                <button 
                  className="btn-alert-action urgent"
                  onClick={() => alert(`URGENT: Please restock ${outOfStockItems.map(item => item.name).join(', ')}`)}
                >
                  🔔 Mark as Urgent
                </button>
              </div>
            </div>
          )}

          <div className="alerts-footer">
            <p className="footer-note">
              💡 <strong>Recommendation:</strong> 
              {lowStockItems.length > 0 && ` Consider reordering ${Math.min(3, lowStockItems.length)} most critical items first.`}
              {outOfStockItems.length > 0 && ` Restock out of stock items immediately to avoid lost sales.`}
            </p>
            <div className="footer-actions">
              <button 
                className="btn-footer"
                onClick={() => {
                  const report = `Stock Alert Report:\n\n` +
                    `Low Stock Items: ${lowStockItems.length}\n` +
                    `Out of Stock Items: ${outOfStockItems.length}\n` +
                    `Total Value at Risk: £${totalValueAtRisk.toFixed(2)}\n` +
                    `Generated: ${new Date().toLocaleString()}`;
                  alert(report);
                }}
              >
                📋 Generate Report
              </button>
              <button 
                className="btn-footer"
                onClick={() => {
                  localStorage.setItem('lastAlertCheck', new Date().toISOString());
                  alert('Alerts marked as reviewed. Next check recommended in 24 hours.');
                }}
              >
                ✅ Mark as Reviewed
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LowStockAlert;