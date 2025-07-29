import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera, Star, Shield } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate about sustainable living and finding unique home decor pieces. Love supporting local sellers and giving pre-loved items a new home.',
    joinDate: '2023-08-15',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
  });

  const [editingData, setEditingData] = useState({ ...profileData });

  const stats = {
    totalRequests: 15,
    completedPurchases: 8,
    averageRating: 4.9,
    memberSince: '8 months'
  };

  const recentActivity = [
    { id: 1, action: 'Completed purchase', item: 'Vintage Ceramic Vase', date: '2024-01-16' },
    { id: 2, action: 'Left review', item: 'Mid-Century Coffee Table', date: '2024-01-15' },
    { id: 3, action: 'Request approved', item: 'Handwoven Wall Hanging', date: '2024-01-14' },
    { id: 4, action: 'Added to wishlist', item: 'Antique Mirror Frame', date: '2024-01-13' }
  ];

  const preferences = {
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      requestUpdates: true,
      newItemAlerts: false,
      sellerMessages: true
    },
    privacy: {
      showLocationInProfile: true,
      showPurchaseHistory: false,
      allowSellerContact: true
    }
  };

  const [settings, setSettings] = useState(preferences);

  const handleEdit = () => {
    setEditingData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData({ ...editingData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditingData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleImageUpload = () => {
    alert('Image upload functionality would be implemented here');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        {/* Profile Info Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="card-title">Profile Information</h2>
            {!isEditing ? (
              <button className="edit-btn" onClick={handleEdit}>
                <Edit size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  <Save size={16} />
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-image-section">
              <div className="profile-image">
                <img src={profileData.profileImage} alt="Profile" />
                {isEditing && (
                  <button className="upload-image-btn" onClick={handleImageUpload}>
                    <Camera size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="profile-fields">
              <div className="field-group">
                <label className="field-label">
                  <User size={16} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-value">{profileData.name}</p>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">
                  <Mail size={16} />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-value">{profileData.email}</p>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">
                  <Phone size={16} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-value">{profileData.phone}</p>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">
                  <MapPin size={16} />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="field-input"
                  />
                ) : (
                  <p className="field-value">{profileData.location}</p>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editingData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="field-textarea"
                    rows="3"
                  />
                ) : (
                  <p className="field-value">{profileData.bio}</p>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">Member Since</label>
                <p className="field-value">{formatDate(profileData.joinDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="profile-card">
          <h2 className="card-title">Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.totalRequests}</div>
              <div className="stat-label">Total Requests</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.completedPurchases}</div>
              <div className="stat-label">Completed Purchases</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <Star size={16} className="star-icon" />
                {stats.averageRating}
              </div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.memberSince}</div>
              <div className="stat-label">Member Since</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="profile-card">
          <h2 className="card-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-item-name">{activity.item}</p>
                </div>
                <p className="activity-date">{formatDate(activity.date)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="profile-card">
          <h2 className="card-title">
            <Shield size={20} />
            Privacy & Notifications
          </h2>
          
          <div className="settings-section">
            <h3 className="settings-title">Notification Preferences</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Email Notifications</label>
                  <p className="setting-description">Receive updates via email</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Push Notifications</label>
                  <p className="setting-description">Receive notifications on your device</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Request Updates</label>
                  <p className="setting-description">Get notified about request status changes</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.requestUpdates}
                    onChange={(e) => handleSettingChange('notifications', 'requestUpdates', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">New Item Alerts</label>
                  <p className="setting-description">Be notified when new items match your interests</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newItemAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'newItemAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-title">Privacy Settings</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Show Location in Profile</label>
                  <p className="setting-description">Allow sellers to see your general location</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showLocationInProfile}
                    onChange={(e) => handleSettingChange('privacy', 'showLocationInProfile', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Show Purchase History</label>
                  <p className="setting-description">Make your purchase history visible to sellers</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showPurchaseHistory}
                    onChange={(e) => handleSettingChange('privacy', 'showPurchaseHistory', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Allow Seller Contact</label>
                  <p className="setting-description">Let sellers contact you directly about items</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.privacy.allowSellerContact}
                    onChange={(e) => handleSettingChange('privacy', 'allowSellerContact', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;