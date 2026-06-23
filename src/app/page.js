'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight, FaHeart, FaStar, FaUtensils, FaClock } from 'react-icons/fa';
import api from '@/lib/axios';

export default function Home() {
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
                setFeaturedRecipes(featuredRes.data);
                setPopularRecipes(popularRes.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

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
                            Browse Recipes
                            <FaArrowRight />
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

            {/* Featured Recipes Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800">Featured Recipes</h2>
                        <p className="text-gray-600 mt-2">Hand-picked recipes from our community</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredRecipes.map((recipe, index) => (
                                <motion.div
                                    key={recipe._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="relative h-48">
                                        <Image
                                            src={recipe.recipeImage || '/placeholder.jpg'}
                                            alt={recipe.recipeName}
                                            fill
                                            className="object-cover"
                                        />
                                        {recipe.isFeatured && (
                                            <span className="absolute top-3 right-3 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                ★ Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                                {recipe.category}
                                            </span>
                                            <span>•</span>
                                            <span>{recipe.cuisineType}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <FaClock className="text-xs" />
                                                {recipe.preparationTime}m
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {recipe.recipeName}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            by {recipe.authorName}
                                        </p>
                                        <Link
                                            href={`/recipes/${recipe._id}`}
                                            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700"
                                        >
                                            View Details
                                            <FaArrowRight className="text-sm" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Popular Recipes Section */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800">Popular Recipes</h2>
                        <p className="text-gray-600 mt-2">Most loved recipes by our community</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {popularRecipes.map((recipe, index) => (
                            <motion.div
                                key={recipe._id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={recipe.recipeImage || '/placeholder.jpg'}
                                        alt={recipe.recipeName}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-3 right-3 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <FaHeart className="text-xs" />
                                        {recipe.likesCount}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {recipe.recipeName}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        by {recipe.authorName}
                                    </p>
                                    <Link
                                        href={`/recipes/${recipe._id}`}
                                        className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 mt-4"
                                    >
                                        View Details
                                        <FaArrowRight className="text-sm" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
                        href="/register"
                        className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        Get Started
                        <FaArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
}