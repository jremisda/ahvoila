import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AppShell, Header, Navbar, Text, MediaQuery, Burger, useMantineTheme } from '@mantine/core'
import Navigation from './Navigation'
import { useAuth } from '../contexts/AuthContext'
import { NotificationsProvider } from '@mantine/notifications'

function Layout() {
  const { user, loading } = useAuth()
  const theme = useMantineTheme()
  const [opened, setOpened] = React.useState(false)

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <NotificationsProvider>
      <AppShell
        padding="md"
        navbar={
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <Navigation />
          </Navbar>
        }
        header={
          <Header height={70} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text>Ahvoila</Text>
            </div>
          </Header>
        }
      >
        <Outlet />
      </AppShell>
    </NotificationsProvider>
  )
}

export default Layout