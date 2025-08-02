const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getProductReviews,
  getSellerReviews,
  getAuthenticatedSellerReviews,
  getUserReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('reviewType').isIn(['product', 'seller']).withMessage('Invalid review type'),
  body('sellerId').isInt().withMessage('Valid seller ID is required')
];

const updateReviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

router.post('/', authenticateToken, authorizeRoles('buyer'), reviewValidation, createReview);
router.get('/user', authenticateToken, getUserReviews);
router.get('/seller', authenticateToken, authorizeRoles('seller'), getAuthenticatedSellerReviews);
router.get('/product/:productId', optionalAuth, getProductReviews);
router.get('/seller/:sellerId', optionalAuth, getSellerReviews);
router.put('/:id', authenticateToken, authorizeRoles('buyer'), updateReviewValidation, updateReview);
router.delete('/:id', authenticateToken, authorizeRoles('buyer'), deleteReview);

module.exports = router;