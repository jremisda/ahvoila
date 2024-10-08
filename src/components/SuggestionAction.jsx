import React from 'react';
import { Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SuggestionAction({ suggestion }) {
  const navigate = useNavigate();

  const createDocument = async () => {
    try {
      const response = await axios.post('/api/documents', {
        title: suggestion,
        content: ''
      });
      navigate(`/documents/${response.data._id}`);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const scheduleMeeting = () => {
    navigate('/meetings/new', { state: { title: suggestion } });
  };

  return (
    <Group>
      <Button onClick={createDocument}>Create Document</Button>
      <Button onClick={scheduleMeeting}>Schedule Meeting</Button>
    </Group>
  );
}

export default SuggestionAction;