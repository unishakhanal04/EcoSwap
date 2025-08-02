const { validationResult } = require('express-validator');
const { Order, OrderItem, Product, User, ProductImage, Request } = require('../models');
const { Op } = require('sequelize');

const generateOrderNumber = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      items,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      paymentMethod,
      notes
    } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || product.status !== 'active') {
        return res.status(400).json({ message: `Product ${item.productId} is not available` });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        totalPrice: itemTotal
      });
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      totalAmount,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      paymentMethod,
      notes,
      buyerId: req.user.id
    });

    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        orderId: order.id
      });

      await Product.update(
        { status: 'sold' },
        { where: { id: item.productId } }
      );
    }

    const orderWithItems = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              include: [{ model: ProductImage, as: 'images' }]
            }
          ]
        },
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: orderWithItems
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getBuyerOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const where = { buyerId: req.user.id };

    if (status) {
      where.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              include: [
                { model: ProductImage, as: 'images' },
                { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName'] }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get buyer orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    // First, find all order IDs that contain products from this seller
    const orderIds = await OrderItem.findAll({
      attributes: ['orderId'],
      include: [{
        model: Product,
        where: { sellerId: req.user.id },
        attributes: []
      }],
      group: ['orderId'],
      raw: true
    });

    const orderIdList = orderIds.map(item => item.orderId);

    if (orderIdList.length === 0) {
      return res.json({
        orders: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: parseInt(limit)
        }
      });
    }

    const whereClause = {
      id: orderIdList
    };
    
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              include: [
                { model: ProductImage, as: 'images' },
                { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'email'] }
              ]
            }
          ]
        },
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }
      ],
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Filter order items to only include products from this seller
    const filteredOrders = orders.map(order => {
      const filteredItems = order.items.filter(item => item.Product.sellerId === req.user.id);
      return {
        ...order.toJSON(),
        items: filteredItems
      };
    });

    res.json({
      orders: filteredOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              include: [
                { model: ProductImage, as: 'images' },
                { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }
              ]
            }
          ]
        },
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isBuyer = order.buyerId === req.user.id;
    const isSeller = order.items.some(item => item.Product.sellerId === req.user.id);
    const isAdmin = req.user.userType === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isSeller = order.items.some(item => item.Product.sellerId === req.user.id);
    const isAdmin = req.user.userType === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to update this order' });
    }

    const updateData = { status };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
    }
    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    await Order.update(updateData, { where: { id } });

    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              include: [{ model: ProductImage, as: 'images' }]
            }
          ]
        },
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getBuyerDashboardStats = async (req, res) => {
  try {
    const buyerId = req.user.id;

    // Get total orders count
    const totalOrders = await Order.count({
      where: { buyerId }
    });

    // Get pending orders count
    const pendingOrders = await Order.count({
      where: { 
        buyerId,
        status: { [Op.in]: ['pending', 'confirmed', 'shipped'] }
      }
    });

    // Get completed purchases count
    const completedPurchases = await Order.count({
      where: { 
        buyerId,
        status: 'delivered'
      }
    });

    // Get total requests count
    const totalRequests = await Request.count({
      where: { buyerId }
    });

    res.json({
      success: true,
      data: {
        totalRequests,
        pendingRequests: pendingOrders,
        completedPurchases,
        savedItems: 0 // This would need a wishlist/saved items table
      }
    });
  } catch (error) {
    console.error('Get buyer dashboard stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  getBuyerDashboardStats
};