const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', searchController.search);
router.get('/history', searchController.getSearchHistory);
router.get('/saved', searchController.getSavedSearches);
router.post('/save', searchController.saveSearch);
router.delete('/saved/:id', searchController.deleteSavedSearch);

module.exports = router;