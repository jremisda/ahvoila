const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', recommendationController.getRecommendations);
router.post('/feedback', recommendationController.provideFeedback);

module.exports = router;