import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Select, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from '../config/axios';

function ShareDocument({ documentId, onClose }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('read');
  const [sharedUsers, setSharedUsers] = useState([]);

  useEffect(() => {
    fetchSharedUsers();
  }, [documentId]);

  const fetchSharedUsers = async () => {
    try {
      const response = await axios.get(`/api/documents/${documentId}/shared-users`);
      setSharedUsers(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch shared users',
        color: 'red',
      });
    }
  };

  const handleShare = async () => {
    try {
      await axios.post(`/api/documents/${documentId}/share`, { email, permission });
      notifications.show({
        title: 'Success',
        message: 'Document shared successfully',
        color: 'green',
      });
      setEmail('');
      fetchSharedUsers();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to share document',
        color: 'red',
      });
    }
  };

  const handleRemoveShare = async (userId) => {
    try {
      await axios.delete(`/api/documents/${documentId}/share/${userId}`);
      notifications.show({
        title: 'Success',
        message: 'Share removed successfully',
        color: 'green',
      });
      fetchSharedUsers();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to remove share',
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={true} onClose={onClose} title="Share Document">
      <TextInput
        label="Email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mb="sm"
      />
      <Select
        label="Permission"
        data={[
          { value: 'read', label: 'Read' },
          { value: 'write', label: 'Write' },
        ]}
        value={permission}
        onChange={setPermission}
        mb="md"
      />
      <Button onClick={handleShare}>Share</Button>

      <Text weight={700} mt="xl" mb="md">Shared With:</Text>
      {sharedUsers.map((user) => (
        <div key={user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <Text>{user.email} ({user.permission})</Text>
          <Button size="xs" color="red" onClick={() => handleRemoveShare(user._id)}>Remove</Button>
        </div>
      ))}
    </Modal>
  );
}

export default ShareDocument;