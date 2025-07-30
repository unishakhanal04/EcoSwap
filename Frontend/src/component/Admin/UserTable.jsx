import React from 'react';
import { Edit, Trash2, Star } from 'lucide-react';

const UserTable = ({ users, columns, onEdit, onDelete, userType }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.inactive}`}>
        {status}
      </span>
    );
  };

  const renderCellValue = (key, value, user) => {
    switch (key) {
      case 'status':
        return getStatusBadge(value);
      case 'rating':
        if (userType === 'seller') {
          return (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{value || 'N/A'}</span>
            </div>
          );
        }
        return value;
      case 'joinDate':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Mobile view */}
      <div className="lg:hidden">
        {users.map((user) => (
          <div key={user.id} className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 text-gray-600 hover:text-[#007f66] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Email:</span> {user.email}</div>
              <div><span className="font-medium">Phone:</span> {user.phone}</div>
              <div><span className="font-medium">Status:</span> {getStatusBadge(user.status)}</div>
              {userType === 'buyer' && (
                <>
                  <div><span className="font-medium">Purchases:</span> {user.totalPurchases}</div>
                  <div><span className="font-medium">Total Spent:</span> {user.totalSpent}</div>
                </>
              )}
              {userType === 'seller' && (
                <>
                  <div><span className="font-medium">Sales:</span> {user.totalSales}</div>
                  <div><span className="font-medium">Total Earned:</span> {user.totalEarned}</div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Rating:</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{user.rating || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCellValue(column.key, user[column.key], user)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-gray-600 hover:text-[#007f66] hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-gray-600 hover:text-red-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;