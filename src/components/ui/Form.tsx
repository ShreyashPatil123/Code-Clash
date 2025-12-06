'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

/* ===========================================
   INPUT COMPONENT
   Styled input with label and validation
   =========================================== */

const inputVariants = cva(
    [
        'w-full px-4 py-2.5',
        'bg-background-card text-text-primary',
        'border border-border rounded-lg',
        'placeholder:text-text-muted',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background',
        'disabled:opacity-50 disabled:cursor-not-allowed',
    ],
    {
        variants: {
            variant: {
                default: '',
                error: 'border-error-500 focus:ring-error-500',
                success: 'border-success-500 focus:ring-success-500',
            },
            size: {
                sm: 'py-2 text-sm',
                md: 'py-2.5 text-base',
                lg: 'py-3 text-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { className, variant, size, label, error, hint, leftIcon, rightIcon, id, ...props },
        ref
    ) => {
        const inputId = id || props.name;
        const hasError = !!error;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-text-primary mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            inputVariants({ variant: hasError ? 'error' : variant, size }),
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            className
                        )}
                        aria-invalid={hasError}
                        aria-describedby={
                            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
                        }
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-2 text-sm text-error-500 flex items-center gap-1"
                        role="alert"
                    >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${inputId}-hint`}
                        className="mt-2 text-sm text-text-tertiary"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

/* ===========================================
   TEXTAREA COMPONENT
   =========================================== */

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const inputId = id || props.name;
        const hasError = !!error;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-text-primary mb-2"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full px-4 py-3',
                        'bg-background-card text-text-primary',
                        'border rounded-lg',
                        hasError ? 'border-error-500' : 'border-border',
                        'placeholder:text-text-muted',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                        hasError ? 'focus:ring-error-500' : 'focus:ring-primary-500',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'resize-y min-h-[100px]',
                        className
                    )}
                    aria-invalid={hasError}
                    aria-describedby={
                        error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
                    }
                    {...props}
                />
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-2 text-sm text-error-500 flex items-center gap-1"
                        role="alert"
                    >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${inputId}-hint`}
                        className="mt-2 text-sm text-text-tertiary"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

/* ===========================================
   FORM FIELD WRAPPER
   =========================================== */

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn('space-y-2', className)} {...props}>
                {children}
            </div>
        );
    }
);

FormField.displayName = 'FormField';

/* ===========================================
   FORM MESSAGE (Alert)
   =========================================== */

interface FormMessageProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error';
    children: ReactNode;
}

const FormMessage = forwardRef<HTMLDivElement, FormMessageProps>(
    ({ className, variant = 'info', children, ...props }, ref) => {
        const icons = {
            info: Info,
            success: CheckCircle2,
            warning: AlertCircle,
            error: AlertCircle,
        };

        const colors = {
            info: 'bg-info-500/10 border-info-500 text-info-400',
            success: 'bg-success-500/10 border-success-500 text-success-400',
            warning: 'bg-warning-500/10 border-warning-500 text-warning-400',
            error: 'bg-error-500/10 border-error-500 text-error-400',
        };

        const Icon = icons[variant];

        return (
            <div
                ref={ref}
                role={variant === 'error' ? 'alert' : 'status'}
                className={cn(
                    'flex items-start gap-3 p-4 rounded-lg border',
                    colors[variant],
                    className
                )}
                {...props}
            >
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">{children}</div>
            </div>
        );
    }
);

FormMessage.displayName = 'FormMessage';

export { Input, inputVariants, Textarea, FormField, FormMessage };
