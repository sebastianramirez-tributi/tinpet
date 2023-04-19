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
  setupFiles: ['<rootDir>/src/__mocks__/env-variables.js'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  transform: {
    '^.+\\.(jsx|js)?$': 'babel-jest',
  },
  moduleDirectories: ['node_modules'],
  modulePathIgnorePatterns: ['<rootDir>/src/config/onboarding'],
  restoreMocks: true,
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: { url: 'http://localhost' },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  unmockedModulePathPatterns: ['react'],
  verbose: false,
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
    // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    //   '<rootDir>/src/__mocks__/fileMock.js',
    mathOps: '<rootDir>/src/__mocks__/mathops.js',
    appContext: '<rootDir>/src/__mocks__/app-context.js',
    'onboardingConfig(.*)$': '<rootDir>/src/__mocks__/stub-ob-config.js',
  },
}
