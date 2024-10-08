const { User, Document, SearchHistory } = require('../models');

async function analyzeUserBehavior(userId) {
  const user = await User.findById(userId);
  const recentDocuments = await Document.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(20);
  const searchHistory = await SearchHistory.find({ user: userId }).sort({ timestamp: -1 }).limit(50);

  // Analyze document creation patterns
  const topKeywords = getTopKeywords(recentDocuments);
  const averageDocumentLength = calculateAverageDocumentLength(recentDocuments);

  // Analyze search patterns
  const topSearchTerms = getTopSearchTerms(searchHistory);
  const searchFrequency = calculateSearchFrequency(searchHistory);

  return {
    topKeywords,
    averageDocumentLength,
    topSearchTerms,
    searchFrequency,
    lastActive: user.lastActive
  };
}

function getTopKeywords(documents) {
  // Implement logic to extract and rank keywords from documents
  // This is a simplified version
  const keywordCounts = {};
  documents.forEach(doc => {
    doc.keywords.forEach(keyword => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
  });
  return Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword]) => keyword);
}

function calculateAverageDocumentLength(documents) {
  const totalLength = documents.reduce((sum, doc) => sum + doc.content.length, 0);
  return totalLength / documents.length;
}

function getTopSearchTerms(searchHistory) {
  const termCounts = {};
  searchHistory.forEach(search => {
    termCounts[search.query] = (termCounts[search.query] || 0) + 1;
  });
  return Object.entries(termCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([term]) => term);
}

function calculateSearchFrequency(searchHistory) {
  const msInDay = 24 * 60 * 60 * 1000;
  const oldestSearch = searchHistory[searchHistory.length - 1];
  const daysSinceOldestSearch = (Date.now() - oldestSearch.timestamp) / msInDay;
  return searchHistory.length / daysSinceOldestSearch;
}

module.exports = { analyzeUserBehavior };