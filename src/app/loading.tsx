'use client';

import { Spin } from 'antd';

export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center">
                <Spin size="large" />
                <p className="mt-4 text-surface/70">Loading...</p>
            </div>
        </div>
    );
}
