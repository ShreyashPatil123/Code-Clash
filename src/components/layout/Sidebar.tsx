'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    AppstoreOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined,
    PlusOutlined,
} from '@ant-design/icons';

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: AppstoreOutlined,
    },
    {
        label: 'My Groups',
        href: '/dashboard',
        icon: TeamOutlined,
        section: true,
    },
    {
        label: 'Create Group',
        href: '/groups/create',
        icon: PlusOutlined,
    },
    {
        label: 'Join Group',
        href: '/groups/join',
        icon: TeamOutlined,
    },
    {
        label: 'Profile',
        href: '/profile',
        icon: UserOutlined,
    },
];

interface SidebarProps {
    groups?: Array<{ id: string; name: string }>;
}

export function Sidebar({ groups = [] }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-16 bottom-0 z-40 w-64 border-r border-border bg-background-card">
            <nav className="flex h-full flex-col p-4">
                {/* Main nav items */}
                <div className="space-y-1">
                    <Link
                        href="/dashboard"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            pathname === '/dashboard'
                                ? 'bg-primary/20 text-primary'
                                : 'text-surface/70 hover:bg-background-elevated hover:text-surface'
                        )}
                    >
                        <AppstoreOutlined />
                        Dashboard
                    </Link>
                </div>

                {/* Groups section */}
                <div className="mt-6">
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-surface/50">
                        My Groups
                    </h3>
                    <div className="space-y-1">
                        {groups.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-surface/50">
                                No groups yet
                            </p>
                        ) : (
                            groups.map((group) => (
                                <Link
                                    key={group.id}
                                    href={`/groups/${group.id}`}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        pathname.startsWith(`/groups/${group.id}`)
                                            ? 'bg-primary/20 text-primary'
                                            : 'text-surface/70 hover:bg-background-elevated hover:text-surface'
                                    )}
                                >
                                    <TeamOutlined />
                                    <span className="truncate">{group.name}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-1">
                    <Link
                        href="/groups/create"
                        className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-surface/70 transition-colors hover:border-primary hover:text-primary"
                    >
                        <PlusOutlined />
                        Create Group
                    </Link>
                    <Link
                        href="/groups/join"
                        className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-surface/70 transition-colors hover:border-primary hover:text-primary"
                    >
                        <TeamOutlined />
                        Join Group
                    </Link>
                </div>

                {/* Profile at bottom */}
                <div className="mt-auto pt-4 border-t border-border">
                    <Link
                        href="/profile"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            pathname === '/profile'
                                ? 'bg-primary/20 text-primary'
                                : 'text-surface/70 hover:bg-background-elevated hover:text-surface'
                        )}
                    >
                        <UserOutlined />
                        Profile
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
