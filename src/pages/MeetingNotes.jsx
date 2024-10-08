import React, { useState, useEffect } from 'react';
import { Container, Title, Card, Text, Button, Group, TextInput, Loader, Badge } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconFileText } from '@tabler/icons-react';
import axios from '../config/axios';
import { showNotification } from '@mantine/notifications';

function MeetingNotes() {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetingNotes();
  }, []);

  const fetchMeetingNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/meetings/notes');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meeting notes:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to fetch meeting notes. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Group position="apart" mb="md">
        <Title order={2}>Meeting Notes</Title>
        <TextInput
          placeholder="Search meetings"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<IconSearch size={14} />}
        />
      </Group>

      {loading ? (
        <Loader />
      ) : filteredMeetings.length > 0 ? (
        filteredMeetings.map((meeting) => (
          <Card key={meeting._id} shadow="sm" p="lg" mb="md">
            <Group position="apart">
              <Text weight={700}>{meeting.topic}</Text>
              <Badge color="blue">{new Date(meeting.startTime).toLocaleDateString()}</Badge>
            </Group>
            <Text mt="sm" lineClamp={3}>{meeting.summary}</Text>
            <Group position="apart" mt="md">
              <Text size="sm" color="dimmed">
                {meeting.actionItems.length} action item(s)
              </Text>
              <Button 
                variant="light" 
                onClick={() => navigate(`/meetings/${meeting._id}`)}
                leftIcon={<IconFileText size={14} />}
              >
                View Details
              </Button>
            </Group>
          </Card>
        ))
      ) : (
        <Text align="center" mt="xl">No meeting notes found.</Text>
      )}
    </Container>
  );
}

export default MeetingNotes;