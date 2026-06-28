'use client';
import { FaUser } from 'react-icons/fa';

export default function UserAvatar({ user, size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-xl',
        lg: 'w-16 h-16 text-2xl',
        xl: 'w-24 h-24 text-4xl',
    };

    const sizeClass = sizes[size] || sizes.md;

    return (
        <div className={`${sizeClass} rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}>
            {user?.image ? (
                <img
                    src={user.image}
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<svg class="w-${size === 'sm' ? '4' : size === 'lg' ? '8' : '6'} h-${size === 'sm' ? '4' : size === 'lg' ? '8' : '6'} text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>`;
                    }}
                />
            ) : (
                <FaUser className="text-orange-500" />
            )}
        </div>
    );
}