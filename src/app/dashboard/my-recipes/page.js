'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaEdit, 
    FaTrash, 
    FaPlus, 
    FaClock, 
    FaUser,
    FaHeart,
    FaStar,
    FaExclamationTriangle
} from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function MyRecipes() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        fetchRecipes();
    }, [user, authLoading]);

    const fetchRecipes = async () => {
    try {
        // Use the correct API endpoint
        const response = await api.get('/recipes/user/my-recipes');
        setRecipes(response.data);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to load recipes');
    } finally {
        setLoading(false);
    }
};
    const handleDelete = async (recipeId) => {
        setDeleting(true);
        try {
            await api.delete(`/recipes/${recipeId}`);
            setRecipes(recipes.filter(r => r._id !== recipeId));
            setDeleteModal(null);
        } catch (error) {
            console.error('Error deleting recipe:', error);
            setError('Failed to delete recipe');
        } finally {
            setDeleting(false);
        }
    };

    if (authLoading || loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
                    <p className="text-gray-600 mt-1">
                        You have {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                        {!user?.isPremium && (
                            <span className="ml-2 text-sm text-orange-600">
                                (Max 2 recipes for free users)
                            </span>
                        )}
                    </p>
                </div>
                <Link
                    href="/dashboard/add-recipe"
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
                >
                    <FaPlus /> Add New Recipe
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    {error}
                </div>
            )}

            {/* Recipe Limit Warning */}
            {!user?.isPremium && recipes.length >= 2 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
                    <FaExclamationTriangle className="text-yellow-600 text-xl" />
                    <div>
                        <p className="text-yellow-700 font-semibold">Recipe Limit Reached</p>
                        <p className="text-yellow-600 text-sm">
                            You've reached the maximum of 2 recipes. 
                            <Link href="/dashboard/premium" className="font-semibold underline ml-1">
                                Upgrade to Premium
                            </Link>
                            {' '}for unlimited recipes!
                        </p>
                    </div>
                </div>
            )}

            {/* Recipes Grid */}
            {recipes.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <div className="text-6xl mb-4">🍳</div>
                    <h3 className="text-2xl font-semibold text-gray-600">No recipes yet</h3>
                    <p className="text-gray-400 mt-2">Start sharing your culinary creations!</p>
                    <Link
                        href="/dashboard/add-recipe"
                        className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all"
                    >
                        <FaPlus /> Create Your First Recipe
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
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={recipe.recipeImage || '/placeholder.jpg'}
                                    alt={recipe.recipeName}
                                    fill
                                    className="object-cover"
                                />
                                {recipe.isFeatured && (
                                    <span className="absolute top-3 right-3 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <FaStar className="text-sm" /> Featured
                                    </span>
                                )}
                                {recipe.isPremium && (
                                    <span className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        Premium
                                    </span>
                                )}
                                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <FaHeart className="text-rose-400" />
                                    {recipe.likesCount || 0}
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
                                        <FaClock className="text-xs" />
                                        {recipe.preparationTime}m
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaUser className="text-xs" />
                                        {recipe.authorName}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/recipes/${recipe._id}`}
                                        className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-all"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/dashboard/edit-recipe/${recipe._id}`}
                                        className="flex-1 text-center bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-medium hover:bg-orange-200 transition-all"
                                    >
                                        <FaEdit className="inline mr-1" /> Edit
                                    </Link>
                                    <button
                                        onClick={() => setDeleteModal(recipe)}
                                        className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-medium hover:bg-red-200 transition-all"
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
                {deleteModal && (
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
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete "{deleteModal.recipeName}"? 
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteModal(null)}
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDelete(deleteModal._id)}
                                        disabled={deleting}
                                        className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
                                    >
                                        {deleting ? 'Deleting...' : 'Delete'}
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