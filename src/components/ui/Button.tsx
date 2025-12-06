'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/* ===========================================
   BUTTON COMPONENT
   A flexible, accessible button with multiple variants
   =========================================== */

const buttonVariants = cva(
    // Base styles
    [
        'inline-flex items-center justify-center',
        'font-medium',
        'transition-all duration-200 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        'select-none',
    ],
    {
        variants: {
            variant: {
                // Primary - main actions
                primary: [
                    'bg-primary-600 text-white',
                    'hover:bg-primary-500 hover:shadow-glow-primary',
                    'active:bg-primary-700 active:scale-[0.98]',
                ],
                // Secondary - alternative actions
                secondary: [
                    'bg-secondary-600 text-white',
                    'hover:bg-secondary-500 hover:shadow-lg',
                    'active:bg-secondary-700 active:scale-[0.98]',
                ],
                // Outline - bordered button
                outline: [
                    'border-2 border-primary-600 text-primary-500 bg-transparent',
                    'hover:bg-primary-600/10 hover:border-primary-500',
                    'active:bg-primary-600/20 active:scale-[0.98]',
                ],
                // Ghost - minimal styling
                ghost: [
                    'bg-transparent text-text-secondary',
                    'hover:bg-background-elevated hover:text-text-primary',
                    'active:bg-background-hover active:scale-[0.98]',
                ],
                // Danger - destructive actions
                danger: [
                    'bg-error-600 text-white',
                    'hover:bg-error-500 hover:shadow-glow-error',
                    'active:bg-error-700 active:scale-[0.98]',
                ],
                // Success - positive actions
                success: [
                    'bg-success-600 text-white',
                    'hover:bg-success-500 hover:shadow-glow-success',
                    'active:bg-success-700 active:scale-[0.98]',
                ],
                // Link - text button
                link: [
                    'bg-transparent text-primary-500 underline-offset-4',
                    'hover:underline hover:text-primary-400',
                    'active:text-primary-600',
                ],
            },
            size: {
                sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
                md: 'h-10 px-4 text-base rounded-lg gap-2',
                lg: 'h-12 px-6 text-lg rounded-lg gap-2.5',
                xl: 'h-14 px-8 text-xl rounded-xl gap-3',
                icon: 'h-10 w-10 rounded-lg',
                'icon-sm': 'h-8 w-8 rounded-md',
                'icon-lg': 'h-12 w-12 rounded-lg',
            },
            fullWidth: {
                true: 'w-full',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
            fullWidth: false,
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    /** Show loading spinner */
    isLoading?: boolean;
    /** Loading text to display */
    loadingText?: string;
    /** Icon to show before text */
    leftIcon?: ReactNode;
    /** Icon to show after text */
    rightIcon?: ReactNode;
    /** Make the button render as a child element */
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            fullWidth,
            isLoading = false,
            loadingText,
            leftIcon,
            rightIcon,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                aria-busy={isLoading}
                {...props}
            >
                {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                {!isLoading && leftIcon && (
                    <span className="inline-flex shrink-0" aria-hidden="true">
                        {leftIcon}
                    </span>
                )}
                {isLoading && loadingText ? loadingText : children}
                {!isLoading && rightIcon && (
                    <span className="inline-flex shrink-0" aria-hidden="true">
                        {rightIcon}
                    </span>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
