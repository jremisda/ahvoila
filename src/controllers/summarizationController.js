const { summarizeContent } = require('../services/summarizationService');

exports.summarizeContent = async (req, res, next) => {
  try {
    const { content, contentType } = req.body;

    if (!content || !contentType) {
      return res.status(400).json({ message: 'Content and content type are required' });
    }

    const summary = await summarizeContent(content, contentType);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
};