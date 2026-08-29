module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@eduverse/kernel$': '<rootDir>/../../../packages/kernel/src',
    '^@eduverse/database$': '<rootDir>/../../../packages/database/src',
    '^@eduverse/security$': '<rootDir>/../../../packages/security/src',
    '^@eduverse/cache$': '<rootDir>/../../../packages/cache/src',
    '^@eduverse/shared$': '<rootDir>/../../../packages/shared/src',
  }
};
