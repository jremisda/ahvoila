import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Group } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../config/axios';

function SearchAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get('/api/analytics/search');
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  if (!analyticsData) {
    return <Text>Loading analytics...</Text>;
  }

  return (
    <Card shadow="sm" p="lg">
      <Title order={3} mb="md">Search Analytics</Title>
      <Group mb="md">
        <Card>
          <Title order={4}>Total Searches</Title>
          <Text size="xl">{analyticsData.totalSearches}</Text>
        </Card>
        <Card>
          <Title order={4}>Unique Queries</Title>
          <Text size="xl">{analyticsData.uniqueQueries}</Text>
        </Card>
        <Card>
          <Title order={4}>Avg. Results per Search</Title>
          <Text size="xl">{analyticsData.avgResultsPerSearch.toFixed(2)}</Text>
        </Card>
      </Group>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analyticsData.searchesOverTime}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="searches" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default SearchAnalytics;