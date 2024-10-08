const { optimizeQuery } = require('../utils/queryOptimizer');

const queryOptimizerMiddleware = (req, res, next) => {
  if (req.query) {
    req.query = optimizeQuery(req.query);
  }
  next();
};

module.exports = queryOptimizerMiddleware;