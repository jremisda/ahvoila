const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/suggestions', contentController.getSuggestions);
router.post('/feedback', contentController.provideFeedback);
router.post('/quotes', contentController.getRelevantQuotes);

module.exports = router;