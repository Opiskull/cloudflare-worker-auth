module.exports = {
  // [...]
  // Replace `ts-jest` with the preset you want to use
  // from the above list
  automock: false,
  preset: 'ts-jest',
  collectCoverage: true,
  coverageReporters: ['lcov'],
  setupFilesAfterEnv: ['./jest.setup.js'],
}
