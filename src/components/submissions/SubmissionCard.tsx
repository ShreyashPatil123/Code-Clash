'use client';

import Link from 'next/link';
import { Card, Avatar, Tag, Button } from 'antd';
import { motion } from 'framer-motion';
import { GithubOutlined, GlobalOutlined, CheckOutlined } from '@ant-design/icons';
import { SubmissionStatus } from '@/types';

interface SubmissionCardProps {
    submission: {
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
        hasVoted?: boolean;
    };
    showScore?: boolean;
    showVoteButton?: boolean;
    onVote?: () => void;
    isOwn?: boolean;
}

export function SubmissionCard({
    submission,
    showScore = false,
    showVoteButton = false,
    onVote,
    isOwn = false,
}: SubmissionCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <Card
                className={`h-full bg-background-card border-border transition-colors ${isOwn ? 'border-primary/50' : 'hover:border-primary/30'
                    }`}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar src={submission.user.avatarUrl} size={40}>
                            {submission.user.name?.[0] || submission.user.githubUsername[0]}
                        </Avatar>
                        <div>
                            <p className="font-semibold text-surface">{submission.projectTitle}</p>
                            <p className="text-sm text-surface/70">
                                by {submission.user.name || submission.user.githubUsername}
                                {isOwn && <Tag color="blue" className="ml-2">You</Tag>}
                            </p>
                        </div>
                    </div>

                    {showScore && submission.finalScore !== null && (
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                                {submission.finalScore.toFixed(1)}
                            </p>
                            <p className="text-xs text-surface/50">/ 10</p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm text-surface/70 line-clamp-2 mb-3">
                    {submission.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {submission.techStack.slice(0, 5).map((tech) => (
                        <Tag key={tech} className="bg-background-elevated border-border text-surface/70">
                            {tech}
                        </Tag>
                    ))}
                    {submission.techStack.length > 5 && (
                        <Tag className="bg-background-elevated border-border text-surface/50">
                            +{submission.techStack.length - 5}
                        </Tag>
                    )}
                </div>

                {/* Links & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex gap-2">
                        <a
                            href={submission.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-surface/70 hover:text-primary transition-colors"
                        >
                            <GithubOutlined />
                            <span>Code</span>
                        </a>
                        {submission.liveUrl && (
                            <a
                                href={submission.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-surface/70 hover:text-primary transition-colors"
                            >
                                <GlobalOutlined />
                                <span>Demo</span>
                            </a>
                        )}
                    </div>

                    {showVoteButton && onVote && (
                        <Button type="primary" size="small" onClick={onVote}>
                            Vote
                        </Button>
                    )}

                    {submission.hasVoted && (
                        <span className="flex items-center gap-1 text-sm text-green-500">
                            <CheckOutlined />
                            Voted
                        </span>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
