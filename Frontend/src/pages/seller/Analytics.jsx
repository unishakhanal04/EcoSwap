import React, { useState, useEffect } from 'react';
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
  ArrowDown,
  Package
} from 'lucide-react';
import { sellerAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overviewStats: [],
    topPerformingItems: [],
    categoryPerformance: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching seller analytics data for timeRange:', timeRange);
      
      const response = await sellerAPI.getAnalytics({ timeRange });
      console.log('📊 Analytics API Response:', response);
      console.log('📊 Analytics Response Data:', response.data);
      
      if (response.data && response.data.success) {
        const { overviewStats, topPerformingItems, categoryPerformance } = response.data.data || {};
        console.log('📈 Analytics stats from backend:', { overviewStats, topPerformingItems, categoryPerformance });
        
        // Format overview stats for display
        const formattedOverviewStats = [
          { 
            title: 'Total Likes',
            value: overviewStats?.totalLikes?.toString() || '0',
            change: '+0%',
            trend: 'up',
            icon: Heart,
            color: 'text-red-600'
          },
          { 
            title: 'Total Earnings',
            value: `Rs. ${overviewStats?.totalRevenue || 0}`,
            change: '+0%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-emerald-600'
          },
          { 
            title: 'Items Sold',
            value: overviewStats?.totalSales?.toString() || '0',
            change: '+0%',
            trend: 'up',
            icon: ShoppingBag,
            color: 'text-purple-600'
          }
        ];

        console.log('🎯 Setting analytics data:', {
          overviewStats: formattedOverviewStats,
          topPerformingItems: topPerformingItems || [],
          categoryPerformance: categoryPerformance || []
        });

        setAnalyticsData({
          overviewStats: formattedOverviewStats,
          topPerformingItems: topPerformingItems || [],
          categoryPerformance: categoryPerformance || []
        });
      } else {
        console.log('❌ Analytics API response indicates failure or no data');
      }
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      console.error('❌ Analytics error details:', error.response?.data);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const { overviewStats, topPerformingItems, categoryPerformance } = analyticsData;

  // const recentActivity = [
  //   { type: 'view', item: 'Vintage Ceramic Vase', user: 'Sarah M.', time: '2 hours ago' },
  //   { type: 'like', item: 'Handwoven Wall Tapestry', user: 'Mike R.', time: '3 hours ago' },
  //   { type: 'message', item: 'Mid-Century Table Lamp', user: 'Emma K.', time: '5 hours ago' },
  //   { type: 'view', item: 'Ceramic Candle Holders', user: 'David L.', time: '6 hours ago' },
  //   { type: 'like', item: 'Antique Mirror Frame', user: 'Lisa P.', time: '8 hours ago' }
  // ];

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
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))
          ) : (
            overviewStats.map((stat, index) => (
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
            ))
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Items</h2>
            <div className="space-y-4">
              {loading ? (
                // Loading skeleton for top performing items
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))
              ) : topPerformingItems.length > 0 ? (
                topPerformingItems.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-600 text-sm font-medium rounded-full">
                        {index + 1}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                       <Package className="h-6 w-6 text-gray-400" />
                     </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
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
                       <span className="font-bold text-emerald-600">${item.revenue.toFixed(2)}</span>
                     </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No sales data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Performance</h2>
            <div className="space-y-4">
              {loading ? (
                // Loading skeleton for category performance
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))
              ) : categoryPerformance.length > 0 ? (
                categoryPerformance.map((category, index) => (
                   <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                     <div>
                       <h3 className="font-medium text-gray-900">{category.name}</h3>
                       <p className="text-sm text-gray-600">{category.items} items</p>
                     </div>
                     <div className="text-right">
                       <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                         <div className="flex items-center">
                           <ShoppingBag className="h-3 w-3 mr-1" />
                           {category.sales} sales
                         </div>
                       </div>
                       <span className="font-bold text-emerald-600">${category.revenue.toFixed(2)}</span>
                     </div>
                   </div>
                 ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No category data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {/* <div className="bg-white rounded-lg shadow-md p-6">
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
        </div> */}
      </div>
    </div>
  );
};

export default Analytics;