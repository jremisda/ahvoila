const mongoose = require('mongoose');

const ActionItemSchema = new mongoose.Schema({
  description: String,
  assignee: String,
  completed: {
    type: Boolean,
    default: false
  }
});

const MeetingVersionSchema = new mongoose.Schema({
  topic: String,
  summary: String,
  transcript: String,
  actionItems: [ActionItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const MeetingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  zoomMeetingId: {
    type: String,
    required: true,
  },
  topic: String,
  startTime: Date,
  duration: Number,
  platform: String,
  transcript: String,
  summary: String,
  actionItems: [ActionItemSchema],
  versions: [MeetingVersionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Meeting', MeetingSchema);