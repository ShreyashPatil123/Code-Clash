'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tabs, Card, Avatar, Button, message, Tooltip } from 'antd';
import {
    PlusOutlined,
    CopyOutlined,
    TrophyOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { AppShell } from '@/components/layout';
import { ChallengeCard, ChallengeApprovalCard } from '@/components/challenges';
import { LeaveGroupButton } from '@/components/groups';
import { ChallengeStatus } from '@/types';

interface GroupDashboardClientProps {
    group: {
        id: string;
        name: string;
        inviteCode: string;
        createdBy: { id: string; name: string | null; avatarUrl: string | null };
        createdAt: string;
        members: Array<{
            id: string;
            name: string | null;
            avatarUrl: string | null;
            githubUsername: string;
            joinedAt: string;
        }>;
        challenges: Array<{
            id: string;
            title: string;
            description: string;
            startDate: string;
            endDate: string;
            status: ChallengeStatus;
            submissionCount: number;
            createdBy: { id: string; name: string | null };
            weights: {
                functionality: number;
                uiDesign: number;
                creativity: number;
                codeQuality: number;
            };
        }>;
    };
    sidebarGroups: Array<{ id: string; name: string }>;
    currentUserId: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function GroupDashboardClient({
    group,
    sidebarGroups,
    currentUserId,
}: GroupDashboardClientProps) {
    const [activeTab, setActiveTab] = useState('challenges');

    const copyInviteCode = () => {
        navigator.clipboard.writeText(group.inviteCode);
        message.success('Invite code copied!');
    };

    const activeChallenges = group.challenges.filter(
        (c) => c.status === 'ACTIVE' || c.status === 'VOTING'
    );
    const pendingChallenges = group.challenges.filter((c) => c.status === 'PENDING');
    const upcomingChallenges = group.challenges.filter((c) => c.status === 'UPCOMING');
    const completedChallenges = group.challenges.filter((c) => c.status === 'COMPLETED');

    // Handle challenge approval
    const handleApprove = async (challengeId: string, approved: boolean) => {
        const response = await fetch(`/api/challenges/${challengeId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ approved }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error?.message || 'Failed to vote');
        }
    };

    const tabItems = [
        {
            key: 'challenges',
            label: (
                <span className="flex items-center gap-2">
                    <ThunderboltOutlined />
                    Challenges ({group.challenges.length})
                </span>
            ),
            children: (
                <div className="space-y-6">
                    {/* Pending Approval Challenges */}
                    {pendingChallenges.length > 0 && (
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-surface flex items-center gap-2">
                                <span className="animate-pulse w-2 h-2 rounded-full bg-purple-500" />
                                Pending Approval ({pendingChallenges.length})
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {pendingChallenges.map((challenge) => (
                                    <ChallengeApprovalCard
                                        key={challenge.id}
                                        challenge={challenge}
                                        approvalStatus={{
                                            totalMembers: group.members.length,
                                            approvedCount: 1, // Creator auto-approved
                                            rejectedCount: 0,
                                            threshold: Math.ceil(group.members.length * 0.6),
                                            userVote: challenge.createdBy.id === currentUserId ? true : null,
                                        }}
                                        onApprove={handleApprove}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Challenges */}
                    {activeChallenges.length > 0 && (
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-surface">
                                Active & Voting
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {activeChallenges.map((challenge) => (
                                    <ChallengeCard
                                        key={challenge.id}
                                        challenge={challenge}
                                        groupId={group.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Challenges */}
                    {upcomingChallenges.length > 0 && (
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-surface">Upcoming</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {upcomingChallenges.map((challenge) => (
                                    <ChallengeCard
                                        key={challenge.id}
                                        challenge={challenge}
                                        groupId={group.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Challenges */}
                    {completedChallenges.length > 0 && (
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-surface">Completed</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {completedChallenges.map((challenge) => (
                                    <ChallengeCard
                                        key={challenge.id}
                                        challenge={challenge}
                                        groupId={group.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {group.challenges.length === 0 && (
                        <Card className="bg-background-card border-border text-center py-8">
                            <ThunderboltOutlined className="text-4xl text-surface/30 mb-4" />
                            <p className="text-surface/70 mb-4">No challenges yet</p>
                            <Link href={`/groups/${group.id}/challenges/create`}>
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Create First Challenge
                                </Button>
                            </Link>
                        </Card>
                    )}
                </div>
            ),
        },
        {
            key: 'members',
            label: (
                <span className="flex items-center gap-2">
                    <TeamOutlined />
                    Members ({group.members.length})
                </span>
            ),
            children: (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.members.map((member) => (
                        <Card key={member.id} className="bg-background-card border-border">
                            <div className="flex items-center gap-4">
                                <Avatar src={member.avatarUrl} size={48}>
                                    {member.name?.[0] || member.githubUsername[0]}
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-surface">
                                        {member.name || member.githubUsername}
                                    </p>
                                    <a
                                        href={`https://github.com/${member.githubUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:text-primary-light"
                                    >
                                        @{member.githubUsername}
                                    </a>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ),
        },
        {
            key: 'leaderboard',
            label: (
                <span className="flex items-center gap-2">
                    <TrophyOutlined />
                    Leaderboard
                </span>
            ),
            children: (
                <Card className="bg-background-card border-border text-center py-8">
                    <TrophyOutlined className="text-4xl text-accent-gold mb-4" />
                    <p className="text-surface/70">
                        Leaderboard will appear after challenges are completed.
                    </p>
                </Card>
            ),
        },
    ];

    return (
        <AppShell groups={sidebarGroups}>
            <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold">{group.name}</h1>
                        <p className="mt-1 text-surface/70">
                            {group.members.length} members · Created by {group.createdBy.name}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Tooltip title="Click to copy">
                            <Button
                                icon={<CopyOutlined />}
                                onClick={copyInviteCode}
                                className="font-mono"
                            >
                                {group.inviteCode}
                            </Button>
                        </Tooltip>
                        <Link href={`/groups/${group.id}/challenges/create`}>
                            <Button type="primary" icon={<PlusOutlined />}>
                                New Challenge
                            </Button>
                        </Link>
                        <LeaveGroupButton
                            groupId={group.id}
                            groupName={group.name}
                            isAdmin={group.createdBy.id === currentUserId}
                            memberCount={group.members.length}
                        />
                    </div>
                </motion.div>

                {/* Member avatars */}
                <motion.div variants={itemVariants}>
                    <Avatar.Group maxCount={8} size="large">
                        {group.members.map((member) => (
                            <Tooltip key={member.id} title={member.name || member.githubUsername}>
                                <Avatar src={member.avatarUrl}>
                                    {member.name?.[0] || member.githubUsername[0]}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                </motion.div>

                {/* Tabs */}
                <motion.div variants={itemVariants}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        className="group-tabs"
                    />
                </motion.div>
            </motion.div>
        </AppShell>
    );
}
