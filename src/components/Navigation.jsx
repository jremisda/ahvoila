import React from 'react'
import { NavLink } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navigation() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <NavLink component={Link} to="/" label="Home" />
      <NavLink component={Link} to="/dashboard" label="Dashboard" />
      <NavLink component={Link} to="/search" label="Search" />
      <NavLink component={Link} to="/meetings" label="Meetings" />
      <NavLink component={Link} to="/integrations" label="Integrations" />
      <NavLink component={Link} to="/profile" label="Profile" />
      <NavLink component={Link} to="/settings" label="Settings" />
      <NavLink onClick={handleLogout} label="Logout" />
    </>
  )
}

export default Navigation