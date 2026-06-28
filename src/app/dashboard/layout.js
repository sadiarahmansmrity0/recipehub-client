'use client';
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

export default function DashboardLayout({ children }) {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) return <Loading />;
    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </div>
    );
}