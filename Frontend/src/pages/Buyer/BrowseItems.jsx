import { useState } from 'react'

const BrowseItems = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Vintage Ceramic Vase',
      price: 25,
      category: 'decor',
      condition: 'Excellent',
      image: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Sarah M.',
      description: 'Beautiful handcrafted ceramic vase, perfect for fresh flowers.',
      isRequested: false
    },
    {
      id: 2,
      name: 'Handmade Wall Clock',
      price: 45,
      category: 'decor',
      condition: 'Good',
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Mike R.',
      description: 'Unique wooden wall clock with Roman numerals.',
      isRequested: false
    },
    {
      id: 3,
      name: 'Rustic Picture Frame',
      price: 18,
      category: 'decor',
      condition: 'Very Good',
      image: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Emma K.',
      description: 'Distressed wooden frame, adds character to any photo.',
      isRequested: false
    },
    {
      id: 4,
      name: 'Modern Table Lamp',
      price: 65,
      category: 'lighting',
      condition: 'Like New',
      image: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'David L.',
      description: 'Contemporary design with adjustable brightness.',
      isRequested: false
    },
    {
      id: 5,
      name: 'Woven Storage Basket',
      price: 30,
      category: 'storage',
      condition: 'Good',
      image: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Lisa P.',
      description: 'Natural fiber basket, great for organizing or decoration.',
      isRequested: false
    },
    {
      id: 6,
      name: 'Antique Mirror',
      price: 120,
      category: 'furniture',
      condition: 'Good',
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'Robert S.',
      description: 'Ornate vintage mirror with detailed frame work.',
      isRequested: false
    }
  ])

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'decor', name: 'Home Decor' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'storage', name: 'Storage' }
  ]

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-25', name: '$0 - $25' },
    { id: '26-50', name: '$26 - $50' },
    { id: '51-100', name: '$51 - $100' },
    { id: '100+', name: '$100+' }
  ]

  const handleRequestItem = (itemId) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, isRequested: true }
        : item
    ))
    alert(`Request sent for item ${itemId}!`)
  }

  const handleSaveItem = (itemId) => {
    alert(`Item ${itemId} saved to your wishlist!`)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesPrice = priceRange === 'all' || 
      (priceRange === '0-25' && item.price <= 25) ||
      (priceRange === '26-50' && item.price >= 26 && item.price <= 50) ||
      (priceRange === '51-100' && item.price >= 51 && item.price <= 100) ||
      (priceRange === '100+' && item.price > 100)
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Browse Items
        </h1>
        <div className="text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            >
              {priceRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="relative mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => handleSaveItem(item.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
              >
                ❤️
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                <p className="text-gray-600 text-sm">By {item.seller}</p>
              </div>

              <p className="text-gray-700 text-sm">{item.description}</p>

              <div className="flex items-center justify-between text-sm">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {item.condition}
                </span>
                <span className="text-xl font-bold text-primary-600">${item.price}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequestItem(item.id)}
                  disabled={item.isRequested}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    item.isRequested
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {item.isRequested ? 'Requested' : 'Request Item'}
                </button>
                <button className="btn-secondary px-4">
                  <span onClick={() => alert(`Viewing details for ${item.name}`)}>
                    View Details
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  )
}

export default BrowseItems