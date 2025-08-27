const { models } = require('./testSetup');

const { Product, User, Category } = models;

describe('Product Model', () => {
  let seller, category;

  beforeEach(async () => {
    seller = await User.create({
      firstName: 'John',
      lastName: 'Seller',
      email: 'seller@example.com',
      password: 'password123',
      userType: 'seller'
    });

    category = await Category.create({
      name: 'Electronics',
      description: 'Electronic items'
    });
  });

  test('should create a product with valid data', async () => {
    const productData = {
      title: 'iPhone 12',
      description: 'Excellent condition iPhone 12',
      price: 599.99,
      condition: 'Excellent',
      sellerId: seller.id,
      categoryId: category.id
    };

    const product = await Product.create(productData);

    expect(product.id).toBeDefined();
    expect(product.title).toBe('iPhone 12');
    expect(product.description).toBe('Excellent condition iPhone 12');
    expect(product.price).toBe('599.99');
    expect(product.condition).toBe('Excellent');
    expect(product.status).toBe('active');
    expect(product.sellerId).toBe(seller.id);
  });

  test('should require title field', async () => {
    const productData = {
      description: 'Great product',
      price: 299.99,
      condition: 'Good',
      sellerId: seller.id
    };

    await expect(Product.create(productData)).rejects.toThrow();
  });

  test('should update product fields', async () => {
    const product = await Product.create({
      title: 'Old Title',
      description: 'Old description',
      price: 100.00,
      condition: 'Good',
      sellerId: seller.id
    });

    await product.update({
      title: 'New Title',
      price: 150.00
    });

    expect(product.title).toBe('New Title');
    expect(product.price).toBe('150.00');
  });
});