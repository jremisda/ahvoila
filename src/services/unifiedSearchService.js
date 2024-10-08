const { searchDocuments } = require('./elasticsearchService');
const { searchGoogleDrive } = require('./googleDriveService');
const { searchNotion } = require('./notionService');
const { searchSlack } = require('./slackService');
const { summarizeResults } = require('./openaiService');
const cache = require('./cacheService');

async function unifiedSearch(query, userId, filters) {
  const cacheKey = `${userId}:${query}:${JSON.stringify(filters)}`;
  const cachedResults = cache.get(cacheKey);

  if (cachedResults) {
    return cachedResults;
  }

  try {
    const searchPromises = [];

    if (filters.documents) {
      searchPromises.push(searchDocuments(query, userId, filters));
    }
    if (filters.googleDrive) {
      searchPromises.push(searchGoogleDrive(query, userId, filters));
    }
    if (filters.notion) {
      searchPromises.push(searchNotion(query, userId, filters));
    }
    if (filters.slack) {
      searchPromises.push(searchSlack(query, userId, filters));
    }

    const results = await Promise.all(searchPromises);
    let allResults = results.flat();

    // Apply file type filter
    if (filters.fileTypes.length > 0) {
      allResults = allResults.filter(result => filters.fileTypes.includes(result.fileType));
    }

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      allResults = allResults.filter(result => {
        const resultDate = new Date(result.updatedAt);
        return resultDate >= filters.startDate && resultDate <= filters.endDate;
      });
    }

    // Apply sorting
    if (filters.sortBy === 'date') {
      allResults.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (filters.sortBy === 'title') {
      allResults.sort((a, b) => a.title.localeCompare(b.title));
    }
    // 'relevance' sorting is assumed to be the default from each service

    const summary = await summarizeResults(query, allResults);

    const finalResults = {
      summary,
      results: allResults.slice(0, 20) // Limit to top 20 results
    };

    cache.set(cacheKey, finalResults, 300); // Cache for 5 minutes

    return finalResults;
  } catch (error) {
    console.error('Unified search error:', error);
    throw error;
  }
}

module.exports = { unifiedSearch };