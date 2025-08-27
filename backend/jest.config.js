module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 30000,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**'
  ],
  projects: [
    {
      displayName: 'models',
      testMatch: ['<rootDir>/tests/models/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/models/testSetup.js']
    },
    {
      displayName: 'other',
      testMatch: ['<rootDir>/tests/**/*.test.js', '!<rootDir>/tests/models/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
    }
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true
};