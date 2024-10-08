const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');

router.use(auth);

// ... existing routes ...

router.get('/:id/view', documentController.viewDocument);
router.post('/:id/like', documentController.likeDocument);
router.post('/:id/share', documentController.shareDocument);

// ... other existing routes ...

module.exports = router;