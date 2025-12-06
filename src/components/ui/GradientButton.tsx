'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface GradientButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
}

/**
 * Gradient button with glow effect and hover animation
 */
export function GradientButton({
    children,
    href,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
}: GradientButtonProps) {
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const gradients = {
        primary: 'from-[#2C666E] via-[#10B981] to-[#2C666E]',
        secondary: 'from-[#8B5CF6] via-[#3B82F6] to-[#8B5CF6]',
    };

    const glowColors = {
        primary: '#10B981',
        secondary: '#3B82F6',
    };

    const ButtonContent = (
        <motion.span
            className={`
        relative inline-flex items-center justify-center gap-2
        ${sizeClasses[size]}
        font-semibold text-white
        rounded-xl
        bg-gradient-to-r ${gradients[variant]}
        bg-[length:200%_100%]
        transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
            whileHover={disabled ? {} : {
                backgroundPosition: '100% 0',
                scale: 1.02,
            }}
            whileTap={disabled ? {} : { scale: 0.98 }}
        >
            {/* Glow effect */}
            <span
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"
                style={{ backgroundColor: glowColors[variant] }}
            />

            {/* Content */}
            <span className="relative z-10">{children}</span>
        </motion.span>
    );

    if (href && !disabled) {
        return (
            <Link href={href} className="group inline-block">
                {ButtonContent}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="group inline-block"
        >
            {ButtonContent}
        </button>
    );
}
