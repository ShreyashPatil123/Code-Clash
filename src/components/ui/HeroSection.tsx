'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic import for 3D scene (SSR-safe)
const HeroScene3D = dynamic(
    () => import('@/components/3d/HeroScene3D').then((mod) => mod.HeroScene3D),
    { ssr: false }
);

interface HeroSectionProps {
    title: ReactNode;
    subtitle?: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
    show3D?: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
};

/**
 * Hero section with gradient text, 3D background, and animated reveal
 */
export function HeroSection({
    title,
    subtitle,
    description,
    actions,
    className = '',
    show3D = true,
}: HeroSectionProps) {
    return (
        <section
            className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${className}`}
        >
            {/* 3D Background */}
            {show3D && <HeroScene3D />}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0B]/50 to-[#0A0A0B]" />

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-5xl mx-auto px-6 text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Subtitle badge */}
                {subtitle && (
                    <motion.div variants={itemVariants} className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
                            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                            {subtitle}
                        </span>
                    </motion.div>
                )}

                {/* Title */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                >
                    {title}
                </motion.h1>

                {/* Description */}
                {description && (
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
                    >
                        {description}
                    </motion.p>
                )}

                {/* Actions */}
                {actions && (
                    <motion.div
                        variants={itemVariants}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {actions}
                    </motion.div>
                )}
            </motion.div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0B] to-transparent" />
        </section>
    );
}

/**
 * Gradient text component for hero titles
 */
export function GradientText({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <span
            className={`bg-gradient-to-r from-white via-[#10B981] to-[#2C666E] bg-clip-text text-transparent ${className}`}
        >
            {children}
        </span>
    );
}
