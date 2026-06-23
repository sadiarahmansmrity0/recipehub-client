'use client';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCamera, FaSave, FaCrown } from 'react-icons/fa';
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
    const [imageFile, setImageFile] = useState(null);
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
    }, [user, authLoading]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.image;

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                { method: 'POST', body: formData }
            );
            const data = await response.json();
            return data.data.url;
        } catch (error) {
            console.error('Image upload error:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let imageUrl = formData.image;
            if (imageFile) {
                imageUrl = await uploadImage();
            }

            const result = await updateProfile({
                name: formData.name,
                image: imageUrl
            });

            if (result.success) {
                setSuccess('Profile updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <Loading />;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-orange-500 to-rose-500 relative">
                        {user?.isPremium && (
                            <div className="absolute top-4 right-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg">
                                <FaCrown className="text-yellow-600" />
                                Premium
                            </div>
                        )}
                    </div>

                    {/* Avatar */}
                    <div className="relative px-6">
                        <div className="-mt-12 flex items-end gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt={formData.name || 'User'}
                                            width={96}
                                            height={96}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 text-3xl">
                                            <FaUser />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-all shadow-lg">
                                    <FaCamera className="text-sm" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
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
                    <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
                        {success && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
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

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <FaSave /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}