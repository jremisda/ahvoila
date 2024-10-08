const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ... existing code ...

exports.getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Error in getStatus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ... rest of the existing code ...