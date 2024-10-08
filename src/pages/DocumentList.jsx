import React, { useState, useEffect } from 'react';
import { Container, Title, Table, Button, Group, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { notifications } from '@mantine/notifications';

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch documents',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Group position="apart" mb="md">
        <Title order={2}>Documents</Title>
        <Button onClick={() => navigate('/documents/new')}>Create New Document</Button>
      </Group>
      <TextInput
        placeholder="Search documents"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="md"
      />
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.title}</td>
              <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
              <td>
                <Group spacing="xs">
                  <Button size="xs" onClick={() => navigate(`/documents/${doc._id}`)}>View</Button>
                  <Button size="xs" onClick={() => navigate(`/documents/edit/${doc._id}`)}>Edit</Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default DocumentList;