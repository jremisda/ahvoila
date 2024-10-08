import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import axios from '../config/axios'

function OAuthCallback() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('code')
    const state = params.get('state')

    if (code) {
      const service = state || 'unknown'
      handleOAuthCallback(service, code)
    } else {
      notifications.show({
        title: 'Error',
        message: 'OAuth callback failed',
        color: 'red',
      })
      navigate('/integrations')
    }
  }, [location, navigate])

  const handleOAuthCallback = async (service, code) => {
    try {
      await axios.post(`/api/integrations/${service}/connect`, { code })
      notifications.show({
        title: 'Success',
        message: `${service} connected successfully`,
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to connect ${service}`,
        color: 'red',
      })
    } finally {
      navigate('/integrations')
    }
  }

  return <div>Processing OAuth callback...</div>
}

export default OAuthCallback