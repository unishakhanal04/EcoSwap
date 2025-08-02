import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import { productAPI, requestAPI } from '../../services/api';

const BrowseItems = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchItems();
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

  const toggleWishlist = (item) => {
    const isInWishlist = wishlist.some(wishItem => wishItem.id === item.id);
    let newWishlist;
    
    if (isInWishlist) {
      newWishlist = wishlist.filter(wishItem => wishItem.id !== item.id);
      toast.success('Removed from wishlist');
    } else {
      newWishlist = [...wishlist, item];
      toast.success('Added to wishlist');
    }
    
    setWishlist(newWishlist);
    saveWishlistToStorage(newWishlist);
  };

  const isInWishlist = (itemId) => {
    return wishlist.some(wishItem => wishItem.id === itemId);
  };

  useEffect(() => {
    const filtered = recentItems.filter(item =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${item.seller?.firstName} ${item.seller?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [recentItems, searchTerm]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts();
      
      if (response.data.products) {
        setRecentItems(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };



  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // To store which item is being requested
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    pickupAddress: '',
    requestedPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestItemClick = (item) => {
    setSelectedItem(item); // Set the item being requested
    setShowRequestPopup(true); // Open the popup
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        itemName: selectedItem.title,
        message: formData.field2,
        pickupAddress: formData.pickupAddress,
        sellerId: selectedItem.sellerId,
        requestedPrice: formData.requestedPrice ? parseFloat(formData.requestedPrice) : selectedItem.price
      };
      
      console.log('Submitting request with data:', requestData);
      
      const response = await requestAPI.createRequest(requestData);
      
      if (response.data.success) {
        toast.success(`Request for ${selectedItem.title} submitted successfully!`);
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
        <h2 className="text-xl font-bold text-gray-800">Recently Added Items</h2>
        <button className="text-[#007f66] hover:underline font-medium">
          View All →
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007f66] focus:border-[#007f66]"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-xl shadow animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
          <div key={item.id} className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition relative">
            <button
              onClick={() => toggleWishlist(item)}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
            >
              <Heart
                size={20}
                className={`transition-colors ${
                  isInWishlist(item.id)
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-400 hover:text-red-500'
                }`}
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
            <p className="text-sm text-gray-600 mb-2">By {item.seller ? `${item.seller.firstName} ${item.seller.lastName}` : 'Unknown Seller'}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#007f66]">${item.price}</span>
              <button
                onClick={() => handleRequestItemClick(item)} // Now passes the item to the handler
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
        ))}
        </div>
      )}

      {showRequestPopup && selectedItem && ( // Only show if popup is true and an item is selected
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
                  onClick={() => { setShowRequestPopup(false); setSelectedItem(null); setFormData({ field1: '', field2: '', pickupAddress: '', requestedPrice: '' }); }} // Reset on cancel
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

export default BrowseItems;