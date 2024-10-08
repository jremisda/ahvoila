import React, { useState } from 'react';
import { TextInput, Textarea, Button, Select, Card, Text } from '@mantine/core';
import axios from '../config/axios';

function Summarizer() {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('document');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/summarization/summarize', { content, contentType });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error summarizing content:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" p="lg">
      <Select
        label="Content Type"
        value={contentType}
        onChange={setContentType}
        data={[
          { value: 'document', label: 'Document' },
          { value: 'note', label: 'Note' },
          { value: 'conversation', label: 'Conversation' },
          { value: 'article', label: 'Company Article' },
        ]}
        mb="md"
      />
      <Textarea
        label="Content to Summarize"
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
        minRows={4}
        mb="md"
      />
      <Button onClick={handleSummarize} loading={loading} mb="md">
        Summarize
      </Button>
      {summary && (
        <Card shadow="sm" p="md" mt="md">
          <Text weight={700} mb="xs">Summary:</Text>
          <Text>{summary}</Text>
        </Card>
      )}
    </Card>
  );
}

export default Summarizer;