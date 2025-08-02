const { Request, User } = require('../models');
const { Op } = require('sequelize');

const createRequest = async (req, res) => {
  try {
    const { itemName, message, pickupAddress, sellerId, requestedPrice } = req.body;
    const buyerId = req.user.id;

    console.log('Creating request with data:', {
      itemName,
      buyerId,
      sellerId,
      requestedPrice: requestedPrice || 'null (will use default)',
      hasCustomPrice: !!requestedPrice
    });

    const request = await Request.create({
      itemName,
      message,
      pickupAddress,
      sellerId,
      buyerId,
      requestedPrice: requestedPrice || null,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message
    });
  }
};

const getSellerRequests = async (req, res) => {
  try {
    console.log('getSellerRequests called for user:', req.user?.id);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const sellerId = req.user.id;
    
    const requests = await Request.findAll({
      where: { sellerId },
      include: [{
        model: User,
        as: 'buyer',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`Found ${requests.length} requests for seller ${sellerId}`);

    const formattedRequests = requests.map(request => ({
      id: request.id,
      buyerName: `${request.buyer.firstName} ${request.buyer.lastName}`,
      item: request.itemName,
      address: request.pickupAddress,
      message: request.message,
      time: getTimeAgo(request.createdAt),
      status: request.status,
      requestedPrice: request.requestedPrice,
      approvedPrice: request.approvedPrice
    }));

    res.json({
      success: true,
      data: formattedRequests
    });
  } catch (error) {
    console.error('Error fetching seller requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      error: error.message
    });
  }
};

const getBuyerRequests = async (req, res) => {
  try {
    const buyerId = req.user.id;
    
    const requests = await Request.findAll({
      where: { buyerId },
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    const formattedRequests = requests.map(request => ({
      id: request.id,
      itemName: request.itemName,
      sellerId: request.sellerId,
      sellerName: `${request.seller.firstName} ${request.seller.lastName}`,
      address: request.pickupAddress,
      message: request.message,
      requestedDate: request.createdAt.toISOString().split('T')[0],
      status: request.status,
      requestedPrice: request.requestedPrice,
      approvedPrice: request.approvedPrice
    }));

    res.json({
      success: true,
      data: formattedRequests
    });
  } catch (error) {
    console.error('Error fetching buyer requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      error: error.message
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedPrice } = req.body;
    const sellerId = req.user.id;
    
    console.log('🔄 Updating request status:', { id, status, approvedPrice, sellerId });

    const request = await Request.findOne({
      where: { id, sellerId }
    });
    
    console.log('📝 Found request:', request ? request.toJSON() : 'Not found');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const updateData = { status };
    
    if (status === 'approved' && approvedPrice) {
      const commission = parseFloat(approvedPrice) * 0.1;
      const sellerEarnings = parseFloat(approvedPrice) - commission;
      
      updateData.approvedPrice = approvedPrice;
      updateData.adminCommission = commission;
      updateData.sellerEarnings = sellerEarnings;
      
      console.log('💰 Calculating earnings:', {
        approvedPrice: parseFloat(approvedPrice),
        commission,
        sellerEarnings,
        updateData
      });
    } else if (request.status === 'approved' && approvedPrice) {
      const commission = parseFloat(approvedPrice) * 0.1;
      const sellerEarnings = parseFloat(approvedPrice) - commission;
      
      updateData.approvedPrice = approvedPrice;
      updateData.adminCommission = commission;
      updateData.sellerEarnings = sellerEarnings;
      
      console.log('💰 Updating already approved request with price:', {
        approvedPrice: parseFloat(approvedPrice),
        commission,
        sellerEarnings,
        updateData
      });
    } else if (status === 'approved' && !approvedPrice) {
      console.log('⚠️ Warning: Request approved without price!');
    }

    await request.update(updateData);
    
    const updatedRequest = await Request.findByPk(id);
    console.log('✅ Request updated:', updatedRequest ? updatedRequest.toJSON() : 'Not found');

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: updatedRequest
    });
  } catch (error) {
    console.error('❌ Error updating request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update request status',
      error: error.message
    });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const buyerId = req.user.id;

    const request = await Request.findOne({
      where: { id, buyerId }
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    await request.destroy();

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete request',
      error: error.message
    });
  }
};

function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}

module.exports = {
  createRequest,
  getSellerRequests,
  getBuyerRequests,
  updateRequestStatus,
  deleteRequest
};