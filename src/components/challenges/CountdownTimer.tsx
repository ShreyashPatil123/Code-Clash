'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
    targetDate: string | Date;
    onComplete?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

export function CountdownTimer({
    targetDate,
    onComplete,
    size = 'md',
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
    });

    useEffect(() => {
        const target = new Date(targetDate);

        const updateCountdown = () => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isExpired: true,
                });
                onComplete?.();
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
                isExpired: false,
            });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [targetDate, onComplete]);

    if (timeLeft.isExpired) {
        return (
            <span className="text-surface/50 font-mono">Ended</span>
        );
    }

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl',
    };

    const unitSizeClasses = {
        sm: 'text-xs',
        md: 'text-xs',
        lg: 'text-sm',
    };

    return (
        <div className={`flex items-center gap-2 font-mono ${sizeClasses[size]}`}>
            <TimeUnit value={timeLeft.days} label="d" unitClass={unitSizeClasses[size]} />
            <span className="text-surface/50">:</span>
            <TimeUnit value={timeLeft.hours} label="h" unitClass={unitSizeClasses[size]} />
            <span className="text-surface/50">:</span>
            <TimeUnit value={timeLeft.minutes} label="m" unitClass={unitSizeClasses[size]} />
            <span className="text-surface/50">:</span>
            <TimeUnit value={timeLeft.seconds} label="s" unitClass={unitSizeClasses[size]} />
        </div>
    );
}

function TimeUnit({
    value,
    label,
    unitClass,
}: {
    value: number;
    label: string;
    unitClass: string;
}) {
    return (
        <span className="flex items-baseline gap-0.5">
            <span className="text-surface font-bold tabular-nums">
                {value.toString().padStart(2, '0')}
            </span>
            <span className={`text-surface/50 ${unitClass}`}>{label}</span>
        </span>
    );
}
