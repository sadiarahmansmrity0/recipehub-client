'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaUtensils, FaCrown, FaFlag, FaMoneyBill, FaUserCog, FaPlus } from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

export default function AdminOverview() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) { router.push('/login'); return; }
            if (user.role !== 'admin') { router.push('/dashboard'); return; }
            fetchStats();
        }
    }, [user, authLoading, router]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return <Loading />;

    const cards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: FaUsers, color: 'blue', link: '/admin/users' },
        { title: 'Total Recipes', value: stats?.totalRecipes || 0, icon: FaUtensils, color: 'orange', link: '/admin/recipes' },
        { title: 'Premium Members', value: stats?.totalPremium || 0, icon: FaCrown, color: 'yellow', link: '/admin/users' },
        { title: 'Pending Reports', value: stats?.totalReports || 0, icon: FaFlag, color: 'red', link: '/admin/reports' },
        { title: 'Total Payments', value: stats?.totalPayments || 0, icon: FaMoneyBill, color: 'green', link: '/admin/transactions' },
    ];

    const colorMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-600',
        orange: 'bg-orange-50 border-orange-200 text-orange-600',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
        red: 'bg-red-50 border-red-200 text-red-600',
        green: 'bg-green-50 border-green-200 text-green-600',
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Overview</h1>
            <p className="text-gray-500 text-sm mb-6">Manage your platform</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <Link key={i} href={card.link} className={`${colorMap[card.color]} border rounded-2xl p-4 shadow-sm hover:shadow-md transition`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase opacity-70">{card.title}</p>
                                    <p className="text-2xl font-bold">{card.value}</p>
                                </div>
                                <Icon className="text-xl opacity-70" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/admin/users" className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl font-medium border border-blue-200 hover:bg-blue-100 text-sm">
                        <FaUserCog /> Manage Users
                    </Link>
                    <Link href="/admin/recipes" className="flex items-center justify-center gap-2 bg-orange-50 text-orange-600 px-4 py-3 rounded-xl font-medium border border-orange-200 hover:bg-orange-100 text-sm">
                        <FaUtensils /> Manage Recipes
                    </Link>
                    <Link href="/admin/reports" className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-medium border border-red-200 hover:bg-red-100 text-sm">
                        <FaFlag /> View Reports
                    </Link>
                    <Link href="/dashboard/add-recipe" className="flex items-center justify-center gap-2 bg-green-50 text-green-600 px-4 py-3 rounded-xl font-medium border border-green-200 hover:bg-green-100 text-sm">
                        <FaPlus /> Add Recipe
                    </Link>
                </div>
            </div>
        </div>
    );
}