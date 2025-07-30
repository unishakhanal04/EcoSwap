import React from 'react';
import { User, ShoppingBag, TrendingUp } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'user_joined',
      message: 'New buyer registered',
      user: 'John Smith',
      time: '2 minutes ago',
      icon: User,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'sale',
      message: 'New sale completed',
      user: 'Alice Cooper',
      time: '15 minutes ago',
      icon: ShoppingBag,
      color: 'text-[#007f66]'
    },
    {
      id: 3,
      type: 'growth',
      message: 'Revenue milestone reached',
      user: 'System',
      time: '1 hour ago',
      icon: TrendingUp,
      color: 'text-purple-500'
    },
    {
      id: 4,
      type: 'user_joined',
      message: 'New seller approved',
      user: 'Bob Martinez',
      time: '2 hours ago',
      icon: User,
      color: 'text-blue-500'
    },
    {
      id: 5,
      type: 'sale',
      message: 'High-value transaction',
      user: 'Daniel Lee',
      time: '3 hours ago',
      icon: ShoppingBag,
      color: 'text-[#007f66]'
    }
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-600">{activity.user}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;