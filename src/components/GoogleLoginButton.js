'use client';
import { useContext, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from '@/context/AuthContext';
import { FaGoogle, FaSpinner } from 'react-icons/fa';
import api from '@/lib/axios';

export default function GoogleLoginButton({ onSuccess, onError, buttonText = 'Continue with Google' }) {
    const { setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const response = await api.post('/auth/google', {
                    token: tokenResponse.access_token
                });
                
                if (response.data.success) {
                    setUser(response.data.user);
                    if (onSuccess) onSuccess();
                } else {
                    if (onError) onError(new Error('Login failed'));
                }
            } catch (error) {
                console.error('Google login error:', error);
                if (onError) onError(error);
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google login failed:', error);
            setLoading(false);
            if (onError) onError(error);
        },
        flow: 'implicit',
        ux_mode: 'popup',
    });

    return (
        <button
            onClick={() => login()}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <FaSpinner className="animate-spin text-orange-500 text-xl" />
            ) : (
                <FaGoogle className="text-red-500 text-xl" />
            )}
            {loading ? 'Signing in...' : buttonText}
        </button>
    );
}