'use client';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCrown, FaArrowRight, FaSpinner } from 'react-icons/fa';
import api from '@/lib/axios';

export default function PremiumSuccess() {
    const { user, setUser } = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const hasActivated = useRef(false);

    useEffect(() => {
        // Wait until user context is loaded from AuthContext
        if (!user) return; 

        // If user is already premium, no need to call backend activation
        if (user.isPremium) {
            setLoading(false);
            return;
        }

        // Prevent dual-execution in React Strict Mode or state loops
        if (hasActivated.current) return;
        hasActivated.current = true;

        const activatePremium = async () => {
            try {
                console.log('🔄 Requesting direct premium activation...');
                const response = await api.post('/payment/activate-premium');
                console.log('📥 Activation Response:', response.data);

                if (response.data.success) {
                    // Instantly refresh profile info to get updated fields
                    const userResponse = await api.get('/auth/me');
                    console.log('👤 Fresh User Data:', userResponse.data);
                    
                    // Update global state
                    setUser(userResponse.data);
                } else {
                    setError(response.data.message || 'Activation failed');
                }
            } catch (err) {
                console.error('❌ Activation Error:', err);
                setError(err.response?.data?.message || 'Failed to activate premium status.');
            } finally {
                setLoading(false);
            }
        };

        activatePremium();
    }, [user, setUser]);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto" />
                <p className="text-gray-600 mt-4 font-medium">Confirming your premium account...</p>
                <p className="text-sm text-gray-400 mt-1">Please hold tight while we finalize your access privileges.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Activation Deferred</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link href="/dashboard/premium" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
                    Return to Upgrade Page
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="text-6xl mb-6 text-green-500 flex justify-center">
                    <FaCheckCircle />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">🎉 Payment Successful!</h1>
                <p className="text-xl text-gray-600 mb-2">Welcome to the inner circle!</p>
                
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold mb-8 shadow-sm">
                    <FaCrown className="text-yellow-500" /> Premium Member
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 max-w-md mx-auto text-left">
                    <h3 className="font-semibold text-gray-800 mb-3 text-center">Your Premium Features Are Ready:</h3>
                    <ul className="text-gray-600 space-y-2 max-w-xs mx-auto list-disc list-inside">
                        <li>Create unlimited recipes</li>
                        <li>Showcase your premium profile badge</li>
                        <li>Access curated premium-only content</li>
                    </ul>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/dashboard/add-recipe"
                        className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        Create Recipe <FaArrowRight />
                    </Link>
                    <Link
                        href="/dashboard"
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}