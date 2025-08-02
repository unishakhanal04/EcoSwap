const { validationResult } = require('express-validator');
const { Product, User, Category, ProductImage, Review } = require('../models');
const { Op } = require('sequelize');

const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title, description, price, condition, location, tags,
      dimensions, weight, material, color, brand, yearMade, categoryId
    } = req.body;

    const product = await Product.create({
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
      categoryId,
      sellerId: req.user.id
    });

    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) => {
        return ProductImage.create({
          imageUrl: `/uploads/products/${file.filename}`,
          isPrimary: index === 0,
          productId: product.id
        });
      });
      await Promise.all(imagePromises);
    }

    const productWithImages = await Product.findByPk(product.id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'rating'] },
        { model: Category }
      ]
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: productWithImages
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      condition,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status: 'active', isApproved: true };

    if (category) {
      where.categoryId = category;
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        { model: ProductImage, as: 'images' },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'rating'] },
        { model: Category }
      ],
      order: [[sortBy, sortOrder]],
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
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'rating', 'totalSales'] },
        { model: Category },
        {
          model: Review,
          as: 'reviews',
          include: [{ model: User, as: 'buyer', attributes: ['firstName', 'lastName'] }]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.update(
      { views: product.views + 1 },
      { where: { id } }
    );

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const offset = (page - 1) * limit;
    const where = { sellerId: req.user.id };

    if (status) {
      where.status = status;
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        { model: ProductImage, as: 'images' },
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
    console.error('Get seller products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, price, condition, location, tags,
      dimensions, weight, material, color, brand, yearMade, categoryId, status
    } = req.body;

    const product = await Product.findOne({
      where: { id, sellerId: req.user.id }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await Product.update({
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
      categoryId,
      status
    }, {
      where: { id }
    });

    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'rating'] },
        { model: Category }
      ]
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, sellerId: req.user.id }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await Product.destroy({ where: { id } });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRecentProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const products = await Product.findAll({
      where: { status: 'active', isApproved: true },
      include: [
        { model: ProductImage, as: 'images' },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'rating'] },
        { model: Category }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get recent products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  getRecentProducts
};