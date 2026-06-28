'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaHeart, FaStar, FaUtensils, FaClock, FaUser } from 'react-icons/fa';
import api from '@/lib/axios';
import { FaCrown } from "react-icons/fa";

export default function Home() {
    const { user } = useContext(AuthContext);
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const [featuredRes, popularRes] = await Promise.all([
                    api.get('/recipes/featured'),
                    api.get('/recipes/popular')
                ]);
                setFeaturedRecipes(featuredRes.data || []);
                setPopularRecipes(popularRes.data || []);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    // SAME CARD STYLE AS BROWSE PAGE
    const RecipeCard = ({ recipe, index }) => (
        <motion.div
            key={recipe._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            <div className="relative h-48">
                <img
                    src={recipe.recipeImage || 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Recipe'}
                    alt={recipe.recipeName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Recipe';
                    }}
                />
                {recipe.isFeatured && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
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
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                        {recipe.category || 'Uncategorized'}
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
                    className="mt-4 block w-full text-center bg-gradient-to-r from-orange-500 to-rose-500 text-white py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen">
            {/* Banner Section */}
            <section className="relative bg-gradient-to-r from-orange-500 to-rose-500 text-white py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-center md:text-left"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Discover & Share
                            <span className="block text-yellow-200">Amazing Recipes</span>
                        </h1>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of food lovers sharing their culinary creations
                        </p>
                        <Link
                            href="/recipes"
                            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                        >
                            Browse Recipes <FaArrowRight />
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 mt-8 md:mt-0"
                    >
                        <div className="relative">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
                            <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/30 rounded-xl p-4 text-center">
                                        <FaUtensils className="text-3xl mx-auto mb-2" />
                                        <p className="font-semibold">100+</p>
                                        <p className="text-sm opacity-80">Recipes</p>
                                    </div>
                                    <div className="bg-white/30 rounded-xl p-4 text-center">
                                        <FaHeart className="text-3xl mx-auto mb-2 text-rose-300" />
                                        <p className="font-semibold">500+</p>
                                        <p className="text-sm opacity-80">Favorites</p>
                                    </div>
                                    <div className="bg-white/30 rounded-xl p-4 text-center">
                                        <FaStar className="text-3xl mx-auto mb-2 text-yellow-300" />
                                        <p className="font-semibold">4.8</p>
                                        <p className="text-sm opacity-80">Rating</p>
                                    </div>
                                    <div className="bg-white/30 rounded-xl p-4 text-center">
                                        <FaClock className="text-3xl mx-auto mb-2" />
                                        <p className="font-semibold">1000+</p>
                                        <p className="text-sm opacity-80">Users</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Recipes Section - SAME STYLE AS BROWSE */}
              <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Featured Recipes</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Hand-picked recipes from our community</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : featuredRecipes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No featured recipes available</p>
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

            {/* Popular Recipes Section - SAME STYLE AS BROWSE */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800">Popular Recipes</h2>
                        <p className="text-gray-600 mt-2">Most loved recipes by our community</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : popularRecipes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No popular recipes available</p>
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