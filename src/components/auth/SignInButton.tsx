'use client';

import { signIn } from 'next-auth/react';
import { Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

interface SignInButtonProps {
    size?: 'small' | 'middle' | 'large';
    fullWidth?: boolean;
}

export function SignInButton({ size = 'large', fullWidth = false }: SignInButtonProps) {
    const handleSignIn = () => {
        signIn('github', { callbackUrl: '/dashboard' });
    };

    return (
        <Button
            type="primary"
            size={size}
            icon={<GithubOutlined />}
            onClick={handleSignIn}
            className={`h-12 ${fullWidth ? 'w-full' : 'px-8'} text-lg`}
        >
            Sign in with GitHub
        </Button>
    );
}
