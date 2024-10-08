const mongoose = require('mongoose');

const IntegrationAnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  integration: {
    type: String,
    required: true,
    enum: ['googleDrive', 'notion', 'slack', 'zoom', 'googleMeet']
  },
  lastSync: Date,
  totalSyncs: {
    type: Number,
    default: 0
  },
  totalQueries: {
    type: Number,
    default: 0
  },
  averageQueryTime: Number,
  errorCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('IntegrationAnalytics', IntegrationAnalyticsSchema);