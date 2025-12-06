import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function formatCountdown(targetDate: Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
} {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
}

export function calculateFinalScore(votes: { totalScore: number }[]): number | null {
    if (votes.length === 0) return null;
    const sum = votes.reduce((acc, vote) => acc + vote.totalScore, 0);
    return Math.round((sum / votes.length) * 10) / 10;
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'UPCOMING':
            return 'blue';
        case 'ACTIVE':
            return 'green';
        case 'VOTING':
            return 'orange';
        case 'COMPLETED':
            return 'gray';
        default:
            return 'default';
    }
}

export function getRankIcon(rank: number): string {
    switch (rank) {
        case 1:
            return '👑';
        case 2:
            return '🥈';
        case 3:
            return '🥉';
        default:
            return `#${rank}`;
    }
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

export async function fetcher<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'An error occurred');
    }
    return res.json();
}
