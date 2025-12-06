'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

interface BentoItemProps {
    children: ReactNode;
    className?: string;
    colSpan?: 1 | 2;
    rowSpan?: 1 | 2;
}

/**
 * Modern Bento-style grid layout
 */
export function BentoGrid({ children, className = '' }: BentoGridProps) {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
        >
            {children}
        </div>
    );
}

/**
 * Bento grid item with configurable span
 */
export function BentoItem({
    children,
    className = '',
    colSpan = 1,
    rowSpan = 1,
}: BentoItemProps) {
    const colSpanClass = colSpan === 2 ? 'md:col-span-2' : '';
    const rowSpanClass = rowSpan === 2 ? 'md:row-span-2' : '';

    return (
        <motion.div
            className={`${colSpanClass} ${rowSpanClass} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}
