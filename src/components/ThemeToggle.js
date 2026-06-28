'use client';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check localStorage for theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
        >
           {darkMode ? (
    <FaMoon className="text-gray-300 text-lg" />
) : (
    <FaSun className="text-yellow-400 text-lg" />
)}

        </button>
    );
}