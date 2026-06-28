'use client';
import { useState } from 'react';

export default function OptimizedImage({ 
    src, 
    alt, 
    className = '', 
    width = '100%',
    height = 'auto',
    objectFit = 'cover',
    rounded = false
}) {
    const [error, setError] = useState(false);
    const fallbackImage = 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Image';

    const imageSrc = error ? fallbackImage : (src || fallbackImage);

    return (
        <div 
            className={`overflow-hidden ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
            style={{ width, height }}
        >
            <img
                src={imageSrc}
                alt={alt || 'Image'}
                className="w-full h-full"
                style={{ objectFit }}
                onError={() => setError(true)}
                loading="lazy"
            />
        </div>
    );
}