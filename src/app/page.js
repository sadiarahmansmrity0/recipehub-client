'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaHeart, FaStar, FaUtensils, FaClock, FaUser } from 'react-icons/fa';
import api from '@/lib/axios';

export default function Home() {
    const { user } = useContext(AuthContext);
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Define asynchronous requests cleanly at component lifecycle mount
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                console.log('📡 Fetching app content from baseURL:', api.defaults.baseURL);
                
                const [featuredRes, popularRes] = await Promise.all([
                    api.get('/recipes/featured'),
                    api.get('/recipes/popular')
                ]);
                
                setFeaturedRecipes(featuredRes.data || []);
                setPopularRecipes(popularRes.data || []);
            } catch (error) {
                console.error('❌ Error fetching recipes from server:', error.message);
                setFeaturedRecipes([]);
                setPopularRecipes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    // 2. Put the loading layout state AFTER hooks are instantiated to prevent hydration crashes
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Reusable Recipe Card Layout
    const RecipeCard = ({ recipe, index }) => (
        <motion.div
            key={recipe._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
        >
            <div className="relative h-48 bg-gray-50">
                <img
                    src={recipe.recipeImage || 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Recipe'}
                    alt={recipe.recipeName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Recipe';
                    }}
                />
                {recipe.isFeatured && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                        <FaStar className="text-xs" /> Featured
                    </span>
                )}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaHeart className="text-rose-400" />
                    {recipe.likesCount || 0}
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 flex-wrap">
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-semibold">
                        {recipe.category || 'General'}
                    </span>
                    <span>•</span>
                    <span>{recipe.cuisineType || 'Various'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {recipe.preparationTime || 0}m
                    </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {recipe.recipeName}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                        <FaUser className="text-xs text-gray-400" />
                        {recipe.authorName || 'Chef'}
                    </span>
                </div>
                
                <Link
                    href={`/recipes/${recipe._id}`}
                    className="block w-full text-center bg-gradient-to-r from-orange-500 to-rose-500 text-white py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all shadow-sm"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Banner Section */}
            <section className="relative bg-gradient-to-r from-orange-500 to-rose-500 text-white py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-center md:text-left"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                            Discover & Share
                            <span className="block text-yellow-200">Amazing Recipes</span>
                        </h1>
                        <p className="text-xl mb-8 opacity-95">
                            Join thousands of food lovers sharing their culinary creations
                        </p>
                        <Link
                            href="/recipes"
                            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all"
                        >
                            Browse Recipes <FaArrowRight />
                        </Link>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 w-full max-w-md"
                    >
                        <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 rounded-xl p-4 text-center border border-white/5">
                                    <FaUtensils className="text-3xl mx-auto mb-2 text-white" />
                                    <p className="font-bold text-xl">100+</p>
                                    <p className="text-xs opacity-80">Recipes</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center border border-white/5">
                                    <FaHeart className="text-3xl mx-auto mb-2 text-rose-300" />
                                    <p className="font-bold text-xl">500+</p>
                                    <p className="text-xs opacity-80">Favorites</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center border border-white/5">
                                    <FaStar className="text-3xl mx-auto mb-2 text-yellow-300" />
                                    <p className="font-bold text-xl">4.8</p>
                                    <p className="text-xs opacity-80">Rating</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center border border-white/5">
                                    <FaUser className="text-3xl mx-auto mb-2 text-blue-200" />
                                    <p className="font-bold text-xl">1000+</p>
                                    <p className="text-xs opacity-80">Users</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Recipes Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800">Featured Recipes</h2>
                        <p className="text-gray-500 mt-2">Hand-picked recipes from our community</p>
                    </div>

                    {featuredRecipes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No featured recipes available right now.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredRecipes.map((recipe, index) => (
                                <RecipeCard key={recipe._id} recipe={recipe} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Popular Recipes Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800">Popular Recipes</h2>
                        <p className="text-gray-500 mt-2">Most loved recipes by our community</p>
                    </div>

                    {popularRecipes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No popular recipes available right now.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {popularRecipes.map((recipe, index) => (
                                <RecipeCard key={recipe._id} recipe={recipe} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-gradient-to-r from-orange-600 to-rose-600 text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">Ready to Share Your Recipes?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join our community of food lovers and start sharing your culinary creations
                    </p>
                    <Link
                        href={user ? '/dashboard' : '/register'}
                        className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        {user ? 'Go to Dashboard' : 'Get Started'}
                        <FaArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
}