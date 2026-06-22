
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaUserPlus } from 'react-icons/fa';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-orange-100/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl shadow-lg mb-4">
              <FaUserPlus className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">Join our community of food lovers</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm flex items-center gap-2">
              <span className="text-lg">✅</span>
              {success}
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
  type="text"
  required
  placeholder="John Doe"
  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl 
             focus:border-orange-400 focus:ring-4 focus:ring-orange-100 
             transition-all duration-200 outline-none 
             placeholder-gray-500"   
  onChange={(e) => setFormData({...formData, name: e.target.value})}
/>

              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password"
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Must be at least 6 characters</p>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3.5 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-gray-500">or</span>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          {/* Password Requirements Hint */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <span className="text-green-500">✓</span> By signing up, you agree to our 
              <Link href="/terms" className="text-orange-500 hover:underline">Terms</Link>
              &amp;
              <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}