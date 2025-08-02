import React, { useState, useEffect } from 'react';
import StatsCard from '../../component/Admin/AdminStatsCard';
import RecentActivity from '../../component/Admin/RecentActivity';
import { Users, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    {
      title: 'Total Buyers',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Sellers',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: ShoppingBag,
      color: 'bg-[#007f66]'
    },
    {
      title: 'Total Commission',
      value: '$0',
      change: '0%',
      changeType: 'neutral',
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    {
      title: 'Monthly Commission',
      value: '$0',
      change: '0%',
      changeType: 'neutral',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, commissionResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getCommissionData()
      ]);
      
      const dashboardData = dashboardResponse.data;
      const commissionData = commissionResponse.data.data;
      
      setStats([
        {
          title: 'Total Buyers',
          value: dashboardData.stats?.users?.buyers?.toString() || '0',
          change: '+0%',
          changeType: 'neutral',
          icon: Users,
          color: 'bg-blue-500'
        },
        {
          title: 'Total Sellers',
          value: dashboardData.stats?.users?.sellers?.toString() || '0',
          change: '+0%',
          changeType: 'neutral',
          icon: ShoppingBag,
          color: 'bg-[#007f66]'
        },
        {
          title: 'Total Commission',
          value: `$${commissionData.totalCommission?.toFixed(2) || '0.00'}`,
          change: `+$${commissionData.thisWeekCommission?.toFixed(2) || '0.00'} this week`,
          changeType: 'positive',
          icon: DollarSign,
          color: 'bg-emerald-500'
        },
        {
          title: 'Monthly Commission',
          value: `$${commissionData.thisMonthCommission?.toFixed(2) || '0.00'}`,
          change: `${commissionData.totalApprovedRequests || 0} approved requests`,
          changeType: 'positive',
          icon: TrendingUp,
          color: 'bg-purple-500'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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