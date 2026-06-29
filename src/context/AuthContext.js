'use client';
import { createContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.success) {
                setUser(res.data.user);
                return { success: true };
            }
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, image) => {
        try {
            const res = await api.post('/auth/register', { name, email, password, image });
            if (res.data.success) {
                setUser(res.data.user);
                return { success: true };
            }
            return { success: false, message: 'Registration failed' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateProfile = async (data) => {
        try {
            const res = await api.put('/auth/profile', data);
            if (res.data.success) {
                setUser(prev => ({ ...prev, ...res.data.user }));
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            return { success: false };
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};