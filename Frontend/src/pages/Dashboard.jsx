import React from 'react';
import { TrendingUp, Package, ShoppingCart, DollarSign, Eye, Users } from 'lucide-react';
import Card from '../components/Seller/common/Card';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Earnings',
      value: '$2,847.50',
      change: '+12.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Listings',
      value: '23',
      change: '+3 this week',
      changeType: 'positive',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Orders',
      value: '18',
      change: '+5 this month',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'purple'
    },
    {
      title: 'Profile Views',
      value: '1,247',
      change: '+8.2%',
      changeType: 'positive',
      icon: Eye,
      color: 'orange'
    }
  ];

  const recentOrders = [
    { id: '1', item: 'Vintage Ceramic Vase', buyer: 'Sarah Johnson', amount: '$45.00', status: 'Shipped' },
    { id: '2', item: 'Boho Wall Art Set', buyer: 'Mike Chen', amount: '$89.99', status: 'Pending' },
    { id: '3', item: 'Moroccan Rug', buyer: 'Emily Davis', amount: '$156.75', status: 'Delivered' }
  ];

  const topPerforming = [
    { name: 'Ceramic Vases', sales: 12, revenue: '$480.00' },
    { name: 'Wall Art', sales: 8, revenue: '$320.00' },
    { name: 'Artificial Plants', sales: 6, revenue: '$240.00' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card title="Recent Orders" subtitle="Your latest order activity">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{order.item}</h4>
                  <p className="text-sm text-slate-600">Buyer: {order.buyer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{order.amount}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Categories */}
        <Card title="Top Performing Categories" subtitle="Your best selling items">
          <div className="space-y-4">
            {topPerforming.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">{category.name}</h4>
                  <p className="text-sm text-slate-600">{category.sales} items sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{category.revenue}</p>
                  <div className="w-16 bg-slate-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(category.sales / 12) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" subtitle="Common tasks to manage your listings">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <Package className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-slate-900">Add New Listing</h4>
            <p className="text-sm text-slate-600">Upload a new decorative item</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-slate-900">View Analytics</h4>
            <p className="text-sm text-slate-600">Check your performance metrics</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <ShoppingCart className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-slate-900">Manage Orders</h4>
            <p className="text-sm text-slate-600">Update order status</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;