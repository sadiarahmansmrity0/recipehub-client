'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFlag,
    FaUser,
    FaEnvelope,
    FaExclamationTriangle,
    FaCheck,
    FaTimes,
    FaSpinner,
    FaTrash,
    FaClock
} from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function AdminReports() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            if (user.role !== 'admin') {
                router.push('/dashboard');
                return;
            }
            fetchReports();
        }
    }, [user, authLoading]);

    const fetchReports = async () => {
        try {
            const response = await api.get('/admin/reports');
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleResolveReport = async (reportId) => {
        setActionLoading(reportId);
        try {
            const response = await api.put(`/admin/reports/${reportId}`, { status: 'resolved' });
            if (response.data.success) {
                setReports(prev =>
                    prev.map(r =>
                        r._id === reportId
                            ? { ...r, status: 'resolved' }
                            : r
                    )
                );
            }
        } catch (error) {
            console.error('Error resolving report:', error);
            setError('Failed to resolve report');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDismissReport = async (reportId) => {
        setActionLoading(reportId);
        try {
            const response = await api.put(`/admin/reports/${reportId}`, { status: 'dismissed' });
            if (response.data.success) {
                setReports(prev =>
                    prev.map(r =>
                        r._id === reportId
                            ? { ...r, status: 'dismissed' }
                            : r
                    )
                );
            }
        } catch (error) {
            console.error('Error dismissing report:', error);
            setError('Failed to dismiss report');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>;
            case 'resolved':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Resolved</span>;
            case 'dismissed':
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">Dismissed</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status}</span>;
        }
    };

    if (authLoading || loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Recipe Reports</h1>
                    <p className="text-gray-600 mt-1">
                        {reports.filter(r => r.status === 'pending').length} pending reports
                    </p>
                </div>
                <button
                    onClick={fetchReports}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    {error}
                </div>
            )}

            {/* Reports List */}
            {reports.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-semibold text-gray-600">No reports</h3>
                    <p className="text-gray-400 mt-2">All reports have been resolved</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report, index) => (
                        <motion.div
                            key={report._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="text-lg">🚩</span>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {report.recipeId?.recipeName || 'Unknown Recipe'}
                                        </h3>
                                        {getStatusBadge(report.status)}
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-600">
                                            <span className="font-medium">Reason:</span> {report.reason}
                                        </p>
                                        {report.description && (
                                            <p className="text-gray-600">
                                                <span className="font-medium">Description:</span> {report.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FaUser className="text-xs" />
                                                {report.reporterId?.name || 'Unknown'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaEnvelope className="text-xs" />
                                                {report.reporterEmail || 'Unknown'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaClock className="text-xs" />
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {report.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleResolveReport(report._id)}
                                            disabled={actionLoading === report._id}
                                            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all text-sm font-semibold flex items-center gap-1"
                                        >
                                            {actionLoading === report._id ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <>
                                                    <FaCheck /> Resolve
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDismissReport(report._id)}
                                            disabled={actionLoading === report._id}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all text-sm font-semibold flex items-center gap-1"
                                        >
                                            <FaTimes /> Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}