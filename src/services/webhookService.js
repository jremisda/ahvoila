const express = require('express');
const crypto = require('crypto');
const { User } = require('../models');
const logger = require('../utils/logger');

const router = express.Router();

function verifySlackSignature(req, res, next) {
  const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
  const slackSignature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const body = JSON.stringify(req.body);

  const baseString = `v0:${timestamp}:${body}`;
  const hmac = crypto.createHmac('sha256', slackSigningSecret);
  const calculatedSignature = `v0=${hmac.update(baseString).digest('hex')}`;

  if (calculatedSignature === slackSignature) {
    next();
  } else {
    res.status(400).send('Invalid signature');
  }
}

router.post('/slack', verifySlackSignature, async (req, res) => {
  try {
    const { event } = req.body;
    // Process the Slack event
    // For example, if it's a new message:
    if (event.type === 'message') {
      // Update the user's Slack data
      const user = await User.findOne({ 'integrations.slack.teamId': event.team });
      if (user) {
        // Process and store the new message
        // This is just a placeholder - you'd implement your actual logic here
        logger.info(`Received new Slack message for user ${user._id}`);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    logger.error('Error processing Slack webhook:', error);
    res.sendStatus(500);
  }
});

// Add similar routes for other services that support webhooks

module.exports = router;