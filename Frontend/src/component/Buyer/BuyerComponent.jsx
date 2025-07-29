import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, Menu, X, ShoppingBag } from 'lucide-react';
import Dashboard from '../pages/Dashboard';
import BrowseItems from '../pages/BrowseItems';
import MyRequests from '../pages/MyRequests';
import Profile from '../pages/Profile';
import './BuyerComponent.css';

const BuyerComponent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/buyer/dashboard', icon: Home },
    { name: 'Browse Items', path: '/buyer/browse', icon: Search },
    { name: 'My Requests', path: '/buyer/requests', icon: ShoppingBag },
    { name: 'Profile', path: '/buyer/profile', icon: User },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="buyer-layout">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Heart className="logo-icon" />
            <span className="logo-text">EcoSwap</span>
          </div>
          
          <nav className="desktop-nav">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/browse" element={<BrowseItems />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default BuyerComponent;