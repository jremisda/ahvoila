const OpenAI = require('openai');
const Meeting = require('../models/Meeting');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function processMeetingTranscript(meetingId) {
  const meeting = await Meeting.findById(meetingId);
  if (!meeting || !meeting.transcript) {
    throw new Error('Meeting not found or transcript not available');
  }

  const summary = await generateSummary(meeting.transcript);
  const actionItems = await extractActionItems(meeting.transcript);

  meeting.summary = summary;
  meeting.actionItems = actionItems;
  await meeting.save();

  return { summary, actionItems };
}

async function generateSummary(transcript) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant that summarizes meeting transcripts." },
      { role: "user", content: `Please summarize the following meeting transcript:\n\n${transcript}` }
    ],
    max_tokens: 500
  });

  return response.choices[0].message.content.trim();
}

async function extractActionItems(transcript) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant that extracts action items from meeting transcripts." },
      { role: "user", content: `Please extract action items from the following meeting transcript. Format each action item as a JSON object with 'description' and 'assignee' fields:\n\n${transcript}` }
    ],
    max_tokens: 500
  });

  const actionItemsText = response.choices[0].message.content.trim();
  return JSON.parse(actionItemsText);
}

module.exports = {
  processMeetingTranscript,
};