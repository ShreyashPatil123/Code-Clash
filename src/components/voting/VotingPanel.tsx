'use client';

import { useState } from 'react';
import { Modal, Slider, Button, Avatar, message } from 'antd';
import { GithubOutlined, GlobalOutlined } from '@ant-design/icons';

interface VotingPanelProps {
    submissionId: string;
    submission: {
        projectTitle: string;
        description: string;
        githubUrl: string;
        liveUrl: string | null;
        user: {
            name: string | null;
            avatarUrl: string | null;
            githubUsername: string;
        };
    };
    weights: {
        functionality: number;
        uiDesign: number;
        creativity: number;
        codeQuality: number;
    };
    onClose: () => void;
    onSuccess: () => void;
}

const categoryDescriptions = {
    functionality: 'Does it work as expected? Are all features functional?',
    uiDesign: 'Is it visually appealing? Is the UI clean and intuitive?',
    creativity: 'Is the approach original? Does it show creative problem-solving?',
    codeQuality: 'Is the code clean, organized, and well-structured?',
};

export function VotingPanel({
    submissionId,
    submission,
    weights,
    onClose,
    onSuccess,
}: VotingPanelProps) {
    const [loading, setLoading] = useState(false);
    const [scores, setScores] = useState({
        functionality: 0,
        uiDesign: 0,
        creativity: 0,
        codeQuality: 0,
    });

    const totalScore =
        scores.functionality + scores.uiDesign + scores.creativity + scores.codeQuality;

    const handleScoreChange = (category: keyof typeof scores, value: number) => {
        setScores((prev) => ({ ...prev, [category]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/submissions/${submissionId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scores),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || 'Failed to submit vote');
            }

            onSuccess();
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open
            title="Cast Your Vote"
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {/* Submission Info */}
            <div className="mb-6 p-4 rounded-lg bg-background-elevated">
                <div className="flex items-center gap-3 mb-2">
                    <Avatar src={submission.user.avatarUrl} size={40}>
                        {submission.user.name?.[0]}
                    </Avatar>
                    <div>
                        <p className="font-semibold text-surface">{submission.projectTitle}</p>
                        <p className="text-sm text-surface/70">by {submission.user.name}</p>
                    </div>
                </div>
                <p className="text-sm text-surface/70 mb-3">{submission.description}</p>
                <div className="flex gap-3">
                    <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:text-primary-light"
                    >
                        <GithubOutlined /> View Code
                    </a>
                    {submission.liveUrl && (
                        <a
                            href={submission.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-primary hover:text-primary-light"
                        >
                            <GlobalOutlined /> Live Demo
                        </a>
                    )}
                </div>
            </div>

            {/* Scoring Sliders */}
            <div className="space-y-6">
                {(
                    [
                        { key: 'functionality', label: 'Functionality', color: '#2C666E' },
                        { key: 'uiDesign', label: 'UI / Design', color: '#3D8A94' },
                        { key: 'creativity', label: 'Creativity', color: '#FFD700' },
                        { key: 'codeQuality', label: 'Code Quality', color: '#CD7F32' },
                    ] as const
                ).map(({ key, label, color }) => (
                    <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                            <div>
                                <span className="font-medium text-surface">{label}</span>
                                <span className="text-surface/50 text-sm ml-2">
                                    (max: {weights[key]})
                                </span>
                            </div>
                            <span className="font-mono text-lg text-primary">
                                {scores[key]}
                            </span>
                        </div>
                        <p className="text-xs text-surface/50 mb-2">
                            {categoryDescriptions[key]}
                        </p>
                        <Slider
                            min={0}
                            max={weights[key]}
                            value={scores[key]}
                            onChange={(v) => handleScoreChange(key, v)}
                            trackStyle={{ backgroundColor: color }}
                            handleStyle={{ borderColor: color }}
                        />
                    </div>
                ))}
            </div>

            {/* Total Score */}
            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-surface">Total Score</span>
                    <span className="text-2xl font-bold text-primary">
                        {totalScore} / 10
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3 justify-end">
                <Button onClick={onClose}>Cancel</Button>
                <Button type="primary" onClick={handleSubmit} loading={loading}>
                    Submit Vote
                </Button>
            </div>
        </Modal>
    );
}
