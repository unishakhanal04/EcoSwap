import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Heart, Users, ArrowRight, Star } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 15,
    approvedRequests: 8,
    wishlistItems: 23,
    savedSellers: 12
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Request approved', item: 'Vintage Ceramic Vase', time: '2 hours ago', status: 'approved' },
    { id: 2, action: 'New item added to wishlist', item: 'Mid-Century Coffee Table', time: '5 hours ago', status: 'wishlist' },
    { id: 3, action: 'Request submitted', item: 'Handwoven Wall Hanging', time: '1 day ago', status: 'pending' },
    { id: 4, action: 'Request approved', item: 'Antique Mirror Frame', time: '2 days ago', status: 'approved' },
  ]);

  const [featuredItems, setFeaturedItems] = useState([
    {
      id: 1,
      name: 'Bohemian Floor Lamp',
      price: '$85',
      image: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Sarah Chen',
      rating: 4.8,
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      name: 'Rustic Wooden Bookshelf',
      price: '$120',
      image: 'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Mike Johnson',
      rating: 4.9,
      location: 'Portland, OR'
    },
    {
      id: 3,
      name: 'Vintage Plant Stand',
      price: '$45',
      image: 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Emma Davis',
      rating: 4.7,
      location: 'Austin, TX'
    }
  ]);

  const handleRequestItem = (itemId) => {
    alert(`Request submitted for item ${itemId}! The seller will be notified.`);
    setStats(prev => ({ ...prev, totalRequests: prev.totalRequests + 1 }));
  };

  const handleAddToWishlist = (itemId) => {
    alert(`Item ${itemId} added to your wishlist!`);
    setStats(prev => ({ ...prev, wishlistItems: prev.wishlistItems + 1 }));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back to EcoSwap!</h1>
        <p className="dashboard-subtitle">Discover unique home decorative items from fellow eco-conscious sellers.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper requests">
            <ShoppingBag className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalRequests}</h3>
            <p className="stat-label">Total Requests</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper approved">
            <TrendingUp className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.approvedRequests}</h3>
            <p className="stat-label">Approved Requests</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper wishlist">
            <Heart className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.wishlistItems}</h3>
            <p className="stat-label">Wishlist Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper sellers">
            <Users className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.savedSellers}</h3>
            <p className="stat-label">Saved Sellers</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Activity */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <button className="view-all-btn">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-status ${activity.status}`}></div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-item-name">{activity.item}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Items */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Featured Items Near You</h2>
            <button className="view-all-btn">
              Browse All <ArrowRight size={16} />
            </button>
          </div>
          <div className="featured-grid">
            {featuredItems.map((item) => (
              <div key={item.id} className="featured-item-card">
                <div className="item-image-wrapper">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <button
                    className="wishlist-btn"
                    onClick={() => handleAddToWishlist(item.id)}
                  >
                    <Heart size={20} />
                  </button>
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">{item.price}</p>
                  <div className="seller-info">
                    <div className="seller-details">
                      <p className="seller-name">{item.seller}</p>
                      <div className="rating">
                        <Star size={14} className="star-filled" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <p className="seller-location">{item.location}</p>
                  </div>
                  <button
                    className="request-btn"
                    onClick={() => handleRequestItem(item.id)}
                  >
                    Request Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;