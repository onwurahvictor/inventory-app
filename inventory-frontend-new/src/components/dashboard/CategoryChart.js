import React from 'react';

const CategoryChart = ({ data = [] }) => {
  return (
    <div className="space-y-4">
      {data.map((category, index) => (
        <div key={category._id || index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{category._id || 'Category'}</span>
            <span className="text-gray-600">{category.count || 0} items</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${Math.min((category.count || 0) * 10, 100)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryChart;