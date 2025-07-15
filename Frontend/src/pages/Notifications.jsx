import React, { useState } from 'react';
import { Bell, Package, TrendingUp, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import Card from '../components/Seller/common/Card';
import Button from '../components/Seller/common/Button'

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'You have a new order for "Vintage Ceramic Vase" from Sarah Johnson',
      time: '2 hours ago',
      read: false,
      icon: Package,
      color: 'green'
    },
    {
      id: 2,
      type: 'system',
      title: 'Policy Update',
      message: 'New seller guidelines have been updated. Please review the changes in your seller dashboard.',
      time: '1 day ago',
      read: false,
      icon: AlertCircle,
      color: 'blue'
    },
    {
      id: 3,
      type: 'performance',
      title: 'Performance Milestone',
      message: 'Congratulations! You\'ve reached 100 total sales this month.',
      time: '2 days ago',
      read: true,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 4,
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #ORD-002 has been marked as shipped. The buyer will be notified.',
      time: '3 days ago',
      read: true,
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 5,
      type: 'system',
      title: 'Account Verification',
      message: 'Please verify your payment information to continue selling on EcoSwap.',
      time: '1 week ago',
      read: false,
      icon: AlertCircle,
      color: 'orange'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      <Card 
        title="Notifications" 
        subtitle={`${unreadCount} unread notifications`}
        action={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )
        }
      >
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'order', label: 'Orders' },
            { key: 'system', label: 'System' },
            { key: 'performance', label: 'Performance' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === tab.key
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
              {tab.key === 'unread' && unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all ${
                  notification.read 
                    ? 'bg-white border-slate-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full bg-${notification.color}-100 flex-shrink-0`}>
                    <Icon className={`h-5 w-5 text-${notification.color}-600`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium ${notification.read ? 'text-slate-900' : 'text-slate-900'}`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${notification.read ? 'text-slate-600' : 'text-slate-700'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs text-slate-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </span>
                          {!notification.read && (
                            <span className="text-xs text-blue-600 font-medium">New</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No notifications found.</p>
          </div>
        )}
      </Card>

      {/* Notification Preferences */}
      <Card title="Notification Preferences" subtitle="Manage how you receive notifications">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Order Notifications</h4>
              <p className="text-sm text-slate-600">Get notified when you receive new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">System Updates</h4>
              <p className="text-sm text-slate-600">Receive notifications about policy changes and system updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Performance Alerts</h4>
              <p className="text-sm text-slate-600">Get notified about sales milestones and performance metrics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Email Notifications</h4>
              <p className="text-sm text-slate-600">Receive email notifications for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Notifications;