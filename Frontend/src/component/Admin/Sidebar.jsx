import React from 'react';
import { LayoutDashboard, Users, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) => {

  const navgiation = useNavigate()

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'buyers', name: 'Buyers', icon: Users },
    { id: 'sellers', name: 'Sellers', icon: ShoppingBag },
    { id: 'analytics', name: 'analytics', icon: LayoutDashboard },
  
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile overlaay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-gray-200 shadow-lg
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shadow-none h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#007f66] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">EcoSwap</h2>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
          
          <button 
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-[#007f66] hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      navgiation(`/admin/${item.id}`);
                      setCurrentPage(item.id);
                      closeSidebar();
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-[#007f66] text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[#007f66]'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* <div className="absolute bottom-24 left-6 right-6"> */}
          {/* Logout Button */}
{/* <div className="p-4"> */}
  <button
    onClick={() => {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userType');
      
      // Redirect to login page
      navgiation('/login');
    }}
    className="w-full flex items-center justify-center bg-red-200 text-red-700 py-2 px-4 rounded-lg hover:bg-red-300 transition"
  >
    <span className="mr-2 text-lg">🔓</span> Logout
  </button>
  <div/>
{/* </div> */}
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#007f66] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AD</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Admin User</p>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;