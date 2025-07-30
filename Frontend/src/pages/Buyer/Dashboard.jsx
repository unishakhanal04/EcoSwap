import { useState, useEffect } from 'react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 12,
    pendingRequests: 5,
    completedPurchases: 7,
    savedItems: 23
  })

  const [recentItems, setRecentItems] = useState([
    {
      id: 1,
      name: 'Vintage Ceramic Vase',
      price: 25,
      image: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Sarah M.',
      status: 'available'
    },
    {
      id: 2,
      name: 'Handmade Wall Clock',
      price: 45,
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Mike R.',
      status: 'available'
    },
    {
      id: 3,
      name: 'Rustic Picture Frame',
      price: 18,
      image: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Emma K.',
      status: 'available'
    }
  ])

  const handleRequestItem = (itemId) => {
    alert(`Request sent for item ${itemId}!`)
    setStats(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      pendingRequests: prev.pendingRequests + 1
    }))
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-[#007f66] rounded-xl p-6 text-white shadow-md">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
        <p className="opacity-90">Discover unique home decor items and make sustainable choices.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completedPurchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">❤️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Saved Items</p>
              <p className="text-2xl font-bold text-gray-800">{stats.savedItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recently Added Items</h2>
          <button className="text-[#007f66] hover:underline font-medium">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentItems.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">By {item.seller}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#007f66]">${item.price}</span>
                <button
                  onClick={() => handleRequestItem(item.id)}
                  className="bg-[#007f66] hover:bg-[#006652] text-white text-sm px-4 py-1 rounded-md transition"
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions and Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => alert('Navigating to Browse Items...')}
              className="w-full bg-[#007f66] text-white py-2 px-4 rounded-md hover:bg-[#006652] flex items-center justify-start transition"
            >
              <span className="mr-2">🔍</span>
              Browse New Items
            </button>
            <button 
              onClick={() => alert('Navigating to My Requests...')}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex items-center justify-start transition"
            >
              <span className="mr-2">📋</span>
              View My Requests
            </button>
            <button 
              onClick={() => alert('Navigating to Profile...')}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex items-center justify-start transition"
            >
              <span className="mr-2">⚙️</span>
              Update Profile
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Request approved for Vintage Mirror</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>New item saved: Modern Table Lamp</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span>Request pending for Garden Planter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
