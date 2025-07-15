import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Eye, Users, Package } from 'lucide-react';
import Card from '../components/Seller/common/Card';
import Button from '../components/Seller/common/Button';

const Analytics = () => {
  const performanceData = [
    { month: 'Jan', sales: 320, views: 1200, listings: 12 },
    { month: 'Feb', sales: 450, views: 1800, listings: 15 },
    { month: 'Mar', sales: 380, views: 1500, listings: 18 },
    { month: 'Apr', sales: 520, views: 2100, listings: 20 },
    { month: 'May', sales: 690, views: 2500, listings: 23 },
    { month: 'Jun', sales: 580, views: 2200, listings: 25 }
  ];

  const topCategories = [
    { name: 'Vases & Planters', percentage: 35, sales: 1250, color: 'bg-blue-500' },
    { name: 'Wall Art', percentage: 25, sales: 890, color: 'bg-green-500' },
    { name: 'Rugs', percentage: 20, sales: 720, color: 'bg-purple-500' },
    { name: 'Lighting', percentage: 15, sales: 540, color: 'bg-orange-500' },
    { name: 'Others', percentage: 5, sales: 180, color: 'bg-gray-500' }
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$3,580',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Total Views',
      value: '11,100',
      change: '+8.3%',
      changeType: 'positive',
      icon: Eye,
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.5%',
      changeType: 'negative',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Active Listings',
      value: '25',
      change: '+4',
      changeType: 'positive',
      icon: Package,
      color: 'orange'
    }
  ];

  const recentActivity = [
    { action: 'New order received', item: 'Ceramic Vase', time: '2 hours ago', type: 'order' },
    { action: 'Listing viewed', item: 'Boho Wall Art', time: '3 hours ago', type: 'view' },
    { action: 'Item sold', item: 'Moroccan Rug', time: '1 day ago', type: 'sale' },
    { action: 'New listing created', item: 'Vintage Mirror', time: '2 days ago', type: 'listing' }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card title="Sales Performance" subtitle="Monthly overview">
          <div className="space-y-4">
            {performanceData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-slate-600 w-8">{data.month}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(data.sales / 700) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-600">${data.sales}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Categories */}
        <Card title="Top Categories" subtitle="Best performing categories">
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm font-medium text-slate-900">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">{category.percentage}%</span>
                  <span className="text-sm font-medium text-slate-900">${category.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Latest interactions">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'order' ? 'bg-green-100' :
                  activity.type === 'view' ? 'bg-blue-100' :
                  activity.type === 'sale' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {activity.type === 'order' && <Package className="h-3 w-3 text-green-600" />}
                  {activity.type === 'view' && <Eye className="h-3 w-3 text-blue-600" />}
                  {activity.type === 'sale' && <DollarSign className="h-3 w-3 text-purple-600" />}
                  {activity.type === 'listing' && <TrendingUp className="h-3 w-3 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-600">{activity.item}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Insights */}
        <Card title="Performance Insights" subtitle="Key recommendations">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📈 Sales Growth</h4>
              <p className="text-sm text-blue-700">Your sales have increased by 12.5% this month. Consider adding more similar items to your popular categories.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">🎯 High Demand</h4>
              <p className="text-sm text-green-700">Vases & Planters are your top-selling category. Stock up on similar items to maximize revenue.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">⚠️ Low Stock Alert</h4>
              <p className="text-sm text-yellow-700">Consider adding more lighting items to your inventory as they show high conversion rates.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;