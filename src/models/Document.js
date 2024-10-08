const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  // ... existing fields ...
  keywords: {
    type: [String],
    index: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  interactedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  // ... other fields ...
});

// ... existing methods ...

module.exports = mongoose.model('Document', DocumentSchema);