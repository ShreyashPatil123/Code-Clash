'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}

/**
 * Animated number counter with spring physics
 */
export function AnimatedCounter({
    value,
    duration = 2,
    className = '',
    prefix = '',
    suffix = '',
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [displayValue, setDisplayValue] = useState(0);

    const spring = useSpring(0, {
        duration: duration * 1000,
        bounce: 0,
    });

    const rounded = useTransform(spring, (latest) => Math.round(latest));

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, spring, value]);

    useEffect(() => {
        const unsubscribe = rounded.on('change', (latest) => {
            setDisplayValue(latest);
        });
        return unsubscribe;
    }, [rounded]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
        </span>
    );
}
