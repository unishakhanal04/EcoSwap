import React, { useState } from 'react';
import UserTable from '../../component/Admin/UserTable';
import UserModal from '../../component/Admin/UserModal';
import SearchBar from '../../component/Admin/SearchBar';
import { Plus } from 'lucide-react';

const Buyers = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for buyers
  const [buyers, setBuyers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2024-01-15',
      status: 'active',
      totalPurchases: 12,
      totalSpent: '$1,245.00'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 234-5678',
      joinDate: '2024-02-03',
      status: 'active',
      totalPurchases: 8,
      totalSpent: '$892.50'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      phone: '+1 (555) 345-6789',
      joinDate: '2024-01-28',
      status: 'inactive',
      totalPurchases: 3,
      totalSpent: '$156.75'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2024-03-10',
      status: 'active',
      totalPurchases: 15,
      totalSpent: '$2,103.25'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 (555) 567-8901',
      joinDate: '2024-02-18',
      status: 'active',
      totalPurchases: 6,
      totalSpent: '$487.90'
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
    setBuyers(buyers.filter(buyer => buyer.id !== userId));
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      // Update existing user
      setBuyers(buyers.map(buyer => 
        buyer.id === selectedUser.id ? { ...buyer, ...userData } : buyer
      ));
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: Math.max(...buyers.map(b => b.id)) + 1,
        joinDate: new Date().toISOString().split('T')[0],
        totalPurchases: 0,
        totalSpent: '$0.00'
      };
      setBuyers([...buyers, newUser]);
    }
    setShowModal(false);
  };

  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buyerColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'joinDate', label: 'Join Date' },
    { key: 'totalPurchases', label: 'Purchases' },
    { key: 'totalSpent', label: 'Total Spent' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Buyers Management</h2>
          <p className="text-gray-600 mt-1">Manage all registered buyers</p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center space-x-2 bg-[#007f66] text-white px-4 py-2 rounded-lg hover:bg-[#006b59] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Buyer</span>
        </button>
      </div>

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search buyers by name or email..."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#007f66]">{buyers.length}</div>
          <div className="text-gray-600 text-sm">Total Buyers</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {buyers.filter(b => b.status === 'active').length}
          </div>
          <div className="text-gray-600 text-sm">Active Buyers</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {buyers.reduce((sum, b) => sum + b.totalPurchases, 0)}
          </div>
          <div className="text-gray-600 text-sm">Total Purchases</div>
        </div>
      </div>

      {/* Users Table */}
      <UserTable
        users={filteredBuyers}
        columns={buyerColumns}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        userType="buyer"
      />

      {/* Modal */}
      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
          userType="buyer"
        />
      )}
    </div>
  );
};

export default Buyers;