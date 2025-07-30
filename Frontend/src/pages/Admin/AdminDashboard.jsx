import React from 'react';
import StatsCard from '../../component/Admin/AdminStatsCard';
import RecentActivity from '../../component/Admin/RecentActivity';
import { Users, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Buyers',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Sellers',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'bg-[#007f66]'
    },
    {
      title: 'Monthly Revenue',
      value: '$48,392',
      change: '+15.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    {
      title: 'Growth Rate',
      value: '23.4%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 bg-gradient-to-br from-[#007f66]/10 to-blue-500/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-[#007f66] mx-auto mb-3" />
              <p className="text-gray-600">Chart visualization would go here</p>
              <p className="text-sm text-gray-500">User registration trends over time</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-[#007f66] text-white px-4 py-3 rounded-lg hover:bg-[#006b59] transition-colors">
            <Users className="w-5 h-5" />
            <span>Add Buyer</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span>Add Seller</span>
          </button>
          <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span>View Reports</span>
          </button>
          <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="w-5 h-5" />
            <span>Revenue</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;