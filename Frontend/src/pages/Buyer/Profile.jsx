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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          My Profile
        </h1>
        <div className="flex space-x-3">
          {!isEditing ? (
            <button onClick={handleEdit} className="btn-primary">
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} className="btn-primary">
                Save Changes
              </button>
              <button onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800">{profile.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800">{profile.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800">{profile.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800">{profile.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800">{profile.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800">{profile.state}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={tempProfile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Shopping Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interested Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={tempProfile.preferences.categories.includes(category.id)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...tempProfile.preferences.categories, category.id]
                            : tempProfile.preferences.categories.filter(c => c !== category.id)
                          handlePreferenceChange('categories', newCategories)
                        }}
                        disabled={!isEditing}
                        className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                      />
                      <span className="text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                {isEditing ? (
                  <select
                    value={tempProfile.preferences.priceRange}
                    onChange={(e) => handlePreferenceChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  >
                    <option value="0-50">$0 - $50</option>
                    <option value="0-100">$0 - $100</option>
                    <option value="0-200">$0 - $200</option>
                    <option value="100+">$100+</option>
                  </select>
                ) : (
                  <p className="text-gray-800">${tempProfile.preferences.priceRange}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempProfile.preferences.notifications.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via text message</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempProfile.preferences.notifications.sms}
                    onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">New Items</h3>
                  <p className="text-sm text-gray-600">Get notified when new items match your preferences</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempProfile.preferences.notifications.newItems}
                    onChange={(e) => handleNotificationChange('newItems', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Request Updates</h3>
                  <p className="text-sm text-gray-600">Get notified about your request status changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempProfile.preferences.notifications.requestUpdates}
                    onChange={(e) => handleNotificationChange('requestUpdates', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="card p-6 text-center">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            <div className="text-sm text-gray-500">
              Member since {new Date(profile.joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </div>
          </div>

          {/* Account Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => alert('Opening change password dialog...')}
                className="w-full btn-secondary text-left flex items-center"
              >
                <span className="mr-2">🔒</span>
                Change Password
              </button>
              <button 
                onClick={() => alert('Opening email update form...')}
                className="w-full btn-secondary text-left flex items-center"
              >
                <span className="mr-2">📧</span>
                Update Email
              </button>
              <button 
                onClick={() => alert('Sending verification SMS...')}
                className="w-full btn-secondary text-left flex items-center"
              >
                <span className="mr-2">📱</span>
                Verify Phone Number
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    alert('Account deletion process initiated...')
                  }
                }}
                className="w-full text-red-600 bg-red-50 hover:bg-red-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-left flex items-center"
              >
                <span className="mr-2">🗑️</span>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile