import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  Eye,
  Download,
  Filter
} from 'lucide-react';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data
  const overviewStats = [
    {
      title: 'Total Revenue',
      value: '$124,592',
      change: '+18.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Users',
      value: '4,081',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-[#007f66]'
    },
    {
      title: 'Total Transactions',
      value: '2,847',
      change: '+8.1%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-2.1%',
      changeType: 'negative',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12000, transactions: 245 },
    { month: 'Feb', revenue: 15000, transactions: 298 },
    { month: 'Mar', revenue: 18000, transactions: 356 },
    { month: 'Apr', revenue: 22000, transactions: 412 },
    { month: 'May', revenue: 19000, transactions: 378 },
    { month: 'Jun', revenue: 25000, transactions: 489 }
  ];

  const topCategories = [
    { name: 'Electronics', sales: 1245, percentage: 35 },
    { name: 'Clothing', sales: 987, percentage: 28 },
    { name: 'Home & Garden', sales: 654, percentage: 18 },
    { name: 'Books', sales: 432, percentage: 12 },
    { name: 'Sports', sales: 234, percentage: 7 }
  ];

  const userGrowth = [
    { period: 'Week 1', buyers: 45, sellers: 12 },
    { period: 'Week 2', buyers: 52, sellers: 18 },
    { period: 'Week 3', buyers: 38, sellers: 15 },
    { period: 'Week 4', buyers: 67, sellers: 23 }
  ];

  const topSellers = [
    { name: 'Alice Cooper', sales: 156, revenue: '$4,230' },
    { name: 'Daniel Lee', sales: 142, revenue: '$3,890' },
    { name: 'Bob Martinez', sales: 128, revenue: '$3,456' },
    { name: 'Eva Rodriguez', sales: 98, revenue: '$2,678' },
    { name: 'Carol Thompson', sales: 87, revenue: '$2,234' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track performance and insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007f66] focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="flex items-center space-x-2 bg-[#007f66] text-white px-4 py-2 rounded-lg hover:bg-[#006b59] transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium flex items-center ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'revenue' 
                    ? 'bg-[#007f66] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setSelectedMetric('transactions')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'transactions' 
                    ? 'bg-[#007f66] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Transactions
              </button>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((data, index) => {
              const value = selectedMetric === 'revenue' ? data.revenue : data.transactions;
              const maxValue = selectedMetric === 'revenue' ? 25000 : 500;
              const height = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-[#007f66] rounded-t-lg transition-all duration-300 hover:bg-[#006b59] cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${data.month}: ${selectedMetric === 'revenue' ? `$${value.toLocaleString()}` : value}`}
                  />
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
          <div className="space-y-4">
            {userGrowth.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{data.period}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#007f66] rounded-full"></div>
                    <span className="text-sm text-gray-600">Buyers: {data.buyers}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Sellers: {data.sellers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Categories</h3>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    <span className="text-sm text-gray-600">{category.sales} sales</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#007f66] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 ml-4">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Sellers</h3>
          <div className="space-y-4">
            {topSellers.map((seller, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#007f66] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {seller.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{seller.name}</p>
                    <p className="text-sm text-gray-600">{seller.sales} sales</p>
                  </div>
                </div>
                <span className="font-semibold text-[#007f66]">{seller.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">98.5%</p>
            <p className="text-sm text-gray-600">Platform Uptime</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">4.2</p>
            <p className="text-sm text-gray-600">Avg. Session Duration (min)</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">67%</p>
            <p className="text-sm text-gray-600">Return Customer Rate</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2.8</p>
            <p className="text-sm text-gray-600">Avg. Orders per User</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;