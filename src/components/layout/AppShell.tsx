'use client';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface AppShellProps {
    children: React.ReactNode;
    showSidebar?: boolean;
    groups?: Array<{ id: string; name: string }>;
}

export function AppShell({ children, showSidebar = true, groups = [] }: AppShellProps) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {showSidebar && <Sidebar groups={groups} />}

            <main
                className={`pt-16 ${showSidebar ? 'pl-64' : ''}`}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
