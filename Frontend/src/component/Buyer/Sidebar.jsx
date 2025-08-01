const Sidebar = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
    { id: 'browse', name: 'Browse Items', icon: '🔍' },
    { id: 'requests', name: 'My Requests', icon: '📋' },
    { id: 'wishlist', name: 'Wishlist', icon: '💖' }, // ✅ Wishlist added here
    { id: 'profile', name: 'Profile', icon: '👤' },
      { id: 'review', name: 'Review', icon: '📦'},
      
  ]

  const handleMenuClick = (pageId) => {
    setCurrentPage(pageId)
    setIsOpen(false) // Close sidebar on mobile
  }

  return (
    <>
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#007f66] rounded-lg flex items-center justify-center text-white font-bold mr-3">
                E
              </div>
              <span className="text-xl font-bold text-gray-800">EcoSwap</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200
                      ${currentPage === item.id 
                        ? 'bg-[#007f66] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
           {/* Logout Button */}
<div className="p-4">
  <button
    onClick={() => {
      // Add your logout logic here
      console.log('Logging out...');
    }}
    className="w-full flex items-center justify-center bg-red-200 text-red-700 py-2 px-4 rounded-lg hover:bg-red-300 transition"
  >
    <span className="mr-2 text-lg">🔓</span> Logout
  </button>
</div>


          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#007f66] rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">John Doe</p>
                <p className="text-xs text-gray-500">Buyer</p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
      
    </>
  )
}

export default Sidebar;
