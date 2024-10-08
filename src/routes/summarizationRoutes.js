const express = require('express');
const router = express.Router();
const summarizationController = require('../controllers/summarizationController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/summarize', summarizationController.summarizeContent);

module.exports = router;