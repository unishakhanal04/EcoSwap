const testSequelize = require('../../config/testDatabase');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const User = testSequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'buyer',
    validate: {
      isIn: [['buyer', 'seller', 'admin']]
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

const Category = testSequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

const Product = testSequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Like New', 'Excellent', 'Good', 'Fair', 'Needs Repair']]
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'sold', 'inactive', 'pending']]
    }
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

const Order = testSequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded']]
    }
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'paid', 'failed', 'refunded']]
    }
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
User.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });

Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

const models = {
  User,
  Product,
  Category,
  Order
};

beforeAll(async () => {
  try {
    await testSequelize.authenticate();
    
    await testSequelize.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await testSequelize.query('CREATE SCHEMA public;');
    
    await testSequelize.sync({ force: true });
  } catch (error) {
    console.error('Unable to connect to test database:', error);
    throw error;
  }
});

beforeEach(async () => {
  await testSequelize.truncate({ cascade: true, restartIdentity: true });
});

afterAll(async () => {
  await testSequelize.close();
});

module.exports = {
  testSequelize,
  models
};