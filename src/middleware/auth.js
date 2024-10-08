const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ error: 'No token provided. Please authenticate.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Access token expired. Please refresh your token.' });
      }
      return res.status(401).json({ error: 'Invalid token. Please authenticate.' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found. Please authenticate.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

module.exports = auth;