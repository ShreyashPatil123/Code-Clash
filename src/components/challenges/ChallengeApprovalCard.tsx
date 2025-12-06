'use client';

import { useState } from 'react';
import { Card, Button, Progress, Tag, message } from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

interface ChallengeApprovalCardProps {
    challenge: {
        id: string;
        title: string;
        description: string;
        status: string;
        createdBy: {
            id: string;
            name: string | null;
        };
    };
    approvalStatus?: {
        totalMembers: number;
        approvedCount: number;
        rejectedCount: number;
        threshold: number;
        userVote: boolean | null;
    };
    onApprove?: (challengeId: string, approved: boolean) => Promise<void>;
}

export function ChallengeApprovalCard({
    challenge,
    approvalStatus,
    onApprove,
}: ChallengeApprovalCardProps) {
    const [loading, setLoading] = useState(false);
    const [localVote, setLocalVote] = useState<boolean | null>(
        approvalStatus?.userVote ?? null
    );
    const [localApprovedCount, setLocalApprovedCount] = useState(
        approvalStatus?.approvedCount ?? 0
    );

    const isPending = challenge.status === 'PENDING';
    const totalMembers = approvalStatus?.totalMembers ?? 1;
    const threshold = approvalStatus?.threshold ?? 1;
    const progress = Math.round((localApprovedCount / threshold) * 100);

    const handleVote = async (approved: boolean) => {
        if (!onApprove || loading) return;

        setLoading(true);
        try {
            await onApprove(challenge.id, approved);

            // Update local state
            if (localVote !== null) {
                // Changing vote
                if (localVote && !approved) {
                    setLocalApprovedCount((prev) => prev - 1);
                } else if (!localVote && approved) {
                    setLocalApprovedCount((prev) => prev + 1);
                }
            } else {
                // New vote
                if (approved) {
                    setLocalApprovedCount((prev) => prev + 1);
                }
            }
            setLocalVote(approved);

            message.success(approved ? 'Approved!' : 'Rejected');
        } catch {
            message.error('Failed to submit vote');
        } finally {
            setLoading(false);
        }
    };

    if (!isPending) {
        return null; // Only show for pending challenges
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                className="bg-background-card border-border overflow-hidden"
                styles={{ body: { padding: 0 } }}
            >
                {/* Header with pending badge */}
                <div className="p-4 border-b border-border-light bg-gradient-to-r from-purple-900/10 to-transparent">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Tag color="purple" className="m-0">
                                    <ClockCircleOutlined className="mr-1" />
                                    Pending Approval
                                </Tag>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary truncate">
                                {challenge.title}
                            </h3>
                            <p className="text-sm text-text-tertiary mt-1 line-clamp-2">
                                {challenge.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Approval progress */}
                <div className="p-4 space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-text-secondary">
                                Approval Progress
                            </span>
                            <span className="text-sm font-medium text-primary-500">
                                {localApprovedCount}/{threshold} needed
                            </span>
                        </div>
                        <Progress
                            percent={Math.min(progress, 100)}
                            strokeColor={{
                                '0%': '#2C666E',
                                '100%': '#10B981',
                            }}
                            trailColor="rgba(42, 42, 45, 0.5)"
                            status={progress >= 100 ? 'success' : 'active'}
                            showInfo={false}
                        />
                        <div className="flex items-center justify-between mt-2 text-xs text-text-tertiary">
                            <span>{localApprovedCount} approved</span>
                            <span>
                                {totalMembers -
                                    (approvalStatus?.approvedCount ?? 0) -
                                    (approvalStatus?.rejectedCount ?? 0)}{' '}
                                pending
                            </span>
                        </div>
                    </div>

                    {/* Vote buttons */}
                    <div className="flex gap-3">
                        <Button
                            type={localVote === true ? 'primary' : 'default'}
                            icon={<CheckOutlined />}
                            onClick={() => handleVote(true)}
                            loading={loading}
                            disabled={localVote === true}
                            className="flex-1"
                            style={
                                localVote === true
                                    ? { backgroundColor: '#10B981', borderColor: '#10B981' }
                                    : {}
                            }
                        >
                            {localVote === true ? 'Approved' : 'Approve'}
                        </Button>
                        <Button
                            danger={localVote === false}
                            type={localVote === false ? 'primary' : 'default'}
                            icon={<CloseOutlined />}
                            onClick={() => handleVote(false)}
                            loading={loading}
                            disabled={localVote === false}
                            className="flex-1"
                        >
                            {localVote === false ? 'Rejected' : 'Reject'}
                        </Button>
                    </div>

                    {/* Info text */}
                    <p className="text-xs text-text-tertiary text-center">
                        {Math.ceil(totalMembers * 0.6)} of {totalMembers} members must
                        approve (60% threshold)
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}
