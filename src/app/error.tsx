'use client';

import { Button, Result } from 'antd';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Result
                status="error"
                title={<span className="text-surface">Something went wrong</span>}
                subTitle={
                    <span className="text-surface/70">
                        {error.message || 'An unexpected error occurred'}
                    </span>
                }
                extra={
                    <Button type="primary" onClick={reset}>
                        Try Again
                    </Button>
                }
            />
        </div>
    );
}
