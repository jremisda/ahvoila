const { unifiedSearch } = require('../services/unifiedSearchService');
const User = require('../models/User');
const SavedSearch = require('../models/SavedSearch');

// ... existing search and getSearchHistory methods ...

exports.getSavedSearches = async (req, res, next) => {
  try {
    const savedSearches = await SavedSearch.find({ user: req.user._id });
    res.json(savedSearches);
  } catch (error) {
    next(error);
  }
};

exports.saveSearch = async (req, res, next) => {
  try {
    const { name, query } = req.body;
    const savedSearch = new SavedSearch({
      name,
      query,
      user: req.user._id
    });
    await savedSearch.save();
    res.status(201).json(savedSearch);
  } catch (error) {
    next(error);
  }
};

exports.deleteSavedSearch = async (req, res, next) => {
  try {
    const { id } = req.params;
    await SavedSearch.findOneAndDelete({ _id: id, user: req.user._id });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};