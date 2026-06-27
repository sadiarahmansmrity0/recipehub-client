'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import api from '@/lib/axios';
import { 
    FaUtensils, 
    FaUser, 
    FaSignOutAlt, 
    FaSignInAlt, 
    FaUserPlus, 
    FaBookOpen,
    FaShieldAlt,
    FaHome
} from 'react-icons/fa';

export default function Navbar() {
    const { user, setUser } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            window.location.href = '/login';
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-orange-100/50 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                            <FaUtensils className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                            RecipeHub
                        </span>
                    </Link>
                    
                    {/* Navigation Links */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href="/" className="text-gray-600 hover:text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 flex items-center gap-1">
                            <FaHome className="text-sm" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        
                        <Link href="/recipes" className="text-gray-600 hover:text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 flex items-center gap-1">
                            <FaBookOpen className="text-sm" />
                            <span>Browse Recipes</span>
                        </Link>
                        
                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-600 hover:text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 font-medium">
                                    Dashboard
                                </Link>
                                
                                {/* ✅ ADD THIS: Admin Link - Only if user is admin */}
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-100 transition-all duration-200 font-medium border border-purple-200">
                                        <FaShieldAlt className="text-sm" />
                                        <span className="hidden sm:inline">Admin</span>
                                    </Link>
                                )}
                                
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100">
                                    <FaUser className="text-orange-500 text-sm" />
                                    <span className="text-sm font-medium text-gray-700">{user.name || 'User'}</span>
                                    {user.role === 'admin' && (
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Admin</span>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <FaSignOutAlt className="text-sm" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200">
                                    <FaSignInAlt className="text-sm" />
                                    <span>Login</span>
                                </Link>
                                <Link href="/register" className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-rose-600 transition-all duration-200 shadow-md hover:shadow-lg">
                                    <FaUserPlus className="text-sm" />
                                    <span className="hidden sm:inline">Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}