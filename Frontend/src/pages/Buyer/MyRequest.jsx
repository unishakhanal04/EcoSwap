import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, MessageCircle, Eye, Calendar, Package } from 'lucide-react';
import './MyRequests.css';

const MyRequests = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([
    {
      id: 1,
      itemName: 'Vintage Ceramic Vase',
      itemImage: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Sarah Chen',
      sellerLocation: 'San Francisco, CA',
      price: 85,
      status: 'approved',
      requestDate: '2024-01-15',
      responseDate: '2024-01-16',
      message: 'Great choice! This vase is in excellent condition. When would you like to pick it up?',
      hasUnreadMessage: true
    },
    {
      id: 2,
      itemName: 'Mid-Century Coffee Table',
      itemImage: 'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Mike Johnson',
      sellerLocation: 'Portland, OR',
      price: 120,
      status: 'pending',
      requestDate: '2024-01-14',
      responseDate: null,
      message: 'Hi! I\'m interested in this beautiful coffee table. Is it still available?',
      hasUnreadMessage: false
    },
    {
      id: 3,
      itemName: 'Handwoven Wall Hanging',
      itemImage: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Luna Martinez',
      sellerLocation: 'Denver, CO',
      price: 65,
      status: 'rejected',
      requestDate: '2024-01-12',
      responseDate: '2024-01-13',
      message: 'Thank you for your interest. Unfortunately, this item has been sold to another buyer.',
      hasUnreadMessage: false
    },
    {
      id: 4,
      itemName: 'Antique Mirror Frame',
      itemImage: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Robert Kim',
      sellerLocation: 'Seattle, WA',
      price: 95,
      status: 'completed',
      requestDate: '2024-01-10',
      responseDate: '2024-01-11',
      message: 'Transaction completed successfully! Hope you love your new mirror!',
      hasUnreadMessage: false
    },
    {
      id: 5,
      itemName: 'Ceramic Plant Pot Set',
      itemImage: 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Emma Davis',
      sellerLocation: 'Austin, TX',
      price: 35,
      status: 'pending',
      requestDate: '2024-01-16',
      responseDate: null,
      message: 'Hello! I love these plant pots. Are they still available for pickup?',
      hasUnreadMessage: false
    }
  ]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: '#f59e0b',
        bgColor: '#fef3c7',
        text: 'Pending'
      },
      approved: {
        icon: CheckCircle,
        color: '#22c55e',
        bgColor: '#dcfce7',
        text: 'Approved'
      },
      rejected: {
        icon: XCircle,
        color: '#ef4444',
        bgColor: '#fee2e2',
        text: 'Rejected'
      },
      completed: {
        icon: Package,
        color: '#007f66',
        bgColor: '#f0fdf4',
        text: 'Completed'
      }
    };
    return configs[status];
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });

  const getStatusCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      completed: requests.filter(r => r.status === 'completed').length
    };
  };

  const statusCounts = getStatusCounts();

  const handleMessageClick = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    alert(`Opening message thread with ${request.seller} about ${request.itemName}`);
    
    // Mark as read
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, hasUnreadMessage: false }
        : req
    ));
  };

  const handleViewItem = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    alert(`Viewing detailed information for ${request.itemName}`);
  };

  const handleCancelRequest = (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      setRequests(prev => prev.filter(req => req.id !== requestId));
      alert('Request cancelled successfully!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="my-requests">
      <div className="requests-header">
        <h1 className="requests-title">My Requests</h1>
        <p className="requests-subtitle">Track your item requests and communicate with sellers</p>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Requests
          <span className="tab-count">{statusCounts.all}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
          <span className="tab-count">{statusCounts.pending}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved
          <span className="tab-count">{statusCounts.approved}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
          <span className="tab-count">{statusCounts.completed}</span>
        </button>
      </div>

      {/* Requests List */}
      <div className="requests-list">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <Package size={48} />
            <h3>No requests found</h3>
            <p>
              {activeTab === 'all' 
                ? "You haven't made any requests yet. Start browsing items to find something you love!"
                : `No ${activeTab} requests found.`
              }
            </p>
          </div>
        ) : (
          filteredRequests.map(request => {
            const statusConfig = getStatusConfig(request.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={request.id} className="request-card">
                <div className="request-image">
                  <img src={request.itemImage} alt={request.itemName} />
                </div>

                <div className="request-details">
                  <div className="request-header">
                    <div className="item-info">
                      <h3 className="item-name">{request.itemName}</h3>
                      <p className="item-price">${request.price}</p>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ 
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.color 
                      }}
                    >
                      <StatusIcon size={16} />
                      {statusConfig.text}
                    </div>
                  </div>

                  <div className="seller-info">
                    <p className="seller-name">Seller: {request.seller}</p>
                    <p className="seller-location">{request.sellerLocation}</p>
                  </div>

                  <div className="request-dates">
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>Requested: {formatDate(request.requestDate)}</span>
                    </div>
                    {request.responseDate && (
                      <div className="date-info">
                        <Clock size={14} />
                        <span>Responded: {formatDate(request.responseDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="last-message">
                    <p className="message-text">{request.message}</p>
                    {request.hasUnreadMessage && (
                      <span className="unread-indicator">New message</span>
                    )}
                  </div>
                </div>

                <div className="request-actions">
                  <button 
                    className="action-btn message-btn"
                    onClick={() => handleMessageClick(request.id)}
                  >
                    <MessageCircle size={16} />
                    {request.hasUnreadMessage ? 'New Message' : 'Message'}
                  </button>
                  
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewItem(request.id)}
                  >
                    <Eye size={16} />
                    View Item
                  </button>

                  {request.status === 'pending' && (
                    <button 
                      className="action-btn cancel-btn"
                      onClick={() => handleCancelRequest(request.id)}
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyRequests;