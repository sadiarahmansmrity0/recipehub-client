'use client';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    FaUtensils,
    FaHeart,
    FaThumbsUp,
    FaPlus,
    FaUser,
    FaBookOpen,
    FaShoppingCart,
    FaStar,
    FaCrown
} from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function Dashboard() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [stats, setStats] = useState({
        totalRecipes: 0,
        totalFavorites: 0,
        totalLikes: 0
    });
    const [loading, setLoading] = useState(true);
    const [userRecipes, setUserRecipes] = useState([]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [recipesRes, favoritesRes] = await Promise.all([
                    api.get('/recipes/user/my-recipes'),
                    api.get('/recipes/user/favorites')
                ]);

                const recipes = recipesRes.data;
                setUserRecipes(recipes);

                // Calculate total likes
                let totalLikes = 0;
                recipes.forEach(recipe => {
                    totalLikes += recipe.likesCount || 0;
                });

                setStats({
                    totalRecipes: recipes.length,
                    totalFavorites: favoritesRes.data.length,
                    totalLikes
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) return <Loading />;

    const statCards = [
        {
            title: 'Total Recipes',
            value: stats.totalRecipes,
            icon: FaUtensils,
            bg: 'from-orange-400 to-orange-500',
            gradient: 'from-orange-50 to-orange-100/50',
            border: 'border-orange-200',
            text: 'text-orange-600'
        },
        {
            title: 'Total Favorites',
            value: stats.totalFavorites,
            icon: FaHeart,
            bg: 'from-rose-400 to-rose-500',
            gradient: 'from-rose-50 to-rose-100/50',
            border: 'border-rose-200',
            text: 'text-rose-600'
        },
        {
            title: 'Total Likes',
            value: stats.totalLikes,
            icon: FaThumbsUp,
            bg: 'from-blue-400 to-blue-500',
            gradient: 'from-blue-50 to-blue-100/50',
            border: 'border-blue-200',
            text: 'text-blue-600'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8 flex flex-wrap items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-600 mt-2">Here's a summary of your cooking journey</p>
                </div>
                {user?.isPremium && (
                    <span className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                        <FaCrown className="text-yellow-200" />
                        Premium Member
                    </span>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {stat.title}
                                    </p>
                                    <p className="text-4xl font-bold text-gray-800 mt-2">{stat.value}</p>
                                </div>
                                <div className={`bg-gradient-to-r ${stat.bg} p-3 rounded-xl shadow-md`}>
                                    <Icon className="text-white text-xl" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100/50 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/add-recipe"
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <FaPlus />
                            Add Recipe
                        </Link>
                        <Link
                            href="/recipes"
                            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                        >
                            <FaBookOpen />
                            Browse Recipes
                        </Link>
                    </div>
                </div>

                {/* Recent Recipes */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100/50 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Recent Recipes</h2>
                    {userRecipes.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">🍳</div>
                            <p className="text-gray-500">No recipes yet</p>
                            <Link
                                href="/dashboard/add-recipe"
                                className="text-orange-600 hover:text-orange-700 font-semibold"
                            >
                                Create your first recipe
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {userRecipes.slice(0, 3).map((recipe) => (
                                <Link
                                    key={recipe._id}
                                    href={`/recipes/${recipe._id}`}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{recipe.recipeName}</p>
                                        <p className="text-sm text-gray-500">{recipe.category}</p>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {new Date(recipe.createdAt).toLocaleDateString()}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Feature */}
            {!user?.isPremium && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaStar className="text-yellow-500" />
                                Upgrade to Premium
                            </h3>
                            <p className="text-gray-600">
                                Get unlimited recipe uploads and exclusive features
                            </p>
                        </div>
                        <Link
                            href="/dashboard/premium"
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Upgrade Now
                        </Link>
                    </div>
                </div>
            )}

            {/* Dashboard Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <Link
                    href="/dashboard/profile"
                    className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all"
                >
                    <FaUser className="text-orange-500 text-2xl mb-2" />
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                </Link>
                <Link
                    href="/dashboard/my-recipes"
                    className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all"
                >
                    <FaUtensils className="text-orange-500 text-2xl mb-2" />
                    <span className="text-sm font-medium text-gray-700">My Recipes</span>
                </Link>
                <Link
                    href="/dashboard/favorites"
                    className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all"
                >
                    <FaHeart className="text-rose-500 text-2xl mb-2" />
                    <span className="text-sm font-medium text-gray-700">Favorites</span>
                </Link>
                <Link
                    href="/dashboard/purchased"
                    className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all"
                >
                    <FaShoppingCart className="text-blue-500 text-2xl mb-2" />
                    <span className="text-sm font-medium text-gray-700">Purchased</span>
                </Link>
            </div>
        </div>
    );
}