import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, MapPin, Star, Grid, List } from 'lucide-react';
import './BrowseItems.css';

const BrowseItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'decor', name: 'Decor' },
    { id: 'plants', name: 'Plants & Planters' },
    { id: 'artwork', name: 'Artwork' },
    { id: 'textiles', name: 'Textiles' }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-25', name: 'Under $25' },
    { id: '25-50', name: '$25 - $50' },
    { id: '50-100', name: '$50 - $100' },
    { id: '100+', name: '$100+' }
  ];

  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Vintage Brass Table Lamp',
      price: 75,
      category: 'lighting',
      image: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Sarah Chen',
      location: 'San Francisco, CA',
      rating: 4.8,
      description: 'Beautiful vintage brass table lamp with original shade',
      condition: 'Excellent',
      isWishlisted: false
    },
    {
      id: 2,
      name: 'Mid-Century Modern Bookshelf',
      price: 150,
      category: 'furniture',
      image: 'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Mike Johnson',
      location: 'Portland, OR',
      rating: 4.9,
      description: 'Solid wood bookshelf in excellent condition',
      condition: 'Very Good',
      isWishlisted: false
    },
    {
      id: 3,
      name: 'Ceramic Plant Pot Set',
      price: 35,
      category: 'plants',
      image: 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Emma Davis',
      location: 'Austin, TX',
      rating: 4.7,
      description: 'Set of 3 ceramic plant pots with saucers',
      condition: 'Like New',
      isWishlisted: true
    },
    {
      id: 4,
      name: 'Handwoven Wall Tapestry',
      price: 85,
      category: 'textiles',
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Luna Martinez',
      location: 'Denver, CO',
      rating: 4.6,
      description: 'Beautiful handwoven tapestry with geometric patterns',
      condition: 'Excellent',
      isWishlisted: false
    },
    {
      id: 5,
      name: 'Vintage Mirror with Ornate Frame',
      price: 120,
      category: 'decor',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Robert Kim',
      location: 'Seattle, WA',
      rating: 4.8,
      description: 'Ornate vintage mirror perfect for any room',
      condition: 'Good',
      isWishlisted: false
    },
    {
      id: 6,
      name: 'Abstract Canvas Painting',
      price: 65,
      category: 'artwork',
      image: 'https://images.pexels.com/photos/1109354/pexels-photo-1109354.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Artist Collective',
      location: 'Los Angeles, CA',
      rating: 4.5,
      description: 'Original abstract canvas painting',
      condition: 'New',
      isWishlisted: false
    }
  ]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      if (max) {
        matchesPrice = item.price >= parseInt(min) && item.price <= parseInt(max);
      } else {
        matchesPrice = item.price >= parseInt(min);
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.id - a.id; // newest first
    }
  });

  const handleWishlistToggle = (itemId) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isWishlisted: !item.isWishlisted }
        : item
    ));
    
    const item = items.find(i => i.id === itemId);
    if (item.isWishlisted) {
      alert(`${item.name} removed from wishlist!`);
    } else {
      alert(`${item.name} added to wishlist!`);
    }
  };

  const handleRequestItem = (itemId) => {
    const item = items.find(i => i.id === itemId);
    alert(`Request submitted for ${item.name}! The seller will be notified.`);
  };

  return (
    <div className="browse-items">
      {/* Header */}
      <div className="browse-header">
        <h1 className="browse-title">Browse Items</h1>
        <p className="browse-subtitle">Discover unique home decorative items from eco-conscious sellers</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-section">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className={`filters-panel ${showFilters ? 'active' : ''}`}>
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Price Range</label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="filter-select"
          >
            {priceRanges.map(range => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p className="results-count">
          Showing {sortedItems.length} of {items.length} items
        </p>
      </div>

      {/* Items Grid/List */}
      <div className={`items-container ${viewMode}`}>
        {sortedItems.map(item => (
          <div key={item.id} className={`item-card ${viewMode}`}>
            <div className="item-image-wrapper">
              <img src={item.image} alt={item.name} className="item-image" />
              <button
                className={`wishlist-btn ${item.isWishlisted ? 'active' : ''}`}
                onClick={() => handleWishlistToggle(item.id)}
              >
                <Heart size={20} />
              </button>
            </div>

            <div className="item-content">
              <div className="item-header">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">${item.price}</p>
              </div>

              <p className="item-description">{item.description}</p>

              <div className="item-meta">
                <div className="seller-info">
                  <p className="seller-name">{item.seller}</p>
                  <div className="rating">
                    <Star size={14} className="star-filled" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <div className="location-info">
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="item-condition">
                <span className="condition-label">Condition:</span>
                <span className="condition-value">{item.condition}</span>
              </div>

              <button
                className="request-btn"
                onClick={() => handleRequestItem(item.id)}
              >
                Request Item
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedItems.length === 0 && (
        <div className="no-results">
          <p>No items found matching your criteria.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseItems;