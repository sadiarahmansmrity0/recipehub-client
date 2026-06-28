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
                console.log('Auth check - User data:', response.data);
                setUser(response.data);
            } catch (error) {
                if (error.response?.status !== 401) {
                    console.error('Auth check error:', error);
                }
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
            console.log('Login - User data:', response.data.user);
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
            console.log('Register - User data:', response.data.user);
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
            if (response.data.success) {
                console.log('Profile update - New data:', response.data.user);
                setUser(prev => ({
                    ...prev,
                    ...response.data.user
                }));
                return { success: true, user: response.data.user };
            }
            return { success: false, message: 'Update failed' };
        } catch (error) {
            console.error('Profile update error:', error);
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