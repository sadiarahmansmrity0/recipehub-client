
'use client';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { FaUtensils, FaHeart, FaThumbsUp, FaPlus } from 'react-icons/fa';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const stats = [
    {
      title: 'Total Recipes',
      value: '0',
      icon: FaUtensils,
      bg: 'from-orange-400 to-orange-500',
      gradient: 'from-orange-50 to-orange-100/50',
      border: 'border-orange-200',
      text: 'text-orange-600'
    },
    {
      title: 'Total Favorites',
      value: '0',
      icon: FaHeart,
      bg: 'from-rose-400 to-rose-500',
      gradient: 'from-rose-50 to-rose-100/50',
      border: 'border-rose-200',
      text: 'text-rose-600'
    },
    {
      title: 'Total Likes',
      value: '0',
      icon: FaThumbsUp,
      bg: 'from-blue-400 to-blue-500',
      gradient: 'from-blue-50 to-blue-100/50',
      border: 'border-blue-200',
      text: 'text-blue-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
          Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Here's a summary of your cooking journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-4xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.bg} p-3 rounded-xl shadow-md`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100/50 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href="/recipes/create"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FaPlus />
            Create New Recipe
          </Link>
          <Link 
            href="/recipes"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
          >
            <FaUtensils />
            Browse Recipes
          </Link>
        </div>
      </div>

      {/* Placeholder for recent activity */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100/50 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🍳</div>
          <p className="text-gray-500">No recent activity yet</p>
          <p className="text-sm text-gray-400 mt-1">Start creating and sharing recipes!</p>
        </div>
      </div>
    </div>
  );
}