module.exports = {
  // root dir
  // this is from all paths will be calculated,
  // it also specify location of your .spec files!!
  // @default '../src/'
  rootDir: '../src/',
  // should stop after error ?
  // keep it off, or you won't see any console.logs!!
  // @default: false
  bail: false,
  // verbose output
  // @default: true
  verbose: true,
  // collect coverage
  // @default: true
  collectCoverage: true,
  // collect coverage from
  // specify what has impact on coverage stats
  // @default: true
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  reporters: [
    'default',
  ],
  // coverage reporter
  // generate html as output
  // @default: html
  coverageReporters: [
    'html', 'json',
  ],
  // where to store coverage output
  coverageDirectory: '../coverage',
  // collect threshold
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  // test environment
  // @default: 'jsdom'
  testEnvironment: 'node',
  // framework file
  setupTestFrameworkScriptFile: '../test/framework-config.js',
  // transform
  // transformers to help jest understand es6, skip on css/scss files and others
  transform: {
    '^.+.(js|jsx)$': 'babel-jest',
  },
};
