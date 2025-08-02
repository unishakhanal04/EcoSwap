const express = require('express');
const { body } = require('express-validator');
const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  searchUsers,
  deactivateAccount,
  changePassword
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { uploadProfileImage } = require('../middleware/upload');

const router = express.Router();

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

router.get('/search', searchUsers);
router.get('/stats', authenticateToken, getUserStats);
router.get('/:id', getUserProfile);
router.put('/profile', authenticateToken, uploadProfileImage, updateUserProfile);
router.put('/change-password', authenticateToken, changePasswordValidation, changePassword);
router.put('/deactivate', authenticateToken, deactivateAccount);

module.exports = router;