import { useState } from 'react'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    bio: 'I love finding unique home decor pieces that add character to my space. Passionate about sustainable living and giving pre-loved items a new home.',
    joinDate: '2024-03-15',
    preferences: {
      categories: ['decor', 'furniture', 'lighting'],
      priceRange: '0-100',
      notifications: {
        email: true,
        sms: false,
        newItems: true,
        requestUpdates: true,
        marketingEmails: false
      }
    }
  })

  const [tempProfile, setTempProfile] = useState({ ...profile })

  const handleEdit = () => {
    setIsEditing(true)
    setTempProfile({ ...profile })
  }

  const handleSave = () => {
    setProfile(tempProfile)
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setTempProfile({ ...profile })
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePreferenceChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }

  const handleNotificationChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [field]: value
        }
      }
    }))
  }

  const categories = [
    { id: 'decor', name: 'Home Decor' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'storage', name: 'Storage' },
    { id: 'textiles', name: 'Textiles' }
  ]

  const inputClass = "w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition"

  const buttonClass = "px-4 py-2 rounded-lg font-medium transition"
  const primaryBtn = `${buttonClass} bg-primary-600 text-white hover:bg-primary-700`
  const secondaryBtn = `${buttonClass} bg-gray-100 text-gray-800 hover:bg-gray-200`
  const dangerBtn = `${buttonClass} bg-red-100 text-red-600 hover:bg-red-200`

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">My Profile</h1>
        <div className="flex space-x-3">
          {!isEditing ? (
            <button onClick={handleEdit} className={primaryBtn}>
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} className={primaryBtn}>
                ✅ Save Changes
              </button>
              <button onClick={handleCancel} className={secondaryBtn}>
                ❌ Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Info */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">👤 Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ['firstName', 'First Name'],
                ['lastName', 'Last Name'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['address', 'Address'],
                ['city', 'City'],
                ['state', 'State']
              ].map(([key, label]) => (
                <div key={key} className={key === 'address' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile[key]}
                      onChange={e => handleInputChange(key, e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <p className="text-gray-800">{profile[key]}</p>
                  )}
                </div>
              ))}

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={tempProfile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-gray-800">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">🛍️ Shopping Preferences</h2>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Interested Categories</label>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      checked={tempProfile.preferences.categories.includes(category.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...tempProfile.preferences.categories, category.id]
                          : tempProfile.preferences.categories.filter(c => c !== category.id)
                        handlePreferenceChange('categories', updated)
                      }}
                      className="accent-primary-600"
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              {isEditing ? (
                <select
                  value={tempProfile.preferences.priceRange}
                  onChange={(e) => handlePreferenceChange('priceRange', e.target.value)}
                  className={inputClass}
                >
                  <option value="0-50">$0 - $50</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="0-200">$0 - $200</option>
                  <option value="100+">$100+</option>
                </select>
              ) : (
                <p className="text-gray-800">${profile.preferences.priceRange}</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">🔔 Notification Settings</h2>
            <div className="space-y-4">
              {Object.entries(profile.preferences.notifications).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-sm text-gray-600">
                      {key === 'newItems'
                        ? 'Get notified when new items match your preferences'
                        : key === 'requestUpdates'
                        ? 'Get updates about your request status'
                        : `Receive via ${key}`}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-6 h-6 accent-primary-600"
                    disabled={!isEditing}
                    checked={tempProfile.preferences.notifications[key]}
                    onChange={(e) => handleNotificationChange(key, e.target.checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white shadow-xl rounded-xl p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary-600 text-white flex items-center justify-center text-3xl font-bold shadow-md mb-4">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h3>
            <p className="text-gray-600 mb-2">{profile.email}</p>
            <p className="text-sm text-gray-500">Member since {new Date(profile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          </div>

          {/* Account Actions */}
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Account Actions</h3>
            <div className="space-y-3">
              <button onClick={() => alert('Opening change password dialog...')} className={secondaryBtn + " w-full text-left"}>
                🔒 Change Password
              </button>
              <button onClick={() => alert('Opening email update form...')} className={secondaryBtn + " w-full text-left"}>
                📧 Update Email
              </button>
              <button onClick={() => alert('Sending verification SMS...')} className={secondaryBtn + " w-full text-left"}>
                📱 Verify Phone Number
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    alert('Account deletion process initiated...')
                  }
                }}
                className={dangerBtn + " w-full text-left"}
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
