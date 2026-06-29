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
                console.log('Checking auth...');
                const response = await api.get('/auth/me');
                console.log('Auth check response:', response.data);
                setUser(response.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Not authenticated');
                } else {
                    console.error('Auth check error:', error.message);
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
        console.log('🔐 Login attempt:', email);
        console.log('🔗 API URL:', api.defaults.baseURL);
        
        const response = await api.post('/auth/login', { email, password });
        console.log('✅ Login response status:', response.status);
        console.log('✅ Login response data:', response.data);
        
        if (response.data.success && response.data.user) {
            setUser(response.data.user);
            console.log('✅ User set in context');
            return { success: true, user: response.data.user };
        } else {
            console.log('❌ Invalid response structure:', response.data);
            return { success: false, message: 'Invalid response from server' };
        }
    } catch (error) {
        console.error('❌ Login error details:');
        console.error('  - Status:', error.response?.status);
        console.error('  - Data:', error.response?.data);
        console.error('  - Message:', error.message);
        
        return { 
            success: false, 
            message: error.response?.data?.message || 'Login failed. Please try again.'
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
            router.push('/login');
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
            console.error('Update profile error:', error);
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