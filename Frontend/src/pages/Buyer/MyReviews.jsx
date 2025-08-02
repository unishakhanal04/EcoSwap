import React, { useState, useEffect } from 'react';
import { Star, Loader2, AlertCircle, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { reviewAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });
  const [editingReview, setEditingReview] = useState(null);
  const [editData, setEditData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getUserReviews({ type: 'given' });
      const reviewsData = response.data.reviews || [];
      setReviews(reviewsData);
      
      const totalReviews = reviewsData.length;
      const averageRating = totalReviews > 0 
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
      
      setStats({ totalReviews, averageRating: averageRating.toFixed(1) });
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review.id);
    setEditData({ rating: review.rating, comment: review.comment || '' });
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      await reviewAPI.updateReview(reviewId, editData);
      toast.success('Review updated successfully!');
      setEditingReview(null);
      fetchMyReviews();
    } catch (err) {
      console.error('Error updating review:', err);
      toast.error('Failed to update review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewAPI.deleteReview(reviewId);
        toast.success('Review deleted successfully!');
        fetchMyReviews();
      } catch (err) {
        console.error('Error deleting review:', err);
        toast.error('Failed to delete review. Please try again.');
      }
    }
  };

  const getSellerName = (seller) => {
    return seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller.email : 'Unknown Seller';
  };

  const getProductName = (product) => {
    return product?.title || 'Product no longer available';
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive && onChange ? () => onChange(index + 1) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Loading your reviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={fetchMyReviews}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#007f66]">My Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.totalReviews}</div>
          <div className="text-gray-600">Total Reviews Given</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.averageRating}</div>
          <div className="text-gray-600">Average Rating Given</div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400">Your reviews will appear here after you submit them</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition duration-200"
            >
              {editingReview === review.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center space-x-1">
                      {renderStars(editData.rating, true, (rating) => setEditData({...editData, rating}))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={editData.comment}
                      onChange={(e) => setEditData({...editData, comment: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      rows="3"
                      placeholder="Write your review..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveEdit(review.id)}
                      className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{getSellerName(review.seller)}</h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {review.reviewType === 'product' ? 'Product: ' : 'Seller: '}
                        <span className="text-black">{getProductName(review.Product)}</span>
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="Edit review"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                  </div>

                  {review.comment && (
                    <p className="text-gray-700 mb-2">"{review.comment}"</p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review.reviewType === 'product' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {review.reviewType === 'product' ? 'Product Review' : 'Seller Review'}
                    </span>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;