import React, { useState } from 'react';
import { Edit, Trash2, Eye, Search, Plus } from 'lucide-react';
import Card from '../components/Seller/common/Card';
import Button from '../components/Seller/common/Button';
import Modal from '../components/Seller/common/Modal';
import ListingForm from '../components/Seller/common/ListingForm';

const Listings = () => {
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Vintage Ceramic Vase',
      category: 'Vases & Planters',
      price: 45.00,
      condition: 'Excellent',
      status: 'Available',
      views: 127,
      interests: 8,
      image: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Boho Wall Art Set',
      category: 'Wall Art & Frames',
      price: 89.99,
      condition: 'Very Good',
      status: 'Reserved',
      views: 89,
      interests: 12,
      image: 'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2024-01-12'
    },
    {
      id: 3,
      title: 'Moroccan Rug',
      category: 'Rugs & Carpets',
      price: 156.75,
      condition: 'Good',
      status: 'Sold',
      views: 203,
      interests: 15,
      image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2024-01-10'
    },
    {
      id: 4,
      title: 'Modern Table Lamp',
      category: 'Lighting & Lamps',
      price: 75.00,
      condition: 'Excellent',
      status: 'Available',
      views: 64,
      interests: 5,
      image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2024-01-08'
    },
    {
      id: 5,
      title: 'Artificial Fiddle Leaf Fig',
      category: 'Artificial Plants',
      price: 32.50,
      condition: 'Very Good',
      status: 'Available',
      views: 91,
      interests: 7,
      image: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2024-01-05'
    },
    {
      id: 6,
      title: 'Decorative Mirror Set',
      category: 'Mirrors',
      price: 120.00,
      condition: 'Good',
      status: 'Available',
      views: 156,
      interests: 11,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2024-01-03'
    }
  ]);

  const [filteredListings, setFilteredListings] = useState(listings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingListing, setEditingListing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterListings(term, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterListings(searchTerm, status);
  };

  const filterListings = (searchTerm, statusFilter) => {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    setFilteredListings(filtered);
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
  };

  const handleDelete = (id) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
    setFilteredListings(prev => prev.filter(listing => listing.id !== id));
  };

  const handleUpdateListing = (updatedData) => {
    setListings(prev =>
      prev.map(listing =>
        listing.id === editingListing.id
          ? { ...listing, ...updatedData }
          : listing
      )
    );
    setEditingListing(null);
    filterListings(searchTerm, statusFilter);
  };

  const handleAddListing = (newData) => {
    const newListing = {
      id: Date.now(),
      ...newData,
      views: 0,
      interests: 0,
      image: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setListings(prev => [newListing, ...prev]);
    setShowAddForm(false);
    filterListings(searchTerm, statusFilter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800';
      case 'Sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        title="My Listings" 
        subtitle={`${filteredListings.length} items`}
        action={
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Button>
        }
      >
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Available', 'Reserved', 'Sold'].map(status => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1">{listing.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{listing.category}</p>
                <p className="text-lg font-bold text-slate-900 mb-3">${listing.price}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {listing.views}
                    </span>
                    <span>{listing.interests} interested</span>
                  </div>
                  <span>{listing.condition}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(listing)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(listing.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No listings found matching your criteria.</p>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={editingListing !== null}
        onClose={() => setEditingListing(null)}
        title="Edit Listing"
        size="lg"
      >
        {editingListing && (
          <ListingForm
            initialData={editingListing}
            onSubmit={handleUpdateListing}
          />
        )}
      </Modal>

      {/* Add New Listing Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add New Listing"
        size="lg"
      >
        <ListingForm onSubmit={handleAddListing} />
      </Modal>
    </div>
  );
};

export default Listings;