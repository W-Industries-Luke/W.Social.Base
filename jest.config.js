module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/projects/w-social-base/src/test.ts'],
  testEnvironment: 'jsdom',
  rootDir: '.',
  testMatch: ['<rootDir>/projects/w-social-base/src/**/*.spec.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  collectCoverageFrom: [
    'projects/w-social-base/src/**/*.ts',
    '!projects/w-social-base/src/**/*.spec.ts',
    '!projects/w-social-base/src/test.ts',
    '!projects/w-social-base/src/public-api.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text-summary', 'lcov'],
  moduleNameMapper: {
    '^w-social-base': '<rootDir>/projects/w-social-base/src/public-api.ts'
  },
  transform: {
    '^.+\\.(ts|js|html)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }],
  }
};