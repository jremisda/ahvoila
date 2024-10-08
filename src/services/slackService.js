const { WebClient } = require('@slack/web-api');
const { User } = require('../models');

async function getSlackClient(userId) {
  const user = await User.findById(userId);
  if (!user.integrations.slack) {
    throw new Error('Slack not connected');
  }

  return new WebClient(user.integrations.slack);
}

async function searchSlack(query, userId) {
  try {
    const slack = await getSlackClient(userId);

    const result = await slack.search.messages({
      query: query,
      sort: 'timestamp',
      sort_dir: 'desc',
      count: 10
    });

    return result.messages.matches.map(message => ({
      id: message.iid,
      title: message.text,
      type: 'slack',
      link: message.permalink,
      createdAt: new Date(message.ts * 1000).toISOString(),
      updatedAt: new Date(message.ts * 1000).toISOString()
    }));
  } catch (error) {
    console.error('Slack search error:', error);
    throw error;
  }
}

async function syncSlack(userId) {
  try {
    const slack = await getSlackClient(userId);

    // Fetch recent messages from all accessible channels
    const channelsResponse = await slack.conversations.list();
    const messages = [];

    for (const channel of channelsResponse.channels) {
      const historyResponse = await slack.conversations.history({
        channel: channel.id,
        limit: 100 // Adjust as needed
      });
      messages.push(...historyResponse.messages);
    }

    // Here you would typically update your local database with the fetched messages
    // For this example, we'll just return the messages
    return messages;
  } catch (error) {
    console.error('Slack sync error:', error);
    throw error;
  }
}

module.exports = { searchSlack, syncSlack };