'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaPlus, FaTrash, FaSpinner ,FaUpload } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Soup', 'Salad', 'Other'];
const CUISINES = ['Italian', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Japanese', 'French', 'American', 'Mediterranean', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function EditRecipe() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const params = useParams();
    const recipeId = params.id;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    
    const [formData, setFormData] = useState({
        recipeName: '',
        category: '',
        cuisineType: '',
        difficultyLevel: '',
        preparationTime: '',
        ingredients: [''],
        instructions: [''],
        price: '',
        isPremium: false,
        recipeImage: ''
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        fetchRecipe();
    }, [recipeId, user, authLoading]);

    const fetchRecipe = async () => {
    try {
        const response = await api.get(`/recipes/${recipeId}`);
        const recipe = response.data;
        
        console.log('Recipe data:', recipe);
        console.log('Current user:', user);
        
        // Check if user owns this recipe - FIXED
        const authorId = recipe.authorId?._id || recipe.authorId;
        const userId = user?.id || user?._id;
        
        if (authorId !== userId && user?.role !== 'admin') {
            console.log('Permission denied. Author:', authorId, 'User:', userId);
            setError('You do not have permission to edit this recipe');
            setLoading(false);
            return;
        }

        setFormData({
            recipeName: recipe.recipeName || '',
            category: recipe.category || '',
            cuisineType: recipe.cuisineType || '',
            difficultyLevel: recipe.difficultyLevel || '',
            preparationTime: recipe.preparationTime || '',
            ingredients: recipe.ingredients || [''],
            instructions: recipe.instructions || [''],
            price: recipe.price || '',
            isPremium: recipe.isPremium || false,
            recipeImage: recipe.recipeImage || ''
        });
        setImagePreview(recipe.recipeImage || '');
    } catch (error) {
        console.error('Error fetching recipe:', error);
        setError('Recipe not found');
    } finally {
        setLoading(false);
    }
};

    const uploadImage = async () => {
        if (!imageFile) return formData.recipeImage;

        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);

        try {
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                { method: 'POST', body: uploadFormData }
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
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            let imageUrl = formData.recipeImage;
            if (imageFile) {
                try {
                    imageUrl = await uploadImage();
                } catch (uploadError) {
                    setError(uploadError.message);
                    setSaving(false);
                    return;
                }
            }

            const recipeData = {
                ...formData,
                recipeImage: imageUrl,
                ingredients: formData.ingredients.filter(i => i.trim()),
                instructions: formData.instructions.filter(i => i.trim()),
                preparationTime: parseInt(formData.preparationTime) || 0,
                price: parseFloat(formData.price) || 0
            };

            const response = await api.put(`/recipes/${recipeId}`, recipeData);

            if (response.data.success) {
                setSuccess('Recipe updated successfully!');
                setTimeout(() => {
                    router.push('/dashboard/my-recipes');
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
            setError(error.response?.data?.message || 'Failed to update recipe');
        } finally {
            setSaving(false);
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

    if (authLoading || loading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Recipe</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600">
                        {success}
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
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Recipe Image
                        </label>
                        <div className="flex items-center gap-4 flex-wrap">
                            <label className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
                                <FaUpload />
                                <span>Change Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setImageFile(file);
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
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
                                </div>
                            )}
                        </div>
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
                                Price
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
                                <span className="text-gray-600">Premium recipe</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <>
                                <FaSave /> Update Recipe
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}