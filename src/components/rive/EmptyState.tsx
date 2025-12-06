'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
}

/**
 * Empty state component with animated illustration
 * Uses Framer Motion animation as fallback when Rive assets aren't available
 */
export function EmptyState({
    title,
    description,
    icon,
    action,
    className = '',
}: EmptyStateProps) {
    return (
        <motion.div
            className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Animated illustration */}
            <motion.div
                className="relative w-32 h-32 mb-6"
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                {icon || (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#2C666E]/20 to-[#10B981]/20 border border-white/5 flex items-center justify-center">
                        <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2C666E] to-[#10B981]"
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    </div>
                )}

                {/* Decorative particles */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-[#10B981]/50"
                        style={{
                            top: `${20 + i * 25}%`,
                            left: `${10 + i * 30}%`,
                        }}
                        animate={{
                            y: [0, -15, 0],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            delay: i * 0.5,
                            repeat: Infinity,
                        }}
                    />
                ))}
            </motion.div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

            {/* Description */}
            {description && (
                <p className="text-white/60 max-w-sm mb-6">{description}</p>
            )}

            {/* Action */}
            {action && <div>{action}</div>}
        </motion.div>
    );
}
