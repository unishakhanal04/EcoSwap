import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import HomePage from './pages/Homepage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Navigation from './component/Navigation';
import SellerNavigation from './component/SellerNavigation';

import SellerDashboard from './pages/seller/SellerDashboard';
import AddItem from './pages/seller/AddItem';
import MyItems from './pages/seller/MyItems';
import Analytics from './pages/seller/Analytics';
import Messages from './pages/seller/Messages';
import Settings from './pages/seller/Settings';

function App() {
  const isSellerRoute = window.location.pathname.startsWith('/seller');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isSellerRoute ? <SellerNavigation /> : <Navigation />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/add-item" element={<AddItem />} />
          <Route path="/seller/my-items" element={<MyItems />} />
          <Route path="/seller/analytics" element={<Analytics />} />
          <Route path="/seller/messages" element={<Messages />} />
          <Route path="/seller/settings" element={<Settings />} />




          {/* Buyer  */}
           <Route path="/buyer" element={<Navigate to="/buyer/dashboard" replace />} />
          <Route path="/buyer/*" element={<BuyerComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;