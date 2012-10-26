module.exports = process.env.APP_COV
  ? require('./lib-cov/consolidation')
  : require('./lib/consolidation')