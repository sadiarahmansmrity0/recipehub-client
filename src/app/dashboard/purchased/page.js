'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaClock, FaUser } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function PurchasedRecipes() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [purchased, setPurchased] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        // TODO: Fetch purchased recipes from API
        // For now, show placeholder
        setLoading(false);
    }, [user, authLoading]);

    if (authLoading || loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <FaShoppingCart className="text-blue-500 text-3xl" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Purchased Recipes</h1>
                    <p className="text-gray-600 mt-1">
                        Recipes you've purchased
                    </p>
                </div>
            </div>

            <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-2xl font-semibold text-gray-600">No purchases yet</h3>
                <p className="text-gray-400 mt-2">Buy premium recipes from the community!</p>
                <Link
                    href="/recipes"
                    className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all"
                >
                    Browse Recipes
                </Link>
            </div>
        </div>
    );
}