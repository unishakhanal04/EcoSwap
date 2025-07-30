import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
//Homepage
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Navigation from "./component/Navigation";
import SellerNavigation from "./component/SellerNavigation";
//Seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import AddItem from "./pages/seller/AddItem";
import MyItems from "./pages/seller/MyItems";
import Analytics from "./pages/seller/Analytics";
import RequestPage from "./pages/seller/Request";
import Settings from "./pages/seller/Settings";

import BuyerComponent from "./pages/Buyer/Common";
//Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Buyers from "./pages/Admin/Buyers";
import Sellers from "./pages/Admin/Sellers";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import Common from "./pages/Buyer/Common";
import { Layout } from "lucide-react";

//Admin

import AdminLayout from "./pages/Admin/AdminLayout";
function App() {
  const isSellerRoute = window.location.pathname.startsWith("/seller");
  const homeRoute = window.location.pathname === "/";
  const authRoute =
    window.location.pathname.startsWith("/login") ||
    window.location.pathname.startsWith("/register");

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {isSellerRoute && <SellerNavigation />}

        {homeRoute && <Navigation />}
        {authRoute && <Navigation />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/add-item" element={<AddItem />} />
          <Route path="/seller/my-items" element={<MyItems />} />
          <Route path="/seller/analytics" element={<Analytics />} />
          <Route path="/seller/request" element={<RequestPage />} />
          <Route path="/seller/settings" element={<Settings />} />

          {/* Buyer  */}
          <Route
            path="/buyer"
            element={<Navigate to="/buyer/dashboard" replace />}
          />
          <Route path="/buyer/*" element={<Common />} />

          {/* Seller */}
          <Route path="/seller" element={<SellerDashboard />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="buyers" element={<Buyers />} />
            <Route path="sellers" element={<Sellers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
