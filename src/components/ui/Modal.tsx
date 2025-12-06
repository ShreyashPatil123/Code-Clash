'use client';

import { forwardRef, ReactNode, HTMLAttributes } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

/* ===========================================
   MODAL COMPONENT
   Accessible modal/dialog using Radix UI
   =========================================== */

interface ModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when the modal should close */
    onClose: () => void;
    /** Modal content */
    children: ReactNode;
    /** Size of the modal */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** Whether to show close button */
    showCloseButton?: boolean;
    /** Additional class names */
    className?: string;
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
};

const Modal = ({
    isOpen,
    onClose,
    children,
    size = 'md',
    showCloseButton = true,
    className,
}: ModalProps) => {
    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPrimitive.Portal>
                {/* Backdrop */}
                <DialogPrimitive.Overlay className="fixed inset-0 z-modal-backdrop bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />

                {/* Content */}
                <DialogPrimitive.Content
                    className={cn(
                        'fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2',
                        'w-full p-6',
                        'bg-background-card border border-border rounded-xl shadow-2xl',
                        'data-[state=open]:animate-scale-in',
                        'focus:outline-none',
                        sizeClasses[size],
                        className
                    )}
                >
                    {showCloseButton && (
                        <DialogPrimitive.Close
                            className="absolute right-4 top-4 p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label="Close dialog"
                        >
                            <X className="h-5 w-5" />
                        </DialogPrimitive.Close>
                    )}
                    {children}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

Modal.displayName = 'Modal';

/* ===========================================
   MODAL HEADER
   =========================================== */

const ModalHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('mb-4 pr-8', className)}
                {...props}
            />
        );
    }
);

ModalHeader.displayName = 'ModalHeader';

/* ===========================================
   MODAL TITLE
   =========================================== */

const ModalTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return (
            <DialogPrimitive.Title
                ref={ref}
                className={cn('text-xl font-semibold text-text-primary', className)}
                {...props}
            />
        );
    }
);

ModalTitle.displayName = 'ModalTitle';

/* ===========================================
   MODAL DESCRIPTION
   =========================================== */

const ModalDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => {
        return (
            <DialogPrimitive.Description
                ref={ref}
                className={cn('text-sm text-text-secondary mt-2', className)}
                {...props}
            />
        );
    }
);

ModalDescription.displayName = 'ModalDescription';

/* ===========================================
   MODAL BODY
   =========================================== */

const ModalBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('py-4', className)}
                {...props}
            />
        );
    }
);

ModalBody.displayName = 'ModalBody';

/* ===========================================
   MODAL FOOTER
   =========================================== */

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border', className)}
                {...props}
            />
        );
    }
);

ModalFooter.displayName = 'ModalFooter';

export {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalBody,
    ModalFooter,
};
