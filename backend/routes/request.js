const express = require('express');
const router = express.Router();
const { createRequest, getSellerRequests, getBuyerRequests, updateRequestStatus, deleteRequest } = require('../controllers/requestController');
const { authenticateToken } = require('../middleware/auth');

router.post('/create', authenticateToken, createRequest);
router.get('/seller', authenticateToken, getSellerRequests);
router.get('/buyer', authenticateToken, getBuyerRequests);
router.put('/:id/status', authenticateToken, updateRequestStatus);
router.delete('/:id', authenticateToken, deleteRequest);

module.exports = router;