const { User, Document, UserInteraction, RecommendationFeedback } = require('../models');
const tf = require('@tensorflow/tfjs-node');
const NodeCache = require('node-cache');
const natural = require('natural');
const { TfIdf } = natural;

// ... (previous code remains the same)

async function getRecommendationsWithExplanations(userId, n = 5) {
  let model = modelCache.get('recommendationModel');
  if (!model) {
    await trainModel();
    model = modelCache.get('recommendationModel');
  }

  const user = await User.findById(userId);
  const documents = await Document.find().select('_id title content keywords');

  const userIdMap = new Map(users.map((user, index) => [user._id.toString(), index]));
  const itemIdMap = new Map(documents.map((doc, index) => [doc._id.toString(), index]));

  const userIndex = userIdMap.get(userId.toString());
  const itemIndices = Array.from(itemIdMap.values());
  const contentFeatures = documents.map(doc => model.processContent(doc.content));

  const predictions = await model.predict(userIndex, itemIndices, contentFeatures);

  const recommendedItems = predictions
    .map((score, index) => ({ score, document: documents[index] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);

  const recommendationsWithExplanations = recommendedItems.map(item => ({
    document: item.document,
    score: item.score,
    explanation: generateExplanation(user, item.document)
  }));

  return recommendationsWithExplanations;
}

function generateExplanation(user, document) {
  const reasons = [];

  // Content-based explanation
  const commonKeywords = user.interests.filter(interest => document.keywords.includes(interest));
  if (commonKeywords.length > 0) {
    reasons.push(`This document contains topics you're interested in: ${commonKeywords.join(', ')}.`);
  }

  // Collaborative filtering explanation
  const similarUsers = user.similarUsers || [];
  const interactedUsers = document.interactedUsers || [];
  const commonUsers = similarUsers.filter(u => interactedUsers.includes(u));
  if (commonUsers.length > 0) {
    reasons.push(`${commonUsers.length} user(s) with similar interests have interacted with this document.`);
  }

  // Popularity-based explanation
  if (document.viewCount > 100) {
    reasons.push(`This is a popular document with ${document.viewCount} views.`);
  }

  // Recency-based explanation
  const daysSinceCreation = (Date.now() - document.createdAt) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation < 7) {
    reasons.push("This is a recently added document.");
  }

  return reasons.join(' ');
}

async function provideFeedback(userId, documentId, feedbackType) {
  const feedback = new RecommendationFeedback({
    user: userId,
    document: documentId,
    feedbackType
  });
  await feedback.save();

  // Update user interests based on positive feedback
  if (feedbackType === 'like' || feedbackType === 'save') {
    const document = await Document.findById(documentId);
    const user = await User.findById(userId);
    const newInterests = [...new Set([...user.interests, ...document.keywords])];
    await User.findByIdAndUpdate(userId, { interests: newInterests });
  }

  // Trigger model update if enough new feedback has been collected
  const recentFeedbackCount = await RecommendationFeedback.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  if (recentFeedbackCount >= 100) {
    trainModel();
  }
}

module.exports = { 
  getRecommendationsWithExplanations, 
  trainModel, 
  evaluateRecommendations,
  provideFeedback
};