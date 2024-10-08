const axios = require('axios');
const { User } = require('../models');
const { encrypt, decrypt } = require('../utils/encryption');

async function getZoomToken(userId) {
  const user = await User.findById(userId);
  if (!user.integrations.zoom) {
    throw new Error('Zoom not connected');
  }

  const decryptedToken = decrypt(user.integrations.zoom);
  const { access_token, refresh_token, expires_at } = JSON.parse(decryptedToken);

  if (Date.now() >= expires_at) {
    const newTokens = await refreshZoomToken(refresh_token);
    await updateZoomTokens(userId, newTokens);
    return newTokens.access_token;
  }

  return access_token;
}

async function refreshZoomToken(refreshToken) {
  const response = await axios.post('https://zoom.us/oauth/token', null, {
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.ZOOM_CLIENT_ID,
      client_secret: process.env.ZOOM_CLIENT_SECRET,
    },
  });

  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    expires_at: Date.now() + response.data.expires_in * 1000,
  };
}

async function updateZoomTokens(userId, tokens) {
  const user = await User.findById(userId);
  user.integrations.zoom = encrypt(JSON.stringify(tokens));
  await user.save();
}

async function getUpcomingMeetings(userId) {
  const token = await getZoomToken(userId);
  const response = await axios.get('https://api.zoom.us/v2/users/me/meetings', {
    headers: { Authorization: `Bearer ${token}` },
    params: { type: 'scheduled', page_size: 100 },
  });

  return response.data.meetings;
}

async function joinMeeting(userId, meetingId) {
  const token = await getZoomToken(userId);
  const response = await axios.get(`https://api.zoom.us/v2/meetings/${meetingId}/join`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.join_url;
}

module.exports = {
  getUpcomingMeetings,
  joinMeeting,
};