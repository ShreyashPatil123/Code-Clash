'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: string;
    hoverScale?: number;
}

/**
 * Card with animated border glow and glassmorphism effect
 */
export function GlowCard({
    children,
    className = '',
    glowColor = '#2C666E',
    hoverScale = 1.02,
}: GlowCardProps) {
    return (
        <motion.div
            className={`relative group ${className}`}
            whileHover={{ scale: hoverScale }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Glow effect */}
            <div
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{
                    background: `linear-gradient(135deg, ${glowColor}40 0%, ${glowColor}20 50%, ${glowColor}40 100%)`,
                }}
            />

            {/* Animated border */}
            <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `linear-gradient(135deg, ${glowColor}60 0%, transparent 50%, ${glowColor}60 100%)`,
                }}
            />

            {/* Card content */}
            <div className="relative rounded-2xl bg-[#18181B]/90 backdrop-blur-xl border border-white/5 p-6 h-full">
                {children}
            </div>
        </motion.div>
    );
}
