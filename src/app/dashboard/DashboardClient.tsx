'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, Badge, Button, Empty, Statistic, Tag, Tooltip } from 'antd';
import {
    PlusOutlined,
    TeamOutlined,
    TrophyOutlined,
    StarFilled,
    ArrowRightOutlined,
    ThunderboltOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { AppShell } from '@/components/layout';

interface DashboardClientProps {
    groups: Array<{
        id: string;
        name: string;
        memberCount: number;
        activeChallenges: number;
        challenges: Array<{
            id: string;
            title: string;
            endDate: string;
            status: string;
            hasSubmitted: boolean;
        }>;
    }>;
    stats: {
        totalGroups: number;
        totalChallenges: number;
        avgScore: number;
    };
    user: any;
}

// Enhanced animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const cardHoverVariants = {
    rest: {
        scale: 1,
        y: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    },
    hover: {
        scale: 1.02,
        y: -4,
        boxShadow: '0 10px 30px rgba(44, 102, 110, 0.2)',
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

export function DashboardClient({ groups, stats, user }: DashboardClientProps) {
    const sidebarGroups = groups.map((g) => ({ id: g.id, name: g.name }));

    return (
        <AppShell groups={sidebarGroups}>
            <motion.div
                className="space-y-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Welcome header with gradient text */}
                <motion.div variants={itemVariants} className="relative">
                    <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
                    <h1 className="text-4xl font-bold relative">
                        Welcome back,{' '}
                        <span className="gradient-text">{user?.name || 'Developer'}</span>!
                    </h1>
                    <p className="mt-2 text-lg text-text-secondary">
                        Here's what's happening in your coding arena.
                    </p>
                </motion.div>

                {/* Stats cards with AntD Statistic */}
                <motion.div
                    className="grid gap-6 md:grid-cols-3"
                    variants={itemVariants}
                >
                    {/* Groups Stat */}
                    <motion.div
                        variants={cardHoverVariants}
                        initial="rest"
                        whileHover="hover"
                    >
                        <Card
                            className="bg-background-card border-border overflow-hidden"
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <Statistic
                                        title={
                                            <span className="text-text-tertiary text-sm font-medium">
                                                Groups
                                            </span>
                                        }
                                        value={stats.totalGroups}
                                        valueStyle={{
                                            color: '#F0EDEE',
                                            fontSize: 36,
                                            fontWeight: 700,
                                        }}
                                    />
                                </div>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600/20 to-primary-500/10">
                                    <TeamOutlined className="text-2xl text-primary-500" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border-light">
                                <Link
                                    href="/groups/create"
                                    className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1"
                                >
                                    Create new group <ArrowRightOutlined className="text-xs" />
                                </Link>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Challenges Stat */}
                    <motion.div
                        variants={cardHoverVariants}
                        initial="rest"
                        whileHover="hover"
                    >
                        <Card
                            className="bg-background-card border-border overflow-hidden"
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <Statistic
                                        title={
                                            <span className="text-text-tertiary text-sm font-medium">
                                                Submissions
                                            </span>
                                        }
                                        value={stats.totalChallenges}
                                        valueStyle={{
                                            color: '#F0EDEE',
                                            fontSize: 36,
                                            fontWeight: 700,
                                        }}
                                    />
                                </div>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-600/20 to-secondary-500/10">
                                    <TrophyOutlined className="text-2xl text-secondary-500" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border-light">
                                <span className="text-sm text-text-tertiary">
                                    Total project submissions
                                </span>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Average Score Stat */}
                    <motion.div
                        variants={cardHoverVariants}
                        initial="rest"
                        whileHover="hover"
                    >
                        <Card
                            className="bg-background-card border-border overflow-hidden"
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <Statistic
                                        title={
                                            <span className="text-text-tertiary text-sm font-medium">
                                                Average Score
                                            </span>
                                        }
                                        value={stats.avgScore}
                                        precision={1}
                                        suffix="/10"
                                        valueStyle={{
                                            color: '#FFD700',
                                            fontSize: 36,
                                            fontWeight: 700,
                                        }}
                                    />
                                </div>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-warning-500/20 to-warning-400/10">
                                    <StarFilled className="text-2xl text-warning-500" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border-light">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-background-elevated rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-warning-500 to-warning-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(stats.avgScore / 10) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Groups section */}
                <motion.div variants={itemVariants}>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">Your Groups</h2>
                            <p className="text-text-tertiary text-sm mt-1">
                                Manage your coding communities
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/groups/join">
                                <Button
                                    icon={<TeamOutlined />}
                                    size="large"
                                    className="h-11"
                                >
                                    Join Group
                                </Button>
                            </Link>
                            <Link href="/groups/create">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="large"
                                    className="h-11"
                                >
                                    Create Group
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {groups.length === 0 ? (
                        <Card className="bg-background-card border-border">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div className="text-center">
                                        <p className="text-text-secondary text-lg mb-2">
                                            No groups yet
                                        </p>
                                        <p className="text-text-tertiary text-sm">
                                            Create or join a group to start competing!
                                        </p>
                                    </div>
                                }
                            >
                                <div className="flex justify-center gap-3 mt-4">
                                    <Link href="/groups/join">
                                        <Button icon={<TeamOutlined />}>Join Group</Button>
                                    </Link>
                                    <Link href="/groups/create">
                                        <Button type="primary" icon={<PlusOutlined />}>
                                            Create Your First Group
                                        </Button>
                                    </Link>
                                </div>
                            </Empty>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {groups.map((group, index) => (
                                <motion.div
                                    key={group.id}
                                    variants={cardHoverVariants}
                                    initial="rest"
                                    whileHover="hover"
                                    custom={index}
                                >
                                    <Link href={`/groups/${group.id}`}>
                                        <Card
                                            className="h-full bg-background-card border-border cursor-pointer group"
                                            bodyStyle={{ padding: '24px' }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-semibold text-text-primary truncate group-hover:text-primary-500 transition-colors">
                                                        {group.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-2 text-text-tertiary">
                                                        <UserOutlined className="text-sm" />
                                                        <span className="text-sm">
                                                            {group.memberCount} members
                                                        </span>
                                                    </div>
                                                </div>
                                                {group.activeChallenges > 0 && (
                                                    <Tooltip title="Active challenges">
                                                        <Badge
                                                            count={group.activeChallenges}
                                                            style={{
                                                                backgroundColor: '#2C666E',
                                                                boxShadow: '0 0 10px rgba(44, 102, 110, 0.3)',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </div>

                                            {group.challenges.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <ThunderboltOutlined className="text-warning-500 text-sm" />
                                                        <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                                                            Active Challenges
                                                        </span>
                                                    </div>
                                                    {group.challenges.slice(0, 2).map((challenge) => (
                                                        <div
                                                            key={challenge.id}
                                                            className="flex items-center justify-between p-3 rounded-lg bg-background-elevated/50 border border-border-light"
                                                        >
                                                            <span className="text-sm text-text-primary truncate flex-1 mr-2">
                                                                {challenge.title}
                                                            </span>
                                                            <Tag
                                                                color={challenge.hasSubmitted ? 'success' : 'warning'}
                                                                className="ml-auto flex-shrink-0"
                                                            >
                                                                {challenge.hasSubmitted ? 'Submitted' : 'Pending'}
                                                            </Tag>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {group.challenges.length === 0 && (
                                                <div className="p-4 rounded-lg bg-background-elevated/30 border border-dashed border-border text-center">
                                                    <p className="text-sm text-text-tertiary">
                                                        No active challenges
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-4 pt-4 border-t border-border-light flex items-center justify-between">
                                                <span className="text-xs text-text-tertiary">
                                                    View group details
                                                </span>
                                                <ArrowRightOutlined className="text-primary-500 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AppShell>
    );
}
