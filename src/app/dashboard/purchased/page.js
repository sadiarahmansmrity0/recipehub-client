'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaClock, FaUser, FaEye, FaSpinner } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function PurchasedRecipes() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchPurchased();
        }
    }, [user, authLoading, router]);

    const fetchPurchased = async () => {
        try {
            setLoading(true);
            console.log('📡 Fetching purchased recipes...');
            const response = await api.get('/payment/purchased');
            console.log('📥 Purchased recipes:', response.data);
            setRecipes(response.data || []);
        } catch (error) {
            console.error('❌ Error fetching purchased:', error);
            setError('Failed to load purchased recipes');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <FaShoppingCart className="text-blue-500 text-3xl" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Purchased Recipes</h1>
                    <p className="text-gray-600 mt-1">
                        {recipes.length} purchased recipe{recipes.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={fetchPurchased}
                    className="ml-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    {error}
                </div>
            )}

            {recipes.length === 0 ? (
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe, index) => (
                        <motion.div
                            key={recipe._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="relative h-48 bg-gray-200">
                                <img
                                    src={recipe.recipeImage || 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Recipe'}
                                    alt={recipe.recipeName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Recipe';
                                    }}
                                />
                                <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                                    ✅ Purchased
                                </span>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                                    <span className="bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">
                                        {recipe.category || 'Uncategorized'}
                                    </span>
                                    <span>•</span>
                                    <span>{recipe.cuisineType || 'Various'}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                                    {recipe.recipeName}
                                </h3>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <FaUser className="text-xs" />
                                        {recipe.authorName || 'Unknown'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaClock className="text-xs" />
                                        {recipe.preparationTime || 0}m
                                    </span>
                                </div>
                                <Link
                                    href={`/recipes/${recipe._id}`}
                                    className="mt-4 block w-full text-center bg-gradient-to-r from-orange-500 to-rose-500 text-white py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <FaEye /> View Recipe
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}