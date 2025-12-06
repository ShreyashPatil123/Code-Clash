'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { GithubOutlined, TrophyOutlined, TeamOutlined, RobotOutlined, BarChartOutlined } from '@ant-design/icons';
import { SignInButton } from '@/components/auth/SignInButton';

const features = [
    {
        icon: <TeamOutlined className="text-3xl" />,
        title: 'Group Challenges',
        description: 'Create private groups with friends and compete in custom coding challenges.',
    },
    {
        icon: <TrophyOutlined className="text-3xl" />,
        title: 'Peer Voting',
        description: 'Everyone votes on each submission. No judges needed - fair and democratic.',
    },
    {
        icon: <RobotOutlined className="text-3xl" />,
        title: 'AI Analysis',
        description: 'Get instant feedback on your code quality, creativity, and more.',
    },
    {
        icon: <BarChartOutlined className="text-3xl" />,
        title: 'Leaderboards',
        description: 'Track your progress and climb the ranks with competitive leaderboards.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold">
                            {'</>'}
                        </div>
                        <span className="text-xl font-bold gradient-text">CodeClash</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <Link href="/dashboard">
                                <Button type="primary" size="large">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <SignInButton size="large" />
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                </div>

                <motion.div
                    className="container relative z-10 mx-auto px-4 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants} className="mb-4">
                        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm text-primary-light">
                            Where friends become rivals
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="mb-6 text-5xl font-bold leading-tight md:text-7xl"
                    >
                        <span className="gradient-text">Compete.</span>{' '}
                        <span className="text-surface">Code.</span>{' '}
                        <span className="gradient-text">Conquer.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mx-auto mb-8 max-w-2xl text-lg text-surface/70 md:text-xl"
                    >
                        Challenge your friends to coding competitions. Submit your best work,
                        vote on each other's projects, and climb the leaderboards.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                    >
                        {session ? (
                            <Link href="/dashboard">
                                <Button type="primary" size="large" className="h-12 px-8 text-lg">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <SignInButton size="large" fullWidth={false} />
                        )}
                        <Button
                            size="large"
                            className="h-12 px-8 text-lg"
                            icon={<GithubOutlined />}
                            href="https://github.com"
                            target="_blank"
                        >
                            View on GitHub
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            Everything You Need to Compete
                        </h2>
                        <p className="mx-auto max-w-2xl text-surface/70">
                            CodeClash provides all the tools for friendly coding competitions
                            within your developer group.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="glass-card p-6 text-center transition-all hover:glow-primary"
                            >
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                                <p className="text-surface/70">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-border py-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            Ready to Start Competing?
                        </h2>
                        <p className="mx-auto mb-8 max-w-xl text-surface/70">
                            Sign in with GitHub and create your first group. Invite your friends
                            and start your first challenge today!
                        </p>
                        {!session && <SignInButton size="large" />}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-sm text-white font-bold">
                            {'</>'}
                        </div>
                        <span className="font-semibold">CodeClash</span>
                    </div>
                    <p className="text-sm text-surface/50">
                        © {new Date().getFullYear()} CodeClash. Built for developers, by developers.
                    </p>
                </div>
            </footer>
        </div>
    );
}
