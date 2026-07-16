'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaClock, FaUser, FaHeart, FaStar } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Soup', 'Salad'];
const CUISINES = ['All', 'Italian', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Japanese', 'French', 'American', 'Mediterranean'];

export default function BrowseRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [cuisine, setCuisine] = useState('All');
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, limit: 9 });

    useEffect(() => {
        fetchRecipes();
    }, [search, category, cuisine, pagination.page]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            console.log('📡 Fetching recipes...');
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(search && { search }),
                ...(category !== 'All' && { category }),
                ...(cuisine !== 'All' && { cuisine })
            });

            const response = await api.get(`/recipes?${params}`);
            console.log('✅ Recipes response:', response.data);
            
            // Handle both paginated and non-paginated responses
            if (response.data.recipes) {
                setRecipes(response.data.recipes);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.pagination?.total || response.data.recipes.length,
                    pages: response.data.pagination?.pages || 1
                }));
            } else {
                setRecipes(response.data || []);
            }
        } catch (error) {
            console.error('❌ Error fetching recipes:', error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Browse Recipes</h1>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                    >
                        {CUISINES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-6 text-gray-600">
                Found {pagination.total} recipes
            </div>

            {recipes.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍳</div>
                    <h3 className="text-2xl font-semibold text-gray-600">No recipes found</h3>
                    <p className="text-gray-400 mt-2">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe, index) => (
                        <motion.div
                            key={recipe._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                        >
                            <div className="relative h-52 bg-gray-200">
                                <img
                                    src={recipe.recipeImage || 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Recipe'}
                                    alt={recipe.recipeName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Recipe';
                                    }}
                                />
                                {recipe.isFeatured && (
                                    <span className="absolute top-3 right-3 bg-yellow-400 text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <FaStar className="text-xs" /> Featured
                                    </span>
                                )}
                                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                                    <FaHeart className="text-rose-400 text-xs" />
                                    {recipe.likesCount || 0}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                                    <span className="bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-medium">
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
                                <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                                    {recipe.recipeName}
                                </h3>
                                <p className="text-sm text-gray-500">by {recipe.authorName || 'Unknown'}</p>
                                <Link
                                    href={`/recipes/${recipe._id}`}
                                    className="mt-4 block w-full text-center bg-gradient-to-r from-orange-500 to-rose-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all text-sm"
                                >
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Previous
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-xl transition ${
                                pagination.page === page
                                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                                    : 'border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}