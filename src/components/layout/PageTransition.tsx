'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

/* ===========================================
   PAGE TRANSITION COMPONENT
   Smooth transitions between pages
   =========================================== */

interface PageTransitionProps {
    children: ReactNode;
}

// Animation variants for page transitions
const pageVariants = {
    initial: {
        opacity: 0,
        y: 8,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -8,
    },
};

const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.25,
};

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

/* ===========================================
   FADE IN COMPONENT
   Simple fade-in animation wrapper
   =========================================== */

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.3,
    className,
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ===========================================
   SLIDE UP COMPONENT
   Slide up animation for content
   =========================================== */

interface SlideUpProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function SlideUp({
    children,
    delay = 0,
    duration = 0.4,
    className,
}: SlideUpProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ===========================================
   STAGGER CONTAINER
   Stagger children animations
   =========================================== */

interface StaggerContainerProps {
    children: ReactNode;
    staggerDelay?: number;
    className?: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

export function StaggerContainer({
    children,
    staggerDelay = 0.1,
    className,
}: StaggerContainerProps) {
    const customContainerVariants = {
        ...containerVariants,
        visible: {
            ...containerVariants.visible,
            transition: {
                ...containerVariants.visible.transition,
                staggerChildren: staggerDelay,
            },
        },
    };

    return (
        <motion.div
            variants={customContainerVariants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    );
}

/* ===========================================
   SCALE IN COMPONENT
   Scale-in animation for modals/cards
   =========================================== */

interface ScaleInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function ScaleIn({ children, delay = 0, className }: ScaleInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay, duration: 0.2, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
