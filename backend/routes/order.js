const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  getBuyerDashboardStats
} = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isInt().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('shippingCity').notEmpty().withMessage('Shipping city is required'),
  body('shippingState').notEmpty().withMessage('Shipping state is required'),
  body('shippingZipCode').notEmpty().withMessage('Shipping zip code is required')
];

const statusUpdateValidation = [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status')
];

router.post('/', authenticateToken, authorizeRoles('buyer'), orderValidation, createOrder);
router.get('/buyer', authenticateToken, authorizeRoles('buyer'), getBuyerOrders);
router.get('/buyer/dashboard', authenticateToken, authorizeRoles('buyer'), getBuyerDashboardStats);
router.get('/seller', authenticateToken, authorizeRoles('seller'), getSellerOrders);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id/status', authenticateToken, authorizeRoles('seller', 'admin'), statusUpdateValidation, updateOrderStatus);

module.exports = router;