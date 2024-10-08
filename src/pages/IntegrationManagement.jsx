import React, { useState, useEffect } from 'react';
import { Container, Title, Card, Text, Button, Group, Switch } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from '../config/axios';

function IntegrationManagement() {
  const [integrations, setIntegrations] = useState({});
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrationStatus();
    fetchIntegrationPermissions();
  }, []);

  const fetchIntegrationStatus = async () => {
    try {
      const response = await axios.get('/api/integrations/status');
      setIntegrations(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch integration status',
        color: 'red',
      });
    }
  };

  const fetchIntegrationPermissions = async () => {
    try {
      const response = await axios.get('/api/integrations/permissions');
      setPermissions(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch integration permissions',
        color: 'red',
      });
    } finally {
      setLoading(false);
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

  const handleRevoke = async (service) => {
    try {
      await axios.post(`/api/integrations/${service}/revoke`);
      setIntegrations(prev => ({ ...prev, [service]: false }));
      setPermissions(prev => ({ ...prev, [service]: [] }));
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

  const renderPermissions = (service) => {
    return permissions[service].map((permission, index) => (
      <Text key={index} size="sm">{permission}</Text>
    ));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container>
      <Title order={2} mb="md">Integration Management</Title>
      {Object.entries(integrations).map(([service, isConnected]) => (
        <Card key={service} shadow="sm" p="lg" mb="md">
          <Group position="apart">
            <Text weight={700}>{service}</Text>
            <Switch
              checked={isConnected}
              onChange={() => isConnected ? handleRevoke(service) : handleConnect(service)}
              label={isConnected ? 'Connected' : 'Disconnected'}
            />
          </Group>
          {isConnected && (
            <Card.Section inheritPadding py="sm">
              <Text weight={500} mb="xs">Permissions:</Text>
              {renderPermissions(service)}
            </Card.Section>
          )}
        </Card>
      ))}
    </Container>
  );
}

export default IntegrationManagement;