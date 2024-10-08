import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Group, TextInput, Modal } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

function SavedSearches() {
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [newSearchQuery, setNewSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/search/saved');
      setSavedSearches(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching saved searches:', err);
      setError('Failed to fetch saved searches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSearch = async () => {
    try {
      await axios.post('/api/search/save', { name: newSearchName, query: newSearchQuery });
      setIsModalOpen(false);
      setNewSearchName('');
      setNewSearchQuery('');
      fetchSavedSearches();
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const handleDeleteSearch = async (id) => {
    try {
      await axios.delete(`/api/search/saved/${id}`);
      fetchSavedSearches();
    } catch (error) {
      console.error('Error deleting saved search:', error);
    }
  };

  const handleRunSearch = (query) => {
    navigate('/search', { state: { query } });
  };

  if (loading) {
    return <Text>Loading saved searches...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <Card shadow="sm" p="lg">
      <Group position="apart" mb="md">
        <Text weight={700} size="lg">Saved Searches</Text>
        <Button onClick={() => setIsModalOpen(true)}>Save New Search</Button>
      </Group>
      {savedSearches.map((search) => (
        <Card key={search._id} shadow="sm" p="sm" mb="sm">
          <Group position="apart">
            <Text>{search.name}</Text>
            <Group>
              <Button size="xs" onClick={() => handleRunSearch(search.query)}>Run</Button>
              <Button size="xs" color="red" onClick={() => handleDeleteSearch(search._id)}>Delete</Button>
            </Group>
          </Group>
        </Card>
      ))}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Save New Search"
      >
        <TextInput
          label="Search Name"
          value={newSearchName}
          onChange={(e) => setNewSearchName(e.target.value)}
          mb="sm"
        />
        <TextInput
          label="Search Query"
          value={newSearchQuery}
          onChange={(e) => setNewSearchQuery(e.target.value)}
          mb="md"
        />
        <Button onClick={handleSaveSearch}>Save Search</Button>
      </Modal>
    </Card>
  );
}

export default SavedSearches;