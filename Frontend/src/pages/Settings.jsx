import React, { useState } from 'react';
import { User, CreditCard, Shield, Bell, HelpCircle, LogOut } from 'lucide-react';
import Card from '../components/Seller/common/Card.jsx';
import Button from '../components/Seller/common/Button.jsx';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Anytown, ST 12345',
    bio: 'Passionate collector and seller of unique home decor items. Specializing in vintage and handcrafted pieces.',
    storeName: 'John\'s Vintage Decor',
    storeDescription: 'Curated collection of beautiful home decorative items'
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Handle profile update logic
    console.log('Profile updated:', profileData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  const renderProfileTab = () => (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={profileData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Store Name
          </label>
          <input
            type="text"
            name="storeName"
            value={profileData.storeName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Address
        </label>
        <textarea
          name="address"
          value={profileData.address}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={profileData.bio}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell buyers about yourself and your store..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Store Description
        </label>
        <textarea
          name="storeDescription"
          value={profileData.storeDescription}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your store and what makes it special..."
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Payment Information</h4>
        <p className="text-sm text-blue-700">Manage your payment methods and payout preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bank Account
          </label>
          <div className="p-4 border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-600">****1234</p>
            <p className="text-sm text-slate-500">Chase Bank</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            PayPal Account
          </label>
          <div className="p-4 border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-600">john.doe@email.com</p>
            <p className="text-sm text-slate-500">Verified</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-slate-900 mb-4">Payout Schedule</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="radio" name="payout" value="weekly" className="mr-3" defaultChecked />
            <span className="text-sm text-slate-700">Weekly (Every Monday)</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="payout" value="monthly" className="mr-3" />
            <span className="text-sm text-slate-700">Monthly (1st of each month)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Update Payment Settings</Button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Security Settings</h4>
        <p className="text-sm text-yellow-700">Keep your account secure with these settings.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium text-slate-900 mb-4">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="font-medium text-slate-900">Enable 2FA</p>
            <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
          </div>
          <Button variant="outline">Enable 2FA</Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Update Password</Button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Notification Preferences</h4>
        <p className="text-sm text-green-700">Choose how you want to be notified about activity.</p>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Order Notifications', desc: 'Get notified when you receive new orders' },
          { title: 'System Updates', desc: 'Receive notifications about policy changes' },
          { title: 'Performance Alerts', desc: 'Get notified about sales milestones' },
          { title: 'Email Notifications', desc: 'Receive email notifications for important updates' }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHelpTab = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-2">Need Help?</h4>
        <p className="text-sm text-purple-700">Find answers to common questions or contact support.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Quick Links</h4>
          <div className="space-y-2">
            <a href="#" className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <h5 className="font-medium text-slate-900">Seller Guidelines</h5>
              <p className="text-sm text-slate-600">Learn about our policies and best practices</p>
            </a>
            <a href="#" className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <h5 className="font-medium text-slate-900">FAQ</h5>
              <p className="text-sm text-slate-600">Find answers to frequently asked questions</p>
            </a>
            <a href="#" className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <h5 className="font-medium text-slate-900">Contact Support</h5>
              <p className="text-sm text-slate-600">Get help from our support team</p>
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Account Actions</h4>
          <div className="space-y-2">
            <button className="w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
              <h5 className="font-medium text-slate-900">Export Data</h5>
              <p className="text-sm text-slate-600">Download your account data</p>
            </button>
            <button className="w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
              <h5 className="font-medium text-slate-900">Deactivate Account</h5>
              <p className="text-sm text-slate-600">Temporarily disable your account</p>
            </button>
            <button className="w-full p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left">
              <h5 className="font-medium text-red-900">Delete Account</h5>
              <p className="text-sm text-red-600">Permanently delete your account</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'payment': return renderPaymentTab();
      case 'security': return renderSecurityTab();
      case 'notifications': return renderNotificationsTab();
      case 'help': return renderHelpTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Settings" subtitle="Manage your account and preferences">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;