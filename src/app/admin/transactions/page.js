'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaMoneyBill, FaUser, FaCalendar, FaSearch } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function AdminTransactions() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        fetchTransactions();
    }, [user, authLoading]);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/admin/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return <Loading />;

    const filtered = transactions.filter(t =>
        t.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        t.transactionId?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <FaMoneyBill className="text-green-500 text-3xl" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
                    <p className="text-gray-600 mt-1">
                        {transactions.length} total transactions
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by email or transaction ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((t, index) => (
                                    <motion.tr
                                        key={t._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-800">{t.userEmail || 'N/A'}</p>
                                                <p className="text-xs text-gray-400">{t.userId || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-800">
                                                ${t.amount || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                t.type === 'premium'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {t.type === 'premium' ? 'Premium' : 'Recipe'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                t.paymentStatus === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : t.paymentStatus === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {t.paymentStatus || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                                            {t.transactionId ? t.transactionId.slice(0, 16) + '...' : 'N/A'}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}