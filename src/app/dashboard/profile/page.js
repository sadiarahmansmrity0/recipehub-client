'use client';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaSave, FaCrown, FaSpinner, FaLink } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function Profile() {
    const { user, updateProfile, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            setFormData({
                name: user.name || '',
                image: user.image || ''
            });
            setImagePreview(user.image || '');
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await updateProfile({
                name: formData.name,
                image: formData.image
            });

            if (result.success) {
                setSuccess('Profile updated successfully!');
                setImagePreview(formData.image);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <Loading />;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Cover */}
                <div className="h-24 bg-gradient-to-r from-orange-500 to-rose-500 relative">
                    {user?.isPremium && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-800 px-4 py-1.5 rounded-full font-semibold flex items-center gap-2 shadow-lg text-sm">
                            <FaCrown className="text-yellow-600" />
                            Premium
                        </div>
                    )}
                </div>

                {/* Avatar */}
                <div className="relative px-6">
                    <div className="-mt-12 flex items-end gap-6">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg flex-shrink-0">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt={formData.name || 'User'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const parent = e.target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = '<svg class="w-12 h-12 text-gray-400 mx-auto mt-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>';
                                        }
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <FaUser className="text-4xl" />
                                </div>
                            )}
                        </div>
                        <div className="pb-4">
                            <h2 className="text-xl font-bold text-gray-800">{formData.name || 'User'}</h2>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <FaEnvelope className="text-xs" />
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                            ✅ {success}
                        </div>
                    )}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Profile Image URL
                        </label>
                        <div className="relative">
                            <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => {
                                    setFormData({ ...formData, image: e.target.value });
                                    setImagePreview(e.target.value);
                                }}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            Enter a direct URL to your profile image (e.g., from imgbb, unsplash, etc.)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3.5 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <><FaSave /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
}