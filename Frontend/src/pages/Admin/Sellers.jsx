import React, { useState } from 'react';
import UserTable from "../../component/Admin/UserTable.jsx"
import UserModal from '../../component/Admin/UserModal';
import SearchBar from '../../component/Admin/SearchBar';
import { Plus } from 'lucide-react';

const Sellers = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for sellers
  const [sellers, setSellers] = useState([
    {
      id: 1,
      name: 'Alice Cooper',
      email: 'alice.cooper@email.com',
      phone: '+1 (555) 111-2222',
      joinDate: '2024-01-10',
      status: 'active',
      totalSales: 25,
      totalEarned: '$3,450.75',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Bob Martinez',
      email: 'bob.martinez@email.com',
      phone: '+1 (555) 222-3333',
      joinDate: '2024-01-22',
      status: 'active',
      totalSales: 18,
      totalEarned: '$2,156.40',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Carol Thompson',
      email: 'carol.t@email.com',
      phone: '+1 (555) 333-4444',
      joinDate: '2024-02-05',
      status: 'pending',
      totalSales: 0,
      totalEarned: '$0.00',
      rating: 0
    },
    {
      id: 4,
      name: 'Daniel Lee',
      email: 'daniel.lee@email.com',
      phone: '+1 (555) 444-5555',
      joinDate: '2024-01-18',
      status: 'active',
      totalSales: 42,
      totalEarned: '$5,892.30',
      rating: 4.9
    },
    {
      id: 5,
      name: 'Eva Rodriguez',
      email: 'eva.rodriguez@email.com',
      phone: '+1 (555) 555-6666',
      joinDate: '2024-02-28',
      status: 'active',
      totalSales: 12,
      totalEarned: '$1,678.95',
      rating: 4.4
    }
  ]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
    setSellers(sellers.filter(seller => seller.id !== userId));
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      // Update existing user
      setSellers(sellers.map(seller => 
        seller.id === selectedUser.id ? { ...seller, ...userData } : seller
      ));
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: Math.max(...sellers.map(s => s.id)) + 1,
        joinDate: new Date().toISOString().split('T')[0],
        totalSales: 0,
        totalEarned: '$0.00',
        rating: 0
      };
      setSellers([...sellers, newUser]);
    }
    setShowModal(false);
  };

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sellerColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'joinDate', label: 'Join Date' },
    { key: 'totalSales', label: 'Sales' },
    { key: 'totalEarned', label: 'Total Earned' },
    { key: 'rating', label: 'Rating' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sellers Management</h2>
          <p className="text-gray-600 mt-1">Manage all registered sellers</p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center space-x-2 bg-[#007f66] text-white px-4 py-2 rounded-lg hover:bg-[#006b59] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Seller</span>
        </button>
      </div>

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search sellers by name or email..."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#007f66]">{sellers.length}</div>
          <div className="text-gray-600 text-sm">Total Sellers</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {sellers.filter(s => s.status === 'active').length}
          </div>
          <div className="text-gray-600 text-sm">Active Sellers</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {sellers.reduce((sum, s) => sum + s.totalSales, 0)}
          </div>
          <div className="text-gray-600 text-sm">Total Sales</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {sellers.filter(s => s.status === 'pending').length}
          </div>
          <div className="text-gray-600 text-sm">Pending Approval</div>
        </div>
      </div>

      {/* Users Table */}
      <UserTable
        users={filteredSellers}
        columns={sellerColumns}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        userType="seller"
      />

      {/* Modal */}
      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
          userType="seller"
        />
      )}
    </div>
  );
};

export default Sellers;