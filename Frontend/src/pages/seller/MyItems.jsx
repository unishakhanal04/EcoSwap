import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Star,
  Package,
  DollarSign,
  Calendar,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { sellerAPI } from '../../services/api';

const MyItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    price: '',
    description: '',
    condition: '',
    location: '',
    tags: '',
    dimensions: '',
    weight: '',
    material: '',
    color: '',
    brand: '',
    yearMade: ''
  });
  const [editImages, setEditImages] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        window.location.href = '/login';
        return;
      }
      
      const response = await axios.get('http://localhost:5000/api/seller/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success && Array.isArray(response.data.data.products)) {
        setItems(response.data.data.products);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to fetch items');
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditFormData({
      title: item.title || '',
      price: item.price || '',
      description: item.description || '',
      condition: item.condition || '',
      location: item.location || '',
      tags: item.tags || '',
      dimensions: item.dimensions || '',
      weight: item.weight || '',
      material: item.material || '',
      color: item.color || '',
      brand: item.brand || '',
      yearMade: item.yearMade || ''
    });
    setEditImages([]);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }
      
      const formDataToSend = new FormData();
      
      // Add product data
      Object.keys(editFormData).forEach(key => {
        if (editFormData[key] !== '') {
          if (key === 'price') {
            formDataToSend.append(key, parseFloat(editFormData[key]));
          } else if (key === 'yearMade' && editFormData[key]) {
            formDataToSend.append(key, parseInt(editFormData[key]));
          } else {
            formDataToSend.append(key, editFormData[key]);
          }
        }
      });
      
      // Add images if any
      editImages.forEach((image) => {
        if (image.file) {
          formDataToSend.append('images', image.file);
        }
      });
      
      const response = await axios.put(`http://localhost:5000/api/seller/products/${selectedItem.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        alert('Item updated successfully!');
        setShowEditModal(false);
        setEditImages([]);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating item:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to update item');
      }
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login first');
          return;
        }
        
        const response = await axios.delete(`http://localhost:5000/api/seller/products/${itemId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          alert('Item deleted successfully!');
          fetchItems();
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        if (error.response?.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          alert('Failed to delete item');
        }
      }
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = (items || []).filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.datePosted) - new Date(a.datePosted);
      case 'oldest':
        return new Date(a.datePosted) - new Date(b.datePosted);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const stats = {
    total: items.length,
    active: items.filter(item => item.status === 'active').length,
    sold: items.filter(item => item.status === 'sold').length,
    draft: items.filter(item => item.status === 'draft').length,
    totalViews: items.reduce((sum, item) => sum + (item.views || 0), 0),
    totalLikes: items.reduce((sum, item) => sum + (item.likes || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Items</h1>
          <p className="text-gray-600">Manage your listed items and track their performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-emerald-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.sold}</p>
                <p className="text-sm text-gray-600">Sold</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                <p className="text-sm text-gray-600">Drafts</p>
              </div>
            </div>
          </div>
          {/* <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </div> */}
          {/* <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                <p className="text-sm text-gray-600">Total Likes</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg?auto=compress&cs=tinysrgb&w=300'}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <button className="bg-white bg-opacity-90 p-1 rounded-full hover:bg-opacity-100 transition-all">
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.condition || 'N/A'}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-emerald-600">${item.price}</span>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {item.views || 0}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {item.likes || 0}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  Posted {new Date(item.createdAt || item.datePosted).toLocaleDateString()}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>

                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
     {showEditModal && selectedItem && (
  <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold text-emerald-700 mb-4">Edit Item</h2>

      <form onSubmit={handleEditSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={editFormData.title}
              onChange={handleEditFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={editFormData.price}
              onChange={handleEditFormChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
            <select
              name="condition"
              value={editFormData.condition}
              onChange={handleEditFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select condition</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={editFormData.location}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <input
              type="text"
              name="material"
              value={editFormData.material}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="text"
              name="color"
              value={editFormData.color}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={editFormData.brand}
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Made</label>
            <input
              type="number"
              name="yearMade"
              value={editFormData.yearMade}
              onChange={handleEditFormChange}
              min="1800"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={editFormData.description}
            onChange={handleEditFormChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={editFormData.tags}
            onChange={handleEditFormChange}
            placeholder="vintage, handmade, ceramic"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
            <input
              type="text"
              name="dimensions"
              value={editFormData.dimensions}
              onChange={handleEditFormChange}
              placeholder="L x W x H"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              type="text"
              name="weight"
              value={editFormData.weight}
              onChange={handleEditFormChange}
              placeholder="e.g., 2.5 lbs"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Update Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const newImage = {
                    id: Date.now(),
                    file: file,
                    preview: URL.createObjectURL(file)
                  };
                  setEditImages([newImage]);
                }
              }}
              className="w-full"
            />
            {editImages.length > 0 && (
              <div className="mt-2">
                <img
                  src={editImages[0].preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
            {selectedItem.imageUrl && editImages.length === 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Current image:</p>
                <img
                  src={`http://localhost:5000${selectedItem.imageUrl}`}
                  alt="Current"
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Save Changes
          </button>
        </div>
      </form>

      <button
        onClick={() => setShowEditModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
      >
        ✕
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default MyItems;