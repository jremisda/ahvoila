import React, { useState, useEffect } from 'react'
import { Container, Title, Card, Text, Button, Group, Loader } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import axios from '../config/axios'

function Integrations() {
  const [integrations, setIntegrations] = useState({
    googleDrive: false,
    notion: false,
    slack: false,
    zoom: false,
    googleMeet: false
  });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchIntegrationStatus();
  }, []);

  const fetchIntegrationStatus = async () => {
    try {
      const response = await axios.get('/api/integrations/status');
      setIntegrations(response.data);
    } catch (error) {
      console.error('Error fetching integration status:', error);
    }
  };

  const handleConnect = async (service) => {
    try {
      const response = await axios.get(`/api/integrations/${service}/connect`);
      window.location.href = response.data.authUrl;
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to connect to ${service}`,
        color: 'red',
      });
    }
  };

  const handleDisconnect = async (service) => {
    try {
      await axios.delete(`/api/integrations/${service}/disconnect`);
      setIntegrations(prev => ({ ...prev, [service]: false }));
      notifications.show({
        title: 'Success',
        message: `Disconnected from ${service}`,
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to disconnect from ${service}`,
        color: 'red',
      });
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await axios.post('/api/integrations/sync');
      notifications.show({
        title: 'Success',
        message: 'Integrations synced successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to sync integrations',
        color: 'red',
      });
    } finally {
      setSyncing(false);
    }
  };

  const renderIntegrationCard = (name, service) => (
    <Card shadow="sm" p="lg" mt="md">
      <Text weight={700}>{name}</Text>
      <Group mt="md">
        {integrations[service] ? (
          <Button color="red" onClick={() => handleDisconnect(service)}>Disconnect</Button>
        ) : (
          <Button onClick={() => handleConnect(service)}>Connect</Button>
        )}
      </Group>
    </Card>
  );

  return (
    <Container>
      <Group position="apart">
        <Title order={2}>Integrations</Title>
        <Button onClick={handleSync} loading={syncing}>Sync All</Button>
      </Group>
      {renderIntegrationCard('Google Drive', 'googleDrive')}
      {renderIntegrationCard('Notion', 'notion')}
      {renderIntegrationCard('Slack', 'slack')}
      {renderIntegrationCard('Zoom', 'zoom')}
      {renderIntegrationCard('Google Meet', 'googleMeet')}
    </Container>
  );
}

export default Integrations