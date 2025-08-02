const { User, Product, Order, OrderItem, Review, Category, Request } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalBuyers = await User.count({ where: { userType: 'buyer' } });
    const totalSellers = await User.count({ where: { userType: 'seller' } });
    const totalProducts = await Product.count();
    const activeProducts = await Product.count({ where: { status: 'active' } });
    const soldProducts = await Product.count({ where: { status: 'sold' } });
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const completedOrders = await Order.count({ where: { status: 'delivered' } });
    const totalRevenue = await Order.sum('totalAmount', { where: { status: 'delivered' } }) || 0;

    console.log('Dashboard Stats Debug:');
    console.log('Total Users:', totalUsers);
    console.log('Total Buyers:', totalBuyers);
    console.log('Total Sellers:', totalSellers);
    console.log('Total Products:', totalProducts);

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'buyer', attributes: ['firstName', 'lastName', 'email'] }
      ]
    });

    const topSellers = await User.findAll({
      where: { userType: 'seller' },
      order: [['totalSales', 'DESC']],
      limit: 5,
      attributes: ['id', 'firstName', 'lastName', 'email', 'totalSales', 'rating']
    });

    res.json({
      stats: {
        users: {
          total: totalUsers,
          buyers: totalBuyers,
          sellers: totalSellers
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          sold: soldProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders
        },
        revenue: {
          total: parseFloat(totalRevenue)
        }
      },
      recentOrders,
      topSellers
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCommissionData = async (req, res) => {
  try {
    // Get all approved requests with commission data
    const approvedRequests = await Request.findAll({
      where: { status: 'approved' },
      include: [
        { model: User, as: 'buyer', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'seller', attributes: ['firstName', 'lastName', 'email'] }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Calculate total commission
    const totalCommission = approvedRequests.reduce((sum, req) => sum + (req.adminCommission || 0), 0);
    
    // Calculate this month's commission
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthCommission = approvedRequests
      .filter(req => new Date(req.updatedAt) >= thisMonth)
      .reduce((sum, req) => sum + (req.adminCommission || 0), 0);
    
    // Calculate this week's commission
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekCommission = approvedRequests
      .filter(req => new Date(req.updatedAt) >= oneWeekAgo)
      .reduce((sum, req) => sum + (req.adminCommission || 0), 0);

    // Get top earning sellers from requests
    const sellerEarnings = {};
    approvedRequests.forEach(req => {
      const sellerId = req.sellerId;
      if (!sellerEarnings[sellerId]) {
        sellerEarnings[sellerId] = {
          seller: req.seller,
          totalEarnings: 0,
          totalCommission: 0,
          requestCount: 0
        };
      }
      sellerEarnings[sellerId].totalEarnings += req.sellerEarnings || 0;
      sellerEarnings[sellerId].totalCommission += req.adminCommission || 0;
      sellerEarnings[sellerId].requestCount += 1;
    });

    const topSellers = Object.values(sellerEarnings)
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalCommission,
        thisMonthCommission,
        thisWeekCommission,
        totalApprovedRequests: approvedRequests.length,
        recentRequests: approvedRequests.slice(0, 10),
        topSellers
      }
    });
  } catch (error) {
    console.error('Get commission data error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, userType, search, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (userType && userType !== 'all') {
      where.userType = userType;
    }

    if (status) {
      where.isActive = status === 'active';
    }

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
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
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, isVerified } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.userType === 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin users' });
    }

    await User.update(
      { isActive, isVerified },
      { where: { id } }
    );

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'User status updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, search, isApproved } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (category) {
      where.categoryId = category;
    }

    if (isApproved !== undefined) {
      where.isApproved = isApproved === 'true';
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Category }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, status } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = {};
    if (isApproved !== undefined) {
      updateData.isApproved = isApproved;
      updateData.approvedBy = req.user.id;
      updateData.approvedAt = new Date();
    }
    if (status) {
      updateData.status = status;
    }

    await Product.update(updateData, { where: { id } });

    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Category }
      ]
    });

    res.json({
      message: 'Product status updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.orderNumber = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName', 'email'] },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              include: [{ model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName'] }]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const totalRevenue = await Order.sum('totalAmount', {
      where: { status: 'delivered' }
    }) || 0;
    
    const platformRevenue = totalRevenue * 0.1;
    
    const currentPeriodRevenue = await Order.sum('totalAmount', {
      where: {
        status: 'delivered',
        createdAt: { [Op.gte]: startDate }
      }
    }) || 0;
    
    const previousPeriodRevenue = await Order.sum('totalAmount', {
      where: {
        status: 'delivered',
        createdAt: {
          [Op.gte]: previousStartDate,
          [Op.lt]: startDate
        }
      }
    }) || 0;
    
    const revenueChange = previousPeriodRevenue > 0 
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue * 100).toFixed(1)
      : 0;

    const totalUsers = await User.count();
    const activeUsers = await User.count({
      where: {
        createdAt: { [Op.gte]: startDate }
      }
    });
    
    const previousActiveUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: previousStartDate,
          [Op.lt]: startDate
        }
      }
    });
    
    const userGrowthChange = previousActiveUsers > 0
      ? ((activeUsers - previousActiveUsers) / previousActiveUsers * 100).toFixed(1)
      : 0;

    const totalTransactions = await Order.count({
      where: { status: 'delivered' }
    });
    
    const currentTransactions = await Order.count({
      where: {
        status: 'delivered',
        createdAt: { [Op.gte]: startDate }
      }
    });
    
    const previousTransactions = await Order.count({
      where: {
        status: 'delivered',
        createdAt: {
          [Op.gte]: previousStartDate,
          [Op.lt]: startDate
        }
      }
    });
    
    const transactionChange = previousTransactions > 0
      ? ((currentTransactions - previousTransactions) / previousTransactions * 100).toFixed(1)
      : 0;

    const totalProducts = await Product.count();
    const conversionRate = totalProducts > 0 ? (totalTransactions / totalProducts * 100).toFixed(2) : 0;

    const monthlyRevenueData = await sequelize.query(`
      SELECT 
        TO_CHAR("createdAt", 'Mon') as month,
        EXTRACT(MONTH FROM "createdAt") as monthNum,
        SUM("totalAmount") as revenue,
        COUNT(*) as transactions
      FROM "Orders" 
      WHERE status = 'delivered' 
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY EXTRACT(YEAR FROM "createdAt"), EXTRACT(MONTH FROM "createdAt"), TO_CHAR("createdAt", 'Mon')
      ORDER BY EXTRACT(YEAR FROM "createdAt"), EXTRACT(MONTH FROM "createdAt")
    `, { type: sequelize.QueryTypes.SELECT });

    const categoryStats = await sequelize.query(`
      SELECT 
        c.name,
        COUNT(DISTINCT oi."orderId") as sales,
        ROUND(COUNT(DISTINCT oi."orderId") * 100.0 / (
          SELECT COUNT(DISTINCT "orderId") FROM "OrderItems"
        ), 0) as percentage
      FROM "Categories" c
      JOIN "Products" p ON c.id = p."categoryId"
      JOIN "OrderItems" oi ON p.id = oi."productId"
      JOIN "Orders" o ON oi."orderId" = o.id
      WHERE o.status = 'delivered'
      GROUP BY c.id, c.name
      ORDER BY sales DESC
      LIMIT 5
    `, { type: sequelize.QueryTypes.SELECT });

    const userGrowthData = await sequelize.query(`
      SELECT 
        'Week ' || (EXTRACT(WEEK FROM "createdAt") - EXTRACT(WEEK FROM (NOW() - INTERVAL '4 weeks')) + 1) as period,
        SUM(CASE WHEN "userType" = 'buyer' THEN 1 ELSE 0 END) as buyers,
        SUM(CASE WHEN "userType" = 'seller' THEN 1 ELSE 0 END) as sellers
      FROM "Users" 
      WHERE "createdAt" >= NOW() - INTERVAL '4 weeks'
      GROUP BY EXTRACT(WEEK FROM "createdAt")
      ORDER BY EXTRACT(WEEK FROM "createdAt")
    `, { type: sequelize.QueryTypes.SELECT });

    const topSellers = await sequelize.query(`
      SELECT 
        u."firstName" || ' ' || u."lastName" as name,
        COUNT(DISTINCT o.id) as sales,
        '$' || ROUND(SUM(o."totalAmount") * 0.9, 0) as revenue
      FROM "Users" u
      JOIN "Products" p ON u.id = p."sellerId"
      JOIN "OrderItems" oi ON p.id = oi."productId"
      JOIN "Orders" o ON oi."orderId" = o.id
      WHERE u."userType" = 'seller' AND o.status = 'delivered'
      GROUP BY u.id, u."firstName", u."lastName"
      ORDER BY sales DESC
      LIMIT 5
    `, { type: sequelize.QueryTypes.SELECT });

    const overviewStats = [
      {
        title: 'Platform Revenue (10% Fee)',
        value: `$${Math.round(platformRevenue).toLocaleString()}`,
        change: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
        changeType: revenueChange >= 0 ? 'positive' : 'negative'
      },
      {
        title: 'Active Users',
        value: totalUsers.toLocaleString(),
        change: `${userGrowthChange >= 0 ? '+' : ''}${userGrowthChange}%`,
        changeType: userGrowthChange >= 0 ? 'positive' : 'negative'
      },
      {
        title: 'Total Transactions',
        value: totalTransactions.toLocaleString(),
        change: `${transactionChange >= 0 ? '+' : ''}${transactionChange}%`,
        changeType: transactionChange >= 0 ? 'positive' : 'negative'
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        change: '+2.1%',
        changeType: 'positive'
      }
    ];

    res.json({
      overviewStats,
      revenueData: monthlyRevenueData,
      topCategories: categoryStats,
      userGrowth: userGrowthData,
      topSellers,
      totalRevenue: Math.round(totalRevenue),
      platformRevenue: Math.round(platformRevenue)
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.update(
      { name, description, isActive },
      { where: { id } }
    );

    const updatedCategory = await Category.findByPk(id);

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get recent orders
    const recentOrders = await Order.findAll({
      limit: Math.floor(limit / 3),
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'buyer', attributes: ['firstName', 'lastName'] }
      ]
    });

    // Get recent user registrations
    const recentUsers = await User.findAll({
      where: { userType: { [Op.in]: ['buyer', 'seller'] } },
      limit: Math.floor(limit / 3),
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'firstName', 'lastName', 'userType', 'createdAt']
    });

    // Get recent product approvals
    const recentProducts = await Product.findAll({
      where: { isApproved: true },
      limit: Math.floor(limit / 3),
      order: [['approvedAt', 'DESC']],
      include: [
        { model: User, as: 'seller', attributes: ['firstName', 'lastName'] }
      ]
    });

    // Format activities
    const activities = [];

    // Add order activities
    recentOrders.forEach(order => {
      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        message: `New order #${order.orderNumber} placed`,
        user: `${order.buyer.firstName} ${order.buyer.lastName}`,
        time: order.createdAt,
        icon: 'ShoppingBag',
        color: 'text-blue-600'
      });
    });

    // Add user registration activities
    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user.id}`,
        type: 'user',
        message: `New ${user.userType} registered`,
        user: `${user.firstName} ${user.lastName}`,
        time: user.createdAt,
        icon: user.userType === 'seller' ? 'Store' : 'User',
        color: user.userType === 'seller' ? 'text-green-600' : 'text-purple-600'
      });
    });

    // Add product approval activities
    recentProducts.forEach(product => {
      activities.push({
        id: `product-${product.id}`,
        type: 'product',
        message: `Product "${product.title}" approved`,
        user: `${product.seller.firstName} ${product.seller.lastName}`,
        time: product.approvedAt,
        icon: 'CheckCircle',
        color: 'text-emerald-600'
      });
    });

    // Sort by time and limit
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const limitedActivities = activities.slice(0, parseInt(limit));

    res.json({ activities: limitedActivities });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType, phone, address, city, state, zipCode } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      phone,
      address,
      city,
      state,
      zipCode,
      isActive: true,
      isVerified: false
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, city, state, zipCode } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
    }

    await user.update({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
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
};