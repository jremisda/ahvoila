const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/status', integrationController.getIntegrationStatus);
router.post('/google-drive/connect', integrationController.connectGoogleDrive);
router.post('/notion/connect', integrationController.connectNotion);
router.post('/slack/connect', integrationController.connectSlack);
router.post('/zoom/connect', integrationController.connectZoom);
router.post('/google-meet/connect', integrationController.connectGoogleMeet);
router.delete('/google-drive/disconnect', integrationController.disconnectGoogleDrive);
router.delete('/notion/disconnect', integrationController.disconnectNotion);
router.delete('/slack/disconnect', integrationController.disconnectSlack);
router.delete('/zoom/disconnect', integrationController.disconnectZoom);
router.delete('/google-meet/disconnect', integrationController.disconnectGoogleMeet);
router.post('/sync', integrationController.syncIntegrations);
router.get('/search', integrationController.searchAcrossIntegrations);

module.exports = router;