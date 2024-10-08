import React from 'react';
import { Card, Text, Button, Group } from '@mantine/core';
import axios from '../config/axios';

function RecommendationList({ recommendations, onFeedback }) {
  const handleFeedback = async (documentId, feedbackType) => {
    try {
      await axios.post('/api/recommendations/feedback', { documentId, feedbackType });
      onFeedback(documentId, feedbackType);
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  };

  return (
    <>
      {recommendations.map((rec) => (
        <Card key={rec.document._id} shadow="sm" p="lg" mb="md">
          <Text weight={700}>{rec.document.title}</Text>
          <Text size="sm" color="gray" mb="xs">
            Relevance Score: {rec.score.toFixed(2)}
          </Text>
          <Text size="sm" mb="md">{rec.explanation}</Text>
          <Group>
            <Button size="xs" onClick={() => handleFeedback(rec.document._id, 'like')}>Like</Button>
            <Button size="xs" onClick={() => handleFeedback(rec.document._id, 'dislike')}>Dislike</Button>
            <Button size="xs" onClick={() => handleFeedback(rec.document._id, 'save')}>Save</Button>
          </Group>
        </Card>
      ))}
    </>
  );
}

export default RecommendationList;