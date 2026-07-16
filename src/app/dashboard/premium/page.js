'use client';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCrown, FaCheck, FaArrowRight, FaSpinner } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function Premium() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user?.isPremium) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleUpgrade = async () => {
        setLoading(true);
        setError('');

        try {
            console.log('🚀 Creating Stripe checkout...');
            
            const response = await api.post('/payment/premium', {
                success_url: `${window.location.origin}/dashboard/premium/success`,
                cancel_url: `${window.location.origin}/dashboard/premium`
            });

            console.log('📥 Response:', response.data);

            if (response.data.url) {
                console.log('🔗 Redirecting to Stripe:', response.data.url);
                window.location.href = response.data.url;
            } else {
                setError('Failed to create checkout session');
                setLoading(false);
            }
        } catch (error) {
            console.error('❌ Error:', error);
            setError(error.response?.data?.message || 'Failed to start checkout');
            setLoading(false);
        }
    };

    if (authLoading) return <Loading />;
    if (user?.isPremium) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-lg mb-4">
                        <FaCrown className="text-white text-4xl" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800">Upgrade to Premium</h1>
                    <p className="text-gray-600 mt-2">Unlock unlimited recipes and exclusive features</p>
                </div>

                {error && (
                    <div className="max-w-lg mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-lg font-bold text-gray-800">Unlimited Recipes</h3>
                        <p className="text-gray-500 text-sm mt-2">Create and share unlimited recipes</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                        <div className="text-4xl mb-4">⭐</div>
                        <h3 className="text-lg font-bold text-gray-800">Premium Badge</h3>
                        <p className="text-gray-500 text-sm mt-2">Show your premium status</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                        <div className="text-4xl mb-4">💎</div>
                        <h3 className="text-lg font-bold text-gray-800">Exclusive Features</h3>
                        <p className="text-gray-500 text-sm mt-2">Access to premium-only features</p>
                    </div>
                </div>

                <div className="max-w-lg mx-auto">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-yellow-200 shadow-xl">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800">Premium Plan</h2>
                            <div className="my-4">
                                <span className="text-5xl font-bold text-gray-800">$9.99</span>
                                <span className="text-gray-500 text-sm"> / one-time</span>
                            </div>
                        </div>

                        <div className="my-6 space-y-3">
                            <div className="flex items-center gap-3"><FaCheck className="text-green-500" /><span>Unlimited recipe uploads</span></div>
                            <div className="flex items-center gap-3"><FaCheck className="text-green-500" /><span>Premium profile badge</span></div>
                            <div className="flex items-center gap-3"><FaCheck className="text-green-500" /><span>Priority support</span></div>
                            <div className="flex items-center gap-3"><FaCheck className="text-green-500" /><span>Exclusive community access</span></div>
                        </div>

                        <button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : <>Upgrade Now <FaArrowRight /></>}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">Secure payment powered by Stripe</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}