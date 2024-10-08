import React, { useState } from 'react';
import { FileInput, Button, Text, Paper, Container } from '@mantine/core';
import api from '../config/axios';

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await api.post('/documents/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSummary(response.data.summary);
    } catch (err) {
      setError('An error occurred while summarizing the document');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm">
      <Paper padding="md" shadow="xs">
        <form onSubmit={handleSubmit}>
          <FileInput
            label="Upload document"
            placeholder="Select file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={setFile}
          />
          <Button type="submit" loading={loading} mt="sm">
            Summarize Document
          </Button>
        </form>
        {error && <Text color="red">{error}</Text>}
        {summary && (
          <Paper padding="md" mt="md">
            <Text weight={700}>Summary:</Text>
            <Text>{summary}</Text>
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default DocumentUpload;