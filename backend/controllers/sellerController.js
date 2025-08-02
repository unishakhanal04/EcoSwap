const { User, Product, Order, OrderItem, Review, Request } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

// Get seller dashboard data
const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;
    console.log('🔍 Dashboard request for seller ID:', sellerId);

    // Get total products
    const totalProducts = await Product.count({
      where: { sellerId }
    });
    console.log('📦 Total products:', totalProducts);

    // Get total orders for seller's products
    const totalOrders = await OrderItem.count({
      include: [{
        model: Product,
        where: { sellerId },
        attributes: []
      }]
    });
    console.log('📋 Total orders:', totalOrders);

    // Get total revenue from orders
    const revenueResult = await OrderItem.findAll({
      include: [{
        model: Product,
        where: { sellerId },
        attributes: []
      }],
      attributes: [
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.literal('"OrderItem"."quantity" * "Product"."price"')), 'totalRevenue']
      ],
      raw: true
    });
    console.log('💰 Revenue result:', revenueResult);

    const orderRevenue = revenueResult[0]?.totalRevenue || 0;
    const totalQuantitySold = revenueResult[0]?.totalQuantity || 0;
    console.log('💵 Order revenue:', orderRevenue, 'Total quantity sold:', totalQuantitySold);

    // Debug: Check all requests for this seller
    const allRequests = await Request.findAll({
      where: { sellerId },
      attributes: ['id', 'itemName', 'status', 'approvedPrice', 'sellerEarnings', 'adminCommission'],
      raw: true
    });
    console.log('🔍 All requests for seller:', allRequests);

    // Get request stats and earnings
    const requestStats = await Request.findAll({
      where: { sellerId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRequests'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN status = \'approved\' THEN 1 END')), 'approvedRequests'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN status = \'pending\' THEN 1 END')), 'pendingRequests'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = \'approved\' THEN "sellerEarnings" ELSE 0 END')), 'requestEarnings']
      ],
      raw: true
    });
    console.log('📝 Request stats:', requestStats);

    const totalRequests = parseInt(requestStats[0]?.totalRequests || 0);
    const approvedRequests = parseInt(requestStats[0]?.approvedRequests || 0);
    const pendingRequests = parseInt(requestStats[0]?.pendingRequests || 0);
    const requestEarnings = parseFloat(requestStats[0]?.requestEarnings || 0);
    console.log('📊 Parsed request data:', { totalRequests, approvedRequests, pendingRequests, requestEarnings });

    // Calculate total earnings (orders + requests)
    const totalRevenue = parseFloat(orderRevenue || 0) + requestEarnings;
    console.log('💎 Total revenue calculated:', totalRevenue);

    // Get recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await OrderItem.count({
      include: [{
        model: Product,
        where: { sellerId },
        attributes: []
      }, {
        model: Order,
        where: {
          createdAt: {
            [Op.gte]: thirtyDaysAgo
          }
        },
        attributes: []
      }]
    });

    // Get average rating for seller's products
    const avgRatingResult = await Review.findAll({
      include: [{
        model: Product,
        where: { sellerId },
        attributes: []
      }],
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
      ],
      raw: true
    });

    const avgRating = parseFloat(avgRatingResult[0]?.avgRating || 0).toFixed(1);
    console.log('⭐ Average rating:', avgRating);

    const responseData = {
      success: true,
      data: {
        totalItems: totalProducts,
        totalOrders,
        totalEarnings: totalRevenue.toFixed(2),
        totalRevenue: totalRevenue.toFixed(2),
        totalQuantitySold: parseInt(totalQuantitySold || 0),
        totalRequests,
        approvedRequests,
        pendingRequests,
        requestEarnings: requestEarnings.toFixed(2),
        recentOrders,
        avgRating,
        itemsThisWeek: 0, // TODO: Calculate actual weekly stats
        earningsThisWeek: 0, // TODO: Calculate actual weekly stats
        conversionRate: 0, // TODO: Calculate actual conversion rate
        conversionRateChange: 0 // TODO: Calculate actual conversion rate change
      }
    };
    
    console.log('🚀 Sending dashboard response:', JSON.stringify(responseData, null, 2));
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching seller dashboard:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching dashboard data' 
    });
  }
};

