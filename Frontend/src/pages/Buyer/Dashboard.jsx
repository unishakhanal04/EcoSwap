import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { productAPI, orderAPI, requestAPI } from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedPurchases: 0,
    savedItems: 0
  })
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsResponse, itemsResponse] = await Promise.all([
        orderAPI.getBuyerStats(),
        productAPI.getRecentProducts()
      ])
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data)
      }
      
      if (itemsResponse.data.success) {
        setRecentItems(itemsResponse.data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestItem = async (itemId) => {
    try {
      const response = await orderAPI.createRequest(itemId, {
        pickupAddress: formData.pickupAddress,
        notes: formData.field1
      })
      
      if (response.data.success) {
        toast.success('Request sent successfully!')
        setStats(prev => ({
          ...prev,
          totalRequests: prev.totalRequests + 1,
          pendingRequests: prev.pendingRequests + 1
        }))
        setShowRequestPopup(false)
        setFormData({ pickupAddress: '', field1: '' })
      }
    } catch (error) {
      console.error('Error sending request:', error)
      toast.error('Failed to send request')
    }
  }

  const [showRequestPopup, setShowRequestPopup] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [formData, setFormData] = useState({
  pickupAddress: '',
  field1: '',
  field2: '',
  field3: '',
  field4: '',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
const handleRequestSubmit = async (e) => {
  e.preventDefault();
  if (!selectedItem) return;
  
  try {
    const response = await requestAPI.createRequest({
      itemName: selectedItem.title || selectedItem.name,
      sellerId: selectedItem.seller?.id || selectedItem.sellerId,
      message: formData.field1,
      pickupAddress: formData.pickupAddress,
      requestedPrice: null
    });
    
    if (response.data.success) {
      toast.success('Request sent successfully!');
      setStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + 1,
        pendingRequests: prev.pendingRequests + 1
      }));
      setShowRequestPopup(false);
      setSelectedItem(null);
      setFormData({ pickupAddress: '', field1: '', field2: '', field3: '', field4: '' });
    }
  } catch (error) {
    console.error('Error sending request:', error);
    toast.error('Failed to send request');
  }
};
const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #007f66',
};



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
          {recentItems.map((item) => {
            console.log('Item data:', item);
             console.log('Item imageUrl:', item.imageUrl);
             console.log('Item images array:', item.images);
             const imageUrl = item.imageUrl ? `http://localhost:5000${item.imageUrl}` : '/api/placeholder/300/200';
             console.log('Final image URL:', imageUrl);
            
            return (
              <div key={item.id} className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
              <img
                src={imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = '/api/placeholder/300/200';
                }}
                onLoad={() => console.log('Image loaded successfully:', imageUrl)}
              />
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">By {item.seller ? `${item.seller.firstName} ${item.seller.lastName}` : 'Unknown Seller'}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#007f66]">${item.price}</span>
                {/* <button
                  onClick={() => handleRequestItem(item.id)}
                  className="bg-[#007f66] hover:bg-[#006652] text-white text-sm px-4 py-1 rounded-md transition"
                >
                  Request
                </button> */}
                <button
  onClick={() => {
    setSelectedItem(item);
    setShowRequestPopup(true);
  }}
  style={{
    backgroundColor: '#007f66',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }}
>
  Request
</button>

              </div>
            </div>
            );
          })}
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
      {showRequestPopup && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: '#fff',
      padding: '40px 30px',
      borderRadius: '12px',
      width: '450px',
      boxShadow: '0 12px 25px rgba(0,0,0,0.3)',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{
        color: '#007f66',
        marginBottom: '25px',
        textAlign: 'center',
        fontWeight: '600'
      }}>
        Request Form
      </h2>

      <form onSubmit={handleRequestSubmit}>
        {[
           { label: 'Name', name: 'field2' },
          { label: 'Pickup Address', name: 'pickupAddress' },
          { label: 'Default Pickup', name: 'field1' },
          
         
        ].map(({ label, name }) => (
          <div key={name} style={{ marginBottom: '15px' }}>
            <label
              htmlFor={name}
              style={{ display: 'block', marginBottom: '5px', color: '#007f66', fontWeight: 500 }}
            >
              {label}
            </label>
            <input
              id={name}
              type="text"
              name={name}
              placeholder={label}
              value={formData[name]}
              onChange={handleChange}
              required={name === 'pickupAddress'}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007f66')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#007f66',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              flex: 1,
              marginRight: '10px'
            }}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setShowRequestPopup(false)}
            style={{
              backgroundColor: '#f0f0f0',
              color: '#555',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              flex: 1,
              marginLeft: '10px'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  )
}

export default Dashboard;
