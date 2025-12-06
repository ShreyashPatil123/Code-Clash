'use client';

import Link from 'next/link';
import { Card, Badge } from 'antd';
import { motion } from 'framer-motion';
import { ClockCircleOutlined } from '@ant-design/icons';
import { CountdownTimer } from './CountdownTimer';
import { ChallengeStatusBadge } from './ChallengeStatusBadge';
import { ChallengeStatus } from '@/types';

interface ChallengeCardProps {
    challenge: {
        id: string;
        title: string;
        description: string;
        status: ChallengeStatus;
        endDate: string;
        submissionCount: number;
        weights: {
            functionality: number;
            uiDesign: number;
            creativity: number;
            codeQuality: number;
        };
    };
    groupId: string;
}

export function ChallengeCard({ challenge, groupId }: ChallengeCardProps) {
    return (
        <Link href={`/groups/${groupId}/challenges/${challenge.id}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
                <Card
                    className="h-full bg-background-card border-border transition-colors hover:border-primary cursor-pointer"
                    hoverable
                >
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-surface line-clamp-1">
                            {challenge.title}
                        </h3>
                        <ChallengeStatusBadge status={challenge.status} />
                    </div>

                    <p className="text-sm text-surface/70 line-clamp-2 mb-4">
                        {challenge.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-surface/50">
                            <ClockCircleOutlined />
                            {challenge.status === 'COMPLETED' ? (
                                <span className="text-sm">Ended</span>
                            ) : (
                                <CountdownTimer targetDate={challenge.endDate} size="sm" />
                            )}
                        </div>
                        <Badge
                            count={`${challenge.submissionCount} submissions`}
                            style={{
                                backgroundColor: 'transparent',
                                color: 'rgba(240, 237, 238, 0.5)',
                                border: '1px solid rgba(42, 42, 45, 0.5)',
                            }}
                        />
                    </div>

                    {/* Weights preview */}
                    <div className="mt-4 flex gap-2">
                        {Object.entries(challenge.weights).map(([key, value]) => (
                            <div
                                key={key}
                                className="flex flex-col items-center rounded bg-background-elevated px-2 py-1"
                            >
                                <span className="text-xs text-surface/50">
                                    {key.slice(0, 4).toUpperCase()}
                                </span>
                                <span className="text-sm font-semibold text-primary">{value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </Link>
    );
}
