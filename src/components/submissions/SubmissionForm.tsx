'use client';

import { useState } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface SubmissionFormProps {
    challengeId: string;
    groupId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const techSuggestions = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
    'TypeScript', 'JavaScript', 'Python', 'Node.js', 'Go',
    'Tailwind CSS', 'CSS', 'SCSS', 'PostgreSQL', 'MongoDB',
    'Firebase', 'Supabase', 'Prisma', 'GraphQL', 'REST API',
    'Docker', 'AWS', 'Vercel', 'Redis', 'tRPC',
];

export function SubmissionForm({ challengeId, groupId, onClose, onSuccess }: SubmissionFormProps) {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/challenges/${challengeId}/submissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectTitle: values.projectTitle,
                    description: values.description,
                    githubUrl: values.githubUrl,
                    liveUrl: values.liveUrl || '',
                    techStack: values.techStack || [],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || 'Failed to submit');
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
            title="Submit Your Project"
            onCancel={onClose}
            footer={null}
            width={600}
            className="submission-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="mt-4"
            >
                <Form.Item
                    name="projectTitle"
                    label="Project Title"
                    rules={[
                        { required: true, message: 'Enter a project title' },
                        { min: 3, message: 'Title must be at least 3 characters' },
                    ]}
                >
                    <Input placeholder="My Awesome Project" size="large" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { required: true, message: 'Enter a description' },
                        { min: 10, message: 'Description must be at least 10 characters' },
                    ]}
                >
                    <TextArea
                        placeholder="Describe what you built, key features, and any notes for reviewers..."
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    name="githubUrl"
                    label="GitHub Repository URL"
                    rules={[
                        { required: true, message: 'Enter your GitHub repo URL' },
                        {
                            pattern: /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/,
                            message: 'Must be a valid GitHub repo URL (https://github.com/user/repo)',
                        },
                    ]}
                >
                    <Input
                        placeholder="https://github.com/username/project"
                        prefix={<GithubOutlined />}
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="liveUrl"
                    label="Live Demo URL (Optional)"
                >
                    <Input
                        placeholder="https://your-project.vercel.app"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="techStack"
                    label="Tech Stack"
                    rules={[{ required: true, message: 'Add at least one technology' }]}
                >
                    <Select
                        mode="tags"
                        placeholder="Select or type technologies used"
                        options={techSuggestions.map((t) => ({ label: t, value: t }))}
                        size="large"
                    />
                </Form.Item>

                <Form.Item className="mb-0">
                    <div className="flex gap-3 justify-end">
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit Project
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}
