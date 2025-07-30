import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  LayoutDashboard, 
  Plus, 
  Package, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const SellerNavigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Remove the type annotation ': string'
  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { path: '/seller/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/seller/add-item', icon: Plus, label: 'Add Item' },
    { path: '/seller/my-items', icon: Package, label: 'My Items' },
    { path: '/seller/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/seller/request', icon: MessageSquare, label: 'Request' },
    { path: '/seller/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-2 border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/seller/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-emerald-500 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                EcoSwap
              </span>
              <span className="block text-xs text-emerald-600 font-medium">Seller Dashboard</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:flex items-center">
            <Link
              to="/login"
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-100 py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SellerNavigation;
