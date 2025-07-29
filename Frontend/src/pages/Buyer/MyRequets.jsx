import { useState } from 'react'

const MyRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      itemName: 'Vintage Ceramic Vase',
      itemImage: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Sarah M.',
      price: 25,
      status: 'pending',
      requestDate: '2025-01-15',
      message: 'Hi, I\'m interested in this beautiful vase for my living room.'
    },
    {
      id: 2,
      itemName: 'Handmade Wall Clock',
      itemImage: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Mike R.',
      price: 45,
      status: 'approved',
      requestDate: '2025-01-12',
      message: 'Perfect for my home office. When can I pick it up?'
    },
    {
      id: 3,
      itemName: 'Rustic Picture Frame',
      itemImage: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Emma K.',
      price: 18,
      status: 'completed',
      requestDate: '2025-01-10',
      message: 'Love the rustic look! Great for my gallery wall.'
    },
    {
      id: 4,
      itemName: 'Modern Table Lamp',
      itemImage: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'David L.',
      price: 65,
      status: 'rejected',
      requestDate: '2025-01-08',
      message: 'Looking for a reading lamp for my bedroom.'
    },
    {
      id: 5,
      itemName: 'Antique Mirror',
      itemImage: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Robert S.',
      price: 120,
      status: 'pending',
      requestDate: '2025-01-14',
      message: 'This would be perfect for my hallway entrance.'
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState('all')

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800'
  }

  const statusIcons = {
    pending: '⏳',
    approved: '✅',
    completed: '🎉',
    rejected: '❌'
  }

  const handleCancelRequest = (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      setRequests(requests.filter(request => request.id !== requestId))
      alert('Request cancelled successfully!')
    }
  }

  const handleMessageSeller = (requestId) => {
    alert(`Opening message thread for request ${requestId}`)
  }

  const handlePayNow = (requestId) => {
    alert(`Redirecting to payment for request ${requestId}`)
  }

  const filteredRequests = selectedStatus === 'all' 
    ? requests 
    : requests.filter(request => request.status === selectedStatus)

  const getStatusCount = (status) => {
    return requests.filter(request => request.status === status).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          My Requests
        </h1>
        <div className="text-sm text-gray-600">
          Total: {requests.length} requests
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">⏳</div>
          <div className="text-xl font-bold text-gray-800">{getStatusCount('pending')}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-xl font-bold text-gray-800">{getStatusCount('approved')}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-xl font-bold text-gray-800">{getStatusCount('completed')}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">❌</div>
          <div className="text-xl font-bold text-gray-800">{getStatusCount('rejected')}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filter */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedStatus === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({requests.length})
          </button>
          {['pending', 'approved', 'completed', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors duration-200 ${
                selectedStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status} ({getStatusCount(status)})
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Item Image */}
              <div className="w-full md:w-32 h-32 flex-shrink-0">
                <img
                  src={request.itemImage}
                  alt={request.itemName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Request Details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {request.itemName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Seller: {request.seller} • Requested on {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
                      {statusIcons[request.status]} {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">${request.price}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Your message:</strong> {request.message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleMessageSeller(request.id)}
                        className="btn-secondary text-sm"
                      >
                        Message Seller
                      </button>
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                      >
                        Cancel Request
                      </button>
                    </>
                  )}
                  
                  {request.status === 'approved' && (
                    <>
                      <button
                        onClick={() => handlePayNow(request.id)}
                        className="btn-primary text-sm"
                      >
                        Pay Now
                      </button>
                      <button
                        onClick={() => handleMessageSeller(request.id)}
                        className="btn-secondary text-sm"
                      >
                        Message Seller
                      </button>
                    </>
                  )}
                  
                  {request.status === 'completed' && (
                    <button className="btn-secondary text-sm">
                      View Receipt
                    </button>
                  )}
                  
                  {request.status === 'rejected' && (
                    <button
                      onClick={() => handleMessageSeller(request.id)}
                      className="btn-secondary text-sm"
                    >
                      Contact Seller
                    </button>
                  )}
                  
                  <button
                    onClick={() => alert(`Viewing full details for ${request.itemName}`)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No requests found</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all' 
              ? "You haven't made any requests yet. Start browsing items to make your first request!"
              : `No ${selectedStatus} requests found. Try selecting a different status.`
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default MyRequests