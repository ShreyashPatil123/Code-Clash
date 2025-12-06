'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Form, Input, DatePicker, Button, Slider, message, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AppShell } from '@/components/layout';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface Weights {
    functionality: number;
    uiDesign: number;
    creativity: number;
    codeQuality: number;
}

export default function CreateChallengePage() {
    const router = useRouter();
    const params = useParams();
    const groupId = params.groupId as string;
    const [loading, setLoading] = useState(false);
    const [weights, setWeights] = useState<Weights>({
        functionality: 4,
        uiDesign: 3,
        creativity: 2,
        codeQuality: 1,
    });

    const weightsTotal =
        weights.functionality + weights.uiDesign + weights.creativity + weights.codeQuality;

    const handleWeightChange = (key: keyof Weights, value: number) => {
        setWeights((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (values: any) => {
        if (weightsTotal !== 10) {
            message.error('Weights must sum to 10');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/groups/${groupId}/challenges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: values.title,
                    description: values.description,
                    startDate: values.dates[0].toISOString(),
                    endDate: values.dates[1].toISOString(),
                    weights,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || 'Failed to create challenge');
            }

            message.success('Challenge created!');
            router.push(`/groups/${groupId}/challenges/${data.id}`);
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <motion.div
                className="mx-auto max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Create Challenge</h1>
                    <p className="mt-2 text-surface/70">
                        Set up a new coding challenge for your group.
                    </p>
                </div>

                <div className="glass-card p-6">
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="title"
                            label={<span className="text-surface">Challenge Title</span>}
                            rules={[
                                { required: true, message: 'Please enter a title' },
                                { min: 3, message: 'Title must be at least 3 characters' },
                            ]}
                        >
                            <Input
                                placeholder="e.g., Build a Weather App"
                                size="large"
                                className="bg-background-elevated border-border"
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={<span className="text-surface">Description</span>}
                            rules={[
                                { required: true, message: 'Please enter a description' },
                                { min: 10, message: 'Description must be at least 10 characters' },
                            ]}
                        >
                            <TextArea
                                placeholder="Describe the challenge requirements, rules, and what you're looking for..."
                                rows={4}
                                className="bg-background-elevated border-border"
                            />
                        </Form.Item>

                        <Form.Item
                            name="dates"
                            label={<span className="text-surface">Start & End Date</span>}
                            rules={[{ required: true, message: 'Please select dates' }]}
                        >
                            <DatePicker.RangePicker
                                size="large"
                                showTime
                                className="w-full bg-background-elevated border-border"
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                            />
                        </Form.Item>

                        {/* Scoring Weights */}
                        <Card
                            className="mb-6 bg-background-elevated border-border"
                            title={
                                <div className="flex items-center justify-between">
                                    <span className="text-surface">Scoring Weights</span>
                                    <span
                                        className={`font-mono ${weightsTotal === 10 ? 'text-green-500' : 'text-red-500'
                                            }`}
                                    >
                                        Total: {weightsTotal}/10
                                    </span>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                {[
                                    { key: 'functionality', label: 'Functionality', color: '#2C666E' },
                                    { key: 'uiDesign', label: 'UI / Design', color: '#3D8A94' },
                                    { key: 'creativity', label: 'Creativity', color: '#FFD700' },
                                    { key: 'codeQuality', label: 'Code Quality', color: '#CD7F32' },
                                ].map(({ key, label, color }) => (
                                    <div key={key}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-surface/70">{label}</span>
                                            <span className="font-mono text-primary">
                                                {weights[key as keyof Weights]}
                                            </span>
                                        </div>
                                        <Slider
                                            min={0}
                                            max={10}
                                            value={weights[key as keyof Weights]}
                                            onChange={(v) => handleWeightChange(key as keyof Weights, v)}
                                            trackStyle={{ backgroundColor: color }}
                                            handleStyle={{ borderColor: color }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                icon={<PlusOutlined />}
                                disabled={weightsTotal !== 10}
                                block
                            >
                                Create Challenge
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </motion.div>
        </AppShell>
    );
}
