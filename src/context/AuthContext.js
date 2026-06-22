
'use client';
import { createContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check backend to see if user is logged in (session cookie)
  useEffect(() => {
    api.get('/auth/me') // Ensure your backend has this route
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};