const { validationResult } = require('express-validator');
const { Review, User, Product, Order, OrderItem } = require('../models');
const { Op } = require('sequelize');

const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment, reviewType, sellerId, productId, orderId } = req.body;

    if (reviewType === 'product' && !productId) {
      return res.status(400).json({ message: 'Product ID is required for product reviews' });
    }

    if (!sellerId) {
      return res.status(400).json({ message: 'Seller ID is required' });
    }

    const existingReview = await Review.findOne({
      where: {
        buyerId: req.user.id,
        sellerId,
        ...(productId && { productId }),
        ...(orderId && { orderId })
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    const review = await Review.create({
      rating,
      comment,
      reviewType,
      buyerId: req.user.id,
      sellerId,
      productId,
      orderId
    });

    const reviewWithDetails = await Review.findByPk(review.id, {
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName'] },
        ...(productId ? [{ model: Product }] : [])
      ]
    });

    await updateSellerRating(sellerId);

    res.status(201).json({
      message: 'Review created successfully',
      review: reviewWithDetails
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateSellerRating = async (sellerId) => {
  try {
    const reviews = await Review.findAll({
      where: { sellerId, isApproved: true }
    });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = (totalRating / reviews.length).toFixed(2);

      await User.update(
        { rating: averageRating },
        { where: { id: sellerId } }
      );
    }
  } catch (error) {
    console.error('Update seller rating error:', error);
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: {
        productId,
        isApproved: true
      },
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSellerReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: {
        sellerId,
        isApproved: true
      },
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName'] },
        { model: Product, attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get seller reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, type = 'given' } = req.query;
    const offset = (page - 1) * limit;

    const where = type === 'given' 
      ? { buyerId: req.user.id }
      : { sellerId: req.user.id };

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName'] },
        { model: Product, attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      where: { id, buyerId: req.user.id }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    await Review.update(
      { rating, comment },
      { where: { id } }
    );

    const updatedReview = await Review.findByPk(id, {
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName'] },
        { model: Product, attributes: ['id', 'title'] }
      ]
    });

    await updateSellerRating(review.sellerId);

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      where: { id, buyerId: req.user.id }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    const sellerId = review.sellerId;
    await Review.destroy({ where: { id } });
    await updateSellerRating(sellerId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAuthenticatedSellerReviews = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: {
        sellerId,
        isApproved: true
      },
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName'] },
        { model: Product, attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get authenticated seller reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getSellerReviews,
  getAuthenticatedSellerReviews,
  getUserReviews,
  updateReview,
  deleteReview
};