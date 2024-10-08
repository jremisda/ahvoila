const speech = require('@google-cloud/speech');
const { Readable } = require('stream');

const client = new speech.SpeechClient();

async function transcribeAudio(audioBuffer) {
  const audioStream = new Readable();
  audioStream.push(audioBuffer);
  audioStream.push(null);

  const request = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
    interimResults: false,
  };

  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', (data) => {
      const transcription = data.results
        .map((result) => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
      // Here you would save the transcription to your database
    });

  audioStream.pipe(recognizeStream);
}

module.exports = {
  transcribeAudio,
};