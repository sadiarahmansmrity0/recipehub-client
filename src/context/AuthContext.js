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
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem('token');
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
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: 'Login failed' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, image) => {
        try {
            const response = await api.post('/auth/register', { name, email, password, image });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
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
            localStorage.removeItem('token');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await api.patch('/auth/profile', { ...data });
            if (response.data.success) {
                setUser(prev => ({ ...prev, ...data }));
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('Update error:', error);
            return { success: false };
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