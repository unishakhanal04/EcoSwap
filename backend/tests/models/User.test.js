const { models } = require('./testSetup');
const bcrypt = require('bcryptjs');

const { User } = models;

describe('User Model', () => {
  test('should create a user with valid data', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      userType: 'buyer'
    };

    const user = await User.create(userData);

    expect(user.id).toBeDefined();
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.userType).toBe('buyer');
    expect(user.password).not.toBe('password123');
  });

  test('should require email field', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should hash password before saving', async () => {
    const userData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'mypassword'
    };

    const user = await User.create(userData);
    const isPasswordHashed = await bcrypt.compare('mypassword', user.password);
    
    expect(isPasswordHashed).toBe(true);
    expect(user.password).not.toBe('mypassword');
  });
});