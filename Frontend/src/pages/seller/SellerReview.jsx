import React, { useState, useEffect } from 'react';
import { Star, Loader2, AlertCircle, MessageSquare } from 'lucide-react';
import { sellerAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SellerReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });

  useEffect(() => {
    fetchSellerReviews();
  }, []);

  const fetchSellerReviews = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getSellerReviews();
      console.log('API Response:', response);
      
      const reviewsData = response.data?.reviews || [];
      setReviews(reviewsData);
       
      // Calculate review statistics
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

  const getBuyerName = (buyer) => {
    return buyer ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() || buyer.email : 'Anonymous';
  };

  const getProductName = (product) => {
    return product?.title || 'Product no longer available';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Loading reviews...</span>
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
            onClick={fetchSellerReviews}
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
      <h2 className="text-3xl font-bold mb-6 text-center">Customer Reviews</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.totalReviews}</div>
          <div className="text-gray-600">Total Reviews</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.averageRating}</div>
          <div className="text-gray-600">Average Rating</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            {renderStars(Math.round(stats.averageRating))}
          </div>
          <div className="text-gray-600">Star Rating</div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400">Customer reviews will appear here once you start selling</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition duration-200"
            >
              <h3 className="font-semibold text-lg mb-1">{getBuyerName(review.buyer)}</h3>
              <p className="text-sm text-gray-400 mb-2">
                On product: <span className="text-black">{getProductName(review.Product)}</span>
              </p>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerReviewSection;
