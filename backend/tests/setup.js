const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  jest.clearAllMocks();
});