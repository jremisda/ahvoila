import React, { useState, useEffect } from 'react';
import { Container, Title, Switch, Button, PasswordInput, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from '../config/axios';
import { useTheme } from '../contexts/ThemeContext';

function Settings() {
  const [loading, setLoading] = useState(true);
  const { colorScheme, toggleColorScheme } = useTheme();

  const settingsForm = useForm({
    initialValues: {
      theme: colorScheme,
      language: 'en',
      emailNotifications: true,
      pushNotifications: true,
    },
  });

  // ... existing password form and other code ...

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/user/settings');
      settingsForm.setValues({
        theme: response.data.theme,
        language: response.data.language,
        emailNotifications: response.data.notifications.email,
        pushNotifications: response.data.notifications.push,
      });
      setLoading(false);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch settings',
        color: 'red',
      });
    }
  };

  const handleSettingsSubmit = async (values) => {
    try {
      await axios.put('/user/settings', {
        theme: values.theme,
        language: values.language,
        notifications: {
          email: values.emailNotifications,
          push: values.pushNotifications,
        },
      });
      toggleColorScheme(values.theme);
      notifications.show({
        title: 'Success',
        message: 'Settings updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update settings',
        color: 'red',
      });
    }
  };

  // ... existing password change handler ...

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container size="sm">
      <Title order={2} mb="md">Settings</Title>
      <form onSubmit={settingsForm.onSubmit(handleSettingsSubmit)}>
        <Switch
          label="Dark Theme"
          checked={settingsForm.values.theme === 'dark'}
          onChange={(event) => {
            const newTheme = event.currentTarget.checked ? 'dark' : 'light';
            settingsForm.setFieldValue('theme', newTheme);
            toggleColorScheme(newTheme);
          }}
          mb="sm"
        />
        <Select
          label="Language"
          data={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
          ]}
          {...settingsForm.getInputProps('language')}
          mb="sm"
        />
        <Switch
          label="Email Notifications"
          {...settingsForm.getInputProps('emailNotifications', { type: 'checkbox' })}
          mb="sm"
        />
        <Switch
          label="Push Notifications"
          {...settingsForm.getInputProps('pushNotifications', { type: 'checkbox' })}
          mb="sm"
        />
        <Button type="submit" mt="md">
          Save Settings
        </Button>
      </form>

      {/* ... existing password change form ... */}
    </Container>
  );
}

export default Settings;