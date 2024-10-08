const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

exports.validateProfileUpdate = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('jobTitle').optional().trim(),
  body('department').optional().trim(),
  body('profilePicture').optional().isURL().withMessage('Invalid URL for profile picture'),
];

exports.validateSettingsUpdate = [
  body('theme').isIn(['light', 'dark']).withMessage('Invalid theme'),
  body('notifications.email').isBoolean().withMessage('Invalid email notification setting'),
  body('notifications.push').isBoolean().withMessage('Invalid push notification setting'),
];

exports.validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, jobTitle, department, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, jobTitle, department, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { theme, notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { settings: { theme, notifications } },
      { new: true, runValidators: true }
    ).select('settings');
    res.json(user.settings);
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// ... (keep other existing methods)