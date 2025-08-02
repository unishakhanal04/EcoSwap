import React, { useState, useEffect } from 'react';
import UserTable from "../../component/Admin/UserTable.jsx"
import UserModal from '../../component/Admin/UserModal';
import SearchBar from '../../component/Admin/SearchBar';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const Sellers = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSellers, setFilteredSellers] = useState([]);

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    const transformedSellers = sellers.map(seller => ({
      ...seller,
      name: `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'N/A',
      phone: seller.phone || 'N/A',
      joinDate: seller.createdAt,
      totalEarned: `$${(seller.totalSales * 0.1 || 0).toFixed(2)}`,
      rating: seller.rating || 0,
      status: seller.isActive ? 'active' : 'inactive'
    }));
    
    const filtered = transformedSellers.filter(seller =>
      seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.phone?.includes(searchTerm)
    );
    setFilteredSellers(filtered);
  }, [sellers, searchTerm]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSellers();
      setSellers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Failed to load sellers');
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
        setSellers(sellers.filter(seller => seller.id !== userId));
        toast.success('Seller deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
      toast.error('Failed to delete seller');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        const response = await adminAPI.updateUser(selectedUser.id, userData);
        if (response.data.success) {
          setSellers(sellers.map(seller => 
            seller.id === selectedUser.id ? { ...seller, ...userData } : seller
          ));
          toast.success('Seller updated successfully');
        }
      } else {
        // Add new user
        const response = await adminAPI.createUser({ ...userData, userType: 'seller' });
        if (response.data.success) {
          setSellers([...sellers, response.data.data]);
          toast.success('Seller created successfully');
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving seller:', error);
      toast.error('Failed to save seller');
    }
  };

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
            {sellers.reduce((sum, s) => sum + (s.totalSales || 0), 0)}
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
          users={filteredSellers}
          columns={sellerColumns}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          userType="seller"
        />
      )}

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