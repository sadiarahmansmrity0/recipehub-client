'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaClock, FaUser, FaEye } from 'react-icons/fa';
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
            const response = await api.get('/payment/purchased');
            console.log("Raw Response Data:", response.data);
            
            // ✅ Fix: Check if data is an array of items, or if your backend requires fetching all premium items
            let finalizedData = [];
            if (Array.isArray(response.data)) {
                finalizedData = response.data.map(item => (item.recipeId && typeof item.recipeId === 'object' ? item.recipeId : item));
            } else if (response.data?.recipes) {
                finalizedData = response.data.recipes;
            }

            // Fallback: If you are premium, you might want to fetch premium content if the purchase array is empty
            if (finalizedData.length === 0 && (user?.isPremium || user?.role === 'premium')) {
                const fallbackRes = await api.get('/recipes?isPremium=true');
                finalizedData = Array.isArray(fallbackRes.data) ? fallbackRes.data : (fallbackRes.data?.recipes || []);
            }

            setRecipes(finalizedData);
        } catch (error) {
            console.error('Error fetching purchased:', error);
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
                    <h1 className="text-3xl font-bold text-gray-800">Purchased & Premium Recipes</h1>
                    <p className="text-gray-600 mt-1">
                        {recipes.length} available recipe{recipes.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {recipes.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-2xl font-semibold text-gray-600">No unlocked content</h3>
                    <p className="text-gray-400 mt-2">Unlock items or buy recipes from the platform!</p>
                    <Link href="/recipes" className="inline-flex items-center gap-2 mt-4 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold">
                        Browse Recipes
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe, index) => {
                        const rId = recipe._id || recipe.id;
                        if (!rId) return null;
                        return (
                            <motion.div
                                key={rId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="relative h-48 bg-gray-200">
                                    <img src={recipe.recipeImage || 'https://via.placeholder.com/400x300'} alt={recipe.recipeName} className="w-full h-full object-cover" />
                                    <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        ✅ Unlocked
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.recipeName}</h3>
                                    <Link href={`/recipes/${rId}`} className="mt-4 block w-full text-center bg-orange-500 text-white py-2 rounded-xl font-semibold">
                                        View Recipe
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}