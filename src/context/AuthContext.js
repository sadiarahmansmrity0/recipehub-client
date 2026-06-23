'use client';
import { createContext, useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const register = async (name, email, password, image) => {
        try {
            const response = await api.post('/auth/register', { name, email, password, image });
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await api.put('/auth/profile', data);
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Update failed' 
            };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            loading, 
            login, 
            register, 
            logout,
            updateProfile
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};