'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tabs, Card, Button, Progress, Tag, Avatar, Empty, message } from 'antd';
import {
    ArrowLeftOutlined,
    ClockCircleOutlined,
    GithubOutlined,
    GlobalOutlined,
    PlusOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { AppShell } from '@/components/layout';
import { CountdownTimer, ChallengeStatusBadge } from '@/components/challenges';
import { SubmissionCard } from '@/components/submissions/SubmissionCard';
import { SubmissionForm } from '@/components/submissions/SubmissionForm';
import { VotingPanel } from '@/components/voting/VotingPanel';
import { ChallengeStatus, SubmissionStatus } from '@/types';

interface ChallengeDetailClientProps {
    challenge: {
        id: string;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        status: ChallengeStatus;
        weights: {
            functionality: number;
            uiDesign: number;
            creativity: number;
            codeQuality: number;
        };
        createdBy: { id: string; name: string | null; avatarUrl: string | null };
        group: { id: string; name: string };
        submissions: Array<{
            id: string;
            projectTitle: string;
            description: string;
            githubUrl: string;
            liveUrl: string | null;
            techStack: string[];
            status: SubmissionStatus;
            finalScore: number | null;
            user: {
                id: string;
                name: string | null;
                avatarUrl: string | null;
                githubUsername: string;
            };
            createdAt: string;
            voteCount: number;
            hasVoted: boolean;
        }>;
        mySubmission: {
            id: string;
            projectTitle: string;
            status: SubmissionStatus;
        } | null;
        votingProgress: {
            totalVotesNeeded: number;
            votesCompleted: number;
            myVotesCompleted: number;
            myVotesNeeded: number;
        };
    };
    sidebarGroups: Array<{ id: string; name: string }>;
    currentUserId: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function ChallengeDetailClient({
    challenge,
    sidebarGroups,
    currentUserId,
}: ChallengeDetailClientProps) {
    const [activeTab, setActiveTab] = useState('submissions');
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [votingSubmission, setVotingSubmission] = useState<string | null>(null);

    const canSubmit = challenge.status === 'ACTIVE' && !challenge.mySubmission;
    const canVote = challenge.status === 'VOTING';

    const votingPercent = challenge.votingProgress.totalVotesNeeded > 0
        ? Math.round((challenge.votingProgress.votesCompleted / challenge.votingProgress.totalVotesNeeded) * 100)
        : 0;

    const myVotingPercent = challenge.votingProgress.myVotesNeeded > 0
        ? Math.round((challenge.votingProgress.myVotesCompleted / challenge.votingProgress.myVotesNeeded) * 100)
        : 100;

    const tabItems = [
        {
            key: 'submissions',
            label: `Submissions (${challenge.submissions.length})`,
            children: (
                <div className="space-y-4">
                    {challenge.submissions.length === 0 ? (
                        <Card className="bg-background-card border-border text-center py-8">
                            <Empty
                                description={
                                    <span className="text-surface/70">No submissions yet</span>
                                }
                            />
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {challenge.submissions.map((submission) => (
                                <SubmissionCard
                                    key={submission.id}
                                    submission={submission}
                                    showScore={challenge.status === 'COMPLETED'}
                                    showVoteButton={canVote && submission.user.id !== currentUserId && !submission.hasVoted}
                                    onVote={() => setVotingSubmission(submission.id)}
                                    isOwn={submission.user.id === currentUserId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'voting',
            label: 'Voting Progress',
            children: (
                <Card className="bg-background-card border-border">
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-surface/70">Overall Progress</span>
                                <span className="font-mono text-primary">{votingPercent}%</span>
                            </div>
                            <Progress
                                percent={votingPercent}
                                showInfo={false}
                                strokeColor="#2C666E"
                                trailColor="#2A2A2D"
                            />
                            <p className="mt-1 text-sm text-surface/50">
                                {challenge.votingProgress.votesCompleted} / {challenge.votingProgress.totalVotesNeeded} votes cast
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-surface/70">Your Votes</span>
                                <span className="font-mono text-primary">{myVotingPercent}%</span>
                            </div>
                            <Progress
                                percent={myVotingPercent}
                                showInfo={false}
                                strokeColor={myVotingPercent === 100 ? '#22c55e' : '#FFD700'}
                                trailColor="#2A2A2D"
                            />
                            <p className="mt-1 text-sm text-surface/50">
                                {challenge.votingProgress.myVotesCompleted} / {challenge.votingProgress.myVotesNeeded} votes submitted
                            </p>
                        </div>

                        {myVotingPercent === 100 && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                                <CheckCircleOutlined className="text-green-500" />
                                <span className="text-green-500">You've voted on all submissions!</span>
                            </div>
                        )}
                    </div>
                </Card>
            ),
        },
        {
            key: 'leaderboard',
            label: 'Leaderboard',
            children: (
                <Card className="bg-background-card border-border">
                    {challenge.status === 'COMPLETED' ? (
                        <div className="space-y-3">
                            {challenge.submissions
                                .filter((s) => s.finalScore !== null)
                                .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))
                                .map((submission, index) => (
                                    <div
                                        key={submission.id}
                                        className={`flex items-center justify-between p-4 rounded-lg ${index === 0
                                                ? 'bg-accent-gold/10 border border-accent-gold/30'
                                                : index === 1
                                                    ? 'bg-accent-silver/10 border border-accent-silver/30'
                                                    : index === 2
                                                        ? 'bg-accent-bronze/10 border border-accent-bronze/30'
                                                        : 'bg-background-elevated'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-bold min-w-[2rem]">
                                                {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                            </span>
                                            <Avatar src={submission.user.avatarUrl} size={40}>
                                                {submission.user.name?.[0]}
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-surface">{submission.projectTitle}</p>
                                                <p className="text-sm text-surface/70">by {submission.user.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">
                                                {submission.finalScore?.toFixed(1)}
                                            </p>
                                            <p className="text-xs text-surface/50">/ 10</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <Empty
                            description={
                                <span className="text-surface/70">
                                    Leaderboard will be available after voting ends
                                </span>
                            }
                        />
                    )}
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
                {/* Back link */}
                <motion.div variants={itemVariants}>
                    <Link
                        href={`/groups/${challenge.group.id}`}
                        className="inline-flex items-center gap-2 text-surface/70 hover:text-primary transition-colors"
                    >
                        <ArrowLeftOutlined />
                        <span>{challenge.group.name}</span>
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold">{challenge.title}</h1>
                            <ChallengeStatusBadge status={challenge.status} />
                        </div>
                        <p className="text-surface/70 max-w-2xl">{challenge.description}</p>
                    </div>

                    {canSubmit && (
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={() => setShowSubmitForm(true)}
                        >
                            Submit Project
                        </Button>
                    )}
                </motion.div>

                {/* Countdown & Weights */}
                <motion.div
                    variants={itemVariants}
                    className="grid gap-4 md:grid-cols-2"
                >
                    {/* Countdown */}
                    <Card className="bg-background-card border-border">
                        <div className="flex items-center gap-4">
                            <ClockCircleOutlined className="text-2xl text-primary" />
                            <div>
                                <p className="text-sm text-surface/70">
                                    {challenge.status === 'ACTIVE' ? 'Submissions end in' :
                                        challenge.status === 'VOTING' ? 'Voting ends in' : 'Ended'}
                                </p>
                                <CountdownTimer targetDate={challenge.endDate} size="lg" />
                            </div>
                        </div>
                    </Card>

                    {/* Weights */}
                    <Card className="bg-background-card border-border">
                        <p className="text-sm text-surface/70 mb-3">Scoring Weights</p>
                        <div className="flex gap-3">
                            {Object.entries(challenge.weights).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex-1 text-center rounded-lg bg-background-elevated p-2"
                                >
                                    <p className="text-xs text-surface/50 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p className="text-xl font-bold text-primary">{value}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* My Submission Status */}
                {challenge.mySubmission && (
                    <motion.div variants={itemVariants}>
                        <Card className="bg-primary/10 border-primary/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircleOutlined className="text-2xl text-primary" />
                                    <div>
                                        <p className="font-semibold text-surface">
                                            Your submission: {challenge.mySubmission.projectTitle}
                                        </p>
                                        <p className="text-sm text-surface/70">
                                            Status: {challenge.mySubmission.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Tabs */}
                <motion.div variants={itemVariants}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                    />
                </motion.div>
            </motion.div>

            {/* Submit Form Modal */}
            {showSubmitForm && (
                <SubmissionForm
                    challengeId={challenge.id}
                    groupId={challenge.group.id}
                    onClose={() => setShowSubmitForm(false)}
                    onSuccess={() => {
                        setShowSubmitForm(false);
                        message.success('Submission created!');
                        window.location.reload();
                    }}
                />
            )}

            {/* Voting Panel Modal */}
            {votingSubmission && (
                <VotingPanel
                    submissionId={votingSubmission}
                    submission={challenge.submissions.find((s) => s.id === votingSubmission)!}
                    weights={challenge.weights}
                    onClose={() => setVotingSubmission(null)}
                    onSuccess={() => {
                        setVotingSubmission(null);
                        message.success('Vote submitted!');
                        window.location.reload();
                    }}
                />
            )}
        </AppShell>
    );
}
