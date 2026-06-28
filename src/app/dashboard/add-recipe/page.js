'use client';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaUpload, FaTimes, FaPlus, FaTrash, FaInfoCircle ,FaCrown } from 'react-icons/fa';
import api from '@/lib/axios';
import Link from 'next/link'; 
import Loading from '@/components/Loading';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Soup', 'Salad', 'Other'];
const CUISINES = ['Italian', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Japanese', 'French', 'American', 'Mediterranean', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function AddRecipe() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        recipeName: '',
        category: '',
        cuisineType: '',
        difficultyLevel: '',
        preparationTime: '',
        ingredients: [''],
        instructions: [''],
        price: '',
        isPremium: false
    });

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Check if user can add more recipes (max 2 for non-premium)
    useEffect(() => {
    if (user && !user.isPremium && user.role !== 'admin' && user.recipeCount >= 2) {
        router.push('/dashboard?limitReached=true');
    }
}, [user, router]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image must be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
        }
    };

    // FIXED: Image upload function with proper error handling
    const uploadImage = async () => {
    if (!imageFile) return '';

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', imageFile);

    try {
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        
        // Check if API key exists
        if (!apiKey) {
            throw new Error('ImgBB API key is missing. Please add NEXT_PUBLIC_IMGBB_API_KEY to .env.local');
        }

        console.log('Uploading image to ImgBB...');
        
        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            { 
                method: 'POST', 
                body: uploadFormData 
            }
        );

        const data = await response.json();
        console.log('ImgBB Response:', data);

        if (!response.ok) {
            throw new Error(data.error?.message || `Upload failed: ${response.status}`);
        }

        if (!data.success) {
            throw new Error(data.error?.message || 'Image upload failed');
        }

        return data.data.url;
    } catch (error) {
        console.error('Image upload error:', error);
        throw new Error(error.message || 'Failed to upload image');
    } finally {
        setUploading(false);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate form
            if (!formData.recipeName.trim()) {
                setError('Recipe name is required');
                setLoading(false);
                return;
            }
            if (!formData.category) {
                setError('Category is required');
                setLoading(false);
                return;
            }
            if (!formData.cuisineType) {
                setError('Cuisine type is required');
                setLoading(false);
                return;
            }
            if (!formData.difficultyLevel) {
                setError('Difficulty level is required');
                setLoading(false);
                return;
            }
            if (!formData.preparationTime || parseInt(formData.preparationTime) <= 0) {
                setError('Preparation time is required');
                setLoading(false);
                return;
            }

            // Upload image
           let imageUrl = '';
if (imageFile) {
    try {
        imageUrl = await uploadImage();
    } catch (uploadError) {
        console.warn('Image upload failed, using placeholder');
        // Use a placeholder with the recipe name
        imageUrl = `https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=${encodeURIComponent(formData.recipeName)}`;
    }
} else {
    // Use placeholder if no image selected
    imageUrl = `https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=${encodeURIComponent(formData.recipeName)}`;
}

            // Prepare recipe data
            const recipeData = {
                recipeName: formData.recipeName.trim(),
                recipeImage: imageUrl,
                category: formData.category,
                cuisineType: formData.cuisineType,
                difficultyLevel: formData.difficultyLevel,
                preparationTime: parseInt(formData.preparationTime),
                ingredients: formData.ingredients.filter(i => i.trim()),
                instructions: formData.instructions.filter(i => i.trim()),
                price: parseFloat(formData.price) || 0,
                isPremium: formData.isPremium || false
            };

            // Send to API
            const response = await api.post('/recipes', recipeData);

            if (response.data.success) {
                setSuccess('Recipe created successfully!');
                // Reset form
                setFormData({
                    recipeName: '',
                    category: '',
                    cuisineType: '',
                    difficultyLevel: '',
                    preparationTime: '',
                    ingredients: [''],
                    instructions: [''],
                    price: '',
                    isPremium: false
                });
                setImageFile(null);
                setImagePreview('');
                
                setTimeout(() => {
                    router.push('/dashboard/my-recipes');
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            setError(error.response?.data?.message || 'Failed to create recipe');
        } finally {
            setLoading(false);
        }
    };

    const addField = (type) => {
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], '']
        }));
    };

    const removeField = (type, index) => {
        if (formData[type].length <= 1) return;
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const updateField = (type, index, value) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].map((item, i) => i === index ? value : item)
        }));
    };

    if (authLoading) return <Loading />;

    // Check if user can add recipes
   if (user && !user.isPremium && user.role !== 'admin' && user.recipeCount >= 2) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Recipe Limit Reached</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                You've reached the maximum of 2 recipes. 
                Upgrade to Premium for unlimited recipes!
            </p>
            <Link
                href="/dashboard/premium"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
                <FaCrown /> Upgrade to Premium
            </Link>
        </div>
    );
}

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Add New Recipe</h1>
                        <p className="text-gray-500 mt-1">
                            {user?.isPremium 
                                ? '✨ Premium user - Unlimited recipes!' 
                                : `📝 ${user?.recipeCount || 0}/2 recipes used`}
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-start gap-3">
                        <FaInfoCircle className="mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Error:</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <p>{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    {/* Recipe Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Recipe Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.recipeName}
                            onChange={(e) => setFormData({ ...formData, recipeName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                            placeholder="Enter recipe name"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Recipe Image
                        </label>
                        <div className="flex items-center gap-4 flex-wrap">
                            <label className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
                                <FaUpload />
                                <span>{imageFile ? 'Change Image' : 'Choose Image'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {imagePreview && (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg border-2 border-orange-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview('');
                                            setImageFile(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Upload a high-quality image (Max 5MB)</p>
                    </div>

                    {/* Category, Cuisine, Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cuisine Type *
                            </label>
                            <select
                                required
                                value={formData.cuisineType}
                                onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                            >
                                <option value="">Select cuisine</option>
                                {CUISINES.map(cuisine => (
                                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Difficulty Level *
                            </label>
                            <select
                                required
                                value={formData.difficultyLevel}
                                onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                            >
                                <option value="">Select difficulty</option>
                                {DIFFICULTIES.map(diff => (
                                    <option key={diff} value={diff}>{diff}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Preparation Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Preparation Time (minutes) *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.preparationTime}
                            onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                            placeholder="e.g., 30"
                        />
                    </div>

                    {/* Ingredients */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ingredients *
                        </label>
                        {formData.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    required
                                    value={ingredient}
                                    onChange={(e) => updateField('ingredients', index, e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                                    placeholder={`Ingredient ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeField('ingredients', index)}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addField('ingredients')}
                            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                        >
                            <FaPlus /> Add Ingredient
                        </button>
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Instructions *
                        </label>
                        {formData.instructions.map((instruction, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <textarea
                                    required
                                    value={instruction}
                                    onChange={(e) => updateField('instructions', index, e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none"
                                    placeholder={`Step ${index + 1}`}
                                    rows="2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeField('instructions', index)}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addField('instructions')}
                            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                        >
                            <FaPlus /> Add Step
                        </button>
                    </div>

                    {/* Premium Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Price (for premium recipes)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Premium Recipe
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPremium}
                                    onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                                    className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                                />
                                <span className="text-gray-600">Make this a premium recipe</span>
                            </label>
                            <p className="text-xs text-gray-400 mt-1">Premium recipes require payment to view</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading || uploading ? (
                            <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                <FaPlus /> Create Recipe
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}