'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    FaChartBar,
    FaUsers,
    FaUtensils,
    FaFlag,
    FaMoneyBill,
    FaHome,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaShieldAlt
} from 'react-icons/fa';
import api from '@/lib/axios';
import Loading from '@/components/Loading';

const adminLinks = [
    { href: '/admin', label: 'Overview', icon: FaChartBar },
    { href: '/admin/users', label: 'Manage Users', icon: FaUsers },
    { href: '/admin/recipes', label: 'Manage Recipes', icon: FaUtensils },
    { href: '/admin/reports', label: 'Reports', icon: FaFlag },
    { href: '/admin/transactions', label: 'Transactions', icon: FaMoneyBill },
];

export default function AdminLayout({ children }) {
    const { user, setUser, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        }
    }, [user, authLoading, router]);

    if (authLoading) return <Loading />;
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
            {/* Mobile Toggle Button */}
           

            

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6 overflow-x-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}