import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Group, Loader, Switch, Pagination } from '@mantine/core';
import axios from 'axios';
import SuggestionAction from './SuggestionAction';

function ContentSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrending, setShowTrending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const suggestionsPerPage = 5;

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/content/suggestions', {
        params: { showTrending }
      });
      setSuggestions(response.data.suggestions.map(suggestion => ({
        id: Math.random().toString(36).substr(2, 9),
        text: suggestion,
        feedback: null
      })));
      setError(null);
    } catch (err) {
      console.error('Error fetching content suggestions:', err);
      setError('Failed to fetch content suggestions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [showTrending]);

  const handleFeedback = async (suggestionId, feedback) => {
    try {
      await axios.post('/api/content/feedback', { suggestionId, feedback });
      setSuggestions(suggestions.map(s => 
        s.id === suggestionId ? { ...s, feedback } : s
      ));
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  };

  const paginatedSuggestions = suggestions.slice(
    (currentPage - 1) * suggestionsPerPage,
    currentPage * suggestionsPerPage
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <Card shadow="sm" p="lg">
      <Group position="apart" mb="md">
        <Text weight={700} size="lg">Content Suggestions</Text>
        <Switch
          label="Include Trending Topics"
          checked={showTrending}
          onChange={(event) => setShowTrending(event.currentTarget.checked)}
        />
      </Group>
      {paginatedSuggestions.map((suggestion) => (
        <Card key={suggestion.id} shadow="sm" p="sm" mb="sm">
          <Text mb="xs">{suggestion.text}</Text>
          <Group position="apart">
            <Group>
              <Button 
                size="xs" 
                variant={suggestion.feedback === 'like' ? 'filled' : 'outline'}
                onClick={() => handleFeedback(suggestion.id, 'like')}
              >
                Like
              </Button>
              <Button 
                size="xs" 
                variant={suggestion.feedback === 'dislike' ? 'filled' : 'outline'}
                onClick={() => handleFeedback(suggestion.id, 'dislike')}
              >
                Dislike
              </Button>
            </Group>
            <SuggestionAction suggestion={suggestion.text} />
          </Group>
        </Card>
      ))}
      <Pagination
        total={Math.ceil(suggestions.length / suggestionsPerPage)}
        page={currentPage}
        onChange={setCurrentPage}
        mt="md"
      />
      <Button onClick={fetchSuggestions} mt="md">Refresh Suggestions</Button>
    </Card>
  );
}

export default ContentSuggestions;