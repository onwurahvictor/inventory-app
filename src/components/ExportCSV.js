import React from 'react';
import { CSVLink } from 'react-csv';

const ExportCSV = ({ items }) => {
  // Prepare CSV data
  const csvData = items.map(item => ({
    ID: item.id,
    Name: item.name,
    Category: item.category || 'Uncategorized',
    Quantity: item.quantity,
    'Price per Unit': `£${item.price.toFixed(2)}`,
    'Total Value': `£${(item.quantity * item.price).toFixed(2)}`,
    'Stock Status': item.quantity === 0 ? 'Out of Stock' : 
                   item.quantity < 10 ? 'Low Stock' : 'In Stock',
    'Last Updated': item.lastUpdated,
    'Date Added': item.addedDate || 'N/A',
    'Has Image': item.image ? 'Yes' : 'No'
  }));

  // Calculate summary statistics
  const totalItems = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity < 10).length;
  const outOfStockItems = items.filter(item => item.quantity === 0).length;
  const categoriesCount = new Set(items.map(item => item.category).filter(Boolean)).size;

  // Add summary row
  const summaryData = [
    {},
    {
      ID: 'SUMMARY',
      Name: 'INVENTORY SUMMARY REPORT',
      Category: `Total Categories: ${categoriesCount}`,
      Quantity: `Total Units: ${totalUnits}`,
      'Price per Unit': `Total Items: ${totalItems}`,
      'Total Value': `Total Inventory Value: £${totalValue.toFixed(2)}`,
      'Stock Status': `Low Stock Items: ${lowStockItems}`,
      'Last Updated': `Out of Stock Items: ${outOfStockItems}`,
      'Date Added': `Report Date: ${new Date().toLocaleDateString()}`,
      'Has Image': `Generated: ${new Date().toLocaleString()}`
    }
  ];

  // Add category breakdown
  const categoryBreakdown = {};
  items.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = {
        count: 0,
        value: 0
      };
    }
    categoryBreakdown[category].count++;
    categoryBreakdown[category].value += item.quantity * item.price;
  });

  const breakdownData = Object.entries(categoryBreakdown).map(([category, data]) => ({
    ID: 'CATEGORY',
    Name: category,
    Category: `Items: ${data.count}`,
    Quantity: '',
    'Price per Unit': '',
    'Total Value': `Value: £${data.value.toFixed(2)}`,
    'Stock Status': '',
    'Last Updated': '',
    'Date Added': '',
    'Has Image': ''
  }));

  const allData = [...csvData, {}, ...breakdownData, ...summaryData];

  return (
    <div className="export-section">
      <CSVLink 
        data={allData}
        filename={`inventory-export-${new Date().toISOString().split('T')[0]}.csv`}
        className="btn-export"
        title="Export to CSV"
      >
        📥 Export to CSV
      </CSVLink>
      
      <div className="export-info">
        <small>
          {items.length} items | £{totalValue.toFixed(2)} total value
        </small>
        <div className="export-options">
          <small>Includes: Item details + Summary + Category breakdown</small>
        </div>
      </div>
    </div>
  );
};

export default ExportCSV;