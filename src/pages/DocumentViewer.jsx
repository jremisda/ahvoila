import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Group, Loader } from '@mantine/core';
import axios from '../config/axios';
import { notifications } from '@mantine/notifications';

function DocumentViewer() {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/api/documents/${id}`);
      setDocument(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch document',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`/api/documents/${id}`);
        notifications.show({
          title: 'Success',
          message: 'Document deleted successfully',
          color: 'green',
        });
        navigate('/documents');
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete document',
          color: 'red',
        });
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!document) {
    return <Text>Document not found</Text>;
  }

  return (
    <Container>
      <Title order={2} mb="md">{document.title}</Title>
      <div dangerouslySetInnerHTML={{ __html: document.content }} />
      <Group position="right" mt="xl">
        <Button onClick={() => navigate('/documents')}>Back to Documents</Button>
        <Button onClick={() => navigate(`/documents/edit/${id}`)}>Edit</Button>
        <Button color="red" onClick={handleDelete}>Delete</Button>
      </Group>
    </Container>
  );
}

export default DocumentViewer;