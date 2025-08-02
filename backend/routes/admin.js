const express = require('express');
const { body } = require('express-validator');
const {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getAllProducts,
  updateProductStatus,
  getAllOrders,
  getAnalytics,
  getCategories,
  createCategory,
  updateCategory,
  getRecentActivities,
  getCommissionData
} = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

const userStatusValidation = [
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  body('isVerified').isBoolean().withMessage('isVerified must be a boolean')
];

const productStatusValidation = [
  body('isApproved').optional().isBoolean().withMessage('isApproved must be a boolean'),
  body('status').optional().isIn(['active', 'sold', 'inactive', 'pending']).withMessage('Invalid status')
];

const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required'),
  body('description').optional().isString()
];

const categoryUpdateValidation = [
  body('name').optional().notEmpty().withMessage('Category name cannot be empty'),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

const userValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('userType').isIn(['buyer', 'seller', 'admin']).withMessage('Invalid user type')
];

const userUpdateValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required')
];

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/activities', getRecentActivities);
router.get('/commission', getCommissionData);
router.get('/users', getAllUsers);
router.post('/users', userValidation, createUser);
router.put('/users/:id', userUpdateValidation, updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', userStatusValidation, updateUserStatus);
router.get('/products', getAllProducts);
router.put('/products/:id/status', productStatusValidation, updateProductStatus);
router.get('/orders', getAllOrders);
router.get('/analytics', getAnalytics);
router.get('/categories', getCategories);
router.post('/categories', categoryValidation, createCategory);
router.put('/categories/:id', categoryUpdateValidation, updateCategory);

module.exports = router;