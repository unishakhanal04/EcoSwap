import React, { useState } from 'react';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  DollarSign, 
  Calendar,
  Users,
  ShoppingBag,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const overviewStats = [
    {
      title: 'Total Views',
      value: '3,421',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Total Likes',
      value: '287',
      change: '+8.3%',
      trend: 'up',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Total Earnings',
      value: '$1,247',
      change: '+15.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: 'Items Sold',
      value: '23',
      change: '-2.1%',
      trend: 'down',
      icon: ShoppingBag,
      color: 'text-purple-600'
    }
  ];

  const topPerformingItems = [
    {
      id: 1,
      title: 'Handwoven Wall Tapestry',
      views: 203,
      likes: 41,
      earnings: '$32',
      image: 'https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      title: 'Vintage Ceramic Vase',
      views: 156,
      likes: 23,
      earnings: '$45',
      image: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      title: 'Ceramic Candle Holders Set',
      views: 134,
      likes: 28,
      earnings: '$28',
      image: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 4,
      title: 'Mid-Century Table Lamp',
      views: 89,
      likes: 15,
      earnings: '$68',
      image: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const categoryPerformance = [
    { category: 'Wall Art', items: 8, views: 456, earnings: '$234' },
    { category: 'Lighting', items: 5, views: 321, earnings: '$189' },
    { category: 'Vases & Pottery', items: 6, views: 298, earnings: '$156' },
    { category: 'Furniture', items: 3, views: 187, earnings: '$298' },
    { category: 'Candles & Holders', items: 4, views: 145, earnings: '$87' }
  ];

  const recentActivity = [
    { type: 'view', item: 'Vintage Ceramic Vase', user: 'Sarah M.', time: '2 hours ago' },
    { type: 'like', item: 'Handwoven Wall Tapestry', user: 'Mike R.', time: '3 hours ago' },
    { type: 'message', item: 'Mid-Century Table Lamp', user: 'Emma K.', time: '5 hours ago' },
    { type: 'view', item: 'Ceramic Candle Holders', user: 'David L.', time: '6 hours ago' },
    { type: 'like', item: 'Antique Mirror Frame', user: 'Lisa P.', time: '8 hours ago' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-600" />;
      case 'message':
        return <Users className="h-4 w-4 text-emerald-600" />;
      default:
        return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Track your store's performance and insights</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Items</h2>
            <div className="space-y-4">
              {topPerformingItems.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-600 text-sm font-medium rounded-full">
                      {index + 1}
                    </span>
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {item.views}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {item.likes}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">{item.earnings}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Performance</h2>
            <div className="space-y-4">
              {categoryPerformance.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-900">{category.category}</h3>
                    <p className="text-sm text-gray-600">{category.items} items</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {category.views}
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">{category.earnings}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>
                    {activity.type === 'view' && ' viewed '}
                    {activity.type === 'like' && ' liked '}
                    {activity.type === 'message' && ' messaged about '}
                    <span className="font-medium">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;