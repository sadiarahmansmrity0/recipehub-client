'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaUtensils,
    FaCrown,
    FaFlag,
    FaMoneyBill,
    FaUserCog,
    FaPlus,
    FaEye
} from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            fetchStats();
        }
    }, [user, authLoading]);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to load admin stats');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return <Loading />;

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: FaUsers,
            bg: 'from-blue-400 to-blue-500',
            gradient: 'from-blue-50 to-blue-100/50',
            border: 'border-blue-200',
            text: 'text-blue-600',
            link: '/admin/users'
        },
        {
            title: 'Total Recipes',
            value: stats?.totalRecipes || 0,
            icon: FaUtensils,
            bg: 'from-orange-400 to-orange-500',
            gradient: 'from-orange-50 to-orange-100/50',
            border: 'border-orange-200',
            text: 'text-orange-600',
            link: '/admin/recipes'
        },
        {
            title: 'Premium Members',
            value: stats?.totalPremium || 0,
            icon: FaCrown,
            bg: 'from-yellow-400 to-yellow-500',
            gradient: 'from-yellow-50 to-yellow-100/50',
            border: 'border-yellow-200',
            text: 'text-yellow-600',
            link: '/admin/users'
        },
        {
            title: 'Pending Reports',
            value: stats?.totalReports || 0,
            icon: FaFlag,
            bg: 'from-red-400 to-red-500',
            gradient: 'from-red-50 to-red-100/50',
            border: 'border-red-200',
            text: 'text-red-600',
            link: '/admin/reports'
        },
        {
            title: 'Total Payments',
            value: stats?.totalPayments || 0,
            icon: FaMoneyBill,
            bg: 'from-green-400 to-green-500',
            gradient: 'from-green-50 to-green-100/50',
            border: 'border-green-200',
            text: 'text-green-600',
            link: '/admin/payments'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Manage your platform</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                        >
                            <Link href={stat.link}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            {stat.title}
                                        </p>
                                        <p className="text-4xl font-bold text-gray-800 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`bg-gradient-to-r ${stat.bg} p-3 rounded-xl shadow-md`}>
                                        <Icon className="text-white text-xl" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link
                    href="/admin/users"
                    className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-6 py-4 rounded-xl font-semibold hover:bg-blue-100 transition-all border border-blue-200"
                >
                    <FaUserCog /> Manage Users
                </Link>
                <Link
                    href="/admin/recipes"
                    className="flex items-center justify-center gap-2 bg-orange-50 text-orange-600 px-6 py-4 rounded-xl font-semibold hover:bg-orange-100 transition-all border border-orange-200"
                >
                    <FaUtensils /> Manage Recipes
                </Link>
                <Link
                    href="/admin/reports"
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-4 rounded-xl font-semibold hover:bg-red-100 transition-all border border-red-200"
                >
                    <FaFlag /> View Reports
                </Link>
                <Link
                    href="/dashboard/add-recipe"
                    className="flex items-center justify-center gap-2 bg-green-50 text-green-600 px-6 py-4 rounded-xl font-semibold hover:bg-green-100 transition-all border border-green-200"
                >
                    <FaPlus /> Add Recipe
                </Link>
            </div>
        </div>
    );
}