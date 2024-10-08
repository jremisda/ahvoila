const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const auth = require('../middleware/auth');

router.use(auth);

// ... existing routes ...

router.put('/:id', meetingController.updateMeeting);
router.get('/:id/versions', meetingController.getMeetingVersions);
router.post('/:id/revert/:versionId', meetingController.revertToVersion);

// ... other existing routes ...

module.exports = router;