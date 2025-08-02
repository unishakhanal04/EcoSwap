const { User, Product, Review, Order } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Product,
          as: 'products',
          where: { status: 'active' },
          required: false,
          limit: 6
        },
        {
          model: Review,
          as: 'receivedReviews',
          where: { isApproved: true },
          required: false,
          include: [
            { model: User, as: 'buyer', attributes: ['firstName', 'lastName'] }
          ],
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(404).json({ message: 'User account is deactivated' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipCode
    } = req.body;

    const updateData = {
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipCode
    };

    if (req.file) {
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    await User.update(updateData, {
      where: { id: req.user.id }
    });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;

    let stats = {};

    if (userType === 'seller') {
      const totalProducts = await Product.count({
        where: { sellerId: userId }
      });

      const activeProducts = await Product.count({
        where: { sellerId: userId, status: 'active' }
      });

      const soldProducts = await Product.count({
        where: { sellerId: userId, status: 'sold' }
      });

      const totalViews = await Product.sum('views', {
        where: { sellerId: userId }
      }) || 0;

      const totalReviews = await Review.count({
        where: { sellerId: userId, isApproved: true }
      });

      const averageRating = await Review.findOne({
        where: { sellerId: userId, isApproved: true },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
        ]
      });

      stats = {
        products: {
          total: totalProducts,
          active: activeProducts,
          sold: soldProducts
        },
        views: totalViews,
        reviews: {
          total: totalReviews,
          averageRating: averageRating?.dataValues?.avgRating || 0
        }
      };
    }

    if (userType === 'buyer') {
      const totalOrders = await Order.count({
        where: { buyerId: userId }
      });

      const completedOrders = await Order.count({
        where: { buyerId: userId, status: 'delivered' }
      });

      const pendingOrders = await Order.count({
        where: { buyerId: userId, status: { [Op.in]: ['pending', 'confirmed', 'shipped'] } }
      });

      const totalSpent = await Order.sum('totalAmount', {
        where: { buyerId: userId, status: 'delivered' }
      }) || 0;

      const reviewsGiven = await Review.count({
        where: { buyerId: userId }
      });

      stats = {
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders
        },
        totalSpent: parseFloat(totalSpent),
        reviewsGiven
      };
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query, userType = 'seller', page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      userType,
      isActive: true,
      isVerified: true
    };

    if (query) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${query}%` } },
        { lastName: { [Op.iLike]: `%${query}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: {
        exclude: ['password', 'email', 'phone', 'address']
      },
      include: [
        {
          model: Product,
          as: 'products',
          where: { status: 'active' },
          required: false,
          limit: 3
        }
      ],
      order: [['rating', 'DESC'], ['totalSales', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deactivateAccount = async (req, res) => {
  try {
    await User.update(
      { isActive: false },
      { where: { id: req.user.id } }
    );

    await Product.update(
      { status: 'inactive' },
      { where: { sellerId: req.user.id, status: 'active' } }
    );

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  searchUsers,
  deactivateAccount,
  changePassword
};