'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Form, Input, Button, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { AppShell } from '@/components/layout';

export default function JoinGroupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { inviteCode: string }) => {
        setLoading(true);
        try {
            const res = await fetch('/api/groups/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviteCode: values.inviteCode.toUpperCase() }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || 'Failed to join group');
            }

            message.success(`Joined ${data.group.name}!`);
            router.push(`/groups/${data.group.id}`);
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <motion.div
                className="mx-auto max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Join a Group</h1>
                    <p className="mt-2 text-surface/70">
                        Enter an invite code to join an existing group.
                    </p>
                </div>

                <div className="glass-card p-6">
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="inviteCode"
                            label={<span className="text-surface">Invite Code</span>}
                            rules={[
                                { required: true, message: 'Please enter an invite code' },
                                { len: 8, message: 'Invite code must be 8 characters' },
                            ]}
                            normalize={(value) => value?.toUpperCase()}
                        >
                            <Input
                                placeholder="e.g., ABC12XYZ"
                                size="large"
                                maxLength={8}
                                className="bg-background-elevated border-border font-mono text-center text-lg tracking-widest"
                                style={{ textTransform: 'uppercase' }}
                            />
                        </Form.Item>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                icon={<TeamOutlined />}
                                block
                            >
                                Join Group
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </motion.div>
        </AppShell>
    );
}
