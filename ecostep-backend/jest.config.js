export default {
  testEnvironment: 'node',
  transform: { '^.+\\.js$': 'babel-jest' },
  collectCoverageFrom: ['controllers/**/*.js', 'lib/**/*.js', 'middleware/**/*.js'],
  coverageThreshold: { global: { lines: 60 } }
}
