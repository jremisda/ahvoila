const Queue = require('bull');
const { User } = require('../models');
const { syncGoogleDrive } = require('../services/googleDriveService');
const { syncNotion } = require('../services/notionService');
const { syncSlack } = require('../services/slackService');
const { syncZoomMeetings } = require('../services/zoomService');
const { syncGoogleMeetEvents } = require('../services/googleMeetService');
const { updateAnalytics } = require('../services/analyticsService');
const logger = require('../utils/logger');

const syncQueue = new Queue('integration-sync', process.env.REDIS_URL);
const retryQueue = new Queue('integration-sync-retry', process.env.REDIS_URL);

syncQueue.process(async (job) => {
  const { userId } = job.data;
  const user = await User.findById(userId);

  const services = ['googleDrive', 'notion', 'slack', 'zoom', 'googleMeet'];

  for (const service of services) {
    if (user.integrations[service]) {
      try {
        switch (service) {
          case 'googleDrive':
            await syncGoogleDrive(userId);
            break;
          case 'notion':
            await syncNotion(userId);
            break;
          case 'slack':
            await syncSlack(userId);
            break;
          case 'zoom':
            await syncZoomMeetings(userId);
            break;
          case 'googleMeet':
            await syncGoogleMeetEvents(userId);
            break;
        }
        await updateAnalytics(userId, service, 'sync');
      } catch (error) {
        logger.error(`Error syncing ${service} for user ${userId}:`, error);
        await updateAnalytics(userId, service, 'sync', null, true);
        await retryQueue.add({ userId, service }, {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 60000 // Start with 1 minute delay
          }
        });
      }
    }
  }
});

retryQueue.process(async (job) => {
  const { userId, service } = job.data;
  try {
    switch (service) {
      case 'googleDrive':
        await syncGoogleDrive(userId);
        break;
      case 'notion':
        await syncNotion(userId);
        break;
      case 'slack':
        await syncSlack(userId);
        break;
      case 'zoom':
        await syncZoomMeetings(userId);
        break;
      case 'googleMeet':
        await syncGoogleMeetEvents(userId);
        break;
    }
    await updateAnalytics(userId, service, 'sync');
    logger.info(`Successfully retried sync for ${service} (user: ${userId})`);
  } catch (error) {
    logger.error(`Error retrying sync for ${service} (user: ${userId}):`, error);
    await updateAnalytics(userId, service, 'sync', null, true);
    throw error; // This will cause Bull to retry or mark the job as failed
  }
});

function scheduleSyncJob(userId) {
  syncQueue.add({ userId }, {
    repeat: {
      cron: '0 */6 * * *' // Run every 6 hours
    }
  });
}

module.exports = { scheduleSyncJob };