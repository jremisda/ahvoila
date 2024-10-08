import React, { useState, useEffect } from 'react';
import { Container, Title, Table, Text, Button, Group, TextInput, Select } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

function SearchHistory() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSearchHistory();
  }, [dateRange, searchTerm, sortBy, sortOrder]);

  const fetchSearchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/search/history', {
        params: {
          startDate: dateRange[0],
          endDate: dateRange[1],
          searchTerm,
          sortBy,
          sortOrder
        }
      });
      setSearchHistory(response.data);
    } catch (error) {
      console.error('Error fetching search history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    navigate('/search', { state: { query } });
  };

  return (
    <Container>
      <Title order={2} mb="md">Search History</Title>
      <Group mb="md">
        <DateRangePicker
          label="Date Range"
          value={dateRange}
          onChange={setDateRange}
        />
        <TextInput
          label="Search Term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          label="Sort By"
          value={sortBy}
          onChange={setSortBy}
          data={[
            { value: 'date', label: 'Date' },
            { value: 'query', label: 'Query' },
          ]}
        />
        <Select
          label="Sort Order"
          value={sortOrder}
          onChange={setSortOrder}
          data={[
            { value: 'asc', label: 'Ascending' },
            { value: 'desc', label: 'Descending' },
          ]}
        />
      </Group>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Query</th>
            <th>Results</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchHistory.map((item) => (
            <tr key={item._id}>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.query}</td>
              <td>{item.resultCount}</td>
              <td>
                <Button size="xs" onClick={() => handleSearch(item.query)}>
                  Search Again
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {loading && <Text>Loading...</Text>}
    </Container>
  );
}

export default SearchHistory;