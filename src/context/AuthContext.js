'use client';
import { createContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    api.get('/auth/me').then(res => {
        setUser(res.data);
    }).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};