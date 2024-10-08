const { generateContentSuggestions, extractRelevantQuotes } = require('../services/contentSuggestionService');
const { trainModel } = require('../services/mlRecommendationService');
const User = require('../models/User');

exports.getSuggestions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { showTrending } = req.query;
    const suggestions = await generateContentSuggestions(userId, showTrending === 'true');
    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
};

exports.provideFeedback = async (req, res, next) => {
  try {
    const { suggestionId, feedback } = req.body;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      $push: {
        suggestionFeedback: {
          suggestionId,
          feedback,
          timestamp: new Date()
        }
      }
    });

    // Retrain the model after receiving new feedback
    await trainModel();

    res.json({ message: 'Feedback recorded successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getRelevantQuotes = async (req, res, next) => {
  try {
    const { content, context } = req.body;
    const quotes = await extractRelevantQuotes(content, context);
    res.json({ quotes });
  } catch (error) {
    next(error);
  }
};