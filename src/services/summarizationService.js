const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeContent(content, contentType) {
  try {
    const prompt = `Summarize the following ${contentType}:\n\n${content}\n\nSummary:`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes content accurately and concisely." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in summarization:', error);
    throw new Error('Failed to summarize content');
  }
}

module.exports = { summarizeContent };