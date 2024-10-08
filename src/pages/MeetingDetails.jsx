import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Card, List, Button, Group, Badge, Loader, TextInput, Textarea, Checkbox, Modal, Table } from '@mantine/core';
import { IconArrowLeft, IconEdit, IconShare, IconCheck, IconX, IconHistory } from '@tabler/icons-react';
import axios from '../config/axios';
import { showNotification } from '@mantine/notifications';

function MeetingDetails() {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState(null);
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetingDetails();
    fetchMeetingVersions();
  }, [id]);

  const fetchMeetingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/meetings/${id}`);
      setMeeting(response.data);
      setEditedMeeting(response.data);
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to fetch meeting details. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetingVersions = async () => {
    try {
      const response = await axios.get(`/api/meetings/${id}/versions`);
      setVersions(response.data);
    } catch (error) {
      console.error('Error fetching meeting versions:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to fetch meeting versions. Please try again.',
        color: 'red',
      });
    }
  };

  const handleShare = () => {
    showNotification({
      title: 'Share',
      message: 'Sharing functionality not implemented yet.',
      color: 'blue',
    });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/meetings/${id}`, editedMeeting);
      setMeeting(editedMeeting);
      setEditing(false);
      showNotification({
        title: 'Success',
        message: 'Meeting details updated successfully.',
        color: 'green',
      });
      fetchMeetingVersions();
    } catch (error) {
      console.error('Error updating meeting details:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to update meeting details. Please try again.',
        color: 'red',
      });
    }
  };

  const handleCancel = () => {
    setEditedMeeting(meeting);
    setEditing(false);
  };

  const handleActionItemCompletion = async (index, completed) => {
    const updatedActionItems = [...editedMeeting.actionItems];
    updatedActionItems[index].completed = completed;
    setEditedMeeting({ ...editedMeeting, actionItems: updatedActionItems });

    try {
      await axios.put(`/api/meetings/${id}/action-items/${index}`, { completed });
      setMeeting({ ...meeting, actionItems: updatedActionItems });
      showNotification({
        title: 'Success',
        message: `Action item marked as ${completed ? 'completed' : 'incomplete'}.`,
        color: 'green',
      });
    } catch (error) {
      console.error('Error updating action item:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to update action item. Please try again.',
        color: 'red',
      });
    }
  };

  const handleRevertToVersion = async (versionId) => {
    try {
      await axios.post(`/api/meetings/${id}/revert/${versionId}`);
      showNotification({
        title: 'Success',
        message: 'Successfully reverted to selected version.',
        color: 'green',
      });
      fetchMeetingDetails();
      fetchMeetingVersions();
      setShowVersions(false);
    } catch (error) {
      console.error('Error reverting to version:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to revert to selected version. Please try again.',
        color: 'red',
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!meeting) {
    return <Text>Meeting not found.</Text>;
  }

  return (
    <Container>
      <Group position="apart" mb="xl">
        <Button 
          variant="subtle" 
          onClick={() => navigate('/meetings')}
          leftIcon={<IconArrowLeft size={14} />}
        >
          Back to Meetings
        </Button>
        <Group>
          {editing ? (
            <>
              <Button variant="filled" color="green" onClick={handleSave} leftIcon={<IconCheck size={14} />}>
                Save
              </Button>
              <Button variant="filled" color="red" onClick={handleCancel} leftIcon={<IconX size={14} />}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="light" onClick={handleEdit} leftIcon={<IconEdit size={14} />}>
                Edit
              </Button>
              <Button variant="filled" onClick={handleShare} leftIcon={<IconShare size={14} />}>
                Share
              </Button>
              <Button variant="light" onClick={() => setShowVersions(true)} leftIcon={<IconHistory size={14} />}>
                View History
              </Button>
            </>
          )}
        </Group>
      </Group>

      {editing ? (
        <>
          <TextInput
            label="Topic"
            value={editedMeeting.topic}
            onChange={(e) => setEditedMeeting({ ...editedMeeting, topic: e.target.value })}
            mb="md"
          />
          <Group mb="md">
            <Badge color="blue">{new Date(editedMeeting.startTime).toLocaleString()}</Badge>
            <Badge color="green">{editedMeeting.platform}</Badge>
          </Group>
        </>
      ) : (
        <>
          <Title order={2} mb="md">{meeting.topic}</Title>
          <Group mb="md">
            <Badge color="blue">{new Date(meeting.startTime).toLocaleString()}</Badge>
            <Badge color="green">{meeting.platform}</Badge>
          </Group>
        </>
      )}
      
      <Card shadow="sm" p="lg" mb="md">
        <Title order={3} mb="sm">Summary</Title>
        {editing ? (
          <Textarea
            value={editedMeeting.summary}
            onChange={(e) => setEditedMeeting({ ...editedMeeting, summary: e.target.value })}
            minRows={3}
          />
        ) : (
          <Text>{meeting.summary}</Text>
        )}
      </Card>

      <Card shadow="sm" p="lg" mb="md">
        <Title order={3} mb="sm">Action Items</Title>
        <List>
          {(editing ? editedMeeting : meeting).actionItems.map((item, index) => (
            <List.Item key={index}>
              <Group>
                <Checkbox
                  checked={item.completed}
                  onChange={(e) => handleActionItemCompletion(index, e.currentTarget.checked)}
                  label={
                    <Text weight={500} style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                      {item.description}
                    </Text>
                  }
                />
              </Group>
              <Text size="sm" color="dimmed">Assignee: {item.assignee}</Text>
            </List.Item>
          ))}
        </List>
      </Card>

      <Card shadow="sm" p="lg">
        <Title order={3} mb="sm">Transcript</Title>
        {editing ? (
          <Textarea
            value={editedMeeting.transcript}
            onChange={(e) => setEditedMeeting({ ...editedMeeting, transcript: e.target.value })}
            minRows={5}
          />
        ) : (
          <Text>{meeting.transcript}</Text>
        )}
      </Card>

      <Modal
        opened={showVersions}
        onClose={() => setShowVersions(false)}
        title="Meeting Versions"
        size="lg"
      >
        <Table>
          <thead>
            <tr>
              <th>Version</th>
              <th>Updated At</th>
              <th>Updated By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((version, index) => (
              <tr key={version._id}>
                <td>{versions.length - index}</td>
                <td>{new Date(version.updatedAt).toLocaleString()}</td>
                <td>{version.updatedBy?.name || 'Unknown'}</td>
                <td>
                  <Button size="xs" onClick={() => handleRevertToVersion(version._id)}>
                    Revert to this version
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal>
    </Container>
  );
}

export default MeetingDetails;