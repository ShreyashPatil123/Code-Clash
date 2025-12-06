'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ===========================================
   CARD COMPONENT
   A flexible card component with multiple variants
   =========================================== */

const cardVariants = cva(
    // Base styles
    [
        'rounded-xl',
        'transition-all duration-200 ease-in-out',
    ],
    {
        variants: {
            variant: {
                // Default card with solid background
                default: [
                    'bg-background-card',
                    'border border-border',
                ],
                // Elevated card with shadow
                elevated: [
                    'bg-background-card',
                    'border border-border',
                    'shadow-lg',
                ],
                // Flat card, minimal styling
                flat: [
                    'bg-background-elevated',
                ],
                // Interactive card with hover effects
                interactive: [
                    'bg-background-card',
                    'border border-border',
                    'cursor-pointer',
                    'hover:border-primary-600 hover:shadow-glow-primary hover:-translate-y-1',
                    'active:translate-y-0 active:shadow-none',
                ],
                // Glass/frosted card
                glass: [
                    'bg-background-card/80',
                    'backdrop-blur-xl',
                    'border border-border-light',
                ],
                // Feature card for landing page
                feature: [
                    'bg-background-card/70',
                    'backdrop-blur-lg',
                    'border border-border-light',
                    'hover:border-primary-600/50 hover:bg-background-card/90',
                ],
                // Stat card for dashboard
                stat: [
                    'bg-gradient-to-br from-background-card to-background-elevated',
                    'border border-border',
                ],
                // Outline card
                outline: [
                    'bg-transparent',
                    'border-2 border-border',
                ],
            },
            padding: {
                none: 'p-0',
                sm: 'p-3',
                md: 'p-4',
                lg: 'p-6',
                xl: 'p-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            padding: 'md',
        },
    }
);

export interface CardProps
    extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(cardVariants({ variant, padding, className }))}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

/* ===========================================
   CARD HEADER
   =========================================== */

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** Optional icon to display */
    icon?: ReactNode;
    /** Optional action element (button, link) */
    action?: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, icon, action, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex items-center justify-between gap-4 pb-4 border-b border-border',
                    className
                )}
                {...props}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="flex-shrink-0 text-primary-500" aria-hidden="true">
                            {icon}
                        </div>
                    )}
                    <div className="flex-1">{children}</div>
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
        );
    }
);

CardHeader.displayName = 'CardHeader';

/* ===========================================
   CARD TITLE
   =========================================== */

const CardTitle = forwardRef<
    HTMLHeadingElement,
    HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
    return (
        <h3
            ref={ref}
            className={cn('text-lg font-semibold text-text-primary', className)}
            {...props}
        />
    );
});

CardTitle.displayName = 'CardTitle';

/* ===========================================
   CARD DESCRIPTION
   =========================================== */

const CardDescription = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    return (
        <p
            ref={ref}
            className={cn('text-sm text-text-secondary mt-1', className)}
            {...props}
        />
    );
});

CardDescription.displayName = 'CardDescription';

/* ===========================================
   CARD CONTENT
   =========================================== */

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn('py-4', className)} {...props} />
        );
    }
);

CardContent.displayName = 'CardContent';

/* ===========================================
   CARD FOOTER
   =========================================== */

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex items-center justify-between gap-4 pt-4 border-t border-border',
                    className
                )}
                {...props}
            />
        );
    }
);

CardFooter.displayName = 'CardFooter';

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    cardVariants,
};
