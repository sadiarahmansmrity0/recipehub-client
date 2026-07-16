'use client';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaUserPlus, FaLink, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function RegisterPage() {
    const { register, user, loading } = useContext(AuthContext);
    const router = useRouter();
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        image: '' 
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If user exists, don't render register page
    if (user) {
        return null;
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.image
            );

            if (result.success) {
                setSuccess('Registration successful! Redirecting...');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                setError(result.message || 'Registration failed');
                setIsLoading(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl shadow-lg mb-4">
                            <FaUserPlus className="text-white text-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create Account</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Join our community of food lovers</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                            <span className="text-lg">✅</span>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={formData.name}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all duration-200 outline-none dark:text-white"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all duration-200 outline-none dark:text-white"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Profile Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Profile Image URL <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="url"
                                    placeholder="https://example.com/photo.jpg"
                                    value={formData.image}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all duration-200 outline-none dark:text-white"
                                    onChange={(e) => {
                                        setFormData({ ...formData, image: e.target.value });
                                        setImagePreview(e.target.value);
                                    }}
                                />
                            </div>
                            {imagePreview && (
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full border-2 border-orange-200 overflow-hidden flex-shrink-0">
                                        <img
                                            src={imagePreview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">Preview</p>
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1.5">
                                Enter a direct URL to your profile image (e.g., from imgbb, unsplash, etc.)
                            </p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all duration-200 outline-none dark:text-white"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">
                                Must be at least 6 characters with one uppercase and one lowercase letter
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3.5 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    Create Account
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>

                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            By signing up, you agree to our{' '}
                            <Link href="/terms" className="text-orange-500 hover:underline">Terms</Link>
                            &amp;
                            <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}