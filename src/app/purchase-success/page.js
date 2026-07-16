'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import api from '@/lib/axios';

export default function PurchaseSuccess() {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const verifyPurchase = async () => {
            try {
                console.log('🔄 Verifying purchase...');
                console.log('📦 Session ID:', sessionId);

                if (!sessionId) {
                    setError('No session ID found. Please check your purchased recipes.');
                    setLoading(false);
                    return;
                }

                const response = await api.post('/payment/verify-purchase', { sessionId });
                console.log('📥 Response:', response.data);

                if (response.data.success) {
                    setSuccess(true);
                    // Refresh user data
                    const userRes = await api.get('/auth/me');
                    console.log('👤 Updated user:', userRes.data);
                } else {
                    setError(response.data.message || 'Purchase verification failed');
                }
            } catch (error) {
                console.error('❌ Error:', error);
                setError(error.response?.data?.message || 'Failed to verify purchase');
            } finally {
                setLoading(false);
            }
        };

        verifyPurchase();
    }, [user, router, sessionId]);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto" />
                <p className="text-gray-600 mt-4">Verifying your purchase...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Verification Issue</h1>
                <p className="text-gray-600 mb-2">{error}</p>
                <p className="text-sm text-gray-400 mb-6">
                    Your payment may have been processed. Check your purchased recipes.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/dashboard/purchased"
                        className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        View My Purchases <FaArrowRight />
                    </Link>
                    <Link
                        href="/recipes"
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                        Browse Recipes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-6xl mb-6 text-green-500">
                    <FaCheckCircle />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">🎉 Purchase Successful!</h1>
                <p className="text-xl text-gray-600 mb-2">
                    You now have access to this recipe!
                </p>

                <div className="flex flex-wrap gap-4 justify-center mt-8">
                    <Link
                        href="/dashboard/purchased"
                        className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        View My Purchases <FaArrowRight />
                    </Link>
                    <Link
                        href="/recipes"
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                        Browse More Recipes
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}