// Get seller's recent items
const getRecentItems = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const recentItems = await Product.findAll({
      where: { sellerId },
      order: [['createdAt', 'DESC']],
      limit,
      attributes: ['id', 'title', 'price', 'createdAt']
    });

    res.json({
      success: true,
      data: recentItems
    });
  } catch (error) {
    console.error('Error fetching recent items:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching recent items' 
    });
  }
};

// Get seller's products with pagination
const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: { sellerId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'title', 'price', 'createdAt', 'description', 'condition', 'location', 'tags', 'dimensions', 'weight', 'material', 'color', 'brand', 'yearMade', 'status', 'views', 'likes', 'imageUrl']
    });

    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalProducts: count
      }
    });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching products' 
    });
  }
};

// Get seller's orders
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          where: { sellerId },
          attributes: ['title', 'price']
        }],
        attributes: ['quantity', 'price', 'totalPrice']
      }, {
        model: User,
        as: 'buyer',
        attributes: ['firstName', 'lastName', 'email']
      }],
      where: {
        '$items.Product.sellerId$': sellerId
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalOrders: count
      }
    });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching orders' 
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const {
      title,
      description,
      price,
      condition,
      location,
      tags,
      dimensions,
      weight,
      material,
      color,
      brand,
      yearMade,
      categoryId
    } = req.body;

    if (!title || !description || !price || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, price, and condition are required'
      });
    }

    // Handle image upload
    let imageUrl = null;
    if (req.files && req.files.length > 0) {
      imageUrl = `/uploads/products/${req.files[0].filename}`;
    }

    const product = await Product.create({
      title,
      description,
      price: parseFloat(price),
      condition,
      location,
      tags,
      dimensions,
      weight,
      material,
      color,
      brand,
      yearMade,
      imageUrl,
      sellerId,
      categoryId: categoryId || null,
      status: 'active',
      views: 0,
      likes: 0,
      isApproved: true
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product'
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;
    const {
      title,
      description,
      price,
      condition,
      location,
      tags,
      dimensions,
      weight,
      material,
      color,
      brand,
      yearMade
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, price, and condition are required'
      });
    }

    // Find the product and ensure it belongs to the seller
    const product = await Product.findOne({
      where: {
        id: productId,
        sellerId: sellerId
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you do not have permission to edit this product'
      });
    }

    // Handle image upload
    let updateData = {
      title,
      description,
      price: parseFloat(price),
      condition,
      location: location || null,
      tags: tags || null,
      dimensions: dimensions || null,
      weight: weight || null,
      material: material || null,
      color: color || null,
      brand: brand || null,
      yearMade: yearMade ? parseInt(yearMade) : null
    };

    if (req.files && req.files.length > 0) {
      updateData.imageUrl = `/uploads/products/${req.files[0].filename}`;
    }

    // Update the product
    await product.update(updateData);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;

    // Find the product and ensure it belongs to the seller
    const product = await Product.findOne({
      where: {
        id: productId,
        sellerId: sellerId
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you do not have permission to delete this product'
      });
    }

    // Delete the product
    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
};

