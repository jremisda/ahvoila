const { Client } = require('@notionhq/client');
const { User } = require('../models');

async function getNotionClient(userId) {
  const user = await User.findById(userId);
  if (!user.integrations.notion) {
    throw new Error('Notion not connected');
  }

  return new Client({ auth: user.integrations.notion });
}

async function searchNotion(query, userId) {
  try {
    const notion = await getNotionClient(userId);

    const response = await notion.search({
      query: query,
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      },
      page_size: 10
    });

    return response.results.map(page => ({
      id: page.id,
      title: page.properties.title?.title[0]?.plain_text || 'Untitled',
      type: 'notion',
      link: page.url,
      createdAt: page.created_time,
      updatedAt: page.last_edited_time
    }));
  } catch (error) {
    console.error('Notion search error:', error);
    throw error;
  }
}

async function syncNotion(userId) {
  try {
    const notion = await getNotionClient(userId);

    const response = await notion.search({
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      },
      page_size: 100 // Adjust as needed
    });

    // Here you would typically update your local database with the fetched pages
    // For this example, we'll just return the pages
    return response.results;
  } catch (error) {
    console.error('Notion sync error:', error);
    throw error;
  }
}

module.exports = { searchNotion, syncNotion };