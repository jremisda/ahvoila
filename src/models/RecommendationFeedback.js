const mongoose = require('mongoose');

const RecommendationFeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  feedbackType: {
    type: String,
    enum: ['like', 'dislike', 'save', 'ignore'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecommendationFeedback', RecommendationFeedbackSchema);