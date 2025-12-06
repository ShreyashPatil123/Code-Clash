'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Form, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AppShell } from '@/components/layout';

export default function CreateGroupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { name: string }) => {
        setLoading(true);
        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || 'Failed to create group');
            }

            message.success('Group created successfully!');
            router.push(`/groups/${data.id}`);
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
                    <h1 className="text-3xl font-bold">Create a Group</h1>
                    <p className="mt-2 text-surface/70">
                        Start a new coding arena for you and your friends.
                    </p>
                </div>

                <div className="glass-card p-6">
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="name"
                            label={<span className="text-surface">Group Name</span>}
                            rules={[
                                { required: true, message: 'Please enter a group name' },
                                { min: 3, message: 'Name must be at least 3 characters' },
                                { max: 50, message: 'Name must be less than 50 characters' },
                            ]}
                        >
                            <Input
                                placeholder="e.g., Vibe Coding Squad"
                                size="large"
                                className="bg-background-elevated border-border"
                            />
                        </Form.Item>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                icon={<PlusOutlined />}
                                block
                            >
                                Create Group
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </motion.div>
        </AppShell>
    );
}
