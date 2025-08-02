import React, { useState, useEffect } from 'react';
import UserTable from '../../component/Admin/UserTable';
import UserModal from '../../component/Admin/UserModal';
import SearchBar from '../../component/Admin/SearchBar';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const Buyers = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredBuyers, setFilteredBuyers] = useState([]);

  useEffect(() => {
    fetchBuyers();
  }, []);

  useEffect(() => {
    const transformedBuyers = buyers.map(buyer => ({
      ...buyer,
      name: `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() || 'N/A',
      phone: buyer.phone || 'N/A',
      joinDate: buyer.createdAt,
      totalSpent: `$${(buyer.totalPurchases * 50 || 0).toFixed(2)}`,
      status: buyer.isActive ? 'active' : 'inactive'
    }));
    
    const filtered = transformedBuyers.filter(buyer =>
      buyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.phone?.includes(searchTerm)
    );
    setFilteredBuyers(filtered);
  }, [buyers, searchTerm]);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBuyers();
      setBuyers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching buyers:', error);
      toast.error('Failed to load buyers');
    } finally {
      setLoading(false);
    }
  };



  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await adminAPI.deleteUser(userId);
      if (response.data.success) {
        setBuyers(buyers.filter(buyer => buyer.id !== userId));
        toast.success('Buyer deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting buyer:', error);
      toast.error('Failed to delete buyer');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        const response = await adminAPI.updateUser(selectedUser.id, userData);
        if (response.data.success) {
          setBuyers(buyers.map(buyer => 
            buyer.id === selectedUser.id ? { ...buyer, ...userData } : buyer
          ));
          toast.success('Buyer updated successfully');
        }
      } else {
        // Add new user
        const response = await adminAPI.createUser({ ...userData, userType: 'buyer' });
        if (response.data.success) {
          setBuyers([...buyers, response.data.data]);
          toast.success('Buyer created successfully');
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving buyer:', error);
      toast.error('Failed to save buyer');
    }
  };

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
            {buyers.reduce((sum, b) => sum + (b.totalPurchases || 0), 0)}
          </div>
          <div className="text-gray-600 text-sm">Total Purchases</div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <UserTable
          users={filteredBuyers}
          columns={buyerColumns}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          userType="buyer"
        />
      )}

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