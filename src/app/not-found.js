'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 bg-white dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg"
            >
                <div className="text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</div>
                <div className="text-6xl mb-6">🔍</div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Page Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        <FaHome /> Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}