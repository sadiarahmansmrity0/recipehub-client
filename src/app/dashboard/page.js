'use client';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUtensils, FaHeart, FaThumbsUp, FaPlus, FaBookOpen, FaShoppingCart, FaStar, FaCrown, FaUser } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function Dashboard() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [stats, setStats] = useState({ totalRecipes: 0, totalFavorites: 0, totalLikes: 0 });
    const [loading, setLoading] = useState(true);
    const [userRecipes, setUserRecipes] = useState([]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        const fetchData = async () => {
            try {
                const [recipesRes, favoritesRes] = await Promise.all([
                    api.get('/recipes/user/my-recipes'),
                    api.get('/recipes/user/favorites')
                ]);
                const recipes = recipesRes.data || [];
                setUserRecipes(recipes);
                let totalLikes = 0;
                recipes.forEach(r => totalLikes += r.likesCount || 0);
                setStats({
                    totalRecipes: recipes.length,
                    totalFavorites: favoritesRes.data?.length || 0,
                    totalLikes
                });
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user, authLoading, router]);

    // Custom spinner while loading
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-orange-200">
                    {user?.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <FaUser className="text-orange-500 text-2xl" />}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h1>
                    <p className="text-gray-500">Here's a summary of your cooking journey</p>
                </div>
                {user?.isPremium && (
                    <span className="ml-auto flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-full font-semibold">
                        <FaCrown /> Premium
                    </span>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { title: 'Total Recipes', value: stats.totalRecipes, icon: FaUtensils, color: 'orange' },
                    { title: 'Total Favorites', value: stats.totalFavorites, icon: FaHeart, color: 'rose' },
                    { title: 'Total Likes', value: stats.totalLikes, icon: FaThumbsUp, color: 'blue' }
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    const colors = {
                        orange: 'bg-orange-50 border-orange-200 text-orange-600',
                        rose: 'bg-rose-50 border-rose-200 text-rose-600',
                        blue: 'bg-blue-50 border-blue-200 text-blue-600'
                    };
                    return (
                        <div key={i} className={`${colors[stat.color]} border rounded-2xl p-6 shadow-sm`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-wider opacity-70">{stat.title}</p>
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                </div>
                                <Icon className="text-2xl opacity-70" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Debug logs */}
            {console.log('📊 Dashboard stats:', stats)}
            {console.log('📝 Recent recipes:', userRecipes)}

            {/* Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/dashboard/add-recipe" className="flex items-center justify-center gap-2 bg-orange-50 text-orange-600 px-4 py-3 rounded-xl font-medium border border-orange-200 hover:bg-orange-100">
                            <FaPlus /> Add Recipe
                        </Link>
                        <Link href="/recipes" className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl font-medium border border-blue-200 hover:bg-blue-100">
                            <FaBookOpen /> Browse
                        </Link>
                        <Link href="/dashboard/favorites" className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 px-4 py-3 rounded-xl font-medium border border-rose-200 hover:bg-rose-100">
                            <FaHeart /> Favorites
                        </Link>
                        <Link href="/dashboard/purchased" className="flex items-center justify-center gap-2 bg-green-50 text-green-600 px-4 py-3 rounded-xl font-medium border border-green-200 hover:bg-green-100">
                            <FaShoppingCart /> Purchased
                        </Link>
                    </div>
                    {!user?.isPremium && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200 flex justify-between items-center">
                            <div>
                                <p className="font-semibold flex items-center gap-1"><FaStar className="text-yellow-500" /> Upgrade to Premium</p>
                                <p className="text-sm text-gray-600">{user?.recipeCount || 0}/2 recipes used</p>
                            </div>
                            <Link href="/dashboard/premium" className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90">Upgrade</Link>
                        </div>
                    )}
                </div>

                {/* Recent Recipes */}
                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Recent Recipes</h2>
                    {userRecipes.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">🍳</div>
                            <p className="text-gray-500">No recipes yet</p>
                            <Link href="/dashboard/add-recipe" className="text-orange-600 font-semibold text-sm">Create your first recipe →</Link>
                        </div>
                    ) : (
                        userRecipes.slice(0, 4).map(r => (
                            <Link key={r._id} href={`/recipes/${r._id}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 mb-2 transition">
                                <div>
                                    <p className="font-medium text-gray-800">{r.recipeName}</p>
                                    <p className="text-sm text-gray-500">{r.category}</p>
                                </div>
                                <span className="text-sm text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
