const { google } = require('googleapis');
const { User } = require('../models');

async function getGoogleMeetAuth(userId) {
  const user = await User.findById(userId);
  if (!user.integrations.googleMeet) {
    throw new Error('Google Meet not connected');
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(user.integrations.googleMeet);

  return oauth2Client;
}

async function searchGoogleMeetEvents(query, userId) {
  try {
    const auth = await getGoogleMeetAuth(userId);
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      q: query
    });

    return response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      type: 'google_meet',
      link: event.hangoutLink,
      createdAt: event.created,
      startTime: event.start.dateTime || event.start.date
    }));
  } catch (error) {
    console.error('Google Meet search error:', error);
    throw error;
  }
}

async function syncGoogleMeetEvents(userId) {
  try {
    const auth = await getGoogleMeetAuth(userId);
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 100, // Adjust as needed
      singleEvents: true,
      orderBy: 'startTime'
    });

    // Here you would typically update your local database with the fetched events
    // For this example, we'll just return the events
    return response.data.items;
  } catch (error) {
    console.error('Google Meet sync error:', error);
    throw error;
  }
}

module.exports = { searchGoogleMeetEvents, syncGoogleMeetEvents };