const bcrypt = require('bcryptjs');
const { User } = require('../models');
const sequelize = require('../config/database');

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const existingAdmin = await User.findOne({
      where: { email: 'admin@gmail.com' }
    });

    if (existingAdmin) {
      console.log('Deleting existing admin user...');
      await existingAdmin.destroy();
      console.log('Existing admin user deleted.');
    }

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@gmail.com',
      password: 'admin123',
      userType: 'admin',
      isActive: true,
      isVerified: true
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
    console.log('UserType: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

createAdmin();