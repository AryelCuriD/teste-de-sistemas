const metricsService = require('../services/metricsService');

const getMetrics = async (req, res, next) => {
  try {
    const metrics = await metricsService.getMetrics();
    return res.json(metrics);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMetrics
};
