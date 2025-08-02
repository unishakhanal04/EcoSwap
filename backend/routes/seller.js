const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');
const {
  getSellerDashboard,
  getRecentItems,
  getSellerProducts,
  getSellerOrders,
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerAnalytics
} = require('../controllers/sellerController');

// All seller routes require authentication
router.use(authenticateToken);

// GET /api/seller/dashboard - Get seller dashboard data
router.get('/dashboard', getSellerDashboard);

// GET /api/seller/recent-items - Get seller's recent items
router.get('/recent-items', getRecentItems);

// GET /api/seller/products - Get seller's products with pagination
router.get('/products', getSellerProducts);

// GET /api/seller/orders - Get seller's orders
router.get('/orders', getSellerOrders);

// POST /api/seller/add-item - Add a new product
router.post('/add-item', uploadProductImages, addProduct);

// PUT /api/seller/products/:id - Update a product
router.put('/products/:id', uploadProductImages, updateProduct);

// DELETE /api/seller/products/:id - Delete a product
router.delete('/products/:id', deleteProduct);

// GET /api/seller/analytics - Get seller analytics data
router.get('/analytics', getSellerAnalytics);

module.exports = router;