const { models } = require('./testSetup');

const { Order, User } = models;

describe('Order Model', () => {
  let buyer;

  beforeEach(async () => {
    buyer = await User.create({
      firstName: 'John',
      lastName: 'Buyer',
      email: 'buyer@example.com',
      password: 'password123',
      userType: 'buyer'
    });
  });

  test('should create an order with valid data', async () => {
    const orderData = {
      orderNumber: 'ORD-001',
      totalAmount: 299.99,
      shippingAddress: '123 Main St',
      buyerId: buyer.id
    };

    const order = await Order.create(orderData);

    expect(order.id).toBeDefined();
    expect(order.orderNumber).toBe('ORD-001');
    expect(order.totalAmount).toBe('299.99');
    expect(order.status).toBe('pending');
    expect(order.paymentStatus).toBe('pending');
    expect(order.buyerId).toBe(buyer.id);
  });

  test('should require orderNumber field', async () => {
    const orderData = {
      totalAmount: 199.99,
      shippingAddress: '456 Oak Ave',
      buyerId: buyer.id
    };

    await expect(Order.create(orderData)).rejects.toThrow();
  });

  test('should update order status', async () => {
    const order = await Order.create({
      orderNumber: 'ORD-002',
      totalAmount: 399.99,
      shippingAddress: '789 Pine St',
      buyerId: buyer.id
    });

    await order.update({
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    expect(order.status).toBe('confirmed');
    expect(order.paymentStatus).toBe('paid');
  });
});