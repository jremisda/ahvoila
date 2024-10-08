const cron = require('node-cron');
const { trainModel, evaluateRecommendations } = require('../services/mlRecommendationService');
const { UserInteraction, Document } = require('../models');
const logger = require('../utils/logger');

// Schedule the batch training job to run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  try {
    logger.info('Starting batch training of recommendation model');
    await trainModel();
    logger.info('Batch training of recommendation model completed successfully');

    // Evaluate the model
    const testInteractions = await UserInteraction.find().sort({ timestamp: -1 }).limit(1000);
    const documents = await Document.find().select('_id content');

    const actualRatings = testInteractions.map(interaction => calculateRating(interaction));
    const predictedRatings = await Promise.all(testInteractions.map(async interaction => {
      const recommendations = await getRecommendations(interaction.user, 1);
      return recommendations[0] ? recommendations[0].score : 0;
    }));

    const metrics = evaluateRecommendations(actualRatings, predictedRatings);
    logger.info('Model evaluation metrics:', metrics);

  } catch (error) {
    logger.error('Error during batch training of recommendation model:', error);
  }
});

function calculateRating(interaction) {
  switch (interaction.interactionType) {
    case 'create':
      return 5;
    case 'like':
      return 4;
    case 'share':
      return 3;
    case 'view':
      return Math.min(interaction.duration / 60, 2) + 1; // 1-3 based on duration (max 2 minutes)
    default:
      return 1;
  }
}