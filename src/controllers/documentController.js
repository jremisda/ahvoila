// ... existing imports ...
const UserInteraction = require('../models/UserInteraction');

// ... existing code ...

exports.viewDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Record the view interaction
    await UserInteraction.create({
      user: userId,
      document: id,
      interactionType: 'view'
    });

    res.json(document);
  } catch (error) {
    next(error);
  }
};

exports.likeDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Record the like interaction
    await UserInteraction.create({
      user: userId,
      document: id,
      interactionType: 'like'
    });

    res.json({ message: 'Document liked successfully' });
  } catch (error) {
    next(error);
  }
};

exports.shareDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, permission } = req.body;
    const userId = req.user._id;

    const document = await Document.findOne({ _id: id, createdBy: userId });
    if (!document) {
      return res.status(404).json({ message: 'Document not found or you do not have permission to share it' });
    }

    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingShare = document.sharedWith.find(share => share.user.toString() === userToShare._id.toString());
    if (existingShare) {
      existingShare.permission = permission;
    } else {
      document.sharedWith.push({ user: userToShare._id, permission });
    }

    await document.save();

    // Record the share interaction
    await UserInteraction.create({
      user: userId,
      document: id,
      interactionType: 'share'
    });

    res.json({ message: 'Document shared successfully' });
  } catch (error) {
    next(error);
  }
};

// ... other existing methods ...