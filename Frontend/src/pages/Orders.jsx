import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, User, Phone, Mail, MapPin } from 'lucide-react';
import Card from '../components/Seller/common/Card';
import Button from '../components/Seller/common/Button';
import Modal from '../components/Seller/common/Modal';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      item: 'Vintage Ceramic Vase',
      buyer: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Anytown, ST 12345'
      },
      amount: 45.00,
      status: 'Pending',
      orderDate: '2024-01-15',
      image: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=400',
      paymentStatus: 'Paid'
    },
    {
      id: 'ORD-002',
      item: 'Boho Wall Art Set',
      buyer: {
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 987-6543',
        address: '456 Oak Ave, Somewhere, ST 67890'
      },
      amount: 89.99,
      status: 'Shipped',
      orderDate: '2024-01-12',
      shippedDate: '2024-01-14',
      trackingNumber: 'TRK123456789',
      image: 'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=400',
      paymentStatus: 'Paid'
    },
    {
      id: 'ORD-003',
      item: 'Moroccan Rug',
      buyer: {
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 456-7890',
        address: '789 Pine Rd, Elsewhere, ST 54321'
      },
      amount: 156.75,
      status: 'Delivered',
      orderDate: '2024-01-10',
      shippedDate: '2024-01-11',
      deliveredDate: '2024-01-13',
      trackingNumber: 'TRK987654321',
      image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=400',
      paymentStatus: 'Paid'
    },
    {
      id: 'ORD-004',
      item: 'Modern Table Lamp',
      buyer: {
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@email.com',
        phone: '+1 (555) 321-9876',
        address: '321 Elm St, Newtown, ST 98765'
      },
      amount: 75.00,
      status: 'Pending',
      orderDate: '2024-01-16',
      image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
      paymentStatus: 'Paid'
    }
  ]);

  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              ...(newStatus === 'Shipped' && { shippedDate: new Date().toISOString().split('T')[0] }),
              ...(newStatus === 'Delivered' && { deliveredDate: new Date().toISOString().split('T')[0] })
            }
          : order
      )
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Shipped': return <Truck className="h-4 w-4" />;
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending': return 'Shipped';
      case 'Shipped': return 'Delivered';
      default: return null;
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  return (
    <div className="space-y-6">
      <Card 
        title="Order Management" 
        subtitle={`${filteredOrders.length} orders`}
      >
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Pending', 'Shipped', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === status
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={order.image}
                    alt={order.item}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900">{order.item}</h3>
                    <p className="text-sm text-slate-600">Order #{order.id}</p>
                    <p className="text-sm text-slate-600">Buyer: {order.buyer.name}</p>
                    <p className="text-sm text-slate-600">Date: {order.orderDate}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">${order.amount}</p>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(order.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </Button>
                    {getNextStatus(order.status) && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                      >
                        Mark as {getNextStatus(order.status)}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No orders found.</p>
          </div>
        )}
      </Card>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderDetails}
        onClose={() => setShowOrderDetails(false)}
        title={`Order Details - ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="flex items-center space-x-4">
              <img
                src={selectedOrder.image}
                alt={selectedOrder.item}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedOrder.item}</h3>
                <p className="text-slate-600">Order #{selectedOrder.id}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">${selectedOrder.amount}</p>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3">Buyer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedOrder.buyer.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedOrder.buyer.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedOrder.buyer.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                  <span className="text-sm text-slate-600">{selectedOrder.buyer.address}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Order Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">Order placed on {selectedOrder.orderDate}</span>
                </div>
                {selectedOrder.shippedDate && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Shipped on {selectedOrder.shippedDate}</span>
                    {selectedOrder.trackingNumber && (
                      <span className="text-sm text-blue-600">Tracking: {selectedOrder.trackingNumber}</span>
                    )}
                  </div>
                )}
                {selectedOrder.deliveredDate && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Delivered on {selectedOrder.deliveredDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              {getNextStatus(selectedOrder.status) && (
                <Button
                  variant="success"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status));
                    setShowOrderDetails(false);
                  }}
                >
                  Mark as {getNextStatus(selectedOrder.status)}
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;