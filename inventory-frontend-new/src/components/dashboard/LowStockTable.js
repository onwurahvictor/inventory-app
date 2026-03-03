import React from 'react';
import { Link } from 'react-router-dom';

const LowStockTable = ({ items = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.slice(0, 5).map((item) => (
            <tr key={item.id || item._id}>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.category}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{item.quantity} units</div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.quantity <= 2 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.quantity <= 2 ? 'Critical' : 'Low'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockTable;