'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch,
    FaUser,
    FaEnvelope,
    FaCrown,
    FaBan,
    FaCheck,
    FaTrash,
    FaUserCog,
    FaCalendar,
    FaSpinner
} from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function AdminUsers() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
            fetchUsers();
        }
    }, [user, authLoading]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async (userId, currentStatus) => {
        setActionLoading(userId);
        try {
            const response = await api.put(`/admin/users/${userId}/block`);
            if (response.data.success) {
                setUsers(prev =>
                    prev.map(u =>
                        u._id === userId
                            ? { ...u, isBlocked: response.data.isBlocked }
                            : u
                    )
                );
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error toggling block:', error);
            setError('Failed to update user status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone!')) {
            return;
        }

        setActionLoading(userId);
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(prev => prev.filter(u => u._id !== userId));
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (authLoading || loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
                    <p className="text-gray-600 mt-1">
                        Total {users.length} users registered
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all w-48 md:w-64"
                        />
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Recipes
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u, index) => (
                                        <motion.tr
                                            key={u._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {u.image ? (
                                                            <img
                                                                src={u.image}
                                                                alt={u.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <FaUser className="text-orange-500" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-800">
                                                        {u.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <FaEnvelope className="text-gray-400 text-xs" />
                                                    {u.email}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    u.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : u.isPremium
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {u.role === 'admin' ? (
                                                        <span className="flex items-center gap-1">
                                                            <FaUserCog className="text-xs" /> Admin
                                                        </span>
                                                    ) : u.isPremium ? (
                                                        <span className="flex items-center gap-1">
                                                            <FaCrown className="text-xs" /> Premium
                                                        </span>
                                                    ) : (
                                                        'User'
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    u.isBlocked
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {u.isBlocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {u.recipeCount || 0}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <FaCalendar className="text-xs" />
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {u.role !== 'admin' && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUser(u);
                                                                    setShowModal(true);
                                                                }}
                                                                disabled={actionLoading === u._id}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                                    u.isBlocked
                                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                }`}
                                                            >
                                                                {actionLoading === u._id ? (
                                                                    <FaSpinner className="animate-spin" />
                                                                ) : u.isBlocked ? (
                                                                    <span className="flex items-center gap-1">
                                                                        <FaCheck /> Unblock
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1">
                                                                        <FaBan /> Block
                                                                    </span>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(u._id)}
                                                                disabled={actionLoading === u._id}
                                                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-xs font-semibold"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    )}
                                                    {u.role === 'admin' && (
                                                        <span className="text-xs text-gray-400">Protected</span>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
                        >
                            <div className="text-center">
                                <div className={`text-5xl mb-4 ${selectedUser.isBlocked ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedUser.isBlocked ? '✅' : '⚠️'}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {selectedUser.isBlocked ? 'Unblock User?' : 'Block User?'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {selectedUser.isBlocked
                                        ? `Are you sure you want to unblock "${selectedUser.name}"? They will be able to access the platform again.`
                                        : `Are you sure you want to block "${selectedUser.name}"? They will not be able to access the platform.`}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleBlockToggle(selectedUser._id, selectedUser.isBlocked)}
                                        className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                                            selectedUser.isBlocked
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-red-500 text-white hover:bg-red-600'
                                        }`}
                                    >
                                        {selectedUser.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}