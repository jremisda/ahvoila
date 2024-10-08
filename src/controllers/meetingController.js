const { getUpcomingMeetings, joinMeeting } = require('../services/zoomService');
const { transcribeAudio } = require('../services/transcriptionService');
const { processMeetingTranscript } = require('../services/meetingProcessingService');
const Meeting = require('../models/Meeting');

// ... existing code ...

exports.updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { topic, summary, transcript, actionItems } = req.body;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Create a new version
    const newVersion = {
      topic: meeting.topic,
      summary: meeting.summary,
      transcript: meeting.transcript,
      actionItems: meeting.actionItems,
      updatedAt: new Date(),
      updatedBy: req.user._id
    };

    // Update the meeting
    meeting.topic = topic;
    meeting.summary = summary;
    meeting.transcript = transcript;
    meeting.actionItems = actionItems;
    meeting.versions.push(newVersion);

    await meeting.save();
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meeting' });
  }
};

exports.getMeetingVersions = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id).populate('versions.updatedBy', 'name');
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json(meeting.versions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meeting versions' });
  }
};

exports.revertToVersion = async (req, res) => {
  try {
    const { id, versionId } = req.params;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const version = meeting.versions.id(versionId);

    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }

    // Create a new version with current data
    const newVersion = {
      topic: meeting.topic,
      summary: meeting.summary,
      transcript: meeting.transcript,
      actionItems: meeting.actionItems,
      updatedAt: new Date(),
      updatedBy: req.user._id
    };

    // Revert meeting to the selected version
    meeting.topic = version.topic;
    meeting.summary = version.summary;
    meeting.transcript = version.transcript;
    meeting.actionItems = version.actionItems;

    // Add the current state as a new version before reverting
    meeting.versions.push(newVersion);

    await meeting.save();
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to revert to version' });
  }
};

// ... existing code ...