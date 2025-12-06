'use client';

import { motion } from 'framer-motion';
import { Card, Avatar, Empty } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

interface LeaderboardEntry {
    rank: number;
    user: {
        id: string;
        name: string | null;
        avatarUrl: string | null;
        githubUsername: string;
    };
    submission?: {
        id: string;
        projectTitle: string;
    };
    score: number;
}

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    showProject?: boolean;
}

export function LeaderboardTable({ entries, showProject = true }: LeaderboardTableProps) {
    if (entries.length === 0) {
        return (
            <Card className="bg-background-card border-border">
                <Empty
                    image={<TrophyOutlined className="text-5xl text-surface/30" />}
                    description={
                        <span className="text-surface/70">No leaderboard data yet</span>
                    }
                />
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map((entry, index) => (
                <motion.div
                    key={entry.user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Card
                        className={`bg-background-card border-border transition-all hover:border-primary/50 ${entry.rank === 1
                                ? 'border-accent-gold/50 glow-gold'
                                : entry.rank === 2
                                    ? 'border-accent-silver/50'
                                    : entry.rank === 3
                                        ? 'border-accent-bronze/50'
                                        : ''
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Rank */}
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg ${entry.rank === 1
                                            ? 'bg-accent-gold text-black'
                                            : entry.rank === 2
                                                ? 'bg-accent-silver text-black'
                                                : entry.rank === 3
                                                    ? 'bg-accent-bronze text-white'
                                                    : 'bg-background-elevated text-surface/70'
                                        }`}
                                >
                                    {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                                </div>

                                {/* User */}
                                <Avatar src={entry.user.avatarUrl} size={48}>
                                    {entry.user.name?.[0] || entry.user.githubUsername[0]}
                                </Avatar>

                                <div>
                                    <p className="font-semibold text-surface">
                                        {entry.user.name || entry.user.githubUsername}
                                    </p>
                                    {showProject && entry.submission && (
                                        <p className="text-sm text-surface/70">
                                            {entry.submission.projectTitle}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Score */}
                            <div className="text-right">
                                <p
                                    className={`text-2xl font-bold ${entry.rank === 1
                                            ? 'text-accent-gold'
                                            : entry.rank === 2
                                                ? 'text-accent-silver'
                                                : entry.rank === 3
                                                    ? 'text-accent-bronze'
                                                    : 'text-primary'
                                        }`}
                                >
                                    {entry.score.toFixed(1)}
                                </p>
                                <p className="text-xs text-surface/50">points</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
