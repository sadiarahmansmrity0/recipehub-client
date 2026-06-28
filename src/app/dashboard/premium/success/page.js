'use client';
import { useEffect, useContext, useState } from 'react';
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
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        // Refresh user data to get updated premium status
        const refreshUser = async () => {
            try {
                const response = await api.get('/auth/me');
                console.log('Refreshed user data:', response.data);
                setUser(response.data);
                setUpdated(true);
            } catch (error) {
                console.error('Error refreshing user:', error);
            } finally {
                setLoading(false);
            }
        };

        refreshUser();
    }, [user, router, setUser]);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto" />
                <p className="text-gray-600 mt-4">Updating your account...</p>
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
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    🎉 Payment Successful!
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                    You are now a premium member!
                </p>
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold mb-8">
                    <FaCrown className="text-yellow-500" />
                    Premium Member
                </div>

                {updated && user?.isPremium && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-green-700">
                        ✅ Your premium status has been activated!
                    </div>
                )}

                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">What's next?</h3>
                    <ul className="text-gray-600 space-y-2">
                        <li>✨ Create unlimited recipes</li>
                        <li>👑 Show your premium badge</li>
                        <li>🎁 Access exclusive features</li>
                    </ul>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/dashboard/add-recipe"
                        className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        Create Recipe
                        <FaArrowRight />
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