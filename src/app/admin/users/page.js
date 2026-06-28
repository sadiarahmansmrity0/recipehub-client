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
    FaSpinner,
    FaShieldAlt
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
    }, [user, authLoading, router]);

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
        <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
                    <p className="text-gray-500 text-sm">Total {users.length} users registered</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all w-40 sm:w-56 text-sm"
                        />
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Users Table - Responsive */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipes</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No users found</td>
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
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {u.image ? (
                                                        <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FaUser className="text-orange-500 text-sm" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-800 text-sm truncate">{u.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                u.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : u.isPremium
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {u.role === 'admin' ? 'Admin' : u.isPremium ? 'Premium' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {u.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-sm">{u.recipeCount || 0}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
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
                                                                'Unblock'
                                                            ) : (
                                                                'Block'
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            disabled={actionLoading === u._id}
                                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                                        >
                                                            <FaTrash className="text-sm" />
                                                        </button>
                                                    </>
                                                )}
                                                {u.role === 'admin' && (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <FaShieldAlt className="text-purple-400" /> Protected
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
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
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {selectedUser.isBlocked ? 'Unblock User?' : 'Block User?'}
                                </h3>
                                <p className="text-gray-600 text-sm mb-6">
                                    {selectedUser.isBlocked
                                        ? `Are you sure you want to unblock "${selectedUser.name}"?`
                                        : `Are you sure you want to block "${selectedUser.name}"?`}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleBlockToggle(selectedUser._id, selectedUser.isBlocked)}
                                        className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
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