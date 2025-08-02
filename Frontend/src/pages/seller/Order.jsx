import React, { useState, useEffect } from 'react';
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { orderAPI, sellerAPI } from '../../services/api';

const statusColors = {
  delivered: '#009966',
  pending: '#FFA500',
  confirmed: '#007BFF',
  shipped: '#007BFF',
  cancelled: '#FF0000',
  refunded: '#FF0000',
};

const SellerOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getSellerOrders();
      setOrders(response.orders || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await orderAPI.updateOrderStatus(orderId, { status: newStatus });
      await fetchOrders(); // Refresh the orders list
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const getItemNames = (orderItems) => {
    return orderItems?.map(item => item.Product?.title || 'Unknown Product').join(', ') || 'No items';
  };

  const getBuyerName = (buyer) => {
    return buyer ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() || buyer.email : 'Unknown Buyer';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md pt-10">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md pt-10">
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md pt-10">
      <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#009966' }}>
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400">Orders from buyers will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: '2px solid #009966' }}>
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Buyer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total ($)</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                  style={{ borderColor: '#00996633' }}
                >
                  <td className="py-3 px-4 font-mono">{order.orderNumber}</td>
                  <td className="py-3 px-4">{getBuyerName(order.buyer)}</td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs truncate" title={getItemNames(order.items)}>
                      {getItemNames(order.items)}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">${parseFloat(order.totalAmount).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-1 rounded-full text-sm font-medium capitalize"
                      style={{ 
                        color: statusColors[order.status] || '#000',
                        backgroundColor: `${statusColors[order.status] || '#000'}20`
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'shipped')}
                        disabled={updating === order.id}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Mark as Shipped'
                        )}
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        disabled={updating === order.id}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Mark as Delivered'
                        )}
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        disabled={updating === order.id}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                      >
                        {updating === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Cancel'
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerOrderHistory;
