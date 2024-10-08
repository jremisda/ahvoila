const { google } = require('googleapis');
const axios = require('axios');
const { User } = require('../models');
const config = require('../config/config');

async function refreshGoogleToken(userId, service) {
  const user = await User.findById(userId);
  const tokens = JSON.parse(user.integrations[service]);

  const oauth2Client = new google.auth.OAuth2(
    config[`${service}ClientId`],
    config[`${service}ClientSecret`],
    config[`${service}RedirectUri`]
  );

  oauth2Client.setCredentials(tokens);

  const { tokens: newTokens } = await oauth2Client.refreshAccessToken();
  user.integrations[service] = JSON.stringify(newTokens);
  await user.save();

  return newTokens;
}

async function refreshSlackToken(userId) {
  const user = await User.findById(userId);
  const tokens = JSON.parse(user.integrations.slack);

  const response = await axios.post('https://slack.com/api/oauth.v2.access', {
    client_id: config.slackClientId,
    client_secret: config.slackClientSecret,
    refresh_token: tokens.refresh_token,
    grant_type: 'refresh_token'
  });

  const newTokens = response.data;
  user.integrations.slack = JSON.stringify(newTokens);
  await user.save();

  return newTokens;
}

// Add similar refresh functions for other services that support token refresh

module.exports = {
  refreshGoogleToken,
  refreshSlackToken,
  // ... other refresh functions ...
};