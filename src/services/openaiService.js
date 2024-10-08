const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function summarizeResults(query, results) {
  try {
    const prompt = `Summarize the following search results for the query "${query}":\n\n${results.map(r => `- ${r.title}`).join('\n')}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes search results." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI summarization error:', error);
    return "Unable to generate summary due to an error.";
  }
}

module.exports = { summarizeResults };