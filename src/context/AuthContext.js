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
                console.log('🔍 Checking auth...');
                const response = await api.get('/auth/me');
                console.log('✅ Auth check - User:', response.data);
                setUser(response.data);
            } catch (error) {
                console.log('ℹ️ Not authenticated');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            console.log('🔐 Login attempt:', email);
            const response = await api.post('/auth/login', { email, password });
            console.log('✅ Login response:', response.data);
            
            if (response.data.success && response.data.user) {
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            }
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            console.error('❌ Login error:', error.response?.data || error.message);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const register = async (name, email, password, image) => {
        try {
            console.log('📝 Register attempt:', email);
            const response = await api.post('/auth/register', { name, email, password, image });
            console.log('✅ Register response:', response.data);
            
            if (response.data.success && response.data.user) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: 'Registration failed' };
        } catch (error) {
            console.error('❌ Register error:', error.response?.data || error.message);
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
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await api.put('/auth/profile', data);
            if (response.data.success) {
                setUser(prev => ({ ...prev, ...response.data.user }));
                return { success: true, user: response.data.user };
            }
            return { success: false, message: 'Update failed' };
        } catch (error) {
            console.error('Update error:', error);
            return { success: false, message: error.response?.data?.message || 'Update failed' };
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