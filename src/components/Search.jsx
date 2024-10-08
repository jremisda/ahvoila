import React, { useState } from 'react';
import { TextInput, Button, Checkbox, Group, Card, Text, Loader, Alert, Select, MultiSelect } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { IconAlertCircle, IconSearch } from '@tabler/icons-react';
import axios from '../config/axios';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    documents: true,
    googleDrive: true,
    notion: true,
    slack: true
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [fileTypes, setFileTypes] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/search', {
        params: {
          query,
          ...filters,
          startDate: dateRange[0],
          endDate: dateRange[1],
          fileTypes: fileTypes.join(','),
          sortBy
        }
      });
      setResults(response.data.results);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error searching:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  return (
    <div>
      <TextInput
        placeholder="Enter your search query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rightSection={
          <Button onClick={handleSearch} disabled={loading}>
            <IconSearch size={18} />
          </Button>
        }
      />
      <Group mt="md">
        <Checkbox
          label="Documents"
          checked={filters.documents}
          onChange={() => handleFilterChange('documents')}
        />
        <Checkbox
          label="Google Drive"
          checked={filters.googleDrive}
          onChange={() => handleFilterChange('googleDrive')}
        />
        <Checkbox
          label="Notion"
          checked={filters.notion}
          onChange={() => handleFilterChange('notion')}
        />
        <Checkbox
          label="Slack"
          checked={filters.slack}
          onChange={() => handleFilterChange('slack')}
        />
      </Group>
      <Group mt="md">
        <DateRangePicker
          label="Date Range"
          value={dateRange}
          onChange={setDateRange}
        />
        <MultiSelect
          label="File Types"
          data={[
            { value: 'pdf', label: 'PDF' },
            { value: 'doc', label: 'Word Document' },
            { value: 'xls', label: 'Excel Spreadsheet' },
            { value: 'ppt', label: 'PowerPoint' },
            { value: 'txt', label: 'Text File' },
          ]}
          value={fileTypes}
          onChange={setFileTypes}
        />
        <Select
          label="Sort By"
          data={[
            { value: 'relevance', label: 'Relevance' },
            { value: 'date', label: 'Date' },
            { value: 'title', label: 'Title' },
          ]}
          value={sortBy}
          onChange={setSortBy}
        />
      </Group>
      {loading && <Loader mt="md" />}
      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" mt="md">
          {error}
        </Alert>
      )}
      {summary && (
        <Card shadow="sm" p="lg" mt="md">
          <Text weight={700}>Summary</Text>
          <Text>{summary}</Text>
        </Card>
      )}
      {results.map((result) => (
        <Card key={result.id} shadow="sm" p="lg" mt="md">
          <Text weight={700}>{result.title}</Text>
          <Text>Type: {result.type}</Text>
          <Text mt="xs">{result.snippet}</Text>
          <Button component="a" href={result.link} target="_blank" mt="sm">
            View
          </Button>
        </Card>
      ))}
    </div>
  );
}

export default Search;