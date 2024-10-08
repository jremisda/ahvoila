import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    // Implement login logic
  }, []);

  const register = useCallback(async (name, email, password) => {
    // Implement register logic
  }, []);

  const logout = useCallback(async () => {
    // Implement logout logic
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};