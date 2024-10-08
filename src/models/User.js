const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { encrypt, decrypt } = require('../utils/encryption');

const UserSchema = new mongoose.Schema({
  // ... existing fields ...
  interests: {
    type: [String],
    default: []
  },
  similarUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  // ... other fields ...
});

// ... existing methods ...

module.exports = mongoose.model('User', UserSchema);