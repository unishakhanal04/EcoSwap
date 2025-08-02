import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { requestAPI, sellerAPI } from '../../services/api';
import { 
  Package, 
  DollarSign, 
  Eye, 
  TrendingUp, 
  Plus,
  MessageSquare,
  Star,
  Calendar,
  ArrowRight
} from 'lucide-react';

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRequests: 0,
    totalEarnings: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    requestEarnings: 0,
    recentItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching seller dashboard data...');
      
      const statsResponse = await sellerAPI.getDashboardStats();
      console.log('📊 Dashboard API Response:', statsResponse);
      console.log('📊 Response Data:', statsResponse.data);

      if (statsResponse.data && statsResponse.data.success) {
        const stats = statsResponse.data.data;
        console.log('📈 Stats from backend:', stats);
        
        const dashboardDataToSet = {
          totalRequests: stats.totalRequests || 0,
          totalEarnings: parseFloat(stats.totalRevenue || 0),
          approvedRequests: stats.approvedRequests || 0,
          pendingRequests: stats.pendingRequests || 0,
          requestEarnings: parseFloat(stats.requestEarnings || 0),
          recentItems: (stats.recentOrders || []).map(order => ({
            id: order.id,
            name: order.productName || order.itemName,
            earnings: parseFloat(order.totalPrice || order.sellerEarnings || 0).toFixed(2),
            status: 'Completed',
            buyer: order.buyerName,
            date: new Date(order.updatedAt).toLocaleDateString()
          }))
        };
        
        console.log('🎯 Setting dashboard data:', dashboardDataToSet);
        setDashboardData(dashboardDataToSet);
      } else {
        console.log('❌ API response indicates failure or no data');
      }
    } catch (error) {
      console.error('❌ Error fetching seller data:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Requests',
      value: dashboardData.totalRequests.toString(),
      change: `${dashboardData.pendingRequests} pending`,
      icon: Package,
      color: 'bg-emerald-500'
    },
    {
      title: 'Total Earnings',
      value: `Rs. ${dashboardData.totalEarnings.toFixed(2)}`,
      change: `Rs. ${dashboardData.requestEarnings.toFixed(2)} from requests`,
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Approved Requests',
      value: dashboardData.approvedRequests.toString(),
      change: `${((dashboardData.approvedRequests / dashboardData.totalRequests) * 100 || 0).toFixed(1)}% approval rate`,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
             [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{loading ? '...' : stat.value}</h3>
              <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
              <p className="text-sm text-emerald-600 font-medium">{stat.change}</p>
            </div>
          ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/seller/add-item"
              className="flex items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group"
            >
              <Plus className="h-8 w-8 text-emerald-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-medium text-gray-900">Add New Item</h3>
                <p className="text-sm text-gray-600">List a new product</p>
              </div>
            </Link>
            <Link
              to="/seller/my-items"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <Package className="h-8 w-8 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Items</h3>
                <p className="text-sm text-gray-600">Edit your listings</p>
              </div>
            </Link>
            {/* <Link
              to="/seller/messages"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            > */}
              {/* <MessageSquare className="h-8 w-8 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-medium text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">Chat with buyers</p>
              </div> */}
            {/* </Link> */}
            <Link
              to="/seller/analytics"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <TrendingUp className="h-8 w-8 text-orange-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-medium text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-600">Track performance</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Approved Requests */}
          <div className="w-full bg-white rounded-lg shadow-md p-6">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-gray-900">Recent Approved Requests</h2>
    <Link
      to="/seller/request"
      className="text-[#007f66] hover:text-emerald-700 font-medium text-sm flex items-center"
    >
      View All
      <ArrowRight className="h-4 w-4 ml-1" />
    </Link>
  </div>

  <div className="space-y-4">
    {loading ? (
      [1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4 p-3 rounded-lg animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex items-center space-x-4">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))
    ) : dashboardData.recentItems.length === 0 ? (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No approved requests yet</p>
      </div>
    ) : (
      dashboardData.recentItems.map((request) => (
      <div
        key={request.id}
        className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="w-16 h-16 bg-[#007f66] rounded-lg flex items-center justify-center">
          <Package className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{request.name}</h3>
          <p className="text-sm text-gray-600">Buyer: {request.buyer}</p>
          <div className="flex items-center space-x-4 mt-1">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {request.status}
            </span>
            <span className="text-xs text-gray-500">{request.date}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-[#007f66]">+Rs. {request.earnings}</span>
            <p className="text-xs">Earned</p>
          </div>
        </div>
      </div>
    )))}
  </div>
</div>


          {/* Recent Messages */}
          {/* <div className="bg-white rounded-lg shadow-md p-6"> */}
            {/* <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
              <Link
                to="/seller/messages"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div> */}
            {/* <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className={`p-4 rounded-lg border-l-4 ${
                  message.unread ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{message.buyer}</h3>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Re: {message.item}</p>
                  <p className="text-sm text-gray-800">{message.message}</p>
                </div>
              ))}
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;