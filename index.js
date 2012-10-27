//This is needed for coverage testing
module.exports = process.env.APP_COV
  ? require('./app-cov/consolidation')
  : require('./app/consolidation')