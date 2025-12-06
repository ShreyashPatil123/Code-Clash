'use client';

import { useEffect, useState } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface RiveAnimationProps {
    src: string;
    stateMachine?: string;
    autoplay?: boolean;
    className?: string;
    onLoad?: () => void;
    onError?: () => void;
}

/**
 * Wrapper for Rive animations with:
 * - Lazy loading support
 * - Reduced-motion detection
 * - Error handling with fallback
 */
export function RiveAnimation({
    src,
    stateMachine,
    autoplay = true,
    className = '',
    onLoad,
    onError,
}: RiveAnimationProps) {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const { RiveComponent, rive } = useRive({
        src,
        stateMachines: stateMachine ? [stateMachine] : undefined,
        autoplay: autoplay && !prefersReducedMotion,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
        onLoad: () => {
            onLoad?.();
        },
        onLoadError: () => {
            setHasError(true);
            onError?.();
        },
    });

    // If reduced motion or error, show static fallback
    if (prefersReducedMotion || hasError) {
        return (
            <div className={`flex items-center justify-center ${className}`}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2C666E] to-[#10B981] opacity-50" />
            </div>
        );
    }

    return <RiveComponent className={className} />;
}
