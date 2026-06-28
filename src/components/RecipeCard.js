'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaHeart } from 'react-icons/fa';
import OptimizedImage from './OptimizedImage';

export default function RecipeCard({ recipe, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            <div className="relative h-56 w-full bg-gray-200">
                <OptimizedImage
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    className="h-56 w-full"
                    priority={index < 3}
                />
                {recipe.isFeatured && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        ★ Featured
                    </span>
                )}
                {recipe.isPremium && (
                    <span className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        Premium
                    </span>
                )}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaHeart className="text-rose-400" />
                    {recipe.likesCount || 0}
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 flex-wrap">
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                        {recipe.category || 'Uncategorized'}
                    </span>
                    <span>•</span>
                    <span>{recipe.cuisineType || 'Various'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {recipe.preparationTime || 0}m
                    </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {recipe.recipeName}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <FaUser className="text-xs" />
                        {recipe.authorName || 'Unknown Chef'}
                    </span>
                </div>
                <Link
                    href={`/recipes/${recipe._id}`}
                    className="mt-4 block w-full text-center bg-gradient-to-r from-orange-500 to-rose-500 text-white py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
}