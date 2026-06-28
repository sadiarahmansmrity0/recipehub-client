'use client';
import Link from 'next/link';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import api from '@/lib/axios';
import ThemeToggle from './ThemeToggle';
import { 
    FaUtensils, 
    FaUser, 
    FaSignOutAlt, 
    FaSignInAlt, 
    FaUserPlus, 
    FaBookOpen,
    FaCrown,
    FaShieldAlt,
    FaHome,
    FaChevronDown,
    FaHeart,
    FaShoppingCart,
    FaPlus
} from 'react-icons/fa';

export default function Navbar() {
    const { user, setUser } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            window.location.href = '/login';
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    // Public Navbar
    if (!user) {
        return (
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-2 rounded-xl">
                                <FaUtensils className="text-white text-xl" />
                            </div>
                            <span className="text-xl font-bold text-orange-600 dark:text-orange-400">RecipeHub</span>
                        </Link>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800">Home</Link>
                            <Link href="/recipes" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 flex items-center gap-1">
                                <FaBookOpen className="text-sm" /><span>Browse</span>
                            </Link>
                            <ThemeToggle />
                            <Link href="/login" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800">
                                <FaSignInAlt className="text-sm" />Login
                            </Link>
                            <Link href="/register" className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                                <FaUserPlus className="text-sm" /><span className="hidden sm:inline">Sign Up</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    // Logged In Navbar
    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-2 rounded-xl">
                            <FaUtensils className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">RecipeHub</span>
                    </Link>
                    
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 flex items-center gap-1">
                            <FaHome className="text-sm" /><span className="hidden sm:inline">Home</span>
                        </Link>
                        <Link href="/recipes" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 flex items-center gap-1">
                            <FaBookOpen className="text-sm" /><span>Browse</span>
                        </Link>
                        <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 font-medium">
                            Dashboard
                        </Link>
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 border border-purple-200 dark:border-purple-700">
                                <FaShieldAlt className="text-sm" /><span className="hidden sm:inline">Admin</span>
                            </Link>
                        )}
                        
                        <ThemeToggle />
                        
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} 
                                className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-gray-800 rounded-full border border-orange-200 dark:border-gray-700 hover:bg-orange-100 dark:hover:bg-gray-700 transition">
                                <div className="w-8 h-8 rounded-full bg-orange-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                                    {user?.image ? (
                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUser className="text-orange-500 dark:text-orange-400 text-sm" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{user?.name}</span>
                                {user?.isPremium && <FaCrown className="text-yellow-500 text-xs" />}
                                <FaChevronDown className={`text-gray-400 text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                                                {user?.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <FaUser className="text-orange-500 dark:text-orange-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                                {user?.isPremium && <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold flex items-center gap-1"><FaCrown /> Premium</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700">
                                        <FaUser className="text-orange-500" /> Profile
                                    </Link>
                                    <Link href="/dashboard/my-recipes" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700">
                                        <FaUtensils className="text-orange-500" /> My Recipes
                                    </Link>
                                    <Link href="/dashboard/favorites" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700">
                                        <FaHeart className="text-rose-500" /> Favorites
                                    </Link>
                                    <Link href="/dashboard/purchased" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700">
                                        <FaShoppingCart className="text-blue-500" /> Purchased
                                    </Link>
                                    <Link href="/dashboard/add-recipe" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700">
                                        <FaPlus className="text-green-500" /> Add Recipe
                                    </Link>
                                    <button onClick={() => { setDropdownOpen(false); handleLogout(); }} 
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full border-t border-gray-100 dark:border-gray-700">
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}