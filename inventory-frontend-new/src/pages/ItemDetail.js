import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock data for demonstration
  const item = {
    id: id,
    name: `Product ${id}`,
    category: id % 2 === 0 ? 'Electronics' : 'Furniture',
    quantity: parseInt(id) * 3,
    price: parseInt(id) * 100,
    description: `This is a detailed description for product ${id}. It includes features, specifications, and other important information.`,
    sku: `SKU-${id.toString().padStart(4, '0')}`,
    lowStockThreshold: 10,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/items')}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          <span className="mr-1">←</span> Back to Items
        </button>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {item.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {item.category}
                </span>
                <span className="text-gray-600">SKU: {item.sku}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Edit
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity in Stock</label>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{item.quantity} units</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <div className="text-xl font-semibold text-gray-900 mt-1">${item.price.toFixed(2)}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Value</label>
                  <div className="text-xl font-semibold text-gray-900 mt-1">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Status</h3>
              <div className={`p-4 rounded-lg ${
                item.quantity <= 2 
                  ? 'bg-red-50 border border-red-200' 
                  : item.quantity <= item.lowStockThreshold
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    item.quantity <= 2 
                      ? 'text-red-600' 
                      : item.quantity <= item.lowStockThreshold
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {item.quantity <= 2 
                      ? 'CRITICAL' 
                      : item.quantity <= item.lowStockThreshold
                      ? 'LOW STOCK'
                      : 'IN STOCK'
                    }
                  </div>
                  <p className="text-gray-600">
                    {item.quantity <= 2 
                      ? 'Stock is critically low. Reorder immediately.'
                      : item.quantity <= item.lowStockThreshold
                      ? 'Stock is below threshold. Consider reordering.'
                      : 'Stock levels are good.'
                    }
                  </p>
                  {item.quantity <= item.lowStockThreshold && (
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Reorder Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                Update Stock
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                Print Label
              </button>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;