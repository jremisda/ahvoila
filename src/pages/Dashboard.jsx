import React, { useState, useEffect } from 'react'
import { Container, Title, Text, Card, Grid } from '@mantine/core'
import axios from 'axios'
import ContentSuggestions from '../components/ContentSuggestions'
import SearchAnalytics from '../components/SearchAnalytics'
import SavedSearches from '../components/SavedSearches'
import Summarizer from '../components/Summarizer'

function Dashboard() {
  const [recentDocuments, setRecentDocuments] = useState([])
  const [recentMeetings, setRecentMeetings] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const documentsResponse = await axios.get('/api/documents/recent')
        setRecentDocuments(documentsResponse.data)

        const meetingsResponse = await axios.get('/api/meetings/recent')
        setRecentMeetings(meetingsResponse.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <Container>
      <Title order={2}>Dashboard</Title>
      <Grid>
        <Grid.Col span={6}>
          <Card shadow="sm" p="lg" mt="md">
            <Title order={3}>Recent Documents</Title>
            {recentDocuments.map((doc) => (
              <Text key={doc._id}>{doc.title}</Text>
            ))}
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card shadow="sm" p="lg" mt="md">
            <Title order={3}>Recent Meetings</Title>
            {recentMeetings.map((meeting) => (
              <Text key={meeting._id}>{meeting.title}</Text>
            ))}
          </Card>
        </Grid.Col>
      </Grid>
      <SearchAnalytics />
      <ContentSuggestions />
      <SavedSearches />
      <Summarizer />
    </Container>
  )
}

export default Dashboard