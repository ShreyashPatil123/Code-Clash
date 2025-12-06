'use client';

import { signOut } from 'next-auth/react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

interface SignOutButtonProps {
    size?: 'small' | 'middle' | 'large';
}

export function SignOutButton({ size = 'middle' }: SignOutButtonProps) {
    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <Button
            type="text"
            size={size}
            icon={<LogoutOutlined />}
            onClick={handleSignOut}
            className="text-surface/70 hover:text-surface"
        >
            Sign Out
        </Button>
    );
}
