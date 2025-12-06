'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spin } from 'antd';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return <>{children}</>;
}
