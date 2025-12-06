'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, Avatar, Tag, Table, Empty } from 'antd';
import {
    GithubOutlined,
    TrophyOutlined,
    ThunderboltOutlined,
    TeamOutlined,
    StarOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { AppShell } from '@/components/layout';
import { ChallengeStatus } from '@/types';

interface ProfileClientProps {
    user: {
        id: string;
        name: string | null;
        email: string;
        githubUsername: string;
        avatarUrl: string | null;
        createdAt: string;
        stats: {
            totalChallenges: number;
            wins: number;
            avgScore: number;
            groupCount: number;
        };
        recentSubmissions: Array<{
            id: string;
            projectTitle: string;
            finalScore: number | null;
            createdAt: string;
            challenge: { id: string; title: string; status: ChallengeStatus };
        }>;
        groups: Array<{ id: string; name: string }>;
    };
    sidebarGroups: Array<{ id: string; name: string }>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function ProfileClient({ user, sidebarGroups }: ProfileClientProps) {
    const statCards = [
        {
            icon: <ThunderboltOutlined />,
            label: 'Challenges',
            value: user.stats.totalChallenges,
            color: 'text-primary',
        },
        {
            icon: <TrophyOutlined />,
            label: 'Wins',
            value: user.stats.wins,
            color: 'text-accent-gold',
        },
        {
            icon: <StarOutlined />,
            label: 'Avg Score',
            value: user.stats.avgScore.toFixed(1),
            color: 'text-primary',
        },
        {
            icon: <TeamOutlined />,
            label: 'Groups',
            value: user.stats.groupCount,
            color: 'text-primary',
        },
    ];

    const submissionColumns = [
        {
            title: 'Project',
            dataIndex: 'projectTitle',
            key: 'projectTitle',
            render: (text: string, record: any) => (
                <span className="font-medium text-surface">{text}</span>
            ),
        },
        {
            title: 'Challenge',
            dataIndex: ['challenge', 'title'],
            key: 'challenge',
            render: (text: string) => (
                <span className="text-surface/70">{text}</span>
            ),
        },
        {
            title: 'Score',
            dataIndex: 'finalScore',
            key: 'score',
            render: (score: number | null) =>
                score !== null ? (
                    <span className="font-mono text-primary">{score.toFixed(1)}</span>
                ) : (
                    <Tag>Pending</Tag>
                ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date: string) => (
                <span className="text-surface/50 text-sm">
                    {new Date(date).toLocaleDateString()}
                </span>
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
                {/* Profile Header */}
                <motion.div variants={itemVariants}>
                    <Card className="bg-background-card border-border">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Avatar
                                src={user.avatarUrl}
                                size={120}
                                className="border-4 border-primary"
                            >
                                {user.name?.[0] || user.githubUsername[0]}
                            </Avatar>

                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-surface">
                                    {user.name || user.githubUsername}
                                </h1>
                                <a
                                    href={`https://github.com/${user.githubUsername}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:text-primary-light mt-2"
                                >
                                    <GithubOutlined />
                                    @{user.githubUsername}
                                </a>
                                <p className="text-surface/50 text-sm mt-1 flex items-center gap-1 justify-center md:justify-start">
                                    <CalendarOutlined />
                                    Member since {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    variants={itemVariants}
                >
                    {statCards.map((stat, index) => (
                        <Card key={index} className="bg-background-card border-border">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 ${stat.color}`}
                                >
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-surface">{stat.value}</p>
                                    <p className="text-sm text-surface/70">{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </motion.div>

                {/* Groups */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
                    {user.groups.length === 0 ? (
                        <Card className="bg-background-card border-border">
                            <Empty description="No groups yet" />
                        </Card>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {user.groups.map((group) => (
                                <Link key={group.id} href={`/groups/${group.id}`}>
                                    <Tag
                                        className="text-sm px-3 py-1 cursor-pointer hover:border-primary transition-colors"
                                        color="default"
                                    >
                                        <TeamOutlined className="mr-1" />
                                        {group.name}
                                    </Tag>
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Recent Submissions */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
                    <Card className="bg-background-card border-border">
                        {user.recentSubmissions.length === 0 ? (
                            <Empty description="No submissions yet" />
                        ) : (
                            <Table
                                dataSource={user.recentSubmissions}
                                columns={submissionColumns}
                                rowKey="id"
                                pagination={false}
                                className="profile-table"
                            />
                        )}
                    </Card>
                </motion.div>
            </motion.div>
        </AppShell>
    );
}
