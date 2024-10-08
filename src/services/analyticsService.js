const IntegrationAnalytics = require('../models/IntegrationAnalytics');

async function updateAnalytics(userId, integration, action, duration = null, isError = false) {
  try {
    let analytics = await IntegrationAnalytics.findOne({ user: userId, integration });
    
    if (!analytics) {
      analytics = new IntegrationAnalytics({ user: userId, integration });
    }

    if (action === 'sync') {
      analytics.lastSync = new Date();
      analytics.totalSyncs += 1;
    } else if (action === 'query') {
      analytics.totalQueries += 1;
      if (duration) {
        analytics.averageQueryTime = (analytics.averageQueryTime * (analytics.totalQueries - 1) + duration) / analytics.totalQueries;
      }
    }

    if (isError) {
      analytics.errorCount += 1;
    }

    await analytics.save();
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}

module.exports = { updateAnalytics };