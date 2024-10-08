import React, { createContext, useState, useContext, useEffect } from 'react';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import axios from '../config/axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState('light');

  useEffect(() => {
    fetchThemePreference();
  }, []);

  const fetchThemePreference = async () => {
    try {
      const response = await axios.get('/user/settings');
      setColorScheme(response.data.theme);
    } catch (error) {
      console.error('Failed to fetch theme preference:', error);
    }
  };

  const toggleColorScheme = async (value) => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(newColorScheme);
    try {
      await axios.put('/user/settings', { theme: newColorScheme });
    } catch (error) {
      console.error('Failed to update theme preference:', error);
    }
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
          {children}
        </ThemeContext.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export const useTheme = () => useContext(ThemeContext);