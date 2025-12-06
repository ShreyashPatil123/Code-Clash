'use client';

import { useEffect, useRef, ReactNode, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';

/* ===========================================
   LENIS SMOOTH SCROLL PROVIDER
   Global smooth scrolling for Next.js App Router
   Compatible with SSR and reduced motion
   =========================================== */

// Lenis type (lazy loaded)
type LenisInstance = import('lenis').default;

// Context for Lenis instance
const LenisContext = createContext<LenisInstance | null>(null);

export function useLenis() {
    return useContext(LenisContext);
}

interface LenisProviderProps {
    children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
    const lenisRef = useRef<LenisInstance | null>(null);
    const pathname = usePathname();
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            return;
        }

        // Dynamic import Lenis to avoid SSR issues
        const initLenis = async () => {
            try {
                const Lenis = (await import('lenis')).default;

                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    orientation: 'vertical',
                    gestureOrientation: 'vertical',
                    smoothWheel: true,
                    touchMultiplier: 2,
                    infinite: false,
                });

                lenisRef.current = lenis;

                // Animation frame loop using arrow function
                const raf = (time: number) => {
                    lenis.raf(time);
                    rafRef.current = requestAnimationFrame(raf);
                };

                rafRef.current = requestAnimationFrame(raf);
            } catch (error) {
                console.warn('Failed to initialize Lenis:', error);
            }
        };

        initLenis();

        // Listen for reduced motion changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = (e: MediaQueryListEvent) => {
            if (e.matches && lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
        mediaQuery.addEventListener('change', handleMotionChange);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
            lenisRef.current = null;
            mediaQuery.removeEventListener('change', handleMotionChange);
        };
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        }
    }, [pathname]);

    return (
        <LenisContext.Provider value={lenisRef.current}>
            {children}
        </LenisContext.Provider>
    );
}

/* ===========================================
   SCROLL TO HOOK
   Use Lenis for smooth scroll-to animations
   =========================================== */

export function useScrollTo() {
    const lenis = useLenis();

    const scrollTo = (
        target: string | number | HTMLElement,
        options?: {
            offset?: number;
            duration?: number;
            immediate?: boolean;
        }
    ) => {
        if (lenis) {
            lenis.scrollTo(target, {
                offset: options?.offset ?? 0,
                duration: options?.duration ?? 1.2,
                immediate: options?.immediate ?? false,
            });
        } else if (typeof window !== 'undefined') {
            if (typeof target === 'number') {
                window.scrollTo({ top: target, behavior: 'auto' });
            } else if (typeof target === 'string') {
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'auto' });
                }
            } else {
                target.scrollIntoView({ behavior: 'auto' });
            }
        }
    };

    return { scrollTo };
}