// Get seller analytics data
const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { timeRange = '30' } = req.query; // days
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();
    console.log('🔍 Analytics request for seller ID:', sellerId, 'timeRange:', timeRange);

    // Get overview stats
    const totalProducts = await Product.count({ where: { sellerId } });
    console.log('📦 Total products for analytics:', totalProducts);
    
    // Get revenue from orders
    const revenueResult = await OrderItem.findAll({
      include: [{
        model: Product,
        where: { sellerId },
        attributes: []
      }, {
        model: Order,
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: []
      }],
      attributes: [
        [sequelize.fn('SUM', sequelize.literal('"OrderItem"."quantity" * "Product"."price"')), 'totalRevenue'],
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'totalSales']
      ],
      raw: true
    });
    console.log('💰 Analytics revenue result:', revenueResult);

    const orderRevenue = parseFloat(revenueResult[0]?.totalRevenue || 0);
    const totalSales = parseInt(revenueResult[0]?.totalSales || 0);
    console.log('💵 Analytics order revenue:', orderRevenue, 'Total sales:', totalSales);

    // Debug: Check all approved requests for this seller in time range
    const allApprovedRequests = await Request.findAll({
      where: {
        sellerId,
        status: 'approved',
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      attributes: ['id', 'itemName', 'status', 'approvedPrice', 'sellerEarnings', 'adminCommission', 'createdAt'],
      raw: true
    });
    console.log('🔍 All approved requests in analytics time range:', allApprovedRequests);

    // Get revenue from approved requests
    const requestRevenueResult = await Request.findAll({
      where: { 
        sellerId,
        status: 'approved',
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('sellerEarnings')), 'requestRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'approvedRequests']
      ],
      raw: true
    });
    console.log('📝 Analytics request revenue result:', requestRevenueResult);

    const requestRevenue = parseFloat(requestRevenueResult[0]?.requestRevenue || 0);
    const approvedRequests = parseInt(requestRevenueResult[0]?.approvedRequests || 0);
    console.log('📊 Analytics request data:', { requestRevenue, approvedRequests });
    
    // Calculate total revenue (orders + requests)
    const totalRevenue = orderRevenue + requestRevenue;
    console.log('💎 Analytics total revenue calculated:', totalRevenue);

    // Get total views and likes
    const viewsLikesResult = await Product.findAll({
      where: { sellerId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('views')), 'totalViews'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'totalLikes']
      ],
      raw: true
    });
    console.log('👀 Analytics views/likes result:', viewsLikesResult);

    const totalViews = parseInt(viewsLikesResult[0]?.totalViews || 0);
    const totalLikes = parseInt(viewsLikesResult[0]?.totalLikes || 0);
    console.log('📈 Analytics views/likes:', { totalViews, totalLikes });

    // Get top performing items
    const topPerformingItems = await Product.findAll({
      where: { sellerId },
      attributes: [
        'id', 'title', 'price', 'views', 'likes',
        [sequelize.literal('(SELECT COALESCE(SUM("OrderItems"."quantity"), 0) FROM "OrderItems" WHERE "OrderItems"."productId" = "Product"."id")'), 'sales'],
        [sequelize.literal('(SELECT COALESCE(SUM("OrderItems"."quantity" * "Product"."price"), 0) FROM "OrderItems" WHERE "OrderItems"."productId" = "Product"."id")'), 'revenue']
      ],
      order: [[sequelize.literal('sales'), 'DESC']],
      limit: 5
    });

    // Get category performance - simplified approach
    const allProducts = await Product.findAll({
      where: { sellerId },
      attributes: ['id', 'tags', 'price'],
      include: [{
        model: OrderItem,
        attributes: ['quantity'],
        required: false
      }]
    });

    // Process category performance in JavaScript
    const categoryMap = new Map();
    
    for (const product of allProducts) {
      if (product.tags) {
        const firstTag = product.tags.split(',')[0].trim();
        if (firstTag) {
          if (!categoryMap.has(firstTag)) {
            categoryMap.set(firstTag, { name: firstTag, items: 0, sales: 0, revenue: 0 });
          }
          const category = categoryMap.get(firstTag);
          category.items += 1;
          
          if (product.OrderItems && product.OrderItems.length > 0) {
            const totalQuantity = product.OrderItems.reduce((sum, item) => sum + item.quantity, 0);
            category.sales += totalQuantity;
            category.revenue += totalQuantity * parseFloat(product.price || 0);
          }
        }
      }
    }

    const categoryPerformance = Array.from(categoryMap.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    const analyticsResponseData = {
      success: true,
      data: {
        overviewStats: {
          totalRevenue: totalRevenue.toFixed(2),
          totalSales,
          totalViews,
          totalLikes
        },
        topPerformingItems: topPerformingItems.map(item => ({
          id: item.id,
          name: item.title,
          price: parseFloat(item.price),
          views: item.views || 0,
          likes: item.likes || 0,
          sales: parseInt(item.dataValues.sales) || 0,
          revenue: parseFloat(item.dataValues.revenue) || 0
        })),
        categoryPerformance: categoryPerformance.map(cat => ({
          name: cat.name || 'Uncategorized',
          items: cat.items,
          sales: cat.sales,
          revenue: cat.revenue
        }))
      }
    };
    
    console.log('🚀 Sending analytics response:', JSON.stringify(analyticsResponseData, null, 2));
    res.json(analyticsResponseData);
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
};

module.exports = {
  getSellerDashboard,
  getRecentItems,
  getSellerProducts,
  getSellerOrders,
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerAnalytics
};