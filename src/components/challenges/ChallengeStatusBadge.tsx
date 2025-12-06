'use client';

import { Badge } from 'antd';
import { ChallengeStatus } from '@/types';

interface ChallengeStatusBadgeProps {
    status: ChallengeStatus;
}

const statusConfig: Record<ChallengeStatus, { color: string; text: string }> = {
    PENDING: { color: 'purple', text: 'Pending Approval' },
    DRAFT: { color: 'default', text: 'Draft' },
    UPCOMING: { color: 'blue', text: 'Upcoming' },
    ACTIVE: { color: 'green', text: 'Active' },
    VOTING: { color: 'orange', text: 'Voting' },
    COMPLETED: { color: 'default', text: 'Completed' },
};

export function ChallengeStatusBadge({ status }: ChallengeStatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.DRAFT;

    return (
        <Badge
            status={config.color as any}
            text={
                <span className={`text-sm ${status === 'ACTIVE' ? 'animate-pulse' : ''}`}>
                    {config.text}
                </span>
            }
        />
    );
}
