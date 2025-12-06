'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, Badge, Button, Empty } from 'antd';
import {
    PlusOutlined,
    TeamOutlined,
    TrophyOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { AppShell } from '@/components/layout';
import { CountdownTimer } from '@/components/challenges/CountdownTimer';

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
                {/* Welcome header */}
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl font-bold">
                        Welcome back, {user?.name || 'Developer'}!
                    </h1>
                    <p className="mt-1 text-surface/70">
                        Here's what's happening in your coding arena.
                    </p>
                </motion.div>

                {/* Stats cards */}
                <motion.div
                    className="grid gap-4 md:grid-cols-3"
                    variants={itemVariants}
                >
                    <Card className="bg-background-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                <TeamOutlined className="text-xl" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-surface">{stats.totalGroups}</p>
                                <p className="text-sm text-surface/70">Groups</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-background-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                <TrophyOutlined className="text-xl" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-surface">{stats.totalChallenges}</p>
                                <p className="text-sm text-surface/70">Challenges</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-background-card border-border">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold/20 text-accent-gold">
                                <span className="text-xl font-bold">⭐</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-surface">
                                    {stats.avgScore.toFixed(1)}
                                </p>
                                <p className="text-sm text-surface/70">Avg Score</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Groups section */}
                <motion.div variants={itemVariants}>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Your Groups</h2>
                        <div className="flex gap-2">
                            <Link href="/groups/join">
                                <Button icon={<TeamOutlined />}>Join Group</Button>
                            </Link>
                            <Link href="/groups/create">
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Create Group
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {groups.length === 0 ? (
                        <Card className="bg-background-card border-border">
                            <Empty
                                description={
                                    <span className="text-surface/70">
                                        You haven't joined any groups yet
                                    </span>
                                }
                            >
                                <Link href="/groups/create">
                                    <Button type="primary" icon={<PlusOutlined />}>
                                        Create Your First Group
                                    </Button>
                                </Link>
                            </Empty>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {groups.map((group) => (
                                <Link key={group.id} href={`/groups/${group.id}`}>
                                    <Card
                                        className="h-full bg-background-card border-border transition-all hover:border-primary hover:glow-primary cursor-pointer"
                                        hoverable
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-surface">
                                                    {group.name}
                                                </h3>
                                                <p className="text-sm text-surface/70">
                                                    {group.memberCount} members
                                                </p>
                                            </div>
                                            {group.activeChallenges > 0 && (
                                                <Badge
                                                    count={group.activeChallenges}
                                                    style={{ backgroundColor: '#2C666E' }}
                                                />
                                            )}
                                        </div>

                                        {group.challenges.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <p className="text-xs font-medium uppercase tracking-wider text-surface/50">
                                                    Active Challenges
                                                </p>
                                                {group.challenges.slice(0, 2).map((challenge) => (
                                                    <div
                                                        key={challenge.id}
                                                        className="flex items-center justify-between rounded-lg bg-background-elevated p-2"
                                                    >
                                                        <span className="text-sm text-surface truncate">
                                                            {challenge.title}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {challenge.hasSubmitted ? (
                                                                <Badge status="success" text="Submitted" />
                                                            ) : (
                                                                <Badge status="warning" text="Pending" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AppShell>
    );
}
