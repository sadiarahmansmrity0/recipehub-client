'use client';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login, user, loading } = useContext(AuthContext);

    // ✅ If already logged in, redirect to dashboard
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // ✅ Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ✅ If already logged in, don't render login page
    if (user) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            console.log('📤 Submitting login form...');
            const result = await login(formData.email, formData.password);
            console.log('📥 Login result:', result);
            
            if (result.success) {
                console.log('✅ Login successful, redirecting...');
                router.push('/dashboard');
            } else {
                setError(result.message || 'Invalid email or password');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            setError('Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = () => {
        console.log('✅ Google login successful, redirecting...');
        router.push('/dashboard');
    };

    const handleGoogleError = (error) => {
        console.error('❌ Google login error:', error);
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl shadow-lg mb-4">
                            <FaEnvelope className="text-white text-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue your culinary journey</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            {error}
                        </div>
                    )}
                    
                    {/* Google Login */}
                    <div className="mb-6">
                        <GoogleLoginButton 
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            buttonText="Continue with Google"
                        />
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR CONTINUE WITH EMAIL</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="email" 
                                    required
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all duration-200 outline-none dark:text-white"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    required
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all duration-200 outline-none dark:text-white"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
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
                                    Sign In
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                            Create one
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}