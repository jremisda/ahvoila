const { google } = require('googleapis');
const { User } = require('../models');

async function getGoogleDriveAuth(userId) {
  const user = await User.findById(userId);
  if (!user.integrations.googleDrive) {
    throw new Error('Google Drive not connected');
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(user.integrations.googleDrive);

  return oauth2Client;
}

async function searchGoogleDrive(query, userId) {
  try {
    const auth = await getGoogleDriveAuth(userId);
    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.list({
      q: `fullText contains '${query}'`,
      fields: 'files(id, name, mimeType, webViewLink, createdTime, modifiedTime)',
      orderBy: 'modifiedTime desc',
      pageSize: 10
    });

    return response.data.files.map(file => ({
      id: file.id,
      title: file.name,
      type: 'google_drive',
      mimeType: file.mimeType,
      link: file.webViewLink,
      createdAt: file.createdTime,
      updatedAt: file.modifiedTime
    }));
  } catch (error) {
    console.error('Google Drive search error:', error);
    throw error;
  }
}

async function syncGoogleDrive(userId) {
  try {
    const auth = await getGoogleDriveAuth(userId);
    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.list({
      fields: 'files(id, name, mimeType, webViewLink, createdTime, modifiedTime)',
      orderBy: 'modifiedTime desc',
      pageSize: 100 // Adjust as needed
    });

    // Here you would typically update your local database with the fetched files
    // For this example, we'll just return the files
    return response.data.files;
  } catch (error) {
    console.error('Google Drive sync error:', error);
    throw error;
  }
}

module.exports = { searchGoogleDrive, syncGoogleDrive };