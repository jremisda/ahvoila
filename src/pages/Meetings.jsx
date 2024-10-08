import React, { useState, useEffect } from 'react'
import { Container, Title, Card, Text, Button, Modal, TextInput, Tabs, Badge, Group, Notification } from '@mantine/core'
import { IconCalendarEvent, IconNotes, IconBell } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { showNotification } from '@mantine/notifications'

function Meetings() {
  const [upcomingMeetings, setUpcomingMeetings] = useState([])
  const [pastMeetings, setPastMeetings] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMeeting, setNewMeeting] = useState({ title: '', platform: '', meetingUrl: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchMeetings()
    checkUpcomingMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/meetings')
      const now = new Date()
      setUpcomingMeetings(response.data.filter(meeting => new Date(meeting.startTime) > now))
      setPastMeetings(response.data.filter(meeting => new Date(meeting.startTime) <= now))
    } catch (error) {
      console.error('Error fetching meetings:', error)
      showNotification({
        title: 'Error',
        message: 'Failed to fetch meetings. Please try again.',
        color: 'red',
      })
    }
  }

  const handleCreateMeeting = async () => {
    try {
      await axios.post('/api/meetings', newMeeting)
      setIsModalOpen(false)
      setNewMeeting({ title: '', platform: '', meetingUrl: '' })
      fetchMeetings()
      showNotification({
        title: 'Success',
        message: 'Meeting created successfully',
        color: 'green',
      })
    } catch (error) {
      console.error('Error creating meeting:', error)
      showNotification({
        title: 'Error',
        message: 'Failed to create meeting. Please try again.',
        color: 'red',
      })
    }
  }

  const checkUpcomingMeetings = () => {
    const now = new Date()
    upcomingMeetings.forEach(meeting => {
      const meetingTime = new Date(meeting.startTime)
      const timeDiff = meetingTime.getTime() - now.getTime()
      if (timeDiff > 0 && timeDiff <= 15 * 60 * 1000) { // 15 minutes
        showNotification({
          title: 'Upcoming Meeting',
          message: `${meeting.title} starts in ${Math.round(timeDiff / 60000)} minutes`,
          color: 'blue',
          icon: <IconBell />,
          autoClose: false,
        })
      }
    })
  }

  const renderMeetingCard = (meeting) => (
    <Card key={meeting._id} shadow="sm" p="lg" mt="md">
      <Group position="apart">
        <Text weight={700}>{meeting.title}</Text>
        <Badge color={new Date(meeting.startTime) > new Date() ? 'green' : 'gray'}>
          {new Date(meeting.startTime) > new Date() ? 'Upcoming' : 'Past'}
        </Badge>
      </Group>
      <Text size="sm" color="dimmed">Platform: {meeting.platform}</Text>
      <Text size="sm" color="dimmed">Start Time: {new Date(meeting.startTime).toLocaleString()}</Text>
      <Group position="apart" mt="md">
        <Button variant="light" onClick={() => window.open(meeting.meetingUrl, '_blank')}>
          Join Meeting
        </Button>
        <Button variant="subtle" onClick={() => navigate(`/meetings/${meeting._id}`)}>
          View Details
        </Button>
      </Group>
    </Card>
  )

  return (
    <Container>
      <Group position="apart" mb="md">
        <Title order={2}>Meetings</Title>
        <Button leftIcon={<IconCalendarEvent size={14} />} onClick={() => setIsModalOpen(true)}>
          Create New Meeting
        </Button>
      </Group>

      <Tabs defaultValue="upcoming">
        <Tabs.List>
          <Tabs.Tab value="upcoming" icon={<IconCalendarEvent size={14} />}>Upcoming Meetings</Tabs.Tab>
          <Tabs.Tab value="past" icon={<IconNotes size={14} />}>Past Meetings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="upcoming" pt="xs">
          {upcomingMeetings.map(renderMeetingCard)}
        </Tabs.Panel>

        <Tabs.Panel value="past" pt="xs">
          {pastMeetings.map(renderMeetingCard)}
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Meeting"
      >
        <TextInput
          label="Title"
          value={newMeeting.title}
          onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
        />
        <TextInput
          label="Platform"
          value={newMeeting.platform}
          onChange={(e) => setNewMeeting({ ...newMeeting, platform: e.target.value })}
          mt="sm"
        />
        <TextInput
          label="Meeting URL"
          value={newMeeting.meetingUrl}
          onChange={(e) => setNewMeeting({ ...newMeeting, meetingUrl: e.target.value })}
          mt="sm"
        />
        <Button onClick={handleCreateMeeting} mt="md">Create Meeting</Button>
      </Modal>
    </Container>
  )
}

export default Meetings