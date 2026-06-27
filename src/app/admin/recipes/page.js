'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch,
    FaStar,
    FaRegStar,
    FaTrash,
    FaEdit,
    FaEye,
    FaSpinner,
    FaFilter,
    FaUtensils,
    FaUser,
    FaClock
} from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function AdminRecipes() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            if (user.role !== 'admin') {
                router.push('/dashboard');
                return;
            }
            fetchRecipes();
        }
    }, [user, authLoading]);

    const fetchRecipes = async () => {
        try {
            const response = await api.get('/recipes');
            setRecipes(response.data.recipes || response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

    const handleFeatureToggle = async (recipeId, currentStatus) => {
        setActionLoading(recipeId);
        try {
            const response = await api.put(`/recipes/${recipeId}/feature`);
            if (response.data.success) {
                setRecipes(prev =>
                    prev.map(r =>
                        r._id === recipeId
                            ? { ...r, isFeatured: response.data.isFeatured }
                            : r
                    )
                );
            }
        } catch (error) {
            console.error('Error toggling feature:', error);
            setError('Failed to update recipe');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone!')) {
            return;
        }

        setActionLoading(recipeId);
        try {
            await api.delete(`/recipes/${recipeId}`);
            setRecipes(prev => prev.filter(r => r._id !== recipeId));
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting recipe:', error);
            setError('Failed to delete recipe');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredRecipes = recipes.filter(r => {
        const matchesSearch = r.recipeName.toLowerCase().includes(search.toLowerCase()) ||
                             r.authorName.toLowerCase().includes(search.toLowerCase());
        if (filter === 'featured') return matchesSearch && r.isFeatured;
        if (filter === 'premium') return matchesSearch && r.isPremium;
        if (filter === 'free') return matchesSearch && !r.isPremium;
        return matchesSearch;
    });

    if (authLoading || loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manage Recipes</h1>
                    <p className="text-gray-600 mt-1">
                        Total {recipes.length} recipes in the platform
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all w-48 md:w-64"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                    >
                        <option value="all">All Recipes</option>
                        <option value="featured">Featured</option>
                        <option value="premium">Premium</option>
                        <option value="free">Free</option>
                    </select>
                    <button
                        onClick={fetchRecipes}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    {error}
                </div>
            )}

            {/* Recipes Grid */}
            {filteredRecipes.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <div className="text-6xl mb-4">🍳</div>
                    <h3 className="text-2xl font-semibold text-gray-600">No recipes found</h3>
                    <p className="text-gray-400 mt-2">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((recipe, index) => (
                        <motion.div
                            key={recipe._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="relative h-48">
                                <img
                                    src={recipe.recipeImage || 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Recipe'}
                                    alt={recipe.recipeName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {recipe.isFeatured && (
                                        <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <FaStar className="text-sm" /> Featured
                                        </span>
                                    )}
                                    {recipe.isPremium && (
                                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            Premium
                                        </span>
                                    )}
                                </div>
                                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    <span>❤️ {recipe.likesCount || 0}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                        {recipe.category}
                                    </span>
                                    <span>•</span>
                                    <span>{recipe.cuisineType}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                                    {recipe.recipeName}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <FaUser className="text-xs" />
                                        {recipe.authorName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaClock className="text-xs" />
                                        {recipe.preparationTime}m
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleFeatureToggle(recipe._id, recipe.isFeatured)}
                                        disabled={actionLoading === recipe._id}
                                        className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                                            recipe.isFeatured
                                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {actionLoading === recipe._id ? (
                                            <FaSpinner className="animate-spin mx-auto" />
                                        ) : recipe.isFeatured ? (
                                            <span className="flex items-center justify-center gap-1">
                                                <FaStar /> Featured
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-1">
                                                <FaRegStar /> Feature
                                            </span>
                                        )}
                                    </button>
                                    <Link
                                        href={`/recipes/${recipe._id}`}
                                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                                    >
                                        <FaEye />
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedRecipe(recipe);
                                            setShowModal(true);
                                        }}
                                        className="px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showModal && selectedRecipe && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="text-5xl mb-4">⚠️</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Delete Recipe?</h3>
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to delete "{selectedRecipe.recipeName}"? 
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRecipe(selectedRecipe._id)}
                                        className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}