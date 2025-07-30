import { useState } from 'react'

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Vintage Wooden Chair',
      image: 'https://via.placeholder.com/300x200?text=Chair',
      category: 'Furniture',
      price: 45,
    },
    {
      id: 2,
      name: 'Handcrafted Ceramic Vase',
      image: 'https://via.placeholder.com/300x200?text=Vase',
      category: 'Decor',
      price: 30,
    },
    {
      id: 3,
      name: 'Bohemian Floor Lamp',
      image: 'https://via.placeholder.com/300x200?text=Lamp',
      category: 'Lighting',
      price: 60,
    },
  ])

  const handleRemove = (id) => {
    if (confirm('Remove this item from your wishlist?')) {
      setWishlist(wishlist.filter(item => item.id !== id))
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">💖 My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">Your wishlist is empty.</p>
          <p className="text-sm mt-2">Browse items and add them to your wishlist to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="font-medium text-primary-600">${item.price}</p>
                <div className="flex justify-between mt-4">
                  <button
                    className="text-sm bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition"
                    onClick={() => alert(`Viewing: ${item.name}`)}
                  >
                    View
                  </button>
                  <button
                    className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist;
