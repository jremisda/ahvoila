const NodeCache = require('node-cache');
const OpenAI = require('openai');
const { Document, User } = require('../models');
const { analyzeUserBehavior } = require('./userBehaviorService');
const { getTrendingTopics } = require('./trendingTopicsService');
const { getRecommendations } = require('./mlRecommendationService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const suggestionCache = new NodeCache({ stdTTL: 3600 }); // Cache suggestions for 1 hour

async function generateContentSuggestions(userId) {
  const cacheKey = `suggestions_${userId}`;
  const cachedSuggestions = suggestionCache.get(cacheKey);

  if (cachedSuggestions) {
    return cachedSuggestions;
  }

  const userContext = await getUserContext(userId);
  const userBehavior = await analyzeUserBehavior(userId);
  const trendingTopics = await getTrendingTopics();
  const mlRecommendations = await getRecommendations(userId);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant that provides personalized content suggestions based on user context, behavior, trending topics, and machine learning recommendations." },
        { role: "user", content: `Based on the following information, provide 5-7 content suggestions:
          User Context: ${JSON.stringify(userContext)}
          User Behavior: ${JSON.stringify(userBehavior)}
          Trending Topics: ${JSON.stringify(trendingTopics)}
          ML Recommendations: ${JSON.stringify(mlRecommendations)}
        ` }
      ],
      max_tokens: 300
    });

    const suggestions = response.choices[0].message.content.trim().split('\n');
    suggestionCache.set(cacheKey, suggestions);
    return suggestions;
  } catch (error) {
    console.error('OpenAI content suggestion error:', error);
    return ["Unable to generate content suggestions due to an error."];
  }
}

// ... rest of the file remains the same