// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,mjs}',
    '!<rootDir>/src/vendors/**',
  ],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  transform: {
    '^.+\\.(jsx|js)?$': 'babel-jest',
  },
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
    mathOps: '<rootDir>/src/__mocks__/mathops.js',
    'onboardingConfig(.*)$': '<rootDir>/src/__mocks__/stub-ob-config.js',
  },
  modulePathIgnorePatterns: ['<rootDir>/src/config/onboarding'],
  restoreMocks: true,
  testPathIgnorePatterns: ['\\\\node_modules\\\\', '<rootDir>/cypress'],
  testEnvironmentOptions: { url: 'http://localhost' },
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/cypress'],
  unmockedModulePathPatterns: ['react'],
  verbose: false,
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
