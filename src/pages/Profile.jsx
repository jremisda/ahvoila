import React, { useState, useEffect } from 'react';
import { Container, Title, TextInput, Button, Avatar, Group, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from '../config/axios';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      jobTitle: '',
      department: '',
      profilePicture: '',
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/user/profile');
      form.setValues(response.data);
      setLoading(false);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch profile',
        color: 'red',
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));
      if (uploadedImage) {
        formData.append('profilePicture', uploadedImage);
      }

      await axios.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update profile',
        color: 'red',
      });
    }
  };

  const handleDrop = (files) => {
    setUploadedImage(files[0]);
    form.setFieldValue('profilePicture', URL.createObjectURL(files[0]));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container size="sm">
      <Title order={2} mb="md">Profile</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group mb="md">
          <Avatar src={form.values.profilePicture} size="xl" radius="xl" />
          <Dropzone
            onDrop={handleDrop}
            accept={IMAGE_MIME_TYPE}
            maxSize={3 * 1024 ** 2}
          >
            {() => (
              <Text size="sm">
                Drag images here or click to select files
              </Text>
            )}
          </Dropzone>
        </Group>
        <TextInput
          label="Name"
          {...form.getInputProps('name')}
          required
        />
        <TextInput
          label="Email"
          {...form.getInputProps('email')}
          required
          mt="sm"
        />
        <TextInput
          label="Job Title"
          {...form.getInputProps('jobTitle')}
          mt="sm"
        />
        <TextInput
          label="Department"
          {...form.getInputProps('department')}
          mt="sm"
        />
        <Button type="submit" mt="md">
          Save Changes
        </Button>
      </form>
    </Container>
  );
}

export default Profile;