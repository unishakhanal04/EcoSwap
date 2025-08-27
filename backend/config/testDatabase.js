const { Sequelize } = require('sequelize');

const testSequelize = new Sequelize('shop_model_test', 'postgres', '33533', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = testSequelize;