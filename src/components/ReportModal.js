'use client';
import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import api from '@/lib/axios';

const REPORT_REASONS = [
    'Spam',
    'Offensive Content',
    'Copyright Issue',
    'Inappropriate',
    'Other'
];

export default function ReportModal({ isOpen, onClose, recipeId }) {
    const { user } = useContext(AuthContext);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please login to report');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/reports', {
                recipeId,
                reason,
                description
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setReason('');
                setDescription('');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Report Recipe</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {success ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">✅</div>
                                <p className="text-green-600 font-semibold">
                                    Report submitted successfully
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Reason
                                    </label>
                                    <select
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                                    >
                                        <option value="">Select a reason</option>
                                        {REPORT_REASONS.map((r) => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Provide additional details..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none"
                                        rows="3"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    ) : (
                                        'Submit Report'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}