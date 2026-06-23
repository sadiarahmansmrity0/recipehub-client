'use client';
import { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    FaHeart,
    FaThumbsUp,
    FaFlag,
    FaStar,
    FaClock,
    FaUser,
    FaShoppingCart,
    FaBookmark,
    FaShare
} from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import api from '@/lib/axios';
import Loading from '@/components/Loading';
import ReportModal from '@/components/ReportModal';

export default function RecipeDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`/recipes/${id}`);
                setRecipe(response.data);
                if (user) {
                    setIsLiked(response.data.likes.includes(user.id));
                    setIsFavorited(response.data.favorites.includes(user.id));
                }
            } catch (error) {
                setError('Recipe not found');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, user]);

    const handleLike = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        try {
            const response = await api.post(`/recipes/${id}/like`);
            setIsLiked(response.data.isLiked);
            setRecipe(prev => ({
                ...prev,
                likesCount: response.data.likesCount
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleFavorite = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        try {
            const response = await api.post(`/recipes/${id}/favorite`);
            setIsFavorited(response.data.isFavorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handlePurchase = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        // Implement Stripe checkout
        // We'll add this later
    };

    if (loading) return <Loading />;
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h2 className="text-3xl font-bold text-gray-800">{error}</h2>
                <button
                    onClick={() => router.push('/recipes')}
                    className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                    Browse Recipes
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Recipe Header */}
                <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
                    <Image
                        src={recipe.recipeImage || '/placeholder.jpg'}
                        alt={recipe.recipeName}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-orange-500 px-3 py-1 rounded-full text-sm">
                                {recipe.category}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                {recipe.cuisineType}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                {recipe.difficultyLevel}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold">{recipe.recipeName}</h1>
                        <div className="flex items-center gap-6 mt-4">
                            <span className="flex items-center gap-2">
                                <FaUser />
                                {recipe.authorName}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaClock />
                                {recipe.preparationTime} minutes
                            </span>
                            <span className="flex items-center gap-2">
                                <FaHeart />
                                {recipe.likesCount} likes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                            isLiked
                                ? 'bg-rose-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <FaThumbsUp />
                        {isLiked ? 'Liked' : 'Like'}
                    </button>
                    <button
                        onClick={handleFavorite}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                            isFavorited
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <FaBookmark />
                        {isFavorited ? 'Saved' : 'Save'}
                    </button>
                    <button
                        onClick={() => setShowReport(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    >
                        <FaFlag />
                        Report
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                        <FaShare />
                        Share
                    </button>
                    {recipe.price > 0 && (
                        <button
                            onClick={handlePurchase}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-lg transition-all"
                        >
                            <FaShoppingCart />
                            Purchase ${recipe.price}
                        </button>
                    )}
                </div>

                {/* Recipe Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-center gap-2 text-gray-700">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full" />
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
                            <ol className="space-y-4">
                                {recipe.instructions.map((step, index) => (
                                    <li key={index} className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </span>
                                        <p className="text-gray-700">{step}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Recipe Info</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Category</span>
                                    <span className="font-medium">{recipe.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Cuisine</span>
                                    <span className="font-medium">{recipe.cuisineType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Difficulty</span>
                                    <span className="font-medium">{recipe.difficultyLevel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Prep Time</span>
                                    <span className="font-medium">{recipe.preparationTime} min</span>
                                </div>
                                {recipe.isPremium && (
                                    <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                                        <p className="text-yellow-700 font-semibold text-center flex items-center justify-center gap-2">
                                            <FaStar className="text-yellow-500" />
                                            Premium Recipe
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <ReportModal
                isOpen={showReport}
                onClose={() => setShowReport(false)}
                recipeId={id}
            />
        </div>
    );
}