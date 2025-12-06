'use client';

import { useState, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
    fallbackSrc?: string;
}

/**
 * Optimized image component with lazy loading and blur placeholder
 */
export function OptimizedImage({
    src,
    alt,
    fallbackSrc = '/images/placeholder.png',
    className = '',
    ...props
}: OptimizedImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#18181B] via-[#27272A] to-[#18181B] animate-pulse" />
            )}
            <Image
                src={imageSrc}
                alt={alt}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setImageSrc(fallbackSrc);
                    setIsLoading(false);
                }}
                {...props}
            />
        </div>
    );
}

/**
 * Intersection observer hook for lazy loading
 */
export function useLazyLoad(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isVisible };
}

/**
 * Lazy load wrapper component
 */
export function LazyLoad({
    children,
    fallback = null,
    threshold = 0.1,
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    threshold?: number;
}) {
    const { ref, isVisible } = useLazyLoad(threshold);

    return (
        <div ref={ref}>
            {isVisible ? children : fallback}
        </div>
    );
}
