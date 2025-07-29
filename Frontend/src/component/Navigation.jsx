import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, User, ShoppingBag } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b-2 border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-emerald-500 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors">
              EcoSwap
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-emerald-50"
            >
              Browse Items
            </Link>
            <Link
              to="/sell"
              className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-emerald-50"
            >
              Sell Items
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className={`inline-flex items-center px-4 py-2 border border-emerald-500 text-sm font-medium rounded-md transition-colors ${
                isActive('/login')
                  ? 'bg-emerald-500 text-white'
                  : 'text-emerald-600 bg-white hover:bg-emerald-50'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Link>
            <Link
              to="/register"
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/register')
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
