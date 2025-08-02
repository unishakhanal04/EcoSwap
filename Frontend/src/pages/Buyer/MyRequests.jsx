import React, { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { requestAPI, reviewAPI } from '../../services/api';
import { Star } from 'lucide-react';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getBuyerRequests();
      if (response.data.success) {
        setRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      const response = await requestAPI.deleteRequest(id);
      if (response.data.success) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
        toast.success('Request cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    }
  };

  const handleReviewClick = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!reviewData.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      const response = await reviewAPI.createReview({
        requestId: selectedRequest.id,
        sellerId: selectedRequest.sellerId,
        productName: selectedRequest.itemName,
        rating: reviewData.rating,
        comment: reviewData.comment.trim(),
        reviewType: 'seller'
      });
      
      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setRequests((prev) => 
          prev.map((req) => 
            req.id === selectedRequest.id 
              ? { ...req, hasReviewed: true } 
              : req
          )
        );
        setShowReviewModal(false);
        setSelectedRequest(null);
        setReviewData({ rating: 0, comment: '' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const handleStarClick = (rating) => {
    setReviewData(prev => ({ ...prev, rating }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#007f66] text-center">
        My Requests
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007f66]"></div>
        </div>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 text-center mb-8">No requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition"
            >
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{req.itemName}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Seller: {req.sellerName}</p>
                <p className="text-sm text-gray-600">
                  Requested on: {new Date(req.requestedDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Address: {req.address}</p>
                {req.message && (
                  <p className="text-sm text-gray-600 mt-2">Message: {req.message}</p>
                )}
                {req.requestedPrice && (
                  <p className="text-sm text-gray-600">Requested Price: Rs. {req.requestedPrice}</p>
                )}
                {req.approvedPrice && (
                  <p className="text-sm text-green-600 font-medium">Approved Price: Rs. {req.approvedPrice}</p>
                )}
              </div>
              <div className="flex gap-2">
                {req.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(req.id)}
                    className="bg-red-100 text-red-600 font-medium px-4 py-2 rounded-md hover:bg-red-200 text-sm"
                  >
                    Cancel Request
                  </button>
                )}
                {req.status === 'approved' && !req.hasReviewed && (
                  <button
                    onClick={() => handleReviewClick(req)}
                    className="bg-[#007f66] text-white font-medium px-4 py-2 rounded-md hover:bg-[#006b59] text-sm"
                  >
                    Write Review
                  </button>
                )}
                {req.status === 'approved' && req.hasReviewed && (
                  <span className="text-green-600 text-sm font-medium px-4 py-2">
                    ✓ Reviewed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Review for {selectedRequest.itemName}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Seller: {selectedRequest.sellerName}
            </p>
            
            <form onSubmit={handleReviewSubmit}>
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewData.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Comment
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007f66] resize-none"
                  rows="4"
                  placeholder="Write your review here..."
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedRequest(null);
                    setReviewData({ rating: 0, comment: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#007f66] text-white rounded-md hover:bg-[#006b59]"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyRequests;
