import React, { useState } from 'react';

const MyOrder = () => {
  const [reviews, setReviews] = useState({});

  // Dummy data for received items
  const receivedItems = [
    {
      id: 1,
      name: 'Product A',
      image: 'https://via.placeholder.com/150/007f66/FFFFFF?text=ProductA',
      description: 'A fantastic product that you will love.',
      price: 'Rs. 1,200',
    },
    {
      id: 2,
      name: 'Product B',
      image: 'https://via.placeholder.com/150/007f66/FFFFFF?text=ProductB',
      description: 'High-quality item with great features.',
      price: 'Rs. 750',
    },
    {
      id: 3,
      name: 'Product C',
      image: 'https://via.placeholder.com/150/007f66/FFFFFF?text=ProductC',
      description: 'Durable and efficient for everyday use.',
      "price": 'Rs. 2,500',
    },
  ];

  const handleReviewChange = (itemId, e) => {
    setReviews({
      ...reviews,
      [itemId]: e.target.value,
    });
  };

  const handleSubmitReview = (itemId) => {
    alert(`Review for Product ${itemId}: "${reviews[itemId]}" submitted!`);
    // In a real application, you would send this data to your backend
    setReviews({
      ...reviews,
      [itemId]: '', // Clear the review field after submission
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: '#007f66' }}>
        My Received Items
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {receivedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 flex-grow">
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#007f66' }}>
                {item.name}
              </h2>
              <p className="text-gray-700 mb-3">{item.description}</p>
              <p className="text-lg font-bold text-gray-800">{item.price}</p>
            </div>
            <div className="p-5 border-t border-gray-200">
              <label htmlFor={`review-${item.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                You have received your item, please review:
              </label>
              <textarea
                id={`review-${item.id}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 resize-none"
                rows="3"
                placeholder="Write your review here..."
                value={reviews[item.id] || ''}
                onChange={(e) => handleReviewChange(item.id, e)}
              ></textarea>
              <button
                onClick={() => handleSubmitReview(item.id)}
                className="w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                style={{ backgroundColor: '#007f66' }}
              >
                Submit Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrder;