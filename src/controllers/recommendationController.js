const { getRecommendationsWithExplanations, provideFeedback } = require('../services/mlRecommendationService');

exports.getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const recommendations = await getRecommendationsWithExplanations(userId);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
};

exports.provideFeedback = async (req, res, next) => {
  try {
    const { documentId, feedbackType } = req.body;
    const userId = req.user._id;
    await provideFeedback(userId, documentId, feedbackType);
    res.json({ message: 'Feedback recorded successfully' });
  } catch (error) {
    next(error);
  }
};