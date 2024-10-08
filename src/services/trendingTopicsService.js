const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

async function getTrendingTopics() {
  const cachedTopics = cache.get('trendingTopics');
  if (cachedTopics) {
    return cachedTopics;
  }

  try {
    // This is a placeholder. You would typically use a real API for trending topics.
    const response = await axios.get('https://api.example.com/trending-topics');
    const trendingTopics = response.data.topics;
    cache.set('trendingTopics', trendingTopics);
    return trendingTopics;
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }
}

module.exports = { getTrendingTopics };