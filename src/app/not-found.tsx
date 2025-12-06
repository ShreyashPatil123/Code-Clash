'use client';

import Link from 'next/link';
import { Button, Result } from 'antd';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Result
                status="404"
                title={<span className="text-surface">404</span>}
                subTitle={<span className="text-surface/70">Page not found</span>}
                extra={
                    <Link href="/dashboard">
                        <Button type="primary">Back to Dashboard</Button>
                    </Link>
                }
            />
        </div>
    );
}
