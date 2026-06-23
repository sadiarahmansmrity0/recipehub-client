'use client';
import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
            />
        </div>
    );
}