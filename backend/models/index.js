const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const Category = require('./Category');
const ProductImage = require('./ProductImage');
const Request = require('./Request');

User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

User.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Review, { foreignKey: 'buyerId', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

User.hasMany(Review, { foreignKey: 'sellerId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Request, { foreignKey: 'buyerId', as: 'buyerRequests' });
Request.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

User.hasMany(Request, { foreignKey: 'sellerId', as: 'sellerRequests' });
Request.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Review,
  Category,
  ProductImage,
  Request
};