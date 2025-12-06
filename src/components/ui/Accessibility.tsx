'use client';

import { useEffect, useState } from 'react';

/**
 * Skip to main content link for keyboard navigation
 * Visible only on focus for accessibility
 */
export function SkipToContent() {
    return (
        <a
            href="#main-content"
            className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[100]
        px-4 py-2 rounded-lg
        bg-[#10B981] text-white font-semibold
        focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 focus:ring-offset-[#0A0A0B]
        transition-transform
        -translate-y-16 focus:translate-y-0
      "
        >
            Skip to main content
        </a>
    );
}

/**
 * Hook to detect user's reduced motion preference
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
}

/**
 * Wrapper that respects reduced motion preference
 */
export function MotionSafe({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion && fallback) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
