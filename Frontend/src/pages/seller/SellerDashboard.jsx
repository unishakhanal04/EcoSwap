import React from 'react';
import { Link } from 'react-router-dom';
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
  const stats = [
    {
      title: 'Total Items',
      value: '24',
      change: '+3 this week',
      icon: Package,
      color: 'bg-emerald-500'
    },
    {
      title: 'Total Earnings',
      value: '$1,247',
      change: '+$156 this week',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Views',
      value: '3,421',
      change: '+234 this week',
      icon: Eye,
      color: 'bg-purple-500'
    },
    {
      title: 'Conversion Rate',
      value: '12.5%',
      change: '+2.1% this week',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const recentItems = [
    {
      id: 1,
      title: 'Vintage Ceramic Vase',
      price: '$45',
      status: 'Active',
      views: 156,
      image: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 2,
      title: 'Mid-Century Table Lamp',
      price: '$68',
      status: 'Sold',
      views: 89,
      image: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      title: 'Handwoven Wall Tapestry',
      price: '$32',
      status: 'Active',
      views: 203,
      image: 'https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      buyer: 'Sarah M.',
      item: 'Vintage Ceramic Vase',
      message: 'Is this still available? I\'m very interested!',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      buyer: 'Mike R.',
      item: 'Mid-Century Table Lamp',
      message: 'Can you provide more photos of the lamp base?',
      time: '5 hours ago',
      unread: false
    },
    {
      id: 3,
      buyer: 'Emma K.',
      item: 'Handwoven Wall Tapestry',
      message: 'What are the exact dimensions?',
      time: '1 day ago',
      unread: false
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
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
              <p className="text-sm text-emerald-600 font-medium">{stat.change}</p>
            </div>
          ))}
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
            <Link
              to="/seller/messages"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <MessageSquare className="h-8 w-8 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-medium text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">Chat with buyers</p>
              </div>
            </Link>
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
          {/* Recent Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Items</h2>
              <Link
                to="/seller/my-items"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-lg font-bold text-emerald-600">{item.price}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-600">
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="text-sm">{item.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
              <Link
                to="/seller/messages"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;