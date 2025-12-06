'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import {
    GithubOutlined,
    TrophyOutlined,
    TeamOutlined,
    RobotOutlined,
    BarChartOutlined,
    ThunderboltOutlined,
    CodeOutlined,
    StarOutlined,
} from '@ant-design/icons';
import { SignInButton } from '@/components/auth/SignInButton';
import { HeroSection, GradientText, GlowCard, BentoGrid, BentoItem, GradientButton } from '@/components/ui';

const features = [
    {
        icon: <TeamOutlined className="text-3xl text-[#2C666E]" />,
        title: 'Group Challenges',
        description: 'Create private groups with friends and compete in custom coding challenges.',
        colSpan: 1 as const,
    },
    {
        icon: <TrophyOutlined className="text-3xl text-[#F59E0B]" />,
        title: 'Peer Voting',
        description: 'Everyone votes on each submission. No judges needed - fair and democratic evaluation.',
        colSpan: 2 as const,
    },
    {
        icon: <RobotOutlined className="text-3xl text-[#8B5CF6]" />,
        title: 'AI Analysis',
        description: 'Get instant feedback on your code quality, creativity, and more with AI-powered insights.',
        colSpan: 2 as const,
    },
    {
        icon: <BarChartOutlined className="text-3xl text-[#10B981]" />,
        title: 'Leaderboards',
        description: 'Track your progress and climb the ranks with competitive leaderboards.',
        colSpan: 1 as const,
    },
];

const stats = [
    { value: '100+', label: 'Active Groups' },
    { value: '500+', label: 'Challenges' },
    { value: '2K+', label: 'Developers' },
    { value: '10K+', label: 'Submissions' },
];

export default function LandingPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl">
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2C666E] to-[#10B981] text-white font-bold shadow-lg shadow-[#10B981]/20">
                            {'</>'}
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            CodeClash
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <Link href="/dashboard">
                                <GradientButton size="sm">Dashboard</GradientButton>
                            </Link>
                        ) : (
                            <SignInButton size="large" />
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <HeroSection
                subtitle="Where friends become rivals"
                title={
                    <>
                        <GradientText>Compete.</GradientText> Code.{' '}
                        <GradientText>Conquer.</GradientText>
                    </>
                }
                description="Challenge your friends to coding competitions. Submit your best work, vote on each other's projects, and climb the leaderboards."
                actions={
                    <>
                        {session ? (
                            <GradientButton href="/dashboard" size="lg">
                                <ThunderboltOutlined className="mr-2" />
                                Go to Dashboard
                            </GradientButton>
                        ) : (
                            <SignInButton size="large" />
                        )}
                        <GradientButton
                            variant="secondary"
                            size="lg"
                            href="https://github.com"
                        >
                            <GithubOutlined className="mr-2" />
                            View on GitHub
                        </GradientButton>
                    </>
                }
            />

            {/* Stats Section */}
            <section className="relative py-16 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2C666E] to-[#10B981] bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="mt-2 text-white/50 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="mb-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-4">
                            <StarOutlined className="text-[#F59E0B]" />
                            Features
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Everything You Need to <GradientText>Compete</GradientText>
                        </h2>
                        <p className="max-w-2xl mx-auto text-white/50">
                            CodeClash provides all the tools for friendly coding competitions
                            within your developer group.
                        </p>
                    </motion.div>

                    <BentoGrid>
                        {features.map((feature, index) => (
                            <BentoItem key={index} colSpan={feature.colSpan}>
                                <GlowCard
                                    glowColor={
                                        index === 0
                                            ? '#2C666E'
                                            : index === 1
                                                ? '#F59E0B'
                                                : index === 2
                                                    ? '#8B5CF6'
                                                    : '#10B981'
                                    }
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-white/50 flex-1">{feature.description}</p>
                                    </div>
                                </GlowCard>
                            </BentoItem>
                        ))}
                    </BentoGrid>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gradient-to-b from-transparent via-[#2C666E]/5 to-transparent">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="mb-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-4">
                            <CodeOutlined className="text-[#10B981]" />
                            How It Works
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Start Competing in <GradientText>3 Steps</GradientText>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                step: '01',
                                title: 'Create a Group',
                                description: 'Sign in with GitHub and create a private group for your team.',
                            },
                            {
                                step: '02',
                                title: 'Start a Challenge',
                                description: 'Set up a coding challenge with custom criteria and deadlines.',
                            },
                            {
                                step: '03',
                                title: 'Compete & Vote',
                                description: 'Submit your work, vote on others, and see who comes out on top.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="relative"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <div className="text-6xl font-bold text-white/5 mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-white/50">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2C666E]/20 via-[#18181B] to-[#10B981]/20 border border-white/10 p-12 md:p-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Glow effects */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#2C666E] rounded-full blur-3xl opacity-30" />
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#10B981] rounded-full blur-3xl opacity-30" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                Ready to Start <GradientText>Competing?</GradientText>
                            </h2>
                            <p className="max-w-xl mx-auto text-white/50 mb-8">
                                Sign in with GitHub and create your first group. Invite your
                                friends and start your first challenge today!
                            </p>
                            {!session && <SignInButton size="large" />}
                            {session && (
                                <GradientButton href="/dashboard" size="lg">
                                    <ThunderboltOutlined className="mr-2" />
                                    Go to Dashboard
                                </GradientButton>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2C666E] to-[#10B981] text-sm text-white font-bold">
                                {'</>'}
                            </div>
                            <span className="font-semibold text-white">CodeClash</span>
                        </div>
                        <p className="text-sm text-white/30">
                            © {new Date().getFullYear()} CodeClash. Built for developers, by
                            developers.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
