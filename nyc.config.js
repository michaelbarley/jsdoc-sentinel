module.exports = {
  all: true,
  extension: ['.ts'],
  include: ['src/**/*.ts'],
  reporter: ['text', 'lcov'],
  checkCoverage: true,
  lines: 100,
  branches: 100,
  functions: 100,
  statements: 100
};
