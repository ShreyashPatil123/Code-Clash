'use client';

import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface LeaveGroupButtonProps {
    groupId: string;
    groupName: string;
    isAdmin?: boolean;
    memberCount?: number;
}

export function LeaveGroupButton({
    groupId,
    groupName,
    isAdmin = false,
    memberCount = 1,
}: LeaveGroupButtonProps) {
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    const isLastMember = memberCount === 1;

    const handleLeave = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/groups/${groupId}/members/me`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to leave group');
            }

            message.success(data.message || 'Successfully left the group');
            setModalOpen(false);

            // Redirect to dashboard
            router.push('/dashboard');
            router.refresh();
        } catch (error: any) {
            message.error(error.message || 'Failed to leave group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                danger
                icon={<LogoutOutlined />}
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto"
            >
                Leave Group
            </Button>

            <Modal
                title={
                    <div className="flex items-center gap-2 text-error-500">
                        <ExclamationCircleOutlined />
                        <span>Leave {groupName}?</span>
                    </div>
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="leave"
                        danger
                        type="primary"
                        loading={loading}
                        onClick={handleLeave}
                    >
                        Leave Group
                    </Button>,
                ]}
            >
                <div className="space-y-4 py-4">
                    {isLastMember ? (
                        <div className="p-4 rounded-lg bg-warning-500/10 border border-warning-500/30">
                            <p className="text-warning-500 font-medium">
                                ⚠️ You are the last member of this group.
                            </p>
                            <p className="text-text-secondary text-sm mt-1">
                                Leaving will permanently delete the group and all its challenges.
                            </p>
                        </div>
                    ) : isAdmin ? (
                        <div className="p-4 rounded-lg bg-info-500/10 border border-info-500/30">
                            <p className="text-info-500 font-medium">
                                ℹ️ You are the admin of this group.
                            </p>
                            <p className="text-text-secondary text-sm mt-1">
                                Admin privileges will be transferred to the next oldest member.
                            </p>
                        </div>
                    ) : (
                        <p className="text-text-secondary">
                            Are you sure you want to leave <strong>{groupName}</strong>?
                            You'll need a new invite code to rejoin.
                        </p>
                    )}
                </div>
            </Modal>
        </>
    );
}
