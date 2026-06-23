'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaClock, FaUser, FaTrash } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function Favorites() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        fetchFavorites();
    }, [user, authLoading]);

    const fetchFavorites = async () => {
        try {
            const response = await api.get('/recipes/user/favorites');
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (recipeId) => {
        try {
            await api.post(`/recipes/${recipeId}/favorite`);
            setFavorites(favorites.filter(r => r._id !== recipeId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    if (authLoading || loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <FaHeart className="text-rose-500 text-3xl" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
                    <p className="text-gray-600 mt-1">
                        {favorites.length} saved recipe{favorites.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-2xl font-semibold text-gray-600">No favorites yet</h3>
                    <p className="text-gray-400 mt-2">Start saving recipes you love!</p>
                    <Link
                        href="/recipes"
                        className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all"
                    >
                        Browse Recipes
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((recipe, index) => (
                        <motion.div
                            key={recipe._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={recipe.recipeImage || '/placeholder.jpg'}
                                    alt={recipe.recipeName}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => removeFavorite(recipe._id)}
                                    className="absolute top-3 right-3 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-all shadow-lg"
                                >
                                    <FaTrash className="text-sm" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                        {recipe.category}
                                    </span>
                                    <span>•</span>
                                    <span>{recipe.cuisineType}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {recipe.recipeName}
                                </h3>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <FaUser className="text-xs" />
                                        {recipe.authorName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaClock className="text-xs" />
                                        {recipe.preparationTime}m
                                    </span>
                                </div>
                                <Link
                                    href={`/recipes/${recipe._id}`}
                                    className="mt-4 block w-full text-center bg-gradient-to-r from-orange-500 to-rose-500 text-white py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all"
                                >
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}