import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Heart, Trash2 } from 'lucide-react';
import { requestAPI } from '../../services/api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    pickupAddress: '',
    requestedPrice: '',
  });

  useEffect(() => {
    loadWishlistFromStorage();
  }, []);

  const loadWishlistFromStorage = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const saveWishlistToStorage = (newWishlist) => {
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const removeFromWishlist = (itemId) => {
    const newWishlist = wishlist.filter(item => item.id !== itemId);
    setWishlist(newWishlist);
    saveWishlistToStorage(newWishlist);
    toast.success('Removed from wishlist');
  };

  const handleRequestItemClick = (item) => {
    setSelectedItem(item);
    setFormData({
      field1: '',
      field2: '',
      pickupAddress: '',
      requestedPrice: item.price.toString(),
    });
    setShowRequestPopup(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const requestData = {
        itemName: selectedItem.title,
        message: formData.field2,
        pickupAddress: formData.pickupAddress,
        sellerId: selectedItem.sellerId,
        requestedPrice: formData.requestedPrice || selectedItem.price
      };

      const response = await requestAPI.createRequest(requestData);
      
      if (response.success) {
        toast.success('Request submitted successfully!');
        setShowRequestPopup(false);
        setFormData({
          field1: '',
          field2: '',
          pickupAddress: '',
          requestedPrice: '',
        });
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Wishlist</h2>
        <span className="text-sm text-gray-600">{wishlist.length} items</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-400">Start adding items to your wishlist by clicking the heart icon on products you like!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition relative">
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:bg-red-50"
                title="Remove from wishlist"
              >
                <Trash2
                  size={18}
                  className="text-red-500 hover:text-red-600"
                />
              </button>
              <img
                src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : '/api/placeholder/300/200'}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = '/api/placeholder/300/200';
                }}
              />
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                By {item.seller ? `${item.seller.firstName} ${item.seller.lastName}` : 'Unknown Seller'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#007f66]">${item.price}</span>
                <button
                  onClick={() => handleRequestItemClick(item)}
                  className="bg-[#007f66] text-white px-4 py-2 rounded-md hover:bg-[#006b57] transition-colors"
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRequestPopup && selectedItem && (
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
                { label: `Requested Price (Default: $${selectedItem.price})`, name: 'requestedPrice', type: 'number' },
              ].map(({ label, name, type = 'text' }) => (
                <div key={name} style={{ marginBottom: '15px' }}>
                  <label
                    htmlFor={name}
                    style={{ display: 'block', marginBottom: '5px', color: '#007f66', fontWeight: 500 }}
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    placeholder={name === 'requestedPrice' ? `Enter price or leave empty for default ($${selectedItem.price})` : label}
                    value={formData[name]}
                    onChange={handleChange}
                    required={name === 'pickupAddress'}
                    min={name === 'requestedPrice' ? '0' : undefined}
                    step={name === 'requestedPrice' ? '0.01' : undefined}
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
                  onClick={() => {
                    setShowRequestPopup(false);
                    setSelectedItem(null);
                    setFormData({ field1: '', field2: '', pickupAddress: '', requestedPrice: '' });
                  }}
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
  );
};

export default Wishlist;
