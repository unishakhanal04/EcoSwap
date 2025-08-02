const express = require('express');
const { body } = require('express-validator');
const {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  getRecentProducts
} = require('../controllers/productController');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');

const router = express.Router();

const productValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('condition').isIn(['Like New', 'Excellent', 'Good', 'Fair', 'Needs Repair']).withMessage('Invalid condition')
];

router.get('/', optionalAuth, getAllProducts);
router.get('/recent', optionalAuth, getRecentProducts);
router.get('/seller', authenticateToken, authorizeRoles('seller'), getSellerProducts);
router.get('/:id', optionalAuth, getProductById);
router.post('/', authenticateToken, authorizeRoles('seller'), uploadProductImages, productValidation, createProduct);
router.put('/:id', authenticateToken, authorizeRoles('seller'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('seller'), deleteProduct);

module.exports = router;