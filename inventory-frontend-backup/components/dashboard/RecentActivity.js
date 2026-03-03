import React from 'react';

const RecentActivity = () => {
  const activities = [
    { id: 1, action: 'Item added', item: 'iPhone 15 Pro', time: '2 hours ago' },
    { id: 2, action: 'Stock updated', item: 'MacBook Air', time: '5 hours ago' },
    { id: 3, action: 'Low stock alert', item: 'Office Chair', time: '1 day ago' },
    { id: 4, action: 'Category created', item: 'Electronics', time: '2 days ago' },
  ];

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="h-2 w-2 mt-2 rounded-full bg-blue-600"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{activity.action}</span>: {activity.item}
            </p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;