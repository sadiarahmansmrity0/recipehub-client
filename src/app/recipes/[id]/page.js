'use client';
import { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    FaShare,
    FaSpinner,
    FaArrowLeft,
    FaLock
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
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`/recipes/${id}`);
                console.log('Recipe data:', response.data);
                setRecipe(response.data);
                if (user) {
                    const likes = response.data.likes || [];
                    const favorites = response.data.favorites || [];
                    setIsLiked(likes.includes(user.id) || likes.includes(user._id));
                    setIsFavorited(favorites.includes(user.id) || favorites.includes(user._id));
                }
            } catch (error) {
                console.error('Error fetching recipe:', error);
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

    const handlePurchase = async () => {
    if (!user) {
        router.push('/login');
        return;
    }

    if (!recipe || recipe.price <= 0) {
        return;
    }

    setPurchasing(true);
    try {
        const response = await api.post('/payment/recipe', {
            recipeId: recipe._id,
            success_url: `${window.location.origin}/purchase-success`,
            cancel_url: `${window.location.origin}/recipes/${recipe._id}`
        });

        if (response.data.url) {
            window.location.href = response.data.url;
        }
    } catch (error) {
        console.error('Purchase error:', error);
        setError(error.response?.data?.message || 'Failed to start purchase');
    } finally {
        setPurchasing(false);
    }
};

    if (loading) return <Loading />;
    
    if (error || !recipe) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h2 className="text-3xl font-bold text-gray-800">{error || 'Recipe not found'}</h2>
                <button
                    onClick={() => router.push('/recipes')}
                    className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                    Browse Recipes
                </button>
            </div>
        );
    }

    const currentUserId = user ? (user.id || user._id)?.toString() : null;
    const recipeAuthorId = recipe ? (recipe.authorId?._id || recipe.authorId)?.toString() : null;
    
    const isAuthor = currentUserId && recipeAuthorId && currentUserId === recipeAuthorId;
    
    // ✅ Check if user has purchased this recipe (safely matching array strings/objects)
    const hasPurchased = user?.purchasedRecipes?.some(
        pId => pId?.toString() === recipe._id?.toString()
    );

    const highwayPremium = recipe.isPremium && recipe.price > 0;
    // An item can be purchased if it's premium, user isn't the author, and hasn't bought it yet
    const canPurchase = highwayPremium && !isAuthor && !hasPurchased;
    // Content should be locked if it's premium, user is not the author, and user hasn't purchased it
    const isLocked = highwayPremium && !isAuthor && !hasPurchased;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
                <FaArrowLeft /> Back
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Recipe Header */}
                <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
                    <img
                        src={recipe.recipeImage || 'https://via.placeholder.com/1200x600/FF6B35/FFFFFF?text=Recipe'}
                        alt={recipe.recipeName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-orange-500 px-3 py-1 rounded-full text-sm">
                                {recipe.category || 'Uncategorized'}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                {recipe.cuisineType || 'Various'}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                {recipe.difficultyLevel || 'Easy'}
                            </span>
                            {recipe.isPremium && (
                                <span className="bg-purple-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <FaStar /> Premium
                                </span>
                            )}
                            {recipe.isFeatured && (
                                <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                    <FaStar /> Featured
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl font-bold">{recipe.recipeName}</h1>
                        <div className="flex flex-wrap items-center gap-6 mt-4">
                            <span className="flex items-center gap-2">
                                <FaUser />
                                {recipe.authorName || 'Unknown Chef'}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaClock />
                                {recipe.preparationTime || 0} minutes
                            </span>
                            <span className="flex items-center gap-2">
                                <FaHeart className="text-rose-400" />
                                {recipe.likesCount || 0} likes
                            </span>
                            {isAuthor && (
                                <span className="bg-green-500/80 px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm">
                                    Your Recipe
                                </span>
                            )}
                            {!isAuthor && hasPurchased && (
                                <span className="bg-blue-500/80 px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm">
                                    Purchased
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <button 
                        onClick={handleLike} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                            isLiked ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <FaThumbsUp /> {isLiked ? 'Liked' : 'Like'}
                    </button>
                    
                    <button 
                        onClick={handleFavorite} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                            isFavorited ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <FaBookmark /> {isFavorited ? 'Saved' : 'Save'}
                    </button>
                    
                    <button 
                        onClick={() => setShowReport(true)} 
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    >
                        <FaFlag /> Report
                    </button>
                    
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                        <FaShare /> Share
                    </button>
                    
                    {canPurchase && (
                        <button
                            onClick={handlePurchase}
                            disabled={purchasing}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {purchasing ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <>
                                    <FaShoppingCart />
                                    Purchase ${recipe.price}
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Recipe Content Conditional Guard */}
                {isLocked ? (
                    <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-200 max-w-3xl mx-auto my-4">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
                            <FaLock />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Premium Recipe Content Locked</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            The ingredients list and complete step-by-step preparation instructions are reserved exclusively for premium purchasers.
                        </p>
                        <button
                            onClick={handlePurchase}
                            disabled={purchasing}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-md"
                        >
                            {purchasing ? <FaSpinner className="animate-spin" /> : `Unlock Now for $${recipe.price}`}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
                                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <li key={index} className="flex items-center gap-2 text-gray-700">
                                                <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                                                {ingredient}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No ingredients listed</p>
                                )}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
                                {recipe.instructions && recipe.instructions.length > 0 ? (
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
                                ) : (
                                    <p className="text-gray-500">No instructions listed</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Recipe Info</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Category</span>
                                        <span className="font-medium">{recipe.category || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Cuisine</span>
                                        <span className="font-medium">{recipe.cuisineType || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Difficulty</span>
                                        <span className="font-medium">{recipe.difficultyLevel || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Prep Time</span>
                                        <span className="font-medium">{recipe.preparationTime || 0} min</span>
                                    </div>
                                    {recipe.isPremium && (
                                        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                                            <p className="text-yellow-700 font-semibold text-center flex items-center justify-center gap-2">
                                                <FaStar className="text-yellow-500" />
                                                Premium Recipe
                                            </p>
                                            {recipe.price > 0 && (
                                                <p className="text-center text-sm text-yellow-600 mt-1">
                                                    Price: ${recipe.price}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            <ReportModal
                isOpen={showReport}
                onClose={() => setShowReport(false)}
                recipeId={id}
            />
        </div>
    );
}